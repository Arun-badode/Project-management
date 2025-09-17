// import React, { useState, useEffect } from "react";

// function ResourceWorkload() {
//   const [currentDateTime, setCurrentDateTime] = useState("");
//   const [resourceView, setResourceView] = useState("all");

//   // Mock data
//   const resourceStats = {
//     total: 120,
//     inUse: 78,
//     utilization: 65,
//     alerts: 3,
//   };

//   const resourceTypes = [
//     { name: "Computing", value: 40, color: "#4C9AFF" },
//     { name: "Storage", value: 25, color: "#6554C0" },
//     { name: "Network", value: 20, color: "#00B8D9" },
//     { name: "Human", value: 15, color: "#36B37E" },
//   ];

//   const taskData = [
//     {
//       id: "TSK-001",
//       name: "Database Migration",
//       resource: "Computing",
//       consumption: 45,
//       priority: "High",
//       startTime: "08:00 AM",
//       duration: "4h",
//       progress: 75,
//       status: "Running",
//     },
//     {
//       id: "TSK-002",
//       name: "Server Maintenance",
//       resource: "Network",
//       consumption: 30,
//       priority: "Medium",
//       startTime: "09:30 AM",
//       duration: "2h",
//       progress: 50,
//       status: "Running",
//     },
//     {
//       id: "TSK-003",
//       name: "Backup Process",
//       resource: "Storage",
//       consumption: 80,
//       priority: "High",
//       startTime: "10:00 AM",
//       duration: "3h",
//       progress: 25,
//       status: "Running",
//     },
//     {
//       id: "TSK-004",
//       name: "Code Deployment",
//       resource: "Computing",
//       consumption: 60,
//       priority: "Medium",
//       startTime: "11:00 AM",
//       duration: "1h",
//       progress: 90,
//       status: "Running",
//     },
//     {
//       id: "TSK-005",
//       name: "Security Audit",
//       resource: "Human",
//       consumption: 50,
//       priority: "Low",
//       startTime: "01:00 PM",
//       duration: "5h",
//       progress: 10,
//       status: "Running",
//     },
//     {
//       id: "TSK-006",
//       name: "Data Analysis",
//       resource: "Computing",
//       consumption: 70,
//       priority: "Medium",
//       startTime: "02:30 PM",
//       duration: "4h",
//       progress: 0,
//       status: "Pending",
//     },
//     {
//       id: "TSK-007",
//       name: "Network Optimization",
//       resource: "Network",
//       consumption: 40,
//       priority: "Low",
//       startTime: "09:00 AM",
//       duration: "2h",
//       progress: 100,
//       status: "Completed",
//     },
//   ];

//   // Update current date and time
//   useEffect(() => {
//     const updateDateTime = () => {
//       const now = new Date();
//       const options = {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       };
//       setCurrentDateTime(now.toLocaleDateString("en-US", options));
//     };

//     updateDateTime();
//     const interval = setInterval(updateDateTime, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   // Handle filter change
//   const handleFilterChange = (e) => {
//     setResourceView(e.target.value);
//   };

//   // Handle refresh
//   const handleRefresh = () => {
//     // In a real app, this would fetch new data
//     console.log("Refreshing data...");
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Running":
//         return "bg-primary";
//       case "Pending":
//         return "bg-warning";
//       case "Completed":
//         return "bg-success";
//       default:
//         return "bg-secondary";
//     }
//   };

//   // Get priority color
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "High":
//         return "text-danger";
//       case "Medium":
//         return "text-warning";
//       case "Low":
//         return "text-success";
//       default:
//         return "text-muted";
//     }
//   };

//   // Get utilization color
//   const getUtilizationColor = (percentage) => {
//     if (percentage < 50) return "bg-success";
//     if (percentage < 80) return "bg-warning";
//     return "bg-danger";
//   };

//   useEffect(() => {
//     // Get the canvas element
//     const ctx = document.getElementById("resource-distribution-chart");

