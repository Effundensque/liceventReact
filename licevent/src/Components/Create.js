import '../Style/Create.css';
import { Modal } from 'react-bootstrap';

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
  const [showModal, setShowModal] = useState(false);



  async function getUser(userToken_p) {

    const requestOptions = {
      method: 'POST', headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken_p })
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/usersToken`, requestOptions)
    const data = await response.json()
    setCurrentUser(data[0])
    getWebsitesUserId(data[0].id);
  }


  useEffect(() => {
    if (websiteId) {
      async function addGuests() {
        const emailAddresses = websiteGuests.split(' ');
        for (const emailP of emailAddresses) {
          const requestOptionsGuestsAdd = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailP, websiteId: websiteId })
          };

          console.log(requestOptionsGuestsAdd);
          const resp = await fetch(`${process.env.REACT_APP_API_URL}/guests`, requestOptionsGuestsAdd)
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

    setShowModal(true);

    const requestOptionsWebsiteAdd = {
      method: 'POST', headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: websiteName, userId: currentUser.id, description: websiteDescription, date:websiteDate })
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

      const fileResponse = await fetch(`${process.env.REACT_APP_API_URL}/terraform`, { method: 'GET' });
      console.log(fileResponse);
      var fileData = await fileResponse.text();
      fileData = fileData.replace("http://localhost:8080", `${process.env.REACT_APP_API_URL}`)
      fileData = fileData.replace("mamaAreMere", websiteId);
      var websiteNameNoSpaces = websiteName;
      websiteNameNoSpaces = websiteNameNoSpaces.replaceAll(/\s/g, "");
      fileData=fileData.replaceAll("invitationWebsite", `${websiteNameNoSpaces}`);

      const response2 = await fetch(`${process.env.REACT_APP_API_URL}/terraform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ terraformCode: fileData })
      });

      const data = await response2.json()
      console.log(data)
      if (data.message == 'Terraform command executed successfully.') {
        modifyPublicIpWebsite(websiteId,data.publicIp);
        setShowModal(false);
      }
    } catch (err) {
      console.error(err)
    }
  }


  const [websites, setWebsites] = useState([]);
  async function getWebsitesUserId(userId) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId })
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/getWebsite`, requestOptions);
    const data = await response.json();
    console.log("Websites: ", data.website);
    setWebsites(data.website);

  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  async function modifyPublicIpWebsite(webId, publicIp){
    var pubIp = publicIp;
    pubIp = pubIp.replace("\"",'');
    pubIp = pubIp.replace("\"",'');
    const requestOptions={
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({websiteId:webId, publicip:pubIp})
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/website`,requestOptions);
    const data = await response.json();
    console.log(data);
  }

  function ceva(element)
  {
    window.location.href = element.publicip
  }

  return (
    <div>
      {isLoggedIn ?
        (
          <div>
            <div id='Name'>Hello, {currentUser.name} {currentUser.given_name}</div>
            {/* Showing the current websites */}
            <div id='currentWebsitestext'>These are your current websites:</div>
            <div id='websitesDiv' className="list-group">
              {websites.map((element, index) => (
                <a key={index} href={`http://${element.publicip}`} className="list-group-item list-group-item-action">
                  {element.name}
                </a>
              ))}
            </div>

            {/* Create button */}

            <div className="createButton">
              Create a new website:
              <button id='butonCreate' type="button" className="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">Create</button>

            </div>

            {/* Modal Loading */}
            <div>
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Success! Creating the website...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div id='loadingDialog'>
                    <iframe id='iframe' src="https://giphy.com/embed/3oEjI6SIIHBdRxXI40" width="50" height="50" className="giphy-embed" allowFullScreen></iframe>
                    <div id='loadingText'>Please wait for the website to be created! Do not close this window!</div>
                    <div> This might take anywhere between 5 to 10 minutes.</div>
                  </div>
                </Modal.Body>
              </Modal>
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
                    <button type="button" className="btn btn-dark" data-bs-dismiss="modal" onClick={handleSubmit}>Create</button>
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