import React, { useState } from "react";

function ActivitySummary() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock data for activity summary
  const activityData = [
    {
      month: "June 2025",
      tasks: [
        {
          name: "Website Redesign",
          hours: 24.5,
          timestamps: [
            "Jun 15, 2025 - 09:30 AM to 12:45 PM",
            "Jun 16, 2025 - 10:15 AM to 03:30 PM",
            "Jun 18, 2025 - 08:00 AM to 11:45 AM",
          ],
        },
        {
          name: "Client Meeting Preparation",
          hours: 8.75,
          timestamps: [
            "Jun 10, 2025 - 01:30 PM to 04:15 PM",
            "Jun 12, 2025 - 09:00 AM to 03:00 PM",
          ],
        },
        {
          name: "Marketing Campaign Planning",
          hours: 16.25,
          timestamps: [
            "Jun 05, 2025 - 10:00 AM to 02:30 PM",
            "Jun 06, 2025 - 09:15 AM to 05:00 PM",
            "Jun 07, 2025 - 11:00 AM to 03:00 PM",
          ],
        },
      ],
    },
    {
      month: "May 2025",
      tasks: [
        {
          name: "Product Development",
          hours: 32.5,
          timestamps: [
            "May 20, 2025 - 08:30 AM to 05:30 PM",
            "May 21, 2025 - 09:00 AM to 04:30 PM",
            "May 22, 2025 - 10:15 AM to 06:15 PM",
            "May 25, 2025 - 08:00 AM to 02:00 PM",
          ],
        },
        {
          name: "User Testing Sessions",
          hours: 12.0,
          timestamps: [
            "May 15, 2025 - 01:00 PM to 05:00 PM",
            "May 16, 2025 - 10:00 AM to 06:00 PM",
          ],
        },
        {
          name: "Quarterly Report Preparation",
          hours: 18.75,
          timestamps: [
            "May 05, 2025 - 09:30 AM to 03:45 PM",
            "May 06, 2025 - 10:00 AM to 04:30 PM",
            "May 07, 2025 - 11:15 AM to 05:15 PM",
          ],
        },
      ],
    },
  ];

  return (
    <div className="container-fluid ">
      <div className="row p-3">
        {/* Header with notifications */}
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h2 className=" gradient-heading ">Activity Summary</h2>
          <div className="dropdown">


            {/* Notification dropdown */}
            {showNotifications && (
              <div
                className="dropdown-menu dropdown-menu-end p-3"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <h6 className="font-weight-bold">Notifications</h6>
                {activityData.map((data, index) => (
                  <div key={index} className="p-3 mb-2 border-bottom">
                    <p className="text-muted mb-1">{data.month}</p>
                    {data.tasks.map((task, taskIndex) => (
                      <div key={taskIndex}>
                        <p className="font-weight-bold">{task.name}</p>
                        <p>Hours: {task.hours}</p>
                        {task.timestamps.map((timestamp, timestampIndex) => (
                          <small
                            key={timestampIndex}
                            className="d-block text-muted"
                          >
                            {timestamp}
                          </small>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="card shadow-sm bg-card">
          <div className="card-body ">
            <h2 className="h4 font-weight-bold mb-4 ">Activity Summary</h2>

            {/* Activity list by month */}
            {activityData.map((monthData, monthIndex) => (
              <div
                key={monthIndex}
                className={`${monthIndex > 0 ? "mt-4 pt-4 border-top" : ""}`}
              >
                <h4 className="font-weight-bold">{monthData.month}</h4>

                {/* Task table */}
                <div className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table className="table table-striped table-gradient-bg table-bordered">
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
                        <th className="text-start">ID</th> {/* New ID column */}
                        <th className="text-start">Task Name</th>
                        <th className="text-center">Total Hours</th>
                        <th className="text-end">Timestamps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthData.tasks.map((task, taskIndex) => (
                        <tr key={taskIndex}  className="text-center">
                          <td className="text-start">{taskIndex + 1}</td> {/* Display ID */}
                          <td className="text-start">{task.name}</td>
                          <td className="text-center">{task.hours}</td>
                          <td className="text-end">
                            <div>
                              {task.timestamps.map((timestamp, timeIndex) => (
                                <span key={timeIndex} className="d-block">
                                  {timestamp}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In-App Messaging Preview */}
        <div className="card shadow-sm mt-5 bg-card">
          <div className="card-body ">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 font-weight-bold">Recent Discussions</h2>
              <button className="btn btn-sm btn-link text-primary">
                View All <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>

            {/* Recent discussion items */}
            <div className="list-group  ">
              {/* Message 1 */}
              <div className="list-group-item d-flex align-items-start p-3 table-gradient-bg">
                <div
                  className="me-3 rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  JD
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <h5 className="font-weight-bold">John Doe</h5>
                    <span className=" small">Today, 11:32 AM</span>
                  </div>
                  <p className="mb-1">
                    Can you share the latest mockups for the Website Redesign
                    project?
                  </p>
                  <span className="badge badge-secondary">
                    Website Redesign
                  </span>
                </div>
              </div>

              {/* Message 2 */}
              <div className="list-group-item d-flex align-items-start p-3  table-gradient-bg">
                <div
                  className="me-3 rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  AS
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <h5 className="font-weight-bold">Anna Smith</h5>
                    <span className=" small">Yesterday, 3:45 PM</span>
                  </div>
                  <p className="mb-1">
                    I've updated the marketing campaign timeline. Please review
                    when you get a chance.
                  </p>
                  <span className="badge badge-secondary">
                    Marketing Campaign
                  </span>
                </div>
              </div>

              {/* Message 3 */}
              <div className="list-group-item d-flex align-items-start p-3 table-gradient-bg">
                <div
                  className="me-3 rounded-circle bg-warning text-white d-flex justify-content-center align-items-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  RJ
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <h5 className="font-weight-bold">Robert Johnson</h5>
                    <span className=" small">Jun 16, 2025</span>
                  </div>
                  <p className="mb-1">
                    The client meeting went well. They approved our proposal for
                    the Q3 deliverables.
                  </p>
                  <span className="badge badge-secondary">Client Meeting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivitySummary;
