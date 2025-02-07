import { useState } from 'react';

const useTurnCounter = (initialTurn = 1) => {
    const [turn, setTurn] = useState(initialTurn);

    // Increment the turn by 1
    const incrementTurnCount = () => {
        setTurn((prevTurn) => {            
            return prevTurn + 1;
        });
    };    
    
    // Reset turn to the initial value
    const resetTurnCount = () => {
        setTurn(initialTurn);
    };

    return { turn, incrementTurnCount, resetTurnCount };
};

export default useTurnCounter;