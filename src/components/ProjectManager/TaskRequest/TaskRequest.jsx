import React, { useState } from 'react';
import { 
  Container, 
  ListGroup, 
  Badge, 
  Button, 
  Modal, 
  Form, 
  Row, 
  Col,
  ButtonGroup
} from 'react-bootstrap';
import {
  PlayFill,
  PauseFill,
  Check,
  PersonCheck,
  ArrowLeftRight,
  InfoCircle,
  X,
  Folder
} from 'react-bootstrap-icons';

function TaskRequest() {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            name: "Design Homepage Layout",
            status: "YTS", // Yet To Start
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
        const task = {...updatedTasks[taskIndex]};

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
        const task = {...updatedTasks[taskIndex]};

        if (task.status === "WIP") {
            task.status = "QC YTS";
        } else if (task.status === "Corr WIP") {
            task.status = "RFD"; // Ready For Delivery
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
            <ButtonGroup size="sm" className="flex-wrap">
                {/* Start/Resume Work Button */}
                {(task.status === "YTS" || task.status === "WIP (Paused)") && (
                    <Button 
                        variant="primary"
                        onClick={() => handleTaskAction(task.id, 'start')}
                        className="mb-1"
                    >
                        <PlayFill className="me-1" />
                        <span className="d-none d-sm-inline">
                            {task.status === "YTS" ? "Start Work" : "Resume Work"}
                        </span>
                    </Button>
                )}
                
                {/* Pause Work Button */}
                {task.status === "WIP" && (
                    <Button 
                        variant="warning"
                        onClick={() => handleTaskAction(task.id, 'pause')}
                        className="mb-1"
                    >
                        <PauseFill className="me-1" />
                        <span className="d-none d-sm-inline">Pause Work</span>
                    </Button>
                )}
                
                {/* Complete Task Button */}
                {(task.status === "WIP" || task.status === "Corr WIP") && (
                    <Button 
                        variant="success"
                        onClick={() => handleTaskAction(task.id, 'complete')}
                        className="mb-1"
                    >
                        <Check className="me-1" />
                        <span className="d-none d-sm-inline">Complete Task</span>
                    </Button>
                )}
                
                {/* Self-Assign Button (QA Only) */}
                {task.status === "QC YTS" && (
                    <Button 
                        variant="info"
                        onClick={() => handleTaskAction(task.id, 'self-assign')}
                        className="mb-1"
                    >
                        <PersonCheck className="me-1" />
                        <span className="d-none d-sm-inline">Self-Assign</span>
                    </Button>
                )}
                
                {/* Request Reassignment Button */}
                <Button 
                    variant="warning"
                    onClick={() => handleTaskAction(task.id, 'reassign')}
                    className="mb-1"
                >
                    <ArrowLeftRight className="me-1" />
                    <span className="d-none d-sm-inline">Reassign</span>
                </Button>
                
                {/* View Details Button */}
                <Button 
                    variant="secondary"
                    onClick={() => handleTaskAction(task.id, 'details')}
                    className="mb-1"
                >
                    <InfoCircle className="me-1" />
                    <span className="d-none d-sm-inline">Details</span>
                </Button>
            </ButtonGroup>
        );
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'YTS': return 'bg-light text-dark';
            case 'WIP': return 'bg-info text-white';
            case 'WIP (Paused)': return 'bg-warning text-dark';
            case 'QC YTS': return 'bg-secondary text-white';
            case 'QC WIP': return 'bg-primary text-white';
            case 'Corr WIP': return 'bg-danger text-white';
            case 'RFD': return 'bg-success text-white';
            default: return 'bg-light text-dark';
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'Low': return 'bg-primary text-white';
            case 'Medium': return 'bg-warning text-dark';
            case 'High': return 'bg-danger text-white';
            case 'Critical': return 'bg-dark text-white';
            default: return 'bg-light text-dark';
        }
    };

    return (
        <Container fluid className="py-3">
            <h1 className="gradient-heading ">Task Management</h1>

            <ListGroup>
                {tasks.map(task => (
                    <ListGroup.Item key={task.id} className="mb-3 bg-card">
                        <Row className="align-items-center">
                            <Col xs={12} md={6} className="mb-2 mb-md-0">
                                <h5 className="mb-1">{task.name}</h5>
                                <div className="d-flex flex-wrap gap-1">
                                    <Badge pill className={getStatusBadgeColor(task.status)}>
                                        {task.status}
                                    </Badge>
                                    <Badge pill className={getPriorityBadgeColor(task.priority)}>
                                        {task.priority}
                                    </Badge>
                                    <small className=" d-block d-md-inline">
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </small>
                                </div>
                            </Col>
                            <Col xs={12} md={6} className="text-md-end">
                                {renderActionButtons(task)}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/* Complete Task Modal */}
            <Modal className='custom-modal-dark' show={showCompleteModal} onHide={() => setShowCompleteModal(false)} centered>
                <Modal.Header  className='' closeButton>
                    <Modal.Title >Complete Task</Modal.Title>
                </Modal.Header >
                <Modal.Body className=''>
                    <Form>
                        <Form.Group className="mb-3 ">
                            <Form.Label>Server Path <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={serverPath}
                                onChange={(e) => setServerPath(e.target.value)}
                                isInvalid={!!serverPathError}
                                placeholder="Enter server path"
                            />
                            <Form.Control.Feedback type="invalid">
                                {serverPathError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any additional notes"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCompleteTask}>
                        Complete Task
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Reassign Task Modal */}
            <Modal className='custom-modal-dark' show={showReassignModal} onHide={() => setShowReassignModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Request Reassignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Reason for Reassignment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={reassignReason}
                                onChange={(e) => setReassignReason(e.target.value)}
                                placeholder="Please explain why you need this task to be reassigned"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReassignModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={handleReassignRequest}>
                        Submit Request
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Task Details Modal */}
            <Modal className='custom-modal-dark' show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTask && (
                        <div>
                            <h5>{selectedTask.name}</h5>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <Badge pill className={getStatusBadgeColor(selectedTask.status)}>
                                    {selectedTask.status}
                                </Badge>
                                <Badge pill className={getPriorityBadgeColor(selectedTask.priority)}>
                                    {selectedTask.priority}
                                </Badge>
                                <span className="">Project: {selectedTask.project}</span>
                                <span className="">Due: {new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                                <span className="">Assignee: {selectedTask.assignee}</span>
                            </div>

                            <h6 className="mt-4">Files:</h6>
                            <ul className="list-unstyled">
                                {selectedTask.files.map((file, index) => (
                                    <li key={index} className="mb-1">
                                        <Folder className="me-2 text-primary" />
                                        {file}
                                    </li>
                                ))}
                            </ul>

                            <h6 className="mt-4">Comments:</h6>
                            <div className="border rounded p-3">
                                {selectedTask.comments.map((comment, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex justify-content-between">
                                            <strong>{comment.user}</strong>
                                            <small className="text-muted">{comment.date}</small>
                                        </div>
                                        <p className="mb-0">{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default TaskRequest;