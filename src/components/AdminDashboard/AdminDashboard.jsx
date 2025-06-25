import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { FaPlus, FaEye } from "react-icons/fa";
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
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);

  // Generate projects on component mount
  useEffect(() => {
    setProjects(generateRandomProjects(15));
    setFilteredProjects(generateRandomProjects(15));
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  // Unified filter handler
  const handleCardFilter = (type) => {
    let filtered = [];
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    switch (type) {
      case 'active':
        filtered = projects.filter(p => p.status === 'Active');
        break;
      case 'nearDue':
        filtered = projects.filter(project => {
          const dueDate = new Date(project.dueDate);
          return dueDate > today && dueDate <= nearDueDate && project.status !== 'Completed';
        });
        break;
      case 'overdue':
        filtered = projects.filter(project => {
          const dueDate = new Date(project.dueDate);
          return dueDate < today && project.status !== 'Completed';
        });
        break;
      case 'teamOnDuty':
        filtered = projects.filter(p => p.status === 'Team On-Duty');
        break;
      case 'eventsToday':
        const todayStr = today.toISOString().split('T')[0];
        filtered = projects.filter(project => {
          return project.dueDate === todayStr || project.qcDueDate === todayStr;
        });
        break;
      case 'pendingApproval':
        filtered = projects.filter(p => p.qaStatus === 'Pending');
        break;
      default:
        filtered = projects;
    }
    setFilteredProjects(filtered);
    setActiveFilter(type);
  };

  // Card counts based on filteredProjects (so cards always match table)
  const countFiltered = (type) => {
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    switch (type) {
      case 'active':
        return filteredProjects.filter(p => p.status === 'Active').length;
      case 'nearDue':
        return filteredProjects.filter(project => {
          const dueDate = new Date(project.dueDate);
          return dueDate > today && dueDate <= nearDueDate && project.status !== 'Completed';
        }).length;
      case 'overdue':
        return filteredProjects.filter(project => {
          const dueDate = new Date(project.dueDate);
          return dueDate < today && project.status !== 'Completed';
        }).length;
      case 'teamOnDuty':
        return filteredProjects.filter(p => p.status === 'Team On-Duty').length;
      case 'eventsToday':
        const todayStr = today.toISOString().split('T')[0];
        return filteredProjects.filter(project => {
          return project.dueDate === todayStr || project.qcDueDate === todayStr;
        }).length;
      case 'pendingApproval':
        return filteredProjects.filter(p => p.qaStatus === 'Pending').length;
      default:
        return filteredProjects.length;
    }
  };

  // Show all projects
  const showAllProjects = () => {
    setFilteredProjects(projects);
    setActiveFilter('all');
  };

  const [ setAllProjects] = useState([]);

  useEffect(() => {
    // Example fetch - replace with your actual logic
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setAllProjects(data);
        setFilteredProjects(data); // default view
      });
  }, []);

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
    const statuses = ["Active", "Near Due", "Overdue", "Team On-Duty"];
    const handlers = ["Jane", "John", "Alice", "Bob", "Charlie", "Eve"];
    const qaReviewers = ["Alan", "Sarah", "Mike", "Lisa", "David"];
    const qaStatuses = ["Passed", "Failed", "Pending", "In Review"];
    const processStatuses = ["Ongoing", "Completed", "Pending", "Delayed"];

    const projects = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const randomDays = Math.floor(Math.random() * 30) - 5; // Some will be overdue
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
        </div>
      </div>

      {/* KPIs */}
