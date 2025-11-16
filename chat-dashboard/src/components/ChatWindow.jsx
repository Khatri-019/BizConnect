import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';

const MessageBubble = ({ message }) => (
    <div className={`message-wrapper ${message.type}`}>
        <div className="message-bubble">
            <p className="message-text">{message.text}</p>
            <span className="message-time">{message.time}</span>
        </div>
    </div>
);

const ChatWindow = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-window">
            {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;
