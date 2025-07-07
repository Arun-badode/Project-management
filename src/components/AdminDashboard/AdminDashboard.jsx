import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

const AdminDashboard = () => {
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("summary");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const fakeScrollbar = fakeScrollbarRef.current;

    if (scrollContainer && fakeScrollbar) {
      fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;

      const syncScroll = () => {
        fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
      };
      const syncFakeScroll = () => {
        scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
      };

      scrollContainer.addEventListener("scroll", syncScroll);
      fakeScrollbar.addEventListener("scroll", syncFakeScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", syncScroll);
        fakeScrollbar.removeEventListener("scroll", syncFakeScroll);
      };
    }
  }, []);

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      position: "Senior Developer",
      month: "May 2025",
      daysPresent: 18,
      daysAbsent: 2,
      lateArrivals: 3,
      earlyDepartures: 1,
      leaves: [
        { date: "2025-05-05", type: "Sick Leave", status: "Approved" },
        { date: "2025-05-06", type: "Sick Leave", status: "Approved" },
      ],
      dailyRecords: generateDailyRecords(1),
    },
  ]);

  const tasksToday = [
    {
      id: 1,
      title: "Prepare Report",
      description: "Compile monthly sales data and generate report.",
      deadline: "2025-06-28 17:00",
      assignedTo: "John Doe",
    },
  ];

  function generateDailyRecords(seed) {
    const records = [];
    const startDate = new Date(2025, 3, 28);
    const endDate = new Date(2025, 4, 27);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const date = new Date(d);

      const random = (seed * date.getDate()) % 10;
      let status = "Present";
      let checkIn = null;
      let checkOut = null;

      if (isWeekend) {
        status = "Weekend";
      } else if (random === 1) {
        status = "Absent";
      } else if (random === 2) {
        status = "Leave";
      } else {
        const baseCheckIn = 9 * 60;
        const baseCheckOut = 17 * 60;
        const checkInVariation = (random - 5) * 10;
        const checkOutVariation = (random - 3) * 10;

        const checkInMinutes = baseCheckIn + checkInVariation;
        const checkOutMinutes = baseCheckOut + checkOutVariation;

        const checkInHour = Math.floor(checkInMinutes / 60);
        const checkInMin = checkInMinutes % 60;
        const checkOutHour = Math.floor(checkOutMinutes / 60);
        const checkOutMin = checkOutMinutes % 60;

        checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMin
          .toString()
          .padStart(2, "0")}`;
        checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMin
          .toString()
          .padStart(2, "0")}`;

        if (checkInMinutes > 9 * 60 + 15) {
          status = "Late";
        } else if (checkOutMinutes < 17 * 60 - 15) {
          status = "Early Departure";
        }
      }

      records.push({
        date: date.toISOString().split("T")[0],
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
        status,
        checkIn,
        checkOut,
        workHours:
          checkIn && checkOut ? calculateWorkHours(checkIn, checkOut) : 0,
      });
    }
    return records;
  }

  function calculateWorkHours(checkIn, checkOut) {
    const [inHour, inMin] = checkIn.split(":").map(Number);
    const [outHour, outMin] = checkOut.split(":").map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    return Math.round((outMinutes - inMinutes) / 6) / 10;
  }

  const handleEmployeeSelect = (id) => {
    setSelectedEmployee(id);
    setViewMode("detailed");
  };

  const filteredEmployees = attendanceData.filter((employee) => {
    const matchesSearch =
      employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/admindashboard/");
        setProjects(response.data);
        setFilteredProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to load projects data");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleCardFilter = (type) => {
    let filtered = [];
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    switch (type) {
      case "active":
        filtered = projects.filter((p) => p.status === "Active");
        break;
      case "nearDue":
        filtered = projects.filter((project) => {
          if (project.status !== "Active") return false;
          const dueDate = new Date(project.actual_due_date);
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        });
        break;
      case "overdue":
        filtered = projects.filter((project) => {
          const dueDate = new Date(project.actual_due_date);
          return dueDate < today && project.status !== "Completed";
        });
        break;
      case "teamOnDuty":
        filtered = projects.filter((p) => p.status === "Team On-Duty");
        break;
      case "eventsToday":
        const todayStr = today.toISOString().split("T")[0];
        filtered = projects.filter((project) => {
          return (
            project.actual_due_date === todayStr ||
            project.qc_due_date === todayStr
          );
        });
        break;
      case "pendingApproval":
        filtered = projects.filter((p) => p.qa_status === "Pending");
        break;
      default:
        filtered = projects;
    }
    setFilteredProjects(filtered);
    setActiveFilter(type);
  };

  const getCardCount = (cardType) => {
    switch (cardType) {
      case "active":
        return projects.filter((p) => p.status === "Active").length;
      case "nearDue":
        return projects.filter((project) => {
          if (project.status !== "Active") return false;
          const dueDate = new Date(project.actual_due_date);
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        }).length;
      case "overdue":
        return projects.filter(
          (p) => new Date(p.actual_due_date) < new Date() && p.status !== "Completed"
        ).length;
      case "pendingApproval":
        return projects.filter((p) => p.qa_status === "Pending").length;
      case "teamOnDuty":
        return attendanceData.length;
      case "eventsToday":
        return tasksToday.length;
      default:
        return projects.length;
    }
  };

  const showAllProjects = () => {
    setFilteredProjects(projects);
    setActiveFilter("all");
  };

  const barData = [
    { name: "Mon", Design: 20, Development: 40, Testing: 10, Deployment: 10 },
    { name: "Tue", Design: 30, Development: 35, Testing: 15, Deployment: 10 },
    { name: "Wed", Design: 40, Development: 30, Testing: 10, Deployment: 15 },
    { name: "Thu", Design: 30, Development: 35, Testing: 10, Deployment: 10 },
    { name: "Fri", Design: 25, Development: 35, Testing: 15, Deployment: 10 },
  ];

  const pieData = [
    { name: "Development", value: 60 },
    { name: "Meetings", value: 30 },
    { name: "Planning", value: 20 },
    { name: "QA", value: 25 },
    { name: "Documentation", value: 10 },
  ];

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="admin-dashboard text-white p-3 p-md-4 bg-main">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="gradient-heading">Admin Dashboard</h2>
        
      </div>

      <Row className="mb-4 g-3">
        {[
          {
            key: "active",
            title: "Active Projects",
            icon: "bi-rocket-takeoff",
            color: "primary",
          },
          {
            key: "nearDue",
            title: "Near Due",
            icon: "bi-hourglass-split",
            color: "warning text-dark",
          },
          {
            key: "overdue",
            title: "Overdue",
            icon: "bi-exclamation-octagon",
            color: "danger",
          },
          {
            key: "teamOnDuty",
            title: "Team On-Duty",
            icon: "bi-people-fill",
            color: "info",
          },
          {
            key: "eventsToday",
            title: "Events Today",
            icon: "bi-calendar-event",
            color: "success",
          },
          {
            key: "pendingApproval",
            title: "Pending Approval",
            icon: "bi-clock-history",
            color: "secondary",
          },
        ].map(({ key, title, icon, color }) => (
          <Col xs={12} sm={6} md={2} key={key}>
            <Card
              className={`bg-${color} bg-gradient p-3 rounded-4 shadow-sm border-0 w-100 ${
                activeFilter === key ? "border border-3 border-light" : ""
              }`}
              onClick={() => handleCardFilter(key)}
              style={{ cursor: "pointer", minHeight: "150px", height: "150px" }}
            >
              <Card.Body className="d-flex flex-column justify-content-between h-100 text-white">
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${icon} fs-4`}></i>
                  <Card.Title className="fs-6 fw-semibold mb-0">
                    {title}
                  </Card.Title>
                </div>
                <h3 className="fw-bold text-end m-0">{getCardCount(key)}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {activeFilter !== "all" && (
        <Button variant="outline-light" size="sm" onClick={showAllProjects}>
          Show All
        </Button>
      )}

      {activeFilter === "teamOnDuty" && (
        <div
          className="table-responsive text-white p-3 mb-5 table-gradient-bg"
          style={{ maxHeight: "600px", overflowY: "auto", overflowX: "auto" }}
          ref={scrollContainerRef}
        >
          <h4 className="mb-3">Team's List</h4>
          <table className="table table-hover mb-0">
            <thead
              className="table bg-dark p-2 sticky-top"
              style={{ position: "sticky", top: 0, zIndex: 2 }}
            >
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Late Arrivals</th>
                <th>Early Departures</th>
                <th>Leaves</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm bg-light-primary rounded me-3">
                        <span className="avatar-text">
                          {employee.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="fw-semibold">
                          {employee.employeeName}
                        </div>
                        <div className="small ">{employee.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{employee.department}</div>
                    <div className="small ">{employee.position}</div>
                  </td>
                  <td>
                    <span className="badge bg-success-subtle text-success">
                      {employee.daysPresent}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-danger-subtle text-danger">
                      {employee.daysAbsent}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-warning-subtle text-warning">
                      {employee.lateArrivals}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-warning-subtle text-warning">
                      {employee.earlyDepartures}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info-subtle text-info">
                      {employee.leaves.length}
                    </span>
                  </td>
                  <td className="text-center mt-2">
                    <button
                      onClick={() => handleEmployeeSelect(employee.id)}
                      className="btn btn-sm btn-info"
                    >
                      <i className="fas fa-eye me-1"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeFilter === "eventsToday" && (
        <div
          className="table-responsive text-white p-3 mb-5 table-gradient-bg"
          style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
          ref={scrollContainerRef}
        >
          <h4 className="mb-3">Today's Event</h4>
          <table className="table table-hover mb-0">
            <thead
              className="table bg-dark p-2 sticky-top"
              style={{ position: "sticky", top: 0, zIndex: 2 }}
            >
              <tr>
                <th>Task Title</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Assign to</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasksToday.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.deadline}</td>
                  <td>{task.assignedTo}</td>
                  <td className="text-end">
                    <button
                      onClick={() => navigate("/calendar")}
                      className="btn btn-sm btn-info"
                    >
                      <i className="fas fa-eye me-1"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeFilter !== "teamOnDuty" && activeFilter !== "eventsToday" && (
        <Card className="text-white p-3 mb-5 table-gradient-bg">
          <h4 className="mb-3">Project List</h4>

          <div
            ref={fakeScrollbarRef}
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              height: 16,
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1050,
            }}
          >
            <div style={{ width: "2000px", height: 1 }} />
          </div>

          <div
            className=""
            ref={scrollContainerRef}
            style={{
              maxHeight: "500px",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <Table className="table-gradient-bg align-middle table table-bordered table-hover">
              <thead className="table bg-dark p-2 ">
                <tr>
                  <th>ID</th>
                  <th>Project Title</th>
                  <th>Client</th>
                  <th>Tasks</th>
                  <th>Languages</th>
                  <th>Application</th>
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
                    <td>{project.project_title}</td>
                    <td>{project.client}</td>
                    <td>{project.tasks}</td>
                    <td>{project.languages}</td>
                    <td>{project.application}</td>
                    <td>{project.total_pages}</td>
                    <td>{project.actual_due_date}</td>
                    <td>{project.ready_for_qc_deadline}</td>
                    <td>{project.qc_hours}</td>
                    <td>{project.qc_due_date}</td>
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
                    <td>{project.qa_reviewer}</td>
                    <td>
                      <Badge
                        bg={
                          project.qa_status === "Passed"
                            ? "success"
                            : project.qa_status === "Failed"
                            ? "danger"
                            : project.qa_status === "In Review"
                            ? "info"
                            : "secondary"
                        }
                      >
                        {project.qa_status}
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
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm h-100 bg-card">
            <h5>Resource Utilization</h5>
            <p className="text-muted">Utilization %</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} stackOffset="expand">
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value * 100}%`} />
                <Tooltip
                  formatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Legend />
                <Bar dataKey="Design" stackId="a" fill="#6366F1" />
                <Bar dataKey="Development" stackId="a" fill="#10B981" />
                <Bar dataKey="Testing" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Deployment" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <p className="mb-0">
                Average utilization:{" "}
                <strong className="text-primary">76%</strong>
              </p>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-primary">
                  Daily
                </button>
                <button className="btn btn-sm btn-primary">Weekly</button>
                <button className="btn btn-sm btn-outline-primary">
                  Monthly
                </button>
              </div>
            </div>
          </div>
        </div>

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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
                <strong>Title:</strong> {selectedProject.project_title}
              </p>
              <p>
                <strong>Client:</strong> {selectedProject.client}
              </p>
              <p>
                <strong>Application:</strong> {selectedProject.application}
              </p>
              <p>
                <strong>Pages:</strong> {selectedProject.total_pages}
              </p>
              <p>
                <strong>Due Date:</strong> {selectedProject.actual_due_date}
              </p>
              <p>
                <strong>Status:</strong> {selectedProject.status}
              </p>
              <p>
                <strong>Handler:</strong> {selectedProject.handler}
              </p>
              <p>
                <strong>QA Reviewer:</strong> {selectedProject.qa_reviewer}
              </p>
              <p>
                <strong>QA Status:</strong> {selectedProject.qa_status}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Col md={12} className="text-end">
        {activeFilter === "teamOnDuty" ? (
          <Link to="/Attendance?tab=today" className="text-decoration-none">
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) : activeFilter === "eventsToday" ? (
          <Link to="/calendar" className="text-decoration-none">
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) : activeFilter === "nearDue" ? (
          <Link
            to="/active-project?filter=nearDue"
            className="text-decoration-none"
          >
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) : activeFilter === "active" ? (
          <Link
            to="/active-project?filter=active"
            className="text-decoration-none"
          >
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) : activeFilter === "pendingApproval" ? (
          <Link to="/action-center" className="text-decoration-none">
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) : (
          <Link to="/active-project" className="text-decoration-none">
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        )}
      </Col>
    </div>
  );
};

export default AdminDashboard;