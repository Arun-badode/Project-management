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
      <div className="sidebar bg-card " style={{ height: "101vh" }}>
        <ul className="menu">
          {/* Admin Only */}
          {role === "Admin" && (
            <>
              <li
                className={`menu-item ${
                  isActive("/admin-dashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/admin-dashboard");
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
                  <span className="menu-text">Active Projects </span>
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
                  <span className="menu-text">Task Management </span>
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
                className={`menu-item ${
                  isActive("/attendance") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/attendance");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-calendar-days"></i>
                  <span className="menu-text">Attendance</span>
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
                  <span className="menu-text">User </span>
                </div>
              </li>

              

             

              {/* <li
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
                  <span className="menu-text">Resource </span>
                </div>
              </li> */}

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

             
             
              {/* <li
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
              </li> */}

              {/* <li
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
              </li> */}

              <li
                className={`menu-item ${
                  isActive("/role&permission") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/role&permission");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-gear"></i>
                  <span className="menu-text">Role & Permission</span>
                </div>
              </li>
            </>
          )}

          {/* Manager Only */}
          {role === "Manager" && (
            <>
              <li
                className={`menu-item ${
                  isActive("/manager-dashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/manager-dashboard");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-compass"></i>
                  <span className="menu-text">Dashboard</span>
                </div>
              </li>
              <li
                className={`menu-item ${isActive("/assigned") ? "active" : ""}`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/assigned");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-address-card"></i>
                  <span className="menu-text">Assigned Projects</span>
                </div>
              </li>
              <li
                className={`menu-item ${
                  isActive("/createproject") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/createproject");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-circle-plus"></i>
                  <span className="menu-text">Create Project</span>
                </div>
              </li>
              <li
                className={`menu-item ${
                  isActive("/team-dashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/taskrequest");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-bell"></i>
                  <span className="menu-text">Task Requests</span>
                </div>
              </li>
              <li
                className={`menu-item ${
                  isActive("/team-dashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/sourcework");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-chart-line"></i>
                  <span className="menu-text">Resource Workload</span>
                </div>
              </li>
              <li
                className={`menu-item ${
                  isActive("/collaboration") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/collaboration");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-comments"></i>
                  <span className="menu-text">Collaboration</span>
                </div>
              </li>
            </>
          )}

          {/* Team Member Only */}
          {role === "Team Member" && (
            <>
              <li
                className={`menu-item ${
                  isActive("/team-dashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/team-dashboard");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-compass"></i>
                  <span className="menu-text">Dashboard</span>
                </div>
              </li>
              <li className={`menu-item ${isActive("/task") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/task");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-list"></i>
                  <span className="menu-text">My Tasks</span>
                </div>
              </li>
              <li
                className={`menu-item ${
                  isActive("/attendance") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/attendance");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-calendar-days"></i>
                  <span className="menu-text">Attendance</span>
                </div>
              </li>
              <li
                className={`menu-item ${
                  isActive("/productivity") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/productivity");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-chart-line"></i>
                  <span className="menu-text">Productivity</span>
                </div>
              </li>
              <li
                className={`menu-item ${
                  isActive("/taskdashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/activity");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-clock-rotate-left"></i>
                  <span className="menu-text">Activity</span>
                </div>
              </li>
              <li
                className={`menu-item ${
                  isActive("/taskdashboard") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/messages");
                    menuItemClick();
                  }}
                >
                  <i class="fa-solid fa-comment"></i>
                  <span className="menu-text">Messaging</span>
                </div>
              </li>

              {/* <li
                className={`menu-item ${
                  isActive("/productivity") ? "active" : ""
                }`}
              >
                <div
                  className="menu-link menu-i"
                  onClick={() => {
                    navigate("/productivity");
                    menuItemClick();
                  }}
                >
                  <i className="fa-solid fa-life-ring"></i>
                  <span className="menu-text">Productivity</span>
                </div>
              </li> */}
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
