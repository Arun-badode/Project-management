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
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  console.log("Active Tab:", activeProjectTab);
  console.log("User Role:", userRole);
  console.log("User ID:", userId);

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

    console.log("User Info - Role:", role, "ID:", id);

    setUserRole(role);
    setUserId(id);

    // Set states based on role
    // NOTE: यहाँ हम 'Manager' (case-sensitive) check कर रहे हैं
    if (role === 'Manager' || role === 'manager') {
      setIsManager(true);
      setIsTeamMember(false);
    } else if (role === 'admin' || role === 'Admin') {
      setIsManager(false);
      setIsTeamMember(false);
    } else {
      // All other roles are considered team members
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
        
        // ALWAYS fetch all projects for this demo
        // In real app, you might fetch based on role
        response = await axios.get(
          `${BASE_URL}project/getAllProjects`,
          config
        );

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
          console.log("Total projects fetched:", projectsData.length);
          
          // Debug: Show if any projects are assigned to current user
          if (id) {
            const userProjects = projectsData.filter(project => {
              return project.assignedEmployee === id || 
                     project.assignedTo === id ||
                     (project.assignedEmployee && project.assignedEmployee.id === id);
            });
            console.log("Projects assigned to current user:", userProjects.length);
          }
          
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
      .then(() => {
        console.log("Data loading complete");
        setLoading(false);
      })
      .catch(err => {
        console.error("Error in data fetching:", err);
        setLoading(false);
      });
  }, []);

  // Filter projects based on search term, status filter, team filter, client filter and employee filter
  useEffect(() => {
    console.log("Applying filters for tab:", activeProjectTab);
    
    let projectsToFilter = [...projects];
    
    // IMPORTANT: For "My Tasks" tab, show EMPTY array (no projects)
    if (activeProjectTab === "my") {
      // Always return empty array for My Tasks tab
      console.log("My Tasks tab - Showing empty projects list");
      setFilteredProjects([]);
      return;
    }
    
    // Only apply filters for "All Projects" tab
    let filtered = projectsToFilter.filter((project) => {
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
    if (teamFilter !== "All") {
      if (teamFilter === "QA") {
        // For QA Team, show all projects
        filtered = filtered;
      } else {
        filtered = filtered.filter(project => 
          project?.platform === teamFilter ||
          project?.applicationName === teamFilter
        );
      }
    }

    // Apply employee filter if selected
    if (employeeFilter) {
      filtered = filtered.filter(project => {
        return (
          (project?.assignedEmployee && 
          (project?.assignedEmployee === parseInt(employeeFilter) || 
           project?.assignedEmployee?.id === parseInt(employeeFilter) ||
           project?.assignedEmployee?.empId === employeeFilter)) ||
          project?.assignedTo === employeeFilter
        );
      });
    }

    console.log("Final filtered projects for All tab:", filtered.length);
    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, teamFilter, clientFilter, employeeFilter, activeProjectTab]);

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

  // Handle tab change
  const handleTabChange = (tab) => {
    console.log("Changing tab to:", tab);
    setActiveProjectTab(tab);
    
    // Reset filters when switching to My Tasks
    if (tab === "my") {
      setEmployeeFilter("");
      setShowEmployeeProjects(false);
    }
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
                        disabled={activeProjectTab === "my"} // Disable for My Tasks tab
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
                      disabled={activeProjectTab === "my"} // Disable for My Tasks tab
                    >
                      All
                    </button>
                    <button
                      className={`gradient-button ${teamFilter === "MS Office" ? "active" : ""}`}
                      onClick={() => setTeamFilter("MS Office")}
                      disabled={activeProjectTab === "my"} // Disable for My Tasks tab
                    >
                      Ms Office
                    </button>
                    <button
                      className={`gradient-button ${teamFilter === "Adobe" ? "active" : ""}`}
                      onClick={() => setTeamFilter("Adobe")}
                      disabled={activeProjectTab === "my"} // Disable for My Tasks tab
                    >
                      Adobe
                    </button>
                    <button
                      className={`gradient-button ${teamFilter === "QA" ? "active" : ""}`}
                      onClick={() => setTeamFilter("QA")}
                      disabled={activeProjectTab === "my"} // Disable for My Tasks tab
                    >
                      QA
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Active tab info */}
            <div className="mt-3">
              <small className="text-light">
                <strong>
                  {activeProjectTab === "all" ? "All Active Projects" : "My Tasks"}
                </strong>
                {activeProjectTab === "all" && ` | Showing ${filteredProjects.length} of ${projects.length} projects`}
                {activeProjectTab === "my" && " | No tasks assigned to you"}
              </small>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeProjectTab === "all" ? "active" : ""}`}
              onClick={() => handleTabChange("all")}
            >
              All Active Projects
            </button>
          </li>
          {/* ALWAYS show My Tasks tab for testing */}
          <li className="nav-item">
            <button
              className={`nav-link ${activeProjectTab === "my" ? "active" : ""}`}
              onClick={() => handleTabChange("my")}
            >
              My Tasks
            </button>
          </li>
        </ul>

        {/* Show content based on active tab */}
        {loading ? (
          <div className="card bg-card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-light mt-3">Loading projects...</p>
            </div>
          </div>
        ) : (
          <>
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

            {/* My Tasks Tab - Always show empty */}
            {activeProjectTab === "my" && (
              <div className="card bg-card">
                <div className="card-body">
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <i className="fas fa-clipboard-list fa-4x text-light mb-4"></i>
                      <h3 className="text-light mb-3">My Tasks</h3>
                      <p className="text-light mb-2">
                        You don't have any tasks assigned to you at the moment.
                      </p>
                      <p className="text-light">
                        Check back later or contact your manager for new assignments.
                      </p>
                    </div>
                    
                    <div className="d-flex justify-content-center gap-3">
                      <button 
                        className="btn btn-outline-light"
                        onClick={() => handleTabChange("all")}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        View All Projects
                      </button>
                      
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          // Optional: Add functionality to request tasks
                          alert("Task request feature coming soon!");
                        }}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Request New Task
                      </button>
                    </div>
                  </div>
                  
                  {/* Optional: Show empty ProjectsTable for consistency */}
                  {/* <div style={{ opacity: 0.5 }}>
                    <ProjectsTable
                      projects={[]}
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
                  </div> */}
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