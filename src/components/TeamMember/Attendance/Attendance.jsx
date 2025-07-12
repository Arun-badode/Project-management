import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Users,
  Activity,
  FileText,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useSyncScroll from "../../AdminDashboard/Hooks/useSyncScroll";

const Attendance = () => {
  // Mock data for today's attendance
  const [todayAttendance, setTodayAttendance] = useState([
    {
      id: 1,
      user: "John",
      date: "23-06-2025",
      loginTime: "11:30 AM",
      logoutTime: "8:30 PM",
      netWorkingHours: "9 hrs",
      breakTime: "45 Mins",
      taskActiveTime: "7 hrs 30 Mins",
      status: "Present",
      anomalies: "Nil",
    },
    {
      id: 2,
      user: "Niki",
      date: "23-06-2025",
      loginTime: "11:45 AM",
      logoutTime: "8:35 PM",
      netWorkingHours: "8 hrs 50 Mins",
      breakTime: "50 Mins",
      taskActiveTime: "7 hrs 12 Mins",
      status: "Present",
      anomalies: "Late Login",
    },
    {
      id: 3,
      user: "Raj",
      date: "23-06-2025",
      loginTime: "11:27 AM",
      logoutTime: "8:32 PM",
      netWorkingHours: "9 hrs 5 Mins",
      breakTime: "1 hr 10 Mins",
      taskActiveTime: "7 hrs 12 Mins",
      status: "Present",
      anomalies: "Long Break",
    },
    {
      id: 4,
      user: "Jai",
      date: "23-06-2025",
      loginTime: "",
      logoutTime: "",
      netWorkingHours: "",
      breakTime: "",
      taskActiveTime: "",
      status: "Leave",
      anomalies: "",
    },
  ]);

  // Mock data for attendance records
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
    {
      id: 2,
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      department: "Design",
      position: "UI/UX Designer",
      month: "May 2025",
      daysPresent: 20,
      daysAbsent: 0,
      lateArrivals: 1,
      earlyDepartures: 0,
      leaves: [],
      dailyRecords: generateDailyRecords(2),
    },
    {
      id: 3,
      employeeName: "Michael Johnson",
      employeeId: "EMP003",
      department: "Marketing",
      position: "Marketing Specialist",
      month: "May 2025",
      daysPresent: 16,
      daysAbsent: 4,
      lateArrivals: 2,
      earlyDepartures: 3,
      leaves: [
        { date: "2025-05-12", type: "Vacation", status: "Approved" },
        { date: "2025-05-13", type: "Vacation", status: "Approved" },
        { date: "2025-05-14", type: "Vacation", status: "Approved" },
        { date: "2025-05-15", type: "Vacation", status: "Approved" },
      ],
      dailyRecords: generateDailyRecords(3),
    },
    {
      id: 4,
      employeeName: "Emily Davis",
      employeeId: "EMP004",
      department: "HR",
      position: "HR Manager",
      month: "May 2025",
      daysPresent: 19,
      daysAbsent: 1,
      lateArrivals: 0,
      earlyDepartures: 2,
      leaves: [
        { date: "2025-05-20", type: "Personal Leave", status: "Approved" },
      ],
      dailyRecords: generateDailyRecords(4),
    },
    {
      id: 5,
      employeeName: "Robert Wilson",
      employeeId: "EMP005",
      department: "Finance",
      position: "Financial Analyst",
      month: "May 2025",
      daysPresent: 17,
      daysAbsent: 3,
      lateArrivals: 4,
      earlyDepartures: 1,
      leaves: [
        { date: "2025-05-07", type: "Sick Leave", status: "Approved" },
        { date: "2025-05-26", type: "Personal Leave", status: "Approved" },
        { date: "2025-05-27", type: "Personal Leave", status: "Approved" },
      ],
      dailyRecords: generateDailyRecords(5),
    },
  ]);

  // Function to generate daily attendance records
  function generateDailyRecords(seed) {
    const records = [];
    // Generate records from 28th of previous month to 27th of current month
    const startDate = new Date(2025, 3, 28); // April 28, 2025
    const endDate = new Date(2025, 4, 27); // May 27, 2025

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const date = new Date(d);

      // Use seed to create some variation in the data
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
        // Normal working day
        const baseCheckIn = 9 * 60; // 9:00 AM in minutes
        const baseCheckOut = 17 * 60; // 5:00 PM in minutes

        // Add some variation
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
          // If check-in after 9:15
          status = "Late";
        } else if (checkOutMinutes < 17 * 60 - 15) {
          // If check-out before 4:45
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

  // Calculate work hours from check-in and check-out times
  function calculateWorkHours(checkIn, checkOut) {
    const [inHour, inMin] = checkIn.split(":").map(Number);
    const [outHour, outMin] = checkOut.split(":").map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;

    // Calculate difference in hours, rounded to 1 decimal place
    return Math.round((outMinutes - inMinutes) / 6) / 10;
  }

  // State for filters and selected employee
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateRange, setDateRange] = useState({
    start: "2025-04-28",
    end: "2025-05-27",
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("today");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Get unique departments for filter dropdown
  const departments = [
    "All",
    ...new Set(attendanceData.map((emp) => emp.department)),
  ];

  // Filter employees based on search and department
  const filteredEmployees = attendanceData.filter((employee) => {
    const matchesSearch =
      employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Get selected employee data
  const selectedEmployeeData =
    selectedEmployee !== null
      ? attendanceData.find((emp) => emp.id === selectedEmployee)
      : null;

  // Function to handle employee selection
  const handleEmployeeSelect = (id) => {
    setSelectedEmployee(id);
    setViewMode("detailed");
  };

  // Function to close employee detail view
  const closeEmployeeDetail = () => {
    setSelectedEmployee(null);
    setViewMode("summary");
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "success";
      case "Absent":
        return "danger";
      case "Late":
        return "warning";
      case "Early Departure":
        return "warning";
      case "Leave":
        return "info";
      case "Weekend":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const { scrollContainerRef, fakeScrollbarRef } = useSyncScroll(true);

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="h2 gradient-heading">Attendance Management</h2>
          <p className="text-white">Cycle: April 28, 2025 - May 27, 2025</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4 table-gradient-bg">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-4 mt-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-4">
                  <select
                    className="form-select"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, start: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, end: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button className="btn btn-primary">
                <Download size={16} className="me-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${viewMode === "today" ? "active" : ""}`}
            onClick={() => setViewMode("today")}
          >
            <Calendar size={16} className="me-2" />
            Today
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${viewMode === "summary" ? "active" : ""}`}
            onClick={() => setViewMode("summary")}
          >
            <Activity size={16} className="me-2" />
            Summary View
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${viewMode === "detailed" ? "active" : ""}`}
            onClick={() => {
              if (!selectedEmployee) {
                setViewMode("detailed");
              } else {
                setViewMode("detailed");
              }
            }}
          >
            <FileText size={16} className="me-2" />
            Details View
          </button>
        </li>
      </ul>

      {/* Today View */}
      {viewMode === "today" && (
        <div className="card table-gradient-bg">
          <div className="card-body ">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="h5 mb-0">Today's Attendance</h3>
              <div className="d-flex align-items-center">
                <label htmlFor="datePicker" className="me-2 mb-0">
                  Select Date:
                </label>
                <input
                  type="date"
                  id="datePicker"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: "auto" }}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
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
                    <th>User</th>
                    <th>Date</th>
                    <th>Login Time</th>
                    <th>Logout Time</th>
                    <th>Net Working Hours</th>
                    <th>Break Time</th>
                    <th>Task-Active Time</th>
                    <th>Status</th>
                    <th>Any Anomalies</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAttendance.map((record) => (
                    <tr key={record.id}  className="text-center">
                      <td>{record.user}</td>
                      <td>{record.date}</td>
                      <td>{record.loginTime || "-"}</td>
                      <td>{record.logoutTime || "-"}</td>
                      <td>{record.netWorkingHours || "-"}</td>
                      <td>{record.breakTime || "-"}</td>
                      <td>{record.taskActiveTime || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            record.status === "Present"
                              ? "bg-success-subtle text-success"
                              : "bg-info-subtle text-info"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td>{record.anomalies || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Summary View */}
      {viewMode === "summary" && (
        <div className="card bg-card">
          <div className="card-body p-0 table-gradient-bg">
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
              <div style={{ width: "1200px", height: 1 }} />
            </div>
            <div
              className="table-responsive"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                overflowX: "auto",
              }}
              ref={scrollContainerRef}
            >
              <table className="table table-hover mb-0">
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
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Present Days</th>
                    <th>Absent Days</th>
                    <th>Late Arrivals</th>
                    <th>Early Departures</th>
                    <th>Leaves</th>
                    <th>Net Working Hours</th>
                    <th>Break Time</th>
                    <th>Task Active Time</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}  className="text-center">
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm  rounded me-3">
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
                            <div className="small">{employee.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{employee.department}</div>
                        <div className="small">{employee.position}</div>
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
                      <td>
                        {Math.round(
                          employee.daysPresent * 8 * 60 +
                            employee.daysPresent * 30
                        ) / 60}{" "}
                        hrs
                      </td>
                      <td>{employee.daysPresent * 30} mins avg</td>
                      <td>
                        {Math.round(
                          employee.daysPresent * 7 * 60 +
                            employee.daysPresent * 30
                        ) / 60}{" "}
                        hrs
                      </td>
                      <td className="text-center mt-2">
                        <button
                          onClick={() => handleEmployeeSelect(employee.id)}
                          className="btn btn-sm btn-info"
                        >
                          <Eye size={16} className="me-1" />
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
      )}

      {/* Detailed View - Employee Selection */}
      {viewMode === "detailed" && !selectedEmployee && (
        <div className="card bg-card">
          <div className="card-body text-center py-5">
            <div className="mb-4">
              <Users size={48} />
            </div>
            <h3 className="h4 mb-3">Select an Employee</h3>
            <p className="">
              Please select an employee to view their detailed attendance
              records.
            </p>

            <div className="row mt-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="col-md-4 mb-3">
                  <div className="card border h-100 bg-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm  rounded me-3">
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
                            <div className="small">{employee.employeeId}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEmployeeSelect(employee.id)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Select
                        </button>
                      </div>
                      <div className="row mt-3 small">
                        <div className="col-6">
                          <span className="">Department:</span>{" "}
                          {employee.department}
                        </div>
                        <div className="col-6">
                          <span className="">Position:</span>{" "}
                          {employee.position}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed View - Employee Details */}
      {viewMode === "detailed" && selectedEmployeeData && (
        <div className="card bg-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-lg  rounded me-3">
                  <span className="avatar-text fs-4">
                    {selectedEmployeeData.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h2 className="h4 mb-0">
                    {selectedEmployeeData.employeeName}
                  </h2>
                  <div className="text-white">
                    {selectedEmployeeData.employeeId} •{" "}
                    {selectedEmployeeData.department} •{" "}
                    {selectedEmployeeData.position}
                  </div>
                </div>
              </div>
              <button
                onClick={closeEmployeeDetail}
                className="btn btn-sm btn-outline-secondary"
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* Attendance Summary */}
            <div className="row mb-4">
              <div className="col-md">
                <div className="card bg-card border-success-subtle mb-3 mb-md-0">
                  <div className="card-body">
                    <div className="small text-success">Present Days</div>
                    <div className="h3 text-success">
                      {selectedEmployeeData.daysPresent}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card bg-danger-subtle bg-card border-danger-subtle mb-3 mb-md-0">
                  <div className="card-body">
                    <div className="small text-danger">Absent Days</div>
                    <div className="h3 text-danger">
                      {selectedEmployeeData.daysAbsent}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card bg-warning-subtle bg-card border-warning-subtle mb-3 mb-md-0">
                  <div className="card-body">
                    <div className="small text-warning">Late Arrivals</div>
                    <div className="h3 text-warning">
                      {selectedEmployeeData.lateArrivals}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card bg-warning-subtle bg-card border-warning-subtle mb-3 mb-md-0">
                  <div className="card-body">
                    <div className="small text-warning">Early Departures</div>
                    <div className="h3 text-warning">
                      {selectedEmployeeData.earlyDepartures}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card bg-info-subtle bg-card border-info-subtle">
                  <div className="card-body">
                    <div className="small text-info">Leaves Taken</div>
                    <div className="h3 text-info">
                      {selectedEmployeeData.leaves.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leave Records */}
            {selectedEmployeeData.leaves.length > 0 && (
              <div className="mb-4">
                <h3 className="h5 mb-3">Leave Records</h3>
                <div className="card bg-card">
                  <div className="card-body">
                    <div className="table-responsive table-gradient-bg">
                      <table className="table table-sm">
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
                            <th>Date</th>
                            <th>Type</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEmployeeData.leaves.map((leave, index) => (
                            <tr key={index}  className="text-center">
                              <td>{leave.date}</td>
                              <td>{leave.type}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    leave.status === "Approved"
                                      ? "bg-success-subtle text-success"
                                      : "bg-warning-subtle text-warning"
                                  }`}
                                >
                                  {leave.status}
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
            )}

            {/* Daily Attendance Records */}
            <div className="mb-4">
              <h3 className="h5 mb-3">Daily Attendance Records</h3>
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive table-gradient-bg">
                    <table className="table table-sm mb-0">
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
                          <th>Date</th>
                          <th>Day</th>
                          <th>Status</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                          <th>Work Hours</th>
                          <th>Break Time</th>
                          <th>Task Active Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployeeData.dailyRecords.map(
                          (record, index) => (
                            <tr key={index}  className="text-center">
                              <td>{record.date}</td>
                              <td>{record.day}</td>
                              <td>
                                <span
                                  className={`badge bg-${getStatusColor(
                                    record.status
                                  )}-subtle text-${getStatusColor(
                                    record.status
                                  )}`}
                                >
                                  {record.status}
                                </span>
                              </td>
                              <td>{record.checkIn || "-"}</td>
                              <td>{record.checkOut || "-"}</td>
                              <td>
                                {record.workHours > 0
                                  ? `${record.workHours} hrs`
                                  : "-"}
                              </td>
                              <td>
                                {record.status === "Present" ? "30 mins" : "-"}
                              </td>
                              <td>
                                {record.workHours > 0
                                  ? `${(record.workHours - 0.5).toFixed(1)} hrs`
                                  : "-"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary">
                <FileText size={16} className="me-2" />
                Print Report
              </button>
              <button className="btn btn-primary">
                <Download size={16} className="me-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
