import React from 'react';
import { FiPaperclip, FiMail } from 'react-icons/fi';
import './MessageInput.css';

const MessageInput = () => (
    <div className="message-input-container">
        <button className="icon-button"><FiPaperclip size={22} /></button>
        <button className="icon-button"><FiMail size={22} /></button>
        <input type="text" placeholder="Type your message..." />
        <button className="send-button">Send</button>
    </div>
);

export default MessageInput;
