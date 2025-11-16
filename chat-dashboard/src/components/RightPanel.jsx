import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import './RightPanel.css';

const RightPanel = ({ conversation }) => {
    if (!conversation) {
        return <div className="right-panel placeholder">Select a conversation to start messaging.</div>;
    }

    return (
        <section className="right-panel">
            <ChatHeader user={conversation.user} />
            <ChatWindow messages={conversation.messages} />
            <MessageInput />
        </section>
    );
};

export default RightPanel;
