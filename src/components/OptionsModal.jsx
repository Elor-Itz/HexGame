import React, { useState, useEffect } from 'react';
import useOptions from '../hooks/useOptions';
import '../styles/OptionsModal.css';
import appearanceIconB from '../assets/icons/options-appearance-b.png';
import appearanceIconW from '../assets/icons/options-appearance-w.png';
import soundIconB from '../assets/icons/options-sound-b.png';
import soundIconW from '../assets/icons/options-sound-w.png';

const OptionsModal = ({ show, onClose }) => {
    const [activeTab, setActiveTab] = useState('appearance');
    const { theme, colorScheme, volume, updateTheme, updateColorScheme, updateVolume } = useOptions();    
    const [tempTheme, setTempTheme] = useState(theme);
    const [tempColorScheme, setTempColorScheme] = useState(colorScheme);  
    const [tempVolume, setTempVolume] = useState(volume);   

    // Sync temp settings with initial settings when the modal opens
    useEffect(() => {
        if (show) {
            setTempTheme(theme);
            setTempColorScheme(colorScheme);
            setTempVolume(volume);
        }
    }, [show, theme, colorScheme, volume]);

    // Handle the tab click event
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Handle the theme change event
    const handleThemeChange = (theme) => {
        setTempTheme(theme);        
        document.body.className = theme;
    };

    // Handle the scheme change event
    const handleColorSchemeChange = (colorScheme) => {
        setTempColorScheme(colorScheme);
    };
    
    // Handle the volume change event
    const handleVolumeChange = (event) => {
        setTempVolume(event.target.value);                
    };

    // Handle the save event
    const handleSave = () => {        
        updateTheme(tempTheme);
        updateColorScheme(tempColorScheme);
        updateVolume(tempVolume);                             
    };
    
    // Handle restore to default event
    const handleRestoreDefault = () => {
        updateTheme('');
        updateVolume(50);                      
    };    

    // Cancel changes and restore previous settings
    const handleCancel = () => {        
        updateTheme(theme);        
        updateVolume(volume);
        onClose();
    };

    // Get the icon based on the tab
    const getIcon = (tab) => {
        if (tab === 'appearance') {
            return tempTheme.includes('dark') ? appearanceIconW : appearanceIconB;
        } else if (tab === 'sound') {
            return tempTheme.includes('dark') ? soundIconW : soundIconB;
        }
    };

    if (!show) return null;    

    return (
        <div className="options-modal">
            <div className="options-modal-content">
                <button className="options-close" onClick={handleCancel}>&times;</button>                 
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
                            <div className="theme-control">
                                <label htmlFor="theme-box">
                                    Theme:
                                    <select id="theme-box" value={tempTheme} onChange={(e) => handleThemeChange(e.target.value)}>
                                        <option value="">Light (Default)</option>                                    
                                        <option value="theme-dark">Dark</option>
                                        <option value="theme-classic">Classic</option>
                                        <option value="theme-classic-dark">Classic Dark</option>                                    
                                    </select>
                                </label>  
                            </div>
                            <div className="scheme-control">
                                <label htmlFor="scheme-box">
                                    Default Color Scheme:
                                    <select id="theme-box" value={tempColorScheme} onChange={(e) => handleColorSchemeChange(e.target.value)}>
                                        <option value="black-white">Black-White</option>                                    
                                        <option value="red-blue">Red-Blue</option>                                                                            
                                    </select>
                                </label>  
                            </div>                                                      
                        </div>
                    )}
                    {activeTab === 'sound' && (
                        <div className="sound-tab">
                            <h2>Sound</h2>
                            <div className="volume-control">
                                <label htmlFor="volume-control">Volume:</label>
                                <input
                                    type="range"
                                    id="volume-control"
                                    min="0"
                                    max="100"
                                    value={tempVolume}
                                    onChange={handleVolumeChange}
                                />
                            </div>
                        </div>
                    )}
                    <div className="options-modal-footer">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleRestoreDefault}>Restore Default</button>
                </div>                    
                </div>                                
            </div>
        </div>
    );
};

export default OptionsModal;