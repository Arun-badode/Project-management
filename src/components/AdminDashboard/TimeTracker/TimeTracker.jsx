import React, { useState, useMemo } from 'react';
import {
    Calendar,
    Download,
    Filter,
    X,
    ChevronDown,
    Clock,
    Users,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    FileText,
    BarChart3
} from 'lucide-react';

const TimeTracker = () => {
    // Sample data
    const [timeEntries] = useState([
        { id: 1, user: 'John Doe', project: 'Website Redesign', task: 'Homepage Layout', date: '2025-06-17', startTime: '09:00', endTime: '17:00', totalHours: 8, status: 'Billable' },
        { id: 2, user: 'Sarah Smith', project: 'Mobile App', task: 'UI Components', date: '2025-06-17', startTime: '10:00', endTime: '18:30', totalHours: 8.5, status: 'Billable' },
        { id: 3, user: 'Mike Johnson', project: 'API Development', task: 'Authentication', date: '2025-06-16', startTime: '08:30', endTime: '16:30', totalHours: 8, status: 'Billable' },
        { id: 4, user: 'Emily Davis', project: 'Website Redesign', task: 'Testing', date: '2025-06-16', startTime: '09:00', endTime: '17:30', totalHours: 8.5, status: 'Non-billable' },
        { id: 5, user: 'John Doe', project: 'Mobile App', task: 'Bug Fixes', date: '2025-06-15', startTime: '13:00', endTime: '18:00', totalHours: 5, status: 'Billable' },
        { id: 6, user: 'Sarah Smith', project: 'Training', task: 'Team Meeting', date: '2025-06-15', startTime: '14:00', endTime: '16:00', totalHours: 2, status: 'Non-billable' },
        { id: 7, user: 'Mike Johnson', project: 'API Development', task: 'Database Setup', date: '2025-06-14', startTime: '09:00', endTime: '12:00', totalHours: 3, status: 'Billable' },
        { id: 8, user: 'Emily Davis', project: 'Documentation', task: 'User Manual', date: '2025-06-14', startTime: '10:00', endTime: '15:00', totalHours: 5, status: 'Non-billable' }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Filter states
    const [filters, setFilters] = useState({
        users: [],
        projects: [],
        dateRange: { start: '', end: '' }
    });

    const [activeFilters, setActiveFilters] = useState([]);

    // Get unique values for filters
    const uniqueUsers = [...new Set(timeEntries.map(entry => entry.user))];
    const uniqueProjects = [...new Set(timeEntries.map(entry => entry.project))];

    // Filter and sort data
    const filteredData = useMemo(() => {
        let filtered = timeEntries.filter(entry => {
            const userMatch = filters.users.length === 0 || filters.users.includes(entry.user);
            const projectMatch = filters.projects.length === 0 || filters.projects.includes(entry.project);

            let dateMatch = true;
            if (filters.dateRange.start && filters.dateRange.end) {
                const entryDate = new Date(entry.date);
                const startDate = new Date(filters.dateRange.start);
                const endDate = new Date(filters.dateRange.end);
                dateMatch = entryDate >= startDate && entryDate <= endDate;
            }

            return userMatch && projectMatch && dateMatch;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [timeEntries, filters, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Summary calculations
    const summaryData = useMemo(() => {
        const totalHours = filteredData.reduce((sum, entry) => sum + entry.totalHours, 0);
        const avgDailyHours = totalHours / (filteredData.length || 1);

        const userHours = filteredData.reduce((acc, entry) => {
            acc[entry.user] = (acc[entry.user] || 0) + entry.totalHours;
            return acc;
        }, {});

        const topContributor = Object.keys(userHours).reduce((a, b) =>
            userHours[a] > userHours[b] ? a : b, Object.keys(userHours)[0] || 'N/A'
        );

        const projectHours = filteredData.reduce((acc, entry) => {
            acc[entry.project] = (acc[entry.project] || 0) + entry.totalHours;
            return acc;
        }, {});

        const leastActiveProject = Object.keys(projectHours).reduce((a, b) =>
            projectHours[a] < projectHours[b] ? a : b, Object.keys(projectHours)[0] || 'N/A'
        );

        return {
            totalHours: totalHours.toFixed(1),
            avgDailyHours: avgDailyHours.toFixed(1),
            topContributor,
            leastActiveProject,
            userHours,
            projectHours
        };
    }, [filteredData]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const applyFilters = () => {
        const newActiveFilters = [];

        if (filters.users.length > 0) {
            newActiveFilters.push(...filters.users.map(user => ({ type: 'user', value: user })));
        }
        if (filters.projects.length > 0) {
            newActiveFilters.push(...filters.projects.map(project => ({ type: 'project', value: project })));
        }
        if (filters.dateRange.start && filters.dateRange.end) {
            newActiveFilters.push({
                type: 'dateRange',
                value: `${filters.dateRange.start} to ${filters.dateRange.end}`
            });
        }

        setActiveFilters(newActiveFilters);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            users: [],
            projects: [],
            dateRange: { start: '', end: '' }
        });
        setActiveFilters([]);
        setCurrentPage(1);
    };

    const removeFilter = (index) => {
        const newActiveFilters = [...activeFilters];
        const removedFilter = newActiveFilters.splice(index, 1)[0];

        if (removedFilter.type === 'user') {
            setFilters(prev => ({
                ...prev,
                users: prev.users.filter(user => user !== removedFilter.value)
            }));
        } else if (removedFilter.type === 'project') {
            setFilters(prev => ({
                ...prev,
                projects: prev.projects.filter(project => project !== removedFilter.value)
            }));
        } else if (removedFilter.type === 'dateRange') {
            setFilters(prev => ({
                ...prev,
                dateRange: { start: '', end: '' }
            }));
        }

        setActiveFilters(newActiveFilters);
    };

    const handleExport = (format) => {
        setToastMessage(`Time logs exported successfully as ${format.toUpperCase()}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const getStatusBadgeClass = (status) => {
        return status === 'Billable'
            ? 'tt-badge-billable badge bg-success'
            : 'tt-badge-nonbillable badge bg-secondary';
    };

    const isLongHours = (hours) => hours > 8;
    const isOverdue = (date) => {
        const today = new Date();
        const entryDate = new Date(date);
        const diffTime = today - entryDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 7;
    };

    return (
        <div className="tt-dashboard-container bg-main container-fluid p-4 bg-light min-vh-100">
            {/* Toast Notification */}
            {showToast && (
                <div className="tt-toast-notification position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
                    <div className="toast show bg-success text-white">
                        <div className="toast-body d-flex align-items-center">
                            <CheckCircle size={20} className="me-2" />
                            {toastMessage}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="tt-header-section row mb-4">
                <div className="col-12">
                    <h1 className="gradient-heading ">
                        Time Tracking Dashboard
                    </h1>
                    <p className="tt-subtitle text-white mb-3">Monitor and analyze team productivity</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="tt-summary-section row mb-4">
                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="tt-summary-card bg-card card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="tt-card-header d-flex justify-content-between align-items-center mb-2">
                                <h6 className="tt-card-title text-white mb-0">Total Hours Logged</h6>
                                <Clock size={20} className="text-primary" />
                            </div>
                            <div className="tt-card-value h3 text-primary fw-bold">{summaryData.totalHours}h</div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="tt-summary-card card bg-card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="tt-card-header d-flex justify-content-between align-items-center mb-2">
                                <h6 className="tt-card-title text-white mb-0">Avg Daily Hours</h6>
                                <TrendingUp size={20} className="text-success" />
                            </div>
                            <div className="tt-card-value h3 text-success fw-bold">{summaryData.avgDailyHours}h</div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="tt-summary-card card h-100 bg-card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="tt-card-header d-flex justify-content-between align-items-center mb-2">
                                <h6 className="tt-card-title text-white mb-0">Top Contributor</h6>
                                <Users size={20} className="text-info" />
                            </div>
                            <div className="tt-card-value h6  fw-bold">{summaryData.topContributor}</div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="tt-summary-card card h-100 bg-card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="tt-card-header d-flex justify-content-between align-items-center mb-2">
                                <h6 className="tt-card-title text-white mb-0">Least Active Project</h6>
                                <AlertCircle size={20} className="text-warning" />
                            </div>
                            <div className="tt-card-value h6  fw-bold">{summaryData.leastActiveProject}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="tt-charts-section  row mb-4">
                <div className="col-lg-6  mb-3">
                    <div className="tt-chart-card   card border-0 shadow-sm">
                        <div className="card-header  bg-card border-0">
                            <h6 className="tt-chart-title  mb-0 d-flex align-items-center">
                                <BarChart3 size={20} className="me-2 text-primary" />
                                Hours by Team Member
                            </h6>
                        </div>
                        <div className="card-body  bg-card">
                            <div className="tt-chart-placeholder bg-card bg-light rounded p-4 text-center">
                                {Object.entries(summaryData.userHours).map(([user, hours], index) => (
                                    <div key={user} className="tt-chart-bar mb-2">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="tt-chart-label small">{user}</span>
                                            <span className="tt-chart-value badge bg-primary">{hours}h</span>
                                        </div>
                                        <div className="tt-progress-bar progress" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar bg-primary"
                                                style={{ width: `${(hours / Math.max(...Object.values(summaryData.userHours))) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-3">
                    <div className="tt-chart-card bg-card card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 bg-card">
                            <h6 className="tt-chart-title mb-0 d-flex align-items-center">
                                <BarChart3 size={20} className="me-2 text-success" />
                                Project Distribution
                            </h6>
                        </div>
                        <div className="card-body ">
                            <div className="tt-chart-placeholder bg-card rounded p-4 text-center">
                                {Object.entries(summaryData.projectHours).map(([project, hours]) => (
                                    <div key={project} className="tt-chart-bar mb-2">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="tt-chart-label small">{project}</span>
                                            <span className="tt-chart-value badge bg-success">{hours}h</span>
                                        </div>
                                        <div className="tt-progress-bar progress" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar bg-success"
                                                style={{ width: `${(hours / Math.max(...Object.values(summaryData.projectHours))) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Export Section */}
            <div className="tt-controls-section row mb-4">
                <div className="col-12">
                    <div className="tt-controls-card card border-0 shadow-sm">
                        <div className="card-body bg-card">
                            <div className="row align-items-end">
                                {/* Filters */}
                                <div className="col-lg-8 col-md-12 mb-3 mb-lg-0">
                                    <div className="row">
                                        <div className="col-md-3 mb-2">
                                            <label className="tt-filter-label form-label small text-white">Users</label>
                                            <select
                                                className="tt-filter-select form-select form-select-sm"
                                                multiple
                                                value={filters.users}
                                                onChange={(e) => handleFilterChange('users', Array.from(e.target.selectedOptions, option => option.value))}
                                            >
                                                {uniqueUsers.map(user => (
                                                    <option key={user} value={user}>{user}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-3 mb-2">
                                            <label className="tt-filter-label form-label small text-white">Projects</label>
                                            <select
                                                className="tt-filter-select form-select form-select-sm"
                                                multiple
                                                value={filters.projects}
                                                onChange={(e) => handleFilterChange('projects', Array.from(e.target.selectedOptions, option => option.value))}
                                            >
                                                {uniqueProjects.map(project => (
                                                    <option key={project} value={project}>{project}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-3 mb-2">
                                            <label className="tt-filter-label form-label small text-white">Start Date</label>
                                            <input
                                                type="date"
                                                className="tt-date-input form-control form-control-sm"
                                                value={filters.dateRange.start}
                                                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-md-3 mb-2">
                                            <label className="tt-filter-label form-label small text-white">End Date</label>
                                            <input
                                                type="date"
                                                className="tt-date-input form-control form-control-sm"
                                                value={filters.dateRange.end}
                                                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="tt-filter-buttons mt-2">
                                        <button className="tt-apply-btn btn btn-primary btn-sm me-2" onClick={applyFilters}>
                                            <Filter size={16} className="me-1" />
                                            Apply Filters
                                        </button>
                                        <button className="tt-clear-btn btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                                            Clear All
                                        </button>
                                    </div>
                                </div>

                                {/* Export */}
                                <div className="col-lg-4 col-md-12">
                                    <div className="tt-export-section d-flex justify-content-lg-end">
                                        <div className="dropdown">
                                            <button
                                                className="tt-export-btn btn btn-success dropdown-toggle"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                            >
                                                <Download size={16} className="me-1" />
                                                Export Data
                                            </button>
                                            <ul className="tt-export-menu dropdown-menu">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => handleExport('excel')}>
                                                        <FileText size={16} className="me-2" />
                                                        Export as Excel
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => handleExport('pdf')}>
                                                        <FileText size={16} className="me-2" />
                                                        Export as PDF
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
                <div className="tt-active-filters-section row mb-3">
                    <div className="col-12">
                        <div className="tt-filter-tags d-flex flex-wrap gap-2">
                            <span className="tt-filters-label small text-muted me-2">Active Filters:</span>
                            {activeFilters.map((filter, index) => (
                                <span key={index} className="tt-filter-tag badge bg-light text-dark border">
                                    {filter.value}
                                    <button
                                        className="tt-remove-filter btn-close btn-close-sm ms-1"
                                        onClick={() => removeFilter(index)}
                                        style={{ fontSize: '0.6em' }}
                                    ></button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Time Log Table */}
            <div className="tt-table-section bg-card  row">
                <div className="col-12 ">
                    <div className="tt-table-card bg-card  card border-0 shadow-sm">
                        <div className="card-header  border-0">
                            <h6 className="tt-table-title  mb-0">Time Entries ({filteredData.length} records)</h6>
                        </div>
                        <div className="card-body  p-0">
                            <div className="tt-table-responsive  table-responsive">
                                <table className="tt-data-table table table-gradient-bg table-hover mb-0">
  <thead className="tt-table-header">
    <tr>
      <th>ID</th>
      <th
        className="tt-sortable-header"
        onClick={() => handleSort('user')}
        style={{ cursor: 'pointer' }}
      >
        User
        {sortConfig.key === 'user' && (
          <ChevronDown
            size={16}
            className={`ms-1 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
          />
        )}
      </th>
      <th
        className="tt-sortable-header d-none d-md-table-cell"
        onClick={() => handleSort('project')}
        style={{ cursor: 'pointer' }}
      >
        Project
        {sortConfig.key === 'project' && (
          <ChevronDown
            size={16}
            className={`ms-1 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
          />
        )}
      </th>
      <th className="tt-task-header d-none d-lg-table-cell">Task</th>
      <th
        className="tt-sortable-header"
        onClick={() => handleSort('date')}
        style={{ cursor: 'pointer' }}
      >
        Date
        {sortConfig.key === 'date' && (
          <ChevronDown
            size={16}
            className={`ms-1 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
          />
        )}
      </th>
      <th className="tt-time-header d-none d-md-table-cell">Time</th>
      <th
        className="tt-sortable-header"
        onClick={() => handleSort('totalHours')}
        style={{ cursor: 'pointer' }}
      >
        Hours
        {sortConfig.key === 'totalHours' && (
          <ChevronDown
            size={16}
            className={`ms-1 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
          />
        )}
      </th>
      <th className="tt-status-header">Status</th>
    </tr>
  </thead>
  <tbody>
    {currentData.map(entry => (
      <tr
        key={entry.id}
        className={`tt-table-row ${isOverdue(entry.date) ? 'tt-overdue-row table-warning' : ''} ${isLongHours(entry.totalHours) ? 'tt-long-hours-row' : ''}`}
      >
        <td>{entry.id}</td>
        <td className="tt-user-cell">
          <div className="tt-user-info">
            <div className="tt-user-name fw-medium">{entry.user}</div>
            <small className="tt-mobile-info d-md-none text-white">
              {entry.project} • {entry.task}
            </small>
          </div>
        </td>
        <td className="tt-project-cell d-none d-md-table-cell">{entry.project}</td>
        <td className="tt-task-cell d-none d-lg-table-cell">{entry.task}</td>
        <td className="tt-date-cell">
          <div className="tt-date-display">
            {new Date(entry.date).toLocaleDateString()}
            {isOverdue(entry.date) && (
              <AlertCircle size={14} className="tt-overdue-icon text-warning ms-1" />
            )}
          </div>
        </td>
        <td className="tt-time-cell d-none d-md-table-cell">
          <small className="tt-time-range ">
            {entry.startTime} - {entry.endTime}
          </small>
        </td>
        <td className="tt-hours-cell">
          <span className={`tt-hours-badge badge ${isLongHours(entry.totalHours) ? 'bg-warning text-dark' : 'bg-light text-dark'}`}>
            {entry.totalHours}h
          </span>
        </td>
        <td className="tt-status-cell">
          <span className={getStatusBadgeClass(entry.status)}>
            {entry.status}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table> 
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="tt-pagination-section d-flex justify-content-between align-items-center p-3 border-top">
                                    <div className="tt-pagination-info">
                                        <small className="text-white">
                                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                                        </small>
                                    </div>
                                    <nav className="tt-pagination-nav">
                                        <ul className="pagination pagination-sm mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, index) => (
                                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
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
        </div>
    );
};

export default TimeTracker;