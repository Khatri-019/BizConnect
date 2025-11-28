import React, { useState, useRef, useEffect } from 'react';
import { FiVideo, FiPhone, FiMoreVertical } from 'react-icons/fi';
import LanguageSelector from './LanguageSelector';
import './ChatHeader.css';

// Generate a default avatar based on user's name
const getDefaultAvatar = (name) => {
  if (!name) return "https://via.placeholder.com/40/007bff/ffffff?text=?";
  
  // Get first letter of name
  const initial = name.charAt(0).toUpperCase();
  // Generate a color based on the initial
  const colors = [
    "#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8",
    "#6f42c1", "#e83e8c", "#fd7e14", "#20c997", "#6610f2"
  ];
  const colorIndex = initial.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=${color.replace('#', '')}&color=ffffff&size=40&bold=true`;
};

const ChatHeader = ({ user, translateEnabled = false, onLanguageChange, selectedLanguage, isActive = false }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

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

    return (
        <header className="chat-header">
            <div className="user-details">
                <img 
                    src={user?.img || user?.avatar || getDefaultAvatar(user?.name)} 
                    alt={`${user?.name || 'User'}'s avatar`} 
                    className="avatar"
                    onError={(e) => {
                      // Fallback to default avatar if image fails to load
                      const defaultAvatar = getDefaultAvatar(user?.name);
                      if (e.target.src !== defaultAvatar) {
                        e.target.src = defaultAvatar;
                      }
                    }}
                />
                <div>
                    <h3>{user?.name || "Unknown User"}</h3>
                    <p className={isActive ? "status-online" : "status-offline"}>
                        {isActive ? "Active" : user?.industry || "Offline"}
                    </p>
                </div>
            </div>
            <div className="chat-actions">
                <div className="auto-translate">
                    <label>Auto-translate</label>
                    <span className={`translate-status ${translateEnabled ? 'enabled' : 'disabled'}`}>
                        {translateEnabled ? 'ON' : 'OFF'}
                    </span>
                </div>
                {onLanguageChange && (
                    <LanguageSelector
                        selectedLanguage={selectedLanguage || "en"}
                        onLanguageChange={onLanguageChange}
                    />
                )}
                <button className="icon-button" title="Video call">
                    <FiVideo size={20} />
                </button>
                <button className="icon-button" title="Voice call">
                    <FiPhone size={20} />
                </button>
                <div className="menu-container" ref={menuRef}>
                    <button 
                        className="icon-button" 
                        title="More options"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <FiMoreVertical size={20} />
                    </button>
                    {showMenu && (
                        <div className="dropdown-menu">
                            <div className="menu-item">
                                <label>Language Preference:</label>
                                <LanguageSelector
                                    selectedLanguage={selectedLanguage || "en"}
                                    onLanguageChange={(lang) => {
                                        if (onLanguageChange) onLanguageChange(lang);
                                        setShowMenu(false);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
