import { useState } from 'react';

const useTurnCounter = (initialTurn = 1) => {
    const [turn, setTurn] = useState(initialTurn);

    // Increment the turn by 1
    const incrementTurn = () => {
        setTurn((prevTurn) => {            
            return prevTurn + 1;
        });
    };    
    
    // Reset turn to the initial value
    const resetTurn = () => {
        setTurn(initialTurn);
    };

    return { turn, incrementTurn, resetTurn };
};

export default useTurnCounter;