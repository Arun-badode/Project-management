import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Trash2, Upload } from "lucide-react";
import BASE_URL from "../../../config";

const ProjectsTable = ({
  projects,
  teamFilter,
  isManager,
  onMarkComplete,
  onDeleteProject,
  onReassign,
  onViewDetails,
  currentUserId,
  userRole,
}) => {
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const tableWrapperRef = useRef(null);
  const token = localStorage.getItem("authToken");
  const calendarRef = useRef(null);
  
  const [userId, setUserId] = useState(null);
  const [Employeeprojects, setEmployeeProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [projectFiles, setProjectFiles] = useState({});
  const [filesLoading, setFilesLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [readyForOCDue, setReadyForOCDue] = useState('');
  const [ocAllocatedHours, setOCAllocatedHours] = useState(0);
  const [ocDue, setOCDue] = useState('-');
  const [priority, setPriority] = useState('Mid');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [fileDeadlines, setFileDeadlines] = useState({});
  
  // Reassign modal state
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reassignLoading, setReassignLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const today = new Date();

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
        return 10;
    }
  };

  // Try to get user ID from various sources
  useEffect(() => {
    if (currentUserId) {
      setUserId(currentUserId);
      return;
    }
    
    const getUserId = () => {
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
        const value = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (value) {
          console.log(`Found user ID with key "${key}": ${value}`);
          return value;
        }
      }
      
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("Token payload:", payload);
            
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
  }, [token, currentUserId]);

  // Fetch project files for a specific project
  const fetchProjectFiles = async (projectId) => {
    // Always fetch files when expanding a row
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

      console.log("Files response:", response.data);

      let filteredFiles = response.data.data.filter(file => file.projectId === projectId);
      
      if (userRole !== 'admin' && userRole !== 'Manager' && userId) {
        filteredFiles = filteredFiles.filter(file => file.assignedTo === userId);
      }
      
      setProjectFiles(prev => ({
        ...prev,
        [projectId]: filteredFiles
      }));
      
      console.log("Filtered files:", filteredFiles);
    } catch (err) {
      console.error("Error fetching project files", err);
    } finally {
      setFilesLoading(false);
    }
  };

  // Fetch detailed project information
  const fetchProjectDetails = async (projectId) => {
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
      const employee = availableEmployees.find(emp => emp.id === parseInt(selectedEmployee));
      if (!employee) {
        alert("Invalid employee selected");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}project/projects/manager/${selectedProject.id}`,
        {
          projectManagerId: parseInt(selectedEmployee)
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
        
        setEmployeeProjects(prev => {
          const newProjects = [...prev];
          
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
              
              newProjects[i].projects.splice(projIndex, 1);
              
              if (newProjects[i].projects.length === 0) {
                newProjects.splice(i, 1);
              }
              
              break;
            }
          }
          
          if (projectToMove) {
            let targetEmployeeIndex = newProjects.findIndex(emp => emp.empId === employee.empId);
            
            if (targetEmployeeIndex !== -1) {
              newProjects[targetEmployeeIndex].projects.push(projectToMove);
            } else {
              const team = employee.designation?.toLowerCase().includes("qa") ? "QA" :
                          employee.designation?.toLowerCase().includes("adobe") ? "Adobe" :
                          employee.designation?.toLowerCase().includes("ms office") ? "MS Office" : "Other";
              
              newProjects.push({
                empId: employee.empId,
                fullName: employee.fullName,
                designation: employee.designation,
                projects: [projectToMove]
              });
              
              newProjects.sort((a, b) => a.empId.localeCompare(b.empId));
            }
          }
          
          return newProjects;
        });
        
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

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (selectedMonth, selectedYear, today) => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const isPast =
        prevYear < today.getFullYear() ||
        (prevYear === today.getFullYear() && prevMonth < today.getMonth()) ||
        (prevYear === today.getFullYear() &&
          prevMonth === today.getMonth() &&
          day < today.getDate());

      days.push({
        day,
        isCurrentMonth: false,
        isNextMonth: false,
        isPast,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        selectedYear === today.getFullYear() &&
        selectedMonth === today.getMonth() &&
        day === today.getDate();
      const isPast =
        selectedYear < today.getFullYear() ||
        (selectedYear === today.getFullYear() &&
          selectedMonth < today.getMonth()) ||
        (selectedYear === today.getFullYear() &&
          selectedMonth === today.getMonth() &&
          day < today.getDate());

      days.push({
        day,
        isCurrentMonth: true,
        isNextMonth: false,
        isToday,
        isPast,
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isNextMonth: true,
        isPast: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays(selectedMonth, selectedYear, today);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const isTimeInPast = (hour, minute, isAM, date) => {
    if (
      !date ||
      date !== today.getDate() ||
      selectedMonth !== today.getMonth() ||
      selectedYear !== today.getFullYear()
    ) {
      return false;
    }

    const selectedHour24 = isAM
      ? hour === 12
        ? 0
        : hour
      : hour === 12
      ? 12
      : hour + 12;
    const selectedTime = new Date(
      selectedYear,
      selectedMonth,
      date,
      selectedHour24,
      minute
    );
    const now = new Date();

    return selectedTime < now;
  };

  const handleDetailsClick = (projectId) => {
    fetchFullProjectDetails(projectId);
  };

  useEffect(() => {
    if (ocAllocatedHours > 0 && readyForOCDue) {
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

      const updateData = {
        readyQCDeadline: readyForOCDue,
        qcHrs: ocAllocatedHours,
        qcDueDate: qcDueDateValue,
        status: priority === 'High' ? 'In Progress' : 'Ready for QA'
      };

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

      if (response.status >= 200 && response.status < 300) {
        alert('Data saved successfully!');
        
        setProjectDetails(prev => ({
          ...prev,
          [currentProjectId]: {
            ...prev[currentProjectId],
            ...updateData
          }
        }));
        
        setReadyForOCDue('');
        setOCAllocatedHours(0);
        setOCDue('-');
        setPriority('Mid');
        setInputValue('');
      } else {
        alert(`Failed to save data: Server returned status ${response.status}`);
      }
    } catch (err) {
      console.error("Error updating project", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
        alert(`Error saving data: ${err.response.status} - ${err.response.data?.message || err.message}`);
      } else if (err.request) {
        console.error("Error request:", err.request);
        alert('Error saving data: No response from server');
      } else {
        console.error('Error message:', err.message);
        alert('Error saving data: ' + err.message);
      }
    }
  };

  const handleClose = () => {
    if (window.confirm('Are you sure you want to close without saving?')) {
      setReadyForOCDue('');
      setOCAllocatedHours(0);
      setOCDue('-');
      setPriority('Mid');
      setInputValue('');
    }
  };

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
        console.log("API Response:", response.data);
        
        if (response.data && response.data.status) {
          setMembers(response.data.data);
          console.log("Members set:", response.data.data);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
  
    fetchMembers();
  }, [token]);

  const handleHandlerChange = async (fileId, newHandler) => {
    try {
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
        const updatedHandlers = { ...fileHandlers };
        updatedHandlers[fileId] = newHandler;
        setFileHandlers(updatedHandlers);
        
        alert("Handler assigned successfully!");
      } else {
        alert("Failed to assign handler: " + response.data.message);
      }
    } catch (error) {
      console.error("Error assigning handler:", error);
      alert("Error assigning handler: " + (error.response?.data?.message || error.message));
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours.toString().padStart(2, '0');
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    return `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`;
  };

  const setDeadlineFromCalendar = (projectId) => {
    if (selectedDate === null) {
      alert("Please select a date");
      return;
    }

    const newDeadline = new Date(selectedYear, selectedMonth, selectedDate);
    const hour24 = isAM
      ? selectedHour === 12
        ? 0
        : selectedHour
      : selectedHour === 12
      ? 12
      : selectedHour + 12;
    
    newDeadline.setHours(hour24, selectedMinute, 0, 0);
    const formattedDate = newDeadline.toISOString().slice(0, 16);
    
    setFileDeadlines(prev => ({
      ...prev,
      [projectId]: formattedDate
    }));
    
    setReadyForOCDue(formattedDate);
    setCalendarOpen(false);
  };

  const saveFileStatusUpdates = async (projectId) => {
    try {
      const files = projectFiles[projectId];
      
      if (!files || files.length === 0) {
        alert("No files to update");
        return;
      }
      
      const updateData = {
        projectId: projectId,
        deadline: fileDeadlines[projectId] || null,
      };

      const response = await axios.patch(
        `${BASE_URL}project/updateProjectFiles/${projectId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status >= 200 && response.status < 300) {
        alert('Files updated successfully!');
      } else {
        alert(`Failed to update files: Server returned status ${response.status}`);
      }
    } catch (err) {
      console.error("Error updating files", err);
      alert(`Error updating files: ${err.response?.data?.message || err.message}`);
    }
  };

  // Main useEffect to process projects data
  useEffect(() => {
    console.log("Projects received:", projects);
    
    if (projects && projects.length > 0) {
      // Group projects by employee for display
      const groupedByEmployee = {};

      projects.forEach(project => {
        // Create a mock employee structure for each project
        const employeeId = project.assignedEmployee?.id || 
                          project.assignedEmployee?.empId || 
                          project.assignedTo || 
                          "EMP001";
        const employeeName = project.assignedEmployee?.name || 
                            project.assignedEmployee?.fullName || 
                            "John Doe";
        const employeeTeam = project.platform === "Adobe" ? "Adobe" :
          project.platform === "MS Office" ? "MS Office" : 
          project.applicationName === "Adobe" ? "Adobe" :
          project.applicationName === "MS Office" ? "MS Office" : "QA";
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
          projectTitle: project.title || project.projectTitle,
          clientName: project.client || project.clientName,
          taskName: project.task || project.taskName,
          languageName: project.language || project.languageName,
          applicationName: project.platform || project.applicationName,
          totalProjectPages: project.totalPages || project.totalProjectPages,
          qcDueDate: project.dueDate || project.qcDueDate,
          qcHrs: project.qcHrs,
          receiveDate: project.receiveDate || project.dueDate,
          status: project.status,
          progress: project.progress,
          description: project.description || project.handlerNote,
          priority: project.priority || "Medium",
          startDate: project.startDate || new Date().toLocaleDateString(),
          files: project.files || [],
          assignedEmployee: project.assignedEmployee || null
        };

        groupedByEmployee[employeeId].projects.push(transformedProject);
      });

      // Convert to array and sort by employee ID
      let employeeArray = Object.values(groupedByEmployee);
      
      // Team Filter Logic
      if (teamFilter !== "All") {
        if (teamFilter === "QA") {
          // QA team can see all projects
          // No filtering needed
        } else {
          // Adobe and MS Office teams can only see projects assigned by their manager
          employeeArray = employeeArray.map(employee => {
            const filteredProjects = employee.projects.filter(project => 
              (project.applicationName === teamFilter || project.platform === teamFilter) && 
              (isManager || project.assignedByManager)
            );
            
            return {
              ...employee,
              projects: filteredProjects
            };
          }).filter(employee => employee.projects.length > 0);
        }
      }
      
      // Sort employees by Employee ID in ascending order
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
          console.log("API response for members with projects:", res.data);
          
          // Filter employees based on team filter
          let filteredData = res.data.data;

          if (teamFilter !== "All") {
            if (teamFilter === "QA") {
              // QA team can see all projects
              // No filtering needed
            } else {
              // Adobe and MS Office teams can only see projects assigned by their manager
              filteredData = res.data.data.map(employee => {
                const filteredProjects = employee.projects.filter(project => 
                  (project.applicationName === teamFilter || project.platform === teamFilter) && 
                  (isManager || project.assignedByManager)
                );
                
                return {
                  ...employee,
                  projects: filteredProjects
                };
              }).filter(employee => employee.projects.length > 0);
            }
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
  }, [projects, teamFilter, token, isManager]);

  const toggleRow = (projId) => {
    setExpandedRow((prev) => {
      const newExpandedRow = prev === projId ? null : projId;

      // If expanding the row, fetch the project files and details
      if (newExpandedRow === projId) {
        fetchProjectFiles(projId);
        fetchProjectDetails(projId);
        setCurrentProjectId(projId);
        
        // Pre-populate form with existing data if available
        if (projectDetails[projId]) {
          const details = projectDetails[projId];
          setReadyForOCDue(details.readyQCDeadline || '');
          setOCAllocatedHours(details.qcHrs || 0);
          setPriority(details.priority || 'Mid');
          
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
                                employee.projects?.some(p => p.applicationName === "Adobe" || p.platform === "Adobe") ? "Adobe" :
                                  employee.projects?.some(p => p.applicationName === "MS Office" || p.platform === "MS Office") ? "MS Office" : "Other"}
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
                          <td>{formatDateTime(proj.deadline)}</td>
                          <td>{formatDateTime(proj.readyQCDeadline)}</td>
                          <td>{proj.qcHrs}</td>
                          <td>{proj.status}</td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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

                                {/* Project Files Section - Fixed to show files correctly */}
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
                                          <tr key={file.projectFileId || file.id}>
                                            <td>
                                              {file.fileName ? (
                                                <a 
                                                  href={file.fileUrl || '#'} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  style={{ color: '#4dabf7' }}
                                                >
                                                  {file.fileName}
                                                </a>
                                              ) : (
                                                "No file name"
                                              )}
                                            </td>
                                            <td>{file.pages || 0}</td>
                                            <td>
                                              <span className={`badge ${file.fileStatus === "Completed" ? "bg-success" : "bg-warning"}`}>
                                                {file.languageName || "N/A"}
                                              </span>
                                            </td>
                                            <td>{file.applicationName || "N/A"}</td>
                                            <td>
                                              <select
                                                className="form-select form-select-sm bg-card"
                                                value={fileHandlers[file.projectFileId || file.id] || file.handler || ""}
                                                onChange={(e) => handleHandlerChange(file.projectFileId || file.id, e.target.value)}
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
                                            <td>{file.fileStatus || "N/A"}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>

                                    {/* Input area with Save and Clear buttons */}
                                    <div className="mt-4">
                                      <div className="card" style={{ backgroundColor: '#1a365d', color: 'white' }}>
                                        <div className="card-body">
                                          <h5 className="card-title mb-4">QC Details</h5>
                                          <div className="row">
                                            <div className="d-flex justify-content-between align-items-center mb-3 col-md-3">
                                              <div className="d-flex align-items-center gap-3">
                                                <label className="form-label mb-0">Ready for OC Due *</label>
                                                <div className="max-w-md mx-auto" ref={calendarRef}>
                                                  <div className="relative">
                                                    <input
                                                      type="text"
                                                      value={fileDeadlines[proj.id] 
                                                        ? new Date(fileDeadlines[proj.id]).toLocaleString() 
                                                        : formatDateTime(proj.readyQCDeadline)}
                                                      readOnly
                                                      onClick={() => {
                                                        setCalendarOpen(!calendarOpen);
                                                        if (fileDeadlines[proj.id]) {
                                                          const deadline = new Date(fileDeadlines[proj.id]);
                                                          setSelectedDate(deadline.getDate());
                                                          setSelectedMonth(deadline.getMonth());
                                                          setSelectedYear(deadline.getFullYear());
                                                          setSelectedHour(deadline.getHours() % 12 || 12);
                                                          setSelectedMinute(deadline.getMinutes());
                                                          setIsAM(deadline.getHours() < 12);
                                                        } else if (proj.readyQCDeadline) {
                                                          const deadline = new Date(proj.readyQCDeadline);
                                                          setSelectedDate(deadline.getDate());
                                                          setSelectedMonth(deadline.getMonth());
                                                          setSelectedYear(deadline.getFullYear());
                                                          setSelectedHour(deadline.getHours() % 12 || 12);
                                                          setSelectedMinute(deadline.getMinutes());
                                                          setIsAM(deadline.getHours() < 12);
                                                        }
                                                      }}
                                                      className="bg-card w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                                      placeholder="00:00 AM 00-00-00"
                                                    />
                                                  </div>

                                                  {calendarOpen && (
                                                    <div className="calendar-dropdown">
                                                      <div className="time-display">
                                                        <div className="time">
                                                          {selectedHour === 0
                                                            ? "12"
                                                            : selectedHour > 12
                                                            ? selectedHour - 12
                                                            : selectedHour.toString().padStart(2, "0")}
                                                          :{selectedMinute.toString().padStart(2, "0")}
                                                        </div>
                                                        <div className="period">{isAM ? "AM" : "PM"}</div>
                                                        <div className="date">
                                                          {selectedDate !== null
                                                            ? `${selectedDate.toString().padStart(2, "0")}-${(
                                                                selectedMonth + 1
                                                              )
                                                                .toString()
                                                                .padStart(2, "0")}-${selectedYear
                                                                .toString()
                                                                .slice(-2)}`
                                                            : "00-00-00"}
                                                        </div>
                                                      </div>

                                                      <div className="time-calendar-container">
                                                        <div className="time-selector">
                                                          <div className="time-column">
                                                            <div className="time-column-label">Hour</div>
                                                            <div className="time-scroll">
                                                              <div className="time-options">
                                                                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
                                                                  (hour) => {
                                                                    const isPast = isTimeInPast(
                                                                      hour,
                                                                      selectedMinute,
                                                                      isAM,
                                                                      selectedDate
                                                                    );
                                                                    return (
                                                                      <button
                                                                        key={hour}
                                                                        onClick={() => setSelectedHour(hour)}
                                                                        className={`time-option ${
                                                                          selectedHour === hour
                                                                            ? "selected-hour"
                                                                            : ""
                                                                        } ${isPast ? "past-time" : ""}`}
                                                                        disabled={isPast}
                                                                      >
                                                                        {hour.toString().padStart(2, "0")}
                                                                      </button>
                                                                    );
                                                                  }
                                                                )}
                                                              </div>
                                                            </div>
                                                          </div>

                                                          <div className="time-column">
                                                            <div className="time-column-label">Min</div>
                                                            <div className="time-scroll">
                                                              <div className="time-options">
                                                                {[0, 15, 30, 45].map((minute) => {
                                                                  const isPast = isTimeInPast(
                                                                    selectedHour,
                                                                    minute,
                                                                    isAM,
                                                                    selectedDate
                                                                  );
                                                                  return (
                                                                    <button
                                                                      key={minute}
                                                                      onClick={() => setSelectedMinute(minute)}
                                                                      className={`time-option ${
                                                                        selectedMinute === minute
                                                                          ? "selected-minute"
                                                                          : ""
                                                                      } ${isPast ? "past-time" : ""}`}
                                                                      disabled={isPast}
                                                                    >
                                                                      {minute.toString().padStart(2, "0")}
                                                                    </button>
                                                                  );
                                                                })}
                                                              </div>
                                                            </div>
                                                          </div>

                                                          <div className="time-column">
                                                            <div className="time-column-label">Period</div>
                                                            <div className="period-options">
                                                              <button
                                                                onClick={() => setIsAM(true)}
                                                                className={`period-option ${
                                                                  isAM ? "selected" : ""
                                                                }`}
                                                              >
                                                                AM
                                                              </button>
                                                              <button
                                                                onClick={() => setIsAM(false)}
                                                                className={`period-option ${
                                                                  !isAM ? "selected" : ""
                                                                }`}
                                                              >
                                                                PM
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </div>

                                                        <div className="calendar-section">
                                                          <div className="month-nav">
                                                            <div className="month-year-dropdowns">
                                                              <select
                                                                value={selectedMonth}
                                                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                                                className="form-select form-select-sm"
                                                              >
                                                                {months.map((month, index) => (
                                                                  <option key={index} value={index}>
                                                                    {month}
                                                                  </option>
                                                                ))}
                                                              </select>
                                                              <select
                                                                value={selectedYear}
                                                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                                                className="form-select form-select-sm"
                                                              >
                                                                {generateYearOptions().map((year) => (
                                                                  <option key={year} value={year}>
                                                                    {year}
                                                                  </option>
                                                                ))}
                                                              </select>
                                                            </div>
                                                            <div className="nav-buttons">
                                                              <button
                                                                type="button"
                                                                onClick={handlePrevMonth}
                                                                disabled={
                                                                  selectedMonth === today.getMonth() &&
                                                                  selectedYear === today.getFullYear()
                                                                }
                                                              >
                                                                <ChevronLeft size={20} />
                                                              </button>
                                                              <button type="button" onClick={handleNextMonth}>
                                                                <ChevronRight size={20} />
                                                              </button>
                                                            </div>
                                                          </div>

                                                          <div className="weekdays">
                                                            {weekDays.map((day) => (
                                                              <div key={day} className="weekday">
                                                                {day}
                                                              </div>
                                                            ))}
                                                          </div>

                                                          <div className="calendar-grid">
                                                            {calendarDays.map((dayObj, index) => (
                                                              <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() =>
                                                                  dayObj.isCurrentMonth &&
                                                                  !dayObj.isPast &&
                                                                  setSelectedDate(dayObj.day)
                                                                }
                                                                className={`calendar-day ${
                                                                  dayObj.isCurrentMonth
                                                                    ? selectedDate === dayObj.day
                                                                      ? "current-month selected"
                                                                      : dayObj.isToday
                                                                      ? "current-month today"
                                                                      : "current-month"
                                                                    : "other-month"
                                                                } ${dayObj.isPast ? "past-date" : ""}`}
                                                                disabled={dayObj.isPast}
                                                              >
                                                                {dayObj.day}
                                                              </button>
                                                            ))}
                                                          </div>

                                                          <div className="action-buttons">
                                                            <button
                                                              type="button"
                                                              onClick={() => {
                                                                setSelectedDate(null);
                                                                setSelectedHour(0);
                                                                setSelectedMinute(0);
                                                                setIsAM(true);
                                                              }}
                                                              className="action-button"
                                                            >
                                                              Clear
                                                            </button>
                                                            <button
                                                              type="button"
                                                              onClick={() => {
                                                                setSelectedDate(today.getDate());
                                                                setSelectedMonth(today.getMonth());
                                                                setSelectedYear(today.getFullYear());
                                                                setSelectedHour(today.getHours() % 12 || 12);
                                                                setSelectedMinute(today.getMinutes());
                                                                setIsAM(today.getHours() < 12);
                                                              }}
                                                              className="action-button"
                                                            >
                                                              Today
                                                            </button>
                                                          </div>
                                                        </div>
                                                      </div>

                                                      <div className="done-section">
                                                        <button
                                                          type="button"
                                                          onClick={() => setDeadlineFromCalendar(proj.id)}
                                                          className="done-button"
                                                        >
                                                          Done
                                                        </button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            <div className="mb-3 col-md-3">
                                              <label className="form-label">QC Allocated Hours *</label>
                                              <input
                                                type="number"
                                                className="form-control bg-card"
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
                                                className="form-control bg-card"
                                                value={ocDue}
                                                readOnly
                                              />
                                            </div>

                                            <div className="mb-4 col-md-3">
                                              <label className="form-label">Priority</label>
                                              <select
                                                className="form-select bg-card"
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
                              <td>{projectFullDetails.title || projectFullDetails.projectTitle || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Client:</strong></td>
                              <td>{projectFullDetails.client || projectFullDetails.clientName || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Task:</strong></td>
                              <td>{projectFullDetails.task || projectFullDetails.taskName || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Language:</strong></td>
                              <td>{projectFullDetails.language || projectFullDetails.languageName || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Platform:</strong></td>
                              <td>{projectFullDetails.platform || projectFullDetails.applicationName || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Pages:</strong></td>
                              <td>{projectFullDetails.totalPages || projectFullDetails.totalProjectPages || 'N/A'}</td>
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