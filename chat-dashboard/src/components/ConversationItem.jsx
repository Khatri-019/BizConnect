import "./ConversationItem.css";

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

function ConversationItem({ conversation, onSelect, isActive }) {
  const { user, lastMessage, lastMessageAt, unreadCount } = conversation;

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className={`conversation-item ${isActive ? "active" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(); }}
    >
      <img 
        src={user?.img || user?.avatar || getDefaultAvatar(user?.name)} 
        alt={user?.name || "User"} 
        className="avatar"
        onError={(e) => {
          // Fallback to default avatar if image fails to load
          const defaultAvatar = getDefaultAvatar(user?.name);
          if (e.target.src !== defaultAvatar) {
            e.target.src = defaultAvatar;
          }
        }}
      />
      <div className="conversation-meta">
        <div className="conversation-top">
          <span className="name">{user?.name || "Unknown User"}</span>
          <span className="time">{formatTime(lastMessageAt)}</span>
        </div>
        <div className="conversation-bottom">
          <span className="last-message">{lastMessage || "No messages yet"}</span>
          {/* render badge only when unreadCount > 0 */}
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </div>
      </div>
    </div>
  );
}

export default ConversationItem;
// ...existing code...