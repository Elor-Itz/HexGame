import { useRef, useEffect } from 'react';
import player1Sound from '../assets/sounds/player1-sound.mp3';
import player2Sound from '../assets/sounds/player2-sound.mp3';
import winnerSound from '../assets/sounds/winner-sound.mp3';

const useAudio = () => {
    const player1SoundRef = useRef(new Audio(player1Sound));
    const player2SoundRef = useRef(new Audio(player2Sound));
    const winnerSoundRef = useRef(new Audio(winnerSound));

    const playPlayer1Sound = () => {
        player1SoundRef.current.play();
    };

    const playPlayer2Sound = () => {
        player2SoundRef.current.play();
    };

    const playWinnerSound = () => {
        winnerSoundRef.current.play();
    };

    // Cleanup function to pause and reset the audio when the component unmounts
    useEffect(() => {        
        return () => {
            player1SoundRef.current.pause();
            player1SoundRef.current.currentTime = 0;
            player2SoundRef.current.pause();
            player2SoundRef.current.currentTime = 0;
            winnerSoundRef.current.pause();
            winnerSoundRef.current.currentTime = 0;
        };
    }, []);

    return {        
        playPlayer1Sound,
        playPlayer2Sound,
        playWinnerSound
    };
};

export default useAudio;