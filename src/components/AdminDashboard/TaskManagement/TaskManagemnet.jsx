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
  const [isManager, setIsManager] = useState(false);
  const [activeProjectTab, setActiveProjectTab] = useState("all");
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [showEmployeeProjects, setShowEmployeeProjects] = useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");


  console.log("Employee Data:", employeeData);  console.log("Projects Data:", searchTerm);
  // Handler functions
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

  // Get user info from localStorage or sessionStorage
  const getUserInfo = () => {
    // Check multiple possible keys for role
    const role = localStorage.getItem('userRole') || 
                sessionStorage.getItem('userRole') ||
                localStorage.getItem('role') || 
                sessionStorage.getItem('role');
    
    // Check multiple possible keys for ID
    const id = localStorage.getItem('managerId') || 
               localStorage.getItem('userId') ||
               localStorage.getItem('employeeId') ||
               sessionStorage.getItem('managerId') || 
               sessionStorage.getItem('userId') ||
               sessionStorage.getItem('employeeId');

    setUserRole(role);
    setUserId(id);

    // Normalize role to lowercase for comparison
    const normalizedRole = role ? role.toLowerCase() : '';
    
    // Set states based on role
    if (normalizedRole === 'admin') {
      setIsManager(false);
    } else if (normalizedRole === 'Manager') {
      setIsManager(true);
    } else {
      setIsManager(false);
      setIsTeamMember(true);
    }

    return { role, id };
  };

  // Fetch projects and employee data on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }

    // Get user info
    const { role, id } = getUserInfo();
    
    // If no user ID found, log error and return
    if (!id) {
      console.error("No user ID found in localStorage or sessionStorage");
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    // Fetch employee data from API
    const fetchEmployeeData = async () => {
      try {
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
            id: emp.id || emp.empId, // Handle both id and empId
            empId: emp.empId,
            name: emp.fullName,
            team: emp.team || emp.designation, // Handle both team and designation
            role: emp.role || emp.designation,
            appSkills: emp.appSkills,
            status: emp.status
          }));
          setEmployeeData(formattedEmployees);
        } else {
          setError(response.data.message || "Failed to fetch employee data");
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else if (err.request) {
          setError("Network error: No response received from server");
        } else {
          setError("Error fetching employee data: " + err.message);
        }
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

        let response;
        const normalizedRole = role ? role.toLowerCase() : '';

        // Fetch projects based on user role
        if (normalizedRole === 'admin') {
          // Admin gets all projects
          response = await axios.get(
            `${BASE_URL}project/getAllProjects`,
            config
          );
        } else if (normalizedRole === 'Manager') {
          // Manager gets their projects
          response = await axios.get(
            `${BASE_URL}project/getProjectsByManagerId/${id}`,
            config
          );
        } else {
          // Other users get their assigned projects
          response = await axios.get(
            `${BASE_URL}project/getProjectsByUserId/${id}`,
            config
          );
        }

        console.log("Projects API response:", response.data);

        if (response.data.status) {
          // Handle different response structures
          let projectsData;
          
          if (response.data.data && Array.isArray(response.data.data)) {
            // Direct array of projects
            projectsData = response.data.data;
          } else if (response.data.data && response.data.data.projects && Array.isArray(response.data.data.projects)) {
            // Projects nested in data object
            projectsData = response.data.data.projects;
          } else if (response.data.data && response.data.data.members && Array.isArray(response.data.data.members)) {
            // Members with projects structure (for managers)
            // Flatten the projects from all members
            projectsData = [];
            response.data.data.members.forEach(member => {
              if (member.projects && Array.isArray(member.projects)) {
                projectsData = [...projectsData, ...member.projects];
              }
            });
          } else {
            console.error("Unexpected API response structure:", response.data);
            setError("Unexpected API response structure");
            projectsData = [];
          }
          
          console.log("Processed projects data:", projectsData);
          setProjects(projectsData);
          setFilteredProjects(projectsData);
        } else {
          setError(response.data.message || "Failed to fetch projects data");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else if (err.request) {
          setError("Network error: No response received from server");
        } else {
          setError("Error fetching projects data: " + err.message);
        }
      }
    };

    // Fetch both employee and project data
    Promise.all([fetchEmployeeData(), fetchProjectsData()])
      .then(() => setLoading(false))
      .catch(err => {
        console.error("Error in data fetching:", err);
        setLoading(false);
      });
  }, []);

  // Filter projects based on search term, status filter, team filter, client filter and employee filter
  useEffect(() => {
    let filtered = projects?.filter((project) => {
      // Search filter
      const matchesSearch = searchTerm === "" ||
        project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project?.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project?.task?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;

      // Client filter
      const matchesClient = clientFilter === "All" || project.client === clientFilter;

      return matchesSearch && matchesStatus && matchesClient;
    });

    // Apply team-based filtering logic
    if (teamFilter === "Adobe" || teamFilter === "MS Office") {
      filtered = filtered?.filter(project =>
        project?.platform === teamFilter ||
        project?.applicationName === teamFilter
      );
    } else if (teamFilter === "QA") {
      // For QA Team, show all projects
      filtered = filtered;
    } else if (teamFilter !== "All") {
      filtered = filtered.filter(project => 
        project?.platform === teamFilter ||
        project?.applicationName === teamFilter
      );
    }

    // Apply employee filter if selected
    if (employeeFilter) {
      filtered = filtered?.filter(project => {
        // Check different possible properties for assigned employee
        return (
          (project?.assignedEmployee && 
          (project?.assignedEmployee === parseInt(employeeFilter) || 
           project?.assignedEmployee?.id === parseInt(employeeFilter) ||
           project?.assignedEmployee?.empId === employeeFilter)) ||
          project?.assignedTo === employeeFilter
        );
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, teamFilter, clientFilter, employeeFilter, isManager]);

  // Get unique clients for the client filter dropdown
  const uniqueClients = [...new Set(projects?.map(project => project.client).filter(Boolean))];

  // Get employee name by ID
  const getEmployeeNameById = (id) => {
    const employee = employeeData.find(emp => 
      emp.id === parseInt(id) || 
      emp.empId === id
    );
    return employee ? employee.name : "Unknown";
  };

  // Get employee details by ID
  const getEmployeeDetailsById = (id) => {
    return employeeData.find(emp => 
      emp.id === parseInt(id) || 
      emp.empId === id
    );
  };

  // Get employees by team
  const getEmployeesByTeam = (team) => {
    if (team === "All") return employeeData;
    return employeeData.filter(emp => 
      emp.team === team || 
      emp.role === team ||
      emp.designation === team
    );
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
          {isTeamMember && (
            <li className="nav-item">
              <button
                className={`nav-link ${activeProjectTab === "my" ? "active" : ""}`}
                onClick={() => setActiveProjectTab("my")}
              >
                My Task
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
                    userRole={userRole}
                    userId={userId}
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
                    userRole={userRole}
                    userId={userId}
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

        {/* Show My Tasks content based on active tab */}
        {activeProjectTab === "my" && (
          <>
            {isManager && (
              <div className="card bg-card">
                <div className="card-body text-center py-5">
                  <h4 className="text-light">No tasks assigned to you</h4>
                  <p className="text-light">Your assigned tasks will appear here.</p>
                </div>
              </div>
            )}

            {isTeamMember && (
              <div className="card bg-card">
                <div className="card-body">
                  <ProjectsTable
                    projects={filteredProjects.filter(project => 
                      project.assignedEmployee === userId || 
                      project.assignedTo === userId
                    )}
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
                    userRole={userRole}
                    userId={userId}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;