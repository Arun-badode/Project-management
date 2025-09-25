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
  Table,
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
  PersonCheck,
} from "react-bootstrap-icons";
import BASE_URL from "../../../config";

const Assigned = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const token = localStorage.getItem("authToken");
  
  // Try to get user ID from different possible keys in localStorage
  const userId = localStorage.getItem("roleId") || 
                 localStorage.getItem("userId") || 
                 localStorage.getItem("id") || 
                 "";

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [teamMembersList, setTeamMembersList] = useState([]);
  const [assignProjectData, setAssignProjectData] = useState({
    projectId: "",
    memberId: "",
    notes: "",
    deadline: "",
    estimatedHours: "",
  });

  useEffect(() => {
    // Only fetch projects if we have a valid userId
    if (!userId) {
      console.error("No user ID found in localStorage");
      return;
    }

    // Fetch projects by manager ID
    axios
      .get(`${BASE_URL}project/getProjectsByManagerId/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status) {
          setProjects(response.data.data.projects || []);
          setFilteredProjects(response.data.data.projects || []);
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
          // Filter only team members
          const teamMembers = res.data.data.filter(
            (member) => member.roleName === "Team-Member"
          );
          setTeamMembersList(teamMembers);
        }
      })
      .catch((err) => console.error("Failed to fetch team members:", err));
  }, [userId, token]);

  useEffect(() => {
    // Apply filters and search
    let result = [...projects];
    
    if (searchTerm) {
      result = result.filter(project => 
        project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== "All") {
      result = result.filter(project => project.status === filterStatus);
    }
    
    if (filterPriority !== "All") {
      result = result.filter(project => project.priority === filterPriority);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sortBy === "priority") {
        const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
    
    setFilteredProjects(result);
  }, [searchTerm, filterStatus, filterPriority, sortBy, projects]);

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
    if (!dateString || dateString === "0000-00-00") return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleAssignProject = (project) => {
    setSelectedProject(project);
    setAssignProjectData({
      projectId: project.id,
      memberId: "",
      notes: "",
      deadline: project.deadline || "",
      estimatedHours: project.estimatedHours || "",
    });
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}project/projects/manager/${userId}`,
        {
         
          projectManagerId: parseInt(userId) // Added projectManagerId to payload
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        alert("Project assigned successfully!");
        setShowAssignModal(false);
        // Refresh the projects list after assignment
        axios
          .get(`${BASE_URL}project/getProjectsByManagerId/${userId}`, {
            headers: { authorization: `Bearer ${token}` },
          })
          .then((response) => {
            if (response.data.status) {
              setProjects(response.data.data.projects || []);
              setFilteredProjects(response.data.data.projects || []);
            }
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      }
    } catch (error) {
      console.error("Error assigning project:", error);
      alert("Error while assigning project");
    }
  };

  return (
    <div className="container-fluid bg-main p-3">
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
                <option value="deadline">Due Date</option>
                <option value="priority">Priority</option>
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
          {!userId ? (
            <Card className="text-center py-5">
              <Card.Body>
                <Clipboard size={48} className="text-muted mb-3" />
                <h3 className="h5 mb-2">User Authentication Error</h3>
                <p className="text-muted mb-4">
                  Unable to identify user. Please log in again.
                </p>
              </Card.Body>
            </Card>
          ) : filteredProjects.length > 0 ? (
            <Card className="bg-card">
              <Card.Body>
                <Table responsive hover className="text-white">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Client ID</th>
                      <th>Country</th>
                      <th>Deadline</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Estimated Hours</th>
                      <th>Total Cost</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.projectTitle}</td>
                        <td>{project.clientId}</td>
                        <td>{project.country}</td>
                        <td>{formatDate(project.deadline)}</td>
                        <td>
                          <Badge bg={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </td>
                        <td>{project.estimatedHours}</td>
                        <td>{project.totalCost} {project.currency}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAssignProject(project)}
                          >
                            <PersonCheck className="me-1" /> Assign
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            <Card className="text-center py-5">
              <Card.Body>
                <Clipboard size={48} className="text-muted mb-3" />
                <h3 className="h5 mb-2">No assigned projects found</h3>
                <p className="text-muted mb-4">
                  Try adjusting your search or filter criteria.
                </p>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>

      {/* Assign Project Modal */}
      <Modal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        centered
        className="custom-modal-dark"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Project to Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-card">
          {selectedProject && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedProject.projectTitle}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Team Member *</Form.Label>
                    <Form.Select
                      value={assignProjectData.memberId}
                      onChange={(e) =>
                        setAssignProjectData({
                          ...assignProjectData,
                          memberId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Member</option>
                      {teamMembersList.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.fullName} ({member.empId})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                      type="date"
                      value={assignProjectData.deadline}
                      onChange={(e) =>
                        setAssignProjectData({
                          ...assignProjectData,
                          deadline: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estimated Hours</Form.Label>
                    <Form.Control
                      type="number"
                      value={assignProjectData.estimatedHours}
                      onChange={(e) =>
                        setAssignProjectData({
                          ...assignProjectData,
                          estimatedHours: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={assignProjectData.notes}
                  onChange={(e) =>
                    setAssignProjectData({
                      ...assignProjectData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Enter any notes for the assignment"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-card">
          <Button
            variant="secondary"
            onClick={() => setShowAssignModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignSubmit}
            disabled={!assignProjectData.memberId}
          >
            Assign Project
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