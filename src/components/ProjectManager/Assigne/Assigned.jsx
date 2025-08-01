import axios from "axios";
import React, { useEffect, useState } from "react";

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
  Trash,
} from "react-bootstrap-icons";
import BASE_URL from "../../../config";

const Assigned = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const token = localStorage.getItem("authToken");

  const [editProject, setEditProject] = useState(null);

  const [newProject, setNewProject] = useState({
    name: "",
    status: "Planning",
    dueDate: "",
    memberId: "",
    priority: "Medium",
    description: "",
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [teamMembersList, setTeamMembersList] = useState([]);

  useEffect(() => {
    // Fetch projects
    axios
      .get(`${BASE_URL}assignedProjects/getAllAssignedProjects`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status) {
          const transformed = response.data.data.map((item) => ({
            id: item.id,
            name: item.projectName,
            status: item.status,
            dueDate: item.dueDate,
            priority: item.priority,
            teamMembers: 1,
            progress:
              item.status === "Completed"
                ? 100
                : item.status === "In Progress"
                ? 50
                : 0,
            description: item.description || "",
            memberId: item.memberId || "",
          }));
          setProjects(transformed);
          setFilteredProjects(transformed);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });

    // Fetch team members
    axios
      .get(`${BASE_URL}member/getAllMembers`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setTeamMembersList(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch team members:", err));
  }, []);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowEditModal(true);
  };

  const handleAddProject = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}assignedProjects/addAssignedProject`,
        {
          projectName: newProject.name,
          status: newProject.status,
          dueDate: newProject.dueDate,
          priority: newProject.priority,
          description: newProject.description,
          memberId: parseInt(newProject.memberId),
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        const newProjectData = {
          id: response.data.data.id,
          name: newProject.name,
          status: newProject.status,
          dueDate: newProject.dueDate,
          priority: newProject.priority,
          teamMembers: 1,
          progress: newProject.status === "Completed" ? 100 : newProject.status === "In Progress" ? 50 : 0,
          description: newProject.description,
          memberId: newProject.memberId,
        };

        setProjects([...projects, newProjectData]);
        setFilteredProjects([...filteredProjects, newProjectData]);
        setNewProject({
          name: "",
          status: "Planning",
          dueDate: "",
          memberId: "",
          priority: "Medium",
          description: "",
        });
        setShowAddModal(false);
        alert("Project created successfully!");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error while creating project");
    }
  };

  const handleUpdateProject = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}assignedProjects/updateAssignedProject/${editProject.id}`,
        {
          projectName: editProject.name,
          status: editProject.status,
          dueDate: editProject.dueDate,
          priority: editProject.priority,
          description: editProject.description,
          memberId: parseInt(editProject.memberId),
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        const updatedProjects = projects.map((p) =>
          p.id === editProject.id ? editProject : p
        );
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
        setShowEditModal(false);
        alert("Project updated successfully!");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error while updating project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await axios.delete(
          `${BASE_URL}assignedProjects/deleteAssignedProject/${projectId}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status) {
          const updatedProjects = projects.filter((p) => p.id !== projectId);
          setProjects(updatedProjects);
          setFilteredProjects(updatedProjects);
          alert("Project deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Error while deleting project");
      }
    }
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

                      <div className="d-flex align-items-center mb-2">
                        <People className="me-2" />
                        <small>{project.teamMembers} team member</small>
                      </div>

                      <div className="d-flex align-items-center mb-3">
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
                          <Eye className="me-1" /> View
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none p-0 me-2"
                          onClick={() => handleEdit(project)}
                        >
                          <Pencil className="me-1" /> Edit
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none p-0"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash className="me-1" /> Delete
                        </Button>
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
                <Button
                  className="gradient-button"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="me-2" />
                  Assigned Project
                </Button>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>

      {/* View Project Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-card">
          {selectedProject && (
            <div>
              <h4 className="mb-4">{selectedProject.name}</h4>
              
              <div className="mb-3">
                <h6 className="">Status</h6>
                <Badge bg={getStatusColor(selectedProject.status)}>
                  {selectedProject.status}
                </Badge>
              </div>
              
              <div className="mb-3">
                <h6 className="">Due Date</h6>
                <p>{formatDate(selectedProject.dueDate)}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="">Priority</h6>
                <Badge bg={getPriorityColor(selectedProject.priority)}>
                  {selectedProject.priority}
                </Badge>
              </div>
              
              <div className="mb-3">
                <h6 className="">Team Members</h6>
                <p>{selectedProject.teamMembers}</p>
              </div>
              
              <div className="mb-3">
                <h6 className="">Progress</h6>
                <ProgressBar now={selectedProject.progress} variant="primary" />
                <small className="">{selectedProject.progress}% complete</small>
              </div>
              
              {selectedProject.description && (
                <div className="mb-3">
                  <h6 className="">Description</h6>
                  <p>{selectedProject.description}</p>
                </div>
              )}
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
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-card">
          {editProject && (
            <Form>
              <Row>
                <Col md={6}>
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
                </Col>
                <Col md={6}>
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
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
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
                </Col>
                <Col md={6}>
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
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Team Member</Form.Label>
                <Form.Select
                  value={editProject.memberId}
                  onChange={(e) =>
                    setEditProject({ ...editProject, memberId: e.target.value })
                  }
                >
                  <option value="">Select Member</option>
                  {teamMembersList.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.fullName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editProject.description}
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
          <Button variant="primary" onClick={handleUpdateProject}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Project Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        className="custom-modal-dark"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-card">
          <Form>
            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Team Member *</Form.Label>
              <Form.Select
                value={newProject.memberId}
                onChange={(e) =>
                  setNewProject({ ...newProject, memberId: e.target.value })
                }
              >
                <option value="">Select Member</option>
                {teamMembersList.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    description: e.target.value,
                  })
                }
                placeholder="Enter project description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-card">
          <Button
            variant="secondary"
            className="rounded-5"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </Button>
          <Button className="gradient-button" onClick={handleAddProject}>
            Create Project
          </Button>
        </Modal.Footer>
      </Modal>

      {filteredProjects.length > 0 && (
        <div className="border-top py-3">
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
    </div>
  );
};

export default Assigned;