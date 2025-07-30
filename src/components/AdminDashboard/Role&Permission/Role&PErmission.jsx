import React, { useState, useEffect } from "react";
import { Edit, Plus } from "lucide-react";
import { Modal } from "react-bootstrap";

const RoleManagementSystem = () => {
  const [currentView, setCurrentView] = useState("roleList");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  const [permissionsState, setPermissionsState] = useState({});
  const [newRole, setNewRole] = useState({ roleName: "", description: "" });

  const [roles, setRoles] = useState([
    { _id: "1", roleName: "Admin", description: "Full Access" },
    { _id: "2", roleName: "Manager", description: "Limited Access" },
    { _id: "3", roleName: "Team Member", description: "Custom Access" },
  ]);

  const dummyPermissions = {
    Dashboard: [
      {
        feature: "Overview",
        isGet: true,
        isCreate: false,
        isEdit: false,
        isDelete: false,
        permission: true,
        _id: "a1",
      },
    ],
    Users: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
    Project: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
    Task: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
    TimeTraking: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
    FileManagement: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
    QAManagement: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
    Reporting$Analytics: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
    AuditLog: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
    ProfileAccount: [
      {
        feature: "Manage Users",
        isGet: true,
        isCreate: true,
        isEdit: true,
        isDelete: true,
        permission: true,
        _id: "b1",
      },
    ],
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setPermissionsState(dummyPermissions);
    setShowPermissionsModal(true);
  };

  const handleClosePermissionsModal = () => {
    setShowPermissionsModal(false);
    setSelectedRole(null);
    setPermissionsState({});
  };

  const handleOpenAddRoleModal = () => {
    setNewRole({ roleName: "", description: "" });
    setShowAddRoleModal(true);
  };

  const handleCloseAddRoleModal = () => {
    setShowAddRoleModal(false);
  };

  const handleAddRole = () => {
    if (newRole.roleName.trim()) {
      const newRoleObj = {
        _id: Date.now().toString(),
        roleName: newRole.roleName,
        description: newRole.description,
      };
      setRoles([...roles, newRoleObj]);
      setShowAddRoleModal(false);
    }
  };

  const togglePermission = (module, index, type) => {
    setPermissionsState((prev) => {
      const updated = { ...prev };
      updated[module] = [...updated[module]];
      updated[module][index] = { ...updated[module][index] };
      updated[module][index][type] = !updated[module][index][type];
      return updated;
    });
  };

  useEffect(() => {
    document.body.style.overflow = showPermissionsModal ? "hidden" : "auto";
  }, [showPermissionsModal]);

  return (
    <div className="min-vh-100 bg-light p-2 p-md-3 bg-main">
      <div
        className="mb-4 border-0 mybg text-white bg-card"
        style={{ borderRadius: "12px", padding: "1.2rem", height: "80px" }}
      >
        <h2 className="mb-0 gradient-heading">Permission Management</h2>
      </div>

      <div className="row justify-content-center">
        {currentView === "roleList" ? (
          <div className="card shadow rounded-3 p-3 bg-card">
            <div className="card-header bg-white border-bottom pb-0 bg-card">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2 ">
                <h2 className="card-title h4 m-0">Permissions</h2>
                <button
                  className="btn gradient-button btn-sm d-flex align-items-center gap-1"
                  onClick={handleOpenAddRoleModal}
                >
                  <Plus size={16} /> Add Role
                </button>
              </div>
            </div>

            <div className="card-body p-0">
              <div
                className="table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <table className="table align-middle table-hover table-borderless mb-0 text-center table-gradient-bg">
                  <thead
                    className="table-gradient-bg table "
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 0,
                      backgroundColor: "#fff",
                    }}
                  >
                    <tr className="text-center">
                      <th>Role</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role._id}>
                        <td>{role.roleName}</td>
                        <td>
                          <span className="badge bg-light text-primary">
                            {role.description}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="">
            {Object.entries(permissionsState).map(([module, features]) => (
              <div key={module} className="mb-5">
                <div className="bg-light p-3 rounded mb-3 bg-card">
                  <h3 className="h5 mb-0">{module}</h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle text-center table-gradient-bg">
                    <thead
                      className="table-gradient-bg table "
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 0,
                        backgroundColor: "#fff",
                      }}
                    >
                      <tr className="text-center">
                        <th>Module</th>
                        <th>Module Permission</th>
                        <th>Feature</th>
                        <th>View</th>
                        <th>Add</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>Permission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((item, index) => (
                        <tr key={item._id} >
                          <td>{index === 0 ? module : ""}</td>
                          <td>
                            {index === 0 && (
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={features.some((f) => f.permission)}
                                onChange={() => {
                                  const updated = features.map((f) => ({
                                    ...f,
                                    permission: !features[0].permission,
                                  }));
                                  setPermissionsState((prev) => ({
                                    ...prev,
                                    [module]: updated,
                                  }));
                                }}
                              />
                            )}
                          </td>
                          <td>{item.feature}</td>
                          {[
                            "isGet",
                            "isCreate",
                            "isEdit",
                            "isDelete",
                            "permission",
                          ].map((type, idx) => (
                            <td key={idx}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={item[type]}
                                onChange={() => togglePermission(module, index, type)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div className="border-top pt-4 mt-4 d-flex justify-content-end gap-3">
              <button
                className="btn btn-outline-secondary rounded-5"
                onClick={handleClosePermissionsModal}
              >
                Cancel
              </button>
              <button
                className="btn gradient-button"
                onClick={() => alert("Permissions saved")}
              >
                Save Permissions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Permission Modal */}
      <Modal
        show={showPermissionsModal}
        onHide={handleClosePermissionsModal}
        size="xl"
        backdrop="static"
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Assign Permission ({selectedRole?.roleName})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            {Object.entries(permissionsState).map(([module, features]) => (
              <div key={module} className="mb-5">
                <div className="bg-light p-3 rounded mb-3 bg-card">
                  <h3 className="h5 mb-0">{module}</h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle text-center table-gradient-bg">
                    <thead
                      className="table-gradient-bg table "
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 0,
                        backgroundColor: "#fff",
                      }}
                    >
                      <tr className="text-center">
                        <th>Module</th>
                        <th>Module Permission</th>
                        <th>Feature</th>
                        <th>View</th>
                        <th>Add</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>Permission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((item, index) => (
                        <tr key={item._id} >
                          <td>{index === 0 ? module : ""}</td>
                          <td>
                            {index === 0 && (
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={features.some((f) => f.permission)}
                                onChange={() => {
                                  const updated = features.map((f) => ({
                                    ...f,
                                    permission: !features[0].permission,
                                  }));
                                  setPermissionsState((prev) => ({
                                    ...prev,
                                    [module]: updated,
                                  }));
                                }}
                              />
                            )}
                          </td>
                          <td>{item.feature}</td>
                          {[
                            "isGet",
                            "isCreate",
                            "isEdit",
                            "isDelete",
                            "permission",
                          ].map((type, idx) => (
                            <td key={idx}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={item[type]}
                                onChange={() => togglePermission(module, index, type)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div className="border-top pt-4 mt-4 d-flex justify-content-end gap-3">
              <button
                className="btn btn-outline-secondary rounded-5"
                onClick={handleClosePermissionsModal}
              >
                Cancel
              </button>
              <button
                className="btn gradient-button"
                onClick={() => alert("Permissions saved")}
              >
                Save Permissions
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Role Modal */}
      <Modal
        show={showAddRoleModal}
        onHide={handleCloseAddRoleModal}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Role Name</label>
              <input
                type="text"
                className="form-control"
                value={newRole.roleName}
                onChange={(e) =>
                  setNewRole({ ...newRole, roleName: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={newRole.description}
                onChange={(e) =>
                  setNewRole({ ...newRole, description: e.target.value })
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary rounded-5"
            onClick={handleCloseAddRoleModal}
          >
            Cancel
          </button>
          <button className="btn gradient-button" onClick={handleAddRole}>
            Add Role
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleManagementSystem;