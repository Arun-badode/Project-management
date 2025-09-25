import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectsTable from "./ProjectsTable";
import ProjectDetails from "./ProjectDetails";
import BASE_URL from "../../../config";

const TaskManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isManager, setIsManager] = useState(true);
  const [activeProjectTab, setActiveProjectTab] = useState("all");
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [showEmployeeProjects, setShowEmployeeProjects] = useState(false);

  // Handler functions - defined before useEffect
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setExpandedRow(expandedRow === project.id ? null : project.id);
  };

  const handleMarkComplete = (id) => {
    if (
      window.confirm("Are you sure you want to mark this project as complete?")
    ) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  // Handle employee selection
  const handleEmployeeSelect = (employeeId) => {
    setEmployeeFilter(employeeId);
    setShowEmployeeProjects(!!employeeId);
  };

  // Fetch projects and employee data on component mount
  useEffect(() => {
    // लोकल स्टोरेज से टोकन प्राप्त करें
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
    
    // Fetch employee data from API using Axios
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        
        // हेडर में टोकन के साथ API कॉल करें
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        const response = await axios.get(
          `${BASE_URL}member/getAllMembers`, 
          config
        );
        
        if (response.data.status) {
          // Transform API data to match the format we need
          const formattedEmployees = response.data.data.map(emp => ({
            id: emp.empId,
            name: emp.fullName,
            team: emp.team,
            role: emp.role,
            appSkills: emp.appSkills,
            status: emp.status
          }));
          setEmployeeData(formattedEmployees);
        } else {
          setError(response.data.message || "Failed to fetch employee data");
        }
      } catch (err) {
        // Axios error handling
        if (err.response) {
          // Server responded with error status
          setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else if (err.request) {
          // Request made but no response received
          setError("Network error: No response received from server");
        } else {
          // Error in request setup
          setError("Error fetching employee data: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch projects data from API
    const fetchProjectsData = async () => {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        const response = await axios.get(
          `${BASE_URL}project/getAllProjects`, 
          config
        );
        
        if (response.data.status) {
          setProjects(response.data.data);
          setFilteredProjects(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch projects data");
        }
      } catch (err) {
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else if (err.request) {
          setError("Network error: No response received from server");
        } else {
          setError("Error fetching projects data: " + err.message);
        }
      }
    };
    
    fetchEmployeeData();
    fetchProjectsData();
  }, []);

  // Filter projects based on search term, status filter, team filter, client filter and employee filter
  useEffect(() => {
    let filtered = projects?.filter((project) => {
      // Search filter - check if search term matches project title, client, or task
      const matchesSearch = searchTerm === "" || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.task.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      
      // Client filter
      const matchesClient = clientFilter === "All" || project.client === clientFilter;
      
      return matchesSearch && matchesStatus && matchesClient;
    });
    
    // Apply team-based filtering logic
    if (teamFilter === "Adobe" || teamFilter === "MS Office") {
      // For Adobe and MS Office teams, filter projects by platform
      filtered = filtered?.filter(project => 
        project?.platform === teamFilter && 
        (isManager || project.assignedByManager)
      );
    } else if (teamFilter === "QA") {
      // For QA Team, show all projects
      filtered = filtered;
    } else if (teamFilter !== "All") {
      filtered = filtered.filter(project => project.platform === teamFilter);
    }
    
    // Apply employee filter if selected
    if (employeeFilter) {
      filtered = filtered?.filter(project => 
        project?.assignedEmployee && 
        project?.assignedEmployee === parseInt(employeeFilter)
      );
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, teamFilter, clientFilter, employeeFilter, isManager]);

  // Get unique clients for the client filter dropdown
  const uniqueClients = [...new Set(projects?.map(project => project.client))];

  // Get employee name by ID
  const getEmployeeNameById = (id) => {
    const employee = employeeData.find(emp => emp.id === parseInt(id));
    return employee ? employee.name : "Unknown";
  };

  // Get employee details by ID
  const getEmployeeDetailsById = (id) => {
    return employeeData.find(emp => emp.id === parseInt(id));
  };

  // Get employees by team
  const getEmployeesByTeam = (team) => {
    if (team === "All") return employeeData;
    return employeeData.filter(emp => emp.team === team);
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
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="row g-3 align-items-center">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Ready for QA">Ready for QA</option>
                      <option value="QA Review">QA Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    {loading ? (
                      <select className="form-select" disabled>
                        <option>Loading employees...</option>
                      </select>
                    ) : error ? (
                      <select className="form-select" disabled>
                        <option>Error loading employees</option>
                      </select>
                    ) : (
                      <select
                        className="form-select"
                        value={employeeFilter}
                        onChange={(e) => handleEmployeeSelect(e.target.value)}
                      >
                        <option value="">All Employees</option>
                        {getEmployeesByTeam(teamFilter)
                          .sort((a, b) => a.name.localeCompare(b.name)) 
                          .map(emp => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name} 
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6 text-md-end">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    <button
                      className={`gradient-button ${teamFilter === "All" ? "active" : ""}`}
                      onClick={() => setTeamFilter("All")}
                    >
                      All
                    </button>
                    <button
                      className={`gradient-button ${teamFilter === "MS Office" ? "active" : ""}`}
                      onClick={() => setTeamFilter("MS Office")}
                    >
                      Ms Office
                    </button>
                    <button
                      className={`gradient-button ${teamFilter === "Adobe" ? "active" : ""}`}
                      onClick={() => setTeamFilter("Adobe")}
                    >
                      Adobe
                    </button>
                    <button
                      className={`gradient-button ${teamFilter === "QA" ? "active" : ""}`}
                      onClick={() => setTeamFilter("QA")}
                    >
                      QA
                    </button>
                  </div>
                
                  <span className="text-light small ms-3">
                    Today: 2025-06-24, Tuesday
                  </span>
                </div>
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

        {/* Show content based on active tab */}
        {activeProjectTab === "all" && (
          <>
            {showEmployeeProjects ? (
              // Show selected employee and their projects
              <div className="card bg-card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      <div className="avatar-circle">
                        {getEmployeeDetailsById(employeeFilter)?.name?.charAt(0) || "U"}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-light mb-1">
                        {getEmployeeDetailsById(employeeFilter)?.name || "Unknown Employee"}
                      </h4>
                      <p className="text-light mb-0">
                        {getEmployeeDetailsById(employeeFilter)?.role || "No role specified"} • 
                        {getEmployeeDetailsById(employeeFilter)?.team || "No team specified"}
                      </p>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-light ms-auto"
                      onClick={() => {
                        setEmployeeFilter("");
                        setShowEmployeeProjects(false);
                      }}
                    >
                      Back to All Employees
                    </button>
                  </div>
                  
                  <ProjectsTable
                    projects={filteredProjects}
                    teamFilter={teamFilter}
                    isManager={isManager}
                    employeeData={employeeData}
                    getEmployeeNameById={getEmployeeNameById}
                    onViewProject={handleViewProject}
                    onMarkComplete={handleMarkComplete}
                    onDeleteProject={handleDeleteProject}
                    expandedRow={expandedRow}
                    onReassign={(id) => console.log("Reassign project", id)}
                    onViewDetails={(id) => console.log("View details", id)}
                  />
                </div>
              </div>
            ) : (
              // Show all projects table when no employee is selected
              <div className="card bg-card">
                <div className="card-body">
                  <ProjectsTable
                    projects={filteredProjects}
                    teamFilter={teamFilter}
                    isManager={isManager}
                    employeeData={employeeData}
                    getEmployeeNameById={getEmployeeNameById}
                    onViewProject={handleViewProject}
                    onMarkComplete={handleMarkComplete}
                    onDeleteProject={handleDeleteProject}
                    expandedRow={expandedRow}
                    onReassign={(id) => console.log("Reassign project", id)}
                    onViewDetails={(id) => console.log("View details", id)}
                  />
                </div>
              </div>
            )}
            
            {selectedProject && expandedRow === selectedProject.id && (
              <ProjectDetails
                project={selectedProject}
                teamFilter={teamFilter}
                employeeData={employeeData}
                getEmployeeNameById={getEmployeeNameById}
                onClose={() => setExpandedRow(null)}
              />
            )}
          </>
        )}

        {/* Show My Tasks content based on active tab - now empty */}
        {activeProjectTab === "my" && (
          <div className="card bg-card">
            <div className="card-body text-center py-5">
              <h4 className="text-light">No tasks assigned to you</h4>
              <p className="text-light">Your assigned tasks will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;