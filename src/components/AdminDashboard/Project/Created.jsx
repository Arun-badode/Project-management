import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, Trash2, Upload } from "lucide-react";
import BASE_URL from "../../../config";

const Created = ({ data }) => {
  console.log("UpdateUpdateProjectPermissionUpdateProjectPermissionUpdateProjectPermission", data);
  const [fileDeadlines, setFileDeadlines] = useState({});

  const [activeTab, setActiveTab] = React.useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("authToken");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  // this state variables is for storing the files details and storing them in database using api 
  const [allFiles, setAllFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Edit form states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    projectTitle: "",  // Changed from projectTitle to match database
    clientId: "", // Changed from clientName to match database
    country: "",
    projectManagerId: "",
    taskId: "",
    languageId: "",
    applicationId: "",
    totalProjectPages: "",
    receiveDate: "",
    estimatedHours: "",
    currency: "",
    totalCost: "",
  });

  // Calendar state for file deadline
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const calendarRef = useRef(null);
  const today = new Date();

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

  const calendarDays = generateCalendarDays(selectedMonth, selectedYear, today);

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
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
    const date = `${selectedDate.toString().padStart(2, "0")}-${(
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

  // Function to check if a date is in the past
  const isDateInPast = (day, month, year) => {
    const selectedDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  // Function to check if time is in the past for today
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
  const setDeadlineFromCalendar = (projectId) => {
    if (selectedDate === null) return;

    const deadline = `${selectedYear}-${(selectedMonth + 1)
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

    setFileDeadlines(prev => ({
      ...prev,
      [projectId]: deadline
    }));
    
    setCalendarOpen(false);
  };

  // THIS API IS FOR fetching files from the api 
  // ✅ Fetch all project files on mount
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

  useEffect(() => {
    axios
      .get(`${BASE_URL}project/getAllProjects`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setProjects(res.data.projects);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesTab = project.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.projectManager &&
        project.projectManager
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      project.files.some((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  // Function to mark project as Active/YTS
  const markAsActiveOrYTS = async (projectId) => {
    try {
      // Prompt user to enter deadline with date and time
      const deadline = prompt("Enter deadline date and time (YYYY-MM-DD HH:MM):");

      if (!deadline || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(deadline)) {
        alert("Invalid or empty datetime. Please use YYYY-MM-DD HH:MM format.");
        return;
      }

      // Update project status to Active and set deadline
      const res = await axios.patch(
        `${BASE_URL}project/updateProject/${projectId}`,
        {
          status: "Active",
          deadline: deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        // Update all files in the project to YTS status
        const projectFiles = allFiles.filter(file => file.projectId === projectId);

        for (const file of projectFiles) {
          await axios.patch(
            `${BASE_URL}projectFiles/updateFileStatus/${file.id}`,
            {
              status: "YTS",
              deadline: deadline
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        alert("Project status updated to Active and all files marked as YTS!");

        // Refresh project list
        const refreshed = await axios.get(`${BASE_URL}project/getAllProjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (refreshed.data.status) {
          setProjects(refreshed.data.projects);
        }
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
      alert("Error updating project status");
    }
  };

  // Function to open edit modal with project data
  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditFormData({
      projectTitle: project.projectTitle || "",  // Changed from projectTitle to match database
      clientId: project.clientId || "", // Changed from clientName to match database
      country: project.country || "",
      projectManagerId: project.projectManagerId || "",
      taskId: project.taskId || "",
      languageId: project.languageId || "",
      applicationId: project.applicationId || "",
      totalProjectPages: project.totalProjectPages || "",
      receiveDate: project.receiveDate ? new Date(project.receiveDate).toISOString().slice(0, 16) : "",
      estimatedHours: project.estimatedHours || "",
      currency: project.currency || "",
      totalCost: project.totalCost || "",
    });
    setShowEditModal(true);
  };

  // Function to handle form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to save edited project
  const saveEditedProject = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}project/updateProject/${editingProject.id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        alert("Project updated successfully!");

        // Refresh project list
        const refreshed = await axios.get(`${BASE_URL}project/getAllProjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (refreshed.data.status) {
          setProjects(refreshed.data.projects);
        }

        setShowEditModal(false);
      } else {
        alert("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project");
    }
  };

  // Function to copy server path to clipboard
  const copyServerPath = (project) => {
    const serverPath = `\\\\server\\projects\\${project.id}`; // Adjust path format as needed
    navigator.clipboard.writeText(serverPath)
      .then(() => {
        alert("Server path copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy server path");
      });
  };

  // Function to handle delete project with confirmation
  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      axios.delete(`${BASE_URL}project/deleteProject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.data.status) {
            alert("Project deleted successfully!");
            setProjects(projects.filter(project => project.id !== id));
          } else {
            alert("Failed to delete project");
          }
        })
        .catch(err => {
          console.error("Error deleting project:", err);
          alert("Error deleting project");
        });
    }
  };

  // Function to save file status updates
  const saveFileStatusUpdates = async (projectId) => {
    try {
      const deadline = fileDeadlines[projectId];

      if (!deadline) {
        alert("Please set a deadline before saving.");
        return;
      }

      // Update selected files with new status and deadline
      for (const fileId of selectedFiles) {
        await axios.patch(
          `${BASE_URL}projectFiles/updateFileStatus/${fileId}`,
          {
            status: fileStatuses[fileId] || "YTS",
            deadline: deadline
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
        setAllFiles(filesResponse.data.data);
      }

      // Clear selections
      setSelectedFiles([]);
      setFileDeadlines(prev => ({ ...prev, [projectId]: "" }));
    } catch (error) {
      console.error("Failed to update file statuses:", error);
      alert("Error updating file statuses");
    }
  };
  // const CreateProjectPermission = Number(projectPermission?.canAdd);
  // const UpdateProjectPermission = Number(projectPermission?.canEdit);
  // const DeleteProjectPermission = Number(projectPermission?.canDelete);
  // console.log("CreateProjectPermission", CreateProjectPermission);
  // console.log("UpdateProjectPermission", UpdateProjectPermission);
  // console.log("DeleteProjectPermission", DeleteProjectPermission);

  return (
    <div>
      {loading ? (
        <p>Loading Projects...</p>
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
              <th>S.No.</th>
              <th>Project Title</th>
              <th>Client Name</th>
              <th>Country</th>
              <th>Project Manager</th>
              <th>Task</th>
              <th>Languages</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Received Date</th>
              <th>Estimated Hrs</th>
              <th>Cost with Currency</th>
              <th>Cost in INR</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((project) => project.status === "In Progress")
              .map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr className="text-center">
                    <td>{index + 1}</td>
                    <td>
                      {project.title}
                      <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                        {project.status}
                      </span>
                    </td>
                    <td>{project.clientName || "-"}</td>
                    <td>{project.country}</td>
                    <td>{project.full_name}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {project.task_name}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success">
                        {project.language_name}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-purple bg-opacity-10 text-purple">
                        {project.application_name}
                      </span>
                    </td>
                    <td>{project.totalProjectPages}</td>
                    <td>
                      {project.receiveDate
                        ? new Date(project.receiveDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{project.estimatedHours || "-"}</td>
                    <td>
                      {project.currency
                        ? `${project.currency || "USD"} ${project.totalCost}`
                        : "-"}
                    </td>
                    <td>{project.totalCost ? `₹${project.totalCost}` : "-"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() =>
                            setExpandedProjectId(
                              expandedProjectId === project.id ? null : project.id
                            )
                          }
                          aria-label="Show Files"
                          className="btn btn-sm btn-secondary"
                          title="Project Files"
                        >
                          <i className="fas fa-folder-open"></i>
                        </button>
                        <button
                          onClick={() => markAsActiveOrYTS(project.id)}
                          className="btn btn-sm btn-success"
                          title="Mark as Active/YTS"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        {data?.UpdateProjectPermission === 1 &&
                          (
                            <button
                              onClick={() => handleEditProject(project)}
                              className="btn btn-sm btn-primary"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                        <button
                          onClick={() => copyServerPath(project)}
                          className="btn btn-sm btn-info"
                          title="Copy Server Path"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                        {
                          data?.DeleteProjectPermission === 1 && (
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="btn btn-sm btn-danger"
                              title="Delete"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          )
                        }
                      </div>
                    </td>
                  </tr>
                  {expandedProjectId === project.id && (
                    <tr>
                      <td colSpan={15}>
                        {/* Files Table */}
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Project Files</h5>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-sm table-striped table-hover">
                              <thead>
                                <tr className="text-center">
                                  <th>
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedFiles.length ===
                                        allFiles.filter((file) => file.projectId === project.id).length
                                      }
                                      onChange={(e) => {
                                        const projectFiles = allFiles.filter((file) => file.projectId === project.id);
                                        if (e.target.checked) {
                                          setSelectedFiles(projectFiles.map((file) => file.id));
                                        } else {
                                          setSelectedFiles([]);
                                        }
                                      }}
                                    />
                                    File ID
                                  </th>
                                  <th>File Name</th>
                                  <th>Pages</th>
                                  <th>Language</th>
                                  <th>Application</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allFiles
                                  .filter((file) => file.projectId === project.id)
                                  .map((file) => (
                                    <tr key={file.id}>
                                      <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                          <input
                                            type="checkbox"
                                            checked={selectedFiles.includes(file.id)}
                                            onChange={(e) => {
                                              setSelectedFiles((prev) =>
                                                e.target.checked
                                                  ? [...prev, file.id]
                                                  : prev.filter((id) => id !== file.id)
                                              );
                                            }}
                                          />
                                          <span>{file.id}</span>
                                        </div>
                                      </td>
                                      <td>{file.fileName}</td>
                                      <td>{file.pages}</td>
                                      <td>{file.languageName || "N/A"}</td>
                                      <td>{file.applicationName || "N/A"}</td>
                                      <td>
                                        <select
                                          value={fileStatuses[file.id] || file.status || "Pending"}
                                          onChange={(e) =>
                                            setFileStatuses((prev) => ({
                                              ...prev,
                                              [file.id]: e.target.value,
                                            }))
                                          }
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="YTS">YTS</option>
                                          <option value="WIP">WIP</option>
                                          <option value="QC YTS">QC YTS</option>
                                          <option value="QC WIP">QC WIP</option>
                                          <option value="Corr YTS">Corr YTS</option>
                                          <option value="Corr WIP">Corr WIP</option>
                                          <option value="RFD">RFD</option>
                                        </select>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="d-flex align-items-center gap-3">
                              <label className="form-label mb-0">Deadline:</label>
                              <div className="max-w-md mx-auto" ref={calendarRef}>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={fileDeadlines[project.id] 
                                      ? new Date(fileDeadlines[project.id]).toLocaleString() 
                                      : formatDateTime()}
                                    readOnly
                                    onClick={() => {
                                      setCalendarOpen(!calendarOpen);
                                      // Initialize calendar with current deadline if exists
                                      if (fileDeadlines[project.id]) {
                                        const deadline = new Date(fileDeadlines[project.id]);
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
                                        onClick={() => setDeadlineFromCalendar(project.id)}
                                        className="done-button"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn btn-primary mt-2"
                                onClick={() => saveFileStatusUpdates(project.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary mt-2 ms-2"
                                onClick={() => setExpandedProjectId(null)}
                              >
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

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title " style={{ color: "black" }} >Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"  // Changed from projectTitle to match database
                        value={editFormData.projectTitle}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark">Client Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="client"  // Changed from clientName to match database
                        value={editFormData.clientId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={editFormData.country}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark">Project Manager</label>
                      <input
                        type="text"
                        className="form-control"
                        name="projectManagerId"
                        value={editFormData.projectManagerId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label text-dark">Task</label>
                      <input
                        type="text"
                        className="form-control"
                        name="task_name"
                        value={editFormData.taskId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark">Language</label>
                      <input
                        type="text"
                        className="form-control"
                        name="language_name"
                        value={editFormData.languageId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark">Application</label>
                      <input
                        type="text"
                        className="form-control"
                        name="application_name"
                        value={editFormData.applicationId}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label text-dark">Total Pages</label>
                      <input
                        type="number"
                        className="form-control"
                        name="totalProjectPages"
                        value={editFormData.totalProjectPages}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark">Received Date</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="receiveDate"
                        value={editFormData.receiveDate}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark">Estimated Hours</label>
                      <input
                        type="number"
                        className="form-control"
                        name="estimatedHours"
                        value={editFormData.estimatedHours}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark">Currency</label>
                      <input
                        type="text"
                        className="form-control"
                        name="currency"
                        value={editFormData.currency}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark">Total Cost</label>
                      <input
                        type="number"
                        className="form-control"
                        name="totalCost"
                        value={editFormData.totalCost}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={saveEditedProject}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Created;