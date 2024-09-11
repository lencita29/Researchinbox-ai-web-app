import React from 'react';
import './DeleteConfirmationDialog.css'; // Import CSS for styling the delete confirmation dialog

const DeleteConfirmationDialog = ({ onClose }) => {
  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation-dialog">
        <h2>Are you sure you want to delete this email?</h2>
        <div className="dialog-actions">
          <button className="confirm-button" onClick={() => onClose(true)}>
            Yes
          </button>
          <button className="cancel-button" onClick={() => onClose(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
