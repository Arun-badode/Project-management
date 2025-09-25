import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import BASE_URL from "../../../config";

const ProjectsTable = ({
  projects,
  teamFilter,
  isManager,
  onMarkComplete,
  onDeleteProject,
  onReassign,
  onViewDetails,
}) => {
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const tableWrapperRef = useRef(null);
  const token = localStorage.getItem("authToken");
  
  // Try multiple possible keys for user ID
  const [userId, setUserId] = useState(null);

  const [Employeeprojects, setEmployeeProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null); // tracks which project row is expanded
  const [projectFiles, setProjectFiles] = useState({}); // stores files for each project
  const [filesLoading, setFilesLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState({}); // stores detailed project info
  const [inputValue, setInputValue] = useState(""); // for the input field at the bottom
  const [readyForOCDue, setReadyForOCDue] = useState('');
  const [ocAllocatedHours, setOCAllocatedHours] = useState(0);
  const [ocDue, setOCDue] = useState('-');
  const [priority, setPriority] = useState('Mid');
  const [currentProjectId, setCurrentProjectId] = useState(null); // Track the current project being edited
  
  // Reassign modal state
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reassignLoading, setReassignLoading] = useState(false);
  
  // Details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [projectFullDetails, setProjectFullDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);
   const [fileHandlers, setFileHandlers] = useState({});
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-primary";
      case "QA Review":
        return "bg-info";
      case "Ready for QA":
        return "bg-warning";
      case "Completed":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  // Map status to a default progress percentage
  const getStatusProgress = (status) => {
    switch (status) {
      case "In Progress":
        return 50;
      case "QA Review":
        return 80;
      case "Ready for QA":
        return 90;
      case "Completed":
        return 100;
      default:
        return 10; // small default for unknown or not started
    }
  };

  // Try to get user ID from various sources
  useEffect(() => {
    const getUserId = () => {
      // Try multiple possible keys
      const possibleKeys = [
        "userId", 
        "id", 
        "user_id", 
        "managerId", 
        "manager_id",
        "employeeId",
        "employee_id"
      ];
      
      for (const key of possibleKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          console.log(`Found user ID with key "${key}": ${value}`);
          return value;
        }
      }
      
      // Try to parse user info from token if it's a JWT
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("Token payload:", payload);
            
            // Check various possible ID fields in the token
            const idFields = ["userId", "id", "user_id", "sub", "managerId", "employeeId"];
            for (const field of idFields) {
              if (payload[field]) {
                console.log(`Found user ID in token field "${field}": ${payload[field]}`);
                return payload[field];
              }
            }
          }
        } catch (err) {
          console.error("Error parsing token:", err);
        }
      }
      
      console.log("User ID not found in localStorage or token");
      return null;
    };
    
    const id = getUserId();
    setUserId(id);
    
    // If no user ID is found, show an alert
    if (!id) {
      console.error("User ID not found. Please check localStorage keys or token format.");
      // We don't show an alert here because it might be annoying for the user
      // Instead, we'll handle it when they try to reassign
    }
  }, [token]);

  // Fetch project files for a specific project
  const fetchProjectFiles = async (projectId) => {
    // If we already have the files for this project, don't fetch again
    if (projectFiles[projectId]) {
      return;
    }

    setFilesLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}projectFiles/getAllProjectFiles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          projectId: projectId
        }
      });

      // Store files for this project
      setProjectFiles(prev => ({
        ...prev,
        [projectId]: response.data.data.filter(file => file.projectId === projectId)
      }));
    } catch (err) {
      console.error("Error fetching project files", err);
    } finally {
      setFilesLoading(false);
    }
  };

  // Fetch detailed project information
  const fetchProjectDetails = async (projectId) => {
    // If we already have the details for this project, don't fetch again
    if (projectDetails[projectId]) {
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}project/getProjectById`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          projectId: projectId
        }
      });

      // Store project details
      setProjectDetails(prev => ({
        ...prev,
        [projectId]: response.data.data
      }));
    } catch (err) {
      console.error("Error fetching project details", err);
    }
  };

  // Fetch full project details for the Details modal
  const fetchFullProjectDetails = async (projectId) => {
    setDetailsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}project/getProjectFullDetails`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          projectId: projectId
        }
      });
      
      setProjectFullDetails(response.data.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error fetching full project details", err);
      alert("Failed to load project details");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch available employees for reassignment
  const fetchAvailableEmployees = async (currentTeam) => {
    try {
      const response = await axios.get(`${BASE_URL}member/getAllMembers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          team: currentTeam
        }
      });
      console.log("api response", response.data.data);
      
      
      setAvailableEmployees(response.data.data);
    } catch (err) {
      console.error("Error fetching available employees", err);
      alert("Failed to load available employees");
    }
  };

  // Handle Reassign button click
  const handleReassignClick = (project) => {
    setSelectedProject(project);
    // Fetch employees from the same team as the project
    fetchAvailableEmployees(project.applicationName === "Adobe" ? "Adobe" : 
                          project.applicationName === "MS Office" ? "MS Office" : "QA");
    setShowReassignModal(true);
  };

  // Handle project reassignment
const handleReassignSubmit = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee to reassign the project");
      return;
    }

    setReassignLoading(true);
    try {
      // Get the selected employee details
      const employee = availableEmployees.find(emp => emp.id === parseInt(selectedEmployee));
      if (!employee) {
        alert("Invalid employee selected");
        return;
      }

      // Make the API call to reassign the project
      // Using project ID in the URL instead of user ID
      const response = await axios.put(
        `${BASE_URL}project/projects/manager/${selectedProject.id}`, // Using project ID in the URL
        {
          projectManagerId: parseInt(selectedEmployee) // Send the selected employee ID as projectManagerId
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert('Project reassigned successfully!');
        setShowReassignModal(false);
        setSelectedEmployee('');
        
        // Update the project in the state to move it to the new employee
        setEmployeeProjects(prev => {
          const newProjects = [...prev];
          
          // Find the project and remove it from its current employee
          let projectToMove = null;
          let sourceEmployeeIndex = -1;
          let projectIndex = -1;
          
          for (let i = 0; i < newProjects.length; i++) {
            const emp = newProjects[i];
            const projIndex = emp.projects.findIndex(p => p.id === selectedProject.id);
            
            if (projIndex !== -1) {
              projectToMove = {...emp.projects[projIndex]};
              projectToMove.assignedEmployee = {
                id: employee.id,
                fullName: employee.fullName,
                empId: employee.empId
              };
              
              // Remove the project from its current employee
              newProjects[i].projects.splice(projIndex, 1);
              
              // If the employee has no more projects, remove them from the list
              if (newProjects[i].projects.length === 0) {
                newProjects.splice(i, 1);
              }
              
              break;
            }
          }
          
          // If we found the project, add it to the new employee
          if (projectToMove) {
            // Check if the new employee already exists in our list
            let targetEmployeeIndex = newProjects.findIndex(emp => emp.empId === employee.empId);
            
            if (targetEmployeeIndex !== -1) {
              // Add the project to the existing employee
              newProjects[targetEmployeeIndex].projects.push(projectToMove);
            } else {
              // Create a new employee entry
              const team = employee.designation?.toLowerCase().includes("qa") ? "QA" :
                          employee.designation?.toLowerCase().includes("adobe") ? "Adobe" :
                          employee.designation?.toLowerCase().includes("ms office") ? "MS Office" : "Other";
              
              newProjects.push({
                empId: employee.empId,
                fullName: employee.fullName,
                designation: employee.designation,
                projects: [projectToMove]
              });
              
              // Sort employees by Employee ID in ascending order
              newProjects.sort((a, b) => a.empId.localeCompare(b.empId));
            }
          }
          
          return newProjects;
        });
        
        // Notify parent component if needed
        if (onReassign) {
          onReassign(selectedProject.id, selectedEmployee);
        }
      } else {
        alert(`Failed to reassign project: Server returned status ${response.status}`);
      }
    } catch (err) {
      console.error("Error reassigning project", err);
      if (err.response && err.response.status === 404) {
        alert("API endpoint not found. Please check the API URL.");
      } else {
        alert(`Error reassigning project: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setReassignLoading(false);
    }
  };

  // Handle Details button click
  const handleDetailsClick = (projectId) => {
    fetchFullProjectDetails(projectId);
  };

  // Handle save button click
  useEffect(() => {
    if (ocAllocatedHours > 0 && readyForOCDue) {
      // This is a simple calculation - you might need to adjust based on your business logic
      try {
        const dueDate = new Date(readyForOCDue);
        dueDate.setHours(dueDate.getHours() + ocAllocatedHours);
        setOCDue(dueDate.toLocaleString());
      } catch (err) {
        console.error("Error calculating due date", err);
        setOCDue('-');
      }
    } else {
      setOCDue('-');
    }
  }, [ocAllocatedHours, readyForOCDue]);

 const handleSave = async () => {
  if (!currentProjectId) {
    alert('No project selected');
    return;
  }

  try {
    // Calculate the QC due date properly
    let qcDueDateValue = null;
    if (readyForOCDue && ocAllocatedHours > 0) {
      try {
        const dueDate = new Date(readyForOCDue);
        dueDate.setHours(dueDate.getHours() + ocAllocatedHours);
        qcDueDateValue = dueDate.toISOString().slice(0, 16);
      } catch (err) {
        console.error("Error calculating due date", err);
      }
    }

    // Prepare the data for the API call
    const updateData = {
      readyQCDeadline: readyForOCDue,
      qcHrs: ocAllocatedHours,
      qcDueDate: qcDueDateValue,
      status: priority === 'High' ? 'In Progress' : 'Ready for QA'
    };

    // Make the API call to update the project
    const response = await axios.patch(
      `${BASE_URL}project/updateProject/${currentProjectId}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if the response status is in the 2xx range (success)
    if (response.status >= 200 && response.status < 300) {
      alert('Data saved successfully!');
      
      // Update the project details in the state
      setProjectDetails(prev => ({
        ...prev,
        [currentProjectId]: {
          ...prev[currentProjectId],
          ...updateData
        }
      }));
      
      // Reset form
      setReadyForOCDue('');
      setOCAllocatedHours(0);
      setOCDue('-');
      setPriority('Mid');
      setInputValue('');
    } else {
      // Handle non-success status codes
      alert(`Failed to save data: Server returned status ${response.status}`);
    }
  } catch (err) {
    console.error("Error updating project", err);
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", err.response.data);
      console.error("Error response status:", err.response.status);
      console.error("Error response headers:", err.response.headers);
      alert(`Error saving data: ${err.response.status} - ${err.response.data?.message || err.message}`);
    } else if (err.request) {
      // The request was made but no response was received
      console.error("Error request:", err.request);
      alert('Error saving data: No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', err.message);
      alert('Error saving data: ' + err.message);
    }
  }
};

  const handleClose = () => {
    // Implement close functionality
    if (window.confirm('Are you sure you want to close without saving?')) {
      // Reset form or navigate away
      setReadyForOCDue('');
      setOCAllocatedHours(0);
      setOCDue('-');
      setPriority('Mid');
      setInputValue('');
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setInputValue("");
  };

  // Scroll synchronization
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const fakeScrollbar = fakeScrollbarRef.current;
    const tableWrapper = tableWrapperRef.current;
    if (!scrollContainer || !fakeScrollbar || !tableWrapper) return;

    const updateScrollbar = () => {
      const needsScroll =
        scrollContainer.scrollWidth > scrollContainer.clientWidth;
      fakeScrollbar.style.display = needsScroll ? "block" : "none";
      const scrollContent = fakeScrollbar.querySelector(".scroll-content");
      if (scrollContent) {
        scrollContent.style.width = `${scrollContainer.scrollWidth}px`;
      }
      fakeScrollbar.style.width = `${tableWrapper.clientWidth}px`;
    };

    const handleScroll = () => {
      fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
    };

    const handleFakeScroll = () => {
      scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
    };

    updateScrollbar();
    scrollContainer.addEventListener("scroll", handleScroll);
    fakeScrollbar.addEventListener("scroll", handleFakeScroll);
    window.addEventListener("resize", updateScrollbar);


    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      fakeScrollbar.removeEventListener("scroll", handleFakeScroll);
      window.removeEventListener("resize", updateScrollbar);
    };
  }, [Employeeprojects]);

   const [members, setMembers] = useState([]);
  
   useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}member/getAllMembers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // Add this for debugging
        
        if (response.data && response.data.status) {
          setMembers(response.data.data);
          console.log("Members set:", response.data.data); // Add this for debugging
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        // You might want to add error state handling here
      }
    };
  
    fetchMembers();
  }, [token]); // Add token as a dependency if it's not already defined inside the component
  

   const handleHandlerChange = async (fileId, newHandler) => {
      try {
        // Call API to assign handler to file
        const response = await axios.patch(
          `${BASE_URL}projectFiles/assignHandler/${fileId}`,
          { handler: newHandler },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.data.status) {
          // Update local state only if API call was successful
          const updatedHandlers = { ...fileHandlers };
          updatedHandlers[fileId] = newHandler;
          setFileHandlers(updatedHandlers);
          
          // Show success message
          alert("Handler assigned successfully!");
        } else {
          // Revert the change if API call failed
          alert("Failed to assign handler: " + response.data.message);
        }
      } catch (error) {
        console.error("Error assigning handler:", error);
        alert("Error assigning handler: " + (error.response?.data?.message || error.message));
      }
    };

    
  useEffect(() => {
    // If we're using filtered projects from props, transform them to match the expected structure
    if (projects && projects.length > 0) {
      // Group projects by employee for display
      const groupedByEmployee = {};

      projects.forEach(project => {
        // Create a mock employee structure for each project
        const employeeId = project.assignedEmployee?.id || "EMP001";
        const employeeName = project.assignedEmployee?.name || "John Doe";
        const employeeTeam = project.platform === "Adobe" ? "Adobe" :
          project.platform === "MS Office" ? "MS Office" : "QA";
        const employeeDesignation = employeeTeam === "QA" ? "QA Specialist" :
          employeeTeam === "Adobe" ? "Adobe Specialist" : "MS Office Specialist";

        if (!groupedByEmployee[employeeId]) {
          groupedByEmployee[employeeId] = {
            empId: employeeId,
            fullName: employeeName,
            designation: employeeDesignation,
            projects: []
          };
        }

        // Transform project to match expected structure
        const transformedProject = {
          id: project.id,
          projectTitle: project.title,
          clientName: project.client,
          taskName: project.task,
          languageName: project.language,
          applicationName: project.platform,
          totalProjectPages: project.totalPages,
          qcDueDate: project.dueDate,
          qcHrs: project.dueDate,
          receiveDate: project.dueDate,
          status: project.status,
          progress: project.progress,
          description: project.handlerNote,
          priority: "Medium",
          startDate: new Date().toLocaleDateString(),
          files: project.files || [],
          assignedEmployee: project.assignedEmployee || null
        };

        groupedByEmployee[employeeId].projects.push(transformedProject);
      });

      // Convert to array and sort by employee ID
      const employeeArray = Object.values(groupedByEmployee);
      employeeArray.sort((a, b) => a.empId.localeCompare(b.empId));

      setEmployeeProjects(employeeArray);
      setLoading(false);
    } else {
      // If no projects from props, fetch from API
      axios
        .get(`${BASE_URL}project/getAllMembersWithProjects`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // Filter employees based on team filter
          let filteredData = res.data.data;

          if (teamFilter !== "All") {
            filteredData = res.data.data.filter(employee => {
              // Determine employee team based on their projects or designation
              const employeeTeam = employee.designation?.toLowerCase().includes("qa") ? "QA" :
                employee.projects?.some(p => p.applicationName === "Adobe") ? "Adobe" :
                  employee.projects?.some(p => p.applicationName === "MS Office") ? "MS Office" : "Other";

              return employeeTeam === teamFilter;
            });
          }

          // Sort employees by Employee ID in ascending order
          filteredData.sort((a, b) => a.empId.localeCompare(b.empId));

          setEmployeeProjects(filteredData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching projects", err);
          setLoading(false);
        });
    }
  }, [projects, teamFilter, token]);

  const toggleRow = (projId) => {
    setExpandedRow((prev) => {
      const newExpandedRow = prev === projId ? null : projId;

      // If expanding the row, fetch the project files and details
      if (newExpandedRow === projId) {
        fetchProjectFiles(projId);
        fetchProjectDetails(projId);
        setCurrentProjectId(projId); // Set the current project ID when expanding
        
        // Pre-populate form with existing data if available
        if (projectDetails[projId]) {
          const details = projectDetails[projId];
          setReadyForOCDue(details.readyQCDeadline || '');
          setOCAllocatedHours(details.qcHrs || 0);
          setPriority(details.priority || 'Mid');
          
          // Calculate OC Due if we have both values
          if (details.readyQCDeadline && details.qcHrs) {
            try {
              const dueDate = new Date(details.readyQCDeadline);
              dueDate.setHours(dueDate.getHours() + details.qcHrs);
              setOCDue(dueDate.toLocaleString());
            } catch (err) {
              console.error("Error calculating due date", err);
              setOCDue('-');
            }
          }
        }
      } else {
        // Reset form when collapsing
        setReadyForOCDue('');
        setOCAllocatedHours(0);
        setOCDue('-');
        setPriority('Mid');
        setInputValue('');
        setCurrentProjectId(null);
      }

      return newExpandedRow;
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="position-relative"
      style={{ height: "10%", display: "flex", flexDirection: "column" }}
    >
      <div
        ref={tableWrapperRef}
        style={{
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: "500px",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            width: "100%",
          }}
          className="hide-scrollbar"
        >
          {Employeeprojects?.length > 0 ? (
            Employeeprojects.map((employee) => (
              <div className="table-responsive" key={employee.empId}>
                <table
                  className="table-gradient-bg align-middle mt-0 table table-bordered table-hover"
                  style={{ width: "100%" }}
                >
                  {/* Employee Header */}
                  <thead
                    className="table-gradient-bg"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#133EB3",
                      color: "white",
                    }}
                  >
                    <tr style={{ height: "50px" }}>
                      <td colSpan="100%">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0 20px",
                            height: "50px",
                            borderRadius: "4px",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                              {employee?.empId}
                            </div>
                            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                              {employee?.fullName}
                            </div>
                          </div>
                          <div>
                            <button
                              style={{
                                backgroundColor: "#ddd",
                                border: "none",
                                borderRadius: "12px",
                                padding: "5px 15px",
                                fontWeight: "bold",
                              }}
                            >
                              {employee.designation?.toLowerCase().includes("qa") ? "QA" :
                                employee.projects?.some(p => p.applicationName === "Adobe") ? "Adobe" :
                                  employee.projects?.some(p => p.applicationName === "MS Office") ? "MS Office" : "Other"}
                            </button>
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {employee.designation}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </thead>

                  {/* Project Table Head */}
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
                      <th>Client</th>
                      <th>Task</th>
                      <th>Language</th>
                      <th>Application</th>
                      <th>Total Pages</th>
                      <th>Assigned Pages</th>
                      <th>Deadline</th>
                      <th>Ready For Qc Deadline</th>
                      <th>QC Due</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employee.projects?.map((proj, index) => (
                      <React.Fragment key={proj.id}>
                        <tr className={expandedRow === proj.id ? "table-active" : ""}>
                          <td>{index + 1}</td>
                          <td>{proj.projectTitle}</td>
                          <td>{proj.clientName}</td>
                          <td>{proj.taskName}</td>
                          <td>{proj.languageName}</td>
                          <td>{proj.applicationName}</td>
                          <td>{proj.totalProjectPages}</td>
                          <td>54</td>
                          <td>{proj.qcDueDate}</td>
                          <td>{proj.qcHrs}</td>
                          <td>{proj.receiveDate}</td>
                          <td>{proj.status}</td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              {/* Progress Bar */}
                              <div className="progress w-100" style={{ height: "24px" }}>
                                <div
                                  className={`progress-bar ${getStatusColor(proj.status)}`}
                                  role="progressbar"
                                  style={{
                                    width: `${proj?.progress && proj.progress > 0
                                      ? proj.progress
                                      : getStatusProgress(proj.status)
                                      }%`,
                                  }}
                                  aria-valuenow={
                                    proj?.progress && proj.progress > 0
                                      ? proj.progress
                                      : getStatusProgress(proj.status)
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>

                              {/* Status & Percentage Below */}
                              <div style={{ marginTop: "4px", fontSize: "12px", textAlign: "center" }}>
                                <strong>
                                  {proj?.progress && proj.progress > 0
                                    ? proj.progress
                                    : getStatusProgress(proj.status)}
                                  %
                                </strong>{" "}
                                — {proj.status || "Unknown"}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => toggleRow(proj.id)}
                              >
                                <i
                                  className={`fas ${expandedRow === proj.id ? "fa-chevron-up" : "fa-eye"
                                    }`}
                                ></i>
                              </button>
                              {proj.progress === 100 && (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => onMarkComplete(proj.id)}
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-sm"
                                style={{ backgroundColor: "#d8ca00ff", color: "black" }}
                                onClick={() => handleReassignClick(proj)}
                              >
                                <i className="fas fa-exchange-alt me-1"></i> Reassign
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{ backgroundColor: "#6c757d", color: "white" }}
                                onClick={() => handleDetailsClick(proj.id)}
                              >
                                Details <i className="fas fa-external-link-alt ms-1"></i>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded project details with files */}
                        {expandedRow === proj.id && (
                          <tr>
                            <td colSpan="14">
                              <div
                                style={{
                                  backgroundColor: "#0B1444",
                                  padding: "15px",
                                  borderRadius: "6px",
                                  color: "white",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                }}
                              >
                                <h5 style={{ marginBottom: "15px" }}>Project Files</h5>

                                {/* Project Files Section - Matching the screenshot exactly */}
                                {filesLoading ? (
                                  <p>Loading files...</p>
                                ) : projectFiles[proj.id] && projectFiles[proj.id].length > 0 ? (
                                  <div className="table-responsive">
                                    <table className="table table-dark table-striped table-hover">
                                      <thead>
                                        <tr>
                                          <th>File Name</th>
                                          <th>Pages</th>
                                          <th>Language</th>
                                          <th>Application</th>
                                          <th>Handler</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {projectFiles[proj.id].map((file) => (
                                          <tr key={file.projectFileId}>
                                            <td>{file.fileName}</td>
                                            <td>{file.pages}</td>
                                            <td>
                                              <span className={`badge ${file.fileStatus === "Completed" ? "bg-success" : "bg-warning"}`}>
                                                {file.languageName}
                                              </span>
                                            </td>
                                            <td>{file.applicationName}</td>
                                            <td>
                                              <select
                                                className="form-select form-select-sm"
                                                value={fileHandlers[file.id] || ""}
                                                onChange={(e) => handleHandlerChange(file.id, e.target.value)}
                                              >
                                                <option value="">Not Assigned</option>
                                                {members && members.length > 0 ? (
                                                  members.map((member) => (
                                                    <option key={member.id} value={member.fullName}>
                                                      {member.fullName}
                                                    </option>
                                                  ))
                                                ) : (
                                                  <option disabled>Loading members...</option>
                                                )}
                                              </select>
                                            </td>
                                            <td>{file.fileStatus}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>

                                    {/* Input area with Save and Clear buttons - matching the screenshot */}
                                    <div className="container mt-4">
                                      <div className="card" style={{ backgroundColor: '#1a365d', color: 'white' }}>
                                        <div className="card-body">
                                          <h5 className="card-title mb-4">QC Details</h5>
                                          <div className="row">
                                            <div className="mb-3 col-md-3">
                                              <label className="form-label">Ready for OC Due *</label>
                                              <input
                                                type="datetime-local"
                                                className="form-control"
                                                value={readyForOCDue}
                                                onChange={(e) => setReadyForOCDue(e.target.value)}
                                                required
                                              />
                                            </div>

                                            <div className="mb-3 col-md-3">
                                              <label className="form-label">QC Allocated Hours *</label>
                                              <input
                                                type="number"
                                                className="form-control"
                                                value={ocAllocatedHours}
                                                onChange={(e) => setOCAllocatedHours(Number(e.target.value))}
                                                min="0.25"
                                                step="0.25"
                                                required
                                              />
                                            </div>

                                            <div className="mb-3 col-md-3">
                                              <label className="form-label">OC Due</label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={ocDue}
                                                readOnly
                                              />
                                            </div>

                                            <div className="mb-4 col-md-3">
                                              <label className="form-label">Priority</label>
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

                                            <div className="d-flex justify-content-end">
                                              <button
                                                className="btn btn-success me-2"
                                                onClick={handleSave}
                                              >
                                                Save
                                              </button>
                                              <button
                                                className="btn btn-secondary"
                                                onClick={handleClose}
                                              >
                                                Close
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p>No files assigned to this project.</p>
                                )}

                                {/* Project additional details from API */}
                                {projectDetails[proj.id] && (
                                  <div className="mt-4">
                                    <h6>Additional Project Information</h6>
                                    <div className="row">
                                      <div className="col-md-4">
                                        <p><strong>Ready For QC Deadline:</strong> {projectDetails[proj.id].readyQCDeadline || "Not specified"}</p>
                                      </div>
                                      <div className="col-md-4">
                                        <p><strong>QC Due Date:</strong> {projectDetails[proj.id].qcDueDate || "Not specified"}</p>
                                      </div>
                                      <div className="col-md-4">
                                        <p><strong>Status:</strong> {projectDetails[proj.id].status || "Not specified"}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* QA self-assignment functionality */}
                                {teamFilter === "QA" && proj.status === "Ready for QA" && (
                                  <div className="mt-3">
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => {
                                        // Logic for QA self-assignment
                                        alert("Files assigned to QA team member");
                                      }}
                                    >
                                      Assign Files to Myself
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <p className="text-light">No projects found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Fake Scrollbar */}
      <div
        ref={fakeScrollbarRef}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          height: "16px",
          bottom: 0,
          left: 0,
          right: 0,
          display: "none",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div className="scroll-content" style={{ height: "1px" }} />
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{color:"black"}}>Reassign Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowReassignModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Project Title</label>
                  <input type="text" className="form-control" value={selectedProject?.projectTitle || ''} readOnly />
                </div>
               
                <div className="mb-3">
                  <label className="form-label">Select New Employee</label>
                  <select 
                    className="form-select" 
                    value={selectedEmployee} 
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Select an employee</option>
                    {availableEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.empId})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReassignModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleReassignSubmit}
                  disabled={reassignLoading}
                >
                  {reassignLoading ? 'Reassigning...' : 'Reassign Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Project Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                {detailsLoading ? (
                  <p>Loading project details...</p>
                ) : (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6>Project Information</h6>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <td><strong>Project Title:</strong></td>
                              <td>{projectFullDetails.title || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Client:</strong></td>
                              <td>{projectFullDetails.client || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Task:</strong></td>
                              <td>{projectFullDetails.task || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Language:</strong></td>
                              <td>{projectFullDetails.language || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Platform:</strong></td>
                              <td>{projectFullDetails.platform || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Pages:</strong></td>
                              <td>{projectFullDetails.totalPages || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Status:</strong></td>
                              <td>{projectFullDetails.status || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-6">
                        <h6>Assignment Information</h6>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <td><strong>Assigned Employee:</strong></td>
                              <td>{projectFullDetails.assignedEmployee?.fullName || 'Not assigned'}</td>
                            </tr>
                            <tr>
                              <td><strong>Employee ID:</strong></td>
                              <td>{projectFullDetails.assignedEmployee?.empId || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Created Date:</strong></td>
                              <td>{projectFullDetails.createdDate || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Due Date:</strong></td>
                              <td>{projectFullDetails.dueDate || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Ready for QC Deadline:</strong></td>
                              <td>{projectFullDetails.readyQCDeadline || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>QC Due Date:</strong></td>
                              <td>{projectFullDetails.qcDueDate || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Server Path</h6>
                      <div className="p-3 bg-light rounded">
                        <code>{projectFullDetails.serverPath || 'No server path specified'}</code>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Notes</h6>
                      <div className="p-3 bg-light rounded">
                        {projectFullDetails.notes || 'No notes available'}
                      </div>
                    </div>
                    
                    <div>
                      <h6>Comments/Remarks</h6>
                      {projectFullDetails.comments && projectFullDetails.comments.length > 0 ? (
                        <div className="list-group">
                          {projectFullDetails.comments.map((comment, index) => (
                            <div key={index} className="list-group-item">
                              <div className="d-flex justify-content-between">
                                <strong>{comment.author}</strong>
                                <small className="text-muted">{comment.date}</small>
                              </div>
                              <p className="mb-1">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-light rounded">
                          No comments available
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProjectsTable;