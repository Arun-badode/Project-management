import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Spinner, Form, Table } from 'react-bootstrap';
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
    shiftType: "Others", // Changed default to "Others" to match API data
    reassignStatus: "pending" // Added for reassign status filter
  });

  // Data states
  const [pendingRequests, setPendingRequests] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [shifts, setShifts] = useState([]); // Added for shift data
  const [reassignRequests, setReassignRequests] = useState([]); // Added for reassign data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const id = localStorage.getItem("userId");

  // Fetch shifts from API
  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("shift/getAllShifts");
      
      // Filter shifts based on shiftType filter and only show pending requests
      let filteredShifts = response.data.data?.filter(shift => 
        shift.status === "pending"
      ) || [];
      
      // Apply shift type filter if not "All"
      if (filters.shiftType !== "All") {
        if (filters.shiftType === "Others") {
          // For "Others", show shifts that don't match the standard types
          filteredShifts = filteredShifts.filter(shift => 
            !["Morning Shift", "Night Shift", "Full Day", "Half Day", "Night"].includes(shift.shiftType)
          );
        } else {
          // For specific types, show only that type
          filteredShifts = filteredShifts.filter(shift => 
            shift.shiftType === filters.shiftType
          );
        }
      }
      
      setShifts(filteredShifts);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
      setError('Failed to fetch shifts');
      setLoading(false);
    }
  };

  // Fetch reassign requests from API
  const fetchReassignRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("reassign");
      
      // Filter reassign requests based on status filter
      const filteredReassignRequests = response.data.data?.filter(request => 
        request.status === filters.reassignStatus
      ) || [];
      
      setReassignRequests(filteredReassignRequests);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch reassign requests:", error);
      setError('Failed to fetch reassign requests');
      setLoading(false);
    }
  };

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

  // Fetch action history from API - now fetches approved/rejected shifts and reassign requests
  const fetchActionHistory = async () => {
    try {
      setLoading(true);
      
      // Fetch approved/rejected shifts
      const shiftsResponse = await axiosInstance.get("shift/getAllShifts");
      const approvedRejectedShifts = shiftsResponse.data.data?.filter(shift => 
        shift.status === "approved" || shift.status === "rejected"
      ).map(shift => ({
        id: shift.id,
        requestType: "Shift Request",
        requesterName: shift.fullName,
        fromRole: "Employee",
        toRole: "Manager",
        createdAt: shift.createdAt || shift.shiftDate,
        message: `${shift.shiftType} shift on ${formatDate(shift.shiftDate)} from ${shift.startTime} to ${shift.endTime}`,
        actionType: shift.status === "approved" ? "Approved" : "Rejected",
        actionTakenBy: shift.actionTakenBy || "Current User"
      })) || [];
      
      // Fetch approved/rejected reassign requests
      const reassignResponse = await axiosInstance.get("reassign");
      const approvedRejectedReassigns = reassignResponse.data.data?.filter(request => 
        request.status === "approved" || request.status === "rejected"
      ).map(request => ({
        id: request.id,
        requestType: "Reassign Request",
        requesterName: `Admin ${request.admin_id}`,
        fromRole: "Admin",
        toRole: "Manager",
        createdAt: request.created_date,
        message: request.reason,
        actionType: request.status === "approved" ? "Approved" : "Rejected",
        actionTakenBy: `Manager ${request.projectManagerId}`,
        projectId: request.project_id,
        taskId: request.task_id
      })) || [];
      
      // Combine both arrays
      const combinedHistory = [...approvedRejectedShifts, ...approvedRejectedReassigns];
      
      // Sort by date (newest first)
      combinedHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
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
      fetchShifts();
      fetchReassignRequests(); // Added to fetch reassign requests
    } else if (activeTab === "history") {
      fetchActionHistory();
    }
  }, [activeTab, filters.shiftType, filters.reassignStatus]); // Added filters.reassignStatus as dependency

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
      shiftType: "Others", // Reset to default
      reassignStatus: "pending" // Reset to default
    });
  };

  // Handle approval/rejection for shifts
  const handleShiftAction = async (id, action) => {
    try {
      setLoading(true);
      const status = action === "approve" ? "approved" : "rejected";

      // Call the shift approval/rejection API
      await axiosInstance.put(
        `shift/updateShiftStatus/${id}`,
        { status: status }
      );

      // Remove the shift from the shifts list (pending approvals)
      setShifts(prevShifts => prevShifts.filter(shift => shift.id !== id));

      // Refresh action history to include the new action
      await fetchActionHistory();

      Swal.fire({
        icon: 'success',
        title: `Shift ${status}`,
        text: `The shift has been ${status} successfully.`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        `Error ${action === "approve" ? "approving" : "rejecting"} shift:`,
        error
      );
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${action === "approve" ? "approve" : "reject"} the shift. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle approval/rejection for reassign requests
  const handleReassignAction = async (id, action) => {
    try {
      setLoading(true);
      const status = action === "approve" ? "approved" : "rejected";

      // Call the reassign approval/rejection API with correct endpoint and body
      await axiosInstance.put(
        `reassign/update/${id}`,
        { 
   
          status: status 
        }
      );

      // Remove the reassign request from the reassignRequests list (pending approvals)
      setReassignRequests(prevRequests => prevRequests.filter(request => request.id !== id));

      // Refresh action history to include the new action
      await fetchActionHistory();

      Swal.fire({
        icon: 'success',
        title: `Reassign Request ${status}`,
        text: `The reassign request has been ${status} successfully.`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        `Error ${action === "approve" ? "approving" : "rejecting"} reassign request:`,
        error
      );
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${action === "approve" ? "approve" : "reject"} the reassign request. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle approval/rejection for regular requests
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
    
    // Add headers based on active tab
    if (activeTab === "pending") {
      // Determine if we're exporting shifts or reassign requests
      const isShiftData = data.length > 0 && data[0].shiftType !== undefined;
      
      if (isShiftData) {
        csvContent += "Shift Type,Employee Name,Date,Start Time,End Time,Notes,Other Type,Duration,Permission Apply\n";
        
        // Add data rows for shifts
        data.forEach(item => {
          const row = [
            `"${item.shiftType || ''}"`,
            `"${item.fullName || ''}"`,
            `"${formatDate(item.shiftDate)}"`,
            `"${item.startTime || ''}"`,
            `"${item.endTime || ''}"`,
            `"${item.notes || ''}"`,
            `"${item.otherType || ''}"`,
            `"${item.duration || ''}"`,
            `"${item.permissionApply || ''}"`
          ];
          csvContent += row.join(",") + "\n";
        });
      } else {
        csvContent += "Project ID,Task ID,Admin ID,Reason,Status,Created Date\n";
        
        // Add data rows for reassign requests
        data.forEach(item => {
          const row = [
            `"${item.project_id || ''}"`,
            `"${item.task_id || ''}"`,
            `"${item.admin_id || ''}"`,
            `"${item.reason || ''}"`,
            `"${item.status || ''}"`,
            `"${formatDate(item.created_date)}"`
          ];
          csvContent += row.join(",") + "\n";
        });
      }
    } else if (activeTab === "history") {
      csvContent += "Request Type,Requested By,From Role,To Role,Date,Message,Status,Action Taken By\n";
      
      // Add data rows for action history
      data.forEach(item => {
        const row = [
          `"${item.requestType || ''}"`,
          `"${item.requesterName || ''}"`,
          `"${item.fromRole || ''}"`,
          `"${item.toRole || ''}"`,
          `"${formatDate(item.createdAt)}"`,
          `"${item.message || ''}"`,
          `"${item.actionType || ''}"`,
          `"${item.actionTakenBy || ''}"`
        ];
        csvContent += row.join(",") + "\n";
      });
    }
    
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

  // Handle export to PDF
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

      // Prepare headers and body based on active tab
      let headers, tableData;
      
      if (activeTab === "pending") {
        // Determine if we're exporting shifts or reassign requests
        const isShiftData = data.length > 0 && data[0].shiftType !== undefined;
        
        if (isShiftData) {
          headers = [['Shift Type', 'Employee Name', 'Date', 'Start Time', 'End Time', 'Notes', 'Other Type', 'Duration', 'Permission Apply']];
          
          tableData = data.map(item => [
            item.shiftType || 'N/A',
            item.fullName || 'N/A',
            item.shiftDate ? formatDate(item.shiftDate) : 'N/A',
            item.startTime || 'N/A',
            item.endTime || 'N/A',
            (item.notes || 'N/A').substring(0, 50),
            item.otherType || 'N/A',
            item.duration || 'N/A',
            item.permissionApply || 'N/A'
          ]);
        } else {
          headers = [['Project ID', 'Task ID', 'Admin ID', 'Reason', 'Status', 'Created Date']];
          
          tableData = data.map(item => [
            item.project_id || 'N/A',
            item.task_id || 'N/A',
            item.admin_id || 'N/A',
            (item.reason || 'N/A').substring(0, 100),
            item.status || 'N/A',
            item.created_date ? formatDate(item.created_date) : 'N/A'
          ]);
        }
      } else if (activeTab === "history") {
        headers = [['Request Type', 'Requested By', 'From Role', 'To Role', 'Date', 'Message', 'Status', 'Action Taken By']];
        
        tableData = data.map(item => [
          item.requestType || 'N/A',
          item.requesterName || 'N/A',
          item.fromRole || 'N/A',
          item.toRole || 'N/A',
          item.createdAt ? formatDate(item.createdAt) : 'N/A',
          (item.message || 'N/A').substring(0, 100),
          item.actionType || 'N/A',
          item.actionTakenBy || 'N/A'
        ]);
      }

      // Use the imported autoTable function directly
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
        columnStyles: activeTab === "pending" ? 
          (data.length > 0 && data[0].shiftType !== undefined ? {
            0: { cellWidth: 20 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 30 },
            6: { cellWidth: 20 },
            7: { cellWidth: 15 },
            8: { cellWidth: 20 }
          } : {
            0: { cellWidth: 20 },
            1: { cellWidth: 20 },
            2: { cellWidth: 20 },
            3: { cellWidth: 60 },
            4: { cellWidth: 20 },
            5: { cellWidth: 30 }
          }) : {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 40 },
          6: { cellWidth: 20 },
          7: { cellWidth: 25 }
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
      // Export shifts
      const filteredShifts = shifts.filter(shift => {
        // Apply filters
        if (filters.shiftType && filters.shiftType !== "All" && filters.shiftType !== "Others" && shift.shiftType !== filters.shiftType) return false;
        if (filters.shiftType === "Others" && (shift.shiftType === "Morning Shift" || shift.shiftType === "Night Shift" || shift.shiftType === "Full Day" || shift.shiftType === "Half Day" || shift.shiftType === "Night")) return false;
        if (filters.requestedBy && !shift.fullName.toLowerCase().includes(filters.requestedBy.toLowerCase())) return false;
        if (filters.dateFrom && new Date(shift.shiftDate) < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(shift.shiftDate) > new Date(filters.dateTo)) return false;
        return true;
      });
      
      // Export reassign requests
      const filteredReassigns = reassignRequests.filter(request => {
        // Apply filters
        if (filters.reassignStatus && request.status !== filters.reassignStatus) return false;
        if (filters.requestedBy && !request.admin_id.toString().includes(filters.requestedBy)) return false;
        if (filters.dateFrom && new Date(request.created_date) < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(request.created_date) > new Date(filters.dateTo)) return false;
        return true;
      });
      
      // Combine both arrays
      dataToExport = [...filteredShifts, ...filteredReassigns];
    } else if (activeTab === "history") {
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
      dataToExport.sort((a, b) => new Date(a.shiftDate || a.createdAt || a.created_date) - new Date(b.shiftDate || b.createdAt || b.created_date));
    } else {
      dataToExport.sort((a, b) => new Date(b.shiftDate || b.createdAt || b.created_date) - new Date(a.shiftDate || a.createdAt || b.created_date));
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
                Pending Approvals
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
                ? `${shifts.length + reassignRequests.length} requests pending approval`
                : `${actionHistory.length} history records`}
            </div>
          </div>

          {showFilters && (
            <div className="card mb-4 bg-card">
              <div className="card-body">
                <div className="row g-3">
                  {activeTab === "pending" ? (
                    // Pending tab filters
                    <>
                      <div className="col-md-6 col-lg-4">
                        <label htmlFor="shiftType" className="form-label">
                          Shift Type
                        </label>
                        <select
                          id="shiftType"
                          name="shiftType"
                          value={filters.shiftType}
                          onChange={handleFilterChange}
                          className="form-select"
                        >
                          <option value="All">All Shifts</option>
                          <option value="Others">Others</option>
                          <option value="Morning Shift">Morning Shift</option>
                          <option value="Night Shift">Night Shift</option>
                          <option value="Full Day">Full Day</option>
                          <option value="Half Day">Half Day</option>
                          <option value="Night">Night</option>
                        </select>
                      </div>
                      
                      <div className="col-md-6 col-lg-4">
                        <label htmlFor="reassignStatus" className="form-label">
                          Reassign Status
                        </label>
                        <select
                          id="reassignStatus"
                          name="reassignStatus"
                          value={filters.reassignStatus}
                          onChange={handleFilterChange}
                          className="form-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    // Action history filters
                    <>
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
                          <option value="Shift Request">Shift Request</option>
                          <option value="Reassign Request">Reassign Request</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="col-md-6 col-lg-4">
                    <label htmlFor="requestedBy" className="form-label">
                      {activeTab === "pending" ? "Requested By" : "Requested By"}
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="requestedBy"
                        name="requestedBy"
                        value={filters.requestedBy}
                        onChange={handleFilterChange}
                        className="form-control"
                        placeholder="Search by name or ID..."
                      />
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>

                  {activeTab === "history" && (
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
                  )}

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
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => {
                        if (activeTab === "pending") {
                          fetchShifts();
                          fetchReassignRequests();
                        } else {
                          fetchActionHistory();
                        }
                      }}
                    >
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
            {/* Shifts */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-medium text-white">
                  Shift Requests
                </h2>
              </div>
              
              {shifts.length > 0 ? (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <Row xs={1} md={2} lg={3} className="g-3">
                    {shifts.map((shift) => (
                      <Col key={shift.id}>
                        <Card className="h-100 bg-card" style={{ borderLeft: '4px solid #ffc107' }}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <Card.Title className="h6 mb-1">
                                  {shift.fullName}
                                </Card.Title>
                                <div className="small text-muted mb-2">
                                  {formatDate(shift.shiftDate)}
                                </div>
                              </div>
                              <span className="badge bg-warning text-dark">
                                {shift.shiftType || "Other"}
                              </span>
                            </div>
                            
                            <div className="mb-3">
                              <p className="mb-1"><strong>Time:</strong> {shift.startTime || 'N/A'} - {shift.endTime || 'N/A'}</p>
                              {shift.notes && <p className="mb-0">{shift.notes}</p>}
                              {shift.otherType && (
                                <p className="mb-0"><strong>Type:</strong> {shift.otherType}</p>
                              )}
                              {shift.duration && (
                                <p className="mb-0"><strong>Duration:</strong> {shift.duration}</p>
                              )}
                              {shift.permissionApply && (
                                <p className="mb-0"><strong>Permission:</strong> {shift.permissionApply}</p>
                              )}
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="small">
                                <span className="text-muted">Status:</span> Pending
                              </div>
                              
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleShiftAction(shift.id, "reject")}
                                  disabled={loading}
                                  style={{ borderRadius: '4px', padding: '6px 10px' }}
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleShiftAction(shift.id, "approve")}
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
                </div>
              ) : (
                <div className="card bg-card">
                  <div className="card-body text-center py-4">
                    <p className="text-muted">No shift requests found for the selected type</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Reassign Requests */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-medium text-white">
                  Reassign Requests
                </h2>
              </div>
              
              {reassignRequests.length > 0 ? (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <Row xs={1} md={2} lg={3} className="g-3">
                    {reassignRequests.map((request) => (
                      <Col key={request.id}>
                        <Card className="h-100 bg-card" style={{ borderLeft: '4px solid #17a2b8' }}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <Card.Title className="h6 mb-1">
                                  Project #{request.project_id}
                                </Card.Title>
                                <div className="small  mb-2">
                                  Task #{request.task_id} • {formatDate(request.created_date)}
                                </div>
                              </div>
                              <span className="badge bg-info">
                                Reassign
                              </span>
                            </div>
                            
                            <div className="mb-3">
                              <p className="mb-1"><strong>Admin ID:</strong> {request.admin_id}</p>
                              <p className="mb-0">{request.reason}</p>
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="small">
                                <span className="">Status:</span> {request.status}
                              </div>
                              
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleReassignAction(request.id, "reject")}
                                  disabled={loading}
                                  style={{ borderRadius: '4px', padding: '6px 10px' }}
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleReassignAction(request.id, "approve")}
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
                </div>
              ) : (
                <div className="card bg-card">
                  <div className="card-body text-center py-4">
                    <p className="">No reassign requests found</p>
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
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Row xs={1} md={2} lg={3} className="g-3">
                  {actionHistory.map((action, index) => (
                    <Col key={`${action.id}-${index}`}>
                      <Card className="h-100 bg-card" style={{ 
                        borderLeft: action.actionType === "Approved" ? '4px solid #28a745' : '4px solid #dc3545' 
                      }}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <Card.Title className="h6 mb-1">
                                {action.requestType}
                                {action.projectId && ` (Project #${action.projectId})`}
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
              </div>
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