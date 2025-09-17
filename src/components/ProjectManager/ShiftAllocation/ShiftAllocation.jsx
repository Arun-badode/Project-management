// import React, { useState, useEffect } from "react";
// import * as echarts from "echarts";
// import axios from "axios";
// import BASE_URL from "../../../config";
// import ShiftLegend from "./ShiftLegend";

// const ShiftAllocation = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDepartment, setSelectedDepartment] = useState("All Team");
//   const [showAddShiftModal, setShowAddShiftModal] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [showEmployeePanel, setShowEmployeePanel] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const token = localStorage.getItem("authToken");
//   const [selectedDayIndex, setSelectedDayIndex] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentShiftId, setCurrentShiftId] = useState(null);
//   const [showOthersOptions, setShowOthersOptions] = useState(false);
//   const [selectedOthersOption, setSelectedOthersOption] = useState("");
//   const [permissionDuration, setPermissionDuration] = useState("");
//   const [permissionTiming, setPermissionTiming] = useState("");
//   const [leaveType, setLeaveType] = useState("");

//   const [formData, setFormData] = useState({
//     memberId: "",
//     shiftDate: "",
//     startTime: "",
//     endTime: "",
//     shiftType: "Half Day",
//     notes: "",
//   });

//   // it is shift mapping for the shifts
//   const shiftMappings = {
//     α: { start: "11:30", end: "20:30" },   // 11:30 AM – 8:30 PM
//     β: { start: "13:00", end: "22:00" },   // 1:00 PM – 10:00 PM
//     γ: { start: "14:30", end: "23:30" },   // 2:30 PM – 11:30 PM
//     δ: { start: "18:30", end: "03:30" },   // 6:30 PM – 3:30 AM
//     WO: { start: "", end: "" },            // Week Off → no time
//     Holiday: { start: "", end: "" },       // Holiday → no time
//   };

//   const getShiftLabel = (start, end, type, otherType) => {
//     const shiftLabels = {
//       "11:30 AM - 8:30 PM": { symbol: "α", bg: "#aef1f8" },
//       "1:00 PM - 10:00 PM": { symbol: "β", bg: "#b7f280" },
//       "2:30 PM - 11:30 PM": { symbol: "γ", bg: "#d9c8f3" },
//       "6:30 PM - 3:30 AM": { symbol: "δ", bg: "#f7d4b5" },
//       "WO": { symbol: "WO", bg: "#ffd966" },
//       "Holiday": { symbol: "Holiday", bg: "#93c47d" },
//       "Permission": { symbol: "Permission", bg: "#cfe2f3" },
//       "Leave": { symbol: "Leave", bg: "#f9cb9c" },
//       "Absent": { symbol: "Absent", bg: "#ea9999" },
//     };

//     // Handle special cases for otherType
//     if (type === "Others" && otherType) {
//       const label = shiftLabels[otherType];
//       return label ? (
//         <span
//           style={{
//             backgroundColor: label.bg,
//             fontWeight: "bold",
//             padding: "2px 8px",
//             borderRadius: "4px",
//             display: "inline-block",
//             color: "black",
//           }}
//         >
//           {label.symbol}
//         </span>
//       ) : null;
//     }

//     const formattedTime = `${start} - ${end}`;
//     const label = shiftLabels[formattedTime] || shiftLabels[type] || null;

//     return label ? (
//       <span
//         style={{
//           backgroundColor: label.bg,
//           fontWeight: "bold",
//           padding: "2px 8px",
//           borderRadius: "4px",
//           display: "inline-block",
//           color: "black",
//         }}
//       >
//         {label.symbol}
//       </span>
//     ) : null;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const formatTime12Hour = (time) => {
//     if (!time) return "";
//     const [hours, minutes] = time.split(":");
//     const suffix = hours >= 12 ? "PM" : "AM";
//     const hours12 = hours % 12 || 12;
//     return `${hours12}:${minutes} ${suffix}`;
//   };

//   const handleSubmit = async () => {
//     if (!formData.memberId) {
//       alert("Please select an employee");
//       return;
//     }
//     if (!formData.shiftDate) {
//       alert("Please select a date");
//       return;
//     }

//     let payload = {
//       memberId: parseInt(formData.memberId),
//       shiftDate: formData.shiftDate,
//     };

//     // Handle regular shift options
//     if (!showOthersOptions) {
//       payload.startTime = formatTime12Hour(formData.startTime);
//       payload.endTime = formatTime12Hour(formData.endTime);
//       payload.shiftType = formData.shiftType;
//       payload.notes = formData.notes;
//     } 
//     // Handle Others options
//     else {
//       payload.shiftType = "Others";
//       payload.otherType = selectedOthersOption;
      
//       if (selectedOthersOption === "Permission") {
//         payload.duration = permissionDuration;
//         payload.permissionApply = permissionTiming;
//         payload.notes = formData.notes || `Permission: ${permissionDuration} at ${permissionTiming}`;
//       } else if (selectedOthersOption === "Leave") {
//         payload.duration = leaveType;
//         payload.notes = formData.notes || `Leave Type: ${leaveType}`;
//       } else if (selectedOthersOption === "Absent") {
//         payload.notes = formData.notes || "Unapproved/Uninformed Leave";
//       }
//     }

//     try {
//       let response;
//       if (isEditMode) {
//         response = await axios.patch(
//           `${BASE_URL}shift/updateShift/${currentShiftId}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } else {
//         response = await axios.post(
//           `${BASE_URL}shift/createShift`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       }

//       if (response.data.status) {
//         fetchShifts(); // Refresh shift data
//         setShowAddShiftModal(false);
//         resetForm();
//         setShowOthersOptions(false);
//         setSelectedOthersOption("");
//       } else {
//         alert(response.data.message || "Error processing shift");
//       }
//     } catch (error) {
//       console.error(
//         "Shift operation failed:",
//         error.response?.data || error.message
//       );
//       alert(
//         error.response?.data?.message ||
//         "Error processing shift. Please try again."
//       );
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       memberId: "",
//       shiftDate: "",
//       startTime: "",
//       endTime: "",
//       shiftType: "Half Day",
//       notes: "",
//     });
//     setIsEditMode(false);
//     setCurrentShiftId(null);
//     setShowOthersOptions(false);
//     setSelectedOthersOption("");
//     setPermissionDuration("");
//     setPermissionTiming("");
//     setLeaveType("");
//   };

//   // Get week dates based on current date
//   const getWeekDates = () => {
//     const dates = [];
//     const startOfWeek = new Date(currentDate);
//     const day = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
//     const mondayOffset = day === 0 ? -6 : 1 - day;

//     startOfWeek.setDate(currentDate.getDate() + mondayOffset);

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + i);
//       dates.push(date);
//     }

//     return dates;
//   };

//   const weekDates = getWeekDates();

//   // Format date for display
//   const formatDate = (date) => {
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//   };

//   // Format day for display
//   const formatDay = (date) => {
//     return date.toLocaleDateString("en-US", { weekday: "short" });
//   };

//   // Department options - Updated to match requirements
//   const departments = [
//     "All Team",
//     "Adobe",
//     "MS Office",
//     "QA",
//   ];

//   // Navigate to previous week
//   const goToPreviousWeek = () => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(currentDate.getDate() - 7);
//     setCurrentDate(newDate);
//   };

