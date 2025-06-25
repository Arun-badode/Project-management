import React, { useState } from "react";

const App = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample data for projects
  const projects = [
    {
      id: 1,
      title: "Website Redesign",
      client: "Acme Corp",
      task: "UI/UX Design",
      language: "English",
      platform: "Web",
      totalPages: 12,
      dueDate: "2025-06-26 14:00",
      progress: 85,
      handled: true,
      files: [
        { name: "Homepage.fig", status: "Completed" },
        { name: "About.fig", status: "In Progress" },
        { name: "Contact.fig", status: "Not Started" },
      ],
    },
    {
      id: 2,
      title: "Mobile App Development",
      client: "TechStart",
      task: "Frontend Development",
      language: "English",
      platform: "iOS/Android",
      totalPages: 8,
      dueDate: "2025-06-27 09:30",
      progress: 45,
      handled: true,
      files: [
        { name: "Login Screen", status: "Completed" },
        { name: "Dashboard", status: "In Progress" },
        { name: "Settings", status: "Not Started" },
      ],
    },
    {
      id: 3,
      title: "Content Translation",
      client: "Global Media",
      task: "Translation",
      language: "Spanish",
      platform: "Document",
      totalPages: 24,
      dueDate: "2025-06-28 16:00",
      progress: 30,
      handled: false,
      files: [
        { name: "Chapter 1", status: "In Progress" },
        { name: "Chapter 2", status: "Not Started" },
        { name: "Chapter 3", status: "Not Started" },
      ],
    },
    {
      id: 4,
      title: "E-commerce Platform",
      client: "Retail Solutions",
      task: "Backend Development",
      language: "English",
      platform: "Web",
      totalPages: 18,
      dueDate: "2025-06-29 11:00",
      progress: 65,
      handled: true,
      files: [
        { name: "User Authentication", status: "Completed" },
        { name: "Product Catalog", status: "In Progress" },
        { name: "Payment Gateway", status: "In Progress" },
      ],
    },
    {
      id: 5,
      title: "Marketing Campaign",
      client: "Fashion Brand",
      task: "Content Creation",
      language: "French",
      platform: "Social Media",
      totalPages: 6,
      dueDate: "2025-06-30 15:30",
      progress: 100,
      handled: true,
      files: [
        { name: "Instagram Posts", status: "Completed" },
        { name: "Facebook Ads", status: "Completed" },
        { name: "Email Newsletter", status: "Completed" },
      ],
    },
    {
      id: 6,
      title: "Data Analysis Report",
      client: "Research Institute",
      task: "Data Analysis",
      language: "English",
      platform: "Document",
      totalPages: 32,
      dueDate: "2025-07-01 10:00",
      progress: 15,
      handled: false,
      files: [
        { name: "Data Collection", status: "In Progress" },
        { name: "Statistical Analysis", status: "Not Started" },
        { name: "Visualization", status: "Not Started" },
      ],
    },
  ];

  // Sort projects by due date
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  // Filter projects based on active tab
  const filteredProjects = sortedProjects.filter(
    (project) =>
      activeTab === "all" || (activeTab === "unhandled" && !project.handled),
  );

  // Filter options
  const clients = Array.from(new Set(projects.map((p) => p.client)));
  const tasks = Array.from(new Set(projects.map((p) => p.task)));
  const languages = Array.from(new Set(projects.map((p) => p.language)));

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get progress bar color based on percentage
  const getProgressColor = (progress) => {
    if (progress <= 30) return "bg-danger";
    if (progress <= 70) return "bg-warning";
    return "bg-success";
  };

  return (
    <>
     
      
      <div className="min-vh-100 bg-light">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container py-4">
            <h1 className="h2 fw-bold text-dark mb-0">Active Projects</h1>
          </div>
        </header>

        <div className="container py-4">
          {/* Filters */}
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <label htmlFor="client-filter" className="form-label fw-medium">
                Client
              </label>
              <select id="client-filter" className="form-select">
                <option value="">All Clients</option>
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="task-filter" className="form-label fw-medium">
                Task
              </label>
              <select id="task-filter" className="form-select">
                <option value="">All Tasks</option>
                {tasks.map((task) => (
                  <option key={task} value={task}>
                    {task}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="language-filter" className="form-label fw-medium">
                Language
              </label>
              <select id="language-filter" className="form-select">
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Active Projects
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "unhandled" ? "active" : ""}`}
                onClick={() => setActiveTab("unhandled")}
              >
                Unhandled Projects
              </button>
            </li>
          </ul>

          {/* Projects Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">S. No.</th>
                  <th scope="col">Project Title</th>
                  <th scope="col">Client</th>
                  <th scope="col">Task</th>
                  <th scope="col">Language</th>
                  <th scope="col">Platform</th>
                  <th scope="col">Total Pages</th>
                  <th scope="col">Actual Due Date & Time</th>
                  <th scope="col">Progress</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr key={project.id}>
                    <td>{index + 1}</td>
                    <td className="fw-medium">{project.title}</td>
                    <td>{project.client}</td>
                    <td>{project.task}</td>
                    <td>{project.language}</td>
                    <td>{project.platform}</td>
                    <td>{project.totalPages}</td>
                    <td className="text-nowrap">{formatDate(project.dueDate)}</td>
                    <td>
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedProject(
                            selectedProject === project.id ? null : project.id,
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <div className="progress mb-1" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar ${getProgressColor(project.progress)}`}
                            role="progressbar"
                            style={{ width: `${project.progress}%` }}
                            aria-valuenow={project.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <small className="text-muted">{project.progress}%</small>
                      </div>
                    </td>
                    <td>
                      {project.progress === 100 ? (
                        <button className="btn btn-outline-success btn-sm">
                          Mark as Complete
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            setSelectedProject(
                              selectedProject === project.id ? null : project.id,
                            )
                          }
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Project Details Modal */}
          {selectedProject !== null && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  {projects
                    .filter((p) => p.id === selectedProject)
                    .map((project) => (
                      <div key={project.id}>
                        <div className="modal-header">
                          <h5 className="modal-title">{project.title}</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSelectedProject(null)}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <p className="text-muted mb-3">
                            <strong>Client:</strong> {project.client}
                          </p>
                          <hr />
                          <h6 className="fw-bold mb-3">File Details</h6>
                          <div className="row g-2">
                            {project.files.map((file, index) => (
                              <div key={index} className="col-12">
                                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                                  <span className="fw-medium">{file.name}</span>
                                  <span
                                    className={`badge ${
                                      file.status === "Completed"
                                        ? "bg-success"
                                        : file.status === "In Progress"
                                        ? "bg-warning text-dark"
                                        : "bg-secondary"
                                    }`}
                                  >
                                    {file.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => setSelectedProject(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;