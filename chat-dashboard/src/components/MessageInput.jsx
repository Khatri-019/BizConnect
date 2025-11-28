import React, { useState } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import { useConversations } from '../contexts/ConversationsProvider';
import { chatAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './MessageInput.css';

const MessageInput = ({ conversationId }) => {
    const [message, setMessage] = useState('');
    const { addMessage } = useConversations();
    const { user } = useAuth();

    const handleSend = async () => {
        if (!message.trim() || !conversationId) return;

        const content = message.trim();
        setMessage('');

        try {
            // Ensure language preference is set before sending first message
            // Check for global preference first
            const globalLanguage = localStorage.getItem('global_language_pref');
            const conversationLanguage = localStorage.getItem(`language_pref_${conversationId}`);
            const languageToUse = globalLanguage || conversationLanguage || "en";
            
            // Update language preference on backend if not already set
            // This ensures first message is translated
            if (languageToUse && languageToUse !== "en") {
                try {
                    await chatAPI.updateLanguagePreference(conversationId, languageToUse);
                } catch (error) {
                    console.error("Error setting language preference before sending:", error);
                    // Continue anyway - backend will handle translation if preference is set
                }
            }
            
            // Translation is handled automatically on backend based on receiver's language preference
            const sentMessage = await chatAPI.sendMessage(conversationId, content);

            // Add message to local state
            addMessage(conversationId, {
                id: sentMessage._id || sentMessage.id,
                senderId: sentMessage.senderId,
                senderRole: sentMessage.senderRole,
                content: sentMessage.content,
                translatedContent: sentMessage.translatedContent || sentMessage.content,
                isTranslated: sentMessage.isTranslated,
                originalLanguage: sentMessage.originalLanguage,
                translatedLanguage: sentMessage.translatedLanguage,
                createdAt: sentMessage.createdAt,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
            setMessage(content); // Restore message on error
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="message-input-container">
            <button className="icon-button" title="Attach file">
                <FiPaperclip size={22} />
            </button>
            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button className="send-button" onClick={handleSend} disabled={!message.trim()}>
                <FiSend size={20} />
            </button>
        </div>
    );
};

export default MessageInput;