<Row className="mb-4 g-3">
  {[
    { key: 'active', title: 'Active Projects', icon: 'bi-rocket-takeoff', color: 'primary' },
    { key: 'nearDue', title: 'Near Due', icon: 'bi-hourglass-split', color: 'warning text-dark' },
    { key: 'overdue', title: 'Overdue', icon: 'bi-exclamation-octagon', color: 'danger' },
    { key: 'teamOnDuty', title: 'Team On-Duty', icon: 'bi-people-fill', color: 'info' },
    { key: 'eventsToday', title: 'Events Today', icon: 'bi-calendar-event', color: 'success', link: '/Attendance' },
    { key: 'pendingApproval', title: 'Pending Approval', icon: 'bi-clock-history', color: 'secondary' }
  ].map(({ key, title, icon, color, link }) => (
    <Col xs={12} sm={6} md={2} key={key}>
      <Card
        className={`bg-${color} bg-gradient text-white p-3 rounded-4 shadow-sm border-0 w-100 ${
          activeFilter === key ? 'border border-3 border-light' : ''
        }`}
        onClick={() => !link && handleCardFilter(key)}
        style={{ cursor: 'pointer', minHeight: '150px', height: '150px' }}
      >
        {link ? (
          <Link to={link} className="text-white text-decoration-none d-flex flex-column h-100 justify-content-between">
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${icon} fs-4`}></i>
                <Card.Title className="fs-6 fw-semibold mb-0">{title}</Card.Title>
              </div>
              <h3 className="fw-bold text-end m-0">{countFiltered(key)}</h3>
            </Card.Body>
          </Link>
        ) : (
          <Card.Body className="d-flex flex-column justify-content-between h-100">
            <div className="d-flex align-items-center gap-2">
              <i className={`bi ${icon} fs-4`}></i>
              <Card.Title className="fs-6 fw-semibold mb-0">{title}</Card.Title>
            </div>
            <h3 className="fw-bold text-end m-0">{countFiltered(key)}</h3>
          </Card.Body>
        )}
      </Card>
    </Col>
  ))}
</Row>




      {/* Show All button */}
      {activeFilter !== 'all' && (
        <Button variant="outline-light" size="sm" onClick={showAllProjects}>
          Show All
        </Button>
      )}

      {/* Charts */}
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
        <div className="col-md-6">
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
                <p className="mb-1">Total Hours This Week</p>
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
        {activeFilter !== 'active' && (
          <div className="mb-3">
          </div>
        )}

        {/* SCROLLABLE CONTAINER */}
        <div
          className="table-responsive"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
<<<<<<< HEAD
          <Table className="table-gradient-bg align-middle mt-0 table table-bordered table-hover">
            <thead className="table-light ">
=======
          <Table className="table-gradient-bg align-middle  table table-bordered table-hover">
            <thead className="table bg-dark p-2  .">
>>>>>>> bf23a6f65c9a6e91cd07b50dfdf6a52be73ad990
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
              {filteredProjects.map((project) => (
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
                            : project.status === "Active"
                              ? "primary"
                              : project.status === "Near Due"
                                ? "info"
                                : project.status === "Overdue"
                                  ? "danger"
                                  : project.status === "Team On-Duty"
                                    ? "secondary"
                                    : "dark"
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
              <p><strong>Title:</strong> {selectedProject.title}</p>
              <p><strong>Client:</strong> {selectedProject.client}</p>
              <p><strong>Platform:</strong> {selectedProject.platform}</p>
              <p><strong>Pages:</strong> {selectedProject.pages}</p>
              <p><strong>Due Date:</strong> {selectedProject.dueDate}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Handler:</strong> {selectedProject.handler}</p>
              <p><strong>QA Reviewer:</strong> {selectedProject.qaReviewer}</p>
              <p><strong>QA Status:</strong> {selectedProject.qaStatus}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Project Modal */}
      {/* <Modal
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
              <Form.Group className="mb-3">
                <Form.Label>Platform</Form.Label>
                <Form.Select
                  className="text-white border-secondary"
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
      </Modal> */}

      <Col md={12} className="text-end">
        <Link to='/Project' className="text-decoration-none">
          <Button className="gradient-button me-2">Go To</Button>
        </Link>
      </Col>
    </div>
  );
};

export default AdminDashboard;