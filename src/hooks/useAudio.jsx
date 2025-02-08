import { useRef } from 'react';

const useAudio = () => {
    const player1SoundRef = useRef(null);
    const player2SoundRef = useRef(null);
    const winnerSoundRef = useRef(null);

    const playPlayer1Sound = () => {
        player1SoundRef.current.play();
    };

    const playPlayer2Sound = () => {
        player2SoundRef.current.play();
    };

    const playWinnerSound = () => {
        winnerSoundRef.current.play();
    };

    return {
        player1SoundRef,
        player2SoundRef,
        winnerSoundRef,
        playPlayer1Sound,
        playPlayer2Sound,
        playWinnerSound
    };
};

export default useAudio;