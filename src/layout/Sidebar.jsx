import React, { useState } from "react";    
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSubmenuActive = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  // ✅ Defined menuItemClick to prevent error
  const menuItemClick = () => {
    console.log("Menu item clicked");
    // Add additional logic if needed
  };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar bg-card">
        <ul className="menu">
          <li className={`menu-item ${isActive("/admin") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/admin"); menuItemClick(); }}>
              <i className="fa-solid fa-cubes"></i>
              <span className="menu-text">Dashboard</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/LeadDashboard") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/LeadDashboard"); menuItemClick(); }}>
              <i className="fa-solid fa-diagram-project"></i>
              <span className="menu-text">Project Management</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/taskmanagement") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/taskmanagement"); menuItemClick(); }}>
              <i className="fa-solid fa-tasks"></i>
              <span className="menu-text">Task Management</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/usermanage") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/usermanage"); menuItemClick(); }}>
              <i className="fa-solid fa-users-gear"></i>
              <span className="menu-text">User Management</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/resourcemanagement") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/resourcemanagement"); menuItemClick(); }}>
              <i className="fa-solid fa-toolbox"></i>
              <span className="menu-text">Resource Management</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/timetracking") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/timetracking"); menuItemClick(); }}>
              <i className="fa-solid fa-clock"></i>
              <span className="menu-text">Time Tracking</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/filemanagement") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/filemanagement"); menuItemClick(); }}>
              <i className="fa-solid fa-folder-open"></i>
              <span className="menu-text">File Management</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/qamgmt") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/qamgmt"); menuItemClick(); }}>
              <i className="fa-solid fa-check-to-slot"></i>
              <span className="menu-text">QA Management</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/reports") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/reports"); menuItemClick(); }}>
              <i className="fa-solid fa-chart-line"></i>
              <span className="menu-text">Reporting & Analytics</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/settingpage") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/settingpage"); menuItemClick(); }}>
              <i className="fa-solid fa-gear"></i>
              <span className="menu-text">Settings</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/auditlogs") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/auditlogs"); menuItemClick(); }}>
              <i className="fa-solid fa-file-shield"></i>
              <span className="menu-text">Audit Logs</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/profile") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/profile"); menuItemClick(); }}>
              <i className="fa-solid fa-user-circle"></i>
              <span className="menu-text">Profile & Account</span>
            </div>
          </li>

          <li className={`menu-item ${isActive("/projectsupport") ? "active" : ""}`}>
            <div className="menu-link menu-i" onClick={() => { navigate("/projectsupport"); menuItemClick(); }}>
              <i className="fa-solid fa-life-ring"></i>
              <span className="menu-text">Support</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
