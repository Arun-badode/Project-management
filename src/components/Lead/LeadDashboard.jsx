import React, { useState } from 'react';
import { Card, Button, Table, Badge, ProgressBar, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaUsers, FaClock, FaTasks, FaUserClock } from 'react-icons/fa';


const LeadDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className="lead-dashboard text-white p-4 bg-main" >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="gradient-heading ">Project Manager Dashboard</h2>
        <Button variant="outline-light" className="gradient-button" onClick={handleShow}>
          <FaPlus className="me-2 " /> Create New Project
        </Button>
      </div>

      {/* Top KPIs */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card className="bg-card text-white p-3">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <h3>4</h3>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="bg-card text-white p-3">
            <Card.Body>
              <Card.Title>Tasks Due Soon</Card.Title>
              <h3>7</h3>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="bg-card text-white p-3">
            <Card.Body>
              <Card.Title>Team Availability</Card.Title>
              <h3>3 Available</h3>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Main Section - Project Table */}
      <Card className="table-gradient-bg text-white p-4 mb-4">
        <h4 className="mb-3">Assigned Projects Overview</h4>
        <Table  hover responsive className="table-borderless table-gradient-bg">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Process Status</th>
              <th>QA Status</th>
              <th>Delivery Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AI Tool Migration</td>
              <td><Badge bg="info">In Progress</Badge></td>
              <td><Badge bg="warning">Pending</Badge></td>
              <td><Badge bg="success">On-time</Badge></td>
              <td><ProgressBar now={60} label={`60%`} /></td>
            </tr>
            <tr>
              <td>UI Redesign</td>
              <td><Badge bg="primary">Design Phase</Badge></td>
              <td><Badge bg="danger">Blocked</Badge></td>
              <td><Badge bg="danger">Delayed</Badge></td>
              <td><ProgressBar variant="danger" now={25} label={`25%`} /></td>
            </tr>
          </tbody>
        </Table>
      </Card>

      <div className="row">
        {/* Resource Workload Panel */}
        <div className="col-md-6 mb-4">
          <Card className="bg-card text-white p-3">
            <h5 className="mb-3">Resource Workload</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>John Doe (I'm In)</span>
              <Badge bg="secondary">2 WIP</Badge>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Jane Smith (I'm Out)</span>
              <Badge bg="danger">N/A</Badge>
            </div>
            <div className="d-flex justify-content-between">
              <span>Alan Roe (I'm In)</span>
              <Badge bg="secondary">1 WIP</Badge>
            </div>
          </Card>
        </div>

        {/* Task Requests Panel */}
        <div className="col-md-6 mb-4">
          <Card className="bg-card text-white p-3">
            <h5 className="mb-3">Task Requests Management</h5>
            <div className="mb-2">
              <strong>Request:</strong> Reassign Task "#2341"
              <div className="mt-1">
                <Button size="sm" variant="success" className="me-2">Approve</Button>
                <Button size="sm" variant="danger" className="me-2">Reject</Button>
                <Button size="sm" variant="outline-info">Discuss</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Collaboration Section */}
      <Card className="bg-card text-white p-3">
        <h5 className="mb-3">Collaboration</h5>
        <div className="d-flex justify-content-between">
          <span><FaUsers className="me-2" />#UI-567 - Jane commented on "Color Scheme Options"</span>
          <Button size="sm" variant="outline-light">Reply</Button>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <span><FaTasks className="me-2" />#Task-842 - John updated "MOT Testing Flowchart"</span>
          <Button size="sm" variant="outline-light">View</Button>
        </div>
      </Card>

      {/* Create New Project Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3" controlId="formProjectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control type="text" placeholder="Enter project name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProcessStatus">
              <Form.Label>Process Status</Form.Label>
              <Form.Select>
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formQAStatus">
              <Form.Label>QA Status</Form.Label>
              <Form.Select>
                <option>Pending</option>
                <option>Passed</option>
                <option>Blocked</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDeliveryStatus">
              <Form.Label>Delivery Status</Form.Label>
              <Form.Select>
                <option>Early</option>
                <option>On-time</option>
                <option>Delayed</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">Create Project</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LeadDashboard;
