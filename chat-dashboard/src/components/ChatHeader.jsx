import React from 'react';
import { FiVideo, FiPhone, FiMoreVertical } from 'react-icons/fi';
import './ChatHeader.css';

const ChatHeader = ({ user }) => (
    <header className="chat-header">
        <div className="user-details">
            <img src={user.avatar} alt={`${user.name}'s avatar`} className="avatar" />
            <div>
                <h3>{user.name}</h3>
                <p className={user.status === 'Online' ? 'status-online' : 'status-offline'}>
                    {user.status}
                </p>
            </div>
        </div>
        <div className="chat-actions">
            <div className="auto-translate">
                <label htmlFor="translate-toggle">Auto-translate</label>
                <label className="switch">
                    <input type="checkbox" id="translate-toggle"/>
                    <span className="slider round"></span>
                </label>
            </div>
            <button className="icon-button"><FiVideo size={20} /></button>
            <button className="icon-button"><FiPhone size={20} /></button>
            <button className="icon-button"><FiMoreVertical size={20} /></button>
        </div>
    </header>
);

export default ChatHeader;
