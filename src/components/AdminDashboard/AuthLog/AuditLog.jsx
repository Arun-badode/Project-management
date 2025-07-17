import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Users,
  Activity,
  FileText,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useSyncScroll from "../Hooks/useSyncScroll";

const AuditLog = () => {
  const [activeTab, setActiveTab] = useState("all-activities");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Sample data
  const allActivitiesData = [
    {
      id: 1,
      timestamp: "2024-06-17 14:30:25",
      user: "John Doe",
      role: "Admin",
      activity: "User Created",
      module: "User Management",
      ipAddress: "192.168.1.100",
      device: "Chrome 125.0 / Windows 10",
      details: "Created new user account for jane.smith@company.com",
    },
    {
      id: 2,
      timestamp: "2024-06-17 14:25:18",
      user: "Sarah Wilson",
      role: "Manager",
      activity: "Project Updated",
      module: "Project Management",
      ipAddress: "192.168.1.105",
      device: "Firefox 126.0 / macOS",
      details: "Updated project timeline and assigned new team members",
    },
    {
      id: 3,
      timestamp: "2024-06-17 14:20:42",
      user: "Mike Johnson",
      role: "User",
      activity: "File Download",
      module: "Document Management",
      ipAddress: "192.168.1.110",
      device: "Safari 17.0 / iOS",
      details: "Downloaded quarterly report PDF file",
    },
    {
      id: 4,
      timestamp: "2024-06-17 14:15:33",
      user: "Emily Davis",
      role: "Admin",
      activity: "Settings Changed",
      module: "System Settings",
      ipAddress: "192.168.1.115",
      device: "Edge 124.0 / Windows 11",
      details: "Modified security settings and password policies",
    },
    {
      id: 5,
      timestamp: "2024-06-17 14:10:15",
      user: "Robert Brown",
      role: "Manager",
      activity: "Report Generated",
      module: "Analytics",
      ipAddress: "192.168.1.120",
      device: "Chrome 125.0 / Linux",
      details: "Generated monthly performance analytics report",
    },
    {
      id: 4,
      timestamp: "2024-06-17 14:15:33",
      user: "Emily Davis",
      role: "Admin",
      activity: "Settings Changed",
      module: "System Settings",
      ipAddress: "192.168.1.115",
      device: "Edge 124.0 / Windows 11",
      details: "Modified security settings and password policies",
    },
    {
      id: 5,
      timestamp: "2024-06-17 14:10:15",
      user: "Robert Brown",
      role: "Manager",
      activity: "Report Generated",
      module: "Analytics",
      ipAddress: "192.168.1.120",
      device: "Chrome 125.0 / Linux",
      details: "Generated monthly performance analytics report",
    },
  ];

  const loginLogoutData = [
    {
      id: 1,
      datetime: "2024-06-17 14:35:20",
      user: "John Doe",
      role: "Admin",
      action: "Login",
      status: "Success",
      ipAddress: "192.168.1.100",
      device: "Chrome 125.0 / Windows 10",
    },
    {
      id: 2,
      datetime: "2024-06-17 14:30:15",
      user: "Sarah Wilson",
      role: "Manager",
      action: "Login",
      status: "Success",
      ipAddress: "192.168.1.105",
      device: "Firefox 126.0 / macOS",
    },
    {
      id: 3,
      datetime: "2024-06-17 14:25:10",
      user: "Mike Johnson",
      role: "User",
      action: "Login",
      status: "Failed",
      ipAddress: "192.168.1.110",
      device: "Safari 17.0 / iOS",
    },
    {
      id: 4,
      datetime: "2024-06-17 14:20:05",
      user: "Emily Davis",
      role: "Admin",
      action: "Logout",
      status: "Success",
      ipAddress: "192.168.1.115",
      device: "Edge 124.0 / Windows 11",
    },
    {
      id: 5,
      datetime: "2024-06-17 14:15:00",
      user: "Robert Brown",
      role: "Manager",
      action: "Login",
      status: "Success",
      ipAddress: "192.168.1.120",
      device: "Chrome 125.0 / Linux",
    },

  ];

  const changesHistoryData = [
    {
      id: 1,
      timestamp: "2024-06-17 14:40:30",
      user: "John Doe",
      entityType: "User",
      action: "Created",
      entityName: "jane.smith@company.com",
      changeSummary: "New user account created with Manager role",
      beforeAfter: {
        before: null,
        after: { name: "Jane Smith", role: "Manager", status: "Active" },
      },
    },
    {
      id: 2,
      timestamp: "2024-06-17 14:35:25",
      user: "Sarah Wilson",
      entityType: "Project",
      action: "Updated",
      entityName: "Q2 Marketing Campaign",
      changeSummary: "Project status and deadline updated",
      beforeAfter: {
        before: { status: "In Progress", deadline: "2024-06-30" },
        after: { status: "Review", deadline: "2024-07-15" },
      },
    },
    {
      id: 3,
      timestamp: "2024-06-17 14:30:20",
      user: "Mike Johnson",
      entityType: "Task",
      action: "Updated",
      entityName: "Website Redesign",
      changeSummary: "Task priority and assignee changed",
      beforeAfter: {
        before: { priority: "Medium", assignee: "Tom Wilson" },
        after: { priority: "High", assignee: "Lisa Johnson" },
      },
    },
    {
      id: 4,
      timestamp: "2024-06-17 14:25:15",
      user: "Emily Davis",
      entityType: "Project",
      action: "Deleted",
      entityName: "Old Training Module",
      changeSummary: "Deprecated project removed from system",
      beforeAfter: {
        before: { name: "Old Training Module", status: "Completed" },
        after: null,
      },
    },
    {
      id: 5,
      timestamp: "2024-06-17 14:20:10",
      user: "Robert Brown",
      entityType: "User",
      action: "Updated",
      entityName: "alex.jones@company.com",
      changeSummary: "User role elevated from User to Manager",
      beforeAfter: {
        before: { role: "User", permissions: ["read"] },
        after: { role: "Manager", permissions: ["read", "write", "manage"] },
      },
    },


  ];

  const roles = ["Admin", "Manager", "User"];
  const statuses = ["Success", "Failed"];
  const actions = ["Login", "Logout"];
  const entityActions = ["Created", "Updated", "Deleted"];

  // Filter and search logic
  const filterData = (data, type) => {
    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesRole = selectedRole === "" || item.role === selectedRole;

      let typeSpecificMatch = true;
      if (type === "login") {
        typeSpecificMatch =
          (selectedAction === "" || item.action === selectedAction) &&
          (selectedStatus === "" || item.status === selectedStatus);
      }

      return matchesSearch && matchesRole && typeSpecificMatch;
    });
  };

  // Pagination logic
  const paginate = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getCurrentData = () => {
    let data = [];
    switch (activeTab) {
      case "all-activities":
        data = allActivitiesData;
        break;
      case "login-logout":
        data = loginLogoutData;
        break;
      case "changes-history":
        data = changesHistoryData;
        break;
      default:
        data = [];
    }
    return paginate(filterData(data, activeTab));
  };

  const getTotalPages = () => {
    let data = [];
    switch (activeTab) {
      case "all-activities":
        data = allActivitiesData;
        break;
      case "login-logout":
        data = loginLogoutData;
        break;
      case "changes-history":
        data = changesHistoryData;
        break;
      default:
        data = [];
    }
    return Math.ceil(filterData(data, activeTab).length / itemsPerPage);
  };

  const handleViewDetails = (item) => {
    setModalData(item);
    setShowModal(true);
  };

  const exportCSV = () => {
    const data = getCurrentData();
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getActionBadge = (action) => {
    const badgeClass = {
      Created: "bg-success",
      Updated: "bg-primary",
      Deleted: "bg-danger",
    };
    return `badge ${badgeClass[action] || "bg-secondary"}`;
  };

  const getStatusBadge = (status) => {
    return `badge ${status === "Success" ? "bg-success" : "bg-danger"}`;
  };

  const { scrollContainerRef, fakeScrollbarRef } = useSyncScroll(true);


  return (
    <div className="container-fluid py-4 bg-light min-vh-100 bg-main">
      <div className="row">
        <div className="col-12">
          <div className="card bg-main shadow-sm border-0">
            <div className="card-header  border-bottom">
              <div className="d-flex justify-content-between  align-items-center">
                <h2 className=" gradient-heading">
                  <Activity className="me-2 text-primary" size={24} />
                  Audit Logs Dashboard
                </h2>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary "
                    onClick={exportCSV}
                  >
                    <Download size={16} className="me-1" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Tabs Navigation */}
              <ul className="nav nav-pills mb-4" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "all-activities" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("all-activities");
                      setCurrentPage(1);
                    }}
                  >
                    <FileText size={16} className="me-1 " />
                    All Activities Log
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "login-logout" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("login-logout");
                      setCurrentPage(1);
                    }}
                  >
                    <Users size={16} className="me-1" />
                    Login/Logout Records
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "changes-history" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("changes-history");
                      setCurrentPage(1);
                    }}
                  >
                    <Activity size={16} className="me-1" />
                    Changes History
                  </button>
                </li>
              </ul>

              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 p-2"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-2 mb-3 ">
                  <select
                    className="form-select p-2"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                {/* {activeTab === "login-logout" && (
                  <>
                    <div className="col-md-2 mb-3">
                      <select
                        className="form-select"
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                      >
                        <option value="">All Actions</option>
                        {actions.map((action) => (
                          <option key={action} value={action}>
                            {action}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2 mb-3">
                      <select
                        className="form-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">All Status</option>
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )} */}
              </div>

              {/* Active Users Card (for Login/Logout tab) */}
              {activeTab === "login-logout" && (
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="card  bg-card text-white">
                      <div className="card-body text-center">
                        <Users size={32} className="mb-2" />
                        <h5 className="card-title ">12</h5>
                        <p className="card-text small">
                          Currently Active Users
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table - Desktop View */}
              <div className="card  d-none  d-lg-block">
                <div
                  ref={fakeScrollbarRef}
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
                  <div style={{ width: "1500px", height: 1 }} />
                </div>

                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
                  ref={scrollContainerRef}
                >
                  <table className="table table-hover mb-0 table-gradient-bg">
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
                        {activeTab === "all-activities" && (
                          <>
                            <th>ID</th>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Activity</th>
                            <th>Module</th>
                            <th>IP Address</th>
                            <th>Device/Browser</th>
                            <th>Actions</th>
                          </>
                        )}
                        {activeTab === "login-logout" && (
                          <>
                            <th>ID</th>
                            <th>Date & Time</th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Action</th>
                            <th>Status</th>
                            <th>IP Address</th>
                            <th>Device/Browser</th>
                          </>
                        )}
                        {activeTab === "changes-history" && (
                          <>
                            <th>ID</th>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Entity Type</th>
                            <th>Action</th>
                            <th>Entity Name</th>
                            <th>Change Summary</th>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentData().map((item) => (
                        <tr key={item.id}  >
                          {activeTab === "all-activities" && (
                            <>
                              <td>{item.id}</td>
                              <td className="text-muted small">
                                {item.timestamp}
                              </td>
                              <td>
                                <strong>{item.user}</strong>
                              </td>
                              <td>
                                <span className="badge bg-secondary">
                                  {item.role}
                                </span>
                              </td>
                              <td>{item.activity}</td>
                              <td>{item.module}</td>
                              <td>
                                <code>{item.ipAddress}</code>
                              </td>
                              <td className="text-muted small">
                                {item.device}
                              </td>
                              <td>
                                <button
                                  className="btn btn-info btn-sm ms-3"
                                  onClick={() => handleViewDetails(item)}
                                >
                                  <Eye size={14} className="me-1 " />

                                </button>
                              </td>
                            </>
                          )}
                          {activeTab === "login-logout" && (
                            <>
                              <td>{item.id}</td>
                              <td className="text-muted small">
                                {item.datetime}
                              </td>
                              <td>
                                <strong>{item.user}</strong>
                              </td>
                              <td>
                                <span className="badge bg-secondary">
                                  {item.role}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`badge ${item.action === "Login"
                                    ? "bg-info"
                                    : "bg-warning"
                                    }`}
                                >
                                  {item.action}
                                </span>
                              </td>
                              <td>
                                <span className={getStatusBadge(item.status)}>
                                  {item.status}
                                </span>
                              </td>
                              <td>
                                <code>{item.ipAddress}</code>
                              </td>
                              <td className="text-muted small">
                                {item.device}
                              </td>
                            </>
                          )}
                          {activeTab === "changes-history" && (
                            <>
                              <td>{item.id}</td>
                              <td className="text-muted small">
                                {item.timestamp}
                              </td>
                              <td>
                                <strong>{item.user}</strong>
                              </td>
                              <td>
                                <span className="badge bg-info">
                                  {item.entityType}
                                </span>
                              </td>
                              <td>
                                <span className={getActionBadge(item.action)}>
                                  {item.action}
                                </span>
                              </td>
                              <td>
                                <strong>{item.entityName}</strong>
                              </td>
                              <td className="text-muted">
                                {item.changeSummary}
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleViewDetails(item)}
                                >
                                  <Eye size={14} className="me-1" />
                                  View
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="d-lg-none">
                {getCurrentData().map((item) => (
                  <div key={item.id} className="card mb-3 bg-card shadow-sm">
                    <div className="card-body">
                      {activeTab === "all-activities" && (
                        <>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{item.user}</h6>
                            <span className="badge bg-secondary">
                              {item.role}
                            </span>
                          </div>
                          <p className="card-text mb-2">
                            <strong>{item.activity}</strong> in {item.module}
                          </p>
                          <div className="row  small  mb-2">
                            <div className="col-6">
                              <strong>Time:</strong>
                              <br />
                              {item.timestamp}
                            </div>
                            <div className="col-6">
                              <strong>IP:</strong>
                              <br />
                              <code>{item.ipAddress}</code>
                            </div>
                          </div>
                          <div className="  small  mb-3">
                            <strong>Device:</strong> {item.device}
                          </div>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye size={14} className="me-1" />
                            View Details
                          </button>
                        </>
                      )}
                      {activeTab === "login-logout" && (
                        <>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{item.user}</h6>
                            <div className="d-flex gap-1">
                              <span className="badge bg-secondary">
                                {item.role}
                              </span>
                              <span
                                className={`badge ${item.action === "Login"
                                  ? "bg-info"
                                  : "bg-warning"
                                  }`}
                              >
                                {item.action}
                              </span>
                              <span className={getStatusBadge(item.status)}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                          <div className="row small text-white mb-2">
                            <div className="col-6">
                              <strong>Date & Time:</strong>
                              <br />
                              {item.datetime}
                            </div>
                            <div className="col-6">
                              <strong>IP Address:</strong>
                              <br />
                              <code>{item.ipAddress}</code>
                            </div>
                          </div>
                          <div className="small text-white">
                            <strong>Device:</strong> {item.device}
                          </div>
                        </>
                      )}
                      {activeTab === "changes-history" && (
                        <>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{item.user}</h6>
                            <div className="d-flex gap-1">
                              <span className="badge bg-info">
                                {item.entityType}
                              </span>
                              <span className={getActionBadge(item.action)}>
                                {item.action}
                              </span>
                            </div>
                          </div>
                          <p className="card-text mb-2">
                            <strong>{item.entityName}</strong>
                          </p>
                          <p className="small text-white mb-2">
                            {item.changeSummary}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small text-white">
                              {item.timestamp}
                            </span>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleViewDetails(item)}
                            >
                              <Eye size={14} className="me-1" />
                              View Changes
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-white">
                  Showing page {currentPage} of {getTotalPages()}
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </li>
                    {[...Array(getTotalPages())].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${currentPage === getTotalPages() ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === getTotalPages()}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && modalData && (
        <div className="modal fade show d-block custom-modal-dark ">
          <div className="modal-dialog  modal-lg">
            <div className="modal-content bg-card">
              <div className="modal-header">
                <h5 className="modal-title">
                  {activeTab === "changes-history"
                    ? "Change Details"
                    : "Activity Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {activeTab === "changes-history" && modalData.beforeAfter ? (
                  <div>
                    <div className="row">

                      <div className="col-md-6 ">
                        <h6 className="text-danger">Before:</h6>
                        <div className=" p-3 rounded bg-card">
                          {modalData.beforeAfter.before ? (
                            <pre className="mb-0">
                              {JSON.stringify(
                                modalData.beforeAfter.before,
                                null,
                                2
                              )}
                            </pre>
                          ) : (
                            <em className="">
                              No previous state (new entity)
                            </em>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-success">After:</h6>
                        <div className="bg-light p-3 rounded bg-card">
                          {modalData.beforeAfter.after ? (
                            <pre className="mb-0">
                              {JSON.stringify(
                                modalData.beforeAfter.after,
                                null,
                                2
                              )}
                            </pre>
                          ) : (
                            <em className="">Entity deleted</em>
                          )}
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <h6>Change Summary:</h6>
                        <p>{modalData.changeSummary}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <dl className="row">
                      {Object.entries(modalData).map(([key, value]) => {
                        if (key === "id" || key === "beforeAfter") return null;
                        return (
                          <React.Fragment key={key}>
                            <dt className="col-sm-3 text-capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </dt>
                            <dd className="col-sm-9">{value}</dd>
                          </React.Fragment>
                        );
                      })}
                    </dl>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn gradient-button"
                  onClick={() => setShowModal(false)}
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

export default AuditLog;
