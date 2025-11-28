import express from "express";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import Expert from "../models/expert.js";
import { protect } from "../middlewares/auth.js";
import axios from "axios";

const router = express.Router();

// Helper function to check if expert is real (has user account)
const isRealExpert = async (expertId) => {
  try {
    const user = await User.findById(expertId);
    return !!user && user.role === "expert";
  } catch (error) {
    return false;
  }
};

// Helper function for translation using Google Translate API (free tier)
const translateText = async (text, targetLanguage = "en", sourceLanguage = "auto") => {
  try {
    // Using Google Translate API (free tier allows 500k chars/month)
    // You can also use other free APIs like LibreTranslate, MyMemory, etc.
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      // Fallback: Return original text if no API key
      console.warn("Google Translate API key not set, returning original text");
      return text;
    }

    // Don't translate if source and target are the same
    if (sourceLanguage !== "auto" && sourceLanguage === targetLanguage) {
      return text;
    }

    const requestBody = {
      q: text,
      target: targetLanguage,
    };

    // For transliterated text (like "namaste" in English script), 
    // it's better to let Google Translate auto-detect the source language
    // This ensures better accuracy for transliterated words
    // Only specify source if we're confident about it and it's not "auto"
    if (sourceLanguage && sourceLanguage !== "auto" && sourceLanguage !== "und") {
      requestBody.source = sourceLanguage;
    }
    // If sourceLanguage is "auto" or "und" (undetected), we omit it to let Google auto-detect

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && response.data.data && response.data.data.translations && response.data.data.translations.length > 0) {
      return response.data.data.translations[0].translatedText;
    }
    
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    // Return original text on error
    return text;
  }
};

