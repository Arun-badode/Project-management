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

 const markAsCompleted = async (projectId) => {
     try {
       const token = localStorage.getItem("authToken");
 
       const res = await axios.patch(
         `${BASE_URL}project/updateProject/${projectId}`,
         {
           status: "Completed", // 👈 Change the project status
         },
         {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }
       );
 
       if (res.status === 200) {
         alert("Project marked as Completed successfully!");
         // optionally refresh the project list here
         // refresh the list
         const refreshed = await axios.get(`${BASE_URL}project/getAllProjects`, {
           headers: { authorization: `Bearer ${token}` },
         });
         if (refreshed.data.status) {
           setProjects(refreshed.data.projects);
         }
         //fetchProjects(); // you must define this function to reload projects
       }
     } catch (error) {
       console.error("Failed to update project status:", error);
       alert("Error updating project status");
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

  // Count files for each project
  const getFileCount = (projectId) => {
    // This is a mock function - replace with your actual file count logic
    // For now, we'll return a fixed number for each project
    return 4; // Assuming each project has 4 files
  };

  return (
    <div >
      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status" style={{ minWidth: 900 }}>
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
              <th>Files</th> {/* New column for file count */}
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
                  <td>
                    <span className="badge bg-info">
                      {getFileCount(project.id)} Files
                    </span>
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
                    <td colSpan={18} className="p-0 border-top-0">
                      <div className="p-4">
                        {/* Project Files Header */}
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Project Files ({getFileCount(project.id)})</h5>
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
                              Ready for QC Due
                            </label>
                            <input
                              type="datetime-local"
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-2 mt-5">
                            <label className="form-label">
                              QC Allocated Hours
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.25"
                              className="form-control"
                              placeholder="0"
                            />
                            <div className="form-text">
                              (in multiple of 0.00 only)
                            </div>
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">QC Due</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="--"
                              disabled
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Priority</label>
                            <select className="form-select">
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                          <div className="col-md-3 d-flex align-items-end justify-content-end gap-2">
                            <button className="btn btn-success">
                              Save
                            </button>
                            <button className="btn btn-secondary">
                              Close
                            </button>
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