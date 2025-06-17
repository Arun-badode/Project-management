import React, { useState } from "react";

const rolesData = [
  { name: "Admin", permissions: { create: true, edit: true, delete: true } },
  { name: "Manager", permissions: { create: true, edit: true, delete: false } },
  { name: "Viewer", permissions: { create: false, edit: false, delete: false } },
];

const templatesData = [
  { name: "Product Template", file: "product.xlsx" },
  { name: "Employee Template", file: "employee.xlsx" },
];

const backupsData = [
  { id: 1, time: "2025-06-17 10:00", location: "Cloud" },
  { id: 2, time: "2025-06-16 09:30", location: "Local" },
];

export default function SettingsPage() {
  // App Config
  const [appName, setAppName] = useState("My Application");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [theme, setTheme] = useState("light");

  // Roles
  const [roles, setRoles] = useState(rolesData);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editRoleIndex, setEditRoleIndex] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: "", permissions: { create: false, edit: false, delete: false } });

  // Templates
  const [templates, setTemplates] = useState(templatesData);
  const [uploadType, setUploadType] = useState("Product");
  const [uploadedFile, setUploadedFile] = useState(null);

  // Notifications
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
    frequency: "Immediate",
  });

  // Backup
  const [backupFrequency, setBackupFrequency] = useState("Daily");
  const [backupLocation, setBackupLocation] = useState("Cloud");
  const [backups, setBackups] = useState(backupsData);

  // Handlers
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleRoleEdit = (idx) => {
    setEditRoleIndex(idx);
    setRoleForm({ ...roles[idx] });
    setShowRoleModal(true);
  };

  const handleRoleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["create", "edit", "delete"].includes(name)) {
      setRoleForm((prev) => ({
        ...prev,
        permissions: { ...prev.permissions, [name]: checked },
      }));
    } else {
      setRoleForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleSave = () => {
    const updatedRoles = [...roles];
    if (editRoleIndex !== null) {
      updatedRoles[editRoleIndex] = roleForm;
    } else {
      updatedRoles.push(roleForm);
    }
    setRoles(updatedRoles);
    setShowRoleModal(false);
    setEditRoleIndex(null);
    setRoleForm({ name: "", permissions: { create: false, edit: false, delete: false } });
  };

  const handleAddRole = () => {
    setEditRoleIndex(null);
    setRoleForm({ name: "", permissions: { create: false, edit: false, delete: false } });
    setShowRoleModal(true);
  };

  return (
    <div className="container-fluid settings-main-unique py-4">
      <h2 className="mb-4 fw-bold">Settings</h2>
      <div className="row g-4">
        {/* App Configurations */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm settings-card-unique">
            <div className="card-header bg-light settings-card-header-unique">
              <h5 className="mb-0">App Configurations</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Application Name</label>
                <input
                  type="text"
                  className="form-control settings-input-unique"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Logo</label>
                <input
                  type="file"
                  className="form-control settings-logo-input-unique"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="img-thumbnail mt-2 settings-logo-preview-unique"
                    style={{ maxWidth: 100, maxHeight: 100 }}
                  />
                )}
              </div>
              <div className="row g-2 mb-3">
                <div className="col">
                  <label className="form-label fw-semibold">Default Language</label>
                  <select
                    className="form-select settings-select-unique"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                <div className="col">
                  <label className="form-label fw-semibold">Timezone</label>
                  <select
                    className="form-select settings-select-unique"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="IST">IST</option>
                  </select>
                </div>
              </div>
              <div className="form-check form-switch settings-theme-toggle-unique">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="themeSwitch"
                  checked={theme === "dark"}
                  onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                />
                <label className="form-check-label" htmlFor="themeSwitch">
                  {theme === "light" ? "Light Theme" : "Dark Theme"}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Role & Permission Control */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm settings-card-unique">
            <div className="card-header bg-light settings-card-header-unique d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Role & Permission Control</h5>
              <button className="btn btn-primary btn-sm settings-add-role-btn-unique" onClick={handleAddRole}>
                Add Role
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered align-middle settings-table-unique">
                  <thead className="table-light">
                    <tr>
                      <th>Role</th>
                      <th>Create</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role, idx) => (
                      <tr key={role.name}>
                        <td>{role.name}</td>
                        <td>
                          <input type="checkbox" className="form-check-input" checked={role.permissions.create} disabled />
                        </td>
                        <td>
                          <input type="checkbox" className="form-check-input" checked={role.permissions.edit} disabled />
                        </td>
                        <td>
                          <input type="checkbox" className="form-check-input" checked={role.permissions.delete} disabled />
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-secondary btn-sm settings-edit-role-btn-unique"
                            onClick={() => handleRoleEdit(idx)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Role Modal */}
              {showRoleModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">{editRoleIndex !== null ? "Edit Role" : "Add Role"}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowRoleModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">Role Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={roleForm.name}
                            onChange={handleRoleFormChange}
                          />
                        </div>
                        <div className="mb-2 fw-semibold">Permissions</div>
                        <div className="form-check mb-1">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="create"
                            checked={roleForm.permissions.create}
                            onChange={handleRoleFormChange}
                            id="permCreate"
                          />
                          <label className="form-check-label" htmlFor="permCreate">
                            Create
                          </label>
                        </div>
                        <div className="form-check mb-1">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="edit"
                            checked={roleForm.permissions.edit}
                            onChange={handleRoleFormChange}
                            id="permEdit"
                          />
                          <label className="form-check-label" htmlFor="permEdit">
                            Edit
                          </label>
                        </div>
                        <div className="form-check mb-1">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="delete"
                            checked={roleForm.permissions.delete}
                            onChange={handleRoleFormChange}
                            id="permDelete"
                          />
                          <label className="form-check-label" htmlFor="permDelete">
                            Delete
                          </label>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleRoleSave}>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Excel Template Management */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm settings-card-unique">
            <div className="card-header bg-light settings-card-header-unique">
              <h5 className="mb-0">Excel Template Management</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Upload Type</label>
                <select
                  className="form-select settings-select-unique"
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                >
                  <option>Product</option>
                  <option>Employee</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Upload Template</label>
                <div
                  className="border rounded p-3 text-center settings-drag-drop-unique"
                  style={{ background: "#f8f9fa", cursor: "pointer" }}
                  onClick={() => document.getElementById("templateUploadInput").click()}
                >
                  <input
                    type="file"
                    id="templateUploadInput"
                    className="d-none"
                    onChange={(e) => setUploadedFile(e.target.files[0])}
                  />
                  {uploadedFile ? (
                    <span>{uploadedFile.name}</span>
                  ) : (
                    <span>Drag & drop or click to upload</span>
                  )}
                </div>
              </div>
              <div>
                <label className="form-label fw-semibold">Templates</label>
                <ul className="list-group settings-template-list-unique">
                  {templates.map((tpl) => (
                    <li key={tpl.name} className="list-group-item d-flex justify-content-between align-items-center">
                      {tpl.name}
                      <button className="btn btn-outline-success btn-sm settings-download-btn-unique">
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm settings-card-unique">
            <div className="card-header bg-light settings-card-header-unique">
              <h5 className="mb-0">Notification Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notifEmail"
                    checked={notifications.email}
                    onChange={() => setNotifications((n) => ({ ...n, email: !n.email }))}
                  />
                  <label className="form-check-label" htmlFor="notifEmail">
                    Email Notifications
                  </label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notifSMS"
                    checked={notifications.sms}
                    onChange={() => setNotifications((n) => ({ ...n, sms: !n.sms }))}
                  />
                  <label className="form-check-label" htmlFor="notifSMS">
                    SMS Notifications
                  </label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notifInApp"
                    checked={notifications.inApp}
                    onChange={() => setNotifications((n) => ({ ...n, inApp: !n.inApp }))}
                  />
                  <label className="form-check-label" htmlFor="notifInApp">
                    In-App Notifications
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label fw-semibold">Notification Frequency</label>
                <select
                  className="form-select settings-select-unique"
                  value={notifications.frequency}
                  onChange={(e) => setNotifications((n) => ({ ...n, frequency: e.target.value }))}
                >
                  <option>Immediate</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Backup & Recovery Settings */}
        <div className="col-12">
          <div className="card shadow-sm settings-card-unique">
            <div className="card-header bg-light settings-card-header-unique">
              <h5 className="mb-0">Backup & Recovery Settings</h5>
            </div>
            <div className="card-body">
              <div className="row g-3 align-items-end mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Backup Frequency</label>
                  <select
                    className="form-select settings-select-unique"
                    value={backupFrequency}
                    onChange={(e) => setBackupFrequency(e.target.value)}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Storage Destination</label>
                  <div className="btn-group settings-backup-toggle-unique" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="backupLocation"
                      id="cloud"
                      checked={backupLocation === "Cloud"}
                      onChange={() => setBackupLocation("Cloud")}
                    />
                    <label className="btn btn-outline-primary" htmlFor="cloud">
                      Cloud
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="backupLocation"
                      id="local"
                      checked={backupLocation === "Local"}
                      onChange={() => setBackupLocation("Local")}
                    />
                    <label className="btn btn-outline-primary" htmlFor="local">
                      Local
                    </label>
                  </div>
                </div>
                <div className="col-md-4 d-flex gap-2">
                  <button className="btn btn-success w-50 settings-backup-btn-unique">Create Backup Now</button>
                  <button className="btn btn-outline-secondary w-50 settings-restore-btn-unique">Restore Backup</button>
                </div>
              </div>
              <div>
                <label className="form-label fw-semibold">Past Backups</label>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle settings-table-unique">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Timestamp</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backups.map((b, idx) => (
                        <tr key={b.id}>
                          <td>{idx + 1}</td>
                          <td>{b.time}</td>
                          <td>{b.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}