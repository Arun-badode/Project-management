import React, { useState } from 'react';

const ProfileAcc = () => {
  // Profile state
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...profile });
  
  // Password state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Account settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'en'
  });
  
  // UI state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Profile handlers
  const handleProfileChange = (field, value) => {
    setEditProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setProfile({ ...editProfile });
    setIsEditMode(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancelEdit = () => {
    setEditProfile({ ...profile });
    setIsEditMode(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = e.target.result;
        if (isEditMode) {
          setEditProfile(prev => ({ ...prev, avatar: newAvatar }));
        } else {
          setProfile(prev => ({ ...prev, avatar: newAvatar }));
          setSuccessMessage('Profile photo updated!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Password handlers
  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setPasswordError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
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
    // Simulate password change
    setPasswords({ current: '', new: '', confirm: '' });
    setSuccessMessage('Password changed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Settings handlers
  const handleSettingToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleLanguageChange = (e) => {
    setSettings(prev => ({ ...prev, language: e.target.value }));
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    setSuccessMessage('Account deletion request submitted');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h1 className="display-6 fw-bold text-dark mb-0">Profile & Account</h1>
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mb-0 py-2 px-3" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {successMessage}
                </div>
              )}
            </div>

            <div className="row g-4">
              {/* My Profile Section */}
              <div className="col-12 col-lg-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0 fs-5">My Profile</h3>
                    {!isEditMode ? (
                      <button 
                        className="btn btn-outline-light btn-sm"
                        onClick={() => setIsEditMode(true)}
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-success"
                          onClick={handleSaveProfile}
                        >
                          <i className="bi bi-check-lg me-1"></i>
                          Save
                        </button>
                        <button 
                          className="btn btn-outline-light"
                          onClick={handleCancelEdit}
                        >
                          <i className="bi bi-x-lg me-1"></i>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    {/* Avatar Section */}
                    <div className="text-center mb-4">
                      <div className="position-relative d-inline-block">
                        <img 
                          src={isEditMode ? editProfile.avatar : profile.avatar}
                          alt="Profile Avatar"
                          className="rounded-circle border border-3 border-primary"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <label 
                          htmlFor="avatar-upload"
                          className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle p-2"
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="bi bi-camera-fill"></i>
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleAvatarUpload}
                        />
                      </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Full Name</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control form-control-lg border-0 bg-light"
                            value={editProfile.fullName}
                            onChange={(e) => handleProfileChange('fullName', e.target.value)}
                          />
                        ) : (
                          <div className="form-control form-control-lg border-0 bg-light">
                            {profile.fullName}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Email</label>
                        {isEditMode ? (
                          <input
                            type="email"
                            className="form-control form-control-lg border-0 bg-light"
                            value={editProfile.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                          />
                        ) : (
                          <div className="form-control form-control-lg border-0 bg-light">
                            {profile.email}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Phone Number</label>
                        {isEditMode ? (
                          <input
                            type="tel"
                            className="form-control form-control-lg border-0 bg-light"
                            value={editProfile.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                          />
                        ) : (
                          <div className="form-control form-control-lg border-0 bg-light">
                            {profile.phone}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Address</label>
                        {isEditMode ? (
                          <textarea
                            className="form-control form-control-lg border-0 bg-light"
                            rows="3"
                            value={editProfile.address}
                            onChange={(e) => handleProfileChange('address', e.target.value)}
                          />
                        ) : (
                          <div className="form-control form-control-lg border-0 bg-light" style={{ minHeight: '76px' }}>
                            {profile.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                {/* Change Password Section */}
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-warning text-dark">
                    <h3 className="card-title mb-0 fs-5">Change Password</h3>
                  </div>
                  <div className="card-body">
                    <div>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold text-muted small">Current Password</label>
                          <div className="input-group">
                            <input
                              type={showPassword.current ? "text" : "password"}
                              className="form-control form-control-lg border-0 bg-light"
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
                        
                        <div className="col-12">
                          <label className="form-label fw-semibold text-muted small">New Password</label>
                          <div className="input-group">
                            <input
                              type={showPassword.new ? "text" : "password"}
                              className="form-control form-control-lg border-0 bg-light"
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
                        
                        <div className="col-12">
                          <label className="form-label fw-semibold text-muted small">Confirm New Password</label>
                          <div className="input-group">
                            <input
                              type={showPassword.confirm ? "text" : "password"}
                              className="form-control form-control-lg border-0 bg-light"
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
                        
                        {passwordError && (
                          <div className="col-12">
                            <div className="alert alert-danger py-2 mb-0">
                              {passwordError}
                            </div>
                          </div>
                        )}
                        
                        <div className="col-12">
                          <button 
                            type="button" 
                            className="btn btn-warning btn-lg w-100 fw-semibold"
                            onClick={handlePasswordSubmit}
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Settings Section */}
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-info text-white">
                    <h3 className="card-title mb-0 fs-5">Account Settings</h3>
                  </div>
                  <div className="card-body">
                    <div className="row g-4">
                      {/* Toggle Switches */}
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-2">
                          <div>
                            <div className="fw-semibold">Email Notifications</div>
                            <small className="text-muted">Receive updates via email</small>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="emailNotifications"
                              checked={settings.emailNotifications}
                              onChange={() => handleSettingToggle('emailNotifications')}
                              style={{ fontSize: '1.2rem' }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center py-2">
                          <div>
                            <div className="fw-semibold">Dark Mode</div>
                            <small className="text-muted">Switch to dark theme</small>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="darkMode"
                              checked={settings.darkMode}
                              onChange={() => handleSettingToggle('darkMode')}
                              style={{ fontSize: '1.2rem' }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Language Dropdown */}
                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Language Preference</label>
                        <select
                          className="form-select form-select-lg border-0 bg-light"
                          value={settings.language}
                          onChange={handleLanguageChange}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                      
                      {/* Delete Account Button */}
                      <div className="col-12">
                        <hr className="my-3" />
                        <div className="text-center">
                          <button
                            className="btn btn-outline-danger btn-lg"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            <i className="bi bi-trash3-fill me-2"></i>
                            Delete Account
                          </button>
                          <div className="small text-muted mt-2">
                            This action cannot be undone
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-0">
                <h5 className="modal-title d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Confirm Account Deletion
                </h5>
              </div>
              <div className="modal-body p-4">
                <div className="text-center">
                  <i className="bi bi-exclamation-triangle-fill text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                  <h6 className="fw-bold mb-3">Are you absolutely sure?</h6>
                  <p className="text-muted mb-0">
                    This action will permanently delete your account and all associated data. 
                    This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-lg px-4 ms-3"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileAcc;