import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import LanguageSelector from './LanguageSelector';
import { useConversations } from '../contexts/ConversationsProvider';
import { useAuth } from '../contexts/AuthContext';
import { activeUsersAPI, chatAPI } from '../services/api';
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
        // Check for global language preference (applies to all conversations)
        const globalLanguage = localStorage.getItem('global_language_pref');
        if (globalLanguage) {
            setTargetLanguage(globalLanguage);
            // CRITICAL: Update backend immediately and wait for it to complete
            // This ensures first message is translated
            if (selectedId) {
                chatAPI.updateLanguagePreference(selectedId, globalLanguage)
                    .then(() => {
                        console.log(`[Language] Set preference to ${globalLanguage} for conversation ${selectedId}`);
                    })
                    .catch(console.error);
            }
            return;
        }
        
        // Fall back to conversation-specific preference
        if (!selectedId) return;
        
        const storedLanguage = localStorage.getItem(`language_pref_${selectedId}`);
        if (storedLanguage) {
            setTargetLanguage(storedLanguage);
            // CRITICAL: Update backend immediately
            chatAPI.updateLanguagePreference(selectedId, storedLanguage)
                .then(() => {
                    console.log(`[Language] Set preference to ${storedLanguage} for conversation ${selectedId}`);
                })
                .catch(console.error);
        } else if (conversation?.myPreferredLanguage) {
            setTargetLanguage(conversation.myPreferredLanguage);
            localStorage.setItem(`language_pref_${selectedId}`, conversation.myPreferredLanguage);
        } else {
            // No preference set yet - set default to "en" but still update backend
            // This ensures the preference is set before first message
            const defaultLanguage = "en";
            setTargetLanguage(defaultLanguage);
            if (selectedId) {
                chatAPI.updateLanguagePreference(selectedId, defaultLanguage)
                    .catch(console.error);
            }
        }
    }, [selectedId, conversation]);

    // Ping server to update activity
    useEffect(() => {
        if (!selectedId || !user) return;

        const pingInterval = setInterval(async () => {
            try {
                await activeUsersAPI.ping(selectedId);
            } catch (error) {
                console.error("Error pinging:", error);
            }
        }, 30000); // Ping every 30 seconds

        return () => clearInterval(pingInterval);
    }, [selectedId, user]);

    // Check if other user is active
    useEffect(() => {
        if (!conversation || !user) return;

        const otherUserId = conversation.user?.id;
        if (!otherUserId) return;

        const checkActive = async () => {
            try {
                const result = await activeUsersAPI.checkActive(otherUserId, selectedId);
                setIsOtherUserActive(result.isActive);
            } catch (error) {
                console.error("Error checking active status:", error);
            }
        };

        checkActive();
        const activeCheckInterval = setInterval(checkActive, 10000); // Check every 10 seconds

        return () => clearInterval(activeCheckInterval);
    }, [conversation, selectedId, user]);

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

    // Translation is always enabled when a language preference is set (not "en")
    // The backend will automatically translate messages to the receiver's preferred language
    // We show translation if:
    // 1. User has set a language preference (not "en") - so incoming messages are translated
    // 2. Other user has a language preference - so we can show translated messages they receive
    const translateEnabled = (targetLanguage && targetLanguage !== "en") || 
                             (conversation.otherPreferredLanguage && conversation.otherPreferredLanguage !== "en");

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
