import React, { useState, useEffect, useMemo } from "react";
import { Button, Badge, Form, Spinner, Alert } from "react-bootstrap";
import moment from "moment";
import BASE_URL from "../../../config";

const ResourceTimeline = ({ userRole, userId }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & View
  const [userFilter, setUserFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [scale, setScale] = useState(1); // 0.75 (S), 1 (M), 1.5 (L)
  const [centerDate, setCenterDate] = useState(moment()); // center of timeline

  // Stage colors as per new spec
  const stageColors = {
    "YTS": "#6c757d",        // Light Grey — Task Assigned
    "WIP": "#00008b",        // Dark Blue — Work in Progress
    "QC YTS": "#20B2AA",    // Turquoise Blue — QA Assigned
    "QC WIP": "#90ee90",     // Light Green — QA WIP
    "Corr YTS": "#87CEFA",   // Light Blue — Correction Assigned
    "Corr WIP": "#800080",   // Purple — Correction WIP
    "RFD": "#006400",        // Dark Green — Ready for Delivery
    "Break": "#ffa500"       // Orange — Break/Pause
  };

  // Fetch data
  const fetchTimelineData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}project/getTimelineData`;
      if (userRole === "manager" && userId) {
        url += `?managerId=${userId}`;
      }
      const token = localStorage.getItem("authToken");
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === "true") {
        setTimelineData(result.data);
      } else {
        setError(result.message || "Failed to load timeline");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, [userRole, userId]);

  // Process raw timeline data → users with tasks and stages
  const processedData = useMemo(() => {
    const users = {};
    timelineData.forEach(task => {
      const uId = task.assigned_to.id;
      const uName = task.assigned_to.name || `User ${uId}`;
      const uTeam = task.assigned_to.team || "General";
      
      if (!users[uId]) {
        users[uId] = {
          id: uId,
          name: uName,
          role: task.assigned_to.role || "Team Member",
          team: uTeam,
          tasks: []
        };
      }

      // Build stage segments based on status logs (if available), or fallback to current status
      let stages = [];

      // Fallback: single stage (current status)
      const currentStatus = task.status || "YTS";
      const startDate = task.start_date || moment().subtract(3, 'days').toISOString();
      const endDate = task.end_date || null;

      stages.push({
        stage: currentStatus,
        start: startDate,
        end: endDate,
        color: stageColors[currentStatus] || "#6c757d"
      });

      users[uId].tasks.push({
        id: task.task_id,
        name: task.task_name || `Task ${task.task_id}`,
        projectId: task.project_id,
        stages: stages
      });
    });
    return Object.values(users);
  }, [timelineData]);

  // Filter & sort
  const filteredUsers = processedData
    .filter(u => {
      if (userFilter !== "all" && u.id.toString() !== userFilter) return false;
      if (teamFilter !== "all" && u.team !== teamFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "id") {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (sortBy === "tasks") {
        const aCount = a.tasks.length;
        const bCount = b.tasks.length;
        return sortOrder === "asc" ? aCount - bCount : bCount - aCount;
      }
      return 0;
    });

  // Timeline view helpers
  const today = moment().startOf("day");
  const viewStart = moment(centerDate).subtract(15, "days");
  const viewEnd = moment(centerDate).add(15, "days");
  const totalMinutes = viewEnd.diff(viewStart, "minutes");

  const getPct = (dateStr) => {
    if (!dateStr) return 0;
    const d = moment(dateStr);
    const pct = (d.diff(viewStart, "minutes") / totalMinutes) * 100;
    return Math.max(0, Math.min(100, pct)) * scale;
  };

  const getWidthPct = (startStr, endStr) => {
    const s = moment(startStr);
    const e = endStr ? moment(endStr) : moment();
    const w = ((e.diff(s, "minutes") / totalMinutes) * 100) * scale;
    return Math.max(1, w);
  };

  // Navigation
  const handleToday = () => setCenterDate(moment());
  const handlePrev = () => setCenterDate(moment(centerDate).subtract(7, "days"));
  const handleNext = () => setCenterDate(moment(centerDate).add(7, "days"));

  // Filter options
  const userOptions = useMemo(() => {
    const opts = [{ value: "all", label: "All Users" }];
    processedData.forEach(u => opts.push({
      value: u.id.toString(),
      label: `${u.name} (${u.role})`
    }));
    return opts;
  }, [processedData]);

  const teamOptions = [
    { value: "all", label: "All Teams" },
    { value: "Adobe", label: "Adobe" },
    { value: "MS Office", label: "MS Office" },
    { value: "QA", label: "QA" }
  ];

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" />
    </div>
  );
  if (error) return (
    <Alert variant="danger" className="m-3">{error}</Alert>
  );

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0 bg-card">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h2 className="gradient-heading mb-0">Resource Timeline</h2>
          
          <div className="d-flex gap-2 flex-wrap">
            <select
              className="form-select form-select-sm"
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              style={{ width: "180px" }}
            >
              {userOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              value={teamFilter}
              onChange={e => setTeamFilter(e.target.value)}
              style={{ width: "140px" }}
            >
              {teamOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              value={`${sortBy}-${sortOrder}`}
              onChange={e => {
                const [sBy, sOrd] = e.target.value.split("-");
                setSortBy(sBy);
                setSortOrder(sOrd);
              }}
              style={{ width: "180px" }}
            >
              <option value="id-asc">ID (Ascending)</option>
              <option value="id-desc">ID (Descending)</option>
              <option value="tasks-asc">Tasks (Low → High)</option>
              <option value="tasks-desc">Tasks (High → Low)</option>
            </select>

            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-secondary" onClick={handlePrev}>&lt;</button>
              <button className="btn btn-sm btn-primary" onClick={handleToday}>Today</button>
              <button className="btn btn-sm btn-secondary" onClick={handleNext}>&gt;</button>
            </div>

            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setScale(0.75)}>S</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setScale(1)}>M</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setScale(1.5)}>L</button>
            </div>

            <Button variant="outline-primary" size="sm" onClick={fetchTimelineData}>
              <i className="fas fa-sync-alt me-1"></i> Refresh
            </Button>
          </div>
        </div>

        {/* Main Timeline Body with Vertical Scroll */}
        <div className="card-body p-0" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {/* Timeline Header */}
          <div className="d-flex border-bottom" style={{ height: "40px" }}>
            <div className="px-3 py-2 fw-bold" style={{ width: "200px", backgroundColor: "#f8f9fa" }}>
              Employee
            </div>
            <div className="flex-grow-1 position-relative overflow-hidden" style={{ backgroundColor: "#f8f9fa" }}>
              {/* Date labels (every 5 days) */}
              {[0, 5, 10, 15, 20, 25, 30].map((offset, i) => {
                const d = moment(viewStart).add(offset, "days");
                return (
                  <div
                    key={i}
                    className="position-absolute top-0 bottom-0 d-flex align-items-center justify-content-center text-muted small"
                    style={{
                      left: `${getPct(d)}%`,
                      transform: "translateX(-50%)",
                      zIndex: 2
                    }}
                  >
                    {d.format("DD MMM")}
                  </div>
                );
              })}

              {/* Today Indicator */}
              <div
                className="position-absolute top-0 bottom-0"
                style={{
                  left: `${getPct(today)}%`,
                  width: "2px",
                  backgroundColor: "#e74c3c",
                  zIndex: 10,
                  boxShadow: "0 0 0 2px rgba(231, 76, 60, 0.3)"
                }}
              >
                <div className="position-absolute top-100 start-50 translate-middle bg-danger text-white px-1 small">
                  Today
                </div>
              </div>
            </div>
          </div>

          {/* User Rows - Now scrollable */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="d-flex border-bottom py-2 px-3" style={{ minHeight: "60px" }}>
                <div className="fw-bold" style={{ width: "200px" }}>
                  <div>{user.name}</div>
                  <div className="text-muted small">
                    ID: {user.id} | {user.role} | {user.team}
                  </div>
                  <Badge bg="secondary" className="mt-1">
                    {user.tasks.length} Tasks
                  </Badge>
                </div>

                <div className="flex-grow-1 position-relative" style={{ minHeight: "30px" }}>
                  {user.tasks.flatMap(task =>
                    task.stages.map((stage, idx) => {
                      const left = getPct(stage.start);
                      const width = getWidthPct(stage.start, stage.end);
                      const color = stageColors[stage.stage] || "#6c757d";
                      return (
                        <div
                          key={`${task.id}-${idx}`}
                          className="position-absolute top-0 bottom-0 rounded px-1 d-flex align-items-center"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            backgroundColor: color,
                            height: "24px",
                            fontSize: "0.75rem",
                            color: "white",
                            overflow: "hidden",
                            zIndex: 1
                          }}
                          title={`${task.name} — ${stage.stage}\n${moment(stage.start).format('DD MMM YYYY')} → ${stage.end ? moment(stage.end).format('DD MMM YYYY') : 'Ongoing'}`}
                        >
                          <span className="text-truncate">{stage.stage}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted">No matching resources.</div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-card rounded shadow-sm">
        <h5 className="mb-3 gradient-heading">Stage Legend</h5>
        <div className="d-flex flex-wrap gap-4">
          {Object.entries(stageColors).map(([stage, color]) => (
            <div key={stage} className="d-flex align-items-center">
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  backgroundColor: color,
                  marginRight: "8px"
                }}
              />
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gradient-heading {
          background: linear-gradient(45deg, #3f51b5, #2196f3);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        .bg-card { background-color: #fff; }
      `}</style>
    </div>
  );
};

export default ResourceTimeline;