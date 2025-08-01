import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ActiveProjects = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("authToken");
  const [expandedRow, setExpandedRow] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [batchEditValues, setBatchEditValues] = useState({
    application: "",
    handler: "",
    qaReviewer: "",
    qaStatus: "",
    qcDue: "",
    qcAllocatedHours: "",
    priority: "",
  });
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [qcAllocatedHours, setQcAllocatedHours] = useState(0);
  const [fileHandlers, setFileHandlers] = useState({});
  const [fileQAReviewers, setFileQAReviewers] = useState({});
  const [fileQAStatuses, setFileQAStatuses] = useState({});
  const [priority, setPriority] = useState("Low");

  const assignees = [
    { label: "Not Assigned", value: "" },
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
    { label: "Mike Johnson", value: "Mike Johnson" },
  ];

  const qaReviewers = [
    { label: "Not Assigned", value: "" },
    { label: "Sarah Williams", value: "Sarah Williams" },
    { label: "David Brown", value: "David Brown" },
    { label: "Emily Davis", value: "Emily Davis" },
  ];

  const qaStatuses = [
    { label: "Con WIP", value: "Con WIP" },
    { label: "Corr WIP", value: "Corr WIP" },
    { label: "Completed", value: "Completed" },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}project/getAllProjects`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          const activeProjects = res.data.projects.filter(
            (project) => project.status?.toLowerCase() === "active"
          );
          setProjects(activeProjects);
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  };

  const filteredProjects = projects.filter((project) => {
    const matchesTab = project.status?.toLowerCase() === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      (project.projectTitle &&
        project.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.clientName &&
        project.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.country &&
        project.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.projectManager &&
        project.projectManager.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.files?.some(
        (file) =>
          file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  const markAsCompleted = (projectId) => {
    if (window.confirm("Are you sure you want to mark this project as complete?")) {
      axios
        .put(
          `${BASE_URL}project/updateProjectStatus/${projectId}`,
          { status: "Completed" },
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          if (res.data.status) {
            fetchProjects();
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEditProject = (projectId) => {
    console.log("Editing project:", projectId);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      axios
        .delete(`${BASE_URL}project/deleteProject/${projectId}`, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.status) {
            fetchProjects();
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleViewProject = (project) => {
    setExpandedRow(expandedRow === project.id ? null : project.id);
    setSelectedFiles([]);
    setHasUnsavedChanges(false);
    setBatchEditValues({
      application: "",
      handler: "",
      qaReviewer: "",
      qaStatus: "",
      qcDue: "",
      qcAllocatedHours: "",
      priority: "",
    });
    setSelectedDateTime(null);
    setQcAllocatedHours(0);
    setPriority("Low");
  };

  const toggleFileSelection = (file) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
    setHasUnsavedChanges(true);
  };

  const handleHandlerChange = (fileId, newHandler) => {
    const updatedHandlers = { ...fileHandlers, [fileId]: newHandler };
    setFileHandlers(updatedHandlers);
    setHasUnsavedChanges(true);
  };

  const handleQAReviewerChange = (fileId, newReviewer) => {
    const updatedReviewers = { ...fileQAReviewers, [fileId]: newReviewer };
    setFileQAReviewers(updatedReviewers);
    setHasUnsavedChanges(true);
  };

  const handleQAStatusChange = (fileId, newStatus) => {
    const updatedStatuses = { ...fileQAStatuses, [fileId]: newStatus };
    setFileQAStatuses(updatedStatuses);
    setHasUnsavedChanges(true);
  };

  const handleBatchUpdate = () => {
    if (selectedFiles.length === 0) return;

    const updatedFileHandlers = { ...fileHandlers };
    const updatedFileQAReviewers = { ...fileQAReviewers };
    const updatedFileQAStatuses = { ...fileQAStatuses };

    selectedFiles.forEach((file) => {
      if (batchEditValues.handler) {
        updatedFileHandlers[file.id] = batchEditValues.handler;
      }
      if (batchEditValues.qaReviewer) {
        updatedFileQAReviewers[file.id] = batchEditValues.qaReviewer;
      }
      if (batchEditValues.qaStatus) {
        updatedFileQAStatuses[file.id] = batchEditValues.qaStatus;
      }
    });

    setFileHandlers(updatedFileHandlers);
    setFileQAReviewers(updatedFileQAReviewers);
    setFileQAStatuses(updatedFileQAStatuses);
    setHasUnsavedChanges(true);
    setBatchEditValues({
      application: "",
      handler: "",
      qaReviewer: "",
      qaStatus: "",
      qcDue: "",
      qcAllocatedHours: "",
      priority: "",
    });
  };

  const calculateQCDue = (startDate, hours) => {
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
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", {
      fileHandlers,
      fileQAReviewers,
      fileQAStatuses,
      selectedDateTime,
      qcAllocatedHours,
      priority,
    });
    setHasUnsavedChanges(false);
    alert("Changes saved successfully!");
  };

  const handleClose = () => {
    setExpandedRow(null);
    setSelectedFiles([]);
    setHasUnsavedChanges(false);
  };

  return (
    <div
      className="table-responsive"
      style={{
        maxHeight: "500px",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading Projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center p-4">
          <p>No active projects found</p>
          <button className="btn btn-primary" onClick={fetchProjects}>
            Refresh
          </button>
        </div>
      ) : (
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
              <th>Client Alias Name</th>
              <th>Client</th>
              <th>Country</th>
              <th>Project Manager</th>
              <th>Task</th>
              <th>Languages</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Deadline</th>
              <th>Ready For QC Deadline</th>
              <th>QC Hrs</th>
              <th>QC Due Date</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <React.Fragment key={project.id || index}>
                <tr
                  className={
                    expandedRow === project.id
                      ? "table-active text-center"
                      : "text-center"
                  }
                >
                  <td>{index + 1}</td>
                  <td>{project.projectTitle || "-"}</td>
                  <td>{project.full_name || "-"}</td>
                  <td>{project.clientName || "-"}</td>
                  <td>{project.country || "-"}</td>
                  <td>{project.projectManagerId || "-"}</td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {project.task_name || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success">
                      {project.language_name || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-purple bg-opacity-10 text-purple">
                      {project.application_name || "-"}
                    </span>
                  </td>
                  <td>{project.totalPagesLang || "-"}</td>
                  <td>
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {project.readyQCDeadline
                      ? new Date(project.readyQCDeadline).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{project.qcHrs || "-"}</td>
                  <td>
                    {project.qcDueDate
                      ? new Date(project.qcDueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span className="badge bg-warning bg-opacity-10 text-warning">
                      {project.status || "-"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="progress flex-grow-1 me-2"
                        style={{ height: "6px" }}
                      >
                        <div
                          className="progress-bar bg-primary"
                          style={{
                            width: `${project.progress || 0}%`,
                          }}
                        ></div>
                      </div>
                      <small className="text-primary">
                        {project.progress || 0}%
                      </small>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        onClick={() => markAsCompleted(project.id)}
                        className="btn btn-sm btn-success"
                      >
                        Mark as Completed
                      </button>
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
                        onClick={() => handleEditProject(project.id)}
                        className="btn btn-sm btn-success"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="btn btn-sm btn-danger"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedRow === project.id && (
                  <tr>
                    <td colSpan={17} className="p-0 border-top-0">
                      <div className="p-4">
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Project Files</h5>
                            {selectedFiles.length > 0 && (
                              <span className="badge bg-primary">
                                {selectedFiles.length} files selected
                              </span>
                            )}
                          </div>

                          {project.files && project.files.length > 0 ? (
                            <>
                              <div className="mb-3">
                                <div className="row g-3">
                                  <div className="col-md-3">
                                    <label className="form-label">Handler</label>
                                    <select
                                      className="form-select"
                                      value={batchEditValues.handler}
                                      onChange={(e) =>
                                        setBatchEditValues({
                                          ...batchEditValues,
                                          handler: e.target.value,
                                        })
                                      }
                                    >
                                      {assignees.map((assignee, index) => (
                                        <option key={index} value={assignee.value}>
                                          {assignee.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-md-3">
                                    <label className="form-label">QA Reviewer</label>
                                    <select
                                      className="form-select"
                                      value={batchEditValues.qaReviewer}
                                      onChange={(e) =>
                                        setBatchEditValues({
                                          ...batchEditValues,
                                          qaReviewer: e.target.value,
                                        })
                                      }
                                    >
                                      {qaReviewers.map((reviewer, index) => (
                                        <option key={index} value={reviewer.value}>
                                          {reviewer.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-md-3">
                                    <label className="form-label">QA Status</label>
                                    <select
                                      className="form-select"
                                      value={batchEditValues.qaStatus}
                                      onChange={(e) =>
                                        setBatchEditValues({
                                          ...batchEditValues,
                                          qaStatus: e.target.value,
                                        })
                                      }
                                    >
                                      {qaStatuses.map((status, index) => (
                                        <option key={index} value={status.value}>
                                          {status.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-md-3 d-flex align-items-end">
                                    <button
                                      className="btn btn-primary w-100"
                                      onClick={handleBatchUpdate}
                                      disabled={selectedFiles.length === 0}
                                    >
                                      Apply to Selected
                                    </button>
                                  </div>
                                </div>
                              </div>

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
                                            ? "table-primary text-center"
                                            : "text-center"
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
                                        <td>{file.name || "-"}</td>
                                        <td>{file.pages || "-"}</td>
                                        <td>{file.language || "-"}</td>
                                        <td>{file.application || "-"}</td>
                                        <td>
                                          <select
                                            className="form-select form-select-sm"
                                            value={
                                              fileHandlers[file.id] || file.handler || ""
                                            }
                                            onChange={(e) =>
                                              handleHandlerChange(file.id, e.target.value)
                                            }
                                          >
                                            {assignees.map((assignee, index) => (
                                              <option key={index} value={assignee.value}>
                                                {assignee.label}
                                              </option>
                                            ))}
                                          </select>
                                        </td>
                                        <td>
                                          <select
                                            className="form-select form-select-sm"
                                            value={
                                              fileQAReviewers[file.id] ||
                                              file.qaReviewer ||
                                              ""
                                            }
                                            onChange={(e) =>
                                              handleQAReviewerChange(
                                                file.id,
                                                e.target.value
                                              )
                                            }
                                          >
                                            {qaReviewers.map((reviewer, index) => (
                                              <option key={index} value={reviewer.value}>
                                                {reviewer.label}
                                              </option>
                                            ))}
                                          </select>
                                        </td>
                                        <td>
                                          <select
                                            className="form-select form-select-sm"
                                            value={
                                              fileQAStatuses[file.id] ||
                                              file.qaStatus ||
                                              "Con WIP"
                                            }
                                            onChange={(e) =>
                                              handleQAStatusChange(file.id, e.target.value)
                                            }
                                          >
                                            {qaStatuses.map((status, index) => (
                                              <option key={index} value={status.value}>
                                                {status.label}
                                              </option>
                                            ))}
                                          </select>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          ) : (
                            <p>No files available for this project</p>
                          )}

                          <div className="row g-3 mb-1 mt-4">
                            <div className="col-md-2">
                              <label className="form-label">Ready for QC Due</label>
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">QC Allocated Hours</label>
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">QC Due</label>
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Priority</label>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Actions</label>
                            </div>
                          </div>

                          <div className="row g-3 mb-3 align-items-start">
                            <div className="col-md-2">
                              <DatePicker
                                selected={selectedDateTime}
                                onChange={(date) => setSelectedDateTime(date)}
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
                                min="0"
                                max="100"
                                placeholder="0"
                                value={qcAllocatedHours}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    setQcAllocatedHours(Math.min(val, 100));
                                  }
                                }}
                              />
                              <div className="small text-muted">
                                on number of 100 only
                              </div>
                            </div>

                            <div className="col-md-2">
                              <div className="form-control">
                                {calculateQCDue(selectedDateTime, qcAllocatedHours)}
                              </div>
                            </div>

                            <div className="col-md-2">
                              <select
                                className="form-select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                              >
                                <option value="Low">Low</option>
                                <option value="Mid">Mid</option>
                                <option value="High">High</option>
                              </select>
                            </div>

                            <div className="col-md-4 d-flex gap-2">
                              <button
                                className="btn btn-success w-100"
                                onClick={handleSaveChanges}
                                disabled={!hasUnsavedChanges}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary w-100"
                                onClick={handleClose}
                              >
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
      )}
    </div>
  );
};

export default ActiveProjects;