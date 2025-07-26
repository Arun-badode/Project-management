import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import useSyncScroll from "../Hooks/useSyncScroll";
import "react-datepicker/dist/react-datepicker.css";

import "./Project.css";
import Setting from "./Setting";
import CreateNewProject from "./CreateNewProject";
import CompletedProjects from "./CompletedProjects";
import Created from "./created";
import ActiveProjects from "./ActiveProjects";

const Project = () => {
  const [activeTab, setActiveTab] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedApplications, setSelectedApplications] = useState([]);

  const clientList = ["Client A", "Client B"];
  const taskList = ["Design", "Translation", "Proofreading"];
  const applicationList = ["Adobe", "MS Word", "Figma"];
  const searchInputRef = useRef(null);

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

  const [selectedMonth, setSelectedMonth] = useState(6); // July (0-indexed)

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
                  All Projects
                  <span className="badge bg-light text-dark ms-2">
                    {
                      projects.filter(
                        (p) => p.status?.toLowerCase() === "created"
                      ).length
                    }
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
                    {
                      projects.filter(
                        (p) => p.status?.toLowerCase() === "active"
                      ).length
                    }
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
                    {
                      projects.filter(
                        (p) => p.status?.toLowerCase() === "completed"
                      ).length
                    }
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
                  <Created />
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
                  <ActiveProjects />
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
                    <CompletedProjects />
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
