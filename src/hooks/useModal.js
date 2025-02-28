import { useEffect, useState } from 'react';

const useModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(null);
    const [onCancel, setOnCancel] = useState(null);

    const open = (message, onConfirm, onCancel) => {
        setMessage(message);
        setOnConfirm(() => onConfirm);
        setOnCancel(() => onCancel);
        setIsVisible(true);
    };

    const close = () => {
        setIsVisible(false);
        setMessage('');
        setOnConfirm(null);
        setOnCancel(null);
    };

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
    
    return {
        isVisible,
        message,
        onConfirm,
        onCancel,
        open,
        close,
    };
};

export default useModal;