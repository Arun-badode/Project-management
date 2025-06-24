import React, { useState, useEffect } from "react";

const ProfileAcc = () => {
  // Simulate user role from login/session/localStorage
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Example: load role from localStorage or API
    const role = localStorage.getItem("userRole") || "team"; // "admin", "manager", or "team"
    setUserRole(role);
  }, []);

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "manager":
        return "Manager";
      case "team":
        return "Team Member";
      default:
        return "User";
    }
  };

  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [successMessage, setSuccessMessage] = useState("");

  const handleProfileChange = (field, value) => {
    setEditProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setProfile({ ...editProfile });
    setIsEditMode(false);
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
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
          setEditProfile((prev) => ({ ...prev, avatar: newAvatar }));
        } else {
          setProfile((prev) => ({ ...prev, avatar: newAvatar }));
          setSuccessMessage("Profile photo updated!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container-fluid px-2 px-md-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
              <h1 className="gradient-heading text-center text-md-start">
                Profile & Account
              </h1>
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mb-0 py-2 px-3" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {successMessage}
                </div>
              )}
            </div>

            <div className="row g-4">
              <div className="col-12">
                <div className="card shadow-sm bg-card border-0 h-100">
                  <div className="card-header text-white d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0 fs-5">My Profile</h3>
                    <span className="badge bg-secondary">
                      {getRoleLabel(userRole)}
                    </span>
                    {!isEditMode ? (
                      <button className="btn btn-outline-light btn-sm" onClick={() => setIsEditMode(true)}>
                        Edit
                      </button>
                    ) : (
                      <div className="btn-group btn-group-sm flex-column flex-sm-row">
                        <button className="btn btn-success mb-2 mb-sm-0" onClick={handleSaveProfile}>
                          <i className="bi bi-check-lg me-1"></i> Save
                        </button>
                        <button className="btn btn-outline-light" onClick={handleCancelEdit}>
                          <i className="bi bi-x-lg me-1"></i> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <div className="text-center mb-4">
                      <div className="position-relative d-inline-block">
                        <img
                          src={isEditMode ? editProfile.avatar : profile.avatar}
                          alt="Profile Avatar"
                          className="rounded-circle border border-3 border-primary"
                          style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle p-2"
                          style={{ cursor: "pointer" }}
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

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Full Name</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control form-control-lg border-0 bg-light"
                            value={editProfile.fullName}
                            onChange={(e) => handleProfileChange("fullName", e.target.value)}
                          />
                        ) : (
                          <div className="form-control form-control-lg border-0 bg-light">{profile.fullName}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Email</label>
                        {isEditMode ? (
                          <input
                            type="email"
                            className="form-control form-control-lg border-0 bg-light"
                            value={editProfile.email}
                            onChange={(e) => handleProfileChange("email", e.target.value)}
                          />
                        ) : (
                          <div className="form-control form-control-lg border-0 bg-light">{profile.email}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Phone Number</label>
                        {isEditMode ? (
                          <input
                            type="tel"
                            className="form-control form-control-lg border-0 bg-light"
                            value={editProfile.phone}
                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                          />
                        ) : (
                          <div className="form-control form-control-lg border-0 bg-light">{profile.phone}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted small">Address</label>
                        {isEditMode ? (
                          <textarea
                            className="form-control form-control-lg border-0 bg-light"
                            rows="3"
                            value={editProfile.address}
                            onChange={(e) => handleProfileChange("address", e.target.value)}
                          />
                        ) : (
                          <div
                            className="form-control form-control-lg border-0 bg-light"
                            style={{ minHeight: "76px" }}
                          >
                            {profile.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* You can add more settings or password sections here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAcc;
