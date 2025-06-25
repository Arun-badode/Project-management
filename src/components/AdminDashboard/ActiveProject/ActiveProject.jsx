import React, { useState, useEffect } from 'react';

const ActiveProject= () => {
  // Project data state
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter states
  const [clientFilter, setClientFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  
  // Batch edit states
  const [batchEditValues, setBatchEditValues] = useState({
    platform: '',
    handler: '',
    qaReviewer: '',
    qcDue: '',
    qcAllocatedHours: '',
    priority: ''
  });
  
  // Expanded row state
  const [expandedRow, setExpandedRow] = useState(null);

  // Generate dummy data
  useEffect(() => {
    const dummyProjects = generateDummyProjects(15);
    setProjects(dummyProjects);
    setFilteredProjects(dummyProjects);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...projects];
    
    // Apply tab filter
    if (activeTab === 'unhandled') {
      result = result.filter(project => !project.handler || project.handler === '');
    }
    
    // Apply dropdown filters
    if (clientFilter) {
      result = result.filter(project => project.client === clientFilter);
    }
    if (taskFilter) {
      result = result.filter(project => project.task === taskFilter);
    }
    if (languageFilter) {
      result = result.filter(project => project.language === languageFilter);
    }
    
    // Sort by due date
    result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    setFilteredProjects(result);
  }, [projects, activeTab, clientFilter, taskFilter, languageFilter]);

  // Handle project deletion
  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  // Handle marking project as complete
  const handleMarkComplete = (id) => {
    if (window.confirm('Are you sure you want to mark this project as complete?')) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  // Open project detail modal
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSelectedFiles([]);
    setShowDetailModal(false); // Don't show modal
    setHasUnsavedChanges(false);
    setBatchEditValues({
      platform: '',
      handler: '',
      qaReviewer: '',
      qcDue: '',
      qcAllocatedHours: '',
      priority: ''
    });
    // Toggle expanded row
    setExpandedRow(expandedRow === project.id ? null : project.id);
  };

  // Toggle file selection for batch editing
  const toggleFileSelection = (file) => {
    if (selectedFiles.some(f => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
    setHasUnsavedChanges(true);
  };

  // Apply batch edits to selected files
  const applyBatchEdits = () => {
    if (selectedProject && selectedFiles.length > 0) {
      const updatedFiles = selectedProject.files.map(file => {
        if (selectedFiles.some(f => f.id === file.id)) {
          return {
            ...file,
            platform: batchEditValues.platform || file.platform,
            handler: batchEditValues.handler || file.handler,
            qaReviewer: batchEditValues.qaReviewer || file.qaReviewer,
            qcDue: batchEditValues.qcDue || file.qcDue,
            qcAllocatedHours: batchEditValues.qcAllocatedHours || file.qcAllocatedHours,
            priority: batchEditValues.priority || file.priority
          };
        }
        return file;
      });
      
      const updatedProject = {
        ...selectedProject,
        files: updatedFiles
      };
      
      setSelectedProject(updatedProject);
      // Update the project in the main projects array
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      // Reset batch edit values
      setBatchEditValues({
        platform: '',
        handler: '',
        qaReviewer: '',
        qcDue: '',
        qcAllocatedHours: '',
        priority: ''
      });
      setSelectedFiles([]);
      setHasUnsavedChanges(false);
    }
  };

  // Close modal with confirmation if there are unsaved changes
  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        setShowDetailModal(false);
      }
    } else {
      setShowDetailModal(false);
    }
  };

  // Get unique values for filters
  const getUniqueValues = (key) => {
    return Array.from(new Set(projects.map(project => project[key])));
  };

  

  const handleEditProject = (project) => {
    setEditedProject({...project});
    setShowEditModal(true);
  };

  const handleSaveProjectEdit = () => {
    if (editedProject) {
      setProjects(projects.map(p => p.id === editedProject.id ? editedProject : p));
      setShowEditModal(false);
      setEditedProject(null);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Edit Project Modal */}
      {showEditModal && editedProject && (
        <div className="modal fade show custom-modal-dark" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">Project Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editedProject.title}
                      onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Client</label>
                    <select
                      className="form-select"
                      value={editedProject.client}
                      onChange={(e) => setEditedProject({...editedProject, client: e.target.value})}
                    >
                      {getUniqueValues('client').map((client, index) => (
                        <option key={index} value={client}>{client}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Task</label>
                    <select
                      className="form-select"
                      value={editedProject.task}
                      onChange={(e) => setEditedProject({...editedProject, task: e.target.value})}
                    >
                      {getUniqueValues('task').map((task, index) => (
                        <option key={index} value={task}>{task}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={editedProject.language}
                      onChange={(e) => setEditedProject({...editedProject, language: e.target.value})}
                    >
                      {getUniqueValues('language').map((language, index) => (
                        <option key={index} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Platform</label>
                    <select
                      className="form-select"
                      value={editedProject.platform}
                      onChange={(e) => setEditedProject({...editedProject, platform: e.target.value})}
                    >
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Desktop">Desktop</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Due Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={customToInputDate(editedProject.dueDate)}
                      onChange={(e) => {
                        setEditedProject({
                          ...editedProject,
                          dueDate: inputToCustomDate(e.target.value)
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
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

      {/* Header with action buttons */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h2 className="gradient-heading">Active Projects</h2>
        </div>
        {/* <div className="col-md-6 text-md-end">
          <div className="d-flex flex-wrap justify-content-md-end gap-2">
            <button className="btn btn-dark">
              <i className="fas fa-file-excel me-2"></i>Download Excel
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-file-import me-2"></i>Import Excel
            </button>
            <button className="btn btn-success">
              <i className="fas fa-download me-2"></i>Download Excel
            </button>
          </div>
        </div> */}
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="">All Clients</option>
            {getUniqueValues('client').map((client, index) => (
              <option key={index} value={client}>{client}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mt-2">
          <select
            className="form-select"
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
          >
            <option value="">All Tasks</option>
            {getUniqueValues('task').map((task, index) => (
              <option key={index} value={task}>{task}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mt-2">
          <select
            className="form-select"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="">All Languages</option>
            {getUniqueValues('language').map((language, index) => (
              <option key={index} value={language}>{language}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item ">
          <button
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Active Projects
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'unhandled' ? 'active' : ''}`}
            onClick={() => setActiveTab('unhandled')}
          >
            Unhandled Projects
          </button>
        </li>
      </ul>

      {/* Projects Table */}
      <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table className="table-gradient-bg align-middle mt-0 table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>S. No.</th>
              <th>Project Title</th>
              <th>Client</th>
              <th>Task</th>
              <th>Language</th>
              <th>Platform</th>
              <th>Total Pages</th>
              <th>Due Date & Time</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <React.Fragment key={project.id}>
                <tr className={expandedRow === project.id ? 'table-active' : ''}>
                  <td>{index + 1}</td>
                  <td>{project.title}</td>
                  <td>{project.client}</td>
                  <td>{project.task}</td>
                  <td>{project.language}</td>
                  <td>{project.platform}</td>
                  <td>{project.totalPages}</td>
                  <td>{project.dueDate}</td>
                  <td>
                    <div 
                      className="progress cursor-pointer" 
                      style={{height: '24px'}}
                      onClick={() => handleViewProject(project)}
                    >
                      <div
                        className={`progress-bar 
                          ${project.progress < 30 ? 'bg-danger' : 
                            project.progress < 70 ? 'bg-warning' : 'bg-success'}`}
                        role="progressbar"
                        style={{width: `${project.progress}%`}}
                        aria-valuenow={project.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        {project.progress}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewProject(project)}
                      >
                        <i className={`fas ${expandedRow === project.id ? 'fa-chevron-up' : 'fa-eye'}`}></i>
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEditProject(project)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {project.progress === 100 && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleMarkComplete(project.id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded row with project details */}
                {expandedRow === project.id && (
                  <tr>
                    <td colSpan={10} className="p-0 border-top-0 ">
                      <div className="p-4">
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Project Files</h5>
                            {selectedFiles.length > 0 && (
                              <span className="badge bg-primary">
                                {selectedFiles.length} files selected
                              </span>
                            )}
                          </div>
                          
                          {/* Batch Edit Controls */}
                          {selectedFiles.length > 0 && (
                            <div className="card mb-4">
                              <div className="card-body bg-card">
                                <h6 className="card-title mb-3">Batch Edit</h6>
                                <div className="row g-3">
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">Platform</label>
                                    <select
                                      className="form-select form-select-sm"
                                      value={batchEditValues.platform}
                                      onChange={(e) => setBatchEditValues({...batchEditValues, platform: e.target.value})}
                                    >
                                      <option value="">Select</option>
                                      <option value="Web">Web</option>
                                      <option value="Mobile">Mobile</option>
                                      <option value="Desktop">Desktop</option>
                                    </select>
                                  </div>
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">Handler</label>
                                    <select
                                      className="form-select form-select-sm"
                                      value={batchEditValues.handler}
                                      onChange={(e) => setBatchEditValues({...batchEditValues, handler: e.target.value})}
                                    >
                                      <option value="">Select</option>
                                      <option value="John Doe">John Doe</option>
                                      <option value="Jane Smith">Jane Smith</option>
                                      <option value="Mike Johnson">Mike Johnson</option>
                                    </select>
                                  </div>
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">QA Reviewer</label>
                                    <select
                                      className="form-select form-select-sm"
                                      value={batchEditValues.qaReviewer}
                                      onChange={(e) => setBatchEditValues({...batchEditValues, qaReviewer: e.target.value})}
                                    >
                                      <option value="">Select</option>
                                      <option value="Sarah Williams">Sarah Williams</option>
                                      <option value="David Brown">David Brown</option>
                                      <option value="Emily Davis">Emily Davis</option>
                                    </select>
                                  </div>
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">QC Due</label>
                                    <input
                                      type="date"
                                      className="form-control form-control-sm"
                                      value={batchEditValues.qcDue}
                                      onChange={(e) => setBatchEditValues({...batchEditValues, qcDue: e.target.value})}
                                    />
                                  </div>
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">QC Hours</label>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={batchEditValues.qcAllocatedHours}
                                      onChange={(e) => setBatchEditValues({...batchEditValues, qcAllocatedHours: e.target.value})}
                                    />
                                  </div>
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">Priority</label>
                                    <select
                                      className="form-select form-select-sm"
                                      value={batchEditValues.priority}
                                      onChange={(e) => setBatchEditValues({...batchEditValues, priority: e.target.value})}
                                    >
                                      <option value="">Select</option>
                                      <option value="High">High</option>
                                      <option value="Medium">Medium</option>
                                      <option value="Low">Low</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <button
                                    className="btn gradient-button"
                                    onClick={applyBatchEdits}
                                  >
                                    Apply to Selected Files
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Files Table */}
                          <div className="table-responsive">
                            <table className="table table-sm table-striped table-hover">
                              <thead className="table-light">
                                <tr>
                                  <th>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      checked={selectedFiles.length === project.files.length}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedFiles([...project.files]);
                                        } else {
                                          setSelectedFiles([]);
                                        }
                                        setHasUnsavedChanges(true);
                                      }}
                                    />
                                  </th>
                                  <th>File Name</th>
                                  <th>Pages</th>
                                  <th>Language</th>
                                  <th>Platform</th>
                                  <th>Stage</th>
                                  <th>Assigned</th>
                                  <th>Handler</th>
                                  <th>QA Reviewer</th>
                                  <th>QA Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {project.files.map(file => (
                                  <tr key={file.id} className={selectedFiles.some(f => f.id === file.id) ? 'table-primary' : ''}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedFiles.some(f => f.id === file.id)}
                                        onChange={() => toggleFileSelection(file)}
                                      />
                                    </td>
                                    <td>{file.name}</td>
                                    <td>{file.pages}</td>
                                    <td>{file.language}</td>
                                    <td>
                                      <select
                                        className="form-select form-select-sm"
                                        value={file.platform}
                                        onChange={(e) => {
                                          const updatedFiles = project.files.map(f =>
                                            f.id === file.id ? {...f, platform: e.target.value} : f
                                          );
                                          setSelectedProject({...project, files: updatedFiles});
                                          setHasUnsavedChanges(true);
                                        }}
                                      >
                                        <option value="Web">Web</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Desktop">Desktop</option>
                                      </select>
                                    </td>
                                    <td>{file.stage}</td>
                                    <td>{file.assigned}</td>
                                    <td>
                                      <select
                                        className="form-select form-select-sm"
                                        value={file.handler || ''}
                                        onChange={(e) => {
                                          const updatedFiles = project.files.map(f =>
                                            f.id === file.id ? {...f, handler: e.target.value} : f
                                          );
                                          setSelectedProject({...project, files: updatedFiles});
                                          setHasUnsavedChanges(true);
                                        }}
                                      >
                                        <option value="">Not Assigned</option>
                                        <option value="John Doe">John Doe</option>
                                        <option value="Jane Smith">Jane Smith</option>
                                        <option value="Mike Johnson">Mike Johnson</option>
                                      </select>
                                    </td>
                                    <td>
                                      <select
                                        className="form-select form-select-sm"
                                        value={file.qaReviewer || ''}
                                        onChange={(e) => {
                                          const updatedFiles = project.files.map(f =>
                                            f.id === file.id ? {...f, qaReviewer: e.target.value} : f
                                          );
                                          setSelectedProject({...project, files: updatedFiles});
                                          setHasUnsavedChanges(true);
                                        }}
                                      >
                                        <option value="">Not Assigned</option>
                                        <option value="Sarah Williams">Sarah Williams</option>
                                        <option value="David Brown">David Brown</option>
                                        <option value="Emily Davis">Emily Davis</option>
                                      </select>
                                    </td>
                                    <td>{file.qaStatus}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        {/* Action buttons for expanded row */}
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-secondary rounded-5"
                            onClick={() => setExpandedRow(null)}
                          >
                            Close
                          </button>
                          {hasUnsavedChanges && (
                            <button
                              type="button"
                              className="btn gradient-button"
                            >
                              Save Changes
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project Detail Modal - Keeping this for potential future use */}
      {showDetailModal && selectedProject && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProject.title} - Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Project Files</h5>
                    {selectedFiles.length > 0 && (
                      <span className="badge bg-primary">
                        {selectedFiles.length} files selected
                      </span>
                    )}
                  </div>
                  
                  {/* Batch Edit Controls */}
                  {selectedFiles.length > 0 && (
                    <div className="card mb-4">
                      <div className="card-body">
                        <h6 className="card-title mb-3">Batch Edit</h6>
                        <div className="row g-3">
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">Platform</label>
                            <select
                              className="form-select form-select-sm"
                              value={batchEditValues.platform}
                              onChange={(e) => setBatchEditValues({...batchEditValues, platform: e.target.value})}
                            >
                              <option value="">Select</option>
                              <option value="Web">Web</option>
                              <option value="Mobile">Mobile</option>
                              <option value="Desktop">Desktop</option>
                            </select>
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">Handler</label>
                            <select
                              className="form-select form-select-sm"
                              value={batchEditValues.handler}
                              onChange={(e) => setBatchEditValues({...batchEditValues, handler: e.target.value})}
                            >
                              <option value="">Select</option>
                              <option value="John Doe">John Doe</option>
                              <option value="Jane Smith">Jane Smith</option>
                              <option value="Mike Johnson">Mike Johnson</option>
                            </select>
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">QA Reviewer</label>
                            <select
                              className="form-select form-select-sm"
                              value={batchEditValues.qaReviewer}
                              onChange={(e) => setBatchEditValues({...batchEditValues, qaReviewer: e.target.value})}
                            >
                              <option value="">Select</option>
                              <option value="Sarah Williams">Sarah Williams</option>
                              <option value="David Brown">David Brown</option>
                              <option value="Emily Davis">Emily Davis</option>
                            </select>
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">QC Due</label>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              value={batchEditValues.qcDue}
                              onChange={(e) => setBatchEditValues({...batchEditValues, qcDue: e.target.value})}
                            />
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">QC Hours</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={batchEditValues.qcAllocatedHours}
                              onChange={(e) => setBatchEditValues({...batchEditValues, qcAllocatedHours: e.target.value})}
                            />
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">Priority</label>
                            <select
                              className="form-select form-select-sm"
                              value={batchEditValues.priority}
                              onChange={(e) => setBatchEditValues({...batchEditValues, priority: e.target.value})}
                            >
                              <option value="">Select</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-3">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={applyBatchEdits}
                          >
                            Apply to Selected Files
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Files Table */}
                  <div className="table-responsive">
                    <table className="table table-sm table-striped table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedFiles.length === selectedProject.files.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFiles([...selectedProject.files]);
                                } else {
                                  setSelectedFiles([]);
                                }
                                setHasUnsavedChanges(true);
                              }}
                            />
                          </th>
                          <th>File Name</th>
                          <th>Pages</th>
                          <th>Language</th>
                          <th>Platform</th>
                          <th>Stage</th>
                          <th>Assigned</th>
                          <th>Handler</th>
                          <th>QA Reviewer</th>
                          <th>QA Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.files.map(file => (
                          <tr key={file.id} className={selectedFiles.some(f => f.id === file.id) ? 'table-primary' : ''}>
                            <td>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedFiles.some(f => f.id === file.id)}
                                onChange={() => toggleFileSelection(file)}
                              />
                            </td>
                            <td>{file.name}</td>
                            <td>{file.pages}</td>
                            <td>{file.language}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={file.platform}
                                onChange={(e) => {
                                  const updatedFiles = selectedProject.files.map(f =>
                                    f.id === file.id ? {...f, platform: e.target.value} : f
                                  );
                                  setSelectedProject({...selectedProject, files: updatedFiles});
                                  setHasUnsavedChanges(true);
                                }}
                              >
                                <option value="Web">Web</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Desktop">Desktop</option>
                              </select>
                            </td>
                            <td>{file.stage}</td>
                            <td>{file.assigned}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={file.handler || ''}
                                onChange={(e) => {
                                  const updatedFiles = selectedProject.files.map(f =>
                                    f.id === file.id ? {...f, handler: e.target.value} : f
                                  );
                                  setSelectedProject({...selectedProject, files: updatedFiles});
                                  setHasUnsavedChanges(true);
                                }}
                              >
                                <option value="">Not Assigned</option>
                                <option value="John Doe">John Doe</option>
                                <option value="Jane Smith">Jane Smith</option>
                                <option value="Mike Johnson">Mike Johnson</option>
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={file.qaReviewer || ''}
                                onChange={(e) => {
                                  const updatedFiles = selectedProject.files.map(f =>
                                    f.id === file.id ? {...f, qaReviewer: e.target.value} : f
                                  );
                                  setSelectedProject({...selectedProject, files: updatedFiles});
                                  setHasUnsavedChanges(true);
                                }}
                              >
                                <option value="">Not Assigned</option>
                                <option value="Sarah Williams">Sarah Williams</option>
                                <option value="David Brown">David Brown</option>
                                <option value="Emily Davis">Emily Davis</option>
                              </select>
                            </td>
                            <td>{file.qaStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
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
    </div>
  );
};

// Converts "hh:mm AM/PM DD-MM-YY" to "YYYY-MM-DDTHH:mm"
function customToInputDate(str) {
  // Example input: "01:23 PM 25-06-25"
  if (!str) return '';
  const match = str.match(/(\d{2}):(\d{2}) (AM|PM) (\d{2})-(\d{2})-(\d{2})/);
  if (!match) return '';
  let [_, hour, min, ampm, day, month, year] = match;
  hour = parseInt(hour, 10);
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  // Pad hour
  hour = hour.toString().padStart(2, '0');
  // Compose ISO string
  return `20${year}-${month}-${day}T${hour}:${min}`;
}

// Converts "YYYY-MM-DDTHH:mm" to "hh:mm AM/PM DD-MM-YY"
function inputToCustomDate(str) {
  // Example input: "2025-06-25T13:23"
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d)) return '';
  let hour = d.getHours();
  const min = d.getMinutes().toString().padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(2);
  return `${hour.toString().padStart(2, '0')}:${min} ${ampm} ${day}-${month}-${year}`;
}

// Generate dummy data function
const generateDummyProjects = (count)=> {
  const clients = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Inc', 'Stark Industries'];
  const tasks = ['Translation', 'Proofreading', 'QA Review', 'Editing', 'Formatting'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const platforms = ['Web', 'Mobile', 'Desktop'];
  const stages = ['In Progress', 'Review', 'Completed', 'On Hold'];
  const qaStatuses = ['Pending', 'In Progress', 'Approved', 'Rejected'];
  const handlers = ['John Doe', 'Jane Smith', 'Mike Johnson', ''];
  const qaReviewers = ['Sarah Williams', 'David Brown', 'Emily Davis', ''];
  
  const projects = [];
  
  for (let i = 1; i <= count; i++) {
    const totalPages = Math.floor(Math.random() * 100) + 10;
    const progress = Math.floor(Math.random() * 101);
    const handler = handlers[Math.floor(Math.random() * handlers.length)];
    
    // Generate random due date (between now and 30 days in the future)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    dueDate.setHours(hours, minutes);
    
    // Format due date as "hh:mm tt DD-MM-YY"
    const formattedDueDate = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'} ${dueDate.getDate().toString().padStart(2, '0')}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getFullYear().toString().slice(2)}`;
    
    // Generate files
    const fileCount = Math.floor(Math.random() * 5) + 1;
    const files = [];
    
    for (let j = 1; j <= fileCount; j++) {
      const filePages = Math.floor(Math.random() * 20) + 1;
      files.push({
        id: j,
        name: `File_${i}_${j}.docx`,
        pages: filePages,
        language: languages[Math.floor(Math.random() * languages.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        stage: stages[Math.floor(Math.random() * stages.length)],
        assigned: new Date(dueDate.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
        handler: handler,
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
      });
    }
    
    projects.push({
      id: i,
      title: `Project ${i}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      task: tasks[Math.floor(Math.random() * tasks.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      totalPages,
      dueDate: formattedDueDate,
      progress,
      handler,
      files
    });
  }
  
  return projects;
};

export default ActiveProject;