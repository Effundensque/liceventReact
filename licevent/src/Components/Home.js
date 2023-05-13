
import '../Style/Home.css';
import React, { useEffect, useState } from 'react';
function Home(){
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
           <div className="invitation">Create your own website invitation</div>
        </div>
    )

}


export default Home;