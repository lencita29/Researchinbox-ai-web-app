import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Inbox.css'; // Separate CSS for Inbox page
import ReplyDialog from './ReplyDialog'; // Import the ReplyDialog component
import DeleteConfirmationDialog from './DeleteConfirmationDialog'; // Import the DeleteConfirmationDialog component

const Inbox = () => {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [emails, setEmails] = useState([
    { address: 'Beata@gmail.com', date: 'Mar 7', subject: 'I\'ve tried a lot and...', status: 'Interested', campaignName: 'Campaign Name' },
    // Add more emails here...
  ]);

  const openReplyDialog = () => {
    if (selectedEmail) {
      setIsReplyDialogOpen(true);
    }
  };

  const closeReplyDialog = () => {
    setIsReplyDialogOpen(false);
    setSelectedEmail(null);
  };

  const openDeleteConfirmationDialog = (email) => {
    setEmailToDelete(email);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteConfirmationDialog = (confirm) => {
    if (confirm && emailToDelete) {
      setEmails(emails.filter(email => email !== emailToDelete));
    }
    setIsDeleteDialogOpen(false);
    setEmailToDelete(null);
  };

  const handleAddEmail = (newEmail) => {
    setEmails([newEmail, ...emails]); // Add new email to the top
  };

  return (
    <div className="inbox-container">
      <div className="inbox-sidebar">
        <h2>All Inbox(s) <i className="fas fa-chevron-down"></i></h2>
        <p>25/25 Inboxes selected</p>
        <input type="text" placeholder="Search" className="inbox-search" />
        <div className="new-replies">
          <span>26</span> New Replies
          <span>Newest <i className="fas fa-sort-down"></i></span>
        </div>
        <div className="email-list">
          {emails.map((email, index) => (
            <div key={index} className="email-item">
              <div className="email-info">
                <span className="email-address">{email.address}</span>
                <span className="email-date">{email.date}</span>
              </div>
              <p>{email.subject}</p>
              <span className={`email-status ${email.status.toLowerCase()}`}>{email.status}</span>
              <span className="campaign-name">{email.campaignName}</span>
              <button className="delete-button" onClick={() => openDeleteConfirmationDialog(email)}>Delete</button>
              <div className="email-actions">
                <button onClick={() => setSelectedEmail(email)}>Select</button>
              </div>
            </div>
          ))}
        </div>
        <Link to="/add-mail" className="compose-button">Compose New Email</Link>
      </div>
      <div className="email-content">
        {selectedEmail && (
          <>
            <div className="email-header">
              <h3>{selectedEmail.address}</h3>
              <div className="email-details">
                <span>{selectedEmail.address}</span>
                <span><i className="fas fa-circle"></i> Meeting Completed</span>
                <button className="move-button">Move <i className="fas fa-chevron-down"></i></button>
              </div>
            </div>
            <div className="email-body">
              <h4>{selectedEmail.subject}</h4>
              <p>from: jeanne@icloud.com cc: lennon.j@mail.com</p>
              <p>to: lennon.j@mail.com</p>
              <p>Hi {`{FIRST_NAME}`},</p>
              <p>
                I would like to introduce you to SaaSgrow, a productized design service specifically tailored for SaaS startups. Our aim is to help you enhance the user experience and boost the visual appeal of your software products.
              </p>
            </div>
          </>
        )}
      </div>
      <div className="lead-details">
        <h3>Lead Details</h3>
        <p><strong>Name:</strong> Orlando</p>
        <p><strong>Contact No:</strong> +54-9062827869</p>
        <p><strong>Email ID:</strong> orlando@gmail.com</p>
        <p><strong>LinkedIn:</strong> linkedin.com/in/timvadde/</p>
        <p><strong>Company Name:</strong> Reachinbox</p>
        <h3>Activities</h3>
        <div className="campaign-steps">
          <h4>Campaign Name</h4>
          <p>3 Steps | 5 Days in Sequence</p>
          <div className="step">
            <p>Step 1: Email</p>
            <p>Sent 3rd, Feb</p>
          </div>
          <div className="step">
            <p>Step 2: Email</p>
            <p>Opened 5th, Feb</p>
          </div>
          <div className="step">
            <p>Step 3: Email</p>
            <p>Opened 5th, Feb</p>
          </div>
        </div>
      </div>
      <div className="email-actions-container">
        <button 
          className="reply-button"
          onClick={openReplyDialog}
          disabled={!selectedEmail}
        >
          Reply
        </button>
      </div>
      {isReplyDialogOpen && <ReplyDialog email={selectedEmail} onClose={closeReplyDialog} />}
      {isDeleteDialogOpen && <DeleteConfirmationDialog onClose={closeDeleteConfirmationDialog} />}
    </div>
  );
};

export default Inbox;
