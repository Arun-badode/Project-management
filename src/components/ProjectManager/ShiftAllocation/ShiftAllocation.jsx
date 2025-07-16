import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import axios from "axios";
import dayjs from "dayjs"; // for formatting time to 12-hour
import { use } from "react";
import BASE_URL from "../../../config";

const ShiftAllocation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeePanel, setShowEmployeePanel] = useState(false);
  const [employee, setEmployees] = useState()
  const token = localStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    memberId: "",
    shiftDate: "",
    startTime: "",
    endTime: "",
    shiftType: "Half Day",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatTime12Hour = (time) => {
    return dayjs(`2020-01-01T${time}`).format("hh:mm A");
  };

  const handleSubmit = async () => {
    const payload = {
      memberId: parseInt(formData.memberId),
      shiftDate: formData.shiftDate,
      startTime: formatTime12Hour(formData.startTime),
      endTime: formatTime12Hour(formData.endTime),
      shiftType: formData.shiftType,
      notes: formData.notes,
    };

    try {

      const response = await axios.post(
        `${BASE_URL}shift/createShift`,
        payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      );
      console.log("Shift created:", response.data);
      setShowAddShiftModal(false);
    } catch (error) {
      console.error("Shift creation failed:", error);
      alert("Error creating shift. Please try again.");
    }
  }
  // Get week dates based on current date
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Format day for display
  const formatDay = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Time slots from 6 AM to 10 PM in 30-minute increments
  const timeSlots = [];
  for (let hour = 6; hour < 22; hour++) {
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  // Sample employees data
  const employees = [
    {
      id: 1,
      name: "John Smith",
      department: "Customer Service",
      shifts: [
        { day: 0, start: "9:00", end: "17:00", type: "morning" },
        { day: 2, start: "12:00", end: "20:00", type: "evening" },
      ],
    },
    {
      id: 2,
      name: "Emma Johnson",
      department: "Sales",
      shifts: [
        { day: 1, start: "8:00", end: "16:00", type: "morning" },
        { day: 3, start: "8:00", end: "16:00", type: "morning" },
        { day: 5, start: "10:00", end: "18:00", type: "morning" },
      ],
    },
    {
      id: 3,
      name: "Michael Brown",
      department: "IT Support",
      shifts: [
        { day: 0, start: "14:00", end: "22:00", type: "evening" },
        { day: 2, start: "14:00", end: "22:00", type: "evening" },
        { day: 4, start: "14:00", end: "22:00", type: "evening" },
      ],
    },
    {
      id: 4,
      name: "Sarah Davis",
      department: "HR",
      shifts: [
        { day: 1, start: "9:00", end: "17:00", type: "morning" },
        { day: 3, start: "9:00", end: "17:00", type: "morning" },
      ],
    },
    {
      id: 5,
      name: "Robert Wilson",
      department: "Customer Service",
      shifts: [
        { day: 0, start: "22:00", end: "6:00", type: "night" },
        { day: 2, start: "22:00", end: "6:00", type: "night" },
        { day: 4, start: "22:00", end: "6:00", type: "night" },
      ],
    },
    {
      id: 6,
      name: "Jennifer Lee",
      department: "Sales",
      shifts: [
        { day: 1, start: "12:00", end: "20:00", type: "evening" },
        { day: 3, start: "12:00", end: "20:00", type: "evening" },
        { day: 5, start: "12:00", end: "20:00", type: "evening" },
      ],
    },
    {
      id: 7,
      name: "David Miller",
      department: "IT Support",
      shifts: [
        { day: 0, start: "9:00", end: "17:00", type: "morning" },
        { day: 4, start: "9:00", end: "17:00", type: "morning" },
      ],
    },
  ];

  // Department options
  const departments = [
    "All Departments",
    "Customer Service",
    "Sales",
    "IT Support",
    "HR",
  ];

  // Filter employees by department
  // const filteredEmployees =
  //   selectedDepartment === "All Departments"
  //     ? employees
  //     : employees.filter((emp) => emp.department === selectedDepartment);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Handle calendar date change
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setCurrentDate(newDate);
  };

  // Get shift type color
  const getShiftTypeColor = (type) => {
    switch (type) {
      case "morning":
        return "bg-primary bg-opacity-10 border-primary";
      case "evening":
        return "bg-purple bg-opacity-10 border-purple";
      case "night":
        return "bg-dark bg-opacity-10 border-dark";
      default:
        return "bg-secondary bg-opacity-10 border-secondary";
    }
  };

  // Check if employee has shift at specific day and time
  const hasShift = (employeeId, day, time) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return null;

    const shift = employee.shifts.find((s) => s.day === day);
    if (!shift) return null;

    const shiftStart = shift.start;
    const shiftEnd = shift.end;

    // Simple check if time is within shift hours
    if (time >= shiftStart && time < shiftEnd) {
      return shift.type;
    }

    return null;
  };

  // Initialize charts
  useEffect(() => {
    if (selectedEmployee) {
      // Hours allocation chart
      const hoursChart = echarts.init(document.getElementById("hours-chart"));
      const hoursOption = {
        animation: false,
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
          textStyle: {
            fontSize: 12,
          },
        },
        series: [
          {
            name: "Hours Allocation",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 24, name: "Morning Shifts" },
              { value: 16, name: "Evening Shifts" },
              { value: 8, name: "Night Shifts" },
              { value: 120, name: "Available Hours" },
            ],
          },
        ],
      };
      hoursChart.setOption(hoursOption);

      // Attendance chart
      const attendanceChart = echarts.init(
        document.getElementById("attendance-chart")
      );
      const attendanceOption = {
        animation: false,
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Scheduled", "Actual"],
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} hrs",
          },
        },
        series: [
          {
            name: "Scheduled",
            type: "line",
            data: [8, 8, 8, 8, 8, 0, 0],
            smooth: true,
          },
          {
            name: "Actual",
            type: "line",
            data: [7.5, 8.2, 8, 7.8, 8.3, 0, 0],
            smooth: true,
          },
        ],
      };
      attendanceChart.setOption(attendanceOption);

      // Handle resize
      window.addEventListener("resize", () => {
        hoursChart.resize();
        attendanceChart.resize();
      });

      return () => {
        hoursChart.dispose();
        attendanceChart.dispose();
        window.removeEventListener("resize", () => {
          hoursChart.resize();
          attendanceChart.resize();
        });
      };
    }
  }, [selectedEmployee]);

  // Format date for input
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Api For GetShift

  // Fetch all shifts from API on mount

  // ...existing code...


  // Get Api For Shift

  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("https://hrb5wx2v-8800.inc1.devtunnels.ms/api/shift/getAllShifts",
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       }
  //     )
  //     .then((res) => {
  //       if (res.data.status) {
  //         console.log("asda", res)
  //         const shiftData = res?.data?.data;

  //         // // Transform flat shift list to grouped by employee with shifts by day index
  //         // const employeesMap = {};

  //         // shiftData.forEach((shift) => {
  //         //   const shiftDayIndex = new Date(shift.shiftDate).getDay(); // 0 (Sun) to 6 (Sat)

  //         //   if (!employeesMap[shift.memberId]) {
  //         //     employeesMap[shift.memberId] = {
  //         //       id: shift.memberId,
  //         //       name: shift.fullName,
  //         //       department: "Unknown", // You can update this if you have department data
  //         //       shifts: [],
  //         //     };
  //         //   }

  //         //   employeesMap[shift.memberId].shifts.push({
  //         //     day: shiftDayIndex,
  //         //     start: shift.startTime,
  //         //     end: shift.endTime,
  //         //     type: shift.shiftType,
  //         //     notes: shift.notes,
  //         //     date: shift.shiftDate,
  //         //   });
  //         // });

  //         // setFilteredEmployees(Object.values(employeesMap));
  //         setFilteredEmployees(shiftData);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch shifts:", err);
  //     });
  // }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}shift/getAllShifts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          console.log("sss",res.data.data )
          const shiftData = res.data.data;

          // Group by unique (memberId + fullName) combo
          const employeesMap = {};

          shiftData.forEach((shift) => {
            const shiftDayIndex = new Date(shift.shiftDate).getDay(); // 0 = Sunday

            const key = `${shift.memberId}-${shift.fullName}`;

            if (!employeesMap[key]) {
              employeesMap[key] = {
                memberId: shift.memberId,
                fullName: shift.fullName,
                shifts: [],
              };
            }

            employeesMap[key].shifts.push({
              day: shiftDayIndex,
              start: shift.startTime,
              end: shift.endTime,
              type: shift.shiftType,
              notes: shift.notes,
              date: shift.shiftDate,
            });
          });

          setFilteredEmployees(Object.values(employeesMap));
        }
      })

      .catch((err) => {
        console.error("Failed to fetch shifts:", err);
      });
  }, []);


  useEffect(() => {
    if (filteredEmployees) {
      console.log(filteredEmployees);
    }

  }, [filteredEmployees])


  return (
    <div>
      <div className="container-fluid bg-main">
        {/* Header */}
        <header className="bg-card shadow-sm py-4">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">Shift Allocation</h1>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddShiftModal(true)}
                >
                  <i className="fas fa-plus me-2"></i> Add New Shift
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container " style={{ left: "280px" }}>
          {/* Controls */}
          <div className="card mb-4">
            <div className="card-body bg-card">
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={goToPreviousWeek}
                  >
                    <i className="fas fa-chevron-left me-2"></i> Previous Week
                  </button>

                  <div>
                    <input
                      type="date"
                      className="form-control"
                      value={formatDateForInput(currentDate)}
                      onChange={handleDateChange}
                    />
                  </div>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={goToNextWeek}
                  >
                    Next Week <i className="fas fa-chevron-right ms-2"></i>
                  </button>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div>
                    <select
                      className="form-select "
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button className="btn btn-outline-secondary">
                      <i className="fas fa-copy me-2"></i> Copy Previous Week
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="">
            {/* Main Schedule */}
            <div
              className={`card table-gradient-bg ${showEmployeePanel ? "me-3" : ""
                }`}
            >
              <div className="table-responsive ">
                <table className="table">
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
                      <th scope="col" className="w-25 sticky-start bg-white">
                        Employee
                      </th>
                      {weekDates.map((date, index) => (
                        <th key={index} className="text-center min-w-150">
                          <div className="fw-bold">{formatDay(date)}</div>
                          <div>{formatDate(date)}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees?.map((employee) => (
                      <tr key={employee.memberId} className="text-center">
                        {/* Employee Name Cell */}
                        <td className="sticky-start bg-white border-end text-start">
                          {employee.fullName}
                        </td>

                        {/* Loop through days of week (0 = Sunday to 6 = Saturday) */}
                        {weekDates.map((_, dayIndex) => (
                          <td
                            key={dayIndex}
                            className="position-relative align-top"
                            style={{ minHeight: "80px" }}
                          >
                            {/* Render all shifts for this day */}
                            {employee.shifts
                              .filter((shift) => shift.day === dayIndex)
                              .map((shift, idx) => (
                                <div
                                  key={idx}
                                  className={`border-start border-3 px-2 py-1 mb-1 rounded ${getShiftTypeColor(
                                    shift.type
                                  )}`}
                                >
                                  <div className="fw-medium">
                                    {shift.start} - {shift.end}
                                  </div>
                                  <div className="small">
                                    {shift.type.charAt(0).toUpperCase() + shift.type.slice(1)} Shift
                                  </div>
                                  {shift.notes && (
                                    <div className="text-white-500 small fst-italic">{shift.notes}</div>
                                  )}
                                </div>
                              ))}

                            {/* Add Shift Button */}
                            <button
                              className="position-absolute bottom-0 end-0 text-primary btn btn-sm"
                              onClick={() => handleAddShift(employee.memberId, dayIndex)}
                            >
                              <i className="fas fa-plus-circle"></i>
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

            {/* Employee Details Panel */}
            {showEmployeePanel && selectedEmployee && (
              <div className="card" style={{ width: "24rem" }}>
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{selectedEmployee}</h5>
                    <button
                      className="btn btn-sm text-muted"
                      onClick={() => setShowEmployeePanel(false)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div
                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "64px",
                        height: "64px",
                        fontSize: "1.25rem",
                      }}
                    >
                      {selectedEmployee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="fw-medium">
                        {
                          employees.find((e) => e.name === selectedEmployee)
                            ?.department
                        }
                      </div>
                      <div className="mt-1">
                        <span className="badge bg-success">
                          <span
                            className="d-inline-block rounded-circle bg-white me-1"
                            style={{ width: "8px", height: "8px" }}
                          ></span>
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-muted mb-2">Hours Allocation</h6>
                    <div id="hours-chart" style={{ height: "200px" }}></div>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-muted mb-2">Attendance History</h6>
                    <div
                      id="attendance-chart"
                      style={{ height: "200px" }}
                    ></div>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-muted mb-2">Upcoming Shifts</h6>
                    <div className="d-flex flex-column gap-2">
                      {employees
                        .find((e) => e.name === selectedEmployee)
                        ?.shifts.map((shift, idx) => {
                          const date = new Date(weekDates[shift.day]);
                          return (
                            <div
                              key={idx}
                              className={`border-start border-3 px-3 py-2 rounded ${getShiftTypeColor(
                                shift.type
                              )}`}
                            >
                              <div className="fw-medium">
                                {formatDay(date)}, {formatDate(date)}
                              </div>
                              <div>
                                {shift.start} - {shift.end}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div>
                    <h6 className="text-muted mb-2">Preferences</h6>
                    <div className="bg-light p-3 rounded">
                      <div className="small">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Preferred hours:</span>
                          <span className="fw-medium">Morning</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>Max hours per week:</span>
                          <span className="fw-medium">40</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Unavailable days:</span>
                          <span className="fw-medium">Sunday</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-light">
                  <button className="w-100 btn btn-primary">
                    <i className="fas fa-edit me-2"></i> Edit Schedule
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 d-flex justify-content-end gap-3">
            <button className="btn btn-outline-secondary">
              <i className="fas fa-print me-2"></i> Print Schedule
            </button>
            <button className="btn btn-outline-secondary">
              <i className="fas fa-file-export me-2"></i> Export
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-save me-2"></i> Save Changes
            </button>
            <button className="btn btn-success">
              <i className="fas fa-paper-plane me-2"></i> Publish Schedule
            </button>
          </div>
        </div>

        {/* Add Shift Modal */}
        {showAddShiftModal && (
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg custom-modal-dark">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Shift</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddShiftModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="memberId" className="form-label">
                      Employee
                    </label>
                    <select
                      id="memberId"
                      name="memberId"
                      className="form-select"
                      value={formData.memberId}
                      onChange={handleChange}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="shiftDate" className="form-label">
                      Date
                    </label>
                    <input
                      type="date"
                      id="shiftDate"
                      name="shiftDate"
                      className="form-control"
                      value={formData.shiftDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col">
                      <label htmlFor="startTime" className="form-label">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        className="form-control"
                        value={formData.startTime}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col">
                      <label htmlFor="endTime" className="form-label">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        className="form-control"
                        value={formData.endTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="shiftType" className="form-label">
                      Shift Type
                    </label>
                    <select
                      id="shiftType"
                      name="shiftType"
                      className="form-select"
                      value={formData.shiftType}
                      onChange={handleChange}
                    >
                      <option value="Full Day">Full Day</option>
                      <option value="Half Day">Half Day</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="form-control"
                      placeholder="Add any additional information..."
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddShiftModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    Add Shift
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftAllocation;