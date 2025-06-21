import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

// Define arrays used in random project generation
const platforms = ["Web", "Mobile", "Desktop"];
const statuses = ["In Progress", "Completed", "On Hold"];
const handlers = ["Alice", "Bob", "Charlie", "David"];
// const processStatuses = ["Pending", "Completed", "Delayed"];
const qaReviewers = ["Eve", "Mallory", "Trent"];
const qaStatuses = ["Passed", "Failed", "In Review"];

const LeadDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);

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
        status: statuses[Math.floor(Math.random() * statuses.length)],
        handler: handlers[Math.floor(Math.random() * handlers.length)],
        // processStatus:
        //   processStatuses[Math.floor(Math.random() * processStatuses.length)],
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
        <h2 className="gradient-heading">All Project</h2>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button className="gradient-button"><i class="fa-solid fa-upload me-2"></i>Excel Import</Button>
          <Button className="gradient-button" onClick={handleShow}>
            <FaPlus className="me-2" /> Create New Project
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <Card className="text-white p-3 mb-5 table-gradient-bg">
        <h4 className="mb-3">Project List</h4>
        <div className="table-responsive table-gradient-bg">
          <Table className="table-gradient-bg align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Title</th>
                <th>Client</th>
                <th>Tasks</th>
                <th>Languages</th>
                <th>Platform</th>
                <th>Total Pages</th>
                <th>Actual Due Date</th>
                <th>Ready for QC Deadline</th>
                <th>QC Hrs</th>
                <th>QC Due Date</th>
                <th>Status</th>
                <th>Handler</th>
                {/* <th>Process Status</th> */}
                <th>QA Reviewer</th>
                <th>QA Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.title}</td>
                  <td>{project.client}</td>
                  <td>{project.tasks}</td>
                  <td>{project.languages}</td>
                  <td>{project.platform}</td>
                  <td>{project.pages}</td>
                  <td>{project.dueDate}</td>
                  <td>{project.qcDeadline}</td>
                  <td>{project.qcHours}</td>
                  <td>{project.qcDueDate}</td>
                  <td>
                    <Badge
                      bg={
                        project.status === "Completed"
                          ? "success"
                          : project.status === "On Hold"
                          ? "warning"
                          : "info"
                      }
                    >
                      {project.status}
                    </Badge>
                  </td>
                  <td>{project.handler}</td>
                  {/* <td>
                    <Badge
                      bg={
                        project.processStatus === "Completed"
                          ? "success"
                          : project.processStatus === "Delayed"
                          ? "danger"
                          : project.processStatus === "Pending"
                          ? "warning"
                          : "primary"
                      }
                    >
                      {project.processStatus}
                    </Badge>
                  </td> */}
                  <td>{project.qaReviewer}</td>
                  <td>
                    <Badge
                      bg={
                        project.qaStatus === "Passed"
                          ? "success"
                          : project.qaStatus === "Failed"
                          ? "danger"
                          : project.qaStatus === "In Review"
                          ? "info"
                          : "secondary"
                      }
                    >
                      {project.qaStatus}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="link"
                      className="text-info p-0 me-2"
                      title="View"
                      onClick={() => handleView(project)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="link"
                      className="text-warning p-0 me-2"
                      title="Edit"
                      onClick={() => handleEdit(project)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      title="Delete"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Create Project Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control type="text" placeholder="Enter title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control type="text" placeholder="Enter client name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Platform</Form.Label>
              <Form.Select className="text-white border-secondary">
                <option>Web</option>
                <option>Mobile</option>
                <option>Desktop</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Pages</Form.Label>
              <Form.Control type="number" placeholder="Enter page count" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Actual Due Date</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ready for QC Deadline</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>QC Hours Allocated</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>QC Due Date</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 gradient-button"
            >
              Create Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
              {/* <p>
                <strong>Server Path:</strong> {selectedProject.serverPath}
              </p> */}
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
              <Form.Group className="mb-3">
                <Form.Label>Ready for QC Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={editProject.qcDeadline}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      qcDeadline: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>QC Hours Allocated</Form.Label>
                <Form.Control
                  type="number"
                  value={editProject.qcHours}
                  onChange={(e) =>
                    setEditProject({ ...editProject, qcHours: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>QC Due Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={editProject.qcDueDate}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      qcDueDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editProject.status}
                  onChange={(e) =>
                    setEditProject({ ...editProject, status: e.target.value })
                  }
                >
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </Form.Select>
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