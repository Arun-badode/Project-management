import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import moment from "moment";
import BASE_URL from "../../../config";
import axios from "axios";

const Calendar = ({ userRole }) => {
  // State for calendar data and UI
  const [selectedFilters, setSelectedFilters] = useState({
    dob: true,
    doj: true,
    companyHoliday: true,
    clientHoliday: userRole === "admin" || userRole === "manager",
    notes: true,
  });
  const [viewMode, setViewMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  // State for company holidays management
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayTitle, setHolidayTitle] = useState("");
  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [companyHolidaysList, setCompanyHolidaysList] = useState([]);
  
  // State for adding events
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [addEventDate, setAddEventDate] = useState("");
  const [addEventType, setAddEventType] = useState("");
  const [addEventDetails, setAddEventDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventsData, setEventsData] = useState({
    birthdays: [],
    companyHolidays: [],
    joiningDates: [],
    approvedLeaves: [],
    notes: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [allMonths, setAllMonths] = useState(false);
  const [members, setMembers] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const token = localStorage.getItem("authToken");

  // Fetch members data
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}member/getAllMembers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.status && response.data.data) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Fetch all events
  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}event/getAllEvents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("All Events Response:", response.data);
      
      if (response.data && response.data.status && response.data.events) {
        setAllEvents(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Process members data to create events
  const processMembersData = () => {
    const memberEvents = [];
    
    // Check if members is an array before using forEach
    if (Array.isArray(members)) {
      members.forEach(member => {
        // Process Date of Birth
        if (member.dob) {
          const dob = new Date(member.dob);
          memberEvents.push({
            id: `dob-${member.id}`,
            date: dob,
            type: "dob",
            title: `${member.fullName} - Birthday`,
            color: "bg-info", // Light Blue for Birthday
            userId: member.id,
            name: member.fullName
          });
        }
        
        // Process Date of Joining (Work Anniversary)
        if (member.doj) {
          const doj = new Date(member.doj);
          memberEvents.push({
            id: `doj-${member.id}`,
            date: doj,
            type: "doj",
            title: `${member.fullName} - Work Anniversary`,
            color: "bg-success", // Light Green for Work Anniversary
            userId: member.id,
            name: member.fullName
          });
        }
      });
    }
    
    return memberEvents;
  };

  // Process events data
 const processEventsData = () => {
  const processedEvents = [];

  if (Array.isArray(allEvents)) {
    allEvents.forEach(event => {
      // Safe date conversion
      let eventDate = event.eventDate
        ? new Date(event.eventDate)
        : event.date
        ? new Date(event.date)
        : null;

      // If date is invalid, skip this event
      if (!eventDate || isNaN(eventDate.getTime())) return;

      // Normalize event type to lowercase for consistency
      let eventType = event.eventType ? event.eventType.toLowerCase() : "unknown";
      let eventColor = "";
      let eventTitle = event.details;

      switch(eventType) {
        case "companyholiday":
        case "company holiday":
          eventType = "companyHoliday";
          eventColor = "bg-danger";
          break;
        case "clientholiday":
        case "client holiday":
          eventType = "clientHoliday";
          eventColor = "bg-warning";
          break;
        case "note":
          eventColor = "bg-secondary";
          break;
        case "birthday":
          eventType = "dob";
          eventColor = "bg-info";
          break;
        case "joining date":
        case "joiningdate":
          eventType = "doj";
          eventColor = "bg-success";
          break;
        case "approvedleave":
        case "approved leave":
          eventType = "approvedLeave";
          eventColor = "bg-primary";
          break;
        default:
          eventColor = "bg-primary";
      }

      processedEvents.push({
        id: `event-${event.id}`,
        date: eventDate,
        type: eventType,
        title: eventTitle,
        color: eventColor,
        eventId: event.id
      });
    });
  }

  return processedEvents;
};

  // Combine all events
  const combineAllEvents = () => {
    const memberEvents = processMembersData();
    const eventEvents = processEventsData();
    return [...memberEvents, ...eventEvents];
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchMembers();
      await fetchAllEvents();
      setLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (members.length > 0 || allEvents.length > 0) {
      const allCombinedEvents = combineAllEvents();
      setEvents(allCombinedEvents);
      
      // Extract company holidays for the list
      const holidays = allCombinedEvents.filter((e) => e.type === "companyHoliday");
      setCompanyHolidaysList(holidays);
    }
  }, [members, allEvents]);

  useEffect(() => {
    fetchEventsSummary();
  }, [currentMonth, currentYear, allMonths]);

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getFilteredEvents = (date) => {
    return events.filter((event) => {
      if (!selectedFilters[event.type]) return false;

      // Check if the event matches the date
      const eventDate = new Date(event.date);
      if (
        eventDate.getDate() !== date.getDate() ||
        eventDate.getMonth() !== date.getMonth() ||
        eventDate.getFullYear() !== date.getFullYear()
      ) {
        return false;
      }

      // Apply role-based visibility
      switch (event.type) {
        case "doj":
          return true; // All can see work anniversaries
        case "clientHoliday":
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

  const handleTodayClick = (e) => {
    e.preventDefault(); // Prevent form submission
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
    setAllMonths(false);
  };

  const handlePrevClick = (e) => {
    e.preventDefault(); // Prevent form submission
    if (allMonths) {
      setCurrentYear(currentYear - 1);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(selectedDate.getMonth() - 1);
      setSelectedDate(newDate);
      setCurrentMonth(newDate.getMonth() + 1);
      setCurrentYear(newDate.getFullYear());
    }
  };

  const handleNextClick = (e) => {
    e.preventDefault(); // Prevent form submission
    if (allMonths) {
      setCurrentYear(currentYear + 1);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(selectedDate.getMonth() + 1);
      setSelectedDate(newDate);
      setCurrentMonth(newDate.getMonth() + 1);
      setCurrentYear(newDate.getFullYear());
    }
  };

  const generateCalendarGrid = () => {
    if (allMonths) {
      // Generate a year view grid
      const yearGrid = [];
      
      for (let month = 0; month < 12; month++) {
        const monthDate = new Date(currentYear, month, 1);
        
        // Get the day of the week for the 1st (0 = Sun, 1 = Mon, ...)
        let firstDay = monthDate.getDay();
        // Adjust so Monday = 0, Sunday = 6
        firstDay = (firstDay + 6) % 7;
        
        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
        
        const days = [];
        // Empty slots before the 1st day
        for (let i = 0; i < firstDay; i++) days.push(null);
        
        // Fill days of the month
        for (let i = 1; i <= daysInMonth; i++) {
          days.push(new Date(currentYear, month, i));
        }
        
        // Break into weeks (Mon → Sun)
        const weeks = [];
        let week = [];
        
        days.forEach((day, index) => {
          week.push(day);
          if (week.length === 7 || index === days.length - 1) {
            weeks.push(week);
            week = [];
          }
        });
        
        yearGrid.push({
          monthName: monthDate.toLocaleDateString("en-US", { month: "long" }),
          weeks: weeks
        });
      }
      
      return yearGrid;
    } else {
      // Generate a single month grid
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      
      // Get the day of the week for the 1st (0 = Sun, 1 = Mon, ...)
      let firstDay = new Date(year, month, 1).getDay();
      // Adjust so Monday = 0, Sunday = 6
      firstDay = (firstDay + 6) % 7;
      
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const days = [];
      // Empty slots before the 1st day
      for (let i = 0; i < firstDay; i++) days.push(null);
      
      // Fill days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      
      // Break into weeks (Mon → Sun)
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
    }
  };

  const calendarGrid = generateCalendarGrid();

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

  const saveHoliday = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!holidayDate || !holidayTitle) return;

    setIsLoading(true);
    setError(null);

    try {
      const dateParts = holidayDate.split("-");
      const holidayDateObj = new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2]
      );

      if (editingHolidayId) {
        // Update existing holiday
        const response = await axios.put(
          `${BASE_URL}event/updateEvent/${editingHolidayId}`,
          {
            eventDate: holidayDate,
            eventType: "companyHoliday",
            details: holidayTitle,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.success) {
          // Refresh events
          await fetchAllEvents();
          setShowHolidayModal(false);
        } else {
          setError(response.data.message || "Failed to update holiday");
        }
      } else {
        // Add new holiday
        const response = await axios.post(
          `${BASE_URL}event/addEvent`,
          {
            eventDate: holidayDate,
            eventType: "companyHoliday",
            details: holidayTitle,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.success) {
          // Refresh events
          await fetchAllEvents();
          setShowHolidayModal(false);
        } else {
          setError(response.data.message || "Failed to add holiday");
        }
      }
    } catch (err) {
      console.error("Error saving holiday:", err);
      setError(
        err.response?.data?.message || "Failed to save holiday. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHoliday = async (id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}event/deleteEvent/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        // Refresh events
        await fetchAllEvents();
      }
    } catch (err) {
      console.error("Error deleting holiday:", err);
    }
  };

  // Get events for today
  const today = new Date();
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear() &&
      selectedFilters[event.type]
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Modal open handler
  const openAddEventModal = (e) => {
    e.preventDefault(); // Prevent form submission
    setAddEventDate("");
    setAddEventType("");
    setAddEventDetails("");
    setShowAddEventModal(true);
  };

  // Modal save handler
  const handleAddEventSave = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!addEventDate || !addEventType || !addEventDetails) {
      setError("Please fill all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BASE_URL}event/addEvent`,
        {
          eventDate: addEventDate,
          eventType: addEventType,
          details: addEventDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setShowAddEventModal(false);
        // Reset form
        setAddEventDate("");
        setAddEventType("");
        setAddEventDetails("");
        // Refresh events
        await fetchAllEvents();
      } else {
        setError(response.data.message || "Failed to add event");
      }
    } catch (err) {
      console.error("Error adding event:", err);
      setError(
        err.response?.data?.message || "Failed to add event. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventsSummary = async () => {
    try {
      setLoading(true);
      let url;
      
      if (allMonths) {
        // Get all events for the year
        url = `${BASE_URL}event/getAllEvents`;
      } else {
        // Get events for the selected month
        url = `${BASE_URL}event/getEventSummary?month=${currentMonth}&year=${currentYear}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        if (allMonths) {
          // Process all events for the year
          const allEvents = response.data.events || [];
          const year = currentYear;
          
          // Group by month
          const monthlySummary = {};
          
          // Initialize all months
          for (let i = 1; i <= 12; i++) {
            monthlySummary[i] = {
              birthdays: [],
              companyHolidays: [],
              joiningDates: [],
              approvedLeaves: [],
              notes: [],
            };
          }
          
          // Process member events (birthdays and work anniversaries)
          if (Array.isArray(members)) {
            members.forEach(member => {
              if (member.dob) {
                const dob = new Date(member.dob);
                if (dob.getFullYear() === year) {
                  const month = dob.getMonth() + 1;
                  monthlySummary[month].birthdays.push({
                    name: member.fullName,
                    date: dob.toISOString().split('T')[0]
                  });
                }
              }
              
              if (member.doj) {
                const doj = new Date(member.doj);
                if (doj.getFullYear() === year) {
                  const month = doj.getMonth() + 1;
                  monthlySummary[month].joiningDates.push({
                    name: member.fullName,
                    date: doj.toISOString().split('T')[0]
                  });
                }
              }
            });
          }
          
          // Process other events
          if (Array.isArray(allEvents)) {
            allEvents.forEach(event => {
              const eventDate = new Date(event.eventDate);
              if (eventDate.getFullYear() === year) {
                const month = eventDate.getMonth() + 1;
                const eventType = event.eventType ? event.eventType.toLowerCase() : "";
                
                if (eventType === "companyholiday" || eventType === "company holiday") {
                  monthlySummary[month].companyHolidays.push({
                    name: event.details,
                    date: event.eventDate
                  });
                } else if (eventType === "note") {
                  monthlySummary[month].notes.push({
                    name: event.details,
                    date: event.eventDate
                  });
                }
              }
            });
          }
          
          setEventsData(monthlySummary);
        } else {
          // Single month summary
          setEventsData({
            birthdays: response.data.summary?.birthdays || [],
            companyHolidays: response.data.summary?.companyHolidays || [],
            joiningDates: response.data.summary?.joiningDates || [],
            approvedLeaves: response.data.summary?.approvedLeaves || [],
            notes: response.data.summary?.notes || [],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching events summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get events for today's display
  const todayBirthdays = todayEvents.filter(e => e.type === "dob");
  const todayHolidays = todayEvents.filter(e => e.type === "companyHoliday");
  const todayWorkAnniversaries = todayEvents.filter(e => e.type === "doj");
  const todayClientHolidays = todayEvents.filter(e => e.type === "clientHoliday");
  const todayNotes = todayEvents.filter(e => e.type === "note");

  if (loading) {
    return <div>Loading calendar...</div>;
  }

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
                  selectedFilters.dob ? "btn-info" : "btn-outline-info"
                }`}
                onClick={() => toggleFilter("dob")}
              >
                Birthday
              </button>

              <button
                className={`btn btn-xs me-1 mb-1 ${
                  selectedFilters.doj ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => toggleFilter("doj")}
              >
                Work Anniversary
              </button>

              <button
                className={`btn btn-xs me-1 mb-1 ${
                  selectedFilters.companyHoliday
                    ? "btn-danger"
                    : "btn-outline-danger"
                }`}
                onClick={() => toggleFilter("companyHoliday")}
              >
                Holiday
              </button>

              {(userRole === "admin" || userRole === "manager") && (
                <button
                  className={`btn btn-xs me-1 mb-1 ${
                    selectedFilters.clientHoliday
                      ? "btn-warning"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => toggleFilter("clientHoliday")}
                >
                  Client Holiday
                </button>
              )}

              {userRole === "admin" && (
                <button
                  className={`btn btn-xs mb-1 ${
                    selectedFilters.note ? "btn-secondary" : "btn-outline-secondary"
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
              <h5 className="mb-0 me-2">
                {allMonths 
                  ? currentYear 
                  : selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h5>
              <div className="d-flex">
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={handlePrevClick}
                >
                  &lt;
                </button>
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={handleTodayClick}
                >
                  Today
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={handleNextClick}
                >
                  &gt;
                </button>
              </div>
            </div>
            <div className="d-flex gap-1 align-items-center mb-2">
              <select
                className="form-select form-select-sm"
                value={allMonths ? "all" : "month"}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setAllMonths(true);
                  } else {
                    setAllMonths(false);
                  }
                }}
                style={{ width: "120px" }}
              >
                <option value="month">Month</option>
                <option value="all">All Months</option>
              </select>
              {!allMonths && (
                <>
                  <select
                    className="form-select form-select-sm"
                    value={selectedDate.getMonth()}
                    onChange={(e) => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(parseInt(e.target.value));
                      setSelectedDate(newDate);
                      setCurrentMonth(newDate.getMonth() + 1);
                    }}
                    style={{ width: "120px" }}
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
                    className="form-select form-select-sm"
                    value={selectedDate.getFullYear()}
                    onChange={(e) => {
                      const newDate = new Date(selectedDate);
                      newDate.setFullYear(parseInt(e.target.value));
                      setSelectedDate(newDate);
                      setCurrentYear(newDate.getFullYear());
                    }}
                    style={{ width: "100px" }}
                  >
                    {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mb-3 d-flex flex-wrap gap-1 table-gradient-bg">
            {selectedFilters.dob && (
              <span className="badge bg-info me-1">Birthday</span>
            )}
            {selectedFilters.doj && (
              <span className="badge bg-success me-1">Work Anniversary</span>
            )}
            {selectedFilters.companyHoliday && (
              <span className="badge bg-danger me-1">Holiday</span>
            )}
            {selectedFilters.clientHoliday && (
              <span className="badge bg-warning me-1">Client Holiday</span>
            )}
            {selectedFilters.note && (
              <span className="badge bg-secondary me-1">Notes</span>
            )}
          </div>

          <div className="table-responsive table-gradient-bg">
            {allMonths ? (
              // Year view - 12 months grid
              <div className="year-view">
                <div className="row">
                  {calendarGrid.map((monthData, monthIndex) => (
                    <div key={monthIndex} className="col-md-4 col-sm-6 mb-4">
                      <h5 className="text-center mb-2">{monthData.monthName}</h5>
                      <table className="table table-bordered table-sm text-center">
                        <thead>
                          <tr>
                            {weekdays.map((day) => (
                              <th key={day} style={{ fontSize: "0.75rem" }}>{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {monthData.weeks.map((week, weekIndex) => (
                            <tr key={weekIndex}>
                              {week.map((day, dayIndex) => (
                                <td
                                  key={dayIndex}
                                  className={`p-1 ${day ? "" : ""} ${
                                    day && isToday(day) ? "today-cell" : ""
                                  }`}
                                  style={{ height: "40px" }}
                                  onClick={() => day && openHolidayModal(day)}
                                >
                                  {day ? (
                                    <div className="d-flex flex-column h-100">
                                      <div
                                        className={`fw-bold small ${
                                          isToday(day) ? "text-white" : ""
                                        }`}
                                      >
                                        {day.getDate()}
                                      </div>
                                      <div className="d-flex flex-wrap justify-content-center gap-1 mt-auto">
                                        {getFilteredEvents(day).map((event, idx) => (
                                          <span
                                            key={idx}
                                            className={`badge ${event.color} text-white`}
                                            style={{ 
                                              fontSize: "0.6rem", 
                                              padding: "2px 4px",
                                              width: "8px",
                                              height: "8px",
                                              borderRadius: "50%"
                                            }}
                                            title={
                                              event.title
                                            }
                                          ></span>
                                        ))}
                                      </div>
                                    </div>
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
                  ))}
                </div>
              </div>
            ) : (
              // Month view
              <table className="table table-bordered text-center">
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
                    {weekdays.map((day) => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calendarGrid.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                      {week.map((day, dayIndex) => (
                        <td
                          key={dayIndex}
                          className={`p-1 ${day ? "" : ""} ${
                            day && isToday(day) ? "today-cell" : ""
                          }`}
                          style={{ height: "100px", width: "14.28%" }}
                          onClick={() => day && openHolidayModal(day)}
                        >
                          {day ? (
                            <div className="d-flex flex-column h-100">
                              <div
                                className={`fw-bold ${
                                  isToday(day) ? "text-white" : ""
                                }`}
                              >
                                {day.getDate()}
                              </div>
                              <div className="d-flex flex-column gap-1 mt-auto">
                                {getFilteredEvents(day).map((event, idx) => (
                                  <span
                                    key={idx}
                                    className={`badge ${event.color} text-white text-truncate`}
                                    style={{ fontSize: "0.7rem" }}
                                    title={
                                      event.title
                                    }
                                  >
                                    {event.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="col-4">
          <div
            className="bg-card bg-white shadow-sm p-3"
            style={{ maxWidth: "400px" }}
          >
            <h5 className="mb-3 fw-bold">Events Today</h5>

            {/* Birthdays */}
            {todayBirthdays.length > 0 && (
              <>
                <h6 className="text-info fw-bold">Birthdays</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm mb-4 table-gradient-bg">
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
                        <th>Name</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayBirthdays.map((event, idx) => (
                        <tr key={idx}>
                          <td>{event.details}</td>
                          <td>{moment(event.date).format("MMM D, YYYY")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Work Anniversaries */}
            {todayWorkAnniversaries.length > 0 && (
              <>
                <h6 className="text-success fw-bold">Work Anniversaries</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm mb-4 table-gradient-bg">
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
                        <th>Name</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayWorkAnniversaries.map((event, idx) => (
                        <tr key={idx}>
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
            {todayHolidays.length > 0 && (
              <>
                <h6 className="text-danger fw-bold">Holidays</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm table-gradient-bg">
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
                        <th>Title</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayHolidays.map((event, idx) => (
                        <tr key={idx}>
                          <td>{event.title}</td>
                          <td>{moment(event.date).format("MMM D, YYYY")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Client Holidays */}
            {todayClientHolidays.length > 0 && (
              <>
                <h6 className="text-warning fw-bold">Client Holidays</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm table-gradient-bg">
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
                        <th>Title</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayClientHolidays.map((event, idx) => (
                        <tr key={idx}>
                          <td>{event.title}</td>
                          <td>{moment(event.date).format("MMM D, YYYY")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Notes */}
            {todayNotes.length > 0 && (
              <>
                <h6 className="text-secondary fw-bold">Notes</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm table-gradient-bg">
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
                        <th>Title</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayNotes.map((event, idx) => (
                        <tr key={idx}>
                          <td>{event.title}</td>
                          <td>{moment(event.date).format("MMM D, YYYY")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {todayBirthdays.length === 0 && 
             todayWorkAnniversaries.length === 0 && 
             todayHolidays.length === 0 && 
             todayClientHolidays.length === 0 && 
             todayNotes.length === 0 && (
              <p className="text-muted">No events for today.</p>
            )}
          </div>
        </div>
      </div>

      {/* Events Summary Table */}
      <div className="mt-4 p-3 rounded shadow table-gradient-bg">
        <h4 className="gradient-heading mb-3">
          Events Summary for {allMonths ? currentYear : selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h4>

        {allMonths ? (
          // Yearly summary - show all months
          <div>
            {Object.entries(eventsData).map(([month, data]) => (
              <div key={month} className="mb-4">
                <h5 className="text-primary">
                  {new Date(currentYear, month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h5>
                
                {/* Birthdays Table */}
                {selectedFilters.dob && data.birthdays.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-info">Birthdays</h6>
                    <Table striped bordered hover responsive size="sm">
                      <thead>
                        <tr>
                          <th style={{ width: "60%", textAlign: "left" }}>Employee</th>
                          <th style={{ width: "40%", textAlign: "left" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.birthdays.map((event, index) => (
                          <tr key={`dob-${month}-${index}`}>
                            <td style={{ textAlign: "left" }}>{event.name}</td>
                            <td style={{ textAlign: "left" }}>
                              {formatDate(event.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                {/* Work Anniversaries Table */}
                {selectedFilters.doj && data?.joiningDates?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-success">Work Anniversaries</h6>
                    <Table striped bordered hover responsive size="sm">
                      <thead>
                        <tr>
                          <th style={{ width: "60%", textAlign: "left" }}>Employee</th>
                          <th style={{ width: "40%", textAlign: "left" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.joiningDates.map((event, index) => (
                          <tr key={`doj-${month}-${index}`}>
                            <td style={{ textAlign: "left" }}>{event.name}</td>
                            <td style={{ textAlign: "left" }}>
                              {formatDate(event.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                {/* Company Holidays Table */}
                {selectedFilters.companyHoliday && data.companyHolidays.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-danger">Holidays</h6>
                    <Table striped bordered hover responsive size="sm">
                      <thead>
                        <tr>
                          <th style={{ width: "60%", textAlign: "left" }}>Title</th>
                          <th style={{ width: "40%", textAlign: "left" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.companyHolidays.map((event, index) => (
                          <tr key={`holiday-${month}-${index}`}>
                            <td style={{ textAlign: "left" }}>{event.name}</td>
                            <td style={{ textAlign: "left" }}>
                              {formatDate(event.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                {/* Notes Table */}
                {selectedFilters.note && data.notes.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-secondary">Notes</h6>
                    <Table striped bordered hover responsive size="sm">
                      <thead>
                        <tr>
                          <th style={{ width: "60%", textAlign: "left" }}>Title</th>
                          <th style={{ width: "40%", textAlign: "left" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.notes.map((event, index) => (
                          <tr key={`note-${month}-${index}`}>
                            <td style={{ textAlign: "left" }}>{event.name}</td>
                            <td style={{ textAlign: "left" }}>
                              {formatDate(event.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                {data.birthdays.length === 0 && 
                 data.joiningDates.length === 0 && 
                 data.companyHolidays.length === 0 && 
                 data.notes.length === 0 && (
                  <p className="text-muted">No events found for this month.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Monthly summary
          <>
            {/* Birthdays Table */}
            {selectedFilters.dob && (
              <div className="mb-4">
                <h5 className="text-info">Birthdays</h5>
                <Table striped bordered hover responsive>
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
                      <th style={{ width: "60%", textAlign: "left" }}>Employee</th>
                      <th style={{ width: "40%", textAlign: "left" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsData.birthdays.map((event, index) => (
                      <tr key={`dob-${index}`}>
                        <td style={{ textAlign: "left" }}>{event.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {formatDate(event.date)}
                        </td>
                      </tr>
                    ))}
                    {eventsData.birthdays.length === 0 && (
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
              <div className="mb-4">
                <h5 className="text-danger">Holidays</h5>
                <Table striped bordered hover responsive>
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
                      <th style={{ width: "60%", textAlign: "left" }}>Title</th>
                      <th style={{ width: "40%", textAlign: "left" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsData.companyHolidays.map((event, index) => (
                      <tr key={`holiday-${index}`}>
                        <td style={{ textAlign: "left" }}>{event.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {formatDate(event.date)}
                        </td>
                      </tr>
                    ))}
                    {eventsData.companyHolidays.length === 0 && (
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
                    variant="danger"
                    onClick={() => openHolidayModal()}
                    className="mt-2"
                  >
                    Add Holiday
                  </Button>
                )}
              </div>
            )}

            {/* Work Anniversaries Table */}
            <div className="mb-4">
              <h5 className="text-success">Work Anniversaries</h5>
              <Table striped bordered hover responsive>
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
                    <th style={{ width: "60%", textAlign: "left" }}>Employee</th>
                    <th style={{ width: "40%", textAlign: "left" }}>
                      Joining Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventsData.joiningDates.map((event, index) => (
                    <tr key={`doj-${index}`}>
                      <td style={{ textAlign: "left" }}>{event.name}</td>
                      <td style={{ textAlign: "left" }}>
                        {formatDate(event.date)}
                      </td>
                    </tr>
                  ))}
                  {eventsData.joiningDates.length === 0 && (
                    <tr>
                      <td colSpan="2" className="text-muted text-center">
                        No work anniversaries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* Notes Table */}
            {selectedFilters.note && (
              <div className="mb-4">
                <h5 className="text-secondary">Notes</h5>
                <Table striped bordered hover responsive>
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
                      <th>Title</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsData.notes.map((event, index) => (
                      <tr key={`note-${index}`}>
                        <td>{event.name}</td>
                        <td>{formatDate(event.date)}</td>
                      </tr>
                    ))}
                    {eventsData.notes.length === 0 && (
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
          </>
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
            {editingHolidayId ? "Edit Holiday" : "Add Holiday"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <Form onSubmit={saveHoliday}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter holiday title"
                value={holidayTitle}
                onChange={(e) => setHolidayTitle(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowHolidayModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={saveHoliday}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (editingHolidayId ? "Update" : "Save")}
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
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <Form onSubmit={handleAddEventSave}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={addEventDate}
                onChange={(e) => setAddEventDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type of Event</Form.Label>
              <Form.Select
                value={addEventType}
                onChange={(e) => setAddEventType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="dob">Birthday</option>
                <option value="doj">Work Anniversary</option>
                <option value="companyHoliday">Holiday</option>
                <option value="clientHoliday">Client Holiday</option>
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
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddEventModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddEventSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
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
        .form-select-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
          height: calc(1.5em + 0.5rem + 2px);
          border-radius: 0.2rem;
        }
      `}</style>
    </div>
  );
};

export default Calendar;