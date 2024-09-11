import React, { useState } from 'react';
import './ReplyDialog.css';

const ReplyDialog = ({ isOpen, onClose, email }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = async () => {
    const API_BASE_URL = 'https://hiring.reachinbox.xyz/api/v1/onebox'; // Base URL for API
    if (email) {
      try {
        const response = await fetch(`${API_BASE_URL}/messages/${email.id}/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Use the token from localStorage
          },
          body: JSON.stringify({ content: replyContent }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Reply sent successfully!');
        onClose(); // Close the dialog after sending
      } catch (error) {
        console.error('Error sending reply:', error);
      }
    }
  };

  return (
    isOpen && (
      <div className="reply-dialog">
        <div className="reply-dialog-content">
          <h2>Reply to Email</h2>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Type your reply here..."
          ></textarea>
          <div className="reply-dialog-actions">
            <button onClick={handleReplySubmit}>Send</button>
            <button onClick={() => onClose()}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
};

export default ReplyDialog;
