import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "../../../config";

function UserManagement({ isViewMode, isEditMode }) {
  // State for modal and member management
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "view", "edit", or "add"
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("live");
  const [isLoading, setIsLoading] = useState(false);

  // State for team members data
  const [teamMembers, setTeamMembers] = useState([]);
console.log("api response", teamMembers);

  // Fetch team members on component mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(`${BASE_URL}member/getAllMembers`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        
        if (response.data && Array.isArray(response.data.data)) {
          setTeamMembers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        Swal.fire("Error", "Failed to fetch team members", "error");
      }
    };

    fetchTeamMembers();
  }, []);

  // Form state for adding/editing members
  const [form, setForm] = useState({
    empId: "",
    fullName: "",
    doj: "",
    dob: "",
    team: "",
    role: "",
    skills: [],
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
      background: "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
      borderColor: state.isFocused ? "#ffffff66" : "#ffffff33",
      boxShadow: state.isFocused ? "0 0 0 1px #ffffff66" : "none",
      minHeight: "38px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#1b2f6e",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#293d80"
        : "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      background: "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
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
  const toggleFreezeMember = async (empId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        Swal.fire("Error", "No token found. Please login again.", "error");
        return;
      }

      const member = teamMembers.find(m => m.empId === empId);
      const newStatus = member.status === "active" ? "freezed" : "active";

      const response = await axios.put(
        `${BASE_URL}member/updateStatus/${empId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.empId === empId
            ? { ...member, status: newStatus }
            : member
        )
      );

      Swal.fire("Success!", `Member status updated to ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating member status:", error);
      Swal.fire("Error", "Failed to update member status", "error");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        Swal.fire("Error", "No token found. Please login again.", "error");
        setIsLoading(false);
        return;
      }

      const payload = {
        ...form,
        appSkills: selectedApplications.map((app) => app.value),
        status: "active" // Default status for new members
      };

      if (modalType === "edit") {
        // Update member
        const response = await axios.put(
          `${BASE_URL}member/updateMember/${form.empId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        setTeamMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.empId === form.empId ? response.data : member
          )
        );
        Swal.fire("Updated!", "Member updated successfully.", "success");
      } else {
        // Add new member
        const response = await axios.post(
          `${BASE_URL}member/addMember`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        setTeamMembers((prev) => [...prev, response.data]);
        Swal.fire("Success!", "Member added successfully.", "success");
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Failed to submit form. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid data provided.";
        } else if (error.response.status === 401) {
          errorMessage = "Unauthorized. Please login again.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
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
    setSelectedApplications([]);
  };

  // Open modal for viewing/editing a member
  const openMemberModal = (type, member) => {
    setModalType(type);
    setSelectedMember(member);

    if (type !== "add") {
      setForm({
        empId: member.empId,
        fullName: member.fullName,
        doj: member.doj,
        dob: member.dob,
        team: member.team,
        role: member.role,
        appSkills: member.appSkills,
        username: member.username,
        password: "", // Password is not stored for security reasons
      });

      // Set selected applications for the select component
      setSelectedApplications(
        member.appSkills.map((skill) => ({
          value: skill,
          label: skill,
        }))
      );
    } else {
      resetForm();
    }

    setShowModal(true);
  };

  // Delete a member
  const deleteMember = async (empId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          Swal.fire("Error", "No token found. Please login again.", "error");
          return;
        }

        await axios.delete(`${BASE_URL}member/deleteMember/${empId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        setTeamMembers((prevMembers) =>
          prevMembers.filter((member) => member.empId !== empId)
        );

        Swal.fire("Deleted!", "Member has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting member:", error);
        Swal.fire("Error", "Failed to delete member", "error");
      }
    }
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
        <div
          className="table-responsive table-gradient-bg"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="table table-bordered align-middle">
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
                liveMembers?.map((member, idx) => (
                  <tr key={idx} className="text-center">
                    <td>{member.empId}</td>
                    <td>{member.fullName}</td>
                    <td>{member.doj}</td>
                    <td>{member.dob}</td>
                    <td>{member.team}</td>
                    <td>{member.role}</td>
                    <td>{member.appSkills}</td>
                    <td>{member.username}</td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => openMemberModal("view", member)}
                        title="View Member"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => openMemberModal("edit", member)}
                        title="Edit Member"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => toggleFreezeMember(member.empId)}
                        title="Freeze Account"
                      >
                        <i className="fas fa-snowflake"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteMember(member.empId)}
                        title="Delete Member"
                      >
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
        <div
          className="table-responsive table-gradient-bg"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="table table-bordered align-middle">
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
              {freezedMembers?.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-muted">
                    No freezed members found.
                  </td>
                </tr>
              ) : (
                freezedMembers?.map((member, idx) => (
                  <tr key={idx} className="text-center">
                    <td>{member.empId}</td>
                    <td>{member.fullName}</td>
                    <td>{member.doj}</td>
                    <td>{member.dob}</td>
                    <td>{member.team}</td>
                    <td>{member.role}</td>
                    <td>{member.appSkills}</td>
                    <td>{member.username}</td>
                    <td>
                      <span className="badge bg-secondary">Freezed</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => openMemberModal("view", member)}
                        title="View Member"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => openMemberModal("edit", member)}
                        title="Edit Member"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => toggleFreezeMember(member.empId)}
                        title="Activate Account"
                      >
                        <i className="fas fa-sun"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteMember(member.empId)}
                        title="Delete Member"
                      >
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
    const isEditMode = modalType === "edit";
    const isViewMode = modalType === "view";

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
              disabled={isViewMode || isEditMode}
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
              disabled={isViewMode}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">DOJ (Date of Joining)</label>
            <input
              type="date"
              className="form-control"
              name="doj"
              value={form.doj}
              onChange={handleFieldChange}
              required
              disabled={isViewMode}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">DOB (Date of Birth)</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={form.dob}
              onChange={handleFieldChange}
              required
              disabled={isViewMode}
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
              disabled={isViewMode}
            >
              <option value="">Select Team</option>
              <option value="Dev">Dev</option>
              <option value="QA">QA</option>
              <option value="Design">Design</option>
              <option value="DevOps">DevOps</option>
              <option value="HR">HR</option>
              <option value="IT Support">IT Support</option>
              <option value="Marketing">Marketing</option>
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
              disabled={isViewMode}
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
              isDisabled={isViewMode}
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
              disabled={isViewMode}
            />
          </div>
          {!isViewMode && (
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleFieldChange}
                required={modalType === "add"}
                disabled={isEditMode}
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary rounded-5"
            onClick={() => setShowModal(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          {!isViewMode && (
            <button 
              type="submit" 
              className="btn gradient-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {modalType === "edit" ? "Saving..." : "Adding..."}
                </>
              ) : (
                modalType === "edit" ? "Save Changes" : "Add Member"
              )}
            </button>
          )}
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
            onClick={() => openMemberModal("add", null)}
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
                  className="btn-close"mem
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
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