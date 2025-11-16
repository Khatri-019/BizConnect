import React from "react";
import { createRoot } from "react-dom/client";
import MessagingInterface from "./components/MessagingInterface";
import { ConversationsProvider } from "./contexts/ConversationsProvider";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConversationsProvider>
      <MessagingInterface />
    </ConversationsProvider>
  </React.StrictMode>
);
