import React, { useState } from 'react';
import { Card, Button, Table, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaFileExport } from 'react-icons/fa';
// import './AdminDashboard.css';

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    client: '',
    platform: '',
    pages: '',
    handler: '',
    status: ''
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Random project data generator
  const generateRandomProjects = (count) => {
    const clients = ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella', 'Wayne Ent', 'Stark Ind', 'Oscorp'];
    const platforms = ['Web', 'Mobile', 'Desktop'];
    const statuses = ['In Progress', 'Completed', 'On Hold'];
    const handlers = ['Jane', 'John', 'Alice', 'Bob', 'Charlie', 'Eve'];
    const qaReviewers = ['Alan', 'Sarah', 'Mike', 'Lisa', 'David'];
    const qaStatuses = ['Passed', 'Failed', 'Pending', 'In Review'];
    const processStatuses = ['Ongoing', 'Completed', 'Pending', 'Delayed'];
    
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
        dueDate: dueDate.toISOString().split('T')[0],
        qcDeadline: qcDeadline.toISOString().split('T')[0],
        qcHours: Math.floor(Math.random() * 24) + 1,
        qcDueDate: qcDueDate.toISOString().split('T')[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        handler: handlers[Math.floor(Math.random() * handlers.length)],
        processStatus: processStatuses[Math.floor(Math.random() * processStatuses.length)],
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        serverPath: `/mnt/server/project/project-${i + 1}`
      });
    }
    
    return projects;
  };

  const projects = generateRandomProjects(15);

  return (
    <div className="admin-dashboard text-white p-4" style={{ background: 'linear-gradient(to bottom right, #1d2671, #c33764)', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <div>
          <Button variant="outline-light" className="rounded-pill px-4 me-2" onClick={handleShow}>
            <FaPlus className="me-2" /> Create New Project
          </Button>
          <Button variant="outline-light" className="rounded-pill px-4">
            <FaFileExport className="me-2" /> Export Data
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-dark text-white p-3">
            <Card.Body>
              <Card.Title>Total Active Projects</Card.Title>
              <h4>{projects.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-white p-3">
            <Card.Body>
              <Card.Title>Total Resources</Card.Title>
              <h4>27</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-white p-3">
            <Card.Body>
              <Card.Title>Projects Deadline</Card.Title>
              <h4>4</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-white p-3">
            <Card.Body>
              <Card.Title>Overdue Projects</Card.Title>
              <h4>2</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="bg-dark text-white p-3 mb-4">
        <h5>Filters</h5>
        <Row className="gy-3">
          <Col md={2}>
            <Form.Control
              type="text"
              name="client"
              placeholder="Client"
              value={filters.client}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Select name="platform" value={filters.platform} onChange={handleFilterChange}>
              <option value="">Platform</option>
              <option>Web</option>
              <option>Mobile</option>
              <option>Desktop</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              name="pages"
              placeholder="Total Pages"
              value={filters.pages}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="text"
              name="handler"
              placeholder="Handler"
              value={filters.handler}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">Status</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>On Hold</option>
            </Form.Select>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card className="bg-dark text-white p-3">
        <h4>Project List</h4>
        <Table variant="dark" responsive hover className="mt-3">
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
              <th>Process Status</th>
              <th>QA Reviewer</th>
              <th>QA Status</th>
              <th>Server Path</th>
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
                      project.status === 'Completed' ? 'success' : 
                      project.status === 'On Hold' ? 'warning' : 'info'
                    }
                  >
                    {project.status}
                  </Badge>
                </td>
                <td>{project.handler}</td>
                <td>
                  <Badge 
                    bg={
                      project.processStatus === 'Completed' ? 'success' : 
                      project.processStatus === 'Delayed' ? 'danger' : 
                      project.processStatus === 'Pending' ? 'warning' : 'primary'
                    }
                  >
                    {project.processStatus}
                  </Badge>
                </td>
                <td>{project.qaReviewer}</td>
                <td>
                  <Badge 
                    bg={
                      project.qaStatus === 'Passed' ? 'success' : 
                      project.qaStatus === 'Failed' ? 'danger' : 
                      project.qaStatus === 'In Review' ? 'info' : 'secondary'
                    }
                  >
                    {project.qaStatus}
                  </Badge>
                </td>
                <td>{project.serverPath}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Create New Project Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Control type="text" placeholder="Enter client name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Platform</Form.Label>
              <Form.Select>
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
            <Button variant="primary" type="submit">Create Project</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;