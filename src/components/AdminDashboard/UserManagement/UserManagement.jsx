import React, { useState } from "react";
import useSyncScroll from "../Hooks/useSyncScroll";

function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "view" or "edit"
  const [selectedMember, setSelectedMember] = useState(null);
  const [form, setForm] = useState({
    empId: "",
    fullName: "",
    doj: "",
    dob: "",
    team: "",
    role: "",
    appSkills: [],
    username: "",
    password: "",
  });

  const teamMembers = [
    {
      empId: "E001",
      fullName: "John Doe",
      doj: "01-01-2020",
      dob: "15-08-1990",
      team: "Adobe",
      role: "Lead",
      appSkills: ["Word", "Excel", "PPT"],
      username: "johndoe",
      password: "123456", // Ideally encrypted or masked
    },
    {
      empId: "E002",
      fullName: "Meena Sharma",
      doj: "15-03-2021",
      dob: "20-12-1992",
      team: "MS Office",
      role: "DTP Specialist",
      appSkills: ["Visio", "PPT"],
      username: "meenasharma",
      password: "secure@123",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to add member to teamMembers (currently static)
    setShowModal(false);
    setForm({
      empId: "",
      fullName: "",
      doj: "",
      dob: "",
      team: "",
      role: "",
      appSkills: [],
      username: "",
      password: "",
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { options } = e.target;
    const selectedSkills = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedSkills.push(options[i].value);
      }
    }
    setForm((prevForm) => ({
      ...prevForm,
      appSkills: selectedSkills,
    }));
  };

  const { scrollContainerRef, fakeScrollbarRef } = useSyncScroll(true);

  const renderTable = () => (
    <>
      <div
        ref={fakeScrollbarRef}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          height: 16,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
        }}
      >
        <div style={{ width: "1200px", height: 1 }} />
      </div>
      <div
        className="table-responsive"
        style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
        ref={scrollContainerRef}
      >
        <table className="table  table-bordered align-middle table-gradient-bg">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Full Name</th>
              <th>DOJ</th>
              <th>DOB</th>
              <th>Team</th>
              <th>Role</th>
              <th>App Skills</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers
              .sort((a, b) => (a.empId > b.empId ? 1 : -1)) // Sort by Emp ID ascending
              .map((member, idx) => (
                <tr key={idx}>
                  <td>{member.empId}</td>
                  <td>{member.fullName}</td>
                  <td>{member.doj}</td>
                  <td>{member.dob}</td>
                  <td>{member.team}</td>
                  <td>{member.role}</td>
                  <td>{member.appSkills.join(", ")}</td>
                  <td>{member.username}</td>
                  <td className="">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => {
                        setSelectedMember(member);
                        setModalType("view");
                        setShowModal(true);
                      }}
                    >
                      <i className="fas fa-chevron-up fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => {
                        setSelectedMember(member);
                        setModalType("edit");
                        setShowModal(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-danger"> <i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderModalContent = () => {
    const isEditMode = modalType === "edit" || modalType === "view";
    return (
      <form onSubmit={handleSubmit} >
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Emp ID</label>
            <input
              type="text"
              className="form-control"
              name="empId"
              value={form.empId}
              onChange={handleFieldChange}
              required
              disabled={isEditMode} // Disable if viewing/editing
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={form.fullName}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">DOJ (Date of Joining)</label>
            <input
              type="text"
              className="form-control"
              name="doj"
              value={form.doj}
              onChange={handleFieldChange}
              placeholder="DD-MM-YYYY"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">DOB (Date of Birth)</label>
            <input
              type="text"
              className="form-control"
              name="dob"
              value={form.dob}
              onChange={handleFieldChange}
              placeholder="DD-MM-YYYY"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Team</label>
            <select
              className="form-select"
              name="team"
              value={form.team}
              onChange={handleFieldChange}
              required
            >
              <option value="">Select Team</option>
              <option value="Adobe">Adobe</option>
              <option value="MS Office">MS Office</option>
              <option value="QA">QA</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <input
              type="text"
              className="form-control"
              name="role"
              value={form.role}
              onChange={handleFieldChange}
              required
            />
          </div>
          {/* <div className="mb-3">
  <label className="form-label">App Skills</label>
  <select
    className="form-select"
    name="appSkills"
    value={form.appSkills}
    onChange={handleFieldChange}
    multiple
    size={1} // Keep it closed until clicked
    style={{ overflowY: 'hidden' }} // Optional, to reduce height
    required
  >
    <option value="Word">Word</option>
    <option value="Excel">Excel</option>
    <option value="PPT">PPT</option>
    <option value="Visio">Visio</option>
  </select>
</div> */}

          <div className="mb-3">
            <label className="form-label">App Skills</label>
            <select
              className="form-select"
              name="appSkills"
              value={form.appSkills}
              onChange={handleFieldChange}
              required
            >
              <option value="">Select Skills</option>
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
              value={form.username}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleFieldChange}
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary rounded-5"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn gradient-button">
            {modalType === "edit" ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </form>

    );
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between">
        <h2 className="gradient-heading mt-2 ">User Management</h2>
        <div className="text-end mb-3">
          <button
            className="btn gradient-button"
            onClick={() => {
              setModalType("add");
              setShowModal(true);
            }}
          >
            + Add Member
          </button>
        </div>
      </div>
      {renderTable()}

      {/* Modal */}
      {showModal && (
        <div className="modal custom-modal-dark" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "edit"
                    ? "Edit Member"
                    : modalType === "view"
                      ? "View Member"
                      : "Add Member"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
