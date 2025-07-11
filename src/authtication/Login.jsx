import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // Start fade out
      setTimeout(() => {
        setShowVideo(false); // Remove video after fade
      }, 1000); // Wait for animation to finish
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const roleCredentials = {
    Admin: { email: "admin123", password: "admin@123" },
    Manager: { email: "manager123", password: "manager@123" },
    "Team Member": { email: "team123", password: "team@123" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);

    switch (role) {
      case "Admin":
        navigate("/admin-dashboard");
        break;
      case "Manager":
        navigate("/manager-dashboard");
        break;
      case "Team Member":
        navigate("/team-dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setEmail(roleCredentials[selectedRole].email);
    setPassword(roleCredentials[selectedRole].password);
  };

  if (showVideo) {
    return (
      <div className={`video-splash-screen ${fadeOut ? "fade-out" : ""}`}>
        <video 
          autoPlay 
          muted 
          playsInline 
          className="splash-video"
          style={{ height: isMobile ? "100%" : "100%" }}
        >
          <source 
            src={isMobile ? "Video/mob.mp4" : "/Video/web.mp4"} 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container row">
        {/* Left Panel */}
        <div className="col-md-6 login-left d-flex justify-content-center align-items-center">
          <div className="login-left-content">
            <img
              src="https://ik.imagekit.io/43o9qlnbg/Eminoids%20-%20Logo_W.png"
              alt="Logo"
              className="login-logo"
              style={{ width: "220px", height: "auto", marginBottom: "24px" }}
            />
            <h1 className="text-white">Welcome Back!</h1>
            <p className="fw-bold text-strong">
              Let's turn tasks into triumphs! 
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 login-right d-flex justify-content-center align-items-center">
          <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
              <h4 className="login-form-title">
                Hello!
                <br />
                <span className="text-muted">Step in and take control.</span>
              </h4>

              <div className="login-input-group">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="login-input-icon"
                />
                <input
                  type="Username"
                  className="form-control login-input"
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-input-group">
                <FontAwesomeIcon icon={faLock} className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              {/* Role Selection Buttons */}
              <div className="d-flex flex-wrap justify-content-center mt-3 gap-2">
                {Object.keys(roleCredentials).map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`btn btn-outline-secondary ${
                      role === r ? "active" : ""
                    }`}
                    onClick={() => handleRoleSelect(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button type="submit" className="btn login-submit-btn mt-3">
                LOG IN
              </button>
              <div className="text-center mt-3">
                <p className="text-muted">
                 Version Build 1.0 
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;