//   // Navigate to next week
//   const goToNextWeek = () => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(currentDate.getDate() + 7);
//     setCurrentDate(newDate);
//   };

//   // Handle calendar date change
//   const handleDateChange = (e) => {
//     const newDate = new Date(e.target.value);
//     setCurrentDate(newDate);
//   };

//   // Get shift type color
//   const getShiftTypeColor = (type, otherType) => {
//     if (type === "Others" && otherType) {
//       switch (otherType) {
//         case "Permission":
//           return "bg-info bg-opacity-10 border-info";
//         case "Leave":
//           return "bg-warning bg-opacity-10 border-warning";
//         case "Absent":
//           return "bg-danger bg-opacity-10 border-danger";
//         default:
//           return "bg-secondary bg-opacity-10 border-secondary";
//       }
//     }
    
//     switch (type) {
//       case "morning":
//         return "bg-primary bg-opacity-10 border-primary";
//       case "evening":
//         return "bg-purple bg-opacity-10 border-purple";
//       case "night":
//         return "bg-dark bg-opacity-10 border-dark";
//       case "Permission":
//         return "bg-info bg-opacity-10 border-info";
//       case "Leave":
//         return "bg-warning bg-opacity-10 border-warning";
//       case "Absent":
//         return "bg-danger bg-opacity-10 border-danger";
//       default:
//         return "bg-secondary bg-opacity-10 border-secondary";
//     }
//   };

//   const formatDateRange = (date) => {
//     const startOfWeek = new Date(date);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

//     const format = (d) => {
//       const day = String(d.getDate()).padStart(2, "0");
//       const month = String(d.getMonth() + 1).padStart(2, "0");
//       const year = d.getFullYear();
//       return `${day}-${month}-${year}`;
//     };

//     return `${format(startOfWeek)} - ${format(endOfWeek)}`;
//   };

//   // Format date for input
//   const formatDateForInput = (date) => {
//     return date.toISOString().split("T")[0];
//   };

//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [allShifts, setAllShifts] = useState([]);

//   const fetchShifts = () => {
//     axios
//       .get(`${BASE_URL}shift/getAllShifts`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         if (res.data.status) {
//           console.log("Fetched shifts:", res.data.data);
//           setAllShifts(res.data.data); // Store all shifts
//           if (employees.length > 0) {
//             updateFilteredEmployees(res.data.data, employees);
//           }
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to fetch shifts:", err);
//       });
//   };

//   // Update filtered employees based on current week
//   const updateFilteredEmployees = (shiftData, members) => {
//     const weekStart = new Date(weekDates[0]);
//     weekStart.setHours(0, 0, 0, 0);
//     const weekEnd = new Date(weekDates[6]);
//     weekEnd.setHours(23, 59, 59, 999);

//     // Build a Map for faster member lookups
//     const memberMap = new Map();
//     if (members) {
//       members.forEach(member => {
//         memberMap.set(member.id, member);
//       });
//     }

//     const employeesMap = {};

//     // First, add all team members
//     if (members) {
//       members.forEach(member => {
//         // Exclude managers if needed
//         if (member.role === "Manager") return;
        
//         const key = `${member.id}-${member.fullName}`;
//         employeesMap[key] = {
//           memberId: member.id,
//           empId: member.empId || "N/A",
//           team: member.team || "N/A",
//           fullName: member.fullName || "Unknown",
//           designation: member.designation || "N/A",
//           shifts: [],
//         };
//       });
//     }

//     // Then add shifts for those employees
//     shiftData.forEach((shift) => {
//       const memberInfo = memberMap.get(shift.memberId);
      
//       // Skip if member is a manager
//       if (memberInfo && memberInfo.role === "Manager") return;

//       const shiftDate = new Date(shift.shiftDate);
//       shiftDate.setHours(0, 0, 0, 0);
      
//       // Check if shift is within the current week
//       if (shiftDate >= weekStart && shiftDate <= weekEnd) {
//         const shiftDayIndex = shiftDate.getDay();
        
//         const key = `${shift.memberId}-${shift.fullName}`;

//         if (!employeesMap[key]) {
//           employeesMap[key] = {
//             memberId: shift.memberId,
//             empId: memberInfo?.empId || "N/A",
//             team: memberInfo?.team || "N/A",
//             fullName: shift.fullName || memberInfo?.fullName || "Unknown",
//             designation: memberInfo?.designation || "N/A",
//             shifts: [],
//           };
//         }

//         employeesMap[key].shifts.push({
//           id: shift.id,
//           day: shiftDayIndex,
//           start: shift.startTime || "",
//           end: shift.endTime || "",
//           type: shift.shiftType,
//           notes: shift.notes,
//           date: shift.shiftDate,
//           otherType: shift.otherType,
//         });
//       }
//     });

//     setFilteredEmployees(Object.values(employeesMap));
//     console.log("Filtered employees:", Object.values(employeesMap));
//   };

//   useEffect(() => {
//     fetchShifts();
//   }, []);

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   const fetchMembers = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${BASE_URL}member/getAllMembers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });

//       if (response.data.status) {
//         setEmployees(response.data.data);
//         if (allShifts.length > 0) {
//           updateFilteredEmployees(allShifts, response.data.data);
//         }
//       }

//     } catch (error) {
//       console.error("Error fetching members:", error);
//     }
//   };

//   const handleAddShift = (memberId, dayIndex) => {
//     const selectedEmployee = filteredEmployees.find(emp => emp.memberId === memberId);
//     if (!selectedEmployee) return;

//     const selectedDate = weekDates[dayIndex];

//     setFormData({
//       memberId: memberId.toString(),
//       shiftDate: formatDateForInput(selectedDate),
//       startTime: "",
//       endTime: "",
//       shiftType: "Half Day",
//       notes: "",
//     });

//     setSelectedDayIndex(dayIndex);
//     setIsEditMode(false);
//     setShowAddShiftModal(true);
//     setShowOthersOptions(false);
//     setSelectedOthersOption("");
//   };

//   const handleEditShift = (shift) => {
//     const convertTo24Hour = (time12) => {
//       if (!time12) return "";
//       const [time, modifier] = time12.split(" ");
//       let [hours, minutes] = time.split(":");

//       if (hours === "12") {
//         hours = "00";
//       }

//       if (modifier === "PM") {
//         hours = parseInt(hours, 10) + 12;
//       }

//       return `${hours}:${minutes}`;
//     };

//     // Check if this is an "Others" type shift
//     const isOthersType = shift.type === "Others" || 
//                         shift.otherType === "Permission" || 
//                         shift.otherType === "Leave" || 
//                         shift.otherType === "Absent";

//     setFormData({
//       memberId: shift.memberId.toString(),
//       shiftDate: shift.date,
//       startTime: isOthersType ? "" : convertTo24Hour(shift.start),
//       endTime: isOthersType ? "" : convertTo24Hour(shift.end),
//       shiftType: isOthersType ? "Others" : shift.type,
//       notes: shift.notes || "",
//     });

//     setCurrentShiftId(shift.id);
//     setIsEditMode(true);
//     setShowAddShiftModal(true);
    
//     // Set Others options if applicable
//     if (isOthersType) {
//       setShowOthersOptions(true);
//       if (shift.otherType === "Permission") {
//         setSelectedOthersOption("Permission");
//         setPermissionDuration(shift.duration || "");
//         setPermissionTiming(shift.permissionApply || "");
//       } else if (shift.otherType === "Leave") {
//         setSelectedOthersOption("Leave");
//         setLeaveType(shift.duration || "");
//       } else if (shift.otherType === "Absent") {
//         setSelectedOthersOption("Absent");
//       }
//     } else {
//       setShowOthersOptions(false);
//       setSelectedOthersOption("");
//     }
//   };

//   useEffect(() => {
//     if (allShifts.length > 0 && employees.length > 0) {
//       updateFilteredEmployees(allShifts, employees);
//     }
//   }, [currentDate, allShifts, employees]);

//   const handleRemoveShift = async (shiftId) => {
//     if (!window.confirm("Are you sure you want to delete this shift?")) return;

//     try {
//       const response = await axios.delete(
//         `${BASE_URL}shift/deleteShift/${shiftId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.status) {
//         fetchShifts();
//       } else {
//         alert(response.data.message || "Error deleting shift");
//       }
//     } catch (error) {
//       console.error(
//         "Shift deletion failed:",
//         error.response?.data || error.message
//       );
//       alert(
//         error.response?.data?.message ||
//         "Error deleting shift. Please try again."
//       );
//     }
//   };

//   const handleOthersOptionChange = (option) => {
//     setSelectedOthersOption(option);
//     if (option) {
//       // Clear shift data when Others option is selected
//       setFormData(prev => ({
//         ...prev,
//         startTime: "",
//         endTime: "",
//       }));
//     }
//   };

