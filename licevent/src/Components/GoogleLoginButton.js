import React, { useEffect, useState } from 'react';
import jwt from 'jwt-decode'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';


function GoogleLoginButton() {
  const [user, setUser] = useState('');
  const [isLoggedIn, setLoggedIn] = useState('')


  async function register(family_name_p, given_name_p, email_p, picture_p) {

    const requestOptions = {
      method: 'POST', headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: family_name_p, given_name: given_name_p, email: email_p, picture: picture_p })
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, requestOptions)
    const data = await response.json()
    console.log(data)
    if (data.message !== 'User already exists')
    {
      SendInvitation(email_p,data.password)
      alert("The information used to login to your organized events was sent on your email.");
    }
    localStorage.setItem('tokenId', data.token);
    localStorage.setItem('password', data.password);
    console.log("Parola iti este:", data.password);
    console.log("Recipient email is ", data);
    //TO DO: send email.
    
    window.location.replace('/');
  }

  async function SendInvitation(email, passorla) {
    const emailContent = `
    You can log into your managed event's websites using the information below:
    The email is: ${email}
    The password is: ${passorla}`
    const emailSubject = `Invitation to event`;
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, emailContent: emailContent, emailSubject: emailSubject })
        });

        if (response.ok) {
            console.log('Email sent successfully!');
        } else {
            console.log('Failed to send email.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

  const handleLoginSuccess = (credentialResponse) => {
    const credential = credentialResponse.credential;
    const user = jwt(credential);
    console.log(user)
    setUser(user)
    setLoggedIn(true)
    localStorage.setItem('loggedIn', true);
    register(user.family_name, user.given_name, user.email, user.picture)

  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };



  const loged = localStorage.getItem('loggedIn');
  const userToken = localStorage.getItem('tokenId');
  const [currentUser, setCurrentUser] = useState('');
  async function getUser(userToken_p) {

    const requestOptions = {
      method: 'POST', headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken_p })
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/usersToken`, requestOptions)
    const data = await response.json()
    setCurrentUser(data[0])
  }

  useEffect(() => {
    if (loged === 'true') {
      getUser(userToken)
    }
  }, [loged])



  return (
    <div>
      {loged ?
        (
          <div></div>
        )
        :
        (
          <GoogleOAuthProvider clientId="73405800416-d2grsucel9o4p7oq99o0thqesca0uen1.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          </GoogleOAuthProvider>
        )}


    </div>
  );
};

export default GoogleLoginButton;
