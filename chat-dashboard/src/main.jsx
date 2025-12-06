import React from "react";
import { createRoot } from "react-dom/client";
import MessagingInterface from "./components/MessagingInterface";
import { ConversationsProvider } from "./contexts/ConversationsProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeSocket } from "./services/socketService";

// Initialize Socket.IO connection on app start
initializeSocket();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ConversationsProvider>
        <MessagingInterface />
      </ConversationsProvider>
    </AuthProvider>
  </React.StrictMode>
);
