import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { useState } from "react";
import LoginPage from "./authtication/Login";

import LeadDashboard from "./components/Lead/LeadDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import TaskManagementPage from "./components/AdminDashboard/TaskManagement/TaskManagemnet";
import TaskManagement from "./components/AdminDashboard/TaskManagement/TaskManagemnet";
import UserManagement from "./components/AdminDashboard/UserManagement/UserManagement";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menusidebarcollaps = () => {
    setIsSidebarCollapsed(true);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const location = useLocation();

  // Check if current path is exactly "/" (login page) or "/signup" (sign up page)
  const hideLayout = location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {/* navbar - hidden on login/signup page */}
      {!hideLayout && <Navbar toggleSidebar={toggleSidebar} />}
      
      {/* main content area */}
      <div className={`main-content ${hideLayout ? "full-width" : ""}`}>
        {/* sidebar - hidden on login/signup page */}
         {/* sidebar - hidden on login/signup page */}
        {!hideLayout && (
          <Sidebar
            collapsed={isSidebarCollapsed}
            menuItemClick={menusidebarcollaps}
          />
        )}
        
        {/* right side content */}
        <div
          className={`right-side-content ${isSidebarCollapsed && !hideLayout ? "collapsed" : ""}`}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/*Admin Start */}

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/taskmanagement" element={<TaskManagement/>}/>
            <Route path='/usermanage' element={<UserManagement/>}/>

            {/*Admin End */}


            <Route path="/LeadDashboard" element={<LeadDashboard />} />

            {/* Add your other routes here */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
