import React, { useState, useEffect } from "react";
import axios from "axios";
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
import BASE_URL from "../../../config";

const Attendance = () => {
  // // Mock data for today's attendance
  // const [todayAttendance, setTodayAttendance] = useState([
  //   {
  //     id: 1,
  //     user: "John",
  //     date: "23-06-2025",
  //     loginTime: "11:30 AM",
  //     logoutTime: "8:30 PM",
  //     netWorkingHours: "9 hrs",
  //     breakTime: "45 Mins",
  //     taskActiveTime: "7 hrs 30 Mins",
  //     status: "Present",
  //     anomalies: "Nil",
  //   },
  //   {
  //     id: 2,
  //     user: "Niki",
  //     date: "23-06-2025",
  //     loginTime: "11:45 AM",
  //     logoutTime: "8:35 PM",
  //     netWorkingHours: "8 hrs 50 Mins",
  //     breakTime: "50 Mins",
  //     taskActiveTime: "7 hrs 12 Mins",
  //     status: "Present",
  //     anomalies: "Late Login",
  //   },
  //   {
  //     id: 3,
  //     user: "Raj",
  //     date: "23-06-2025",
  //     loginTime: "11:27 AM",
  //     logoutTime: "8:32 PM",
  //     netWorkingHours: "9 hrs 5 Mins",
  //     breakTime: "1 hr 10 Mins",
  //     taskActiveTime: "7 hrs 12 Mins",
  //     status: "Present",
  //     anomalies: "Long Break",
  //   },
  //   {
  //     id: 4,
  //     user: "Jai",
  //     date: "23-06-2025",
  //     loginTime: "",
  //     logoutTime: "",
  //     netWorkingHours: "",
  //     breakTime: "",
  //     taskActiveTime: "",
  //     status: "Leave",
  //     anomalies: "",
  //   },
  // ]);

  // fetch dynamic data for today's attendance
  const [attendanceData, setAttendanceData] = useState([]);
  const token = localStorage.getItem("authToken");

  // this effect fetches attendance data from the API
  useEffect(() => {
    axios
      .get(`${BASE_URL}attendance/getAllAttendanceWithMembers`)
      .then((res) => {
        console.log("API Response:", res.data);

        const members = res.data.data || []; // ✅ Extract the members array

        // Flatten attendance entries
        const formattedData = members.flatMap((member) =>
          (member.attendance || []).map((att) => ({
            id: att.id,
            user: member.fullName,
            date: att.attendanceDate,
            loginTime: att.inTime || "-",
            logoutTime: att.outTime || "-",
            netWorkingHours: calculateNetHours(att.inTime, att.outTime),
            taskActiveTime: att.taskActiveTime || "-",
            status: att.status,
            anomalies: att.remarks || "-",
          }))
        );

        setAttendanceData(formattedData);
      })
      .catch((err) => {
        console.error("Error fetching attendance data", err);
      });
  }, []);


  const calculateNetHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "-";

    const [inH, inM] = inTime.split(":").map(Number);
    const [outH, outM] = outTime.split(":").map(Number);

    let start = inH * 60 + inM;
    let end = outH * 60 + outM;

    // Handle overnight shifts
    if (end < start) {
      end += 24 * 60;
    }

    const diff = end - start;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    return `${hours}h ${mins}m`;
  };

  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    if (!attendanceData.length) return;

    const grouped = attendanceData.reduce((acc, entry) => {
      if (!acc[entry.user]) {
        acc[entry.user] = {
          id: entry.id,
          employeeName: entry.user,
          employeeId: entry.employeeId || "-",
          department: entry.department || "-",
          position: entry.position || "-",
          daysPresent: 0,
          daysAbsent: 0,
          lateArrivals: 0,
          earlyDepartures: 0,
          leaves: [],
          totalNetMinutes: 0,
          totalBreakMinutes: 0,
          totalTaskMinutes: 0,
        };
      }

      const emp = acc[entry.user];

      // Count attendance status
      if (entry.status === "Present") emp.daysPresent += 1;
      if (entry.status === "Absent") emp.daysAbsent += 1;
      if (entry.status === "Leave") emp.leaves.push(entry.date);
      if (entry.status === "Late") emp.lateArrivals += 1;
      if (entry.status === "EarlyDeparture") emp.earlyDepartures += 1;

      // Net working hours in minutes
      if (entry.loginTime !== "-" && entry.logoutTime !== "-") {
        const [inH, inM] = entry.loginTime.split(":").map(Number);
        const [outH, outM] = entry.logoutTime.split(":").map(Number);

        let start = inH * 60 + inM;
        let end = outH * 60 + outM;
        if (end < start) end += 24 * 60; // overnight handling

        emp.totalNetMinutes += end - start;
      }

      // Task active time
      if (entry.taskActiveTime && entry.taskActiveTime !== "-") {
        const [taskH, taskM] = entry.taskActiveTime.split(":").map(Number);
        emp.totalTaskMinutes += taskH * 60 + taskM;
      }

      // Break time (example: assume fixed 30 mins per day present)
      if (entry.status === "Present") {
        emp.totalBreakMinutes += 30;
      }

      return acc;
    }, {});

    setSummaryData(Object.values(grouped));
  }, [attendanceData]);


  // // Mock data for attendance records
  // const [attendanceData, setAttendanceData] = useState([
  //   {
  //     id: 1,
  //     employeeName: "John Doe",
  //     employeeId: "EMP001",
  //     department: "Engineering",
  //     position: "Senior Developer",
  //     month: "May 2025",
  //     daysPresent: 18,
  //     daysAbsent: 2,
  //     lateArrivals: 3,
  //     earlyDepartures: 1,
  //     leaves: [
  //       { date: "2025-05-05", type: "Sick Leave", status: "Approved" },
  //       { date: "2025-05-06", type: "Sick Leave", status: "Approved" },
  //     ],
  //     dailyRecords: generateDailyRecords(1),
  //   },
  //   {
  //     id: 2,
  //     employeeName: "Jane Smith",
  //     employeeId: "EMP002",
  //     department: "Design",
  //     position: "UI/UX Designer",
  //     month: "May 2025",
  //     daysPresent: 20,
  //     daysAbsent: 0,
  //     lateArrivals: 1,
  //     earlyDepartures: 0,
  //     leaves: [],
  //     dailyRecords: generateDailyRecords(2),
  //   },
  //   {
  //     id: 3,
  //     employeeName: "Michael Johnson",
  //     employeeId: "EMP003",
  //     department: "Marketing",
  //     position: "Marketing Specialist",
  //     month: "May 2025",
  //     daysPresent: 16,
  //     daysAbsent: 4,
  //     lateArrivals: 2,
  //     earlyDepartures: 3,
  //     leaves: [
  //       { date: "2025-05-12", type: "Vacation", status: "Approved" },
  //       { date: "2025-05-13", type: "Vacation", status: "Approved" },
  //       { date: "2025-05-14", type: "Vacation", status: "Approved" },
  //       { date: "2025-05-15", type: "Vacation", status: "Approved" },
  //     ],
  //     dailyRecords: generateDailyRecords(3),
  //   },
  //   {
  //     id: 4,
  //     employeeName: "Emily Davis",
  //     employeeId: "EMP004",
  //     department: "HR",
  //     position: "HR Manager",
  //     month: "May 2025",
  //     daysPresent: 19,
  //     daysAbsent: 1,
  //     lateArrivals: 0,
  //     earlyDepartures: 2,
  //     leaves: [
  //       { date: "2025-05-20", type: "Personal Leave", status: "Approved" },
  //     ],
  //     dailyRecords: generateDailyRecords(4),
  //   },
  //   {
  //     id: 5,
  //     employeeName: "Robert Wilson",
  //     employeeId: "EMP005",
  //     department: "Finance",
  //     position: "Financial Analyst",
  //     month: "May 2025",
  //     daysPresent: 17,
  //     daysAbsent: 3,
  //     lateArrivals: 4,
  //     earlyDepartures: 1,
  //     leaves: [
  //       { date: "2025-05-07", type: "Sick Leave", status: "Approved" },
  //       { date: "2025-05-26", type: "Personal Leave", status: "Approved" },
  //       { date: "2025-05-27", type: "Personal Leave", status: "Approved" },
  //     ],
  //     dailyRecords: generateDailyRecords(5),
  //   },
  // ]);

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
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("today");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Get unique departments for filter dropdown
  const departments = [
    "All",
    ...new Set(attendanceData.map((emp) => emp.department)),
  ];

  // Create a unique employee list from attendanceData
  const uniqueEmployees = attendanceData.reduce((acc, record) => {
    if (!acc.some(emp => emp.id === record.id)) {
      acc.push({
        id: record.id,
        employeeName: record.user,
        employeeId: record.employeeId || "-", // If available in API
        department: record.department || "-", // If available in API
        position: record.position || "-", // If available in API
      });
    }
    return acc;
  }, []);

  // Apply filters
  const filteredEmployees = uniqueEmployees.filter((employee) => {
    const matchesSearch =
      employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });


 // Get selected employee data (transformed)
