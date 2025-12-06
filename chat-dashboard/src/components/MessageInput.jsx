import React, { useState } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import { useConversations } from '../contexts/ConversationsProvider';
import { chatAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { containsProfanity } from '../utils/profanityFilter';
import { sendMessageViaSocket } from '../services/socketService';
import WarningModal from './WarningModal';
import './MessageInput.css';

const MessageInput = ({ conversationId }) => {
    const [message, setMessage] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const { addMessage } = useConversations();
    const { user } = useAuth();

    const handleSend = async () => {
        if (!message.trim() || !conversationId) return;

        const content = message.trim();
        
        // Check for profanity before sending
        if (containsProfanity(content)) {
            setShowWarning(true);
            return; // Don't send the message
        }
        
        setMessage('');

        try {
            // CRITICAL: Ensure language preference is set BEFORE sending message
            // This ensures first message is translated
            // Check for global preference first
            const globalLanguage = localStorage.getItem('global_language_pref');
            const conversationLanguage = localStorage.getItem(`language_pref_${conversationId}`);
            const languageToUse = globalLanguage || conversationLanguage || "en";
            
            // Always update language preference on backend before sending
            // This ensures the backend has the latest preference when processing the message
            try {
                await chatAPI.updateLanguagePreference(conversationId, languageToUse);
                console.log(`[MessageInput] Set language preference to ${languageToUse} before sending message`);
            } catch (error) {
                console.error("Error setting language preference before sending:", error);
                // Continue anyway - backend will handle translation if preference is set
            }
            
            // Send message via Socket.IO (real-time)
            // The message will be added to state via Socket.IO event listener in useChatData
            // No optimistic update to prevent duplicates - wait for server confirmation
            sendMessageViaSocket(conversationId, content);
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
        <>
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
            <WarningModal
                isOpen={showWarning}
                onClose={() => setShowWarning(false)}
                message="Please do not use offensive language, your account might be suspended."
            />
        </>
    );
};

export default MessageInput;
