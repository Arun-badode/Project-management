import React, { useState } from 'react';

const App = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState('pending');

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        actionType: '',
        requestType: '',
        requestedBy: '',
        actionTakenBy: '',
        status: '',
        dateFrom: '',
        dateTo: '',
        sortOrder: 'latest'
    });

    // Mock data for pending approvals
    const pendingRequests = [
        {
            id: 1,
            type: 'Reassignment Request',
            requester: 'John Smith',
            requesterRole: 'Team Member',
            details: 'Request to reassign Project X to Sarah due to workload constraints',
            timestamp: '2025-06-24T14:30:00',
            category: 'team-to-manager'
        },
        {
            id: 2,
            type: 'Leave Approval',
            requester: 'Emily Johnson',
            requesterRole: 'Team Member',
            details: 'Annual leave request from July 10-15, 2025',
            timestamp: '2025-06-24T11:15:00',
            category: 'team-to-manager'
        },
        {
            id: 3,
            type: 'Actual Due Change',
            requester: 'Michael Chen',
            requesterRole: 'Manager',
            details: 'Request to extend Project Y deadline from July 1 to July 8',
            timestamp: '2025-06-23T16:45:00',
            category: 'manager-to-admin'
        },
        {
            id: 4,
            type: 'Resource Allocation',
            requester: 'Lisa Wong',
            requesterRole: 'Manager',
            details: 'Request for additional developer resources for Q3 project',
            timestamp: '2025-06-23T10:20:00',
            category: 'manager-to-admin'
        }
    ];

    // Mock data for action history
    const actionHistory = [
        {
            id: 101,
            actionType: 'Approved',
            requestType: 'Leave Approval',
            requester: 'David Miller',
            requesterRole: 'Team Member',
            actionTakenBy: 'Jennifer Lee',
            actionTakerRole: 'Manager',
            details: 'Approved 3-day leave request',
            timestamp: '2025-06-22T15:30:00'
        },
        {
            id: 102,
            actionType: 'Rejected',
            requestType: 'Budget Increase',
            requester: 'Robert Taylor',
            requesterRole: 'Manager',
            actionTakenBy: 'Amanda Harris',
            actionTakerRole: 'Admin',
            details: 'Rejected $5,000 budget increase for Marketing campaign',
            timestamp: '2025-06-21T14:45:00'
        },
        {
            id: 103,
            actionType: 'Submitted',
            requestType: 'Reassignment Request',
            requester: 'Sarah Johnson',
            requesterRole: 'Team Member',
            actionTakenBy: 'N/A',
            actionTakerRole: 'N/A',
            details: 'Submitted request to move from Project A to Project B',
            timestamp: '2025-06-21T11:20:00'
        },
        {
            id: 104,
            actionType: 'Approved',
            requestType: 'Actual Due Change',
            requester: 'Michael Chen',
            requesterRole: 'Manager',
            actionTakenBy: 'Amanda Harris',
            actionTakerRole: 'Admin',
            details: 'Approved deadline extension for Project Y',
            timestamp: '2025-06-20T16:10:00'
        }
    ];

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            actionType: '',
            requestType: '',
            requestedBy: '',
            actionTakenBy: '',
            status: '',
            dateFrom: '',
            dateTo: '',
            sortOrder: 'latest'
        });
    };

    // Handle approval/rejection
    const handleAction = (id, action) => {
        console.log(`Request ${id} ${action === 'approve' ? 'approved' : 'rejected'}`);
    };

    // Handle export
    const handleExport = (format) => {
        console.log(`Exporting data as ${format}`);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container-fluid bg-main">
            {/* Header */}
            <header className="bg-white shadow-sm bg-card">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center py-3">
                        <h2 className="h2 fw-bold  mb-0 gradient-heading">Action Center</h2>
                        <div className="d-flex gap-2">
                            <button
                                onClick={() => handleExport('csv')}
                                className="btn btn-outline-secondary d-flex align-items-center"
                            >
                                <i className="fas fa-file-csv me-2"></i>
                                Export CSV
                            </button>
                            <button
                                onClick={() => handleExport('pdf')}
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
                                className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pending')}
                            >
                                Pending Approval
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                                onClick={() => setActiveTab('history')}
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
                            <i className={`fas fa-filter me-2 ${showFilters ? 'text-primary' : ''}`}></i>
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                        <div className="text-white small">
                            {activeTab === 'pending' ? `${pendingRequests.length} pending requests` : `${actionHistory.length} history records`}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="card mb-4 bg-card">
                            <div className="card-body ">
                                <div className="row g-3">
                                    <div className="col-md-6 col-lg-4">
                                        <label htmlFor="actionType" className="form-label">Action Type</label>
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
                                        <label htmlFor="requestType" className="form-label">Request Type</label>
                                        <select
                                            id="requestType"
                                            name="requestType"
                                            value={filters.requestType}
                                            onChange={handleFilterChange}
                                            className="form-select"
                                        >
                                            <option value="">All Requests</option>
                                            <option value="reassignment">Reassignment</option>
                                            <option value="leave">Leave Request</option>
                                            <option value="due-change">Actual Due Change</option>
                                            <option value="resource">Resource Allocation</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 col-lg-4">
                                        <label htmlFor="requestedBy" className="form-label">Requested By</label>
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
                                        <label htmlFor="actionTakenBy" className="form-label">Action Taken By</label>
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
                                        <label htmlFor="status" className="form-label">Status</label>
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
                                                <label htmlFor="dateFrom" className="form-label">From Date</label>
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
                                                <label htmlFor="dateTo" className="form-label">To Date</label>
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
                {activeTab === 'pending' ? (
                    <div>
                        {/* Team to Manager Requests */}
                        <div className="mb-5">
                            <h2 className="h5 fw-medium mb-3 text-white">Team to Manager Requests</h2>
                            <div className="row g-3">
                                {pendingRequests
                                    .filter(request => request.category === 'team-to-manager')
                                    .map(request => (
                                        <div key={request.id} className="col-12">
                                            <div className="card bg-card">
                                                <div className="card-body ">
                                                    <div className="d-flex flex-column flex-md-row justify-content-between">
                                                        <div className="mb-3 mb-md-0">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <span className="badge bg-warning text-dark me-2">
                                                                    {request.type}
                                                                </span>
                                                                <span className=" small">
                                                                    {formatDate(request.timestamp)}
                                                                </span>
                                                            </div>
                                                            <h3 className="h6 fw-medium mb-1">
                                                                {request.requester} <span className="">({request.requesterRole})</span>
                                                            </h3>
                                                            <p className="mb-0 ">{request.details}</p>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                onClick={() => handleAction(request.id, 'reject')}
                                                                className="btn btn-outline-danger d-flex align-items-center"
                                                                style={{ height: "45px", marginTop: "20px" }}
                                                            >
                                                                <i className="fas fa-times me-2"></i>
                                                                Reject
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(request.id, 'approve')}
                                                                className="btn btn-success d-flex align-items-center"
                                                                style={{ height: "45px", marginTop: "20px" }}
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

                        {/* Manager to Admin Requests */}
                        <div>
                            <h2 className="h5 fw-medium mb-3 text-white">Manager to Admin Requests</h2>
                            <div className="row g-3">
                                {pendingRequests
                                    .filter(request => request.category === 'manager-to-admin')
                                    .map(request => (
                                        <div key={request.id} className="col-12">
                                            <div className="card bg-card">
                                                <div className="card-body">
                                                    <div className="d-flex flex-column flex-md-row justify-content-between">
                                                        <div className="mb-3 mb-md-0">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <span className="badge bg-purple text-white me-2">
                                                                    {request.type}
                                                                </span>
                                                                <span className=" small">
                                                                    {formatDate(request.timestamp)}
                                                                </span>
                                                            </div>
                                                            <h3 className="h6 fw-medium mb-1">
                                                                {request.requester} <span className="">({request.requesterRole})</span>
                                                            </h3>
                                                            <p className="mb-0 ">{request.details}</p>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                onClick={() => handleAction(request.id, 'reject')}
                                                                className="btn btn-outline-danger d-flex align-items-center"
                                                                style={{ height: "45px", marginTop: "20px" }}
                                                            >
                                                                <i className="fas fa-times me-2"></i>
                                                                Reject
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(request.id, 'approve')}
                                                                className="btn btn-success d-flex align-items-center"
                                                                style={{ height: "45px", marginTop: "20px" }}
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
                    <div className="card ">
                        <div className="list-group list-group-flush">
                            {actionHistory.map(action => (
                                <div key={action.id} className="list-group-item list-group-item-action bg-card">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-3">
                                            {action.actionType === 'Approved' && (
                                                <div className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle" style={{ width: '40px', height: '40px' }}>
                                                    <i className="fas fa-check text-success"></i>
                                                </div>
                                            )}
                                            {action.actionType === 'Rejected' && (
                                                <div className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle" style={{ width: '40px', height: '40px' }}>
                                                    <i className="fas fa-times text-danger"></i>
                                                </div>
                                            )}
                                            {action.actionType === 'Submitted' && (
                                                <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle" style={{ width: '40px', height: '40px' }}>
                                                    <i className="fas fa-paper-plane text-primary"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex flex-column flex-md-row justify-content-between mb-1">
                                                <h3 className="h6 fw-medium mb-1 mb-md-0 text-white">
                                                    {action.actionType} - {action.requestType}
                                                </h3>
                                                <span className=" small">
                                                    {formatDate(action.timestamp)}
                                                </span>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2 small  mb-2">
                                                <span>
                                                    <span className="fw-medium">Requested by:</span> {action.requester} ({action.requesterRole})
                                                </span>
                                                {action.actionType !== 'Submitted' && (
                                                    <span>
                                                        <span className="fw-medium">Action by:</span> {action.actionTakenBy} ({action.actionTakerRole})
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mb-0 ">{action.details}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