const selectedEmployeeData =
  selectedEmployee !== null
    ? (() => {
        const emp = attendanceData.find((emp) => emp.id === selectedEmployee);
        if (!emp) return null;

        const dailyRecords = (emp.attendance || []).map((att) => {
          const day = new Date(att.attendanceDate).toLocaleDateString("en-US", {
            weekday: "long",
          });

          let workHours = 0;
          if (att.inTime && att.outTime) {
            const inDate = new Date(`1970-01-01T${att.inTime}:00`);
            const outDate = new Date(`1970-01-01T${att.outTime}:00`);
            workHours = (outDate - inDate) / (1000 * 60 * 60);
            if (workHours < 0) workHours += 24; // handle overnight shifts
          }

          return {
            date: att.attendanceDate,
            day,
            status: att.status,
            checkIn: att.inTime || "-",
            checkOut: att.outTime || "-",
            workHours,
            breakTime: att.status === "Present" ? "30 mins" : "-",
            taskActiveTime:
              workHours > 0 ? `${(workHours - 0.5).toFixed(1)} hrs` : "-",
          };
        });

        const daysPresent = dailyRecords.filter(
          (r) => r.status === "Present"
        ).length;
        const daysAbsent = dailyRecords.filter(
          (r) => r.status === "Absent"
        ).length;
        const lateArrivals = dailyRecords.filter(
          (r) => r.status === "Present" && r.checkIn > "09:15"
        ).length;
        const earlyDepartures = dailyRecords.filter(
          (r) => r.status === "Present" && r.checkOut < "17:00"
        ).length;
        const leaves = dailyRecords
          .filter((r) => r.status === "Leave")
          .map((l) => ({
            date: l.date,
            type: "Leave",
            status: "Approved",
          }));

        return {
          employeeName: emp.fullName,
          employeeId: emp.empId,
          department: emp.team,
          position: emp.role,
          daysPresent,
          daysAbsent,
          lateArrivals,
          earlyDepartures,
          leaves,
          dailyRecords,
        };
      })()
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

  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    memberId: "",
    attendanceDate: new Date().toISOString().split("T")[0], // yyyy-mm-dd
    status: "Absent",
    inTime: "",
    outTime: "",
    remarks: ""
  });

  
