import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import useSyncScroll from "../Hooks/useSyncScroll";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import CreateNewProject from "../Project/CreateNewProject";
import EditModal from "./EditModal";
import BASE_URL from "../../../config";

const ActiveProject = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const userRole = localStorage.getItem("userRole");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const isAdmin = userRole === "Admin";
  const token =localStorage.getItem("authToken"); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fileHandlers, setFileHandlers] = useState({});

  const assignees = [
    { label: "Not Assigned", value: "" },
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
    { label: "Mike Johnson", value: "Mike Johnson" },
  ];

  const handleHandlerChange = (fileId, newHandler) => {
    const updatedHandlers = { ...fileHandlers };
    selectedFiles.forEach((f) => {
      updatedHandlers[f.id] = newHandler;
    });
    setFileHandlers(updatedHandlers);
    setHasUnsavedChanges(true);
  };

  const initialFormData = {
    title: "",
    client: "",
    country: "",
    projectManager: "",
    tasks: [],
    languages: [],
    application: [],
    files: [
      [
        { name: "File_1", pageCount: 3, application: "", selected: false },
        { name: "File_2", pageCount: 5, application: "", selected: false },
        { name: "File_3", pageCount: 4, application: "", selected: false },
        { name: "File_4", pageCount: 2, application: "", selected: false },
        { name: "File_5", pageCount: 6, application: "", selected: false },
        { name: "File_6", pageCount: 7, application: "", selected: false },
        { name: "File_7", pageCount: 8, application: "", selected: false },
      ],
    ],
    totalPages: 0,
    deadline: "",
    readyDeadline: "",
    qcHrs: "",
    receivedDate: new Date().toISOString().split("T")[0],
    serverPath: "",
    notes: "",
    rate: 0,
    currency: "USD",
    cost: 0,
    inrCost: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [qcAllocatedHours, setQcAllocatedHours] = useState(0.0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [activeButton, setActiveButton] = useState("");
  const [readyForQcDueInput, setReadyForQcDueInput] = useState("");
  const [priorityAll, setPriorityAll] = useState("Mid");
  const [batchEditValues, setBatchEditValues] = useState({
    application: "",
    handler: "",
    qaReviewer: "",
    qcDue: "",
    qcAllocatedHours: "",
    priority: "",
  });

  const [qcDueDelay, setQcDueDelay] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Store project files data
  const [projectFiles, setProjectFiles] = useState({});

  const statuses = [
    { key: "allstatus", label: "All Status" },
    { key: "yts", label: "YTS" },
    { key: "wip", label: "WIP" },
    { key: "readyforqc", label: "Ready for QC" },
    { key: "qareview", label: "QA Review" },
    { key: "corryts", label: "Corr YTS" },
    { key: "corrwip", label: "Corr WIP" },
    { key: "rfd", label: "RFD" },
  ];

  const applicationsOptions = [
    { value: "Adobe", label: "Adobe" },
    { value: "MSOffice", label: "MS Office" },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}project/getAllProjects`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects);
        setFilteredProjects(data.projects);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let result = [...projects];

    // Apply tab filter
    if (activeTab === "unhandled") {
      result = result.filter(
        (project) => !project.handler || project.handler === ""
      );
    }

    // Apply button filters
    if (activeButton === "nearDue") {
      const now = new Date();
      const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      result = result.filter((project) => {
        const dueDate = new Date(project.deadline);
        return dueDate > now && dueDate <= thirtyMinsFromNow;
      });
    } else if (activeButton === "overdue") {
      const now = new Date();
      result = result.filter((project) => {
        const dueDate = new Date(project.deadline);
        return dueDate < now && project.status !== "Completed";
      });
    } else if (activeButton === "Adobe") {
      const adobeApps = ["INDD", "AI", "PSD", "AE", "CDR", "FM", "Adobe"];
      result = result.filter((project) =>
        adobeApps.includes(project.application_name)
      );
    } else if (activeButton === "MSOffice") {
      const msOfficeApps = [
        "Word",
        "PPT",
        "Excel",
        "Visio",
        "Project",
        "Canva",
        "MS Office",
      ];
      result = result.filter((project) =>
        msOfficeApps.includes(project.application_name)
      );
    }

    // Apply dropdown filters
    if (clientFilter) {
      result = result.filter((project) => 
        project.clientId && project.clientId.toString() === clientFilter
      );
    }
    if (taskFilter) {
      result = result.filter((project) => 
        project.task_name && project.task_name.toLowerCase().includes(taskFilter.toLowerCase())
      );
    }
    if (languageFilter && languageFilter !== "allstatus") {
      result = result.filter((project) => 
        project.status && project.status.toLowerCase() === languageFilter.toLowerCase()
      );
    }
    if (selectedApplications.length > 0) {
      const selectedAppValues = selectedApplications.map(app => app.value);
      result = result.filter((project) =>
        selectedAppValues.includes(project.application_name)
      );
    }

    // Sort by deadline
    result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    setFilteredProjects(result);
  }, [projects, activeTab, activeButton, clientFilter, taskFilter, languageFilter, selectedApplications]);

  const handleDeleteProject = (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    if (window.confirm("Are you sure you want to delete this project?")) {
      // Case 1: If any file status is "YTS"
      const ytsStatuses = ["YTS"];
      const amendmentStatuses = [
        "V1 YTS",
        "V2 YTS",
        "Amendment",
        "Amendment YTS",
      ];
      let moveTo = "created";
      let updatedFiles = project.files.map((file) => {
        if (ytsStatuses.includes(file.qaStatus)) {
          return { ...file, qaStatus: "" };
        }
        return file;
      });

      // If any file has amendment status, move to completed
      if (
        project.files.some((file) => amendmentStatuses.includes(file.qaStatus))
      ) {
        moveTo = "completed";
        // Retain status
      }

      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleMarkComplete = (id) => {
    if (
      window.confirm("Are you sure you want to mark this project as complete?")
    ) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSelectedFiles(project.files ? project.files.map(f => ({ id: f.id })) : []);
    setShowDetailModal(false);
    setHasUnsavedChanges(false);
    setBatchEditValues({
      application: "",
      handler: "",
      qaReviewer: "",
      qcDue: "",
      qcAllocatedHours: "",
      priority: "",
    });
    
    // Reset form values when opening a new project
    setReadyForQcDueInput("");
    setQcAllocatedHours(0.0);
    setPriorityAll("Mid");
    setQcDueDelay("");
    
    setExpandedRow(expandedRow === project.id ? null : project.id);
  };

  const toggleFileSelection = (file) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
    setHasUnsavedChanges(true);
  };

  const getUniqueValues = (key) => {
    const uniqueValues = new Set();
    projects.forEach((project) => {
      if (project[key]) {
        uniqueValues.add(project[key]);
      }
    });
    return Array.from(uniqueValues);
  };

  const handleEditProject = (project) => {
    setEditedProject({ ...project });
    setShowEditModal(true);
  };

  const handleSaveProjectEdit = () => {
    if (editedProject) {
      setProjects(
        projects.map((p) => (p.id === editedProject.id ? editedProject : p))
      );
      setShowEditModal(false);
      setEditedProject(null);
    }
  };

  // New function to update project files via API
  const handleUpdateProjectFiles = async () => {
    if (!selectedProject || !selectedProject.id) {
      alert("No project selected");
      return;
    }

    // Validate required fields
    if (!readyForQcDueInput) {
      alert("Please select Ready for QC Due date and time");
      return;
    }

    if (!qcAllocatedHours || qcAllocatedHours <= 0) {
      alert("Please enter valid QC Allocated Hours");
      return;
    }

    setIsUpdating(true);

    try {
      // Calculate QC Due Date
      const qcDueCalculated = calculateQCDue(readyForQcDueInput, qcAllocatedHours);
      
      // Prepare the data to send to API
      const updateData = {
        readyForQcDue: readyForQcDueInput,
        qcAllocatedHours: parseFloat(qcAllocatedHours),
        qcDue: qcDueCalculated,
        priority: priorityAll,
        // You can add more fields here as needed
        handler: fileHandlers[selectedProject.id] || "",
      };

      // Make API call
      const response = await axios.patch(
        `https://eminoids-backend-production.up.railway.app/api/projectFiles/updateProjectFile/${selectedProject.id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        // Update the project in local state
        const updatedProjects = projects.map(project => {
          if (project.id === selectedProject.id) {
            return {
              ...project,
              readyQCDeadline: readyForQcDueInput,
              qcHrs: qcAllocatedHours,
              qcDueDate: qcDueCalculated,
              priority: priorityAll,
              handler: fileHandlers[selectedProject.id] || project.handler,
            };
          }
          return project;
        });

        setProjects(updatedProjects);
        setSelectedProject({
          ...selectedProject,
          readyQCDeadline: readyForQcDueInput,
          qcHrs: qcAllocatedHours,
          qcDueDate: qcDueCalculated,
          priority: priorityAll,
        });

        setHasUnsavedChanges(false);
        alert("Project files updated successfully!");
        
        // Optionally close the expanded view
        // setExpandedRow(null);
        
      } else {
        throw new Error('Failed to update project files');
      }

    } catch (error) {
      console.error('Error updating project files:', error);
      alert(`Failed to update project files: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseProjectView = () => {
    setExpandedRow(null);
    setSelectedProject(null);
    setSelectedFiles([]);
    setHasUnsavedChanges(false);
    setReadyForQcDueInput("");
    setQcAllocatedHours(0.0);
    setPriorityAll("Mid");
    setQcDueDelay("");
    setFileHandlers({});
  };

  useEffect(() => {
    if (!readyForQcDueInput) {
      setQcDueDelay("");
      return;
    }

    const updateDelay = () => {
      const delayText = calculateTimeDiff(readyForQcDueInput);
      setQcDueDelay(delayText);
    };

    updateDelay();
    const interval = setInterval(updateDelay, 60000);
    return () => clearInterval(interval);
  }, [readyForQcDueInput]);

  function calculateTimeDiff(targetDateStr) {
    const now = new Date();
    const target = new Date(targetDateStr);
    const diffMs = now - target;
    const diffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    const isPast = diffMs > 0;
    if (diffMinutes < 1) return isPast ? "Just now" : "In a few seconds";
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    let timeStr = "";
    if (hours > 0) timeStr += `${hours}h `;
    timeStr += `${minutes}m`;
    return isPast ? `Delayed by ${timeStr}` : `Due in ${timeStr}`;
  }

  const handleCreateNewProject = () => {
    setFormData(initialFormData);
    setShowCreateModal(true);
  };

  const handleApplyToSelectedFiles = () => {
    const selected = formData.files.filter((f) => f.selected);
    if (selected.length === 0) {
      alert("No files selected.");
      return;
    }
    alert(`Deadline ${formData.deadline} applied to selected files.`);
  };

  const {
    scrollContainerRef: scrollContainerRef1,
    fakeScrollbarRef: fakeScrollbarRef1,
  } = useSyncScroll(null);

  function calculateQCDue(startDate, hours) {
    if (!startDate || !hours) return "--";
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + parseFloat(hours));
    return endDate.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const handleCardFilter = (type) => {
    setActiveButton(type);
    // The actual filtering is handled in the useEffect above
  };

  const getClientOptions = () => {
    const uniqueClients = new Set();
    projects.forEach(project => {
      if (project.clientId) {
        uniqueClients.add(project.clientId.toString());
      }
    });
    return Array.from(uniqueClients).map(client => ({
      value: client,
      label: client
    }));
  };

  const getTaskOptions = () => {
    const uniqueTasks = new Set();
    projects.forEach(project => {
      if (project.task_name) {
        uniqueTasks.add(project.task_name);
      }
    });
    return Array.from(uniqueTasks).map(task => ({
      value: task,
      label: task
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid py-4">
      {/* Edit Project Modal */}
      {showEditModal && editedProject && (
        <div
          className="modal fade show custom-modal-dark"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <EditModal project={editedProject} setProject={setEditedProject} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveProjectEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          className="modal fade show d-block custom-modal-dark"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <div>
                  <h5 className="modal-title">Create New Project</h5>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <CreateNewProject 
                  onClose={() => setShowCreateModal(false)}
                  onProjectCreated={(newProject) => {
                    setProjects([...projects, newProject]);
                    setShowCreateModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with action buttons */}
      <div className="row mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <h2 className="gradient-heading">Active Projects</h2>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <Button
              className="gradient-button"
              onClick={handleCreateNewProject}
            >
              <i className="fas fa-plus me-2"></i> Create New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4 gy-3">
        {/* Buttons Section */}
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-wrap gap-2 justify-content-start">
            {["all", "nearDue", "overdue", "Adobe", "MSOffice"].map((btn) => (
              <button
                key={btn}
                className={`gradient-button ${
                  activeButton === btn ? "active-filter" : ""
                }`}
                onClick={() => handleCardFilter(btn)}
              >
                {btn === "all"
                  ? "All"
                  : btn === "nearDue"
                  ? "Near Due"
                  : btn === "overdue"
                  ? "Over Due"
                  : btn === "Adobe"
                  ? "Adobe"
                  : "MS Office"}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Dropdowns Section */}
        <div className="col-12 col-lg-6">
          <div className="row g-2">
            {/* Client Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
              >
                <option value="">All Clients</option>
                {getClientOptions().map((client, index) => (
                  <option key={index} value={client.value}>
                    {client.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
              >
                <option value="">All Tasks</option>
                {getTaskOptions().map((task, index) => (
                  <option key={index} value={task.value}>
                    {task.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status/Language Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                {statuses.map((status, index) => (
                  <option key={index} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Application (Select component) */}
            <div className="col-12 col-sm-6 col-md-3">
              <Select
                options={applicationsOptions}
                isMulti={false}
                classNamePrefix="select"
                value={selectedApplications}
                placeholder="Select App"
                onChange={(selected) => setSelectedApplications(selected)}
              />
            </div>
          </div>
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

      <div className="card">
        <div
          ref={fakeScrollbarRef1}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            height: 16,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1050,
          }}
        >
          <div style={{ width: "2000px", height: 1 }} />
        </div>
        
        {/* Projects Table */}
        <div className="table-gradient-bg">
          <div
            className="table-responsive"
            ref={scrollContainerRef1}
            style={{
              maxHeight: "500px",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <table
              className="table-gradient-bg align-middle mt-0 table table-bordered table-hover"
              style={{ minWidth: 1000 }}
            >
              <thead
                className="table-gradient-bg table"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 0,
                  backgroundColor: "#fff",
                }}
              >
                <tr className="text-center">
                  <th>S. No.</th>
                  <th>Project Title</th>
                  <th>Client</th>
                  <th>Task</th>
                  <th>Language</th>
                  <th>Application</th>
                  <th>Total Pages</th>
                  <th>Deadline</th>
                  <th>Ready For Qc Deadline</th>
                  <th>Qc Hrs</th>
                  <th>Qc Due Date</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <React.Fragment key={project.id}>
                      <tr
                        className={
                          expandedRow === project.id
                            ? "table-active text-center"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{project.projectTitle}</td>
                        <td>{project.clientId}</td>
                        <td>{project.task_name}</td>
                        <td>{project.language_name}</td>
                        <td>{project.application_name}</td>
                        <td>{project.totalPagesLang}</td>
                        <td>{project.deadline}</td>
                        <td>{project.readyQCDeadline}</td>
                        <td>{project.qcHrs}</td>
                        <td>{project.qcDueDate}</td>
                        <td>{project.status}</td>
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
                          <td colSpan={14} className="p-0 border-top-0">
                            <div className="p-4">
                              {/* Unsaved Changes Warning */}
                              {hasUnsavedChanges && (
                                <div className="alert alert-warning mb-3">
                                  <i className="fas fa-exclamation-triangle me-2"></i>
                                  You have unsaved changes. Please save or discard them.
                                </div>
                              )}

                              {/* Project Files Header */}
                              <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h5 className="mb-0">Project Files</h5>
                                  {selectedFiles.length > 0 && (
                                    <span className="badge bg-primary">
                                      {selectedFiles.length} files selected
                                    </span>
                                  )}
                                </div>

                                {/* Files Table */}
                                <div className="table-responsive">
                                  <table className="table table-sm table-striped table-hover">
                                    <thead>
                                      <tr className="text-center">
                                        <th>
                                          <input type="checkbox" />
                                        </th>
                                        <th>File Name</th>
                                        <th>Pages</th>
                                        <th>Language</th>
                                        <th>Application</th>
                                        <th>Handler</th>
                                        <th>QA Reviewer</th>
                                        <th>Status</th>
                                        <th>Preview</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[
                                        {
                                          id: 1,
                                          name: "File_1_1.docx",
                                          pages: 15,
                                          language: "az",
                                          application: "Visio",
                                        },
                                        {
                                          id: 2,
                                          name: "File_1_2.docx",
                                          pages: 6,
                                          language: "az",
                                          application: "FM",
                                        },
                                        {
                                          id: 3,
                                          name: "File_1_3.docx",
                                          pages: 5,
                                          language: "yo",
                                          application: "Visio",
                                        },
                                        {
                                          id: 4,
                                          name: "File_1_4.docx",
                                          pages: 2,
                                          language: "am",
                                          application: "Word",
                                        },
                                      ].map((file) => (
                                        <tr key={file.id}>
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
                                          <td>{file.application}</td>
                                          <td>
                                            <select
                                              className="form-select form-select-sm"
                                              value={fileHandlers[file.id] || ""}
                                              onChange={(e) =>
                                                handleHandlerChange(
                                                  file.id,
                                                  e.target.value
                                                )
                                              }
                                            >
                                              <option value="">
                                                Not Assigned
                                              </option>
                                              {assignees.map(
                                                (assignee, index) => (
                                                  <option
                                                    key={index}
                                                    value={assignee.value}
                                                  >
                                                    {assignee.label}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </td>
                                          <td>
                                            <select className="form-select form-select-sm">
                                              <option value="">
                                                Not Assigned
                                              </option>
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
                                          <td>YTS</td>
                                          <td>
                                            {file.imageUrl ? (
                                              <img
                                                src={file.imageUrl}
                                                alt={file.name}
                                                style={{
                                                  width: "60px",
                                                  height: "40px",
                                                  objectFit: "cover",
                                                }}
                                              />
                                            ) : (
                                              <span>No Preview</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Footer Row Controls */}
                              <div className="row g-3 align-items-center mb-3">
                                <div className="col-md-3">
                                  <label className="form-label">
                                    Ready for QC Due <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={readyForQcDueInput}
                                    onChange={(e) => {
                                      setReadyForQcDueInput(e.target.value);
                                      setHasUnsavedChanges(true);
                                    }}
                                    required
                                  />
                                  {qcDueDelay && (
                                    <small
                                      className={`text-${
                                        qcDueDelay.includes("Delayed")
                                          ? "danger"
                                          : "success"
                                      }`}
                                    >
                                      {qcDueDelay}
                                    </small>
                                  )}
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">
                                    QC Allocated Hours <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.25"
                                    className="form-control"
                                    placeholder="0"
                                    value={qcAllocatedHours}
                                    onChange={(e) => {
                                      setQcAllocatedHours(e.target.value);
                                      setHasUnsavedChanges(true);
                                    }}
                                    required
                                  />
                                  <div className="form-text">
                                    (in multiple of 0.25 only)
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">QC Due</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="--"
                                    value={calculateQCDue(
                                      readyForQcDueInput,
                                      qcAllocatedHours
                                    )}
                                    disabled
                                  />
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">Priority</label>
                                  <select
                                    className="form-select"
                                    value={priorityAll}
                                    onChange={(e) => {
                                      setPriorityAll(e.target.value);
                                      setHasUnsavedChanges(true);
                                    }}
                                  >
                                    <option value="Low">Low</option>
                                    <option value="Mid">Mid</option>
                                    <option value="High">High</option>
                                  </select>
                                </div>
                                <div className="col-md-3 d-flex align-items-end justify-content-end gap-2">
                                  <button 
                                    className="btn btn-success"
                                    onClick={handleUpdateProjectFiles}
                                    disabled={isUpdating || !readyForQcDueInput || !qcAllocatedHours}
                                  >
                                    {isUpdating ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Saving...
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-save me-2"></i>
                                        Save
                                      </>
                                    )}
                                  </button>
                                  <button 
                                    className="btn btn-secondary"
                                    onClick={handleCloseProjectView}
                                    disabled={isUpdating}
                                  >
                                    <i className="fas fa-times me-2"></i>
                                    Close
                                  </button>
                                </div>
                              </div>

                              {/* Additional Info Section */}
                              {hasUnsavedChanges && (
                                <div className="row">
                                  <div className="col-12">
                                    <div className="alert alert-info">
                                      <i className="fas fa-info-circle me-2"></i>
                                      <strong>Note:</strong> Make sure to save your changes before closing or switching to another project.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={14} className="text-center py-4">
                      No projects found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveProject;