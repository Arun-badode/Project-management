// The exported code now uses Bootstrap instead of Tailwind CSS
import React, { useState } from 'react';



const TaskManagemnet = () => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  // Mock data for active projects
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Website Redesign",
      status: "In Progress",
      handlers: 3,
      qaReviewers: 2,
      fileCount: 24,
      progress: 65,
      handlerNote: "Working on homepage layout. Need feedback on color scheme.",
      qaNote: "Initial review completed for navigation. Found some responsive issues.",
      timeline: [
        { stage: "Task Assigned", timestamp: "2025-06-20 09:30 AM" },
        { stage: "In Progress", timestamp: "2025-06-21 11:15 AM" },
        { stage: "QA Started", timestamp: "2025-06-23 02:45 PM" }
      ],
      timeSpent: [
        { role: "Handler", name: "Alex Johnson", hours: 12.5 },
        { role: "Handler", name: "Maria Garcia", hours: 8.0 },
        { role: "Handler", name: "David Kim", hours: 6.5 },
        { role: "QA", name: "Sarah Williams", hours: 4.0 },
        { role: "QA", name: "James Brown", hours: 3.5 }
      ]
    },
    {
      id: 2,
      title: "Mobile App Development",
      status: "QA Review",
      handlers: 2,
      qaReviewers: 3,
      fileCount: 38,
      progress: 80,
      handlerNote: "Core functionality complete. Working on final UI polish.",
      qaNote: "Testing user authentication flows. Some edge cases need fixing.",
      timeline: [
        { stage: "Task Assigned", timestamp: "2025-06-15 10:00 AM" },
        { stage: "In Progress", timestamp: "2025-06-16 09:30 AM" },
        { stage: "QA Started", timestamp: "2025-06-22 01:15 PM" }
      ],
      timeSpent: [
        { role: "Handler", name: "Emily Chen", hours: 18.5 },
        { role: "Handler", name: "Michael Rodriguez", hours: 16.0 },
        { role: "QA", name: "Lisa Taylor", hours: 7.5 },
        { role: "QA", name: "Robert Wilson", hours: 6.0 },
        { role: "QA", name: "Jennifer Lee", hours: 5.5 }
      ]
    },
    {
      id: 3,
      title: "E-commerce Integration",
      status: "Ready for QA",
      handlers: 4,
      qaReviewers: 1,
      fileCount: 42,
      progress: 75,
      handlerNote: "Payment gateway integration complete. Documentation in progress.",
      qaNote: "Preparing test cases for checkout flow.",
      timeline: [
        { stage: "Task Assigned", timestamp: "2025-06-18 08:45 AM" },
        { stage: "In Progress", timestamp: "2025-06-19 10:30 AM" },
        { stage: "Ready for QA", timestamp: "2025-06-24 09:15 AM" }
      ],
      timeSpent: [
        { role: "Handler", name: "Thomas Martin", hours: 14.0 },
        { role: "Handler", name: "Sophia Anderson", hours: 12.5 },
        { role: "Handler", name: "Daniel Clark", hours: 10.0 },
        { role: "Handler", name: "Olivia Wright", hours: 9.5 },
        { role: "QA", name: "William Scott", hours: 2.0 }
      ]
    },
    {
      id: 4,
      title: "CRM System Update",
      status: "In Progress",
      handlers: 2,
      qaReviewers: 2,
      fileCount: 31,
      progress: 45,
      handlerNote: "Database migration in progress. Estimated completion by tomorrow.",
      qaNote: "Preparing test environment for initial review.",
      timeline: [
        { stage: "Task Assigned", timestamp: "2025-06-22 11:00 AM" },
        { stage: "In Progress", timestamp: "2025-06-23 09:45 AM" }
      ],
      timeSpent: [
        { role: "Handler", name: "Ryan Johnson", hours: 8.0 },
        { role: "Handler", name: "Emma Davis", hours: 7.5 },
        { role: "QA", name: "Christopher Lee", hours: 1.5 },
        { role: "QA", name: "Ava Martinez", hours: 1.0 }
      ]
    },
    {
      id: 5,
      title: "Analytics Dashboard",
      status: "In Progress",
      handlers: 1,
      qaReviewers: 1,
      fileCount: 18,
      progress: 30,
      handlerNote: "Working on data visualization components. Need access to API.",
      qaNote: "Reviewing requirements documentation.",
      timeline: [
        { stage: "Task Assigned", timestamp: "2025-06-23 02:30 PM" },
        { stage: "In Progress", timestamp: "2025-06-24 08:30 AM" }
      ],
      timeSpent: [
        { role: "Handler", name: "Noah Thompson", hours: 5.5 },
        { role: "QA", name: "Isabella White", hours: 2.0 }
      ]
    },
    {
      id: 6,
      title: "Content Management System",
      status: "QA Review",
      handlers: 3,
      qaReviewers: 2,
      fileCount: 27,
      progress: 85,
      handlerNote: "All features implemented. Addressing feedback from initial review.",
      qaNote: "Testing user roles and permissions. Found some security concerns.",
      timeline: [
        { stage: "Task Assigned", timestamp: "2025-06-17 09:00 AM" },
        { stage: "In Progress", timestamp: "2025-06-18 10:15 AM" },
        { stage: "QA Started", timestamp: "2025-06-21 03:30 PM" }
      ],
      timeSpent: [
        { role: "Handler", name: "Liam Wilson", hours: 15.0 },
        { role: "Handler", name: "Charlotte Brown", hours: 13.5 },
        { role: "Handler", name: "Ethan Davis", hours: 12.0 },
        { role: "QA", name: "Amelia Garcia", hours: 8.5 },
        { role: "QA", name: "Benjamin Martinez", hours: 7.0 }
      ]
    }
  ]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTimeLogOpen, setIsTimeLogOpen] = useState(false);
  const [isManager, setIsManager] = useState(true); // Toggle for manager view
  const [activeTab, setActiveTab] = useState("team"); // "team" or "my"

  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Mock data for "My Tasks" (for manager view)
  const myTasks = [
    {
      id: 7,
      title: "Marketing Strategy",
      status: "In Progress",
      handlers: 1,
      qaReviewers: 1,
      fileCount: 12,
      progress: 40,
      handlerNote: "Developing Q3 marketing plan. Need budget approval.",
      qaNote: "Awaiting initial draft for review.",
      timeline: [
        { stage: "Task Assigned", timestamp: "2025-06-21 01:00 PM" },
        { stage: "In Progress", timestamp: "2025-06-22 09:30 AM" }
      ],
      timeSpent: [
        { role: "Handler", name: "You", hours: 6.5 },
        { role: "QA", name: "Sophia Miller", hours: 1.0 }
      ]
    },
    {
      id: 8,
      title: "Quarterly Report",
      status: "Ready for QA",
      handlers: 1,
      qaReviewers: 2,
      fileCount: 8,
      progress: 70,
      handlerNote: "Financial section complete. Working on executive summary.",
      qaNote: "Preparing to review financial data accuracy.",
      timeline: [
        { stage: "Task Assigned", timestamp: "2025-06-19 11:30 AM" },
        { stage: "In Progress", timestamp: "2025-06-20 09:15 AM" },
        { stage: "Ready for QA", timestamp: "2025-06-24 10:45 AM" }
      ],
      timeSpent: [
        { role: "Handler", name: "You", hours: 9.0 },
        { role: "QA", name: "Jacob Anderson", hours: 0.5 },
        { role: "QA", name: "Mia Thompson", hours: 0.5 }
      ]
    }
  ];

// Function to open time log modal
const openTimeLog = (projectId) => {
  setSelectedProject(projectId);
  setIsTimeLogOpen(true);
};

// Function to close time log modal
const closeTimeLog = () => {
  setSelectedProject(null);
  setIsTimeLogOpen(false);
};

// Get project by ID
const getProjectById = (id) => {
  return projects.find(project => project.id === id) ||
         myTasks.find(task => task.id === id);
};

// Status badge color mapping
const getStatusColor = (status) => {
  switch (status) {
    case "In Progress":
      return "bg-primary";
    case "QA Review":
      return "bg-info";
    case "Ready for QA":
      return "bg-warning";
    case "Completed":
      return "bg-success";
    default:
      return "bg-secondary";
  }
};


  return (
    <div className="min-vh-100 bg-main">
      {/* Header/Navigation */}
 

      {/* Main Content */}
      <div className="container py-4">
        <div className="mb-4">
          <h1 className="gradient-heading">Task Management</h1>
          <p className="text-light">Active Projects Only</p>
        </div>

        {/* Filters and Search */}
        <div className="card mb-4 bg-card ">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8 mb-3 mb-md-0">
                <div className="row g-3 align-items-center">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-search"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search projects..."
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
              <div className="col-md-4 text-md-end">
                <span className="text-light small me-3">Today: 2025-06-24, Tuesday</span>
          <button 
  className="btn gradient-button"
  onClick={() => setIsNewTaskModalOpen(true)}
>
  <i className="fas fa-plus me-2"></i>New Task
</button>
              </div>
            </div>
          </div>
        </div>

        {/* Manager View Tabs (only shown for managers) */}
        {isManager && (
          <div className="mb-4 ">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  onClick={() => setActiveTab("team")}
                  className={`nav-link ${activeTab === "team" ? "active" : ""}`}
                >
                  <i className="fas fa-users me-2"></i>Team Tasks
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setActiveTab("my")}
                  className={`nav-link ${activeTab === "my" ? "active" : ""}`}
                >
                  <i className="fas fa-tasks me-2"></i>My Tasks
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Projects Grid */}
        {(activeTab === "team" || !isManager) && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="col">
                <div className="card h-100 bg-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0 text-truncate" style={{ maxWidth: '200px' }}>{project.title}</h5>
                      <span className={`badge ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex">
                        <div className="me-4">
                          <div className="text-light small mb-1">Handlers</div>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              {project.handlers}
                            </span>
                            <button className="btn btn-link btn-sm text-light ms-2 p-0">
                              <i className="fas fa-user-plus small"></i>
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="text-white small mb-1">QA Reviewers</div>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-info bg-opacity-10 text-info">
                              {project.qaReviewers}
                            </span>
                            <button className="btn btn-link btn-sm text-light ms-2 p-0">
                              <i className="fas fa-user-plus small"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-light small mb-1">Files</div>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary">
                          {project.fileCount}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-medium">Progress</span>
                        <span className="small fw-medium">{project.progress}%</span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small fw-medium">Handler Notes</span>
                          <button className="btn btn-link btn-sm text-light p-0">
                            <i className="fas fa-edit small"></i>
                          </button>
                        </div>
                        <p className="small text-dark bg-card p-2 rounded mt-1">{project.handlerNote}</p>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small fw-medium">QA Notes</span>
                          <button className="btn btn-link btn-sm text-light p-0">
                            <i className="fas fa-edit small"></i>
                          </button>
                        </div>
                        <p className="small text-dark bg-card p-2 rounded mt-1">{project.qaNote}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        onClick={() => openTimeLog(project.id)}
                        className="btn btn-link text-primary p-0 small"
                      >
                        <i className="fas fa-clock me-1"></i> View Time Log
                      </button>
                      <div className="d-flex">
                        <button className="btn btn-link text-light p-0 me-2">
                          <i className="fas fa-exchange-alt"></i>
                        </button>
                        <button className="btn btn-link text-light p-0">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Tasks Grid (only for manager view) */}
        {isManager && activeTab === "my" && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 ">
            {myTasks.map((task) => (
              <div key={task.id} className="col ">
                <div className="card h-100 bg-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0 text-truncate" style={{ maxWidth: '200px' }}>{task.title}</h5>
                      <span className={`badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex">
                        <div className="me-4">
                          <div className="text-light small mb-1">Handlers</div>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              {task.handlers}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-light small mb-1">QA Reviewers</div>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-info bg-opacity-10 text-info">
                              {task.qaReviewers}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-light small mb-1">Files</div>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary">
                          {task.fileCount}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-medium">Progress</span>
                        <span className="small fw-medium">{task.progress}%</span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small fw-medium">Handler Notes</span>
                          <button className="btn btn-link btn-sm text-light p-0">
                            <i className="fas fa-edit small"></i>
                          </button>
                        </div>
                        <p className="small text-dark
                         bg-card p-2 rounded mt-1">{task.handlerNote}</p>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small fw-medium">QA Notes</span>
                          <button className="btn btn-link btn-sm text-light p-0">
                            <i className="fas fa-edit small"></i>
                          </button>
                        </div>
                        <p className="small text-light bg-card p-2 rounded mt-1">{task.qaNote}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        onClick={() => openTimeLog(task.id)}
                        className="btn btn-link text-primary p-0 small"
                      >
                        <i className="fas fa-clock me-1"></i> View Time Log
                      </button>
                      <div className="d-flex">
                        <button className="btn btn-link text-light p-0 me-2">
                          <i className="fas fa-exchange-alt"></i>
                        </button>
                        <button className="btn btn-link text-light p-0">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Time Log Modal */}
        {isTimeLogOpen && selectedProject && (
          <div className="modal fade show d-block custom-modal-dark" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    Time Log: {getProjectById(selectedProject)?.title}
                  </h5>
                  <button
                    onClick={closeTimeLog}
                    className="btn-close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <h6 className="fw-medium mb-3">Project Timeline</h6>
                    <div className="position-relative ps-3">
                      <div className="position-absolute h-100 border-start" style={{ left: '10px', top: 0 }}></div>
                      {getProjectById(selectedProject)?.timeline.map((item, index) => (
                        <div key={index} className="mb-3 d-flex">
                          <div className="position-relative">
                            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                              <i className="fas fa-check text-white small"></i>
                            </div>
                          </div>
                          <div className="ms-3">
                            <div className="small fw-medium">{item.stage}</div>
                            <div className="text-light small">{item.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h6 className="fw-medium mb-3 ">Resource Time Allocation</h6>
                    <div className="custom-modal-dark rounded p-3">
                      <div className="row g-3 mb-2 small fw-medium text-light ">
                        <div className="col-md-4">Role</div>
                        <div className="col-md-4">Team Member</div>
                        <div className="col-md-4">Hours Spent</div>
                      </div>
                      {getProjectById(selectedProject)?.timeSpent.map((resource, index) => (
                        <div key={index} className="row g-3 py-2 border-top mt-0 small">
                          <div className="col-md-4">{resource.role}</div>
                          <div className="col-md-4 fw-medium">{resource.name}</div>
                          <div className="col-md-4">{resource.hours} hrs</div>
                        </div>
                      ))}
                      <div className="row g-3 py-2 border-top fw-medium mt-2 small">
                        <div className="col-md-8">Total Hours</div>
                        <div className="col-md-4 text-primary">
                          {getProjectById(selectedProject)?.timeSpent.reduce((total, resource) => total + resource.hours, 0)} hrs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={closeTimeLog}
                    className="btn btn-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* New Task Modal */}
{isNewTaskModalOpen && (
  <div className="modal fade show d-block custom-modal-dark" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog ">
      <div className="modal-content ">
        <div className="modal-header  ">
          <h5 className="modal-title">Create New Task</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setIsNewTaskModalOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          {/* यहां Form Fields आएंगे */}
          <div className="mb-3">
            <label className="form-label">Task Title</label>
            <input type="text" className="form-control" />
          </div>
          <div className="mb-3">
  <label className="form-label">Description</label>
  <textarea className="form-control" rows={3}></textarea>
</div>
<div className="mb-3">
  <label className="form-label">Deadline</label>
  <input type="date" className="form-control" />
</div>
          <div className="mb-3">
            <label className="form-label">Assign To</label>
            <select className="form-select">
              <option>Select Team Member</option>
              <option>Alex Johnson</option>
              <option>Maria Garcia</option>
            </select>
          </div>
          {/* और Fields... */}
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary rounded-5" 
            onClick={() => setIsNewTaskModalOpen(false)}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn gradient-button"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TaskManagemnet;