//     // Initialize the chart
//     const myChart = new Chart(ctx, {
//       type: "pie", // Chart type, you can also use 'bar', 'line', etc.
//       data: {
//         labels: ["Computing", "Storage", "Network", "Human"], // Labels for the chart
//         datasets: [
//           {
//             label: "Resource Distribution",
//             data: [40, 25, 20, 15], // Data for each category
//             backgroundColor: ["#4C9AFF", "#6554C0", "#00B8D9", "#36B37E"], // Colors for each category
//             borderColor: "#fff",
//             borderWidth: 2,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           tooltip: {
//             callbacks: {
//               label: (tooltipItem) =>
//                 `${tooltipItem.label}: ${tooltipItem.raw}%`,
//             },
//           },
//         },
//       },
//     });

//     // Cleanup on component unmount
//     return () => {
//       if (myChart) {
//         myChart.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div className="container-fluid bg-card" >
//       {/* Header Section */}
//       <header className="bg-card shadow-sm mb-4">
//         <div className="container-fluid bg-card">
//           <div className="d-flex justify-content-between align-items-center py-3">
//             <h2 className="gradient-heading mb-0 ">Resource Workload</h2>
//             <div className="d-flex align-items-center">
//               {/* <span className=" me-3">{currentDateTime}</span>
//               <button 
//                 onClick={handleRefresh}
//                 className="btn btn-secondary btn-sm me-3"
//                 title="Refresh data"
//               >
//                 <i className="fas fa-sync-alt"></i>
//               </button> */}
//               <div className="dropdown">
//                 <button
//                   className="btn btn-secondary dropdown-toggle"
//                   type="button"
//                   id="resourceFilterDropdown"
//                   data-bs-toggle="dropdown"
//                 >
//                   {resourceView === "all"
//                     ? "All Resources"
//                     : resourceView.charAt(0).toUpperCase() +
//                       resourceView.slice(1)}
//                 </button>
//                 <ul
//                   className="dropdown-menu"
//                   aria-labelledby="resourceFilterDropdown"
//                 >
//                   <li>
//                     <button
//                       className="dropdown-item"
//                       onClick={() => setResourceView("all")}
//                     >
//                       All Resources
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item"
//                       onClick={() => setResourceView("computing")}
//                     >
//                       Computing
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item"
//                       onClick={() => setResourceView("storage")}
//                     >
//                       Storage
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item"
//                       onClick={() => setResourceView("network")}
//                     >
//                       Network
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       className="dropdown-item"
//                       onClick={() => setResourceView("human")}
//                     >
//                       Human
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container-fluid mb-5">
//         {/* Resource Status Overview */}
//         <section className="mb-4 ">
//           <h2 className="h5 mb-3">Resource Status Overview</h2>
//         <div className="row g-3">
//   {/* Total Resources */}
//   <div className="col-md-6 col-lg-3">
//     <div className="card h-100 text-white bg-primary  rounded-4 shadow-sm">
//       <div className="card-body d-flex justify-content-between align-items-center">
//         <div>
//           <p className="small mb-1">Total Resources</p>
//           <h3 className="fw-bold mb-0">{resourceStats.total}</h3>
//         </div>
//         <div className="p-3 bg-white bg-opacity-25 rounded">
//           <i className="fas fa-server fs-4 text-white"></i>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Resources In Use */}
//   <div className="col-md-6 col-lg-3">
//     <div className="card h-100 text-white bg-success  rounded-4 shadow-sm">
//       <div className="card-body d-flex justify-content-between align-items-center">
//         <div>
//           <p className="small mb-1">Resources In Use</p>
//           <h3 className="fw-bold mb-0">{resourceStats.inUse}</h3>
//         </div>
//         <div className="p-3 bg-white bg-opacity-25 rounded">
//           <i className="fas fa-cogs fs-4 text-white"></i>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Utilization */}
//   <div className="col-md-6 col-lg-3">
//     <div className="card h-100 text-dark bg-warning  rounded-4 shadow-sm">
//       <div className="card-body d-flex flex-column justify-content-between">
//         <div className="d-flex justify-content-between align-items-center">
//           <div>
//             <p className="small mb-1 text-light">Utilization</p>
//             <h3 className="fw-bold mb-0 text-light">{resourceStats.utilization}%</h3>
//           </div>
//           <div className="p-3 bg-dark bg-opacity-10 rounded">
//             <i className="fas fa-chart-pie fs-4 text-light"></i>
//           </div>
//         </div>
//         <div className="progress mt-3 bg-dark bg-opacity-10" style={{ height: "6px" }}>
//           <div
//             className={`progress-bar ${getUtilizationColor(resourceStats.utilization)}`}
//             style={{ width: `${resourceStats.utilization}%` }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Critical Alerts */}
//   <div className="col-md-6 col-lg-3">
//     <div className="card h-100 text-white bg-danger  rounded-4 shadow-sm">
//       <div className="card-body d-flex justify-content-between align-items-center">
//         <div>
//           <p className="small mb-1">Critical Alerts</p>
//           <h3 className="fw-bold mb-0">{resourceStats.alerts}</h3>
//         </div>
//         <div className="p-3 bg-white bg-opacity-25 rounded">
//           <i className="fas fa-exclamation-triangle fs-4 text-white"></i>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//         </section>

