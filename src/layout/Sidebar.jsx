import React, { useState } from "react";    
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

// menuItemClick
const Sidebar = ({ collapsed , }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null); // Tracks the open submenu
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

   // Function to check if a path is active
   const isActive = (path) => {
    return location.pathname === path;
  };

    // Function to check if any of the submenu items are active
    const isSubmenuActive = (paths) => {
      return paths.some((path) => location.pathname.startsWith(path));
    };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      {/* <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}></div> */}
      <div className="sidebar bg-card">
        <ul className="menu">
          {/* Dashboard Section */}
          <li className={`menu-item ${isActive("/admin") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/admin"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Dashboard</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/LeadDashboard") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/LeadDashboard"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Project Management</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/taskmanagement") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/taskmanagement"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Task Management</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/usermanage") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/usermanage"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text"> User Management</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Resource Management</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Time Tracking</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">File Management</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">QA Management</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text"> Reporting & Analytics</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text"> Settings</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Audit Logs</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Profile & Account</span>
            </div>
          </li>
           <li className={`menu-item ${isActive("/ad") ? "active" : ""}`}>
            <div
              className="menu-link menu-i"
              onClick={() => {navigate("/ad"); menuItemClick();} } >
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Support</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
