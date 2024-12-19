import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
// import Footer from '../layout/Footer';
import '../css/layout/Layout-main.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar state

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState); // Toggle sidebar state
  };

  return (
    <div className={`layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Navbar toggleSidebar={toggleSidebar} /> {/* Pass toggle function */}
      <div className="main-content-wrapper">
        <Sidebar isSidebarOpen={isSidebarOpen} /> {/* Pass sidebar state */}
        <div className="main-content">{children}</div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
