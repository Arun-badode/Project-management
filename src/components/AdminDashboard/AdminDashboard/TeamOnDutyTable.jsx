import React, { useEffect, useState } from "react";
import axios from "axios";

const TeamOnDutyTable = ({ scrollContainerRef }) => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  const getStatusColor = (status) => {
    if (!status) return "secondary";

    const statusMap = {
      present: "success",
      absent: "danger",
      late: "warning",
      "on leave": "info",
      "half day": "primary",
    };

    return statusMap[status.toLowerCase()] || "secondary";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://eminoids-backend-production.up.railway.app/api/adminDashboard/getAdminDashboardData",
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        // Transform the API data to match the table format
        const formattedData = response.data.data.onDuty.list.map(member => ({
          id: member.id,
          employeeName: member.fullName,
          position: member.role,
          department: member.team,
          checkInTime: "09:00 AM",
          checkOutTime: "06:00 PM",
          status: "Present",
          isLate: false,
          lateMinutes: 0,
          isEarlyDeparture: false,
          earlyMinutes: 0,
          remarks: "On duty"
        }));

        setTeamData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5 text-danger">
        Error loading team data: {error}
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      style={{
        maxHeight: "500px",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="hide-scrollbar"
    >
      <table className="table table-hover mb-0">
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
            <th>Employee</th>
            <th>Department</th>
            <th>Check-In Time</th>
            <th>Check-Out Time</th>
            <th>Status</th>
            <th>Late Arrival</th>
            <th>Early Departure</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {teamData.map((employee) => {
            const initials = employee.employeeName
              .split(" ")
              .map((n) => n[0])
              .join("");
            const statusColor = getStatusColor(employee.status);

            return (
              <tr className="text-center" key={employee.id}>
                <td>
                  <div className="d-flex">
                    <div className="avatar avatar-sm bg-light-primary rounded me-3">
                      <span className="avatar-text">{initials}</span>
                    </div>
                    <div>
                      <div className="fw-semibold">{employee.employeeName}</div>
                      <div className="small">{employee.position}</div>
                    </div>
                  </div>
                </td>
                <td>{employee.department}</td>
                <td>
                  {employee.checkInTime ? (
                    <span className="badge bg-success-subtle text-success">
                      {employee.checkInTime}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary">
                      Not Checked In
                    </span>
                  )}
                </td>
                <td>
                  {employee.checkOutTime ? (
                    <span className="badge bg-info-subtle text-info">
                      {employee.checkOutTime}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary">
                      Not Checked Out
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`badge bg-${statusColor}-subtle text-${statusColor}`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td>
                  {employee.isLate ? (
                    <span className="badge bg-warning-subtle text-warning">
                      Yes ({employee.lateMinutes} mins)
                    </span>
                  ) : (
                    <span className="badge bg-success-subtle text-success">
                      No
                    </span>
                  )}
                </td>
                <td>
                  {employee.isEarlyDeparture ? (
                    <span className="badge bg-warning-subtle text-warning">
                      Yes ({employee.earlyMinutes} mins)
                    </span>
                  ) : (
                    <span className="badge bg-success-subtle text-success">
                      No
                    </span>
                  )}
                </td>
                <td>{employee.remarks}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeamOnDutyTable;