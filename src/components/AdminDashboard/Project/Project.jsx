import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import useSyncScroll from "../Hooks/useSyncScroll";

import Select from "react-select";

const Project = () => {
  const [activeTab, setActiveTab] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
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

  return (
    <div className="min-vh-100 bg-main mt-4">
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
                        <th>application</th>
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
                              {project.application}
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
                        <th>application</th>
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
                        placeholder="Auto update with Client"
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
                        placeholder="Refined Searchable Dropdown"
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
                    <div className="table-responsive ">
                      <table className="table table-bordered  ">
                        <thead
                          style={{ backgroundColor: "#201E7E", color: "white" }}
                        >
                          <tr
                            style={{
                              backgroundColor: "#201E7E",
                              color: "white",
                            }}
                          >
                            <th>S.No.</th>
                            <th>File Name</th>
                            <th>Pages</th>
                            <th>Application</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.files.map((file, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
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
                              <td>
                                <select
                                  className="form-select"
                                  value={file.application || ""}
                                  onChange={(e) => {
                                    const files = [...formData.files];
                                    files[idx].application = e.target.value;
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                    <div className="col-md-3">
                      <label className="form-label">Estimated Hrs</label>
                      <input
                        type="number"
                        className="form-control"
                        step="0.25"
                        value={formData.estimatedHrs || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            estimatedHrs: e.target.value,
                          }))
                        }
                        placeholder="00.00"
                      />
                      <div className="form-text text-white">
                        (in multiple of 0.25 only)
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Per page Page Rate</label>
                      <input
                        type="number"
                        className="form-control"
                        step="0.01"
                        value={formData.rate || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            rate: e.target.value,
                          }))
                        }
                        placeholder="00.00"
                      />
                      <div className="form-text text-white ">
                        (with only 2 decimals)
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Currency</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.currency}
                        readOnly
                        placeholder="Auto updated from Client details"
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Total Cost</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.cost.toFixed(2)}
                        readOnly
                        placeholder="Auto Calculated"
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Cost in INR</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.inrCost.toFixed(2)}
                        readOnly
                        placeholder="Auto Calculated"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="text-end">
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

                  <div className="row mb-2">
                    <div className="col-md-5 mb-2">
                      <div className="input-group">
                        <input
                          className="form-control"
                          style={{ background: "#181f3a", color: "#fff" }}
                          placeholder="New Client Alias Name*"
                          name="alias"
                        />
                        <button className="btn btn-gradient" type="button">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <div className="input-group">
                        <input
                          className="form-control"
                          style={{ background: "#181f3a", color: "#fff" }}
                          placeholder="Actual Client Name*"
                          name="actual"
                        />
                        <button className="btn btn-gradient" type="button">
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Second row */}
                  <div className="row mb-3">
                    {/* Country Input */}
                    <div className="col-md-4 mb-2">
                      <div className="input-group">
                        <input
                          className="form-control"
                          style={{ background: "#181f3a", color: "#fff" }}
                          placeholder="Country*"
                          name="country"
                        />
                        <button className="btn btn-gradient" type="button">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Currency + Hourly Rate Side-by-Side */}
                    <div className="col-md-6 mb-2">
                      <div className="row">
                        {/* Currency */}
                        <div className="col-md-6 mb-2">
                          <div className="input-group">
                            <select
                              className="form-control"
                              style={{ background: "#181f3a", color: "#fff" }}
                              name="currency"
                            >
                              <option value="">Currency*</option>
                              {currencyOptions.map((cur) => (
                                <option key={cur} value={cur}>
                                  {cur}
                                </option>
                              ))}
                            </select>
                            <button className="btn btn-gradient" type="button">
                              +
                            </button>
                          </div>
                        </div>

                        {/* Hourly Rate */}
                        <div className="col-md-6 mb-2">
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="00"
                              name="hourlyRate"
                              style={{ background: "#181f3a", color: "#fff" }}
                            />
                            <button className="btn btn-gradient" type="button">
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third row */}
                  <div className="mb-2">
                    <div className="input-group">
                      <input
                        className="form-control"
                        style={{ background: "#181f3a", color: "#fff" }}
                        placeholder="Project Managers (comma-sep)"
                        name="managers"
                      />
                      <button className="btn btn-gradient" type="button">
                        +
                      </button>
                    </div>
                  </div>

                  <div className="border rounded p-2 mb-2 border-secondary">
                    {clients.map((client, index) => (
                      <div key={index}>
                        <div className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-2 rounded">
                          <span className="text-white">
                            <strong>{client.alias}</strong> ({client.actualName}
                            )<br />
                            Country: {client.country}
                            <br />
                            PMs: {client.managers}
                          </span>
                          <div className="btn-group btn-group-sm gap-2">
                            <button className="btn btn-outline-secondary  text-light">
                              <i className="bi bi-pencil"></i>
                            </button>
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
                    <i className="fas fa-plus me-1"></i>
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
                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                      >
                        <span className="text-white">{task}</span>
                        <div className="btn-group btn-group-sm gap-2">
                          <button className="btn btn-outline-secondary  text-light">
                            <i className="bi bi-pencil"></i>
                          </button>
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
                </div>

                {/* Manage Application List */}
                <div className="mb-4">
                  <h6 className="mb-3 text-white">Manage Application List</h6>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-secondary"
                      placeholder="New application..."
                      value={newapplication}
                      onChange={(e) => setNewapplication(e.target.value)}
                    />
                    <button className="btn btn-primary">+</button>
                  </div>
                  <div className="border rounded p-2 mb-2 border-secondary">
                    {applications.map((application, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                      >
                        <span className="text-white">{application}</span>
                        <div className="btn-group btn-group-sm gap-2">
                          <button className="btn btn-outline-secondary  text-light">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleDeleteItem(
                                applications,
                                setapplications,
                                index
                              )
                            }
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                      >
                        <span className="text-white">{language}</span>
                        <div className="btn-group btn-group-sm gap-2">
                          <button className="btn btn-outline-secondary  text-light">
                            <i className="bi bi-pencil"></i>
                          </button>
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
                </div>

                {/* Currency Conversion Rates */}
                <div className="mb-4">
                  <h6 className="mb-3 text-white">Currency Conversion Rates</h6>
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control bg-card text-white border-secondary"
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
                        className="form-control bg-card text-white border-secondary"
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
                  <div className="border rounded p-2 mb-2 border-secondary table-gradient-bg">
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
