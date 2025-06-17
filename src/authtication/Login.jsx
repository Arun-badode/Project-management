import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="container-fluid login-page">
      <div className="row vh-100">
        {/* Left Panel */}
        <div className="col-md-6 login-left d-flex flex-column justify-content-center align-items-center text-white">
          <img
            src="https://i.ibb.co/XZNS87Gm/icon-project-removebg-preview.png"
            alt="Logo"
            className="mb-4"
            style={{ width: "150px", height: "120px" }}
          />
          <h1>Welcome Back!</h1>
          <p className="px-4 text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae
            mauris volutpat.
          </p>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 login-right d-flex justify-content-center align-items-center">
          <form
            className="login-form p-4 rounded w-100"
            style={{ maxWidth: "400px" }}
          >
            <h4 className="mb-4 text-center">
              Hello!
              <br />
              <span className="text-muted small">Sign in to your account</span>
            </h4>

            <div className="form-group mb-3 position-relative">
              <i class="fa-solid fa-envelope icon-left"></i>
              <input
                type="email"
                className="form-control ps-5 "
                placeholder="E-mail"
                required
              />
            </div>

            <div className="form-group mb-3 position-relative ">
              <i class="fa-solid fa-lock icon-left"></i>
              <input
                type="password"
                className="form-control ps-5"
                placeholder="Password"
                required
              />
            <i class="fa-solid fa-eye eye-icon "></i>
            </div>
            <Link to="/admin">
              <button type="submit" className="btn w-100 btn-pri">
                SIGN IN
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;