// The exported code now uses Bootstrap instead of Tailwind CSS
import React, { useEffect, useRef, useState } from 'react';



const TaskManagemnet = () => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('01');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredactiveProjects, setFilteredactiveProjects] = useState([]);


  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleHourChange = (e) => {
    setHour(e.target.value);
  };

  const handleMinuteChange = (e) => {
    setMinute(e.target.value);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

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
  const [activeProjectTab, setActiveProjectTab] = useState('all');

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

  // Batch edit states
  const [batchEditValues, setBatchEditValues] = useState({
    platform: '',
    handler: '',
    qaReviewer: '',
    qcDue: '',
    qcAllocatedHours: '',
    priority: ''
  });

  // Open project detail modal
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSelectedFiles([]);
    setShowDetailModal(false); // Don't show modal
    setHasUnsavedChanges(false);
    setBatchEditValues({
      platform: '',
      handler: '',
      qaReviewer: '',
      qcDue: '',
      qcAllocatedHours: '',
      priority: ''
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
    if (window.confirm('Are you sure you want to mark this project as complete?')) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  // Handle project deletion
  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  // Apply batch edits to selected files
  const applyBatchEdits = () => {
    if (selectedProject && selectedFiles.length > 0) {
      const updatedFiles = selectedProject.files.map(file => {
        if (selectedFiles.some(f => f.id === file.id)) {
          return {
            ...file,
            platform: batchEditValues.platform || file.platform,
            handler: batchEditValues.handler || file.handler,
            qaReviewer: batchEditValues.qaReviewer || file.qaReviewer,
            qcDue: batchEditValues.qcDue || file.qcDue,
            qcAllocatedHours: batchEditValues.qcAllocatedHours || file.qcAllocatedHours,
            priority: batchEditValues.priority || file.priority
          };
        }
        return file;
      });

      const updatedProject = {
        ...selectedProject,
        files: updatedFiles
      };

      setSelectedProject(updatedProject);
      // Update the project in the main projects array
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      // Reset batch edit values
      setBatchEditValues({
        platform: '',
        handler: '',
        qaReviewer: '',
        qcDue: '',
        qcAllocatedHours: '',
        priority: ''
      });
      setSelectedFiles([]);
      setHasUnsavedChanges(false);
    }
  };

  // Toggle file selection for batch editing
  const toggleFileSelection = (file) => {
    if (selectedFiles.some(f => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
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


  const tabScrollContainerRef = useRef(null);
  const tabFakeScrollbarRef = useRef(null);
  const tabFakeScrollbarInnerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = tabScrollContainerRef.current;
    const fakeScrollbar = tabFakeScrollbarRef.current;
    const fakeScrollbarInner = tabFakeScrollbarInnerRef.current;

    if (scrollContainer && fakeScrollbar && fakeScrollbarInner) {
      const updateScrollbar = () => {
        const needsHorizontalScroll =
          scrollContainer.scrollWidth > scrollContainer.clientWidth;

        fakeScrollbar.style.display = needsHorizontalScroll ? "block" : "none";
        fakeScrollbarInner.style.width = `${scrollContainer.scrollWidth}px`;
      };

      const syncScroll = () => {
        fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
      };
      const syncFakeScroll = () => {
        scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
      };

      scrollContainer.addEventListener("scroll", syncScroll);
      fakeScrollbar.addEventListener("scroll", syncFakeScroll);
      window.addEventListener("resize", updateScrollbar);

      // Delay to handle tabs rendering
      setTimeout(updateScrollbar, 100);

      return () => {
        scrollContainer.removeEventListener("scroll", syncScroll);
        fakeScrollbar.removeEventListener("scroll", syncFakeScroll);
        window.removeEventListener("resize", updateScrollbar);
      };
    }
  }, [selectedProject]); // rerun when project changes


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    const due = params.get('due');

    let result = [...projects];

    // Filter for "active" projects
    if (filter === 'active') {
      result = result.filter(project => project.progress < 100); // or use your own status logic
    }

    // Filter for "near due" (due in next 30 minutes)
    if (due === '30min') {
      const now = new Date();
      const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      result = result.filter(project => {
        // Parse your dueDate string to Date
        const match = project.dueDate.match(/(\d{2}):(\d{2}) (AM|PM) (\d{2})-(\d{2})-(\d{2})/);
        if (!match) return false;
        let [_, hour, min, ampm, day, month, year] = match;
        hour = parseInt(hour, 10);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        const dueDateObj = new Date(`20${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${min}`);
        return dueDateObj > now && dueDateObj <= thirtyMinsFromNow;
      });
    }

    setFilteredactiveProjects(result);
  }, [location.search, projects]);

  // Generate dummy data
  useEffect(() => {
    const dummyProjects = generateDummyProjects(15);
    setProjects(dummyProjects);
    setFilteredactiveProjects(dummyProjects);
  }, []);

  // Close modal with confirmation if there are unsaved changes
  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        setShowDetailModal(false);
      }
    } else {
      setShowDetailModal(false);
    }
  };

  return (
    <div className="min-vh-100 bg-main">
      {/* Header/Navigation */}

      {/* Main Content */}
      <div className="container py-4">
        <div className='d-flex justify-content-between'>
          <div className="mb-4">
            <h2 className="gradient-heading">Task Management</h2>
            <p className="text-light">Active Projects Only</p>
          </div>
          <div className='d-flex gap-2'>
            <div className='text-align-center gradient-heading align-item-center'>
              <h3>Filters</h3>
            </div>
            <div>
              <button
                className="btn gradient-button"
              >
                All
              </button>
            </div>
            <div>
              <button
                className="btn gradient-button"
              >
                Ms Office
              </button>
            </div>
            <div>
              <button
                className="btn gradient-button"
              >
                Adobe
              </button>
            </div>
          </div>
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
                {/* <button
                  className="btn gradient-button"
                  onClick={() => setIsNewTaskModalOpen(true)}
                >
                  <i className="fas fa-plus me-2"></i>New Task
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item ">
            <button
              className={`nav-link ${activeProjectTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveProjectTab('all')}
            >
              All Active Projects
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeProjectTab === 'unhandled' ? 'active' : ''}`}
              onClick={() => setActiveProjectTab('unhandled')}
            >
              Unhandled Projects
            </button>
          </li>
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
            display: "none", // start hidden
          }}
        >
          <div style={{ width: "2000px", height: 1 }} />
        </div>

        {/* 🔻 Scrollable Table Container */}
        <div
          className="table-responsive"
          ref={scrollContainerRef}
          style={{ maxHeight: "500px", overflowY: "auto", overflowX: "auto" }}
        >
          <table className="table-gradient-bg align-middle mt-0 table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>S. No.</th>
                <th>Project Title</th>
                <th>Client</th>
                <th>Task</th>
                <th>Language</th>
                <th>Application</th>
                <th>Total Pages</th>
                <th>Due Date & Time</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredactiveProjects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr className={expandedRow === project.id ? "table-active" : ""}>
                    <td>{index + 1}</td>
                    <td>{project.title}</td>
                    <td>{project.client}</td>
                    <td>{project.task}</td>
                    <td>{project.language}</td>
                    <td>{project.platform}</td>
                    <td>{project.totalPages}</td>
                    <td>{project.dueDate}</td>
                    <td>
                      <div
                        className="progress cursor-pointer"
                        style={{ height: "24px" }}
                        onClick={() => handleViewProject(project)}
                      >
                        <div
                          className={`progress-bar 
                          ${project.progress < 30
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
                            className={`fas ${expandedRow === project.id
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
                      <td colSpan={10} className="p-0 border-top-0">
                        <div className="p-4">
                          {/* Header */}
                          <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5 className="mb-0">Project Files</h5>
                              {selectedFiles.length > 0 && (
                                <span className="badge bg-primary">
                                  {selectedFiles.length} files selected
                                </span>
                              )}
                            </div>

                            {/* Batch Edit */}
                            {selectedFiles.length > 0 && (
                              <div className="card mb-4">
                                <div className="card-body bg-card">
                                  <h6 className="card-title mb-3">Batch Edit</h6>
                                  <div className="row g-3">
                                    {/* Platform */}
                                    <div className="col-md-4 col-lg-2">
                                      <label className="form-label">Application</label>
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
                                      </select>
                                    </div>
                                    {/* Handler */}
                                    <div className="col-md-4 col-lg-2">
                                      <label className="form-label">Handler</label>
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
                                        <option value="John Doe">John Doe</option>
                                        <option value="Jane Smith">Jane Smith</option>
                                        <option value="Mike Johnson">Mike Johnson</option>
                                      </select>
                                    </div>
                                    {/* QA Reviewer */}
                                    {/* <div className="col-md-4 col-lg-2">
                                    <label className="form-label">QA Reviewer</label>
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
                                      <option value="Sarah Williams">Sarah Williams</option>
                                      <option value="David Brown">David Brown</option>
                                      <option value="Emily Davis">Emily Davis</option>
                                    </select>
                                  </div>
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">QC Due</label>
                                    <input
                                      type="date"
                                      className="form-control form-control-sm"
                                      value={batchEditValues.qcDue}
                                      onChange={(e) =>
                                        setBatchEditValues({
                                          ...batchEditValues,
                                          qcDue: e.target.value,
                                        })
                                      }
                                    />
                                  </div> */}
                                    <div className="col-md-5 col-lg-5 mb-3">
                                      <label className="form-label">QC Due</label>
                                      <div className="row gx-2 gy-2 align-items-center">
                                        {/* Date Picker */}
                                        <div className="col-12 col-sm-6 col-md-5">
                                          <input
                                            type="date"
                                            className="form-control"
                                            value={date}
                                            onChange={handleDateChange}
                                          />
                                        </div>

                                        {/* Hour Selector */}
                                        <div className="col-4 col-sm-2 col-md-2">
                                          <select
                                            className="form-select"
                                            value={hour}
                                            onChange={handleHourChange}
                                          >
                                            {Array.from({ length: 12 }, (_, i) => (
                                              <option key={i} value={String(i + 1).padStart(2, '0')}>
                                                {String(i + 1).padStart(2, '0')}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* Minute Selector */}
                                        <div className="col-4 col-sm-2 col-md-2">
                                          <select
                                            className="form-select"
                                            value={minute}
                                            onChange={handleMinuteChange}
                                          >
                                            {['00', '15', '30', '45'].map((min) => (
                                              <option key={min} value={min}>
                                                {min}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* AM/PM Selector */}
                                        <div className="col-4 col-sm-2 col-md-2">
                                          <select
                                            className="form-select"
                                            value={period}
                                            onChange={handlePeriodChange}
                                          >
                                            <option value="AM">AM</option>
                                            <option value="PM">PM</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>



                                    {/* QC Hours */}
                                    {/* <div className="col-md-4 col-lg-2">
                                    <label className="form-label">QC Hours</label>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={batchEditValues.qcAllocatedHours}
                                      onChange={(e) =>
                                        setBatchEditValues({
                                          ...batchEditValues,
                                          qcAllocatedHours: e.target.value,
                                        })
                                      }
                                    />
                                  </div> */}
                                    {/* Priority */}
                                    <div className="col-md-4 col-lg-2">
                                      <label className="form-label">Priority</label>
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
                                <thead className="table-light">
                                  <tr>
                                    <th>
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={
                                          selectedFiles.length === project.files.length
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedFiles([...project.files]);
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
                                        selectedFiles.some((f) => f.id === file.id)
                                          ? "table-primary"
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
                                          onChange={() => toggleFileSelection(file)}
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
                                            const updatedFiles = project.files.map((f) =>
                                              f.id === file.id
                                                ? { ...f, platform: e.target.value }
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
                                          <option value="Desktop">Desktop</option>
                                        </select>
                                      </td>
                                      <td>{file.stage}</td>
                                      <td>{file.assigned}</td>
                                      <td>
                                        <select
                                          className="form-select form-select-sm"
                                          value={file.handler || ""}
                                          onChange={(e) => {
                                            const updatedFiles = project.files.map((f) =>
                                              f.id === file.id
                                                ? { ...f, handler: e.target.value }
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
                                          <option value="John Doe">John Doe</option>
                                          <option value="Jane Smith">Jane Smith</option>
                                          <option value="Mike Johnson">Mike Johnson</option>
                                        </select>
                                      </td>
                                      <td>
                                        <select
                                          className="form-select form-select-sm"
                                          value={file.qaReviewer || ""}
                                          onChange={(e) => {
                                            const updatedFiles = project.files.map((f) =>
                                              f.id === file.id
                                                ? { ...f, qaReviewer: e.target.value }
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
                                          <option value="David Brown">David Brown</option>
                                          <option value="Emily Davis">Emily Davis</option>
                                        </select>
                                      </td>
                                      <td>{file.qaStatus}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Footer buttons */}
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 bg-card px-3 py-2 rounded-3 border">
                            <div className="text-center border border-dark rounded bg-card px-3 py-2">
                              <div className="fw-semibold bg-info border-bottom small py-1">
                                Ready for QC Due
                              </div>
                              <div className="fw-semibold text-light">
                                hh:mm:tt &nbsp; DD-MM-YY
                              </div>
                              <div className="text-success small fw-semibold">
                                Early (20 minutes)
                              </div>
                            </div>

                            <div className="text-center bg-card px-2">
                              <div className="fw-bold">QC Allocated hours</div>
                              <div>h.mm</div>
                              <button
                                className="btn btn-sm text-white fw-bold px-3 py-1 mt-1"
                                style={{ backgroundColor: "#006400" }}
                              >
                                OK
                              </button>
                            </div>

                            <div className="text-center border border-dark rounded bg-card px-3 py-2">
                              <div className="fw-semibold bg-info border-bottom small py-1">
                                QC Due
                              </div>
                              <div className="fw-semibold text-light">
                                hh:mm:tt &nbsp; DD-MM-YY{" "}
                                <span className="text-warning">(Auto)</span>
                              </div>
                              <div className="text-danger small fw-semibold">
                                Delay by 30 minutes
                              </div>
                            </div>

                            <button className="btn btn-outline-success fw-semibold px-3 py-1">
                              Priority
                            </button>

                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-secondary rounded-5 px-4"
                              >
                                Close
                              </button>
                              {hasUnsavedChanges && (
                                <button
                                  type="button"
                                  className="btn btn-primary rounded-5 px-4"
                                >
                                  Save Changes
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Project Detail Modal - Keeping this for potential future use */}
        {showDetailModal && selectedProject && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedProject.title} - Details</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Project Files</h5>
                      {selectedFiles.length > 0 && (
                        <span className="badge bg-primary">
                          {selectedFiles.length} files selected
                        </span>
                      )}
                    </div>

                    {/* Batch Edit Controls */}
                    {selectedFiles.length > 0 && (
                      <div className="card mb-4">
                        <div className="card-body">
                          <h6 className="card-title mb-3">Batch Edit</h6>
                          <div className="row g-3">
                            <div className="col-md-4 col-lg-2">
                              <label className="form-label">Application</label>
                              <select
                                className="form-select form-select-sm"
                                value={batchEditValues.platform}
                                onChange={(e) => setBatchEditValues({ ...batchEditValues, platform: e.target.value })}
                              >
                                <option value="">Select</option>
                                <option value="Web">Web</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Desktop">Desktop</option>
                              </select>
                            </div>
                            <div className="col-md-4 col-lg-2">
                              <label className="form-label">Handler</label>
                              <select
                                className="form-select form-select-sm"
                                value={batchEditValues.handler}
                                onChange={(e) => setBatchEditValues({ ...batchEditValues, handler: e.target.value })}
                              >
                                <option value="">Select</option>
                                <option value="John Doe">John Doe</option>
                                <option value="Jane Smith">Jane Smith</option>
                                <option value="Mike Johnson">Mike Johnson</option>
                              </select>
                            </div>
                            <div className="col-md-4 col-lg-2">
                              <label className="form-label">QA Reviewer</label>
                              <select
                                className="form-select form-select-sm"
                                value={batchEditValues.qaReviewer}
                                onChange={(e) => setBatchEditValues({ ...batchEditValues, qaReviewer: e.target.value })}
                              >
                                <option value="">Select</option>
                                <option value="Sarah Williams">Sarah Williams</option>
                                <option value="David Brown">David Brown</option>
                                <option value="Emily Davis">Emily Davis</option>
                              </select>
                            </div>
                            <div className="col-md-4 col-lg-2">
                              <label className="form-label">QC Due</label>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                value={batchEditValues.qcDue}
                                onChange={(e) => setBatchEditValues({ ...batchEditValues, qcDue: e.target.value })}
                              />
                            </div>
                            <div className="col-md-4 col-lg-2">
                              <label className="form-label">QC Hours</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={batchEditValues.qcAllocatedHours}
                                onChange={(e) => setBatchEditValues({ ...batchEditValues, qcAllocatedHours: e.target.value })}
                              />
                            </div>
                            <div className="col-md-4 col-lg-2">
                              <label className="form-label">Priority</label>
                              <select
                                className="form-select form-select-sm"
                                value={batchEditValues.priority}
                                onChange={(e) => setBatchEditValues({ ...batchEditValues, priority: e.target.value })}
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
                              className="btn btn-sm btn-primary"
                              onClick={applyBatchEdits}
                            >
                              Apply to Selected Files
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Files Table */}
                    {/* Fake Scrollbar */}
                    <div
                      ref={tabFakeScrollbarRef}
                      style={{
                        overflowX: "auto",
                        overflowY: "hidden",
                        height: 16,
                        position: "sticky",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                        display: "none",
                        background: "#f8f9fa",
                      }}
                    >
                      <div ref={tabFakeScrollbarInnerRef} style={{ height: 1 }} />
                    </div>

                    {/* Actual Table */}
                    <div
                      ref={tabScrollContainerRef}
                      className="table-responsive"
                      style={{ maxHeight: "500px", overflowY: "auto", overflowX: "auto" }}
                    >
                      <table className="table table-sm table-striped table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedFiles.length === selectedProject.files.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFiles([...selectedProject.files]);
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
                          {selectedProject.files.map((file) => (
                            <tr
                              key={file.id}
                              className={
                                selectedFiles.some((f) => f.id === file.id) ? "table-primary" : ""
                              }
                            >
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedFiles.some((f) => f.id === file.id)}
                                  onChange={() => toggleFileSelection(file)}
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
                                    const updatedFiles = selectedProject.files.map((f) =>
                                      f.id === file.id ? { ...f, platform: e.target.value } : f
                                    );
                                    setSelectedProject({ ...selectedProject, files: updatedFiles });
                                    setHasUnsavedChanges(true);
                                  }}
                                >
                                  <option value="Web">Web</option>
                                  <option value="Mobile">Mobile</option>
                                  <option value="Desktop">Desktop</option>
                                </select>
                              </td>
                              <td>{file.stage}</td>
                              <td>{file.assigned}</td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={file.handler || ""}
                                  onChange={(e) => {
                                    const updatedFiles = selectedProject.files.map((f) =>
                                      f.id === file.id ? { ...f, handler: e.target.value } : f
                                    );
                                    setSelectedProject({ ...selectedProject, files: updatedFiles });
                                    setHasUnsavedChanges(true);
                                  }}
                                >
                                  <option value="">Not Assigned</option>
                                  <option value="John Doe">John Doe</option>
                                  <option value="Jane Smith">Jane Smith</option>
                                  <option value="Mike Johnson">Mike Johnson</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={file.qaReviewer || ""}
                                  onChange={(e) => {
                                    const updatedFiles = selectedProject.files.map((f) =>
                                      f.id === file.id ? { ...f, qaReviewer: e.target.value } : f
                                    );
                                    setSelectedProject({ ...selectedProject, files: updatedFiles });
                                    setHasUnsavedChanges(true);
                                  }}
                                >
                                  <option value="">Not Assigned</option>
                                  <option value="Sarah Williams">Sarah Williams</option>
                                  <option value="David Brown">David Brown</option>
                                  <option value="Emily Davis">Emily Davis</option>
                                </select>
                              </td>
                              <td>{file.qaStatus}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"

                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
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
                {/* <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <div className='d-flex gap-2'>
                    <input type="date" className="form-control" />
                    <input type="time" className="form-control" />
                  </div>
                </div> */}
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <div className="row g-2">
                    <div className="col-6 col-md-4">
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={handleDateChange}
                      />
                    </div>
                    <div className="col-3 col-md-2">
                      <select className="form-select" value={hour} onChange={handleHourChange}>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-3 col-md-2">
                      <select className="form-select" value={minute} onChange={handleMinuteChange}>
                        {['00', '15', '30', '45'].map(min => (
                          <option key={min} value={min}>{min}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-3 col-md-2">
                      <select className="form-select" value={period} onChange={handlePeriodChange}>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
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

// Generate dummy data function
const generateDummyProjects = (count) => {
  const clients = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Inc', 'Stark Industries'];
  const tasks = ['Translation', 'Proofreading', 'QA Review', 'Editing', 'Formatting'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const platforms = ['Web', 'Mobile', 'Desktop'];
  const stages = ['In Progress', 'Review', 'Completed', 'On Hold'];
  const qaStatuses = ['Pending', 'In Progress', 'Approved', 'Rejected'];
  const handlers = ['John Doe', 'Jane Smith', 'Mike Johnson', ''];
  const qaReviewers = ['Sarah Williams', 'David Brown', 'Emily Davis', ''];

  const projects = [];

  for (let i = 1; i <= count; i++) {
    const totalPages = Math.floor(Math.random() * 100) + 10;
    const progress = Math.floor(Math.random() * 101);
    const handler = handlers[Math.floor(Math.random() * handlers.length)];

    // Generate random due date (between now and 30 days in the future)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    dueDate.setHours(hours, minutes);

    // Format due date as "hh:mm tt DD-MM-YY"
    const formattedDueDate = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'} ${dueDate.getDate().toString().padStart(2, '0')}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getFullYear().toString().slice(2)}`;

    // Generate files
    const fileCount = Math.floor(Math.random() * 5) + 1;
    const files = [];

    for (let j = 1; j <= fileCount; j++) {
      const filePages = Math.floor(Math.random() * 20) + 1;
      files.push({
        id: j,
        name: `File_${i}_${j}.docx`,
        pages: filePages,
        language: languages[Math.floor(Math.random() * languages.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        stage: stages[Math.floor(Math.random() * stages.length)],
        assigned: new Date(dueDate.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
        handler: handler,
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
      });
    }

    projects.push({
      id: i,
      title: `Project ${i}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      task: tasks[Math.floor(Math.random() * tasks.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      totalPages,
      dueDate: formattedDueDate,
      progress,
      handler,
      files
    });
  }

  return projects;
};


// The exported code now uses Bootstrap instead of Tailwind CSS
// import React, { useState } from 'react';



// const TaskManagemnet = () => {
//   const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
//   const [date, setDate] = useState('');
//   const [hour, setHour] = useState('01');
//   const [minute, setMinute] = useState('00');
//   const [period, setPeriod] = useState('AM');

//   const handleDateChange = (e) => {
//     setDate(e.target.value);
//   };

//   const handleHourChange = (e) => {
//     setHour(e.target.value);
//   };

//   const handleMinuteChange = (e) => {
//     setMinute(e.target.value);
//   };

//   const handlePeriodChange = (e) => {
//     setPeriod(e.target.value);
//   };

//   // Mock data for active projects
//   const [projects, setProjects] = useState([
//     {
//       id: 1,
//       title: "Website Redesign",
//       status: "In Progress",
//       handlers: 3,
//       qaReviewers: 2,
//       fileCount: 24,
//       progress: 65,
//       handlerNote: "Working on homepage layout. Need feedback on color scheme.",
//       qaNote: "Initial review completed for navigation. Found some responsive issues.",
//       timeline: [
//         { stage: "Task Assigned", timestamp: "2025-06-20 09:30 AM" },
//         { stage: "In Progress", timestamp: "2025-06-21 11:15 AM" },
//         { stage: "QA Started", timestamp: "2025-06-23 02:45 PM" }
//       ],
//       timeSpent: [
//         { role: "Handler", name: "Alex Johnson", hours: 12.5 },
//         { role: "Handler", name: "Maria Garcia", hours: 8.0 },
//         { role: "Handler", name: "David Kim", hours: 6.5 },
//         { role: "QA", name: "Sarah Williams", hours: 4.0 },
//         { role: "QA", name: "James Brown", hours: 3.5 }
//       ]
//     },
//     {
//       id: 2,
//       title: "Mobile App Development",
//       status: "QA Review",
//       handlers: 2,
//       qaReviewers: 3,
//       fileCount: 38,
//       progress: 80,
//       handlerNote: "Core functionality complete. Working on final UI polish.",
//       qaNote: "Testing user authentication flows. Some edge cases need fixing.",
//       timeline: [
//         { stage: "Task Assigned", timestamp: "2025-06-15 10:00 AM" },
//         { stage: "In Progress", timestamp: "2025-06-16 09:30 AM" },
//         { stage: "QA Started", timestamp: "2025-06-22 01:15 PM" }
//       ],
//       timeSpent: [
//         { role: "Handler", name: "Emily Chen", hours: 18.5 },
//         { role: "Handler", name: "Michael Rodriguez", hours: 16.0 },
//         { role: "QA", name: "Lisa Taylor", hours: 7.5 },
//         { role: "QA", name: "Robert Wilson", hours: 6.0 },
//         { role: "QA", name: "Jennifer Lee", hours: 5.5 }
//       ]
//     },
//     {
//       id: 3,
//       title: "E-commerce Integration",
//       status: "Ready for QA",
//       handlers: 4,
//       qaReviewers: 1,
//       fileCount: 42,
//       progress: 75,
//       handlerNote: "Payment gateway integration complete. Documentation in progress.",
//       qaNote: "Preparing test cases for checkout flow.",
//       timeline: [
//         { stage: "Task Assigned", timestamp: "2025-06-18 08:45 AM" },
//         { stage: "In Progress", timestamp: "2025-06-19 10:30 AM" },
//         { stage: "Ready for QA", timestamp: "2025-06-24 09:15 AM" }
//       ],
//       timeSpent: [
//         { role: "Handler", name: "Thomas Martin", hours: 14.0 },
//         { role: "Handler", name: "Sophia Anderson", hours: 12.5 },
//         { role: "Handler", name: "Daniel Clark", hours: 10.0 },
//         { role: "Handler", name: "Olivia Wright", hours: 9.5 },
//         { role: "QA", name: "William Scott", hours: 2.0 }
//       ]
//     },
//     {
//       id: 4,
//       title: "CRM System Update",
//       status: "In Progress",
//       handlers: 2,
//       qaReviewers: 2,
//       fileCount: 31,
//       progress: 45,
//       handlerNote: "Database migration in progress. Estimated completion by tomorrow.",
//       qaNote: "Preparing test environment for initial review.",
//       timeline: [
//         { stage: "Task Assigned", timestamp: "2025-06-22 11:00 AM" },
//         { stage: "In Progress", timestamp: "2025-06-23 09:45 AM" }
//       ],
//       timeSpent: [
//         { role: "Handler", name: "Ryan Johnson", hours: 8.0 },
//         { role: "Handler", name: "Emma Davis", hours: 7.5 },
//         { role: "QA", name: "Christopher Lee", hours: 1.5 },
//         { role: "QA", name: "Ava Martinez", hours: 1.0 }
//       ]
//     },
//     {
//       id: 5,
//       title: "Analytics Dashboard",
//       status: "In Progress",
//       handlers: 1,
//       qaReviewers: 1,
//       fileCount: 18,
//       progress: 30,
//       handlerNote: "Working on data visualization components. Need access to API.",
//       qaNote: "Reviewing requirements documentation.",
//       timeline: [
//         { stage: "Task Assigned", timestamp: "2025-06-23 02:30 PM" },
//         { stage: "In Progress", timestamp: "2025-06-24 08:30 AM" }
//       ],
//       timeSpent: [
//         { role: "Handler", name: "Noah Thompson", hours: 5.5 },
//         { role: "QA", name: "Isabella White", hours: 2.0 }
//       ]
//     },
//     {
//       id: 6,
//       title: "Content Management System",
//       status: "QA Review",
//       handlers: 3,
//       qaReviewers: 2,
//       fileCount: 27,
//       progress: 85,
//       handlerNote: "All features implemented. Addressing feedback from initial review.",
//       qaNote: "Testing user roles and permissions. Found some security concerns.",
//       timeline: [
//         { stage: "Task Assigned", timestamp: "2025-06-17 09:00 AM" },
//         { stage: "In Progress", timestamp: "2025-06-18 10:15 AM" },
//         { stage: "QA Started", timestamp: "2025-06-21 03:30 PM" }
//       ],
//       timeSpent: [
//         { role: "Handler", name: "Liam Wilson", hours: 15.0 },
//         { role: "Handler", name: "Charlotte Brown", hours: 13.5 },
//         { role: "Handler", name: "Ethan Davis", hours: 12.0 },
//         { role: "QA", name: "Amelia Garcia", hours: 8.5 },
//         { role: "QA", name: "Benjamin Martinez", hours: 7.0 }
//       ]
//     }
//   ]);

//   // State for search and filter
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [isTimeLogOpen, setIsTimeLogOpen] = useState(false);
//   const [isManager, setIsManager] = useState(true); // Toggle for manager view
//   const [activeTab, setActiveTab] = useState("team"); // "team" or "my"

//   // Filter projects based on search term and status filter
//   const filteredProjects = projects.filter(project => {
//     const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === "All" || project.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // Mock data for "My Tasks" (for manager view)
//   const myTasks = [
//     {
//       id: 7,
//       title: "Marketing Strategy",
//       status: "In Progress",
//       handlers: 1,
//       qaReviewers: 1,
//       fileCount: 12,
//       progress: 40,
//       handlerNote: "Developing Q3 marketing plan. Need budget approval.",
//       qaNote: "Awaiting initial draft for review.",
//       timeline: [
//         { stage: "Task Assigned", timestamp: "2025-06-21 01:00 PM" },
//         { stage: "In Progress", timestamp: "2025-06-22 09:30 AM" }
//       ],
//       timeSpent: [
//         { role: "Handler", name: "You", hours: 6.5 },
//         { role: "QA", name: "Sophia Miller", hours: 1.0 }
//       ]
//     },
//     {
//       id: 8,
//       title: "Quarterly Report",
//       status: "Ready for QA",
//       handlers: 1,
//       qaReviewers: 2,
//       fileCount: 8,
//       progress: 70,
//       handlerNote: "Financial section complete. Working on executive summary.",
//       qaNote: "Preparing to review financial data accuracy.",
//       timeline: [
//         { stage: "Task Assigned", timestamp: "2025-06-19 11:30 AM" },
//         { stage: "In Progress", timestamp: "2025-06-20 09:15 AM" },
//         { stage: "Ready for QA", timestamp: "2025-06-24 10:45 AM" }
//       ],
//       timeSpent: [
//         { role: "Handler", name: "You", hours: 9.0 },
//         { role: "QA", name: "Jacob Anderson", hours: 0.5 },
//         { role: "QA", name: "Mia Thompson", hours: 0.5 }
//       ]
//     }
//   ];

//   // Function to open time log modal
//   const openTimeLog = (projectId) => {
//     setSelectedProject(projectId);
//     setIsTimeLogOpen(true);
//   };

//   // Function to close time log modal
//   const closeTimeLog = () => {
//     setSelectedProject(null);
//     setIsTimeLogOpen(false);
//   };

//   // Get project by ID
//   const getProjectById = (id) => {
//     return projects.find(project => project.id === id) ||
//       myTasks.find(task => task.id === id);
//   };

//   // Status badge color mapping
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "In Progress":
//         return "bg-primary";
//       case "QA Review":
//         return "bg-info";
//       case "Ready for QA":
//         return "bg-warning";
//       case "Completed":
//         return "bg-success";
//       default:
//         return "bg-secondary";
//     }
//   };


//   return (
//     <div className="min-vh-100 bg-main">
//       {/* Header/Navigation */}

//       {/* Main Content */}
//       <div className="container py-4">
//         <div className='d-flex justify-content-between'>
//           <div className="mb-4">
//             <h2 className="gradient-heading">Task Management</h2>
//             <p className="text-light">Active Projects Only</p>
//           </div>
//           <div className='d-flex gap-2'>
//             <div className='text-align-center gradient-heading align-item-center'>
//               <h3>Filters</h3>
//             </div>
//             <div>
//               <button
//                 className="btn gradient-button"
//               >
//                 All
//               </button>
//             </div>
//             <div>
//               <button
//                 className="btn gradient-button"
//               >
//                 Ms Office
//               </button>
//             </div>
//             <div>
//               <button
//                 className="btn gradient-button"
//               >
//                 Adobe
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <div className="card mb-4 bg-card ">
//           <div className="card-body">
//             <div className="row align-items-center">
//               <div className="col-md-8 mb-3 mb-md-0">
//                 <div className="row g-3 align-items-center">
//                   <div className="col-md-5">
//                     <div className="input-group">
//                       <span className="input-group-text"><i className="fas fa-search"></i></span>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Search projects..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <select
//                       className="form-select"
//                       value={statusFilter}
//                       onChange={(e) => setStatusFilter(e.target.value)}
//                     >
//                       <option value="All">All Statuses</option>
//                       <option value="In Progress">In Progress</option>
//                       <option value="Ready for QA">Ready for QA</option>
//                       <option value="QA Review">QA Review</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-4 text-md-end">
//                 <span className="text-light small me-3">Today: 2025-06-24, Tuesday</span>
//                 {/* <button
//                   className="btn gradient-button"
//                   onClick={() => setIsNewTaskModalOpen(true)}
//                 >
//                   <i className="fas fa-plus me-2"></i>New Task
//                 </button> */}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Manager View Tabs (only shown for managers) */}
//         {isManager && (
//           <div className="mb-4 ">
//             <ul className="nav nav-tabs">
//               <li className="nav-item">
//                 <button
//                   onClick={() => setActiveTab("team")}
//                   className={`nav-link ${activeTab === "team" ? "active" : ""}`}
//                 >
//                   <i className="fas fa-users me-2"></i>Team Tasks
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button
//                   onClick={() => setActiveTab("my")}
//                   className={`nav-link ${activeTab === "my" ? "active" : ""}`}
//                 >
//                   <i className="fas fa-tasks me-2"></i>My Tasks
//                 </button>
//               </li>
//             </ul>
//           </div>
//         )}

//         {/* Projects Grid */}
//         {(activeTab === "team" || !isManager) && (
//           <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//             {filteredProjects.map((project) => (
//               <div key={project.id} className="col">
//                 <div className="card h-100 bg-card">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-start mb-3">
//                       <h5 className="card-title mb-0 text-truncate" style={{ maxWidth: '200px' }}>{project.title}</h5>
//                       <span className={`badge ${getStatusColor(project.status)}`}>
//                         {project.status}
//                       </span>
//                     </div>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <div className="d-flex">
//                         <div className="me-4">
//                           <div className="text-light small mb-1">Handlers</div>
//                           <div className="d-flex align-items-center">
//                             <span className="badge bg-primary bg-opacity-10 text-primary">
//                               {project.handlers}
//                             </span>
//                             <button className="btn btn-link btn-sm text-light ms-2 p-0">
//                               <i className="fas fa-user-plus small"></i>
//                             </button>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-white small mb-1">QA Reviewers</div>
//                           <div className="d-flex align-items-center">
//                             <span className="badge bg-info bg-opacity-10 text-info">
//                               {project.qaReviewers}
//                             </span>
//                             <button className="btn btn-link btn-sm text-light ms-2 p-0">
//                               <i className="fas fa-user-plus small"></i>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-light small mb-1">Files</div>
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary">
//                           {project.fileCount}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="mb-3">
//                       <div className="d-flex justify-content-between mb-1">
//                         <span className="small fw-medium">Progress</span>
//                         <span className="small fw-medium">{project.progress}%</span>
//                       </div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar bg-primary"
//                           style={{ width: `${project.progress}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                     <div className="mb-3">
//                       <div className="mb-2">
//                         <div className="d-flex justify-content-between align-items-center">
//                           <span className="small fw-medium">Handler Notes</span>
//                           <button className="btn btn-link btn-sm text-light p-0">
//                             <i className="fas fa-edit small"></i>
//                           </button>
//                         </div>
//                         <p className="small text-dark bg-card p-2 rounded mt-1">{project.handlerNote}</p>
//                       </div>
//                       <div>
//                         <div className="d-flex justify-content-between align-items-center">
//                           <span className="small fw-medium">QA Notes</span>
//                           <button className="btn btn-link btn-sm text-light p-0">
//                             <i className="fas fa-edit small"></i>
//                           </button>
//                         </div>
//                         <p className="small text-dark bg-card p-2 rounded mt-1">{project.qaNote}</p>
//                       </div>
//                     </div>
//                     <div className="d-flex justify-content-between align-items-center">
//                       <button
//                         onClick={() => openTimeLog(project.id)}
//                         className="btn btn-link text-primary p-0 small"
//                       >
//                         <i className="fas fa-clock me-1"></i> View Time Log
//                       </button>
//                       <div className="d-flex">
//                         <button className="btn btn-link text-light p-0 me-2">
//                           <i className="fas fa-exchange-alt"></i>
//                         </button>
//                         <button className="btn btn-link text-light p-0">
//                           <i className="fas fa-ellipsis-v"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* My Tasks Grid (only for manager view) */}
//         {isManager && activeTab === "my" && (
//           <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 ">
//             {myTasks.map((task) => (
//               <div key={task.id} className="col ">
//                 <div className="card h-100 bg-card">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-start mb-3">
//                       <h5 className="card-title mb-0 text-truncate" style={{ maxWidth: '200px' }}>{task.title}</h5>
//                       <span className={`badge ${getStatusColor(task.status)}`}>
//                         {task.status}
//                       </span>
//                     </div>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <div className="d-flex">
//                         <div className="me-4">
//                           <div className="text-light small mb-1">Handlers</div>
//                           <div className="d-flex align-items-center">
//                             <span className="badge bg-primary bg-opacity-10 text-primary">
//                               {task.handlers}
//                             </span>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-light small mb-1">QA Reviewers</div>
//                           <div className="d-flex align-items-center">
//                             <span className="badge bg-info bg-opacity-10 text-info">
//                               {task.qaReviewers}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-light small mb-1">Files</div>
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary">
//                           {task.fileCount}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="mb-3">
//                       <div className="d-flex justify-content-between mb-1">
//                         <span className="small fw-medium">Progress</span>
//                         <span className="small fw-medium">{task.progress}%</span>
//                       </div>
//                       <div className="progress">
//                         <div
//                           className="progress-bar bg-primary"
//                           style={{ width: `${task.progress}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                     <div className="mb-3">
//                       <div className="mb-2">
//                         <div className="d-flex justify-content-between align-items-center">
//                           <span className="small fw-medium">Handler Notes</span>
//                           <button className="btn btn-link btn-sm text-light p-0">
//                             <i className="fas fa-edit small"></i>
//                           </button>
//                         </div>
//                         <p className="small text-dark
//                          bg-card p-2 rounded mt-1">{task.handlerNote}</p>
//                       </div>
//                       <div>
//                         <div className="d-flex justify-content-between align-items-center">
//                           <span className="small fw-medium">QA Notes</span>
//                           <button className="btn btn-link btn-sm text-light p-0">
//                             <i className="fas fa-edit small"></i>
//                           </button>
//                         </div>
//                         <p className="small text-light bg-card p-2 rounded mt-1">{task.qaNote}</p>
//                       </div>
//                     </div>
//                     <div className="d-flex justify-content-between align-items-center">
//                       <button
//                         onClick={() => openTimeLog(task.id)}
//                         className="btn btn-link text-primary p-0 small"
//                       >
//                         <i className="fas fa-clock me-1"></i> View Time Log
//                       </button>
//                       <div className="d-flex">
//                         <button className="btn btn-link text-light p-0 me-2">
//                           <i className="fas fa-exchange-alt"></i>
//                         </button>
//                         <button className="btn btn-link text-light p-0">
//                           <i className="fas fa-ellipsis-v"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Time Log Modal */}
//         {isTimeLogOpen && selectedProject && (
//           <div className="modal fade show d-block custom-modal-dark" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//             <div className="modal-dialog modal-lg">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title fw-bold">
//                     Time Log: {getProjectById(selectedProject)?.title}
//                   </h5>
//                   <button
//                     onClick={closeTimeLog}
//                     className="btn-close"
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="mb-4">
//                     <h6 className="fw-medium mb-3">Project Timeline</h6>
//                     <div className="position-relative ps-3">
//                       <div className="position-absolute h-100 border-start" style={{ left: '10px', top: 0 }}></div>
//                       {getProjectById(selectedProject)?.timeline.map((item, index) => (
//                         <div key={index} className="mb-3 d-flex">
//                           <div className="position-relative">
//                             <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
//                               <i className="fas fa-check text-white small"></i>
//                             </div>
//                           </div>
//                           <div className="ms-3">
//                             <div className="small fw-medium">{item.stage}</div>
//                             <div className="text-light small">{item.timestamp}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <h6 className="fw-medium mb-3 ">Resource Time Allocation</h6>
//                     <div className="custom-modal-dark rounded p-3">
//                       <div className="row g-3 mb-2 small fw-medium text-light ">
//                         <div className="col-md-4">Role</div>
//                         <div className="col-md-4">Team Member</div>
//                         <div className="col-md-4">Hours Spent</div>
//                       </div>
//                       {getProjectById(selectedProject)?.timeSpent.map((resource, index) => (
//                         <div key={index} className="row g-3 py-2 border-top mt-0 small">
//                           <div className="col-md-4">{resource.role}</div>
//                           <div className="col-md-4 fw-medium">{resource.name}</div>
//                           <div className="col-md-4">{resource.hours} hrs</div>
//                         </div>
//                       ))}
//                       <div className="row g-3 py-2 border-top fw-medium mt-2 small">
//                         <div className="col-md-8">Total Hours</div>
//                         <div className="col-md-4 text-primary">
//                           {getProjectById(selectedProject)?.timeSpent.reduce((total, resource) => total + resource.hours, 0)} hrs
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     onClick={closeTimeLog}
//                     className="btn btn-primary"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* New Task Modal */}
//       {isNewTaskModalOpen && (
//         <div className="modal fade show d-block custom-modal-dark" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog ">
//             <div className="modal-content ">
//               <div className="modal-header  ">
//                 <h5 className="modal-title">Create New Task</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setIsNewTaskModalOpen(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 {/* यहां Form Fields आएंगे */}
//                 <div className="mb-3">
//                   <label className="form-label">Task Title</label>
//                   <input type="text" className="form-control" />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Description</label>
//                   <textarea className="form-control" rows={3}></textarea>
//                 </div>
//                 {/* <div className="mb-3">
//                   <label className="form-label">Deadline</label>
//                   <div className='d-flex gap-2'>
//                     <input type="date" className="form-control" />
//                     <input type="time" className="form-control" />
//                   </div>
//                 </div> */}
//                 <div className="mb-3">
//                   <label className="form-label">Deadline</label>
//                   <div className="row g-2">
//                     <div className="col-6 col-md-4">
//                       <input
//                         type="date"
//                         className="form-control"
//                         value={date}
//                         onChange={handleDateChange}
//                       />
//                     </div>
//                     <div className="col-3 col-md-2">
//                       <select className="form-select" value={hour} onChange={handleHourChange}>
//                         {Array.from({ length: 12 }, (_, i) => (
//                           <option key={i} value={String(i + 1).padStart(2, '0')}>
//                             {String(i + 1).padStart(2, '0')}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="col-3 col-md-2">
//                       <select className="form-select" value={minute} onChange={handleMinuteChange}>
//                         {['00', '15', '30', '45'].map(min => (
//                           <option key={min} value={min}>{min}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="col-3 col-md-2">
//                       <select className="form-select" value={period} onChange={handlePeriodChange}>
//                         <option value="AM">AM</option>
//                         <option value="PM">PM</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Assign To</label>
//                   <select className="form-select">
//                     <option>Select Team Member</option>
//                     <option>Alex Johnson</option>
//                     <option>Maria Garcia</option>
//                   </select>
//                 </div>
//                 {/* और Fields... */}
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary rounded-5"
//                   onClick={() => setIsNewTaskModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="btn gradient-button"
//                 >
//                   Save Task
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskManagemnet;