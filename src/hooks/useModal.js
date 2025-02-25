import { useState } from 'react';

const useModal = () => {
    const [isVisible, setVisible] = useState(false);

    const open = () => setVisible(true);
    const close = () => setVisible(false);
    
    return { isVisible, open, close };
};

export default useModal;