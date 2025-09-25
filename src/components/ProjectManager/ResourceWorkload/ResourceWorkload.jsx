import React, { useState, useEffect } from "react";
import { Modal, Button, Badge, Dropdown, Form, Spinner, Alert } from "react-bootstrap";
import moment from "moment";

const ResourceTimeline = ({ userRole, userId }) => {
  // State for API data
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [userFilter, setUserFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [timelineScale, setTimelineScale] = useState(1); // 1 = normal, 2 = expanded, 0.5 = shrunk
  const [currentDate, setCurrentDate] = useState(moment());

  // Stage colors
  const stageColors = {
    "Completed": "#006400", // Dark Green
    "Active": "#00008b", // Dark Blue
    "In Progress": "#90ee90", // Light Green
    "Pending": "#d3d3d3", // Light Grey
    "On Hold": "#ffa500", // Orange
    "Cancelled": "#ff0000" // Red
  };

  // Fetch timeline data
  const fetchTimelineData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = "https://ssknf82q-8800.inc1.devtunnels.ms/api/project/getTimelineData";
      
      // If user is a manager, add managerId parameter
      if (userRole === "manager" && userId) {
        url += `?managerId=${userId}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.status === "true") {
        setTimelineData(result.data);
      } else {
        setError(result.message || "Failed to fetch timeline data");
      }
    } catch (err) {
      setError("Error fetching timeline data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTimelineData();
  }, [userRole, userId]);

  // Process timeline data to group by user
  const processedData = React.useMemo(() => {
    const usersMap = {};
    
    timelineData.forEach(task => {
      const userId = task.assigned_to.id;
      const userName = task.assigned_to.name || `User ${userId}`;
      
      if (!usersMap[userId]) {
        usersMap[userId] = {
          id: userId,
          name: userName,
          role: userId === 2 ? "Manager" : "Team Member", // Assuming ID 2 is a manager
          team: "Team", // Default team, adjust as needed
          tasks: []
        };
      }
      
      // Create a task object with stages
      const taskObj = {
        id: task.task_id,
        name: task.task_name || `Task ${task.task_id}`,
        stages: [
          {
            stage: task.status,
            startTime: task.start_date,
            endTime: task.end_date,
            status: task.status === "Completed" ? "completed" : 
                   task.status === "Active" || task.status === "In Progress" ? "active" : "pending"
          }
        ]
      };
      
      usersMap[userId].tasks.push(taskObj);
    });
    
    return Object.values(usersMap);
  }, [timelineData]);

  // Apply filters and sorting
  const filteredUsers = processedData
    .filter(user => {
      if (userFilter !== "All" && user.id !== parseInt(userFilter)) return false;
      if (teamFilter !== "All" && user.team !== teamFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "id") {
        return sortOrder === "asc" 
          ? a.id - b.id 
          : b.id - a.id;
      } else if (sortBy === "tasks") {
        const aTasks = a.tasks.length;
        const bTasks = b.tasks.length;
        return sortOrder === "asc" ? aTasks - bTasks : bTasks - aTasks;
      }
      return 0;
    });

  // Calculate timeline position and width
  const calculateTimelineStyle = (startTime, endTime) => {
    // For simplicity, we'll use a fixed timeline duration of 30 days
    const timelineStart = moment().subtract(15, 'days');
    const timelineEnd = moment().add(15, 'days');
    const totalDuration = timelineEnd.diff(timelineStart, 'minutes');
    
    const start = moment(startTime);
    const end = endTime ? moment(endTime) : moment();
    
    const leftPosition = ((start.diff(timelineStart, 'minutes') / totalDuration) * 100) * timelineScale;
    const width = ((end.diff(start, 'minutes') / totalDuration) * 100) * timelineScale;
    
    return {
      left: `${Math.max(0, leftPosition)}%`,
      width: `${width}%`,
      minWidth: '5px' // Ensure very small tasks are still visible
    };
  };

  // Navigate timeline
  const navigateTimeline = (direction) => {
    const days = direction === 'back' ? -1 : 1;
    setCurrentDate(moment(currentDate).add(days, 'days'));
  };

  // Get all unique users for filter dropdown
  const allUsers = ["All", ...processedData.map(user => `${user.id} - ${user.name}`)];
  
  // Get all unique teams for filter dropdown
  const allTeams = ["All", ...new Set(processedData.map(user => user.team))];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <Button variant="outline-danger" size="sm" className="ms-2" onClick={fetchTimelineData}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            Resource Timeline {userRole === "manager" ? "(Manager View)" : "(Admin Dashboard)"}
          </h5>
          
          <div className="d-flex gap-2">
            {/* Filters */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                User Filter
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {allUsers.map(user => (
                  <Dropdown.Item 
                    key={user} 
                    onClick={() => setUserFilter(user === "All" ? "All" : user.split(' - ')[0])}
                  >
                    {user}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                Team Filter
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {allTeams.map(team => (
                  <Dropdown.Item 
                    key={team} 
                    onClick={() => setTeamFilter(team)}
                  >
                    {team}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                Sort By
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy("id")}>
                  Employee ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy("tasks")}>
                  Number of Tasks {sortBy === "tasks" && (sortOrder === "asc" ? "↑" : "↓")}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  Toggle Sort Order ({sortOrder === "asc" ? "Ascending" : "Descending"})
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            {/* Timeline controls */}
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setTimelineScale(Math.max(0.5, timelineScale - 0.5))}
            >
              -
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setTimelineScale(1)}
            >
              Reset
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setTimelineScale(Math.min(2, timelineScale + 0.5))}
            >
              +
            </Button>
            
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => navigateTimeline('back')}
            >
              &lt; Back
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => navigateTimeline('forward')}
            >
              Forward &gt;
            </Button>
            
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={fetchTimelineData}
            >
              <i className="fas fa-sync-alt me-1"></i> Refresh
            </Button>
          </div>
        </div>
        
        <div className="card-body">
          {/* Timeline header with dates */}
          <div className="timeline-header d-flex mb-3">
            <div style={{ width: "200px", fontWeight: "bold" }}>Employee</div>
            <div className="flex-grow-1 position-relative">
              <div className="d-flex justify-content-between">
                <span>{moment().subtract(15, 'days').format('MMM DD')}</span>
                <span>{moment().subtract(10, 'days').format('MMM DD')}</span>
                <span>{moment().subtract(5, 'days').format('MMM DD')}</span>
                <span>{moment().format('MMM DD')}</span>
                <span>{moment().add(5, 'days').format('MMM DD')}</span>
                <span>{moment().add(10, 'days').format('MMM DD')}</span>
                <span>{moment().add(15, 'days').format('MMM DD')}</span>
              </div>
            </div>
          </div>
          
          {/* Timeline for each user */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="timeline-row mb-4">
                <div className="d-flex">
                  {/* User info */}
                  <div style={{ width: "200px" }}>
                    <div className="fw-bold">{user.name}</div>
                    <div className="text-muted small">{user.id} | {user.role} | {user.team}</div>
                    <Badge bg="secondary" className="mt-1">{user.tasks.length} Tasks</Badge>
                  </div>
                  
                  {/* Timeline */}
                  <div className="flex-grow-1 position-relative" style={{ height: "50px", backgroundColor: "#f8f9fa" }}>
                    {/* Current time indicator */}
                    <div 
                      className="position-absolute top-0 bottom-0" 
                      style={{ 
                        left: "50%", 
                        width: "2px", 
                        backgroundColor: "red", 
                        zIndex: 10 
                      }}
                    ></div>
                    
                    {/* Task stages */}
                    {user.tasks.map(task => (
                      <div key={task.id}>
                        {task.stages.map((stage, index) => (
                          <div
                            key={`${task.id}-${index}`}
                            className="position-absolute top-0 bottom-0 rounded"
                            style={{
                              ...calculateTimelineStyle(stage.startTime, stage.endTime),
                              backgroundColor: stageColors[stage.stage],
                              height: "20px",
                              top: "15px",
                              zIndex: 1
                            }}
                            title={`${task.name} - ${stage.stage}: ${moment(stage.startTime).format('MMM DD, YYYY')} - ${stage.endTime ? moment(stage.endTime).format('MMM DD, YYYY') : 'Ongoing'}`}
                          >
                            <span 
                              className="d-inline-block text-truncate px-1" 
                              style={{ fontSize: "10px", color: "white", width: "100%" }}
                            >
                              {stage.stage}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p>No timeline data available for the selected filters.</p>
            </div>
          )}
          
          {/* Legend */}
          <div className="mt-4">
            <h6>Legend:</h6>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(stageColors).map(([stage, color]) => (
                <div key={stage} className="d-flex align-items-center">
                  <div 
                    className="me-1" 
                    style={{ 
                      width: "20px", 
                      height: "10px", 
                      backgroundColor: color 
                    }}
                  ></div>
                  <span className="small">{stage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceTimeline;