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
  const [id, setId] = useState("");
  const [applicationsOptions, setApplicationsOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  // State for team members data
  const [teamMembers, setTeamMembers] = useState([]);

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // If date is already in DD-MM-YYYY format, return as is
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse ISO format (YYYY-MM-DD)
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }
    
    // Try to parse Date object or timestamp
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    
    // If unable to parse, return original string
    return dateString;
  };

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

        if (response.data && Array.isArray(response.data.data)) {
          // Filter out freezed members from the main list
          const activeMembers = response.data.data.filter(member => member.status !== "freezed");
          setTeamMembers(activeMembers);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        Swal.fire("Error", "Failed to fetch team members", "error");
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}roles/getAllRoles`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        console.log("response", response);

        if (response?.data?.data) {
          // maan lo response.data.roles = [{id: 1, name: "Admin"}, ...]
          const formattedRoles = response?.data?.data?.map((role) => ({
            value: role.id,
            label: role.roleName,
          }));
          setRoleOptions(formattedRoles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Form state for adding/editing members
  const [form, setForm] = useState({
    id: null,
    empId: "",
    fullName: "",
    doj: "",
    dob: "",
    team: "",
    role: "",
    skills: [],
    username: "",
    password: "",
    currentSalary: "", // Added currentSalary to initial state
  });

  // ✅ helper: build a clean payload for your API
  const buildMemberPayload = (form, selectedApplications) => {
    console.log("form", form);
    const payload = {
      empId: form.empId?.trim(),
      fullName: form.fullName?.trim(),
      doj: form.doj, // YYYY-MM-DD
      dob: form.dob, // YYYY-MM-DD
      team: form.team?.trim(),
      role: form.role,
      username: form.username?.trim(),
      status: form.status || "active",
      // Add currentSalary to the payload
      currentSalary: form.currentSalary ? form.currentSalary.toString().replace(/[^\d]/g, "") : "",
      // API expects a string, not an array
      appSkills: Array.isArray(selectedApplications)
        ? selectedApplications.map(a => a.value).join(", ")
        : Array.isArray(form.appSkills)
          ? form.appSkills.join(", ")
          : (typeof form.appSkills === "string" ? form.appSkills : ""),
    };

    // include password only when user actually entered something
    if (form.password && form.password.trim() !== "") {
      payload.password = form.password;
    }

    // remove undefined/null to avoid ", field =" bugs in backend query builder
    Object.keys(payload).forEach(
      key => (payload[key] === undefined || payload[key] === null) && delete payload[key]
    );

    return payload;
  };

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

  // Toggle member status between active and freezed
  const toggleFreezeMember = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        Swal.fire("Error", "No token found. Please login again.", "error");
        return;
      }

      // Find the member by id
      const member = teamMembers.find(m => m.id === id);
      if (!member) {
        Swal.fire("Error", "Member not found", "error");
        return;
      }

      // Flip status
      const newStatus = member.status === "active" ? "freezed" : "active";
      console.log("Updating member status to:", newStatus);

      // ✅ Build minimal payload for API
      const payload = {
        empId: member.empId,
        status: newStatus
      };

      // ✅ Call updateMemberStatus API
      const response = await axios.patch(
        `${BASE_URL}member/updateMemberStatus/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const updatedMember = response.data.data ?? { ...member, status: newStatus };

      // ✅ Update state with new status only
      setTeamMembers(prevMembers =>
        prevMembers.map(m => (m.id === id ? updatedMember : m))
      );

      Swal.fire("Success!", `Member status updated to ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating member status:", error);
      Swal.fire("Error", "Failed to update member status", "error");
    }
  };

  // Handle form submission
  // ✅ handleSubmit using id for edit, and clean payload
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

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const payload = buildMemberPayload(form, selectedApplications);

      if (modalType === "edit") {
        // ⚠️ use backend id in URL; do NOT send id in body
        const res = await axios.patch(
          `${BASE_URL}member/updateMember/${form.id}`,
          payload,
          { headers }
        );

        const updated = res?.data?.data ?? res?.data ?? payload;

        setTeamMembers(prev =>
          prev.map(m => (m.id === form.id ? { ...m, ...updated } : m))
        );

        Swal.fire("Updated!", "Member updated successfully.", "success");
      } else {
        // Add new member
        const res = await axios.post(
          `${BASE_URL}member/addMember`,
          payload,
          { headers }
        );

        const created = res?.data?.data ?? res?.data;

        // store the generated id in form (if you keep the modal open later)
        setForm(prev => ({ ...prev, id: created.id }));

        setTeamMembers(prev => [...prev, created]);
        Swal.fire("Success!", "Member added successfully.", "success");
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Failed to submit form. Please try again.";
      if (error.response) {
        if (error.response.status === 400) errorMessage = error.response.data.message || "Invalid data provided.";
        else if (error.response.status === 401) errorMessage = "Unauthorized. Please login again.";
        else if (error.response.status === 500) errorMessage = "Server error. Please try again later.";
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
      id: null,    // clear id
      empId: "",
      fullName: "",
      doj: "",
      dob: "",
      team: "",
      role: "",
      appSkills: [],
      currentSalary: "", // Added currentSalary to reset form
      username: "",
      password: "",
    });
    setSelectedApplications([]);
  };

  // Open modal for viewing/editing a member
  // ✅ when opening the edit modal, normalize appSkills into the multi-select format
  const openMemberModal = (type, member) => {
    setModalType(type);
    setSelectedMember(member);

    if (type !== "add") {
      // convert appSkills string -> [{value,label}, ...]
      const formattedAppSkills =
        typeof member.appSkills === "string"
          ? member.appSkills
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => ({ value: s, label: s }))
          : Array.isArray(member.appSkills)
            ? member.appSkills.map(s => ({ value: s, label: s }))
            : [];

      setForm({
        id: member.id,                 // use backend id for future edits
        empId: member.empId || "",
        fullName: member.fullName || "",
        doj: member.doj || "",
        dob: member.dob || "",
        team: member.team || "",
        role: member.role || "",
        appSkills: member.appSkills || "",
        currentSalary: member.currentSalary || "", // Added currentSalary to form
        username: member.username || "",
        status: member.status || "active",
        password: "",                  // empty => won't be sent
      });

      setSelectedApplications(formattedAppSkills);
    } else {
      resetForm();
    }

    setShowModal(true);
  };

  // Delete a member
  const deleteMember = async (id) => {
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

        // ✅ Delete by id
        await axios.delete(`${BASE_URL}member/deleteMember/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        // ✅ Remove from state
        setTeamMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== id)
        );

        Swal.fire("Deleted!", "Member has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting member:", error);
        Swal.fire("Error", "Failed to delete member", "error");
      }
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}application/getAllApplication`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
        );
        if (response.data.status) {
          const formattedOptions = response.data.application.map((app) => ({
            value: app.applicationName,
            label: app.applicationName
          }));
          setApplicationsOptions(formattedOptions);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchApplications();
  }, []);

  const [permissions, setPermissions] = useState([]);
  const roleId = localStorage.getItem("roleId");

  // 🔹 Fetch permissions from API
  useEffect(() => {
    axios
      .get(`${BASE_URL}roles/permission/${roleId}`)
      .then((res) => {
        if (res.data.status) {
          setPermissions(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching permissions", err);
      });
  }, [roleId])

  const projectPermission = permissions.find(p => p.featureName === "User");
  const CreateUserPermission = Number(projectPermission?.canAdd);
  const EditUserPermission = Number(projectPermission?.canEdit);
  const DeleteUserPermission = Number(projectPermission?.canDelete);

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
              <tr>
                <th className="text-center">Emp ID</th>
                <th className="text-start">Full Name</th>
                <th className="text-center">DOJ</th>
                <th className="text-center">DOB</th>
                <th className="text-center">Team</th>
                <th className="text-center">Role</th>
                <th className="text-start">App Skills</th>
                <th className="text-center">Current Salary</th>
                <th className="text-center">Username</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {liveMembers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-muted">
                    No active members found.
                  </td>
                </tr>
              ) : (
                liveMembers?.map((member, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{member.empId}</td>
                    <td className="text-start">{member.fullName}</td>
                    <td className="text-center">{formatDate(member.doj)}</td>
                    <td className="text-center">{formatDate(member.dob)}</td>
                    <td className="text-center">{member.team}</td>
                    <td className="text-center">{member.roleName}</td>
                    <td className="text-start">
                      {Array.isArray(member.appSkills)
                        ? member.appSkills.join(", ")
                        : member.appSkills || "N/A"}
                    </td>
                    <td className="text-center">
                      {member.currentSalary 
                        ? Number(member.currentSalary).toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          })
                        : "N/A"}
                    </td>
                    <td className="text-center">{member.username}</td>
                    <td className="text-center">
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => openMemberModal("view", member)}
                        title="View Member"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {
                        EditUserPermission === 1 &&
                        (<button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => openMemberModal("edit", member)}
                          title="Edit Member"
                        >
                          <i className="fas fa-edit"></i>
                        </button>)
                      }
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => toggleFreezeMember(member.id)}
                        title="Freeze Account"
                      >
                        <i className="fas fa-snowflake"></i>
                      </button>
                      {DeleteUserPermission === 1 &&
                        (<button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteMember(member.id)}
                          title="Delete Member"
                        >
                          <i className="fas fa-trash"></i>
                        </button>)
                      }
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
              <tr>
                <th className="text-center">Emp ID</th>
                <th className="text-start">Full Name</th>
                <th className="text-center">DOJ</th>
                <th className="text-center">DOB</th>
                <th className="text-center">Team</th>
                <th className="text-center">Role</th>
                <th className="text-start">App Skills</th>
                <th className="text-center">Username</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {freezedMembers?.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-muted">
                    No freezed members found.
                  </td>
                </tr>
              ) : (
                freezedMembers?.map((member, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{member.empId}</td>
                    <td className="text-start">{member.fullName}</td>
                    <td className="text-center">{formatDate(member.doj)}</td>
                    <td className="text-center">{formatDate(member.dob)}</td>
                    <td className="text-center">{member.team}</td>
                    <td className="text-center">{member.role}</td>
                    <td className="text-start">
                      {Array.isArray(member.appSkills)
                        ? member.appSkills.join(", ")
                        : member.appSkills || "N/A"}
                    </td>
                    {/* <td className="text-center">
                      {member.currentSalary 
                        ? Number(member.currentSalary).toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          })
                        : "N/A"}
                    </td> */}
                    <td className="text-center">{member.username}</td>
                    <td className="text-center">
                      <span className="badge bg-secondary">Freezed</span>
                    </td>
                    <td className="text-center">
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
                        onClick={() => toggleFreezeMember(member.id)}
                        title="Activate Account"
                      >
                        <i className="fas fa-sun"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteMember(member.id)}
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
              <option value="Adobe">Adobe</option>
              <option value="MS Office">MS Office</option>
              <option value="QA">QA</option>
              
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Role</label>
            <Select
              options={roleOptions}
              value={roleOptions.find(r => r.value === form.role) || null}
              onChange={(selected) =>
                setForm((prev) => ({ ...prev, role: selected.value }))
              }
              placeholder="Select Role"
              styles={gradientSelectStyles}
              isDisabled={isViewMode}
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
            <label className="form-label">Current Salary</label>
            <input
              type="text"
              className="form-control"
              name="currentSalary"
              value={form.currentSalary ? form.currentSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
              onChange={(e) => {
                // Remove non-digit characters and thousand separators
                const value = e.target.value.replace(/[^\d]/g, "");
                handleFieldChange({
                  target: {
                    name: "currentSalary",
                    value: value
                  }
                });
              }}
              required
              disabled={isViewMode}
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
          {
            CreateUserPermission === 1 &&
            (<button
              className="btn gradient-button"
              onClick={() => openMemberModal("add", null)}
            >
              + Add Member
            </button>)
          }
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