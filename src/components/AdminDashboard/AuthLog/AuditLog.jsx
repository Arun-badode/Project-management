import React, { useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import useSyncScroll from "../Hooks/useSyncScroll";
import axios from "axios";
import BASE_URL from "../../../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AuditLog = () => {
  const [activeTab, setActiveTab] = useState("all-activities");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedDates, setSelectedDates] = useState([]); // ✅ Fixed: default empty
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [allActivitiesData, setAllActivitiesData] = useState([]);
  const [loginLogoutData, setLoginLogoutData] = useState([]);
  const [changesHistoryData, setChangesHistoryData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const roles = ["Admin", "Manager", "Interim Manager", "Team Member"];
  const statuses = ["Success", "Failed"];
  const actions = ["Login", "Logout"];
  const entityActions = ["Created", "Updated", "Deleted"];
  const token = localStorage.getItem("authToken");

  // Format date to DD-MM-YY HH:MM AM/PM
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  // ✅ Fixed: Full filtering with tab-specific logic
  const filterData = (data, type) => {
    return data.filter((item) => {
      // Search
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some(
          (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Role
      const matchesRole = selectedRole === "" || item.roleName === selectedRole;

      // Date(s)
      const itemDate = new Date(item.timestamp);
      const matchesDate =
        selectedDates.length === 0 ||
        selectedDates.some((selDate) => {
          const d = new Date(selDate);
          return (
            itemDate.getDate() === d.getDate() &&
            itemDate.getMonth() === d.getMonth() &&
            itemDate.getFullYear() === d.getFullYear()
          );
        });

      // Tab-specific filters
      let typeSpecificMatch = true;

      if (type === "login-logout") {
        const matchesAction = selectedAction === "" || item.action === selectedAction;
        const matchesStatus = selectedStatus === "" || item.status === selectedStatus;
        typeSpecificMatch = matchesAction && matchesStatus;
      } else if (type === "changes-history") {
        const validActions = ["Created", "Updated", "Deleted"];
        const matchesAction =
          selectedAction === "" || (validActions.includes(selectedAction) && item.action === selectedAction);
        typeSpecificMatch = matchesAction;
      }

      return matchesSearch && matchesRole && matchesDate && typeSpecificMatch;
    });
  };

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
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => `"${(row[header] || "").toString().replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${activeTab}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
    return `badge ${status?.toLowerCase() === "success" ? "bg-success" : "bg-danger"}`;
  };

  const { scrollContainerRef, fakeScrollbarRef } = useSyncScroll(true);

  // ✅ Reset filters on tab change
  useEffect(() => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
    setSelectedAction("");
    setSelectedDates([]);
    setCurrentPage(1);
  }, [activeTab]);

  // ✅ Fetch & split logs
  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await axios.get(`${BASE_URL}activityLogs/getActivityLogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const logs = response.data.data.recentLogs || [];
      const activeUsersData = response.data.data.activeUsers || [];
      const activeUsersCount = response.data.data.activeCount || 0;

      // ✅ Split by type
      const loginLogout = logs.filter((log) =>
        ["Login", "Logout"].includes(log.action)
      );
      const changesHistory = logs.filter((log) =>
        ["Created", "Updated", "Deleted"].includes(log.action)
      );

      setAllActivitiesData(logs);
      setLoginLogoutData(loginLogout);
      setChangesHistoryData(changesHistory);
      setActiveUsers(activeUsersData);
      setActiveCount(activeUsersCount);
    } catch (error) {
      console.error("Failed to fetch data", error);
      alert("Failed to load audit logs. Check console.");
    }
  };

  // Date handlers
  const handleDateChange = (dates) => {
    if (!dates) {
      setSelectedDates([]);
    } else if (Array.isArray(dates)) {
      setSelectedDates(dates);
    } else {
      setSelectedDates([dates]);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formatDateForDisplay = (date) => {
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear().toString().slice(-2)}`;
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 bg-main">
      <div className="row">
        <div className="col-12">
          <div className="card bg-main shadow-sm border-0">
            <div className="card-header border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="gradient-heading">
                  <Activity className="me-2 text-primary" size={24} />
                  Audit Logs Dashboard
                </h2>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary" onClick={exportCSV}>
                    <Download size={16} className="me-1" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Tabs */}
              <ul className="nav nav-pills mb-4" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "all-activities" ? "active" : ""}`}
                    onClick={() => setActiveTab("all-activities")}
                  >
                    <FileText size={16} className="me-1" />
                    All Activities Log
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "login-logout" ? "active" : ""}`}
                    onClick={() => setActiveTab("login-logout")}
                  >
                    <Users size={16} className="me-1" />
                    Login/Logout Records
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "changes-history" ? "active" : ""}`}
                    onClick={() => setActiveTab("changes-history")}
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
                <div className="col-md-2 mb-3">
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
                <div className="col-md-3 mb-3 position-relative">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Calendar size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 p-2"
                      placeholder={selectedDates.length > 0 ? "" : "Select dates..."}
                      value={selectedDates.length > 0 ? selectedDates.map(formatDateForDisplay).join(", ") : ""}
                      onClick={toggleDatePicker}
                      readOnly
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={toggleDatePicker}>
                      <Filter size={16} />
                    </button>
                  </div>
                  {showDatePicker && (
                    <div className="position-absolute bg-white p-3 shadow rounded mt-1" style={{ zIndex: 1000 }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Select Dates</h6>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowDatePicker(false)}>
                          <X size={16} />
                        </button>
                      </div>
                      <DatePicker
                        selected={selectedDates.length > 0 ? selectedDates[0] : null}
                        onChange={handleDateChange}
                        selectsMultiple
                        inline
                        monthsShown={2}
                      />
                    </div>
                  )}
                </div>

                {activeTab === "login-logout" && (
                  <>
                    <div className="col-md-2 mb-3">
                      <select
                        className="form-select p-2"
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
                        className="form-select p-2"
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
                )}
              </div>

              {/* Active Users Card */}
              {activeTab === "login-logout" && (
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="card bg-card text-white">
                      <div className="card-body text-center">
                        <Users size={32} className="mb-2" />
                        <h5 className="card-title">{activeCount}</h5>
                        <p className="card-text small">Currently Active Users</p>
                      </div>
                    </div>
                  </div>
                  {activeUsers.length > 0 && (
                    <div className="col-md-9">
                      <div className="card bg-card text-white">
                        <div className="card-body">
                          <h6 className="card-title mb-3">Active Users Details</h6>
                          <div className="table-responsive">
                            <table className="table table-dark table-sm">
                              <thead>
                                <tr>
                                  <th>User Name</th>
                                  <th>Role</th>
                                  <th>Shift Date</th>
                                  <th>Shift Time</th>
                                  <th>Shift Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activeUsers.map((user, index) => (
                                  <tr key={index}>
                                    <td>{user.userName}</td>
                                    <td>{user.roleName}</td>
                                    <td>{user.shiftDate}</td>
                                    <td>{user.startTime} - {user.endTime}</td>
                                    <td>{user.shiftType}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Desktop Table */}
              <div className="card d-none d-lg-block">
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
                      className="table-gradient-bg table"
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        backgroundColor: "#fff",
                      }}
                    >
                      <tr className="text-center">
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
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {getCurrentData().map((item) => (
                        <tr key={item.id}>
                          {activeTab === "all-activities" && (
                            <>
                              <td>{item.id}</td>
                              <td className="text-muted small">{formatDateTime(item.timestamp)}</td>
                              <td><strong>{item.user}</strong></td>
                              <td><span className="badge bg-secondary">{item.roleName}</span></td>
                              <td>{item.activity}</td>
                              <td>{item.module}</td>
                              <td><code>{item.ipAddress}</code></td>
                              <td className="text-muted small">{item.deviceBrowser}</td>
                              <td>
                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() => handleViewDetails(item)}
                                >
                                  <Eye size={14} />
                                </button>
                              </td>
                            </>
                          )}
                          {activeTab === "login-logout" && (
                            <>
                              <td>{item.id}</td>
                              <td className="text-muted small">{formatDateTime(item.timestamp)}</td>
                              <td><strong>{item.user}</strong></td>
                              <td><span className="badge bg-secondary">{item.roleName}</span></td>
                              <td>
                                <span className={`badge ${item.action === "Login" ? "bg-info" : "bg-warning"}`}>
                                  {item.action}
                                </span>
                              </td>
                              <td>
                                <span className={getStatusBadge(item.status)}>{item.status}</span>
                              </td>
                              <td><code>{item.ipAddress}</code></td>
                              <td className="text-muted small">{item.deviceBrowser}</td>
                            </>
                          )}
                          {activeTab === "changes-history" && (
                            <>
                              <td>{item.id}</td>
                              <td className="text-muted small">{formatDateTime(item.timestamp)}</td>
                              <td><strong>{item.user}</strong></td>
                              <td><span className="badge bg-info">{item.module}</span></td>
                              <td>
                                <span className={getActionBadge(item.action)}>{item.action}</span>
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

              {/* Mobile View */}
              <div className="d-lg-none">
                {getCurrentData().map((item) => (
                  <div key={item.id} className="card mb-3 bg-card shadow-sm">
                    <div className="card-body">
                      {activeTab === "all-activities" && (
                        <>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{item.user}</h6>
                            <span className="badge bg-secondary">{item.roleName}</span>
                          </div>
                          <p className="card-text mb-2">
                            <strong>{item.activity}</strong> in {item.module}
                          </p>
                          <div className="row small mb-2">
                            <div className="col-6">
                              <strong>Time:</strong><br />
                              {formatDateTime(item.timestamp)}
                            </div>
                            <div className="col-6">
                              <strong>IP:</strong><br />
                              <code>{item.ipAddress}</code>
                            </div>
                          </div>
                          <div className="small mb-3">
                            <strong>Device:</strong> {item.deviceBrowser}
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
                              <span className="badge bg-secondary">{item.roleName}</span>
                              <span className={`badge ${item.action === "Login" ? "bg-info" : "bg-warning"}`}>
                                {item.action}
                              </span>
                              <span className={getStatusBadge(item.status)}>{item.status}</span>
                            </div>
                          </div>
                          <div className="row small text-white mb-2">
                            <div className="col-6">
                              <strong>Date & Time:</strong><br />
                              {formatDateTime(item.timestamp)}
                            </div>
                            <div className="col-6">
                              <strong>IP Address:</strong><br />
                              <code>{item.ipAddress}</code>
                            </div>
                          </div>
                          <div className="small text-white">
                            <strong>Device:</strong> {item.deviceBrowser}
                          </div>
                        </>
                      )}
                      {activeTab === "changes-history" && (
                        <>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{item.user}</h6>
                            <div className="d-flex gap-1">
                              <span className="badge bg-info">{item.module}</span>
                              <span className={getActionBadge(item.action)}>{item.action}</span>
                            </div>
                          </div>
                          <p className="card-text mb-2"><strong>{item.module}</strong></p>
                          <p className="small text-white mb-2">{item.action} in {item.module}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small text-white">
                              {formatDateTime(item.timestamp)}
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
              {getCurrentData().length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-white">
                    Showing page {currentPage} of {getTotalPages()}
                  </div>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft size={16} />
                        </button>
                      </li>
                      {[...Array(getTotalPages())].map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                          <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage >= getTotalPages() ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                          disabled={currentPage >= getTotalPages()}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && modalData && (
        <div className="modal fade show d-block custom-modal-dark" onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-card">
              <div className="modal-header">
                <h5 className="modal-title">
                  {activeTab === "changes-history" ? "Change Details" : "Activity Details"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {activeTab === "changes-history" && modalData.beforeAfter ? (
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="text-danger">Before:</h6>
                        <div className="p-3 rounded bg-card">
                          {modalData.beforeAfter.before ? (
                            <pre className="mb-0 text-white">
                              {JSON.stringify(modalData.beforeAfter.before, null, 2)}
                            </pre>
                          ) : (
                            <em className="text-muted">No previous state (new entity)</em>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-success">After:</h6>
                        <div className="p-3 rounded bg-card">
                          {modalData.beforeAfter.after ? (
                            <pre className="mb-0 text-white">
                              {JSON.stringify(modalData.beforeAfter.after, null, 2)}
                            </pre>
                          ) : (
                            <em className="text-muted">Entity deleted</em>
                          )}
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <h6>Change Summary:</h6>
                        <p className="text-white">{modalData.changeSummary || "No summary available."}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <dl className="row text-white">
                    {Object.entries(modalData)
                      .filter(([key]) => !["id", "beforeAfter"].includes(key))
                      .map(([key, value]) => (
                        <React.Fragment key={key}>
                          <dt className="col-sm-3 text-capitalize">{key.replace(/([A-Z])/g, " $1")}:</dt>
                          <dd className="col-sm-9">
                            {key === "timestamp" ? formatDateTime(value) : String(value || "-")}
                          </dd>
                        </React.Fragment>
                      ))}
                  </dl>
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