import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  UserCheck,
  AlertCircle,
  Target,
  Timer,
  Eye,
} from "lucide-react";

const TaskManagement = () => {
  const [activeTab, setActiveTab] = useState("all-tasks");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design System Update",
      description: "Update design system components",
      assignee: "Sarah Chen",
      status: "In Progress",
      priority: "High",
      dueDate: "2025-04-25",
      timeSpent: 240,
      isTimerRunning: false,
      timerStart: null,
      category: "Design",
      qaStatus: "Pending",
      project: "Brand Refresh Project",
      module: "UI Components",
      createdBy: "Emma Davis",
      createdAt: "2025-04-20",
    },
    {
      id: 2,
      title: "Quote PDF Export Feature",
      description: "Implement PDF export for quotes",
      assignee: "Mike Ross",
      status: "In Progress",
      priority: "High",
      dueDate: "2025-04-26",
      timeSpent: 180,
      isTimerRunning: false,
      timerStart: null,
      category: "Development",
      qaStatus: "Pending",
      project: "Invoice System",
      module: "Quotes Module",
      createdBy: "John Smith",
      createdAt: "2025-04-18",
    },
    {
      id: 3,
      title: "Implement User Authentication",
      description: "Set up login/logout functionality with JWT tokens",
      assignee: "Mike Chen",
      status: "Completed",
      priority: "High",
      dueDate: "2025-06-18",
      timeSpent: 480,
      isTimerRunning: false,
      timerStart: null,
      category: "Development",
      qaStatus: "Passed",
      project: "Website Redesign",
      module: "Auth Service",
      createdBy: "Lisa Wong",
      createdAt: "2025-06-10",
    },
    {
      id: 4,
      title: "Write API Documentation",
      description: "Document all REST API endpoints",
      assignee: "Alex Rivera",
      status: "To Do",
      priority: "Medium",
      dueDate: "2025-06-25",
      timeSpent: 60,
      isTimerRunning: false,
      timerStart: null,
      category: "Documentation",
      qaStatus: "Not Started",
      project: "Mobile App",
      module: "Backend API",
      createdBy: "Sarah Chen",
      createdAt: "2025-06-20",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [quickViewTask, setQuickViewTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
    category: "Development",
    project: "",
    module: "",
    createdBy: "",
  });

  const teamMembers = [
    "Sarah Chen",
    "Mike Ross",
    "Mike Chen",
    "Alex Rivera",
    "Emma Davis",
    "John Smith",
    "Lisa Wong",
  ];
  const statuses = [
    "To Do",
    "In Progress",
    "In Review",
    "Completed",
    "Cancelled",
  ];
  const priorities = ["Low", "Medium", "High", "Critical"];
  const categories = [
    "Development",
    "Design",
    "Documentation",
    "Testing",
    "Planning",
  ];
  const projects = [
    "Brand Refresh Project",
    "Invoice System",
    "Website Redesign",
    "Mobile App",
    "Marketing Campaign",
  ];
  const modules = [
    "UI Components",
    "Quotes Module",
    "Auth Service",
    "Backend API",
    "Dashboard",
    "Settings",
  ];

  // Timer functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.isTimerRunning && task.timerStart) {
            const elapsed = Math.floor((Date.now() - task.timerStart) / 60000);
            return {
              ...task,
              timeSpent: task.timeSpent + elapsed,
              timerStart: Date.now(),
            };
          }
          return task;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const toggleTimer = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (task.isTimerRunning) {
            // Stop timer
            const elapsed = task.timerStart
              ? Math.floor((Date.now() - task.timerStart) / 60000)
              : 0;
            return {
              ...task,
              isTimerRunning: false,
              timerStart: null,
              timeSpent: task.timeSpent + elapsed,
            };
          } else {
            // Start timer
            return {
              ...task,
              isTimerRunning: true,
              timerStart: Date.now(),
            };
          }
        }
        return task;
      })
    );
  };

  const addTask = () => {
    if (newTask.title && newTask.assignee) {
      const task = {
        id: Date.now(),
        ...newTask,
        timeSpent: 0,
        isTimerRunning: false,
        timerStart: null,
        qaStatus: "Not Started",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        status: "To Do",
        priority: "Medium",
        dueDate: "",
        category: "Development",
        project: "",
        module: "",
        createdBy: "",
      });
      setShowAddTask(false);
    }
  };

  const updateTask = (taskId, updates) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  // const deleteTask = (taskId) => {
  //   setTasks(tasks.filter(task => task.id !== taskId));
  // };
  const saveEditedTask = () => {
    if (editingTask) {
      updateTask(editingTask.id, editingTask);
      setEditingTask(null);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const reassignTask = (taskId, newAssignee) => {
    updateTask(taskId, { assignee: newAssignee });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-secondary text-white";
      case "In Progress":
        return "bg-primary text-white";
      case "In Review":
        return "bg-warning text-dark";
      case "Completed":
        return "bg-success text-white";
      case "Cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-success text-white";
      case "Medium":
        return "bg-warning text-dark";
      case "High":
        return "bg-orange text-white";
      case "Critical":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  const getQAStatusColor = (qaStatus) => {
    switch (qaStatus) {
      case "Not Started":
        return "bg-secondary text-white";
      case "Pending":
        return "bg-primary text-white";
      case "In Review":
        return "bg-warning text-dark";
      case "Passed":
        return "bg-success text-white";
      case "Failed":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  const renderTaskCard = (task) => (
    <div key={task.id} className="card mb-3 bg-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title mb-1">{task.title}</h5>
            <p className="card-text text-muted small mb-2">
              {task.description}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={() => setQuickViewTask(task)}
              className="btn btn-sm btn-outline-info"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => setEditingTask(task)}
              className="btn btn-sm btn-outline-primary"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="btn btn-sm btn-outline-danger"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className={`badge ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`badge ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className="badge bg-info text-dark">{task.category}</span>
          <span className="badge bg-secondary">{task.project}</span>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <User size={16} className="text-muted" />
            <span>{task.assignee}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Calendar size={16} className="text-muted" />
            <span>{task.dueDate}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Clock size={16} className="text-muted" />
            <span>{formatTime(task.timeSpent)}</span>
          </div>
          <button
            onClick={() => toggleTimer(task.id)}
            className={`btn btn-sm d-flex align-items-center gap-1 ${
              task.isTimerRunning ? "btn-danger" : "btn-success"
            }`}
          >
            {task.isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            {task.isTimerRunning ? "Stop" : "Start"}
          </button>
        </div>
      </div>

      <div className="d-flex flex-row  flex-md-column gap-2 ms-md-4 mt-3 mt-md-0 w-50 w-md-auto">
        <button
          onClick={() => setEditingTask(task)}
          className="btn btn-sm btn-outline-secondary ms-5  w-50 md-auto" 
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          
          className="btn btn-sm btn-outline-danger ms-5 w-50 w-md-auto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderTaskTable = () => (
    <div className="table-responsive">
      <table className="table table-hover align-middle table-gradient-bg">
        <thead className="table-light">
          <tr>
            <th>Task</th>
            <th>Project</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Due Date</th>
            <th>Time Spent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td>
                <div className="fw-bold">{task.title}</div>
                <div className="text-muted small">{task.description}</div>
              </td>
              <td>{task.project}</td>
              <td>
                <span className={`badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td>
                <span className={`badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td>{task.assignee}</td>
              <td>{task.dueDate}</td>
              <td>{formatTime(task.timeSpent)}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => toggleTimer(task.id)}
                    className={`btn btn-sm ${
                      task.isTimerRunning ? "btn-danger" : "btn-success"
                    }`}
                  >
                    {task.isTimerRunning ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => setQuickViewTask(task)}
                    className="btn btn-sm btn-info"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="btn btn-sm btn-primary"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn btn-sm btn-danger"
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
  );

  const renderTaskList = () => (
    <div className="mb-4">
      {/* Filters and Search */}
      <div className="card mb-3 bg-card">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="form-select"
              >
                <option value="all">All Priority</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-1">
              <button
                onClick={() => setShowAddTask(true)}
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-1"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-3 d-flex justify-content-end">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${
                  viewMode === "table" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("table")}
              >
                Table View
              </button>
              <button
                type="button"
                className={`btn ${
                  viewMode === "card" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("card")}
              >
                Card View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task View */}
      {viewMode === "table" ? (
        renderTaskTable()
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="col">
              {renderTaskCard(task)}
            </div>
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && (
        <div className="text-center py-5">
          <Target size={48} className="mx-auto mb-3 text-muted" />
          <p className="text-muted">No tasks found matching your criteria</p>
        </div>
      )}
    </div>
  );

  const renderTimeLog = () => (
    <div className="mb-4">
      <div className="card mb-3 bg-card">
        <div className="card-body">
          <h5 className="card-title mb-4">Time Tracking Summary</h5>

          <div className="row mb-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card bg-card">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Timer size={20} />
                    <span className="fw-medium">Total Time</span>
                  </div>
                  <h3 className="fw-bold">
                    {formatTime(
                      tasks.reduce((total, task) => total + task.timeSpent, 0)
                    )}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card bg-card">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <CheckCircle2 size={20} />
                    <span className="fw-medium">Completed Tasks</span>
                  </div>
                  <h3 className="fw-bold">
                    {tasks.filter((task) => task.status === "Completed").length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-card">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Clock size={20} />
                    <span className="fw-medium">Active Timers</span>
                  </div>
                  <h3 className="fw-bold">
                    {tasks.filter((task) => task.isTimerRunning).length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive table-gradient-bg">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Time Spent</th>
                  <th>Status</th>
                  <th>Timer</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>
                      <div className="fw-bold">{task.title}</div>
                      <div className="small text-muted">{task.category}</div>
                    </td>
                    <td>{task.assignee}</td>
                    <td className="fw-bold">{formatTime(task.timeSpent)}</td>
                    <td>
                      <span className={`badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleTimer(task.id)}
                        className={`btn btn-sm ${
                          task.isTimerRunning ? "btn-danger" : "btn-success"
                        }`}
                      >
                        {task.isTimerRunning ? (
                          <Pause size={14} />
                        ) : (
                          <Play size={14} />
                        )}
                        {task.isTimerRunning ? "Stop" : "Start"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQAOverview = () => (
    <div className="mb-4">
      <div className="card mb-3 bg-card">
        <div className="card-body">
          <h5 className="card-title mb-4">QA Tasks Overview</h5>

          <div className="d-none d-lg-block">
            <div className="table-responsive">
              <table className="table table-gradient-bg">
                <thead className="text-white">
                  <tr>
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
                    <tr key={task.id}>
                      <td>
                        <code>{task.id}</code>
                      </td>
                      <td>{task.title}</td>
                      <td>{task.module}</td>
                      <td>
                        <span
                          className={`badge ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td>{task.createdBy}</td>
                      <td>{task.createdAt}</td>
                      <td>
                        <span
                          className={`badge ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => setQuickViewTask(task)}
                        >
                          <Eye size={14} /> View
                        </button>
                        {task.status === "To Do" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              updateTask(task.id, { status: "In Progress" })
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
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "all-tasks":
        return renderTaskList();
      case "time-logs":
        return renderTimeLog();
      case "qa-overview":
        return renderQAOverview();
      default:
        return renderTaskList();
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-white">Task Management</h2>
        <p className="text-white">
          Manage tasks, track time, and monitor progress
        </p>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        {[
          { id: "all-tasks", label: "All Tasks", icon: CheckCircle2 },
          { id: "time-logs", label: "Time Logs", icon: Clock },
          { id: "qa-overview", label: "QA Overview", icon: UserCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <li className="nav-item" key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`nav-link d-flex align-items-center gap-1 ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Content */}
      {renderContent()}

      {/* Add Task Modal */}
      {showAddTask && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg custom-modal-dark">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddTask(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="form-control"
                    rows="3"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Project</label>
                    <select
                      value={newTask.project}
                      onChange={(e) =>
                        setNewTask({ ...newTask, project: e.target.value })
                      }
                      className="form-select"
                    >
                      <option value="">Select project</option>
                      {projects.map((project) => (
                        <option key={project} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Assignee</label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignee: e.target.value })
                      }
                      className="form-select"
                    >
                      <option value="">Select assignee</option>
                      {teamMembers.map((member) => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask({ ...newTask, status: e.target.value })
                      }
                      className="form-select"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="form-select"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) =>
                        setNewTask({ ...newTask, category: e.target.value })
                      }
                      className="form-select"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Module</label>
                    <select
                      value={newTask.module}
                      onChange={(e) =>
                        setNewTask({ ...newTask, module: e.target.value })
                      }
                      className="form-select"
                    >
                      <option value="">Select module</option>
                      {modules.map((module) => (
                        <option key={module} value={module}>
                          {module}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Created By</label>
                    <select
                      value={newTask.createdBy}
                      onChange={(e) =>
                        setNewTask({ ...newTask, createdBy: e.target.value })
                      }
                      className="form-select"
                    >
                      <option value="">Select creator</option>
                      {teamMembers.map((member) => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={addTask} className="btn btn-primary">
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg custom-modal-dark">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingTask(null)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="form-control"
                    rows="3"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Project</label>
                    <select
                      value={editingTask.project}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          project: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      {projects.map((project) => (
                        <option key={project} value={project}>
                          {project}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Assignee</label>
                    <select
                      value={editingTask.assignee}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          assignee: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      {teamMembers.map((member) => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select
                      value={editingTask.status}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          status: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Priority</label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          priority: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Category</label>
                    <select
                      value={editingTask.category}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          category: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Module</label>
                    <select
                      value={editingTask.module}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          module: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      {modules.map((module) => (
                        <option key={module} value={module}>
                          {module}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Created By</label>
                    <select
                      value={editingTask.createdBy}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          createdBy: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      {teamMembers.map((member) => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          dueDate: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">QA Status</label>
                    <select
                      value={editingTask.qaStatus}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          qaStatus: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="Passed">Passed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setEditingTask(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={saveEditedTask} className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewTask && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-card">
              <div className="modal-header">
                <h5 className="modal-title">Task Details</h5>
                <button
                  type="button"
                  className="btn-close text-white"
                  onClick={() => setQuickViewTask(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h5>{quickViewTask.title}</h5>
                  <p className="">{quickViewTask.description}</p>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Status:</span>
                    <span
                      className={`badge ${getStatusColor(
                        quickViewTask.status
                      )}`}
                    >
                      {quickViewTask.status}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Priority:</span>
                    <span
                      className={`badge ${getPriorityColor(
                        quickViewTask.priority
                      )}`}
                    >
                      {quickViewTask.priority}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Assignee:</span>
                    <span>{quickViewTask.assignee}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Project:</span>
                    <span>{quickViewTask.project}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Category:</span>
                    <span>{quickViewTask.category}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Module:</span>
                    <span>{quickViewTask.module}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Created By:</span>
                    <span>{quickViewTask.createdBy}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Created At:</span>
                    <span>{quickViewTask.createdAt}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Due Date:</span>
                    <span>{quickViewTask.dueDate}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-medium">Time Spent:</span>
                    <span>{formatTime(quickViewTask.timeSpent)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-medium">QA Status:</span>
                    <span
                      className={`badge ${getQAStatusColor(
                        quickViewTask.qaStatus
                      )}`}
                    >
                      {quickViewTask.qaStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setQuickViewTask(null)}
                  className="btn btn-secondary"
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
};

export default TaskManagement;
