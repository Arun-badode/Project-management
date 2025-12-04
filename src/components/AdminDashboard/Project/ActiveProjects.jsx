import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import BASE_URL from "../../../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ActiveProjects = (data) => {
  const searchQuery = data?.searchQuery || ""; 
  console.log("data", data?.searchQuery); 
  console.log("searchQuery", searchQuery);
  const [activeTab, setActiveTab] = useState("active");
  // const [searchQuery, setSearchQuery] = useState("");

  console.log("data in created project", searchQuery);
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
  const [readyForQcDueInput, setReadyForQcDueInput] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [priorityAll, setPriorityAll] = useState("Mid");
  const [qcDueDelay, setQcDueDelay] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // New states for the requested features
  const [showHoldConfirmation, setShowHoldConfirmation] = useState(false);
  const [showEditDeadlineModal, setShowEditDeadlineModal] = useState(false);
  const [currentDeadline, setCurrentDeadline] = useState("");
  const [showFilesDropdown, setShowFilesDropdown] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);

  const [allFiles, setAllFiles] = useState([]);
  
  // Custom date picker states
  const [calendarOpen, setCalendarOpen] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const calendarRef = useRef(null);
  const today = new Date();
  const [fileDeadlines, setFileDeadlines] = useState({});
  
  // Constants for calendar
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  // this is for fetching members to show in filed handler option
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}member/getAllMembers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status) {
          setMembers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  // Helper functions for custom date picker
  const formatDateTime = (projectId) => {
    const projectDate = selectedDate[projectId];
    if (projectDate === null || projectDate === undefined) {
      return "00:00 AM 00-00-00";
    }

    // Format time: HH:MM tt
    const hour =
      selectedHour === 0
        ? 12
        : selectedHour > 12
        ? selectedHour - 12
        : selectedHour;
    const time = `${hour.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${isAM ? "AM" : "PM"}`;

    // Format date: DD-MM-YY
    const date = `${projectDate.toString().padStart(2, "0")}-${(
      selectedMonth + 1
    )
      .toString()
      .padStart(2, "0")}-${selectedYear.toString().slice(-2)}`;

    return `${time} ${date}`;
  };

  // Handle calendar navigation
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const openCalendar = (projectId) => {
    // Initialize calendar with current deadline if exists
    if (fileDeadlines[projectId]) {
      const deadline = new Date(fileDeadlines[projectId]);
      setSelectedDate(prev => ({
        ...prev,
        [projectId]: deadline.getDate()
      }));
      setSelectedMonth(deadline.getMonth());
      setSelectedYear(deadline.getFullYear());
      setSelectedHour(deadline.getHours() % 12 || 12);
      setSelectedMinute(deadline.getMinutes());
      setIsAM(deadline.getHours() < 12);
    } else {
      // Initialize with today's date
      setSelectedDate(prev => ({
        ...prev,
        [projectId]: today.getDate()
      }));
      setSelectedMonth(today.getMonth());
      setSelectedYear(today.getFullYear());
      setSelectedHour(today.getHours() % 12 || 12);
      setSelectedMinute(today.getMinutes());
      setIsAM(today.getHours() < 12);
    }
    
    setCalendarOpen(prev => ({
      ...prev,
      [projectId]: true
    }));
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

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const setDeadlineFromCalendar = (projectId) => {
    const projectDate = selectedDate[projectId];
    if (projectDate === null || projectDate === undefined) return;

    const deadline = `${selectedYear}-${(selectedMonth + 1)
      .toString()
      .padStart(2, "0")}-${projectDate.toString().padStart(2, "0")}T${(isAM
      ? selectedHour === 12
        ? 0
        : selectedHour
      : selectedHour === 12
      ? 12
      : selectedHour + 12
    )
      .toString()
      .padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}:00`;

    setFileDeadlines(prev => ({
      ...prev,
      [projectId]: deadline
    }));

    // Also update the readyForQcDueInput state to maintain compatibility
    setReadyForQcDueInput(deadline);
    setHasUnsavedChanges(true);

    setCalendarOpen(prev => ({
      ...prev,
      [projectId]: false
    }));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    
    const calendarDays = [];
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        isPast: true
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        i === today.getDate() && 
        selectedMonth === today.getMonth() && 
        selectedYear === today.getFullYear();
      
      const isPast = 
        i < today.getDate() && 
        selectedMonth <= today.getMonth() && 
        selectedYear <= today.getFullYear();
      
      calendarDays.push({
        day: i,
        isCurrentMonth: true,
        isToday,
        isPast
      });
    }
    
    // Next month days to fill the calendar
    const remainingDays = 42 - calendarDays.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        day: i,
        isCurrentMonth: false,
        isToday: false,
        isPast: false
      });
    }
    
    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  // New function to update project files via API
  const handleUpdateProjectFiles = async () => {
    if (!selectedProject || !selectedProject.id) {
      alert("No project selected");
      return;
    }

    // Use the custom date picker value if available
    const deadlineToUse = fileDeadlines[selectedProject.id] || readyForQcDueInput;

    // Validate required fields
    if (!deadlineToUse) {
      alert("Please select Ready for QC Due date and time");
      return;
    }

    if (!qcAllocatedHours || qcAllocatedHours <= 0) {
      alert("Please enter valid QC Allocated Hours");
      return;
    }

    setIsUpdating(true);

    try {
      // Calculate QC Due Date
      const qcDueCalculated = calculateQCDue(deadlineToUse, qcAllocatedHours);

      // -----------------------------------
      // 1. Update the Project File
      // -----------------------------------
      const fileUpdateData = {
        projectId: parseInt(selectedProject.id),
        readyForQcDue: deadlineToUse,
        qcAllocatedHours: parseFloat(qcAllocatedHours),
        qcDue: qcDueCalculated,
        priority: priorityAll,
        handler: fileHandlers[selectedProject.id] || "",
      };

      const fileUpdateResponse = await axios.patch(
        `${BASE_URL}projectFiles/updateProjectFile/${selectedProject.id}`,
        fileUpdateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (fileUpdateResponse.status !== 200) {
        throw new Error('Failed to update project file');
      }

      // -----------------------------------
      // 2. Update the Project (excluding status update)
      // -----------------------------------
      const fullProject = projects.find(p => p.id === selectedProject.id);

      if (!fullProject) {
        throw new Error("Full project details not found");
      }

      const projectUpdateData = {
        projectTitle: fullProject.projectTitle,
        clientId: fullProject.clientId,
        country: fullProject.country,
        projectManagerId: fullProject.projectManagerId,
        taskId: fullProject.taskId,
        applicationId: fullProject.applicationId,
        languageId: fullProject.languageId,
        totalPagesLang: fullProject.totalPagesLang,
        totalProjectPages: fullProject.totalProjectPages,
        receiveDate: fullProject.receiveDate,
        serverPath: fullProject.serverPath,
        notes: fullProject.notes,
        estimatedHours: fullProject.estimatedHours,
        hourlyRate: fullProject.hourlyRate,
        perPageRate: fullProject.perPageRate,
        currency: fullProject.currency,
        totalCost: fullProject.totalCost,
        deadline: fullProject.deadline,

        // ✅ Updated fields (status removed)
        readyQCDeadline: deadlineToUse,
        qcHrs: parseFloat(qcAllocatedHours),
        qcDueDate: qcDueCalculated,
      };

      const projectUpdateResponse = await axios.patch(
        `${BASE_URL}project/updateProject/${selectedProject.id}`,
        projectUpdateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (projectUpdateResponse.status !== 200) {
        throw new Error('Failed to update main project');
      }

      const updatedProjects = projects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            readyQCDeadline: deadlineToUse,
            qcHrs: qcAllocatedHours,
            qcDueDate: qcDueCalculated,
            // priority remains in file, not in project
            handler: fileHandlers[selectedProject.id] || project.handler,
          };
        }
        return project;
      });

      setProjects(updatedProjects);

      setSelectedProject(prev => ({
        ...prev,
        readyQCDeadline: deadlineToUse,
        qcHrs: qcAllocatedHours,
        qcDueDate: qcDueCalculated,
      }));

      setHasUnsavedChanges(false);
      alert("Project and project file updated successfully!");
    } catch (error) {
      console.error("Error updating project or file:", error);
      alert(`Failed to update: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseProjectView = () => {
    setExpandedRow(null);
    setSelectedProject(null);
    setSelectedFiles([]);
    setHasUnsavedChanges(false);
    setReadyForQcDueInput("");
    setQcAllocatedHours(0.0);
    setPriorityAll("Mid");
    setQcDueDelay("");
    setFileHandlers({});
    setShowFilesDropdown(null);
  };

  useEffect(() => {
    const deadlineToUse = fileDeadlines[selectedProject?.id] || readyForQcDueInput;
    
    if (!deadlineToUse) {
      setQcDueDelay("");
      return;
    }

    const updateDelay = () => {
      const delayText = calculateTimeDiff(deadlineToUse);
      setQcDueDelay(delayText);
    };

    updateDelay();
    const interval = setInterval(updateDelay, 60000);
    return () => clearInterval(interval);
  }, [readyForQcDueInput, fileDeadlines, selectedProject]);

  function calculateTimeDiff(targetDateStr) {
    const now = new Date();
    const target = new Date(targetDateStr);
    const diffMs = now - target;
    const diffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    const isPast = diffMs > 0;
    if (diffMinutes < 1) return isPast ? "Just now" : "In a few seconds";
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    let timeStr = "";
    if (hours > 0) timeStr += `${hours}h `;
    timeStr += `${minutes}m`;
    return isPast ? `Delayed by ${timeStr}` : `Due in ${timeStr}`;
  }

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
  }, [searchQuery]);

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

  // Hold project function - Updated with the new API
  const handleHoldProject = async (projectId) => {
    try {
      // Use the new API endpoint to update project status
      const response = await axios.put(
        `${BASE_URL}project/updateProjectStatus/${projectId}`,
        { status: "On hold" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        alert("Project status updated to On Hold successfully!");
        setShowHoldConfirmation(false);
        // Update the project status in the local state
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === projectId ? { ...project, status: "On hold" } : project
          )
        );
      }
    } catch (error) {
      console.error("Failed to hold project:", error);
      alert("Error holding project");
    }
  };

  // Edit deadline function
  const handleEditDeadline = async (projectId) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}project/updateProject/${projectId}`,
        { deadline: currentDeadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Deadline updated successfully!");
        setShowEditDeadlineModal(false);
        // Update the project deadline in the local state
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === projectId ? { ...project, deadline: currentDeadline } : project
          )
        );
      }
    } catch (error) {
      console.error("Failed to update deadline:", error);
      alert("Error updating deadline");
    }
  };

  // Copy server path function
  const handleCopyServerPath = (serverPath) => {
    if (serverPath) {
      navigator.clipboard.writeText(serverPath)
        .then(() => {
          alert("Server path copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy server path: ", err);
          alert("Failed to copy server path");
        });
    } else {
      alert("No server path available");
    }
  };

  // Enhanced delete project function
  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        // Get project details to check file statuses
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
          alert("Project not found");
          return;
        }

        // Determine new status based on file statuses
        let newStatus = "Created"; // Default status
        
        // Check if any files have amendment statuses
        const hasAmendmentStatuses = project.files?.some(file => 
          file.status === "V1 YTS" || file.status === "V2 YTS" || 
          file.status.includes("V") && file.status.includes("YTS")
        );

        if (hasAmendmentStatuses) {
          newStatus = "Completed";
        }

        // Update project status
        const response = await axios.patch(
          `${BASE_URL}project/updateProject/${projectId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          // Clear file statuses if they are YTS
          if (newStatus === "Created") {
            await axios.patch(
              `${BASE_URL}projectFiles/clearFileStatuses/${projectId}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }

          alert(`Project moved to ${newStatus} Projects successfully!`);
          fetchProjects();
        }
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Error deleting project");
      }
    }
  };

  // Fetch project files for dropdown
  const fetchProjectFiles = async (projectId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}projectFiles/getFilesByProject/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        setProjectFiles(response.data.data);
        setShowFilesDropdown(showFilesDropdown === projectId ? null : projectId);
      }
    } catch (error) {
      console.error("Error fetching project files:", error);
    }
  };

  const markAsCompleted = async (projectId) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}project/updateProject/${projectId}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        alert("Project marked as Completed successfully!");

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId ? { ...project, status: "Completed" } : project
          )
        );
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
      alert("Error updating project status");
    }
  };

  const handleEditProject = (projectId) => {
    console.log("Editing project:", projectId);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSelectedFiles(project.files ? project.files.map(f => ({ id: f.id })) : []);
    setShowDetailModal(false);
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

    // Reset form values when opening a new project
    setReadyForQcDueInput("");
    setQcAllocatedHours(0.0);
    setPriorityAll("Mid");
    setQcDueDelay("");

    // Initialize the custom date picker with existing deadline if available
    if (project.readyQCDeadline) {
      setFileDeadlines(prev => ({
        ...prev,
        [project.id]: project.readyQCDeadline
      }));
    }

    setExpandedRow(expandedRow === project.id ? null : project.id);
    setShowFilesDropdown(null);
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
    setShowFilesDropdown(null);
  };

  // Count files for each project
  const getFileCount = (projectId) => {
    if (!Array.isArray(allFiles)) return 0;
    return allFiles.filter(file => file.projectId === projectId).length;
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarOpen({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status" style={{ minWidth: 900 }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading Projects...</p>
        </div>
      ) : projects.length === 0 ? (
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
              <th style={{ width: "4%" }}>S. No.</th>
              <th style={{ width: "10%" }}>Project Title</th>
              <th style={{ width: "8%" }}>Client Alias Name</th>
              <th style={{ width: "8%" }}>Client</th>
              {/* <th style={{ width: "4%" }}>Country</th> */}
              {/* <th style={{ width: "10%" }}>Project Manager</th> */}
              <th style={{ width: "8%" }}>Task</th>
              <th style={{ width: "8%" }}>Languages</th>
              <th style={{ width: "8%" }}>Application</th>
              <th style={{ width: "4%" }}>Total Pages</th>
              <th style={{ width: "10%" }}>Deadline</th>
              <th style={{ width: "10%" }}>Ready For QC Deadline</th>
              <th style={{ width: "4%" }}>QC Hrs</th>
              <th style={{ width: "10%" }}>QC Due Date</th>
              <th style={{ width: "7%" }}>Status</th>
              <th style={{ width: "6%" }}>Progress</th>
              <th style={{ width: "6%" }}>Files</th>
              <th style={{ width: "8%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((project) => {
                // FIRST: apply search filter
                const query = searchQuery.toLowerCase();

                const matchesSearch =
                  searchQuery === "" ||
                  project.projectTitle?.toLowerCase().includes(query) ||  // Fixed: changed from 'title' to 'projectTitle'
                  project.clientName?.toLowerCase().includes(query) ||
                  project.country?.toLowerCase().includes(query) ||
                  project.full_name?.toLowerCase().includes(query) ||
                  project.application_name?.toLowerCase().includes(query) ||
                  project.task_name?.toLowerCase().includes(query) ||
                  project.language_name?.toLowerCase().includes(query);

                return matchesSearch;
              }).filter((p) => p.status == "Active" || p.status == "Completed")
              .map((project, index) => (
                <React.Fragment key={project.id || index}>
                  <tr
                    className={
                      expandedRow === project.id
                        ? "table-active text-center"
                        : "text-center"
                    }
                  >
                    <td style={{ maxWidth: "4ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{index + 1}</td>
                    <td style={{ maxWidth: "80ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.projectTitle || "-"}</td>
                    <td style={{ maxWidth: "12ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.full_name || "-"}</td>
                    <td style={{ maxWidth: "12ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.clientName || "-"}</td>
                    {/* <td style={{ maxWidth: "3ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.country || "-"}</td> */}
                    {/* <td style={{ maxWidth: "16ch", wordWrap: "break-word" }}>{project.projectManagerId || "-"}</td> */}
                    <td style={{ maxWidth: "16ch", wordWrap: "break-word" }}>
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {project.task_name || "-"}
                      </span>
                    </td>
                    <td style={{ maxWidth: "16ch", wordWrap: "break-word" }}>
                      <span className="badge bg-success bg-opacity-10 text-success">
                        {project.language_name || "-"}
                      </span>
                    </td>
                    <td style={{ maxWidth: "16ch", wordWrap: "break-word" }}>
                      <span className="badge bg-purple bg-opacity-10 text-purple">
                        {project.application_name || "-"}
                      </span>
                    </td>
                    <td style={{ maxWidth: "4ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.totalPagesLang ? Math.floor(project.totalPagesLang) : "-"}
                    </td>
                    <td style={{ maxWidth: "20ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.deadline
                        ? new Date(project.deadline).toLocaleString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true,
                            day: '2-digit', 
                            month: '2-digit', 
                            year: '2-digit' 
                          })
                        : "-"}
                    </td>
                    <td style={{ maxWidth: "20ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.readyQCDeadline
                        ? new Date(project.readyQCDeadline).toLocaleString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true,
                            day: '2-digit', 
                            month: '2-digit', 
                            year: '2-digit' 
                          })
                        : "-"}
                    </td>
                    <td style={{ maxWidth: "3ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.qcHrs || "-"}</td>
                    <td style={{ maxWidth: "20ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.qcDueDate
                        ? new Date(project.qcDueDate).toLocaleString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true,
                            day: '2-digit', 
                            month: '2-digit', 
                            year: '2-digit' 
                          })
                        : "-"}
                    </td>
                    <td style={{ maxWidth: "15ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <span
                        className={`badge ${project.status === "Completed"
                          ? "bg-success text-white"
                          : project.status === "On hold" || project.status === "On Hold"
                            ? "bg-warning text-dark"
                            : "bg-info text-white"
                          }`}
                      >
                        {project.status || "-"}
                      </span>
                    </td>
                    <td style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                    <td style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <div className="position-relative">
                        <button 
                          className="badge bg-info d-flex align-items-center"
                          onClick={() => fetchProjectFiles(project.id)}
                        >
                          {getFileCount(project.id)} Files
                          <i className={`fas ms-1 ${showFilesDropdown === project.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </button>
                        
                        {showFilesDropdown === project.id && (
                          <div className="position-absolute end-0 mt-1 bg-white border rounded shadow p-2 z-3" style={{ minWidth: '300px' }}>
                            <h6 className="mb-2">Project Files</h6>
                            <div className="max-h-40 overflow-y-auto">
                              {projectFiles.length > 0 ? (
                                projectFiles.map(file => (
                                  <div key={file.id} className="border-bottom py-2">
                                    <div className="d-flex justify-content-between">
                                      <span className="fw-bold">{file.fileName}</span>
                                      <span className="badge bg-secondary">{file.status || "Pending"}</span>
                                    </div>
                                    <div className="small text-muted">
                                      Pages: {file.pages || 0} | 
                                      Ready for QC: {file.readyForQcDue ? new Date(file.readyForQcDue).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-'} | 
                                      QC Hours: {file.qcAllocatedHours || 0}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-muted small mb-0">No files found</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        {/* Hold Button - Only show if not in RFD final stage */}
                        {project.status !== "RFD Final" && project.status !== "Completed" && project.status !== "On hold" && project.status !== "On Hold" && (
                          <button 
                            onClick={() => {
                              setSelectedProject(project);
                              setShowHoldConfirmation(true);
                            }} 
                            className="btn btn-sm btn-warning"
                          >
                            <i className="fas fa-pause me-1"></i>
                            Hold
                          </button>
                        )}
                        
                        {project.status === "Completed" ? (
                          <span className="text-success">✔️ Completed</span>
                        ) : (
                          <button onClick={() => markAsCompleted(project.id)} className="btn btn-sm btn-success">
                            Mark as Completed
                          </button>
                        )}

                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewProject(project)}
                        >
                          <i
                            className={`fas ${expandedRow === project.id
                              ? "fa-chevron-up"
                              : "fa-eye"
                              }`}
                          ></i>
                        </button>
                        
                        {/* Edit Deadline Button */}
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => {
                            setSelectedProject(project);
                            setCurrentDeadline(project.deadline ? new Date(project.deadline).toISOString().slice(0, 16) : "");
                            setShowEditDeadlineModal(true);
                          }}
                        >
                           <i className="fas fa-edit"></i>
                        </button>
                        
                        {/* Copy Server Path Button */}
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleCopyServerPath(project.serverPath)}
                          title="Copy Server Path"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                        
                        {/* <button
                          onClick={() => handleEditProject(project.id)}
                          className="btn btn-sm btn-success"
                        >
                          <i className="fas fa-edit"></i>
                        </button> */}
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
                                    <th style={{ width: "5%" }}>
                                      <input type="checkbox" />
                                    </th>
                                    <th style={{ width: "20%" }}>File Name</th>
                                    <th style={{ width: "6%" }}>Pages</th>
                                    <th style={{ width: "10%" }}>Language</th>
                                    <th style={{ width: "10%" }}>Application</th>
                                    <th style={{ width: "15%" }}>Handler</th>
                                    <th style={{ width: "15%" }}>QA Reviewer</th>
                                    <th style={{ width: "10%" }}>Status</th>
                                    <th style={{ width: "9%" }}>QA Report</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allFiles
                                    .filter((file) => file.projectId === project.id)
                                    .map((file) => (
                                      <tr key={file.id}>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedFiles.some((f) => f.id === file.id)}
                                            onChange={() => toggleFileSelection(file)}
                                          />
                                        </td>
                                        <td style={{ maxWidth: "20ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.fileName}</td>
                                        <td style={{ maxWidth: "6ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.pages}</td>
                                        <td style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.languageName}</td>
                                        <td style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.applicationName}</td>
                                        <td>
                                          <select
                                            className="form-select form-select-sm"
                                            value={fileHandlers[file.id] || ""}
                                            onChange={(e) => handleHandlerChange(file.id, e.target.value)}
                                          >
                                            <option value="">Not Assigned</option>
                                            {members
                                              .filter((member) =>
                                                member.appSkills
                                                  ?.toLowerCase()
                                                  .includes(file.applicationName?.toLowerCase())
                                              )
                                              .map((filteredMember) => (
                                                <option key={filteredMember.id} value={filteredMember.fullName}>
                                                  {filteredMember.fullName}
                                                </option>
                                              ))}
                                          </select>
                                        </td>
                                        <td>
                                          <select className="form-select form-select-sm">
                                            <option value="">Not Assigned</option>
                                            <option value="Sarah Williams">Sarah Williams</option>
                                            <option value="David Brown">David Brown</option>
                                            <option value="Emily Davis">Emily Davis</option>
                                          </select>
                                        </td>
                                        <td style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.status || "Pending"}</td>
                                        <td>
                                          {file.imageUrl ? (
                                            <img
                                              src={file.imageUrl}
                                              alt={file.fileName}
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
                            {/* Ready for QC Due - Custom Date Picker */}
                            <div className="col-12 col-sm-6 col-md-3">
                              <label className="form-label">
                                Ready for QC Due <span className="text-danger">*</span>
                              </label>
                              <div className="max-w-md mx-auto position-relative" ref={calendarRef}>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={fileDeadlines[project.id]
                                      ? new Date(fileDeadlines[project.id]).toLocaleString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                      })
                                      : formatDateTime(project.id)}
                                    readOnly
                                    onClick={() => openCalendar(project.id)}
                                    className="bg-card w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                    placeholder="00:00 AM 00-00-00"
                                  />
                                </div>

                                {calendarOpen[project.id] && (
                                  <div className="calendar-dropdown position-absolute" style={{ zIndex: 1, top: "100%", left: "198px" }}>
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
                                        {selectedDate[project.id] !== null && selectedDate[project.id] !== undefined
                                          ? `${selectedDate[project.id].toString().padStart(2, "0")}-${(
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
                                                    selectedDate[project.id]
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
                                                  selectedDate[project.id]
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
                                              <i className="fas fa-chevron-left"></i>
                                            </button>
                                            <button type="button" onClick={handleNextMonth}>
                                              <i className="fas fa-chevron-right"></i>
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
                                                setSelectedDate(prev => ({
                                                  ...prev,
                                                  [project.id]: dayObj.day
                                                }))
                                              }
                                              className={`calendar-day ${
                                                dayObj.isCurrentMonth
                                                  ? selectedDate[project.id] === dayObj.day
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
                                              setSelectedDate(prev => ({
                                                ...prev,
                                                [project.id]: null
                                              }));
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
                                              setSelectedDate(prev => ({
                                                ...prev,
                                                [project.id]: today.getDate()
                                              }));
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
                                        onClick={() => setDeadlineFromCalendar(project.id)}
                                        className="done-button"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {qcDueDelay && (
                                <small
                                  className={`text-${qcDueDelay.includes("Delayed") ? "danger" : "success"
                                    }`}
                                >
                                  {qcDueDelay}
                                </small>
                              )}
                            </div>

                            {/* QC Allocated Hours */}
                            <div className="col-12 col-sm-6 col-md-2">
                              <label className="form-label">
                                QC Allocated Hours <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.25"
                                className="form-control"
                                placeholder="0"
                                value={qcAllocatedHours}
                                onChange={(e) => {
                                  setQcAllocatedHours(e.target.value);
                                  setHasUnsavedChanges(true);
                                }}
                                required
                              />
                              <div className="form-text">(in multiple of 0.25 only)</div>
                            </div>

                            {/* QC Due */}
                            <div className="col-12 col-sm-6 col-md-2">
                              <label className="form-label">QC Due</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="--"
                                value={calculateQCDue(fileDeadlines[project.id] || readyForQcDueInput, qcAllocatedHours)}
                                disabled
                              />
                            </div>

                            <div className="col-12 col-sm-6 col-md-2">
                              <label className="form-label">Priority</label>
                              <select
                                className="form-select"
                                value={priorityAll}
                                onChange={(e) => {
                                  setPriorityAll(e.target.value);
                                  setHasUnsavedChanges(true);
                                }}
                              >
                                <option value="Low">Low</option>
                                <option value="Mid">Mid</option>
                                <option value="High">High</option>
                              </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="col-12 col-md-3 d-flex flex-column flex-md-row justify-content-md-end align-items-stretch gap-2">
                              <button
                                className="btn btn-success w-100"
                                onClick={handleUpdateProjectFiles}
                                disabled={isUpdating || !(fileDeadlines[project.id] || readyForQcDueInput) || !qcAllocatedHours}
                              >
                                {isUpdating ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-save me-2"></i>
                                    Save
                                  </>
                                )}
                              </button>
                              <button
                                className="btn btn-secondary w-100"
                                onClick={handleCloseProjectView}
                                disabled={isUpdating}
                              >
                                <i className="fas fa-times me-2"></i>
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

      {/* Hold Confirmation Modal */}
      {showHoldConfirmation && selectedProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">Hold Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowHoldConfirmation(false)}></button>
              </div>
              <div className="modal-body text-dark">
                <p>Are you sure you want to change the status of this project to "On hold"?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowHoldConfirmation(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-warning" onClick={() => handleHoldProject(selectedProject.id)}>
                  Hold Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Deadline Modal */}
      {showEditDeadlineModal && selectedProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">Edit Project Deadline</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditDeadlineModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="deadlineInput" className="form-label">Project Deadline</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="deadlineInput"
                    value={currentDeadline}
                    onChange={(e) => setCurrentDeadline(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditDeadlineModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={() => handleEditDeadline(selectedProject.id)}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS for the calendar */}
     
    </div>
  );
};

export default ActiveProjects;