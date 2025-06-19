import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  
  // Current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Team data
  const teamData = {
    totalMembers: 48,
    presentToday: 42,
    lateArrivals: 3,
    absentMembers: 3
  };
  
  // Department options
  const departments = ['All', 'Engineering', 'Design', 'Marketing', 'HR', 'Finance'];
  
  // Team members data
  const teamMembers = [
    { id: 1, name: 'Alex Johnson', department: 'Engineering', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'Present', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20male%20with%20short%20brown%20hair%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=1&orientation=squarish' },
    { id: 2, name: 'Sarah Williams', department: 'Design', checkIn: '09:02 AM', checkOut: '06:15 PM', status: 'Present', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20female%20with%20medium%20length%20blonde%20hair%20wearing%20business%20casual%20attire%20smiling%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=2&orientation=squarish' },
    { id: 3, name: 'Michael Chen', department: 'Engineering', checkIn: '10:15 AM', checkOut: '07:00 PM', status: 'Late', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20male%20with%20black%20hair%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=3&orientation=squarish' },
    { id: 4, name: 'Emily Rodriguez', department: 'Marketing', checkIn: '--:-- --', checkOut: '--:-- --', status: 'Absent', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latina%20female%20with%20dark%20hair%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=4&orientation=squarish' },
    { id: 5, name: 'David Wilson', department: 'HR', checkIn: '08:45 AM', checkOut: '05:50 PM', status: 'Present', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20male%20with%20glasses%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=5&orientation=squarish' },
    { id: 6, name: 'Jessica Taylor', department: 'Finance', checkIn: '09:30 AM', checkOut: '06:45 PM', status: 'Late', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20female%20with%20red%20hair%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=6&orientation=squarish' },
    { id: 7, name: 'Robert Brown', department: 'Engineering', checkIn: '08:50 AM', checkOut: '05:45 PM', status: 'Present', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20african%20american%20male%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=7&orientation=squarish' },
    { id: 8, name: 'Lisa Martinez', department: 'Design', checkIn: '--:-- --', checkOut: '--:-- --', status: 'Absent', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latina%20female%20with%20long%20dark%20hair%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=8&orientation=squarish' },
    { id: 9, name: 'James Lee', department: 'Marketing', checkIn: '08:40 AM', checkOut: '05:30 PM', status: 'Present', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20male%20with%20glasses%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=9&orientation=squarish' },
    { id: 10, name: 'Amanda Clark', department: 'Finance', checkIn: '09:50 AM', checkOut: '06:30 PM', status: 'Late', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20female%20with%20brown%20hair%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=10&orientation=squarish' },
    { id: 11, name: 'Thomas Wright', department: 'HR', checkIn: '--:-- --', checkOut: '--:-- --', status: 'Absent', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20male%20with%20salt%20and%20pepper%20hair%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=11&orientation=squarish' },
    { id: 12, name: 'Sophia Kim', department: 'Engineering', checkIn: '08:55 AM', checkOut: '05:45 PM', status: 'Present', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20female%20with%20black%20hair%20wearing%20business%20casual%20attire%20looking%20directly%20at%20camera%20with%20neutral%20background%20perfect%20for%20corporate%20profile&width=60&height=60&seq=12&orientation=squarish' },
  ];
  
  // Filter team members based on search and department
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });
  
  // Calendar generation
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Get number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();
      
      // Random attendance status for demonstration
      let status;
      if (isWeekend) {
        status = 'weekend';
      } else if (date > today) {
        status = 'future';
      } else {
        const rand = Math.random();
        if (rand < 0.8) status = 'present';
        else if (rand < 0.9) status = 'late';
        else status = 'absent';
      }
      
      days.push({ day: i, isWeekend, isToday, status });
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  // Month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Initialize charts when component mounts
  useEffect(() => {
    // Attendance trends chart
    const trendsChart = echarts.init(document.getElementById('attendance-trends-chart'));
    const trendsOption = {
      animation: false,
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Present', 'Late', 'Absent'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Present',
          type: 'line',
          stack: 'Total',
          data: [42, 40, 44, 42],
          color: '#10B981'
        },
        {
          name: 'Late',
          type: 'line',
          stack: 'Total',
          data: [3, 5, 2, 3],
          color: '#F59E0B'
        },
        {
          name: 'Absent',
          type: 'line',
          stack: 'Total',
          data: [3, 3, 2, 3],
          color: '#EF4444'
        }
      ]
    };
    trendsChart.setOption(trendsOption);

    // Leave distribution chart
    const leaveChart = echarts.init(document.getElementById('leave-distribution-chart'));
    const leaveOption = {
      animation: false,
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0
      },
      series: [
        {
          name: 'Leave Type',
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
              fontSize: '12',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 15, name: 'Vacation', itemStyle: { color: '#3B82F6' } },
            { value: 8, name: 'Sick Leave', itemStyle: { color: '#8B5CF6' } },
            { value: 5, name: 'Personal', itemStyle: { color: '#EC4899' } },
            { value: 3, name: 'Other', itemStyle: { color: '#6B7280' } }
          ]
        }
      ]
    };
    leaveChart.setOption(leaveOption);

    // Resize charts when window resizes
    const handleResize = () => {
      trendsChart.resize();
      leaveChart.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      trendsChart.dispose();
      leaveChart.dispose();
    };
  }, []);

  return (
    <div className="min-vh-100 bg-main text-white">
      {/* Header */}
      <header className=" shadow-sm">
        <div className="container-fluid py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-0 ">Team Attendance</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 gap-2">
                  <li className="breadcrumb-item">Dashboard </li>
                  <li className="active text-white gap-" >/ Attendance</li>
                </ol>
              </nav>
            </div>
            <div className="text-end">
              <div className=" small">Today</div>
              <div className="fw-medium">{formattedDate}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid py-4">
        {/* Daily Overview Section */}
        <section className="mb-4">
          <h2 className="h4 mb-3">Daily Overview</h2>
          <div className="row g-3 ">
            <div className="col-md-6 col-lg-3 " >
              <div className=" rounded shadow-sm p-4 h-100 bg-card">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-primary ">
                    <i className="fas fa-users fs-5"></i>
                  </div>
                  <div className="ms-3">
                    <p className=" small mb-1">Total Team Members</p>
                    <p className="h4 mb-0 fw-semibold">{teamData.totalMembers}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="bg-white rounded shadow-sm p-4 h-100 bg-card">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-success ">
                    <i className="fas fa-check-circle fs-5"></i>
                  </div>
                  <div className="ms-3">
                    <p className=" small mb-1">Present Today</p>
                    <p className="h4 mb-0 fw-semibold">{teamData.presentToday}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="bg-white rounded shadow-sm p-4 h-100 bg-card">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-warning ">
                    <i className="fas fa-clock fs-5"></i>
                  </div>
                  <div className="ms-3">
                    <p className=" small mb-1">Late Arrivals</p>
                    <p className="h4 mb-0 fw-semibold">{teamData.lateArrivals}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="bg-white rounded shadow-sm p-4 h-100 bg-card ">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle bg-danger ">
                    <i className="fas fa-times-circle fs-5"></i>
                  </div>
                  <div className="ms-3">
                    <p className=" small mb-1">Absent Members</p>
                    <p className="h4 mb-0 fw-semibold">{teamData.absentMembers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="row g-4">
          {/* Monthly Calendar View */}
          <section className="col-lg-8">
            <div className="bg-white rounded shadow-sm p-4 h-100 bg-card ">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Monthly Calendar</h2>
                <div className="d-flex align-items-center">
                  <button 
                    onClick={prevMonth}
                    className="btn btn-sm btn-outline-secondary me-2"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <span className="fw-medium px-2">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={nextMonth}
                    className="btn btn-sm btn-outline-secondary ms-2"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              <div className="row row-cols-7  mb-2 bg-card">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={index} className="col text-center fw-medium small py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="row row-cols-5">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`col p-1 border rounded d-flex flex-column ${!day ? 'bg-card' : ''} 
                      ${day?.isWeekend ? 'bg-card' : ''}
                      ${day?.isToday ? 'border-primary border-2' : 'border-light'}`}
                    style={{ height: '60px' }}
                  >
                    {day && (
                      <>
                        <span className={`small ${day.isToday ? 'fw-bold bg-card' : ''}`}>{day.day}</span>
                        {!day.isWeekend && day.status !== 'future' && (
                          <div className="mt-auto">
                            <span 
                              className={`w-100 d-block rounded mt-1 
                                ${day.status === 'present' ? 'bg-success' : ''}
                                ${day.status === 'late' ? 'bg-warning' : ''}
                                ${day.status === 'absent' ? 'bg-danger' : ''}`}
                              style={{ height: '4px' }}
                            ></span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="d-flex justify-content-center mt-3 small">
                <div className="d-flex align-items-center me-3">
                  <span className="d-inline-block rounded me-1 bg-success" style={{ width: '12px', height: '12px' }}></span>
                  <span>Present</span>
                </div>
                <div className="d-flex align-items-center me-3">
                  <span className="d-inline-block rounded me-1 bg-warning" style={{ width: '12px', height: '12px' }}></span>
                  <span>Late</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="d-inline-block rounded me-1 bg-danger" style={{ width: '12px', height: '12px' }}></span>
                  <span>Absent</span>
                </div>
              </div>
            </div>
          </section>

          {/* Attendance Summary */}
          <section className="col-lg-4">
            <div className="bg-card rounded shadow-sm p-4 h-100">
              <h2 className="h4 mb-3">Attendance Summary</h2>
              
              <div className="mb-4">
                <h3 className="small fw-medium text-muted mb-2">Attendance Trends</h3>
                <div id="attendance-trends-chart" style={{ height: '160px' }}></div>
              </div>
              
              <div>
                <h3 className="small fw-medium text-muted mb-2">Leave Distribution</h3>
                <div id="leave-distribution-chart" style={{ height: '160px' }}></div>
              </div>
              
              <button className="btn btn-link text-primary p-0 mt-3">
                <i className="fas fa-download me-2"></i>
                Export Report
              </button>
            </div>
          </section>
        </div>

        {/* Team Member List */}
        <section className="mt-4  rounded shadow-sm overflow-hidden">
          <div className="p-4 border-bottom">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-0">
              <h2 className="h4 mb-3 mb-md-0">Team Members</h2>
              
              <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                <div className="position-relative me-md-2 mb-2 mb-md-0 bg-card">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control ps-4 "
                    style={{ width: '100%', minWidth: '240px' }}
                  />
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                
                <div className="position-relative text-white">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="departmentDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {selectedDepartment} Departments
                  </button>
                  
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="departmentDropdown">
                    {departments.map((dept) => (
                      <li key={dept}>
                        <button 
                          className="dropdown-item" 
                          onClick={() => setSelectedDepartment(dept)}
                        >
                          {dept}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-hover mb-0 table-gradient-bg">
              <thead className="table-light">
                <tr>
                  <th scope="col">Employee</th>
                  <th scope="col">Department</th>
                  <th scope="col">Check-in</th>
                  <th scope="col">Check-out</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="rounded-circle me-3" 
                          width="40" 
                          height="40" 
                        />
                        <div>
                          <div className="fw-medium">{member.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{member.department}</td>
                    <td>{member.checkIn}</td>
                    <td>{member.checkOut}</td>
                    <td>
                      <span className={`badge 
                        ${member.status === 'Present' ? 'bg-success' : ''}
                        ${member.status === 'Late' ? 'bg-warning' : ''}
                        ${member.status === 'Absent' ? 'bg-danger' : ''}
                      `}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-3 border-top">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="text-muted small mb-2 mb-md-0">
                Showing <span className="fw-medium">{filteredMembers.length}</span> of <span className="fw-medium">{teamMembers.length}</span> team members
              </div>
              
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-secondary">
                  Previous
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Attendance;