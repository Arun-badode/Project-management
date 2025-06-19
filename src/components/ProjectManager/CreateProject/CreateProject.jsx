import React, { useState } from 'react';

function CreateProject() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [teamMembers, setTeamMembers] = useState([]); // TypeScript type hata diya
  const [memberInput, setMemberInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); 

  const projectTypes = [
    'Web Development',
    'Mobile App',
    'Design',
    'Marketing',
    'Research',
    'Content Creation'
  ];

  const priorityLevels = ['Low', 'Medium', 'High', 'Urgent'];

  const suggestedMembers = [
    'John Smith',
    'Emma Johnson',
    'Michael Brown',
    'Sophia Davis',
    'William Wilson',
    'Olivia Martinez'
  ];

  const handleAddMember = () => {
    if (memberInput && !teamMembers.includes(memberInput)) {
      setTeamMembers([...teamMembers, memberInput]);
      setMemberInput('');
    }
  };

  const handleRemoveMember = (member) => {
    setTeamMembers(teamMembers.filter(m => m !== member));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!projectType) {
      newErrors.projectType = 'Project type is required';
    }

    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        alert('Project created successfully!');
        // Reset form or redirect
      }, 1500);
    }
  };


  const handleCancel = () => {
    // Handle cancel action
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      // Reset form or redirect
      alert('Form cancelled');
    }
  };

  return (
    <div>
      <div className="container-fluid min-vh-100 bg-main">
        {/* Header */}
        {/* <header className="bg-white shadow-sm p-3 mb-5">
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-light me-4">
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="h4 text-primary">Create New Project</h1>
          </div>
        </header> */}

        {/* Main Content */}
        <div className="container  py-3">
            <h1 className='gradient-heading'>Create New Project</h1>
          <div className="card shadow-lg p-4 bg-card">
            <form onSubmit={handleSubmit} className="space-y-4 ">
              {/* Project Basic Information */}
              <div className="space-y-4 ">
                <h2 className="h5 text-gray-900 border-bottom pb-2">Basic Information</h2>

                {/* Project Name */}
                <div>
                  <label htmlFor="project-name" className="form-label">
                    Project Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="project-name"
                    className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  {errors.projectName && (
                    <div className="invalid-feedback">{errors.projectName}</div>
                  )}
                </div>

                {/* Project Description */}
                <div>
                  <label htmlFor="project-description" className="form-label">
                    Project Description
                  </label>
                  <textarea
                    id="project-description"
                    rows={4}
                    className="form-control"
                    placeholder="Describe your project"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label htmlFor="project-type" className="form-label">
                    Project Type <span className="text-danger">*</span>
                  </label>
                  <button
                    type="button"
                    className={`form-control ${errors.projectType ? 'is-invalid' : ''} dropdown-toggle`}
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    data-bs-toggle="dropdown"
                    aria-expanded={isTypeDropdownOpen}
                  >
                    {projectType || 'Select project type'}
                  </button>
                  {isTypeDropdownOpen && (
                    <ul className="dropdown-menu show">
                      {projectTypes.map((type) => (
                        <li key={type}>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setProjectType(type);
                              setIsTypeDropdownOpen(false);
                            }}
                          >
                            {type}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.projectType && (
                    <div className="invalid-feedback">{errors.projectType}</div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-4">
                <h2 className="h5 text-gray-900 border-bottom pb-2">Team Members</h2>

                <div className="d-flex flex-column">
                  <label htmlFor="team-member" className="form-label">Add Team Members</label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="team-member"
                      className="form-control"
                      placeholder="Search or enter member name"
                      value={memberInput}
                      onChange={(e) => setMemberInput(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddMember}
                    >
                      <i className="fas fa-plus"></i> Add
                    </button>
                  </div>

                  {/* Member Suggestions */}
                  {isDropdownOpen && memberInput && (
                    <ul className="list-group mt-2">
                      {suggestedMembers
                        .filter(member =>
                          member.toLowerCase().includes(memberInput.toLowerCase()) &&
                          !teamMembers.includes(member)
                        )
                        .map((member) => (
                          <li
                            key={member}
                            className="list-group-item cursor-pointer"
                            onClick={() => {
                              setMemberInput(member);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {member}
                          </li>
                        ))}
                    </ul>
                  )}

                  {/* Added Team Members */}
                  {teamMembers.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-muted">Team Members:</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {teamMembers.map(member => (
                          <div
                            key={member}
                            className="badge bg-primary text-white"
                          >
                            {member}
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-1"
                              onClick={() => handleRemoveMember(member)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Settings */}
              <div className="space-y-4">
                <h2 className="h5 text-gray-900 border-bottom pb-2">Project Settings</h2>

                {/* Privacy Setting */}
                <div>
                  <label className="form-label">Privacy</label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      id="privacy-public"
                      name="privacy"
                      className="form-check-input"
                      checked={!isPrivate}
                      onChange={() => setIsPrivate(false)}
                    />
                    <label htmlFor="privacy-public" className="form-check-label">Public</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      id="privacy-private"
                      name="privacy"
                      className="form-check-input"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(true)}
                    />
                    <label htmlFor="privacy-private" className="form-check-label">Private</label>
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label htmlFor="deadline" className="form-label">Deadline <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    id="deadline"
                    className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  {errors.deadline && (
                    <div className="invalid-feedback">{errors.deadline}</div>
                  )}
                </div>

                {/* Priority Level */}
                <div>
                  <label htmlFor="priority" className="form-label">Priority Level</label>
                  <button
                    type="button"
                    className="form-control dropdown-toggle"
                    onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                    data-bs-toggle="dropdown"
                    aria-expanded={isPriorityDropdownOpen}
                  >
                    {priority}
                  </button>
                  {isPriorityDropdownOpen && (
                    <ul className="dropdown-menu show">
                      {priorityLevels.map((level) => (
                        <li key={level}>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setPriority(level);
                              setIsPriorityDropdownOpen(false);
                            }}
                          >
                            {level}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-top d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}
                >
                  {isLoading ? (
                    <span>Creating...</span>
                  ) : (
                    <span>Create Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
