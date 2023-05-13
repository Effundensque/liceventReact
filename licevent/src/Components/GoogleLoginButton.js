import React, { useEffect, useState } from 'react';
import jwt from 'jwt-decode'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';


function GoogleLoginButton() {
  const [user, setUser] = useState('');
  const [isLoggedIn, setLoggedIn] = useState('')


  async function register(family_name_p,given_name_p, email_p, picture_p)
  {
    
    const requestOptions = {method: 'POST',headers:{"Content-Type":"application/json"}, 
    body:JSON.stringify({name:family_name_p,given_name:given_name_p,email:email_p,picture:picture_p})}
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`,requestOptions)
    const data = await response.json()
    console.log(data)
    localStorage.setItem('tokenId', data.token);
    window.location.replace('/');
  }

  const handleLoginSuccess =  (credentialResponse) => {
    const credential = credentialResponse.credential;
    const user =  jwt(credential);
    console.log(user)
    setUser(user)
    setLoggedIn(true)
    localStorage.setItem('loggedIn', true);
    register(user.family_name,user.given_name, user.email, user.picture)

  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };



  const loged = localStorage.getItem('loggedIn');
  const userToken = localStorage.getItem('tokenId');
  const [currentUser, setCurrentUser] = useState('');
  async function getUser(userToken_p)
  {
  
  const requestOptions = {method: 'POST',headers:{"Content-Type":"application/json"}, 
  body:JSON.stringify({token:userToken_p})}
  const response = await fetch(`${process.env.REACT_APP_API_URL}/usersToken`,requestOptions)
  const data = await response.json()
  setCurrentUser(data[0])
  }
  
  useEffect(()=>{
  if (loged==='true')
  {
      getUser(userToken)
  }
  },[loged])



  return (
    <div>
        {loged ?
        (
        <div></div>
        )
        :
        (
            <GoogleOAuthProvider clientId="260785947812-p3456ctcupblvifgkgrud4bd3u8v68rd.apps.googleusercontent.com">
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
