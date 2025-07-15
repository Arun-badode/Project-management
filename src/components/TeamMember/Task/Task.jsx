import React, { useState, useEffect } from "react";

function Task() {
  const [allTasks, setAllTasks] = useState([
    {
      id: 1,
      name: "Design Homepage Layout",
      status: "YTS",
      project: "Website Redesign",
      dueDate: "2025-06-25",
      assignee: "John Doe",
      priority: "High",
      files: ["homepage_mockup.psd", "assets_list.xlsx"],
      comments: [
        {
          user: "Project Manager",
          text: "Please follow the brand guidelines",
          date: "2025-06-17",
        },
      ],
      timeTracked: 0,
      serverPath: "",
    },
    {
      id: 2,
      name: "Implement User Authentication",
      status: "WIP",
      project: "Mobile App Development",
      dueDate: "2025-06-23",
      assignee: "Jane Smith",
      priority: "Critical",
      files: ["auth_flow.pdf", "api_docs.md"],
      comments: [
        {
          user: "Backend Dev",
          text: "API endpoints are ready for integration",
          date: "2025-06-18",
        },
      ],
      timeTracked: 4.5,
      serverPath: "",
    },
    {
      id: 3,
      name: "QA Testing for Payment Module",
      status: "QC YTS",
      project: "E-commerce Application",
      dueDate: "2025-06-21",
      assignee: "Current User",
      priority: "Medium",
      files: ["test_cases.xlsx", "payment_flow.pdf"],
      comments: [
        {
          user: "Developer",
          text: "All payment gateways have been integrated",
          date: "2025-06-16",
        },
      ],
      timeTracked: 0,
      serverPath: "",
    },
    {
      id: 4,
      name: "Fix Navigation Bug",
      status: "Corr WIP",
      project: "Mobile App Development",
      dueDate: "2025-06-20",
      assignee: "Current User",
      priority: "High",
      files: ["bug_report.pdf", "screenshots.zip"],
      comments: [
        {
          user: "QA Tester",
          text: "Bug occurs on iOS devices only",
          date: "2025-06-15",
        },
      ],
      timeTracked: 2.5,
      serverPath: "",
    },
    {
      id: 5,
      name: "Dashboard UI Design",
      status: "WIP",
      project: "Design System",
      dueDate: "2025-06-22",
      assignee: "Current User",
      priority: "High",
      files: ["dashboard_wireframes.fig"],
      comments: [
        {
          user: "Design Lead",
          text: "Follow design system guidelines",
          date: "2025-06-19",
        },
      ],
      timeTracked: 1.25,
      serverPath: "",
    },
  ]);

  // Filter tasks to show only those assigned to "Current User"
  const [tasks, setTasks] = useState(
    allTasks.filter(task => task.assignee === "Current User" || task.status === "QC YTS")
  );

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [serverPath, setServerPath] = useState("");
  const [notes, setNotes] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  const [serverPathError, setServerPathError] = useState("");

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!timerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTaskAction = (taskId, action) => {
    const taskIndex = allTasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;

    const updatedAllTasks = [...allTasks];
    const task = { ...updatedAllTasks[taskIndex] };

    switch (action) {
      case "start":
        // If another task is active, pause it first
        if (activeTaskId && activeTaskId !== taskId) {
          const activeTaskIndex = allTasks.findIndex((t) => t.id === activeTaskId);
          if (activeTaskIndex !== -1) {
            updatedAllTasks[activeTaskIndex] = {
              ...updatedAllTasks[activeTaskIndex],
              status: "WIP (Paused)",
            };
          }
        }

        task.status = "WIP";
        task.assignee = "Current User"; // Assign to current user when starting
        setActiveTaskId(taskId);
        setTimerRunning(true);
        setTimerSeconds(0);
        setShowTimerModal(true);
        break;
      case "pause":
        task.status = "WIP (Paused)";
        setTimerRunning(false);
        // Update time tracked for the task
        task.timeTracked += timerSeconds / 3600; // Convert seconds to hours
        setTimerSeconds(0);
        setActiveTaskId(null);
        break;
      case "complete":
        setSelectedTask(task);
        setShowCompleteModal(true);
        return;
      case "self-assign":
        task.status = "QC WIP";
        task.assignee = "Current User";
        break;
      case "reassign":
        setSelectedTask(task);
        setShowReassignModal(true);
        return;
      case "details":
        setSelectedTask(task);
        setShowDetailsModal(true);
        return;
      case "switch":
        // Pause current task
        if (activeTaskId) {
          const activeTaskIndex = allTasks.findIndex((t) => t.id === activeTaskId);
          if (activeTaskIndex !== -1) {
            updatedAllTasks[activeTaskIndex] = {
              ...updatedAllTasks[activeTaskIndex],
              status: "WIP (Paused)",
              timeTracked:
                updatedAllTasks[activeTaskIndex].timeTracked + timerSeconds / 3600,
            };
          }
        }
        // Start new task
        task.status = "WIP";
        task.assignee = "Current User"; // Assign to current user when switching
        setActiveTaskId(taskId);
        setTimerRunning(true);
        setTimerSeconds(0);
        setShowTimerModal(true);
        break;
      default:
        return;
    }

    updatedAllTasks[taskIndex] = task;
    setAllTasks(updatedAllTasks);
    // Update filtered tasks
    setTasks(updatedAllTasks.filter(task => task.assignee === "Current User" || task.status === "QC YTS"));
  };

  const handleCompleteTask = () => {
    if (!serverPath.trim()) {
      setServerPathError("Server Path is required");
      return;
    }

    const taskIndex = allTasks.findIndex((task) => task.id === selectedTask.id);
    if (taskIndex === -1) return;

    const updatedAllTasks = [...allTasks];
    const task = { ...updatedAllTasks[taskIndex] };

    if (task.status === "WIP") {
      task.status = "QC YTS";
    } else if (task.status === "Corr WIP") {
      task.status = "RFD";
    }

    // Add tracked time
    if (activeTaskId === task.id) {
      task.timeTracked += timerSeconds / 3600;
      setTimerRunning(false);
      setTimerSeconds(0);
      setActiveTaskId(null);
    }

    task.serverPath = serverPath;
    updatedAllTasks[taskIndex] = task;

    setAllTasks(updatedAllTasks);
    // Update filtered tasks
    setTasks(updatedAllTasks.filter(task => task.assignee === "Current User" || task.status === "QC YTS"));
    setShowCompleteModal(false);
    setServerPath("");
    setNotes("");
    setServerPathError("");
  };

  const handleReassignRequest = () => {
    alert(
      `Reassignment requested for task "${selectedTask.name}" with reason: ${reassignReason}`
    );
    setShowReassignModal(false);
    setReassignReason("");
  };

  const renderActionButtons = (task) => {
    return (
      <div className="d-flex flex-wrap gap-2">
        {(task.status === "YTS" || task.status === "WIP (Paused)") && (
          <button
            onClick={() => handleTaskAction(task.id, "start")}
            className="btn btn-primary btn-sm"
          >
            <i className="fas fa-play me-2"></i>
            {task.status === "YTS" ? "Start Work" : "Resume Work"}
          </button>
        )}
        {task.status === "WIP" && (
          <button
            onClick={() => handleTaskAction(task.id, "pause")}
            className="btn btn-warning btn-sm"
          >
            <i className="fas fa-pause me-2"></i>
            Pause Work
          </button>
        )}
        {(task.status === "WIP" || task.status === "Corr WIP") && (
          <button
            onClick={() => handleTaskAction(task.id, "complete")}
            className="btn btn-success btn-sm"
          >
            <i className="fas fa-check me-2"></i>
            Complete Task
          </button>
        )}
        {task.status === "QC YTS" && (
          <button
            onClick={() => handleTaskAction(task.id, "self-assign")}
            className="btn btn-info btn-sm"
          >
            <i className="fas fa-user-check me-2"></i>
            Self-Assign
          </button>
        )}
        {task.status !== "YTS" && (
          <button
            onClick={() => handleTaskAction(task.id, "switch")}
            className="btn btn-secondary "
          >
            <i className="fas fa-exchange-alt me-2"></i>
            Switch Task
          </button>
        )}
        <button
          onClick={() => handleTaskAction(task.id, "reassign")}
          className="btn btn-warning "
        >
          <i className="fas fa-exchange-alt me-2"></i>
          Reassign
        </button>
        <button
          onClick={() => handleTaskAction(task.id, "details")}
          className="btn btn-secondary "
        >
          <i className="fas fa-expand-alt me-2"></i>
          Details
        </button>
      </div>
    );
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "YTS":
        return "bg-light text-dark";
      case "WIP":
        return "bg-info text-white";
      case "WIP (Paused)":
        return "bg-warning text-dark";
      case "QC YTS":
        return "bg-secondary text-white";
      case "QC WIP":
        return "bg-primary text-white";
      case "Corr WIP":
        return "bg-danger text-white";
      case "RFD":
        return "bg-success text-white";
      default:
        return "bg-light text-dark";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-primary text-white";
      case "Medium":
        return "bg-warning text-dark";
      case "High":
        return "bg-danger text-white";
      case "Critical":
        return "bg-dark text-white";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="p-3">
      <h2 className="mb-4 gradient-heading">My Tasks</h2>

      {/* Timer Card - Similar to the image */}
      {activeTaskId && (
        <div className="card mb-4 bg-card">
          <div className="card-header">
            <h5>{allTasks.find(t => t.id === activeTaskId)?.name || "Active Task"}</h5>
            <div className="small">Project: {allTasks.find(t => t.id === activeTaskId)?.project}</div>
            <div className="small">Saturday, June 21, 2025</div>
            <div className="small">Start time: 09:30 AM</div>
          </div>
          <div className="card-body d-flex flex-column justify-content-center align-items-center">
            <div className="text-center">
              <h2 className="mb-0">{formatTime(timerSeconds)}</h2>
              <div className="text-muted small">
                {timerRunning ? "Timer Running" : "Timer Paused"}
              </div>
            </div>
            <br />
            <div className="d-flex gap-2">
              <button
                className="btn btn-warning"
                onClick={() => handleTaskAction(activeTaskId, "pause")}
                disabled={!timerRunning}
              >
                <i className="fas fa-pause me-2"></i>Pause Task
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowTimerModal(true)}
              >
                <i className="fas fa-exchange-alt me-2"></i>Switch Task
              </button>
            </div>
          </div>
          <div className="card-footer text-center">
            <div className="fw-bold">Task Description:</div>
            <div>
              {allTasks.find(t => t.id === activeTaskId)?.name} - Currently in progress
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="list-group overflow-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="list-group-item bg-card d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2"
          >
            <div className="flex-grow-1 mb-2 mb-md-0">
              <h5 className="mb-1">{task.name}</h5>
              <span className={`badge ${getStatusBadgeColor(task.status)}`}>
                {task.status}
              </span>
              <span
                className={`badge ${getPriorityBadgeColor(task.priority)} ms-2`}
              >
                {task.priority}
              </span>
              <div className="small text-muted mt-1">
                Time tracked: {task.timeTracked.toFixed(2)} hours
              </div>
            </div>
            <div className="flex-shrink-0">{renderActionButtons(task)}</div>
          </div>
        ))}
      </div>

      {/* Complete Task Modal */}
      {showCompleteModal && selectedTask && (
        <div
          className="modal fade show custom-modal-dark"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complete Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCompleteModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="serverPath" className="form-label">
                    Server Path
                  </label>
                  <input
                    type="text"
                    id="serverPath"
                    value={serverPath}
                    onChange={(e) => setServerPath(e.target.value)}
                    className={`form-control ${serverPathError ? "is-invalid" : ""
                      }`}
                    placeholder="Enter server path"
                  />
                  {serverPathError && (
                    <div className="invalid-feedback">{serverPathError}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="form-control"
                    placeholder="Add any additional notes"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-5"
                  onClick={() => setShowCompleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn gradient-button"
                  onClick={handleCompleteTask}
                >
                  Complete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Task Modal */}
      {showReassignModal && selectedTask && (
        <div
          className="modal fade show custom-modal-dark"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Reassignment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReassignModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="reassignReason" className="form-label">
                    Reason for Reassignment
                  </label>
                  <textarea
                    id="reassignReason"
                    value={reassignReason}
                    onChange={(e) => setReassignReason(e.target.value)}
                    rows={4}
                    className="form-control"
                    placeholder="Please explain why you need this task to be reassigned"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-5"
                  onClick={() => setShowReassignModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleReassignRequest}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showDetailsModal && selectedTask && (
        <div
          className="modal fade show custom-modal-dark"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Task Details: {selectedTask.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="mb-2">
                      <strong>Project:</strong> {selectedTask.project}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${getStatusBadgeColor(
                          selectedTask.status
                        )}`}
                      >
                        {selectedTask.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>Priority:</strong>{" "}
                      <span
                        className={`badge ${getPriorityBadgeColor(
                          selectedTask.priority
                        )}`}
                      >
                        {selectedTask.priority}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2">
                      <strong>Assignee:</strong> {selectedTask.assignee}
                    </div>
                    <div className="mb-2">
                      <strong>Due Date:</strong> {selectedTask.dueDate}
                    </div>
                    <div className="mb-2">
                      <strong>Time Tracked:</strong>{" "}
                      {selectedTask.timeTracked.toFixed(2)} hours
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6>Files:</h6>
                  <ul className="list-group">
                    {selectedTask.files.map((file, index) => (
                      <li key={index} className="list-group-item">
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <h6>Comments:</h6>
                  {selectedTask.comments.map((comment, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between">
                          <strong>{comment.user}</strong>
                          <small className="text-muted">{comment.date}</small>
                        </div>
                        <p className="mb-0">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-5"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer/Active Task Modal */}
      {showTimerModal && (
        <div
          className="modal fade show custom-modal-dark"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Active Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTimerModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <h2>{formatTime(timerSeconds)}</h2>
                  <div className="text-muted">
                    {timerRunning ? "Timer Running" : "Timer Paused"}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Current Task:</label>
                  <div className="form-control">
                    {activeTaskId
                      ? allTasks.find((t) => t.id === activeTaskId)?.name ||
                      "No task selected"
                      : "No task selected"}
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-center">
                  {timerRunning ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        const taskIndex = allTasks.findIndex(
                          (t) => t.id === activeTaskId
                        );
                        if (taskIndex !== -1) {
                          const updatedAllTasks = [...allTasks];
                          updatedAllTasks[taskIndex] = {
                            ...updatedAllTasks[taskIndex],
                            status: "WIP (Paused)",
                            timeTracked:
                              updatedAllTasks[taskIndex].timeTracked +
                              timerSeconds / 3600,
                          };
                          setAllTasks(updatedAllTasks);
                          setTasks(updatedAllTasks.filter(task => task.assignee === "Current User" || task.status === "QC YTS"));
                        }
                        setTimerRunning(false);
                      }}
                    >
                      <i className="fas fa-pause me-2"></i>Pause
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => setTimerRunning(true)}
                      disabled={!activeTaskId}
                    >
                      <i className="fas fa-play me-2"></i>Resume
                    </button>
                  )}

                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      if (activeTaskId) {
                        const taskIndex = allTasks.findIndex(
                          (t) => t.id === activeTaskId
                        );
                        if (taskIndex !== -1) {
                          const updatedAllTasks = [...allTasks];
                          updatedAllTasks[taskIndex] = {
                            ...updatedAllTasks[taskIndex],
                            timeTracked:
                              updatedAllTasks[taskIndex].timeTracked +
                              timerSeconds / 3600,
                          };
                          setAllTasks(updatedAllTasks);
                          setTasks(updatedAllTasks.filter(task => task.assignee === "Current User" || task.status === "QC YTS"));
                        }
                      }
                      setTimerRunning(false);
                      setTimerSeconds(0);
                      setActiveTaskId(null);
                    }}
                  >
                    <i className="fas fa-stop me-2"></i>Stop
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-5"
                  onClick={() => setShowTimerModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;