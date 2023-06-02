import React, { useEffect } from "react"
function Logout(){

    useEffect(()=>{
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('tokenId');
        localStorage.removeItem('password');
        window.location.replace('/');
    },[1])

    return (<>

    </>)
}

export default Logout