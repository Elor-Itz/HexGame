import React from 'react';
import '../styles/Modal.css';

const Modal = ({ message, onClose, children }) => {
    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                {message ? <p>{message}</p> : children}
            </div>
        </div>
    );
};

export default Modal;