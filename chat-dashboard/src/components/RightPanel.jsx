import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import LanguageSelector from './LanguageSelector';
import { useConversations } from '../contexts/ConversationsProvider';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../services/api';
import { getSocket, emitUserActive } from '../services/socketService';
import './RightPanel.css';

const RightPanel = () => {
    const { conversations, selectedId } = useConversations();
    const { user } = useAuth();
    const [targetLanguage, setTargetLanguage] = useState("en");
    const [isOtherUserActive, setIsOtherUserActive] = useState(false);

    const conversation = conversations.find(c => c.id === selectedId);

    // Load language preference - check global preference first, then conversation-specific
    // IMPORTANT: Set language preference on backend immediately when conversation is selected
    // This ensures first message is translated
    useEffect(() => {
        if (!selectedId) return;
        
        // Check for global language preference (applies to all conversations)
        const globalLanguage = localStorage.getItem('global_language_pref');
        if (globalLanguage) {
            setTargetLanguage(globalLanguage);
            // CRITICAL: Update backend immediately and wait for it to complete
            // This ensures first message is translated
            chatAPI.updateLanguagePreference(selectedId, globalLanguage)
                .then(() => {
                    console.log(`[RightPanel] Set preference to ${globalLanguage} for conversation ${selectedId}`);
                })
                .catch(console.error);
            return;
        }
        
        // Fall back to conversation-specific preference
        const storedLanguage = localStorage.getItem(`language_pref_${selectedId}`);
        if (storedLanguage) {
            setTargetLanguage(storedLanguage);
            // CRITICAL: Update backend immediately
            chatAPI.updateLanguagePreference(selectedId, storedLanguage)
                .then(() => {
                    console.log(`[RightPanel] Set preference to ${storedLanguage} for conversation ${selectedId}`);
                })
                .catch(console.error);
        } else if (conversation?.myPreferredLanguage) {
            setTargetLanguage(conversation.myPreferredLanguage);
            localStorage.setItem(`language_pref_${selectedId}`, conversation.myPreferredLanguage);
            // Update backend with conversation's preference
            chatAPI.updateLanguagePreference(selectedId, conversation.myPreferredLanguage)
                .then(() => {
                    console.log(`[RightPanel] Set preference to ${conversation.myPreferredLanguage} from conversation for ${selectedId}`);
                })
                .catch(console.error);
        } else {
            // No preference set yet - set default to "en" but still update backend
            // This ensures the preference is set before first message
            const defaultLanguage = "en";
            setTargetLanguage(defaultLanguage);
            chatAPI.updateLanguagePreference(selectedId, defaultLanguage)
                .then(() => {
                    console.log(`[RightPanel] Set default preference to ${defaultLanguage} for conversation ${selectedId}`);
                })
                .catch(console.error);
        }
    }, [selectedId, conversation]);

    // Use Socket.IO for user activity instead of polling
    useEffect(() => {
        if (!selectedId || !user) return;

        try {
            const socket = getSocket();
            
            // Emit user active status
            const pingInterval = setInterval(() => {
                try {
                    emitUserActive(selectedId);
                } catch (error) {
                    console.error("Error emitting user active:", error);
                }
            }, 30000); // Ping every 30 seconds

            // Listen for other user's activity
            const handleUserActive = (data) => {
                if (data.conversationId === selectedId && data.userId === conversation?.user?.id) {
                    setIsOtherUserActive(true);
                    // Reset after 2 minutes of no activity
                    setTimeout(() => setIsOtherUserActive(false), 120000);
                }
            };

            socket.on('user_active', handleUserActive);

            return () => {
                clearInterval(pingInterval);
                try {
                    socket.off('user_active', handleUserActive);
                } catch (error) {
                    console.error("Error removing socket listener:", error);
                }
            };
        } catch (error) {
            console.error("Error setting up Socket.IO for user activity:", error);
        }
    }, [selectedId, user, conversation]);

    const handleLanguageChange = async (language) => {
        setTargetLanguage(language);
        // Save as global preference (applies to all conversations)
        localStorage.setItem('global_language_pref', language);
        
        // Also save conversation-specific preference
        if (selectedId) {
            localStorage.setItem(`language_pref_${selectedId}`, language);
        }
        
        // Update on backend for current conversation
        if (selectedId) {
            try {
                await chatAPI.updateLanguagePreference(selectedId, language);
            } catch (error) {
                console.error("Error updating language preference:", error);
            }
        }
        
        // Update all other conversations' preferences on backend
        // This ensures all incoming messages translate from the start
        conversations.forEach(async (conv) => {
            if (conv.id !== selectedId) {
                try {
                    await chatAPI.updateLanguagePreference(conv.id, language);
                } catch (error) {
                    // Silently fail for other conversations
                }
            }
        });
    };

    if (!conversation) {
        return (
            <div className="right-panel placeholder">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#657786' }}>
                        Select a conversation to start messaging.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#657786' }}>
                            Set your preferred language for all conversations:
                        </label>
                        <LanguageSelector
                            selectedLanguage={targetLanguage}
                            onLanguageChange={handleLanguageChange}
                        />
                        <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                            All incoming messages will be automatically translated to your selected language.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Translation is enabled when:
    // 1. User has set a language preference (including "en") - so incoming messages are translated to their preference
    // 2. Other user has a language preference - so we can show translated messages they receive
    // Translation works both ways: to English from other languages, and from English to other languages
    const translateEnabled = (targetLanguage && targetLanguage.trim() !== "") || 
                             (conversation.otherPreferredLanguage && conversation.otherPreferredLanguage.trim() !== "");

    return (
        <section className="right-panel">
            <ChatHeader 
                user={conversation.user} 
                translateEnabled={translateEnabled}
                onLanguageChange={handleLanguageChange}
                selectedLanguage={targetLanguage}
                isActive={isOtherUserActive}
            />
            <ChatWindow 
                messages={conversation.messages || []} 
                translateEnabled={translateEnabled}
            />
            <MessageInput 
                conversationId={conversation.id}
            />
        </section>
    );
};

export default RightPanel;
