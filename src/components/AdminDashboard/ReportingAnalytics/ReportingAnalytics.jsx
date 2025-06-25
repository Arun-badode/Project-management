import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Download, Filter, Search, Calendar, Users, TrendingUp, Clock, Target, Settings } from 'lucide-react';

const ReportingAnalytics = () => {
  const [activeReportTab, setActiveReportTab] = useState('project-status');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [productivityView, setProductivityView] = useState('daily');

  // Mock data
  const projectData = [
    { id: 1, name: 'Website Redesign', owner: 'John Doe', progress: 85, status: 'On Track', priority: 'High', dueDate: '2025-07-15' },
    { id: 2, name: 'Mobile App Development', owner: 'Jane Smith', progress: 45, status: 'Delayed', priority: 'Critical', dueDate: '2025-06-30' },
    { id: 3, name: 'Database Migration', owner: 'Mike Johnson', progress: 100, status: 'Completed', priority: 'Medium', dueDate: '2025-06-10' },
    { id: 4, name: 'API Integration', owner: 'Sarah Wilson', progress: 70, status: 'On Track', priority: 'High', dueDate: '2025-07-20' },
    { id: 5, name: 'Security Audit', owner: 'David Brown', progress: 25, status: 'Delayed', priority: 'Critical', dueDate: '2025-06-25' },
        
    
  ];

  const workloadData = [
    { date: '2025-06-01', tasks: 25, hours: 180 },
    { date: '2025-06-02', tasks: 30, hours: 220 },
    { date: '2025-06-03', tasks: 28, hours: 200 },
    { date: '2025-06-04', tasks: 35, hours: 250 },
    { date: '2025-06-05', tasks: 32, hours: 240 },
    { date: '2025-06-06', tasks: 22, hours: 160 },
    { date: '2025-06-07', tasks: 18, hours: 130 }
  ];

  const teamPerformanceData = [
    { name: 'John Doe', completedTasks: 48, onTimePercentage: 92, hoursLogged: 160, role: 'Frontend Developer', performance: 'Top Performer' },
    { name: 'Jane Smith', completedTasks: 42, onTimePercentage: 88, hoursLogged: 155, role: 'Full Stack Developer', performance: 'High Performer' },
    { name: 'Mike Johnson', completedTasks: 35, onTimePercentage: 85, hoursLogged: 140, role: 'Backend Developer', performance: 'Good Performer' },
    { name: 'Sarah Wilson', completedTasks: 38, onTimePercentage: 90, hoursLogged: 150, role: 'UI/UX Designer', performance: 'High Performer' },
    { name: 'David Brown', completedTasks: 30, onTimePercentage: 78, hoursLogged: 135, role: 'DevOps Engineer', performance: 'Average Performer' },
    
  ];

  const missedDeadlineData = [
    { taskName: 'User Authentication', assignedTo: 'Jane Smith', dueDate: '2025-06-15', delayDays: 5, comments: 'Complexity underestimated' },
    { taskName: 'Payment Gateway', assignedTo: 'Mike Johnson', dueDate: '2025-06-12', delayDays: 8, comments: 'Third-party integration issues' },
    { taskName: 'Admin Dashboard', assignedTo: 'David Brown', dueDate: '2025-06-10', delayDays: 10, comments: 'Resource allocation conflicts' },
    { taskName: 'Email Templates', assignedTo: 'Sarah Wilson', dueDate: '2025-06-08', delayDays: 12, comments: 'Client feedback delays' }
  ];

  const productivityData = [
    { date: '2025-06-10', productivity: 85, billable: 70, nonBillable: 15 },
    { date: '2025-06-11', productivity: 92, billable: 75, nonBillable: 17 },
    { date: '2025-06-12', productivity: 78, billable: 65, nonBillable: 13 },
    { date: '2025-06-13', productivity: 88, billable: 72, nonBillable: 16 },
    { date: '2025-06-14', productivity: 95, billable: 80, nonBillable: 15 },
    { date: '2025-06-15', productivity: 82, billable: 68, nonBillable: 14 },
    { date: '2025-06-16', productivity: 90, billable: 76, nonBillable: 14 }
  ];

  const radarData = [
    { subject: 'Quality', A: 120, B: 110, fullMark: 150 },
    { subject: 'Speed', A: 98, B: 130, fullMark: 150 },
    { subject: 'Collaboration', A: 86, B: 130, fullMark: 150 },
    { subject: 'Innovation', A: 99, B: 100, fullMark: 150 },
    { subject: 'Communication', A: 85, B: 90, fullMark: 150 },
    { subject: 'Problem Solving', A: 65, B: 85, fullMark: 150 }
  ];

  const pieData = [
    { name: 'Billable', value: 75, color: '#0d6efd' },
    { name: 'Non-Billable', value: 25, color: '#6c757d' }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'On Track': return 'badge bg-success analytics-badge-success';
      case 'Delayed': return 'badge bg-danger analytics-badge-danger';
      case 'Completed': return 'badge bg-primary analytics-badge-primary';
      default: return 'badge bg-secondary analytics-badge-secondary';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'badge bg-danger analytics-priority-critical';
      case 'High': return 'badge bg-warning analytics-priority-high';
      case 'Medium': return 'badge bg-info analytics-priority-medium';
      case 'Low': return 'badge bg-light text-dark analytics-priority-low';
      default: return 'badge bg-secondary analytics-priority-default';
    }
  };

  const getPerformanceBadge = (performance) => {
    switch (performance) {
      case 'Top Performer': return <span className="badge bg-success analytics-performance-top">⭐ Top Performer</span>;
      case 'High Performer': return <span className="badge bg-primary analytics-performance-high">🏆 High Performer</span>;
      case 'Good Performer': return <span className="badge bg-info analytics-performance-good">👍 Good Performer</span>;
      default: return <span className="badge bg-secondary analytics-performance-average">📊 Average Performer</span>;
    }
  };

  const exportToPDF = () => {
    alert('Exporting to PDF...');
  };

  const exportToExcel = () => {
    alert('Exporting to Excel...');
  };

  const renderProjectStatusReport = () => (
    <div className=" bg-card ">
      <div className="d-flex justify-content-between   align-items-center mb-4 bg-card">
        <h4 className="analytics-report-title gradient-heading">Project Status Report</h4>
        <div className="analytics-export-buttons">
          <button className="btn btn-outline-primary btn-sm me-2 analytics-export-btn" onClick={exportToPDF}>
            <Download size={16} className="me-1" /> PDF
          </button>
          <button className="btn btn-outline-success btn-sm analytics-export-btn" onClick={exportToExcel}>
            <Download size={16} className="me-1" /> Excel
          </button>
        </div>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-4">
          <select className="form-select analytics-filter-select mb-1">
            <option>All Owners</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
            <option>Mike Johnson</option>
          </select>
        </div>
        <div className="col-md-4 ">
          <select className="form-select  analytics-filter-select mb-1 ">
            <option>All Priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select analytics-filter-select">
            <option>All Status</option>
            <option>On Track</option>
            <option>Delayed</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

    <div
  className="table-responsive"
    style={{ maxHeight: "400px", overflowY: "auto" }}
>
  <table className="table text-white analytics-project-table table-gradient-bg table-hover table-bordered mb-0">
    <thead className="table-light bg-dark sticky-top">
      <tr>
        <th>ID</th>
        <th>Project Name</th>
        <th>Owner</th>
        <th>Progress</th>
        <th>Status</th>
        <th>Priority</th>
        <th>Due Date</th>
      </tr>
    </thead>
    <tbody>
      {projectData.map(project => (
        <tr key={project.id} className="analytics-project-row">
          <td>{project.id}</td>
          <td className="text-dark analytics-project-name">{project.name}</td>
          <td>{project.owner}</td>
          <td>
            <div className="progress analytics-progress-bar" style={{ height: '20px' }}>
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

  const renderWorkloadReport = () => (
    <div className="analytics-report-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="analytics-report-title gradient-heading">Monthly Workload Report</h4>
        <div className="analytics-workload-controls">
          <select className="form-select d-inline-block me-2 analytics-date-selector" style={{width: 'auto'}}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
          <select className="form-select d-inline-block analytics-team-selector" style={{width: 'auto'}}>
            <option>All Teams</option>
            <option>Development</option>
            <option>Design</option>
            <option>QA</option>
          </select>
        </div>
      </div>

      <div className="row mb-4 ">
        <div className="col-md-3">
          <div className="card analytics-summary-card bg-card text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Avg Daily Tasks</h5>
              <h2 className="analytics-summary-number">28.5</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card analytics-summary-card bg-card text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Max Hours</h5>
              <h2 className="analytics-summary-number">250</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card analytics-summary-card bg-card text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Peak Day</h5>
              <h2 className="analytics-summary-number">Jun 4</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card analytics-summary-card bg-card text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Total Tasks</h5>
              <h2 className="analytics-summary-number">190</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-chart-container bg-main">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workloadData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" fill="#0d6efd" name="Tasks" />
            <Bar dataKey="hours" fill="#6c757d" name="Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderTeamPerformanceReport = () => (
    <div className="analytics-report-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="analytics-report-title gradient-heading">Team Performance Report</h4>
        <div className="analytics-performance-filters">
          <select className="form-select d-inline-block me-2 analytics-role-filter" style={{width: 'auto'}}>
            <option>All Roles</option>
            <option>Developer</option>
            <option>Designer</option>
            <option>DevOps</option>
          </select>
          <select className="form-select d-inline-block analytics-department-filter" style={{width: 'auto'}}>
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>Operations</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="table-responsive"
    style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table analytics-performance-table table-gradient-bg">
  <thead className="text-white bg-dark  sticky-top">
    <tr>
      <th>ID</th>
      <th>Team Member</th>
      <th>Completed Tasks</th>
      <th>On-Time %</th>
      <th>Hours Logged</th>
      <th>Role</th>
      <th>Performance</th>
    </tr>
  </thead>
  <tbody>
    {teamPerformanceData.map((member, index) => (
      <tr key={index} className="analytics-performance-row text-white">
        <td>{index + 1}</td>
        <td className="text-white analytics-member-name">{member.name}</td>
        <td>
          <span className="badge bg-primary analytics-task-badge">
            {member.completedTasks}
          </span>
        </td>
        <td>
          <div className="progress analytics-ontime-progress" style={{ height: '15px' }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${member.onTimePercentage}%` }}
            >
              {member.onTimePercentage}%
            </div>
          </div>
        </td>
        <td>{member.hoursLogged}h</td>
        <td>
          <span className="badge bg-light text-dark analytics-role-badge">
            {member.role}
          </span>
        </td>
        <td>{getPerformanceBadge(member.performance)}</td>
      </tr>
    ))}
  </tbody>
</table>
          </div>
        </div>
        <div className="col-lg-4  ">
          <div className="analytics-radar-container bg-main ">
            <h6 className="text-center mb-3">Performance Comparison</h6>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="John Doe" dataKey="A" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.3} />
                <Radar name="Jane Smith" dataKey="B" stroke="#198754" fill="#198754" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMissedDeadlineReport = () => (
    <div className="analytics-report-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="analytics-report-title gradient-heading">Missed Deadline Report</h4>
        <div className="analytics-deadline-controls">
          <button className="btn btn-outline-secondary btn-sm me-2 mb-1 analytics-sort-btn">
            <Clock size={16} className="me-1" /> Sort by Delay
          </button>
          <button className="btn btn-outline-primary btn-sm mb-1 analytics-sort-btn">
            <Users size={16} className="me-1" /> Sort by User
          </button>
        </div>
      </div>

      <div  className="table-responsive"
    style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className="table table-striped analytics-deadline-table table-gradient-bg">
  <thead className="text-white bg-dark  sticky-top">
    <tr>
      <th>ID</th>
      <th>Task Name</th>
      <th>Assigned To</th>
      <th>Due Date</th>
      <th>Delay (Days)</th>
      <th>Comments</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {missedDeadlineData.map((task, index) => (
      <tr key={index} className="text-white analytics-deadline-row">
        <td>{index + 1}</td>
        <td className="text-white analytics-task-name">{task.taskName}</td>
        <td>{task.assignedTo}</td>
        <td className="text-danger analytics-due-date">{task.dueDate}</td>
        <td>
          <span className="badge bg-danger analytics-delay-badge">
            +{task.delayDays} days
          </span>
        </td>
        <td className="analytics-comments text-white">{task.comments}</td>
        <td>
          <button className="btn btn-sm btn-outline-info analytics-detail-btn">
            View Details
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>

      <div className="alert alert-warning analytics-deadline-alert mt-3">
        <strong>Note:</strong> Tasks shown are delayed by 5+ days. Contact respective team members for status updates.
      </div>
    </div>
  );

  const renderProductivityCharts = () => (
    <div className="analytics-report-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="analytics-report-title gradient-heading">Productivity Charts</h4>
        <div className="analytics-productivity-controls ">
          <div className="btn-group analytics-view-toggle d-flex mb-2 flex-column flex-sm-row w-100" role="group">
            <button 
              className={`btn ${productivityView === 'daily' ? 'btn-primary' : 'btn-outline-primary'} mb-2 analytics-view-btn flex-fill`}
              onClick={() => setProductivityView('daily')}
              type="button"
            >
              Daily
            </button>
            <button 
              className={`btn ${productivityView === 'weekly' ? 'btn-primary' : 'btn-outline-primary'} analytics-view-btn mb-2 flex-fill`}
              onClick={() => setProductivityView('weekly')}
              type="button"
            >
              Weekly
            </button>
            <button 
              className={`btn ${productivityView === 'monthly' ? 'btn-primary' : 'btn-outline-primary'} analytics-view-btn mb-2  flex-fill`}
              onClick={() => setProductivityView('monthly')}
              type="button"
            >
              Monthly
            </button>
          </div>
          <button className="btn btn-outline-success btn-sm ms-2 analytics-export-chart-btn">
            <Download size={16} className="me-1" /> Export Charts
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 bg-card">
          <div className="analytics-line-chart-container bg-main">
            <h6 className="mb-3">Productivity Trend</h6>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="productivity" stroke="#0d6efd" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="analytics-pie-chart-container bg-main">
            <h6 className="text-center  mb-3">Billable vs Non-Billable</h6>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="analytics-productivity-stats mt-4">
            <div className="row text-center">
              <div className="col-6">
                <div className="analytics-stat-card bg-main">
                  <h5 className="text-primary">87%</h5>
                  <small className="">Avg Productivity</small>
                </div>
              </div>
              <div className="col-6">
                <div className="analytics-stat-card   bg-main">
                  <h5 className="text-success">72%</h5>
                  <small className="">Billable Hours</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomReportBuilder = () => (
    <div className="analytics-report-container">
      <h4 className="analytics-report-title mb-4 gradient-heading">Custom Report Builder</h4>
      
      <div className="row">
        <div className="col-lg-4">
          <div className="card analytics-builder-card bg-card">
            <div className="card-header analytics-builder-header bg-card  ">
              <h6 className="mb-0 "><Settings size={16} className="me-2" />Report Configuration</h6>
            </div>
            <div className="card-body bg-card">
              <div className="mb-3 ">
                <label className="form-label text-white analytics-builder-label">Date Range</label>
                <select className="form-select analytics-builder-select">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Custom range</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-white analytics-builder-label">Team/User Filter</label>
                <select className="form-select analytics-builder-select" multiple>
                  <option>All Users</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Mike Johnson</option>
                  <option>Sarah Wilson</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label analytics-builder-label text-white">Status Filter</label>
                <div className="analytics-checkbox-group">
                  <div className="form-check">
                    <input className="form-check-input analytics-builder-checkbox" type="checkbox" defaultChecked />
                    <label className="form-check-label">Completed</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input analytics-builder-checkbox" type="checkbox" defaultChecked />
                    <label className="form-check-label">In Progress</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input analytics-builder-checkbox" type="checkbox" />
                    <label className="form-check-label">Delayed</label>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label analytics-builder-label text-white">Fields to Include</label>
                <div className="analytics-field-selector">
                  <div className="form-check">
                    <input className="form-check-input analytics-field-checkbox" type="checkbox" defaultChecked />
                    <label className="form-check-label">Task Name</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input analytics-field-checkbox" type="checkbox" defaultChecked />
                    <label className="form-check-label">Assigned To</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input analytics-field-checkbox" type="checkbox" />
                    <label className="form-check-label">Due Date</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input analytics-field-checkbox" type="checkbox" />
                    <label className="form-check-label">Priority</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input analytics-field-checkbox" type="checkbox" />
                    <label className="form-check-label">Hours Logged</label>
                  </div>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-primary analytics-generate-btn">Generate Preview</button>
                <button className="btn btn-outline-secondary analytics-save-config-btn">Save Configuration</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-8 ">
          <div className="card analytics-preview-card ">
            <div className="card-header analytics-preview-header  bg-card d-flex justify-content-between align-items-center">
              <h6 className="mb-0"><TrendingUp size={16} className="me-2 " />Report Preview</h6>
              <div className="analytics-preview-controls">
                <button className="btn btn-sm btn-outline-primary me-2 analytics-export-preview-btn mb-2">
                  <Download size={16} className="me-1" /> Export
                </button>
                <button className="btn btn-sm btn-primary analytics-refresh-btn mb-2">Refresh</button>
              </div>
            </div>
            <div className="card-body bg-card">
              <div  className="table-responsive"
    style={{ maxHeight: "400px", overflowY: "auto" }}>
               <table className="table table-sm analytics-preview-table table-gradient-bg">
  <thead className="text-white bg-dark  sticky-top">
    <tr>
      <th>ID</th>
      <th>Task Name</th>
      <th>Assigned To</th>
      <th>Status</th>
      <th>Progress</th>
    </tr>
  </thead>
  <tbody>
    <tr className="analytics-preview-row text-white">
      <td>1</td>
      <td>Website Redesign</td>
      <td>John Doe</td>
      <td><span className="badge bg-success">Completed</span></td>
      <td>100%</td>
    </tr>
    <tr className="analytics-preview-row text-white">
      <td>2</td>
      <td>Mobile App Development</td>
      <td>Jane Smith</td>
      <td><span className="badge bg-warning">In Progress</span></td>
      <td>75%</td>
    </tr>
    <tr className="analytics-preview-row text-white">
      <td>3</td>
      <td>API Integration</td>
      <td>Mike Johnson</td>
      <td><span className="badge bg-info">In Progress</span></td>
      <td>60%</td>
    </tr>
  </tbody>
</table>
              </div>
              
              <div className="alert alert-info analytics-preview-note mt-3">
                <strong>Preview Note:</strong> This is a sample of your custom report based on selected filters. Generate the full report to see all matching records.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const reportTabs = [
    { id: 'project-status', label: 'Project Status', icon: Target },
    { id: 'workload', label: 'Monthly Workload', icon: Calendar },
    { id: 'team-performance', label: 'Team Performance', icon: Users },
    { id: 'missed-deadlines', label: 'Missed Deadlines', icon: Clock },
    { id: 'productivity', label: 'Productivity Charts', icon: TrendingUp },
    { id: 'custom-builder', label: 'Custom Builder', icon: Settings }
  ];

  const renderActiveReport = () => {
    switch (activeReportTab) {
      case 'project-status': return renderProjectStatusReport();
      case 'workload': return renderWorkloadReport();
      case 'team-performance': return renderTeamPerformanceReport();
      case 'missed-deadlines': return renderMissedDeadlineReport();
      case 'productivity': return renderProductivityCharts();
      case 'custom-builder': return renderCustomReportBuilder();
      default: return renderProjectStatusReport();
    }
  };

  return (
    <div className="container-fluid bg-main analytics-dashboard-container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between bg-main align-items-center analytics-dashboard-header">
            <div>
              <h2 className=" gradient-heading ">Reporting & Analytics</h2>
              <p className="text-white analytics-subtitle">Comprehensive insights into project performance and team productivity</p>
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

      <div className="row  ">
        <div className="col-lg-2      col-md-3 mb-4">
          <div className="analytics-sidebar bg-card ">
            <div className="list-group   analytics-nav-tabs">
              {reportTabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`list-group-item list-group-item-action bg-card analytics-nav-item ${
                      activeReportTab === tab.id ? 'active analytics-nav-active' : ''
                    }`}
                    onClick={() => setActiveReportTab(tab.id)}
                  >
                    <IconComponent size={16} className="me-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-10 col-md-9">
          <div className="analytics-main-content bg-card ">
            {renderActiveReport()}
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
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .analytics-main-title {
          color: #2c3e50;
          font-weight: 600;
        }
        
        .analytics-subtitle {
          margin-bottom: 0;
          font-size: 0.95rem;
        }
        
        .analytics-sidebar {
        
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem;
        }
        
        .analytics-nav-item {
          border: none;
          margin-bottom: 0.25rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }
        
        .analytics-nav-item:hover {
          background-color: #e9ecef;
        }
        
        .analytics-nav-active {
          background-color: #0d6efd !important;
          color: white !important;
        }
        
        .analytics-main-content {
          
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 2rem;
        }
        
        .analytics-report-container {
          min-height: 600px;
        }
        
        .analytics-report-title {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .analytics-export-btn, .analytics-filter-btn, .analytics-dashboard-btn {
          transition: all 0.2s ease;
        }
        
        .analytics-export-btn:hover, .analytics-filter-btn:hover, .analytics-dashboard-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .analytics-filter-select {
          border-radius: 0.375rem;
          border: 1px solid #dee2e6;
        }
        
        .analytics-project-table {
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-radius: 0.5rem;
          overflow: hidden;
          
        }
        
        .analytics-project-row:hover {
          background-color: #f8f9fa;
        }
        
        .analytics-project-name {
          color: #2c3e50;
        }
        
        .analytics-progress-bar {
          border-radius: 10px;
          background-color: #e9ecef;
        }
        
        .analytics-progress-fill {
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        
        .analytics-badge-success {
          background-color: #198754 !important;
        }
        
        .analytics-badge-danger {
          background-color: #dc3545 !important;
        }
        
        .analytics-badge-primary {
          background-color: #0d6efd !important;
        }
        
        .analytics-priority-critical {
          background-color: #dc3545 !important;
        }
        
        .analytics-priority-high {
          background-color: #ffc107 !important;
          color: #000 !important;
        }
        
        .analytics-priority-medium {
          background-color: #17a2b8 !important;
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
          background: #f8f9fa;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 1rem;
        }
        
        .analytics-performance-table {
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .analytics-performance-row:hover {
          background-color: #f8f9fa;
        }
        
        .analytics-member-name {
          color: #2c3e50;
        }
        
        .analytics-task-badge {
          background-color: #0d6efd !important;
        }
        
        .analytics-ontime-progress {
          height: 15px;
          border-radius: 7px;
          background-color: #e9ecef;
        }
        
        .analytics-role-badge {
          background-color: #f8f9fa !important;
          color: #6c757d !important;
          border: 1px solid #dee2e6;
        }
        
        .analytics-performance-top {
          background-color: #198754 !important;
        }
        
        .analytics-performance-high {
          background-color: #0d6efd !important;
        }
        
        .analytics-performance-good {
          background-color: #17a2b8 !important;
        }
        
        .analytics-performance-average {
          background-color: #6c757d !important;
        }
        
        .analytics-radar-container {
          background: #f8f9fa;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        
        .analytics-deadline-table {
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .analytics-deadline-row:hover {
          background-color: #f8f9fa;
        }
        
        .analytics-task-name {
          color: #2c3e50;
        }
        
        .analytics-due-date {
          font-weight: 500;
        }
        
        .analytics-delay-badge {
          background-color: #dc3545 !important;
        }
        
        .analytics-comments {
          font-style: italic;
          color: #6c757d;
        }
        
        .analytics-detail-btn {
          transition: all 0.2s ease;
        }
        
        .analytics-detail-btn:hover {
          transform: translateY(-1px);
        }
        
        .analytics-deadline-alert {
          border-radius: 0.5rem;
          border: 1px solid #ffc107;
          background-color: #fff3cd;
        }
        
        .analytics-view-toggle {
          border-radius: 0.375rem;
          overflow: hidden;
        }
        
        .analytics-view-btn {
          transition: all 0.2s ease;
        }
        
        .analytics-line-chart-container {
          background: #f8f9fa;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        
        .analytics-pie-chart-container {
          background: #f8f9fa;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        
        .analytics-stat-card {
          background: white;
          border-radius: 0.375rem;
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .analytics-builder-card {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 0.5rem;
        }
        
        .analytics-builder-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        
        .analytics-builder-label {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .analytics-builder-select {
          border-radius: 0.375rem;
        }
        
        .analytics-checkbox-group {
          max-height: 120px;
          overflow-y: auto;
        }
        
        .analytics-field-selector {
          max-height: 150px;
          overflow-y: auto;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          padding: 0.5rem;
        }
        
        .analytics-generate-btn {
          background-color: #0d6efd;
          border-color: #0d6efd;
          transition: all 0.2s ease;
        }
        
        .analytics-generate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .analytics-preview-card {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 0.5rem;
        }
        
        .analytics-preview-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        
        .analytics-preview-table {
          margin-bottom: 0;
        }
        
        .analytics-preview-row:hover {
          background-color: #f8f9fa;
        }
        
        .analytics-preview-note {
          border-radius: 0.375rem;
          border: 1px solid #b6d7ff;
          background-color: #cfe2ff;
          margin-bottom: 0;
        }
        
        @media (max-width: 768px) {
          .analytics-dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .analytics-global-controls {
            margin-top: 1rem;
          }
          
          .analytics-export-buttons {
            flex-direction: column;
          }
          
          .analytics-export-btn {
            margin-bottom: 0.5rem;
          }
          
          .analytics-workload-controls {
            flex-direction: column;
          }
          
          .analytics-date-selector, .analytics-team-selector {
            margin-bottom: 0.5rem;
            width: 100% !important;
          }
          
          .analytics-performance-filters {
            flex-direction: column;
          }
          
          .analytics-role-filter, .analytics-department-filter {
            margin-bottom: 0.5rem;
            width: 100% !important;
          }
          
          .analytics-productivity-controls {
            flex-direction: column;
          }
          
          .analytics-view-toggle {
            margin-bottom: 1rem;
          }
          
          .analytics-preview-controls {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportingAnalytics;