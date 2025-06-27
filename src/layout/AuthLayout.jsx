// layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-wrapper">
      <Outlet /> {/* Login/Signup render here */}
    </div>
  );
};

export default AuthLayout;
