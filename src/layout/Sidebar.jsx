import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("userRole"); // ✅ GET ROLE from localStorage

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path) => location.pathname === path;

  const menuItemClick = () => {
    console.log("Menu item clicked");
  };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar bg-card">
        <ul className="menu">
          {/* Admin Only */}
          {role === "Admin" && (
            <>
              <li
                className={`menu-item ${
                  isActive("/dashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/dashboard");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-compass"></i>
                  <span className="menu-text">Dashboard</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/LeadDashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/LeadDashboard");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-diagram-project"></i>
                  <span className="menu-text">Project Management</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/taskmanagement") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/taskmanagement");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-tasks"></i>
                  <span className="menu-text">Task Management</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/usermanage") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/usermanage");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-users-gear"></i>
                  <span className="menu-text">User Management</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/resourcemanagement") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/resourcemanagement");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-toolbox"></i>
                  <span className="menu-text">Resource Management</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/timetracker") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/timetracker");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-clock"></i>
                  <span className="menu-text">Time Tracking</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/filemanagementsystem") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/filemanagementsystem");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-folder-open"></i>
                  <span className="menu-text">File Management</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/qamanagement") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/qamanagement");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-check-to-slot"></i>
                  <span className="menu-text">QA Management</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/reportinganalytics") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/reportinganalytics");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-chart-line"></i>
                  <span className="menu-text">Reporting & Analytics</span>
                </div>
              </li>

              <li
                className={`menu-item ${isActive("/auditlog") ? "active" : ""}`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/auditlog");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-shield"></i>
                  <span className="menu-text">Audit Logs</span>
                </div>
              </li>

              <li
                className={`menu-item ${isActive("/profile") ? "active" : ""}`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/profile");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-user-circle"></i>
                  <span className="menu-text">Profile & Account</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/projectsupport") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/projectsupport");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-life-ring"></i>
                  <span className="menu-text">Support</span>
                </div>
              </li>

              <li
                className={`menu-item ${
                  isActive("/settingpage") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/settingpage");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-gear"></i>
                  <span className="menu-text">Settings</span>
                </div>
              </li>
            </>
          )}

          {/* Manager Only */}
          {role === "Manager" && <></>}

          {/* Team Member Only */}
          {role === "Team Member" && (
            <>
              <li
                className={`menu-item ${
                  isActive("/settingpage") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/settingpage");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-gear"></i>
                  <span className="menu-text">Task</span>
                </div>
              </li>
             
            </>
          )}

          {/* Shared by Admin & Manager */}
          {/* {(role === "Admin" || role === "Manager") && (
            <>
              
            </>
          )} */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
