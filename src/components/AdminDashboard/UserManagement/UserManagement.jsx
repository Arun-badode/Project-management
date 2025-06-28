import React, { useState } from "react";
import Select from "react-select";

function UserManagement() {
  // State for modal and member management
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "view", "edit", or "add"
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("live");
  
  // State for team members data
  const [teamMembers, setTeamMembers] = useState([
    {
      empId: "E001",
      fullName: "John Doe",
      doj: "2022-01-01",
      dob: "1990-05-10",
      team: "Dev",
      role: "Frontend",
      appSkills: ["React", "JS"],
      username: "johnd",
      status: "active",
    },
    {
      empId: "E002",
      fullName: "Jane Smith",
      doj: "2021-07-15",
      dob: "1992-04-22",
      team: "QA",
      role: "Tester",
      appSkills: ["Selenium"],
      username: "janes",
      status: "freezed",
    },
    {
      empId: "E003",
      fullName: "Amit Sharma",
      doj: "2020-11-12",
      dob: "1988-02-10",
      team: "Design",
      role: "UI/UX",
      appSkills: ["Figma", "Adobe XD"],
      username: "amitsh",
      status: "active",
    },
    {
      empId: "E004",
      fullName: "Priya Mehra",
      doj: "2019-06-21",
      dob: "1993-09-18",
      team: "DevOps",
      role: "Engineer",
      appSkills: ["Docker", "Kubernetes", "AWS"],
      username: "priyam",
      status: "freezed",
    },
    {
      empId: "E005",
      fullName: "Rahul Verma",
      doj: "2023-03-10",
      dob: "1995-11-23",
      team: "Dev",
      role: "Backend",
      appSkills: ["Node.js", "MongoDB", "Express"],
      username: "rahulv",
      status: "active",
    },
    {
      empId: "E006",
      fullName: "Neha Kaur",
      doj: "2022-09-05",
      dob: "1991-12-05",
      team: "HR",
      role: "Recruiter",
      appSkills: ["Excel", "LinkedIn", "HRMS"],
      username: "nehak",
      status: "active",
    },
    {
      empId: "E007",
      fullName: "Arjun Nair",
      doj: "2018-04-17",
      dob: "1987-03-30",
      team: "IT Support",
      role: "Tech Support",
      appSkills: ["Windows", "Networking", "VPN"],
      username: "arjunn",
      status: "freezed",
    },
    {
      empId: "E008",
      fullName: "Sneha Roy",
      doj: "2021-02-25",
      dob: "1994-06-12",
      team: "Marketing",
      role: "Content Writer",
      appSkills: ["SEO", "Content Writing", "Canva"],
      username: "snehar",
      status: "active",
    }
  ]);

  // Form state for adding/editing members
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

  // Filter members based on active tab
  const liveMembers = teamMembers.filter((m) => m.status === "active");
  const freezedMembers = teamMembers.filter((m) => m.status === "freezed");

  // Custom styles for react-select component
  const gradientSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      background: 'linear-gradient(to bottom right, #141c3a, #1b2f6e)',
      color: 'white',
      borderColor: state.isFocused ? '#ffffff66' : '#ffffff33',
      boxShadow: state.isFocused ? '0 0 0 1px #ffffff66' : 'none',
      minHeight: '38px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#1b2f6e',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'white',
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#293d80' : 'linear-gradient(to bottom right, #141c3a, #1b2f6e)',
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      background: 'linear-gradient(to bottom right, #141c3a, #1b2f6e)',
      color: 'white',
    }),
  };

  // Application options for skills select
  const applicationsOptions = [
    { value: "Word", label: "Word" },
    { value: "PPT", label: "PPT" },
    { value: "Excel", label: "Excel" },
    { value: "INDD", label: "INDD" },
    { value: "AI", label: "AI" },
    { value: "PSD", label: "PSD" },
    { value: "AE", label: "AE" },
    { value: "CDR", label: "CDR" },
    { value: "Visio", label: "Visio" },
    { value: "Project", label: "Project" },
    { value: "FM", label: "FM" },
  ];

  // Toggle member status between active and freezed
  const toggleFreezeMember = (empId) => {
    setTeamMembers(prevMembers =>
      prevMembers.map(member =>
        member.empId === empId
          ? {
              ...member,
              status: member.status === "active" ? "freezed" : "active"
            }
          : member
      )
    );
  };

  // Handle form submission
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

  // Handle form field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Render the members table
  const renderTable = () => (
    <div className="table-container">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "live" ? "active" : ""}`}
            onClick={() => setActiveTab("live")}
          >
            Live
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "freezed" ? "active" : ""}`}
            onClick={() => setActiveTab("freezed")}
          >
            Freezed
          </button>
        </li>
      </ul>

      {/* Live Members Table */}
      {activeTab === "live" && (
        <div className="table-responsive table-gradient-bg" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-bordered align-middle">
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {liveMembers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-muted">
                    No active members found.
                  </td>
                </tr>
              ) : (
                liveMembers.map((member, idx) => (
                  <tr key={idx}>
                    <td>{member.empId}</td>
                    <td>{member.fullName}</td>
                    <td>{member.doj}</td>
                    <td>{member.dob}</td>
                    <td>{member.team}</td>
                    <td>{member.role}</td>
                    <td>{member.appSkills.join(", ")}</td>
                    <td>{member.username}</td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-info me-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => toggleFreezeMember(member.empId)}
                        title="Freeze Account"
                      >
                        <i className="fas fa-snowflake"></i>
                      </button>
                      <button className="btn btn-sm btn-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Freezed Members Table */}
      {activeTab === "freezed" && (
        <div className="table-responsive table-gradient-bg" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-bordered align-middle">
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {freezedMembers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-muted">
                    No freezed members found.
                  </td>
                </tr>
              ) : (
                freezedMembers.map((member, idx) => (
                  <tr key={idx}>
                    <td>{member.empId}</td>
                    <td>{member.fullName}</td>
                    <td>{member.doj}</td>
                    <td>{member.dob}</td>
                    <td>{member.team}</td>
                    <td>{member.role}</td>
                    <td>{member.appSkills.join(", ")}</td>
                    <td>{member.username}</td>
                    <td>
                      <span className="badge bg-secondary">Freezed</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-info me-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-success me-2"
                        onClick={() => toggleFreezeMember(member.empId)}
                        title="Activate Account"
                      >
                        <i className="fas fa-sun"></i>
                      </button>
                      <button className="btn btn-sm btn-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Render modal content based on modal type
  const renderModalContent = () => {
    const isEditMode = modalType === "edit" || modalType === "view";
    return (
      <form onSubmit={handleSubmit}>
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
              disabled={isEditMode}
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
          <div className="mb-3">
            <label className="form-label text-white">App Skills</label>
            <Select
              options={applicationsOptions}
              isMulti
              value={selectedApplications}
              onChange={setSelectedApplications}
              placeholder="Select"
              styles={gradientSelectStyles}
            />
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

  // Main component render
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between">
        <h2 className="gradient-heading mt-2">User Management</h2>
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

      {/* Modal for adding/editing members */}
      {showModal && (
        <div
          className="modal custom-modal-dark"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
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