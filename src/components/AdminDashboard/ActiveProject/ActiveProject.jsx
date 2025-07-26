import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import useSyncScroll from "../Hooks/useSyncScroll";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import CreateNewProject from "../Project/CreateNewProject";
import EditModal from "./EditModal";

const ActiveProject = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const userRole = localStorage.getItem("userRole");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const isAdmin = userRole === "Admin";

  const [fileHandlers, setFileHandlers] = useState({});

  const assignees = [
    { label: "Not Assigned", value: "" },
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
    { label: "Mike Johnson", value: "Mike Johnson" },
  ];
  const handleHandlerChange = (fileId, newHandler) => {
    // Update handler for all selected files
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    const due = params.get("due");

    let result = [...projects];

    if (filter === "active") {
      result = result.filter((project) => project.progress < 100);
    }

    if (due === "30min") {
      const now = new Date();
      const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      result = result.filter((project) => {
        const match = project.dueDate.match(
          /(\d{2}):(\d{2}) (AM|PM) (\d{2})-(\d{2})-(\d{2})/
        );
        if (!match) return false;
        let [_, hour, min, ampm, day, month, year] = match;
        hour = parseInt(hour, 10);
        if (ampm === "PM" && hour !== 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
        const dueDateObj = new Date(
          `20${year}-${month}-${day}T${hour.toString().padStart(2, "0")}:${min}`
        );
        return dueDateObj > now && dueDateObj <= thirtyMinsFromNow;
      });
    }

    setFilteredProjects(result);
  }, [location.search, projects]);

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
  const [activeButton, setActivebutton] = useState("");
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
  console.log("batchEditValues", batchEditValues.handler);

  const [qcDueDelay, setQcDueDelay] = useState("");

  const statuses = [
    { key: "allstatus", label: "All Status " },
    { key: "yts", label: "YTS" },
    { key: "wip", label: "WIP" },
    { key: "readyforqc", label: "Ready for QC" },
    { key: "qareview", label: "QA Review" },
    { key: "corryts", label: "Corr YTS" },
    { key: "corrwip,", label: "Corr WIP" },
    { key: "rfd,", label: "RFD" },
  ];

  const applicationsOptio = [
    { value: "Adobe", label: "Adobe" },
    { value: "MSOffice", label: "MS Office" },
  ];

  useEffect(() => {
    setProjects(generateDummyProjects(15));
    setFilteredProjects(generateDummyProjects(15));
  }, []);

  useEffect(() => {
    let result = [...projects];

    if (activeTab === "unhandled") {
      result = result.filter(
        (project) => !project.handler || project.handler === ""
      );
    }

    if (clientFilter) {
      result = result.filter((project) => project.client === clientFilter);
    }
    if (taskFilter) {
      result = result.filter((project) => project.task === taskFilter);
    }
    if (languageFilter) {
      result = result.filter((project) => project.language === languageFilter);
    }

    result.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    setFilteredProjects(result);
  }, [projects, activeTab, clientFilter, taskFilter, languageFilter]);

  const handleCardFilter = (type) => {
    let filtered = [];
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    // Clear all filters when a button is clicked
    setClientFilter("");
    setTaskFilter("");
    setLanguageFilter("");
    setSelectedApplications([]);

    switch (type) {
      case "all":
        filtered = projects
          .slice()
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case "nearDue":
        filtered = projects.filter((project) => {
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          const dueDate = new Date(customToInputDate(project.deadline));
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        });
        break;
      case "overdue":
        filtered = projects.filter((project) => {
          const dueDate = new Date(customToInputDate(project.deadline));
          return dueDate < today && project.status !== "Completed";
        });
        break;
      case "MSOffice": {
        const msOfficeApps = [
          "Word",
          "PPT",
          "Excel",
          "Visio",
          "Project",
          "Canva",
          "MS Office",
        ];
        filtered = projects.filter((project) =>
          msOfficeApps.includes(project.application)
        );
        break;
      }
      case "Adobe": {
        const adobeApps = ["INDD", "AI", "PSD", "AE", "CDR", "FM", "Adobe"];
        filtered = projects.filter((project) =>
          adobeApps.includes(project.application)
        );
        break;
      }
      default:
        filtered = projects;
    }
    setFilteredProjects(filtered);
    setActivebutton(type);
  };

  // Helper functions you need to implement:

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
    setSelectedFiles([]);
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
  console.log("slectedFiles", selectedFiles);
  // console.log(
  //   "slselectedFiles.some((f) => f.id === file.idectedFiles",
  //   selectedFiles.some((f) => f.id === file.id)
  // );

  const getUniqueValues = (key) => {
    return Array.from(new Set(projects.map((project) => project[key])));
  };

  const handleEditProject = (project) => {
    setEditedProject({ ...project });
    setIsEdit(project.id);
    setShowEditModal(true); // <-- Add this line
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
    // Apply deadline logic here
    alert(`Deadline ${formData.deadline} applied to selected files.`);
  };

  const {
    scrollContainerRef: scrollContainerRef1,
    fakeScrollbarRef: fakeScrollbarRef1,
  } = useSyncScroll(true);

  function calculateQCDue(startDate, hours) {
    if (!startDate || !hours) return "--";
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + hours);
    return endDate.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

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
                <EditModal />
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
                  {/* <button className="btn btn-light btn-sm me-4 ">
                    <i className="fas fa-cog text-muted"></i>
                  </button> */}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <CreateNewProject />
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
                {getUniqueValues("client").map((client, index) => (
                  <option key={index} value={client}>
                    {client}
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
                {getUniqueValues("task").map((task, index) => (
                  <option key={index} value={task}>
                    {task}
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
                options={applicationsOptio}
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
        <li className="nav-item ">
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
                  backgroundColor: "#fff", // Match your background color
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
                {filteredProjects.map((project, index) => (
                  <React.Fragment key={project.id}>
                    <tr
                      className={
                        expandedRow === project.id
                          ? "table-active text-center"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{project.title}</td>
                      <td>{project.client}</td>
                      <td>{project.task}</td>
                      <td>{project.language}</td>
                      <td>{project.application}</td>
                      <td>{project.totalPages}</td>
                      <td>{project.deadline}</td>
                      <td>{project.readyDeadline}</td>
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
                                      <th>
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={
                                            selectedFiles.length ===
                                            project?.files?.length
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
                                        <td>{file.application}</td>
                                        <td>
                                          <select
                                            className="form-select form-select-sm"
                                            value={fileHandlers[file.id]}
                                            onChange={(e) =>
                                              handleHandlerChange(
                                                file.id,
                                                e.target.value
                                              )
                                            }
                                          >
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
                                        <td>Corr WIP</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Batch Edit Controls */}
                              <div className="row g-3 mb-1">
                                <div className="col-md-2">
                                  <label className="form-label">
                                    Ready for QC Due
                                  </label>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">
                                    QC Allocated Hours
                                  </label>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">QC Due</label>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">Priority</label>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">Actions</label>
                                </div>
                              </div>

                              {/* Input Row */}
                              <div className="row g-3 mb-3 align-items-start">
                                <div className="col-md-2">
                                  <DatePicker
                                    selected={selectedDateTime}
                                    onChange={(date) =>
                                      setSelectedDateTime(date)
                                    }
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="h:mm aa dd-MM-yyyy"
                                    placeholderText="Select date and time"
                                    className="form-control"
                                  />
                                </div>

                                <div className="col-md-2">
                                  <input
                                    type="number"
                                    className="form-control"
                                    step="0.25"
                                    min="0"
                                    placeholder="0.00"
                                    value={qcAllocatedHours}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (
                                        !isNaN(val) &&
                                        val >= 0 &&
                                        val % 0.25 === 0
                                      ) {
                                        setQcAllocatedHours(val);
                                      }
                                    }}
                                  />
                                  <div className="small text-white">
                                    (in multiple of 0.00 only)
                                  </div>
                                </div>

                                <div className="col-md-2">
                                  <div className="form-control fw-bold">
                                    {calculateQCDue(
                                      selectedDateTime,
                                      qcAllocatedHours
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-2">
                                  <select className="form-select">
                                    <option>Low</option>
                                    <option>Mid</option>
                                    <option>High</option>
                                  </select>
                                </div>

                                <div className="col-md-2 d-flex gap-2">
                                  <button className="btn btn-success w-100">
                                    Save
                                  </button>
                                  <button className="btn btn-secondary w-100">
                                    Close
                                  </button>
                                </div>
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
        </div>
      </div>
    </div>
  );
};

// Helper functions
function customToInputDate(str) {
  if (!str) return "";
  const match = str.match(/(\d{2}):(\d{2}) (AM|PM) (\d{2})-(\d{2})-(\d{2})/);
  if (!match) return "";
  let [_, hour, min, ampm, day, month, year] = match;
  hour = parseInt(hour, 10);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  hour = hour.toString().padStart(2, "0");
  return `20${year}-${month}-${day}T${hour}:${min}`;
}

function inputToCustomDate(str) {
  if (!str) return "";
  const d = new Date(str);
  if (isNaN(d)) return "";
  let hour = d.getHours();
  const min = d.getMinutes().toString().padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear().toString().slice(2);
  return `${hour
    .toString()
    .padStart(2, "0")}:${min} ${ampm} ${day}-${month}-${year}`;
}

const generateDummyProjects = (count) => {
  const clients = [
    "PN",
    "MMP Auburn",
    "MMP Eastlake",
    "MMP Kirkland",
    "GN",
    "DM",
  ];
  const tasks = [
    "Source Creation",
    "Callout",
    "Prep",
    "Image Creation",
    "DTP",
    "Image Localization",
    "OVA",
  ];
  const languages = ["af", "am", "ar", "az", "be"];
  const applications = [
    "Word",
    "PPT",
    "Excel",
    "INDD",
    "AI",
    "PSD",
    "AE",
    "CDR",
    "Visio",
    "Project",
    "FM",
  ];

  const statuses = [
    "QC YTS",
    "WIP",
    "QC WIP",
    "WIP",
    "Corr YTS",
    "WIP",
    "Corr YTS",
    "Corr WIP",
    "WIP",
    "QC YTS",
    "Corr YTS",
  ];
  const stages = ["In Progress", "Review", "Completed", "On Hold"];
  const qaStatuses = ["Pending", "In Progress", "Approved", "Rejected"];
  const handlers = ["John Doe", "Jane Smith", "Mike Johnson", ""];
  const qaReviewers = ["Sarah Williams", "David Brown", "Emily Davis", ""];

  const projects = [];

  for (let i = 1; i <= count; i++) {
    const totalPages = Math.floor(Math.random() * 100) + 10;
    const progress = Math.floor(Math.random() * 101);
    const handler = handlers[Math.floor(Math.random() * handlers.length)];

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    dueDate.setHours(hours, minutes);

    const formattedDueDate = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"} ${dueDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(dueDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dueDate.getFullYear().toString().slice(2)}`;

    // Add random readyDeadline, qcHrs, qcDueDate, status
    const readyDeadline = `${(hours + 1) % 24}:${minutes
      .toString()
      .padStart(2, "0")} ${hours + 1 >= 12 ? "PM" : "AM"} ${dueDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(dueDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dueDate.getFullYear().toString().slice(2)}`;
    const qcHrs = Math.floor(Math.random() * 15) + 1;
    const qcDueDate = `${(hours + 2) % 24}:${minutes
      .toString()
      .padStart(2, "0")} ${hours + 2 >= 12 ? "PM" : "AM"} ${dueDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(dueDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dueDate.getFullYear().toString().slice(2)}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const fileCount = Math.floor(Math.random() * 5) + 1;
    const files = [];
    for (let j = 1; j <= fileCount; j++) {
      const filePages = Math.floor(Math.random() * 20) + 1;
      files.push({
        id: j,
        name: `File_${i}_${j}.docx`,
        pages: filePages,
        language: languages[Math.floor(Math.random() * languages.length)],
        application:
          applications[Math.floor(Math.random() * applications.length)],
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
      application:
        applications[Math.floor(Math.random() * applications.length)],
      totalPages,
      deadline: formattedDueDate,
      readyDeadline,
      qcHrs,
      qcDueDate,
      status,
      progress,
      handler,
      files,
    });
  }
  return projects;
};
export default ActiveProject;
