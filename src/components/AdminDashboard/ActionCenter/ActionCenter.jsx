import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axiosInstance from "../../Utilities/axiosInstance";
import jsPDF from 'jspdf';

// Import autoTable plugin differently
import { autoTable } from 'jspdf-autotable';

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
  const id = localStorage.getItem("userId");

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

  // Handle export to CSV
  const exportToCSV = (data) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Request Type,Requested By,From Role,To Role,Date,Message,Status,Action Taken By\n";
    
    // Add data rows
    data.forEach(item => {
      const row = [
        `"${item.requestType || ''}"`,
        `"${item.requesterName || ''}"`,
        `"${item.fromRole || ''}"`,
        `"${item.toRole || ''}"`,
        `"${formatDate(item.createdAt)}"`,
        `"${item.message || ''}"`,
        `"${item.actionType || (activeTab === 'pending' ? 'Pending' : '')}"`,
        `"${item.actionTakenBy || ''}"`
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab === 'pending' ? 'pending_requests' : 'action_history'}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  // FIXED: Handle export to PDF — Using the imported autoTable function directly
  const exportToPDF = (data) => {
    try {
      // SAFETY CHECK: Ensure data is a valid array
      if (!Array.isArray(data) || data.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No Data',
          text: 'No records available to export as PDF.',
        });
        return false;
      }

      // Create new PDF doc
      const doc = new jsPDF();

      // Add Title
      doc.setFontSize(18);
      doc.text(
        activeTab === 'pending' ? 'Pending Requests' : 'Action History',
        105,
        15,
        { align: 'center' }
      );

      // Add Date
      doc.setFontSize(10);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        105,
        22,
        { align: 'center' }
      );

      // Prepare headers
      const headers = [
        ['Request Type', 'Requested By', 'From Role', 'To Role', 'Date', 'Message', 'Status', 'Action Taken By']
      ];

      // Prepare body - with fallbacks for missing/undefined fields
      const tableData = data.map(item => [
        item.requestType || 'N/A',
        item.requesterName || 'N/A',
        item.fromRole || 'N/A',
        item.toRole || 'N/A',
        item.createdAt ? formatDate(item.createdAt) : 'N/A',
        (item.message || 'N/A').substring(0, 100), // Truncate long messages to avoid layout issues
        item.actionType || (activeTab === 'pending' ? 'Pending' : 'N/A'),
        item.actionTakenBy || 'N/A'
      ]);

      // FIXED: Use the imported autoTable function directly instead of calling it on the doc instance
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 30,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          halign: 'left',
          valign: 'middle'
        },
        headStyles: {
          fillColor: [33, 150, 243], // Material Blue
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 40, fontStyle: 'normal' },
          6: { cellWidth: 20 },
          7: { cellWidth: 25 }
        },
        didDrawPage: (data) => {
          // Optional: Add footer or watermark if needed
        }
      });

      // Save PDF
      const fileName = `${activeTab === 'pending' ? 'pending_requests' : 'action_history'}_${new Date().toISOString().slice(0,10)}.pdf`;
      doc.save(fileName);

      return true; // Success

    } catch (error) {
      console.error('PDF Generation Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Unable to generate PDF. Please check console or try again later.',
      });
      return false;
    }
  };

  // Handle export
  const handleExport = (format) => {
    // Get filtered data based on active tab
    let dataToExport = [];
    
    if (activeTab === "pending") {
      dataToExport = pendingRequests.filter(request => {
        // Apply filters
        if (filters.requestType && request.requestType !== filters.requestType) return false;
        if (filters.requestedBy && !request.requesterName.toLowerCase().includes(filters.requestedBy.toLowerCase())) return false;
        if (filters.dateFrom && new Date(request.createdAt) < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(request.createdAt) > new Date(filters.dateTo)) return false;
        return true;
      });
    } else {
      dataToExport = actionHistory.filter(action => {
        // Apply filters
        if (filters.actionType && action.actionType !== filters.actionType) return false;
        if (filters.requestType && action.requestType !== filters.requestType) return false;
        if (filters.requestedBy && !action.requesterName.toLowerCase().includes(filters.requestedBy.toLowerCase())) return false;
        if (filters.actionTakenBy && !action.actionTakenBy.toLowerCase().includes(filters.actionTakenBy.toLowerCase())) return false;
        if (filters.dateFrom && new Date(action.createdAt) < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(action.createdAt) > new Date(filters.dateTo)) return false;
        return true;
      });
    }
    
    // Sort data
    if (filters.sortOrder === "oldest") {
      dataToExport.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      dataToExport.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    if (dataToExport.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'There is no data to export with the current filters.',
      });
      return;
    }
    
    // Export based on format
    let exportSuccess = false;
    
    if (format === "csv") {
      exportToCSV(dataToExport);
      exportSuccess = true;
    } else if (format === "pdf") {
      exportSuccess = exportToPDF(dataToExport);
    }
    
    // Only show success message if export was successful
    if (exportSuccess) {
      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: `Data has been exported as ${format.toUpperCase()} with ${dataToExport.length} records.`,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
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
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-medium text-white">
                  Pending Approval Requests
                </h2>
               
              </div>
              
              {pendingRequests.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {pendingRequests.map((request) => (
                    <Col key={request.id}>
                      <Card className="h-100 bg-card" style={{ borderLeft: '4px solid #ffc107' }}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <Card.Title className="h6 mb-1">
                                {request.requesterName}
                              </Card.Title>
                              <div className="small text-muted mb-2">
                                {formatDate(request.createdAt)}
                              </div>
                            </div>
                            <span className="badge bg-warning text-dark">
                              {request.requestType}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <p className="mb-0">{request.message}</p>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="small">
                              <span className="text-muted">From:</span> {request.fromRole} <br />
                              <span className="text-muted">To:</span> {request.toRole}
                            </div>
                            
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleAction(request.id, "reject")}
                                disabled={loading}
                                style={{ borderRadius: '4px', padding: '6px 10px' }}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleAction(request.id, "approve")}
                                disabled={loading}
                                style={{ borderRadius: '4px', padding: '6px 10px' }}
                              >
                                Approve
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="card bg-card">
                  <div className="card-body text-center py-4">
                    <p className="text-muted">No pending requests found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Action History */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-medium text-white">
                Action History
              </h2>
             
            </div>
            
            {actionHistory.length > 0 ? (
              <Row xs={1} md={2} lg={3} className="g-3">
                {actionHistory.map((action) => (
                  <Col key={action.id}>
                    <Card className="h-100 bg-card" style={{ 
                      borderLeft: action.actionType === "Approved" ? '4px solid #28a745' : '4px solid #dc3545' 
                    }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <Card.Title className="h6 mb-1">
                              {action.requestType}
                            </Card.Title>
                            <div className="small  mb-2">
                              {formatDate(action.createdAt)}
                            </div>
                          </div>
                          {action.actionType === "Approved" ? (
                            <span className="badge bg-success">Approved</span>
                          ) : (
                            <span className="badge bg-danger">Rejected</span>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <p className="mb-0">{action.message}</p>
                        </div>
                        
                        <div className="small">
                          <div className="mb-1">
                            <span className="">Requested by:</span> {action.requesterName} ({action.fromRole})
                          </div>
                          {action.actionTakenBy && (
                            <div>
                              <span className="">Action by:</span> {action.actionTakenBy}
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="card bg-card">
                <div className="card-body text-center py-4">
                  <p className="text-muted">No action history found</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;