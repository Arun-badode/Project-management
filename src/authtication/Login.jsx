import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roleCredentials = {
    Admin: { email: "admin@gmail.com", password: "admin@123" },
    Manager: { email: "manager@gmail.com", password: "manager@123" },
    "Team Member": { email: "team@gmail.com", password: "team@123" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    // Save role and email in localStorage
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);

    // Navigate based on role
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
        navigate("/dashboard"); // fallback
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setEmail(roleCredentials[selectedRole].email);
    setPassword(roleCredentials[selectedRole].password);
  };

  return (
    <div
      className="login-page container"
      style={{ justifyContent: "flex-start", marginBottom: "50px" }}
    >
      <div className="login-container row">
        {/* Left Panel */}
        <div className="col-md-6 login-left d-flex justify-content-center align-items-center">
          <div className="login-left-content">
            <img
              src="https://i.ibb.co/XZNS87Gm/icon-project-removebg-preview.png"
              alt="Logo"
              className="login-logo"
            />
            <h1 className="text-white">Welcome Back!</h1>
            <p>
             All-in-One Project Management Dashboard for Creative Teams – Seamlessly Track Tasks, Monitor Deadlines, Analyze Productivity, and Collaborate in Real-Time with a User-Centric Interface Built for DTP and QA Specialists.
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
                <span className="text-muted">Sign in to your account</span>
              </h4>

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
                LOGIN IN
              </button>
               <div className="text-center mt-3">
                <p className="text-muted">
                  Already have an account? <Link to="/singup" style={{ color: "#6e8efb" }}>sing up</Link>
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
