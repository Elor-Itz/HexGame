import React from 'react';
import Modal from './Modal';
import '../styles/Modal.css';
import img1 from '../assets/images/how-to-play-img1.png';

const HowToPlayModal = ({ show, onClose }) => {
    return (
        <Modal isVisible={show} onClose={onClose}>
            <div className="modal-content">
                <h2>How to Play:</h2>
                <img src={img1} alt="Image1" className="modal-image" />
                <h3>Basic Strategy</h3>
                <p>
                    Hex is a game played by two players on an n×n sized hexagonal board. 
                    Each turn, a player places a stone of their color on an empty cell.                                                                                    
                </p>
                <p>                                
                    Your goal is to form a connected path of your color, linking two opposite sides of the board: <span style={{ color: 'black', fontWeight: 'bold' }}>Player 1</span> connects top and bottom, while <span style={{ color: 'white', fontWeight: 'bold' }}>Player 2</span> connects left and right.
                    The player who completes such a connection wins the game!                                                           
                </p>  
                <p>
                    A standard game is played on a 11×11 board, but you can adjust the size to make the game more challenging (or easier).                                                                                 
                </p>                     
                <h3>The Swap Rule</h3>
                <p>
                    The first player always gains the initiative, and will therefore have a major advantage. The swap rule allows the second player to switch moves with the first player after the first player's first move.
                    This rule is optional and can be enabled or disabled before starting the game.
                </p>
            </div>
        </Modal>
    );
};

export default HowToPlayModal;