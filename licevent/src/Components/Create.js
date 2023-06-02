import Terraform from "./Terraform";

import React, { useEffect, useState } from 'react';
import GoogleLoginButton from './GoogleLoginButton';

function Create() {
  const isLoggedIn = localStorage.getItem('loggedIn');
  const userToken = localStorage.getItem('tokenId');

  const [currentUser, setCurrentUser] = useState('');


  //For creating a website
  const [websiteName, setWebsiteName] = useState('');
  const [websiteDate, setWebsiteDate] = useState('');
  const [websiteDescription, setWebsiteDescription] = useState('');
  const [websiteGuests, setWebsiteGuests] = useState('');
  const [websiteId, setWebsiteId] = useState('');

  async function getUser(userToken_p) {

    const requestOptions = {
      method: 'POST', headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken_p })
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/usersToken`, requestOptions)
    const data = await response.json()
    setCurrentUser(data[0])
  }


  useEffect( () => {
    if (websiteId)
    {
      async function addGuests(){
        const emailAddresses = websiteGuests.split(' ');
        for (const emailP of emailAddresses) {
           const requestOptionsGuestsAdd =  {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailP, websiteId: websiteId})
          };
    
          console.log(requestOptionsGuestsAdd);
          const resp = await fetch (`${process.env.REACT_APP_API_URL}/guests`,requestOptionsGuestsAdd)
        const dataGuests = await resp.json();
        console.log(dataGuests);
        setWebsiteId('');
      }
      runTerraform(websiteId);
      
    }
    addGuests();
    }
  }, [websiteId])

  async function handleSubmit() {

    const requestOptionsWebsiteAdd = {
      method: 'POST', headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: websiteName, userId: currentUser.id, description: websiteDescription })
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/website`, requestOptionsWebsiteAdd)
    const data = await response.json()
    setWebsiteId(data.web.id);

  }


  useEffect(() => {
    if (isLoggedIn === 'true') {
      getUser(userToken)
    }
  }, [isLoggedIn])

  const runTerraform = async (websiteId) => {
  
    try {
      const fileResponse = await fetch(`${process.env.REACT_APP_API_URL}/terraform`,{method:'GET'});
      console.log(fileResponse);
      var fileData = await fileResponse.text();
      fileData = fileData.replace("http://localhost:8080", `${process.env.REACT_APP_API_URL}`)
      fileData = fileData.replace("mamaAreMere",websiteId);
      console.log(fileData)
      // Make a POST request to your /terraform endpoint to send the file contents
      const response2 = await fetch(`${process.env.REACT_APP_API_URL}/terraform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ terraformCode: fileData })
      });
  
      const data = await response2.json()
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }


  return (
    <div>
      {isLoggedIn ?
        (
          <div>
            Name: {currentUser.name} {currentUser.given_name}

            {/* Create button */}
            <div className="createButton">
              <button type="button" className="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">Create</button>

            </div>
            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Create a new website</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">

                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Name of the website:</label>
                      <input type="email" className="form-control" id="nameInput" placeholder="licevent" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)}></input>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Date of the event:</label>
                      <input type="email" className="form-control" id="dateInput" placeholder="25/05/2023" value={websiteDate} onChange={(e) => setWebsiteDate(e.target.value)}></input>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlTextarea1" className="form-label">Description:</label>
                      <textarea className="form-control" id="descriptionInput" rows="3" placeholder="Description of the event" value={websiteDescription} onChange={(e) => setWebsiteDescription(e.target.value)}></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlTextarea1" className="form-label">Guests' emails:</label>
                      <textarea className="form-control" id="guestsInput" rows="3" placeholder="Enter the emails separated by a space" value={websiteGuests} onChange={(e) => setWebsiteGuests(e.target.value)}></textarea>
                    </div>


                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-dark" onClick={handleSubmit}>Create</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) :
        (
          <div>
            <GoogleLoginButton />
          </div>
        )}
    </div>


  )
}

export default Create;