import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {


  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const userFullName = 'John Naveen Prince';
  const userRole = 'Team Member'; // Change to 'Manager' to test Manager view
  const totalBreakLimit = 60; // Total allowed break time in minutes
  const [userStatus, setUserStatus] = useState('Available');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showBreakConfirmation, setShowBreakConfirmation] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakUsed, setTotalBreakUsed] = useState(0); // in minutes

  const breakTimeRemaining = Math.max(totalBreakLimit - totalBreakUsed, 0);



  // Start tracking break time
  const startBreakTimer = () => {
    setBreakStartTime(new Date());
  };



  // End break and calculate used time
  const endBreak = () => {
    if (breakStartTime) {
      const now = new Date();
      const diffMs = now - breakStartTime;
      const diffMins = Math.floor(diffMs / 60000);
      setTotalBreakUsed((prev) => Math.min(prev + diffMins, totalBreakLimit));
    }
    setUserStatus('Available');
    setShowOverlay(false);
    setIsOnBreak(false);
    setBreakStartTime(null);
  };


  // Simulate pausing time tracking
  const pauseTimeTracking = () => {
    console.log('Time tracking paused.');
  };


  const [setUserRole] = useState('Team Member'); // or 'Manager'
  const [remainingBreakTime, setRemainingBreakTime] = useState(60); // in minutes

  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  }, []);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-card sticky-top">
      <div className="container-fluid px-3">
        {/* Brand and Toggle Button */}
        <div className="d-flex align-items-center" style={{gap:"35px"}}>
          <img src="https://ik.imagekit.io/wycpoxj6v/Eminoids%20-%20Logo_B.png?updatedAt=1750836038955" height={60} />
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

          {/* Mobile Search (collapsed by default) */}
          <div
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
                  pointerEvents: "none",
                }}
              ></i>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Shows in center space when toggled */}

        {/* Right Side Icons */}
        <div className="d-flex align-items-center">
          {/* Search Icon for Mobile - Only shown on small screens */}

          {/* Notification Bell */}

          <>
            {role !== "Admin" && (
              <div className="d-flex justify-content-end align-items-center gap-3">
                {/* 1. Name & Status */}
                <span className="fw-semibold">
                  {userFullName} – {userStatus}
                </span>

                {/* 2. Toggle (Team Members only) */}
                {userRole === 'Team Member' && (
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="statusSwitch"
                      style={{ fontSize: '20px' }}
                      checked={userStatus === 'Available'}
                      onChange={e => {
                        if (e.target.checked) {
                          // toggled ON = Available
                          if (isOnBreak) {
                            endBreak();
                          } else {
                            setUserStatus('Available');
                            setShowOverlay(false);
                          }
                        } else {
                          // toggled OFF = Away
                          if (breakTimeRemaining > 0) {
                            setShowStatusModal(true);
                          } else {
                            alert('You have exhausted your break limit for today.');
                          }
                        }
                      }}
                    />
                  </div>
                )}

                {/* 3. Status Modal */}
                {showStatusModal && (
                  <div
                    className="modal show fade"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content text-black">
                        <div className="modal-header">
                          <h5 className="modal-title">Set Status to Away</h5>
                        </div>
                        <div className="modal-body">
                          <p>Please select reason:</p>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => {
                              setShowStatusModal(false);
                              setShowBreakConfirmation(true);
                            }}
                          >
                            Break
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setUserStatus('(away)');
                              setIsLoggedOut(true);
                              setShowStatusModal(false);
                              setShowOverlay(true);
                              pauseTimeTracking();
                            }}
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Break Confirmation Modal */}
                {showBreakConfirmation && (
                  <div
                    className="modal show fade"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content text-black">
                        <div className="modal-header">
                          <h5 className="modal-title">Confirm Break</h5>
                        </div>
                        <div className="modal-body">
                          <p>Remaining break time: {breakTimeRemaining} minutes</p>
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setShowBreakConfirmation(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setUserStatus('(away)');
                              setIsOnBreak(true);
                              setShowBreakConfirmation(false);
                              setShowOverlay(true);
                              startBreakTimer();
                            }}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Gray Overlay Mask */}
                {showOverlay && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(128, 128, 128, 0.5)',
                      zIndex: 1050,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      pointerEvents: 'auto',
                      cursor: 'not-allowed',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: 'black',
                      }}
                    >
                      <p>You are currently marked away. Please mark yourself Available to continue.</p>

                      {isOnBreak && (
                        <>
                          <p>Break time remaining: {breakTimeRemaining} minutes</p>
                          <button
                            className="btn btn-primary mt-2"
                            onClick={endBreak}
                            style={{ cursor: 'pointer' }}
                          >
                            End Break
                          </button>
                        </>
                      )}

                      {isLoggedOut && (

                        <Link to="/">
                          <button
                            className="btn btn-success mt-3"
                            onClick={() => {
                              setUserStatus('Available');
                              setShowOverlay(false);
                              setIsLoggedOut(false);
                            }}
                          >
                            Login
                          </button>
                        </Link>

                      )}
                    </div>
                  </div>
                )}
              </div>

            )}
          </>

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