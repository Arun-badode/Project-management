import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  BarChart2,
  Calendar as CalendarIcon,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Settings,
  Loader,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { Modal, Button, Form, Badge, ProgressBar } from "react-bootstrap";
import { ResponsiveContainer } from "recharts";

// Initialize calendar localizer
const localizer = momentLocalizer(moment);

const ResourceManagement = () => {
  // Sample data
  const [resources, setResources] = useState([
    {
      id: 1,
      name: "John Smith",
      role: "Developer",
      skills: ["React", "Node.js", "TypeScript"],
      availability: 80,
      currentProjects: ["Project A", "Project B"],
      allocation: 65,
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Designer",
      skills: ["UI/UX", "Figma", "Photoshop"],
      availability: 90,
      currentProjects: ["Project C"],
      allocation: 45,
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
    },
    {
      id: 3,
      name: "Mike Chen",
      role: "QA Engineer",
      skills: ["Testing", "Automation", "Selenium"],
      availability: 70,
      currentProjects: ["Project A", "Project D"],
      allocation: 85,
      email: "mike.chen@example.com",
      phone: "+1 (555) 456-7890",
    },
    {
      id: 4,
      name: "Emma Davis",
      role: "Project Manager",
      skills: ["Agile", "Scrum", "JIRA"],
      availability: 60,
      currentProjects: ["Project B", "Project C"],
      allocation: 55,
      email: "emma.d@example.com",
      phone: "+1 (555) 789-0123",
    },
    {
      id: 5,
      name: "Alex Rivera",
      role: "DevOps",
      skills: ["AWS", "Docker", "Kubernetes"],
      availability: 85,
      currentProjects: ["Project D"],
      allocation: 30,
      email: "alex.r@example.com",
      phone: "+1 (555) 234-5678",
    },
  ]);

  const [projects] = useState([
    {
      id: 1,
      name: "Project A",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      teamSize: 3,
    },
    {
      id: 2,
      name: "Project B",
      startDate: "2023-06-15",
      endDate: "2023-09-30",
      teamSize: 2,
    },
    {
      id: 3,
      name: "Project C",
      startDate: "2023-07-01",
      endDate: "2023-10-15",
      teamSize: 4,
    },
    {
      id: 4,
      name: "Project D",
      startDate: "2023-05-15",
      endDate: "2023-07-31",
      teamSize: 2,
    },
  ]);

  const [events] = useState([
    {
      id: 1,
      title: "Project A - Sprint Planning",
      start: new Date(2023, 5, 12, 9, 0),
      end: new Date(2023, 5, 12, 11, 0),
      resourceId: 1,
      type: "meeting",
    },
    {
      id: 2,
      title: "Project B - Review",
      start: new Date(2023, 5, 14, 14, 0),
      end: new Date(2023, 5, 14, 16, 0),
      resourceId: 4,
      type: "review",
    },
    {
      id: 3,
      title: "Project C - Kickoff",
      start: new Date(2023, 5, 16, 10, 0),
      end: new Date(2023, 5, 16, 12, 0),
      resourceId: 2,
      type: "meeting",
    },
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState("utilization");

  const [filterRole, setFilterRole] = useState("All");
  const [loading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showResourceDetails, setShowResourceDetails] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Form state
  const [newResource, setNewResource] = useState({
    name: "",
    role: "Developer",
    skills: [],
    availability: 100,
    email: "",
    phone: "",
  });

  // Available options
  const roles = [
    "All",
    "Developer",
    "Designer",
    "QA Engineer",
    "Project Manager",
    "DevOps",
  ];
  const allSkills = [
    "React",
    "Node.js",
    "TypeScript",
    "UI/UX",
    "Figma",
    "Photoshop",
    "Testing",
    "Automation",
    "Selenium",
    "Agile",
    "Scrum",
    "JIRA",
    "AWS",
    "Docker",
    "Kubernetes",
  ];

  // Filter resources

  // Calculate utilization metrics
  const utilizationMetrics = {
    totalResources: resources.length,
    averageUtilization: Math.round(
      resources.reduce((sum, resource) => sum + resource.allocation, 0) /
        resources.length
    ),
    fullyAllocated: resources.filter((r) => r.allocation >= 90).length,
    underAllocated: resources.filter((r) => r.allocation < 60).length,
  };

  // Handle adding new resource
  const addResource = () => {
    if (newResource.name) {
      const resource = {
        id: Date.now(),
        ...newResource,
        currentProjects: [],
        allocation: 0,
      };
      setResources([...resources, resource]);
      setNewResource({
        name: "",
        role: "Developer",
        skills: [],
        availability: 100,
        email: "",
        phone: "",
      });
      setShowResourceForm(false);
    }
  };

  // Toggle skill selection
  const toggleSkill = (skill) => {
    setNewResource((prev) => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  // Show resource details
  const viewResourceDetails = (resource) => {
    setSelectedResource(resource);
    setShowResourceDetails(true);
  };

  // Helper functions
  const getAllocationClass = (allocation) => {
    if (allocation >= 90) return "bg-warning";
    if (allocation < 60) return "bg-danger";
    return "bg-success";
  };

  const getAllocationColor = (allocation) => {
    if (allocation >= 90) return "#ffc107";
    if (allocation < 60) return "#dc3545";
    return "#28a745";
  };

  // Render utilization report
  const renderUtilizationReport = () => (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card h-100 bg-card">
          <div className="card-body text-center ">
            <h6 className="card-title">Total Resources</h6>
            <h3 className="text-primary">
              {utilizationMetrics.totalResources}
            </h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card h-100 bg-card">
          <div className="card-body text-center">
            <h6 className="card-title">Avg Utilization</h6>
            <h3 className="text-info">
              {utilizationMetrics.averageUtilization}%
            </h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card h-100 bg-card">
          <div className="card-body text-center">
            <h6 className="card-title">Fully Allocated</h6>
            <h3 className="text-warning">
              {utilizationMetrics.fullyAllocated}
            </h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card h-100 bg-card">
          <div className="card-body text-center">
            <h6 className="card-title">Under Allocated</h6>
            <h3 className="text-danger">{utilizationMetrics.underAllocated}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-8 mb-4 ">
        <div className="card h-100 bg-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Resource Utilization</h5>
            <div className="d-flex flex-column flex-md-row gap-2 w-100">
              <div
                className="input-group w-100 w-md-auto"
                style={{ maxWidth: 200 }}
              >
                <span className="input-group-text bg-white">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
              </div>
              <select
                className="form-select w-100 w-md-auto"
                style={{ maxWidth: 150 }}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover table-gradient-bg ">
                <thead
                  className="table-gradient-bg table"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 0,
                    backgroundColor: "#fff", // Match your background color
                  }}
                >
                  <tr  className="text-center">
                    <th>ID</th>
                    <th>Resource</th>
                    <th>Role</th>
                    <th>Projects</th>
                    <th>Allocation</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} >
                      <td>{resource.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <i className="fas fa-user-circle fa-2x text-primary"></i>
                          </div>
                          <div>
                            <strong>{resource.name}</strong>
                            <div className="text-white small">
                              {resource.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{resource.role}</td>
                      <td>
                        {resource.currentProjects.length > 0 ? (
                          resource.currentProjects.join(", ")
                        ) : (
                          <span className="">No projects</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="progress flex-grow-1 me-2"
                            style={{ height: "20px" }}
                          >
                            <div
                              className={`progress-bar ${getAllocationClass(
                                resource.allocation
                              )}`}
                              role="progressbar"
                              style={{ width: `${resource.allocation}%` }}
                              aria-valuenow={resource.allocation}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {resource.allocation}%
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {resource.allocation >= 90 ? (
                          <Badge bg="warning" text="dark">
                            Overloaded
                          </Badge>
                        ) : resource.allocation < 60 ? (
                          <Badge bg="danger">Underutilized</Badge>
                        ) : (
                          <Badge bg="success">Optimal</Badge>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => viewResourceDetails(resource)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-4">
        <div className="card h-100 bg-card">
          <div className="card-header">
            <h5 className="card-title">Allocation Distribution</h5>
          </div>
          <div className="card-body d-flex justify-content-center">
            <PieChart width={300} height={300}>
              <Pie
                data={[
                  {
                    name: "Optimal (60-90%)",
                    value: resources.filter(
                      (r) => r.allocation >= 60 && r.allocation < 90
                    ).length,
                  },
                  {
                    name: "Overloaded (≥90%)",
                    value: utilizationMetrics.fullyAllocated,
                  },
                  {
                    name: "Underutilized (<60%)",
                    value: utilizationMetrics.underAllocated,
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                <Cell fill="#28a745" />
                <Cell fill="#ffc107" />
                <Cell fill="#dc3545" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );

  // Render skill set allocation
  const renderSkillSetAllocation = () => {
    const skillData = allSkills
      .map((skill) => {
        const count = resources.filter((r) => r.skills.includes(skill)).length;
        const percentage = Math.round((count / resources.length) * 100);

        return {
          skill,
          count,
          percentage,
          resources: resources.filter((r) => r.skills.includes(skill)),
        };
      })
      .sort((a, b) => b.count - a.count);

    return (
      <div className="row ">
        <div className="col-md-12 mb-4">
          <div className="card bg-card">
            <div className="card-header">
              <h5 className="card-title">Skill Set Distribution</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {skillData.map(({ skill, count, percentage }) => (
                  <div key={skill} className="col-md-3 mb-3">
                    <div className="card h-100 bg-card">
                      <div className="card-body ">
                        <h6 className="card-title">{skill}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{count} resources</span>
                          <span className="">{percentage}%</span>
                        </div>
                        <ProgressBar
                          now={percentage}
                          className="mt-2"
                          style={{ height: "5px" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-card">
              <h5 className="card-title">Skill Demand vs Availability</h5>
            </div>
            <div className="card-body bg-card">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={skillData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="skill"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Resources with Skill"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render availability calendar
  const renderAvailabilityCalendar = (calendarClass = "calendar-blue") => (
    <div className={`card ${calendarClass}`}>
      <div className="card-header bg-card">
        <h5 className="card-title">Resource Availability Calendar</h5>
      </div>
      <div className="card-body bg-card text-light">
        <div style={{ height: 700 }}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            defaultView="week"
            views={["day", "week", "month"]}
            step={60}
            timeslots={1}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 19, 0, 0)}
          />
        </div>
      </div>
    </div>
  );

  // Render team load balancing
  const renderTeamLoadBalancing = () => (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100 bg-card">
          <div className="card-header ">
            <h5 className="card-title">Project Workload</h5>
          </div>
          <div className="card-body bg-card">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projects.map((project) => ({
                    name: project.name,
                    teamSize: project.teamSize,
                    duration: moment(project.endDate).diff(
                      moment(project.startDate),
                      "weeks"
                    ),
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="teamSize" name="Team Size" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card h-100 bg-card">
          <div className="card-header">
            <h5 className="card-title">Resource Allocation</h5>
          </div>
          <div className="card-body ">
            <div className="table-responsive">
              <table className="table table-sm table-gradient-bg">
                <thead
                  className="table-gradient-bg table"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 0,
                    backgroundColor: "#fff", // Match your background color
                  }}
                >
                  <tr  className="text-center">
                    <th>Project</th>
                    <th>Resources</th>
                    <th>Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => {
                    const projectResources = resources.filter((r) =>
                      r.currentProjects.includes(project.name)
                    );
                    const totalAllocation = projectResources.reduce(
                      (sum, r) => sum + r.allocation,
                      0
                    );

                    return (
                      <tr key={project.id}  className="text-center">
                        <td>{project.name}</td>
                        <td>
                          {projectResources.map((r) => r.name).join(", ") ||
                            "None"}
                        </td>
                        <td>
                          <ProgressBar
                            now={totalAllocation}
                            label={`${totalAllocation}%`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "utilization":
        return renderUtilizationReport();
      case "skills":
        return renderSkillSetAllocation();
      case "calendar":
        return renderAvailabilityCalendar();
      case "load":
        return renderTeamLoadBalancing();
      default:
        return renderUtilizationReport();
    }
  };

  return (
    <div className=" container-fluid p-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="gradient-heading">Resource Management</h2>
        <div className="d-flex gap-2">
          <button
            className="gradient-button"
            onClick={() => setShowResourceForm(true)}
          >
            <Plus size={18} className="me-2" />
            Add Resource
          </button>
          <button className="btn btn-outline-light">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "utilization" ? "active" : ""
            }`}
            onClick={() => setActiveTab("utilization")}
          >
            <BarChart2 size={18} className="me-2" />
            Utilization Report
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            <PieChart size={18} className="me-2" />
            Skill Set Allocation
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            <CalendarIcon size={18} className="me-2" />
            Availability Calendar
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "load" ? "active" : ""}`}
            onClick={() => setActiveTab("load")}
          >
            <Users size={18} className="me-2" />
            Team Load Balancing
          </button>
        </li>
      </ul>

      {/* Main Content */}
      {loading ? (
        <div className="text-center py-5">
          <Loader className="animate-spin" size={48} />
          <p className="mt-3">Loading resource data...</p>
        </div>
      ) : (
        renderContent()
      )}

      {/* Add Resource Modal */}
      <Modal
        show={showResourceForm}
        onHide={() => setShowResourceForm(false)}
        size="lg"
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={newResource.name}
                  onChange={(e) =>
                    setNewResource({ ...newResource, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={newResource.role}
                  onChange={(e) =>
                    setNewResource({ ...newResource, role: e.target.value })
                  }
                >
                  {roles
                    .filter((r) => r !== "All")
                    .map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                </Form.Select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={newResource.email}
                  onChange={(e) =>
                    setNewResource({ ...newResource, email: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={newResource.phone}
                  onChange={(e) =>
                    setNewResource({ ...newResource, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <Form.Label>Availability (%)</Form.Label>
              <Form.Range
                min="0"
                max="100"
                value={newResource.availability}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    availability: e.target.value,
                  })
                }
              />
              <div className="text-center">{newResource.availability}%</div>
            </div>

            <div className="mb-3">
              <Form.Label>Skills</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <Button
                    key={skill}
                    variant={
                      newResource.skills.includes(skill)
                        ? "primary"
                        : "outline-primary"
                    }
                    size="sm"
                    className="bg-card"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowResourceForm(false)}
            className="rounded-pill"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={addResource}
            className="gradient-button"
          >
            Add Resource
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Resource Details Modal */}
      <Modal
        show={showResourceDetails}
        onHide={() => setShowResourceDetails(false)}
        size="lg"
        className="custom-modal-dark"
      >
        {selectedResource && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Resource Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-4 text-center mb-4">
                  <div className="avatar mb-3">
                    <i className="fas fa-user-circle fa-5x text-primary"></i>
                  </div>
                  <h4>{selectedResource.name}</h4>
                  <h5 className="text-muted">{selectedResource.role}</h5>
                </div>
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h6>Email</h6>
                      <p>{selectedResource.email}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6>Phone</h6>
                      <p>{selectedResource.phone}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h6>Availability</h6>
                      <ProgressBar
                        now={selectedResource.availability}
                        label={`${selectedResource.availability}%`}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6>Current Allocation</h6>
                      <ProgressBar
                        variant={getAllocationClass(
                          selectedResource.allocation
                        )}
                        now={selectedResource.allocation}
                        label={`${selectedResource.allocation}%`}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <h6>Skills</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedResource.skills.map((skill) => (
                        <Badge key={skill} bg="primary" pill>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h6>Current Projects</h6>
                    {selectedResource.currentProjects.length > 0 ? (
                      <ul className="list-group ">
                        {selectedResource.currentProjects.map((project) => (
                          <li key={project} className="list-group-item bg-card">
                            {project}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No current projects</p>
                    )}
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => setShowResourceDetails(false)}
                className="rounded-pill"
              >
                Close
              </Button>
              <Button variant="primary" className="gradient-button">
                Edit Details
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ResourceManagement;