useEffect(() => {
  const modalElement = document.getElementById("attendanceModal");

  if (!modalElement) return;

  const handleModalShow = () => {
    axios.get(`${BASE_URL}member/getAllMembers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log("Members fetched successfully", res.data.data);
        setMembers(res.data.data);
      })
      .catch(err => console.error("Error fetching members", err));
  };

  modalElement.addEventListener("show.bs.modal", handleModalShow);

  // Cleanup
  return () => {
    modalElement.removeEventListener("show.bs.modal", handleModalShow);
  };
}, [token]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(
      `${BASE_URL}attendance/markAttendance`, // replace with your actual backend attendance route
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => {
        console.log("Attendance API Response:", res.data);
        alert("Attendance marked successfully!");

        // Reset form
        setFormData({
          memberId: "",
          attendanceDate: new Date().toISOString().split("T")[0],
          status: "Absent",
          inTime: "",
          outTime: "",
          remarks: ""
        });
      })
      .catch(err => {
        console.error("Error marking attendance:", err);
        alert("Failed to mark attendance.");
      });
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
        <li className="nav-item ms-auto">
          <button
            type="button"
            className="btn btn-primary"
            style={{
              background: "linear-gradient(90deg, #7928CA, #FF0080)",
              border: "none",
              fontWeight: "bold",
            }}
            data-bs-toggle="modal"
            data-bs-target="#attendanceModal"
          >
            Mark Attendance
          </button>
        </li>

      </ul>

      {/* Attendance view */}
      <div
        className="modal fade"
        id="attendanceModal"
        tabIndex="-1"
        aria-labelledby="attendanceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              background: "linear-gradient(135deg, #3b0a57, #1e0b3b, #0d1b4c)",
              color: "white",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="modal-header border-0">
              <h5 className="modal-title" id="attendanceModalLabel">
                Mark Attendance
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                {/* Member Dropdown */}
                <select
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleChange}
                  required
                  className="form-select bg-dark text-white border-light"
                >
                  <option value="">Select Member</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))}
                </select>

                {/* Date */}
                <input
                  type="date"
                  name="attendanceDate"
                  value={formData.attendanceDate}
                  onChange={handleChange}
                  required
                  className="form-control bg-dark text-white border-light"
                />

                {/* Status Dropdown */}
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select bg-dark text-white border-light"
                >
                  <option value="Absent">Absent</option>
                  <option value="Present">Present</option>
                  <option value="Leave">Leave</option>
                </select>

                {/* In Time */}
                <input
                  type="time"
                  name="inTime"
                  value={formData.inTime}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-light"
                />

                {/* Out Time */}
                <input
                  type="time"
                  name="outTime"
                  value={formData.outTime}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-light"
                />

                {/* Remarks */}
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Remarks..."
                  className="form-control bg-dark text-white border-light"
                  rows={3}
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  style={{
                    background: "linear-gradient(90deg, #7928CA, #FF0080)",
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  Save Attendance
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>


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
                  className="table-gradient-bg"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#fff",
                  }}
                >
                  <tr className="text-center">
                    <th>User</th>
                    <th>Date</th>
                    <th>Login Time</th>
                    <th>Logout Time</th>
                    <th>Net Working Hours</th>
                    {/* <th>Task-Active Time</th> */}
                    <th>Status</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record) => (
                    <tr key={record.id} className="text-center">
                      <td>{record.user}</td>
                      <td>{record.date}</td>
                      <td>{record.loginTime}</td>
                      <td>{record.logoutTime}</td>
                      <td>{record.netWorkingHours}</td>
                      {/* <td>{record.taskActiveTime}</td> */}
                      <td>
                        <span
                          className={`badge ${record.status === "Present"
                            ? "bg-success-subtle text-success"
                            : "bg-info-subtle text-info"
                            }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td>{record.anomalies}</td>
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
                  <tr className="text-center">
                    <th>Employee</th>
                    {/* <th>Department</th> */}
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
                  {summaryData.map((employee) => (
                    <tr key={employee.id} className="text-center">
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm rounded me-3">
                            <span className="avatar-text">
                              {employee.employeeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <div className="fw-semibold">{employee.employeeName}</div>
                            <div className="small">{employee.id}</div>
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <div>{employee.department}</div>
                        <div className="small">{employee.position}</div>
                      </td> */}
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
                      <td>{(employee.totalNetMinutes / 60).toFixed(1)} hrs</td>
                      <td>{employee.totalBreakMinutes} mins avg</td>
                      <td>{(employee.totalTaskMinutes / 60).toFixed(1)} hrs</td>
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
            <p>Please select an employee to view their detailed attendance records.</p>

            <div className="row mt-4">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const initials = employee.employeeName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <div key={employee.id} className="col-md-4 mb-3">
                      <div className="card border h-100 bg-card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-sm rounded me-3">
                                <span className="avatar-text">{initials}</span>
                              </div>
                              <div>
                                <div className="fw-semibold">{employee.employeeName}</div>
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
                              <span className="fw-semibold">Department:</span>{" "}
                              {employee.department}
                            </div>
                            <div className="col-6">
                              <span className="fw-semibold">Position:</span>{" "}
                              {employee.position}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted">No employees found</div>
              )}
            </div>
          </div>
        </div>
      )}


    {/* Detailed View - Employee Details */}
{viewMode === "detailed" && selectedEmployeeData && (
  <div className="card bg-card">
    <div className="card-body">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="avatar avatar-lg rounded me-3">
            <span className="avatar-text fs-4">
              {selectedEmployeeData.employeeName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h2 className="h4 mb-0">{selectedEmployeeData.employeeName}</h2>
            <div className="text-white">
              {selectedEmployeeData.employeeId} • {selectedEmployeeData.department} • {selectedEmployeeData.position}
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
        {[
          { label: "Present Days", value: selectedEmployeeData.daysPresent, color: "success" },
          { label: "Absent Days", value: selectedEmployeeData.daysAbsent, color: "danger" },
          { label: "Late Arrivals", value: selectedEmployeeData.lateArrivals, color: "warning" },
          { label: "Early Departures", value: selectedEmployeeData.earlyDepartures, color: "warning" },
          { label: "Leaves Taken", value: selectedEmployeeData.leaves?.length || 0, color: "info" },
        ].map((item, idx) => (
          <div className="col-md" key={idx}>
            <div className={`card bg-card border-${item.color}-subtle mb-3 mb-md-0`}>
              <div className="card-body">
                <div className={`small text-${item.color}`}>{item.label}</div>
                <div className={`h3 text-${item.color}`}>{item.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Records */}
      {selectedEmployeeData.leaves?.length > 0 && (
        <div className="mb-4">
          <h3 className="h5 mb-3">Leave Records</h3>
          <div className="card bg-card">
            <div className="card-body">
              <div className="table-responsive table-gradient-bg">
                <table className="table table-sm">
                  <thead className="table-gradient-bg" style={{ position: "sticky", top: 0, zIndex: 0, backgroundColor: "#fff" }}>
                    <tr className="text-center">
                      <th>Date</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEmployeeData.leaves.map((leave, index) => (
                      <tr key={index} className="text-center">
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
                <thead className="table-gradient-bg" style={{ position: "sticky", top: 0, zIndex: 0, backgroundColor: "#fff" }}>
                  <tr className="text-center">
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
                  {selectedEmployeeData.dailyRecords?.map((record, index) => (
                    <tr key={index} className="text-center">
                      <td>{record.date}</td>
                      <td>{record.day}</td>
                      <td>
                        <span
                          className={`badge bg-${getStatusColor(record.status)}-subtle text-${getStatusColor(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td>{record.checkIn || "-"}</td>
                      <td>{record.checkOut || "-"}</td>
                      <td>{record.workHours > 0 ? `${record.workHours} hrs` : "-"}</td>
                      <td>{record.status === "Present" ? "30 mins" : "-"}</td>
                      <td>{record.workHours > 0 ? `${(record.workHours - 0.5).toFixed(1)} hrs` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary">
          <FileText size={16} className="me-2" /> Print Report
        </button>
        <button className="btn btn-primary">
          <Download size={16} className="me-2" /> Export Data
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Attendance;
