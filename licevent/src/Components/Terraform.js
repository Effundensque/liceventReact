import React, { useState } from 'react'

function Terraform() {


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const fileResponse = await fetch(`${process.env.REACT_APP_API_URL}/terraform`,{method:'GET'});
      const fileData = await fileResponse.text();

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
      <h1>Execute Terraform Command</h1>
        <button type="submit" onClick={handleSubmit}>Execute</button>
    </div>
  )
}

export default Terraform
