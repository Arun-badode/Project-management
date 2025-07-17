import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  Download,
  Filter,
  Search,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Target,
  Settings,
  Plus,
} from "lucide-react";
import useSyncScroll from "../Hooks/useSyncScroll";
import { Tab, Tabs } from "react-bootstrap";

const ReportingAnalytics = () => {
  const [activeReportTab, setActiveReportTab] = useState("project-report");
  const [dateRange, setDateRange] = useState("last-30-days");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [productivityView, setProductivityView] = useState("daily");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [searchProject, setSearchProject] = useState("");
  const [feedbackFormData, setFeedbackFormData] = useState({
    project: "",
    details: "",
    accountable: "",
    manager: "",
    resolution: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const {
    scrollContainerRef: scrollProjectRef,
    fakeScrollbarRef: fakeProjectRef,
  } = useSyncScroll(activeReportTab === "project-report");

  const {
    scrollContainerRef: scrollFeedbackRef,
    fakeScrollbarRef: fakeFeedbackRef,
  } = useSyncScroll(activeReportTab === "feedback-log");

  const {
    scrollContainerRef: scrollPerformanceRef,
    fakeScrollbarRef: fakePerformanceRef,
  } = useSyncScroll(activeReportTab === "team-performance");

  // Mock data for projects with QA status
  const projectData = [
    {
      id: 1,
      name: "Website Redesign",
      owner: "John Doe",
      progress: 85,
      status: "Delayed in Process",
      priority: "High",
      dueDate: "2025-07-15",
      qaStatus: "Pending",
    },
    {
      id: 2,
      name: "Mobile App Development",
      owner: "Jane Smith",
      progress: 45,
      status: "Delayed in QA",
      priority: "Critical",
      dueDate: "2025-06-30",
      qaStatus: "Failed",
    },
    {
      id: 3,
      name: "Database Migration",
      owner: "Mike Johnson",
      progress: 100,
      status: "Completed",
      priority: "Medium",
      dueDate: "2025-06-10",
      qaStatus: "Passed",
    },
    {
      id: 4,
      name: "API Integration",
      owner: "Sarah Wilson",
      progress: 70,
      status: "Failed in QA",
      priority: "High",
      dueDate: "2025-07-20",
      qaStatus: "Failed",
    },
    {
      id: 5,
      name: "Security Audit",
      owner: "David Brown",
      progress: 25,
      status: "Delayed in Process",
      priority: "Critical",
      dueDate: "2025-06-25",
      qaStatus: "Pending",
    },
  ];

  // Filter projects for report based on status
  const filteredProjectData = projectData.filter(
    (project) =>
      project.status === "Delayed in Process" ||
      project.status === "Delayed in QA" ||
      project.status === "Failed in QA"
  );

  // Feedback log data
  const [feedbackData, setFeedbackData] = useState([
    {
      id: 1,
      project: "Website Redesign",
      date: "2025-06-15",
      feedback: "UI needs improvement",
      accountable: "John Doe",
      manager: "Sarah Wilson",
      resolution: "Redesigned UI components",
      month: 6,
      year: 2025,
    },
    {
      id: 2,
      project: "Mobile App Development",
      date: "2025-06-10",
      feedback: "Performance issues on Android",
      accountable: "Jane Smith",
      manager: "Sarah Wilson",
      resolution: "Optimized rendering",
      month: 6,
      year: 2025,
    },
    {
      id: 3,
      project: "Database Migration",
      date: "2025-05-20",
      feedback: "Data validation required",
      accountable: "Mike Johnson",
      manager: "David Brown",
      resolution: "Added validation scripts",
      month: 5,
      year: 2025,
    },
  ]);

  // Team members data for dropdowns
  const teamMembers = [
    { id: 1, name: "John Doe", role: "DTP Specialist" },
    { id: 2, name: "Jane Smith", role: "DTP Specialist" },
    { id: 3, name: "Mike Johnson", role: "DTP Specialist" },
    { id: 4, name: "Sarah Wilson", role: "Quality Analyst" },
    { id: 5, name: "David Brown", role: "Quality Analyst" },
  ];

  // Managers data for dropdown
  const managers = [
    { id: 1, name: "Sarah Wilson" },
    { id: 2, name: "David Brown" },
    { id: 3, name: "Alex Johnson" },
  ];

  // Filter feedback based on selected month
  const filteredFeedback = useMemo(() => {
    return feedbackData.filter((feedback) => {
      if (dateRange === "current-month") {
        return (
          feedback.month === new Date().getMonth() + 1 &&
          feedback.year === new Date().getFullYear()
        );
      } else if (dateRange === "last-month") {
        const lastMonth =
          new Date().getMonth() === 0 ? 12 : new Date().getMonth();
        const year =
          new Date().getMonth() === 0
            ? new Date().getFullYear() - 1
            : new Date().getFullYear();
        return feedback.month === lastMonth && feedback.year === year;
      } else if (dateRange === "last-3-months") {
        const currentDate = new Date();
        const threeMonthsAgo = new Date(
          currentDate.setMonth(currentDate.getMonth() - 3)
        );
        return new Date(feedback.year, feedback.month - 1) >= threeMonthsAgo;
      }
      return true;
    });
  }, [feedbackData, dateRange]);

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchProject) return projectData;
    return projectData.filter((project) =>
      project.name.toLowerCase().includes(searchProject.toLowerCase())
    );
  }, [searchProject, projectData]);
  // Team performance data with additional fields
  const teamPerformanceData = [
    {
      id: 1,
      name: "John Doe",
      completedTasks: 48,
      onTimePercentage: 92,
      hoursLogged: 160,
      activeHours: 145,
      qaFailed: 0,
      role: "DTP Specialist",
      team: "MS Office",
      performance: "Top Performer",
    },
    {
      id: 2,
      name: "Jane Smith",
      completedTasks: 42,
      onTimePercentage: 88,
      hoursLogged: 155,
      activeHours: 135,
      qaFailed: 0,
      role: "DTP Specialist",
      team: "Adobe",
      performance: "High Performer",
    },
    {
      id: 3,
      name: "Mike Johnson",
      completedTasks: 35,
      onTimePercentage: 85,
      hoursLogged: 140,
      activeHours: 120,
      qaFailed: 2,
      role: "DTP Specialist",
      team: "MS Office",
      performance: "Good Performer",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      completedTasks: 38,
      onTimePercentage: 90,
      hoursLogged: 150,
      activeHours: 125,
      qaFailed: null,
      role: "Quality Analyst",
      team: "QA",
      performance: "High Performer",
    },
    {
      id: 5,
      name: "David Brown",
      completedTasks: 30,
      onTimePercentage: 78,
      hoursLogged: 135,
      activeHours: 112,
      qaFailed: null,
      role: "Quality Analyst",
      team: "QA",
      performance: "Average Performer",
    },
  ];

  // Revenue data
  const revenueData = {
    annual: [
      { year: "2021-2022", revenue: 450 },
      { year: "2022-2023", revenue: 620 },
      { year: "2023-2024", revenue: 780 },
      { year: "2024-2025", revenue: 920 },
    ],
    monthly: [
      { month: "Apr", revenue: 80 },
      { month: "May", revenue: 85 },
      { month: "Jun", revenue: 90 },
      { month: "Jul", revenue: 78 },
      { month: "Aug", revenue: 82 },
      { month: "Sep", revenue: 88 },
      { month: "Oct", revenue: 92 },
      { month: "Nov", revenue: 85 },
      { month: "Dec", revenue: 90 },
      { month: "Jan", revenue: 95 },
      { month: "Feb", revenue: 88 },
      { month: "Mar", revenue: 93 },
    ],
    clients: [
      { client: "Client A", revenue: 320 },
      { client: "Client B", revenue: 280 },
      { client: "Client C", revenue: 210 },
      { client: "Client D", revenue: 110 },
    ],
    clientMonthly: [
      { client: "Client A", revenue: 28 },
      { client: "Client B", revenue: 25 },
      { client: "Client C", revenue: 22 },
      { client: "Client D", revenue: 15 },
    ],
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "On Track":
        return "badge bg-success analytics-badge-success";
      case "Delayed in Process":
        return "badge bg-warning analytics-badge-warning";
      case "Delayed in QA":
        return "badge bg-danger analytics-badge-danger";
      case "Failed in QA":
        return "badge bg-danger analytics-badge-danger";
      case "Completed":
        return "badge bg-primary analytics-badge-primary";
      default:
        return "badge bg-secondary analytics-badge-secondary";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Critical":
        return "badge bg-danger analytics-priority-critical";
      case "High":
        return "badge bg-warning analytics-priority-high";
      case "Medium":
        return "badge bg-info analytics-priority-medium";
      case "Low":
        return "badge bg-light text-dark analytics-priority-low";
      default:
        return "badge bg-secondary analytics-priority-default";
    }
  };

  const getPerformanceBadge = (performance) => {
    switch (performance) {
      case "Top Performer":
        return (
          <span className="badge bg-success analytics-performance-top">
            ⭐ Top Performer
          </span>
        );
      case "High Performer":
        return (
          <span className="badge bg-primary analytics-performance-high">
            🏆 High Performer
          </span>
        );
      case "Good Performer":
        return (
          <span className="badge bg-info analytics-performance-good">
            👍 Good Performer
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary analytics-performance-average">
            📊 Average Performer
          </span>
        );
    }
  };

  const handleFeedbackInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectSelect = (project) => {
    setFeedbackFormData((prev) => ({
      ...prev,
      project: project.name,
      month: new Date(project.dueDate).getMonth() + 1,
      year: new Date(project.dueDate).getFullYear(),
    }));
    setSearchProject("");
  };

  const submitFeedback = () => {
    const newFeedback = {
      id: feedbackData.length + 1,
      project: feedbackFormData.project,
      date: new Date().toISOString().split("T")[0],
      feedback: feedbackFormData.details,
      accountable: feedbackFormData.accountable,
      manager: feedbackFormData.manager,
      resolution: feedbackFormData.resolution,
      month: feedbackFormData.month,
      year: feedbackFormData.year,
    };

    setFeedbackData([...feedbackData, newFeedback]);
    setShowFeedbackForm(false);
    setFeedbackFormData({
      project: "",
      details: "",
      accountable: "",
      manager: "",
      resolution: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  const exportToPDF = () => {
    alert("Exporting to PDF...");
  };

  const exportToExcel = () => {
    alert("Exporting to Excel...");
  };

  const exportToPNG = () => {
    alert("Exporting chart as PNG...");
  };

  const exportToCSV = () => {
    alert("Exporting data as CSV...");
  };

  const renderProjectStatusReport = () => (
    <div className="bg-card">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-card">
        <h4 className="analytics-report-title gradient-heading">
          Project Status Report
        </h4>
        <div className="analytics-export-buttons">
          <button
            className="btn btn-outline-primary  me-2 analytics-export-btn"
            onClick={exportToPDF}
          >
            <Download size={16} className="me-1" /> PDF
          </button>
          <button
            className="btn btn-outline-primary  analytics-export-btn"
            onClick={exportToExcel}
          >
            <Download size={16} className="me-1" /> Excel
          </button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <select className="form-select analytics-filter-select mb-1">
            <option>All Owners</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
            <option>Mike Johnson</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select analytics-filter-select mb-1">
            <option>All Priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select analytics-filter-select mb-1">
            <option>All Status</option>
            <option>Delayed in Process</option>
            <option>Delayed in QA</option>
            <option>Failed in QA</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select analytics-filter-select">
            <option>Current Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      <div
        ref={fakeProjectRef}
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
        ref={scrollProjectRef}
        className="table-responsive"
        style={{ overflowX: "auto", maxHeight: "400px" }}
      >
        <table className="table text-white analytics-project-table table-gradient-bg table-hover table-bordered mb-0">
          <thead
            className="table-gradient-bg table "
            style={{
              position: "sticky",
              top: 0,
              zIndex: 0,
              backgroundColor: "#fff", // Match your background color
            }}
          >
            <tr  className="text-center"> 
              <th>ID</th>
              <th>Project Name</th>
              <th>Owner</th>
              <th>Progress</th>
              <th>Status</th>
              <th>QA Status</th>
              <th>Priority</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjectData.map((project) => (
              <tr key={project.id} className="analytics-project-row">
                <td>{project.id}</td>
                <td className="text-dark analytics-project-name">
                  {project.name}
                </td>
                <td>{project.owner}</td>
                <td>
                  <div
                    className="progress analytics-progress-bar"
                    style={{ height: "20px" }}
                  >
                    <div
                      className="progress-bar analytics-progress-fill bg-primary"
                      style={{ width: `${project.progress}%` }}
                    >
                      {project.progress}%
                    </div>
                  </div>
                </td>
                <td>
                  <span className={getStatusBadgeClass(project.status)}>
                    {project.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      project.qaStatus === "Failed"
                        ? "bg-danger"
                        : project.qaStatus === "Passed"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {project.qaStatus}
                  </span>
                </td>
                <td>
                  <span className={getPriorityBadgeClass(project.priority)}>
                    {project.priority}
                  </span>
                </td>
                <td>{project.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFeedbackReport = () => (
    <div className="analytics-report-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="analytics-report-title gradient-heading">
          Feedback Log
        </h4>
        <div>
          <button
            className="btn btn-primary  me-2 analytics-add-btn"
            onClick={() => setShowFeedbackForm(true)}
          >
            <Plus size={16} className="me-1" /> Add Feedback
          </button>
          <select
            className="form-select d-inline-block me-2 analytics-date-selector"
            style={{ width: "auto" }}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="all-time">All Time</option>
          </select>
          <select
            className="form-select d-inline-block analytics-team-selector"
            style={{ width: "auto" }}
          >
            <option>All Team Members</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
            <option>Mike Johnson</option>
          </select>
        </div>
      </div>

      {showFeedbackForm && (
        <div
          className="modal show d-block custom-modal-dark"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-card">
              <div className="modal-header">
                <h5 className="modal-title">Add New Feedback</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFeedbackForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Project</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        name="project"
                        value={searchProject}
                        onChange={(e) => setSearchProject(e.target.value)}
                        placeholder="Search and select project"
                      />
                      {searchProject && (
                        <div className="position-absolute top-100 start-0 end-0 bg-white shadow mt-1 z-3 rounded">
                          {filteredProjects.map((project) => (
                            <div
                              key={project.id}
                              className="p-2 border-bottom cursor-pointer hover-bg-light"
                              onClick={() => handleProjectSelect(project)}
                            >
                              {project.name} (Due: {project.dueDate})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {feedbackFormData.project && (
                      <div className="mt-2">
                        <span className="badge bg-primary">
                          {feedbackFormData.project}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            onClick={() =>
                              setFeedbackFormData((prev) => ({
                                ...prev,
                                project: "",
                              }))
                            }
                            style={{ fontSize: "0.5rem" }}
                          ></button>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Month</label>
                    <select
                      className="form-select"
                      name="month"
                      value={feedbackFormData.month}
                      onChange={handleFeedbackInputChange}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Year</label>
                    <select
                      className="form-select"
                      name="year"
                      value={feedbackFormData.year}
                      onChange={handleFeedbackInputChange}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <option
                          key={i}
                          value={new Date().getFullYear() - 2 + i}
                        >
                          {new Date().getFullYear() - 2 + i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Feedback Details</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="details"
                    value={feedbackFormData.details}
                    onChange={handleFeedbackInputChange}
                    placeholder="Enter detailed feedback..."
                  ></textarea>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Accountable Team Member
                    </label>
                    <select
                      className="form-select"
                      name="accountable"
                      value={feedbackFormData.accountable}
                      onChange={handleFeedbackInputChange}
                    >
                      <option value="">Select team member</option>
                      {teamMembers.map((member) => (
                        <option key={member.id} value={member.name}>
                          {member.name} ({member.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Manager</label>
                    <select
                      className="form-select"
                      name="manager"
                      value={feedbackFormData.manager}
                      onChange={handleFeedbackInputChange}
                    >
                      <option value="">Select manager</option>
                      {managers.map((manager) => (
                        <option key={manager.id} value={manager.name}>
                          {manager.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Resolution/Action Taken</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="resolution"
                    value={feedbackFormData.resolution}
                    onChange={handleFeedbackInputChange}
                    placeholder="Describe the resolution or action taken..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-5"
                  onClick={() => setShowFeedbackForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn gradient-button"
                  onClick={submitFeedback}
                  disabled={
                    !feedbackFormData.project || !feedbackFormData.details
                  }
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={fakeFeedbackRef}
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
        ref={scrollFeedbackRef}
        className="table-responsive"
        style={{ overflowX: "auto", maxHeight: "400px" }}
      >
        <table className="table text-white analytics-feedback-table table-gradient-bg">
          <thead
            className="table-gradient-bg table "
            style={{
              position: "sticky",
              top: 0,
              zIndex: 0,
              backgroundColor: "#fff", // Match your background color
            }}
          >
            <tr  className="text-center">
              <th>ID</th>
              <th>Project</th>
              <th>Date</th>
              <th>Feedback</th>
              <th>Accountable</th>
              <th>Manager</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedback.map((feedback) => (
              <tr
                key={feedback.id}
                className="text-white analytics-feedback-row"
              >
                <td>{feedback.id}</td>
                <td className="text-white">{feedback.project}</td>
                <td>{feedback.date}</td>
                <td className="analytics-feedback-text">{feedback.feedback}</td>
                <td>{feedback.accountable}</td>
                <td>{feedback.manager}</td>
                <td className="analytics-resolution-text">
                  {feedback.resolution}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTeamPerformanceReport = () => (
    <div className="analytics-report-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="analytics-report-title gradient-heading">
          Team Performance Report
        </h4>
        <div className="analytics-performance-filters">
          <select
            className="form-select d-inline-block me-2 analytics-team-filter"
            style={{ width: "auto" }}
          >
            <option>All Teams</option>
            <option>Adobe</option>
            <option>MS Office</option>
            <option>QA</option>
          </select>
          <select
            className="form-select d-inline-block me-2 analytics-role-filter"
            style={{ width: "auto" }}
          >
            <option>All Roles</option>
            <option>DTP Specialist</option>
            <option>Quality Analyst</option>
          </select>
          <select
            className="form-select d-inline-block analytics-time-filter"
            style={{ width: "auto" }}
          >
            <option>Current Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div
            ref={fakePerformanceRef}
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
            ref={scrollPerformanceRef}
            className="table-responsive"
            style={{ overflowX: "auto", maxHeight: "400px" }}
          >
            <table className="table analytics-performance-table table-gradient-bg">
              <thead
                className="table-gradient-bg table "
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 0,
                  backgroundColor: "#fff", // Match your background color
                }}
              >
                <tr  className="text-center">
                  <th>EMP ID</th>
                  <th>Team Member</th>
                  <th>Role</th>
                  <th>Team</th>
                  <th>Completed Tasks</th>
                  <th>On-Time %</th>
                  <th>Net Logged Hours</th>
                  <th>Task Active Hours</th>
                  <th>QA Failed</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformanceData.map((member) => (
                  <tr
                    key={member.id}
                    className="text-white analytics-performance-row"
                  >
                    <td>{member.id}</td>
                    <td className="text-white analytics-member-name">
                      {member.name}
                    </td>
                    <td>{member.role}</td>
                    <td>{member.team}</td>
                    <td>
                      <span className="badge bg-primary analytics-task-badge">
                        {member.completedTasks}
                      </span>
                    </td>
                    <td>
                      <div
                        className="progress analytics-ontime-progress"
                        style={{ height: "15px" }}
                      >
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${member.onTimePercentage}%` }}
                        >
                          {member.onTimePercentage}%
                        </div>
                      </div>
                    </td>
                    <td>{member.hoursLogged}h</td>
                    <td>{member.activeHours}h</td>
                    <td>
                      {member.qaFailed !== null ? (
                        <span className="badge bg-danger">
                          {member.qaFailed}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{getPerformanceBadge(member.performance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenueReport = () => (
    <div className="analytics-report-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="analytics-report-title gradient-heading">
          Revenue Reporting
        </h4>
        <div className="analytics-revenue-controls">
          <button
            className="btn btn-outline-secondary btn-sm me-2 analytics-export-btn"
            onClick={exportToPNG}
          >
            <Download size={16} className="me-1" /> PNG
          </button>
          <button
            className="btn btn-outline-success btn-sm analytics-export-btn"
            onClick={exportToCSV}
          >
            <Download size={16} className="me-1" /> CSV
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card bg-card text-white mb-4">
            <div className="card-header">
              <h5>Total Revenue by Financial Year (₹ Lakhs)</h5>
            </div>
            <div className="card-body">
              <div
                className="analytics-chart-container"
                style={{ height: "300px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData.annual}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₹${value} L`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="#0d6efd" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card bg-card text-white mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Month-wise Revenue (₹ Lakhs)</h5>
              <select
                className="form-select form-select-sm d-inline-block"
                style={{ width: "auto" }}
              >
                <option>2024-2025</option>
                <option>2023-2024</option>
                <option>2022-2023</option>
              </select>
            </div>
            <div className="card-body">
              <div
                className="analytics-chart-container"
                style={{ height: "300px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₹${value} L`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="#198754" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-card text-white mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Client vs Year (₹ Lakhs)</h5>
              <select
                className="form-select form-select-sm d-inline-block"
                style={{ width: "auto" }}
              >
                <option>2024-2025</option>
                <option>2023-2024</option>
                <option>2022-2023</option>
              </select>
            </div>
            <div className="card-body">
              <div
                className="analytics-chart-container"
                style={{ height: "300px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={revenueData.clients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="client" type="category" width={80} />
                    <Tooltip
                      formatter={(value) => [`₹${value} L`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="#6f42c1" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card bg-card text-white">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Client vs Month (₹ Lakhs)</h5>
              <div>
                <select
                  className="form-select form-select-sm d-inline-block me-2"
                  style={{ width: "auto" }}
                >
                  <option>June</option>
                  <option>May</option>
                  <option>April</option>
                </select>
                <select
                  className="form-select form-select-sm d-inline-block"
                  style={{ width: "auto" }}
                >
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              <div
                className="analytics-chart-container"
                style={{ height: "300px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={revenueData.clientMonthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="client" type="category" width={80} />
                    <Tooltip
                      formatter={(value) => [`₹${value} L`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="#fd7e14" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid bg-main analytics-dashboard-container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between bg-main align-items-center analytics-dashboard-header">
            <div>
              <h2 className="gradient-heading">Reporting & Analytics</h2>
              <p className="text-white analytics-subtitle">
                Comprehensive insights into project performance and team
                productivity
              </p>
            </div>
            <div className="analytics-global-controls">
              <button className="btn btn-outline-primary me-2 analytics-filter-btn">
                <Filter size={16} className="me-1" /> Global Filters
              </button>
              <button className="btn btn-primary analytics-dashboard-btn">
                <Search size={16} className="me-1" /> Search Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <Tabs
            activeKey={activeReportTab}
            onSelect={(k) => setActiveReportTab(k)}
            className="mb-3 analytics-horizontal-tabs"
            variant="tabs"
          >
            <Tab
              eventKey="project-report"
              title={
                <span className="d-flex align-items-center">
                  <Target size={16} className="me-1" /> Project Report
                </span>
              }
            />
            <Tab
              eventKey="feedback-log"
              title={
                <span className="d-flex align-items-center">
                  <Calendar size={16} className="me-1" /> Feedback Log
                </span>
              }
            />
            <Tab
              eventKey="team-performance"
              title={
                <span className="d-flex align-items-center">
                  <Users size={16} className="me-1" /> Team Performance
                </span>
              }
            />
            <Tab
              eventKey="revenue-reporting"
              title={
                <span className="d-flex align-items-center">
                  <TrendingUp size={16} className="me-1" /> Revenue Reporting
                </span>
              }
            />
          </Tabs>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="analytics-main-content bg-card">
            {activeReportTab === "project-report" &&
              renderProjectStatusReport()}
            {activeReportTab === "feedback-log" && renderFeedbackReport()}
            {activeReportTab === "team-performance" &&
              renderTeamPerformanceReport()}
            {activeReportTab === "revenue-reporting" && renderRevenueReport()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-dashboard-container {
          min-height: 100vh;
        }

        .analytics-dashboard-header {
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .gradient-heading {
          background: linear-gradient(90deg, #4e73df, #224abe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }

        .analytics-subtitle {
          margin-bottom: 0;
          font-size: 0.95rem;
        }

        .analytics-sidebar {
          border-radius: 0.5rem;
          padding: 1rem;
        }

        .analytics-nav-item {
          border: none;
          margin-bottom: 0.25rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          color: #adb5bd;
        }

        .analytics-nav-item:hover {
          background-color: #2d3748 !important;
          color: white !important;
        }

        .analytics-nav-active {
          background-color: #0d6efd !important;
          color: white !important;
        }

        .analytics-main-content {
          border-radius: 0.5rem;
          padding: 2rem;
        }

        .analytics-report-container {
          min-height: 600px;
        }

        .analytics-report-title {
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .analytics-export-btn,
        .analytics-filter-btn,
        .analytics-dashboard-btn {
          transition: all 0.2s ease;
        }

        .analytics-export-btn:hover,
        .analytics-filter-btn:hover,
        .analytics-dashboard-btn:hover {
          transform: translateY(-1px);
        }

        .analytics-filter-select {
          border-radius: 0.375rem;
          border: 1px solid #495057;
          background-color: #2d3748;
          color: white;
        }

        .analytics-project-table,
        .analytics-feedback-table,
        .analytics-performance-table {
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .analytics-project-row:hover,
        .analytics-feedback-row:hover,
        .analytics-performance-row:hover {
          background-color: #2d3748 !important;
        }

        .analytics-project-name {
          color: #e9ecef !important;
        }

        .analytics-progress-bar {
          border-radius: 10px;
          background-color: #495057;
        }

        .analytics-progress-fill {
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .analytics-summary-card {
          border-radius: 0.5rem;
          transition: transform 0.2s ease;
        }

        .analytics-summary-card:hover {
          transform: translateY(-2px);
        }

        .analytics-summary-number {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0;
        }

        .analytics-chart-container {
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 1rem;
        }

        .analytics-task-badge {
          background-color: #0d6efd !important;
        }

        .analytics-ontime-progress {
          height: 15px;
          border-radius: 7px;
          background-color: #495057;
        }

        .analytics-feedback-text,
        .analytics-resolution-text {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .analytics-add-btn {
          transition: all 0.2s ease;
        }

        .analytics-add-btn:hover {
          transform: translateY(-1px);
        }

        .bg-card {
          background-color: #1e293b;
          color: white;
        }

        .bg-main {
          background-color: #0f172a;
        }

        .table-gradient-bg {
          background: linear-gradient(135deg, #1e293b, #334155);
        }

        .analytics-horizontal-tabs .nav-link {
          color: #adb5bd;
          border: none;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
        }

        .analytics-horizontal-tabs .nav-link.active {
          color: #0d6efd;
          background-color: transparent;
          border-bottom: 3px solid #0d6efd;
        }

        .analytics-horizontal-tabs .nav-link:hover {
          color: #0d6efd;
        }

        .custom-modal-dark {
          background-color: rgba(0, 0, 0, 0.5);
        }

        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }

        @media (max-width: 768px) {
          .analytics-dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .analytics-global-controls {
            margin-top: 1rem;
            width: 100%;
          }

          .analytics-performance-filters,
          .analytics-revenue-controls {
            flex-direction: column;
          }

          .analytics-team-filter,
          .analytics-role-filter,
          .analytics-time-filter,
          .analytics-date-selector,
          .analytics-team-selector {
            margin-bottom: 0.5rem;
            width: 100% !important;
          }

          .analytics-sidebar {
            margin-bottom: 1rem;
          }

          .analytics-nav-tabs {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .analytics-nav-item {
            margin-right: 0.25rem;
            margin-bottom: 0.25rem;
          }

          .analytics-horizontal-tabs .nav-link {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportingAnalytics;
