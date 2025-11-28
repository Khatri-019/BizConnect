import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ChatWindow.css';

const MessageBubble = ({ message, isOwnMessage, translateEnabled }) => {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Show original content to sender, translated content to receiver (if available and translation is enabled)
    // Receiver should see translated content if:
    // 1. Translation is enabled
    // 2. Message has been translated (isTranslated is true)
    // 3. Translated content exists and is not empty
    const displayContent = isOwnMessage 
        ? message.content  // Sender always sees original message
        : (translateEnabled && message.isTranslated && message.translatedContent && message.translatedContent.trim() !== "" 
            ? message.translatedContent  // Receiver sees translated if available and translation is enabled
            : message.content);  // Fallback to original if no translation or translation disabled

    return (
        <div className={`message-wrapper ${isOwnMessage ? 'sent' : 'received'}`}>
            <div className="message-bubble">
                <p className="message-text">
                    {displayContent}
                </p>
                <span className="message-time">{formatTime(message.createdAt)}</span>
            </div>
        </div>
    );
};

const ChatWindow = ({ messages, translateEnabled = false }) => {
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <div className="chat-window">
                <div className="empty-state">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            {messages.map(msg => (
                <MessageBubble
                    key={msg.id || msg._id}
                    message={msg}
                    isOwnMessage={msg.senderId === user?.id}
                    translateEnabled={translateEnabled}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;
