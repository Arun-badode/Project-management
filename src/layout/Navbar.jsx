import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const userFullName = 'John Naveen Prince';
  const userRole = 'Team Member';
  const totalBreakLimit = 60;
  const [userStatus, setUserStatus] = useState('Available');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showBreakConfirmation, setShowBreakConfirmation] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakUsed, setTotalBreakUsed] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const breakTimeRemaining = Math.max(totalBreakLimit - totalBreakUsed, 0);

  const startBreakTimer = () => {
    setBreakStartTime(new Date());
  };

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

  const pauseTimeTracking = () => {
    console.log('Time tracking paused.');
  };

  const [role, setRole] = useState("");
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-card . py-2">
        <div className="container-fluid px-2 px-md-3">
          {/* Brand and Sidebar Toggle */}
          <div className="d-flex align-items-center gap-3 flex-shrink-0">
            <img
              // src="https://ik.imagekit.io/wycpoxj6v/Eminoids%20-%20Logo_B.png?updatedAt=1750836038955"
              src="https://ik.imagekit.io/43o9qlnbg/Eminoids%20-%20Logo_W.png"
              alt="Logo"
              style={{
                width: window.innerWidth >= 992 ? "150px" : "120px",
                height: "40px",
              }}
            />
            <button
              className="btn btn-link text-white p-0 d-lg-none"
              onClick={toggleSidebar}
              style={{ fontSize: "20px", textDecoration: "none" }}
              aria-label="Toggle Sidebar"
            >
              <i className="fa fa-bars"></i>
            </button>
          </div>


          {/* Right Side Content */}
          <div className="d-flex align-items-center ms-auto gap-2 gap-md-3 flex-shrink-0">

            {/* User Status - Mobile View */}
            <div className="d-md-none d-flex align-items-center gap-2">
              <span className="text-white fw-semibold small">
                {userFullName.split(' ')[0]} {/* Show only first name on mobile */}
              </span>
              <span className={userStatus === "Available" ? "text-success" : "text-secondary"}>
                {userStatus}
              </span>
              {userRole === "Team Member" && (
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="mobileStatusSwitch"
                    checked={userStatus === "Available"}
                    onChange={e => {
                      if (e.target.checked) {
                        if (isOnBreak) {
                          endBreak();
                        } else {
                          setUserStatus('Available');
                          setShowOverlay(false);
                        }
                      } else {
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
            </div>

            {/* Desktop View - User Info */}
            <div className="d-none d-md-flex align-items-center gap-2 flex-wrap">
              {role !== "Admin" && (
                <>
                  <span className="fw-semibold small text-white">
                    {userFullName} –{" "}
                    <span className={userStatus === "Available" ? "text-success" : "text-secondary"}>
                      {userStatus}
                    </span>
                  </span>
                  {userRole === "Team Member" && (
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="statusSwitch"
                        checked={userStatus === "Available"}
                        onChange={e => {
                          if (e.target.checked) {
                            if (isOnBreak) {
                              endBreak();
                            } else {
                              setUserStatus('Available');
                              setShowOverlay(false);
                            }
                          } else {
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
                </>
              )}
            </div>

            {/* Notification Bell - Hidden on mobile */}
            <a
              className="btn btn-link text-white p-2 d-none d-md-block"
              href="#"
              style={{ fontSize: "22px", textDecoration: "none" }}
              aria-label="Notifications"
            >
              <i className="fa-regular fa-bell" style={{fontSize:"x-large"}}></i>
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
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-label="Profile Menu"
              >
                <div className="position-relative">
                  <i className="fa-solid fa-circle-user" style={{fontSize:"x-large"}}></i>
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                    style={{ fontSize: "8px", width: "12px", height: "12px" }}
                  >
                    <span className="visually-hidden">Online</span>
                  </span>
                </div>
              </button>
              {showProfileDropdown && (
                <ul
                  className="dropdown-menu dropdown-menu-end shadow show"
                  style={{
                    position: 'absolute',
                    inset: '0px auto auto 0px',
                    margin: '0px',
                    transform: 'translate(-160px, 40px)'
                  }}
                >
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
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000 }}>
          <div className="modal-dialog modal-dialog-centered">
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

      {/* Break Confirmation Modal */}
      {showBreakConfirmation && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-black">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Break</h5>
              </div>
              <div className="modal-body">
                {role === "Team Member" ? (
                  <p>Remaining break time: {breakTimeRemaining} minutes</p>
                ) : (
                  <p>No break time limit for Managers. Your status will be visible to Admin.</p>
                )}
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
                    if (role === "Team Member") {
                      startBreakTimer();
                    }
                    // For Manager, no timer logic needed
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gray Overlay Mask */}
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(128, 128, 128, 0.5)',
            zIndex: 4000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              color: 'black',
              maxWidth: 320,
              width: "90vw"
            }}
          >
            <p>You are currently marked away. Please mark yourself Available to continue.</p>
            {isOnBreak && (
              <>
                <p>Break time remaining: {breakTimeRemaining} minutes</p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={endBreak}
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
    </>
  );
};

export default Navbar;