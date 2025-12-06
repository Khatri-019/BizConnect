import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import Expert from "../models/expert.js";
import axios from "axios";

/**
 * Check if expert is real (has user account)
 */
const isRealExpert = async (expertId) => {
  try {
    const user = await User.findById(expertId);
    return !!user && user.role === "expert";
  } catch (error) {
    return false;
  }
};

/**
 * Translate text using Google Translate API
 */
const translateText = async (text, targetLanguage = "en", sourceLanguage = "auto") => {
  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      console.warn("Google Translate API key not set, returning original text");
      return text;
    }

    if (sourceLanguage !== "auto" && sourceLanguage === targetLanguage) {
      return text;
    }

    const requestBody = {
      q: text,
      target: targetLanguage,
    };

    if (sourceLanguage && sourceLanguage !== "auto" && sourceLanguage !== "und") {
      requestBody.source = sourceLanguage;
    }

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
    return text;
  }
};

/**
 * Detect language of text
 */
const detectLanguage = async (text) => {
  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.warn("Google Translate API key not set, defaulting to 'en'");
      return "en";
    }

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
      
      return detectedLanguage;
    }
    
    console.warn("[Language Detection] No detection result, defaulting to 'en'");
    return "en";
  } catch (error) {
    console.error("[Language Detection] Error:", error.response?.data || error.message);
    return "en";
  }
};

/**
 * Create or get conversation between user and expert
 */
export const createOrGetConversation = async (userId, expertId) => {
  if (!expertId) {
    throw new Error("Expert ID is required");
  }

  // Check if expert is real (not dummy data)
  const isReal = await isRealExpert(expertId);
  if (!isReal) {
    throw new Error("Cannot book a call with this expert. Only real experts are available for calls.");
  }

  // Verify expert exists
  const expert = await Expert.findById(expertId);
  if (!expert) {
    throw new Error("Expert not found");
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    "participants.userId": { $all: [userId, expertId] },
  });

  if (!conversation) {
    // Create new conversation
    conversation = new Conversation({
      participants: [
        { userId, role: "user" },
        { userId: expertId, role: "expert" },
      ],
      initiatorId: userId,
      lastMessage: "",
    });
    await conversation.save();
  }

  return conversation;
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    "participants.userId": userId,
  })
    .sort({ lastMessageAt: -1 })
    .lean();

  // Filter conversations: show if it has messages or user is the initiator
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

  return enrichedConversations.filter((c) => c !== null);
};

/**
 * Get conversation by ID
 */
export const getConversationById = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId).lean();
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Verify user is a participant
  const isParticipant = conversation.participants.some(
    (p) => p.userId.toString() === userId
  );
  if (!isParticipant) {
    throw new Error("Not authorized to view this conversation");
  }

  const currentParticipant = conversation.participants.find(
    (p) => p.userId.toString() === userId
  );
  const otherParticipant = conversation.participants.find(
    (p) => p.userId.toString() !== userId
  );

  if (!otherParticipant) {
    throw new Error("Other participant not found");
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

  return {
    _id: conversation._id,
    id: conversation._id,
    otherParticipant: otherUserDetails,
    lastMessage: conversation.lastMessage,
    lastMessageAt: conversation.lastMessageAt,
    createdAt: conversation.createdAt,
    myPreferredLanguage: currentParticipant?.preferredLanguage || "en",
    otherPreferredLanguage: otherParticipant?.preferredLanguage || "en",
  };
};

/**
 * Get messages for a conversation
 */
export const getConversationMessages = async (conversationId, userId) => {
  // Verify user is part of conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.userId.toString() === userId
  );

  if (!isParticipant) {
    throw new Error("Not authorized to view this conversation");
  }

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();

  return messages;
};

/**
 * Update user's language preference in conversation
 */
