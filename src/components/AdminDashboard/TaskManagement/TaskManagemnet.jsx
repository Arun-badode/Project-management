import React, { useState, useEffect } from "react";
import ProjectsTable from "./ProjectsTable";
import ProjectDetails from "./ProjectDetails";

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

const TaskManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isManager, setIsManager] = useState(true);
  const [activeProjectTab, setActiveProjectTab] = useState("all");

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
    setExpandedRow(expandedRow === project.id ? null : project.id);
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
                      className="gradient-button"
                      onClick={() => setActiveFilter("All")}
                    >
                      All
                    </button>
                  </div>
                  <div>
                    <button
                      className="gradient-button"
                      onClick={() => setActiveFilter("MS Office")}
                    >
                      Ms Office
                    </button>
                  </div>
                  <div>
                    <button
                      className="gradient-button"
                      onClick={() => setActiveFilter("Adobe")}
                    >
                      Adobe
                    </button>
                  </div>
                </div>
                <span className="text-light small">
                  Today: 2025-06-24, Tuesday
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

        {/* Projects Table */}
        <ProjectsTable
          projects={activeProjectTab === "all" ? filteredProjects : myTasks}
          onViewProject={handleViewProject}
          onMarkComplete={handleMarkComplete}
          onDeleteProject={handleDeleteProject}
          expandedRow={expandedRow}
        />

        {/* Project Details */}
        {selectedProject && expandedRow === selectedProject.id && (
          <ProjectDetails 
            project={selectedProject}
            onClose={() => setExpandedRow(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TaskManagement;