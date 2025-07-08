import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import useSyncScroll from "../Hooks/useSyncScroll";
import Select from "react-select";

const Project = () => {
  const [activeTab, setActiveTab] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showYTSModal, setShowYTSModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const searchInputRef = useRef(null);
  const chartRef = useRef(null);

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
        { name: "Homepage.psd", pageCount: 5, status: "" },
        { name: "About.psd", pageCount: 3, status: "" },
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
        { name: "Login.sketch", pageCount: 2, status: "YTS" },
        { name: "Dashboard.sketch", pageCount: 7, status: "YTS" },
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
      deadline: "2025-07-15T14:00",
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
        { name: "ProductPage.fig", pageCount: 4, status: "RFD" },
        { name: "Checkout.fig", pageCount: 3, status: "RFD" },
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

  // Handle file selection for YTS
  const handleFileSelect = (projectId, fileName, isSelected) => {
    if (isSelected) {
      setSelectedFiles((prev) => [...prev, { projectId, fileName }]);
    } else {
      setSelectedFiles((prev) =>
        prev.filter(
          (file) => !(file.projectId === projectId && file.fileName === fileName)
        )
      );
    }
  };

  // Mark files as YTS (Yet to Start)
  const markFilesAsYTS = () => {
    if (!deadlineDate || !deadlineTime) {
      alert("Please enter both date and time");
      return;
    }

    const deadline = `${deadlineDate}T${deadlineTime}`;
    const projectIds = [...new Set(selectedFiles.map((file) => file.projectId))];

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (projectIds.includes(project.id)) {
          // Check if this project has files being marked as YTS
          const filesToMark = selectedFiles.filter(
            (file) => file.projectId === project.id
          );

          if (filesToMark.length > 0) {
            // Update files status
            const updatedFiles = project.files.map((file) => {
              const isSelected = filesToMark.some(
                (f) => f.fileName === file.name
              );
              return isSelected ? { ...file, status: "YTS" } : file;
            });

            // Check if project is being moved from created to active
            if (project.status === "created") {
              // Find if there's an existing active project with the same deadline
              const existingActiveProject = projects.find(
                (p) =>
                  p.status === "active" &&
                  p.id !== project.id &&
                  p.title === project.title &&
                  p.deadline === deadline
              );

              if (existingActiveProject) {
                // Club with existing active project
                return {
                  ...existingActiveProject,
                  files: [...existingActiveProject.files, ...updatedFiles],
                };
              } else {
                // Create new active project entry
                return {
                  ...project,
                  status: "active",
                  files: updatedFiles,
                  deadline,
                  progress: 0,
                };
              }
            } else if (project.status === "active") {
              // For existing active projects, check if deadline matches
              if (project.deadline === deadline) {
                return {
                  ...project,
                  files: updatedFiles,
                };
              } else {
                // Different deadline - create new active project entry
                const newProject = {
                  ...project,
                  id: Math.max(...projects.map((p) => p.id)) + 1,
                  files: updatedFiles,
                  deadline,
                };
                return project; // Keep original project, new one will be added
              }
            }
          }
        }
        return project;
      })
    );

    // Add new active projects for different deadlines
    const projectsToAdd = [];
    projects.forEach((project) => {
      if (projectIds.includes(project.id)) {
        const filesToMark = selectedFiles.filter(
          (file) => file.projectId === project.id
        );
        if (filesToMark.length > 0 && project.deadline !== deadline) {
          const updatedFiles = project.files.map((file) => {
            const isSelected = filesToMark.some((f) => f.fileName === file.name);
            return isSelected ? { ...file, status: "YTS" } : file;
          });
          projectsToAdd.push({
            ...project,
            id: Math.max(...projects.map((p) => p.id)) + projectsToAdd.length + 1,
            status: "active",
            files: updatedFiles,
            deadline,
            progress: 0,
          });
        }
      }
    });

    if (projectsToAdd.length > 0) {
      setProjects((prev) => [...prev, ...projectsToAdd]);
    }

    // Reset selection and close modal
    setSelectedFiles([]);
    setShowYTSModal(false);
    setDeadlineDate("");
    setDeadlineTime("");
  };

  // Mark project as completed
  const markAsCompleted = (projectId) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          // Check if all files are RFD
          const allFilesRFD = project.files.every(
            (file) => file.status === "RFD"
          );

          if (allFilesRFD) {
            return {
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
            };
          } else {
            alert("All files must be marked as RFD before completing the project");
            return project;
          }
        }
        return project;
      })
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
    <div className=" container-fluid ">
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
      <div className="container-fluid pt-5 ">
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
            <h2 className="h5 mb-3 text-light">Created Projects</h2>
            <p className="text-muted mb-3">
              Lists all projects that have been created but not yet marked as YTS
              (Yet to Start)
            </p>
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
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <table
                    className="table table-hover mb-0"
                    style={{ minWidth: 900 }}
                  >
                    <thead className="table-gradient-bg">
                      <tr>
                        <th>Select</th>
                        <th>Project Title</th>
                        <th>Client</th>
                        <th>Country</th>
                        <th>Project Manager</th>
                        <th>Tasks</th>
                        <th>Languages</th>
                        <th>Application</th>
                        <th>Files</th>
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
                        <React.Fragment key={project.id}>
                          <tr>
                            <td rowSpan={project.files.length + 1}>
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProject(project.id);
                                  } else {
                                    setSelectedProject(null);
                                  }
                                }}
                                checked={selectedProject === project.id}
                              />
                            </td>
                            <td rowSpan={project.files.length + 1}>
                              {project.title}
                              <span className="badge bg-light text-dark ms-2">
                                Draft
                              </span>
                            </td>
                            <td rowSpan={project.files.length + 1}>
                              {project.client}
                            </td>
                            <td rowSpan={project.files.length + 1}>
                              {project.country}
                            </td>
                            <td rowSpan={project.files.length + 1}>
                              {project.projectManager}
                            </td>
                            <td rowSpan={project.files.length + 1}>
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
                            <td rowSpan={project.files.length + 1}>
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
                            <td rowSpan={project.files.length + 1}>
                              <span className="badge bg-purple bg-opacity-10 text-purple">
                                {project.application}
                              </span>
                            </td>
                            <td colSpan="5"></td>
                            <td rowSpan={project.files.length + 1} className="text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedProject(project.id);
                                    setShowYTSModal(true);
                                  }}
                                  className="btn btn-sm btn-primary"
                                  disabled={!selectedFiles.length}
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
                          {project.files.map((file, fileIndex) => (
                            <tr key={fileIndex}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      handleFileSelect(
                                        project.id,
                                        file.name,
                                        e.target.checked
                                      )
                                    }
                                    checked={selectedFiles.some(
                                      (f) =>
                                        f.projectId === project.id &&
                                        f.fileName === file.name
                                    )}
                                    disabled={
                                      selectedProject !== null &&
                                      selectedProject !== project.id
                                    }
                                  />
                                  <span className="ms-2">{file.name}</span>
                                </div>
                              </td>
                              <td>{file.pageCount}</td>
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
                            </tr>
                          ))}
                        </React.Fragment>
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
            <p className="text-muted mb-3">
              Projects with files marked as YTS (Yet to Start)
            </p>
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
                  ref={scrollContainerRef2}
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
                    <thead className="table-gradient-bg">
                      <tr>
                        <th>Project Title</th>
                        <th>Client</th>
                        <th>Country</th>
                        <th>Project Manager</th>
                        <th>Deadline</th>
                        <th>Progress</th>
                        <th>Files Status</th>
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
                            {project.deadline
                              ? new Date(project.deadline).toLocaleString()
                              : "N/A"}
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
                              {project.files.map((file, idx) => (
                                <span
                                  key={idx}
                                  className={`badge ${
                                    file.status === "YTS"
                                      ? "bg-warning text-dark"
                                      : file.status === "RFD"
                                      ? "bg-success text-white"
                                      : "bg-secondary text-white"
                                  }`}
                                >
                                  {file.name}: {file.status || "Not Started"}
                                </span>
                              ))}
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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
              <div>
                <h2 className="h5 mb-0 text-light">Completed Projects</h2>
                <p className="text-muted mb-0">
                  Projects where all files reached RFD status
                </p>
              </div>
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
                      <thead className="table-gradient-bg">
                        <tr>
                          <th>Project Title</th>
                          <th>Client</th>
                          <th>Country</th>
                          <th>Project Manager</th>
                          <th>Received Date</th>
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
                                project.receivedDate
                              ).toLocaleDateString()}
                            </td>
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

      {/* YTS Modal */}
      {showYTSModal && (
        <div
          className="modal fade show d-block custom-modal-dark"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mark Files as YTS</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowYTSModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Deadline Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Selected Files</label>
                  <ul className="list-group">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="list-group-item">
                        {file.fileName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowYTSModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={markFilesAsYTS}
                  disabled={!deadlineDate || !deadlineTime}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for modals */}
      {(showCreateModal || showEditModal !== false || showYTSModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Project;