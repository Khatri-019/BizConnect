import TopBar from './TopBar';
import RecentConversations from './RecentConversations';
import { FiSearch } from 'react-icons/fi';
import './LeftPanel.css';

const LeftPanel = () => {
    return (
        <aside className="left-panel">
            <TopBar />
            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input type="text" placeholder="Search conversations..." />
            </div>
            <RecentConversations/>
        </aside>
    );
};

export default LeftPanel;
