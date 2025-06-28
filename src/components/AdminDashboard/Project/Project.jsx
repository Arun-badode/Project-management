import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import useSyncScroll from "../Hooks/useSyncScroll";

const Project = () => {
  const [activeTab, setActiveTab] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const searchInputRef = useRef(null);
  const chartRef = useRef(null);

  const applicationOptions = ["Web", "Mobile Responsive", "iOS", "Android"];
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

  const [platforms, setPlatforms] = useState([
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
  const [newPlatform, setNewPlatform] = useState("");
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

  const handleAddPlatform = () => {
    if (newPlatform) {
      setPlatforms([...platforms, newPlatform]);
      setNewPlatform("");
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
      platform: "Web",
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
      platform: "Mobile",
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
      title: "E-commerce Platform",
      client: "RetailPlus",
      country: "UK",
      projectManager: "Michael Brown",
      tasks: ["Design", "Development", "Testing"],
      languages: ["English"],
      platform: "Web",
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
    platform: [],
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
  const clientOptions = [
    "Acme Corp",
    "TechStart",
    "RetailPlus",
    "GlobalMedia",
    "FinTech Solutions",
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
    "Design",
    "Development",
    "Testing",
    "Content",
    "QA",
    "Localization",
  ];
  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
  ];
  const platformOptions = ["Web", "Mobile", "Desktop", "Cross-platform"];
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (showEditModal !== false) {
      // Update existing project
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
      // Create new project
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
    // Reset form
    setFormData({
      title: "",
      client: "",
      country: "",
      projectManager: "",
      tasks: [],
      languages: [],
      platform: [],
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
  };

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
        platform: Array.isArray(projectToEdit.platform)
          ? projectToEdit.platform
          : [projectToEdit.platform],
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

  return (
    <div className="min-vh-100 bg-main mt-4">
      {/* Header */}
      <div className="bg-white shadow-sm bg-main">
        <div className="container-fluid py-2">
          <div className="row align-items-center justify-content-between g-2">
            {/* Left: Title & Buttons */}
            <div className="col-12 col-md-auto d-flex flex-column flex-md-row align-items-start align-items-md-center">
              <h2 className="mb-2 mb-md-0 gradient-heading">Projects</h2>
              <div className="d-flex flex-wrap ms-md-3 gap-2">
                <button className="btn btn-success text-light">
                  <i className="fas fa-file-excel text-light me-2"></i>
                  Blank Excel
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-file-import text-light me-2"></i>
                  Import Excel
                </button>
                <button className="btn btn-dark">
                  <i className="fas fa-file-download text-indigo me-2"></i>
                  Download Excel
                </button>
              </div>
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
                  placeholder="Search projects (Ctrl+F)"
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
      <div className="container pt-5 pb-4">
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
                {/* <div className="table-responsive" style={{ overflowX: 'auto' }}>
                  <table className="table table-hover mb-0" style={{ minWidth: 900 }}>
                    <thead className="bg-light table-gradient-bg">
                      <tr>
                        <th>Project Title</th>
                        <th>Client</th>
                        <th>Country</th>
                        <th>Project Manager</th>
                        <th>Tasks</th>
                        <th>Languages</th>
                        <th>Platform</th>
                        <th>Total Pages</th>
                        <th>Server Path</th>
                        <th>Received Date</th>
                        <th>Rate</th>
                        <th>Cost</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map(project => (
                        <tr key={project.id}>
                          <td>
                            {project.title}
                            <span className="badge text-dark ms-2">Draft</span>
                          </td>
                          <td>{project.client}</td>
                          <td>{project.country}</td>
                          <td>{project.projectManager}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.tasks.map((task) => (
                                <span key={task} className="badge bg-primary bg-opacity-10 text-primary">
                                  {task}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.languages.map((language) => (
                                <span key={language} className="badge bg-success bg-opacity-10 text-success">
                                  {language}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-purple bg-opacity-10 text-purple">
                              {project.platform}
                            </span>
                          </td>
                          <td>{project.totalPages}</td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {project.serverPath}
                            </span>
                          </td>
                          <td>{new Date(project.receivedDate).toLocaleDateString()}</td>
                          <td>{project.rate} {project.currency}</td>
                          <td>{project.cost} {project.currency}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                onClick={() => {
                                  const dueDate = prompt('Enter due date (YYYY-MM-DD):', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
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
                </div> */}
                {/* Fake Scrollbar */}
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
                  style={{ overflowX: "auto", maxHeight: "500px" }}
                >
                  <table
                    className="table table-hover mb-0"
                    style={{ minWidth: 900 }}
                  >
                    <thead className=" table-gradient-bg">
                      <tr>
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
                              {project.platform}
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
                {/* <div className="table-responsive" style={{ overflowX: 'auto' }}>
                  <table className="table table-hover mb-0" style={{ minWidth: 900 }}>
                    <thead className=" ">
                      <tr>
                        <th>Project Title</th>
                        <th>Client</th>
                        <th>Country</th>
                        <th>Project Manager</th>
                        <th>Due Date</th>
                        <th>Progress</th>
                        <th>Tasks</th>
                        <th>Languages</th>
                        <th>Platform</th>
                        <th>Total Pages</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map(project => (
                        <tr key={project.id}>
                          <td>
                            {project.title}
                            <span className="badge bg-warning bg-opacity-10 text-warning ms-2">Active</span>
                          </td>
                          <td>{project.client}</td>
                          <td>{project.country}</td>
                          <td>{project.projectManager}</td>
                          <td>{new Date(project.dueDate).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                                <div
                                  className="progress-bar bg-primary"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <small className="text-primary">{project.progress}%</small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.tasks.map((task) => (
                                <span key={task} className="badge bg-primary bg-opacity-10 text-primary">
                                  {task}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.languages.map((language) => (
                                <span key={language} className="badge bg-success bg-opacity-10 text-success">
                                  {language}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-purple bg-opacity-10 text-purple">
                              {project.platform}
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
                </div> */}
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
                  style={{ overflowX: "auto", maxHeight: "500px" }}
                >
                  <table
                    className="table table-hover mb-0"
                    style={{ minWidth: 900 }}
                  >
                    <thead className=" table-gradient-bg">
                      <tr>
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
                              {project.platform}
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

        {/* Completed Projects Tab */}
        {activeTab === "completed" && (
          <div className="mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
              <h2 className="h5 mb-0 text-light">Completed Projects</h2>
              <button className="btn btn-success btn-sm w-100 w-md-auto">
                <i className="fas fa-file-excel me-2"></i> Export to Excel
              </button>
            </div>
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
                {/* Performance Chart */}
                <div className="card mb-4 bg-card text-light">
                  <div className="card-body">
                    <div
                      ref={chartRef}
                      style={{ height: "400px", minWidth: "300px" }}
                    ></div>
                  </div>
                </div>
                {/* Project Cards */}
                <div className="card">
                  {/* <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="table table-hover mb-0" style={{ minWidth: 900 }}>
                      <thead className="">
                        <tr>
                          <th>Project Title</th>
                          <th>Client</th>
                          <th>Country</th>
                          <th>Project Manager</th>
                          <th>Completed Date</th>
                          <th>Tasks</th>
                          <th>Languages</th>
                          <th>Platform</th>
                          <th>Total Pages</th>
                          <th>Expected Hours</th>
                          <th>Actual Hours</th>
                          <th>Efficiency</th>
                          <th>Cost</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map(project => (
                          <tr key={project.id}>
                            <td>
                              {project.title}
                              <span className="badge bg-success bg-opacity-10 text-success ms-2">Completed</span>
                            </td>
                            <td>{project.client}</td>
                            <td>{project.country}</td>
                            <td>{project.projectManager}</td>
                            <td>{new Date(project.completedDate).toLocaleDateString()}</td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {project.tasks.map((task) => (
                                  <span key={task} className="badge bg-primary bg-opacity-10 text-primary">
                                    {task}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {project.languages.map((language) => (
                                  <span key={language} className="badge bg-success bg-opacity-10 text-success">
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-purple bg-opacity-10 text-purple">
                                {project.platform}
                              </span>
                            </td>
                            <td>{project.totalPages}</td>
                            <td>{project.performance.expectedHours}</td>
                            <td>{project.performance.actualHours}</td>
                            <td className="fw-bold">
                              <span className={`${project.performance.expectedHours > project.performance.actualHours ? 'text-success' : 'text-danger'}`}>
                                {Math.round((project.performance.expectedHours / project.performance.actualHours) * 100)}%
                              </span>
                            </td>
                            <td>{project.cost} {project.currency}</td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-danger">
                                  <i className="fas fa-file-alt me-1"></i> View Report
                                </button>
                                <button className="btn btn-sm btn-primary">
                                  <i className="fas fa-archive me-1"></i> Archive
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div> */}
                  <div
                    ref={fakeScrollbarRef4}
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
                  {/* Scrollable Table 3 */}
                  <div
                    className="table-responsive table-gradient-bg"
                    ref={scrollContainerRef4}
                    style={{ overflowX: "auto", maxHeight: "500px" }}
                  >
                    <table
                      className="table table-hover mb-0"
                      style={{ minWidth: 900 }}
                    >
                      <thead className="table-gradient-bg">
                        <tr>
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
                                {project.platform}
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
              <div className="modal-header">
                <h5 className="modal-title">
                  {showEditModal !== false
                    ? "Edit Project Details"
                    : "Create New Project"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Basic Info Section */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      Basic Information
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label htmlFor="title" className="form-label">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="client" className="form-label">
                          Client *
                        </label>
                        <select
                          className="form-select"
                          id="client"
                          name="client"
                          required
                          value={formData.client}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Client</option>
                          {clientOptions.map((client) => (
                            <option key={client} value={client}>
                              {client}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="country" className="form-label">
                          Country *
                        </label>
                        <select
                          className="form-select"
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Country</option>
                          {countryOptions.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                      {isAdmin && (
                        <div className="col-md-4">
                          <label
                            htmlFor="projectManager"
                            className="form-label"
                          >
                            Project Manager
                          </label>
                          <select
                            className="form-select"
                            id="projectManager"
                            name="projectManager"
                            value={formData.projectManager}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Project Manager</option>
                            {projectManagerOptions.map((pm) => (
                              <option key={pm} value={pm}>
                                {pm}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Details Section */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">Project Details</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Tasks *</label>
                        <div className="d-flex flex-wrap gap-2">
                          {taskOptions.map((task) => (
                            <button
                              key={task}
                              type="button"
                              onClick={() =>
                                handleMultiSelectChange("tasks", task)
                              }
                              className={`btn btn-sm ${
                                formData.tasks.includes(task)
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                            >
                              {task}
                              {formData.tasks.includes(task) && (
                                <i className="fas fa-check ms-2"></i>
                              )}
                            </button>
                          ))}
                        </div>
                        {formData.tasks.length === 0 && (
                          <div className="text-danger small mt-1">
                            Please select at least one task
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Languages *</label>
                        <div className="d-flex flex-wrap gap-2">
                          {languageOptions.map((language) => (
                            <button
                              key={language}
                              type="button"
                              onClick={() =>
                                handleMultiSelectChange("languages", language)
                              }
                              className={`btn btn-sm ${
                                formData.languages.includes(language)
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                            >
                              {language}
                              {formData.languages.includes(language) && (
                                <i className="fas fa-check ms-2"></i>
                              )}
                            </button>
                          ))}
                        </div>
                        {formData.languages.length === 0 && (
                          <div className="text-danger small mt-1">
                            Please select at least one language
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Application *</label>
                        <div className="d-flex flex-wrap gap-2">
                          {platformOptions.map((platform) => (
                            <button
                              key={platform}
                              type="button"
                              onClick={() =>
                                handleMultiSelectChange("platform", platform)
                              }
                              className={`btn btn-sm ${
                                formData.platform.includes(platform)
                                  ? "btn-purple"
                                  : "btn-outline-purple"
                              }`}
                            >
                              {platform}
                              {formData.platform.includes(platform) && (
                                <i className="fas fa-check ms-2"></i>
                              )}
                            </button>
                          ))}
                        </div>
                        {formData.platform.length === 0 && (
                          <div className="text-danger small mt-1">
                            Please select at least one Application
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File Details Section */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">File Details</h6>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="btn-group">
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            showCreateModal === "manual"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                        >
                          Manual Input
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            showCreateModal === "excel"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                        >
                          Excel Upload
                        </button>
                      </div>
                      {showCreateModal === "manual" && (
                        <button
                          type="button"
                          onClick={addFileRow}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <i className="fas fa-plus me-1"></i> Add File
                        </button>
                      )}
                    </div>
                    {showCreateModal === "manual" ? (
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="bg-light">
                            <tr>
                              <th>File Name</th>
                              <th>Page Count</th>
                              <th width="50"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.files.map((file, index) => (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={file.name}
                                    onChange={(e) =>
                                      handleFileChange(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter file name"
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    min="1"
                                    className="form-control form-control-sm"
                                    value={file.pageCount || ""}
                                    onChange={(e) =>
                                      handleFileChange(
                                        index,
                                        "pageCount",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Pages"
                                    required
                                  />
                                </td>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeFileRow(index)}
                                    className="btn btn-sm btn-link text-danger"
                                    disabled={formData.files.length === 1}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded p-5 text-center">
                        <i className="fas fa-file-excel text-muted fa-3x mb-3"></i>
                        <div className="mb-3">
                          <label
                            htmlFor="file-upload"
                            className="btn btn-link text-decoration-none"
                          >
                            Upload Excel file
                          </label>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="d-none"
                          />
                          <span className="text-muted">or drag and drop</span>
                        </div>
                        <p className="small text-muted">
                          Excel files only (XLS, XLSX)
                        </p>
                      </div>
                    )}
                    <div className="bg-light p-3 rounded mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-medium">Total Pages Calculation</div>
                        <div className="text-end">
                          <div className="small text-muted">
                            {formData.files.reduce(
                              (sum, file) => sum + (file.pageCount || 0),
                              0
                            )}{" "}
                            pages × {formData.languages.length || 0} languages ×{" "}
                            {formData.tasks.length || 0} tasks
                          </div>
                          <div className="h5 fw-bold text-primary">
                            {formData.totalPages} Total Pages
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Section (Admin Only) */}
                  {isAdmin && (
                    <div className="mb-4">
                      <h6 className="border-bottom pb-2 mb-3">
                        Financial Details
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label htmlFor="rate" className="form-label">
                            Rate per Page
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              id="rate"
                              name="rate"
                              min="0"
                              step="0.01"
                              value={formData.rate || ""}
                              onChange={handleInputChange}
                              placeholder="0.00"
                            />
                            <select
                              className="form-select"
                              id="currency"
                              name="currency"
                              value={formData.currency}
                              onChange={handleInputChange}
                              style={{ maxWidth: "100px" }}
                            >
                              {currencyOptions.map((currency) => (
                                <option key={currency}>{currency}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="cost" className="form-label">
                            Total Cost
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              id="cost"
                              name="cost"
                              value={formData.cost.toFixed(2)}
                              readOnly
                            />
                            <span className="input-group-text">
                              {formData.currency}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="inrCost" className="form-label">
                            Cost in INR
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              id="inrCost"
                              name="inrCost"
                              value={formData.inrCost.toFixed(2)}
                              readOnly
                            />
                            <span className="input-group-text">INR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info Section */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      Additional Information
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label htmlFor="receivedDate" className="form-label">
                          Received Date *
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="receivedDate"
                          name="receivedDate"
                          required
                          value={formData.receivedDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="serverPath" className="form-label">
                          Server Path *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="serverPath"
                          name="serverPath"
                          required
                          value={formData.serverPath}
                          onChange={handleInputChange}
                          placeholder="/projects/client/project-name"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="notes" className="form-label">
                          Notes
                        </label>
                        <textarea
                          className="form-control"
                          id="notes"
                          name="notes"
                          rows="3"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Add any additional notes or instructions..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top-0">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setFormData({
                          title: "",
                          client: "",
                          country: "",
                          projectManager: "",
                          tasks: [],
                          languages: [],
                          platform: [],
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
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !formData.title ||
                        !formData.client ||
                        !formData.country ||
                        formData.tasks.length === 0 ||
                        formData.languages.length === 0 ||
                        formData.platform.length === 0 ||
                        formData.files.some(
                          (file) => !file.name || !file.pageCount
                        ) ||
                        !formData.serverPath
                      }
                    >
                      {showEditModal !== false
                        ? "Save Changes"
                        : "Create Project"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="modal fade show d-block custom-modal-dark"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header bg-dark border-secondary">
                <h5 className="modal-title text-white">Settings</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowSettings(false)}
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="text-white-50">
                  Manage predefined lists for project creation and other
                  application settings.
                </h6>

                {/* Manage Clients */}
                <div className="mb-4">
                  <h6 className="mb-3 text-white">Manage Clients</h6>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-secondary"
                      placeholder="New Client Alias Name"
                      value={newClient.alias}
                      onChange={(e) =>
                        setNewClient({ ...newClient, alias: e.target.value })
                      }
                    />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control bg-secondary text-white border-secondary"
                        placeholder="Actual Client Name*"
                        value={newClient.actualName}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            actualName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control bg-secondary text-white border-secondary"
                        placeholder="Country*"
                        value={newClient.country}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            country: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-secondary"
                      placeholder="Project Managers (comma-sep)"
                      value={newClient.managers}
                      onChange={(e) =>
                        setNewClient({ ...newClient, managers: e.target.value })
                      }
                    />
                    <button className="btn btn-primary">+</button>
                  </div>
                  <div className="border rounded p-2 mb-2 border-secondary">
                    {clients.map((client, index) => (
                      <div key={index}>
                        <div className="d-flex justify-content-between align-items-center py-2 px-2 bg-secondary mb-2 rounded">
                          <span className="text-white">
                            <strong>{client.alias}</strong> ({client.actualName}
                            )<br />
                            Country: {client.country}
                            <br />
                            PMs: {client.managers}
                          </span>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-danger"
                              onClick={() =>
                                handleDeleteItem(clients, setClients, index)
                              }
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddClient}
                    disabled={
                      !newClient.alias ||
                      !newClient.actualName ||
                      !newClient.country
                    }
                  >
                    <i className="fas fa-plus me-1"></i> Add Client
                  </button>
                </div>

                {/* Manage Tasks List */}
                <div className="mb-4">
                  <h6 className="mb-3 text-white">Manage Tasks List</h6>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-secondary"
                      placeholder="New task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button className="btn btn-primary">+</button>
                  </div>
                  <div className="border rounded p-2 mb-2 border-secondary">
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-secondary mb-1 rounded"
                      >
                        <span className="text-white">{task}</span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleDeleteItem(tasks, setTasks, index)
                            }
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddTask}
                    disabled={!newTask}
                  >
                    <i className="fas fa-plus me-1"></i> Add Task
                  </button>
                </div>

                {/* Manage Application List */}
                <div className="mb-4">
                  <h6 className="mb-3 text-white">Manage Application List</h6>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-secondary"
                      placeholder="New platform..."
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value)}
                    />
                    <button className="btn btn-primary">+</button>
                  </div>
                  <div className="border rounded p-2 mb-2 border-secondary">
                    {platforms.map((platform, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-secondary mb-1 rounded"
                      >
                        <span className="text-white">{platform}</span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleDeleteItem(platforms, setPlatforms, index)
                            }
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddPlatform}
                    disabled={!newPlatform}
                  >
                    <i className="fas fa-plus me-1"></i> Add Platform
                  </button>
                </div>

                {/* Manage Languages List */}
                <div className="mb-4">
                  <h6 className="mb-3 text-white">Manage Languages List</h6>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-secondary"
                      placeholder="New language..."
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                    />
                    <button className="btn btn-primary">+</button>
                  </div>
                  <div className="border rounded p-2 mb-2 border-secondary">
                    {languages.map((language, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-secondary mb-1 rounded"
                      >
                        <span className="text-white">{language}</span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleDeleteItem(languages, setLanguages, index)
                            }
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddLanguage}
                    disabled={!newLanguage}
                  >
                    <i className="fas fa-plus me-1"></i> Add Language
                  </button>
                </div>

                {/* Currency Conversion Rates */}
                <div className="mb-4">
                  <h6 className="mb-3 text-white">Currency Conversion Rates</h6>
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control bg-secondary text-white border-secondary"
                        placeholder="Currency (e.g. USD)"
                        value={newCurrency.name}
                        onChange={(e) =>
                          setNewCurrency({
                            ...newCurrency,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control bg-secondary text-white border-secondary"
                        placeholder="Rate to INR"
                        value={newCurrency.rate}
                        onChange={(e) =>
                          setNewCurrency({
                            ...newCurrency,
                            rate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="border rounded p-2 mb-2 border-secondary">
                    <table className="table table-dark table-sm mb-0">
                      <thead>
                        <tr>
                          <th>Currency</th>
                          <th>Rate to INR</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currencies.map((currency, index) => (
                          <tr key={index}>
                            <td>{currency.name}</td>
                            <td>{currency.rate}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() =>
                                    handleDeleteItem(
                                      currencies,
                                      setCurrencies,
                                      index
                                    )
                                  }
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddCurrency}
                    disabled={!newCurrency.name || !newCurrency.rate}
                  >
                    <i className="fas fa-plus me-1"></i> Add Currency
                  </button>
                </div>

                {/* Save All Settings */}
                <div className="mb-4">
                  <h6 className="mb-3 text-white">Save All Settings</h6>
                  <div className="border rounded p-2 mb-2 border-secondary">
                    <p className="small text-white-50 mb-0">
                      Remember to save your changes. Settings are stored
                      locally.
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-dark border-secondary">
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
