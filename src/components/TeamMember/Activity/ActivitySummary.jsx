import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../config";

function ActivitySummary() {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          `${BASE_URL}activityLogs/getActivityLogs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const logs = response.data.data;

        // Group by Month
        const groupedByMonth = {};

        logs.forEach((log) => {
          const logDate = new Date(log.timestamp);
          const monthYear = logDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });

          const hoursDiff = Math.abs(new Date() - new Date(log.timestamp)) / 36e5;

          if (!groupedByMonth[monthYear]) {
            groupedByMonth[monthYear] = [];
          }

          groupedByMonth[monthYear].push({
            id: log.id,
            name: log.role,
            hours: parseFloat(hoursDiff.toFixed(2)),
            timestamp: new Date(log.timestamp).toLocaleString(),
          });
        });

        const formattedData = Object.entries(groupedByMonth).map(
          ([month, logs]) => {
            const tasks = logs.map((entry) => ({
              id: entry.id,
              name: entry.name,
              hours: entry.hours,
              timestamps: [entry.timestamp],
            }));
            return { month, tasks };
          }
        );

        setActivityData(formattedData);
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
      }
    };

    fetchActivityLogs();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row p-3">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h2 className="gradient-heading">Activity Summary</h2>
        </div>

        <div className="card shadow-sm bg-card">
          <div className="card-body">
            <h2 className="h4 font-weight-bold mb-4">Activity Summary</h2>

            {activityData.map((monthData, monthIndex) => (
              <div
                key={monthIndex}
                className={`${monthIndex > 0 ? "mt-4 pt-4 border-top" : ""}`}
              >
                <h4 className="font-weight-bold">{monthData.month}</h4>

                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <table className="table table-striped table-gradient-bg table-bordered">
                    <thead
                      className="table-gradient-bg"
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 0,
                        backgroundColor: "#fff",
                      }}
                    >
                      <tr className="text-center">
                        <th className="text-start">ID</th>
                        <th className="text-start">Task Name (Role)</th>
                        <th className="text-center">Total Hours</th>
                        <th className="text-end">Timestamps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthData.tasks.map((task, taskIndex) => (
                        <tr key={taskIndex} className="text-center">
                          <td className="text-start">{task.id}</td>
                          <td className="text-start">{task.name}</td>
                          <td className="text-center">{task.hours}</td>
                          <td className="text-end">
                            {task.timestamps.map((ts, idx) => (
                              <span key={idx} className="d-block">{ts}</span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

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
      </div>
    </div>
  );
}

export default ActivitySummary;
