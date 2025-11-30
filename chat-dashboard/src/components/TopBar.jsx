import React, { useState, useRef, useEffect } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { FiArrowLeft } from "react-icons/fi";
import { chatAPI } from '../services/api';
import { useConversations } from '../contexts/ConversationsProvider';
import './TopBar.css';

const TopBar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef(null);
    const { selectConversation } = useConversations();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleBackToFrontend = () => {
        // Use production URL in production, localhost in development
        // Similar to backend/app.js: if NODE_ENV=production use production links, else localhost
        const isProduction = import.meta.env.MODE === 'production';
        const frontendUrl = isProduction ? (import.meta.env.VITE_FRONTEND_URL) : "http://localhost:5173";
        window.location.href = frontendUrl;
    };

    const handleClearAllChats = async () => {
        if (!window.confirm('Are you sure you want to clear all chats? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await chatAPI.deleteAllConversations();
            // Clear selected conversation
            selectConversation(null);
            // Clear localStorage preferences
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('language_pref_')) {
                    localStorage.removeItem(key);
                }
            });
            // Reload the page to refresh conversations
            window.location.reload();
        } catch (error) {
            console.error("Error clearing all chats:", error);
            alert("Failed to clear all chats. Please try again.");
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    return (
        <header className="top-bar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                    className="back-button" 
                    onClick={handleBackToFrontend}
                    title="Back to Frontend"
                >
                    <FiArrowLeft size={18} />
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                        Back to Home
                    </span>
                </button>
            </div>
            <h2>Messages</h2>
            <div className="settings-container" ref={menuRef}>
                <IoSettingsOutline 
                    size={22} 
                    className="icon" 
                    onClick={() => setShowMenu(!showMenu)}
                    title="Settings"
                />
                {showMenu && (
                    <div className="settings-dropdown">
                        <button
                            className="settings-menu-item"
                            onClick={handleClearAllChats}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Clearing...' : 'Clear All Chats'}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default TopBar;
