import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { useConversations } from '../contexts/ConversationsProvider';
import './MessagingInterface.css';

const MessagingInterface = () => {
    const { loading } = useConversations();

    if (loading) {
        return (
            <div className="messaging-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Loading conversations...</p>
            </div>
        );
    }

    return (
        <div className="messaging-container">
            <LeftPanel/>
            <RightPanel />
        </div>
    );
};

export default MessagingInterface;
