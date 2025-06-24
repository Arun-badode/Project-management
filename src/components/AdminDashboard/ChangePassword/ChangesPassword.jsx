import React, { useState } from 'react';

function ChangePassword() {
  const [passwordError, setPasswordError] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setPasswordError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = () => {
    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (!passwords.current) {
      setPasswordError('Current password is required');
      return;
    }

    // Simulate success
    setPasswordError('');
    setPasswords({ current: '', new: '', confirm: '' });
    alert('Password updated successfully!');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card bg-card border-0 shadow-lg">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-key-fill me-2"></i>
                Change Password
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {/* Current Password */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Current Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      className="form-control"
                      value={passwords.current}
                      onChange={(e) => handlePasswordChange('current', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      <i className={`bi ${showPassword.current ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">New Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      className="form-control"
                      value={passwords.new}
                      onChange={(e) => handlePasswordChange('new', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      <i className={`bi ${showPassword.new ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Confirm New Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      className="form-control"
                      value={passwords.confirm}
                      onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      <i className={`bi ${showPassword.confirm ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Error */}
                {passwordError && (
                  <div className="col-12">
                    <div className="alert alert-danger py-2 mb-0">
                      {passwordError}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                    onClick={handlePasswordSubmit}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}

export default ChangePassword;
