import React, { useState, useEffect } from 'react';
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
  Timer
} from 'lucide-react';

const TaskManagement = () => {
  const [activeTab, setActiveTab] = useState('all-tasks');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design Homepage Layout',
      description: 'Create wireframes and mockups for the new homepage',
      assignee: 'Sarah Johnson',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2025-06-20',
      timeSpent: 240, // minutes
      isTimerRunning: false,
      timerStart: null,
      category: 'Design',
      qaStatus: 'Pending'
    },
    {
      id: 2,
      title: 'Implement User Authentication',
      description: 'Set up login/logout functionality with JWT tokens',
      assignee: 'Mike Chen',
      status: 'Completed',
      priority: 'High',
      dueDate: '2025-06-18',
      timeSpent: 480,
      isTimerRunning: false,
      timerStart: null,
      category: 'Development',
      qaStatus: 'Passed'
    },
    {
      id: 3,
      title: 'Write API Documentation',
      description: 'Document all REST API endpoints',
      assignee: 'Alex Rivera',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '2025-06-25',
      timeSpent: 60,
      isTimerRunning: false,
      timerStart: null,
      category: 'Documentation',
      qaStatus: 'Not Started'
    },
    {
      id: 4,
      title: 'Database Optimization',
      description: 'Optimize queries and add proper indexing',
      assignee: 'Emma Davis',
      status: 'In Review',
      priority: 'High',
      dueDate: '2025-06-22',
      timeSpent: 360,
      isTimerRunning: false,
      timerStart: null,
      category: 'Development',
      qaStatus: 'In Review'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
    dueDate: '',
    category: 'Development'
  });

  const teamMembers = ['Sarah Johnson', 'Mike Chen', 'Alex Rivera', 'Emma Davis', 'John Smith', 'Lisa Wong'];
  const statuses = ['To Do', 'In Progress', 'In Review', 'Completed', 'Cancelled'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const categories = ['Development', 'Design', 'Documentation', 'Testing', 'Planning'];

  // Timer functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.isTimerRunning && task.timerStart) {
            const elapsed = Math.floor((Date.now() - task.timerStart) / 60000);
            return { ...task, timeSpent: task.timeSpent + elapsed, timerStart: Date.now() };
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
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.isTimerRunning) {
            // Stop timer
            const elapsed = task.timerStart ? Math.floor((Date.now() - task.timerStart) / 60000) : 0;
            return {
              ...task,
              isTimerRunning: false,
              timerStart: null,
              timeSpent: task.timeSpent + elapsed
            };
          } else {
            // Start timer
            return {
              ...task,
              isTimerRunning: true,
              timerStart: Date.now()
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
        status: 'To Do',
        timeSpent: 0,
        isTimerRunning: false,
        timerStart: null,
        qaStatus: 'Not Started'
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        priority: 'Medium',
        dueDate: '',
        category: 'Development'
      });
      setShowAddTask(false);
    }
  };

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const reassignTask = (taskId, newAssignee) => {
    updateTask(taskId, { assignee: newAssignee });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'bg-secondary text-white';
      case 'In Progress': return 'bg-primary text-white';
      case 'In Review': return 'bg-warning text-dark';
      case 'Completed': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-success text-white';
      case 'Medium': return 'bg-warning text-dark';
      case 'High': return 'bg-orange text-white';
      case 'Critical': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getQAStatusColor = (qaStatus) => {
    switch (qaStatus) {
      case 'Not Started': return 'bg-secondary text-white';
      case 'Pending': return 'bg-primary text-white';
      case 'In Review': return 'bg-warning text-dark';
      case 'Passed': return 'bg-success text-white';
      case 'Failed': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const renderTaskCard = (task) => (
    <div key={task.id} className="card bg-card mb-3">
  <div className="card-body">
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 gap-3">
      <div className="flex-grow-1 w-100">
        <h5 className="card-title mb-2">{task.title}</h5>
        <p className="card-text mb-3">{task.description}</p>
        
        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
          <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
          <span className="badge bg-purple text-white">{task.category}</span>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
          <div className="d-flex align-items-center gap-1">
            <User className="w-4 h-4" />
            <span>{task.assignee}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{task.dueDate}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(task.timeSpent)}</span>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2">
          <button
            onClick={() => toggleTimer(task.id)}
            className={`btn btn-sm d-flex align-items-center gap-1 ${task.isTimerRunning ? 'btn-danger' : 'btn-success'} w-100 w-sm-auto`}
          >
            {task.isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {task.isTimerRunning ? 'Stop' : 'Start'}
          </button>
          
          <select
            value={task.assignee}
            onChange={(e) => reassignTask(task.id, e.target.value)}
            className="form-select form-select-sm w-100 w-sm-auto"
          >
            {teamMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>

          <select
            value={task.status}
            onChange={(e) => updateTask(task.id, { status: e.target.value })}
            className="form-select form-select-sm w-100 w-sm-auto"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
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
          onClick={() => deleteTask(task.id)}
          className="btn btn-sm btn-outline-danger ms-5 w-50 w-md-auto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</div>
  );

  const renderTaskList = () => (
    <div className="mb-4">
      {/* Filters and Search */}
      <div className="card mb-3 bg-main ">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text">
                  <Search className="w-4 h-4" />
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
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
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
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div className="col-md-1">
              <button
                onClick={() => setShowAddTask(true)}
                className="gradient-button w-100 d-flex align-items-center justify-content-center gap-1"
              >
                <Plus className="w-4 h-4" />
                +Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div>
        {filteredTasks.map(renderTaskCard)}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-5">
          <Target className="w-12 h-12  mx-auto mb-3" />
          <p className="">No tasks found matching your criteria</p>
        </div>
      )}
    </div>
  );

  const renderTimeLog = () => (
    <div className="mb-4 ">
      <div className="card mb-3 bg-card text-light">
        <div className="card-body">
          <h5 className="card-title mb-4 ">Time Tracking Summary</h5>
          
          <div className="row mb-4 ">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card bg-card text-white">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Timer className="w-5 h-5" />
                    <span className="fw-medium">Total Time</span>
                  </div>
                  <h3 className="fw-bold">
                    {formatTime(tasks.reduce((total, task) => total + task.timeSpent, 0))}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3 mb-md-0 ">
              <div className="card bg-card text-white">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="fw-medium">Completed Tasks</span>
                  </div>
                  <h3 className="fw-bold">
                    {tasks.filter(task => task.status === 'Completed').length}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card bg-card text-dark">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="fw-medium">Active Timers</span>
                  </div>
                  <h3 className="fw-bold">
                    {tasks.filter(task => task.isTimerRunning).length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-gradient-bg  ">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Time Spent</th>
                  <th>Status</th>
                  <th>Timer</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <div className="fw-bold">{task.title}</div>
                      <div className=" small">{task.category}</div>
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
                        className={`btn btn-sm d-flex align-items-center gap-1 ${
                          task.isTimerRunning ? 'btn-danger' : 'btn-success'
                        }`}
                      >
                        {task.isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {task.isTimerRunning ? 'Stop' : 'Start'}
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
      <div className="card mb-3 bg-card" >
        <div className="card-body">
          <h5 className="card-title mb-4">QA Tasks Overview</h5>
          
          <div className="row mb-4 ">
            {['Not Started', 'Pending', 'In Review', 'Passed'].map(status => {
              const count = tasks.filter(task => task.qaStatus === status).length;
              const colors = {
                'Not Started': 'bg-card text-white',
                'Pending': 'bg-card text-white',
                'In Review': 'bg-card text-dark',
                'Passed': 'bg-card text-white'
              };
              
              return (
                <div key={status} className="col-md-3 mb-3 mb-md-0">
                  <div className={`card ${colors[status]}`}>
                    <div className="card-body">
                      <div className="fw-medium">{status}</div>
                      <h3 className="fw-bold">{count}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="list-group">
            {tasks.map(task => (
              <div key={task.id} className="list-group-item mb-2 bg-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-2">{task.title}</h6>
                    <div className="d-flex gap-4  small mb-2">
                      <span>Assignee: {task.assignee}</span>
                      <span>Status: {task.status}</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <span className={`badge ${getQAStatusColor(task.qaStatus)}`}>
                        QA: {task.qaStatus}
                      </span>
                      <span className={`badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="ms-4">
                    <select
                      value={task.qaStatus}
                      onChange={(e) => updateTask(task.id, { qaStatus: e.target.value })}
                      className="form-select form-select-sm"
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'all-tasks':
        return renderTaskList();
      case 'time-logs':
        return renderTimeLog();
      case 'qa-overview':
        return renderQAOverview();
      default:
        return renderTaskList();
    }
  };

  return (
    <div className="bg-main min-vh-100">
      <div className="p-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <h2  className="gradient-heading">Task Management</h2>
          <p className="text-light">Manage tasks, track time, and monitor progress</p>
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs  mb-4">
          {[
            { id: 'all-tasks', label: 'All Tasks', icon: CheckCircle2 },
            { id: 'time-logs', label: 'Time Logs', icon: Clock },
            { id: 'qa-overview', label: 'QA Overview', icon: UserCheck }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <li className="nav-item" key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-link d-flex align-items-center gap-1 ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
          <div className="modal show d-block custom-modal-dark" >
            <div className="modal-dialog">
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
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <textarea
                      placeholder="Task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className="form-control"
                      rows="3"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <select
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                      className="form-select bg-card "
                    >
                      <option value="" className='text-dark'>Select assignee</option>
                      {teamMembers.map(member => (
                        <option className='text-dark' key={member} value={member}>{member}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="row mb-3 ">
                    <div className="col-md-6 ">
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                        className="form-select"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <select
                        value={newTask.category}
                        onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                        className="form-select"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="form-control"
                    />
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="btn btn-danger rounded-pill"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTask}
                    className="gradient-button"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;