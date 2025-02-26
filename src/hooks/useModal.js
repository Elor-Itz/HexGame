import { useEffect, useState } from 'react';

const useModal = () => {
    const [isVisible, setVisible] = useState(false);

    const open = () => setVisible(true);
    const close = () => setVisible(false);

    // Close the modal on Esc key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            document.activeElement.blur();
            if (event.key === 'Escape' && isVisible) {
                 close();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible]);
    
    return { isVisible, open, close };
};

export default useModal;