import React, { useState, useEffect } from "react";

function ResourceWorkload() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [resourceView, setResourceView] = useState("all");

  // Mock data
  const resourceStats = {
    total: 120,
    inUse: 78,
    utilization: 65,
    alerts: 3,
  };

  const resourceTypes = [
    { name: "Computing", value: 40, color: "#4C9AFF" },
    { name: "Storage", value: 25, color: "#6554C0" },
    { name: "Network", value: 20, color: "#00B8D9" },
    { name: "Human", value: 15, color: "#36B37E" },
  ];

  const taskData = [
    {
      id: "TSK-001",
      name: "Database Migration",
      resource: "Computing",
      consumption: 45,
      priority: "High",
      startTime: "08:00 AM",
      duration: "4h",
      progress: 75,
      status: "Running",
    },
    {
      id: "TSK-002",
      name: "Server Maintenance",
      resource: "Network",
      consumption: 30,
      priority: "Medium",
      startTime: "09:30 AM",
      duration: "2h",
      progress: 50,
      status: "Running",
    },
    {
      id: "TSK-003",
      name: "Backup Process",
      resource: "Storage",
      consumption: 80,
      priority: "High",
      startTime: "10:00 AM",
      duration: "3h",
      progress: 25,
      status: "Running",
    },
    {
      id: "TSK-004",
      name: "Code Deployment",
      resource: "Computing",
      consumption: 60,
      priority: "Medium",
      startTime: "11:00 AM",
      duration: "1h",
      progress: 90,
      status: "Running",
    },
    {
      id: "TSK-005",
      name: "Security Audit",
      resource: "Human",
      consumption: 50,
      priority: "Low",
      startTime: "01:00 PM",
      duration: "5h",
      progress: 10,
      status: "Running",
    },
    {
      id: "TSK-006",
      name: "Data Analysis",
      resource: "Computing",
      consumption: 70,
      priority: "Medium",
      startTime: "02:30 PM",
      duration: "4h",
      progress: 0,
      status: "Pending",
    },
    {
      id: "TSK-007",
      name: "Network Optimization",
      resource: "Network",
      consumption: 40,
      priority: "Low",
      startTime: "09:00 AM",
      duration: "2h",
      progress: 100,
      status: "Completed",
    },
  ];

  // Update current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      setCurrentDateTime(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    setResourceView(e.target.value);
  };

  // Handle refresh
  const handleRefresh = () => {
    // In a real app, this would fetch new data
    console.log("Refreshing data...");
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Running":
        return "bg-primary";
      case "Pending":
        return "bg-warning";
      case "Completed":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-danger";
      case "Medium":
        return "text-warning";
      case "Low":
        return "text-success";
      default:
        return "text-muted";
    }
  };

  // Get utilization color
  const getUtilizationColor = (percentage) => {
    if (percentage < 50) return "bg-success";
    if (percentage < 80) return "bg-warning";
    return "bg-danger";
  };

  useEffect(() => {
    // Get the canvas element
    const ctx = document.getElementById("resource-distribution-chart");

    // Initialize the chart
    const myChart = new Chart(ctx, {
      type: "pie", // Chart type, you can also use 'bar', 'line', etc.
      data: {
        labels: ["Computing", "Storage", "Network", "Human"], // Labels for the chart
        datasets: [
          {
            label: "Resource Distribution",
            data: [40, 25, 20, 15], // Data for each category
            backgroundColor: ["#4C9AFF", "#6554C0", "#00B8D9", "#36B37E"], // Colors for each category
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) =>
                `${tooltipItem.label}: ${tooltipItem.raw}%`,
            },
          },
        },
      },
    });

    // Cleanup on component unmount
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, []);

  return (
    <div className="container-fluid bg-card" >
      {/* Header Section */}
      <header className="bg-card shadow-sm mb-4">
        <div className="container-fluid bg-card">
          <div className="d-flex justify-content-between align-items-center py-3">
            <h2 className="gradient-heading mb-0 ">Resource Workload</h2>
            <div className="d-flex align-items-center">
              {/* <span className=" me-3">{currentDateTime}</span>
              <button 
                onClick={handleRefresh}
                className="btn btn-secondary btn-sm me-3"
                title="Refresh data"
              >
                <i className="fas fa-sync-alt"></i>
              </button> */}
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="resourceFilterDropdown"
                  data-bs-toggle="dropdown"
                >
                  {resourceView === "all"
                    ? "All Resources"
                    : resourceView.charAt(0).toUpperCase() +
                      resourceView.slice(1)}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="resourceFilterDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setResourceView("all")}
                    >
                      All Resources
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setResourceView("computing")}
                    >
                      Computing
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setResourceView("storage")}
                    >
                      Storage
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setResourceView("network")}
                    >
                      Network
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setResourceView("human")}
                    >
                      Human
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid mb-5">
        {/* Resource Status Overview */}
        <section className="mb-4 ">
          <h2 className="h5 mb-3">Resource Status Overview</h2>
        <div className="row g-3">
  {/* Total Resources */}
  <div className="col-md-6 col-lg-3">
    <div className="card h-100 text-white bg-primary  rounded-4 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="small mb-1">Total Resources</p>
          <h3 className="fw-bold mb-0">{resourceStats.total}</h3>
        </div>
        <div className="p-3 bg-white bg-opacity-25 rounded">
          <i className="fas fa-server fs-4 text-white"></i>
        </div>
      </div>
    </div>
  </div>

  {/* Resources In Use */}
  <div className="col-md-6 col-lg-3">
    <div className="card h-100 text-white bg-success  rounded-4 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="small mb-1">Resources In Use</p>
          <h3 className="fw-bold mb-0">{resourceStats.inUse}</h3>
        </div>
        <div className="p-3 bg-white bg-opacity-25 rounded">
          <i className="fas fa-cogs fs-4 text-white"></i>
        </div>
      </div>
    </div>
  </div>

  {/* Utilization */}
  <div className="col-md-6 col-lg-3">
    <div className="card h-100 text-dark bg-warning  rounded-4 shadow-sm">
      <div className="card-body d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="small mb-1 text-light">Utilization</p>
            <h3 className="fw-bold mb-0 text-light">{resourceStats.utilization}%</h3>
          </div>
          <div className="p-3 bg-dark bg-opacity-10 rounded">
            <i className="fas fa-chart-pie fs-4 text-light"></i>
          </div>
        </div>
        <div className="progress mt-3 bg-dark bg-opacity-10" style={{ height: "6px" }}>
          <div
            className={`progress-bar ${getUtilizationColor(resourceStats.utilization)}`}
            style={{ width: `${resourceStats.utilization}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>

  {/* Critical Alerts */}
  <div className="col-md-6 col-lg-3">
    <div className="card h-100 text-white bg-danger  rounded-4 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="small mb-1">Critical Alerts</p>
          <h3 className="fw-bold mb-0">{resourceStats.alerts}</h3>
        </div>
        <div className="p-3 bg-white bg-opacity-25 rounded">
          <i className="fas fa-exclamation-triangle fs-4 text-white"></i>
        </div>
      </div>
    </div>
  </div>
</div>

        </section>

        {/* Resource Distribution and Task Workload */}
        <div className="row mb-4">
          {/* Resource Distribution Chart */}
          <div className="col-lg-4 mb-3">
            <div className="card h-100 bg-card">
              <div className="card-body">
                <h2 className="h5 mb-3">Resource Distribution</h2>
                <div
                  className="chart-container"
                  style={{ position: "relative", height: "300px" }}
                >
                  <canvas id="resource-distribution-chart"></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* Task Workload List */}
          <div className="col-lg-8 mb-3">
            <div className="card h-100 bg-card">
              <div className="card-header">
                <h2 className="h5 mb-0">Task Workload</h2>
              </div>
              <div className="card-body p-0">
                <div
                  className="table-responsive table-gradient-bg"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <table className="table table-hover  mb-0">
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
                        <th>ID</th>
                        <th>Task</th>
                        <th>Resource</th>
                        <th>Priority</th>
                        <th>Time</th>
                        <th>Progress</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskData.map((task) => (
                        <tr key={task.id}  className="text-center">
                          <td>{task.id}</td>
                          <td>
                            <div className="fw-bold">{task.name}</div>
                            <small className="">{task.id}</small>
                          </td>
                          <td>
                            <div>{task.resource}</div>
                            <small className="">
                              {task.consumption}% usage
                            </small>
                          </td>
                          <td>
                            <span className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </span>
                          </td>
                          <td>
                            <div>{task.startTime}</div>
                            <small className="">{task.duration}</small>
                          </td>
                          <td>
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                            <small className="">{task.progress}%</small>
                          </td>
                          <td>
                            <span
                              className={`badge ${getStatusColor(task.status)}`}
                            >
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Timeline */}
        <section className="card mb-4 bg-card">
          <div className="card-body">
            <h2 className="h5 mb-3">Resource Timeline</h2>
            <div className="table-responsive">
              <div className="timeline-container" style={{ minWidth: "800px" }}>
                {/* Timeline Header */}
                <div className="d-flex border-bottom pb-2 mb-2">
                  <div style={{ width: "120px" }}></div>
                  <div className="d-flex flex-grow-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex-grow-1 text-center small ">
                        {i + 8 > 12 ? `${i + 8 - 12} PM` : `${i + 8} AM`}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Rows */}
                {resourceTypes.map((resource, index) => (
                  <div
                    key={index}
                    className="d-flex py-2 border-bottom bg-card"
                  >
                    <div
                      style={{ width: "120px" }}
                      className="d-flex align-items-center"
                    >
                      <span className="fw-bold">{resource.name}</span>
                    </div>
                    <div
                      className="flex-grow-1 position-relative"
                      style={{ height: "40px" }}
                    >
                      {/* Capacity threshold line */}
                      <div
                        className="position-absolute top-0 start-0 end-0 border-top border-danger border-dashed"
                        style={{ top: "75%" }}
                      ></div>

                      {/* Task blocks */}
                      {taskData
                        .filter((task) => task.resource === resource.name)
                        .map((task, taskIndex) => {
                          // Calculate position and width based on start time and duration
                          const startHour = parseInt(
                            task.startTime.split(":")[0]
                          );
                          const startMinute = parseInt(
                            task.startTime.split(":")[0].includes("PM") &&
                              startHour !== 12
                              ? startHour + 12
                              : startHour
                          );
                          const durationHours = parseFloat(
                            task.duration.replace("h", "")
                          );

                          // Position calculation (8 AM is the start of our timeline)
                          const startPosition = ((startMinute - 8) / 12) * 100;
                          const width = (durationHours / 12) * 100;

                          return (
                            <div
                              key={taskIndex}
                              className={`position-absolute rounded ${getStatusColor(
                                task.status
                              )} opacity-75`}
                              style={{
                                left: `${startPosition}%`,
                                width: `${width}%`,
                                height: "20px",
                                top: task.consumption > 50 ? "0" : "50%",
                              }}
                              title={`${task.name} (${task.startTime} - ${durationHours}h)`}
                            >
                              <div className="px-2 small text-white text-truncate h-100 d-flex align-items-center">
                                {task.name}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action Controls */}
        <section className="card">
          <div className="card-body bg-card">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <h2 className="h5 mb-3 mb-md-0">Quick Actions</h2>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i> Allocate Resources
                </button>
                <button className="btn btn-info">
                  <i className="fas fa-sort-amount-up me-2"></i> Prioritize
                  Tasks
                </button>
                <button className="btn btn-success">
                  <i className="fas fa-balance-scale me-2"></i> Balance Load
                </button>
                <button className="btn btn-secondary">
                  <i className="fas fa-file-export me-2"></i> Export Data
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      {/* <div className="position-fixed bottom-0 end-0 p-3">
        <button className="btn btn-primary rounded-circle" style={{ width: '56px', height: '56px' }}>
          <i className="fas fa-plus"></i>
        </button>
      </div> */}
    </div>
  );
}

export default ResourceWorkload;
