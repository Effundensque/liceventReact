import '../Style/NavBar.css';
import React, { useEffect, useState } from 'react';


function NavBar()
{
const isLoggedIn = localStorage.getItem('loggedIn');
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
if (isLoggedIn==='true')
{
    getUser(userToken)
}
},[isLoggedIn])

    return (
        <div>
         <nav id='watafac' className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a id='mama' className="navbar-brand" href="/">Licevent</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div className="navbar-nav mr-auto">
        <a className="nav-link active" aria-current="page" href="/">Home</a>
        <a className="nav-link" href="create">Create web invitation</a>
        <a className="nav-link" href="about">About Us</a>
      </div>
      <div className="navbar-nav ms-auto">
      {
            isLoggedIn ? 
            (
            <div>
              <a className="nav-link" href="logout">Logout</a>
            </div>)
            :
            (<div>
                 
              <a className="nav-link" href="login">Login</a>
                </div>
                
            )
            }

       
        
        
      </div>
    </div>
  </div>
</nav>



        </div>
    )
}

export default NavBar