//         {/* Resource Distribution and Task Workload */}
//         <div className="row mb-4">
//           {/* Resource Distribution Chart */}
//           <div className="col-lg-4 mb-3">
//             <div className="card h-100 bg-card">
//               <div className="card-body">
//                 <h2 className="h5 mb-3">Resource Distribution</h2>
//                 <div
//                   className="chart-container"
//                   style={{ position: "relative", height: "300px" }}
//                 >
//                   <canvas id="resource-distribution-chart"></canvas>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Task Workload List */}
//           <div className="col-lg-8 mb-3">
//             <div className="card h-100 bg-card">
//               <div className="card-header">
//                 <h2 className="h5 mb-0">Task Workload</h2>
//               </div>
//               <div className="card-body p-0">
//                 <div
//                   className="table-responsive table-gradient-bg"
//                   style={{ maxHeight: "400px", overflowY: "auto" }}
//                 >
//                   <table className="table table-hover  mb-0">
//                    <thead
//                           className="table-gradient-bg table "
//                           style={{
//                             position: "sticky",
//                             top: 0,
//                             zIndex: 0,
//                             backgroundColor: "#fff", // Match your background color
//                           }}
//                         >
//                       <tr  className="text-center">
//                         <th>ID</th>
//                         <th>Task</th>
//                         <th>Resource</th>
//                         <th>Priority</th>
//                         <th>Time</th>
//                         <th>Progress</th>
//                         <th>Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {taskData.map((task) => (
//                         <tr key={task.id}  className="text-center">
//                           <td>{task.id}</td>
//                           <td>
//                             <div className="fw-bold">{task.name}</div>
//                             <small className="">{task.id}</small>
//                           </td>
//                           <td>
//                             <div>{task.resource}</div>
//                             <small className="">
//                               {task.consumption}% usage
//                             </small>
//                           </td>
//                           <td>
//                             <span className={getPriorityColor(task.priority)}>
//                               {task.priority}
//                             </span>
//                           </td>
//                           <td>
//                             <div>{task.startTime}</div>
//                             <small className="">{task.duration}</small>
//                           </td>
//                           <td>
//                             <div className="progress" style={{ height: "5px" }}>
//                               <div
//                                 className="progress-bar bg-primary"
//                                 style={{ width: `${task.progress}%` }}
//                               ></div>
//                             </div>
//                             <small className="">{task.progress}%</small>
//                           </td>
//                           <td>
//                             <span
//                               className={`badge ${getStatusColor(task.status)}`}
//                             >
//                               {task.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Resource Timeline */}
//         <section className="card mb-4 bg-card">
//           <div className="card-body">
//             <h2 className="h5 mb-3">Resource Timeline</h2>
//             <div className="table-responsive">
//               <div className="timeline-container" style={{ minWidth: "800px" }}>
//                 {/* Timeline Header */}
//                 <div className="d-flex border-bottom pb-2 mb-2">
//                   <div style={{ width: "120px" }}></div>
//                   <div className="d-flex flex-grow-1">
//                     {Array.from({ length: 12 }).map((_, i) => (
//                       <div key={i} className="flex-grow-1 text-center small ">
//                         {i + 8 > 12 ? `${i + 8 - 12} PM` : `${i + 8} AM`}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Timeline Rows */}
//                 {resourceTypes.map((resource, index) => (
//                   <div
//                     key={index}
//                     className="d-flex py-2 border-bottom bg-card"
//                   >
//                     <div
//                       style={{ width: "120px" }}
//                       className="d-flex align-items-center"
//                     >
//                       <span className="fw-bold">{resource.name}</span>
//                     </div>
//                     <div
//                       className="flex-grow-1 position-relative"
//                       style={{ height: "40px" }}
//                     >
//                       {/* Capacity threshold line */}
//                       <div
//                         className="position-absolute top-0 start-0 end-0 border-top border-danger border-dashed"
//                         style={{ top: "75%" }}
//                       ></div>

