import { useState } from 'react';

const useGameStatus = () => {
    const [status, setStatus] = useState("");
    const [isBoardDisabled, setIsBoardDisabled] = useState(false);
    const [isSurrenderDisabled, setIsSurrenderDisabled] = useState(false);

    const updateStatus = (status, isBoardDisabled, isSurrenderDisabled) => {
        setStatus(status);
        setIsBoardDisabled(isBoardDisabled);
        setIsSurrenderDisabled(isSurrenderDisabled);
    };

    return {
        status,
        setStatus,
        isBoardDisabled,
        setIsBoardDisabled,
        isSurrenderDisabled,
        setIsSurrenderDisabled,
        updateStatus
    };
};

export default useGameStatus;