//   return (
//     <div>
//       <div className="container-fluid bg-main">
//         {/* Header */}
//         <header className="bg-card shadow-sm py-4">
//           <div className="container">
//             <div className="d-flex justify-content-between align-items-center">
//               <h1 className="h3 mb-0">Shift Allocation</h1>
//               <div className="d-flex gap-3">
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => {
//                     resetForm();
//                     setShowAddShiftModal(true);
//                   }}
//                 >
//                   <i className="fas fa-plus me-2"></i> Add New Shift
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <div className="container " style={{ left: "280px" }}>
//           {/* Controls */}
//           <div className="card mb-4">
//             <div className="card-body bg-card">
//               <div className="d-flex flex-wrap justify-content-between align-items-center">
//                 <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
//                   <button
//                     className="btn btn-outline-secondary"
//                     onClick={goToPreviousWeek}
//                   >
//                     <i className="fas fa-chevron-left me-2"></i> Previous Week
//                   </button>

//                   <div
//                     className="form-control d-flex justify-content-between align-items-center"
//                     style={{ minWidth: "230px", fontWeight: "bold", backgroundColor: "white" }}
//                   >
//                     {formatDateRange(currentDate)}
//                     <i className="fas fa-calendar-alt text-muted ms-2"></i>
//                   </div>

//                   <button
//                     className="btn btn-outline-secondary"
//                     onClick={goToNextWeek}
//                   >
//                     Next Week <i className="fas fa-chevron-right ms-2"></i>
//                   </button>
//                 </div>

//                 <div className="d-flex align-items-center gap-3">
//                   <div>
//                     <select
//                       className="form-select "
//                       value={selectedDepartment}
//                       onChange={(e) => setSelectedDepartment(e.target.value)}
//                     >
//                       {departments.map((dept) => (
//                         <option key={dept} value={dept}>
//                           {dept}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <button className="btn btn-outline-secondary">
//                       <i className="fas fa-copy me-2"></i> Copy Previous Week
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Schedule Grid */}
//           <div className="">
//             {/* Main Schedule */}
//             <div
//               className={`card table-gradient-bg ${showEmployeePanel ? "me-3" : ""
//                 }`}
//             >
//               <div className="table-responsive ">
//                 <table className="table">
//                   <thead
//                     className="table-gradient-bg table"
//                     style={{
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 0,
//                       backgroundColor: "#0b1a3c", // Changed to match background
//                     }}
//                   >
//                     <tr className="text-center">
//                       <th scope="col" className="w-25 sticky-start" style={{ backgroundColor: "#0b1a3c" }}>
//                         Employee
//                       </th>
//                       {weekDates.map((date, index) => (
//                         <th key={index} className="text-center min-w-150" style={{ backgroundColor: "#0b1a3c" }}>
//                           <div className="fw-bold">{formatDay(date)}</div>
//                           <div>{formatDate(date)}</div>
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredEmployees?.map((employee) => (
//                       <tr key={employee.memberId} className="text-center">
//                         {/* Employee Name Cell */}
//                         <td className="sticky-start bg-white border-end text-start p-2" style={{ backgroundColor: "#0b1a3c", color: "white" }}>
//                           {/* Employee ID */}
//                           <div
//                             style={{
//                               fontSize: "0.7rem",
//                               backgroundColor: "#00d2ff",
//                               color: "#000",
//                               padding: "2px 6px",
//                               borderRadius: "4px",
//                               display: "inline-block",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {employee.empId}
//                           </div>

//                           {/* Name */}
//                           <div style={{ fontWeight: "bold", fontSize: "1rem", marginTop: "4px" }}>
//                             {employee.fullName}
//                           </div>

//                           {/* Team Badge */}
//                           <div
//                             style={{
//                               background: "linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)",
//                               color: "#000",
//                               padding: "2px 8px",
//                               borderRadius: "12px",
//                               fontSize: "0.75rem",
//                               display: "inline-block",
//                               marginTop: "2px",
//                               fontWeight: "500",
//                             }}
//                           >
//                             {employee.team}
//                           </div>

//                           {/* Designation */}
//                           <div style={{ fontSize: "0.85rem", marginTop: "4px", fontWeight: "500" }}>
//                             {employee.designation}
//                           </div>
//                         </td>

//                         {/* Loop through days of week (0 = Sunday to 6 = Saturday) */}
//                         {weekDates.map((date, dayIndex) => (
//                           <td key={dayIndex} className="position-relative align-top" style={{ minHeight: "80px" }}>
//                             {dayIndex === 0 ? (
//                               // Sunday → Always Holiday
//                               <div className="text-center">
//                                 {getShiftLabel("", "", "Holiday")}
//                               </div>
//                             ) : (
//                               <>
//                                 {/* Render shifts */}
//                                 {employee.shifts
//                                   .filter((shift) => {
//                                     const shiftDate = new Date(shift.date);
//                                     return shiftDate.getDay() === dayIndex;
//                                   })
//                                   .map((shift, idx) => (
//                                     <div
//                                       key={idx}
//                                       className={`border-start border-3 px-2 py-1 mb-1 rounded ${getShiftTypeColor(shift.type, shift.otherType)}`}
//                                       onClick={() => handleEditShift({ ...shift, memberId: employee.memberId })}
//                                       style={{ cursor: "pointer" }}
//                                     >
//                                       <div className="fw-medium d-flex justify-content-center">
//                                         {getShiftLabel(shift.start, shift.end, shift.type, shift.otherType)}
//                                       </div>
//                                     </div>
//                                   ))}

//                                 {/* Add/Remove buttons */}
//                                 <div className="d-flex justify-content-between position-relative" style={{ height: "40px" }}>
//                                   {employee.shifts.some(shift => {
//                                     const shiftDate = new Date(shift.date);
//                                     return shiftDate.getDay() === dayIndex;
//                                   }) && (
//                                     <button
//                                       className="position-absolute bottom-0 start-0 text-danger btn btn-sm"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         const shift = employee.shifts.find(s => {
//                                           const shiftDate = new Date(s.date);
//                                           return shiftDate.getDay() === dayIndex;
//                                         });
//                                         if (shift) handleRemoveShift(shift.id);
//                                       }}
//                                     >
//                                       <i className="fas fa-minus-circle"></i>
//                                     </button>
//                                   )}
//                                   <button
//                                     className="position-absolute bottom-0 end-0 text-success btn btn-sm"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleAddShift(employee.memberId, dayIndex);
//                                     }}
//                                   >
//                                     <i className="fas fa-plus-circle"></i>
//                                   </button>
//                                 </div>
//                               </>
//                             )}
//                           </td>
//                         ))}

//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Employee Details Panel */}
//             {showEmployeePanel && selectedEmployee && (
//               <div className="card" style={{ width: "24rem" }}>
//                 <div className="card-header">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <h5 className="mb-0">{selectedEmployee}</h5>
//                     <button
//                       className="btn btn-sm text-muted"
//                       onClick={() => setShowEmployeePanel(false)}
//                     >
//                       <i className="fas fa-times"></i>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="card-body">
//                   <div className="d-flex align-items-center mb-4">
//                     <div
//                       className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
//                       style={{
//                         width: "64px",
//                         height: "64px",
//                         fontSize: "1.25rem",
//                       }}
//                     >
//                       {selectedEmployee
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </div>
//                     <div>
//                       <div className="fw-medium">
//                         {
//                           employees.find((e) => e.name === selectedEmployee)
//                             ?.department
//                         }
//                       </div>
//                       <div className="mt-1">
//                         <span className="badge bg-success">
//                           <span
//                             className="d-inline-block rounded-circle bg-white me-1"
//                             style={{ width: "8px", height: "8px" }}
//                           ></span>
//                           Available
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <h6 className="text-muted mb-2">Hours Allocation</h6>
//                     <div id="hours-chart" style={{ height: "200px" }}></div>
//                   </div>

//                   <div className="mb-4">
//                     <h6 className="text-muted mb-2">Attendance History</h6>
//                     <div
//                       id="attendance-chart"
//                       style={{ height: "200px" }}
//                     ></div>
//                   </div>

//                   <div className="mb-4">
//                     <h6 className="text-muted mb-2">Upcoming Shifts</h6>
//                     <div className="d-flex flex-column gap-2">
//                       {employees
//                         .find((e) => e.name === selectedEmployee)
//                         ?.shifts.map((shift, idx) => {
//                           const date = new Date(weekDates[shift.day]);
//                           return (
//                             <div
//                               key={idx}
//                               className={`border-start border-3 px-3 py-2 rounded ${getShiftTypeColor(
//                                 shift.type
//                               )}`}
//                             >
//                               <div className="fw-medium">
//                                 {formatDay(date)}, {formatDate(date)}
//                               </div>
//                               <div>
//                                 {shift.start} - {shift.end}
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>

//                   <div>
//                     <h6 className="text-muted mb-2">Preferences</h6>
//                     <div className="bg-light p-3 rounded">
//                       <div className="small">
//                         <div className="d-flex justify-content-between mb-1">
//                           <span>Preferred hours:</span>
//                           <span className="fw-medium">Morning</span>
//                         </div>
//                         <div className="d-flex justify-content-between mb-1">
//                           <span>Max hours per week:</span>
//                           <span className="fw-medium">40</span>
//                         </div>
//                         <div className="d-flex justify-content-between">
//                           <span>Unavailable days:</span>
//                           <span className="fw-medium">Sunday</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="card-footer bg-light">
//                   <button className="w-100 btn btn-primary">
//                     <i className="fas fa-edit me-2"></i> Edit Schedule
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-4 d-flex justify-content-end gap-3">
//             <button className="btn btn-outline-secondary">
//               <i className="fas fa-print me-2"></i> Print Schedule
//             </button>
//             <button className="btn btn-outline-secondary">
//               <i className="fas fa-file-export me-2"></i> Export
//             </button>
//             <button className="btn btn-primary">
//               <i className="fas fa-save me-2"></i> Save Changes
//             </button>
//             <button className="btn btn-success">
//               <i className="fas fa-paper-plane me-2"></i> Publish Schedule
//             </button>
//           </div>
//         </div>

//         {/* Shift Legend */}
//         <div className="container mt-4">
//           <h5 className="mb-3" style={{ color: "white" }}>Shift Allocation info</h5>
//           <ShiftLegend />
//         </div>

//         {/* Add/Edit Shift Modal */}
//         {showAddShiftModal && (
//           <div className="modal fade show d-block" tabIndex={-1}>
//             <div className="modal-dialog modal-lg custom-modal-dark">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {isEditMode ? "Edit Shift" : "Add New Shift"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => {
//                       setShowAddShiftModal(false);
//                       resetForm();
//                     }}
//                   ></button>
//                 </div>

//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label htmlFor="memberId" className="form-label">
//                       Employee
//                     </label>
//                     <select
//                       id="memberId"
//                       name="memberId"
//                       className="form-select"
//                       value={formData.memberId}
//                       onChange={handleChange}
//                       required
//                       disabled={isEditMode}
//                     >
//                       <option value="">Select Employee</option>
//                       {employees?.map((emp) => (
//                         <option key={emp.id} value={emp.id}>
//                           {emp.fullName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="mb-3">
//                     <label htmlFor="shiftDate" className="form-label">
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       id="shiftDate"
//                       name="shiftDate"
//                       className="form-control"
//                       value={formData.shiftDate}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Shift Type</label>
//                     <div className="d-flex flex-column gap-2">
//                       {/* Regular shift options */}
//                       <div className="d-flex gap-2">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="shiftOption"
//                             id="shiftRegular"
//                             checked={!showOthersOptions}
//                             onChange={() => setShowOthersOptions(false)}
//                           />
//                           <label className="form-check-label" htmlFor="shiftRegular">
//                             Regular Shift
//                           </label>
//                         </div>
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="shiftOption"
//                             id="shiftOthers"
//                             checked={showOthersOptions}
//                             onChange={() => setShowOthersOptions(true)}
//                           />
//                           <label className="form-check-label" htmlFor="shiftOthers">
//                             Others
//                           </label>
//                         </div>
//                       </div>

//                       {/* Regular shift selection */}
//                       {!showOthersOptions && (
//                         <select
//                           id="shiftSymbol"
//                           name="shiftSymbol"
//                           className="form-select"
//                           value={formData.shiftSymbol || ""}
//                           onChange={(e) => {
//                             const selected = e.target.value;
//                             setFormData((prev) => ({
//                               ...prev,
//                               shiftSymbol: selected,
//                               startTime: shiftMappings[selected]?.start || "",
//                               endTime: shiftMappings[selected]?.end || "",
//                             }));
//                           }}
//                           required
//                         >
//                           <option value="" >Select Shift</option>
//                           <option value="α">α (11:30 AM – 8:30 PM)</option>
//                           <option value="β">β (1:00 PM – 10:00 PM)</option>
//                           <option value="γ">γ (2:30 PM – 11:30 PM)</option>
//                           <option value="δ">δ (6:30 PM – 3:30 AM)</option>
//                           <option value="WO">Week Off</option>
//                           <option value="Holiday">Holiday</option>
//                         </select>
//                       )}

//                       {/* Others options */}
//                       {showOthersOptions && (
//                         <div className="border rounded p-3 ">
//                           <div className="d-flex flex-column gap-2">
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="othersOption"
//                                 id="permission"
//                                 checked={selectedOthersOption === "Permission"}
//                                 onChange={() => handleOthersOptionChange("Permission")}
//                               />
//                               <label className="form-check-label" htmlFor="permission">
//                                 Permission
//                               </label>
//                             </div>
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="othersOption"
//                                 id="leave"
//                                 checked={selectedOthersOption === "Leave"}
//                                 onChange={() => handleOthersOptionChange("Leave")}
//                               />
//                               <label className="form-check-label" htmlFor="leave">
//                                 Leave
//                               </label>
//                             </div>
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="othersOption"
//                                 id="absent"
//                                 checked={selectedOthersOption === "Absent"}
//                                 onChange={() => handleOthersOptionChange("Absent")}
//                               />
//                               <label className="form-check-label" htmlFor="absent">
//                                 Absent
//                               </label>
//                             </div>
//                           </div>

//                           {/* Permission options */}
//                           {selectedOthersOption === "Permission" && (
//                             <div className="mt-3">
//                               <div className="mb-3">
//                                 <label className="form-label">Duration</label>
//                                 <div className="d-flex gap-2">
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="radio"
//                                       name="permissionDuration"
//                                       id="duration30"
//                                       checked={permissionDuration === "30 minutes"}
//                                       onChange={() => setPermissionDuration("30 minutes")}
//                                     />
//                                     <label className="form-check-label" htmlFor="duration30">
//                                       30 minutes
//                                     </label>
//                                   </div>
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="radio"
//                                       name="permissionDuration"
//                                       id="duration60"
//                                       checked={permissionDuration === "60 minutes"}
//                                       onChange={() => setPermissionDuration("60 minutes")}
//                                     />
//                                     <label className="form-check-label" htmlFor="duration60">
//                                       60 minutes
//                                     </label>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="mb-3">
//                                 <label className="form-label">When will the permission apply?</label>
//                                 <div className="d-flex gap-2">
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="radio"
//                                       name="permissionTiming"
//                                       id="beginning"
//                                       checked={permissionTiming === "Beginning of shift"}
//                                       onChange={() => setPermissionTiming("Beginning of shift")}
//                                     />
//                                     <label className="form-check-label" htmlFor="beginning">
//                                       Beginning of shift
//                                     </label>
//                                   </div>
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="radio"
//                                       name="permissionTiming"
//                                       id="end"
//                                       checked={permissionTiming === "End of shift"}
//                                       onChange={() => setPermissionTiming("End of shift")}
//                                     />
//                                     <label className="form-check-label" htmlFor="end">
//                                       End of shift
//                                     </label>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Leave options */}
//                           {selectedOthersOption === "Leave" && (
//                             <div className="mt-3">
//                               <div className="mb-3">
//                                 <label className="form-label">Leave Type</label>
//                                 <div className="d-flex flex-column gap-2">
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="radio"
//                                       name="leaveType"
//                                       id="firstHalf"
//                                       checked={leaveType === "1st Half Leave"}
//                                       onChange={() => setLeaveType("1st Half Leave")}
//                                     />
//                                     <label className="form-check-label" htmlFor="firstHalf">
//                                       1st Half Leave
//                                     </label>
//                                   </div>
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="radio"
//                                       name="leaveType"
//                                       id="secondHalf"
//                                       checked={leaveType === "2nd Half Leave"}
//                                       onChange={() => setLeaveType("2nd Half Leave")}
//                                     />
//                                     <label className="form-check-label" htmlFor="secondHalf">
//                                       2nd Half Leave
//                                     </label>
//                                   </div>
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="radio"
//                                       name="leaveType"
//                                       id="fullDay"
//                                       checked={leaveType === "Full Day Leave"}
//                                       onChange={() => setLeaveType("Full Day Leave")}
//                                     />
//                                     <label className="form-check-label" htmlFor="fullDay">
//                                       Full Day Leave
//                                     </label>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Absent option */}
//                           {selectedOthersOption === "Absent" && (
//                             <div className="mt-3">
//                               <p className="text-muted">This indicates an unapproved/uninformed leave.</p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {!showOthersOptions && (
//                     <>
//                       <div className="row mb-3">
//                         <div className="col">
//                           <label htmlFor="startTime" className="form-label">
//                             Start Time
//                           </label>
//                           <input
//                             type="time"
//                             id="startTime"
//                             name="startTime"
//                             className="form-control"
//                             value={formData.startTime}
//                             onChange={handleChange}
//                             required
//                           />
//                         </div>

//                         <div className="col">
//                           <label htmlFor="endTime" className="form-label">
//                             End Time
//                           </label>
//                           <input
//                             type="time"
//                             id="endTime"
//                             name="endTime"
//                             className="form-control"
//                             value={formData.endTime}
//                             onChange={handleChange}
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="mb-3">
//                         <label htmlFor="shiftType" className="form-label">
//                           Shift Type
//                         </label>
//                         <select
//                           id="shiftType"
//                           name="shiftType"
//                           className="form-select"
//                           value={formData.shiftType}
//                           onChange={handleChange}
//                         >
//                           <option value="Full Day">Full Day</option>
//                           <option value="Half Day">Half Day</option>
//                           <option value="Night">Night</option>
//                         </select>
//                       </div>
//                     </>
//                   )}

//                   <div className="mb-3">
//                     <label htmlFor="notes" className="form-label">
//                       Notes
//                     </label>
//                     <textarea
//                       id="notes"
//                       name="notes"
//                       rows={3}
//                       className="form-control"
//                       placeholder="Add any additional information..."
//                       value={formData.notes}
//                       onChange={handleChange}
//                     ></textarea>
//                   </div>
//                 </div>

//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => {
//                       setShowAddShiftModal(false);
//                       resetForm();
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleSubmit}
//                   >
//                     {isEditMode ? "Update Shift" : "Add Shift"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShiftAllocation;





import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import axios from "axios";
import BASE_URL from "../../../config";
import ShiftLegend from "./ShiftLegend";

const ShiftAllocation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("All Team");
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeePanel, setShowEmployeePanel] = useState(false);
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("authToken");
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentShiftId, setCurrentShiftId] = useState(null);
  const [showOthersOptions, setShowOthersOptions] = useState(false);
  const [selectedOthersOption, setSelectedOthersOption] = useState("");
  const [permissionDuration, setPermissionDuration] = useState("");
  const [permissionTiming, setPermissionTiming] = useState("");
  const [leaveType, setLeaveType] = useState("");

  const [formData, setFormData] = useState({
    memberId: "",
    shiftDate: "",
    startTime: "",
    endTime: "",
    shiftType: "Half Day",
    notes: "",
    shiftSymbol: "",
  });

  // it is shift mapping for the shifts
  const shiftMappings = {
    α: { start: "11:30", end: "20:30" },   // 11:30 AM – 8:30 PM
    β: { start: "13:00", end: "22:00" },   // 1:00 PM – 10:00 PM
    γ: { start: "14:30", end: "23:30" },   // 2:30 PM – 11:30 PM
    δ: { start: "18:30", end: "03:30" },   // 6:30 PM – 3:30 AM
    WO: { start: "", end: "" },            // Week Off → no time
    Holiday: { start: "", end: "" },       // Holiday → no time
  };

  const getShiftLabel = (start, end, type, otherType, shiftSymbol) => {
    const shiftLabels = {
      "11:30 AM - 8:30 PM": { symbol: "α", bg: "#aef1f8" },
      "1:00 PM - 10:00 PM": { symbol: "β", bg: "#b7f280" },
      "2:30 PM - 11:30 PM": { symbol: "γ", bg: "#d9c8f3" },
      "6:30 PM - 3:30 AM": { symbol: "δ", bg: "#f7d4b5" },
      "WO": { symbol: "WO", bg: "#ffd966" },
      "Holiday": { symbol: "Holiday", bg: "#93c47d" },
      "Permission": { symbol: "Permission", bg: "#cfe2f3" },
      "Leave": { symbol: "Leave", bg: "#f9cb9c" },
      "Absent": { symbol: "Absent", bg: "#ea9999" },
    };

    // Handle special cases for otherType
    if (type === "Others" && otherType) {
      const label = shiftLabels[otherType];
      return label ? (
        <span
          style={{
            backgroundColor: label.bg,
            fontWeight: "bold",
            padding: "2px 8px",
            borderRadius: "4px",
            display: "inline-block",
            color: "black",
          }}
        >
          {label.symbol}
        </span>
      ) : null;
    }

    // Check for shift symbol first (α, β, γ, δ, WO, Holiday)
    if (shiftSymbol && shiftMappings[shiftSymbol]) {
      const label = shiftLabels[shiftSymbol];
      return label ? (
        <span
          style={{
            backgroundColor: label.bg,
            fontWeight: "bold",
            padding: "2px 8px",
            borderRadius: "4px",
            display: "inline-block",
            color: "black",
          }}
        >
          {label.symbol}
        </span>
      ) : null;
    }

    // Check by time range
    const formattedTime = `${start} - ${end}`;
    const label = shiftLabels[formattedTime] || null;

    // If no label found by time range, check by shift type
    if (!label && type) {
      const typeLabel = shiftLabels[type];
      if (typeLabel) {
        return (
          <span
            style={{
              backgroundColor: typeLabel.bg,
              fontWeight: "bold",
              padding: "2px 8px",
              borderRadius: "4px",
              display: "inline-block",
              color: "black",
            }}
          >
            {typeLabel.symbol}
          </span>
        );
      }
    }

    return label ? (
      <span
        style={{
          backgroundColor: label.bg,
          fontWeight: "bold",
          padding: "2px 8px",
          borderRadius: "4px",
          display: "inline-block",
          color: "black",
        }}
      >
        {label.symbol}
      </span>
    ) : null;
  };

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

    let payload = {
      memberId: parseInt(formData.memberId),
      shiftDate: formData.shiftDate,
    };

    // Handle regular shift options
    if (!showOthersOptions) {
      // If shift symbol is selected, use its time
      if (formData.shiftSymbol && shiftMappings[formData.shiftSymbol]) {
        const shift = shiftMappings[formData.shiftSymbol];
        payload.startTime = formatTime12Hour(shift.start);
        payload.endTime = formatTime12Hour(shift.end);
        payload.shiftType = formData.shiftType;
        payload.shiftSymbol = formData.shiftSymbol; // Make sure to include shiftSymbol
      } else {
        payload.startTime = formatTime12Hour(formData.startTime);
        payload.endTime = formatTime12Hour(formData.endTime);
        payload.shiftType = formData.shiftType;
      }
      payload.notes = formData.notes;
    } 
    // Handle Others options
    else {
      payload.shiftType = "Others";
      payload.otherType = selectedOthersOption;
      
      if (selectedOthersOption === "Permission") {
        payload.duration = permissionDuration;
        payload.permissionApply = permissionTiming;
        payload.notes = formData.notes || `Permission: ${permissionDuration} at ${permissionTiming}`;
      } else if (selectedOthersOption === "Leave") {
        payload.duration = leaveType;
        payload.notes = formData.notes || `Leave Type: ${leaveType}`;
      } else if (selectedOthersOption === "Absent") {
        payload.notes = formData.notes || "Unapproved/Uninformed Leave";
      }
    }

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
        setShowOthersOptions(false);
        setSelectedOthersOption("");
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
      shiftSymbol: "",
    });
    setIsEditMode(false);
    setCurrentShiftId(null);
    setShowOthersOptions(false);
    setSelectedOthersOption("");
    setPermissionDuration("");
    setPermissionTiming("");
    setLeaveType("");
  };

  // Get week dates based on current date
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Calculate Monday as the start of the week
    const mondayOffset = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(currentDate.getDate() + mondayOffset);

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

  // Department options - Updated to match requirements
  const departments = [
    "All Team",
    "Adobe",
    "MS Office",
    "QA",
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
  const getShiftTypeColor = (type, otherType, shiftSymbol) => {
    // Handle shift symbols first
    if (shiftSymbol) {
      switch (shiftSymbol) {
        case "α":
          return "bg-primary bg-opacity-10 border-primary";
        case "β":
          return "bg-purple bg-opacity-10 border-purple";
        case "γ":
          return "bg-dark bg-opacity-10 border-dark";
        case "δ":
          return "bg-warning bg-opacity-10 border-warning";
        case "WO":
          return "bg-secondary bg-opacity-10 border-secondary";
        case "Holiday":
          return "bg-success bg-opacity-10 border-success";
        default:
          break;
      }
    }
    
    // Handle Others type
    if (type === "Others" && otherType) {
      switch (otherType) {
        case "Permission":
          return "bg-info bg-opacity-10 border-info";
        case "Leave":
          return "bg-warning bg-opacity-10 border-warning";
        case "Absent":
          return "bg-danger bg-opacity-10 border-danger";
        default:
          return "bg-secondary bg-opacity-10 border-secondary";
      }
    }
    
    // Handle regular shift types
    switch (type) {
      case "Full Day":
      case "Half Day":
      case "Night":
        // Check for time ranges to assign appropriate colors
        if (type === "Full Day" || type === "Half Day") {
          return "bg-primary bg-opacity-10 border-primary";
        } else if (type === "Night") {
          return "bg-dark bg-opacity-10 border-dark";
        }
        return "bg-primary bg-opacity-10 border-primary";
      case "Permission":
        return "bg-info bg-opacity-10 border-info";
      case "Leave":
        return "bg-warning bg-opacity-10 border-warning";
      case "Absent":
        return "bg-danger bg-opacity-10 border-danger";
      default:
        return "bg-secondary bg-opacity-10 border-secondary";
    }
  };

  const formatDateRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    const format = (d) => {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    return `${format(startOfWeek)} - ${format(endOfWeek)}`;
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
          console.log("Fetched shifts:", res.data.data);
          setAllShifts(res.data.data); // Store all shifts
          if (employees.length > 0) {
            updateFilteredEmployees(res.data.data, employees);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch shifts:", err);
      });
  };

  // Update filtered employees based on current week
  const updateFilteredEmployees = (shiftData, members) => {
    const weekStart = new Date(weekDates[0]);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekDates[6]);
    weekEnd.setHours(23, 59, 59, 999);

    // Build a Map for faster member lookups
    const memberMap = new Map();
    if (members) {
      members.forEach(member => {
        memberMap.set(member.id, member);
      });
    }

    const employeesMap = {};

    // First, add all team members
    if (members) {
      members.forEach(member => {
        // Exclude managers if needed
        if (member.role === "Manager") return;
        
        const key = `${member.id}-${member.fullName}`;
        employeesMap[key] = {
          memberId: member.id,
          empId: member.empId || "N/A",
          team: member.team || "N/A",
          fullName: member.fullName || "Unknown",
          designation: member.designation || "N/A",
          shifts: [],
        };
      });
    }

    // Then add shifts for those employees
    shiftData.forEach((shift) => {
      const memberInfo = memberMap.get(shift.memberId);
      
      // Skip if member is a manager
      if (memberInfo && memberInfo.role === "Manager") return;

      const shiftDate = new Date(shift.shiftDate);
      shiftDate.setHours(0, 0, 0, 0);
      
      // Check if shift is within the current week
      if (shiftDate >= weekStart && shiftDate <= weekEnd) {
        const shiftDayIndex = shiftDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        const key = `${shift.memberId}-${shift.fullName}`;

        if (!employeesMap[key]) {
          employeesMap[key] = {
            memberId: shift.memberId,
            empId: memberInfo?.empId || "N/A",
            team: memberInfo?.team || "N/A",
            fullName: shift.fullName || memberInfo?.fullName || "Unknown",
            designation: memberInfo?.designation || "N/A",
            shifts: [],
          };
        }

        // Determine shift symbol based on time or directly use shiftSymbol if available
        let shiftSymbol = shift.shiftSymbol || "";
        if (!shiftSymbol && shift.startTime && shift.endTime) {
          const timeRange = `${shift.startTime} - ${shift.endTime}`;
          if (timeRange === "11:30 AM - 8:30 PM") shiftSymbol = "α";
          else if (timeRange === "1:00 PM - 10:00 PM") shiftSymbol = "β";
          else if (timeRange === "2:30 PM - 11:30 PM") shiftSymbol = "γ";
          else if (timeRange === "6:30 PM - 3:30 AM") shiftSymbol = "δ";
        }

        employeesMap[key].shifts.push({
          id: shift.id,
          day: shiftDayIndex,
          start: shift.startTime || "",
          end: shift.endTime || "",
          type: shift.shiftType,
          notes: shift.notes,
          date: shift.shiftDate,
          otherType: shift.otherType,
          shiftSymbol: shiftSymbol,
        });
      }
    });

    setFilteredEmployees(Object.values(employeesMap));
    console.log("Filtered employees:", Object.values(employeesMap));
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}member/getAllMembers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.status) {
        setEmployees(response.data.data);
        if (allShifts.length > 0) {
          updateFilteredEmployees(allShifts, response.data.data);
        }
      }

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
      shiftSymbol: "",
    });

    setSelectedDayIndex(dayIndex);
    setIsEditMode(false);
    setShowAddShiftModal(true);
    setShowOthersOptions(false);
    setSelectedOthersOption("");
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

    // Check if this is an "Others" type shift
    const isOthersType = shift.type === "Others" || 
                        shift.otherType === "Permission" || 
                        shift.otherType === "Leave" || 
                        shift.otherType === "Absent";

    setFormData({
      memberId: shift.memberId.toString(),
      shiftDate: shift.date,
      startTime: isOthersType ? "" : convertTo24Hour(shift.start),
      endTime: isOthersType ? "" : convertTo24Hour(shift.end),
      shiftType: isOthersType ? "Others" : shift.type,
      notes: shift.notes || "",
      shiftSymbol: shift.shiftSymbol || "",
    });

    setCurrentShiftId(shift.id);
    setIsEditMode(true);
    setShowAddShiftModal(true);
    
    // Set Others options if applicable
    if (isOthersType) {
      setShowOthersOptions(true);
      if (shift.otherType === "Permission") {
        setSelectedOthersOption("Permission");
        setPermissionDuration(shift.duration || "");
        setPermissionTiming(shift.permissionApply || "");
      } else if (shift.otherType === "Leave") {
        setSelectedOthersOption("Leave");
        setLeaveType(shift.duration || "");
      } else if (shift.otherType === "Absent") {
        setSelectedOthersOption("Absent");
      }
    } else {
      setShowOthersOptions(false);
      setSelectedOthersOption("");
    }
  };

  useEffect(() => {
    if (allShifts.length > 0 && employees.length > 0) {
      updateFilteredEmployees(allShifts, employees);
    }
  }, [currentDate, allShifts, employees]);

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

  const handleOthersOptionChange = (option) => {
    setSelectedOthersOption(option);
    if (option) {
      // Clear shift data when Others option is selected
      setFormData(prev => ({
        ...prev,
        startTime: "",
        endTime: "",
        shiftSymbol: "",
      }));
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

                  <div
                    className="form-control d-flex justify-content-between align-items-center"
                    style={{ minWidth: "230px", fontWeight: "bold", backgroundColor: "white" }}
                  >
                    {formatDateRange(currentDate)}
                    <i className="fas fa-calendar-alt text-muted ms-2"></i>
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
                      backgroundColor: "#0b1a3c", // Changed to match background
                    }}
                  >
                    <tr className="text-center">
                      <th scope="col" className="w-25 sticky-start" style={{ backgroundColor: "#0b1a3c" }}>
                        Employee
                      </th>
                      {weekDates.map((date, index) => (
                        <th key={index} className="text-center min-w-150" style={{ backgroundColor: "#0b1a3c" }}>
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
                        <td className="sticky-start bg-white border-end text-start p-2" style={{ backgroundColor: "#0b1a3c", color: "white" }}>
                          {/* Employee ID */}
                          <div
                            style={{
                              fontSize: "0.7rem",
                              backgroundColor: "#00d2ff",
                              color: "#000",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              display: "inline-block",
                              fontWeight: "bold",
                            }}
                          >
                            {employee.empId}
                          </div>

                          {/* Name */}
                          <div style={{ fontWeight: "bold", fontSize: "1rem", marginTop: "4px" }}>
                            {employee.fullName}
                          </div>

                          {/* Team Badge */}
                          <div
                            style={{
                              background: "linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)",
                              color: "#000",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              display: "inline-block",
                              marginTop: "2px",
                              fontWeight: "500",
                            }}
                          >
                            {employee.team}
                          </div>

                          {/* Designation */}
                          <div style={{ fontSize: "0.85rem", marginTop: "4px", fontWeight: "500" }}>
                            {employee.designation}
                          </div>
                        </td>

                        {/* Loop through days of week (0 = Sunday to 6 = Saturday) */}
                        {weekDates.map((date, dayIndex) => (
                          <td key={dayIndex} className="position-relative align-top" style={{ minHeight: "80px" }}>
                            {date.getDay() === 0 ? ( // Check if the date is actually Sunday (getDay() === 0)
                              <div className="text-center">
                                {getShiftLabel("", "", "Holiday")}
                              </div>
                            ) : (
                              <>
                                {/* Render shifts */}
                                {employee.shifts
                                  .filter((shift) => {
                                    const shiftDate = new Date(shift.date);
                                    return shiftDate.getDay() === date.getDay(); // Compare the actual day of the week
                                  })
                                  .map((shift, idx) => (
                                    <div
                                      key={idx}
                                      className={`border-start border-3 px-2 py-1 mb-1 rounded ${getShiftTypeColor(shift.type, shift.otherType, shift.shiftSymbol)}`}
                                      onClick={() => handleEditShift({ ...shift, memberId: employee.memberId })}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div className="fw-medium d-flex justify-content-center">
                                        {getShiftLabel(shift.start, shift.end, shift.type, shift.otherType, shift.shiftSymbol)}
                                      </div>
                                    </div>
                                  ))}

                                {/* Add/Remove buttons */}
                                <div className="d-flex justify-content-between position-relative" style={{ height: "40px" }}>
                                  {employee.shifts.some(shift => {
                                    const shiftDate = new Date(shift.date);
                                    return shiftDate.getDay() === date.getDay();
                                  }) && (
                                    <button
                                      className="position-absolute bottom-0 start-0 text-danger btn btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const shift = employee.shifts.find(s => {
                                          const shiftDate = new Date(s.date);
                                          return shiftDate.getDay() === date.getDay();
                                        });
                                        if (shift) handleRemoveShift(shift.id);
                                      }}
                                    >
                                      <i className="fas fa-minus-circle"></i>
                                    </button>
                                  )}
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
                              </>
                            )}
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

        {/* Shift Legend */}
        <div className="container mt-4">
          <h5 className="mb-3" style={{ color: "white" }}>Shift Allocation info</h5>
          <ShiftLegend />
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
                      {employees?.map((emp) => (
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

                  <div className="mb-3">
                    <label className="form-label">Shift Type</label>
                    <div className="d-flex flex-column gap-2">
                      {/* Regular shift options */}
                      <div className="d-flex gap-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="shiftOption"
                            id="shiftRegular"
                            checked={!showOthersOptions}
                            onChange={() => setShowOthersOptions(false)}
                          />
                          <label className="form-check-label" htmlFor="shiftRegular">
                            Regular Shift
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="shiftOption"
                            id="shiftOthers"
                            checked={showOthersOptions}
                            onChange={() => setShowOthersOptions(true)}
                          />
                          <label className="form-check-label" htmlFor="shiftOthers">
                            Others
                          </label>
                        </div>
                      </div>

                      {/* Regular shift selection */}
                      {!showOthersOptions && (
                        <select
                          id="shiftSymbol"
                          name="shiftSymbol"
                          className="form-select"
                          value={formData.shiftSymbol || ""}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              shiftSymbol: selected,
                              startTime: shiftMappings[selected]?.start || "",
                              endTime: shiftMappings[selected]?.end || "",
                            }));
                          }}
                          required
                        >
                          <option value="" >Select Shift</option>
                          <option value="α">α (11:30 AM – 8:30 PM)</option>
                          <option value="β">β (1:00 PM – 10:00 PM)</option>
                          <option value="γ">γ (2:30 PM – 11:30 PM)</option>
                          <option value="δ">δ (6:30 PM – 3:30 AM)</option>
                          <option value="WO">Week Off</option>
                          <option value="Holiday">Holiday</option>
                        </select>
                      )}

                      {/* Others options */}
                      {showOthersOptions && (
                        <div className="border rounded p-3 ">
                          <div className="d-flex flex-column gap-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="othersOption"
                                id="permission"
                                checked={selectedOthersOption === "Permission"}
                                onChange={() => handleOthersOptionChange("Permission")}
                              />
                              <label className="form-check-label" htmlFor="permission">
                                Permission
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="othersOption"
                                id="leave"
                                checked={selectedOthersOption === "Leave"}
                                onChange={() => handleOthersOptionChange("Leave")}
                              />
                              <label className="form-check-label" htmlFor="leave">
                                Leave
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="othersOption"
                                id="absent"
                                checked={selectedOthersOption === "Absent"}
                                onChange={() => handleOthersOptionChange("Absent")}
                              />
                              <label className="form-check-label" htmlFor="absent">
                                Absent
                              </label>
                            </div>
                          </div>

                          {/* Permission options */}
                          {selectedOthersOption === "Permission" && (
                            <div className="mt-3">
                              <div className="mb-3">
                                <label className="form-label">Duration</label>
                                <div className="d-flex gap-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="permissionDuration"
                                      id="duration30"
                                      checked={permissionDuration === "30 minutes"}
                                      onChange={() => setPermissionDuration("30 minutes")}
                                    />
                                    <label className="form-check-label" htmlFor="duration30">
                                      30 minutes
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="permissionDuration"
                                      id="duration60"
                                      checked={permissionDuration === "60 minutes"}
                                      onChange={() => setPermissionDuration("60 minutes")}
                                    />
                                    <label className="form-check-label" htmlFor="duration60">
                                      60 minutes
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">When will the permission apply?</label>
                                <div className="d-flex gap-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="permissionTiming"
                                      id="beginning"
                                      checked={permissionTiming === "Beginning of shift"}
                                      onChange={() => setPermissionTiming("Beginning of shift")}
                                    />
                                    <label className="form-check-label" htmlFor="beginning">
                                      Beginning of shift
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="permissionTiming"
                                      id="end"
                                      checked={permissionTiming === "End of shift"}
                                      onChange={() => setPermissionTiming("End of shift")}
                                    />
                                    <label className="form-check-label" htmlFor="end">
                                      End of shift
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Leave options */}
                          {selectedOthersOption === "Leave" && (
                            <div className="mt-3">
                              <div className="mb-3">
                                <label className="form-label">Leave Type</label>
                                <div className="d-flex flex-column gap-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="leaveType"
                                      id="firstHalf"
                                      checked={leaveType === "1st Half Leave"}
                                      onChange={() => setLeaveType("1st Half Leave")}
                                    />
                                    <label className="form-check-label" htmlFor="firstHalf">
                                      1st Half Leave
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="leaveType"
                                      id="secondHalf"
                                      checked={leaveType === "2nd Half Leave"}
                                      onChange={() => setLeaveType("2nd Half Leave")}
                                    />
                                    <label className="form-check-label" htmlFor="secondHalf">
                                      2nd Half Leave
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="leaveType"
                                      id="fullDay"
                                      checked={leaveType === "Full Day Leave"}
                                      onChange={() => setLeaveType("Full Day Leave")}
                                    />
                                    <label className="form-check-label" htmlFor="fullDay">
                                      Full Day Leave
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Absent option */}
                          {selectedOthersOption === "Absent" && (
                            <div className="mt-3">
                              <p className="text-muted">This indicates an unapproved/uninformed leave.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!showOthersOptions && (
                    <>
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
                    </>
                  )}

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