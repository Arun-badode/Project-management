import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faUser } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";


const SignupPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Save user data in localStorage (in a real app, you would send this to a server)
   
  };

  return (
    <div
      className="login-page container"
    
    >
      <div className="login-container row h-100" >
        {/* Left Panel */}
        <div className="col-md-6 login-left d-flex justify-content-center align-items-center">
          <div className="login-left-content">
            <img
              src="https://ik.imagekit.io/43o9qlnbg/Eminoids%20-%20Logo_W.png"
              alt="Logo"
              className="login-logo"
            />
            <h1 className="text-white">Join Us!</h1>
            <p>
              Create your account and start managing your projects efficiently with our Application.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 login-right d-flex justify-content-center align-items-center">
          <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
              <h4 className="login-form-title">
                Register
                <br />
                <span className="text-muted">Create your account</span>
              </h4>

              <div className="login-input-group">
                <FontAwesomeIcon
                  icon={faUser}
                  className="login-input-icon"
                />
                <input
                  type="text"
                  className="form-control login-input"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="login-input-group">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="login-input-icon"
                />
                <input
                  type="email"
                  className="form-control login-input"
                  placeholder="E-mail"
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

              <div className="login-input-group">
                <FontAwesomeIcon icon={faLock} className="login-input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control login-input"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <button type="submit" className="btn login-submit-btn mt-3">
                SIGN UP
              </button>

              <div className="text-center mt-2 mb-2">
                <p className="text-muted">
                  Already have an account? <Link to="/" style={{ color: "#6e8efb" }}><span>Login</span></Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;