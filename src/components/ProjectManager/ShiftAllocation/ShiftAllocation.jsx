import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import axios from "axios";
import BASE_URL from "../../../config";

const ShiftAllocation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeePanel, setShowEmployeePanel] = useState(false);
  const [employee, setEmployees] = useState();
  const token = localStorage.getItem("authToken");
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentShiftId, setCurrentShiftId] = useState(null);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatTime12Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes} ${suffix}`;
  };

  const handleSubmit = async () => {
    if (!formData.memberId) {
      alert("Please select an employee");
      return;
    }
    if (!formData.shiftDate) {
      alert("Please select a date");
      return;
    }

    const payload = {
      memberId: parseInt(formData.memberId),
      shiftDate: formData.shiftDate,
      startTime: formatTime12Hour(formData.startTime),
      endTime: formatTime12Hour(formData.endTime),
      shiftType: formData.shiftType,
      notes: formData.notes,
    };

    try {
      let response;
      if (isEditMode) {
        response = await axios.patch(
          `${BASE_URL}shift/updateShift/${currentShiftId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}shift/createShift`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.status) {
        fetchShifts(); // Refresh shift data
        setShowAddShiftModal(false);
        resetForm();
      } else {
        alert(response.data.message || "Error processing shift");
      }
    } catch (error) {
      console.error(
        "Shift operation failed:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Error processing shift. Please try again."
      );
    }
  };

  const resetForm = () => {
    setFormData({
      memberId: "",
      shiftDate: "",
      startTime: "",
      endTime: "",
      shiftType: "Half Day",
      notes: "",
    });
    setIsEditMode(false);
    setCurrentShiftId(null);
  };

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

  // Department options
  const departments = [
    "All Departments",
    "Customer Service",
    "Sales",
    "IT Support",
    "HR",
  ];

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

  // Format date for input
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [allShifts, setAllShifts] = useState([]);

  const fetchShifts = () => {
    axios
      .get(`${BASE_URL}shift/getAllShifts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          setAllShifts(res.data.data); // Store all shifts
          updateFilteredEmployees(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch shifts:", err);
      });
  };

  // Update filtered employees based on current week
  const updateFilteredEmployees = (shiftData) => {
    const weekStart = new Date(weekDates[0]);
    const weekEnd = new Date(weekDates[6]);
    weekEnd.setHours(23, 59, 59, 999);

    // Filter shifts for the current week
    const shiftsForWeek = shiftData.filter(shift => {
      const shiftDate = new Date(shift.shiftDate);
      return shiftDate >= weekStart && shiftDate <= weekEnd;
    });

    // Group by unique (memberId + fullName) combo
    const employeesMap = {};

    shiftsForWeek.forEach((shift) => {
      const shiftDate = new Date(shift.shiftDate);
      const shiftDayIndex = shiftDate.getDay(); // 0 = Sunday

      const key = `${shift.memberId}-${shift.fullName}`;

      if (!employeesMap[key]) {
        employeesMap[key] = {
          memberId: shift.memberId,
          fullName: shift.fullName,
          shifts: [],
        };
      }

      employeesMap[key].shifts.push({
        id: shift.id,
        day: shiftDayIndex,
        start: shift.startTime,
        end: shift.endTime,
        type: shift.shiftType,
        notes: shift.notes,
        date: shift.shiftDate,
      });
    });

    setFilteredEmployees(Object.values(employeesMap));
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // Update shifts when week changes
  useEffect(() => {
    if (allShifts.length > 0) {
      updateFilteredEmployees(allShifts);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchMember();
  }, []);

  const [member, setmember] = useState();

  const fetchMember = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}member/getAllMembers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setmember(response.data.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleAddShift = (memberId, dayIndex) => {
    const selectedEmployee = filteredEmployees.find(emp => emp.memberId === memberId);
    if (!selectedEmployee) return;

    const selectedDate = weekDates[dayIndex];
    
    setFormData({
      memberId: memberId.toString(),
      shiftDate: formatDateForInput(selectedDate),
      startTime: "",
      endTime: "",
      shiftType: "Half Day",
      notes: "",
    });
    
    setIsEditMode(false);
    setShowAddShiftModal(true);
  };

  const handleEditShift = (shift) => {
    const convertTo24Hour = (time12) => {
      if (!time12) return "";
      const [time, modifier] = time12.split(" ");
      let [hours, minutes] = time.split(":");
      
      if (hours === "12") {
        hours = "00";
      }
      
      if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }
      
      return `${hours}:${minutes}`;
    };

    setFormData({
      memberId: shift.memberId.toString(),
      shiftDate: shift.date,
      startTime: convertTo24Hour(shift.start),
      endTime: convertTo24Hour(shift.end),
      shiftType: shift.type,
      notes: shift.notes || "",
    });

    setCurrentShiftId(shift.id);
    setIsEditMode(true);
    setShowAddShiftModal(true);
  };

  const handleRemoveShift = async (shiftId) => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}shift/deleteShift/${shiftId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        fetchShifts();
      } else {
        alert(response.data.message || "Error deleting shift");
      }
    } catch (error) {
      console.error(
        "Shift deletion failed:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Error deleting shift. Please try again."
      );
    }
  };

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
                  onClick={() => {
                    resetForm();
                    setShowAddShiftModal(true);
                  }}
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
              className={`card table-gradient-bg ${
                showEmployeePanel ? "me-3" : ""
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
                                  onClick={() => handleEditShift({
                                    ...shift,
                                    memberId: employee.memberId
                                  })}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="fw-medium">
                                    {shift.start} - {shift.end}
                                  </div>
                                  <div className="small">
                                    {shift.type.charAt(0).toUpperCase() +
                                      shift.type.slice(1)}{" "}
                                    Shift
                                  </div>
                                  {shift.notes && (
                                    <div className="text-white-500 small fst-italic">
                                      {shift.notes}
                                    </div>
                                  )}
                                </div>
                              ))}

                            {/* Add/Remove Shift Buttons */}
                            <div
                              className="d-flex justify-content-between position-relative"
                              style={{ height: "40px" }}
                            >
                              {/* Minus Button - Bottom Left */}
                              {employee.shifts.some(shift => shift.day === dayIndex) && (
                                <button
                                  className="position-absolute bottom-0 start-0 text-danger btn btn-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const shift = employee.shifts.find(s => s.day === dayIndex);
                                    if (shift) {
                                      handleRemoveShift(shift.id);
                                    }
                                  }}
                                >
                                  <i className="fas fa-minus-circle"></i>
                                </button>
                              )}

                              {/* Plus Button - Bottom Right */}
                              <button
                                className="position-absolute bottom-0 end-0 text-success btn btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddShift(employee.memberId, dayIndex);
                                }}
                              >
                                <i className="fas fa-plus-circle"></i>
                              </button>
                            </div>
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

        {/* Add/Edit Shift Modal */}
        {showAddShiftModal && (
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg custom-modal-dark">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditMode ? "Edit Shift" : "Add New Shift"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowAddShiftModal(false);
                      resetForm();
                    }}
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
                      required
                      disabled={isEditMode}
                    >
                      <option value="">Select Employee</option>
                      {member?.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.fullName}
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
                      required
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
                        required
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
                        required
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
                    onClick={() => {
                      setShowAddShiftModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    {isEditMode ? "Update Shift" : "Add Shift"}
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