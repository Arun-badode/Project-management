import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Badge,
  ProgressBar,
  Pagination,
} from "react-bootstrap";
import {
  Calendar,
  People,
  Flag,
  Eye,
  Pencil,
  Share,
  CheckCircle,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clipboard,
} from "react-bootstrap-icons";

const Assigned = () => {
  // Sample project data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      status: "In Progress",
      dueDate: "2025-07-15",
      progress: 65,
      teamMembers: 4,
      priority: "High",
    },
    {
      id: 2,
      name: "Mobile App Development",
      status: "Planning",
      dueDate: "2025-08-30",
      progress: 20,
      teamMembers: 6,
      priority: "Medium",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      status: "On Hold",
      dueDate: "2025-07-05",
      progress: 40,
      teamMembers: 3,
      priority: "Low",
    },
    {
      id: 4,
      name: "Database Migration",
      status: "Completed",
      dueDate: "2025-06-10",
      progress: 100,
      teamMembers: 5,
      priority: "High",
    },
    {
      id: 5,
      name: "User Research Study",
      status: "In Progress",
      dueDate: "2025-07-25",
      progress: 50,
      teamMembers: 2,
      priority: "Medium",
    },
    {
      id: 6,
      name: "Product Launch",
      status: "Planning",
      dueDate: "2025-09-15",
      progress: 10,
      teamMembers: 8,
      priority: "High",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [editProject, setEditProject] = useState(null);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleEdit = (project) => {
    setEditProject({ ...project });
    setShowEditModal(true);
  };

  const [newProject, setNewProject] = useState({
    name: "",
    status: "Planning",
    dueDate: "",
    teamMembers: "",
    priority: "Medium",
    description: "",
  });

  const handleAddProject = () => {
    if (!newProject.name || !newProject.dueDate) {
      return;
    }

    const projectToAdd = {
      id: projects.length + 1,
      name: newProject.name,
      status: newProject.status,
      dueDate: newProject.dueDate,
      progress: 0,
      teamMembers: newProject.teamMembers,
      priority: newProject.priority,
    };

    setProjects([...projects, projectToAdd]);
    setShowAddModal(false);
    setNewProject({
      name: "",
      status: "Planning",
      dueDate: "",
      teamMembers: "",
      priority: "Medium",
      description: "",
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" || project.status === filterStatus;
      const matchesPriority =
        filterPriority === "All" || project.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "progress") {
        return b.progress - a.progress;
      }
      return 0;
    });

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "primary";
      case "Planning":
        return "info";
      case "On Hold":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "secondary";
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="container-fluid bg-main p-3 ">
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between py-3 gap-2">
        <h2 className="gradient-heading ms-0 ms-md-3 mb-2 mb-md-0 text-center text-md-start">
          Assigned Projects
        </h2>
        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto">
          <Form.Group
            controlId="searchProjects"
            className="position-relative flex-grow-1"
          >
            <Form.Control
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="ps-4"
            />
          </Form.Group>
          <div className="d-flex gap-2 mt-2 mt-sm-0">
            <Button
              variant="btn btn-secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="d-flex align-items-center rounded-5"
            >
              <Filter className="me-2" />
              Filters
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="d-flex align-items-center gradient-button"
            >
              <Plus className="me-2" />
              Assigned Project
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Row className="g-3 mb-3">
          <Col xs={12} md={4}>
            <Form.Group controlId="sortBy">
              <Form.Label className="text-white">Sort by</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="progress">Progress</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="filterStatus">
              <Form.Label className="text-white">Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="filterPriority">
              <Form.Label className="text-white">Priority</Form.Label>
              <Form.Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      )}

      {/* Main content */}
      <div className="py-4">
        <Container fluid>
          {filteredProjects.length > 0 ? (
            <Row xs={1} sm={2} md={3} className="g-4">
              {filteredProjects.map((project) => (
                <Col key={project.id}>
                  <Card className="h-100 shadow-sm bg-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Card.Title className="mb-0">{project.name}</Card.Title>
                        <Badge bg={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <Calendar className="me-2" />
                        <small>Due: {formatDate(project.dueDate)}</small>
                      </div>

                      <div className="d-flex align-items-center  mb-2">
                        <People className="me-2" />
                        <small>{project.teamMembers} team members</small>
                      </div>

                      <div className="d-flex align-items-center  mb-3">
                        <Flag className="me-2" />
                        <small className="d-flex align-items-center">
                          Priority:
                          <span
                            className={`bg-${getPriorityColor(
                              project.priority
                            )} rounded-circle p-1 ms-2 me-1`}
                          ></span>
                          {project.priority}
                        </small>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <ProgressBar now={project.progress} variant="primary" />
                      </div>
                    </Card.Body>

                    <Card.Footer className="bg-card border-top">
                      <div className="d-flex justify-content-start">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none p-0 me-2"
                          onClick={() => handleView(project)}
                        >
                          <Eye className="me-1 " /> View
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none p-0"
                          onClick={() => handleEdit(project)}
                        >
                          <Pencil className="me-1" /> Edit
                        </Button>
                        {/* <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none p-0"
                        >
                          <Share className="me-1" /> Share
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none p-0"
                        >
                          <CheckCircle className="me-1" /> Complete
                        </Button> */}
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center py-5">
              <Card.Body>
                <Clipboard size={48} className="text-muted mb-3" />
                <h3 className="h5 mb-2">No assigned projects found</h3>
                <p className="text-muted mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button className="gradient-button" onClick={() => setShowAddModal(true)}>
                  <Plus className="me-2" />
                  Assigned Project
                </Button>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>View Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-card">
          {selectedProject && (
            <div>
              <h5>{selectedProject.name}</h5>
              <p>Status: {selectedProject.status}</p>
              <p>Due Date: {formatDate(selectedProject.dueDate)}</p>
              <p>Team Members: {selectedProject.teamMembers}</p>
              <p>Priority: {selectedProject.priority}</p>
              {/* Add more fields as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-card">
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
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
        <Modal.Body className="bg-card">
          {editProject && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Project Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.name}
                  onChange={(e) =>
                    setEditProject({ ...editProject, name: e.target.value })
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
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Due Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={editProject.dueDate}
                  onChange={(e) =>
                    setEditProject({ ...editProject, dueDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Team Members</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={editProject.teamMembers}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      teamMembers: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={editProject.priority}
                  onChange={(e) =>
                    setEditProject({ ...editProject, priority: e.target.value })
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editProject.description || ""}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-card">
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setProjects(
                projects.map((p) => (p.id === editProject.id ? editProject : p))
              );
              setShowEditModal(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pagination */}
      {filteredProjects.length > 0 && (
        <div className=" border-top py-3">
          <Container>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
              <div className="mb-2 gradient-heading mb-md-0">
                <small className="text-white">
                  Showing <span className="fw-bold">1</span> to{" "}
                  <span className="fw-bold">{filteredProjects.length}</span> of{" "}
                  <span className="fw-bold">{filteredProjects.length}</span>{" "}
                  results
                </small>
              </div>
              <Pagination className="mb-0">
                <Pagination.Prev>
                  <ChevronLeft />
                </Pagination.Prev>
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next>
                  <ChevronRight />
                </Pagination.Next>
              </Pagination>
            </div>
          </Container>
        </div>
      )}

      {/* Floating back button */}
      {/* <Button
        variant="light"
        className="position-fixed bottom-0 start-0 m-3 d-flex align-items-center shadow"
      >
        <ChevronLeft className="me-1" />
        Back to Dashboard
      </Button>  */}

      {/* Add Project Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header className="" closeButton>
          <Modal.Title>Assigned Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-card">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name *</Form.Label>
              <Form.Control
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                placeholder="Enter project name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date *</Form.Label>
              <Form.Control
                type="date"
                value={newProject.dueDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, dueDate: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Team Members</Form.Label>
              <Form.Select
                type="number"
                min="1"
                value={newProject.teamMembers}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    teamMembers: e.target.value,
                  })
                }
              >
                <option value="John Doe">John Doe</option>
                <option value="Sarah Smith">Sarah Smith</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Emily Davis">Emily Davis</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={newProject.priority}
                onChange={(e) =>
                  setNewProject({ ...newProject, priority: e.target.value })
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-card">
          <Button variant="secondary" className="rounded-5" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button className="gradient-button" onClick={handleAddProject}>
            Create Project
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Assigned;
