import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../components/Utilities/axiosInstance";
import BASE_URL from "../config";

const Navbar = ({ toggleSidebar }) => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const userFullName = "John Naveen Prince";
  const userRole = "Team Member";
  const totalBreakLimit = 60;
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hasEndOfShiftToday, setHasEndOfShiftToday] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [breakDuration, setBreakDuration] = useState(0);
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
    
    // Check if there's already an End of Shift for today
    const today = new Date().toISOString().split("T")[0];
    const endOfShiftRecord = localStorage.getItem(`endOfShift_${today}`);
    if (endOfShiftRecord) {
      setHasEndOfShiftToday(true);
    }
    
    // Check if user is currently on break
    const breakStart = localStorage.getItem("currentBreakStart");
    if (breakStart) {
      setIsOnBreak(true);
      setBreakStartTime(new Date(breakStart));
    }
  }, []);

  // Update break duration every second when on break
  useEffect(() => {
    let interval;
    if (isOnBreak && breakStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now - breakStartTime) / 1000); // in seconds
        setBreakDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak, breakStartTime]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileDropdown(false);
    setShowLogoutModal(true);
  };

  const handleDirectLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.clear();
    navigate("/");
  };

  const handleBreak = async () => {
    try {
      const memberId = localStorage.getItem("managerId") || localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      
      if (memberId && token) {
        // Call the break start API
        await axiosInstance.post(
          'attendance/break-start',
          {
            memberId: parseInt(memberId, 10)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        // Store break start time in localStorage
        const now = new Date();
        localStorage.setItem("currentBreakStart", now.toISOString());
        
        // Update state
        setIsOnBreak(true);
        setBreakStartTime(now);
        setShowLogoutModal(false);
        
        // Don't logout the user
      }
    } catch (error) {
      console.error("⚠️ Failed to start break:", error);
    }
  };

  const handleEndBreak = async () => {
    try {
      const now = new Date();
      const breakStart = new Date(breakStartTime);
      const breakDurationMinutes = Math.floor((now - breakStart) / 60000); // in minutes
      
      // Store break duration for today
      const today = now.toISOString().split("T")[0];
      const existingBreaks = JSON.parse(localStorage.getItem(`breaks_${today}`) || "[]");
      existingBreaks.push({
        startTime: breakStartTime.toISOString(),
        endTime: now.toISOString(),
        duration: breakDurationMinutes
      });
      localStorage.setItem(`breaks_${today}`, JSON.stringify(existingBreaks));
      
      // Clear the current break start time
      localStorage.removeItem("currentBreakStart");
      
      // Update state
      setIsOnBreak(false);
      setBreakStartTime(null);
      setBreakDuration(0);
      
      // Call the break end API
      const memberId = localStorage.getItem("managerId") || localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      
      if (memberId && token) {
        await axiosInstance.post(
          "attendance/break-end",
          {
            memberId: parseInt(memberId, 10)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        // Update attendance with break end time
        const attendance = JSON.parse(localStorage.getItem("attendance"));
        
        if (attendance?.id) {
          await axiosInstance.patch(
            `attendance/updateAttendance/${attendance?.id}`,
            {
              memberId: parseInt(memberId, 10),
              attendanceDate: today,
              status: "Present",
              inTime: attendance?.inTime,
              outTime: now.toLocaleTimeString("en-US", {
                hour12: true,
                hour: "numeric",
                minute: "2-digit",
              }),
              remarks: `Break Ended (${breakDurationMinutes} minutes)`,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
    } catch (error) {
      console.error("⚠️ Failed to end break:", error);
    }
  };

  const handleEndOfShift = async () => {
    try {
      // If user is on break, end the break first
      if (isOnBreak) {
        await handleEndBreak();
      }
      
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      
      // Mark that End of Shift has been recorded for today
      localStorage.setItem(`endOfShift_${today}`, now.toISOString());
      
      // Update attendance with end of shift time
      const attendance = JSON.parse(localStorage.getItem("attendance"));
      const memberId = localStorage.getItem("managerId") || localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      
      if (attendance?.id && memberId && token) {
        await axiosInstance.patch(
          `attendance/updateAttendance/${attendance?.id}`,
          {
            memberId: parseInt(memberId, 10),
            attendanceDate: today,
            status: "Present",
            inTime: attendance?.inTime,
            outTime: now.toLocaleTimeString("en-US", {
              hour12: true,
              hour: "numeric",
              minute: "2-digit",
            }),
            remarks: "End of Shift",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      
      // Clear localStorage and redirect to login
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("⚠️ Failed to record end of shift:", error);
      // Even if API fails, log the user out
      localStorage.clear();
      navigate("/");
    }
  };

  const handleLogin = () => {
    // Check if user is returning from a break
    const breakStartTime = localStorage.getItem("currentBreakStart");
    if (breakStartTime) {
      setIsOnBreak(true);
      setBreakStartTime(new Date(breakStartTime));
    }
  };

  useEffect(() => {
    // Check if user is logging in after a break
    handleLogin();
  }, []);

  // Format break duration as MM:SS
  const formatBreakDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-card . py-2">
        <div className="container-fluid px-2 px-md-3">
          {/* Brand and Sidebar Toggle */}
          <div className="d-flex align-items-center gap-3 flex-shrink-0">
            <img
              src="https://ik.imagekit.io/43o9qlnbg/Eminoids%20-%20Logo_W.png"
              alt="Logo"
              style={{
                width: window.innerWidth >= 992 ? "150px" : "120px",
                height: "auto",
                maxHeight: "60px",
              }}
            />

            <button
              className="btn btn-link text-white p-0"
              onClick={toggleSidebar}
              style={{ fontSize: "20px", textDecoration: "none" }}
              aria-label="Toggle Sidebar"
            >
              <i className="fa fa-bars"></i>
            </button>
          </div>

          {/* Right Side Content */}
          <div className="d-flex align-items-center ms-auto gap-2 gap-md-3 flex-shrink-0">
            {/* Break Timer - Show when on break */}
            {isOnBreak && (
              <div className="d-flex align-items-center gap-2 bg-warning text-dark px-3 py-1 rounded-pill">
                <i className="fa fa-clock"></i>
                <span className="fw-semibold small">Break: {formatBreakDuration(breakDuration)}</span>
                <button
                  className="btn btn-sm btn-success py-0 px-2"
                  onClick={handleEndBreak}
                >
                  End Break
                </button>
              </div>
            )}

            {/* User Name - Mobile View */}
            <div className="d-md-none d-flex align-items-center gap-2">
              <span className="text-white fw-semibold small">
                {userFullName.split(" ")[0]}
              </span>
            </div>

            {/* Desktop View - User Info */}
            <div className="d-none d-md-flex align-items-center gap-2 flex-wrap">
              <span className="fw-semibold small text-white">
                {userFullName}
              </span>
            </div>

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
                  <i
                    className="fa-solid fa-circle-user"
                    style={{ fontSize: "x-large" }}
                  ></i>
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
                    position: "absolute",
                    inset: "0px auto auto 0px",
                    margin: "0px",
                    transform: "translate(-160px, 40px)",
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
                    <button
                      className="dropdown-item py-2 text-danger"
                      onClick={handleLogoutClick}
                    >
                      <i className="fa fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-black">
              <div className="modal-header">
                <h5 className="modal-title">Logout Options</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Please select an option:</p>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleBreak}
                    disabled={isOnBreak}
                  >
                    <i className="fa fa-coffee me-2"></i>
                    Break
                    {isOnBreak && (
                      <span className="ms-2 text-muted">(Already on break)</span>
                    )}
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setShowLogoutModal(false);
                      handleEndOfShift();
                    }}
                    disabled={hasEndOfShiftToday}
                  >
                    <i className="fa fa-clock me-2"></i>
                    End of Shift
                    {hasEndOfShiftToday && (
                      <span className="ms-2 text-muted">(Already recorded today)</span>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    <i className="fa fa-times me-2"></i>
                    Close / Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;