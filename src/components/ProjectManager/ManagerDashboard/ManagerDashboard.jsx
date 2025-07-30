import React, { useState, useEffect, useRef } from "react";
import { Funnel } from "@ant-design/charts";

import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

function ManagerDashboard() {
  const [timeFilter, setTimeFilter] = useState("This Week");
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  return (
    <div
      className="container-fluid bg-card py-3"
      style={{ minHeight: "100vh" }}
    >
      <h2 className="gradient-heading ">Manager Dashboard</h2>

      <div className="container-fluid mb-5">
        {/* KPI Overview Cards */}
        <div className="row mb-4 g-3">
          {/* Total Leads */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm text-white bg-primary  rounded-4">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="small mb-1">Total Leads</p>
                    <h3 className="fw-bold mb-0">1,284</h3>
                  </div>
                  <div className="p-2 bg-white bg-opacity-25 rounded">
                    <i className="fas fa-user-plus text-white fs-5"></i>
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

          {/* Conversion Rate */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm text-dark bg-warning  rounded-4">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="small mb-1">Conversion Rate</p>
                    <h3 className="fw-bold mb-0">24.8%</h3>
                  </div>
                  <div className="p-2 bg-dark bg-opacity-10 rounded">
                    <i className="fas fa-chart-line text-dark fs-5"></i>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="text-dark small fw-semibold d-flex align-items-center">
                    <i className="fas fa-arrow-up me-1"></i> 3.2%
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

          {/* Revenue Generated */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm text-white bg-info  rounded-4">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="small mb-1">Revenue Generated</p>
                    <h3 className="fw-bold mb-0">$342,856</h3>
                  </div>
                  <div className="p-2 bg-white bg-opacity-25 rounded">
                    <i className="fas fa-dollar-sign text-white fs-5"></i>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="text-white small fw-semibold d-flex align-items-center">
                    <i className="fas fa-arrow-up me-1"></i> 8.7%
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

          {/* Active Projects */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm text-white bg-secondary  rounded-4">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="small mb-1">Active Projects</p>
                    <h3 className="fw-bold mb-0">32</h3>
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
                      className="dropdown-menu "
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
                    className="table-gradient-bg table "
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 0,
                      backgroundColor: "#fff", // Match your background color
                    }}
                  >
                    <tr  className="text-center">
                      <th scope="col">ID</th>
                      <th scope="col">Project</th>
                      <th scope="col">Progress</th>
                      <th scope="col">Due Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Team</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr  className="text-center">
                      <td>1</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                            <i className="fas fa-building text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-bold">
                              Enterprise CRM Implementation
                            </div>
                            <div className=" small">PRJ-2023-001</div>
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
                      <td>Jul 15, 2025</td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success">
                          In Progress
                        </span>
                      </td>
                      <td>
                        <div className="d-flex">
                          <img
                            className="rounded-circle border border-white"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20business%20woman%20with%20short%20dark%20hair%2C%20neutral%20expression%2C%20corporate%20attire%2C%20studio%20lighting%2C%20plain%20background%2C%20high%20quality%20linkedin%20profile&width=50&height=50&seq=2&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                          <img
                            className="rounded-circle border border-white ms-n2"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20business%20man%20with%20glasses%2C%20confident%20expression%2C%20formal%20business%20attire%2C%20neutral%20background%2C%20corporate%20portrait%20style&width=50&height=50&seq=3&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                          <img
                            className="rounded-circle border border-white ms-n2"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20asian%20business%20professional%2C%20neutral%20expression%2C%20business%20casual%20attire%2C%20clean%20background%2C%20corporate%20portrait&width=50&height=50&seq=4&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                        </div>
                      </td>
                    </tr>
 
                    <tr  className="text-center">
                      <td>2</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-info bg-opacity-10 rounded p-2 me-3">
                            <i className="fas fa-chart-pie text-info"></i>
                          </div>
                          <div>
                            <div className="fw-bold">
                              Market Analysis Report
                            </div>
                            <div className=" small">PRJ-2023-008</div>
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
                              className="progress-bar bg-info"
                              style={{ width: "45%" }}
                            ></div>
                          </div>
                          <span className="small">45%</span>
                        </div>
                      </td>
                      <td>Aug 30, 2025</td>
                      <td>
                        <span className="badge bg-warning bg-opacity-10 text-warning">
                          Pending
                        </span>
                      </td>
                      <td>
                        <div className="d-flex">
                          <img
                            className="rounded-circle border border-white"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20business%20woman%20with%20blonde%20hair%2C%20friendly%20smile%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20corporate%20portrait&width=50&height=50&seq=5&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                          <img
                            className="rounded-circle border border-white ms-n2"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20business%20man%20with%20beard%2C%20serious%20expression%2C%20formal%20business%20attire%2C%20neutral%20background%2C%20corporate%20portrait%20style&width=50&height=50&seq=6&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                        </div>
                      </td>
                    </tr>
                    <tr  className="text-center">
                      <td>3</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-success bg-opacity-10 rounded p-2 me-3">
                            <i className="fas fa-mobile-alt text-success"></i>
                          </div>
                          <div>
                            <div className="fw-bold">
                              Mobile App Development
                            </div>
                            <div className=" small">PRJ-2023-012</div>
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
                              className="progress-bar bg-success"
                              style={{ width: "90%" }}
                            ></div>
                          </div>
                          <span className="small">90%</span>
                        </div>
                      </td>
                      <td>Jun 30, 2025</td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success">
                          In Progress
                        </span>
                      </td>
                      <td>
                        <div className="d-flex">
                          <img
                            className="rounded-circle border border-white"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20tech%20professional%20with%20glasses%2C%20neutral%20expression%2C%20casual%20tech%20company%20attire%2C%20clean%20background%2C%20silicon%20valley%20style%20portrait&width=50&height=50&seq=7&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                          <img
                            className="rounded-circle border border-white ms-n2"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20female%20software%20developer%2C%20confident%20expression%2C%20tech%20casual%20attire%2C%20neutral%20background%2C%20tech%20company%20portrait%20style&width=50&height=50&seq=8&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                          <div
                            className="rounded-circle border border-white ms-n2 bg-light d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <span className="small ">+2</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr  className="text-center">
                      <td>4</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-purple bg-opacity-10 rounded p-2 me-3">
                            <i className="fas fa-ad text-purple"></i>
                          </div>
                          <div>
                            <div className="fw-bold">
                              Digital Marketing Campaign
                            </div>
                            <div className=" small">PRJ-2023-015</div>
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
                              className="progress-bar bg-purple"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                          <span className="small">100%</span>
                        </div>
                      </td>
                      <td>Jun 10, 2025</td>
                      <td>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary">
                          Completed
                        </span>
                      </td>
                      <td>
                        <div className="d-flex">
                          <img
                            className="rounded-circle border border-white"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20marketing%20professional%20woman%2C%20creative%20expression%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20marketing%20agency%20style%20portrait&width=50&height=50&seq=9&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                          <img
                            className="rounded-circle border border-white ms-n2"
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20creative%20director%2C%20stylish%20appearance%2C%20creative%20industry%20attire%2C%20clean%20background%2C%20advertising%20agency%20style%20portrait&width=50&height=50&seq=10&orientation=squarish"
                            width="32"
                            height="32"
                            alt=""
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm h-100 bg-card">
              <div className="card-header  border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0">Recent Activities</h5>
                <button className="btn btn-primary small">View All</button>
              </div>
              <div className="card-body">
                <div className="activity-feed">
                  <div className="d-flex position-relative mb-4">
                    <div className="flex-shrink-0">
                      <span
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fas fa-user-plus text-white small"></i>
                      </span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="small mb-0">
                        New lead <span className="fw-bold">Acme Corp</span>{" "}
                        added to pipeline
                      </p>
                      <p className=" small">2h ago</p>
                    </div>
                  </div>
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
                        Project{" "}
                        <span className="fw-bold">Mobile App Development</span>{" "}
                        reached 90% completion
                      </p>
                      <p className=" small">4h ago</p>
                    </div>
                  </div>
                  <div className="d-flex position-relative mb-4">
                    <div className="flex-shrink-0">
                      <span
                        className="bg-indigo rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fas fa-comment-alt text-white small"></i>
                      </span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="small mb-0">
                        <span className="fw-bold">Sarah Johnson</span> commented
                        on proposal for{" "}
                        <span className="fw-bold">TechStart Inc</span>
                      </p>
                      <p className="small">Yesterday</p>
                    </div>
                  </div>
                  <div className="d-flex position-relative mb-4">
                    <div className="flex-shrink-0">
                      <span
                        className="bg-warning rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fas fa-calendar-alt text-white small"></i>
                      </span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="small mb-0">
                        Meeting scheduled with{" "}
                        <span className="fw-bold">Global Solutions Ltd</span>
                      </p>
                      <p className="small">2 days ago</p>
                    </div>
                  </div>
                  <div className="d-flex position-relative">
                    <div className="flex-shrink-0">
                      <span
                        className="bg-danger rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fas fa-dollar-sign text-white small"></i>
                      </span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="small mb-0">
                        Deal closed with{" "}
                        <span className="fw-bold">Nexus Technologies</span> -{" "}
                        <span className="fw-bold text-success">$125,000</span>
                      </p>
                      <p className=" small">3 days ago</p>
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
            <h5 className="mb-0">Lead Analytics</h5>
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
                <h6 className="text-center mb-3">Lead Conversion Funnel</h6>
                <div style={{ height: "300px" }}>
                  <Funnel {...funnelConfig} />
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="text-center mb-3">Lead Source Distribution</h6>
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

      {/* Quick Actions Panel */}
      {/* <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">Quick Actions</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        <div className="d-grid gap-2">
                            <button className="btn btn-outline-primary text-start">
                                <i className="fas fa-user-plus me-2"></i>
                                Add New Lead
                            </button>
                            <button className="btn btn-outline-success text-start">
                                <i className="fas fa-folder-plus me-2"></i>
                                Create Project
                            </button>
                            <button className="btn btn-outline-info text-start">
                                <i className="fas fa-calendar-plus me-2"></i>
                                Schedule Meeting
                            </button>
                            <button className="btn btn-outline-secondary text-start">
                                <i className="fas fa-chart-bar me-2"></i>
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary rounded-circle p-3 position-absolute bottom-0 end-0 mb-5 me-3">
                    <i className="fas fa-plus fs-5"></i>
                </button>
            </div> */}
    </div>
  );
}

export default ManagerDashboard;
