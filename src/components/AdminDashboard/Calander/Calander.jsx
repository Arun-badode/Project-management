import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import moment from "moment";

const calendarEvents = [
  {
    id: 1,
    type: "Birthday",
    name: "Michael Brown",
    date: "2025-07-10",
  },
  {
    id: 2,
    type: "Holiday",
    title: "Company Holiday",
    date: "2025-07-10",
  },
];

const Calendar = ({ userRole }) => {
  // State for calendar data and UI
  const [currentMonth, setCurrentMonth] = useState("June 2025");
  const [selectedFilters, setSelectedFilters] = useState({
    dob: true,
    doj: true,
    companyHoliday: true,
    clientHoliday: userRole === "admin" || userRole === "manager",
    approvedLeave: userRole === "admin" || userRole === "manager",
    weekOff: userRole === "admin" || userRole === "manager",
    notes: true,
  });
  const [viewMode, setViewMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 5, 25));
  const [events, setEvents] = useState([]);
  // modal
  // const [showModal, setShowModal] = useState(false);

  //    const modalBirthdays = [
  //   { id: 1, title: "Michael Brown", date: "2025-06-01" },
  // ];

  // const modalHolidays = [
  //   { id: 1, title: "Company Holiday 1", date: "2025-06-01" },
  // ];

  // State for company holidays management
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayTitle, setHolidayTitle] = useState("");
  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [companyHolidaysList, setCompanyHolidaysList] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // State for adding events
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [addEventDate, setAddEventDate] = useState("");
  const [addEventType, setAddEventType] = useState("");
  const [addEventDetails, setAddEventDetails] = useState("");

  // Load mock data

  const birthdayEvents = [{ name: "Michael Brown", date: "Jun 1, 2025" }];

  const holidayEvents = [{ title: "Company Holiday 1", date: "Jun 1, 2025" }];

  useEffect(() => {
    const mockEvents = [
      // DOBs (visible to all)
      {
        id: 1,
        date: new Date(2025, 5, 1),
        type: "dob",
        title: "Michael Brown",
        color: "bg-danger",
        userId: 101,
      },
      {
        id: 2,
        date: new Date(2025, 5, 15),
        type: "dob",
        title: "Sophia Taylor",
        color: "bg-warning",
        userId: 102,
      },
      {
        id: 3,
        date: new Date(2025, 5, 29),
        type: "dob",
        title: "David Wilson",
        color: "bg-warning",
        userId: 103,
      },

      // DOJs (only visible to self)
      {
        id: 4,
        date: new Date(2025, 5, 8),
        type: "doj",
        title: "Your Joining Date",
        color: "bg-primary",
        userId: 100,
      },
      {
        id: 5,
        date: new Date(2025, 5, 21),
        type: "doj",
        title: "Robert Johnson",
        color: "bg-primary",
        userId: 104,
      },

      // Company Holidays (visible to all)
      {
        id: 6,
        date: new Date(2025, 5, 4),
        type: "companyHoliday",
        title: "Company Holiday 1",
        color: "bg-success",
      },
      {
        id: 13,
        date: new Date(2025, 5, 14),
        type: "companyHoliday",
        title: "Company Holiday 2",
        color: "bg-success",
      },

      // Client Holidays (only admin/manager)
      {
        id: 7,
        date: new Date(2025, 5, 17),
        type: "clientHoliday",
        title: "Client Holiday",
        color: "bg-info",
      },

      // Approved Leaves (only admin/manager and self)
      {
        id: 8,
        date: new Date(2025, 5, 25),
        type: "approvedLeave",
        title: "Your Leave",
        color: "bg-warning",
        userId: 100,
      },
      {
        id: 9,
        date: new Date(2025, 5, 31),
        type: "approvedLeave",
        title: "Emma Davis",
        color: "bg-danger",
        userId: 105,
      },

      // Week Offs (only admin/manager)
      {
        id: 10,
        date: new Date(2025, 5, 12),
        type: "weekOff",
        title: "John's Week Off",
        color: "bg-secondary",
        userId: 106,
      },
      {
        id: 11,
        date: new Date(2025, 5, 19),
        type: "weekOff",
        title: "Your Week Off",
        color: "bg-secondary",
        userId: 100,
      },

      // Notes (only admin)
      {
        id: 12,
        date: new Date(2025, 5, 10),
        type: "note",
        title: "Team Meeting",
        color: "bg-dark",
        content: "Quarterly planning",
      },
    ];

    setEvents(mockEvents);

    // Extract company holidays for the list
    const holidays = mockEvents.filter((e) => e.type === "companyHoliday");
    setCompanyHolidaysList(holidays);
  }, []);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getFilteredEvents = (date) => {
    return events.filter((event) => {
      if (!selectedFilters[event.type]) return false;

      if (
        event.date.getDate() !== date.getDate() ||
        event.date.getMonth() !== date.getMonth() ||
        event.date.getFullYear() !== date.getFullYear()
      ) {
        return false;
      }

      switch (event.type) {
        case "doj":
          return event.userId === 100;
        case "clientHoliday":
          return userRole === "admin" || userRole === "manager";
        case "approvedLeave":
          return (
            userRole === "admin" ||
            userRole === "manager" ||
            event.userId === 100
          );
        case "weekOff":
          return userRole === "admin" || userRole === "manager";
        case "note":
          return userRole === "admin";
        default:
          return true;
      }
    });
  };

  const toggleFilter = (filter) => {
    setSelectedFilters({
      ...selectedFilters,
      [filter]: !selectedFilters[filter],
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(
      today.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    );
  };

  const generateCalendarGrid = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const weeks = [];
    let week = [];

    days.forEach((day, index) => {
      week.push(day);
      if (week.length === 7 || index === days.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return weeks;
  };

  const calendarWeeks = generateCalendarGrid();

  // Company Holiday Management Functions
  const openHolidayModal = (date = null) => {
    if (date) {
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      setHolidayDate(formattedDate);
    } else {
      setHolidayDate("");
    }
    setHolidayTitle("");
    setEditingHolidayId(null);
    setShowHolidayModal(true);
  };

  const editHoliday = (holiday) => {
    const formattedDate = `${holiday.date.getFullYear()}-${String(
      holiday.date.getMonth() + 1
    ).padStart(2, "0")}-${String(holiday.date.getDate()).padStart(2, "0")}`;
    setHolidayDate(formattedDate);
    setHolidayTitle(holiday.title);
    setEditingHolidayId(holiday.id);
    setShowHolidayModal(true);
  };

  const saveHoliday = () => {
    if (!holidayDate || !holidayTitle) return;

    const dateParts = holidayDate.split("-");
    const holidayDateObj = new Date(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2]
    );

    if (editingHolidayId) {
      // Update existing holiday
      const updatedEvents = events.map((event) =>
        event.id === editingHolidayId
          ? { ...event, date: holidayDateObj, title: holidayTitle }
          : event
      );

      setEvents(updatedEvents);
      setCompanyHolidaysList(
        updatedEvents.filter((e) => e.type === "companyHoliday")
      );
    } else {
      // Add new holiday
      const newId = Math.max(...events.map((e) => e.id), 0) + 1;
      const newHoliday = {
        id: newId,
        date: holidayDateObj,
        type: "companyHoliday",
        title: holidayTitle,
        color: "bg-success",
      };

      setEvents([...events, newHoliday]);
      setCompanyHolidaysList([...companyHolidaysList, newHoliday]);
    }

    setShowHolidayModal(false);
  };

  const deleteHoliday = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
    setCompanyHolidaysList(
      updatedEvents.filter((e) => e.type === "companyHoliday")
    );
  };

  // Get all birthdays
  const birthdays = events.filter(
    (event) => event.type === "dob" && selectedFilters.dob
  );

  // Get all company holidays
  const companyHolidays = events.filter(
    (event) => event.type === "companyHoliday" && selectedFilters.companyHoliday
  );

  // Get all joining dates (only show user's own joining date for non-admins)
  const joiningDates = events.filter((event) => {
    if (event.type !== "doj" || !selectedFilters.doj) return false;
    return (
      userRole === "admin" || userRole === "manager" || event.userId === 100
    );
  });

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Modal open handler
  const openAddEventModal = () => {
    setAddEventDate("");
    setAddEventType("");
    setAddEventDetails("");
    setShowAddEventModal(true);
  };

  // Modal save handler (yahan aap apni event add logic laga sakte hain)
  const handleAddEventSave = () => {
    // Validation and event add logic
    setShowAddEventModal(false);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="p-3 rounded shadow bg-card col-8">
          <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
            <h2 className="gradient-heading">Calendar</h2>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <button
                className="btn btn-primary"
                onClick={openAddEventModal}
                style={{ fontWeight: 500 }}
              >
                + Add Event
              </button>

              <button
                className={`btn btn-xs me-1 mb-1 ${
                  selectedFilters.dob ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => toggleFilter("dob")}
              >
                Birthdays
              </button>

              <button
                className={`btn btn-xs me-1 mb-1 ${
                  selectedFilters.doj ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => toggleFilter("doj")}
              >
                Joining Dates
              </button>

              <button
                className={`btn btn-xs me-1 mb-1 ${
                  selectedFilters.companyHoliday
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() => toggleFilter("companyHoliday")}
              >
                Company Holidays
              </button>

              {(userRole === "admin" || userRole === "manager") && (
                <button
                  className={`btn btn-xs me-1 mb-1 ${
                    selectedFilters.clientHoliday
                      ? "btn-info"
                      : "btn-outline-info"
                  }`}
                  onClick={() => toggleFilter("clientHoliday")}
                >
                  Client Holidays
                </button>
              )}

              {(userRole === "admin" || userRole === "manager") && (
                <button
                  className={`btn btn-xs me-1 mb-1 ${
                    selectedFilters.approvedLeave
                      ? "btn-warning"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => toggleFilter("approvedLeave")}
                >
                  Leaves
                </button>
              )}

              {(userRole === "admin" || userRole === "manager") && (
                <button
                  className={`btn btn-xs me-1 mb-1 ${
                    selectedFilters.weekOff
                      ? "btn-secondary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => toggleFilter("weekOff")}
                >
                  Week Offs
                </button>
              )}

              {userRole === "admin" && (
                <button
                  className={`btn btn-xs mb-1 ${
                    selectedFilters.note ? "btn-dark" : "btn-outline-dark"
                  }`}
                  onClick={() => toggleFilter("note")}
                >
                  Notes
                </button>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div className="d-flex align-items-center mb-2">
              <button
                className="btn btn-xs btn-secondary me-2"
                onClick={handleTodayClick}
              >
                Today
              </button>
              <h5 className="mb-0 me-2">{currentMonth}</h5>
            </div>
            <div className="d-flex gap-1 align-items-center mb-2">
              <select
                className="form-select form-select-xs"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                style={{ width: "80px" }}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
              <select
                className="form-select form-select-xs"
                value={selectedDate.getMonth()}
                onChange={(e) => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(parseInt(e.target.value));
                  setSelectedDate(newDate);
                  setCurrentMonth(
                    newDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  );
                }}
                style={{ width: "90px" }}
              >
                {Array.from({ length: 12 }, (_, i) =>
                  new Date(0, i).toLocaleString("default", { month: "long" })
                ).map((month, i) => (
                  <option key={month} value={i}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="form-select form-select-xs"
                value={selectedDate.getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(selectedDate);
                  newDate.setFullYear(parseInt(e.target.value));
                  setSelectedDate(newDate);
                  setCurrentMonth(
                    newDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  );
                }}
                style={{ width: "80px" }}
              >
                {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-3 d-flex flex-wrap gap-1 table-gradient-bg">
            {selectedFilters.dob && (
              <span className="badge bg-danger me-1">Birthdays</span>
            )}
            {selectedFilters.doj && (
              <span className="badge bg-primary me-1">Joining Dates</span>
            )}
            {selectedFilters.companyHoliday && (
              <span className="badge bg-success me-1">Company Holidays</span>
            )}
            {selectedFilters.clientHoliday && (
              <span className="badge bg-info me-1">Client Holidays</span>
            )}
            {selectedFilters.approvedLeave && (
              <span className="badge bg-warning me-1">Leaves</span>
            )}
            {selectedFilters.weekOff && (
              <span className="badge bg-secondary me-1">Week Offs</span>
            )}
            {selectedFilters.note && (
              <span className="badge bg-dark me-1">Notes</span>
            )}
          </div>

          <div className="table-responsive table-gradient-bg">
            <table className="table table-bordered text-center ">
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
                  {weekdays.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calendarWeeks.map((week, weekIndex) => (
                  <tr key={weekIndex} >
                    {week.map((day, dayIndex) => (
                      <td
                        key={dayIndex}
                        className={`${day ? "" : ""} ${
                          day && isToday(day) ? "today-cell" : ""
                        }`}
                        onClick={() => day && openHolidayModal(day)}
                      >
                        {day ? (
                          <>
                            <div
                              className={`fw-bold ${
                                isToday(day) ? "text-white" : ""
                              }`}
                            >
                              {day.getDate()}
                            </div>
                            <div className="d-flex flex-column gap-1">
                              {getFilteredEvents(day).map((event, idx) => (
                                <span
                                  key={idx}
                                  className={`badge ${event.color} text-white text-truncate`}
                                  title={
                                    event.title +
                                    (event.content ? `: ${event.content}` : "")
                                  }
                                >
                                  {event.title}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-4 ">
          <div
            className="bg-card bg-white shadow-sm p-3"
            style={{ maxWidth: "400px" }}
          >
            <h5 className="mb-3 fw-bold">Events Today</h5>

            {/* Birthdays */}
            {birthdayEvents.length > 0 && (
              <>
                <h6 className="text-danger fw-bold">Birthdays</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm mb-4 table-gradient-bg">
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
                        <th>Name</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {birthdayEvents.map((event, idx) => (
                        <tr key={idx}  >
                          <td>{event.name}</td>
                          <td>{moment(event.date).format("MMM D, YYYY")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Company Holidays */}
            {holidayEvents.length > 0 && (
              <>
                <h6 className="text-success fw-bold">Company Holidays</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm table-gradient-bg">
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
                        <th>Title</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holidayEvents.map((event, idx) => (
                        <tr key={idx} >
                          <td>{event.title}</td>
                          <td>{moment(event.date).format("MMM D, YYYY")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {birthdayEvents.length === 0 && holidayEvents.length === 0 && (
              <p className="text-muted">No events for today.</p>
            )}
          </div>
        </div>
      </div>

      {/* Events Summary Table */}
      <div className="mt-4 p-3 rounded shadow table-gradient-bg">
        <h4 className="gradient-heading mb-3">Events Summary</h4>

        {/* Birthdays Table */}
        {selectedFilters.dob && (
          <div className="mb-4">
            <h5 className="text-danger">Birthdays</h5>
            <Table striped bordered hover responsive>
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
                  <th style={{ width: "60%", textAlign: "left" }}>Employee</th>
                  <th style={{ width: "40%", textAlign: "left" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {birthdays.map((event) => (
                  <tr key={`dob-${event.id}`}>
                    <td style={{ textAlign: "left" }}>{event.title}</td>
                    <td style={{ textAlign: "left" }}>
                      {formatDate(event.date)}
                    </td>
                  </tr>
                ))}
                {birthdays.length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-muted text-center">
                      No birthdays found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* Company Holidays Table */}
        {selectedFilters.companyHoliday && (
          <div className="mb-4 ">
            <h5 className="text-success">Company Holidays</h5>
            <Table striped bordered hover responsive>
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
                  <th style={{ width: "60%", textAlign: "left" }}>Title</th>
                  <th style={{ width: "40%", textAlign: "left" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {events
                  .filter((event) => event.type === "companyHoliday")
                  .map((event) => (
                    <tr key={`holiday-${event.id}`} >
                      <td style={{ textAlign: "left" }}>{event.title}</td>
                      <td style={{ textAlign: "left" }}>
                        {formatDate(event.date)}
                      </td>
                    </tr>
                  ))}
                {events.filter((event) => event.type === "companyHoliday")
                  .length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-muted text-center">
                      No holidays found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {(userRole === "admin" || userRole === "manager") && (
              <Button
                variant="success"
                onClick={() => openHolidayModal()}
                className="mt-2"
              >
                Add Company Holiday
              </Button>
            )}
          </div>
        )}

        {/* Joining Dates Table */}

        <div className="mb-4">
          <h5 style={{ color: "#3fa9f5" }}>Joining Dates</h5>
          <Table striped bordered hover responsive>
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
                <th style={{ width: "60%", textAlign: "left" }}>Employee</th>
                <th style={{ width: "40%", textAlign: "left" }}>
                  Joining Date
                </th>
              </tr>
            </thead>
            <tbody>
              {events
                .filter((event) => event.type === "doj")
                .map((event) => (
                  <tr key={`doj-${event.id}`} >
                    <td style={{ textAlign: "left" }}>{event.title}</td>
                    <td style={{ textAlign: "left" }}>
                      {formatDate(event.date)}
                    </td>
                  </tr>
                ))}
              {events.filter((event) => event.type === "doj").length === 0 && (
                <tr>
                  <td colSpan="2" className="text-muted text-center">
                    No joining dates found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Approved Leave Table */}
        <div className="mb-4">
          <h5 style={{ color: "#ff9800" }}>Approved Leave</h5>
          <Table striped bordered hover responsive>
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
                <th style={{ width: "60%", textAlign: "left" }}>Employee</th>
                <th style={{ width: "40%", textAlign: "left" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {events
                .filter((event) => event.type === "approvedLeave")
                .map((event) => (
                  <tr key={`leave-${event.id}`}  >
                    <td style={{ textAlign: "left" }}>{event.title}</td>
                    <td style={{ textAlign: "left" }}>
                      {formatDate(event.date)}
                    </td>
                  </tr>
                ))}
              {events.filter((event) => event.type === "approvedLeave")
                .length === 0 && (
                <tr>
                  <td colSpan="2" className="text-muted text-center">
                    No approved leaves found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Notes Table */}
        {selectedFilters.note && (
          <div className="mb-4">
            <h5 style={{ color: "#ffe100" }}>Notes</h5>
            <Table striped bordered hover responsive>
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
                  <th>Title</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {events
                  .filter((event) => event.type === "note")
                  .map((event) => (
                    <tr key={`note-${event.id}`} >
                      <td>{event.title}</td>
                      <td>{formatDate(event.date)}</td>
                    </tr>
                  ))}
                {events.filter((event) => event.type === "note").length ===
                  0 && (
                  <tr>
                    <td colSpan="2" className="text-muted">
                      No notes found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Company Holiday Modal */}
      <Modal
        className="custom-modal-dark"
        show={showHolidayModal}
        onHide={() => setShowHolidayModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingHolidayId ? "Edit Company Holiday" : "Add Company Holiday"}
          </Modal.Title>
        </Modal.Header>

        {/* ✅ UPDATED CONTENT START */}
        <Modal.Body>
          {/* 🎂 Birthdays Section */}
          <div className="mb-4">
            <h6 className="text-danger fw-bold">Birthdays</h6>
            {birthdays.length > 0 ? (
              birthdays.map((b, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                  <Form.Control value={b.name} />
                  <Form.Control
                    value={new Date(b.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    disabled
                  />
                </div>
              ))
            ) : (
              <div className="text-muted">No birthdays found.</div>
            )}
          </div>

          {/* 🏖 Company Holidays Section */}
          <div>
            <h6 className="text-success fw-bold ">Company Holidays</h6>
            {companyHolidays.length > 0 ? (
              companyHolidays.map((h, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                  <Form.Control value={h.title} />
                  <Form.Control
                    value={new Date(h.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    disabled
                  />
                </div>
              ))
            ) : (
              <div className="text-muted">No company holidays found.</div>
            )}
          </div>
        </Modal.Body>
        {/* ✅ UPDATED CONTENT END */}

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowHolidayModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={saveHoliday}>
            {editingHolidayId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Event Modal */}
      <Modal
        show={showAddEventModal}
        onHide={() => setShowAddEventModal(false)}
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={addEventDate}
                onChange={(e) => setAddEventDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type of Event</Form.Label>
              <Form.Select
                value={addEventType}
                onChange={(e) => setAddEventType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="dob">Birthday</option>
                <option value="doj">Joining Date</option>
                <option value="companyHoliday">Company Holiday</option>
                <option value="clientHoliday">Client Holiday</option>
                <option value="approvedLeave">Leave</option>
                <option value="weekOff">Week Off</option>
                <option value="note">Note</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Details"
                value={addEventDetails}
                onChange={(e) => setAddEventDetails(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddEventModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEventSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .today-cell {
          background-color: rgba(23, 162, 184, 0.3) !important;
        }
        .bg-card {
          background-color: #ffffff;
        }
        .gradient-heading {
          background: linear-gradient(45deg, #3f51b5, #2196f3);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        .table-gradient-bg {
          background: linear-gradient(to bottom, #f8f9fa, #ffffff);
        }
        .dropdown-item-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
          display: inline-block;
        }
        .btn-xs {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          line-height: 1.5;
          border-radius: 0.2rem;
        }
        .form-select-xs {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          line-height: 1.5;
          height: calc(1.5em + 0.5rem + 2px);
          border-radius: 0.2rem;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
