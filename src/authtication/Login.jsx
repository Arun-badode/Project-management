import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import BASE_URL from "../config";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
      setFadeOut(true);
      setTimeout(() => {
        setShowVideo(false);
      }, 1000);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const roleCredentials = {
    Admin: { email: "admin@example.com", password: "admin@123" },
    Manager: { email: "manager@example.com", password: "manager@123" },
    "Team Member": { email: "team@example.com", password: "team@123" },
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!role) {
    setError("Please select a role.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(`${BASE_URL}user/login`, {
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = response.data.data;

    console.log(data);
    

    // Store token and user data in localStorage
    localStorage.setItem('authToken', data?.token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userData', JSON.stringify(data?.user));

    // Redirect based on selected role
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

  } catch (error) {
    console.error('Login error:', error);
    setError(error.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setEmail(roleCredentials[selectedRole].email);
    setPassword(roleCredentials[selectedRole].password);
  };

  if (showVideo) {
    return (
      <div className={`video-splash-screen ${fadeOut ? "" : ""}`}>
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

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="login-input-group">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="login-input-icon"
                />
                <input
                  type="text"
                  className="form-control login-input"
                  placeholder="Email"
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

              <button 
                type="submit" 
                className="btn login-submit-btn mt-3"
                disabled={isLoading}
              >
                {isLoading ? 'LOGGING IN...' : 'LOG IN'}
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