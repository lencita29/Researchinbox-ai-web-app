import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // CSS for styling the login page

const Login = () => {
  const navigate = useNavigate();

  // Function to handle the Google login process
  const handleGoogleLogin = () => {
    // Redirect to Google Login API
    const redirectUrl = 'https://hiring.reachinbox.xyz/api/v1/auth/google-login?redirect_to=http://localhost:3000/onebox';
    window.location.href = redirectUrl;
  };

  // Function to extract the token from the URL and handle redirection
  const extractTokenAndRedirect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('authToken', token);

      // Redirect to the Onebox page after storing the token
      navigate('/onebox');
    }
  };

  // Run the token extraction and redirection logic when the component mounts
  useEffect(() => {
    extractTokenAndRedirect();
  }, []);

  return (
    <div className="login-container">
      <div className="title-container">
        <img src='/assets/logogmail.png' alt="Mail Icon" className="small-mail-icon" />
        <span className="small-app-title">REACHIN BOX AI</span>
      </div>
      <div className="login-box">
        <h2>Create a new account</h2>
        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Icon" />
          Sign Up with Google
        </button>
        <button className="create-account-btn" onClick={() => navigate('/onebox')}>
          Create an Account
        </button>
        <p>Already have an account? <span onClick={() => navigate('/signin')}>Sign In</span></p>
      </div>
    </div>
  );
};

export default Login;
