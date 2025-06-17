import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { useState } from "react";
import LoginPage from "./authtication/Login";
import AdminDashboard from "./components/Admin/Dashboard/AdminDashboard";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const menusidebarcollaps = () => {
    setIsSidebarCollapsed(true);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };
  const location = useLocation();

  // Check if current path is exactly "/" (login page)
  const hideLayout = location.pathname === "/";

  return (
    <>
      {/* navbar - hidden on login page */}
      {!hideLayout && <Navbar toggleSidebar={toggleSidebar} />}
      
      {/* main content area */}
      <div className={`main-content ${hideLayout ? "full-width" : ""}`}>
        {/* sidebar - hidden on login page */}
        {!hideLayout && (
          <Sidebar
            collapsed={isSidebarCollapsed}
            menuItemClick={menusidebarcollaps}
          />
        )}
        
        {/* right side content */}
        <div
          className={`right-side-content ${
            isSidebarCollapsed && !hideLayout ? "collapsed" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Add your other routes here */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;