// Helper function to detect language (handles transliterated text like "namaste" in English script)
const detectLanguage = async (text) => {
  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.warn("Google Translate API key not set, defaulting to 'en'");
      return "en";
    }

    // Google Translate API can detect language even for transliterated text
    // e.g., "namaste" (Hindi in English script) will be detected as "hi"
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`,
      {
        q: text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && response.data.data && response.data.data.detections && response.data.data.detections.length > 0) {
      const detectedLanguage = response.data.data.detections[0][0].language;
      const confidence = response.data.data.detections[0][0].confidence || 0;
      
      console.log(`[Language Detection] Text: "${text.substring(0, 30)}..." | Detected: ${detectedLanguage} | Confidence: ${confidence}`);
      
      // Return detected language (Google Translate handles transliterated text well)
      return detectedLanguage;
    }
    
    console.warn("[Language Detection] No detection result, defaulting to 'en'");
    return "en";
  } catch (error) {
    console.error("[Language Detection] Error:", error.response?.data || error.message);
    // Default to "en" on error, but log for debugging
    return "en";
  }
};

/**
 * Create or get conversation between user and expert
 * POST /api/chat/conversations
 */
router.post("/conversations", protect, async (req, res) => {
  try {
    const { expertId } = req.body;
    const userId = req.user.id;

    if (!expertId) {
      return res.status(400).json({ message: "Expert ID is required" });
    }

    // Check if expert is real (not dummy data)
    const isReal = await isRealExpert(expertId);
    if (!isReal) {
      return res.status(403).json({ 
        message: "Cannot book a call with this expert. Only real experts are available for calls." 
      });
    }

    // Verify expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      "participants.userId": { $all: [userId, expertId] },
    });

    if (!conversation) {
      // Create new conversation
      // Set initiatorId so the creator can see it in their list immediately
      // The other participant will only see it after the first message is sent
      conversation = new Conversation({
        participants: [
          { userId, role: "user" },
          { userId: expertId, role: "expert" },
        ],
        initiatorId: userId, // Track who initiated the conversation
        lastMessage: "", // Empty - conversation won't show in other user's list yet
      });
      await conversation.save();
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ message: "Failed to create conversation" });
  }
});

/**
 * Get all conversations for logged-in user
 * GET /api/chat/conversations
 * Only returns conversations that have at least one message (real chats)
 * IMPORTANT: This route must come BEFORE /conversations/:conversationId to avoid route conflicts
 */
router.get("/conversations", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all conversations where user is a participant
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1 })
      .lean();

    // Filter conversations:
    // 1. Show if it has messages (both participants can see it)
    // 2. Show if user is the initiator and no messages yet (only initiator sees it)
    // This ensures:
    // - Initiator sees conversation immediately after "Book a Call"
    // - Other participant only sees it after first message is sent
    const visibleConversations = conversations.filter(conv => {
      const hasMessages = conv.lastMessage && conv.lastMessage.trim() !== "";
      const isInitiator = conv.initiatorId && conv.initiatorId.toString() === userId;
      return hasMessages || isInitiator;
    });

    // Enrich with expert/user details
    const enrichedConversations = await Promise.all(
      visibleConversations.map(async (conv) => {
        const currentParticipant = conv.participants.find(
          (p) => p.userId.toString() === userId
        );
        const otherParticipant = conv.participants.find(
          (p) => p.userId.toString() !== userId
        );

        if (!otherParticipant) return null;

        let otherUserDetails = {};
        if (otherParticipant.role === "expert") {
          const expert = await Expert.findById(otherParticipant.userId).lean();
          if (expert) {
            otherUserDetails = {
              id: expert._id,
              name: expert.name,
              img: expert.img,
              industry: expert.industry,
            };
          }
        } else {
          // For regular users, fetch username and check if they have an expert profile with avatar
          const user = await User.findById(otherParticipant.userId).select("username role").lean();
          if (user) {
            otherUserDetails = {
              id: user._id,
              name: user.username,
              img: "", // Regular users don't have img in User model
              industry: "",
            };
            
            // Check if this user also has an expert profile (some users might be both)
            const expertProfile = await Expert.findById(otherParticipant.userId).lean();
            if (expertProfile && expertProfile.img) {
              otherUserDetails.img = expertProfile.img;
              otherUserDetails.industry = expertProfile.industry || "";
            }
          }
        }

        return {
          _id: conv._id,
          id: conv._id,
          otherParticipant: otherUserDetails,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          createdAt: conv.createdAt,
          myPreferredLanguage: currentParticipant?.preferredLanguage || "en",
          otherPreferredLanguage: otherParticipant?.preferredLanguage || "en",
        };
      })
    );

    const filtered = enrichedConversations.filter((c) => c !== null);

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

/**
 * Get a single conversation by ID
 * GET /api/chat/conversations/:conversationId
 * IMPORTANT: This route must come AFTER /conversations to avoid route conflicts
 */
router.get("/conversations/:conversationId", protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.userId.toString() === userId
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized to view this conversation" });
    }

    const currentParticipant = conversation.participants.find(
      (p) => p.userId.toString() === userId
    );
    const otherParticipant = conversation.participants.find(
      (p) => p.userId.toString() !== userId
    );

    if (!otherParticipant) {
      return res.status(404).json({ message: "Other participant not found" });
    }

    let otherUserDetails = {};
    if (otherParticipant.role === "expert") {
      const expert = await Expert.findById(otherParticipant.userId).lean();
      if (expert) {
        otherUserDetails = {
          id: expert._id,
          name: expert.name,
          img: expert.img,
          industry: expert.industry,
        };
      }
    } else {
      const user = await User.findById(otherParticipant.userId).select("username role").lean();
      if (user) {
        otherUserDetails = {
          id: user._id,
          name: user.username,
          img: "",
          industry: "",
        };
        const expertProfile = await Expert.findById(otherParticipant.userId).lean();
        if (expertProfile && expertProfile.img) {
          otherUserDetails.img = expertProfile.img;
          otherUserDetails.industry = expertProfile.industry || "";
        }
      }
    }

    return res.status(200).json({
      _id: conversation._id,
      id: conversation._id,
      otherParticipant: otherUserDetails,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
      createdAt: conversation.createdAt,
      myPreferredLanguage: currentParticipant?.preferredLanguage || "en",
      otherPreferredLanguage: otherParticipant?.preferredLanguage || "en",
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ message: "Failed to fetch conversation" });
  }
});

/**
 * Get messages for a conversation
 * GET /api/chat/conversations/:conversationId/messages
 */
router.get("/conversations/:conversationId/messages", protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.userId.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized to view this conversation" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/**
 * Update user's language preference in conversation
 * PUT /api/chat/conversations/:conversationId/language
 */
router.put("/conversations/:conversationId/language", protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { preferredLanguage } = req.body;
    const userId = req.user.id;

    if (!preferredLanguage) {
      return res.status(400).json({ message: "Preferred language is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const participant = conversation.participants.find(
      (p) => p.userId.toString() === userId
    );

    if (!participant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    participant.preferredLanguage = preferredLanguage;
    await conversation.save();

    return res.status(200).json({ message: "Language preference updated" });
  } catch (error) {
    console.error("Error updating language preference:", error);
    return res.status(500).json({ message: "Failed to update language preference" });
  }
});

/**
 * Send a message
 * POST /api/chat/conversations/:conversationId/messages
 */
router.post("/conversations/:conversationId/messages", protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const participant = conversation.participants.find(
      (p) => p.userId.toString() === userId
    );

    if (!participant) {
      return res.status(403).json({ message: "Not authorized to send messages in this conversation" });
    }

    // Get the other participant (receiver)
    const otherParticipant = conversation.participants.find(
      (p) => p.userId.toString() !== userId
    );

    // Detect original language
    const originalLanguage = await detectLanguage(content);

    // Create message
    let message = new Message({
      conversationId,
      senderId: userId,
      senderRole: userRole,
      content: content.trim(),
      originalLanguage,
      isTranslated: false,
    });

    // Always translate to receiver's preferred language if set
    // Reload conversation to get latest language preferences (in case it was just updated)
    // This ensures first message is translated even if preference was set just before sending
    const freshConversation = await Conversation.findById(conversationId);
    const freshParticipant = freshConversation.participants.find(
      (p) => p.userId.toString() === userId
    );
    const freshOtherParticipant = freshConversation.participants.find(
      (p) => p.userId.toString() !== userId
    );
    
    const receiverLanguage = freshOtherParticipant?.preferredLanguage;
    const senderLanguage = freshParticipant?.preferredLanguage || originalLanguage;
    
    // Translate if receiver has a language preference set (including "en" if message is not in English)
    // This allows translation TO English from other languages
    if (receiverLanguage && receiverLanguage.trim() !== "") {
      
      // Always attempt translation if receiver has a language preference
      // Special handling for transliterated text (e.g., "aap kaise ho" in English script is Hindi):
      // 1. If detected as English but sender's preferred language is different, use sender's language as hint
      // 2. If detected language matches receiver's language, no translation needed
      // 3. Otherwise, translate using auto-detection for better transliteration handling
      
      let shouldTranslate = false;
      let sourceLanguageForTranslation = originalLanguage;
      
      // Case 1: Detected language is different from receiver's language - translate
      if (receiverLanguage !== originalLanguage) {
        shouldTranslate = true;
        
        // Special case: If detected as English but receiver wants a different language,
        // the text might be transliterated (e.g., "aap kaise ho" detected as "en" but is Hindi)
        // Always use "auto" to let Google Translate re-detect and handle transliteration
        if (originalLanguage === "en" && receiverLanguage !== "en") {
          console.log(`[Translation] Text detected as English but receiver prefers ${receiverLanguage}. Using auto-detection for possible transliterated text.`);
          sourceLanguageForTranslation = "auto"; // Let Google Translate auto-detect for transliterated text
        }
        // Special case: If receiver wants English but message is in another language - translate to English
        else if (receiverLanguage === "en" && originalLanguage !== "en") {
          console.log(`[Translation] Message is in ${originalLanguage}, translating to English for receiver`);
          shouldTranslate = true;
          sourceLanguageForTranslation = originalLanguage; // Use detected language as source
        }
        // If sender has a preferred language that's different, use it as a hint
        else if (senderLanguage && senderLanguage !== "en" && senderLanguage !== receiverLanguage && senderLanguage !== originalLanguage) {
          console.log(`[Translation] Sender prefers ${senderLanguage}, using it as source language hint`);
          sourceLanguageForTranslation = senderLanguage;
        }
      }
      // Case 2: Detected as same as receiver, but sender has different preference
      // This might be transliterated text, attempt translation anyway (unless both are English)
      else if (senderLanguage && senderLanguage !== receiverLanguage && senderLanguage !== "en" && receiverLanguage !== "en") {
        console.log(`[Translation] Detected as ${originalLanguage} but sender prefers ${senderLanguage}, attempting translation`);
        shouldTranslate = true;
        sourceLanguageForTranslation = senderLanguage; // Try using sender's preferred language
      }
      // Case 3: Detected as English but receiver wants non-English - always attempt translation
      // This handles transliterated text that was mis-detected as English
      else if (originalLanguage === "en" && receiverLanguage !== "en") {
        console.log(`[Translation] Text detected as English but receiver prefers ${receiverLanguage}. Attempting translation for possible transliterated text.`);
        shouldTranslate = true;
        sourceLanguageForTranslation = "auto"; // Use auto-detection for transliterated text
      }
      // Case 4: Message is not in English but receiver wants English - translate to English
      else if (originalLanguage !== "en" && receiverLanguage === "en") {
        console.log(`[Translation] Message is in ${originalLanguage}, translating to English for receiver`);
        shouldTranslate = true;
        sourceLanguageForTranslation = originalLanguage;
      }
      
      if (shouldTranslate) {
        try {
          console.log(`[Translation] Detected language: ${originalLanguage}`);
          console.log(`[Translation] Sender preferred language: ${senderLanguage || 'not set'}`);
          console.log(`[Translation] Translating from ${sourceLanguageForTranslation} to ${receiverLanguage}`);
          console.log(`[Translation] Original text: "${content.substring(0, 50)}..."`);
          
          // Use auto-detection or sender's language for transliterated text
          const translatedText = await translateText(
            content.trim(), 
            receiverLanguage, 
            sourceLanguageForTranslation
          );
          
          console.log(`[Translation] Translated text: "${translatedText.substring(0, 50)}..."`);
          
          // Only mark as translated if the result is different from original
          if (translatedText.trim().toLowerCase() !== content.trim().toLowerCase()) {
            message.translatedContent = translatedText;
            message.translatedLanguage = receiverLanguage;
            message.isTranslated = true;
          } else {
            // Translation returned same text (might be same language or translation failed)
            message.translatedContent = content.trim();
            message.translatedLanguage = receiverLanguage;
            message.isTranslated = false;
          }
        } catch (error) {
          console.error("[Translation] Error:", error.response?.data || error.message);
          // Continue without translation if it fails
          message.translatedContent = content.trim();
          message.translatedLanguage = receiverLanguage;
          message.isTranslated = false;
        }
      } else {
        // Same language, no translation needed but set fields
        message.translatedContent = content.trim();
        message.translatedLanguage = receiverLanguage;
        message.isTranslated = false;
      }
    } else {
      // No language preference set
      message.translatedContent = "";
      message.translatedLanguage = originalLanguage;
      message.isTranslated = false;
    }

    await message.save();

    // Update conversation last message
    // This marks the conversation as having a real chat (not just created)
    // Once lastMessage is set, the conversation will appear in the conversation list
    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
});

/**
 * Delete all conversations and messages for the logged-in user
 * DELETE /api/chat/conversations/all
 * IMPORTANT: Only deletes conversations where the current user is a participant
 * This ensures chat isolation - other users' data is never affected
 */
router.delete("/conversations/all", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all conversations where ONLY the current user is a participant
    // This ensures we only delete conversations that belong to this user
    const conversations = await Conversation.find({
      "participants.userId": userId,
    });

    // Additional safety check: Verify user is actually a participant in each conversation
    const userConversations = conversations.filter(conv => {
      return conv.participants.some(p => p.userId.toString() === userId);
    });

    const conversationIds = userConversations.map(conv => conv._id.toString());

    // Delete all messages in these conversations
    // Only delete messages from conversations where the user is a participant
    // This ensures chat isolation - messages from other users' conversations are not affected
    let deletedMessagesCount = 0;
    if (conversationIds.length > 0) {
      const deleteResult = await Message.deleteMany({
        conversationId: { $in: conversationIds },
      });
      deletedMessagesCount = deleteResult.deletedCount;
      console.log(`[Delete All] Deleted ${deletedMessagesCount} messages from ${conversationIds.length} conversations for user ${userId}`);
    }

    // Delete all conversations where user is a participant
    // This only affects conversations where the current user is involved
    const deleteResult = await Conversation.deleteMany({
      "participants.userId": userId,
    });

    console.log(`[Delete All] Deleted ${deleteResult.deletedCount} conversations for user ${userId}`);

    return res.status(200).json({
      message: "All conversations and messages deleted successfully",
      deletedConversations: deleteResult.deletedCount,
      deletedMessages: deletedMessagesCount,
    });
  } catch (error) {
    console.error("Error deleting all conversations:", error);
    return res.status(500).json({ message: "Failed to delete conversations" });
  }
});

/**
 * Translate a message
 * POST /api/chat/messages/:messageId/translate
 */
router.post("/messages/:messageId/translate", protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { targetLanguage } = req.body;
    const userId = req.user.id;

    if (!targetLanguage) {
      return res.status(400).json({ message: "Target language is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Verify user is part of conversation
    const conversation = await Conversation.findById(message.conversationId);
    const isParticipant = conversation.participants.some(
      (p) => p.userId.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Translate message
    const translatedText = await translateText(
      message.content,
      targetLanguage,
      message.originalLanguage
    );

    message.translatedContent = translatedText;
    message.translatedLanguage = targetLanguage;
    message.isTranslated = true;
    await message.save();

    return res.status(200).json(message);
  } catch (error) {
    console.error("Error translating message:", error);
    return res.status(500).json({ message: "Failed to translate message" });
  }
});

export default router;