export const updateLanguagePreference = async (conversationId, userId, preferredLanguage) => {
  if (!preferredLanguage) {
    throw new Error("Preferred language is required");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const participant = conversation.participants.find(
    (p) => p.userId.toString() === userId
  );

  if (!participant) {
    throw new Error("Not authorized");
  }

  participant.preferredLanguage = preferredLanguage;
  await conversation.save();

  return conversation;
};

/**
 * Send a message with translation
 */
export const sendMessage = async (conversationId, userId, userRole, content) => {
  if (!content || content.trim() === "") {
    throw new Error("Message content is required");
  }

  // Verify conversation exists and user is participant
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const participant = conversation.participants.find(
    (p) => p.userId.toString() === userId
  );

  if (!participant) {
    throw new Error("Not authorized to send messages in this conversation");
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

  // Reload conversation to get latest language preferences
  const freshConversation = await Conversation.findById(conversationId);
  const freshParticipant = freshConversation.participants.find(
    (p) => p.userId.toString() === userId
  );
  const freshOtherParticipant = freshConversation.participants.find(
    (p) => p.userId.toString() !== userId
  );
  
  const receiverLanguage = freshOtherParticipant?.preferredLanguage;
  const senderLanguage = freshParticipant?.preferredLanguage || originalLanguage;
  
  // Translate if receiver has a language preference set
  if (receiverLanguage && receiverLanguage.trim() !== "") {
    let shouldTranslate = false;
    let sourceLanguageForTranslation = originalLanguage;
    
    if (receiverLanguage !== originalLanguage) {
      shouldTranslate = true;
      
      if (originalLanguage === "en" && receiverLanguage !== "en") {
        console.log(`[Translation] Text detected as English but receiver prefers ${receiverLanguage}. Using auto-detection for possible transliterated text.`);
        sourceLanguageForTranslation = "auto";
      } else if (receiverLanguage === "en" && originalLanguage !== "en") {
        console.log(`[Translation] Message is in ${originalLanguage}, translating to English for receiver`);
        shouldTranslate = true;
        sourceLanguageForTranslation = originalLanguage;
      } else if (senderLanguage && senderLanguage !== "en" && senderLanguage !== receiverLanguage && senderLanguage !== originalLanguage) {
        console.log(`[Translation] Sender prefers ${senderLanguage}, using it as source language hint`);
        sourceLanguageForTranslation = senderLanguage;
      }
    } else if (senderLanguage && senderLanguage !== receiverLanguage && senderLanguage !== "en" && receiverLanguage !== "en") {
      console.log(`[Translation] Detected as ${originalLanguage} but sender prefers ${senderLanguage}, attempting translation`);
      shouldTranslate = true;
      sourceLanguageForTranslation = senderLanguage;
    } else if (originalLanguage === "en" && receiverLanguage !== "en") {
      console.log(`[Translation] Text detected as English but receiver prefers ${receiverLanguage}. Attempting translation for possible transliterated text.`);
      shouldTranslate = true;
      sourceLanguageForTranslation = "auto";
    } else if (originalLanguage !== "en" && receiverLanguage === "en") {
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
        
        const translatedText = await translateText(
          content.trim(), 
          receiverLanguage, 
          sourceLanguageForTranslation
        );
        
        console.log(`[Translation] Translated text: "${translatedText.substring(0, 50)}..."`);
        
        if (translatedText.trim().toLowerCase() !== content.trim().toLowerCase()) {
          message.translatedContent = translatedText;
          message.translatedLanguage = receiverLanguage;
          message.isTranslated = true;
        } else {
          message.translatedContent = content.trim();
          message.translatedLanguage = receiverLanguage;
          message.isTranslated = false;
        }
      } catch (error) {
        console.error("[Translation] Error:", error.response?.data || error.message);
        message.translatedContent = content.trim();
        message.translatedLanguage = receiverLanguage;
        message.isTranslated = false;
      }
    } else {
      message.translatedContent = content.trim();
      message.translatedLanguage = receiverLanguage;
      message.isTranslated = false;
    }
  } else {
    message.translatedContent = "";
    message.translatedLanguage = originalLanguage;
    message.isTranslated = false;
  }

  await message.save();

  // Update conversation last message
  conversation.lastMessage = content;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  return message;
};

/**
 * Delete all conversations and messages for a user
 */
export const deleteAllUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    "participants.userId": userId,
  });

  const userConversations = conversations.filter(conv => {
    return conv.participants.some(p => p.userId.toString() === userId);
  });

  const conversationIds = userConversations.map(conv => conv._id.toString());

  let deletedMessagesCount = 0;
  if (conversationIds.length > 0) {
    const deleteResult = await Message.deleteMany({
      conversationId: { $in: conversationIds },
    });
    deletedMessagesCount = deleteResult.deletedCount;
  }

  const deleteResult = await Conversation.deleteMany({
    "participants.userId": userId,
  });

  return {
    deletedConversations: deleteResult.deletedCount,
    deletedMessages: deletedMessagesCount,
  };
};

/**
 * Translate a message
 */
export const translateMessage = async (messageId, userId, targetLanguage) => {
  if (!targetLanguage) {
    throw new Error("Target language is required");
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new Error("Message not found");
  }

  // Verify user is part of conversation
  const conversation = await Conversation.findById(message.conversationId);
  const isParticipant = conversation.participants.some(
    (p) => p.userId.toString() === userId
  );

  if (!isParticipant) {
    throw new Error("Not authorized");
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

  return message;
};

