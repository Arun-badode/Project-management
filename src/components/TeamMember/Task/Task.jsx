import React, { useState } from 'react';

function Task() {
    const [tasks, setTasks] = useState([
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
                { user: "Project Manager", text: "Please follow the brand guidelines", date: "2025-06-17" }
            ],
            timeTracked: 0,
            serverPath: ""
        },
        {
            id: 2,
            name: "Implement User Authentication",
            status: "WIP", // Work In Progress
            project: "Mobile App Development",
            dueDate: "2025-06-23",
            assignee: "Jane Smith",
            priority: "Critical",
            files: ["auth_flow.pdf", "api_docs.md"],
            comments: [
                { user: "Backend Dev", text: "API endpoints are ready for integration", date: "2025-06-18" }
            ],
            timeTracked: 4.5,
            serverPath: ""
        },
        {
            id: 3,
            name: "QA Testing for Payment Module",
            status: "QC YTS", // Quality Check Yet To Start
            project: "E-commerce Platform",
            dueDate: "2025-06-21",
            assignee: "Unassigned",
            priority: "Medium",
            files: ["test_cases.xlsx", "payment_flow.pdf"],
            comments: [
                { user: "Developer", text: "All payment gateways have been integrated", date: "2025-06-16" }
            ],
            timeTracked: 0,
            serverPath: ""
        },
        {
            id: 4,
            name: "Fix Navigation Bug",
            status: "Corr WIP", // Correction Work In Progress
            project: "Mobile App Development",
            dueDate: "2025-06-20",
            assignee: "Alex Johnson",
            priority: "High",
            files: ["bug_report.pdf", "screenshots.zip"],
            comments: [
                { user: "QA Tester", text: "Bug occurs on iOS devices only", date: "2025-06-15" }
            ],
            timeTracked: 2.5,
            serverPath: ""
        }
    ]);

    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [serverPath, setServerPath] = useState("");
    const [notes, setNotes] = useState("");
    const [reassignReason, setReassignReason] = useState("");
    const [serverPathError, setServerPathError] = useState("");

    const handleTaskAction = (taskId, action) => {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;

        const updatedTasks = [...tasks];
        const task = { ...updatedTasks[taskIndex] };

        switch (action) {
            case 'start':
                task.status = "WIP";
                break;
            case 'pause':
                task.status = "WIP (Paused)";
                break;
            case 'complete':
                setSelectedTask(task);
                setShowCompleteModal(true);
                return;
            case 'self-assign':
                task.status = "QC WIP";
                task.assignee = "Current User";
                break;
            case 'reassign':
                setSelectedTask(task);
                setShowReassignModal(true);
                return;
            case 'details':
                setSelectedTask(task);
                setShowDetailsModal(true);
                return;
            default:
                return;
        }

        updatedTasks[taskIndex] = task;
        setTasks(updatedTasks);
    };

    const handleCompleteTask = () => {
        if (!serverPath.trim()) {
            setServerPathError("Server Path is required");
            return;
        }

        const taskIndex = tasks.findIndex(task => task.id === selectedTask.id);
        if (taskIndex === -1) return;

        const updatedTasks = [...tasks];
        const task = { ...updatedTasks[taskIndex] };

        if (task.status === "WIP") {
            task.status = "QC YTS";
        } else if (task.status === "Corr WIP") {
            task.status = "RFD";
        }

        task.serverPath = serverPath;
        updatedTasks[taskIndex] = task;

        setTasks(updatedTasks);
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

    const renderActionButtons = (task) => {
        return (
            <div className="d-flex flex-wrap gap-2">
                {(task.status === "YTS" || task.status === "WIP (Paused)") && (
                    <button
                        onClick={() => handleTaskAction(task.id, 'start')}
                        className="btn btn-primary btn-sm"
                    >
                        <i className="fas fa-play me-2"></i>
                        {task.status === "YTS" ? "Start Work" : "Resume Work"}
                    </button>
                )}
                {task.status === "WIP" && (
                    <button
                        onClick={() => handleTaskAction(task.id, 'pause')}
                        className="btn btn-warning btn-sm"
                    >
                        <i className="fas fa-pause me-2"></i>
                        Pause Work
                    </button>
                )}
                {(task.status === "WIP" || task.status === "Corr WIP") && (
                    <button
                        onClick={() => handleTaskAction(task.id, 'complete')}
                        className="btn btn-success btn-sm"
                    >
                        <i className="fas fa-check me-2"></i>
                        Complete Task
                    </button>
                )}
                {task.status === "QC YTS" && (
                    <button
                        onClick={() => handleTaskAction(task.id, 'self-assign')}
                        className="btn btn-info btn-sm"
                    >
                        <i className="fas fa-user-check me-2"></i>
                        Self-Assign
                    </button>
                )}
                <button
                    onClick={() => handleTaskAction(task.id, 'reassign')}
                    className="btn btn-warning btn-sm"
                >
                    <i className="fas fa-exchange-alt me-2"></i>
                    Reassign
                </button>
                <button
                    onClick={() => handleTaskAction(task.id, 'details')}
                    className="btn btn-secondary btn-sm"
                >
                    <i className="fas fa-expand-alt me-2"></i>
                    Details
                </button>
            </div>
        );
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'YTS':
                return 'bg-light text-dark';
            case 'WIP':
                return 'bg-info text-white';
            case 'WIP (Paused)':
                return 'bg-warning text-dark';
            case 'QC YTS':
                return 'bg-secondary text-white';
            case 'QC WIP':
                return 'bg-primary text-white';
            case 'Corr WIP':
                return 'bg-danger text-white';
            case 'RFD':
                return 'bg-success text-white';
            default:
                return 'bg-light text-dark';
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'Low':
                return 'bg-primary text-white';
            case 'Medium':
                return 'bg-warning text-dark';
            case 'High':
                return 'bg-danger text-white';
            case 'Critical':
                return 'bg-dark text-white';
            default:
                return 'bg-light text-dark';
        }
    };


    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4 gradient-heading">Task Management</h1>
            <div className="list-group overflow-auto">
                {tasks.map(task => (
                    <div key={task.id} className="list-group-item bg-card d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2">
                        <div className="flex-grow-1 mb-2 mb-md-0">
                            <h5 className="mb-1">{task.name}</h5>
                            <span className={`badge ${getStatusBadgeColor(task.status)}`}>{task.status}</span>
                            <span className={`badge ${getPriorityBadgeColor(task.priority)} ms-2`}>{task.priority}</span>
                        </div>
                        <div className="flex-shrink-0">
                            {renderActionButtons(task)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Complete Task Modal */}
            {showCompleteModal && selectedTask && (
                <div className="modal fade show custom-modal-dark " tabIndex={-1} style={{ display: 'block' }} aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Complete Task</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCompleteModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="serverPath" className="form-label">Server Path</label>
                                    <input
                                        type="text"
                                        id="serverPath"
                                        value={serverPath}
                                        onChange={(e) => setServerPath(e.target.value)}
                                        className={`form-control ${serverPathError ? 'is-invalid' : ''}`}
                                        placeholder="Enter server path"
                                    />
                                    {serverPathError && <div className="invalid-feedback">{serverPathError}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="notes" className="form-label">Notes</label>
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
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCompleteModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleCompleteTask}>Complete Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reassign Task Modal */}
            {showReassignModal && selectedTask && (
                <div className="modal fade show custom-modal-dark" tabIndex={-1} style={{ display: 'block' }} aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Request Reassignment</h5>
                                <button type="button" className="btn-close" onClick={() => setShowReassignModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="reassignReason" className="form-label">Reason for Reassignment</label>
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
                                <button type="button" className="btn btn-secondary" onClick={() => setShowReassignModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-warning" onClick={handleReassignRequest}>Submit Request</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Task;
