
import React from 'react';
import '../Style/App.css';
import Home from './Home';
import NavBar from './NavBar';
import Logout from './Logout';
import Create from './Create';
import GoogleLoginButton from './GoogleLoginButton'

import { BrowserRouter, BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {

  return (
  <div>
    
    <BrowserRouter>
   <NavBar />
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<GoogleLoginButton />} />
      <Route exact path="/logout" element={<Logout />} />
      <Route exact path="/create" element={<Create />} />
      
    </Routes>
    </BrowserRouter>
    
</div>
  );
}

export default App;
