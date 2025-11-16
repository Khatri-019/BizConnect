import "./ConversationItem.css";
function ConversationItem({ conversation, onSelect, isActive }) {
  const { user, lastMessage, time, unreadCount} = conversation;

  return (
    <div
      className={`conversation-item ${isActive ? "active" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(); }}
    >
      <img src={user.avatar} alt={user.name} className="avatar" />
      <div className="conversation-meta">
        <div className="conversation-top">
          <span className="name">{user.name}</span>
          <span className="time">{time}</span>
        </div>
        <div className="conversation-bottom">
          <span className="last-message">{lastMessage}</span>
          {/* render badge only when unreadCount > 0 */}
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </div>
      </div>
    </div>
  );
}

export default ConversationItem;
// ...existing code...