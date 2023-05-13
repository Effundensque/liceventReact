import React, { useEffect } from "react"
function Logout(){

    useEffect(()=>{
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('tokenId');
        window.location.replace('/');
    },[1])

    return (<>

    </>)
}

export default Logout