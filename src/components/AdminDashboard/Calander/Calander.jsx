import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Calander = () => {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    birthdays: true,
    joinDates: true,
    companyHolidays: true,
    clientHolidays: true,
    approvedLeaves: true
  });

  // Mock data
  const users = [
    { id: 1, name: 'John Doe', dob: '1990-06-15', doj: '2020-03-10', role: 'Developer' },
    { id: 2, name: 'Jane Smith', dob: '1985-06-28', doj: '2018-07-05', role: 'Designer' },
    { id: 3, name: 'Robert Johnson', dob: '1992-07-03', doj: '2021-01-15', role: 'Manager' },
    { id: 4, name: 'Emily Davis', dob: '1988-06-20', doj: '2019-11-01', role: 'Product Owner' }
  ];

  const companyHolidays = [
    { id: 1, date: '2025-07-04', name: 'Independence Day' },
    { id: 2, date: '2025-06-19', name: 'Juneteenth' },
    { id: 3, date: '2025-09-02', name: 'Labor Day' }
  ];

  const clientHolidays = [
    { id: 1, date: '2025-06-30', name: 'Canada Day', client: 'Maple Tech' },
    { id: 2, date: '2025-07-14', name: 'Bastille Day', client: 'Paris Digital' }
  ];

  const approvedLeaves = [
    { id: 1, userId: 1, date: '2025-06-26', reason: 'Personal' },
    { id: 2, userId: 2, date: '2025-07-01', reason: 'Vacation' },
    { id: 3, userId: 3, date: '2025-06-27', reason: 'Family Event' }
  ];

  // Helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Create header row with days
    const headerRow = (
      <div className="row g-0 border-bottom sticky-top bg-white" style={{ zIndex: 10 }}>
        <div className="col p-2 fw-medium text-secondary">Time</div>
        {Array.from({ length: 7 }, (_, i) => {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          return (
            <div key={i} className="col p-2 text-center">
              <div className="fw-medium">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
              <div className="small text-muted">{day.getDate()}</div>
            </div>
          );
        })}
      </div>
    );

    // Create time slots
    const timeSlots = hours.map(hour => {
      const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;
      return (
        <div key={hour} className="row g-0 border-bottom">
          <div className="col p-2 small text-muted">{hourFormatted}</div>
          {Array.from({ length: 7 }, (_, dayIndex) => {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + dayIndex);
            const dateString = currentDay.toISOString().split('T')[0];
            
            // Get events for this day
            const events = [];
            if (filters.birthdays) {
              events.push(...users.filter(user => user.dob.substring(5) === dateString.substring(5))
                .map(user => ({ type: 'birthday', user, time: '00:00' })));
            }
            if (filters.joinDates) {
              events.push(...users.filter(user => user.doj.substring(5) === dateString.substring(5))
                .map(user => ({ type: 'join', user, time: '09:00' })));
            }
            if (filters.companyHolidays) {
              events.push(...companyHolidays.filter(holiday => holiday.date === dateString)
                .map(holiday => ({ type: 'company', holiday, time: '00:00' })));
            }
            if (filters.clientHolidays) {
              events.push(...clientHolidays.filter(holiday => holiday.date === dateString)
                .map(holiday => ({ type: 'client', holiday, time: '00:00' })));
            }
            if (filters.approvedLeaves) {
              events.push(...approvedLeaves.filter(leave => leave.date === dateString)
                .map(leave => ({ type: 'leave', leave, time: '00:00' })));
            }

            const hourEvents = events.filter(event => event.time.split(':')[0] === hour.toString().padStart(2, '0'));
            return (
              <div key={dayIndex} className="col p-1 min-height-3rem border-start position-relative">
                {hourEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`small p-1 mb-1 rounded ${
                      event.type === 'birthday' ? 'bg-primary bg-opacity-10 text-primary' :
                      event.type === 'join' ? 'bg-success bg-opacity-10 text-success' :
                      event.type === 'company' ? 'bg-danger bg-opacity-10 text-danger' :
                      event.type === 'client' ? 'bg-purple bg-opacity-10 text-purple' :
                      'bg-warning bg-opacity-10 text-warning'
                    }`}
                  >
                    {event.type === 'birthday' && `${event.user.name}'s Birthday`}
                    {event.type === 'join' && `${event.user.name}'s Anniversary`}
                    {event.type === 'company' && event.holiday.name}
                    {event.type === 'client' && `${event.holiday.name} (${event.holiday.client})`}
                    {event.type === 'leave' && `${users.find(u => u.id === event.leave.userId)?.name} - ${event.leave.reason}`}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      );
    });

    return (
      <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
        {headerRow}
        {timeSlots}
      </div>
    );
  };

  const renderCalendar = () => {
    if (view === 'week') {
      return renderWeekView();
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border bg-light"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];

      // Get events for this day
      const birthdays = users.filter(user => user.dob.substring(5) === dateString.substring(5));
      const joinDates = users.filter(user => user.doj.substring(5) === dateString.substring(5));
      const holidays = companyHolidays.filter(holiday => holiday.date === dateString);
      const clientHols = clientHolidays.filter(holiday => holiday.date === dateString);
      const leaves = approvedLeaves.filter(leave => leave.date === dateString);

      days.push(
        <div key={day} className={`h-32 border p-1 overflow-hidden ${date.toDateString() === new Date().toDateString() ? 'bg-primary bg-opacity-10' : ''}`}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className={`fw-medium ${date.toDateString() === new Date().toDateString() ? 'text-primary' : ''}`}>{day}</span>
            {date.getDay() === 0 || date.getDay() === 6 ? <span className="small text-danger">Weekend</span> : null}
          </div>
          <div className="space-y-1 small overflow-auto h-24">
            {filters.birthdays && birthdays.map(user => (
              <div key={`bday-${user.id}`} className="d-flex align-items-center p-1 rounded bg-primary bg-opacity-10 text-primary cursor-pointer text-nowrap">
                <i className="bi bi-balloon me-1"></i>
                <span>{user.name}'s Birthday</span>
              </div>
            ))}
            {filters.joinDates && joinDates.map(user => (
              <div key={`join-${user.id}`} className="d-flex align-items-center p-1 rounded bg-success bg-opacity-10 text-success cursor-pointer text-nowrap">
                <i className="bi bi-person-plus me-1"></i>
                <span>{user.name}'s Anniversary</span>
              </div>
            ))}
            {filters.companyHolidays && holidays.map(holiday => (
              <div key={`holiday-${holiday.id}`} className="d-flex align-items-center p-1 rounded bg-danger bg-opacity-10 text-danger cursor-pointer text-nowrap">
                <i className="bi bi-calendar-check me-1"></i>
                <span>{holiday.name}</span>
              </div>
            ))}
            {filters.clientHolidays && clientHols.map(holiday => (
              <div key={`client-${holiday.id}`} className="d-flex align-items-center p-1 rounded bg-purple bg-opacity-10 text-purple cursor-pointer text-nowrap">
                <i className="bi bi-globe me-1"></i>
                <span>{holiday.name} ({holiday.client})</span>
              </div>
            ))}
            {filters.approvedLeaves && leaves.map(leave => {
              const user = users.find(u => u.id === leave.userId);
              return (
                <div key={`leave-${leave.id}`} className="d-flex align-items-center p-1 rounded bg-warning bg-opacity-10 text-warning cursor-pointer text-nowrap">
                  <i className="bi bi-umbrella me-1"></i>
                  <span>{user?.name} - {leave.reason}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Toggle filters
  const toggleFilter = (filter) => {
    setFilters({
      ...filters,
      [filter]: !filters[filter]
    });
  };

  // Initialize chart
  useEffect(() => {
    const chartDom = document.getElementById('event-chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Event Distribution',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: users.length, name: 'Birthdays', itemStyle: { color: '#0d6efd' } },
              { value: users.length, name: 'Join Dates', itemStyle: { color: '#198754' } },
              { value: companyHolidays.length, name: 'Company Holidays', itemStyle: { color: '#dc3545' } },
              { value: clientHolidays.length, name: 'Client Holidays', itemStyle: { color: '#6f42c1' } },
              { value: approvedLeaves.length, name: 'Approved Leaves', itemStyle: { color: '#ffc107' } }
            ]
          }
        ]
      };
      myChart.setOption(option);
      
      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0 fw-semibold">Calendar</h1>
            <div className="d-flex gap-2">
              <button className="btn btn-primary shadow-sm text-nowrap">
                <i className="bi bi-shield-lock me-2"></i>Admin Controls
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-4">
        <div className="row g-4">
          {/* Calendar Section */}
          <div className="col-lg-9">
            <div className="card">
              {/* Calendar Controls */}
              <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <button onClick={prevMonth} className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <h2 className="h5 mb-0 fw-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button onClick={nextMonth} className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-chevron-right"></i>
                  </button>
                  <button onClick={goToToday} className="btn btn-sm btn-outline-secondary ms-2">
                    Today
                  </button>
                </div>
                <div className="btn-group">
                  <button
                    onClick={() => setView('month')}
                    className={`btn btn-sm ${view === 'month' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`btn btn-sm ${view === 'week' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setView('day')}
                    className={`btn btn-sm ${view === 'day' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    Day
                  </button>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="card-body">
                {view === 'week' ? (
                  renderCalendar()
                ) : (
                  <>
                    {/* Weekday Headers */}
                    <div className="row row-cols-7 g-2 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <div key={day} className={`col text-center fw-medium ${index === 0 || index === 6 ? 'text-danger' : ''}`}>
                          {day}
                        </div>
                      ))}
                    </div>
                    {/* Calendar Days */}
                    <div className="row row-cols-7 g-2">
                      {renderCalendar()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <div className="col-lg-3">
            <div className={`card ${showFilters ? '' : 'd-lg-block d-none'}`}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="h6 mb-0 fw-medium">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-sm d-lg-none"
                >
                  <i className={`bi bi-chevron-${showFilters ? 'up' : 'down'}`}></i>
                </button>
              </div>
              {showFilters && (
                <div className="card-body">
                  <div className="mb-4">
                    <h4 className="small fw-medium text-muted mb-3">Event Types</h4>
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="filter-birthdays"
                        checked={filters.birthdays}
                        onChange={() => toggleFilter('birthdays')}
                        className="form-check-input"
                      />
                      <label htmlFor="filter-birthdays" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-block rounded-circle bg-primary me-2" style={{ width: '12px', height: '12px' }}></span>
                        <span>Birthdays</span>
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="filter-joinDates"
                        checked={filters.joinDates}
                        onChange={() => toggleFilter('joinDates')}
                        className="form-check-input"
                      />
                      <label htmlFor="filter-joinDates" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-block rounded-circle bg-success me-2" style={{ width: '12px', height: '12px' }}></span>
                        <span>Join Dates</span>
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="filter-companyHolidays"
                        checked={filters.companyHolidays}
                        onChange={() => toggleFilter('companyHolidays')}
                        className="form-check-input"
                      />
                      <label htmlFor="filter-companyHolidays" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-block rounded-circle bg-danger me-2" style={{ width: '12px', height: '12px' }}></span>
                        <span>Company Holidays</span>
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="filter-clientHolidays"
                        checked={filters.clientHolidays}
                        onChange={() => toggleFilter('clientHolidays')}
                        className="form-check-input"
                      />
                      <label htmlFor="filter-clientHolidays" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-block rounded-circle bg-purple me-2" style={{ width: '12px', height: '12px' }}></span>
                        <span>Client Holidays</span>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="filter-approvedLeaves"
                        checked={filters.approvedLeaves}
                        onChange={() => toggleFilter('approvedLeaves')}
                        className="form-check-input"
                      />
                      <label htmlFor="filter-approvedLeaves" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-block rounded-circle bg-warning me-2" style={{ width: '12px', height: '12px' }}></span>
                        <span>Approved Leaves</span>
                      </label>
                    </div>
                  </div>
                  <div className="pt-3 border-top">
                    <h4 className="small fw-medium text-muted mb-3">Upcoming Events</h4>
                    <div className="d-grid gap-2">
                      <div className="bg-primary bg-opacity-10 p-2 rounded">
                        <div className="d-flex align-items-center">
                          <span className="d-inline-block rounded-circle bg-primary me-2" style={{ width: '8px', height: '8px' }}></span>
                          <span className="small fw-medium">Emily's Birthday</span>
                        </div>
                        <p className="small text-muted mt-1 mb-0">June 20, 2025</p>
                      </div>
                      <div className="bg-danger bg-opacity-10 p-2 rounded">
                        <div className="d-flex align-items-center">
                          <span className="d-inline-block rounded-circle bg-danger me-2" style={{ width: '8px', height: '8px' }}></span>
                          <span className="small fw-medium">Juneteenth</span>
                        </div>
                        <p className="small text-muted mt-1 mb-0">June 19, 2025</p>
                      </div>
                      <div className="bg-warning bg-opacity-10 p-2 rounded">
                        <div className="d-flex align-items-center">
                          <span className="d-inline-block rounded-circle bg-warning me-2" style={{ width: '8px', height: '8px' }}></span>
                          <span className="small fw-medium">John's Leave</span>
                        </div>
                        <p className="small text-muted mt-1 mb-0">June 26, 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Distribution Chart */}
        <div className="card mt-4">
          <div className="card-body">
            <h3 className="h5 fw-medium mb-3">Event Distribution</h3>
            <div id="event-chart" style={{ height: '256px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calander;