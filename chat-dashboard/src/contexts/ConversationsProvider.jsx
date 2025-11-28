import React, { createContext, useContext, useState, useEffect } from "react";
import { chatAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const ConversationsContext = createContext(null);

export function ConversationsProvider({ children }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch conversations from backend
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const data = await chatAPI.getConversations();
        // Transform backend data to match component expectations
        const transformed = data.map(conv => {
          // Load saved language preference from localStorage
          const savedLanguage = localStorage.getItem(`language_pref_${conv._id || conv.id}`);
          const myLanguage = savedLanguage || conv.myPreferredLanguage || "en";
          
          return {
            id: conv._id || conv.id,
            _id: conv._id || conv.id,
            user: {
              name: conv.otherParticipant?.name || "Unknown",
              img: conv.otherParticipant?.img || "",
              avatar: conv.otherParticipant?.img || "", // Also set avatar for compatibility
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
        // Deduplicate conversations by ID before setting
        const uniqueConversations = transformed.reduce((acc, conv) => {
          if (!acc.find(c => c.id === conv.id)) {
            acc.push(conv);
          }
          return acc;
        }, []);
        
        setConversations(uniqueConversations);
        
        // Check URL for conversationId parameter
        const urlParams = new URLSearchParams(window.location.search);
        const conversationId = urlParams.get("conversationId");
        
        if (conversationId) {
          // Check if conversation is already in the list
          const existsInList = uniqueConversations.some(c => c.id === conversationId);
          
          if (!existsInList) {
            // Conversation not in list (might be newly created), fetch it individually
            try {
              const singleConv = await chatAPI.getConversationById(conversationId);
              const savedLanguage = localStorage.getItem(`language_pref_${singleConv._id || singleConv.id}`);
              const myLanguage = savedLanguage || singleConv.myPreferredLanguage || "en";
              
              const newConv = {
                id: singleConv._id || singleConv.id,
                _id: singleConv._id || singleConv.id,
                user: {
                  name: singleConv.otherParticipant?.name || "Unknown",
                  img: singleConv.otherParticipant?.img || "",
                  avatar: singleConv.otherParticipant?.img || "",
                  industry: singleConv.otherParticipant?.industry || "",
                  id: singleConv.otherParticipant?.id,
                },
                lastMessage: singleConv.lastMessage || "",
                lastMessageAt: singleConv.lastMessageAt,
                messages: [],
                myPreferredLanguage: myLanguage,
                otherPreferredLanguage: singleConv.otherPreferredLanguage || "en",
              };
              
              // Add to conversations list, ensuring no duplicates
              setConversations(prev => {
                const exists = prev.find(c => c.id === newConv.id);
                if (exists) {
                  return prev; // Already exists, don't add duplicate
                }
                return [newConv, ...prev];
              });
              setSelectedId(conversationId);
            } catch (error) {
              console.error("Error fetching conversation from URL:", error);
              // If conversation doesn't exist or user not authorized, clear URL param
              if (uniqueConversations.length > 0) {
                setSelectedId(uniqueConversations[0].id);
              }
            }
          } else {
            // Conversation exists in list, select it
            setSelectedId(conversationId);
          }
        } else if (uniqueConversations.length > 0) {
          setSelectedId(uniqueConversations[0].id);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedId) return;

    const loadMessages = async () => {
      try {
        const messages = await chatAPI.getMessages(selectedId);
        setConversations(prev => prev.map(c => 
          c.id === selectedId 
            ? { ...c, messages: messages.map(msg => ({
                id: msg._id || msg.id,
                senderId: msg.senderId,
                senderRole: msg.senderRole,
                content: msg.content,
                translatedContent: msg.translatedContent || msg.content,
                isTranslated: msg.isTranslated,
                originalLanguage: msg.originalLanguage,
                translatedLanguage: msg.translatedLanguage,
                createdAt: msg.createdAt,
              })) }
            : c
        ));
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [selectedId]);

  function markAsRead(id) {
    setConversations(prev => prev.map(c => (c.id === id ? { ...c, unreadCount: 0 } : c)));
  }

  function selectConversation(id) {
    if (id === null || id === undefined) {
      // Clear selection
      setSelectedId(null);
      const url = new URL(window.location);
      url.searchParams.delete("conversationId");
      window.history.pushState({}, "", url);
      return;
    }
    
    // Ensure ID is a string for consistent comparison
    const conversationId = String(id);
    
    // Verify conversation exists before selecting
    const conversationExists = conversations.some(c => String(c.id) === conversationId || String(c._id) === conversationId);
    if (!conversationExists) {
      console.warn(`Conversation ${conversationId} not found in list`);
      return;
    }
    
    markAsRead(conversationId);
    setSelectedId(conversationId);
    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set("conversationId", conversationId);
    window.history.pushState({}, "", url);
  }

  function addMessage(conversationId, message) {
    setConversations(prev => prev.map(c => 
      c.id === conversationId 
        ? { 
            ...c, // Preserve all existing properties including user object
            messages: [...c.messages, message],
            lastMessage: message.content,
            lastMessageAt: new Date(),
          }
        : c
    ));
  }

  // Poll for new messages in selected conversation
  useEffect(() => {
    if (!selectedId) return;

    const pollMessages = setInterval(async () => {
      try {
        const messages = await chatAPI.getMessages(selectedId);
        setConversations(prev => prev.map(c => {
          if (c.id === selectedId) {
            // Only update if we have new messages
            const currentMessageIds = new Set(c.messages.map(m => m.id || m._id));
            const newMessages = messages.filter(msg => !currentMessageIds.has(msg._id || msg.id));
            
            if (newMessages.length > 0 || messages.length !== c.messages.length) {
              return {
                ...c, // Preserve user object
                messages: messages.map(msg => ({
                  id: msg._id || msg.id,
                  senderId: msg.senderId,
                  senderRole: msg.senderRole,
                  content: msg.content,
                  translatedContent: msg.translatedContent || msg.content,
                  isTranslated: msg.isTranslated,
                  originalLanguage: msg.originalLanguage,
                  translatedLanguage: msg.translatedLanguage,
                  createdAt: msg.createdAt,
                })),
                lastMessage: messages.length > 0 ? messages[messages.length - 1].content : c.lastMessage,
                lastMessageAt: messages.length > 0 ? messages[messages.length - 1].createdAt : c.lastMessageAt,
              };
            }
          }
          return c;
        }));
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollMessages);
  }, [selectedId]);

  // Poll for conversation updates (new conversations, updated last messages)
  useEffect(() => {
    if (!user) return;

    const pollConversations = setInterval(async () => {
      try {
        const data = await chatAPI.getConversations();
        setConversations(prev => {
          // Create a map of existing conversations by ID for quick lookup
          const existingMap = new Map(prev.map(c => [c.id, c]));
          
          // Process new conversations from backend
          const newConversations = data.map(conv => {
            const convId = conv._id || conv.id;
            const existing = existingMap.get(convId);
            
            // Load saved language preference
            const savedLanguage = localStorage.getItem(`language_pref_${convId}`);
            const myLanguage = savedLanguage || existing?.myPreferredLanguage || conv.myPreferredLanguage || "en";
            
            return {
              id: convId,
              _id: convId,
              user: {
                name: conv.otherParticipant?.name || existing?.user?.name || "Unknown",
                img: conv.otherParticipant?.img || existing?.user?.img || "",
                avatar: conv.otherParticipant?.img || existing?.user?.avatar || "",
                industry: conv.otherParticipant?.industry || existing?.user?.industry || "",
                id: conv.otherParticipant?.id || existing?.user?.id,
              },
              lastMessage: conv.lastMessage || "",
              lastMessageAt: conv.lastMessageAt,
              messages: existing?.messages || [], // Preserve loaded messages
              myPreferredLanguage: myLanguage,
              otherPreferredLanguage: conv.otherPreferredLanguage || existing?.otherPreferredLanguage || "en",
            };
          });
          
          // Find conversations that exist in prev but not in new data (keep them if they're newly added)
          const newDataIds = new Set(newConversations.map(c => c.id));
          const conversationsToKeep = prev.filter(c => !newDataIds.has(c.id));
          
          // Combine: new conversations from backend + conversations not yet in backend (newly created)
          // Deduplicate by ID
          const allConversations = [...newConversations, ...conversationsToKeep];
          const uniqueConversations = allConversations.reduce((acc, conv) => {
            if (!acc.find(c => c.id === conv.id)) {
              acc.push(conv);
            }
            return acc;
          }, []);
          
          // Sort by lastMessageAt (most recent first)
          return uniqueConversations.sort((a, b) => {
            const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return timeB - timeA;
          });
        });
      } catch (error) {
        console.error("Error polling conversations:", error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollConversations);
  }, [user]);

  return (
    <ConversationsContext.Provider value={{ 
      conversations, 
      selectedId, 
      selectConversation, 
      markAsRead,
      addMessage,
      loading,
    }}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations must be used within ConversationsProvider");
  return ctx;
}