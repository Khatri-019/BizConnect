import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { useConversations } from '../contexts/ConversationsProvider';
import './MessagingInterface.css';

const MessagingInterface = () => {

    const {conversations, selectedId} = useConversations();
    const activeConversation = conversations.find(c => c.id === selectedId) ?? null;

    return (
        <div className="messaging-container">
            <LeftPanel/>
            <RightPanel conversation={activeConversation} />
        </div>
    );
};

export default MessagingInterface;
