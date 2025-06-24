import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { FaPlus, FaFileExport, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';


const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  
  //   client: "",
  //   platform: "",
  //   pages: "",
  //   handler: "",
  //   status: "",
  // });

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
    const platforms = ["Web", "Mobile", "Desktop"];
    const statuses = ["In Progress", "Completed", "On Hold"];
    const handlers = ["Jane", "John", "Alice", "Bob", "Charlie", "Eve"];
    const qaReviewers = ["Alan", "Sarah", "Mike", "Lisa", "David"];
    const qaStatuses = ["Passed", "Failed", "Pending", "In Review"];
    const processStatuses = ["Ongoing", "Completed", "Pending", "Delayed"];

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
        processStatus:
          processStatuses[Math.floor(Math.random() * processStatuses.length)],
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        serverPath: `/mnt/server/project/project-${i + 1}`,
      });
    }

    return projects;
  };

  const projects = generateRandomProjects(15);


  const barData = [
  { name: 'Mon', Design: 20, Development: 40, Testing: 10, Deployment: 10 },
  { name: 'Tue', Design: 30, Development: 35, Testing: 15, Deployment: 10 },
  { name: 'Wed', Design: 40, Development: 30, Testing: 10, Deployment: 15 },
  { name: 'Thu', Design: 30, Development: 35, Testing: 10, Deployment: 10 },
  { name: 'Fri', Design: 25, Development: 35, Testing: 15, Deployment: 10 }
];

const pieData = [
  { name: 'Development', value: 60 },
  { name: 'Meetings', value: 30 },
  { name: 'Planning', value: 20 },
  { name: 'QA', value: 25 },
  { name: 'Documentation', value: 10 }
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];


  return (
    <div className="admin-dashboard text-white p-3 p-md-4 bg-main">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="gradient-heading">Admin Dashboard</h2>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button className="gradient-button" onClick={handleShow}>
            <FaPlus className="me-2" /> Create New Project
          </Button>
          {/* <Button className="gradient-button">
            <FaFileExport className="me-2" /> Export Data
          </Button> */}
        </div>
      </div>

      {/* KPIs */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} md={2}>
          <Card className="bg-card text-white p-3 h-100">
            <Card.Body>
              <Card.Title> Active Projects</Card.Title>
              <h4>{projects.length}</h4>
            </Card.Body>
          </Card>
        </Col>
       
        <Col xs={12} sm={6} md={2}>
          <Card className="bg-card text-white p-3 h-100">
            <Card.Body>
              <Card.Title> Near Due</Card.Title>
              <h4>4</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={2}>
          <Card className="bg-card text-white p-3 h-100">
            <Card.Body>
              <Card.Title>Overdue </Card.Title>
              <h4>2</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={2}>
          <Card className="bg-card text-white p-3 h-100">
            <Card.Body>
              <Card.Title>Team On-Duty</Card.Title>
              <h4>{projects.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={2}>
          <Card className="bg-card text-white p-3 h-100">
            <Card.Body>
              <Card.Title>Events Today </Card.Title>
              <h4>{projects.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={2}>
          <Card className="bg-card text-white p-3  h-100">
            <Card.Body>
              <Card.Title>Pending Approval  </Card.Title>
              <h4>{projects.length}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      {/* <Card className="bg-card text-white p-3 mb-4">
        <h5>Filters</h5>
        <Row className="gy-3">
          <Col xs={12} sm={6} md={2}>
            <Form.Control
              type="text"
              name="client"
              placeholder="Client"
             
              
            />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Form.Select
              name="platform"
             
            >
              <option value="">Platform</option>
              <option>Web</option>
              <option>Mobile</option>
              <option>Desktop</option>
            </Form.Select>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Form.Control
              type="number"
              name="pages"
              placeholder="Total Pages"
             
             
            />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Form.Control
              type="text"
              name="handler"
              placeholder="Handler"
             
             
            />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Form.Select
              name="status"
              
              
            >
              <option value="">Status</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>On Hold</option>
            </Form.Select>
          </Col>
        </Row>
      </Card> */}


 <div className="row g-4 mb-4">

        {/* Resource Utilization */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm h-100 bg-card">
            <h5>Resource Utilization</h5>
            <p className="text-muted">Utilization %</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} stackOffset="expand">
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value * 100}%`} />
                <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Legend />
                <Bar dataKey="Design" stackId="a" fill="#6366F1" />
                <Bar dataKey="Development" stackId="a" fill="#10B981" />
                <Bar dataKey="Testing" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Deployment" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <p className="mb-0">Average utilization: <strong className="text-primary">76%</strong></p>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-primary">Daily</button>
                <button className="btn btn-sm btn-primary">Weekly</button>
                <button className="btn btn-sm btn-outline-primary">Monthly</button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Tracking Summary */}
        <div className="col-md-6 ">
          <div className="card p-3 shadow-sm h-100 bg-card">
            <h5>Time Tracking Summary</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="row text-center mt-3">
              <div className="col-6 border-end">
                <p className="mb-1 ">Total Hours This Week</p>
                <h5 className="text-primary fw-bold">187 hours</h5>
              </div>
              <div className="col-6">
                <p className="mb-1">Productivity Score</p>
                <h5 className="text-success fw-bold">92%</h5>
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* Main Table */}
     <Card className="text-white p-3 mb-5 table-gradient-bg">
  <h4 className="mb-3">Project List</h4>

  {/* SCROLLABLE CONTAINER */}
  <div
    className="table-responsive"
    style={{ maxHeight: "400px", overflowY: "auto" }}
  >
    <Table className="table-gradient-bg align-middle mt-0 table table-bordered table-hover">
      <thead className="table-light bg-dark sticky-top">
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
                className="text-info p-0 ms-3"
                title="View"
                onClick={() => handleView(project)}
              >
                <FaEye />
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
              <Form.Label>Project Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Control type="text" placeholder="Enter client name" />
            </Form.Group>
            <Form.Group className="mb-3 ">
              <Form.Label>Platform</Form.Label>
              <Form.Select className="text-white border-secondary ">
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
              <p><strong>Title:</strong> {selectedProject.title}</p>
              <p><strong>Client:</strong> {selectedProject.client}</p>
              <p><strong>Platform:</strong> {selectedProject.platform}</p>
              <p><strong>Pages:</strong> {selectedProject.pages}</p>
              <p><strong>Due Date:</strong> {selectedProject.dueDate}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Handler:</strong> {selectedProject.handler}</p>
              <p><strong>QA Reviewer:</strong> {selectedProject.qaReviewer}</p>
              <p><strong>QA Status:</strong> {selectedProject.qaStatus}</p>
              {/* <p><strong>Server Path:</strong> {selectedProject.serverPath}</p> */}
              {/* Add more fields as needed */}
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
                  onChange={e =>
                    setEditProject({ ...editProject, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Client</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.client}
                  onChange={e =>
                    setEditProject({ ...editProject, client: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3 ">
                <Form.Label>Platform</Form.Label>
                <Form.Select
                  className="text-white border-secondary "
                  defaultValue={editProject.platform}
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
                  placeholder="Enter page count"
                  defaultValue={editProject.pages}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Actual Due Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={editProject.dueDate}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ready for QC Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={editProject.qcDeadline}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>QC Hours Allocated</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={editProject.qcHours}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>QC Due Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={editProject.qcDueDate}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select defaultValue={editProject.status}>
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

       <Col md={12} className="text-end">
  <Button className="gradient-button me-2">Go To</Button>
</Col>
    </div>
  );
};

export default AdminDashboard;
