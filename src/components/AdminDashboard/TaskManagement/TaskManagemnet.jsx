import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

// ProjectsTable component
const ProjectsTable = ({ 
  projects, 
  onViewProject, 
  onEditProject,
  onMarkComplete, 
  onDeleteProject,
  expandedRow 
}) => {
  return (
    <div className="card bg-card">
      <div className="card-body p-0">
        <div className="table-responsive table-gradient-bg">
          <table className="table table-hover mb-0">
            <thead>
              <tr className="text-center">
                <th>S.No.</th>
                <th>Project Title</th>
                <th>Client</th>
                <th>Task</th>
                <th>Language</th>
                <th>Platform</th>
                <th>Pages</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr className="text-center">
                    <td>{index + 1}</td>
                    <td>{project.title}</td>
                    <td>{project.client}</td>
                    <td>{project.task}</td>
                    <td>{project.language}</td>
                    <td>{project.platform}</td>
                    <td>{project.totalPages}</td>
                    <td>{project.dueDate}</td>
                    <td>
                      <span className={`badge ${
                        project.status === "In Progress" ? "bg-warning" :
                        project.status === "Ready for QA" ? "bg-info" :
                        project.status === "QA Review" ? "bg-primary" :
                        "bg-success"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="progress" style={{ height: "20px" }}>
                        <div 
                          className={`progress-bar ${
                            project.progress < 30 ? "bg-danger" :
                            project.progress < 70 ? "bg-warning" :
                            "bg-success"
                          }`}
                          role="progressbar"
                          style={{ width: `${project.progress}%` }}
                          aria-valuenow={project.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {project.progress}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onViewProject(project)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => onEditProject(project)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                       
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDeleteProject(project.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// View Modal Component
const ViewModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="modal fade show d-block " style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg custom-modal-dark modal-dialog-centered">
        <div className="modal-content ">
          <div className="modal-header ">
            <h5 className="modal-title">Project Details: {project.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Task:</strong> {project.task}</p>
                <p><strong>Language:</strong> {project.language}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Platform:</strong> {project.platform}</p>
                <p><strong>Total Pages:</strong> {project.totalPages}</p>
                <p><strong>Due Date:</strong> {project.dueDate}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Status:</strong> <span className={`badge ${
                  project.status === "In Progress" ? "bg-warning" :
                  project.status === "Ready for QA" ? "bg-info" :
                  project.status === "QA Review" ? "bg-primary" :
                  "bg-success"
                }`}>{project.status}</span></p>
              </div>
              <div className="col-md-6">
                <p><strong>Progress:</strong> 
                  <div className="progress" style={{ height: "20px" }}>
                    <div 
                      className={`progress-bar ${
                        project.progress < 30 ? "bg-danger" :
                        project.progress < 70 ? "bg-warning" :
                        "bg-success"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    >
                      {project.progress}%
                    </div>
                  </div>
                </p>
              </div>
            </div>

            <div className="mb-3">
              <h5>Files</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Pages</th>
                      <th>Language</th>
                      <th>Platform</th>
                      <th>Stage</th>
                      <th>QA Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.files.map((file) => (
                      <tr key={file.id}>
                        <td>{file.name}</td>
                        <td>{file.pages}</td>
                        <td>{file.language}</td>
                        <td>{file.platform}</td>
                        <td>
                          <span className={`badge ${
                            file.stage === "Not Started" ? "bg-secondary" :
                            file.stage === "In Progress" ? "bg-warning" :
                            "bg-success"
                          }`}>
                            {file.stage}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            file.qaStatus === "Pending" ? "bg-warning" :
                            file.qaStatus === "Approved" ? "bg-success" :
                            "bg-danger"
                          }`}>
                            {file.qaStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h5>Handler Notes</h5>
                <p>{project.handlerNote}</p>
              </div>
              <div className="col-md-6">
                <h5>QA Notes</h5>
                <p>{project.qaNote}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Modal Component
const EditModal = ({ project, onSave, onClose }) => {
  const [editedProject, setEditedProject] = useState(project);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProject);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg custom-modal-dark modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Project: {project.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Project Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={editedProject.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Client</label>
                  <input
                    type="text"
                    className="form-control"
                    name="client"
                    value={editedProject.client}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Task</label>
                  <input
                    type="text"
                    className="form-control"
                    name="task"
                    value={editedProject.task}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Language</label>
                  <select
                    className="form-select"
                    name="language"
                    value={editedProject.language}
                    onChange={handleChange}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Platform</label>
                  <select
                    className="form-select"
                    name="platform"
                    value={editedProject.platform}
                    onChange={handleChange}
                  >
                    <option value="MS Office">MS Office</option>
                    <option value="Adobe">Adobe</option>
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Desktop">Desktop</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Total Pages</label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalPages"
                    value={editedProject.totalPages}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Due Date</label>
                  <input
                    type="text"
                    className="form-control"
                    name="dueDate"
                    value={editedProject.dueDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={editedProject.status}
                    onChange={handleChange}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Ready for QA">Ready for QA</option>
                    <option value="QA Review">QA Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Progress (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="progress"
                    value={editedProject.progress}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Handlers</label>
                  <input
                    type="number"
                    className="form-control"
                    name="handlers"
                    value={editedProject.handlers}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Handler Note</label>
                <textarea
                  className="form-control"
                  name="handlerNote"
                  value={editedProject.handlerNote}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">QA Note</label>
                <textarea
                  className="form-control"
                  name="qaNote"
                  value={editedProject.qaNote}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main TaskManagement component
const TaskManagement = () => {
  // Dummy data generator function
  const generateDummyProjects = (count) => {
    const platforms = ["MS Office", "Adobe", "Web", "Mobile", "Desktop"];
    const statuses = ["In Progress", "Ready for QA", "QA Review", "Completed"];
    const clients = [
      "Stark Industries",
      "Wayne Enterprises",
      "Oscorp",
      "LexCorp",
      "Queen Consolidated",
    ];
    const languages = ["English", "Spanish", "French", "German", "Chinese"];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Project ${i + 1}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      task: `Task ${i + 1}`,
      language: languages[Math.floor(Math.random() * languages.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      totalPages: Math.floor(Math.random() * 50) + 5,
      dueDate: new Date(
        Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      ).toLocaleString(),
      progress: Math.floor(Math.random() * 100),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      handlers: Math.floor(Math.random() * 3) + 1,
      qaReviewers: Math.floor(Math.random() * 2) + 1,
      fileCount: Math.floor(Math.random() * 5) + 1,
      handlerNote: `Handler note for project ${i + 1}`,
      qaNote: `QA note for project ${i + 1}`,
      files: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        id: j + 1,
        name: `file${j + 1}.${["docx", "pdf", "xlsx", "psd"][j % 4]}`,
        pages: Math.floor(Math.random() * 20) + 1,
        language: languages[Math.floor(Math.random() * languages.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        stage: ["Not Started", "In Progress", "Completed"][j % 3],
        assigned: new Date(
          Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        handler: `Handler ${j + 1}`,
        qaReviewer: `QA ${j + 1}`,
        qaStatus: ["Pending", "Approved", "Rejected"][j % 3],
      })),
    }));
  };

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isManager, setIsManager] = useState(true);
  const [activeProjectTab, setActiveProjectTab] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Generate dummy data on component mount
  useEffect(() => {
    const dummyProjects = generateDummyProjects(15);
    setProjects(dummyProjects);
    setFilteredProjects(dummyProjects);
  }, []);

  // Filter projects based on search term, status filter and platform filter
  useEffect(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;
      const matchesPlatform =
        activeFilter === "All" ||
        (activeFilter === "MS Office" && project.platform === "MS Office") ||
        (activeFilter === "Adobe" && project.platform === "Adobe") ||
        (activeFilter === "All" &&
          (project.platform === "Web" ||
            project.platform === "Mobile" ||
            project.platform === "Desktop"));
      return matchesSearch && matchesStatus && matchesPlatform;
    });
    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, activeFilter]);

  // Mock data for "My Tasks" (for manager view)
  const myTasks = [
    {
      id: 4,
      title: "Marketing Strategy",
      client: "Stark Industries",
      task: "Formatting",
      language: "English",
      platform: "MS Office",
      totalPages: 15,
      dueDate: "11:00 AM 27-06-25",
      progress: 40,
      status: "In Progress",
      handlers: 1,
      qaReviewers: 1,
      fileCount: 3,
      handlerNote: "Developing Q3 marketing plan. Need budget approval.",
      qaNote: "Awaiting initial draft for review.",
      files: [
        {
          id: 1,
          name: "strategy.docx",
          pages: 15,
          language: "English",
          platform: "MS Office",
          stage: "In Progress",
          assigned: "21-06-25",
          handler: "You",
          qaReviewer: "Sophia Miller",
          qaStatus: "Pending",
        },
      ],
    },
  ];

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleSaveProject = (editedProject) => {
    setProjects(projects.map(p => p.id === editedProject.id ? editedProject : p));
    setShowEditModal(false);
  };

  const handleMarkComplete = (id) => {
    if (window.confirm("Are you sure you want to mark this project as complete?")) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  return (
    <div className="min-vh-100 bg-main">
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between">
          <div className="mb-4">
            <h2 className="gradient-heading">Task Management</h2>
            <p className="text-light">Active Projects Only</p>
          </div>
        </div>

        {/* View Modal */}
        {showViewModal && selectedProject && (
          <ViewModal 
            project={selectedProject} 
            onClose={() => setShowViewModal(false)} 
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedProject && (
          <EditModal 
            project={selectedProject}
            onSave={handleSaveProject}
            onClose={() => setShowEditModal(false)}
          />
        )}

        {/* Filters and Search */}
        <div className="card mb-4 bg-card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0 d-flex justify-content-between">
                <div className="row g-3 align-items-center">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search.."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Ready for QA">Ready for QA</option>
                      <option value="QA Review">QA Review</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-md-6 text-md-end d-flex justify-content-between">
                <div className="d-flex gap-2">
                  <div>
                    <button
                      className={`gradient-button ${activeFilter === "All" ? "active-filter" : ""}`}
                      onClick={() => setActiveFilter("All")}
                    >
                      All
                    </button>
                  </div>
                  <div>
                    <button
                      className={`gradient-button ${activeFilter === "MS Office" ? "active-filter" : ""}`}
                      onClick={() => setActiveFilter("MS Office")}
                    >
                      Ms Office
                    </button>
                  </div>
                  <div>
                    <button
                      className={`gradient-button ${activeFilter === "Adobe" ? "active-filter" : ""}`}
                      onClick={() => setActiveFilter("Adobe")}
                    >
                      Adobe
                    </button>
                  </div>
                </div>
                <span className="text-light small">
                  Today: {new Date().toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    weekday: 'long'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeProjectTab === "all" ? "active" : ""}`}
              onClick={() => setActiveProjectTab("all")}
            >
              All Active Projects
            </button>
          </li>
          {isManager && (
            <li className="nav-item">
              <button
                className={`nav-link ${activeProjectTab === "my" ? "active" : ""}`}
                onClick={() => setActiveProjectTab("my")}
              >
                My Tasks
              </button>
            </li>
          )}
        </ul>

        {/* Show content based on active tab */}
        {activeProjectTab === "all" && (
          <ProjectsTable
            projects={filteredProjects}
            onViewProject={handleViewProject}
            onEditProject={handleEditProject}
            onMarkComplete={handleMarkComplete}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {activeProjectTab === "my" && isManager && (
          <ProjectsTable
            projects={myTasks}
            onViewProject={handleViewProject}
            onEditProject={handleEditProject}
            onMarkComplete={handleMarkComplete}
            onDeleteProject={handleDeleteProject}
          />
        )}
      </div>
    </div>
  );
};

export default TaskManagement;