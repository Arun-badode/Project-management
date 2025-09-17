import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../../config";

const Created = () => {
  const [fileDeadlines, setFileDeadlines] = useState({});

  const [activeTab, setActiveTab] = React.useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("authToken");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  // this state variables is for storing the files details and storing them in database using api 
  const [allFiles, setAllFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Edit form states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    projectTitle: "",  // Changed from projectTitle to match database
    clientId: "", // Changed from clientName to match database
    country: "",
    projectManagerId: "",
    taskId: "",
    languageId: "",
    applicationId: "",
    totalProjectPages: "",
    receiveDate: "",
    estimatedHours: "",
    currency: "",
    totalCost: "",
  });

  // THIS API IS FOR fetching files from the api 
  // ✅ Fetch all project files on mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}projectFiles/getAllProjectFiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status) {
          setAllFiles(response.data.data);  // Use `data`, not `files`
          console.log("Fetched Files:", response.data.data); // Log directly from response
        } else {
          console.error("Error in response:", response.data.message);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}project/getAllProjects`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setProjects(res.data.projects);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesTab = project.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.projectManager &&
        project.projectManager
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      project.files.some((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  // Function to mark project as Active/YTS
  const markAsActiveOrYTS = async (projectId) => {
    try {
      // Prompt user to enter deadline with date and time
      const deadline = prompt("Enter deadline date and time (YYYY-MM-DD HH:MM):");
      
      if (!deadline || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(deadline)) {
        alert("Invalid or empty datetime. Please use YYYY-MM-DD HH:MM format.");
        return;
      }

      // Update project status to Active and set deadline
      const res = await axios.patch(
        `${BASE_URL}project/updateProject/${projectId}`,
        {
          status: "Active",
          deadline: deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        // Update all files in the project to YTS status
        const projectFiles = allFiles.filter(file => file.projectId === projectId);
        
        for (const file of projectFiles) {
          await axios.patch(
            `${BASE_URL}projectFiles/updateFileStatus/${file.id}`,
            {
              status: "YTS",
              deadline: deadline
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        alert("Project status updated to Active and all files marked as YTS!");
        
        // Refresh project list
        const refreshed = await axios.get(`${BASE_URL}project/getAllProjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (refreshed.data.status) {
          setProjects(refreshed.data.projects);
        }
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
      alert("Error updating project status");
    }
  };

  // Function to open edit modal with project data
  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditFormData({
      projectTitle: project.projectTitle || "",  // Changed from projectTitle to match database
      clientId: project.clientId || "", // Changed from clientName to match database
      country: project.country || "",
      projectManagerId: project.projectManagerId || "",
      taskId: project.taskId || "",
      languageId: project.languageId || "",
      applicationId: project.applicationId || "",
      totalProjectPages: project.totalProjectPages || "",
      receiveDate: project.receiveDate ? new Date(project.receiveDate).toISOString().slice(0, 16) : "",
      estimatedHours: project.estimatedHours || "",
      currency: project.currency || "",
      totalCost: project.totalCost || "",
    });
    setShowEditModal(true);
  };

  // Function to handle form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to save edited project
  const saveEditedProject = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}project/updateProject/${editingProject.id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        alert("Project updated successfully!");
        
        // Refresh project list
        const refreshed = await axios.get(`${BASE_URL}project/getAllProjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (refreshed.data.status) {
          setProjects(refreshed.data.projects);
        }
        
        setShowEditModal(false);
      } else {
        alert("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project");
    }
  };

  // Function to copy server path to clipboard
  const copyServerPath = (project) => {
    const serverPath = `\\\\server\\projects\\${project.id}`; // Adjust path format as needed
    navigator.clipboard.writeText(serverPath)
      .then(() => {
        alert("Server path copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy server path");
      });
  };

  // Function to handle delete project with confirmation
  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      axios.delete(`${BASE_URL}project/deleteProject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.data.status) {
          alert("Project deleted successfully!");
          setProjects(projects.filter(project => project.id !== id));
        } else {
          alert("Failed to delete project");
        }
      })
      .catch(err => {
        console.error("Error deleting project:", err);
        alert("Error deleting project");
      });
    }
  };

  // Function to save file status updates
  const saveFileStatusUpdates = async (projectId) => {
    try {
      const deadline = fileDeadlines[projectId];
      
      if (!deadline) {
        alert("Please set a deadline before saving.");
        return;
      }

      // Update selected files with new status and deadline
      for (const fileId of selectedFiles) {
        await axios.patch(
          `${BASE_URL}projectFiles/updateFileStatus/${fileId}`,
          {
            status: fileStatuses[fileId] || "YTS",
            deadline: deadline
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert("File statuses updated successfully!");
      
      // Refresh files list
      const filesResponse = await axios.get(`${BASE_URL}projectFiles/getAllProjectFiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (filesResponse.data.status) {
        setAllFiles(filesResponse.data.data);
      }
      
      // Clear selections
      setSelectedFiles([]);
      setFileDeadlines(prev => ({ ...prev, [projectId]: "" }));
    } catch (error) {
      console.error("Failed to update file statuses:", error);
      alert("Error updating file statuses");
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading Projects...</p>
      ) : (
        <table className="table table-hover mb-0" style={{ minWidth: 900 }}>
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
              <th>S.No.</th>
              <th>Project Title</th>
              <th>Client Name</th>
              <th>Country</th>
              <th>Project Manager</th>
              <th>Task</th>
              <th>Languages</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Received Date</th>
              <th>Estimated Hrs</th>
              <th>Cost with Currency</th>
              <th>Cost in INR</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((project) => project.status === "In Progress")
              .map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr className="text-center">
                    <td>{index + 1}</td>
                    <td>
                      {project.title}
                      <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                        {project.status}
                      </span>
                    </td>
                    <td>{project.clientName || "-"}</td>
                    <td>{project.country}</td>
                    <td>{project.full_name}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {project.task_name}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success">
                        {project.language_name}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-purple bg-opacity-10 text-purple">
                        {project.application_name}
                      </span>
                    </td>
                    <td>{project.totalProjectPages}</td>
                    <td>
                      {project.receiveDate
                        ? new Date(project.receiveDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{project.estimatedHours || "-"}</td>
                    <td>
                      {project.currency
                        ? `${project.currency || "USD"} ${project.totalCost}`
                        : "-"}
                    </td>
                    <td>{project.totalCost ? `₹${project.totalCost}` : "-"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() =>
                            setExpandedProjectId(
                              expandedProjectId === project.id ? null : project.id
                            )
                          }
                          aria-label="Show Files"
                          className="btn btn-sm btn-secondary"
                          title="Project Files"
                        >
                          <i className="fas fa-folder-open"></i>
                        </button>
                        <button
                          onClick={() => markAsActiveOrYTS(project.id)}
                          className="btn btn-sm btn-success"
                          title="Mark as Active/YTS"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="btn btn-sm btn-primary"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => copyServerPath(project)}
                          className="btn btn-sm btn-info"
                          title="Copy Server Path"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="btn btn-sm btn-danger"
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedProjectId === project.id && (
                    <tr>
                      <td colSpan={15}>
                        {/* Files Table */}
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Project Files</h5>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-sm table-striped table-hover">
                              <thead>
                                <tr className="text-center">
                                  <th>
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedFiles.length ===
                                        allFiles.filter((file) => file.projectId === project.id).length
                                      }
                                      onChange={(e) => {
                                        const projectFiles = allFiles.filter((file) => file.projectId === project.id);
                                        if (e.target.checked) {
                                          setSelectedFiles(projectFiles.map((file) => file.id));
                                        } else {
                                          setSelectedFiles([]);
                                        }
                                      }}
                                    />
                                    File ID
                                  </th>
                                  <th>File Name</th>
                                  <th>Pages</th>
                                  <th>Language</th>
                                  <th>Application</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allFiles
                                  .filter((file) => file.projectId === project.id)
                                  .map((file) => (
                                    <tr key={file.id}>
                                      <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                          <input
                                            type="checkbox"
                                            checked={selectedFiles.includes(file.id)}
                                            onChange={(e) => {
                                              setSelectedFiles((prev) =>
                                                e.target.checked
                                                  ? [...prev, file.id]
                                                  : prev.filter((id) => id !== file.id)
                                              );
                                            }}
                                          />
                                          <span>{file.id}</span>
                                        </div>
                                      </td>
                                      <td>{file.fileName}</td>
                                      <td>{file.pages}</td>
                                      <td>{file.languageName || "N/A"}</td>
                                      <td>{file.applicationName || "N/A"}</td>
                                      <td>
                                        <select
                                          value={fileStatuses[file.id] || file.status || "Pending"}
                                          onChange={(e) =>
                                            setFileStatuses((prev) => ({
                                              ...prev,
                                              [file.id]: e.target.value,
                                            }))
                                          }
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="YTS">YTS</option>
                                          <option value="WIP">WIP</option>
                                          <option value="QC YTS">QC YTS</option>
                                          <option value="QC WIP">QC WIP</option>
                                          <option value="Corr YTS">Corr YTS</option>
                                          <option value="Corr WIP">Corr WIP</option>
                                          <option value="RFD">RFD</option>
                                        </select>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <label className="form-label me-2">Deadline:</label>
                              <input
                                type="datetime-local"
                                className="form-control"
                                style={{ width: "250px" }}
                                value={fileDeadlines[project.id] || ""}
                                onChange={(e) => {
                                  const newDeadline = e.target.value;
                                  setFileDeadlines((prev) => ({
                                    ...prev,
                                    [project.id]: newDeadline,
                                  }));
                                }}
                              />
                            </div>
                            <div>
                              <button
                                className="btn btn-primary mt-2"
                                onClick={() => saveFileStatusUpdates(project.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary mt-2 ms-2"
                                onClick={() => setExpandedProjectId(null)}
                              >
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

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title " style={{color:"black"}} >Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"  // Changed from projectTitle to match database
                        value={editFormData.projectTitle}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark">Client Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="client"  // Changed from clientName to match database
                        value={editFormData.clientId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={editFormData.country}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark">Project Manager</label>
                      <input
                        type="text"
                        className="form-control"
                        name="projectManagerId"
                        value={editFormData.projectManagerId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label text-dark">Task</label>
                      <input
                        type="text"
                        className="form-control"
                        name="task_name"
                        value={editFormData.taskId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark">Language</label>
                      <input
                        type="text"
                        className="form-control"
                        name="language_name"
                        value={editFormData.languageId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-4"> 
                      <label className="form-label text-dark">Application</label>
                      <input
                        type="text"
                        className="form-control"
                        name="application_name"
                        value={editFormData.applicationId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label text-dark">Total Pages</label>
                      <input
                        type="number"
                        className="form-control"
                        name="totalProjectPages"
                        value={editFormData.totalProjectPages}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark">Received Date</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="receiveDate"
                        value={editFormData.receiveDate}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark">Estimated Hours</label>
                      <input
                        type="number"
                        className="form-control"
                        name="estimatedHours"
                        value={editFormData.estimatedHours}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark">Currency</label>
                      <input
                        type="text"
                        className="form-control"
                        name="currency"
                        value={editFormData.currency}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark">Total Cost</label>
                      <input
                        type="number"
                        className="form-control"
                        name="totalCost"
                        value={editFormData.totalCost}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={saveEditedProject}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Created;