//                       {/* Task blocks */}
//                       {taskData
//                         .filter((task) => task.resource === resource.name)
//                         .map((task, taskIndex) => {
//                           // Calculate position and width based on start time and duration
//                           const startHour = parseInt(
//                             task.startTime.split(":")[0]
//                           );
//                           const startMinute = parseInt(
//                             task.startTime.split(":")[0].includes("PM") &&
//                               startHour !== 12
//                               ? startHour + 12
//                               : startHour
//                           );
//                           const durationHours = parseFloat(
//                             task.duration.replace("h", "")
//                           );

//                           // Position calculation (8 AM is the start of our timeline)
//                           const startPosition = ((startMinute - 8) / 12) * 100;
//                           const width = (durationHours / 12) * 100;

//                           return (
//                             <div
//                               key={taskIndex}
//                               className={`position-absolute rounded ${getStatusColor(
//                                 task.status
//                               )} opacity-75`}
//                               style={{
//                                 left: `${startPosition}%`,
//                                 width: `${width}%`,
//                                 height: "20px",
//                                 top: task.consumption > 50 ? "0" : "50%",
//                               }}
//                               title={`${task.name} (${task.startTime} - ${durationHours}h)`}
//                             >
//                               <div className="px-2 small text-white text-truncate h-100 d-flex align-items-center">
//                                 {task.name}
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Action Controls */}
//         <section className="card">
//           <div className="card-body bg-card">
//             <div className="d-flex flex-wrap justify-content-between align-items-center">
//               <h2 className="h5 mb-3 mb-md-0">Quick Actions</h2>
//               <div className="d-flex flex-wrap gap-2">
//                 <button className="btn btn-primary">
//                   <i className="fas fa-plus me-2"></i> Allocate Resources
//                 </button>
//                 <button className="btn btn-info">
//                   <i className="fas fa-sort-amount-up me-2"></i> Prioritize
//                   Tasks
//                 </button>
//                 <button className="btn btn-success">
//                   <i className="fas fa-balance-scale me-2"></i> Balance Load
//                 </button>
//                 <button className="btn btn-secondary">
//                   <i className="fas fa-file-export me-2"></i> Export Data
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* Floating Action Button */}
//       {/* <div className="position-fixed bottom-0 end-0 p-3">
//         <button className="btn btn-primary rounded-circle" style={{ width: '56px', height: '56px' }}>
//           <i className="fas fa-plus"></i>
//         </button>
//       </div> */}
//     </div>
//   );
// }

// export default ResourceWorkload;




