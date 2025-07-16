import React, { useState, useEffect } from "react";
import Select from "react-select";

const MemberModal = ({
  showModal,
  setShowModal,
  modalType,
  selectedMember,
  teamMembers,
  setTeamMembers,
}) => {
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
    status: "active",
  });

  const [selectedApplications, setSelectedApplications] = useState([]);
  const isEditMode = modalType === "edit";
  const isViewMode = modalType === "view";

  // Custom styles for react-select components
  const customSelectStyles = {
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
      backgroundColor: state.isFocused ? "#293d80" : "#141c3a",
      color: "white",
      ':active': {
        backgroundColor: '#1b2f6e',
      },
    }),
    menu: (provided) => ({
      ...provided,
      background: "#141c3a",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
    }),
  };

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

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "Not Active", label: "Not Active" },
  ];

  useEffect(() => {
    if (modalType !== "add" && selectedMember) {
      setForm({
        empId: selectedMember.empId,
        fullName: selectedMember.fullName,
        doj: selectedMember.doj,
        dob: selectedMember.dob,
        team: selectedMember.team,
        role: selectedMember.role,
        appSkills: selectedMember.appSkills,
        username: selectedMember.username,
        password: "",
        status: selectedMember.status,
      });

      setSelectedApplications(
        selectedMember.appSkills.map((skill) => ({
          value: skill,
          label: skill,
        }))
      );
    } else {
      resetForm();
    }
  }, [modalType, selectedMember]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalType === "edit") {
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.empId === form.empId
            ? {
                ...form,
                appSkills: selectedApplications.map((app) => app.value),
              }
            : member
        )
      );
    } else {
      const newMember = {
        ...form,
        appSkills: selectedApplications.map((app) => app.value),
      };
      setTeamMembers((prevMembers) => [...prevMembers, newMember]);
    }

    setShowModal(false);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleStatusChange = (selectedOption) => {
    setForm((prevForm) => ({
      ...prevForm,
      status: selectedOption.value,
    }));
  };

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
      status: "active",
    });
    setSelectedApplications([]);
  };

  const getStatusValue = () => {
    return statusOptions.find(option => option.value === form.status);
  };

  // Custom style for the Team select element to match the gradient theme
  const teamSelectStyle = {
    backgroundColor: '#141c3a',
    backgroundImage: 'linear-gradient(to bottom right, #141c3a, #1b2f6e)',
    color: 'white',
    borderColor: '#ffffff33',
  };

  return (
    <div
      className="modal custom-modal-dark"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
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
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Employee ID</label>
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
                <div className="col-md-6 mb-3">
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
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Joining</label>
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
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth</label>
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
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Team</label>
                  <select
                    className="form-select"
                    name="team"
                    value={form.team}
                    onChange={handleFieldChange}
                    required
                    disabled={isViewMode}
                    style={teamSelectStyle}
                  >
                    <option value="">Select Team</option>
                    <option value="Dev">Development</option>
                    <option value="QA">Quality Assurance</option>
                    <option value="Design">Design</option>
                    <option value="DevOps">DevOps</option>
                    <option value="HR">Human Resources</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
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
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Application Skills</label>
                  <Select
                    options={applicationsOptions}
                    isMulti
                    value={selectedApplications}
                    onChange={setSelectedApplications}
                    placeholder="Select skills"
                    styles={customSelectStyles}
                    isDisabled={isViewMode}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div className="col-md-6 mb-3">
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
              </div>

              <div className="row">
                {!isViewMode && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      {isEditMode ? "New Password (leave blank to keep current)" : "Password"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={handleFieldChange}
                      required={modalType === "add"}
                      disabled={isEditMode && !form.password}
                    />
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <Select
                    options={statusOptions}
                    value={getStatusValue()}
                    onChange={handleStatusChange}
                    styles={customSelectStyles}
                    isDisabled={isViewMode}
                  />
                </div>
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
              {!isViewMode && (
                <button type="submit" className="btn gradient-button">
                  {modalType === "edit" ? "Save Changes" : "Add Member"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;