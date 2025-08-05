import axios from "axios";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../Utilities/axiosInstance";
import BASE_URL from "../../../config";

function Task() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const [allTasks, setAllTasks] = useState([
    {
      id: 1,
      name: "QA Testing for Payment Module",
      client: "jhon",
      status: "QC YTS",
      project: "MSCNIP",
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
      id: 2,
      name: "Fix Navigation Bug",
      client: "jhon",
      status: "Corr WIP",
      project: "Help",
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
      id: 3,
      name: "Dashboard UI Design",
      client: "jhon",
      status: "WIP",
      project: "Help",
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

  const [tasks, setTasks] = useState(
    allTasks.filter(
      (task) => task.assignee === "Current User" || task.status === "QC YTS"
    )
  );

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [serverPath, setServerPath] = useState("");
  const [notes, setNotes] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  const [serverPathError, setServerPathError] = useState("");

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [showRestartButton, setShowRestartButton] = useState(false);

  // Add memberId state
  const [memberId, setMemberId] = useState(null); // Replace with actual memberId if needed

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Format time helper function
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start Timer API handler
  const handleStartTimer = async (taskId, memberId) => {
    try {
      const response = await axios.post(
        "https://eminoids-backend-production.up.railway.app/api/tracking/startTracking",
        {
          taskId: taskId,
          memberId: memberId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMemberId(memberId); // Set memberId for future API calls
      setActiveTaskId(taskId);

      console.log("Start API Success:", response.data);
      setTimerRunning(true);
      setTimerSeconds(0);

      // Update task status in local state
      const updatedTasks = allTasks.map((task) =>
        task.id === taskId ? { ...task, status: "WIP" } : task
      );
      setAllTasks(updatedTasks);
      setTasks(
        updatedTasks.filter(
          (task) => task.assignee === "Current User" || task.status === "QC YTS"
        )
      );
    } catch (error) {
      console.error("Start API Error:", error.response?.data || error.message);
      alert(
        "Failed to start timer: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Pause Timer API handler
  const handlePauseTimer = async () => {
    if (!activeTaskId) return;

    try {
      const response = await axios.post(
        "https://eminoids-backend-production.up.railway.app/api/tracking/pauseTracking",
        {
          taskId: activeTaskId,
          memberId: memberId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Pause API Success:", response.data);
      setTimerRunning(false);
      setPausedTime(timerSeconds);

      // Update task status in local state
      const updatedTasks = allTasks.map((task) =>
        task.id === activeTaskId ? { ...task, status: "WIP (Paused)" } : task
      );
      setAllTasks(updatedTasks);
      setTasks(
        updatedTasks.filter(
          (task) => task.assignee === "Current User" || task.status === "QC YTS"
        )
      );
    } catch (error) {
      console.error("Pause API Error:", error.response?.data || error.message);
      alert(
        "Failed to pause timer: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Stop Timer API handler
  const handleStopTimer = async (activeTaskId) => {
    const memberId = localStorage.getItem("managerId");
    console.log("Stopping timer for task ID:", activeTaskId, "Member ID:", memberId );
    
    if (!activeTaskId) return;

    try {
      const response = await axios.post(
        "https://eminoids-backend-production.up.railway.app/api/tracking/stopTracking",
        {
          taskId: activeTaskId,
          memberId: parseInt(memberId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Stop API Success:", response.data);
      setTimerRunning(false);

      // Update task in local state with tracked time
      const hoursTracked = timerSeconds / 3600;
      const updatedTasks = allTasks.map((task) =>
        task.id === activeTaskId
          ? {
              ...task,
              status: "Completed",
              timeTracked: task.timeTracked + hoursTracked,
            }
          : task
      );

      setAllTasks(updatedTasks);
      setTasks(
        updatedTasks.filter(
          (task) => task.assignee === "Current User" || task.status === "QC YTS"
        )
      );

      setActiveTaskId(null);
      setTimerSeconds(0);
      setPausedTime(0);
    } catch (error) {
      console.error("Stop API Error:", error.response?.data || error.message);
      alert(
        "Failed to stop timer: " +
          (error.response?.data?.message || error.message)
      );
    }
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

    // Update task status based on current status
    if (task.status === "WIP") {
      task.status = "QC YTS";
    } else if (task.status === "Corr WIP") {
      task.status = "RFD";
    }

    // Add time tracked if this was the active task
    if (activeTaskId === task.id) {
      task.timeTracked += timerSeconds / 3600;
      setTimerRunning(false);
      setTimerSeconds(0);
      setActiveTaskId(null);
    }

    // Update task details
    task.serverPath = serverPath;
    updatedAllTasks[taskIndex] = task;

    // Update state
    setAllTasks(updatedAllTasks);
    setTasks(
      updatedAllTasks.filter(
        (task) => task.assignee === "Current User" || task.status === "QC YTS"
      )
    );

    // Reset modal state
    setShowCompleteModal(false);
    setServerPath("");
    setNotes("");
    setServerPathError("");
  };

  const handleTaskAction = (taskId, memberId, action) => {
    const taskIndex = allTasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;

    const updatedAllTasks = [...allTasks];
    const task = { ...updatedAllTasks[taskIndex] };

    switch (action) {
      case "start":
        handleStartTimer(taskId, memberId);
        return;
      case "pause":
        handlePauseTimer();
        return;
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
        handleStartTimer(taskId);
        return;
      default:
        return;
    }

    updatedAllTasks[taskIndex] = task;
    setAllTasks(updatedAllTasks);
    setTasks(
      updatedAllTasks.filter(
        (task) => task.assignee === "Current User" || task.status === "QC YTS"
      )
    );
  };

  const handleReassignRequest = () => {
    if (!reassignReason.trim()) {
      alert("Please provide a reason for reassignment");
      return;
    }

    alert(
      `Reassignment requested for task "${selectedTask.name}" with reason: ${reassignReason}`
    );
    setShowReassignModal(false);
    setReassignReason("");
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
      case "Cear YTS":
        return "bg-warning text-dark";
      case "Completed":
        return "bg-success text-white";
      default:
        return "bg-light text-dark";
    }
  };

  const activeTask = allTasks.find((t) => t.id === activeTaskId);

  
  const renderTaskActions = (task) => {
    return (
      <div className="d-flex flex-wrap gap-1">
        {task.status === "QC YTS" && (
          <button
            onClick={() =>
              handleTaskAction(task.id, task.memberId, "self-assign")
            }
            className="btn btn-sm btn-primary"
          >
            Set/Assign
          </button>
        )}
        <button
          onClick={() => handleTaskAction(task.id, task.memberId, "switch")}
          className="btn btn-sm btn-secondary"
        >
          Start Task
        </button>
        <button
          onClick={() => handleTaskAction(task.id, task.memberId, "reassign")}
          className="btn btn-sm btn-warning"
        >
          Reassign
        </button>
        <button
          onClick={() => handleTaskAction(task.id, task.memberId, "details")}
          className="btn btn-sm btn-info"
        >
          Details
        </button>
        {(task.status === "WIP" || task.status === "Corr WIP") && (
          <button
            onClick={() => handleTaskAction(task.id, task.memberId, "complete")}
            className="btn btn-sm btn-success"
          >
            Complete Task
          </button>
        )}
        {task.status === "WIP" && (
          <button
            onClick={() => handleTaskAction(task.id, task.memberId, "pause")}
            className="btn btn-sm btn-danger"
          >
            Pause Work
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    axiosInstance
      .get("project/getAllProjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          const completedProjects = res.data.projects.filter(
            (project) => project.status?.toLowerCase() === "completed"
          );
          setProjects(completedProjects);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [projectTasks, setProjectTasks] = useState([]);

  useEffect(() => {
    const fetchProjectTasks = async () => {
      try {

        const managerId = localStorage.getItem("managerId");

        const response = await axios.get(
          `https://eminoids-backend-production.up.railway.app/api/tracking/getAllTracking/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status && Array.isArray(response.data.data)) {
          setProjectTasks(response.data.data);
        } else {
          console.error("Invalid API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching project tasks:", error);
      }
    };

    fetchProjectTasks();
  }, []);

  return (
    <div className="container-fluid p-3">
      <h2 className="mb-4 text-white">My Tasks</h2>

      {activeTaskId && (
        <div className="card mb-4 bg-card">
          <div className="card-header">
            <h4 className="mb-0">{activeTask?.project || "Active Task"}</h4>
            <div className="small">{activeTask?.name || "No active task"}</div>
          </div>
          <div className="card-body text-center">
            <h1 className="display-4">
              {formatTime(timerRunning ? timerSeconds : pausedTime).substring(
                0,
                8
              )}
            </h1>
            <div className="d-flex justify-content-center gap-3 mt-3">
              {!timerRunning ? (
                <button
                  className="btn btn-success"
                  onClick={() => handleStartTimer(activeTaskId)}
                >
                  Start/Resume Task
                </button>
              ) : (
                <button className="btn btn-warning" onClick={handlePauseTimer}>
                  Pause Task
                </button>
              )}
              <button className="btn btn-secondary" onClick={()=>handleStopTimer( activeTaskId)}>
                Stop Timer
              </button>
            </div>
          </div>
          <div className="card-footer text-center">
            <strong>Task Description:</strong> {activeTask?.name}
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-gradient-bg">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Task ID</th>
              <th>Member ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Time</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectTasks.length > 0 ? (
              projectTasks.map((project, index) => (
                <tr key={project.id}>
                  <td>{index + 1}</td>
                  <td>{project.taskId}</td>
                  <td>{project.memberId}</td>
                  <td>{project.startTime}</td>
                  <td>{project.endTime || "N/A"}</td>
                  <td>{project.totalTime || "In Progress"}</td>
                  <td>
                    <span
                      className={`badge ${getStatusBadgeColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td>{new Date(project.createdAt).toLocaleString()}</td>
                  <td>{renderTaskActions(project)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading or No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals remain the same as in your original code */}
      {showCompleteModal && selectedTask && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complete Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCompleteModal(false);
                    setServerPathError("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Server Path</label>
                  <input
                    type="text"
                    className={`form-control ${
                      serverPathError ? "is-invalid" : ""
                    }`}
                    value={serverPath}
                    onChange={(e) => {
                      setServerPath(e.target.value);
                      if (serverPathError) setServerPathError("");
                    }}
                    required
                  />
                  {serverPathError && (
                    <div className="invalid-feedback">{serverPathError}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCompleteModal(false);
                    setServerPathError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCompleteTask}
                >
                  Complete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReassignModal && selectedTask && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-card">
              <div className="modal-header">
                <h5 className="modal-title">Request Reassignment</h5>
                <button
                  type="button"
                  className="btn-close text-white"
                  onClick={() => setShowReassignModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Reason for Reassignment</label>
                  <textarea
                    className="form-control bg-card"
                    rows="4"
                    value={reassignReason}
                    onChange={(e) => setReassignReason(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
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

      {showDetailsModal && selectedTask && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-card">
              <div className="modal-header">
                <h5 className="modal-title">
                  Task Details: {selectedTask.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
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
                      <strong>Priority:</strong> {selectedTask.priority}
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
                  <ul className="list-group bg-card">
                    {selectedTask.files.map((file, index) => (
                      <li key={index} className="list-group-item bg-card">
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <h6>Comments:</h6>
                  {selectedTask.comments.map((comment, index) => (
                    <div key={index} className="card mb-2 bg-card">
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between">
                          <strong>{comment.user}</strong>
                          <small className="bg-card">{comment.date}</small>
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
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
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
