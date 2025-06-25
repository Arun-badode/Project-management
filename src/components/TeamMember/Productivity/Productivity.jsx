import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Productivity = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeFilter, setTimeFilter] = useState('Day');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const timeDistributionChartRef = useRef(null);
  const productivityTrendChartRef = useRef(null);
  const focusTimeChartRef = useRef(null);

  // Update date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Initialize charts
  useEffect(() => {
    if (!timeDistributionChartRef.current || !productivityTrendChartRef.current || !focusTimeChartRef.current) return;

    // Time Distribution Chart
    const timeDistributionChart = echarts.init(timeDistributionChartRef.current);
    const timeDistributionOption = {
      animation: false,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} hrs ({d}%)'
      },
      legend: {
        orient: isMobile ? 'horizontal' : 'vertical',
        right: isMobile ? 'center' : 10,
        top: isMobile ? 'bottom' : 'center',
        data: ['Development', 'Meetings', 'Planning', 'Research', 'Breaks']
      },
      series: [
        {
          name: 'Time Spent',
          type: 'pie',
          radius: isMobile ? ['40%', '60%'] : ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center',
            fontSize: isMobile ? 12 : 14
          },
          emphasis: {
            label: {
              show: true,
              fontSize: isMobile ? 14 : 18,
              fontWeight: 'bold'
            }
          },
          labelLine: { show: false },
          data: [
            { value: 3.5, name: 'Development', itemStyle: { color: '#4CAF50' } },
            { value: 2, name: 'Meetings', itemStyle: { color: '#2196F3' } },
            { value: 1.5, name: 'Planning', itemStyle: { color: '#9C27B0' } },
            { value: 2, name: 'Research', itemStyle: { color: '#FF9800' } },
            { value: 1, name: 'Breaks', itemStyle: { color: '#F44336' } }
          ]
        }
      ]
    };
    timeDistributionChart.setOption(timeDistributionOption);

    // Productivity Trend Chart
    const productivityTrendChart = echarts.init(productivityTrendChartRef.current);
    const productivityTrendOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      grid: {
        left: isMobile ? '10%' : '12%',
        right: '5%',
        bottom: isMobile ? '20%' : '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: { lineStyle: { color: '#999' } },
        axisLabel: {
          fontSize: isMobile ? 10 : 12
        }
      },
      yAxis: {
        type: 'value',
        name: 'Hours',
        min: 0,
        max: 10,
        axisLine: { lineStyle: { color: '#999' } },
        axisLabel: {
          fontSize: isMobile ? 10 : 12
        }
      },
      series: [
        {
          name: 'Productive Hours',
          type: 'bar',
          data: [7.5, 8.2, 6.8, 9.0, 8.5, 4.2, 3.8],
          itemStyle: { color: '#3498db' },
          barWidth: isMobile ? '30%' : '50%'
        }
      ]
    };
    productivityTrendChart.setOption(productivityTrendOption);

    // Focus Time Chart
    const focusTimeChart = echarts.init(focusTimeChartRef.current);
    const focusTimeOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      grid: {
        left: isMobile ? '10%' : '12%',
        right: '5%',
        bottom: isMobile ? '20%' : '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM'],
        axisLine: { lineStyle: { color: '#999' } },
        axisLabel: {
          fontSize: isMobile ? 10 : 12
        }
      },
      yAxis: {
        type: 'value',
        name: 'Focus Score',
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: '#999' } },
        axisLabel: {
          fontSize: isMobile ? 10 : 12
        }
      },
      series: [
        {
          name: 'Focus Score',
          type: 'line',
          smooth: true,
          data: [65, 85, 70, 60, 90, 75],
          itemStyle: { color: '#9b59b6' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(155, 89, 182, 0.6)' },
                { offset: 1, color: 'rgba(155, 89, 182, 0.1)' }
              ]
            }
          }
        }
      ]
    };
    focusTimeChart.setOption(focusTimeOption);

    const handleResize = () => {
      timeDistributionChart.resize();
      productivityTrendChart.resize();
      focusTimeChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      timeDistributionChart.dispose();
      productivityTrendChart.dispose();
      focusTimeChart.dispose();
    };
  }, [isMobile]);

  // Timeline data
  const timeline = [
    { time: '8:00 AM - 9:30 AM', task: 'Project Planning', category: 'Planning', color: 'bg-primary' },
    { time: '9:45 AM - 11:00 AM', task: 'Team Meeting', category: 'Meetings', color: 'bg-info' },
    { time: '11:15 AM - 12:30 PM', task: 'Development', category: 'Development', color: 'bg-success' },
    { time: '1:30 PM - 3:00 PM', task: 'Research', category: 'Research', color: 'bg-warning' },
    { time: '3:15 PM - 5:00 PM', task: 'Development', category: 'Development', color: 'bg-success' },
    { time: '5:15 PM - 6:00 PM', task: 'Code Review', category: 'Development', color: 'bg-success' }
  ];

  // Summary cards data
  const summaryCards = [
    {
      icon: 'bi-clock',
      title: 'Hours Worked Today',
      value: '8.5',
      trend: '12%',
      trendUp: true,
      progress: 85,
      color: 'primary',
      text: '85% of daily target (10 hours)'
    },
    {
      icon: 'bi-bar-chart-line',
      title: 'Weekly Productivity Score',
      value: '87',
      trend: '5%',
      trendUp: true,
      progress: 87,
      color: 'success',
      text: 'Above average performance'
    },
    {
      icon: 'bi-list-check',
      title: 'Tasks Completed',
      value: '12',
      trend: '3%',
      trendUp: false,
      progress: 75,
      color: 'info',
      text: '12 of 16 planned tasks'
    },
    {
      icon: 'bi-bullseye',
      title: 'Focus Time',
      value: '5.2',
      trend: '8%',
      trendUp: true,
      progress: 65,
      color: 'warning',
      text: '5.2 hours of deep focus'
    }
  ];

  return (
    <div className="p-3">
      {/* Header Section */}


      <div className=""  >
        <header className="mb-4">
          <h2 className="gradient-heading">Productivity</h2>
          <p className="text-white">

          </p>
        </header>
        {/* Filter Controls */}
        <div className="mb-4 bg-card rounded shadow-sm p-3">
          <div className="row gy-2  align-items-center">
            <div className="col-12  col-md-4">
              <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                <span className="fw-semibold  small">Time Period:</span>
                <div className="btn-group w-100" role="group">
                  {['Day', 'Week', 'Month'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      className={`btn btn-sm ${timeFilter === period ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1`}
                      onClick={() => setTimeFilter(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-8">
              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-md-end gap-2">
                <div className="d-flex align-items-center w-100">
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    defaultValue="2025-06-19"
                  />
                  <button className="btn btn-sm btn-primary ms-2 flex-shrink-0">
                    <i className="bi bi-download me-1"></i>
                    <span className="d-none d-sm-inline">Export Data</span>
                    <span className="d-inline d-sm-none">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Dashboard */}
        <div className="row g-3 mb-4">
          {summaryCards.map((card, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-3">
              <div className="bg-card rounded shadow-sm p-3 h-100">
                <div className="d-flex align-items-center">
                  <div className={`rounded-circle bg-${card.color}-subtle d-flex align-items-center justify-content-center me-3`} style={{ width: 48, height: 48 }}>
                    <i className={`bi ${card.icon} text-${card.color} fs-4`}></i>
                  </div>
                  <div>
                    <div className=" small">{card.title}</div>
                    <div className="h4 mb-0">{card.value}</div>
                    <span className={`small ${card.trendUp ? 'text-success' : 'text-danger'}`}>
                      <i className={`bi bi-arrow-${card.trendUp ? 'up' : 'down'} me-1`}></i>
                      {card.trend}
                    </span>
                  </div>
                </div>
                <div className="progress mt-3" style={{ height: 8 }}>
                  <div
                    className={`progress-bar bg-${card.color}`}
                    style={{ width: `${card.progress}%` }}
                    role="progressbar"
                    aria-valuenow={card.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className=" small mt-2">{card.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Time Distribution Chart & Timeline */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-8">
            <div className="bg-card rounded shadow-sm p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Time Distribution</h5>
                <div className="dropdown">
                  <button className="btn btn-sm text-white dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    View Details
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item">Daily</button></li>
                    <li><button className="dropdown-item">Weekly</button></li>
                    <li><button className="dropdown-item">Monthly</button></li>
                  </ul>
                </div>
              </div>
              <div
                ref={timeDistributionChartRef}
                style={{
                  color: 'white',
                  height: isMobile ? 300 : 400,
                  width: '100%',
                  minWidth: 0
                }}
              ></div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="bg-card rounded shadow-sm p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Today's Timeline</h5>
                {/* <button className="btn btn-sm btn-outline-primary">
                  <i className="bi bi-plus"></i> Add Task
                </button> */}
              </div>
              <div className="d-flex flex-column gap-3">
                {timeline.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-start">
                    <div className="rounded-circle border border-2 border-secondary bg-white mt-1 flex-shrink-0" style={{ width: 16, height: 16 }}></div>
                    <div className="ms-3 flex-grow-1">
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
                        <span className="fw-semibold small">{item.time}</span>
                        <span className={`badge ${item.color} text-white mt-1 mt-sm-0`}>{item.category}</span>
                      </div>
                      <div className="small text-secondary">{item.task}</div>
                      <div className="progress mt-1" style={{ height: 6 }}>
                        <div
                          className={`progress-bar ${item.color}`}
                          style={{ width: `${Math.random() * 40 + 60}%` }}
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="row g-3">
          <div className="col-12 col-md-6 mb-2">
            <div className="bg-card rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Weekly Productivity Trend</h5>
              <div
                ref={productivityTrendChartRef}
                style={{
                  height: 300,
                  width: '100%',
                  minWidth: 0
                }}
              ></div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <div className="bg-card rounded shadow-sm p-3 h-100">
              <h5 className="">Focus Time by Hour</h5>
              <div
                ref={focusTimeChartRef}
                style={{
                  height: 300,
                  width: '100%',
                  minWidth: 0
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productivity;