import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, Trash2, Upload } from "lucide-react";
import BASE_URL from "../../../config";
import CreateNewProject from "./CreateNewProject";

const CompletedProjects = (data) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  console.log("data in completed projects:", data);

  // 从props中获取searchQuery，如果没有则使用空字符串
  const searchQuery = data?.searchQuery || "";
  console.log("searchQuery in completed projects:", searchQuery);

  const [activeTab, setActiveTab] = useState("completed");
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

  // Calendar state for file deadline
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonthCalendar, setSelectedMonthCalendar] = useState(new Date().getMonth());
  const [selectedYearCalendar, setSelectedYearCalendar] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const calendarRef = useRef(null);
  const today = new Date();

  // State for all files
  const [allFiles, setAllFiles] = useState([]);

  // Helper functions for calendar
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

    // Previous month's trailing days
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

    // Current month days
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

    // Next month's leading days
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

  const calendarDays = generateCalendarDays(selectedMonthCalendar, selectedYearCalendar, today);

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Handle ESC key to close calendar
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && calendarOpen) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [calendarOpen]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && calendarOpen) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarOpen]);

  // Format date time for display
  const formatDateTime = () => {
    if (selectedDate === null) {
      return "00:00 AM 00-00-00";
    }

    const hour = selectedHour === 0 ? 12 : selectedHour > 12 ? selectedHour - 12 : selectedHour;
    const time = `${hour.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${isAM ? "AM" : "PM"}`;

    const date = `${selectedDate.toString().padStart(2, "0")}-${(
      selectedMonthCalendar + 1
    )
      .toString()
      .padStart(2, "0")}-${selectedYearCalendar.toString().slice(-2)}`;

    return `${time} ${date}`;
  };

  // Handle calendar navigation
  const handleNextMonth = () => {
    if (selectedMonthCalendar === 11) {
      setSelectedMonthCalendar(0);
      setSelectedYearCalendar(selectedYearCalendar + 1);
    } else {
      setSelectedMonthCalendar(selectedMonthCalendar + 1);
    }
  };

  const handlePrevMonth = () => {
    if (selectedMonthCalendar === 0) {
      setSelectedMonthCalendar(11);
      setSelectedYearCalendar(selectedYearCalendar - 1);
    } else {
      setSelectedMonthCalendar(selectedMonthCalendar - 1);
    }
  };

  // Function to check if a date is in past
  const isDateInPast = (day, month, year) => {
    const selectedDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  // Function to check if time is in past for today
  const isTimeInPast = (hour, minute, isAM, date) => {
    if (!date || date !== today.getDate() || selectedMonthCalendar !== today.getMonth() || selectedYearCalendar !== today.getFullYear()) {
      return false;
    }

    const selectedHour24 = isAM ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    const selectedTime = new Date(selectedYearCalendar, selectedMonthCalendar, date, selectedHour24, minute);
    const now = new Date();

    return selectedTime < now;
  };

  // Generate year options for dropdown
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  // Set deadline from calendar
  const setDeadlineFromCalendar = () => {
    if (selectedDate === null) return;

    const deadline = `${selectedYearCalendar}-${(selectedMonthCalendar + 1)
      .toString()
      .padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}T${(isAM
        ? selectedHour === 12
          ? 0
          : selectedHour
        : selectedHour === 12
          ? 12
          : selectedHour + 12
      )
        .toString()
        .padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}:00`;

    setNewDeadline(deadline);
    setCalendarOpen(false);
  };

  // Fetch all project files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}projectFiles/getAllProjectFiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status) {
          // 确保每个文件都有一个唯一的ID字段
          const filesWithId = response.data.data.map(file => {
            // 如果文件已经有id字段，使用它；否则使用_id或创建一个临时ID
            const fileId = file.id || file._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            return {
              ...file,
              id: fileId // 确保id字段存在
            };
          });
          
          setAllFiles(filesWithId);
          console.log("Fetched Files with IDs:", filesWithId);
        } else {
          console.error("Error in response:", response.data.message);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, [token]);

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
  }, [token]);

  // Function to handle edit project
  const handleEditProject = (projectId) => {
    console.log("Edit project with ID:", projectId);
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
        // Filter files for the selected project
        const projectFiles = allFiles.filter(file => file.projectId === projectId);

        if (projectFiles.length === 0) {
          // If no files found, create mock data for demonstration
          const mockFiles = [
            { id: `mock-${Date.now()}-1`, fileName: "file1.docx", languageName: "English", applicationName: "Word", status: "Completed", lastUpdated: new Date() },
            { id: `mock-${Date.now()}-2`, fileName: "file2.xlsx", languageName: "French", applicationName: "Excel", status: "In Progress", lastUpdated: new Date() },
            { id: `mock-${Date.now()}-3`, fileName: "file3.pptx", languageName: "German", applicationName: "PowerPoint", status: "Pending", lastUpdated: new Date() }
          ];

          setSelectedFiles(mockFiles.map(file => ({
            ...file,
            selected: false
          })));
        } else {
          // 确保每个文件都有一个唯一的ID字段
          const filesWithId = projectFiles.map(file => {
            // 如果文件已经有id字段，使用它；否则使用_id或创建一个临时ID
            const fileId = file.id || file._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            return {
              ...file,
              id: fileId // 确保id字段存在
            };
          });
          
          setSelectedFiles(filesWithId.map(file => ({
            ...file,
            selected: false
          })));
        }

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
  const handleUpdateFileStatus = async () => {
    const selectedFileIds = selectedFiles
      .filter(file => file.selected)
      .map(file => file.id);

    if (selectedFileIds.length === 0) {
      alert("Please select at least one file");
      return;
    }

    if (!newDeadline) {
      alert("Please set a deadline");
      return;
    }

    try {
      // Update selected files with new status and deadline
      for (const fileId of selectedFileIds) {
        console.log("Updating file with ID:", fileId); // 添加日志以检查ID
        
        await axios.patch(
          `${BASE_URL}projectFiles/updateFileStatus/${fileId}`,
          {
            status: "Amends",
            deadline: newDeadline,
            amendsRound: amendsRound
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      

      alert("File statuses updated successfully!");

      // Refresh files list
      const filesResponse = await axios.get(`${BASE_URL}projectFiles/getAllProjectFiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (filesResponse.data.status) {
        // 确保每个文件都有一个唯一的ID字段
        const filesWithId = filesResponse.data.data.map(file => {
          // 如果文件已经有id字段，使用它；否则使用_id或创建一个临时ID
          const fileId = file.id || file._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          return {
            ...file,
            id: fileId // 确保id字段存在
          };
        });
        
        setAllFiles(filesWithId);
      }

      // Reset selections
      setSelectedFiles([]);
      setAmendsRound(1);
      setNewDeadline("");
      setShowFilesDropdown(null);
    } catch (error) {
      console.error("Failed to update file statuses:", error);
      alert("Error updating file statuses");
    }
  };

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

  // Apply filters to projects
  const filteredProjects = projects.filter((project) => {
    // Apply search filter - This is the main fix
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      project.projectTitle?.toLowerCase().includes(query) ||
      project.clientName?.toLowerCase().includes(query) ||
      project.country?.toLowerCase().includes(query) ||
      project.full_name?.toLowerCase().includes(query) ||
      project.application_name?.toLowerCase().includes(query) ||
      project.task_name?.toLowerCase().includes(query) ||
      project.language_name?.toLowerCase().includes(query);

    // Apply other filters
    const matchesClient = selectedClient === "" ||
      project.clientName === selectedClient ||
      project.client === selectedClient;

    const matchesTask = selectedTask === "" ||
      project.task_name === selectedTask ||
      project.task === selectedTask;

    const matchesApplication = selectedApplications === "" ||
      project.application_name === selectedApplications ||
      project.application === selectedApplications;

    let matchesMonth = true;
    if (selectedMonth) {
      const projectDate = new Date(project.receiveDate || project.createdAt);
      const [year, month] = selectedMonth.split('-');
      matchesMonth = projectDate.getFullYear() === parseInt(year) &&
        projectDate.getMonth() === parseInt(month) - 1;
    }

    return matchesSearch && matchesClient && matchesTask && matchesApplication && matchesMonth;
  });

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
              <th className="text-dark" style={{ width: "4%" }}>S. No.</th>
              <th className="text-dark" style={{ width: "10%" }}>Project Title</th>
              <th className="text-dark" style={{ width: "8%" }}>Client Alias Name</th>
              <th className="text-dark" style={{ width: "4%" }}>Country</th>
              <th className="text-dark" style={{ width: "10%" }}>Project Manager</th>
              <th className="text-dark" style={{ width: "8%" }}>Task</th>
              <th className="text-dark" style={{ width: "8%" }}>Languages</th>
              <th className="text-dark" style={{ width: "8%" }}>Application</th>
              <th className="text-dark" style={{ width: "4%" }}>Total Pages</th>
              <th className="text-dark" style={{ width: "6%" }}>Received Date</th>
              <th className="text-dark" style={{ width: "6%" }}>Estimated Hrs</th>
              <th className="text-dark" style={{ width: "6%" }}>Actual Hrs</th>
              <th className="text-dark" style={{ width: "6%" }}>Cost with Currency</th>
              <th className="text-dark" style={{ width: "7%" }}>Cost in INR</th>
              <th className="text-end text-dark" style={{ width: "8%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr className="text-center">
                    <td className="text-dark" style={{ maxWidth: "4ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{index + 1}</td>
                    <td className="text-dark" style={{ maxWidth: "80ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {getProjectProperty(project, ['projectTitle', 'title', 'name'])}
                      <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                        {getProjectProperty(project, ['status'])}
                      </span>
                    </td>
                    <td className="text-dark" style={{ maxWidth: "12ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getProjectProperty(project, ['clientName', 'client'])}</td>
                    <td className="text-dark" style={{ maxWidth: "3ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getProjectProperty(project, ['country'])}</td>
                    <td className="text-dark" style={{ maxWidth: "16ch", wordWrap: "break-word" }}>{getProjectProperty(project, ['projectManagerId', 'projectManager'])}</td>
                    <td className="text-dark" style={{ maxWidth: "16ch", wordWrap: "break-word" }}>
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {getProjectProperty(project, ['task_name', 'task'])}
                      </span>
                    </td>
                    <td className="text-dark" style={{ maxWidth: "16ch", wordWrap: "break-word" }}>
                      <span className="badge bg-success bg-opacity-10 text-success">
                        {getProjectProperty(project, ['language_name', 'language'])}
                      </span>
                    </td>
                    <td className="text-dark" style={{ maxWidth: "16ch", wordWrap: "break-word" }}>
                      <span className="badge bg-purple bg-opacity-10 text-purple">
                        {getProjectProperty(project, ['application_name', 'application'])}
                      </span>
                    </td>
                    <td className="text-dark" style={{ maxWidth: "4ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {getProjectProperty(project, ['totalProjectPages', 'totalPages']) ?
                        Math.floor(getProjectProperty(project, ['totalProjectPages', 'totalPages'])) : "-"}
                    </td>
                    <td className="text-dark" style={{ maxWidth: "8ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.receiveDate
                        ? new Date(project.receiveDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                        : project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                          : "-"}
                    </td>
                    <td className="text-dark" style={{ maxWidth: "6ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getProjectProperty(project, ['estimatedHours', 'expectedHours'])}</td>
                    <td className="text-dark" style={{ maxWidth: "6ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getProjectProperty(project, ['hourlyRate', 'actualHours'])}</td>
                    <td className="text-dark" style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.currency
                        ? `${project.currency} ${parseFloat(getProjectProperty(project, ['cost', 'projectCost']) || 0).toFixed(2)}`
                        : "-"}
                    </td>
                    <td className="text-dark" style={{ maxWidth: "11ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {project.totalCost ? `₹${parseFloat(project.totalCost).toFixed(2)}` : "-"}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setShowEditModal(project.id); // प्रोजेक्ट ID के साथ एडिट मोड सेट करें
                          }}
                          className="gradient-button w-100"
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

                  {showEditModal !== false && (
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
                              <h5 className="modal-title">Edit Project</h5>
                            </div>

                            <div>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                  setShowEditModal(false);
                                }}
                              ></button>
                            </div>
                          </div>
                          <div className="modal-body">
                            <CreateNewProject
                              isEditMode={true}
                              projectId={showEditModal}
                              projectData={projects.find(p => p.id === showEditModal)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Files Dropdown - FIXED TEXT VISIBILITY */}
                  {showFilesDropdown === project.id && (
                    <tr>
                      <td colSpan="15" className="p-0">
                        <div className="card">
                          <div className="card-header d-flex justify-content-between align-items-center table-gradient-bg">
                            <h5 className="mb-0 ">Project Files</h5>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setShowFilesDropdown(null)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <div className="card-body table-gradient-bg">
                            <div className="table-responsive">
                              <table className="table table-sm ">
                                <thead>
                                  <tr>
                                    <th style={{ width: "5%" }}>
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
                                    <th className="text-dark" style={{ width: "20%" }}>File Name</th>
                                    <th className="text-dark" style={{ width: "10%" }}>Language</th>
                                    <th className="text-dark" style={{ width: "10%" }}>Application</th>
                                    <th className="text-dark" style={{ width: "10%" }}>Status</th>
                                    <th className="text-dark" style={{ width: "10%" }}>Last Updated</th>
                                    <th className="text-dark" style={{ width: "10%" }}>File ID</th>
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
                                      <td className="text-dark" style={{ maxWidth: "20ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.fileName || file.name}</td>
                                      <td className="text-dark" style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.languageName || file.language}</td>
                                      <td className="text-dark" style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.applicationName || file.application}</td>
                                      <td className="text-dark" style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        <span className={`badge ${file.status === 'Completed' ? 'bg-success' : file.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'}`}>
                                          {file.status}
                                        </span>
                                      </td>
                                      <td className="text-dark" style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {file.lastUpdated ? new Date(file.lastUpdated).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "-"}
                                      </td>
                                      <td className="text-dark" style={{ maxWidth: "10ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {file.id}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-4">
                                <label className="form-label ">Amends Round</label>
                                <select
                                  className="form-select"
                                  value={amendsRound}
                                  onChange={(e) => setAmendsRound(parseInt(e.target.value))}
                                >
                                  {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label ">New Deadline</label>
                                <div className="max-w-md mx-auto" ref={calendarRef}>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={newDeadline
                                        ? new Date(newDeadline).toLocaleString('en-GB', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true,
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: '2-digit'
                                        })
                                        : formatDateTime()}
                                      readOnly
                                      onClick={() => {
                                        setCalendarOpen(!calendarOpen);
                                        // Initialize calendar with current deadline if exists
                                        if (newDeadline) {
                                          const deadline = new Date(newDeadline);
                                          setSelectedDate(deadline.getDate());
                                          setSelectedMonthCalendar(deadline.getMonth());
                                          setSelectedYearCalendar(deadline.getFullYear());
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
                                              selectedMonthCalendar + 1
                                            )
                                              .toString()
                                              .padStart(2, "0")}-${selectedYearCalendar
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
                                                        className={`time-option ${selectedHour === hour
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
                                                      className={`time-option ${selectedMinute === minute
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
                                                className={`period-option ${isAM ? "selected" : ""
                                                  }`}
                                              >
                                                AM
                                              </button>
                                              <button
                                                onClick={() => setIsAM(false)}
                                                className={`period-option ${!isAM ? "selected" : ""
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
                                                value={selectedMonthCalendar}
                                                onChange={(e) => setSelectedMonthCalendar(Number(e.target.value))}
                                                className="form-select form-select-sm"
                                              >
                                                {months.map((month, index) => (
                                                  <option key={index} value={index}>
                                                    {month}
                                                  </option>
                                                ))}
                                              </select>
                                              <select
                                                value={selectedYearCalendar}
                                                onChange={(e) => setSelectedYearCalendar(Number(e.target.value))}
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
                                                  selectedMonthCalendar === today.getMonth() &&
                                                  selectedYearCalendar === today.getFullYear()
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
                                                className={`calendar-day ${dayObj.isCurrentMonth
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
                                                setSelectedMonthCalendar(today.getMonth());
                                                setSelectedYearCalendar(today.getFullYear());
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
                                          onClick={setDeadlineFromCalendar}
                                          className="done-button"
                                        >
                                          Done
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
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
                <td colSpan="15" className="text-center text-dark">
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