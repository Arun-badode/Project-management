import React from "react";

const TeamOnDutyTable = ({ todayAttendanceData }) => {
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

  return (
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
        {todayAttendanceData.map((employee) => {
          const initials = employee.employeeName
            .split(" ")
            .map((n) => n[0])
            .join("");
          const statusColor = getStatusColor(employee.status);

          return (
            <tr className="text-center" key={employee.id}>
              <td>
                <div className="d-flex ">
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
  );
};

export default TeamOnDutyTable;