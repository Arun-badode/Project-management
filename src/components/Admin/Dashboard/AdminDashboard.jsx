import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

// Mock data for the dashboard
const mockProjects = [
  {
    id: 1,
    title: 'Website Redesign',
    client: 'Acme Corp',
    tasks: ['Design', 'Development', 'Content'],
    languages: 3,
    platform: 'Web',
    totalPages: 15,
    actualDueDate: '2023-12-15 17:00',
    qcReadyDeadline: '2023-12-10 17:00',
    qcAllocatedHrs: 8,
    qcDueDate: '2023-12-12 17:00',
    status: 'In Progress',
    assignedHandler: 'John Doe',
    processStatus: 'Development',
    qaReviewer: 'Jane Smith',
    qaStatus: 'Pending',
    serverPath: '/projects/acme-redesign',
    files: [
      { name: 'homepage.html', assignedTo: 'Dev 1', status: 'In Progress', lastUpdated: '2023-11-20 14:30' },
      { name: 'products.html', assignedTo: 'Dev 2', status: 'Not Started', lastUpdated: '' },
      { name: 'styles.css', assignedTo: 'Designer 1', status: 'Completed', lastUpdated: '2023-11-18 11:15' }
    ]
  },
  // More projects...
];

const AdminDashboard = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [expandedProject, setExpandedProject] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'actualDueDate', direction: 'asc' });
  const [filters, setFilters] = useState({
    client: '',
    platform: '',
    pagesMin: '',
    pagesMax: '',
    qcReadyFrom: '',
    qcReadyTo: '',
    assignedHandler: '',
    qaReviewer: '',
    status: [],
    availability: ''
  });

  // Calculate KPIs
  const totalActiveProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalResources = 24; // This would come from actual resource data
  const projectsNearingDeadline = projects.filter(p => {
    const deadline = new Date(p.actualDueDate);
    const today = new Date();
    const diffDays = (deadline - today) / (1000 * 60 * 60 * 24);
    return diffDays <= 7 && diffDays > 0 && p.status !== 'Completed';
  }).length;
  const overdueProjects = projects.filter(p => {
    const deadline = new Date(p.actualDueDate);
    const today = new Date();
    return deadline < today && p.status !== 'Completed';
  }).length;

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Toggle project expansion
  const toggleExpandProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  // Apply sorting and filtering
  const getFilteredAndSortedProjects = () => {
    let filtered = [...projects];
    
    // Apply filters
    if (filters.client) {
      filtered = filtered.filter(p => p.client.toLowerCase().includes(filters.client.toLowerCase()));
    }
    if (filters.platform) {
      filtered = filtered.filter(p => p.platform === filters.platform);
    }
    if (filters.pagesMin) {
      filtered = filtered.filter(p => p.totalPages >= parseInt(filters.pagesMin));
    }
    if (filters.pagesMax) {
      filtered = filtered.filter(p => p.totalPages <= parseInt(filters.pagesMax));
    }
    // Add more filters as needed...

    // Apply sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* KPI Section */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h3>Total Active Projects</h3>
          <p>{totalActiveProjects}</p>
        </div>
        <div className="kpi-card">
          <h3>Total Resources</h3>
          <p>{totalResources}</p>
        </div>
        <div className="kpi-card">
          <h3>Projects Nearing Deadline</h3>
          <p>{projectsNearingDeadline}</p>
        </div>
        <div className="kpi-card">
          <h3>Overdue Projects</h3>
          <p>{overdueProjects}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <h2>Filters</h2>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Client:</label>
            <input 
              type="text" 
              value={filters.client}
              onChange={(e) => handleFilterChange('client', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Platform:</label>
            <select 
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
            >
              <option value="">All</option>
              <option value="Web">Web</option>
              <option value="Mobile">Mobile</option>
              <option value="Desktop">Desktop</option>
            </select>
          </div>
          {/* Add more filter controls as needed */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn-primary">Create New Project</button>
        <button className="btn-secondary">Export Data</button>
      </div>

      {/* Projects Table */}
      <div className="projects-table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Project Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('client')}>
                Client {sortConfig.key === 'client' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Tasks</th>
              <th onClick={() => handleSort('languages')}>
                Languages {sortConfig.key === 'languages' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('platform')}>
                Platform {sortConfig.key === 'platform' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              {/* Add more columns as needed */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredAndSortedProjects().map(project => (
              <React.Fragment key={project.id}>
                <tr>
                  <td>{project.title}</td>
                  <td>{project.client}</td>
                  <td>{project.tasks.join(', ')}</td>
                  <td>{project.languages}</td>
                  <td>{project.platform}</td>
                  {/* Add more cells as needed */}
                  <td>
                    <button 
                      className="expand-btn"
                      onClick={() => toggleExpandProject(project.id)}
                    >
                      {expandedProject === project.id ? '−' : '+'}
                    </button>
                  </td>
                </tr>
                {expandedProject === project.id && (
                  <tr className="expanded-row">
                    <td colSpan="100%">
                      <div className="project-details">
                        <h4>Project Details</h4>
                        <div className="detail-grid">
                          <div>
                            <strong>Actual Due:</strong> {project.actualDueDate}
                          </div>
                          <div>
                            <strong>QC Ready Deadline:</strong> {project.qcReadyDeadline}
                          </div>
                          {/* Add more details as needed */}
                        </div>
                        
                        <h4>Files</h4>
                        <table className="files-table">
                          <thead>
                            <tr>
                              <th>File Name</th>
                              <th>Assigned To</th>
                              <th>Status</th>
                              <th>Last Updated</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {project.files.map(file => (
                              <tr key={file.name}>
                                <td>{file.name}</td>
                                <td>
                                  <select defaultValue={file.assignedTo}>
                                    <option>Dev 1</option>
                                    <option>Dev 2</option>
                                    <option>Designer 1</option>
                                  </select>
                                </td>
                                <td>
                                  <select defaultValue={file.status}>
                                    <option>Not Started</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                  </select>
                                </td>
                                <td>{file.lastUpdated || 'N/A'}</td>
                                <td>
                                  <button className="btn-small">Save</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;