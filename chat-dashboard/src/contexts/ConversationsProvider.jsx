import React, { createContext, useContext, useState, useEffect } from "react";
import { chatAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import { useChatData } from "../hooks/useChatData";
import { joinConversation, leaveConversation } from "../services/socketService";

const ConversationsContext = createContext(null);

export function ConversationsProvider({ children }) {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  
  // Use the new hook for data management
  const { conversations, loading, loadMessages, addMessage } = useChatData(user?.id);

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedId) return;

    // Join Socket.IO room for this conversation
    try {
      joinConversation(selectedId);
    } catch (error) {
      console.error("Error joining conversation room:", error);
    }
    
    // Load messages from API (always load on selection to ensure messages persist)
    // Use a small delay to ensure conversation is in state
    const loadTimer = setTimeout(() => {
      loadMessages(selectedId);
    }, 100);

    // Cleanup: leave room when conversation changes
    return () => {
      clearTimeout(loadTimer);
      try {
        leaveConversation(selectedId);
      } catch (error) {
        console.error("Error leaving conversation room:", error);
      }
    };
  }, [selectedId]); // Remove loadMessages from deps to avoid infinite loop

  // Check URL for conversationId parameter on mount and when conversations load
  useEffect(() => {
    if (!user || loading) return;

    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get("conversationId");
    
    if (conversationId && conversations.length > 0) {
      // Match conversation by ID (handle both string and object ID)
      const existsInList = conversations.some(c => 
        String(c.id) === String(conversationId) || 
        String(c._id) === String(conversationId)
      );
      
      if (existsInList) {
        if (selectedId !== conversationId) {
          setSelectedId(conversationId);
        }
      } else {
        // Conversation not in list, try to fetch it
        chatAPI.getConversationById(conversationId)
          .then(singleConv => {
            const savedLanguage = localStorage.getItem(`language_pref_${singleConv._id || singleConv.id}`);
            const myLanguage = savedLanguage || singleConv.myPreferredLanguage || "en";
            
            // Note: The conversation will be added by useChatData hook via Socket.IO
            if (selectedId !== conversationId) {
              setSelectedId(conversationId);
            }
          })
          .catch(error => {
            console.error("Error fetching conversation from URL:", error);
            if (conversations.length > 0 && !selectedId) {
              setSelectedId(conversations[0].id);
            }
          });
      }
    } else if (conversations.length > 0 && !selectedId) {
      // No URL param, select first conversation
      setSelectedId(conversations[0].id);
    }
  }, [user, loading, conversations]);

  function markAsRead(id) {
    // This can be extended to mark messages as read on backend
    // For now, just a placeholder
  }

  function selectConversation(id) {
    if (id === null || id === undefined) {
      setSelectedId(null);
      const url = new URL(window.location);
      url.searchParams.delete("conversationId");
      window.history.pushState({}, "", url);
      return;
    }
    
    const conversationId = String(id);
    const conversationExists = conversations.some(c => String(c.id) === conversationId || String(c._id) === conversationId);
    if (!conversationExists) {
      console.warn(`Conversation ${conversationId} not found in list`);
      return;
    }
    
    markAsRead(conversationId);
    setSelectedId(conversationId);
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set("conversationId", conversationId);
    window.history.pushState({}, "", url);
  }

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
