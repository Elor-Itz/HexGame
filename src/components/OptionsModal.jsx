import React, { useState, useEffect } from 'react';
import '../styles/OptionsModal.css';
import appearanceIconB from '../assets/icons/options-appearance-b.png';
import appearanceIconW from '../assets/icons/options-appearance-w.png';
import soundIconB from '../assets/icons/options-sound-b.png';
import soundIconW from '../assets/icons/options-sound-w.png';

const OptionsModal = ({ show, onClose, onThemeChange, onVolumeChange }) => {
    const [activeTab, setActiveTab] = useState('appearance');
    const [currentTheme, setCurrentTheme] = useState('');
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

    // Handle the theme change event
    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        onThemeChange(theme);
    };

    useEffect(() => {
        // Set the initial theme based on the current theme
        setCurrentTheme(document.body.className);
    }, []);

    // Get the icon based on the tab
    const getIcon = (tab) => {
        if (tab === 'appearance') {
            return currentTheme.includes('dark') ? appearanceIconW : appearanceIconB;
        } else if (tab === 'sound') {
            return currentTheme.includes('dark') ? soundIconW : soundIconB;
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="options-modal">
            <div className="options-modal-content">
                <button className="options-close" onClick={onClose}>&times;</button>                 
                <div className="options-modal-header">
                    <button onClick={() => handleTabClick('appearance')} className={activeTab === 'appearance' ? 'active' : ''}>
                        <img src={getIcon('appearance')} alt="Appearance" />                       
                    </button>
                    <button onClick={() => handleTabClick('sound')} className={activeTab === 'sound' ? 'active' : ''}>
                        <img src={getIcon('sound')} alt="Sound" />                        
                    </button>
                </div>
                <div className="options-modal-body">
                    {activeTab === 'appearance' && (
                        <div className="appearance-tab">
                            <h2>Appearance</h2>
                            <label htmlFor="theme-box">
                                Theme:
                                <select id="theme-box" value={currentTheme} onChange={(e) => handleThemeChange(e.target.value)}>
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