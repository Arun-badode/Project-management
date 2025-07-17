import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import useSyncScroll from "../Hooks/useSyncScroll";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

import "./Project.css";
import Setting from "./Setting";
import CreateNewProject from "./CreateNewProject";

const Project = () => {
  const [activeTab, setActiveTab] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedApplications, setSelectedApplications] = useState([]);

  const clientList = ["Client A", "Client B"];
  const taskList = ["Design", "Translation", "Proofreading"];
  const applicationList = ["Adobe", "MS Word", "Figma"];
  const searchInputRef = useRef(null);
  const chartRef = useRef(null);

  const currencyRates = [
    { name: "USD", rate: 83 },
    { name: "EUR", rate: 90 },
    { name: "GBP", rate: 90 },
  ];

  const [clients, setClients] = useState([
    {
      alias: "Client Alpha (Alias)",
      actualName: "Actual Client Alpha Inc.",
      country: "USA",
      managers: "Jane Doe, John Smith",
    },
    {
      alias: "Company Beta (Alias)",
      actualName: "Actual Company Beta Ltd.",
      country: "UK",
      managers: "Peter Jones",
    },
    {
      alias: "Service Gamma (Alias)",
      actualName: "Actual Service Gamma LLC",
      country: "Canada",
      managers: "Alice Brown, Bob White",
    },
  ]);

  const [tasks, setTasks] = useState([
    "Backend Dev",
    "API Integration",
    "Frontend Dev",
    "QA Testing",
  ]);

  const [languages, setLanguages] = useState([
    "English",
    "Spanish",
    "French",
    "German",
  ]);

  const [applications, setapplications] = useState([
    "Web",
    "Mobile Responsive",
    "iOS",
    "Android",
  ]);

  const [currencies, setCurrencies] = useState([
    { name: "USD", rate: "83" },
    { name: "EUR", rate: "90" },
    { name: "GBP", rate: "90" },
  ]);

  const [newClient, setNewClient] = useState({
    alias: "",
    actualName: "",
    country: "",
    managers: "",
  });

  const [newTask, setNewTask] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newapplication, setNewapplication] = useState("");
  const [newCurrency, setNewCurrency] = useState({ name: "", rate: "" });

  const handleAddClient = () => {
    if (newClient.alias && newClient.actualName && newClient.country) {
      setClients([...clients, newClient]);
      setNewClient({ alias: "", actualName: "", country: "", managers: "" });
    }
  };

  const handleAddTask = () => {
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage("");
    }
  };

  const handleAddapplication = () => {
    if (newapplication) {
      setapplications([...applications, newapplication]);
      setNewapplication("");
    }
  };

  const handleAddCurrency = () => {
    if (newCurrency.name && newCurrency.rate) {
      setCurrencies([...currencies, newCurrency]);
      setNewCurrency({ name: "", rate: "" });
    }
  };

  const handleDeleteItem = (list, setList, index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
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
  // Sample data for projects
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Website Redesign",
      client: "Acme Corp",
      country: "United States",
      projectManager: "John Smith",
      tasks: ["Design", "Development"],
      languages: ["English", "Spanish"],
      application: "Web",
      files: [
        { name: "Homepage.psd", pageCount: 5 },
        { name: "About.psd", pageCount: 3 },
      ],
      totalPages: 16,
      receivedDate: "2025-06-20",
      status: "created",
      serverPath: "/projects/acme/redesign",
      notes: "Priority project for Q3",
      rate: 25,
      currency: "USD",
      cost: 400,
      inrCost: 33200,
    },
    {
      id: 2,
      title: "Mobile App Development",
      client: "TechStart",
      country: "Canada",
      projectManager: "Emily Johnson",
      tasks: ["Development", "Testing"],
      languages: ["English", "French"],
      application: "Mobile",
      files: [
        { name: "Login.sketch", pageCount: 2 },
        { name: "Dashboard.sketch", pageCount: 7 },
      ],
      totalPages: 18,
      receivedDate: "2025-06-15",
      status: "active",
      progress: 65,
      serverPath: "/projects/techstart/mobile",
      notes: "Beta release scheduled for August",
      rate: 30,
      currency: "USD",
      cost: 540,
      inrCost: 44820,
    },
    {
      id: 3,
      title: "E-commerce application",
      client: "RetailPlus",
      country: "UK",
      projectManager: "Michael Brown",
      tasks: ["Design", "Development", "Testing"],
      languages: ["English"],
      application: "Web",
      files: [
        { name: "ProductPage.fig", pageCount: 4 },
        { name: "Checkout.fig", pageCount: 3 },
      ],
      totalPages: 7,
      receivedDate: "2025-05-10",
      status: "completed",
      completedDate: "2025-06-10",
      serverPath: "/projects/retailplus/ecommerce",
      notes: "Successfully launched",
      rate: 28,
      currency: "GBP",
      cost: 196,
      inrCost: 20776,
      performance: {
        expectedHours: 42,
        actualHours: 38,
        stages: [
          {
            name: "Design",
            start: "2025-05-12",
            end: "2025-05-20",
            handler: "Sarah Wilson",
          },
          {
            name: "Development",
            start: "2025-05-21",
            end: "2025-06-05",
            handler: "David Lee",
          },
          {
            name: "Testing",
            start: "2025-06-06",
            end: "2025-06-10",
            handler: "Rachel Chen",
          },
        ],
      },
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    country: "",
    projectManager: "",
    tasks: [],
    languages: [],
    application: [],
    files: [{ name: "", pageCount: 0 }],
    totalPages: 0,
    receivedDate: new Date().toISOString().split("T")[0],
    serverPath: "",
    notes: "",
    rate: 0,
    currency: "USD",
    cost: 0,
    inrCost: 0,
  });

  // Options for dropdowns

  const countryOptions = [
    "United States",
    "Canada",
    "UK",
    "Australia",
    "Germany",
    "India",
  ];

  const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];

  // Filter projects based on active tab and search query
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

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Initialize chart for completed projects
  useEffect(() => {
    if (activeTab === "completed" && chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        animation: false,
        title: {
          text: "Project Performance",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Expected Hours", "Actual Hours"],
          bottom: 10,
        },
        xAxis: {
          type: "category",
          data: filteredProjects.map((p) => p.title),
        },
        yAxis: {
          type: "value",
          name: "Hours",
        },
        series: [
          {
            name: "Expected Hours",
            type: "bar",
            data: filteredProjects.map(
              (p) => p.performance?.expectedHours || 0
            ),
            color: "#4F46E5",
          },
          {
            name: "Actual Hours",
            type: "bar",
            data: filteredProjects.map((p) => p.performance?.actualHours || 0),
            color: "#10B981",
          },
        ],
      };
      chart.setOption(option);
      return () => {
        chart.dispose();
      };
    }
  }, [activeTab, filteredProjects]);

  // Calculate total pages
  const calculateTotalPages = () => {
    const totalFilePages = formData.files.reduce(
      (sum, file) => sum + (file.pageCount || 0),
      0
    );
    return totalFilePages * formData.languages.length * formData.tasks.length;
  };

  // Update total pages when form changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      totalPages: calculateTotalPages(),
    }));
  }, [formData.files, formData.languages, formData.tasks]);

  // Calculate cost
  useEffect(() => {
    const cost = formData.rate * formData.totalPages;
    let inrCost = cost;
    // Simple conversion rates (in real app would use API)
    const conversionRates = {
      USD: 83,
      EUR: 90,
      GBP: 106,
      CAD: 61,
      AUD: 55,
      INR: 1,
    };
    inrCost = cost * conversionRates[formData.currency];
    setFormData((prev) => ({
      ...prev,
      cost,
      inrCost,
    }));
  }, [formData.rate, formData.totalPages, formData.currency]);

  // Handle form input changes

  // Handle multi-select changes
  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = [...prev[name]];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [name]: newValues,
      };
    });
  };

  // Handle file input changes
  const handleFileChange = (index, field, value) => {
    setFormData((prev) => {
      const newFiles = [...prev.files];
      newFiles[index] = {
        ...newFiles[index],
        [field]: field === "pageCount" ? Number(value) : value,
      };
      return {
        ...prev,
        files: newFiles,
      };
    });
  };

  // Add new file row
  const addFileRow = () => {
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, { name: "", pageCount: 0 }],
    }));
  };

  // Remove file row
  const removeFileRow = (index) => {
    if (formData.files.length > 1) {
      setFormData((prev) => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== index),
      }));
    }
  };

  // Submit form

  // Handle edit project
  const handleEditProject = (projectId) => {
    const projectToEdit = projects.find((p) => p.id === projectId);
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title,
        client: projectToEdit.client,
        country: projectToEdit.country,
        projectManager: projectToEdit.projectManager || "",
        tasks: projectToEdit.tasks,
        languages: projectToEdit.languages,
        application: Array.isArray(projectToEdit.application)
          ? projectToEdit.application
          : [projectToEdit.application],
        files: projectToEdit.files,
        totalPages: projectToEdit.totalPages,
        receivedDate: projectToEdit.receivedDate,
        serverPath: projectToEdit.serverPath,
        notes: projectToEdit.notes || "",
        rate: projectToEdit.rate || 0,
        currency: projectToEdit.currency || "USD",
        cost: projectToEdit.cost || 0,
        inrCost: projectToEdit.inrCost || 0,
      });
      setShowEditModal(projectId);
    }
  };

  // Mark project as YTS (Yet to Start)
  const markAsYTS = (projectId, dueDate) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, status: "active", dueDate, progress: 0 }
          : project
      )
    );
  };

  // Mark project as completed
  const markAsCompleted = (projectId) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              status: "completed",
              completedDate: new Date().toISOString().split("T")[0],
              performance: {
                expectedHours: Math.round(project.totalPages * 1.5),
                actualHours: Math.round(project.totalPages * 1.3),
                stages: [
                  {
                    name: "Design",
                    start: project.receivedDate,
                    end: new Date().toISOString().split("T")[0],
                    handler: "Sarah Wilson",
                  },
                  {
                    name: "Development",
                    start: project.receivedDate,
                    end: new Date().toISOString().split("T")[0],
                    handler: "David Lee",
                  },
                  {
                    name: "Testing",
                    start: project.receivedDate,
                    end: new Date().toISOString().split("T")[0],
                    handler: "Rachel Chen",
                  },
                ],
              },
            }
          : project
      )
    );
  };

  const {
    scrollContainerRef: scrollContainerRef1,
    fakeScrollbarRef: fakeScrollbarRef1,
  } = useSyncScroll(activeTab === "created");

  const {
    scrollContainerRef: scrollContainerRef2,
    fakeScrollbarRef: fakeScrollbarRef2,
  } = useSyncScroll(activeTab === "active");

  const {
    scrollContainerRef: scrollContainerRef4,
    fakeScrollbarRef: fakeScrollbarRef4,
  } = useSyncScroll(activeTab === "completed");

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedMonth, setSelectedMonth] = useState(6); // July (0-indexed)

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  // const generateCalendarDays = () => {
  //   const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  //   const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  //   const days = [];

  //   // Previous month's trailing days
  //   const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  //   const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
  //   const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

  //   for (let i = firstDay - 1; i >= 0; i--) {
  //     days.push({
  //       day: daysInPrevMonth - i,
  //       isCurrentMonth: false,
  //       isNextMonth: false,
  //     });
  //   }

  //   // Current month days
  //   for (let day = 1; day <= daysInMonth; day++) {
  //     days.push({
  //       day,
  //       isCurrentMonth: true,
  //       isNextMonth: false,
  //     });
  //   }

  //   // Next month's leading days
  //   const remainingDays = 42 - days.length;
  //   for (let day = 1; day <= remainingDays; day++) {
  //     days.push({
  //       day,
  //       isCurrentMonth: false,
  //       isNextMonth: true,
  //     });
  //   }

  //   return days;
  // };

  return (
    <div className="conatiner-fluid bg-main mt-4">
      {/* Header */}
      <div className="bg-white shadow-sm bg-main">
        <div className="container-fluid py-2">
          <div className="row align-items-center justify-content-between g-2">
            {/* Left: Title & Buttons */}
            <div className="col-12 col-md-auto d-flex flex-column flex-md-row align-items-start align-items-md-center">
              <h2 className="mb-2 mb-md-0 gradient-heading">Projects</h2>
            </div>
            {/* Right: Search & Create */}
            <div className="col-12 col-md-auto d-flex flex-column flex-md-row align-items-stretch align-items-md-center mt-2 mt-md-0 gap-2">
              <div className="position-relative flex-grow-1">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <i className="fas fa-search text-muted"></i>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search projects "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="position-absolute top-50 end-0 translate-middle-y pe-3 small text-muted">
                  Ctrl+F
                </div>
              </div>
              {isAdmin && (
                <div className="d-flex gap-2 mt-2 mt-md-0">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="gradient-button w-100"
                  >
                    <i className="fas fa-plus me-2"></i> Create New Project
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="btn btn-light btn-sm"
                  >
                    <i className="fas fa-cog text-muted"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-bottom mt-2">
          <div className="container-fluid">
            <ul className="nav nav-tabs border-bottom-0 flex-wrap">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "created" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("created")}
                >
                  Created Projects
                  <span className="badge bg-light text-dark ms-2">
                    {projects.filter((p) => p.status === "created").length}
                  </span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "active" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("active")}
                >
                  Active Projects
                  <span className="badge bg-light text-dark ms-2">
                    {projects.filter((p) => p.status === "active").length}
                  </span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "completed" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed Projects
                  <span className="badge bg-light text-dark ms-2">
                    {projects.filter((p) => p.status === "completed").length}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid pt-5 pb-4">
        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="alert alert-info mb-4">
            <div className="d-flex">
              <div className="flex-shrink-0">
                <i className="fas fa-search me-3"></i>
              </div>
              <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                <div>
                  Showing results for "{searchQuery}" in {activeTab} projects
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn btn-link p-0"
                >
                  Clear <span className="visually-hidden">search</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Created Projects Tab */}
        {activeTab === "created" && (
          <div className="mb-4">
            <h2 className="h5 mb-3 text-light">Draft Projects</h2>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-folder-open text-muted fa-4x mb-3"></i>
                <h3 className="h6">No projects</h3>
                <p className="text-muted mb-4">
                  Get started by creating a new project.
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    <i className="fas fa-plus me-2"></i> Create New Project
                  </button>
                )}
              </div>
            ) : (
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

                {/* Scrollable Table */}
                <div
                  className="table-responsive table-gradient-bg"
                  ref={scrollContainerRef1}
                  style={{
                    maxHeight: "500px",
                    overflowX: "auto",
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE/Edge
                  }}
                >
                  <table
                    className="table table-hover mb-0"
                    style={{ minWidth: 900 }}
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
                        <th>Project Title</th>
                        <th>Client</th>
                        <th>Country</th>
                        <th>Project Manager</th>
                        <th>Tasks</th>
                        <th>Languages</th>
                        <th>Application</th>
                        <th>Total Pages</th>
                        <th>Server Path</th>
                        <th>Received Date</th>
                        <th>Rate</th>
                        <th>Cost</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.id}>
                          <td>
                            {project.title}
                            <span className="badge bg-light text-dark ms-2">
                              Draft
                            </span>
                          </td>
                          <td>{project.client}</td>
                          <td>{project.country}</td>
                          <td>{project.projectManager}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.tasks.map((task) => (
                                <span
                                  key={task}
                                  className="badge bg-primary bg-opacity-10 text-primary"
                                >
                                  {task}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.languages.map((language) => (
                                <span
                                  key={language}
                                  className="badge bg-success bg-opacity-10 text-success"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-purple bg-opacity-10 text-purple">
                              {project.application}
                            </span>
                          </td>
                          <td>{project.totalPages}</td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {project.serverPath}
                            </span>
                          </td>
                          <td>
                            {new Date(
                              project.receivedDate
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            {project.rate} {project.currency}
                          </td>
                          <td>
                            {project.cost} {project.currency}
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                onClick={() => {
                                  const dueDate = prompt(
                                    "Enter due date (YYYY-MM-DD):",
                                    new Date(
                                      Date.now() + 7 * 24 * 60 * 60 * 1000
                                    )
                                      .toISOString()
                                      .split("T")[0]
                                  );
                                  if (dueDate) markAsYTS(project.id, dueDate);
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                Mark as YTS
                              </button>
                              <button
                                onClick={() => handleEditProject(project.id)}
                                className="btn btn-sm btn-success"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-sm btn-danger">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Projects Tab */}
        {activeTab === "active" && (
          <div className="mb-4">
            <h2 className="h5 mb-3 text-light">Active Projects</h2>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-tasks text-muted fa-4x mb-3"></i>
                <h3 className="h6">No active projects</h3>
                <p className="text-muted">
                  Mark projects as YTS to move them here.
                </p>
              </div>
            ) : (
              <div className="card">
                <div
                  ref={fakeScrollbarRef2}
                  style={{
                    overflowX: "auto",
                    overflowY: "hidden",
                    height: 16,
                    position: "fixed",
                    bottom: 0, // Adjust as needed
                    left: 0,
                    right: 0,
                    zIndex: 1050,
                  }}
                >
                  <div style={{ width: "2000px", height: 1 }} />
                </div>
                {/* Scrollable Table 2 */}
                <div
                  className="table-responsive table-gradient-bg"
                  ref={scrollContainerRef2}
                  style={{
                    maxHeight: "500px",
                    overflowX: "auto",
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE/Edge
                  }}
                >
                  <table
                    className="table table-hover mb-0"
                    style={{ minWidth: 900 }}
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
                        <th>Project Title</th>
                        <th>Client</th>
                        <th>Country</th>
                        <th>Project Manager</th>
                        <th>Due Date</th>
                        <th>Progress</th>
                        <th>Tasks</th>
                        <th>Languages</th>
                        <th>Application</th>
                        <th>Total Pages</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.id}>
                          <td>
                            {project.title}
                            <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                              Active
                            </span>
                          </td>
                          <td>{project.client}</td>
                          <td>{project.country}</td>
                          <td>{project.projectManager}</td>
                          <td>
                            {new Date(project.dueDate).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="progress flex-grow-1 me-2"
                                style={{ height: "6px" }}
                              >
                                <div
                                  className="progress-bar bg-primary"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <small className="text-primary">
                                {project.progress}%
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.tasks.map((task) => (
                                <span
                                  key={task}
                                  className="badge bg-primary bg-opacity-10 text-primary"
                                >
                                  {task}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.languages.map((language) => (
                                <span
                                  key={language}
                                  className="badge bg-success bg-opacity-10 text-success"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-purple bg-opacity-10 text-purple">
                              {project.application}
                            </span>
                          </td>
                          <td>{project.totalPages}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                onClick={() => markAsCompleted(project.id)}
                                className="btn btn-sm btn-success"
                              >
                                Mark as Completed
                              </button>
                              <button
                                onClick={() => handleEditProject(project.id)}
                                className="btn btn-sm btn-success"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-sm btn-danger">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completed Projects Tab */}
        {activeTab === "completed" && (
          <div className="mb-4">
            {/* Heading and Filters */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
              <h2 className="h5 mb-0 text-light">Completed Projects</h2>
            </div>

            {/* Filters */}
            <div className="row g-3 mb-3">
              {/* Client Filter - Single Select */}
              <div className="col-md-3">
                <label className="form-label text-white">Client</label>
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
                <label className="form-label text-white">Task</label>
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
                <label className="form-label text-white">Applications</label>
                <select
                  className="form-select"
                  value={selectedApplications}
                  onChange={(e) => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setSelectedApplications(e.target.value);
                  }}
                >
                  <option value="">All Tasks</option>
                  {applicationList.map((app) => (
                    <option key={app} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month/Year Filter */}
              <div className="col-md-3">
                <label className="form-label text-white">Month/Year</label>
                <input
                  type="month"
                  className="form-control"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>

            {/* Project Table or Empty State */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-check-circle text-muted fa-4x mb-3"></i>
                <h3 className="h6">No completed projects</h3>
                <p className="text-muted">
                  Mark active projects as completed to see them here.
                </p>
              </div>
            ) : (
              <>
                {/* Completed Projects Table */}
                <div className="card">
                  <div
                    ref={fakeScrollbarRef4}
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

                  <div
                    className="table-responsive table-gradient-bg"
                    ref={scrollContainerRef4}
                    style={{
                      maxHeight: "500px",
                      overflowX: "auto",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    <table
                      className="table table-hover mb-0"
                      style={{ minWidth: 900 }}
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
                          <th>Project Title</th>
                          <th>Client</th>
                          <th>Country</th>
                          <th>Project Manager</th>
                          <th>Completed Date</th>
                          <th>Tasks</th>
                          <th>Languages</th>
                          <th>Application</th>
                          <th>Total Pages</th>
                          <th>Expected Hours</th>
                          <th>Actual Hours</th>
                          <th>Efficiency</th>
                          <th>Cost</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((project) => (
                          <tr key={project.id}>
                            <td>
                              {project.title}
                              <span className="badge bg-success bg-opacity-10 text-success ms-2">
                                Completed
                              </span>
                            </td>
                            <td>{project.client}</td>
                            <td>{project.country}</td>
                            <td>{project.projectManager}</td>
                            <td>
                              {new Date(
                                project.completedDate
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {project.tasks.map((task) => (
                                  <span
                                    key={task}
                                    className="badge bg-primary bg-opacity-10 text-primary"
                                  >
                                    {task}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {project.languages.map((language) => (
                                  <span
                                    key={language}
                                    className="badge bg-success bg-opacity-10 text-success"
                                  >
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-purple bg-opacity-10 text-purple">
                                {project.application}
                              </span>
                            </td>
                            <td>{project.totalPages}</td>
                            <td>{project.performance.expectedHours}</td>
                            <td>{project.performance.actualHours}</td>
                            <td className="fw-bold">
                              <span
                                className={`${
                                  project.performance.expectedHours >
                                  project.performance.actualHours
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {Math.round(
                                  (project.performance.expectedHours /
                                    project.performance.actualHours) *
                                    100
                                )}
                                %
                              </span>
                            </td>
                            <td>
                              {project.cost} {project.currency}
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-danger">
                                  <i className="fas fa-file-alt me-1"></i> View
                                  Report
                                </button>
                                <button className="btn btn-sm btn-primary">
                                  <i className="fas fa-archive me-1"></i>{" "}
                                  Archive
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Project Modal */}
      {(showCreateModal || showEditModal !== false) && (
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
                  {/* <button className="btn btn-light btn-sm me-4 ">
                    <i className="fas fa-cog text-muted"></i>
                  </button> */}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                    }}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <CreateNewProject />
              </div>
            </div>
          </div>
        </div>
      )}
      {showSettings && (
        <div
          className="modal fade show d-block custom-modal-dark"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content  text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-white">Settings</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowSettings(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Setting />
              </div>
              <div className="modal-footer  border-secondary">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSettings(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Backdrop for modals */}
      {(showCreateModal || showEditModal !== false || showSettings) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Project;



