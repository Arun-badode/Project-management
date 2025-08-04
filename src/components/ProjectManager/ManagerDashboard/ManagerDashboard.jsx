import React, { useState, useEffect, useRef } from "react";
import { Funnel } from "@ant-design/charts";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import axios from "axios";

function ManagerDashboard() {
  const [timeFilter, setTimeFilter] = useState("This Week");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://eminoids-backend-production.up.railway.app/api/managerDashboard/getManagerDashboardData/3"
        );
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lead Funnel Chart Data
  const funnelData = [
    { stage: "Total Leads", value: 100 },
    { stage: "Qualified Leads", value: 80 },
    { stage: "Opportunities", value: 60 },
    { stage: "Proposals", value: 40 },
    { stage: "Closed Deals", value: 20 },
  ];

  const funnelConfig = {
    data: funnelData,
    xField: "stage",
    yField: "value",
    legend: false,
    label: {
      position: "inside",
    },
    conversionTag: {},
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  const data = [
    { name: "Direct", value: 27 },
    { name: "Referral", value: 25 },
    { name: "Social", value: 18 },
    { name: "Email", value: 15 },
    { name: "Other", value: 15 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

  // Lead Source Chart Data
  const pieData = [
    { type: "Website", value: 35 },
    { type: "Referrals", value: 25 },
    { type: "Social Media", value: 20 },
    { type: "Email Campaign", value: 15 },
    { type: "Other", value: 5 },
  ];

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "spider",
      content: "{name}\n{percentage}",
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
  };

  if (loading) {
    return <div className="container-fluid bg-card py-3">Loading...</div>;
  }

  if (error) {
    return <div className="container-fluid bg-card py-3">Error: {error}</div>;
  }

  return (
    <div className="container-fluid bg-card py-3" style={{ minHeight: "100vh" }}>
      <h2 className="gradient-heading">Manager Dashboard</h2>

      <div className="container-fluid mb-5">
        {/* KPI Overview Cards */}
        <div className="row mb-4 g-3">
          {/* Total Projects */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm text-white bg-primary rounded-4">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="small mb-1">Total Projects</p>
                    <h3 className="fw-bold mb-0">{dashboardData.totalProjectsCount}</h3>
                  </div>
                  <div className="p-2 bg-white bg-opacity-25 rounded">
                    <i className="fas fa-project-diagram text-white fs-5"></i>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="text-white small fw-semibold d-flex align-items-center">
                    <i className="fas fa-arrow-up me-1"></i> 12.5%
                  </span>
                  <span className="small ms-2 text-white-50">
                    vs last month
                  </span>
                </div>
                <div
                  className="progress mt-2 bg-white bg-opacity-25"
                  style={{ height: "6px" }}
                >
                  <div
                    className="progress-bar bg-white"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm text-white bg-secondary rounded-4">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="small mb-1">Active Projects</p>
                    <h3 className="fw-bold mb-0">{dashboardData.activeProjectsCount}</h3>
                  </div>
                  <div className="p-2 bg-white bg-opacity-25 rounded">
                    <i className="fas fa-tasks text-white fs-5"></i>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="text-white small fw-semibold d-flex align-items-center">
                    <i className="fas fa-arrow-down me-1"></i> 2.3%
                  </span>
                  <span className="small ms-2 text-white-50">
                    vs last month
                  </span>
                </div>
                <div
                  className="progress mt-2 bg-white bg-opacity-25"
                  style={{ height: "6px" }}
                >
                  <div
                    className="progress-bar bg-white"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Projects */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm text-white bg-danger rounded-4">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="small mb-1">Overdue Projects</p>
                    <h3 className="fw-bold mb-0">{dashboardData.overdueCount}</h3>
                  </div>
                  <div className="p-2 bg-white bg-opacity-25 rounded">
                    <i className="fas fa-exclamation-triangle text-white fs-5"></i>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="text-white small fw-semibold d-flex align-items-center">
                    <i className="fas fa-arrow-up me-1"></i> 5.7%
                  </span>
                  <span className="small ms-2 text-white-50">
                    vs last month
                  </span>
                </div>
                <div
                  className="progress mt-2 bg-white bg-opacity-25"
                  style={{ height: "6px" }}
                >
                  <div
                    className="progress-bar bg-white"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Near Due Projects */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm text-dark bg-warning rounded-4">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="small mb-1">Near Due Projects</p>
                    <h3 className="fw-bold mb-0">{dashboardData.nearDueCount}</h3>
                  </div>
                  <div className="p-2 bg-dark bg-opacity-10 rounded">
                    <i className="fas fa-clock text-dark fs-5"></i>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="text-dark small fw-semibold d-flex align-items-center">
                    <i className="fas fa-arrow-down me-1"></i> 1.2%
                  </span>
                  <span className="small ms-2 text-dark-50">vs last month</span>
                </div>
                <div
                  className="progress mt-2 bg-dark bg-opacity-25"
                  style={{ height: "6px" }}
                >
                  <div
                    className="progress-bar bg-dark"
                    style={{ width: "24.8%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Project Status Section */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm bg-card">
              <div className="card-header border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0">Project Status</h5>
                <div className="d-flex align-items-center">
                  <button className="btn btn-primary me-3 small">
                    View All
                  </button>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="filterDropdown"
                      data-bs-toggle="dropdown"
                    >
                      Filter
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="filterDropdown"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          This Week
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          This Month
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          This Quarter
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <table className="table table-hover mb-0 table-gradient-bg">
                  <thead
                    className="table-gradient-bg table"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 0,
                      backgroundColor: "#fff",
                    }}
                  >
                    <tr className="text-center">
                      <th scope="col">ID</th>
                      <th scope="col">Project</th>
                      <th scope="col">Progress</th>
                      <th scope="col">Due Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.activeProjects.map((project, index) => (
                      <tr key={project.id} className="text-center">
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                              <i className="fas fa-project-diagram text-primary"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{project.projectTitle}</div>
                              <div className="small">PRJ-{project.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="progress flex-grow-1 me-2"
                              style={{ height: "6px" }}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: "75%" }}
                              ></div>
                            </div>
                            <span className="small">75%</span>
                          </div>
                        </td>
                        <td>{new Date(project.deadline).toLocaleDateString()}</td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success">
                            {project.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            project.priority === "High" 
                              ? "bg-danger bg-opacity-10 text-danger" 
                              : project.priority === "Medium" 
                                ? "bg-warning bg-opacity-10 text-warning" 
                                : "bg-info bg-opacity-10 text-info"
                          }`}>
                            {project.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {dashboardData.overdueProjects.map((project, index) => (
                      <tr key={`overdue-${project.id}`} className="text-center">
                        <td>{dashboardData.activeProjects.length + index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-danger bg-opacity-10 rounded p-2 me-3">
                              <i className="fas fa-project-diagram text-danger"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{project.projectTitle}</div>
                              <div className="small">PRJ-{project.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="progress flex-grow-1 me-2"
                              style={{ height: "6px" }}
                            >
                              <div
                                className="progress-bar bg-danger"
                                style={{ width: "60%" }}
                              ></div>
                            </div>
                            <span className="small">60%</span>
                          </div>
                        </td>
                        <td>{new Date(project.deadline).toLocaleDateString()}</td>
                        <td>
                          <span className="badge bg-danger bg-opacity-10 text-danger">
                            Overdue
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            project.priority === "High" 
                              ? "bg-danger bg-opacity-10 text-danger" 
                              : project.priority === "Medium" 
                                ? "bg-warning bg-opacity-10 text-warning" 
                                : "bg-info bg-opacity-10 text-info"
                          }`}>
                            {project.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm h-100 bg-card">
              <div className="card-header border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0">Recent Activities</h5>
                <button className="btn btn-primary small">View All</button>
              </div>
              <div className="card-body">
                <div className="activity-feed">
                  {dashboardData.eventsTodayCount > 0 ? (
                    dashboardData.eventsToday.map((event, index) => (
                      <div key={index} className="d-flex position-relative mb-4">
                        <div className="flex-shrink-0">
                          <span
                            className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <i className="fas fa-calendar-day text-white small"></i>
                          </span>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <p className="small mb-0">{event.description}</p>
                          <p className="small">Today</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="d-flex position-relative mb-4">
                      <div className="flex-shrink-0">
                        <span
                          className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <i className="fas fa-info text-white small"></i>
                        </span>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <p className="small mb-0">No events scheduled for today</p>
                        <p className="small">{formattedDate}</p>
                      </div>
                    </div>
                  )}
                  <div className="d-flex position-relative mb-4">
                    <div className="flex-shrink-0">
                      <span
                        className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fas fa-tasks text-white small"></i>
                      </span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="small mb-0">
                        {dashboardData.activeProjectsCount} active projects
                      </p>
                      <p className="small">Updated just now</p>
                    </div>
                  </div>
                  <div className="d-flex position-relative mb-4">
                    <div className="flex-shrink-0">
                      <span
                        className="bg-danger rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fas fa-exclamation-triangle text-white small"></i>
                      </span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="small mb-0">
                        {dashboardData.overdueCount} projects overdue
                      </p>
                      <p className="small">Needs attention</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Analytics */}
        <div className="card shadow-sm mt-4 bg-card">
          <div className="card-header border-bottom d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">Project Analytics</h5>
            <div className="d-flex align-items-center">
              <div className="dropdown me-3">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="timeFilterDropdown"
                  data-bs-toggle="dropdown"
                >
                  {timeFilter}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="timeFilterDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTimeFilter("This Week")}
                    >
                      This Week
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTimeFilter("This Month")}
                    >
                      This Month
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTimeFilter("This Quarter")}
                    >
                      This Quarter
                    </button>
                  </li>
                </ul>
              </div>
              <button className="btn btn-primary">
                <i className="fas fa-download me-2"></i>
                Export Data
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 border-end">
                <h6 className="text-center mb-3">Project Status Distribution</h6>
                <div style={{ height: "300px" }}>
                  <Funnel {...funnelConfig} />
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="text-center mb-3">Project Priority Distribution</h6>
                <div
                  style={{
                    height: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PieChart width={300} height={300}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;