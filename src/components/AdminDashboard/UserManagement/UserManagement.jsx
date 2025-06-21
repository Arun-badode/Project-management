import React, { useState } from "react";

function UserManagement() {
   const [showModal, setShowModal] = useState(false);
   const [modalType, setModalType] = useState(""); // "view" or "edit"
const [selectedMember, setSelectedMember] = useState(null);
  const [form, setForm] = useState({ initials: '', name: '', role: '' });
 const teamMembers = [
  {
    initials: "JD",
    fullName: "John Doe",
    role: "Lead",
    skills: ["Word", "Excel", "PPT"],
    username: "johndoe",
    password: "123456", // Ideally encrypted or masked
  },
  {
    initials: "MS",
    fullName: "Meena Sharma",
    role: "DTP Specialist",
    skills: ["Visio", "PPT"],
    username: "meenasharma",
    password: "secure@123",
  },
];




  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to add member to teamMembers (currently static)
    setShowModal(false);
    setForm({ initials: "", name: "", role: "" });
  };
  return (
    <div>
      <div className="team-section py-5 px-3 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>User Management</h3>
       <button
  className="btn btn-outline-light rounded-pill px-3 gradient-button"
  onClick={() => {
    setModalType("");
    setSelectedMember(null);
    setShowModal(true);
  }}
>
  + Add Member
</button>
      </div>
<table className="table table-bordered align-middle table-gradient-bg">
  <thead className="table">
    <tr>
      <th>#</th>
      <th>Full Name</th>
      <th>Role</th>
      <th>App Skills</th>
      <th>Username</th>
      <th>Password</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {teamMembers.map((member, idx) => (
      <tr key={idx}>
        <td>{idx + 1}</td>
        <td>{member.fullName}</td>
        <td>{member.role}</td>
        <td>
          {member.skills && member.skills.length > 0
            ? member.skills.join(", ")
            : "N/A"}
        </td>
        <td>{member.username}</td>
        <td>{member.password ? "••••••" : "Not Set"}</td>
       <td>
  <button
    className="btn btn-sm btn-primary me-2"
    onClick={() => {
      setSelectedMember(member);
      setModalType("view");
      setShowModal(true);
    }}
  >
    View
  </button>
  <button
    className="btn btn-sm btn-info me-2"
    onClick={() => {
      setSelectedMember(member);
      setModalType("edit");
      setShowModal(true);
    }}
  >
    Edit
  </button>
  <button className="btn btn-sm btn-danger">Delete</button>
</td>
      </tr>
    ))}
  </tbody>
</table>


    </div>
     {/* Modal */}
    
{showModal && (
  <div
    className="modal d-block custom-modal-dark"
    tabIndex="-1"
    style={{
      background: 'rgba(0,0,0,0.5)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1050,
    }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {modalType === "view"
              ? "View Member"
              : modalType === "edit"
              ? "Edit Member"
              : "Add Member"}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        {/* View Modal */}
        {modalType === "view" && selectedMember && (
          <div className="modal-body">
            <p><b>Full Name:</b> {selectedMember.fullName}</p>
            <p><b>Role:</b> {selectedMember.role}</p>
            <p><b>Skills:</b> {selectedMember.skills?.join(", ")}</p>
            <p><b>Username:</b> {selectedMember.username}</p>
            <p><b>Password:</b> {selectedMember.password ? "••••••" : "Not Set"}</p>
          </div>
        )}

        {/* Edit Modal */}
        {modalType === "edit" && selectedMember && (
          <form /* onSubmit={handleEditSubmit} */>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  defaultValue={selectedMember.fullName}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="role"
                  defaultValue={selectedMember.role}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Lead">Lead</option>
                  <option value="DTP Specialist">DTP Specialist</option>
                  <option value="Layout Artist">Layout Artist</option>
                  <option value="Quality Analyst">Quality Analyst</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Apps Skill</label>
                <select
                  className="form-select"
                  name="skill"
                  required
                >
                  <option value="">Select Skill</option>
                  <option value="Word">Word</option>
                  <option value="Excel">Excel</option>
                  <option value="PPT">PPT</option>
                  <option value="Visio">Visio</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  defaultValue={selectedMember.username}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  defaultValue={selectedMember.password}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Add Modal */}
        {!modalType && (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="role"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Lead">Lead</option>
                  <option value="DTP Specialist">DTP Specialist</option>
                  <option value="Layout Artist">Layout Artist</option>
                  <option value="Quality Analyst">Quality Analyst</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Apps Skill</label>
                <select
                  className="form-select"
                  name="skill"
                  required
                >
                  <option value="">Select Skill</option>
                  <option value="Word">Word</option>
                  <option value="Excel">Excel</option>
                  <option value="PPT">PPT</option>
                  <option value="Visio">Visio</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Member
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default UserManagement;
