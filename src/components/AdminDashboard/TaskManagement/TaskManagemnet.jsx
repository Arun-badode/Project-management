import React, { useEffect, useRef, useState } from "react";

const TaskManagement = () => {
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("01");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filteredActiveProjects, setFilteredActiveProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleDateChange = (e) => setDate(e.target.value);
  const handleHourChange = (e) => setHour(e.target.value);
  const handleMinuteChange = (e) => setMinute(e.target.value);
  const handlePeriodChange = (e) => setPeriod(e.target.value);

  // Mock data for active projects
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Website Redesign",
      client: "Acme Corp",
      task: "Translation",
      language: "English",
      platform: "Web",
      totalPages: 24,
      dueDate: "10:30 AM 25-06-25",
      progress: 65,
      status: "In Progress",
      handlers: 3,
      qaReviewers: 2,
      fileCount: 24,
      handlerNote: "Working on homepage layout. Need feedback on color scheme.",
      qaNote:
        "Initial review completed for navigation. Found some responsive issues.",
      files: [
        {
          id: 1,
          name: "homepage.html",
          pages: 5,
          language: "English",
          platform: "Web",
          stage: "In Progress",
          assigned: "20-06-25",
          handler: "John Doe",
          qaReviewer: "Sarah Williams",
          qaStatus: "Pending",
        },
        {
          id: 2,
          name: "contact.html",
          pages: 3,
          language: "English",
          platform: "Web",
          stage: "In Progress",
          assigned: "21-06-25",
          handler: "Jane Smith",
          qaReviewer: "",
          qaStatus: "Pending",
        },
      ],
    },
    {
      id: 2,
      title: "Annual Report",
      client: "Globex",
      task: "Proofreading",
      language: "Spanish",
      platform: "MS Office",
      totalPages: 42,
      dueDate: "02:45 PM 28-06-25",
      progress: 80,
      status: "QA Review",
      handlers: 2,
      qaReviewers: 1,
      fileCount: 8,
      handlerNote:
        "Finalizing financial section. Need to add executive summary.",
      qaNote: "Reviewing for consistency in formatting.",
      files: [
        {
          id: 1,
          name: "report.docx",
          pages: 42,
          language: "Spanish",
          platform: "MS Office",
          stage: "QA Review",
          assigned: "15-06-25",
          handler: "Mike Johnson",
          qaReviewer: "David Brown",
          qaStatus: "In Progress",
        },
      ],
    },
    {
      id: 3,
      title: "Marketing Brochure",
      client: "Initech",
      task: "Editing",
      language: "French",
      platform: "Adobe",
      totalPages: 12,
      dueDate: "09:15 AM 26-06-25",
      progress: 45,
      status: "In Progress",
      handlers: 1,
      qaReviewers: 1,
      fileCount: 6,
      handlerNote: "Working on product descriptions. Need high-res images.",
      qaNote: "Waiting for first draft to start review.",
      files: [
        {
          id: 1,
          name: "brochure.indd",
          pages: 12,
          language: "French",
          platform: "Adobe",
          stage: "In Progress",
          assigned: "22-06-25",
          handler: "Emily Chen",
          qaReviewer: "",
          qaStatus: "Pending",
        },
      ],
    },
  ]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isManager, setIsManager] = useState(true); // Toggle for manager view
  const [activeProjectTab, setActiveProjectTab] = useState("all");

  // Filter projects based on search term, status filter and platform filter
  const filteredProjects = projects.filter((project) => {
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

  // Batch edit states
  const [batchEditValues, setBatchEditValues] = useState({
    platform: "",
    handler: "",
    qaReviewer: "",
    priority: "",
  });

  // Open project detail
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSelectedFiles([]);
    setHasUnsavedChanges(false);
    setBatchEditValues({
      platform: "",
      handler: "",
      qaReviewer: "",
      priority: "",
    });
    // Toggle expanded row
    setExpandedRow(expandedRow === project.id ? null : project.id);
  };

  const handleEditProject = (project) => {
    setEditedProject({ ...project });
    setShowEditModal(true);
  };

  // Handle marking project as complete
  const handleMarkComplete = (id) => {
    if (
      window.confirm("Are you sure you want to mark this project as complete?")
    ) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  // Handle project deletion
  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  // Apply batch edits to selected files
  const applyBatchEdits = () => {
    if (selectedProject && selectedFiles.length > 0) {
      const updatedFiles = selectedProject.files.map((file) => {
        if (selectedFiles.some((f) => f.id === file.id)) {
          return {
            ...file,
            platform: batchEditValues.platform || file.platform,
            handler: batchEditValues.handler || file.handler,
            qaReviewer: batchEditValues.qaReviewer || file.qaReviewer,
            priority: batchEditValues.priority || file.priority,
          };
        }
        return file;
      });

      const updatedProject = {
        ...selectedProject,
        files: updatedFiles,
      };

      setSelectedProject(updatedProject);
      // Update the project in the main projects array
      setProjects(
        projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      // Reset batch edit values
      setBatchEditValues({
        platform: "",
        handler: "",
        qaReviewer: "",
        priority: "",
      });
      setSelectedFiles([]);
      setHasUnsavedChanges(false);
    }
  };

  // Toggle file selection for batch editing
  const toggleFileSelection = (file) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const fakeScrollbar = fakeScrollbarRef.current;

    if (scrollContainer && fakeScrollbar) {
      const updateScrollbarVisibility = () => {
        const needsHorizontalScroll =
          scrollContainer.scrollWidth > scrollContainer.clientWidth;

        fakeScrollbar.style.display = needsHorizontalScroll ? "block" : "none";
      };

      // Sync scroll positions
      const syncScroll = () => {
        fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
      };
      const syncFakeScroll = () => {
        scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
      };

      scrollContainer.addEventListener("scroll", syncScroll);
      fakeScrollbar.addEventListener("scroll", syncFakeScroll);

      updateScrollbarVisibility();
      window.addEventListener("resize", updateScrollbarVisibility);

      return () => {
        scrollContainer.removeEventListener("scroll", syncScroll);
        fakeScrollbar.removeEventListener("scroll", syncFakeScroll);
        window.removeEventListener("resize", updateScrollbarVisibility);
      };
    }
  }, []);

  // Generate dummy data
  useEffect(() => {
    const dummyProjects = generateDummyProjects(15);
    setProjects(dummyProjects);
    setFilteredActiveProjects(dummyProjects);
  }, []);

  return (
    <div className="min-vh-100 bg-main">
      {/* Main Content */}
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
                <span className="text-light small ">
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
              className={`nav-link ${
                activeProjectTab === "all" ? "active" : ""
              }`}
              onClick={() => setActiveProjectTab("all")}
            >
              All Active Projects
            </button>
          </li>
          {isManager && (
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeProjectTab === "my" ? "active" : ""
                }`}
                onClick={() => setActiveProjectTab("my")}
              >
                My Tasks
              </button>
            </li>
          )}
        </ul>

        {/* Projects Table */}
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
            display: "none",
          }}
        >
          <div style={{ width: "2000px", height: 1 }} />
        </div>

        {/* Scrollable Table Container */}
        <div
          className=""
          ref={scrollContainerRef}
          style={{
            maxHeight: "500px",
            overflowX: "auto",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          <table className="table-gradient-bg align-middle mt-0 table table-bordered table-hover">
            <thead
                className="table-gradient-bg table"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 0,
                  backgroundColor: "#fff", // Match your background color
                }}
              >
              <tr  className="text-center">
                <th>S. No.</th>
                <th>Project Title</th>
                <th>Client</th>
                <th>Task</th>
                <th>Language</th>
                <th>Application</th>
                <th>Total Pages</th>
                <th>Due Date & Time</th>
                <th>Handlers</th>
                <th>QA Reviewers</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeProjectTab === "all" ? filteredProjects : myTasks).map(
                (project, index) => (
                  <React.Fragment key={project.id}>
                    <tr
                      className={
                        expandedRow === project.id ? "table-active text-center" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{project.title}</td>
                      <td>{project.client}</td>
                      <td>{project.task}</td>
                      <td>{project.language}</td>
                      <td>{project.platform}</td>
                      <td>{project.totalPages}</td>
                      <td>{project.dueDate}</td>
                      <td>{project.handlers}</td>
                      <td>{project.qaReviewers}</td>
                      <td>
                        <div
                          className="progress cursor-pointer"
                          style={{ height: "24px" }}
                          onClick={() => handleViewProject(project)}
                        >
                          <div
                            className={`progress-bar 
                          ${
                            project.progress < 30
                              ? "bg-danger"
                              : project.progress < 70
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                            role="progressbar"
                            style={{ width: `${project.progress}%` }}
                            aria-valuenow={project.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            {project.progress}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleViewProject(project)}
                          >
                            <i
                              className={`fas ${
                                expandedRow === project.id
                                  ? "fa-chevron-up"
                                  : "fa-eye"
                              }`}
                            ></i>
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditProject(project)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          {project.progress === 100 && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleMarkComplete(project.id)}
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedRow === project.id && (
                      <tr>
                        <td colSpan={12} className="p-0 border-top-0">
                          <div className="p-4">
                            {/* Project Notes */}
                            <div className="row mb-4">
                              <div className="col-md-6">
                                <div className="card h-100">
                                  <div className="card-header bg-primary text-white">
                                    Handler Notes
                                  </div>
                                  <div className="card-body">
                                    <p>{project.handlerNote}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="card h-100">
                                  <div className="card-header bg-info text-white">
                                    QA Notes
                                  </div>
                                  <div className="card-body">
                                    <p>{project.qaNote}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Batch Edit */}
                            {selectedFiles.length > 0 && (
                              <div className="card mb-4">
                                <div className="card-body bg-card">
                                  <h6 className="card-title mb-3">
                                    Batch Edit
                                  </h6>
                                  <div className="row g-3">
                                    {/* Platform */}
                                    <div className="col-md-4 col-lg-2">
                                      <label className="form-label">
                                        Application
                                      </label>
                                      <select
                                        className="form-select form-select-sm"
                                        value={batchEditValues.platform}
                                        onChange={(e) =>
                                          setBatchEditValues({
                                            ...batchEditValues,
                                            platform: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="Web">Web</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Desktop">Desktop</option>
                                        <option value="MS Office">
                                          MS Office
                                        </option>
                                        <option value="Adobe">Adobe</option>
                                      </select>
                                    </div>
                                    {/* Handler */}
                                    <div className="col-md-4 col-lg-2">
                                      <label className="form-label">
                                        Handler
                                      </label>
                                      <select
                                        className="form-select form-select-sm"
                                        value={batchEditValues.handler}
                                        onChange={(e) =>
                                          setBatchEditValues({
                                            ...batchEditValues,
                                            handler: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="John Doe">
                                          John Doe
                                        </option>
                                        <option value="Jane Smith">
                                          Jane Smith
                                        </option>
                                        <option value="Mike Johnson">
                                          Mike Johnson
                                        </option>
                                        <option value="Emily Chen">
                                          Emily Chen
                                        </option>
                                      </select>
                                    </div>
                                    {/* QA Reviewer */}
                                    <div className="col-md-4 col-lg-2">
                                      <label className="form-label">
                                        QA Reviewer
                                      </label>
                                      <select
                                        className="form-select form-select-sm"
                                        value={batchEditValues.qaReviewer}
                                        onChange={(e) =>
                                          setBatchEditValues({
                                            ...batchEditValues,
                                            qaReviewer: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="Sarah Williams">
                                          Sarah Williams
                                        </option>
                                        <option value="David Brown">
                                          David Brown
                                        </option>
                                        <option value="Emily Davis">
                                          Emily Davis
                                        </option>
                                      </select>
                                    </div>
                                    {/* Priority */}
                                    <div className="col-md-4 col-lg-2">
                                      <label className="form-label">
                                        Priority
                                      </label>
                                      <select
                                        className="form-select form-select-sm"
                                        value={batchEditValues.priority}
                                        onChange={(e) =>
                                          setBatchEditValues({
                                            ...batchEditValues,
                                            priority: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="mt-3">
                                    <button
                                      className="btn gradient-button"
                                      onClick={applyBatchEdits}
                                    >
                                      Apply to Selected Files
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Files Table */}
                            <div className="table-responsive">
                              <table className="table table-sm table-striped table-hover">
                                <thead
                                  className="table-gradient-bg table"
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 0,
                                    backgroundColor: "#fff", // Match your background color
                                  }}
                                >
                                  <tr  className="text-center">
                                    <th>
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={
                                          selectedFiles.length ===
                                          project.files.length
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedFiles([
                                              ...project.files,
                                            ]);
                                          } else {
                                            setSelectedFiles([]);
                                          }
                                          setHasUnsavedChanges(true);
                                        }}
                                      />
                                    </th>
                                    <th>File Name</th>
                                    <th>Pages</th>
                                    <th>Language</th>
                                    <th>Application</th>
                                    <th>Stage</th>
                                    <th>Assigned</th>
                                    <th>Handler</th>
                                    <th>QA Reviewer</th>
                                    <th>QA Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {project.files.map((file) => (
                                    <tr
                                      key={file.id}
                                      className={
                                        selectedFiles.some(
                                          (f) => f.id === file.id
                                        )
                                          ? "table-primary text-center"
                                          : ""
                                      }
                                    >
                                      <td>
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={selectedFiles.some(
                                            (f) => f.id === file.id
                                          )}
                                          onChange={() =>
                                            toggleFileSelection(file)
                                          }
                                        />
                                      </td>
                                      <td>{file.name}</td>
                                      <td>{file.pages}</td>
                                      <td>{file.language}</td>
                                      <td>
                                        <select
                                          className="form-select form-select-sm"
                                          value={file.platform}
                                          onChange={(e) => {
                                            const updatedFiles =
                                              project.files.map((f) =>
                                                f.id === file.id
                                                  ? {
                                                      ...f,
                                                      platform: e.target.value,
                                                    }
                                                  : f
                                              );
                                            setSelectedProject({
                                              ...project,
                                              files: updatedFiles,
                                            });
                                            setHasUnsavedChanges(true);
                                          }}
                                        >
                                          <option value="Web">Web</option>
                                          <option value="Mobile">Mobile</option>
                                          <option value="Desktop">
                                            Desktop
                                          </option>
                                          <option value="MS Office">
                                            MS Office
                                          </option>
                                          <option value="Adobe">Adobe</option>
                                        </select>
                                      </td>
                                      <td>{file.stage}</td>
                                      <td>{file.assigned}</td>
                                      <td>
                                        <select
                                          className="form-select form-select-sm"
                                          value={file.handler || ""}
                                          onChange={(e) => {
                                            const updatedFiles =
                                              project.files.map((f) =>
                                                f.id === file.id
                                                  ? {
                                                      ...f,
                                                      handler: e.target.value,
                                                    }
                                                  : f
                                              );
                                            setSelectedProject({
                                              ...project,
                                              files: updatedFiles,
                                            });
                                            setHasUnsavedChanges(true);
                                          }}
                                        >
                                          <option value="">Not Assigned</option>
                                          <option value="John Doe">
                                            John Doe
                                          </option>
                                          <option value="Jane Smith">
                                            Jane Smith
                                          </option>
                                          <option value="Mike Johnson">
                                            Mike Johnson
                                          </option>
                                          <option value="Emily Chen">
                                            Emily Chen
                                          </option>
                                        </select>
                                      </td>
                                      <td>
                                        <select
                                          className="form-select form-select-sm"
                                          value={file.qaReviewer || ""}
                                          onChange={(e) => {
                                            const updatedFiles =
                                              project.files.map((f) =>
                                                f.id === file.id
                                                  ? {
                                                      ...f,
                                                      qaReviewer:
                                                        e.target.value,
                                                    }
                                                  : f
                                              );
                                            setSelectedProject({
                                              ...project,
                                              files: updatedFiles,
                                            });
                                            setHasUnsavedChanges(true);
                                          }}
                                        >
                                          <option value="">Not Assigned</option>
                                          <option value="Sarah Williams">
                                            Sarah Williams
                                          </option>
                                          <option value="David Brown">
                                            David Brown
                                          </option>
                                          <option value="Emily Davis">
                                            Emily Davis
                                          </option>
                                        </select>
                                      </td>
                                      <td>{file.qaStatus}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;

// Generate dummy data function
const generateDummyProjects = (count) => {
  const clients = [
    "Acme Corp",
    "Globex",
    "Initech",
    "Umbrella Inc",
    "Stark Industries",
  ];
  const tasks = [
    "Translation",
    "Proofreading",
    "QA Review",
    "Editing",
    "Formatting",
  ];
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
  ];
  const platforms = ["Web", "Mobile", "Desktop", "MS Office", "Adobe"];
  const stages = ["In Progress", "Review", "Completed", "On Hold"];
  const qaStatuses = ["Pending", "In Progress", "Approved", "Rejected"];
  const handlers = ["John Doe", "Jane Smith", "Mike Johnson", "Emily Chen", ""];
  const qaReviewers = ["Sarah Williams", "David Brown", "Emily Davis", ""];

  const projects = [];

  for (let i = 1; i <= count; i++) {
    const totalPages = Math.floor(Math.random() * 100) + 10;
    const progress = Math.floor(Math.random() * 101);
    const handler = handlers[Math.floor(Math.random() * handlers.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];

    // Generate random due date (between now and 30 days in the future)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    dueDate.setHours(hours, minutes);

    // Format due date as "hh:mm tt DD-MM-YY"
    const formattedDueDate = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"} ${dueDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(dueDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dueDate.getFullYear().toString().slice(2)}`;

    // Generate files
    const fileCount = Math.floor(Math.random() * 5) + 1;
    const files = [];

    for (let j = 1; j <= fileCount; j++) {
      const filePages = Math.floor(Math.random() * 20) + 1;
      files.push({
        id: j,
        name: `File_${i}_${j}.${
          platform === "MS Office"
            ? "docx"
            : platform === "Adobe"
            ? "indd"
            : "html"
        }`,
        pages: filePages,
        language: languages[Math.floor(Math.random() * languages.length)],
        platform: platform,
        stage: stages[Math.floor(Math.random() * stages.length)],
        assigned: new Date(
          dueDate.getTime() -
            Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toLocaleDateString(),
        handler: handler,
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      });
    }

    projects.push({
      id: i,
      title: `Project ${i}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      task: tasks[Math.floor(Math.random() * tasks.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      platform: platform,
      totalPages,
      dueDate: formattedDueDate,
      progress,
      status:
        progress === 100
          ? "Completed"
          : progress > 80
          ? "QA Review"
          : progress > 50
          ? "Ready for QA"
          : "In Progress",
      handlers: Math.floor(Math.random() * 3) + 1,
      qaReviewers: Math.floor(Math.random() * 2) + 1,
      fileCount,
      handlerNote: "Sample handler note for project " + i,
      qaNote: "Sample QA note for project " + i,
      files,
    });
  }

  return projects;
};
