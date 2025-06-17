import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-card">
        <div className="container-fluid">
          <div className="d-flex flex-grow-1 align-items-center">
            {/* Brand and toggle */}
            <div className="d-flex align-items-center">
              <a className="navbar-brand me-2" href="#">
                P.M.
              </a>
              <button 
                className="navbar-toggler border-0 p-0" 
                onClick={toggleSidebar}
                style={{background: 'none', fontSize: "25px"}}
              >
                <i className="fa fa-bars text-white"></i>
              </button>
            </div>

            {/* Search bar - will collapse on smaller screens */}
            <div className="mx-lg-3 flex-grow-1 d-none d-md-block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="form-control"
                style={{borderRadius: "30px", maxWidth: "500px", width: "100%"}}
              />
            </div>

            {/* Right side icons */}
            <div className="d-flex ms-auto">
              {/* Notification bell - visible on all screens */}
              <a className="nav-link text-white me-2 d-flex align-items-center" href="#" style={{fontSize: "25px"}}>
                <i className="fa-regular fa-bell"></i>
              </a>

              {/* Profile dropdown */}
              <div className="dropdown">
                <div
                  className="fw-bold rounded-4 d-flex align-items-center"
                  style={{ cursor: "pointer", fontSize: "25px" }}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="profile-element">
                    <div className="avatar online">
                      <i className="fa-solid user-icon fa-circle-user text-white"></i>
                    </div>
                  </div>
                </div>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/">
                      Update Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/changepassword">
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/">
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Collapsible search bar for mobile */}
          <div className="d-md-none w-100 mt-2">
            <input 
              type="text" 
              placeholder="Search..." 
              className="form-control w-100"
              style={{borderRadius: "30px"}}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;