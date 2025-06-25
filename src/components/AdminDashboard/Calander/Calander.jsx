import React, { useState } from 'react';

const Calander = () => {
  const [currentMonth, setCurrentMonth] = useState('June 2025');
  const [selectedFilters, setSelectedFilters] = useState({
    dob: true,
    doj: true,
    companyHoliday: true,
    approvedLeave: true,
  });
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 5, 25));

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarData = [
    { date: 1, events: [{ type: 'dob', name: 'Michael Brown', color: 'bg-danger' }] },
    { date: 4, events: [{ type: 'companyHoliday', name: 'Company Holiday', color: 'bg-success' }] },
    { date: 8, events: [{ type: 'doj', name: 'Daniel Martinez', color: 'bg-primary' }] },
    { date: 15, events: [{ type: 'dob', name: 'Sophia Taylor', color: 'bg-warning' }] },
    { date: 17, events: [{ type: 'companyHoliday', name: 'Client Holiday', color: 'bg-success' }] },
    { date: 21, events: [{ type: 'doj', name: 'Robert Johnson', color: 'bg-primary' }] },
    { date: 25, events: [{ type: 'approvedLeave', name: 'Emma Davis', color: 'bg-warning' }] },
    { date: 29, events: [{ type: 'dob', name: 'David Wilson', color: 'bg-warning' }] },
    { date: 31, events: [{ type: 'approvedLeave', name: 'Emma Davis', color: 'bg-danger' }] },
  ];

  const toggleFilter = (filter) => {
    setSelectedFilters({ ...selectedFilters, [filter]: !selectedFilters[filter] });
  };

  const isToday = (dayDate) => {
    const today = new Date();
    return dayDate === today.getDate() && today.getMonth() === 5 && today.getFullYear() === 2025;
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  };

  const generateCalendarGrid = () => {
    const daysInMonth = 31;
    const firstDayOfMonth = 1;
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const rows = [];
    let cells = [];
    days.forEach((day, index) => {
      if (index % 7 === 0 && index > 0) {
        rows.push(cells);
        cells = [];
      }
      cells.push(day);
      if (index === days.length - 1) rows.push(cells);
    });
    return rows;
  };

  const calendarRows = generateCalendarGrid();

  return (
    <div className="container py-4 ">
      <div className=" p-3 rounded shadow bg-card">
        <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
          <h2 className='gradient-heading'>Calendar</h2>
          <div className='gap-2 '>
            <button className="btn btn-primary btn-sm me-2 mb-2" onClick={() => toggleFilter('dob')}>Date of Birth</button>
            <button className="btn btn-danger btn-sm me-2 mb-2" onClick={() => toggleFilter('doj')}>Date of Joining</button>
            <button className="btn btn-success btn-sm me-2 mb-2" onClick={() => toggleFilter('companyHoliday')}>Company Holiday</button>
            <button className="btn btn-warning btn-sm mb-2" onClick={() => toggleFilter('approvedLeave')}>Approved Leave</button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3 ">
          <button className="btn btn-sm btn-secondary" onClick={handleTodayClick}>Today</button>
          <h5>{currentMonth}</h5>
          <div className="d-flex gap-3">
            <select className="form-select form-select-sm " value={viewMode} onChange={e => setViewMode(e.target.value)}>
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            <select className="form-select form-select-sm " value={selectedDate.getMonth()} onChange={e => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(parseInt(e.target.value));
              setSelectedDate(newDate);
              setCurrentMonth(newDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
            }}>
              {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })).map((month, i) => (
                <option key={month} value={i}>{month}</option>
              ))}
            </select>
            <select className="form-select form-select-sm " value={selectedDate.getFullYear()} onChange={e => {
              const newDate = new Date(selectedDate);
              newDate.setFullYear(parseInt(e.target.value));
              setSelectedDate(newDate);
              setCurrentMonth(newDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
            }}>
              {Array.from({ length: 10 }, (_, i) => 2020 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive  table-gradient-bg ">
          <table className="table table-bordered text-center">
            <thead className="table">
              <tr>
                {weekdays.map(day => <th key={day}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {calendarRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((day, i) => (
                    <td key={i} className={day && isToday(day) ? 'bg-info text-white' : ''}>
                      <div className="fw-bold">{day || ''}</div>
                      <div className="d-flex flex-column gap-1">
                        {calendarData.filter(d => d.date === day).flatMap(d =>
                          d.events.filter(ev => selectedFilters[ev.type]).map((ev, idx) => (
                            <span key={idx} className={`badge ${ev.color} text-white`}>{ev.name}</span>
                          ))
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calander;