import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const App = () => {
  const [activeTab, setActiveTab] = useState('created');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const searchInputRef = useRef(null);
  const chartRef = useRef(null);

  // Sample data for projects
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Website Redesign',
      client: 'Acme Corp',
      country: 'United States',
      projectManager: 'John Smith',
      tasks: ['Design', 'Development'],
      languages: ['English', 'Spanish'],
      platform: 'Web',
      files: [
        { name: 'Homepage.psd', pageCount: 5 },
        { name: 'About.psd', pageCount: 3 },
      ],
      totalPages: 16,
      receivedDate: '2025-06-20',
      status: 'created',
      serverPath: '/projects/acme/redesign',
      notes: 'Priority project for Q3',
      rate: 25,
      currency: 'USD',
      cost: 400,
      inrCost: 33200,
    },
    {
      id: 2,
      title: 'Mobile App Development',
      client: 'TechStart',
      country: 'Canada',
      projectManager: 'Emily Johnson',
      tasks: ['Development', 'Testing'],
      languages: ['English', 'French'],
      platform: 'Mobile',
      files: [
        { name: 'Login.sketch', pageCount: 2 },
        { name: 'Dashboard.sketch', pageCount: 7 },
      ],
      totalPages: 18,
      receivedDate: '2025-06-15',
      status: 'active',
      progress: 65,
      serverPath: '/projects/techstart/mobile',
      notes: 'Beta release scheduled for August',
      rate: 30,
      currency: 'USD',
      cost: 540,
      inrCost: 44820,
    },
    {
      id: 3,
      title: 'E-commerce Platform',
      client: 'RetailPlus',
      country: 'UK',
      projectManager: 'Michael Brown',
      tasks: ['Design', 'Development', 'Testing'],
      languages: ['English'],
      platform: 'Web',
      files: [
        { name: 'ProductPage.fig', pageCount: 4 },
        { name: 'Checkout.fig', pageCount: 3 },
      ],
      totalPages: 7,
      receivedDate: '2025-05-10',
      status: 'completed',
      completedDate: '2025-06-10',
      serverPath: '/projects/retailplus/ecommerce',
      notes: 'Successfully launched',
      rate: 28,
      currency: 'GBP',
      cost: 196,
      inrCost: 20776,
      performance: {
        expectedHours: 42,
        actualHours: 38,
        stages: [
          { name: 'Design', start: '2025-05-12', end: '2025-05-20', handler: 'Sarah Wilson' },
          { name: 'Development', start: '2025-05-21', end: '2025-06-05', handler: 'David Lee' },
          { name: 'Testing', start: '2025-06-06', end: '2025-06-10', handler: 'Rachel Chen' }
        ]
      }
    }
  ]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    country: '',
    projectManager: '',
    tasks: [],
    languages: [],
    platform: [],
    files: [{ name: '', pageCount: 0 }],
    totalPages: 0,
    receivedDate: new Date().toISOString().split('T')[0],
    serverPath: '',
    notes: '',
    rate: 0,
    currency: 'USD',
    cost: 0,
    inrCost: 0
  });

  // Options for dropdowns
  const clientOptions = ['Acme Corp', 'TechStart', 'RetailPlus', 'GlobalMedia', 'FinTech Solutions'];
  const countryOptions = ['United States', 'Canada', 'UK', 'Australia', 'Germany', 'India'];
  const projectManagerOptions = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson', 'David Lee'];
  const taskOptions = ['Design', 'Development', 'Testing', 'Content', 'QA', 'Localization'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const platformOptions = ['Web', 'Mobile', 'Desktop', 'Cross-platform'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'];

  // Filter projects based on active tab and search query
  const filteredProjects = projects.filter(project => {
    const matchesTab = project.status === activeTab;
    const matchesSearch = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.projectManager && project.projectManager.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.files.some((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize chart for completed projects
  useEffect(() => {
    if (activeTab === 'completed' && chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        animation: false,
        title: {
          text: 'Project Performance',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Expected Hours', 'Actual Hours'],
          bottom: 10
        },
        xAxis: {
          type: 'category',
          data: filteredProjects.map(p => p.title)
        },
        yAxis: {
          type: 'value',
          name: 'Hours'
        },
        series: [
          {
            name: 'Expected Hours',
            type: 'bar',
            data: filteredProjects.map(p => p.performance?.expectedHours || 0),
            color: '#4F46E5'
          },
          {
            name: 'Actual Hours',
            type: 'bar',
            data: filteredProjects.map(p => p.performance?.actualHours || 0),
            color: '#10B981'
          }
        ]
      };
      chart.setOption(option);
      return () => {
        chart.dispose();
      };
    }
  }, [activeTab, filteredProjects]);

  // Calculate total pages
  const calculateTotalPages = () => {
    const totalFilePages = formData.files.reduce((sum, file) => sum + (file.pageCount || 0), 0);
    return totalFilePages * formData.languages.length * formData.tasks.length;
  };

  // Update total pages when form changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalPages: calculateTotalPages()
    }));
  }, [formData.files, formData.languages, formData.tasks]);

  // Calculate cost
  useEffect(() => {
    const cost = formData.rate * formData.totalPages;
    let inrCost = cost;
    // Simple conversion rates (in real app would use API)
    const conversionRates = {
      USD: 83,
      EUR: 90,
      GBP: 106,
      CAD: 61,
      AUD: 55,
      INR: 1
    };
    inrCost = cost * conversionRates[formData.currency];
    setFormData(prev => ({
      ...prev,
      cost,
      inrCost
    }));
  }, [formData.rate, formData.totalPages, formData.currency]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => {
      const currentValues = [...prev[name]];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [name]: newValues
      };
    });
  };

  // Handle file input changes
  const handleFileChange = (index, field, value) => {
    setFormData(prev => {
      const newFiles = [...prev.files];
      newFiles[index] = {
        ...newFiles[index],
        [field]: field === 'pageCount' ? Number(value) : value
      };
      return {
        ...prev,
        files: newFiles
      };
    });
  };

  // Add new file row
  const addFileRow = () => {
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, { name: '', pageCount: 0 }]
    }));
  };

  // Remove file row
  const removeFileRow = (index) => {
    if (formData.files.length > 1) {
      setFormData(prev => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== index)
      }));
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (showEditModal !== false) {
      // Update existing project
      setProjects(projects.map(project =>
        project.id === showEditModal ? {
          ...project,
          ...formData,
          status: project.status,
          id: project.id
        } : project
      ));
      setShowEditModal(false);
    } else {
      // Create new project
      const newProject = {
        ...formData,
        id: projects.length + 1,
        status: 'created',
        receivedDate: formData.receivedDate || new Date().toISOString().split('T')[0]
      };
      setProjects([...projects, newProject]);
      setShowCreateModal(false);
    }
    // Reset form
    setFormData({
      title: '',
      client: '',
      country: '',
      projectManager: '',
      tasks: [],
      languages: [],
      platform: [],
      files: [{ name: '', pageCount: 0 }],
      totalPages: 0,
      receivedDate: new Date().toISOString().split('T')[0],
      serverPath: '',
      notes: '',
      rate: 0,
      currency: 'USD',
      cost: 0,
      inrCost: 0
    });
  };

  // Handle edit project
  const handleEditProject = (projectId) => {
    const projectToEdit = projects.find(p => p.id === projectId);
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title,
        client: projectToEdit.client,
        country: projectToEdit.country,
        projectManager: projectToEdit.projectManager || '',
        tasks: projectToEdit.tasks,
        languages: projectToEdit.languages,
        platform: Array.isArray(projectToEdit.platform) ? projectToEdit.platform : [projectToEdit.platform],
        files: projectToEdit.files,
        totalPages: projectToEdit.totalPages,
        receivedDate: projectToEdit.receivedDate,
        serverPath: projectToEdit.serverPath,
        notes: projectToEdit.notes || '',
        rate: projectToEdit.rate || 0,
        currency: projectToEdit.currency || 'USD',
        cost: projectToEdit.cost || 0,
        inrCost: projectToEdit.inrCost || 0
      });
      setShowEditModal(projectId);
    }
  };

  // Mark project as YTS (Yet to Start)
  const markAsYTS = (projectId, dueDate) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, status: 'active', dueDate, progress: 0 }
        : project
    ));
  };

  // Mark project as completed
  const markAsCompleted = (projectId) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? {
          ...project,
          status: 'completed',
          completedDate: new Date().toISOString().split('T')[0],
          performance: {
            expectedHours: Math.round(project.totalPages * 1.5),
            actualHours: Math.round(project.totalPages * 1.3),
            stages: [
              { name: 'Design', start: project.receivedDate, end: new Date().toISOString().split('T')[0], handler: 'Sarah Wilson' },
              { name: 'Development', start: project.receivedDate, end: new Date().toISOString().split('T')[0], handler: 'David Lee' },
              { name: 'Testing', start: project.receivedDate, end: new Date().toISOString().split('T')[0], handler: 'Rachel Chen' }
            ]
          }
        }
        : project
    ));
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-white shadow-sm ">
        <div className="container-fluid py-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <h1 className="h4 mb-0 text-dark">Projects</h1>
              <div className="d-flex ms-3">
                <button className="btn btn-outline-secondary btn-sm me-2">
                  <i className="fas fa-file-excel text-success me-2"></i>
                  Blank Excel
                </button>
                <button className="btn btn-outline-secondary btn-sm me-2">
                  <i className="fas fa-file-import text-primary me-2"></i>
                  Import Excel
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="fas fa-file-download text-indigo me-2"></i>
                  Download Excel
                </button>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <i className="fas fa-search text-muted"></i>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search projects (Ctrl+F)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="position-absolute top-50 end-0 translate-middle-y pe-3 small text-muted">
                  Ctrl+F
                </div>
              </div>
              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary btn-sm ms-2"
                  >
                    <i className="fas fa-plus me-2"></i> Create New Project
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="btn btn-outline-secondary btn-sm ms-2"
                  >
                    <i className="fas fa-cog text-muted"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-bottom">
          <div className="container-fluid">
            <ul className="nav nav-tabs border-bottom-0">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'created' ? 'active' : ''}`}
                  onClick={() => setActiveTab('created')}
                >
                  Created Projects
                  <span className="badge bg-light text-dark ms-2">
                    {projects.filter(p => p.status === 'created').length}
                  </span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  Active Projects
                  <span className="badge bg-light text-dark ms-2">
                    {projects.filter(p => p.status === 'active').length}
                  </span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed Projects
                  <span className="badge bg-light text-dark ms-2">
                    {projects.filter(p => p.status === 'completed').length}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pt-5 pb-4" >
        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="alert alert-info mb-4">
            <div className="d-flex">
              <div className="flex-shrink-0">
                <i className="fas fa-search me-3"></i>
              </div>
              <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                <div>
                  Showing results for "{searchQuery}" in {activeTab} projects
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-link p-0"
                >
                  Clear <span className="visually-hidden">search</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Created Projects Tab */}
        {activeTab === 'created' && (
          <div className="mb-4">
            <h2 className="h5 mb-3">Draft Projects</h2>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-folder-open text-muted fa-4x mb-3"></i>
                <h3 className="h6">No projects</h3>
                <p className="text-muted mb-4">
                  Get started by creating a new project.
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    <i className="fas fa-plus me-2"></i> Create New Project
                  </button>
                )}
              </div>
            ) : (
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Project Title</th>
                        <th>Client</th>
                        <th>Country</th>
                        <th>Project Manager</th>
                        <th>Tasks</th>
                        <th>Languages</th>
                        <th>Platform</th>
                        <th>Total Pages</th>
                        <th>Server Path</th>
                        <th>Received Date</th>
                        <th>Rate</th>
                        <th>Cost</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map(project => (
                        <tr key={project.id}>
                          <td>
                            {project.title}
                            <span className="badge bg-light text-dark ms-2">Draft</span>
                          </td>
                          <td>{project.client}</td>
                          <td>{project.country}</td>
                          <td>{project.projectManager}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.tasks.map((task) => (
                                <span key={task} className="badge bg-primary bg-opacity-10 text-primary">
                                  {task}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.languages.map((language) => (
                                <span key={language} className="badge bg-success bg-opacity-10 text-success">
                                  {language}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-purple bg-opacity-10 text-purple">
                              {project.platform}
                            </span>
                          </td>
                          <td>{project.totalPages}</td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {project.serverPath}
                            </span>
                          </td>
                          <td>{new Date(project.receivedDate).toLocaleDateString()}</td>
                          <td>{project.rate} {project.currency}</td>
                          <td>{project.cost} {project.currency}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                onClick={() => {
                                  const dueDate = prompt('Enter due date (YYYY-MM-DD):', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                                  if (dueDate) markAsYTS(project.id, dueDate);
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                Mark as YTS
                              </button>
                              <button
                                onClick={() => handleEditProject(project.id)}
                                className="btn btn-sm btn-outline-secondary"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Projects Tab */}
        {activeTab === 'active' && (
          <div className="mb-4">
            <h2 className="h5 mb-3">Active Projects</h2>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-tasks text-muted fa-4x mb-3"></i>
                <h3 className="h6">No active projects</h3>
                <p className="text-muted">
                  Mark projects as YTS to move them here.
                </p>
              </div>
            ) : (
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Project Title</th>
                        <th>Client</th>
                        <th>Country</th>
                        <th>Project Manager</th>
                        <th>Due Date</th>
                        <th>Progress</th>
                        <th>Tasks</th>
                        <th>Languages</th>
                        <th>Platform</th>
                        <th>Total Pages</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map(project => (
                        <tr key={project.id}>
                          <td>
                            {project.title}
                            <span className="badge bg-warning bg-opacity-10 text-warning ms-2">Active</span>
                          </td>
                          <td>{project.client}</td>
                          <td>{project.country}</td>
                          <td>{project.projectManager}</td>
                          <td>{new Date(project.dueDate).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                                <div
                                  className="progress-bar bg-primary"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <small className="text-primary">{project.progress}%</small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.tasks.map((task) => (
                                <span key={task} className="badge bg-primary bg-opacity-10 text-primary">
                                  {task}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {project.languages.map((language) => (
                                <span key={language} className="badge bg-success bg-opacity-10 text-success">
                                  {language}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-purple bg-opacity-10 text-purple">
                              {project.platform}
                            </span>
                          </td>
                          <td>{project.totalPages}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                onClick={() => markAsCompleted(project.id)}
                                className="btn btn-sm btn-success"
                              >
                                Mark as Completed
                              </button>
                              <button
                                onClick={() => handleEditProject(project.id)}
                                className="btn btn-sm btn-outline-secondary"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <i className="fas fa-info-circle"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completed Projects Tab */}
        {activeTab === 'completed' && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Completed Projects</h2>
              <button className="btn btn-outline-success btn-sm">
                <i className="fas fa-file-excel me-2"></i> Export to Excel
              </button>
            </div>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-check-circle text-muted fa-4x mb-3"></i>
                <h3 className="h6">No completed projects</h3>
                <p className="text-muted">
                  Mark active projects as completed to see them here.
                </p>
              </div>
            ) : (
              <>
                {/* Performance Chart */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div ref={chartRef} style={{ height: '400px' }}></div>
                  </div>
                </div>
                {/* Project Cards */}
                <div className="card">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Project Title</th>
                          <th>Client</th>
                          <th>Country</th>
                          <th>Project Manager</th>
                          <th>Completed Date</th>
                          <th>Tasks</th>
                          <th>Languages</th>
                          <th>Platform</th>
                          <th>Total Pages</th>
                          <th>Expected Hours</th>
                          <th>Actual Hours</th>
                          <th>Efficiency</th>
                          <th>Cost</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map(project => (
                          <tr key={project.id}>
                            <td>
                              {project.title}
                              <span className="badge bg-success bg-opacity-10 text-success ms-2">Completed</span>
                            </td>
                            <td>{project.client}</td>
                            <td>{project.country}</td>
                            <td>{project.projectManager}</td>
                            <td>{new Date(project.completedDate).toLocaleDateString()}</td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {project.tasks.map((task) => (
                                  <span key={task} className="badge bg-primary bg-opacity-10 text-primary">
                                    {task}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {project.languages.map((language) => (
                                  <span key={language} className="badge bg-success bg-opacity-10 text-success">
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-purple bg-opacity-10 text-purple">
                                {project.platform}
                              </span>
                            </td>
                            <td>{project.totalPages}</td>
                            <td>{project.performance.expectedHours}</td>
                            <td>{project.performance.actualHours}</td>
                            <td className="fw-bold">
                              <span className={`${project.performance.expectedHours > project.performance.actualHours ? 'text-success' : 'text-danger'}`}>
                                {Math.round((project.performance.expectedHours / project.performance.actualHours) * 100)}%
                              </span>
                            </td>
                            <td>{project.cost} {project.currency}</td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-outline-secondary">
                                  <i className="fas fa-file-alt me-1"></i> View Report
                                </button>
                                <button className="btn btn-sm btn-outline-secondary">
                                  <i className="fas fa-archive me-1"></i> Archive
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Project Modal */}
      {(showCreateModal || showEditModal !== false) && (
        <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {showEditModal !== false ? 'Edit Project Details' : 'Create New Project'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Basic Info Section */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">Basic Information</h6>
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label htmlFor="title" className="form-label">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="client" className="form-label">
                          Client *
                        </label>
                        <select
                          className="form-select"
                          id="client"
                          name="client"
                          required
                          value={formData.client}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Client</option>
                          {clientOptions.map(client => (
                            <option key={client} value={client}>{client}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="country" className="form-label">
                          Country *
                        </label>
                        <select
                          className="form-select"
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Country</option>
                          {countryOptions.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                      {isAdmin && (
                        <div className="col-md-4">
                          <label htmlFor="projectManager" className="form-label">
                            Project Manager
                          </label>
                          <select
                            className="form-select"
                            id="projectManager"
                            name="projectManager"
                            value={formData.projectManager}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Project Manager</option>
                            {projectManagerOptions.map(pm => (
                              <option key={pm} value={pm}>{pm}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Details Section */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">Project Details</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Tasks *</label>
                        <div className="d-flex flex-wrap gap-2">
                          {taskOptions.map(task => (
                            <button
                              key={task}
                              type="button"
                              onClick={() => handleMultiSelectChange('tasks', task)}
                              className={`btn btn-sm ${formData.tasks.includes(task) ? 'btn-primary' : 'btn-outline-primary'}`}
                            >
                              {task}
                              {formData.tasks.includes(task) && (
                                <i className="fas fa-check ms-2"></i>
                              )}
                            </button>
                          ))}
                        </div>
                        {formData.tasks.length === 0 && (
                          <div className="text-danger small mt-1">Please select at least one task</div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Languages *</label>
                        <div className="d-flex flex-wrap gap-2">
                          {languageOptions.map(language => (
                            <button
                              key={language}
                              type="button"
                              onClick={() => handleMultiSelectChange('languages', language)}
                              className={`btn btn-sm ${formData.languages.includes(language) ? 'btn-success' : 'btn-outline-success'}`}
                            >
                              {language}
                              {formData.languages.includes(language) && (
                                <i className="fas fa-check ms-2"></i>
                              )}
                            </button>
                          ))}
                        </div>
                        {formData.languages.length === 0 && (
                          <div className="text-danger small mt-1">Please select at least one language</div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Platform *</label>
                        <div className="d-flex flex-wrap gap-2">
                          {platformOptions.map(platform => (
                            <button
                              key={platform}
                              type="button"
                              onClick={() => handleMultiSelectChange('platform', platform)}
                              className={`btn btn-sm ${formData.platform.includes(platform) ? 'btn-purple' : 'btn-outline-purple'}`}
                            >
                              {platform}
                              {formData.platform.includes(platform) && (
                                <i className="fas fa-check ms-2"></i>
                              )}
                            </button>
                          ))}
                        </div>
                        {formData.platform.length === 0 && (
                          <div className="text-danger small mt-1">Please select at least one platform</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File Details Section */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">File Details</h6>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="btn-group">
                        <button
                          type="button"
                          className={`btn btn-sm ${showCreateModal === 'manual' ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                          Manual Input
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${showCreateModal === 'excel' ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                          Excel Upload
                        </button>
                      </div>
                      {showCreateModal === 'manual' && (
                        <button
                          type="button"
                          onClick={addFileRow}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <i className="fas fa-plus me-1"></i> Add File
                        </button>
                      )}
                    </div>
                    {showCreateModal === 'manual' ? (
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="bg-light">
                            <tr>
                              <th>File Name</th>
                              <th>Page Count</th>
                              <th width="50"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.files.map((file, index) => (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={file.name}
                                    onChange={(e) => handleFileChange(index, 'name', e.target.value)}
                                    placeholder="Enter file name"
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    min="1"
                                    className="form-control form-control-sm"
                                    value={file.pageCount || ''}
                                    onChange={(e) => handleFileChange(index, 'pageCount', e.target.value)}
                                    placeholder="Pages"
                                    required
                                  />
                                </td>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeFileRow(index)}
                                    className="btn btn-sm btn-link text-danger"
                                    disabled={formData.files.length === 1}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded p-5 text-center">
                        <i className="fas fa-file-excel text-muted fa-3x mb-3"></i>
                        <div className="mb-3">
                          <label
                            htmlFor="file-upload"
                            className="btn btn-link text-decoration-none"
                          >
                            Upload Excel file
                          </label>
                          <input id="file-upload" name="file-upload" type="file" className="d-none" />
                          <span className="text-muted">or drag and drop</span>
                        </div>
                        <p className="small text-muted">Excel files only (XLS, XLSX)</p>
                      </div>
                    )}
                    <div className="bg-light p-3 rounded mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-medium">Total Pages Calculation</div>
                        <div className="text-end">
                          <div className="small text-muted">
                            {formData.files.reduce((sum, file) => sum + (file.pageCount || 0), 0)} pages × {formData.languages.length || 0} languages × {formData.tasks.length || 0} tasks
                          </div>
                          <div className="h5 fw-bold text-primary">
                            {formData.totalPages} Total Pages
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Section (Admin Only) */}
                  {isAdmin && (
                    <div className="mb-4">
                      <h6 className="border-bottom pb-2 mb-3">Financial Details</h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label htmlFor="rate" className="form-label">
                            Rate per Page
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              id="rate"
                              name="rate"
                              min="0"
                              step="0.01"
                              value={formData.rate || ''}
                              onChange={handleInputChange}
                              placeholder="0.00"
                            />
                            <select
                              className="form-select"
                              id="currency"
                              name="currency"
                              value={formData.currency}
                              onChange={handleInputChange}
                              style={{ maxWidth: '100px' }}
                            >
                              {currencyOptions.map(currency => (
                                <option key={currency}>{currency}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="cost" className="form-label">
                            Total Cost
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              id="cost"
                              name="cost"
                              value={formData.cost.toFixed(2)}
                              readOnly
                            />
                            <span className="input-group-text">{formData.currency}</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="inrCost" className="form-label">
                            Cost in INR
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              id="inrCost"
                              name="inrCost"
                              value={formData.inrCost.toFixed(2)}
                              readOnly
                            />
                            <span className="input-group-text">INR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info Section */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">Additional Information</h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label htmlFor="receivedDate" className="form-label">
                          Received Date *
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="receivedDate"
                          name="receivedDate"
                          required
                          value={formData.receivedDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="serverPath" className="form-label">
                          Server Path *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="serverPath"
                          name="serverPath"
                          required
                          value={formData.serverPath}
                          onChange={handleInputChange}
                          placeholder="/projects/client/project-name"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="notes" className="form-label">
                          Notes
                        </label>
                        <textarea
                          className="form-control"
                          id="notes"
                          name="notes"
                          rows="3"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Add any additional notes or instructions..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top-0">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setFormData({
                          title: '',
                          client: '',
                          country: '',
                          projectManager: '',
                          tasks: [],
                          languages: [],
                          platform: [],
                          files: [{ name: '', pageCount: 0 }],
                          totalPages: 0,
                          receivedDate: new Date().toISOString().split('T')[0],
                          serverPath: '',
                          notes: '',
                          rate: 0,
                          currency: 'USD',
                          cost: 0,
                          inrCost: 0
                        });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !formData.title ||
                        !formData.client ||
                        !formData.country ||
                        formData.tasks.length === 0 ||
                        formData.languages.length === 0 ||
                        formData.platform.length === 0 ||
                        formData.files.some(file => !file.name || !file.pageCount) ||
                        !formData.serverPath
                      }
                    >
                      {showEditModal !== false ? 'Save Changes' : 'Create Project'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Project Settings</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSettings(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <h6 className="mb-3">Manage Clients</h6>
                  <div className="border rounded p-2 mb-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <ul className="list-group list-group-flush">
                      {clientOptions.map(client => (
                        <li key={client} className="list-group-item d-flex justify-content-between align-items-center py-2 px-0">
                          <span>{client}</span>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-outline-danger">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-plus me-1"></i> Add Client
                  </button>
                </div>
                <div className="mb-4">
                  <h6 className="mb-3">Manage Project Managers</h6>
                  <div className="border rounded p-2 mb-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <ul className="list-group list-group-flush">
                      {projectManagerOptions.map(pm => (
                        <li key={pm} className="list-group-item d-flex justify-content-between align-items-center py-2 px-0">
                          <span>{pm}</span>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-outline-danger">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-plus me-1"></i> Add Project Manager
                  </button>
                </div>
                <div>
                  <h6 className="mb-3">Currency Conversion Rates</h6>
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small">Currency</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value="USD"
                        readOnly
                      />
                    </div>
                    <div className="col-8">
                      <label className="form-label small">Rate to INR</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value="83"
                      />
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value="EUR"
                        readOnly
                      />
                    </div>
                    <div className="col-8">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value="90"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowSettings(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for modals */}
      {(showCreateModal || showEditModal !== false || showSettings) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default App;