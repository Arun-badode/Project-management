import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import useSyncScroll from "../Hooks/useSyncScroll";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import CreateNewProject from "../Project/CreateNewProject";
import EditModal from "./EditModal";
import BASE_URL from "../../../config";

const ActiveProject = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [fileDeadlines, setFileDeadlines] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const userRole = localStorage.getItem("userRole");
  const [expandedRow, setExpandedRow] = useState(null);
  const selectedDateTime = useState(null);
  const isAdmin = userRole === "Admin";
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // File handlers state - tracks assigned handlers for each file
  const [fileHandlers, setFileHandlers] = useState({});

  // this state variables is for storing the files details and storing them in database using api 
  const [allFiles, setAllFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}projectFiles/getAllProjectFiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status) {
          setAllFiles(response.data.data);  // Use `data`, not `files`

          // Initialize file handlers state with existing handlers
          const handlers = {};
          response.data.data.forEach(file => {
            if (file.handler) {
              handlers[file.id] = file.handler;
            }
          });
          setFileHandlers(handlers);
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

  const assignees = [
    { label: "Not Assigned", value: "" },
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
    { label: "Mike Johnson", value: "Mike Johnson" },
  ];

  const handleHandlerChange = (fileId, newHandler) => {
    const updatedHandlers = { ...fileHandlers };
    updatedHandlers[fileId] = newHandler;
    setFileHandlers(updatedHandlers);
    setHasUnsavedChanges(true);
  };

  const initialFormData = {
    title: "",
    client: "",
    country: "",
    projectManager: "",
    tasks: [],
    languages: [],
    application: [],
    files: [
      [
        { name: "File_1", pageCount: 3, application: "", selected: false },
        { name: "File_2", pageCount: 5, application: "", selected: false },
        { name: "File_3", pageCount: 4, application: "", selected: false },
        { name: "File_4", pageCount: 2, application: "", selected: false },
        { name: "File_5", pageCount: 6, application: "", selected: false },
        { name: "File_6", pageCount: 7, application: "", selected: false },
        { name: "File_7", pageCount: 8, application: "", selected: false },
      ],
    ],
    totalPages: 0,
    deadline: "",
    readyDeadline: "",
    qcHrs: "",
    receivedDate: new Date().toISOString().split("T")[0],
    serverPath: "",
    notes: "",
    rate: 0,
    currency: "USD",
    cost: 0,
    inrCost: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [qcAllocatedHours, setQcAllocatedHours] = useState(0.0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [activeButton, setActiveButton] = useState("");
  const [readyForQcDueInput, setReadyForQcDueInput] = useState("");
  const [priorityAll, setPriorityAll] = useState("Mid");
  const [batchEditValues, setBatchEditValues] = useState({
    application: "",
    handler: "",
    qaReviewer: "",
    qcDue: "",
    qcAllocatedHours: "",
    priority: "",
  });
  const [permissions, setPermissions] = useState([]);

  const [qcDueDelay, setQcDueDelay] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Store project files data
  const [projectFiles, setProjectFiles] = useState({});

  const statuses = [
    { key: "allstatus", label: "All Status" },
    { key: "yts", label: "YTS" },
    { key: "wip", label: "WIP" },
    { key: "readyforqc", label: "Ready for QC" },
    { key: "qareview", label: "QA Review" },
    { key: "corryts", label: "Corr YTS" },
    { key: "corrwip", label: "Corr WIP" },
    { key: "rfd", label: "RFD" },
  ];

  const applicationsOptions = [
    { value: "Adobe", label: "Adobe" },
    { value: "MSOffice", label: "MS Office" },
  ];
  const roleId = localStorage.getItem("roleId");

  // 🔹 Fetch permissions from API
  useEffect(() => {
    axios
      .get(`${BASE_URL}roles/permission/${roleId}`)
      .then((res) => {
        if (res.data.status) {
          setPermissions(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching permissions", err);
      });
  }, [roleId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}project/getAllProjects`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        // Add progress percentage based on status
        const projectsWithProgress = data.projects.map(project => ({
          ...project,
          progress: getProgressPercentage(project.status)
        }));
        setProjects(projectsWithProgress);
        setFilteredProjects(projectsWithProgress);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to calculate progress percentage based on status
  const getProgressPercentage = (status) => {
    if (!status) return 0;

    const statusLower = status.toLowerCase();
    if (statusLower === "yts") return 0;
    if (statusLower === "wip") return 30;
    if (statusLower === "qc yts" || statusLower === "qcyts") return 60;
    if (statusLower === "qc wip" || statusLower === "qcwip") return 70;
    if (statusLower === "corr yts" || statusLower === "corryts") return 75;
    if (statusLower === "corr wip" || statusLower === "corrwip") return 90;
    if (statusLower === "rfd") return 100;

    return 0; // Default case
  };

  useEffect(() => {
    let result = [...projects];

    // Only show "active" projects (not completed/cancelled/archived)
    result = result.filter(
      (project) =>
        !["Completed", "Cancelled", "Archived"].includes(
          (project.status || "").toLowerCase()
        )
    );

    // Apply tab filter
    if (activeTab === "unhandled") {
      // Show projects where at least one file is unassigned
      result = result.filter((project) => {
        const filesForProject = allFiles.filter(f => f.projectId === project.id);
        // If any file does NOT have a handler, include this project
        return filesForProject.some(f => !fileHandlers[f.id]);
      });
    }

    // Apply button filters
    if (activeButton === "nearDue") {
      const now = new Date();
      const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      result = result.filter((project) => {
        const dueDate = new Date(project.deadline);
        return dueDate > now && dueDate <= thirtyMinsFromNow;
      });
    } else if (activeButton === "overdue") {
      const now = new Date();
      result = result.filter((project) => {
        const dueDate = new Date(project.deadline);
        return dueDate < now && project.status !== "Completed";
      });
    } else if (activeButton === "Adobe") {
      const adobeApps = ["INDD", "AI", "PSD", "AE", "CDR", "FM", "Adobe"];
      result = result.filter((project) =>
        adobeApps.includes(project.application_name)
      );
    } else if (activeButton === "MSOffice") {
      const msOfficeApps = [
        "Word",
        "PPT",
        "Excel",
        "Visio",
        "Project",
        "Canva",
        "MS Office",
      ];
      result = result.filter((project) =>
        msOfficeApps.includes(project.application_name)
      );
    }

    // Apply dropdown filters
    if (clientFilter) {
      result = result.filter((project) =>
        project.clientId && project.clientId.toString() === clientFilter
      );
    }
    if (taskFilter) {
      result = result.filter((project) =>
        project.task_name && project.task_name.toLowerCase().includes(taskFilter.toLowerCase())
      );
    }
    if (languageFilter && languageFilter !== "allstatus") {
      result = result.filter((project) =>
        project.status && project.status.toLowerCase() === languageFilter.toLowerCase()
      );
    }
    if (selectedApplications.length > 0) {
      const selectedAppValues = selectedApplications.map(app => app.value);
      result = result.filter((project) =>
        selectedAppValues.includes(project.application_name)
      );
    }

    // Sort by deadline
    result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    setFilteredProjects(result);
  }, [projects, activeTab, activeButton, clientFilter, taskFilter, languageFilter, selectedApplications, allFiles, fileHandlers]);

  const handleDeleteProject = async (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await axios.delete(
          `${BASE_URL}project/deleteProject/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setProjects(projects.filter((p) => p.id !== id));
          alert("Project deleted successfully!");
        } else {
          alert("Failed to delete project.");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Error deleting project.");
      }
    }
  };

  const handleMarkComplete = (id) => {
    if (
      window.confirm("Are you sure you want to mark this project as complete?")
    ) {
      setProjects(projects.filter((project) => project.id !== id));
    }
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
      qcDue: "",
      qcAllocatedHours: "",
      priority: "",
    });

    // Reset form values when opening a new project
    setReadyForQcDueInput("");
    setQcAllocatedHours(0.0);
    setPriorityAll("Mid");
    setQcDueDelay("");

    setExpandedRow(expandedRow === project.id ? null : project.id);
  };

  const toggleFileSelection = (file) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
    setHasUnsavedChanges(true);
  };

  const getUniqueValues = (key) => {
    const uniqueValues = new Set();
    projects.forEach((project) => {
      if (project[key]) {
        uniqueValues.add(project[key]);
      }
    });
    return Array.from(uniqueValues);
  };

  const handleEditProject = (project) => {
    setEditedProject({ ...project });
    setShowEditModal(true);
  };

  const handleSaveProjectEdit = () => {
    if (editedProject) {
      const updatedProject = {
        ...editedProject,
        progress: getProgressPercentage(editedProject.status)
      };
      setProjects(
        projects.map((p) => (p.id === editedProject.id ? updatedProject : p))
      );
      setShowEditModal(false);
      setEditedProject(null);
    }
  };

  const handleUpdateProjectFiles = async () => {
    if (!selectedProject || !selectedProject.id) {
      alert("No project selected");
      return;
    }

    // Validate required fields
    if (!readyForQcDueInput) {
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
      const qcDueCalculated = calculateQCDue(readyForQcDueInput, qcAllocatedHours);

      // Get all files for this project
      const projectFiles = allFiles.filter(file => file.projectId === selectedProject.id);

      // Check if all files have handlers assigned
      const allFilesAssigned = projectFiles.every(file => fileHandlers[file.id]);

      // Determine project status based on file assignments
      let projectStatus = selectedProject.status;
      if (allFilesAssigned) {
        // If all files have handlers, update status to "WIP" if it was "YTS"
        if (projectStatus === "YTS") {
          projectStatus = "WIP";
        }
      }

      // -----------------------------------
      // 1. Update each Project File individually
      // -----------------------------------
      for (const file of projectFiles) {
        const fileUpdateData = {
          projectId: parseInt(selectedProject.id),
          fileName: file.fileName, // Include the fileName
          languageId: file.languageId, // Include the languageId
          applicationId: file.applicationId, // Include the applicationId
          pages: file.pages, // Include the pages
          status: file.status || "Pending", // Include the status
          deadline: file.deadline, // Include the deadline
          readyForQcDue: readyForQcDueInput,
          qcAllocatedHours: parseFloat(qcAllocatedHours),
          qcDue: qcDueCalculated,
          priority: priorityAll,
          handler: fileHandlers[file.id] || "",
        };

        const fileUpdateResponse = await axios.patch(
          `${BASE_URL}projectFiles/updateProjectFile/${file.id}`, // Use file ID instead of project ID
          fileUpdateData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (fileUpdateResponse.status !== 200) {
          throw new Error(`Failed to update project file ${file.fileName}`);
        }
      }

      // -----------------------------------
      // 2. Update the Project
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

        // Updated fields
        readyQCDeadline: readyForQcDueInput,
        qcHrs: parseFloat(qcAllocatedHours),
        qcDueDate: qcDueCalculated,
        status: projectStatus, // Update status based on file assignments
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

      // Update the projects state with the new data
      const updatedProjects = projects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            readyQCDeadline: readyForQcDueInput,
            qcHrs: qcAllocatedHours,
            qcDueDate: qcDueCalculated,
            status: projectStatus,
            progress: getProgressPercentage(projectStatus), // Update progress based on status
          };
        }
        return project;
      });

      setProjects(updatedProjects);

      // Update the selected project state
      setSelectedProject(prev => ({
        ...prev,
        readyQCDeadline: readyForQcDueInput,
        qcHrs: qcAllocatedHours,
        qcDueDate: qcDueCalculated,
        status: projectStatus,
        progress: getProgressPercentage(projectStatus),
      }));

      setHasUnsavedChanges(false);
      alert("Project and project files updated successfully!");
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
  };

  useEffect(() => {
    if (!readyForQcDueInput) {
      setQcDueDelay("");
      return;
    }

    const updateDelay = () => {
      const delayText = calculateTimeDiff(readyForQcDueInput);
      setQcDueDelay(delayText);
    };

    updateDelay();
    const interval = setInterval(updateDelay, 60000);
    return () => clearInterval(interval);
  }, [readyForQcDueInput]);

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

  const handleCreateNewProject = () => {
    setFormData(initialFormData);
    setShowCreateModal(true);
  };

  const handleApplyToSelectedFiles = () => {
    const selected = formData.files.filter((f) => f.selected);
    if (selected.length === 0) {
      alert("No files selected.");
      return;
    }
    alert(`Deadline ${formData.deadline} applied to selected files.`);
  };

  const {
    scrollContainerRef: scrollContainerRef1,
    fakeScrollbarRef: fakeScrollbarRef1,
  } = useSyncScroll(true);

  // Add your office holidays here (format: 'YYYY-MM-DD')
  const officeHolidays = [
    "2025-08-15", // Example: Independence Day
    // Add more dates as needed
  ];

  function isWorkingDay(date) {
    const day = date.getDay();
    // 0 = Sunday, 6 = Saturday (but Saturday is working)
    return day !== 0;
  }

  function isHoliday(date) {
    const dateStr = date.toISOString().split("T")[0];
    return officeHolidays.includes(dateStr);
  }

  function getNextWorkingStart(date) {
    // If after 11:30 PM, move to next day 11:30 AM
    let next = new Date(date);
    if (next.getHours() > 23 || (next.getHours() === 23 && next.getMinutes() > 30)) {
      next.setDate(next.getDate() + 1);
      next.setHours(11, 30, 0, 0);
    } else if (next.getHours() < 11 || (next.getHours() === 11 && next.getMinutes() < 30)) {
      next.setHours(11, 30, 0, 0);
    }
    // Skip holidays and Sundays
    while (!isWorkingDay(next) || isHoliday(next)) {
      next.setDate(next.getDate() + 1);
      next.setHours(11, 30, 0, 0);
    }
    return next;
  }

  function calculateQCDue(startDate, hours) {
    if (!startDate || !hours) return "--";

    let remaining = parseFloat(hours);
    let current = new Date(startDate);

    // If start date is a holiday or Sunday, move to next working day
    if (!isWorkingDay(current) || isHoliday(current)) {
      current = getNextWorkingStart(current);
    }

    // If start time is before 11:30 AM, move to 11:30 AM
    if (current.getHours() < 11 || (current.getHours() === 11 && current.getMinutes() < 30)) {
      current.setHours(11, 30, 0, 0);
    }

    // If start time is after 11:30 PM, move to next day 11:30 AM
    if (current.getHours() > 23 || (current.getHours() === 23 && current.getMinutes() > 30)) {
      current.setDate(current.getDate() + 1);
      current.setHours(11, 30, 0, 0);

      // Skip holidays and Sundays
      while (!isWorkingDay(current) || isHoliday(current)) {
        current.setDate(current.getDate() + 1);
        current.setHours(11, 30, 0, 0);
      }
    }

    while (remaining > 0) {
      // Check if current day is a working day
      if (!isWorkingDay(current) || isHoliday(current)) {
        // Move to next working day
        current.setDate(current.getDate() + 1);
        current.setHours(11, 30, 0, 0);
        continue;
      }

      // End of today's working hours
      let endOfDay = new Date(current);
      endOfDay.setHours(23, 30, 0, 0);

      let minutesLeftToday = (endOfDay - current) / (1000 * 60); // minutes

      let allocMinutes = Math.min(remaining * 60, minutesLeftToday);

      current.setMinutes(current.getMinutes() + allocMinutes);
      remaining -= allocMinutes / 60;

      // If still time left, move to next working day
      if (remaining > 0) {
        current.setDate(current.getDate() + 1);
        current.setHours(11, 30, 0, 0);

        // Skip holidays and Sundays
        while (!isWorkingDay(current) || isHoliday(current)) {
          current.setDate(current.getDate() + 1);
          current.setHours(11, 30, 0, 0);
        }
      }
    }

    return current.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const handleCardFilter = (type) => {
    setActiveButton(type);
    // The actual filtering is handled in the useEffect above
  };

  const getClientOptions = () => {
    const uniqueClients = new Set();
    projects.forEach(project => {
      if (project.clientId) {
        uniqueClients.add(project.clientId.toString());
      }
    });
    return Array.from(uniqueClients).map(client => ({
      value: client,
      label: client
    }));
  };

  const getTaskOptions = () => {
    const uniqueTasks = new Set();
    projects.forEach(project => {
      if (project.task_name) {
        uniqueTasks.add(project.task_name);
      }
    });
    return Array.from(uniqueTasks).map(task => ({
      value: task,
      label: task
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const projectPermission = permissions.find(p => p.featureName === "Active Projects"); // moduleName ya jo bhi aapke backend me key ho
  const CreateProjectPermission = Number(projectPermission?.canAdd);
  const UpdateProjectPermission = Number(projectPermission?.canEdit);
  const DeleteProjectPermission = Number(projectPermission?.canDelete);
  
  // Function to truncate text to a specific length
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Function to format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Function to format cost
  const formatCost = (cost, currency) => {
    if (!cost && cost !== 0) return '';
    const numCost = parseFloat(cost);
    return numCost.toFixed(2) + ' ' + (currency || 'USD');
  };

  return (
    <div className="container-fluid py-4">
      {/* Edit Project Modal */}
      {showEditModal && editedProject && (
        <div
          className="modal fade show custom-modal-dark"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <EditModal project={editedProject} setProject={setEditedProject} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveProjectEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          className="modal fade show d-block custom-modal-dark"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <div>
                  <h5 className="modal-title">Create New Project</h5>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <CreateNewProject
                  onClose={() => setShowCreateModal(false)}
                  onProjectCreated={(newProject) => {
                    // Add progress percentage to new project
                    const projectWithProgress = {
                      ...newProject,
                      progress: getProgressPercentage(newProject.status)
                    };
                    setProjects([...projects, projectWithProgress]);
                    setShowCreateModal(false);
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Header with action buttons */}
      {CreateProjectPermission === 1 && <div className="row mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <h2 className="gradient-heading">Active Projects</h2>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <Button
              className="gradient-button"
              onClick={handleCreateNewProject}
            >
              <i className="fas fa-plus me-2"></i> Create New Project
            </Button>
          </div>
        </div>
      </div>}

      {/* Filters */}
      <div className="row mb-4 gy-3">
        {/* Buttons Section */}
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-wrap gap-2 justify-content-start">
            {["all", "nearDue", "overdue", "Adobe", "MSOffice"].map((btn) => (
              <button
                key={btn}
                className={`gradient-button ${activeButton === btn ? "active-filter" : ""
                  }`}
                onClick={() => handleCardFilter(btn)}
              >
                {btn === "all"
                  ? "All"
                  : btn === "nearDue"
                    ? "Near Due"
                    : btn === "overdue"
                      ? "Over Due"
                      : btn === "Adobe"
                        ? "Adobe"
                        : "MS Office"}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Dropdowns Section */}
        <div className="col-12 col-lg-6">
          <div className="row g-2">
            {/* Client Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
              >
                <option value="">All Clients</option>
                {getClientOptions().map((client, index) => (
                  <option key={index} value={client.value}>
                    {client.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
              >
                <option value="">All Tasks</option>
                {getTaskOptions().map((task, index) => (
                  <option key={index} value={task.value}>
                    {task.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status/Language Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                {statuses.map((status, index) => (
                  <option key={index} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Application (Select component) */}
            <div className="col-12 col-sm-6 col-md-3">
              <Select
                options={applicationsOptions}
                isMulti={false}
                classNamePrefix="select"
                value={selectedApplications}
                placeholder="Select App"
                onChange={(selected) => setSelectedApplications(selected)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Active Projects
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "unhandled" ? "active" : ""}`}
            onClick={() => setActiveTab("unhandled")}
          >
            Unhandled Projects ({projects.filter(
              (project) => {
                const projectFiles = allFiles.filter(file => file.projectId === project.id);
                return projectFiles.length > 0 && projectFiles.some(file => !fileHandlers[file.id]);
              }
            ).length})
          </button>
        </li>
      </ul>

      <div className="card">
        {/* Projects Table */}
        <div className="table-gradient-bg">
          <div
            ref={fakeScrollbarRef1}
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              height: 16,
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1050,
            }}
          >
            <div style={{ width: "2500px", height: 1 }} />
          </div>

          <div
            className="table-responsive"
            style={{
              maxHeight: "500px",
              overflowX: "auto",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
            ref={scrollContainerRef1}
          >
            <table
              className="table-gradient-bg align-middle mt-0 table table-bordered table-hover"
              style={{ minWidth: "1500px" }}
            >
              <thead
                className="table-gradient-bg table"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "#fff",
                }}
              >
                <tr className="text-center">
                  <th style={{ width: "60px" }}>S. No.</th>
                  <th style={{ width: "240px" }}>Project Title</th>
                  <th style={{ width: "120px" }}>Client</th>
                  <th style={{ width: "80px" }}>Country</th>
                  <th style={{ width: "160px" }}>Project Manager</th>
                  <th style={{ width: "160px" }}>Task</th>
                  <th style={{ width: "160px" }}>Languages</th>
                  <th style={{ width: "160px" }}>Application</th>
                  <th style={{ width: "80px" }}>Total Pages</th>
                  <th style={{ width: "120px" }}>Received Date</th>
                  <th style={{ width: "100px" }}>Estimated Hrs</th>
                  <th style={{ width: "100px" }}>Actual Hrs</th>
                  <th style={{ width: "100px" }}>Efficiency</th>
                  <th style={{ width: "200px" }}>Deadline</th>
                  <th style={{ width: "200px" }}>Ready For QC Deadline</th>
                  <th style={{ width: "80px" }}>QC Hrs</th>
                  <th style={{ width: "200px" }}>QC Due Date</th>
                  <th style={{ width: "120px" }}>Status</th>
                  <th style={{ width: "100px" }}>Progress</th>
                  <th style={{ width: "130px" }}>Cost</th>
                  <th style={{ width: "130px" }}>Cost in INR</th>
                  <th style={{ width: "150px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <React.Fragment key={project.id}>
                      <tr
                        className={
                          expandedRow === project.id
                            ? "table-active text-center"
                            : ""
                        }
                      >
                        <td>{index + 1}</td>
                        <td title={project.projectTitle}>{truncateText(project.projectTitle, 80)}</td>
                        <td title={project.clientName}>{truncateText(project.clientName, 12)}</td>
                        <td title={project.country}>{truncateText(project.country, 3)}</td>
                        <td title={project.projectManagerName}>{truncateText(project.projectManagerName, 16)}</td>
                        <td title={project.task_name}>{truncateText(project.task_name, 16)}</td>
                        <td title={project.language_name}>{truncateText(project.language_name, 16)}</td>
                        <td title={project.application_name}>{truncateText(project.application_name, 16)}</td>
                        <td>{project.totalPagesLang}</td>
                        <td>{formatDate(project.receiveDate)}</td>
                        <td>{project.estimatedHours}</td>
                        <td>{project.actualHours}</td>
                        <td>{project.efficiency}</td>
                        <td>{formatDateTime(project.deadline)}</td>
                        <td>{formatDateTime(project.readyQCDeadline)}</td>
                        <td>{project.qcHrs}</td>
                        <td>{formatDateTime(project.qcDueDate)}</td>
                        <td>{truncateText(project.status, 15)}</td>
                        <td>
                          <div
                            className="progress cursor-pointer"
                            style={{ height: "24px" }}
                            onClick={() => handleViewProject(project)}
                          >
                            <div
                              className={`progress-bar 
                            ${project.progress < 30
                                  ? "bg-danger"
                                  : project.progress < 70
                                    ? "bg-warning"
                                    : "bg-success"
                                }`}
                              role="progressbar"
                              style={{ width: `${project.progress}%` }}
                              aria-valuenow={project.progress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              {project.progress}%
                            </div>
                          </div>
                        </td>
                        <td>{formatCost(project.totalCost, project.currency)}</td>
                        <td>{formatCost(project.inrCost, "INR")}</td>
                        <td>
                          <div className="d-flex gap-2">
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
                            {UpdateProjectPermission === 1 && <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleEditProject(project)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>}
                            {project.progress === 100 && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleMarkComplete(project.id)}
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}
                            {DeleteProjectPermission ===1  && <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>}
                          </div>
                        </td>
                      </tr>

                      {expandedRow === project.id && (
                        <tr>
                          <td colSpan={21} className="p-0 border-top-0">
                            <div className="p-4">
                              {/* Unsaved Changes Warning */}
                              {hasUnsavedChanges && (
                                <div className="alert alert-warning mb-3">
                                  <i className="fas fa-exclamation-triangle me-2"></i>
                                  You have unsaved changes. Please save or discard them.
                                </div>
                              )}

                              {/* Project Files Header */}
                              <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h5 className="mb-0">Project Files</h5>
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
                                        <th>
                                          <input type="checkbox" />
                                        </th>
                                        <th>File Name</th>
                                        <th>Pages</th>
                                        <th>Language</th>
                                        <th>Application</th>
                                        <th>Handler</th>
                                        <th>QA Reviewer</th>
                                        <th>Status</th>
                                        <th>Preview</th>
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
                                            <td>{file.fileName}</td>
                                            <td>{file.pages}</td>
                                            <td>{file.languageName}</td>
                                            <td>{file.applicationName}</td>
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
                                            <td>{file.status || "Pending"}</td>
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
                              <div className="row g-3 align-items-start mb-3">
                                {/* Ready for QC Due */}
                                <div className="col-12 col-sm-6 col-md-3">
                                  <label className="form-label">
                                    Ready for QC Due <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={readyForQcDueInput}
                                    onChange={(e) => {
                                      setReadyForQcDueInput(e.target.value);
                                      setHasUnsavedChanges(true);
                                    }}
                                    required
                                  />
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
                                    value={calculateQCDue(readyForQcDueInput, qcAllocatedHours)}
                                    disabled
                                  />
                                </div>

                                {/* Priority */}
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
                                    disabled={isUpdating || !readyForQcDueInput || !qcAllocatedHours}
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


                              {/* Additional Info Section */}
                              {hasUnsavedChanges && (
                                <div className="row">
                                  <div className="col-12">
                                    <div className="alert alert-info">
                                      <i className="fas fa-info-circle me-2"></i>
                                      <strong>Note:</strong> Make sure to save your changes before closing or switching to another project.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={21} className="text-center py-4">
                      No projects found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveProject;