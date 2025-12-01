import React from 'react';
import './WarningModal.css';

const WarningModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="warning-modal-overlay" onClick={onClose}>
      <div className="warning-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="warning-modal-header">
          <span className="warning-icon">⚠️</span>
          <h3>Warning</h3>
        </div>
        <div className="warning-modal-body">
          <p>{message || "Please do not use offensive language, your account might be suspended."}</p>
        </div>
        <div className="warning-modal-footer">
          <button className="warning-modal-button" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;

