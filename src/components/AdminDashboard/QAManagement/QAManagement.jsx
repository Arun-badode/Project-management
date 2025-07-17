import React, { useState, useEffect } from "react";

const QAManagement = () => {
  const [activeTab, setActiveTab] = useState("taskPool");
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
    data: null,
  });

  // Sample data
  const [tasks, setTasks] = useState([
    {
      id: "QA-001",
      title: "Login Page Testing",
      module: "Authentication",
      priority: "High",
      createdBy: "John Doe",
      createdAt: "2024-06-15",
      status: "Open",
      assignedTo: null,
      lastUpdated: "2024-06-15",
      resultFile: null,
    },
    {
      id: "QA-002",
      title: "Payment Gateway Integration",
      module: "Payment",
      priority: "Critical",
      createdBy: "Jane Smith",
      createdAt: "2024-06-14",
      status: "In Progress",
      assignedTo: "Alice Johnson",
      lastUpdated: "2024-06-16",
      resultFile: null,
    },
    {
      id: "QA-003",
      title: "Dashboard UI Testing",
      module: "UI/UX",
      priority: "Medium",
      createdBy: "Mike Wilson",
      createdAt: "2024-06-13",
      status: "Completed",
      assignedTo: "Bob Brown",
      lastUpdated: "2024-06-17",
      resultFile: "test-results.pdf",
    },
    {
      id: "QA-004",
      title: "API Endpoint Validation",
      module: "Backend",
      priority: "High",
      createdBy: "Sarah Davis",
      createdAt: "2024-06-12",
      status: "Failed",
      assignedTo: "Charlie Wilson",
      lastUpdated: "2024-06-16",
      resultFile: null,
    },
    {
      id: "QA-005",
      title: "Mobile Responsiveness",
      module: "UI/UX",
      priority: "Low",
      createdBy: "Tom Anderson",
      createdAt: "2024-06-11",
      status: "Open",
      assignedTo: null,
      lastUpdated: "2024-06-11",
      resultFile: null,
    },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: "",
    user: "",
    module: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentUser] = useState("Current User"); // Simulated current user
  const [uploadForm, setUploadForm] = useState({
    taskId: "",
    file: null,
    fileType: "",
    comments: "",
  });

  // Toast notification
  const showToastMessage = (message, type = "success") => {
    setShowToast({ show: true, message, type });
    setTimeout(
      () => setShowToast({ show: false, message: "", type: "" }),
      3000
    );
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    const colors = {
      Critical: "danger",
      High: "warning",
      Medium: "info",
      Low: "secondary",
    };
    return colors[priority] || "secondary";
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      Open: "primary",
      "In Progress": "warning",
      Completed: "success",
      Failed: "danger",
      "Not Started": "secondary",
    };
    return colors[status] || "secondary";
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    return (
      (filters.search === "" ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.module.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.priority === "" || task.priority === filters.priority) &&
      (filters.status === "" || task.status === filters.status) &&
      (filters.user === "" || task.assignedTo === filters.user) &&
      (filters.module === "" || task.module === filters.module)
    );
  });

  // Self-assign task
  const selfAssignTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignedTo: currentUser,
              status: "In Progress",
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : task
      )
    );
    showToastMessage("Task successfully assigned to you!");
    setShowModal({ show: false, type: "", data: null });
  };

  // Update task status
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : task
      )
    );
    showToastMessage(`Task status updated to ${newStatus}!`);
    setShowModal({ show: false, type: "", data: null });
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!uploadForm.taskId || !uploadForm.file || !uploadForm.fileType) {
      showToastMessage("Please fill in all required fields!", "error");
      return;
    }

    const fileData = {
      taskId: uploadForm.taskId,
      fileName: uploadForm.file?.name || "test-file.pdf",
      fileType: uploadForm.fileType,
      comments: uploadForm.comments,
      serverPath: `/qa/uploads/${Date.now()}-${
        uploadForm.file?.name || "test-file.pdf"
      }`,
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    setUploadedFiles([...uploadedFiles, fileData]);
    showToastMessage("File uploaded successfully!");
    setUploadForm({ taskId: "", file: null, fileType: "", comments: "" });
  };

  return (
    <div className="p-4 py-4">
      {/* Toast Notification */}
      {showToast.show && (
        <div
          className={`toast position-fixed top-0 end-0 m-3 show`}
          style={{ zIndex: 1050 }}
        >
          <div
            className={`toast-header bg-${
              showToast.type === "error" ? "danger" : "success"
            } text-white`}
          >
            <strong className="me-auto">Notification</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() =>
                setShowToast({ show: false, message: "", type: "" })
              }
            ></button>
          </div>
          <div className="toast-body">{showToast.message}</div>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 mb-3 gradient-heading">QA Management Dashboard</h1>
          <div className="row ">
            <div className="col-md-3  col-sm-6 mb-3">
              <div className="card bg-card text-white">
                <div className="card-body  ">
                  <h5>Total Tasks</h5>
                  <h2>{tasks.length}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-card text-white">
                <div className="card-body ">
                  <h5>In Progress</h5>
                  <h2>
                    {tasks.filter((t) => t.status === "In Progress").length}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-card text-white">
                <div className="card-body ">
                  <h5>Completed</h5>
                  <h2>
                    {tasks.filter((t) => t.status === "Completed").length}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-card text-white">
                <div className="card-body ">
                  <h5>Open Tasks</h5>
                  <h2>{tasks.filter((t) => t.status === "Open").length}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "taskPool" ? "active" : ""}`}
            onClick={() => setActiveTab("taskPool")}
          >
            📋 QA Task Pool
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "selfAssign" ? "active" : ""}`}
            onClick={() => setActiveTab("selfAssign")}
          >
            👤 Self-Assign Tasks
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "completion" ? "active" : ""}`}
            onClick={() => setActiveTab("completion")}
          >
            ✅ Completion Status
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            📁 Server Path Upload
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content ">
        {/* Tab 1: QA Task Pool */}
        {activeTab === "taskPool" && (
          <div className="card bg-card">
            <div className="card-header">
              <h5>QA Task Pool</h5>
            </div>
            <div className="card-body ">
              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-4 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title or module..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-2 mb-2">
                  <select
                    className="form-select"
                    value={filters.priority}
                    onChange={(e) =>
                      setFilters({ ...filters, priority: e.target.value })
                    }
                  >
                    <option value="">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="col-md-2 mb-2">
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Tasks Table */}
              <div className="d-none d-lg-block">
                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <table className="table table-gradient-bg mb-0">
                    <thead
                      className="table-gradient-bg table "
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 0,
                        backgroundColor: "#fff", // Match your background color
                      }}
                    >
                      <tr  className="text-center">
                        <th>Task ID</th>
                        <th>Title</th>
                        <th>Module</th>
                        <th>Priority</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {filteredTasks.map((task) => (
                        <tr key={task.id}  >
                          <td>
                            <code>{task.id}</code>
                          </td>
                          <td>{task.title}</td>
                          <td>{task.module}</td>
                          <td>
                            <span
                              className={`badge bg-${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td>{task.createdBy}</td>
                          <td>{task.createdAt}</td>
                          <td>
                            <span
                              className={`badge bg-${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() =>
                                setShowModal({
                                  show: true,
                                  type: "viewDetails",
                                  data: task,
                                })
                              }
                            >
                              👁️ View
                            </button>
                            {task.status === "Open" && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  setShowModal({
                                    show: true,
                                    type: "selfAssign",
                                    data: task,
                                  })
                                }
                              >
                                ✋ Self-Assign
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="d-lg-none">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="card mb-3">
                    <div className="card-body bg-card">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{task.title}</h6>
                        <span
                          className={`badge bg-${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="card-text small  mb-2">
                        <strong>ID:</strong> {task.id} |{" "}
                        <strong>Module:</strong> {task.module}
                      </p>
                      <div className="mb-2">
                        <span
                          className={`badge bg-${getPriorityColor(
                            task.priority
                          )} me-2`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="card-text small">
                        <strong>Created by:</strong> {task.createdBy}
                        <br />
                        <strong>Created:</strong> {task.createdAt}
                      </p>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setShowModal({
                              show: true,
                              type: "viewDetails",
                              data: task,
                            })
                          }
                        >
                          👁️ View
                        </button>
                        {task.status === "Open" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              setShowModal({
                                show: true,
                                type: "selfAssign",
                                data: task,
                              })
                            }
                          >
                            ✋ Self-Assign
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Self-Assign QA Tasks */}
        {activeTab === "selfAssign" && (
          <div className="card bg-card">
            <div className="card-header ">
              <h5>Available Tasks for Self-Assignment</h5>
            </div>
            <div className="card-body  ">
              <div className="row">
                {tasks
                  .filter((task) => task.status === "Open")
                  .map((task) => (
                    <div key={task.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card bg-card h-100">
                        <div className="card-body">
                          <h6 className="card-title">{task.title}</h6>
                          <p className="card-text">
                            <small className="">ID: {task.id}</small>
                            <br />
                            <span className="badge bg-secondary me-1">
                              {task.module}
                            </span>
                            <span
                              className={`badge bg-${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </p>
                          <p className="card-text">
                            Created by: {task.createdBy}
                          </p>
                          <p className="card-text">
                            <small className="">
                              Created: {task.createdAt}
                            </small>
                          </p>
                          <button
                            className="btn btn-primary w-100"
                            onClick={() =>
                              setShowModal({
                                show: true,
                                type: "selfAssign",
                                data: task,
                              })
                            }
                          >
                            ✋ Self-Assign Task
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: QA Completion Status */}
        {activeTab === "completion" && (
          <div className="card bg-card ">
            <div className="card-header">
              <h5>QA Completion Status</h5>
            </div>
            <div className="card-body ">
              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-3 mb-2">
                  <select
                    className="form-select"
                    value={filters.user}
                    onChange={(e) =>
                      setFilters({ ...filters, user: e.target.value })
                    }
                  >
                    <option value="">All Users</option>
                    <option value="Alice Johnson">Alice Johnson</option>
                    <option value="Bob Brown">Bob Brown</option>
                    <option value="Charlie Wilson">Charlie Wilson</option>
                  </select>
                </div>
                <div className="col-md-3 mb-2 ">
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">All Status</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="col-md-3 mb-2">
                  <select
                    className="form-select"
                    value={filters.module}
                    onChange={(e) =>
                      setFilters({ ...filters, module: e.target.value })
                    }
                  >
                    <option value="">All Modules</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Payment">Payment</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Backend">Backend</option>
                  </select>
                </div>
              </div>

              {/* Status Table */}
              <div className="d-none d-lg-block">
                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <table className="table text-white table-gradient-bg table-hover table-bordered mb-0">
                    <thead
                      className="table-gradient-bg table "
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 0,
                        backgroundColor: "#fff", // Match your background color
                      }}
                    >
                      <tr  className="text-center">
                        <th>Task ID</th>
                        <th>Title</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                        <th>Result File</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks
                        .filter((task) => task.assignedTo)
                        .map((task) => (
                          <tr key={task.id}  >
                            <td>
                              <code>{task.id}</code>
                            </td>
                            <td>{task.title}</td>
                            <td>{task.assignedTo}</td>
                            <td>
                              <span
                                className={`badge bg-${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {task.status}
                              </span>
                            </td>
                            <td>{task.lastUpdated}</td>
                            <td>
                              {task.resultFile ? (
                                <a href="#" className="text-success">
                                  📄 {task.resultFile}
                                </a>
                              ) : (
                                <span className="">No file</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() =>
                                  setShowModal({
                                    show: true,
                                    type: "updateStatus",
                                    data: task,
                                  })
                                }
                              >
                                ✏️ Update
                              </button>
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() =>
                                  setShowModal({
                                    show: true,
                                    type: "viewDetails",
                                    data: task,
                                  })
                                }
                              >
                                👁️ View
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="d-lg-none">
                {filteredTasks
                  .filter((task) => task.assignedTo)
                  .map((task) => (
                    <div key={task.id} className="card mb-3">
                      <div className="card-body bg-card">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-0">{task.title}</h6>
                          <span
                            className={`badge bg-${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="card-text small text-muted mb-2">
                          <strong>ID:</strong> {task.id}
                        </p>
                        <p className="card-text small">
                          <strong>Assigned to:</strong> {task.assignedTo}
                          <br />
                          <strong>Last Updated:</strong> {task.lastUpdated}
                        </p>
                        {task.resultFile && (
                          <p className="card-text small">
                            <strong>Result File:</strong>{" "}
                            <a href="#" className="text-success">
                              📄 {task.resultFile}
                            </a>
                          </p>
                        )}
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              setShowModal({
                                show: true,
                                type: "updateStatus",
                                data: task,
                              })
                            }
                          >
                            ✏️ Update
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() =>
                              setShowModal({
                                show: true,
                                type: "viewDetails",
                                data: task,
                              })
                            }
                          >
                            👁️ View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Server Path Upload */}
        {activeTab === "upload" && (
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="card bg-card h-100">
                <div className="card-header ">
                  <h5 className="mb-0">Upload QA Files</h5>
                </div>
                <div className="card-body ">
                  <div>
                    <div className="mb-3">
                      <label className="form-label">Task ID</label>
                      <select
                        className="form-select"
                        value={uploadForm.taskId}
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            taskId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Task</option>
                        {tasks.map((task) => (
                          <option key={task.id} value={task.id}>
                            {task.id} - {task.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">File</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            file: e.target.files[0],
                          })
                        }
                        accept=".pdf,.doc,.docx,.xlsx,.png,.jpg"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">File Type</label>
                      <select
                        className="form-select"
                        value={uploadForm.fileType}
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            fileType: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Type</option>
                        <option value="Test Report">Test Report</option>
                        <option value="Screenshot">Screenshot</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Comments (Optional)</label>
                      <textarea
                        className="form-control"
                        value={uploadForm.comments}
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            comments: e.target.value,
                          })
                        }
                        rows="3"
                        placeholder="Add any additional comments..."
                      ></textarea>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={handleFileUpload}
                    >
                      📤 Upload File
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="card bg-card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Uploaded Files</h5>
                </div>
                <div className="card-body">
                  {uploadedFiles.length === 0 ? (
                    <p className="">No files uploaded yet.</p>
                  ) : (
                    <div className="list-group  list-group-flush">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="list-group-item bg-card px-0"
                        >
                          <div className="d-flex w-100 justify-content-between align-items-start">
                            <h6 className="mb-1 text-truncate me-2">
                              {file.fileName}
                            </h6>
                            <small className="text-nowrap">
                              {file.uploadedAt}
                            </small>
                          </div>
                          <p className="mb-1 small">
                            <span className="badge bg-secondary me-1">
                              {file.taskId}
                            </span>
                            <span className="badge bg-info">
                              {file.fileType}
                            </span>
                          </p>
                          <small className=" d-block text-break">
                            Server Path: {file.serverPath}
                          </small>
                          {file.comments && (
                            <p className="mb-2 mt-1 small text-break">
                              Comments: {file.comments}
                            </p>
                          )}
                          <div className="mt-2 d-flex flex-wrap gap-1">
                            <button className="btn btn-sm btn-outline-primary">
                              📥 Download
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              👁️ Preview
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal.show && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* View Details Modal */}
              {showModal.type === "viewDetails" && (
                <>
                  <div className="modal-header bg-card">
                    <h5 className="modal-title">
                      Task Details - {showModal.data.id}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        setShowModal({ show: false, type: "", data: null })
                      }
                    ></button>
                  </div>
                  <div className="modal-body bg-card">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Title:</strong> {showModal.data.title}
                        </p>
                        <p>
                          <strong>Module:</strong> {showModal.data.module}
                        </p>
                        <p>
                          <strong>Priority:</strong>{" "}
                          <span
                            className={`badge bg-${getPriorityColor(
                              showModal.data.priority
                            )}`}
                          >
                            {showModal.data.priority}
                          </span>
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            className={`badge bg-${getStatusColor(
                              showModal.data.status
                            )}`}
                          >
                            {showModal.data.status}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Created By:</strong>{" "}
                          {showModal.data.createdBy}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {showModal.data.createdAt}
                        </p>
                        <p>
                          <strong>Assigned To:</strong>{" "}
                          {showModal.data.assignedTo || "Unassigned"}
                        </p>
                        <p>
                          <strong>Last Updated:</strong>{" "}
                          {showModal.data.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h6>Task Description:</h6>
                      <p className="">
                        This is a detailed description of the QA task that needs
                        to be performed. It includes specific requirements, test
                        cases, and expected outcomes.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Self Assign Modal */}
              {showModal.type === "selfAssign" && (
                <>
                  <div className="modal-header bg-card">
                    <h5 className="modal-title">Self-Assign Task</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        setShowModal({ show: false, type: "", data: null })
                      }
                    ></button>
                  </div>
                  <div className="modal-body bg-card">
                    <p>
                      Are you sure you want to assign{" "}
                      <strong>{showModal.data.title}</strong> to yourself?
                    </p>
                    <div className="alert alert-info text-dark">
                      <strong>Task Details:</strong>
                      <br />
                      ID: {showModal.data.id}
                      <br />
                      Module: {showModal.data.module}
                      <br />
                      Priority: {showModal.data.priority}
                    </div>
                  </div>
                  <div className="modal-footer bg-card">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        setShowModal({ show: false, type: "", data: null })
                      }
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => selfAssignTask(showModal.data.id)}
                    >
                      ✋ Confirm Assignment
                    </button>
                  </div>
                </>
              )}

              {/* Update Status Modal */}
              {showModal.type === "updateStatus" && (
                <>
                  <div className="modal-header bg-card">
                    <h5 className="modal-title">Update Task Status</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        setShowModal({ show: false, type: "", data: null })
                      }
                    ></button>
                  </div>
                  <div className="modal-body bg-card">
                    <p>
                      Update status for: <strong>{showModal.data.title}</strong>
                    </p>
                    <p>
                      Current Status:{" "}
                      <span
                        className={`badge bg-${getStatusColor(
                          showModal.data.status
                        )}`}
                      >
                        {showModal.data.status}
                      </span>
                    </p>
                    <div className="mt-3">
                      <button
                        className="btn btn-warning me-2 mb-2"
                        onClick={() =>
                          updateTaskStatus(showModal.data.id, "In Progress")
                        }
                      >
                        🔄 In Progress
                      </button>
                      <button
                        className="btn btn-success me-2 mb-2"
                        onClick={() =>
                          updateTaskStatus(showModal.data.id, "Completed")
                        }
                      >
                        ✅ Completed
                      </button>
                      <button
                        className="btn btn-danger me-2 mb-2"
                        onClick={() =>
                          updateTaskStatus(showModal.data.id, "Failed")
                        }
                      >
                        ❌ Failed
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAManagement;
