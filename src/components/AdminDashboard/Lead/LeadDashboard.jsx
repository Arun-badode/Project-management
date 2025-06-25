import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { FaPlus, FaEye, FaEdit, FaTrash, FaCheck, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";



// Define arrays used in random project generation
const platforms = ["Web", "Mobile", "Desktop"];
const statuses = ["In Progress", "Completed", "On Hold"];
const handlers = ["Alice", "Bob", "Charlie", "David"];
const qaReviewers = ["Eve", "Mallory", "Trent"];
const qaStatuses = ["Passed", "Failed", "In Review"];
const fileStatuses = ["Not Started", "In Progress", "Completed", "QA Review", "Delivered"];
const stages = ["Development", "Testing", "Review", "Deployment", "Live"];
const languages = ["HTML/CSS", "JavaScript", "Python", "PHP", "Java"];

const LeadDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const dropdownRef = useRef(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowEditModal(true);
  };

  const handleMarkComplete = (project) => {
    // Implement your mark complete logic here
    console.log("Marking project as complete:", project);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if the click is not on any progress bar or view button
        const isProgressBar = event.target.closest('.progress, .progress-bar');
        const isViewButton = event.target.closest('.btn.text-info');
        
        if (!isProgressBar && !isViewButton) {
          setExpandedProject(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProjectDetails = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  // Generate random file details for each project
  const getFileDetails = (projectId) => {
    const fileCount = Math.floor(Math.random() * 5) + 3; // 3-7 files per project
    const files = [];
    
    for (let i = 0; i < fileCount; i++) {
      const status = fileStatuses[Math.floor(Math.random() * fileStatuses.length)];
      files.push({
        id: `${projectId}-${i}`,
        name: `file_${projectId}_${i}.${i % 2 === 0 ? 'html' : 'css'}`,
        pages: Math.floor(Math.random() * 10) + 1,
        language: languages[Math.floor(Math.random() * languages.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        stage: stages[Math.floor(Math.random() * stages.length)],
        assignedTo: handlers[Math.floor(Math.random() * handlers.length)],
        handler: handlers[Math.floor(Math.random() * handlers.length)],
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        status: status,
        progress: status === "Not Started" ? 0 : 
                 status === "Completed" || status === "Delivered" ? 100 : 
                 status === "QA Review" ? 90 : 
                 Math.floor(Math.random() * 50) + 30,
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
      });
    }
    
    return files;
  };

  const generateRandomProjects = (count) => {
    const clients = [
      "Acme Corp",
      "Globex",
      "Soylent",
      "Initech",
      "Umbrella",
      "Wayne Ent",
      "Stark Ind",
      "Oscorp",
    ];

    const projects = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const randomDays = Math.floor(Math.random() * 30) + 1;
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + randomDays);

      const qcDeadline = new Date(dueDate);
      qcDeadline.setDate(dueDate.getDate() - 2);

      const qcDueDate = new Date(qcDeadline);
      qcDueDate.setDate(qcDeadline.getDate() + 1);

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const progress = status === "Completed" ? 100 : 
                      status === "On Hold" ? Math.floor(Math.random() * 30) + 10 : 
                      Math.floor(Math.random() * 60) + 30;

      projects.push({
        id: i + 1,
        title: `Project ${i + 1}`,
        client: clients[Math.floor(Math.random() * clients.length)],
        tasks: Math.floor(Math.random() * 10) + 1,
        languages: Math.floor(Math.random() * 5) + 1,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        pages: Math.floor(Math.random() * 200) + 50,
        dueDate: dueDate.toISOString().split("T")[0],
        qcDeadline: qcDeadline.toISOString().split("T")[0],
        qcHours: Math.floor(Math.random() * 24) + 1,
        qcDueDate: qcDueDate.toISOString().split("T")[0],
        status: status,
        progress: progress,
        handler: handlers[Math.floor(Math.random() * handlers.length)],
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        serverPath: `/server/path/project${i + 1}`,
      });
    }

    return projects;
  };

  const projects = generateRandomProjects(15);

  return (
    <div className="admin-dashboard text-white p-3 p-md-4 bg-main">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="gradient-heading">Active Project</h2>
      </div>

      {/* Main Table */}
      <Card className="text-white p-3 mb-5 table-gradient-bg">
        <h4 className="mb-3"> Active Project </h4>

        <div
          className="table-responsive table-gradient-bg"
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <Table className="table-gradient-bg align-middle mb-0 table table-bordered table-hover">
            <thead className="table-light bg-dark ">
              <tr>
                <th>S. No.</th>
                <th>Project Title</th>
                <th>Client</th>
                <th>Tasks</th>
                <th>Languages</th>
                <th>Platform</th>
                <th>Total Pages</th>
                <th>Actual Due Date & Time</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{project.title}</td>
                    <td>{project.client}</td>
                    <td>{project.tasks}</td>
                    <td>{project.languages}</td>
                    <td>{project.platform}</td>
                    <td>{project.pages}</td>
                    <td>{project.dueDate}</td>
                    <td style={{ minWidth: "150px" }}>
                      <div 
                        className="progress" 
                        style={{ height: "20px", cursor: 'pointer' }}
                        onClick={() => toggleProjectDetails(project.id)}
                      >
                        <div
                          className={`progress-bar ${
                            project.progress >= 100 ? "bg-success" : "bg-primary"
                          }`}
                          role="progressbar"
                          style={{
                            width: `${project.progress || 0}%`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            color: project.progress < 50 ? "#000" : "#fff",
                          }}
                          aria-valuenow={project.progress || 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {`${project.progress || 0}%`}
                        </div>
                      </div>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        className="text-info p-0 me-2"
                        title="View"
                        onClick={() => {
                          handleView(project);
                          toggleProjectDetails(project.id);
                        }}
                      >
                        <FaEye /> View
                      </Button>

                      <Button
                        variant="link"
                        className="text-warning p-0 me-2"
                        title="Edit"
                        onClick={() => handleEdit(project)}
                      >
                        <FaEdit /> Edit
                      </Button>

                      <Button
                        variant="link"
                        className="text-success p-0 me-2"
                        title="Mark Complete"
                        onClick={() => handleMarkComplete(project)}
                      >
                        <FaCheck /> Complete
                      </Button>

                      <Button
                        variant="link"
                        className="text-danger p-0"
                        title="Delete"
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                  {expandedProject === project.id && (
                    <tr ref={dropdownRef}>
                      <td colSpan="10" className="p-0">
                        
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* View Project Details Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div>
              <p>
                <strong>Title:</strong> {selectedProject.title}
              </p>
              <p>
                <strong>Client:</strong> {selectedProject.client}
              </p>
              <p>
                <strong>Platform:</strong> {selectedProject.platform}
              </p>
              <p>
                <strong>Pages:</strong> {selectedProject.pages}
              </p>
              <p>
                <strong>Due Date:</strong> {selectedProject.dueDate}
              </p>
              <p>
                <strong>Status:</strong> {selectedProject.status}
              </p>
              <p>
                <strong>Handler:</strong> {selectedProject.handler}
              </p>
              <p>
                <strong>QA Reviewer:</strong> {selectedProject.qaReviewer}
              </p>
              <p>
                <strong>QA Status:</strong> {selectedProject.qaStatus}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProject && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Project Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.title}
                  onChange={(e) =>
                    setEditProject({ ...editProject, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Client</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.client}
                  onChange={(e) =>
                    setEditProject({ ...editProject, client: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Platform</Form.Label>
                <Form.Select
                  className="text-white border-secondary"
                  value={editProject.platform}
                  onChange={(e) =>
                    setEditProject({ ...editProject, platform: e.target.value })
                  }
                >
                  <option>Web</option>
                  <option>Mobile</option>
                  <option>Desktop</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total Pages</Form.Label>
                <Form.Control
                  type="number"
                  value={editProject.pages}
                  onChange={(e) =>
                    setEditProject({ ...editProject, pages: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Actual Due Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={editProject.dueDate}
                  onChange={(e) =>
                    setEditProject({ ...editProject, dueDate: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 gradient-button"
              >
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LeadDashboard;