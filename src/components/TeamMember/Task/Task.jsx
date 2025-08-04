import axios from "axios";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../Utilities/axiosInstance";

function Task() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([
    {
      id: 1,
      name: "QA Testing for Payment Module",
      client:"jhon",
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
      client:"jhon",

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
      client:"jhon",

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

  // Projects data
  const [projectTasks, setProjectTasks] = useState([
    {
      id: 1,
      projectTitle: "Project 1 (High)",
      client: "Main Auditor",
      task: "Image Localization",
      language: "id",
      application: "AI",
      totalPages: 54,
      assignedPages: "AI",
      describe: "02:41 AM 14:08:26",
      readyForGoDescribe: "3:41 AM 14:08:26",
      goRunDate: "4:41 AM 14:08:26",
      status: "QC WIP",
      progress: "95%",
      team: "2015-01-X, Tuesday"
    },
    {
      id: 2,
      projectTitle: "Project 2 (Y)",
      client: "OTP",
      task: "20-Hora",
      language: "FM",
      application: "",
      totalPages: 50,
      assignedPages: 50,
      describe: "20:28 PM 11:08:26",
      readyForGoDescribe: "21:28 PM 11:08:26",
      goRunDate: "22:28 PM 11:08:26",
      status: "QC YTS",
      progress: "95%",
      team: ""
    },
    {
      id: 3,
      projectTitle: "Project 3 (SS)",
      client: "Image Localization",
      task: "20-Hora",
      language: "Project",
      application: "",
      totalPages: 30,
      assignedPages: 30,
      describe: "08:20 AM 21:08:25",
      readyForGoDescribe: "9:20 AM 21:08:25",
      goRunDate: "10:20 AM 21:08:25",
      status: "Cear YTS",
      progress: "75%",
      team: ""
    },
  ]);

  // Filter tasks to show only those assigned to "Current User"
  const [tasks, setTasks] = useState(
    allTasks.filter(task => task.assignee === "Current User" || task.status === "QC YTS")
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
              timeTracked: updatedAllTasks[activeTaskIndex].timeTracked + timerSeconds / 3600,
            };
          }
        }

        task.status = "WIP";
        task.assignee = "Current User";
        setActiveTaskId(taskId);
        setTimerRunning(true);
        setTimerSeconds(0);
        break;
      case "pause":
        task.status = "WIP (Paused)";
        setTimerRunning(false);
        task.timeTracked += timerSeconds / 3600;
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
        // Pause current task if any
        if (activeTaskId) {
          const activeTaskIndex = allTasks.findIndex((t) => t.id === activeTaskId);
          if (activeTaskIndex !== -1) {
            updatedAllTasks[activeTaskIndex] = {
              ...updatedAllTasks[activeTaskIndex],
              status: "WIP (Paused)",
              timeTracked: updatedAllTasks[activeTaskIndex].timeTracked + timerSeconds / 3600,
            };
          }
        }
        // Start new task
        task.status = "WIP";
        task.assignee = "Current User";
        setActiveTaskId(taskId);
        setTimerRunning(true);
        setTimerSeconds(0);
        break;
      default:
        return;
    }

    updatedAllTasks[taskIndex] = task;
    setAllTasks(updatedAllTasks);
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

    if (activeTaskId === task.id) {
      task.timeTracked += timerSeconds / 3600;
      setTimerRunning(false);
      setTimerSeconds(0);
      setActiveTaskId(null);
    }

    task.serverPath = serverPath;
    updatedAllTasks[taskIndex] = task;

    setAllTasks(updatedAllTasks);
    setTasks(updatedAllTasks.filter(task => task.assignee === "Current User" || task.status === "QC YTS"));
    setShowCompleteModal(false);
    setServerPath("");
    setNotes("");
    setServerPathError("");
  };

  const handleReassignRequest = () => {
    alert(`Reassignment requested for task "${selectedTask.name}" with reason: ${reassignReason}`);
    setShowReassignModal(false);
    setReassignReason("");
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "YTS": return "bg-light text-dark";
      case "WIP": return "bg-info text-white";
      case "WIP (Paused)": return "bg-warning text-dark";
      case "QC YTS": return "bg-secondary text-white";
      case "QC WIP": return "bg-primary text-white";
      case "Corr WIP": return "bg-danger text-white";
      case "RFD": return "bg-success text-white";
      case "Cear YTS": return "bg-warning text-dark";
      default: return "bg-light text-dark";
    }
  };

  const renderTaskActions = (task) => {
    return (
      <div className="d-flex flex-wrap gap-1">
        {task.status === "QC YTS" && (
          <button
            onClick={() => handleTaskAction(task.id, "self-assign")}
            className="btn btn-sm btn-primary"
          >
            Set/Assign
          </button>
        )}
        <button
          onClick={() => handleTaskAction(task.id, "switch")}
          className="btn btn-sm btn-secondary"
        >
          Switch Task
        </button>
        <button
          onClick={() => handleTaskAction(task.id, "reassign")}
          className="btn btn-sm btn-warning"
        >
          Reassign
        </button>
        <button
          onClick={() => handleTaskAction(task.id, "details")}
          className="btn btn-sm btn-info"
        >
          Details
        </button>
        {(task.status === "WIP" || task.status === "Corr WIP") && (
          <button
            onClick={() => handleTaskAction(task.id, "complete")}
            className="btn btn-sm btn-success"
          >
            Complete Task
          </button>
        )}
        {task.status === "WIP" && (
          <button
            onClick={() => handleTaskAction(task.id, "pause")}
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
      .get('project/getAllProjects', {})
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

  return (
    <div className="container-fluid p-3">
      <h2 className="mb-4">My Tasks</h2>

      {/* Active Task Timer */}
      {activeTaskId && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h4 className="mb-0">
              {allTasks.find(t => t.id === activeTaskId)?.project || "Active Task"}
            </h4>
            <div className="small">
              {allTasks.find(t => t.id === activeTaskId)?.name || "No active task"}
            </div>
          </div>
          <div className="card-body text-center">
            <h1 className="display-4">{formatTime(timerSeconds).substring(0, 8)}</h1>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button 
                className="btn btn-warning"
                onClick={() => handleTaskAction(activeTaskId, "pause")}
              >
                {timerRunning ? "Pause Task" : "Resume Task"}
              </button>
              <button className="btn btn-secondary">Correct Time</button>
            </div>
          </div>
          <div className="card-footer text-center">
            <strong>Task Description:</strong> {allTasks.find(t => t.id === activeTaskId)?.name}
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="table-responsive mb-4">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>S. No.</th>
              <th>Project Title</th>
              <th>Client</th>
              <th>Task</th>
              <th>Language</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Assigned Pages</th>
              <th>Describe</th>
              <th>Ready For Go Describe</th>
              <th>Go Run Date</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            
            </tr>
          </thead>
          <tbody>
            {projectTasks.map((project, index) => (
              <tr key={project.id}>
                <td>{index + 1}</td>
                <td>{project.projectTitle}</td>
                <td>{project.client}</td>
                <td>{project.task}</td>
                <td>{project.language}</td>
                <td>{project.application}</td>
                <td>{project.totalPages}</td>
                <td>{project.assignedPages}</td>
                <td>{project.describe}</td>
                <td>{project.readyForGoDescribe}</td>
                <td>{project.goRunDate}</td>
                <td>
                  <span className={`badge ${getStatusBadgeColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td>{project.progress}</td>
                <td>
                 {renderTaskActions(project)}
                </td>
             
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tasks Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
               <th>S. No.</th>
              <th>Project Title</th>
              <th>Client</th>
              <th>Task Name</th>
             
              <th>Status</th>
              <th>Due Date</th>
              <th>Time Tracked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.project}</td>
                <td>{task.client}</td>
                <td>{task.name}</td>
              
                <td>
                  <span className={`badge ${getStatusBadgeColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.dueDate}</td>
                <td>{task.timeTracked.toFixed(2)} hours</td>
                <td>
                  {renderTaskActions(task)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Complete Task Modal */}
      {showCompleteModal && selectedTask && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complete Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowCompleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Server Path</label>
                  <input
                    type="text"
                    className={`form-control ${serverPathError ? 'is-invalid' : ''}`}
                    value={serverPath}
                    onChange={(e) => setServerPath(e.target.value)}
                  />
                  {serverPathError && <div className="invalid-feedback">{serverPathError}</div>}
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
                <button type="button" className="btn btn-secondary" onClick={() => setShowCompleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCompleteTask}>
                  Complete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Task Modal */}
      {showReassignModal && selectedTask && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Reassignment</h5>
                <button type="button" className="btn-close" onClick={() => setShowReassignModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Reason for Reassignment</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={reassignReason}
                    onChange={(e) => setReassignReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReassignModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-warning" onClick={handleReassignRequest}>
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showDetailsModal && selectedTask && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Task Details: {selectedTask.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="mb-2"><strong>Project:</strong> {selectedTask.project}</div>
                    <div className="mb-2">
                      <strong>Status:</strong> <span className={`badge ${getStatusBadgeColor(selectedTask.status)}`}>
                        {selectedTask.status}
                      </span>
                    </div>
                    <div className="mb-2"><strong>Priority:</strong> {selectedTask.priority}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2"><strong>Assignee:</strong> {selectedTask.assignee}</div>
                    <div className="mb-2"><strong>Due Date:</strong> {selectedTask.dueDate}</div>
                    <div className="mb-2"><strong>Time Tracked:</strong> {selectedTask.timeTracked.toFixed(2)} hours</div>
                  </div>
                </div>
                <div className="mb-3">
                  <h6>Files:</h6>
                  <ul className="list-group">
                    {selectedTask.files.map((file, index) => (
                      <li key={index} className="list-group-item">{file}</li>
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
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
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