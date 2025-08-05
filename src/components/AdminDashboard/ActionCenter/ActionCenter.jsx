import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axiosInstance from "../../Utilities/axiosInstance";

const App = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("pending");

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    actionType: "",
    requestType: "",
    requestedBy: "",
    actionTakenBy: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    sortOrder: "latest",
  });

  // Data states
  const [pendingRequests, setPendingRequests] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const id = localStorage.getItem("userId")

  // Fetch pending requests from API
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("requestActivity/getPendingRequests");
      setPendingRequests(response.data.pendingRequests || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
      setError('Failed to fetch pending requests');
      setLoading(false);
    }
  };

  // Fetch action history from API
  const fetchActionHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("requestActivity/getAllReviewedRequests");
      
      // Combine approved and rejected requests into a single array
      const combinedHistory = [
        ...(response.data.data?.approvedRequests?.map(request => ({
          ...request,
          actionType: "Approved"
        })) || []),
        ...(response.data.data?.rejectedRequests?.map(request => ({
          ...request,
          actionType: "Rejected"
        })) || [])
      ];
      
      setActionHistory(combinedHistory);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch action history:", error);
      setError('Failed to fetch action history');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingRequests();
    } else {
      fetchActionHistory();
    }
  }, [activeTab]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      actionType: "",
      requestType: "",
      requestedBy: "",
      actionTakenBy: "",
      status: "",
      dateFrom: "",
      dateTo: "",
      sortOrder: "latest",
    });
  };

  // Handle approval/rejection
  const handleAction = async (id, action) => {
    try {
      setLoading(true);
      const status = action === "approve" ? "approved" : "rejected";

      await axiosInstance.put(
        `requestActivity/updateRequestStatus/${id}`,
        { status: status }
      );

      // Refresh both lists
      await fetchPendingRequests();
      await fetchActionHistory();

      Swal.fire({
        icon: 'success',
        title: `Request ${status}`,
        text: `The request has been ${status} successfully.`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        `Error ${action === "approve" ? "approving" : "rejecting"} request:`,
        error
      );
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${action === "approve" ? "approve" : "reject"} the request. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <Button variant="link" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-main">
      {/* Header */}
      <header className="bg-white shadow-sm bg-card">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center py-3">
            <h2 className="h2 fw-bold mb-0 gradient-heading">Action Center</h2>
            <div className="d-flex gap-2">
              <button
                onClick={() => handleExport("csv")}
                className="btn btn-outline-secondary d-flex align-items-center"
              >
                <i className="fas fa-file-csv me-2"></i>
                Export CSV
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="btn btn-outline-secondary d-flex align-items-center"
              >
                <i className="fas fa-file-pdf me-2"></i>
                Export PDF
              </button>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending Approval
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "history" ? "active" : ""}`}
                onClick={() => setActiveTab("history")}
              >
                Action History
              </button>
            </li>
          </ul>
        </div>
      </header>

      <div className="container-fluid py-4">
        {/* Filters */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline-primary d-flex align-items-center"
            >
              <i
                className={`fas fa-filter me-2 ${showFilters ? "text-primary" : ""}`}
              ></i>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <div className="text-white small">
              {activeTab === "pending"
                ? `${pendingRequests.length} pending requests`
                : `${actionHistory.length} history records`}
            </div>
          </div>

          {showFilters && (
            <div className="card mb-4 bg-card">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6 col-lg-4">
                    <label htmlFor="actionType" className="form-label">
                      Action Type
                    </label>
                    <select
                      id="actionType"
                      name="actionType"
                      value={filters.actionType}
                      onChange={handleFilterChange}
                      className="form-select"
                    >
                      <option value="">All Actions</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <label htmlFor="requestType" className="form-label">
                      Request Type
                    </label>
                    <select
                      id="requestType"
                      name="requestType"
                      value={filters.requestType}
                      onChange={handleFilterChange}
                      className="form-select"
                    >
                      <option value="">All Requests</option>
                      <option value="work-from-home">Work From Home</option>
                      <option value="leave">Leave Request</option>
                      <option value="reassignment">Reassignment</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <label htmlFor="requestedBy" className="form-label">
                      Requested By
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="requestedBy"
                        name="requestedBy"
                        value={filters.requestedBy}
                        onChange={handleFilterChange}
                        className="form-control"
                        placeholder="Search by name..."
                      />
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <label htmlFor="actionTakenBy" className="form-label">
                      Action Taken By
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="actionTakenBy"
                        name="actionTakenBy"
                        value={filters.actionTakenBy}
                        onChange={handleFilterChange}
                        className="form-control"
                        placeholder="Search by name..."
                      />
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="form-select"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <div className="row g-2">
                      <div className="col">
                        <label htmlFor="dateFrom" className="form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="dateFrom"
                          name="dateFrom"
                          value={filters.dateFrom}
                          onChange={handleFilterChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="dateTo" className="form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="dateTo"
                          name="dateTo"
                          value={filters.dateTo}
                          onChange={handleFilterChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap align-items-center justify-content-between mt-4">
                  <div className="d-flex align-items-center mb-2 mb-md-0">
                    <label className="me-2">Sort:</label>
                    <select
                      name="sortOrder"
                      value={filters.sortOrder}
                      onChange={handleFilterChange}
                      className="form-select form-select-sm w-auto"
                    >
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="btn btn-outline-secondary"
                    >
                      Clear Filters
                    </button>
                    <button type="button" className="btn btn-primary">
                      Apply Filters
                    </button>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                  >
                    This Week
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === "pending" ? (
          <div>
            {/* Pending Requests */}
            <div className="mb-5">
              <h2 className="h5 fw-medium mb-3 text-white">
                Pending Approval Requests
              </h2>
              <div className="row g-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="col-12">
                    <div className="card bg-card">
                      <div className="card-body">
                        <div className="d-flex flex-column flex-md-row justify-content-between">
                          <div className="mb-3 mb-md-0">
                            <div className="d-flex align-items-center mb-2">
                              <span className="badge bg-warning text-dark me-2">
                                {request.requestType}
                              </span>
                              <span className="small">
                                {formatDate(request.createdAt)}
                              </span>
                            </div>
                            <h3 className="h6 fw-medium mb-1">
                              {request.requesterName}{" "}
                              <span className="">
                                ({request.fromRole} → {request.toRole})
                              </span>
                            </h3>
                            <p className="mb-0">{request.message}</p>
                          </div>
                         <div className="d-flex gap-2">
                          <button
                            onClick={() => handleAction(request.id, "reject")}
                            className="btn btn-outline-danger d-flex align-items-center"
                            style={{ height: "45px", marginTop: "20px" }}
                            disabled={loading}
                          >
                            <i className="fas fa-times me-2"></i>
                            Reject
                          </button>

                          <button
                            onClick={() => handleAction(request.id, "approve")}
                            className="btn btn-success d-flex align-items-center"
                            style={{ height: "45px", marginTop: "20px" }}
                            disabled={loading}
                          >
                            <i className="fas fa-check me-2"></i>
                            Approve
                          </button>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-card">
            <div className="list-group list-group-flush">
              {actionHistory.length > 0 ? (
                actionHistory.map((action) => (
                  <div
                    key={action.id}
                    className="list-group-item list-group-item-action bg-card"
                  >
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        {action.actionType === "Approved" && (
                          <div
                            className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="fas fa-check text-success"></i>
                          </div>
                        )}
                        {action.actionType === "Rejected" && (
                          <div
                            className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="fas fa-times text-danger"></i>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex flex-column flex-md-row justify-content-between mb-1">
                          <h3 className="h6 fw-medium mb-1 mb-md-0 text-white">
                            {action.actionType} - {action.requestType}
                          </h3>
                          <span className="small">
                            {formatDate(action.createdAt)}
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2 small mb-2">
                          <span>
                            <span className="fw-medium">Requested by:</span>{" "}
                            {action.requesterName} ({action.fromRole})
                          </span>
                        </div>
                        <p className="mb-0">{action.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="list-group-item bg-card text-center py-4">
                  <p className="text-muted">No action history found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;