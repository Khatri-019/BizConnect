import React, { createContext, useContext, useState } from "react";
import initialConversations from "../data/conversationsData";

const ConversationsContext = createContext(null);

export function ConversationsProvider({ children }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? null);

  function markAsRead(id) {
    setConversations(prev => prev.map(c => (c.id === id ? { ...c, unreadCount: 0 } : c)));
  }

  function selectConversation(id) {
    // reuse markAsRead so logic lives in one place
    markAsRead(id);
    setSelectedId(id);
  }

  return (
    <ConversationsContext.Provider value={{ conversations, selectedId, selectConversation, markAsRead }}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations must be used within ConversationsProvider");
  return ctx;
}