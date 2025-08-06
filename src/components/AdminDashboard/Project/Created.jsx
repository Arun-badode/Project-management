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





  // // Filter files for the given projectId
  // const filteredFiles = allFiles.filter((file) => file.projectId === projectId);


  const dummyFiles = [
    { id: 1, name: "File_1_1.docx", pages: 15, language: "az", application: "Visio" },
    { id: 2, name: "File_1_2.docx", pages: 6, language: "az", application: "FM" },
    { id: 3, name: "File_1_3.docx", pages: 5, language: "yo", application: "Visio" },
    { id: 4, name: "File_1_4.docx", pages: 2, language: "am", application: "Word" },
  ];

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




const markAsCompleted = async (projectId) => {
  try {
    const token = localStorage.getItem("authToken");

    // Prompt user to enter deadline
    const deadline = prompt("Enter new deadline date (YYYY-MM-DD):");

    if (!deadline || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      alert("Invalid or empty date. Please use YYYY-MM-DD format.");
      return;
    }

    const res = await axios.patch(
      `${BASE_URL}project/updateProject/${projectId}`,
      {
        status: "Active",       // ✅ Set status to Active
        deadline: deadline,     // ✅ Set deadline as user input
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      alert("Project status updated and deadline set successfully!");

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




  const filteredFiles = (allFiles || []).filter(file => file.projectId === projects);


  const handleEditProject = (id) => {
    // Implement edit project functionality
    console.log("Edit project:", id);
  };

  const handleDeleteProject = (id) => {
    // Implement delete project functionality
    console.log("Delete project:", id);
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
              <th>Client Alise Name</th>
              <th>Client</th>
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
              // .filter((project) => project.status != "Completed")
              .filter((project) => project.status == "In Progress")
              .map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr className="text-center">
                    <td>{index + 1}</td>
                    <td>
                      {project.projectTitle}
                      <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                        {project.status}
                      </span>
                    </td>
                    <td>{project.full_name || "-"}</td>
                    <td>{project.clientName}</td>
                    <td>{project.country}</td>
                    <td>{project.projectManagerId}</td>
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
                        ? `${project.currency || "USD"} ${project.currency}`
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
                        >
                          <i className={`fa-solid fa-angle-down ${expandedProjectId === project.id ? "rotate-180" : ""}`}></i>
                        </button>
                        <button
                          onClick={() => markAsCompleted(project.id)}
                          className="btn btn-sm btn-success"
                          title="Mark as Completed"
                        >
                          <i className="fas fa-check"></i> Mark as YTS
                        </button>
                        <button
                          onClick={() => handleEditProject(project.id)}
                          className="btn btn-sm btn-primary"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
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
                                          <option value="Approved">Approved</option>
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
                                onClick={() => markAsCompleted(project.id)}
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
    </div>
  );
};

export default Created;