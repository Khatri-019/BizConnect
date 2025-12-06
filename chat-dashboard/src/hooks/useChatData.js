import { useState, useEffect, useCallback } from "react";
import { chatAPI } from "../services/api";
import { getSocket } from "../services/socketService";

/**
 * Hook for managing chat data with Socket.IO real-time updates
 * Replaces polling logic from ConversationsProvider
 */
export const useChatData = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversations from backend
  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    try {
      const data = await chatAPI.getConversations();
      // Transform backend data to match component expectations
      const transformed = data.map(conv => {
        const savedLanguage = localStorage.getItem(`language_pref_${conv._id || conv.id}`);
        const myLanguage = savedLanguage || conv.myPreferredLanguage || "en";
        
        return {
          id: conv._id || conv.id,
          _id: conv._id || conv.id,
          user: {
            name: conv.otherParticipant?.name || "Unknown",
            img: conv.otherParticipant?.img || "",
            avatar: conv.otherParticipant?.img || "",
            industry: conv.otherParticipant?.industry || "",
            id: conv.otherParticipant?.id,
          },
          lastMessage: conv.lastMessage || "",
          lastMessageAt: conv.lastMessageAt,
          messages: [], // Will be loaded when conversation is selected
          myPreferredLanguage: myLanguage,
          otherPreferredLanguage: conv.otherPreferredLanguage || "en",
        };
      });

      // Deduplicate conversations by ID
      const uniqueConversations = transformed.reduce((acc, conv) => {
        if (!acc.find(c => c.id === conv.id)) {
          acc.push(conv);
        }
        return acc;
      }, []);

      setConversations(uniqueConversations);
      setError(null);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Set up Socket.IO listeners
  useEffect(() => {
    if (!userId) return;

    let socket;
    try {
      socket = getSocket();
    } catch (error) {
      console.error("Error getting socket:", error);
      return;
    }

    // Listen for new messages
    const handleNewMessage = (data) => {
      const { conversationId, message } = data;
      
      if (!conversationId || !message) {
        console.warn("Invalid new_message event data:", data);
        return;
      }
      
      const convId = String(conversationId);
      const messageId = String(message.id || message._id);
      
      if (!messageId || messageId === "undefined") {
        console.warn("Message missing ID:", message);
        return;
      }
      
      setConversations(prev => prev.map(c => {
        // Match conversation by ID (handle both string and object ID)
        const convIdMatch = String(c.id) === convId || 
                           String(c._id) === convId;
        
        if (convIdMatch) {
          // Check if message already exists (compare by ID)
          const messageExists = c.messages.some(m => {
            const existingId = String(m.id || m._id);
            return existingId === messageId;
          });
          
          if (!messageExists) {
            // Add message and sort by createdAt
            const updatedMessages = [...c.messages, {
              id: messageId,
              _id: messageId,
              senderId: String(message.senderId),
              senderRole: message.senderRole,
              content: message.content,
              translatedContent: message.translatedContent || "",
              isTranslated: message.isTranslated || false,
              originalLanguage: message.originalLanguage || "en",
              translatedLanguage: message.translatedLanguage || "en",
              createdAt: message.createdAt,
            }].sort((a, b) => {
              const timeA = new Date(a.createdAt).getTime();
              const timeB = new Date(b.createdAt).getTime();
              return timeA - timeB;
            });
            
            return {
              ...c,
              messages: updatedMessages,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
            };
          } else {
            // Message already exists - might be a duplicate event, log for debugging
            console.debug("Duplicate message detected, skipping:", messageId);
          }
        }
        return c;
      }));
    };

    // Listen for conversation updates
    const handleConversationUpdated = (updatedConv) => {
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.id === updatedConv.id);
        
        if (existingIndex >= 0) {
          // Update existing conversation
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            lastMessage: updatedConv.lastMessage,
            lastMessageAt: updatedConv.lastMessageAt,
            myPreferredLanguage: updatedConv.myPreferredLanguage || updated[existingIndex].myPreferredLanguage,
            otherPreferredLanguage: updatedConv.otherPreferredLanguage || updated[existingIndex].otherPreferredLanguage,
          };
          return updated.sort((a, b) => {
            const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return timeB - timeA;
          });
        } else {
          // New conversation - add it
          const transformed = {
            id: updatedConv._id || updatedConv.id,
            _id: updatedConv._id || updatedConv.id,
            user: {
              name: updatedConv.otherParticipant?.name || "Unknown",
              img: updatedConv.otherParticipant?.img || "",
              avatar: updatedConv.otherParticipant?.img || "",
              industry: updatedConv.otherParticipant?.industry || "",
              id: updatedConv.otherParticipant?.id,
            },
            lastMessage: updatedConv.lastMessage || "",
            lastMessageAt: updatedConv.lastMessageAt,
            messages: [],
            myPreferredLanguage: updatedConv.myPreferredLanguage || "en",
            otherPreferredLanguage: updatedConv.otherPreferredLanguage || "en",
          };
          
          return [...prev, transformed].sort((a, b) => {
            const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return timeB - timeA;
          });
        }
      });
    };

    if (socket) {
      socket.on('new_message', handleNewMessage);
      socket.on('conversation_updated', handleConversationUpdated);

      return () => {
        if (socket) {
          socket.off('new_message', handleNewMessage);
          socket.off('conversation_updated', handleConversationUpdated);
        }
      };
    }
  }, [userId]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    
    try {
      const messages = await chatAPI.getMessages(conversationId);
      
      setConversations(prev => prev.map(c => {
        // Match conversation by ID (handle both string and object ID)
        const convIdMatch = String(c.id) === String(conversationId) || 
                           String(c._id) === String(conversationId);
        
        if (convIdMatch) {
          // Transform messages with consistent ID format
          const transformedMessages = messages.map(msg => ({
            id: String(msg._id || msg.id),
            _id: String(msg._id || msg.id),
            senderId: String(msg.senderId),
            senderRole: msg.senderRole,
            content: msg.content,
            translatedContent: msg.translatedContent || "",
            isTranslated: msg.isTranslated || false,
            originalLanguage: msg.originalLanguage || "en",
            translatedLanguage: msg.translatedLanguage || "en",
            createdAt: msg.createdAt,
          }));
          
          // Create a map of existing messages by ID for quick lookup
          const existingMessagesMap = new Map();
          c.messages.forEach(m => {
            const id = String(m.id || m._id);
            if (id && id !== "undefined") {
              existingMessagesMap.set(id, m);
            }
          });
          
          // Add new messages to the map (this automatically handles duplicates)
          transformedMessages.forEach(m => {
            const id = String(m.id || m._id);
            if (id && id !== "undefined") {
              existingMessagesMap.set(id, m);
            }
          });
          
          // Convert map back to array and sort by createdAt
          const allMessages = Array.from(existingMessagesMap.values()).sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeA - timeB;
          });
          
          return {
            ...c,
            messages: allMessages,
          };
        }
        return c;
      }));
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }, []);

  // Add a message locally (for optimistic updates - but we removed optimistic updates to prevent duplicates)
  // This function is kept for backward compatibility but should not be used for new messages
  // New messages come via Socket.IO events
  const addMessage = useCallback((conversationId, message) => {
    setConversations(prev => prev.map(c => {
      // Match conversation by ID (handle both string and object ID)
      const convIdMatch = String(c.id) === String(conversationId) || 
                         String(c._id) === String(conversationId);
      
      if (convIdMatch) {
        // Check if message already exists (to prevent duplicates)
        const messageId = String(message.id || message._id);
        const messageExists = c.messages.some(m => {
          const existingId = String(m.id || m._id);
          return existingId === messageId;
        });
        
        if (!messageExists) {
          // Add message and sort by createdAt
          const updatedMessages = [...c.messages, message].sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeA - timeB;
          });
          
          return { 
            ...c,
            messages: updatedMessages,
            lastMessage: message.content,
            lastMessageAt: message.createdAt || new Date(),
          };
        }
      }
      return c;
    }));
  }, []);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    loadMessages,
    addMessage,
  };
};

