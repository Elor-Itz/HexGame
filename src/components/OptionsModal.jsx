import React, { useState } from 'react';
import '../styles/OptionsModal.css';

const OptionsModal = ({ show, onClose, onThemeChange, onVolumeChange }) => {
    const [activeTab, setActiveTab] = useState('appearance');
    const [volume, setVolume] = useState(50);

    // Handle the tab click event
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Handle the volume change event
    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        onVolumeChange(newVolume);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="options-modal">
            <div className="options-modal-content">
                <button className="options-close" onClick={onClose}>&times;</button>                 
                <div className="options-modal-header">
                    <button onClick={() => handleTabClick('appearance')} className={activeTab === 'appearance' ? 'active' : ''}>Appearance</button>
                    <button onClick={() => handleTabClick('sound')} className={activeTab === 'sound' ? 'active' : ''}>Sound</button>
                   
                </div>
                <div className="options-modal-body">
                    {activeTab === 'appearance' && (
                        <div className="appearance-tab">
                            <h2>Appearance</h2>
                            <label htmlFor="theme-box">
                                Theme:
                                <select id="theme-box" onChange={(e) => onThemeChange(e.target.value)}>
                                    <option value="">Light (Default)</option>                                    
                                    <option value="theme-dark">Dark</option>
                                    <option value="theme-classic">Classic</option>
                                    <option value="theme-classic-dark">Classic Dark</option>                                    
                                </select>
                            </label>                            
                        </div>
                    )}
                    {activeTab === 'sound' && (
                        <div className="sound-tab">
                            <h2>Sound</h2>
                            <label htmlFor="volume-control">Volume:</label>
                            <input
                                type="range"
                                id="volume-control"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OptionsModal;