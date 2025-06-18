

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  File, 
  Download, 
  Eye, 
  Trash2, 
  Search, 
  Filter,
  CheckSquare,
  Square,
  Archive,
  Clock,
  User,
  FolderOpen,
  Home,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X,
  Plus
} from 'lucide-react';

// Mock data
const mockFiles = [
  {
    id: 1,
    name: 'project-requirements.pdf',
    project: 'Website Redesign',
    task: 'Requirements Analysis',
    uploadedBy: 'John Doe',
    uploadDate: '2024-06-15',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    status: 'In Use',
    serverPath: '/uploads/projects/website-redesign/requirements/project-requirements.pdf',
    uploadStatus: 'Success'
  },
  {
    id: 2,
    name: 'design-mockup.png',
    project: 'Website Redesign',
    task: 'UI Design',
    uploadedBy: 'Jane Smith',
    uploadDate: '2024-06-14',
    fileSize: '1.8 MB',
    fileType: 'PNG',
    status: 'In Use',
    serverPath: '/uploads/projects/website-redesign/design/design-mockup.png',
    uploadStatus: 'Success'
  },
  {
    id: 3,
    name: 'database-schema.docx',
    project: 'Database Migration',
    task: 'Schema Design',
    uploadedBy: 'Mike Johnson',
    uploadDate: '2024-06-13',
    fileSize: '856 KB',
    fileType: 'DOCX',
    status: 'Archived',
    serverPath: '/uploads/projects/database-migration/schema/database-schema.docx',
    uploadStatus: 'Failed'
  },
  {
    id: 4,
    name: 'api-documentation.pdf',
    project: 'API Development',
    task: 'Documentation',
    uploadedBy: 'Sarah Wilson',
    uploadDate: '2024-06-12',
    fileSize: '3.2 MB',
    fileType: 'PDF',
    status: 'In Use',
    serverPath: '/uploads/projects/api-development/docs/api-documentation.pdf',
    uploadStatus: 'Success'
  }
];

const mockProjects = ['Website Redesign', 'Database Migration', 'API Development', 'Mobile App'];
const mockTasks = {
  'Website Redesign': ['Requirements Analysis', 'UI Design', 'Development', 'Testing'],
  'Database Migration': ['Schema Design', 'Data Migration', 'Testing'],
  'API Development': ['Planning', 'Development', 'Documentation', 'Testing'],
  'Mobile App': ['Design', 'Development', 'Testing']
};

const FileManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [files, setFiles] = useState(mockFiles);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'PDF': return <FileText className="text-danger" size={16} />;
      case 'PNG': case 'JPG': case 'JPEG': return <Image className="text-info" size={16} />;
      case 'DOCX': case 'DOC': return <FileText className="text-primary" size={16} />;
      default: return <File className="text-secondary" size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    const badgeClass = status === 'In Use' ? 'bg-success' : 'bg-secondary';
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  const getUploadStatusIcon = (status) => {
    return status === 'Success' ? 
      <CheckCircle className="text-success" size={16} /> : 
      <AlertCircle className="text-danger" size={16} />;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFiles = React.useMemo(() => {
    let sortableFiles = [...files];
    if (sortConfig.key) {
      sortableFiles.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFiles;
  }, [files, sortConfig]);

  const filteredFiles = sortedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.task.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !selectedProject || file.project === selectedProject;
    const matchesTask = !selectedTask || file.task === selectedTask;
    return matchesSearch && matchesProject && matchesTask;
  });

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleDelete = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setFiles(prev => prev.filter(file => file.id !== fileToDelete.id));
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setShowPreviewModal(true);
  };

  const handleBatchDownload = () => {
    const selectedFileNames = files
      .filter(file => selectedFiles.includes(file.id))
      .map(file => file.name);
    alert(`Downloading ${selectedFileNames.length} files: ${selectedFileNames.join(', ')}`);
  };

  const getTotalSize = (fileIds) => {
    return files
      .filter(file => fileIds.includes(file.id))
      .reduce((total, file) => {
        const size = parseFloat(file.fileSize);
        return total + size;
      }, 0)
      .toFixed(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedProject('');
    setSelectedTask('');
  };

  const availableTasks = selectedProject ? mockTasks[selectedProject] || [] : [];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-md-3 col-lg-2 bg-light  p-3">
          <h5 className="">File Management</h5>
          <nav className="nav flex-column ">
            <button 
              className={`nav-link btn btn-link text-start text-dark ${activeTab === 'files' ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              <FolderOpen size={16} className="me-2 " />
              Uploaded Files
            </button>
            <button 
              className={`nav-link btn btn-link text-start text-dark ${activeTab === 'search' ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <Search size={16} className="me-2" />
              Search Files
            </button>
            <button 
              className={`nav-link btn btn-link text-start text-dark ${activeTab === 'logs' ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <Clock size={16} className="me-2" />
              Server Logs
            </button>
            <button 
              className={`nav-link btn btn-link text-start text-dark ${activeTab === 'download' ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab('download')}
            >
              <Download size={16} className="me-2" />
              Download Center
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item   ">
                <Home size={16} className="me-1" />
                Dashboard
              </li>
              
              {selectedProject && (
                <>
                  <li className="breadcrumb-item">{selectedProject}</li>
                  {selectedTask && <li className="breadcrumb-item active">{selectedTask}</li>}
                </>
              )}
            </ol>
          </nav>

          {/* Uploaded Files List */}
          {activeTab === 'files' && (
            <div>
              <div className="d-flex justify-content-between  align-items-center mb-4">
                <h3>📋 Uploaded Files List</h3>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '250px' }}
                  />
                  <button className="btn btn-outline-secondary" onClick={resetFilters}>
                    Clear
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>
                        <button 
                          className="btn btn-sm btn-link p-0"
                          onClick={handleSelectAll}
                        >
                          {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 ? 
                            <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                      </th>
                      <th>Type</th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSort('name')}
                        style={{ cursor: 'pointer' }}
                      >
                        File Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('project')} style={{ cursor: 'pointer' }}>
                        Project {sortConfig.key === 'project' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Task</th>
                      <th>Uploaded By</th>
                      <th onClick={() => handleSort('uploadDate')} style={{ cursor: 'pointer' }}>
                        Date {sortConfig.key === 'uploadDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('fileSize')} style={{ cursor: 'pointer' }}>
                        Size {sortConfig.key === 'fileSize' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map(file => (
                      <tr key={file.id}>
                        <td>
                          <button 
                            className="btn btn-sm btn-link p-0"
                            onClick={() => handleFileSelect(file.id)}
                          >
                            {selectedFiles.includes(file.id) ? 
                              <CheckSquare size={16} /> : <Square size={16} />}
                          </button>
                        </td>
                        <td>{getFileIcon(file.fileType)}</td>
                        <td className="fw-semibold">{file.name}</td>
                        <td>{file.project}</td>
                        <td>{file.task}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <User size={14} className="me-1" />
                            {file.uploadedBy}
                          </div>
                        </td>
                        <td>{file.uploadDate}</td>
                        <td>{file.fileSize}</td>
                        <td>{getStatusBadge(file.status)}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => handlePreview(file)}
                              title="Preview"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              className="btn btn-outline-success"
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                            <button 
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(file)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredFiles.length === 0 && (
                <div className="text-center py-5">
                  <AlertCircle size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No files found</h5>
                  <p className="text-muted">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {/* Search by Project/Task */}
          {activeTab === 'search' && (
            <div>
              <h3 className="mb-4">🔍 Search by Project / Task</h3>
              
              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label">Project</label>
                  <select 
                    className="form-select"
                    value={selectedProject}
                    onChange={(e) => {
                      setSelectedProject(e.target.value);
                      setSelectedTask(''); // Reset task when project changes
                    }}
                  >
                    <option value="">Select Project...</option>
                    {mockProjects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label">Task</label>
                  <select 
                    className="form-select"
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    disabled={!selectedProject}
                  >
                    <option value="">Select Task...</option>
                    {availableTasks.map(task => (
                      <option key={task} value={task}>{task}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 d-flex  align-items-end">
                  <button 
                    className="btn btn-primary me-2 mt-2"
                    onClick={() => {/* Search logic already applied via filteredFiles */}}
                  >
                    <Search size={16} className="me-1" />
                    Search
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {(selectedProject || selectedTask) && (
                <div className="alert alert-info">
                  <strong>Showing files for:</strong> 
                  {selectedProject && ` ${selectedProject}`}
                  {selectedTask && ` > ${selectedTask}`}
                  <span className="ms-2 badge bg-primary">{filteredFiles.length} files found</span>
                </div>
              )}

              {/* Reuse the same table from files tab */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Type</th>
                      <th>File Name</th>
                      <th>Project</th>
                      <th>Task</th>
                      <th>Uploaded By</th>
                      <th>Date</th>
                      <th>Size</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map(file => (
                      <tr key={file.id}>
                        <td>{getFileIcon(file.fileType)}</td>
                        <td className="fw-semibold">{file.name}</td>
                        <td>{file.project}</td>
                        <td>{file.task}</td>
                        <td>{file.uploadedBy}</td>
                        <td>{file.uploadDate}</td>
                        <td>{file.fileSize}</td>
                        <td>{getStatusBadge(file.status)}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary">
                              <Eye size={14} />
                            </button>
                            <button className="btn btn-outline-success">
                              <Download size={14} />
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

          {/* File Server Path Logs */}
          {activeTab === 'logs' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>🗂 File Server Path Logs</h3>
                <button className="btn btn-outline-primary">
                  Export to CSV
                </button>
              </div>

              <div className="accordion" id="logsAccordion">
                {files.map((file, index) => (
                  <div className="accordion-item" key={file.id}>
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index}`}
                      >
                        <div className="d-flex align-items-center w-100">
                          {getUploadStatusIcon(file.uploadStatus)}
                          <span className="ms-2 fw-semibold">{file.name}</span>
                          <small className="ms-auto text-muted">{file.uploadDate}</small>
                        </div>
                      </button>
                    </h2>
                    <div 
                      id={`collapse${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#logsAccordion"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-md-6">
                            <strong>Server Path:</strong>
                            <code className="d-block mt-1 p-2 bg-light rounded">
                              {file.serverPath}
                            </code>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Uploaded By:</strong> {file.uploadedBy}</p>
                            <p><strong>Upload Date:</strong> {file.uploadDate}</p>
                            <p><strong>Status:</strong> 
                              <span className={`ms-2 badge ${file.uploadStatus === 'Success' ? 'bg-success' : 'bg-danger'}`}>
                                {file.uploadStatus}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Center */}
          {activeTab === 'download' && (
            <div>
              <h3 className="mb-4">⬇️ Download Center</h3>
              
              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-3 ">
                  <select className="form-select mt-1 " value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    <option value="">All Projects</option>
                    {mockProjects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <select className="form-select mt-1">
                    <option value="">All File Types</option>
                    <option value="PDF">PDF</option>
                    <option value="PNG">Images</option>
                    <option value="DOCX">Documents</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Search files to download..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Selection Summary */}
              {selectedFiles.length > 0 && (
                <div className="alert alert-primary d-flex justify-content-between align-items-center sticky-top mb-4">
                  <div>
                    <strong>{selectedFiles.length} files selected</strong>
                    <span className="ms-2">Total size: {getTotalSize(selectedFiles)} MB</span>
                  </div>
                  <div>
                    <button 
                      className="btn btn-success me-2"
                      onClick={handleBatchDownload}
                    >
                      <Download size={16} className="me-1" />
                      Download Selected
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setSelectedFiles([])}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}

              {/* Files Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>
                        <button 
                          className="btn btn-sm btn-link p-0"
                          onClick={handleSelectAll}
                        >
                          {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 ? 
                            <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                      </th>
                      <th>Type</th>
                      <th>File Name</th>
                      <th>Project</th>
                      <th>Size</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map(file => (
                      <tr key={file.id}>
                        <td>
                          <button 
                            className="btn btn-sm btn-link p-0"
                            onClick={() => handleFileSelect(file.id)}
                          >
                            {selectedFiles.includes(file.id) ? 
                              <CheckSquare size={16} /> : <Square size={16} />}
                          </button>
                        </td>
                        <td>{getFileIcon(file.fileType)}</td>
                        <td className="fw-semibold">{file.name}</td>
                        <td>{file.project}</td>
                        <td>{file.fileSize}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-success">
                            <Download size={14} className="me-1" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{fileToDelete?.name}</strong>?</p>
                <p className="text-muted">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  <Trash2 size={16} className="me-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview: {previewFile?.name}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowPreviewModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                {previewFile?.fileType === 'PNG' || previewFile?.fileType === 'JPG' ? (
                  <div className="bg-light p-4 rounded">
                    <Image size={64} className="text-muted" />
                    <p className="mt-2 text-muted">Image preview would appear here</p>
                  </div>
                ) : (
                  <div className="bg-light p-4 rounded">
                    <FileText size={64} className="text-muted" />
                    <p className="mt-2 text-muted">Document preview would appear here</p>
                  </div>
                )}
                <div className="mt-3">
                  <p><strong>Project:</strong> {previewFile?.project}</p>
                  <p><strong>Task:</strong> {previewFile?.task}</p>
                  <p><strong>Size:</strong> {previewFile?.fileSize}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPreviewModal(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  <Download size={16} className="me-1" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManagementSystem;