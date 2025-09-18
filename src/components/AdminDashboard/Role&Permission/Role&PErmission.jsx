import React, { useState, useEffect } from "react";
import { Edit, Plus } from "lucide-react";
import { Modal } from "react-bootstrap";
import BASE_URL from "../../../config";
import Swal from "sweetalert2";
import axios from "axios";

const RoleManagementSystem = () => {
  const [currentView, setCurrentView] = useState("roleList");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [permissionsState, setPermissionsState] = useState({});
  const [newRole, setNewRole] = useState({ roleName: "", description: "", type: "" });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}roles/getAllRoles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch roles");
      setLoading(false);
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch permissions for a selected role
  const fetchPermissions = async (roleId) => {
    try {
      const res = await axios.get(`${BASE_URL}roles/permission/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status) {
        // Transform API data to module-feature structure
        const permissions = {};
        res.data.data.forEach((perm) => {
          const moduleName = perm.featureName.split("-")[0].trim();
          if (!permissions[moduleName]) permissions[moduleName] = [];
          permissions[moduleName].push({
            feature: perm.featureName,
            isGet: perm.canView === "1",
            isCreate: perm.canAdd === "1",
            isEdit: perm.canEdit === "1",
            isDelete: perm.canDelete === "1",
            permission: perm.canView === "1", // optional: top-level permission
            _id: perm.id,
          });
        });
        setPermissionsState(permissions);
      }
    } catch (err) {
      console.error("Error fetching permissions", err);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch permissions",
      });
    }
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    fetchPermissions(role.id); // Fetch real permissions
    setShowPermissionsModal(true);
  };

  const handleClosePermissionsModal = () => {
    setShowPermissionsModal(false);
    setSelectedRole(null);
    setPermissionsState({});
  };

  const handleOpenAddRoleModal = () => {
    setNewRole({ roleName: "", description: "", type: "" });
    setShowAddRoleModal(true);
  };

  const handleCloseAddRoleModal = () => setShowAddRoleModal(false);

  const handleAddRole = async () => {
    if (!newRole.roleName.trim()) {
      Swal.fire({ icon: "warning", title: "Role name is required" });
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}roles/addRole`,
        { ...newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({ icon: "success", title: "Role Added Successfully!", timer: 1500, showConfirmButton: false });
      setShowAddRoleModal(false);
      fetchRoles();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to add role", text: err.response?.data?.message || err.message });
    }
  };

  const togglePermission = (module, index, type) => {
    setPermissionsState((prev) => {
      const updated = { ...prev };
      updated[module][index][type] = !updated[module][index][type];
      return updated;
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      const payload = Object.values(permissionsState).flat().map((perm) => ({
        id: perm._id,
        canView: perm.isGet ? 1 : 0,
        canAdd: perm.isCreate ? 1 : 0,
        canEdit: perm.isEdit ? 1 : 0,
        canDelete: perm.isDelete ? 1 : 0,
      }));

      const res = await axios.put(`${BASE_URL}roles/updatepermission`, { permissions: payload, roleId: selectedRole.id }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (res.data.success) {
        Swal.fire({ icon: "success", title: "Permissions updated successfully!" });
        handleClosePermissionsModal();
      } 
    } catch (err) {
      console.error("Error updating permissions", err);
      Swal.fire({ icon: "error", title: "Error updating permissions" });
    }
  };

  useEffect(() => {
    document.body.style.overflow = showPermissionsModal ? "hidden" : "auto";
  }, [showPermissionsModal]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  return (
    <div className="min-vh-100 bg-light p-2 p-md-3 bg-main">
      <div className="mb-4 border-0 mybg text-white bg-card" style={{ borderRadius: "12px", padding: "1.2rem", height: "80px" }}>
        <h2 className="mb-0 gradient-heading">Permission Management</h2>
      </div>

      <div className="row justify-content-center">
        {currentView === "roleList" ? (
          <div className="card shadow rounded-3 p-3 bg-card">
            <div className="card-header bg-white border-bottom pb-0 bg-card d-flex justify-content-between align-items-center mb-3">
              <h2 className="card-title h4 m-0">Roles</h2>
              <button className="btn gradient-button btn-sm d-flex align-items-center gap-1" onClick={handleOpenAddRoleModal}>
                <Plus size={16} /> Add Role
              </button>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table align-middle table-hover table-borderless mb-0 text-center table-gradient-bg">
                  <thead className="table-gradient-bg" style={{ position: "sticky", top: 0, zIndex: 0, backgroundColor: "#fff" }}>
                    <tr>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.id}>
                        <td style={{textAlign:"left"}}>{role.roleName}</td>
                        <td style={{textAlign:"left"}}>{role.description}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEditRole(role)}>
                            <Edit size={14} />
                            
                          </button>
                           <button
                        className="btn btn-sm btn-outline-danger"
                      
                        title="Delete Member"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Permissions Modal */}
      <Modal show={showPermissionsModal} onHide={handleClosePermissionsModal} size="xl" backdrop="static" centered className="custom-modal-dark">
        <Modal.Header closeButton>
          <Modal.Title>Assign Permission ({selectedRole?.roleName})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.entries(permissionsState).map(([module, features]) => (
            <div key={module} className="mb-4">
              <h5>{module}</h5>
              <div className="table-responsive">
                <table className="table table-hover text-center align-middle table-gradient-bg">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>View</th>
                      <th>Add</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((f, idx) => (
                      <tr key={f._id}>
                        <td>{f.feature}</td>
                        <td><input type="checkbox" checked={f.isGet} onChange={() => togglePermission(module, idx, "isGet")} /></td>
                        <td><input type="checkbox" checked={f.isCreate} onChange={() => togglePermission(module, idx, "isCreate")} /></td>
                        <td><input type="checkbox" checked={f.isEdit} onChange={() => togglePermission(module, idx, "isEdit")} /></td>
                        <td><input type="checkbox" checked={f.isDelete} onChange={() => togglePermission(module, idx, "isDelete")} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-outline-secondary" onClick={handleClosePermissionsModal}>Cancel</button>
            <button className="btn gradient-button" onClick={handleSavePermissions}>Save Permissions</button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Role Modal */}
      <Modal show={showAddRoleModal} onHide={handleCloseAddRoleModal} centered className="custom-modal-dark">
        <Modal.Header closeButton>
          <Modal.Title>Add New Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Role Name</label>
            <input type="text" className="form-control" value={newRole.roleName} onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input type="text" className="form-control" value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseAddRoleModal}>Cancel</button>
          <button className="btn gradient-button" onClick={handleAddRole}>Add Role</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleManagementSystem;