import React, { useState, useEffect } from 'react';
import { format, subDays, addDays, parseISO, setHours, setMinutes, isSameDay, isWithinInterval } from 'date-fns';

const ResourceWorkload = () => {
  // Sample data - in a real app, this would come from an API
  const [resources, setResources] = useState([
    {
      id: 'EDS005',
      name: 'Johnson Naveen Prince R',
      role: 'Manager',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      tasks: [
        {
          id: 1,
          serialNo: 1,
          project: '2025_9_18375',
          client: 'Benz',
          startTime: setHours(setMinutes(new Date(), 0), 10), // 10:00 AM
          endTime: setHours(setMinutes(new Date(), 30), 12), // 12:30 PM
          color: '#4285F4', // Blue
          status: 'In Progress'
        },
        {
          id: 2,
          serialNo: 2,
          project: 'C-HR-TOYOTA-C-AHR-PHEV_OM - CRO',
          client: 'Rolice Royce',
          startTime: setHours(setMinutes(new Date(), 30), 13), // 1:30 PM
          endTime: setHours(setMinutes(new Date(), 0), 15), // 3:00 PM
          color: '#EA4335', // Red
          status: 'Not Started'
        },
        {
          id: 3,
          serialNo: 3,
          project: 'G25-07-87_MDS-REQ2_Ar',
          client: 'Manutha',
          startTime: setHours(setMinutes(new Date(), 0), 15), // 3:00 PM
          endTime: setHours(setMinutes(new Date(), 0), 17), // 5:00 PM
          color: '#34A853', // Green
          status: 'Not Started'
        }
      ]
    },
    {
      id: 'EDS006',
      name: 'Sarah Johnson',
      role: 'Team Member',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      tasks: [
        {
          id: 4,
          serialNo: 1,
          project: 'Design Project Alpha',
          client: 'Client A',
          startTime: setHours(setMinutes(new Date(), 0), 9), // 9:00 AM
          endTime: setHours(setMinutes(new Date(), 0), 11), // 11:00 AM
          color: '#4285F4', // Blue
          status: 'Completed'
        },
        {
          id: 5,
          serialNo: 2,
          project: 'Development Sprint',
          client: 'Client B',
          startTime: setHours(setMinutes(new Date(), 30), 11), // 11:30 AM
          endTime: setHours(setMinutes(new Date(), 0), 14), // 2:00 PM
          color: '#FBBC05', // Yellow
          status: 'In Progress'
        },
        {
          id: 6,
          serialNo: 3,
          project: 'Testing Phase',
          client: 'Client C',
          startTime: setHours(setMinutes(new Date(), 0), 15), // 3:00 PM
          endTime: setHours(setMinutes(new Date(), 0), 17), // 5:00 PM
          color: '#34A853', // Green
          status: 'Not Started'
        }
      ]
    },
    {
      id: 'EDS007',
      name: 'Michael Chen',
      role: 'Team Member',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      tasks: [
        {
          id: 7,
          serialNo: 1,
          project: 'UI/UX Design',
          client: 'Client D',
          startTime: setHours(setMinutes(new Date(), 0), 10), // 10:00 AM
          endTime: setHours(setMinutes(new Date(), 30), 12), // 12:30 PM
          color: '#4285F4', // Blue
          status: 'In Progress'
        },
        {
          id: 8,
          serialNo: 2,
          project: 'Frontend Development',
          client: 'Client E',
          startTime: setHours(setMinutes(new Date(), 30), 13), // 1:30 PM
          endTime: setHours(setMinutes(new Date(), 0), 16), // 4:00 PM
          color: '#EA4335', // Red
          status: 'Not Started'
        }
      ]
    }
  ]);

  // State for filters and sorting
  const [userFilter, setUserFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [sortBy, setSortBy] = useState('resourceId');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // State for timeline navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timelineScale, setTimelineScale] = useState(1); // 1 = normal, >1 = zoomed in, <1 = zoomed out
  
  // State for UI
  const [hoveredTask, setHoveredTask] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  // Filter and sort resources
  const filteredResources = resources
    .filter(resource => {
      if (userFilter !== 'all' && resource.id !== userFilter) return false;
      if (teamFilter !== 'all' && resource.role !== teamFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'resourceId') {
        return sortOrder === 'asc' 
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      } else if (sortBy === 'taskCount') {
        const aTaskCount = a.tasks.length;
        const bTaskCount = b.tasks.length;
        return sortOrder === 'asc' 
          ? aTaskCount - bTaskCount
          : bTaskCount - aTaskCount;
      }
      return 0;
    });

  // Navigate timeline
  const navigateTimeline = (direction) => {
    if (direction === 'back') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (direction === 'forward') {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  // Zoom timeline
  const zoomTimeline = (direction) => {
    if (direction === 'in') {
      setTimelineScale(prev => Math.min(prev + 0.1, 2));
    } else if (direction === 'out') {
      setTimelineScale(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  // Calculate position of a task on the timeline
  const calculateTaskPosition = (startTime) => {
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    // 10 AM is 0%, 7 PM is 100%
    return ((hours - 10) + (minutes / 60)) / 9 * 100;
  };

  // Calculate width of a task on the timeline
  const calculateTaskWidth = (startTime, endTime) => {
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();
    
    const durationInHours = (endHours - startHours) + ((endMinutes - startMinutes) / 60);
    return (durationInHours / 9) * 100;
  };

  // Generate time slots for the timeline header
  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 10; hour <= 19; hour++) {
      timeSlots.push(
        <div key={hour} style={{
          position: 'absolute',
          left: `${((hour - 10) / 9) * 100}%`,
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: '#666',
          fontWeight: '500'
        }}>
          {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
        </div>
      );
    }
    return timeSlots;
  };

  // Render timeline for a resource
  const renderResourceTimeline = (resource) => {
    const isSelected = selectedResource === resource.id;
    
    return (
      <div 
        key={resource.id} 
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: isSelected ? '0 6px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
          border: isSelected ? '1px solid #e0e0e0' : '1px solid #f0f0f0',
          transition: 'all 0.3s ease',
          backgroundColor: '#ffffff'
        }}
        onMouseEnter={() => setSelectedResource(resource.id)}
        onMouseLeave={() => setSelectedResource(null)}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #eee'
        }}>
          <img 
            src={resource.avatar} 
            alt={resource.name}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '12px',
              border: '2px solid #fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: '600',
              fontSize: '16px',
              color: '#333',
              display: 'flex',
              alignItems: 'center'
            }}>
              {resource.name}
              <span style={{
                marginLeft: '8px',
                fontSize: '12px',
                color: '#666',
                backgroundColor: '#e9ecef',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {resource.id}
              </span>
            </div>
            <div style={{
              fontSize: '13px',
              color: '#666',
              marginTop: '2px'
            }}>
              {resource.role} • {resource.tasks.length} tasks today
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#666',
            fontSize: '13px'
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: resource.tasks.some(t => t.status === 'In Progress') ? '#4285F4' : '#999',
              marginRight: '6px'
            }}></span>
            {resource.tasks.some(t => t.status === 'In Progress') ? 'Busy' : 'Available'}
          </div>
        </div>
        
        <div style={{
          position: 'relative',
          height: '80px',
          padding: '10px 16px',
          backgroundColor: '#ffffff'
        }}>
          {resource.tasks.map(task => (
            <div
              key={task.id}
              style={{
                position: 'absolute',
                top: '20px',
                height: '40px',
                backgroundColor: task.color,
                left: `${calculateTaskPosition(task.startTime)}%`,
                width: `${calculateTaskWidth(task.startTime, task.endTime)}%`,
                borderRadius: '6px',
                padding: '6px 10px',
                color: 'white',
                fontSize: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                transform: hoveredTask === task.id ? 'translateY(-2px)' : 'none',
                zIndex: hoveredTask === task.id ? 10 : 1
              }}
              title={`${task.project} - ${task.client}\n${format(task.startTime, 'h:mm a')} - ${format(task.endTime, 'h:mm a')}`}
              onMouseEnter={() => setHoveredTask(task.id)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <div style={{ fontWeight: '600', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {task.serialNo}. {task.project}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {task.client} • {format(task.startTime, 'h:mm a')}-{format(task.endTime, 'h:mm a')}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 30px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>
              Resource Timeline
            </h2>
            <p style={{ margin: '0', color: '#7f8c8d', fontSize: '14px' }}>
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: '#f8f9fa',
              padding: '6px 12px',
              borderRadius: '8px'
            }}>
              <button 
                onClick={() => navigateTimeline('back')} 
                style={{ 
                  padding: '6px 10px', 
                  backgroundColor: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  color: '#2c3e50',
                  fontWeight: '500'
                }}
              >
                ←
              </button>
              <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                {format(currentDate, 'MMM dd')}
              </span>
              <button 
                onClick={() => navigateTimeline('forward')} 
                style={{ 
                  padding: '6px 10px', 
                  backgroundColor: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  color: '#2c3e50',
                  fontWeight: '500'
                }}
              >
                →
              </button>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: '#f8f9fa',
              padding: '6px 12px',
              borderRadius: '8px'
            }}>
              <button 
                onClick={() => zoomTimeline('out')} 
                style={{ 
                  padding: '6px 10px', 
                  backgroundColor: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  color: '#2c3e50',
                  fontWeight: '500'
                }}
              >
                -
              </button>
              <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                Zoom
              </span>
              <button 
                onClick={() => zoomTimeline('in')} 
                style={{ 
                  padding: '6px 10px', 
                  backgroundColor: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  color: '#2c3e50',
                  fontWeight: '500'
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '20px 30px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: '600', color: '#2c3e50' }}>User:</label>
            <select 
              value={userFilter} 
              onChange={(e) => setUserFilter(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '1px solid #ddd',
                backgroundColor: '#ffffff',
                color: '#2c3e50',
                fontWeight: '500',
                minWidth: '180px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <option value="all">All Users</option>
              {resources.map(resource => (
                <option key={resource.id} value={resource.id}>{resource.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: '600', color: '#2c3e50' }}>Team:</label>
            <select 
              value={teamFilter} 
              onChange={(e) => setTeamFilter(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '1px solid #ddd',
                backgroundColor: '#ffffff',
                color: '#2c3e50',
                fontWeight: '500',
                minWidth: '150px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <option value="all">All Teams</option>
              <option value="Manager">Manager</option>
              <option value="Team Member">Team Member</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: '600', color: '#2c3e50' }}>Sort By:</label>
            <select 
              value={`${sortBy}-${sortOrder}`} 
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '1px solid #ddd',
                backgroundColor: '#ffffff',
                color: '#2c3e50',
                fontWeight: '500',
                minWidth: '180px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <option value="resourceId-asc">Resource ID (Asc)</option>
              <option value="resourceId-desc">Resource ID (Desc)</option>
              <option value="taskCount-asc">Task Count (Asc)</option>
              <option value="taskCount-desc">Task Count (Desc)</option>
            </select>
          </div>
        </div>

        {/* Timeline Header */}
        <div style={{
          position: 'relative',
          height: '40px',
          padding: '0 30px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{
            position: 'relative',
            height: '100%',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            {generateTimeSlots()}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              width: '2px',
              height: '100%',
              backgroundColor: '#e74c3c',
              zIndex: '10'
            }}></div>
          </div>
        </div>

        {/* Timeline Content */}
        <div style={{
          padding: '24px 30px',
          backgroundColor: '#ffffff'
        }}>
          {filteredResources.length > 0 ? (
            filteredResources.map(resource => renderResourceTimeline(resource))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#7f8c8d',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              fontSize: '16px'
            }}>
              No resources match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceWorkload;