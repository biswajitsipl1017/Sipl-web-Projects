// import React, { useState } from 'react';
import React from 'react';
import '../css/layout/Navbar.css';
import CurrentDateTime from './CurrentDateTime';
// import ThemeToggle from '../../contexts/ThemeToggle';


const Navbar = ({ toggleSidebar }) => {
  // const [userDetails, setUserDetails] = useState(null); 
  
  const storedUserDetails = JSON.parse(sessionStorage.getItem('user'));
  // console.log('Details:', storedUserDetails);

  // setUserDetails(storedUserDetails);
  // console.log(userDetails);

  const sessionValues = {
    userID: storedUserDetails.userID || 'Guest',
    userName: storedUserDetails.userName || 'Guest User',
    superUser: storedUserDetails.superUser || 'No',
    compCode: storedUserDetails.compCode || 'Guest CCode',
    compName: storedUserDetails.compName || 'Guest CName',
    location: storedUserDetails.location || 'Guest location',
  };

  const handleLogout = () => {
    // Clear session storage or perform logout logic
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span>CRM</span>
      </div>
      <div className="menu-icon" onClick={toggleSidebar}>
        <i className="tf-icons ri-menu-line"></i> {/* Menu icon */}
      </div>
      <div className="nav-search">
        <div className="input-group input-group-sm">
          <span className="input-group-text"><i className="tf-icons ri-search-line"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
          />
        </div>
      </div>
      <CurrentDateTime />
      {/* <ThemeToggle /> */}
      <div className="profile-dropdown">
          <button className="profile-icon">👤</button>
          <div className="profile-popup">
          <div className="profile-details">
            <p>
              <small className='fw-bold'>User ID: </small><small>
                 {sessionValues.userID}</small>
            </p>
            <p>
              <small className='fw-bold'>Name: </small><small>
                {sessionValues.userName}</small>
            </p>
            <p>
              <small className='fw-bold'>Company Code: </small><small>
                {sessionValues.compCode}</small>
            </p>
            <p>
              <small className='fw-bold'>Company Name: </small>
              <small> {sessionValues.compName}</small>
            </p>
            <p>
              <small className='fw-bold'>Location: </small>
              <small> {sessionValues.location} </small>
            </p>
            <p>
              <small className='fw-bold'>Super User: </small>
              <small>
                {sessionValues.superUser}</small>
            </p>
          </div>
          <div className="dropdown-divider"></div>
          <div className="d-grid px-4 pt-2 pb-1">
            <button style={{width: "100%"}}
              className="btn btn-danger d-flex logout-button"
              onClick={handleLogout}
            >
              <small className="align-middle">Logout</small>
              <i className="ri-logout-box-r-line ms-2 ri-16px"></i>
            </button></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;