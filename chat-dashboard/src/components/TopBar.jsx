import React from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import './TopBar.css';

const TopBar = () => {
    return (
        <header className="top-bar">
            <h2>Messages</h2>
            <IoSettingsOutline size={22} className="icon" />
        </header>
    );
};

export default TopBar;
