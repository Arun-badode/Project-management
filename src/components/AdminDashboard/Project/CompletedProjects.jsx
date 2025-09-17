import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../../config";

const CompletedProjects = ({projectPermission}) => {
  console.log("projectPermission",projectPermission);
  const [activeTab, setActiveTab] = useState("completed");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("authToken");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedApplications, setSelectedApplications] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  
  // Lists for filter dropdowns
  const [clientList, setClientList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  
  // State for project files dropdown
  const [showFilesDropdown, setShowFilesDropdown] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [amendsRound, setAmendsRound] = useState(1);
  const [newDeadline, setNewDeadline] = useState("");
  
  // State for timestamp modal
  const [showTimestampModal, setShowTimestampModal] = useState(false);
  const [timestampData, setTimestampData] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}project/getAllProjects`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          const completedProjects = res.data.projects.filter(
            (project) => project.status?.toLowerCase() === "completed"
          );
          setProjects(completedProjects);
          
          // Extract unique values for filter dropdowns
          const clients = [...new Set(completedProjects.map(p => p.clientName || p.client))];
          const tasks = [...new Set(completedProjects.map(p => p.task_name || p.task))];
          const applications = [...new Set(completedProjects.map(p => p.application_name || p.application))];
          
          setClientList(clients);
          setTaskList(tasks);
          setApplicationList(applications);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Function to handle edit project
  const handleEditProject = (projectId) => {
    // Implement navigation to project form with pre-filled data
    console.log("Edit project with ID:", projectId);
    // Example: navigate(`/project/edit/${projectId}`);
  };

  // Function to copy server path to clipboard
  const handleCopyServerPath = (project) => {
    const serverPath = `\\\\server\\projects\\${project.id}`;
    navigator.clipboard.writeText(serverPath)
      .then(() => {
        alert("Server path copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  // Function to fetch timestamp data
  const handleShowTimestamp = async (projectId) => {
    try {
      const response = await axios.get(`${BASE_URL}project/timestamps/${projectId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setTimestampData(response.data);
      setShowTimestampModal(true);
    } catch (err) {
      console.error("Error fetching timestamp data:", err);
      // Fallback data for demonstration
      setTimestampData({
        stages: [
          { name: "Planning", startTime: new Date(), endTime: new Date(), duration: "2 days", handler: "John Doe", notes: "Initial planning completed" },
          { name: "Development", startTime: new Date(), endTime: new Date(), duration: "5 days", handler: "Jane Smith", notes: "Development phase completed" },
          { name: "Testing", startTime: new Date(), endTime: new Date(), duration: "1 day", handler: "Mike Johnson", notes: "All tests passed" }
        ],
        comparisons: [
          { stage: "Planning", expectedStart: new Date(), actualStart: new Date(), expectedEnd: new Date(), actualEnd: new Date(), variance: 0 },
          { stage: "Development", expectedStart: new Date(), actualStart: new Date(), expectedEnd: new Date(), actualEnd: new Date(), variance: 1 },
          { stage: "Testing", expectedStart: new Date(), actualStart: new Date(), expectedEnd: new Date(), actualEnd: new Date(), variance: -1 }
        ]
      });
      setShowTimestampModal(true);
    }
  };

  // Function to fetch project files
  const handleToggleFilesDropdown = async (projectId) => {
    if (showFilesDropdown === projectId) {
      setShowFilesDropdown(null);
    } else {
      try {
        // For demonstration, creating mock files data
        // Replace this with actual API call
        const mockFiles = [
          { id: 1, name: "file1.docx", language: "English", application: "Word", status: "Completed", lastUpdated: new Date() },
          { id: 2, name: "file2.xlsx", language: "French", application: "Excel", status: "In Progress", lastUpdated: new Date() },
          { id: 3, name: "file3.pptx", language: "German", application: "PowerPoint", status: "Pending", lastUpdated: new Date() }
        ];
        
        setSelectedFiles(mockFiles.map(file => ({
          ...file,
          selected: false
        })));
        setShowFilesDropdown(projectId);
      } catch (err) {
        console.error("Error fetching project files:", err);
      }
    }
  };

  // Function to handle file selection
  const handleFileSelection = (fileId) => {
    setSelectedFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId ? { ...file, selected: !file.selected } : file
      )
    );
  };

  // Function to update file status
  const handleUpdateFileStatus = () => {
    const selectedFileIds = selectedFiles
      .filter(file => file.selected)
      .map(file => file.id);
    
    if (selectedFileIds.length === 0) {
      alert("Please select at least one file");
      return;
    }
    
    // Implement API call to update file status
    console.log("Updating files:", selectedFileIds, "to Amends, Round:", amendsRound, "Deadline:", newDeadline);
    
    // Reset selections
    setSelectedFiles([]);
    setAmendsRound(1);
    setNewDeadline("");
    setShowFilesDropdown(null);
  };

  // Apply filters to projects
  const filteredProjects = projects.filter((project) => {
    // Check if project matches active tab
    const matchesTab = project.status?.toLowerCase() === activeTab.toLowerCase();
    
    // Check if project matches search query
    const matchesSearch =
      searchQuery === "" ||
      (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.clientName && project.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.country && project.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.projectManager && project.projectManager.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.projectManagerId && project.projectManagerId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.files && project.files.some((file) =>
        file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    // Check if project matches selected client
    const matchesClient = selectedClient === "" || 
                         project.clientName === selectedClient || 
                         project.client === selectedClient;
    
    // Check if project matches selected task
    const matchesTask = selectedTask === "" || 
                       project.task_name === selectedTask || 
                       project.task === selectedTask;
    
    // Check if project matches selected application
    const matchesApplication = selectedApplications === "" || 
                              project.application_name === selectedApplications || 
                              project.application === selectedApplications;
    
    // Check if project matches selected month/year
    let matchesMonth = true;
    if (selectedMonth) {
      const projectDate = new Date(project.receiveDate || project.createdAt);
      const [year, month] = selectedMonth.split('-');
      matchesMonth = projectDate.getFullYear() === parseInt(year) && 
                    projectDate.getMonth() === parseInt(month) - 1;
    }
    
    return matchesTab && matchesSearch && matchesClient && matchesTask && matchesApplication && matchesMonth;
  });

  const calculateEfficiency = (expectedHours, actualHours) => {
    if (!expectedHours || !actualHours) return "-";
    const efficiency = ((expectedHours - actualHours) / expectedHours) * 100;
    return `${efficiency.toFixed(1)}%`;
  };

  // Helper function to safely get nested properties
  const getProjectProperty = (project, properties, defaultValue = "-") => {
    for (const prop of properties) {
      if (project[prop] !== undefined && project[prop] !== null) {
        return project[prop];
      }
    }
    return defaultValue;
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="row g-3 mb-3">
        {/* Client Filter - Single Select */}
        <div className="col-md-3">
          <label className="form-label text-dark">Client</label>
          <select
            className="form-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">All Clients</option>
            {clientList.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        {/* Task Filter - Single Select */}
        <div className="col-md-3">
          <label className="form-label text-dark">Task</label>
          <select
            className="form-select"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
          >
            <option value="">All Tasks</option>
            {taskList.map((task) => (
              <option key={task} value={task}>
                {task}
              </option>
            ))}
          </select>
        </div>

        {/* Applications Filter - Multi Select */}
        <div className="col-md-3">
          <label className="form-label text-dark">Applications</label>
          <select
            className="form-select"
            value={selectedApplications}
            onChange={(e) => setSelectedApplications(e.target.value)}
          >
            <option value="">All Applications</option>
            {applicationList.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select>
        </div>

        {/* Month/Year Filter */}
        <div className="col-md-3">
          <label className="form-label text-dark">Month/Year</label>
          <input
            type="month"
            className="form-control"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-dark">Loading Projects...</p>
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
              <th className="text-dark">S. No.</th>
              <th className="text-dark">Project Title</th>
              <th className="text-dark">Client Alise Name</th>
              <th className="text-dark">Country</th>
              <th className="text-dark">Project Manager</th>
              <th className="text-dark">Task</th>
              <th className="text-dark">Languages</th>
              <th className="text-dark">Application</th>
              <th className="text-dark">Total Pages</th>
              <th className="text-dark">Received Date</th>
              <th className="text-dark">Estimated Hrs</th>
              <th className="text-dark">Actual Hrs</th>
              <th className="text-dark">Cost with Currency</th>
              <th className="text-dark">Cost in INR</th>
              <th className="text-end text-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr className="text-center">
                    <td className="text-dark">{index + 1}</td>
                    <td className="text-dark">
                      {getProjectProperty(project, ['projectTitle', 'title', 'name'])}
                      <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                        {getProjectProperty(project, ['status'])}
                      </span>
                    </td>
                    <td className="text-dark">{getProjectProperty(project, ['clientName', 'client'])}</td>
                    <td className="text-dark">{getProjectProperty(project, ['country'])}</td>
                    <td className="text-dark">{getProjectProperty(project, ['projectManagerId', 'projectManager'])}</td>
                    <td className="text-dark">
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {getProjectProperty(project, ['task_name', 'task'])}
                      </span>
                    </td>
                    <td className="text-dark">
                      <span className="badge bg-success bg-opacity-10 text-success">
                        {getProjectProperty(project, ['language_name', 'language'])}
                      </span>
                    </td>
                    <td className="text-dark">
                      <span className="badge bg-purple bg-opacity-10 text-purple">
                        {getProjectProperty(project, ['application_name', 'application'])}
                      </span>
                    </td>
                    <td className="text-dark">{getProjectProperty(project, ['totalProjectPages', 'totalPages'])}</td>
                    <td className="text-dark">
                      {project.receiveDate
                        ? new Date(project.receiveDate).toLocaleDateString()
                        : project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-dark">{getProjectProperty(project, ['estimatedHours', 'expectedHours'])}</td>
                    <td className="text-dark">{getProjectProperty(project, ['hourlyRate', 'actualHours'])}</td>
                    {/* <td className="text-dark">
                      {calculateEfficiency(
                        getProjectProperty(project, ['expectedHours', 'estimatedHours'], null),
                        getProjectProperty(project, ['actualHours', 'hourlyRate'], null)
                      )}
                    </td> */}
                    <td className="text-dark">
                      {project.currency 
                        ? `${project.currency} ${getProjectProperty(project, ['cost', 'projectCost'])}`
                        : "-"}
                    </td>
                    <td className="text-dark">{project.totalCost ? `₹${project.totalCost}` : "-"}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditProject(project.id)}
                          className="btn btn-sm btn-success"
                          title="Edit Project"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        
                        {/* Server Path Copy Button */}
                        <button
                          onClick={() => handleCopyServerPath(project)}
                          className="btn btn-sm btn-info"
                          title="Copy Server Path"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                        
                        {/* Time Stamp Button */}
                        <button
                          onClick={() => handleShowTimestamp(project.id)}
                          className="btn btn-sm btn-warning"
                          title="Show Timestamps"
                        >
                          <i className="fas fa-clock"></i>
                        </button>
                        
                        {/* Project Files Dropdown Button */}
                        <div className="dropdown">
                          <button
                            onClick={() => handleToggleFilesDropdown(project.id)}
                            className="btn btn-sm btn-primary dropdown-toggle"
                            title="Project Files"
                          >
                            <i className="fas fa-folder"></i>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Project Files Dropdown - FIXED TEXT VISIBILITY */}
                  {showFilesDropdown === project.id && (
                    <tr>
                      <td colSpan="16" className="p-0">
                        <div className="card">
                          <div className="card-header d-flex justify-content-between align-items-center bg-light">
                            <h5 className="mb-0 text-dark">Project Files</h5>
                            <button 
                              className="btn btn-sm btn-secondary" 
                              onClick={() => setShowFilesDropdown(null)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <div className="card-body bg-white">
                            <div className="table-responsive">
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th>
                                      <input 
                                        type="checkbox" 
                                        className="form-check-input"
                                        onChange={(e) => {
                                          const allSelected = e.target.checked;
                                          setSelectedFiles(prevFiles => 
                                            prevFiles.map(file => ({ ...file, selected: allSelected }))
                                          );
                                        }}
                                        checked={selectedFiles.length > 0 && selectedFiles.every(file => file.selected)}
                                      />
                                    </th>
                                    <th className="text-dark">File Name</th>
                                    <th className="text-dark">Language</th>
                                    <th className="text-dark">Application</th>
                                    <th className="text-dark">Status</th>
                                    <th className="text-dark">Last Updated</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedFiles.map((file) => (
                                    <tr key={file.id}>
                                      <td>
                                        <input 
                                          type="checkbox" 
                                          className="form-check-input"
                                          checked={file.selected || false}
                                          onChange={() => handleFileSelection(file.id)}
                                        />
                                      </td>
                                      <td className="text-dark">{file.name}</td>
                                      <td className="text-dark">{file.language}</td>
                                      <td className="text-dark">{file.application}</td>
                                      <td className="text-dark">
                                        <span className={`badge ${file.status === 'Completed' ? 'bg-success' : file.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'}`}>
                                          {file.status}
                                        </span>
                                      </td>
                                      <td className="text-dark">{new Date(file.lastUpdated).toLocaleDateString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            <div className="row mt-3">
                              <div className="col-md-4">
                                <label className="form-label text-dark">Amends Round</label>
                                <select 
                                  className="form-select"
                                  value={amendsRound}
                                  onChange={(e) => setAmendsRound(parseInt(e.target.value))}
                                >
                                  {[...Array(10)].map((_, i) => (
                                    <option key={i+1} value={i+1}>{i+1}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label text-dark">New Deadline</label>
                                <input 
                                  type="date" 
                                  className="form-control"
                                  value={newDeadline}
                                  onChange={(e) => setNewDeadline(e.target.value)}
                                />
                              </div>
                              <div className="col-md-4 d-flex align-items-end">
                                <button 
                                  className="btn btn-primary w-100"
                                  onClick={handleUpdateFileStatus}
                                >
                                  Mark as Amends
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="text-center text-dark">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      
      {/* Timestamp Modal - FIXED TEXT VISIBILITY */}
      {showTimestampModal && timestampData && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title text-dark">Project Timeline Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowTimestampModal(false)}
                ></button>
              </div>
              <div className="modal-body bg-white">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="bg-light">
                      <tr>
                        <th className="text-dark">Stage</th>
                        <th className="text-dark">Start Time</th>
                        <th className="text-dark">End Time</th>
                        <th className="text-dark">Duration</th>
                        <th className="text-dark">Assigned Handler</th>
                        <th className="text-dark">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timestampData.stages.map((stage, index) => (
                        <tr key={index}>
                          <td className="text-dark">{stage.name}</td>
                          <td className="text-dark">{new Date(stage.startTime).toLocaleString()}</td>
                          <td className="text-dark">{new Date(stage.endTime).toLocaleString()}</td>
                          <td className="text-dark">{stage.duration}</td>
                          <td className="text-dark">{stage.handler}</td>
                          <td className="text-dark">{stage.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4">
                  <h6 className="text-dark">Expected vs Actual Timeline</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="bg-light">
                        <tr>
                          <th className="text-dark">Stage</th>
                          <th className="text-dark">Expected Start</th>
                          <th className="text-dark">Actual Start</th>
                          <th className="text-dark">Expected End</th>
                          <th className="text-dark">Actual End</th>
                          <th className="text-dark">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timestampData.comparisons.map((comp, index) => (
                          <tr key={index}>
                            <td className="text-dark">{comp.stage}</td>
                            <td className="text-dark">{new Date(comp.expectedStart).toLocaleDateString()}</td>
                            <td className="text-dark">{new Date(comp.actualStart).toLocaleDateString()}</td>
                            <td className="text-dark">{new Date(comp.expectedEnd).toLocaleDateString()}</td>
                            <td className="text-dark">{new Date(comp.actualEnd).toLocaleDateString()}</td>
                            <td className={comp.variance > 0 ? 'text-danger' : comp.variance < 0 ? 'text-success' : 'text-dark'}>
                              {comp.variance} days
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowTimestampModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedProjects;