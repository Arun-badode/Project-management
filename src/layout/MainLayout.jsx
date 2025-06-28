// layouts/MainLayout.jsx
import React from 'react';

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ isSidebarCollapsed, toggleSidebar, menusidebarcollaps }) => {
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Sidebar collapsed={isSidebarCollapsed} menuItemClick={menusidebarcollaps} />
        <div className={`right-side-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <Outlet /> {/* Dashboard and inner routes render here */}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
