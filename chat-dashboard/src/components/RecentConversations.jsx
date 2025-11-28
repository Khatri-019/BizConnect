import ConversationItem from "./ConversationItem";
import { useConversations } from "../contexts/ConversationsProvider"; 
import "./RecentConversations.css";

function RecentConversations() {
  
  // Consuming the context directly
  const { conversations, selectConversation, selectedId } = useConversations();

  return (
    <div className="recent-conversations">
      {conversations.map((conv) => {
        // Ensure we have a stable, unique key
        const convId = conv.id || conv._id || `conv-${Math.random()}`;
        return (
          <ConversationItem
            key={convId}
            conversation={conv}
            isActive={convId === selectedId}
            onSelect={() => selectConversation(convId)}
          />
        );
      })}
    </div>
  );
}

export default RecentConversations;