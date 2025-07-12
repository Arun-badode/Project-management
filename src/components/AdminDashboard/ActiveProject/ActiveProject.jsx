import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import moment from "moment";
import Select from "react-select";
import useSyncScroll from "../Hooks/useSyncScroll";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const ActiveProject = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const userRole = localStorage.getItem("userRole");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const isAdmin = userRole === "Admin";

  const [isEdit, setIsEdit] = useState(null);

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

  const [qcAllocatedHours, setQcAllocatedHours] = useState(0.25);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    const due = params.get("due");

    let result = [...projects];

    if (filter === "active") {
      result = result.filter((project) => project.progress < 100);
    }

    if (due === "30min") {
      const now = new Date();
      const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      result = result.filter((project) => {
        const match = project.dueDate.match(
          /(\d{2}):(\d{2}) (AM|PM) (\d{2})-(\d{2})-(\d{2})/
        );
        if (!match) return false;
        let [_, hour, min, ampm, day, month, year] = match;
        hour = parseInt(hour, 10);
        if (ampm === "PM" && hour !== 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
        const dueDateObj = new Date(
          `20${year}-${month}-${day}T${hour.toString().padStart(2, "0")}:${min}`
        );
        return dueDateObj > now && dueDateObj <= thirtyMinsFromNow;
      });
    }

    setFilteredProjects(result);
  }, [location.search, projects]);

  const clientOptions = [
    "PN",
    "MMP Auburn",
    "MMP Eastlake",
    "MMP Kirkland",
    "GN",
    "DM",
    "RN",
    "NI",
    "LB",
    "SSS",
    "Cpea",
    "CV",
  ];
  const countryOptions = [
    "United States",
    "Canada",
    "UK",
    "Australia",
    "Germany",
    "India",
  ];
  const projectManagerOptions = [
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Wilson",
    "David Lee",
  ];
  const taskOptions = [
    "Source Creation",
    "Callout",
    "Prep",
    "Image Creation",
    "DTP",
    "Image Localization",
    "OVA",
  ];
  const languageOptions = [
    "af",
    "am",
    "ar",
    "az",
    "be",
    "bg",
    "bn",
    "bs",
    "ca",
    "cs",
    "cy",
    "da",
    "de",
    "el",
    "en",
    "en-US",
    "en-GB",
    "es",
    "es-ES",
    "es-MX",
    "et",
    "eu",
    "fa",
    "fi",
    "fil",
    "fr",
    "fr-FR",
    "fr-CA",
    "ga",
    "gl",
    "gu",
    "ha",
    "he",
    "hi",
    "hr",
    "hu",
    "hy",
    "id",
    "ig",
    "is",
    "it",
    "ja",
    "jv",
    "ka",
    "kk",
    "km",
    "kn",
    "ko",
    "ku",
    "ky",
    "lo",
    "lt",
    "lv",
    "mk",
    "ml",
    "mn",
    "mr",
    "ms",
    "mt",
    "my",
    "ne",
    "nl",
    "no",
    "or",
    "pa",
    "pl",
    "ps",
    "pt",
    "pt-BR",
    "pt-PT",
    "ro",
    "ru",
    "sd",
    "si",
    "sk",
    "sl",
    "so",
    "sq",
    "sr",
    "sr-Cyrl",
    "sr-Latn",
    "sv",
    "sw",
    "ta",
    "te",
    "th",
    "tl",
    "tr",
    "uk",
    "ur",
    "uz",
    "vi",
    "xh",
    "yo",
    "zh",
    "zh-Hans",
    "zh-Hant",
    "zh-TW",
  ];
  const applicationOptions = [
    "Word",
    "PPT",
    "Excel",
    "INDD",
    "AI",
    "PSD",
    "AE",
    "CDR",
    "Visio",
    "Project",
    "FM",
  ];
  const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  const [activeButton, setActivebutton] = useState("");
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
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("01");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [qcDueDelay, setQcDueDelay] = useState("");

  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const tabScrollContainerRef = useRef(null);
  const tabFakeScrollbarRef = useRef(null);
  const tabFakeScrollbarInnerRef = useRef(null);

  const statuses = [
    { key: "allstatus", label: "All Status " },
    { key: "yts", label: "YTS" },
    { key: "wip", label: "WIP" },
    { key: "readyforqc", label: "Ready for QC" },
    { key: "qareview", label: "QA Review" },
    { key: "corryts", label: "Corr YTS" },
    { key: "corrwip,", label: "Corr WIP" },
    { key: "rfd,", label: "RFD" },
  ];

  const applicationsOptio = [
    { value: "Adobe", label: "Adobe" },
    { value: "MSOffice", label: "MS Office" },
  ];

  useEffect(() => {
    setProjects(generateDummyProjects(15));
    setFilteredProjects(generateDummyProjects(15));
  }, []);

  useEffect(() => {
    let result = [...projects];

    if (activeTab === "unhandled") {
      result = result.filter(
        (project) => !project.handler || project.handler === ""
      );
    }

    if (clientFilter) {
      result = result.filter((project) => project.client === clientFilter);
    }
    if (taskFilter) {
      result = result.filter((project) => project.task === taskFilter);
    }
    if (languageFilter) {
      result = result.filter((project) => project.language === languageFilter);
    }

    result.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    setFilteredProjects(result);
  }, [projects, activeTab, clientFilter, taskFilter, languageFilter]);

  const handleCardFilter = (type) => {
    let filtered = [];
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    // Clear all filters when a button is clicked
    setClientFilter("");
    setTaskFilter("");
    setLanguageFilter("");
    setSelectedApplications([]);

    switch (type) {
      case "all":
        filtered = projects
          .slice()
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case "nearDue":
        filtered = projects.filter((project) => {
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          const dueDate = new Date(customToInputDate(project.deadline));
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        });
        break;
      case "overdue":
        filtered = projects.filter((project) => {
          const dueDate = new Date(customToInputDate(project.deadline));
          return dueDate < today && project.status !== "Completed";
        });
        break;
      case "MSOffice": {
        const msOfficeApps = [
          "Word",
          "PPT",
          "Excel",
          "Visio",
          "Project",
          "Canva",
          "MS Office",
        ];
        filtered = projects.filter((project) =>
          msOfficeApps.includes(project.application)
        );
        break;
      }
      case "Adobe": {
        const adobeApps = ["INDD", "AI", "PSD", "AE", "CDR", "FM", "Adobe"];
        filtered = projects.filter((project) =>
          adobeApps.includes(project.application)
        );
        break;
      }
      default:
        filtered = projects;
    }
    setFilteredProjects(filtered);
    setActivebutton(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showEditModal !== false) {
      setProjects(
        projects.map((project) =>
          project.id === showEditModal
            ? {
                ...project,
                ...formData,
                status: project.status,
                id: project.id,
              }
            : project
        )
      );
      setShowEditModal(false);
    } else {
      const newProject = {
        ...formData,
        id: projects.length + 1,
        status: "created",
        receivedDate:
          formData.receivedDate || new Date().toISOString().split("T")[0],
      };
      setProjects([...projects, newProject]);
      setShowCreateModal(false);
    }
    setFormData(initialFormData);
  };

  const handleDeleteProject = (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    if (window.confirm("Are you sure you want to delete this project?")) {
      // Case 1: If any file status is "YTS"
      const ytsStatuses = ["YTS"];
      const amendmentStatuses = [
        "V1 YTS",
        "V2 YTS",
        "Amendment",
        "Amendment YTS",
      ];
      let moveTo = "created";
      let updatedFiles = project.files.map((file) => {
        if (ytsStatuses.includes(file.qaStatus)) {
          return { ...file, qaStatus: "" };
        }
        return file;
      });

      // If any file has amendment status, move to completed
      if (
        project.files.some((file) => amendmentStatuses.includes(file.qaStatus))
      ) {
        moveTo = "completed";
        // Retain status
      }

      // TODO: Move project to Created or Completed Projects list as per your app logic
      // For now, just remove from active list
      setProjects(projects.filter((p) => p.id !== id));

      // You can implement logic to add to created/completed lists here
      // e.g. setCreatedProjects([...createdProjects, { ...project, files: updatedFiles }])
      // or setCompletedProjects([...completedProjects, project])
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
    setSelectedFiles([]);
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

  const applyBatchEdits = () => {
    if (selectedProject && selectedFiles.length > 0) {
      const updatedFiles = selectedProject.files.map((file) => {
        if (selectedFiles.some((f) => f.id === file.id)) {
          return {
            ...file,
            application: batchEditValues.application || file.application,
            handler: batchEditValues.handler || file.handler,
            qaReviewer: batchEditValues.qaReviewer || file.qaReviewer,
            qcDue: batchEditValues.qcDue || file.qcDue,
            qcAllocatedHours:
              batchEditValues.qcAllocatedHours || file.qcAllocatedHours,
            priority: batchEditValues.priority || file.priority,
          };
        }
        return file;
      });

      const updatedProject = {
        ...selectedProject,
        files: updatedFiles,
      };

      setSelectedProject(updatedProject);
      setProjects(
        projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      setBatchEditValues({
        application: "",
        handler: "",
        qaReviewer: "",
        qcDue: "",
        qcAllocatedHours: "",
        priority: "",
      });
      setSelectedFiles([]);
      setHasUnsavedChanges(false);
    }
  };

  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to discard them?"
        )
      ) {
        setShowDetailModal(false);
      }
    } else {
      setShowDetailModal(false);
    }
  };

  const getUniqueValues = (key) => {
    return Array.from(new Set(projects.map((project) => project[key])));
  };

  const applicationOptio = getUniqueValues("application").map((app) => ({
    value: app,
    label: app,
  }));

  const handleEditProject = (project) => {
    setEditedProject({ ...project });
    setIsEdit(project.id);
    setShowEditModal(true); // <-- Add this line
  };

  const handleSaveProjectEdit = () => {
    if (editedProject) {
      setProjects(
        projects.map((p) => (p.id === editedProject.id ? editedProject : p))
      );
      setShowEditModal(false);
      setEditedProject(null);
    }
  };

  const gradientSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
      borderColor: state.isFocused ? "#ffffff66" : "#ffffff33",
      boxShadow: state.isFocused ? "0 0 0 1px #ffffff66" : "none",
      minHeight: "38px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#1b2f6e",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#293d80"
        : "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      background: "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
    }),
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

  const handleSelectAllFiles = (e) => {
    const updatedFiles = formData.files.map((f) => ({
      ...f,
      selected: e.target.checked,
    }));
    setFormData((prev) => ({ ...prev, files: updatedFiles }));
  };

  const handleApplyToSelectedFiles = () => {
    const selected = formData.files.filter((f) => f.selected);
    if (selected.length === 0) {
      alert("No files selected.");
      return;
    }
    // Apply deadline logic here
    alert(`Deadline ${formData.deadline} applied to selected files.`);
  };

  const {
    scrollContainerRef: scrollContainerRef1,
    fakeScrollbarRef: fakeScrollbarRef1,
  } = useSyncScroll(true);

  function calculateQCDue(startDate, hours) {
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
  }

  const [dateTime, setDateTime] = useState(null);

  const handleChange = (value) => {
    setDateTime(value);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedMonth, setSelectedMonth] = useState(6); // July (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);

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

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Previous month's trailing days
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isNextMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isNextMonth: false,
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isNextMonth: true,
      });
    }

    return days;
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

  const formatDateTime = () => {
    const date = `${selectedDate.toString().padStart(2, "0")}/${(
      selectedMonth + 1
    )
      .toString()
      .padStart(2, "0")}/${selectedYear}`;
    const time = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${isAM ? "AM" : "PM"}`;
    return `${date} ${time}`;
  };

  const calendarDays = generateCalendarDays();
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
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">Project Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editedProject.title}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Client</label>
                    <select
                      className="form-select"
                      value={editedProject.client}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          client: e.target.value,
                        })
                      }
                    >
                      {getUniqueValues("client").map((client, index) => (
                        <option key={index} value={client}>
                          {client}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Task</label>
                    <select
                      className="form-select"
                      value={editedProject.task}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          task: e.target.value,
                        })
                      }
                    >
                      {getUniqueValues("task").map((task, index) => (
                        <option key={index} value={task}>
                          {task}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={editedProject.language}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          language: e.target.value,
                        })
                      }
                    >
                      {getUniqueValues("language").map((language, index) => (
                        <option key={index} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Application</label>
                    <select
                      className="form-select"
                      value={editedProject.application}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          application: e.target.value,
                        })
                      }
                    >
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Desktop">Desktop</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Due Date & Time</label>
                    <div className="input-group">
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={customToInputDate(editedProject.dueDate)}
                        onChange={(e) => {
                          setEditedProject({
                            ...editedProject,
                            dueDate: inputToCustomDate(e.target.value),
                          });
                        }}
                      />
                      <span className="input-group-text">
                        <i className="fa fa-calendar"></i>
                      </span>
                    </div>
                  </div>
                </div>
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
                  <button className="btn btn-light btn-sm me-4 ">
                    <i className="fas fa-cog text-muted"></i>
                  </button>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Project Title */}
                  <div className=" row mb-3 col-md-12">
                    <label htmlFor="title" className="form-label">
                      Project Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      maxLength={80}
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter project title (max 80 chars)"
                    />
                    <div className="form-text text-white">
                      Max allowed Character length – 80, (ignore or remove any
                      special character by itself)
                    </div>
                  </div>

                  {/* Client, Country, Project Manager */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label htmlFor="client" className="form-label">
                        Client <span className="text-danger">*</span>
                      </label>
                      <Select
                        id="client"
                        name="client"
                        options={clientOptions.map((c) => ({
                          value: c,
                          label: c,
                        }))}
                        value={
                          formData.client
                            ? { value: formData.client, label: formData.client }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            client: opt ? opt.value : "",
                          }))
                        }
                        isSearchable
                        placeholder="Select Client"
                        styles={gradientSelectStyles}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder=""
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="projectManager" className="form-label">
                        Project Manager
                      </label>
                      <Select
                        id="projectManager"
                        name="projectManager"
                        options={projectManagerOptions.map((pm) => ({
                          value: pm,
                          label: pm,
                        }))}
                        value={
                          formData.projectManager
                            ? {
                                value: formData.projectManager,
                                label: formData.projectManager,
                              }
                            : null
                        }
                        onChange={(opt) =>
                          setFormData((prev) => ({
                            ...prev,
                            projectManager: opt ? opt.value : "",
                          }))
                        }
                        isSearchable
                        placeholder=" Searchable Dropdown"
                        styles={gradientSelectStyles}
                      />
                    </div>
                  </div>

                  {/* Task & Applications */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="task" className="form-label">
                        Task <span className="text-danger">*</span>
                      </label>
                      <Select
                        id="task"
                        name="task"
                        options={taskOptions.map((t) => ({
                          value: t,
                          label: t,
                        }))}
                        value={
                          formData.tasks.length
                            ? formData.tasks.map((t) => ({
                                value: t,
                                label: t,
                              }))
                            : []
                        }
                        onChange={(opts) =>
                          setFormData((prev) => ({
                            ...prev,
                            tasks: opts ? opts.map((o) => o.value) : [],
                          }))
                        }
                        isMulti
                        isSearchable
                        placeholder="Select Task(s)"
                        styles={gradientSelectStyles}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="application" className="form-label">
                        Applications <span className="text-danger">*</span>
                      </label>
                      <Select
                        id="application"
                        name="application"
                        options={applicationOptions.map((a) => ({
                          value: a,
                          label: a,
                        }))}
                        value={
                          formData.application.length
                            ? formData.application.map((a) => ({
                                value: a,
                                label: a,
                              }))
                            : []
                        }
                        onChange={(opts) =>
                          setFormData((prev) => ({
                            ...prev,
                            application: opts ? opts.map((o) => o.value) : [],
                          }))
                        }
                        isMulti
                        isSearchable
                        placeholder="Select Application(s)"
                        styles={gradientSelectStyles}
                      />
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-3">
                    <label className="form-label">
                      Languages <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={languageOptions.map((l) => ({
                        value: l,
                        label: l,
                      }))}
                      value={
                        formData.languages.length
                          ? formData.languages.map((l) => ({
                              value: l,
                              label: l,
                            }))
                          : []
                      }
                      onChange={(opts) =>
                        setFormData((prev) => ({
                          ...prev,
                          languages: opts ? opts.map((o) => o.value) : [],
                        }))
                      }
                      isMulti
                      isSearchable
                      placeholder="Select Languages"
                      styles={gradientSelectStyles}
                    />
                    <div className="form-text text-white">
                      {formData.languages.length} selected
                    </div>
                  </div>

                  {/* File Details */}
                  <div className="mb-3">
                    <label className="form-label">File Details*:</label>
                    <div className="d-flex align-items-center gap-2 mb-2 bg-[#201E7E]">
                      <span>Count</span>
                      <input
                        type="number"
                        min={1}
                        className="form-control"
                        style={{ width: 80 }}
                        value={formData.files.length}
                        onChange={(e) => {
                          const count = Math.max(1, Number(e.target.value));
                          setFormData((prev) => ({
                            ...prev,
                            files: Array.from(
                              { length: count },
                              (_, i) =>
                                prev.files[i] || {
                                  name: "",
                                  pageCount: 0,
                                  application: "",
                                }
                            ),
                          }));
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          /* handle excel upload */
                        }}
                      >
                        Upload Excel
                      </button>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead
                          className="table-gradient-bg table"
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 0,
                            backgroundColor: "#fff", // Match your background color
                          }}
                        >
                          <tr className="text-center">
                            <th>
                              S.No.
                              <input
                                type="checkbox"
                                checked={formData.files.every(
                                  (file) => file.selected
                                )}
                                onChange={(e) => {
                                  const files = formData.files.map((file) => ({
                                    ...file,
                                    selected: e.target.checked,
                                  }));
                                  setFormData((prev) => ({ ...prev, files }));
                                }}
                              />
                            </th>
                            <th>File Name</th>
                            <th>Pages</th>
                            <th>Language</th>
                            <th>Application</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.files.map((file, idx) => (
                            <tr key={idx} className="text-center">
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  {idx + 1}
                                  <input
                                    type="checkbox"
                                    checked={file.selected || false}
                                    onChange={(e) => {
                                      const files = [...formData.files];
                                      files[idx].selected = e.target.checked;
                                      setFormData((prev) => ({
                                        ...prev,
                                        files,
                                      }));
                                    }}
                                  />
                                </div>
                              </td>

                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={file.name}
                                  onChange={(e) => {
                                    const files = [...formData.files];
                                    files[idx].name = e.target.value;
                                    setFormData((prev) => ({ ...prev, files }));
                                  }}
                                  placeholder="File Name"
                                />
                              </td>

                              <td>
                                <input
                                  type="number"
                                  min={1}
                                  className="form-control"
                                  value={file.pageCount || ""}
                                  onChange={(e) => {
                                    const files = [...formData.files];
                                    files[idx].pageCount = Number(
                                      e.target.value
                                    );
                                    setFormData((prev) => ({ ...prev, files }));
                                  }}
                                  placeholder="Pages"
                                />
                              </td>

                              <td>th</td>

                              <td>
                                <select
                                  className="form-select"
                                  value={file.application || ""}
                                  onChange={(e) => {
                                    const newApp = e.target.value;
                                    const files = [...formData.files];

                                    // check if current row is selected
                                    if (files[idx].selected) {
                                      files.forEach((f) => {
                                        if (f.selected) f.application = newApp;
                                      });
                                    } else {
                                      files[idx].application = newApp;
                                    }

                                    setFormData((prev) => ({ ...prev, files }));
                                  }}
                                >
                                  <option value="">Select</option>
                                  {applicationOptions.map((app) => (
                                    <option key={app} value={app}>
                                      {app}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td>TYS</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="d-flex align-items-center mt-3">
                        <label
                          className="text-white"
                          style={{ fontWeight: "bold" }}
                        >
                          Deadline
                        </label>
                        <div className="max-w-md mx-auto">
                          {/* Input Field */}
                          <div className="relative">
                            <input
                              type="text"
                              value={formatDateTime()}
                              readOnly
                              onClick={() => setIsOpen(!isOpen)}
                              className="bg-card w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                              placeholder="Select date and time"
                            />
                          </div>

                          {/* Calendar Dropdown */}
                          {isOpen && (
                            <div className="calendar-dropdown">
                              <style>{`
        .calendar-dropdown {
          position: absolute;
          z-index: 9999;
          margin-top: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 16px;
          width: calc(100vw - 32px);
          max-width: 30rem;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .time-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding: 12px;
          background: #2563eb;
          color: white;
          border-radius: 6px;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .time-display .time {
          font-size: 1.5rem;
          font-weight: bold;
          min-width: 80px;
        }
        
        .time-display .period {
          font-size: 0.875rem;
        }
        
        .time-display .date {
          font-size: 0.875rem;
        }
        
        .time-calendar-container {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }
        
        @media (min-width: 640px) {
          .time-calendar-container {
            flex-direction: row;
          }
        }
        
        .time-selector {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        
        .time-column {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .time-column-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .time-scroll {
          height: 200px;
          overflow-y: auto;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .time-scroll::-webkit-scrollbar {
          display: none;
        }
        
        .time-options {
          display: flex;
          flex-direction: column;
        }
        
        .time-option {
          padding: 4px 8px;
          font-size: 0.875rem;
          min-width: 40px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #374151;
        }
        
        .time-option:hover {
          background: #dbeafe;
        }
        
        .time-option.selected-hour {
          background: #2563eb;
          color: white;
        }
        
        .time-option.selected-minute {
          background: #ef4444;
          color: white;
        }
        
        .period-options {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .period-option {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.875rem;
          background: #f3f4f6;
          color: #374151;
          border: none;
          cursor: pointer;
        }
        
        .period-option:hover {
          background: #e5e7eb;
        }
        
        .period-option.selected {
          background: #2563eb;
          color: white;
        }
        
        .calendar-section {
          flex: 1;
        }
        
        .month-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .month-nav button {
          padding: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .month-nav button:hover {
          background: #f3f4f6;
        }
        
        .month-nav h3 {
          font-weight: 600;
          color: #1f2937;
          text-align: center;
          flex-grow: 1;
          margin: 0 8px;
        }
        
        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 8px;
        }
        
        .weekday {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          padding: 4px 0;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        
        .calendar-day {
          width: 100%;
          aspect-ratio: 1;
          font-size: 0.875rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          background: transparent;
        }
        
        .calendar-day.current-month {
          color: #1f2937;
        }
        
        .calendar-day.current-month:hover {
          background: #dbeafe;
        }
        
        .calendar-day.selected {
          background: #2563eb;
          color: white;
        }
        
        .calendar-day.other-month {
          color: #9ca3af;
        }
        
        .action-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }
        
        .action-button {
          color: #2563eb;
          font-size: 0.875rem;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        
        .action-button:hover {
          text-decoration: underline;
        }
        
        .done-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }
        
        .done-button {
          padding: 8px 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        
        .done-button:hover {
          background: #1d4ed8;
        }
      `}</style>

                              {/* Time Display */}
                              <div className="time-display">
                                <div className="time">
                                  {selectedHour.toString().padStart(2, "0")}:
                                  {selectedMinute.toString().padStart(2, "0")}
                                </div>
                                <div className="period">
                                  {isAM ? "AM" : "PM"}
                                </div>
                                <div className="date">
                                  {months[selectedMonth].substring(0, 3)},{" "}
                                  {selectedYear}
                                </div>
                              </div>

                              <div className="time-calendar-container">
                                {/* Time Selector */}
                                <div className="time-selector">
                                  {/* Hour Selection */}
                                  <div className="time-column">
                                    <div className="time-column-label">
                                      Hour
                                    </div>
                                    <div className="time-scroll">
                                      <div className="time-options">
                                        {[
                                          12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                        ].map((hour) => (
                                          <button
                                            key={hour}
                                            onClick={() =>
                                              setSelectedHour(hour)
                                            }
                                            className={`time-option ${
                                              selectedHour === hour
                                                ? "selected-hour"
                                                : ""
                                            }`}
                                          >
                                            {hour.toString().padStart(2, "0")}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Minute Selection */}
                                  <div className="time-column">
                                    <div className="time-column-label">Min</div>
                                    <div className="time-scroll">
                                      <div className="time-options">
                                        {[0, 15, 30, 45].map((minute) => (
                                          <button
                                            key={minute}
                                            onClick={() =>
                                              setSelectedMinute(minute)
                                            }
                                            className={`time-option ${
                                              selectedMinute === minute
                                                ? "selected-minute"
                                                : ""
                                            }`}
                                          >
                                            {minute.toString().padStart(2, "0")}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* AM/PM Toggle */}
                                  <div className="time-column">
                                    <div className="time-column-label">
                                      Period
                                    </div>
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

                                {/* Calendar */}
                                <div className="calendar-section">
                                  {/* Month Navigation */}
                                  <div className="month-nav">
                                    <button onClick={handlePrevMonth}>
                                      <ChevronLeft size={20} />
                                    </button>
                                    <h3>
                                      {months[selectedMonth]}, {selectedYear}
                                    </h3>
                                    <button onClick={handleNextMonth}>
                                      <ChevronRight size={20} />
                                    </button>
                                  </div>

                                  {/* Week Days Header */}
                                  <div className="weekdays">
                                    {weekDays.map((day) => (
                                      <div key={day} className="weekday">
                                        {day}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Calendar Grid */}
                                  <div className="calendar-grid">
                                    {calendarDays.map((dayObj, index) => (
                                      <button
                                        key={index}
                                        onClick={() =>
                                          dayObj.isCurrentMonth &&
                                          setSelectedDate(dayObj.day)
                                        }
                                        className={`calendar-day ${
                                          dayObj.isCurrentMonth
                                            ? selectedDate === dayObj.day
                                              ? "current-month selected"
                                              : "current-month"
                                            : "other-month"
                                        }`}
                                      >
                                        {dayObj.day}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="action-buttons">
                                    <button
                                      onClick={() => {
                                        setSelectedDate(new Date().getDate());
                                        setSelectedMonth(new Date().getMonth());
                                        setSelectedYear(
                                          new Date().getFullYear()
                                        );
                                      }}
                                      className="action-button"
                                    >
                                      Clear
                                    </button>
                                    <button
                                      onClick={() => {
                                        const today = new Date();
                                        setSelectedDate(today.getDate());
                                        setSelectedMonth(today.getMonth());
                                        setSelectedYear(today.getFullYear());
                                      }}
                                      className="action-button"
                                    >
                                      Today
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Close Button */}
                              <div className="done-section">
                                <button
                                  onClick={() => setIsOpen(false)}
                                  className="done-button"
                                >
                                  Done
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          className="btn"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(123,97,255,1) 0%, rgba(217,75,255,1) 100%)",
                            color: "white",
                            borderRadius: "10px",
                            padding: "6px 18px",
                          }}
                          onClick={handleApplyToSelectedFiles}
                        >
                          Apply to Selected Files
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total Pages */}
                  <div className="mb-3">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Total Pages Per Lang
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.files.reduce(
                            (sum, file) => sum + (file.pageCount || 0),
                            0
                          )}
                          readOnly
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Total Project Pages
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={
                            formData.files.reduce(
                              (sum, file) => sum + (file.pageCount || 0),
                              0
                            ) * (formData.languages.length || 1)
                          }
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="form-text text-white">
                      Total Project Pages = Total Pages × Language Count
                    </div>
                  </div>

                  {/* Received Date, Server Path, Notes */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label">
                        Received Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="receivedDate"
                        value={formData.receivedDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">
                        Server Path <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="serverPath"
                        value={formData.serverPath}
                        onChange={handleInputChange}
                        required
                        placeholder="/projects/client/project-name"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Add any additional notes or instructions..."
                      />
                    </div>
                  </div>

                  {/* Financial Section */}
                  <div className="row g-3 mb-3">
                    {/* Estimated Hrs with radio */}
                    <div className="col-md-3">
                      <label className="form-label d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="billingMode"
                          value="estimated"
                          checked={
                            formData.billingMode === "estimated" ||
                            !formData.billingMode
                          }
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              billingMode: e.target.value,
                              // Reset rate when switching to estimated hours
                              rate:
                                e.target.value === "estimated" ? "" : prev.rate,
                            }))
                          }
                        />
                        Estimated Hrs
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        step="0.25"
                        value={formData.estimatedHrs || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setFormData((prev) => ({
                            ...prev,
                            estimatedHrs: value,
                            // Auto-calculate cost when estimated hours change
                            cost: value * (prev.hourlyRate || 0),
                            inrCost:
                              value *
                              (prev.hourlyRate || 0) *
                              (prev.exchangeRate || 1),
                          }));
                        }}
                        placeholder="00.00"
                        disabled={
                          formData.billingMode !== "estimated" &&
                          formData.billingMode !== undefined
                        }
                      />
                      <div className="form-text text-white">
                        (in multiple of 0.25 only)
                      </div>
                    </div>

                    {/* Hourly Rate (auto-filled from client settings) */}
                    <div className="col-md-2">
                      <label className="form-label">Hourly Rate</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.hourlyRate || ""}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value) || 0;
                          setFormData((prev) => ({
                            ...prev,
                            hourlyRate: rate,
                            // Recalculate costs when rate changes
                            cost: prev.estimatedHrs * rate,
                            inrCost:
                              prev.estimatedHrs *
                              rate *
                              (prev.exchangeRate || 1),
                          }));
                        }}
                        placeholder="Auto from Client"
                      />
                    </div>

                    {/* Per Page Rate with radio */}
                    <div className="col-md-3">
                      <label className="form-label d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="billingMode"
                          value="perPage"
                          checked={formData.billingMode === "perPage"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              billingMode: e.target.value,
                              // Reset estimated hours when switching to per page
                              estimatedHrs:
                                e.target.value === "perPage"
                                  ? ""
                                  : prev.estimatedHrs,
                            }))
                          }
                        />
                        Per Page Rate
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        step="0.01"
                        value={formData.rate || ""}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value) || 0;
                          const totalPages = formData.files.reduce(
                            (sum, file) => sum + (file.pageCount || 0),
                            0
                          );
                          setFormData((prev) => ({
                            ...prev,
                            rate: rate,
                            // Auto-calculate cost when rate changes
                            cost: rate * totalPages,
                            inrCost:
                              rate * totalPages * (prev.exchangeRate || 1),
                          }));
                        }}
                        placeholder="00.00"
                        disabled={formData.billingMode !== "perPage"}
                      />
                      <div className="form-text text-white">
                        (with only 2 decimals)
                      </div>
                    </div>

                    {/* Currency (auto-filled from client settings) */}
                    <div className="col-md-2">
                      <label className="form-label">Currency</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.currency || "USD"} // Default to USD if not set
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            currency: e.target.value,
                          }))
                        }
                        placeholder="Auto from Client"
                      />
                    </div>

                    {/* Total Cost */}
                    <div className="col-md-2">
                      <label className="form-label">Total Cost</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.cost?.toFixed(2) || "0.00"}
                        readOnly
                        placeholder="Auto Calculated"
                      />
                    </div>

                    {/* Cost in INR */}
                    <div className="col-md-2">
                      <label className="form-label">Cost in INR</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.inrCost?.toFixed(2) || "0.00"}
                        readOnly
                        placeholder="Auto Calculated"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="d-flex justify-content-between">
                    <div className="d-flex gap-3">
                      <label
                        className="text-white"
                        style={{ fontWeight: "bold" }}
                      >
                        Deadline
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formatDateTime()}
                          readOnly
                          onClick={() => setIsOpen(!isOpen)}
                          className="bg-card w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                          placeholder="Select date and time"
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-warning fw-bold">
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with action buttons */}
      <div className="row mb-4">
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
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex  gap-2">
            <button
              className={`gradient-button ${
                activeButton === "all" ? "active-filter" : ""
              }`}
              onClick={() => handleCardFilter("all")}
            >
              All
            </button>
            <button
              className={`gradient-button ${
                activeButton === "nearDue" ? "active-filter" : ""
              }`}
              onClick={() => handleCardFilter("nearDue")}
            >
              Near Due
            </button>
            <button
              className={`gradient-button ${
                activeButton === "overdue" ? "active-filter" : ""
              }`}
              onClick={() => handleCardFilter("overdue")}
            >
              Over Due
            </button>
            <button
              className={`gradient-button ${
                activeButton === "Adobe" ? "active-filter" : ""
              }`}
              onClick={() => handleCardFilter("Adobe")}
            >
              Adobe
            </button>
            <button
              className={`gradient-button ${
                activeButton === "MSOffice" ? "active-filter" : ""
              }`}
              onClick={() => handleCardFilter("MSOffice")}
            >
              MS Office
            </button>
          </div>
        </div>
        <div
          className="col-md-6
         d-flex gap-2"
        >
          <div className=" ">
            <select
              className="form-select"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="">All Clients</option>
              {getUniqueValues("client").map((client, index) => (
                <option key={index} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <select
              className="form-select"
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
            >
              <option value="">All Tasks</option>
              {getUniqueValues("task").map((task, index) => (
                <option key={index} value={task}>
                  {task}
                </option>
              ))}
            </select>
          </div>
          <div className="  ">
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

          <div className="">
            <Select
              options={applicationsOptio}
              isMulti={false} // Single select
              className="basic-single-select"
              classNamePrefix="select"
              value={selectedApplications}
              placeholder="Select"
              onChange={(selected) => setSelectedApplications(selected)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item ">
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
            Unhandled Projects
          </button>
        </li>
      </ul>

      <div className="card">
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
          <div style={{ width: "2000px", height: 1 }} />
        </div>
        {/* Projects Table */}
        <div className="table-gradient-bg">
          <div
            className="table-responsive"
            ref={scrollContainerRef1}
            style={{
              maxHeight: "500px",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
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
                  backgroundColor: "#fff", // Match your background color
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
                  <th>Qc Hrs</th>
                  <th>Qc Due Date</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <React.Fragment key={project.id}>
                    <tr
                      className={
                        expandedRow === project.id
                          ? "table-active text-center"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{project.title}</td>
                      <td>{project.client}</td>
                      <td>{project.task}</td>
                      <td>{project.language}</td>
                      <td>{project.application}</td>
                      <td>{project.totalPages}</td>
                      <td>{project.deadline}</td>
                      <td>{project.readyDeadline}</td>
                      <td>{project.qcHrs}</td>
                      <td>{project.qcDueDate}</td>
                      <td>{project.status}</td>

                      <td>
                        <div
                          className="progress cursor-pointer"
                          style={{ height: "24px" }}
                          onClick={() => handleViewProject(project)}
                        >
                          <div
                            className={`progress-bar 
                          ${
                            project.progress < 30
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
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleViewProject(project)}
                          >
                            <i
                              className={`fas ${
                                expandedRow === project.id
                                  ? "fa-chevron-up"
                                  : "fa-eye"
                              }`}
                            ></i>
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditProject(project)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          {project.progress === 100 && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleMarkComplete(project.id)}
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedRow === project.id && (
                      <tr>
                        <td colSpan={14} className="p-0 border-top-0">
                          <div className="p-4">
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

                              {/* Batch Edit Controls */}

                              {/* Files Table */}
                              <div className="table-responsive">
                                <table className="table table-sm table-striped table-hover">
                                  <thead
                                    className="table-gradient-bg table"
                                    style={{
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 2,
                                      backgroundColor: "#fff", // Match your background color
                                    }}
                                  >
                                    <tr className="text-center">
                                      <th>
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={
                                            selectedFiles.length ===
                                            project?.files?.length
                                          }
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedFiles([
                                                ...project.files,
                                              ]);
                                            } else {
                                              setSelectedFiles([]);
                                            }
                                            setHasUnsavedChanges(true);
                                          }}
                                        />
                                      </th>
                                      <th>File Name</th>
                                      <th>Pages</th>
                                      <th>Language</th>
                                      <th>Application</th>
                                      <th>Handler</th>
                                      <th>QA Reviewer</th>
                                      <th>QA Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {project.files.map((file) => (
                                      <tr
                                        key={file.id}
                                        className={
                                          selectedFiles.some(
                                            (f) => f.id === file.id
                                          )
                                            ? "table-primary text-center"
                                            : ""
                                        }
                                      >
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedFiles.some(
                                              (f) => f.id === file.id
                                            )}
                                            onChange={() =>
                                              toggleFileSelection(file)
                                            }
                                          />
                                        </td>
                                        <td>{file.name}</td>
                                        <td>{file.pages}</td>
                                        <td>{file.language}</td>
                                        <td>{file.application}</td>
                                        <td>
                                          <select
                                            className="form-select form-select-sm"
                                            value={file.handler || ""}
                                            onChange={(e) => {
                                              const updatedFiles =
                                                project.files.map((f) =>
                                                  f.id === file.id
                                                    ? {
                                                        ...f,
                                                        handler: e.target.value,
                                                      }
                                                    : f
                                                );
                                              setSelectedProject({
                                                ...project,
                                                files: updatedFiles,
                                              });
                                              setHasUnsavedChanges(true);
                                            }}
                                          >
                                            <option value="">
                                              Not Assigned
                                            </option>
                                            <option value="John Doe">
                                              John Doe
                                            </option>
                                            <option value="Jane Smith">
                                              Jane Smith
                                            </option>
                                            <option value="Mike Johnson">
                                              Mike Johnson
                                            </option>
                                          </select>
                                        </td>
                                        <td>
                                          <select
                                            className="form-select form-select-sm"
                                            value={file.qaReviewer || ""}
                                            onChange={(e) => {
                                              const updatedFiles =
                                                project.files.map((f) =>
                                                  f.id === file.id
                                                    ? {
                                                        ...f,
                                                        qaReviewer:
                                                          e.target.value,
                                                      }
                                                    : f
                                                );
                                              setSelectedProject({
                                                ...project,
                                                files: updatedFiles,
                                              });
                                              setHasUnsavedChanges(true);
                                            }}
                                          >
                                            <option value="">
                                              Not Assigned
                                            </option>
                                            <option value="Sarah Williams">
                                              Sarah Williams
                                            </option>
                                            <option value="David Brown">
                                              David Brown
                                            </option>
                                            <option value="Emily Davis">
                                              Emily Davis
                                            </option>
                                          </select>
                                        </td>
                                        <td>Corr WIP</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div className="col-md-2 d-flex align-items-center justify-conetnt-center">
                                  <button
                                    className="btn btn-info mb-4 "
                                    disabled={selectedFiles.length === 0}
                                    onClick={applyBatchEdits}
                                  >
                                    Apply to Selected
                                  </button>
                                </div>
                              </div>

                              {/* Batch Edit Controls */}
                              {/* Label Row */}
                              <div className="row g-3 mb-1">
                                <div className="col-md-2">
                                  <label className="form-label">
                                    Ready for QC Due
                                  </label>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">
                                    QC Allocated Hours
                                  </label>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">QC Due</label>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">Priority</label>
                                </div>
                                <div className="col-md-2">
                                  <label className="form-label">Actions</label>
                                </div>
                              </div>

                              {/* Input Row */}
                              <div className="row g-3 mb-3 align-items-start">
                                {/* Ready for QC Due */}
                                <div className="col-md-2">
                                  <DatePicker
                                    selected={selectedDateTime}
                                    onChange={(date) =>
                                      setSelectedDateTime(date)
                                    }
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="h:mm aa dd-MM-yyyy"
                                    placeholderText="Select date and time"
                                    className="form-control"
                                  />
                                </div>

                                {/* QC Allocated Hours */}
                                <div className="col-md-2">
                                  <input
                                    type="number"
                                    className="form-control"
                                    step="0.25"
                                    min="0"
                                    value={qcAllocatedHours}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (
                                        !isNaN(val) &&
                                        val >= 0 &&
                                        val % 0.25 === 0
                                      ) {
                                        setQcAllocatedHours(val);
                                      }
                                    }}
                                    placeholder="0.00"
                                  />
                                  <div className="small text-white">
                                    (in multiple of 0.25 only)
                                  </div>
                                </div>

                                {/* QC Due (calculated) */}
                                <div className="col-md-2">
                                  <div className="form-control  fw-bold">
                                    {calculateQCDue(
                                      selectedDateTime,
                                      qcAllocatedHours
                                    )}
                                  </div>
                                </div>

                                {/* Priority */}
                                <div className="col-md-2">
                                  <select className="form-select">
                                    <option>Low</option>
                                    <option>Mid</option>
                                    <option>High</option>
                                  </select>
                                </div>

                                {/* Save & Close Buttons */}
                                <div className="col-md-2 d-flex gap-2">
                                  <button className="btn btn-success w-100">
                                    Save
                                  </button>
                                  <button className="btn btn-secondary w-100">
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Footer buttons */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function customToInputDate(str) {
  if (!str) return "";
  const match = str.match(/(\d{2}):(\d{2}) (AM|PM) (\d{2})-(\d{2})-(\d{2})/);
  if (!match) return "";
  let [_, hour, min, ampm, day, month, year] = match;
  hour = parseInt(hour, 10);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  hour = hour.toString().padStart(2, "0");
  return `20${year}-${month}-${day}T${hour}:${min}`;
}

function inputToCustomDate(str) {
  if (!str) return "";
  const d = new Date(str);
  if (isNaN(d)) return "";
  let hour = d.getHours();
  const min = d.getMinutes().toString().padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear().toString().slice(2);
  return `${hour
    .toString()
    .padStart(2, "0")}:${min} ${ampm} ${day}-${month}-${year}`;
}

const generateDummyProjects = (count) => {
  const clients = [
    "PN",
    "MMP Auburn",
    "MMP Eastlake",
    "MMP Kirkland",
    "GN",
    "DM",
    "RN",
    "NI",
    "LB",
    "SSS",
    "Cpea",
    "CV",
  ];
  const tasks = [
    "Source Creation",
    "Callout",
    "Prep",
    "Image Creation",
    "DTP",
    "Image Localization",
    "OVA",
  ];
  const languages = [
    "af",
    "am",
    "ar",
    "az",
    "be",

    "tr",
    "uk",
    "ur",
    "uz",
    "vi",
    "xh",
    "yo",
    "zh",
    "zh-Hans",
    "zh-Hant",
    "zh-TW",
  ];
  const applications = [
    "Word",
    "PPT",
    "Excel",
    "INDD",
    "AI",
    "PSD",
    "AE",
    "CDR",
    "Visio",
    "Project",
    "FM",
  ];

  const statuses = [
    "QC YTS",
    "WIP",
    "QC WIP",
    "WIP",
    "Corr YTS",
    "WIP",
    "Corr YTS",
    "Corr WIP",
    "WIP",
    "QC YTS",
    "Corr YTS",
  ];
  const stages = ["In Progress", "Review", "Completed", "On Hold"];
  const qaStatuses = ["Pending", "In Progress", "Approved", "Rejected"];
  const handlers = ["John Doe", "Jane Smith", "Mike Johnson", ""];
  const qaReviewers = ["Sarah Williams", "David Brown", "Emily Davis", ""];

  const projects = [];

  for (let i = 1; i <= count; i++) {
    const totalPages = Math.floor(Math.random() * 100) + 10;
    const progress = Math.floor(Math.random() * 101);
    const handler = handlers[Math.floor(Math.random() * handlers.length)];

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    dueDate.setHours(hours, minutes);

    const formattedDueDate = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"} ${dueDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(dueDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dueDate.getFullYear().toString().slice(2)}`;

    // Add random readyDeadline, qcHrs, qcDueDate, status
    const readyDeadline = `${(hours + 1) % 24}:${minutes
      .toString()
      .padStart(2, "0")} ${hours + 1 >= 12 ? "PM" : "AM"} ${dueDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(dueDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dueDate.getFullYear().toString().slice(2)}`;
    const qcHrs = Math.floor(Math.random() * 15) + 1;
    const qcDueDate = `${(hours + 2) % 24}:${minutes
      .toString()
      .padStart(2, "0")} ${hours + 2 >= 12 ? "PM" : "AM"} ${dueDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(dueDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dueDate.getFullYear().toString().slice(2)}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const fileCount = Math.floor(Math.random() * 5) + 1;
    const files = [];
    for (let j = 1; j <= fileCount; j++) {
      const filePages = Math.floor(Math.random() * 20) + 1;
      files.push({
        id: j,
        name: `File_${i}_${j}.docx`,
        pages: filePages,
        language: languages[Math.floor(Math.random() * languages.length)],
        application:
          applications[Math.floor(Math.random() * applications.length)],
        stage: stages[Math.floor(Math.random() * stages.length)],
        assigned: new Date(
          dueDate.getTime() -
            Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toLocaleDateString(),
        handler: handler,
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      });
    }
    projects.push({
      id: i,
      title: `Project ${i}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      task: tasks[Math.floor(Math.random() * tasks.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      application:
        applications[Math.floor(Math.random() * applications.length)],
      totalPages,
      deadline: formattedDueDate,
      readyDeadline,
      qcHrs,
      qcDueDate,
      status,
      progress,
      handler,
      files,
    });
  }
  return projects;
};
export default ActiveProject;
