import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState, useEffect } from 'react';
import './Onebox.css';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ReplyDialog from './ReplyDialog';

// Define Sidebar Component
const Sidebar = ({ changePage }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img className="logo img" src="/assets/image2.png" alt="Logo" />
      </div>
      <div className="menu">
        <a href="#home" onClick={() => changePage('home')} className="menu-item">
          <i className="fas fa-home"></i>
        </a>
        <a href="#inbox" onClick={() => changePage('inbox')} className="menu-item">
          <i className="fas fa-inbox"></i>
        </a>
        <a href="#profile" onClick={() => changePage('profile')} className="menu-item">
          <i className="fas fa-user"></i>
        </a>
        <a href="#analytics" onClick={() => changePage('analytics')} className="menu-item">
          <i className="fas fa-chart-line"></i>
        </a>
        <a href="#settings" onClick={() => changePage('settings')} className="menu-item">
          <i className="fas fa-cog"></i>
        </a>
      </div>
      <div className="sidebar-footer">
        <div className="profile">
          <span className="initials">AS</span>
        </div>
      </div>
    </div>
  );
};

// Define Header Component
const Header = ({ toggleTheme, isDarkTheme }) => {
  return (
    <div className="header">
      <h1>Onebox</h1>
      <div className="header-right">
        <button className="toggle-theme" onClick={toggleTheme}>
          <i className={`fas ${isDarkTheme ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
        <span className="workspace-text">Tim's Workspace</span>
      </div>
    </div>
  );
};

const Onebox = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activePage, setActivePage] = useState('inbox'); // Set default page to 'inbox'
  const [inboxItems, setInboxItems] = useState([]); 
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);

  const API_BASE_URL = 'https://hiring.reachinbox.xyz/api/v1/onebox'; 

  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token:', token); // Debugging log for the token
    return token;
  };

  const fetchWithAuth = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        if (response.status === 404) {
          alert('The requested resource was not found.');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      console.log('Response JSON:', jsonData); // Debugging log to check the response JSON
      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  };
  
  // Fetch emails from the API and update state
  const getOneboxList = async () => {
    const url = `${API_BASE_URL}/list`;
    const token = getAuthToken();
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetchWithAuth(url, options);
      console.log('Data fetched:', response); // Debugging log to check fetched data

      if (response && response.data && Array.isArray(response.data)) {
        setInboxItems(response.data); // Update state with the emails from the 'data' field
      } else {
        console.error('Unexpected data format:', response);
        setInboxItems([]); // Fallback to an empty array if the data format is unexpected
      }
    } catch (error) {
      console.error('Error fetching onebox list:', error.message);
    }
  };

  // Fetch the emails on component mount
  useEffect(() => {
    getOneboxList();
  }, []);

  const getEmailDetails = async (threadId) => {
    const url = `${API_BASE_URL}/messages/${threadId}`;
    console.log('Fetching email details from URL:', url); // Log the URL
    const token = getAuthToken();
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  
    try {
      const data = await fetchWithAuth(url, options);
      return data;
    } catch (error) {
      console.error('Error fetching email details:', error.message);
      return null;
    }
  };
  
  const deleteEmail = async (emailId) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/messages/${emailId}`, { method: 'DELETE' });
      setInboxItems(inboxItems.filter(item => item.id !== emailId));
      setSelectedEmail(null);
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log('Key pressed:', event.key); // Debugging log for key events
      if ((event.key === 'd' || event.key === 'D') && selectedEmail) {
        setShowDeleteDialog(true); // Open the delete confirmation dialog
      } else if ((event.key === 'r' || event.key === 'R') && selectedEmail) {
        setShowReplyDialog(true); // Open the reply dialog
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEmail]); // Depend on selectedEmail to ensure it refers to the latest email

  const handleDelete = () => {
    if (selectedEmail) {
      deleteEmail(selectedEmail.id);
      setShowDeleteDialog(false); // Close the delete dialog after deletion
    }
  };

  const handleReply = () => {
    if (selectedEmail) {
      setShowReplyDialog(true); // Open the reply dialog only if an email is selected
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const changePage = (page) => {
    setActivePage(page);
  };

  const handleEmailClick = async (email) => {
    console.log('Clicked email ID:', email.thread_id); // Log the thread ID
    const details = await getEmailDetails(email.thread_id);
    if (details) {
      console.log('Email details:', details); // Log fetched details
      setSelectedEmail(details);
    } else {
      console.error('Failed to fetch email details.');
      setSelectedEmail(null);
    }
  };
  
  const handleCloseDialog = (confirm) => {
    setShowDeleteDialog(false);
    if (confirm) {
      handleDelete();
    }
  };

  const handleCloseReplyDialog = () => {
    setShowReplyDialog(false);
  };

  return (
    <div className={`onebox-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <Sidebar changePage={changePage} />
      <div className="main-content">
        <Header toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        {activePage === 'inbox' ? (
          <div className="inbox-layout">
            <div className="left-column">
              <h3>All Inbox</h3>
              <ul className="inbox-list">
                {Array.isArray(inboxItems) && inboxItems.length > 0 ? (
                  inboxItems.map((item) => (
                    <li
                      key={item.id}
                      className={`inbox-item ${selectedEmail && selectedEmail.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleEmailClick(item)}
                    >
                      <strong>{item.sender}</strong>: {item.subject}
                    </li>
                  ))
                ) : (
                  <p>No emails available.</p>
                )}
              </ul>
            </div>
            <div className="middle-column">
              <div className="middle-header">
                <h3>Email Content</h3>
              </div>
              <div className="email-content">
                {selectedEmail ? (
                  <>
                    <h4>From: {selectedEmail.sender}</h4>
                    <h5>Subject: {selectedEmail.subject}</h5>
                    <p>{selectedEmail.content}</p>
                  </>
                ) : (
                  <p>Select an email to view its content.</p>
                )}
              </div>
              {selectedEmail && (
                <button className="reply-button" onClick={handleReply}>
                  Reply
                </button>
              )}
            </div>
            <div className="right-column">
              <h3>Load Details</h3>
              <div className="activities-section"></div>
              <h3>Activities</h3>
              <div className="activities-section"></div>
            </div>
          </div>
        ) : (
          <div className="content-center">
            <img
              src="/assets/image.png"
              alt="Email Illustration"
              className="email-illustration"
            />
            <h2>It's the beginning of a legendary sales pipeline</h2>
            <p>When you have inbound emails, you'll see them here.</p>
          </div>
        )}
      </div>
      {showDeleteDialog && <DeleteConfirmationDialog onClose={handleCloseDialog} />}
      {showReplyDialog && selectedEmail && (
        <ReplyDialog isOpen={showReplyDialog} onClose={handleCloseReplyDialog} email={selectedEmail} />
      )}
    </div>
  );
};

export default Onebox;
