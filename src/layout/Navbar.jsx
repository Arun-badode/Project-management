import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar, role }) => {
  return (
    
    <nav className="navbar navbar-expand-lg navbar-light bg-card sticky-top">
      
      <div className="container-fluid px-3">
        {/* Brand and Toggle Button */}
        <div className="d-flex align-items-center">
          <a
            className="navbar-brand fw-bold text-white me-3"
            href="#"
            style={{ fontSize: "19px" }}
          >
            Project Management
          </a>
          <button
            className="btn btn-link text-white p-0 d-lg-inline-block"
            onClick={toggleSidebar}
            style={{ fontSize: "20px", textDecoration: "none" }}
            aria-label="Toggle Sidebar"
          >
            <i className="fa fa-bars"></i>
          </button>
        </div>

        {/* Search Bar - Hidden on small screens, shown on medium and up */}
         <div className="d-none d-md-flex flex-grow-1 justify-content-center mx-3">
      {/* Desktop Search */}
      {/* <div className="position-relative" style={{ maxWidth: "500px", width: "100%" }}>
        <input
          type="text"
          placeholder="Search..."
          className="form-control pe-5"
          style={{
            borderRadius: "30px",
            paddingLeft: "15px",
            border: "1px solid #ddd",
          }}
        />
        <i
          className="bi bi-search position-absolute"
          style={{
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#888",
            pointerEvents: "none"
          }}
        ></i>
      </div> */}

      {/* Mobile Search (collapsed by default) */}
      {/* <div
        className="collapse d-md-none position-absolute top-100 start-50 translate-middle-x mt-1"
        id="mobileSearch"
        style={{ zIndex: 1050, width: "90%" }}
      >
        <div className="bg-white rounded-3 shadow p-2 position-relative">
          <input
            type="text"
            placeholder="Search..."
            className="form-control pe-5"
            style={{
              borderRadius: "25px",
              paddingLeft: "15px",
              border: "1px solid #ddd",
            }}
          />
          <i
            className="bi bi-search position-absolute"
            style={{
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
              pointerEvents: "none"
            }}
          ></i>
        </div>
      </div> */}
    </div>

        {/* Mobile Search Bar - Shows in center space when toggled */}
       

        {/* Right Side Icons */}
        <div className="d-flex align-items-center">
          {/* Search Icon for Mobile - Only shown on small screens */}
          {/* <button
            className="btn btn-link text-white p-2 d-md-none me-2"
            style={{ fontSize: "20px", textDecoration: "none" }}
            data-bs-toggle="collapse"
            data-bs-target="#mobileSearch"
            aria-expanded="false"
            aria-controls="mobileSearch"
            aria-label="Toggle Search"
          >
            <i className="fa fa-search"></i>
          </button> */}

          {/* Notification Bell */}
  {(role === "Manager" || role === "Team Member") && (
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="statusSwitch"
              onchange="toggleStatus(this)"
              style={{fontSize:"20px"}}
            />
            <label
              class="form-check-label fw-bold"
              for="statusSwitch"
              id="statusLabel"
            ></label>
          </div>
  )}
          <a
            className="btn btn-link text-white p-2 me-2"
            href="#"
            style={{ fontSize: "22px", textDecoration: "none" }}
            aria-label="Notifications"
          >
            <i className="fa-regular fa-bell"></i>
          </a>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-link text-white p-2 d-flex align-items-center"
              style={{
                fontSize: "22px",
                textDecoration: "none",
                border: "none",
              }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Profile Menu"
            >
              <div className="position-relative">
                <i className="fa-solid fa-circle-user"></i>
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                  style={{ fontSize: "8px", width: "12px", height: "12px" }}
                >
                  <span className="visually-hidden">Online</span>
                </span>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li>
                <Link className="dropdown-item py-2" to="/profile">
                  <i className="fa fa-user me-2"></i>
                  Profile
                </Link>
              </li>
              
              <li>
                <Link className="dropdown-item py-2" to="/changepassword">
                  <i className="fa fa-lock me-2"></i>
                  Change Password
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item py-2 text-danger" to="/">
                  <i className="fa fa-sign-out-alt me-2"></i>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
