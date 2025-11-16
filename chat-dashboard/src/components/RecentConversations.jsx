import ConversationItem from "./ConversationItem";
import { useConversations } from "../contexts/ConversationsProvider"; 
import "./RecentConversations.css";

function RecentConversations() {
  
  // Consuming the context directly
  const { conversations, selectConversation, selectedId } = useConversations();

  return (
    <div className="recent-conversations">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === selectedId}
          onSelect={() => selectConversation(conv.id)}
        />
      ))}
    </div>
  );
}

export default RecentConversations;