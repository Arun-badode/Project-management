import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectsTable from "./ProjectsTable";
import ProjectDetails from "./ProjectDetails";

// Dummy data generator function
const generateDummyProjects = (count) => {
  const platforms = ["MS Office", "Adobe", "Web", "Mobile", "Desktop"];
  const statuses = ["In Progress", "Ready for QA", "QA Review", "Completed"];
  const clients = [
    "Stark Industries",
    "Wayne Enterprises",
    "Oscorp",
    "LexCorp",
    "Queen Consolidated",
  ];
  const languages = ["English", "Spanish", "French", "German", "Chinese"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Project ${i + 1}`,
    client: clients[Math.floor(Math.random() * clients.length)],
    task: `Task ${i + 1}`,
    language: languages[Math.floor(Math.random() * languages.length)],
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    totalPages: Math.floor(Math.random() * 50) + 5,
    dueDate: new Date(
      Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toLocaleString(),
    progress: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    handlers: Math.floor(Math.random() * 3) + 1,
    qaReviewers: Math.floor(Math.random() * 2) + 1,
    fileCount: Math.floor(Math.random() * 5) + 1,
    handlerNote: `Handler note for project ${i + 1}`,
    qaNote: `QA note for project ${i + 1}`,
    files: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      (_, j) => ({
        id: j + 1,
        name: `file${j + 1}.${["docx", "pdf", "xlsx", "psd"][j % 4]}`,
        pages: Math.floor(Math.random() * 20) + 1,
        language: languages[Math.floor(Math.random() * languages.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        stage: ["Not Started", "In Progress", "QC YTS", "Completed"][j % 4],
        assigned: new Date(
          Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        handler: `Handler ${j + 1}`,
        qaReviewer: `QA ${j + 1}`,
        qaStatus: ["Pending", "Approved", "Rejected"][j % 3],
      })
    ),
  }));
};

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
  const [authToken, setAuthToken] = useState(""); // टोकन स्टोर करने के लिए स्टेट

  // Generate dummy data on component mount
  useEffect(() => {
    const dummyProjects = generateDummyProjects(15);
    setProjects(dummyProjects);
    setFilteredProjects(dummyProjects);
    
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
          'https://eminoids-backend-production.up.railway.app/api/member/getAllMembers', 
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
    
    fetchEmployeeData();
  }, []);

  // Filter projects based on search term, status filter, team filter, client filter and employee filter
  useEffect(() => {
    let filtered = projects.filter((project) => {
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
      // For Adobe and MS Office teams, only show projects assigned by the Manager
      filtered = filtered.filter(project => 
        project.platform === teamFilter && 
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
      filtered = filtered.filter(project => 
        project.assignedEmployee && 
        project.assignedEmployee.id === employeeFilter
      );
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, teamFilter, clientFilter, employeeFilter, isManager]);

  // Mock data for "My Tasks" (for manager view)
  const myTasks = [
    {
      id: 4,
      title: "Marketing Strategy",
      client: "Stark Industries",
      task: "Formatting",
      language: "English",
      platform: "MS Office",
      totalPages: 15,
      dueDate: "11:00 AM 27-06-25",
      progress: 40,
      status: "In Progress",
      handlers: 1,
      qaReviewers: 1,
      fileCount: 3,
      handlerNote: "Developing Q3 marketing plan. Need budget approval.",
      qaNote: "Awaiting initial draft for review.",
      files: [
        {
          id: 1,
          name: "strategy.docx",
          pages: 15,
          language: "English",
          platform: "MS Office",
          stage: "In Progress",
          assigned: "21-06-25",
          handler: "You",
          qaReviewer: "Sophia Miller",
          qaStatus: "Pending",
        },
      ],
    },
  ];

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

  // Get unique clients for the client filter dropdown
  const uniqueClients = [...new Set(projects.map(project => project.client))];

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
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                      >
                        <option value="">All Employees</option>
                        {employeeData
                          .filter(emp => teamFilter === "All" || emp.team === teamFilter)
                          .sort((a, b) => a.name.localeCompare(b.name)) // नाम के अनुसार सॉर्ट करें
                          .map(emp => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name} {/* केवल कर्मचारी का नाम दिखाएं */}
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
            <ProjectsTable
              projects={filteredProjects}
              teamFilter={teamFilter}
              isManager={isManager}
              onViewProject={handleViewProject}
              onMarkComplete={handleMarkComplete}
              onDeleteProject={handleDeleteProject}
              expandedRow={expandedRow}
            />
            {selectedProject && expandedRow === selectedProject.id && (
              <ProjectDetails
                project={selectedProject}
                teamFilter={teamFilter}
                onClose={() => setExpandedRow(null)}
              />
            )}
          </>
        )}

        {/* Show My Tasks content based on active tab */}
        {activeProjectTab === "my" && (
          <>
            <ProjectsTable
              projects={myTasks}
              teamFilter={teamFilter}
              isManager={isManager}
              onViewProject={handleViewProject}
              onMarkComplete={handleMarkComplete}
              onDeleteProject={handleDeleteProject}
              expandedRow={expandedRow}
            />
            {selectedProject && expandedRow === selectedProject.id && (
              <ProjectDetails
                project={selectedProject}
                teamFilter={teamFilter}
                onClose={() => setExpandedRow(null)}
              />
            )}
          </>
        )}

        {/* Project Details */}
        {selectedProject && expandedRow === selectedProject.id && (
          <ProjectDetails
            project={selectedProject}
            teamFilter={teamFilter}
            onClose={() => setExpandedRow(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TaskManagement;