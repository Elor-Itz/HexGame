import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Modal.css';

const Modal = ({ isVisible, message, onClose, onConfirm, onCancel, children }) => {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>                
                {message && <p>{message}</p>}
                {children}
                {(onConfirm || onCancel) && (
                    <div className="modal-buttons">
                        {onConfirm && <button onClick={onConfirm}>Confirm</button>}
                        {onCancel && <button onClick={onCancel}>Cancel</button>}
                    </div>
                )}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isVisible: PropTypes.bool.isRequired,    
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    children: PropTypes.node,
};

export default Modal;