import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export const TaskDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [sortColumn, setSortColumn] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Sample data for tasks
  const tasks = [
    {
      id: 1,
      project: 'Website Redesign',
      task: 'Create wireframes for homepage',
      dueDate: '2025-06-19T14:30:00',
      status: 'WIP',
      priority: 'High',
      timeSpent: '3h 45m',
    },
    {
      id: 2,
      project: 'Mobile App Development',
      task: 'Implement user authentication',
      dueDate: '2025-06-19T17:00:00',
      status: 'YTS',
      priority: 'Medium',
      timeSpent: '0h 0m',
    },
    {
      id: 3,
      project: 'Marketing Campaign',
      task: 'Design social media assets',
      dueDate: '2025-06-18T12:00:00',
      status: 'QC',
      priority: 'Low',
      timeSpent: '5h 20m',
    },
    {
      id: 4,
      project: 'Database Migration',
      task: 'Test data integrity after migration',
      dueDate: '2025-06-17T09:00:00',
      status: 'WIP',
      priority: 'High',
      timeSpent: '2h 15m',
    },
    {
      id: 5,
      project: 'Content Strategy',
      task: 'Create editorial calendar',
      dueDate: '2025-06-20T11:00:00',
      status: 'YTS',
      priority: 'Medium',
      timeSpent: '0h 0m',
    },
    {
      id: 6,
      project: 'UI/UX Improvements',
      task: 'Conduct usability testing',
      dueDate: '2025-06-19T16:00:00',
      status: 'WIP',
      priority: 'High',
      timeSpent: '1h 30m',
    },
    {
      id: 7,
      project: 'Performance Optimization',
      task: 'Optimize image loading',
      dueDate: '2025-06-18T15:30:00',
      status: 'QC',
      priority: 'Medium',
      timeSpent: '4h 10m',
    },



  ];

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter((task) => {
    const today = new Date('2025-06-19');
    const dueDate = new Date(task.dueDate);

    if (selectedTab === 'all') return true;
    if (selectedTab === 'dueToday') {
      return dueDate.toDateString() === today.toDateString();
    }
    if (selectedTab === 'overdue') {
      return dueDate < today;
    }
    if (selectedTab === 'inProgress') {
      return task.status === 'WIP';
    }
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortColumn === 'project') {
      return sortDirection === 'asc'
        ? a.project.localeCompare(b.project)
        : b.project.localeCompare(a.project);
    }
    if (sortColumn === 'task') {
      return sortDirection === 'asc'
        ? a.task.localeCompare(b.task)
        : b.task.localeCompare(a.task);
    }
    if (sortColumn === 'dueDate') {
      return sortDirection === 'asc'
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    if (sortColumn === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    if (sortColumn === 'priority') {
      const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
      return sortDirection === 'asc'
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortColumn === 'timeSpent') {
      const getMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split('h ');
        return parseInt(hours) * 60 + parseInt(minutes.replace('m', ''));
      };
      return sortDirection === 'asc'
        ? getMinutes(a.timeSpent) - getMinutes(b.timeSpent)
        : getMinutes(b.timeSpent) - getMinutes(a.timeSpent);
    }
    return 0;
  });

  // Count tasks for KPIs
  const today = new Date('2025-06-19');
  const tasksDueToday = tasks.filter(task => new Date(task.dueDate).toDateString() === today.toDateString()).length;
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < today).length;
  const tasksInProgress = tasks.filter(task => task.status === 'WIP').length;

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Format date and time
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render priority badge
  const renderPriorityBadge = (priority) => {
    let badgeClass = '';
    switch (priority) {
      case 'High':
        badgeClass = 'bg-danger';
        break;
      case 'Medium':
        badgeClass = 'bg-warning text-dark';
        break;
      case 'Low':
        badgeClass = 'bg-success';
        break;
      default:
        badgeClass = 'bg-secondary';
    }
    return (
      <span className={`badge ${badgeClass}`}>{priority}</span>
    );
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    let badgeClass = '';
    let statusText = '';
    switch (status) {
      case 'YTS':
        badgeClass = 'bg-primary';
        statusText = 'Yet to Start';
        break;
      case 'WIP':
        badgeClass = 'bg-info text-dark';
        statusText = 'In Progress';
        break;
      case 'QC':
        badgeClass = 'bg-warning text-dark';
        statusText = 'Quality Check';
        break;
      default:
        badgeClass = 'bg-secondary';
        statusText = status;
    }
    return (
      <span className={`badge ${badgeClass}`}>{statusText}</span>
    );
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditTask(null);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-vh-100 bg-light bg-main">
      <div className="p-3" style={{ maxWidth: '100%' }}>
        <header className="mb-4">
          <h2 className="gradient-heading">My Task Dashboard</h2>
          <p className="text-white">
            Today is {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* KPI Section */}
        <div className="row g-4 mb-4">
          {/* Tasks Due Today */}
          <div className="col-12 col-md-4">
            <div className="card bg-primary  text-white shadow-sm h-100 rounded-4">
              <div className="card-body d-flex align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 50, height: 50 }}>
                  <i className="bi bi-clock fs-4 text-white"></i>
                </div>
                <div>
                  <div className="small">Tasks Due Today</div>
                  <h3 className="fw-bold mb-0">{tasksDueToday}</h3>
                </div>
              </div>
              <div className="card-footer bg-white bg-opacity-10 border-0 rounded-bottom-4">
                <a href="#"
                  className="text-white small fw-semibold text-decoration-none"
                  onClick={e => { e.preventDefault(); setSelectedTab('dueToday'); }}>
                  View all due tasks <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="col-12 col-md-4">
            <div className="card bg-danger  text-white shadow-sm h-100 rounded-4">
              <div className="card-body d-flex align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 50, height: 50 }}>
                  <i className="bi bi-exclamation-triangle fs-4 text-white"></i>
                </div>
                <div>
                  <div className="small">Overdue Tasks</div>
                  <h3 className="fw-bold mb-0">{overdueTasks}</h3>
                </div>
              </div>
              <div className="card-footer bg-white bg-opacity-10 border-0 rounded-bottom-4">
                <a href="#"
                  className="text-white small fw-semibold text-decoration-none"
                  onClick={e => { e.preventDefault(); setSelectedTab('overdue'); }}>
                  View all overdue tasks <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Tasks In Progress */}
          <div className="col-12 col-md-4">
            <div className="card bg-info  text-white shadow-sm h-100 rounded-4">
              <div className="card-body d-flex align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 50, height: 50 }}>
                  <i className="bi bi-arrow-repeat fs-4 text-white"></i>
                </div>
                <div>
                  <div className="small">Tasks In Progress</div>
                  <h3 className="fw-bold mb-0">{tasksInProgress}</h3>
                </div>
              </div>
              <div className="card-footer bg-white bg-opacity-10 border-0 rounded-bottom-4">
                <a href="#"
                  className="text-white small fw-semibold text-decoration-none"
                  onClick={e => { e.preventDefault(); setSelectedTab('inProgress'); }}>
                  View all in-progress tasks <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* Task Table Section */}
        <div className="card shadow-sm">
          <div className="card-header table-gradient-bg border-bottom-0">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">
              <h3 className="h5 mb-0">My Tasks Overview</h3>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <button type="button" className="btn btn-outline-secondary text-white">
                  <i className="bi bi-filter me-2"></i>
                  Filter
                </button>
                <form className="d-flex" role="search" onSubmit={e => e.preventDefault()}>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search tasks"
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-secondary text-white ms-2" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
            </div>
            {/* Tabs */}
            <ul className="nav nav-tabs mt-3 d-flex flex-column flex-sm-row">
              <li className="nav-item flex-fill">
                <button
                  className={`nav-link ${selectedTab === 'all' ? 'active' : ''} w-100`}
                  onClick={() => setSelectedTab('all')}
                  type="button"
                >
                  All Tasks
                </button>
              </li>
              <li className="nav-item flex-fill">
                <button
                  className={`nav-link ${selectedTab === 'dueToday' ? 'active' : ''} w-100`}
                  onClick={() => setSelectedTab('dueToday')}
                  type="button"
                >
                  Due Today ({tasksDueToday})
                </button>
              </li>
              <li className="nav-item flex-fill">
                <button
                  className={`nav-link ${selectedTab === 'overdue' ? 'active' : ''} w-100`}
                  onClick={() => setSelectedTab('overdue')}
                  type="button"
                >
                  Overdue ({overdueTasks})
                </button>
              </li>
              <li className="nav-item flex-fill">
                <button
                  className={`nav-link ${selectedTab === 'inProgress' ? 'active' : ''} w-100`}
                  onClick={() => setSelectedTab('inProgress')}
                  type="button"
                >
                  In Progress ({tasksInProgress})
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive"
              style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table className="table table-hover table-gradient-bg align-middle mb-0">
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
                    <th>S. No.</th> {/* Changed from ID to Serial Number */}
                    <th
                      className="cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('project')}
                    >
                      Project Title
                      {sortColumn === 'project' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? (
                            <i className="bi bi-caret-up-fill"></i>
                          ) : (
                            <i className="bi bi-caret-down-fill"></i>
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className="cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('task')}
                    >
                      Task
                      {sortColumn === 'task' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? (
                            <i className="bi bi-caret-up-fill"></i>
                          ) : (
                            <i className="bi bi-caret-down-fill"></i>
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className="cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('dueDate')}
                    >
                      Due Date &amp; Time
                      {sortColumn === 'dueDate' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? (
                            <i className="bi bi-caret-up-fill"></i>
                          ) : (
                            <i className="bi bi-caret-down-fill"></i>
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className="cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortColumn === 'status' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? (
                            <i className="bi bi-caret-up-fill"></i>
                          ) : (
                            <i className="bi bi-caret-down-fill"></i>
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className="cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('priority')}
                    >
                      Priority
                      {sortColumn === 'priority' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? (
                            <i className="bi bi-caret-up-fill"></i>
                          ) : (
                            <i className="bi bi-caret-down-fill"></i>
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className="cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('timeSpent')}
                    >
                      Time Spent
                      {sortColumn === 'timeSpent' && (
                        <span className="ms-1">
                          {sortDirection === 'asc' ? (
                            <i className="bi bi-caret-up-fill"></i>
                          ) : (
                            <i className="bi bi-caret-down-fill"></i>
                          )}
                        </span>
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.length > 0 ? (
                    sortedTasks.map((task, index) => (
                      <tr key={task.id}  className="text-center">
                        <td>{index + 1}</td> {/* Serial Number */}
                        <td>{task.project}</td>
                        <td>{task.task}</td>
                        <td>{formatDateTime(task.dueDate)}</td>
                        <td>{renderStatusBadge(task.status)}</td>
                        <td>{renderPriorityBadge(task.priority)}</td>
                        <td>{task.timeSpent}</td>
                        <td>
                          <button
                            className="btn btn-info text-light p-2 me-2"
                            onClick={() => handleEditClick(task)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-danger text-light p-2">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center text-muted">
                        No tasks found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
            <Modal show={showEditModal} onHide={handleCloseModal} centered className="custom-modal-dark">
              <Modal.Header closeButton>
                <Modal.Title>Edit Task</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {editTask && (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Project</Form.Label>
                      <Form.Control type="text" value={editTask.project} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Task</Form.Label>
                      <Form.Control type="text" value={editTask.task} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Due Date</Form.Label>
                      <Form.Control type="date" value={formatDateTime(editTask.dueDate)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={editTask.status}
                        onChange={handleEditChange}
                      >
                        <option value="YTS">Yet to Start</option>
                        <option value="WIP">In Progress</option>
                        <option value="QC">Quality Check</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={editTask.priority}
                        onChange={handleEditChange}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Time Spent</Form.Label>
                      <Form.Control type="text" value={editTask.timeSpent} />
                    </Form.Group>
                  </Form>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal} className='rounded-5'>
                  Close
                </Button>
                <Button variant="" className='gradient-button' >
                  Save
                </Button>
                {/* Add Save button if you want to save changes */}
              </Modal.Footer>
            </Modal>
          </div>
          {/* Pagination */}
          <div className="card-footer table-gradient-bg d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
            <div className=" small">
              Showing <span className="fw-semibold">1</span> to <span className="fw-semibold">{sortedTasks.length}</span> of{' '}
              <span className="fw-semibold">{sortedTasks.length}</span> results
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item disabled">
                  <button className="page-link">Previous</button>
                </li>
                <li className="page-item active">
                  <button className="page-link">1</button>
                </li>
                <li className="page-item">
                  <button className="page-link">2</button>
                </li>
                <li className="page-item">
                  <button className="page-link">3</button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
                <li className="page-item">
                  <button className="page-link">8</button>
                </li>
                <li className="page-item">
                  <button className="page-link">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
