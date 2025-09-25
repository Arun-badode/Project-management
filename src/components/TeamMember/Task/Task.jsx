// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../Utilities/axiosInstance";
// import BASE_URL from "../../../config";

// function Task() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("authToken");
//   const [allTasks, setAllTasks] = useState([
//     {
//       id: 1,
//       name: "QA Testing for Payment Module",
//       client: "jhon",
//       status: "QC YTS",
//       project: "MSCNIP",
//       dueDate: "2025-06-21",
//       assignee: "Current User",
//       priority: "Medium",
//       files: ["test_cases.xlsx", "payment_flow.pdf"],
//       comments: [
//         {
//           user: "Developer",
//           text: "All payment gateways have been integrated",
//           date: "2025-06-16",
//         },
//       ],
//       timeTracked: 0,
//       serverPath: "",
//     },
//     {
//       id: 2,
//       name: "Fix Navigation Bug",
//       client: "jhon",
//       status: "Corr WIP",
//       project: "Help",
//       dueDate: "2025-06-20",
//       assignee: "Current User",
//       priority: "High",
//       files: ["bug_report.pdf", "screenshots.zip"],
//       comments: [
//         {
//           user: "QA Tester",
//           text: "Bug occurs on iOS devices only",
//           date: "2025-06-15",
//         },
//       ],
//       timeTracked: 2.5,
//       serverPath: "",
//     },
//     {
//       id: 3,
//       name: "Dashboard UI Design",
//       client: "jhon",
//       status: "WIP",
//       project: "Help",
//       dueDate: "2025-06-22",
//       assignee: "Current User",
//       priority: "High",
//       files: ["dashboard_wireframes.fig"],
//       comments: [
//         {
//           user: "Design Lead",
//           text: "Follow design system guidelines",
//           date: "2025-06-19",
//         },
//       ],
//       timeTracked: 1.25,
//       serverPath: "",
//     },
//   ]);

//   const [tasks, setTasks] = useState(
//     allTasks.filter(
//       (task) => task.assignee === "Current User" || task.status === "QC YTS"
//     )
//   );

//   const [showCompleteModal, setShowCompleteModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showReassignModal, setShowReassignModal] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);

//   const [serverPath, setServerPath] = useState("");
//   const [notes, setNotes] = useState("");
//   const [reassignReason, setReassignReason] = useState("");
//   const [serverPathError, setServerPathError] = useState("");

//   // Timer state
//   const [timerRunning, setTimerRunning] = useState(false);
//   const [timerSeconds, setTimerSeconds] = useState(0);
//   const [activeTaskId, setActiveTaskId] = useState(null);
//   const [pausedTime, setPausedTime] = useState(0);
//   const [showRestartButton, setShowRestartButton] = useState(false);

//   // Add memberId state
//   const [memberId, setMemberId] = useState(null); // Replace with actual memberId if needed

//   // Timer effect
//   useEffect(() => {
//     let interval = null;
//     if (timerRunning) {
//       interval = setInterval(() => {
//         setTimerSeconds((prev) => prev + 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [timerRunning]);

//   // Format time helper function
//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   // Start Timer API handler
//   const handleStartTimer = async (taskId, memberId) => {
//     try {
//       const response = await axios.post(
//         "https://eminoids-backend-production.up.railway.app/api/tracking/startTracking",
//         {
//           taskId: taskId,
//           memberId: memberId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setMemberId(memberId); // Set memberId for future API calls
//       setActiveTaskId(taskId);

//       console.log("Start API Success:", response.data);
//       setTimerRunning(true);
//       setTimerSeconds(0);

//       // Update task status in local state
//       const updatedTasks = allTasks.map((task) =>
//         task.id === taskId ? { ...task, status: "WIP" } : task
//       );
//       setAllTasks(updatedTasks);
//       setTasks(
//         updatedTasks.filter(
//           (task) => task.assignee === "Current User" || task.status === "QC YTS"
//         )
//       );
//     } catch (error) {
//       console.error("Start API Error:", error.response?.data || error.message);
//       alert(
//         "Failed to start timer: " +
//           (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   // Pause Timer API handler
//   const handlePauseTimer = async () => {
//     if (!activeTaskId) return;

//     try {
//       const response = await axios.post(
//         "https://eminoids-backend-production.up.railway.app/api/tracking/pauseTracking",
//         {
//           taskId: activeTaskId,
//           memberId: memberId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Pause API Success:", response.data);
//       setTimerRunning(false);
//       setPausedTime(timerSeconds);

//       // Update task status in local state
//       const updatedTasks = allTasks.map((task) =>
//         task.id === activeTaskId ? { ...task, status: "WIP (Paused)" } : task
//       );
//       setAllTasks(updatedTasks);
//       setTasks(
//         updatedTasks.filter(
//           (task) => task.assignee === "Current User" || task.status === "QC YTS"
//         )
//       );
//     } catch (error) {
//       console.error("Pause API Error:", error.response?.data || error.message);
//       alert(
//         "Failed to pause timer: " +
//           (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   // Stop Timer API handler
//   const handleStopTimer = async (activeTaskId) => {
//     const memberId = localStorage.getItem("managerId");
//     console.log("Stopping timer for task ID:", activeTaskId, "Member ID:", memberId );
    
//     if (!activeTaskId) return;

//     try {
//       const response = await axios.post(
//         "https://eminoids-backend-production.up.railway.app/api/tracking/stopTracking",
//         {
//           taskId: activeTaskId,
//           memberId: parseInt(memberId),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Stop API Success:", response.data);
//       setTimerRunning(false);

//       // Update task in local state with tracked time
//       const hoursTracked = timerSeconds / 3600;
//       const updatedTasks = allTasks.map((task) =>
//         task.id === activeTaskId
//           ? {
//               ...task,
//               status: "Completed",
//               timeTracked: task.timeTracked + hoursTracked,
//             }
//           : task
//       );

//       setAllTasks(updatedTasks);
//       setTasks(
//         updatedTasks.filter(
//           (task) => task.assignee === "Current User" || task.status === "QC YTS"
//         )
//       );

//       setActiveTaskId(null);
//       setTimerSeconds(0);
//       setPausedTime(0);
//     } catch (error) {
//       console.error("Stop API Error:", error.response?.data || error.message);
//       alert(
//         "Failed to stop timer: " +
//           (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   const handleCompleteTask = () => {
//     if (!serverPath.trim()) {
//       setServerPathError("Server Path is required");
//       return;
//     }

//     const taskIndex = allTasks.findIndex((task) => task.id === selectedTask.id);
//     if (taskIndex === -1) return;

//     const updatedAllTasks = [...allTasks];
//     const task = { ...updatedAllTasks[taskIndex] };

//     // Update task status based on current status
//     if (task.status === "WIP") {
//       task.status = "QC YTS";
//     } else if (task.status === "Corr WIP") {
//       task.status = "RFD";
//     }

//     // Add time tracked if this was the active task
//     if (activeTaskId === task.id) {
//       task.timeTracked += timerSeconds / 3600;
//       setTimerRunning(false);
//       setTimerSeconds(0);
//       setActiveTaskId(null);
//     }

//     // Update task details
//     task.serverPath = serverPath;
//     updatedAllTasks[taskIndex] = task;

//     // Update state
//     setAllTasks(updatedAllTasks);
//     setTasks(
//       updatedAllTasks.filter(
//         (task) => task.assignee === "Current User" || task.status === "QC YTS"
//       )
//     );

//     // Reset modal state
//     setShowCompleteModal(false);
//     setServerPath("");
//     setNotes("");
//     setServerPathError("");
//   };

//   const handleTaskAction = (taskId, memberId, action) => {
//     const taskIndex = allTasks.findIndex((task) => task.id === taskId);
//     if (taskIndex === -1) return;

//     const updatedAllTasks = [...allTasks];
//     const task = { ...updatedAllTasks[taskIndex] };

//     switch (action) {
//       case "start":
//         handleStartTimer(taskId, memberId);
//         return;
//       case "pause":
//         handlePauseTimer();
//         return;
//       case "complete":
//         setSelectedTask(task);
//         setShowCompleteModal(true);
//         return;
//       case "self-assign":
//         task.status = "QC WIP";
//         task.assignee = "Current User";
//         break;
//       case "reassign":
//         setSelectedTask(task);
//         setShowReassignModal(true);
//         return;
//       case "details":
//         setSelectedTask(task);
//         setShowDetailsModal(true);
//         return;
//       case "switch":
//         handleStartTimer(taskId);
//         return;
//       default:
//         return;
//     }

//     updatedAllTasks[taskIndex] = task;
//     setAllTasks(updatedAllTasks);
//     setTasks(
//       updatedAllTasks.filter(
//         (task) => task.assignee === "Current User" || task.status === "QC YTS"
//       )
//     );
//   };

//   const handleReassignRequest = () => {
//     if (!reassignReason.trim()) {
//       alert("Please provide a reason for reassignment");
//       return;
//     }

//     alert(
//       `Reassignment requested for task "${selectedTask.name}" with reason: ${reassignReason}`
//     );
//     setShowReassignModal(false);
//     setReassignReason("");
//   };

//   const getStatusBadgeColor = (status) => {
//     switch (status) {
//       case "YTS":
//         return "bg-light text-dark";
//       case "WIP":
//         return "bg-info text-white";
//       case "WIP (Paused)":
//         return "bg-warning text-dark";
//       case "QC YTS":
//         return "bg-secondary text-white";
//       case "QC WIP":
//         return "bg-primary text-white";
//       case "Corr WIP":
//         return "bg-danger text-white";
//       case "RFD":
//         return "bg-success text-white";
//       case "Cear YTS":
//         return "bg-warning text-dark";
//       case "Completed":
//         return "bg-success text-white";
//       default:
//         return "bg-light text-dark";
//     }
//   };

//   const activeTask = allTasks.find((t) => t.id === activeTaskId);

  
//   const renderTaskActions = (task) => {
//      const isRunningOrPaused = task.status === "WIP" || task.status === "WIP (Paused)" || task.status === "Running";
//   const isStopped = task.status === "Completed";
//     return (
//       <div className="d-flex flex-wrap gap-1">
//         {task.status === "QC YTS" && (
//           <button
//             onClick={() =>
//               handleTaskAction(task.id, task.memberId, "self-assign")
//             }
//             className="btn btn-sm btn-primary"
//           >
//             Set/Assign
//           </button>
//         )}
//         <button
//         onClick={() => handleTaskAction(task.id, task.memberId, "switch")}
//         className="btn btn-sm btn-secondary"
//         disabled={isStopped || !isRunningOrPaused}
//       >
//         Start Task
//       </button>
//         <button
//           onClick={() => handleTaskAction(task.id, task.memberId, "reassign")}
//           className="btn btn-sm btn-warning"
//         >
//           Reassign
//         </button>
//         <button
//           onClick={() => handleTaskAction(task.id, task.memberId, "details")}
//           className="btn btn-sm btn-info"
//         >
//           Details
//         </button>
//         {(task.status === "WIP" || task.status === "Corr WIP") && (
//           <button
//             onClick={() => handleTaskAction(task.id, task.memberId, "complete")}
//             className="btn btn-sm btn-success"
//           >
//             Complete Task
//           </button>
//         )}
//         {task.status === "WIP" && (
//           <button
//             onClick={() => handleTaskAction(task.id, task.memberId, "pause")}
//             className="btn btn-sm btn-danger"
//           >
//             Pause Work
//           </button>
//         )}
//       </div>
//     );
//   };

//   useEffect(() => {
//     axiosInstance
//       .get("project/getAllProjects", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         if (res.data.status) {
//           const completedProjects = res.data.projects.filter(
//             (project) => project.status?.toLowerCase() === "completed"
//           );
//           setProjects(completedProjects);
//         }
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   const [projectTasks, setProjectTasks] = useState([]);

//   useEffect(() => {
//     const fetchProjectTasks = async () => {
//       try {

//         const managerId = localStorage.getItem("managerId");

//         const response = await axios.get(
//           `https://eminoids-backend-production.up.railway.app/api/tracking/getAllTracking/${managerId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.data.status && Array.isArray(response.data.data)) {
//           setProjectTasks(response.data.data);
//         } else {
//           console.error("Invalid API response:", response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching project tasks:", error);
//       }
//     };

//     fetchProjectTasks();
//   }, []);

//   return (
//     <div className="container-fluid p-3">
//       <h2 className="mb-4 text-white">My Tasks</h2>

//       {activeTaskId && (
//         <div className="card mb-4 bg-card">
//           <div className="card-header">
//             <h4 className="mb-0">{activeTask?.project || "Active Task"}</h4>
//             <div className="small">{activeTask?.name || "No active task"}</div>
//           </div>
//           <div className="card-body text-center">
//             <h1 className="display-4">
//               {formatTime(timerRunning ? timerSeconds : pausedTime).substring(
//                 0,
//                 8
//               )}
//             </h1>
//             <div className="d-flex justify-content-center gap-3 mt-3">
//               {!timerRunning ? (
//                 <button
//                   className="btn btn-success"
//                   onClick={() => handleStartTimer(activeTaskId)}
//                 >
//                   Start/Resume Task
//                 </button>
//               ) : (
//                 <button className="btn btn-warning" onClick={handlePauseTimer}>
//                   Pause Task
//                 </button>
//               )}
//               <button className="btn btn-secondary" onClick={()=>handleStopTimer( activeTaskId)}>
//                 Stop Timer
//               </button>
//             </div>
//           </div>
//           <div className="card-footer text-center">
//             <strong>Task Description:</strong> {activeTask?.name}
//           </div>
//         </div>
//       )}

//       <div className="table-responsive">
//         <table className="table table-bordered table-hover table-gradient-bg">
//           <thead>
//             <tr>
//               <th>S. No.</th>
//               <th>Task ID</th>
//               <th>Member ID</th>
//               <th>Start Time</th>
//               <th>End Time</th>
//               <th>Total Time</th>
//               <th>Status</th>
//               <th>Created At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {projectTasks.length > 0 ? (
//               projectTasks.map((project, index) => (
//                 <tr key={project.id}>
//                   <td>{index + 1}</td>
//                   <td>{project.taskId}</td>
//                   <td>{project.memberId}</td>
//                   <td>{project.startTime}</td>
//                   <td>{project.endTime || "N/A"}</td>
//                   <td>{project.totalTime || "In Progress"}</td>
//                   <td>
//                     <span
//                       className={`badge ${getStatusBadgeColor(project.status)}`}
//                     >
//                       {project.status}
//                     </span>
//                   </td>
//                   <td>{new Date(project.createdAt).toLocaleString()}</td>
//                   <td>{renderTaskActions(project)}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="text-center">
//                   Loading or No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modals remain the same as in your original code */}
//       {showCompleteModal && selectedTask && (
//         <div
//           className="modal fade show"
//           style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Complete Task</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => {
//                     setShowCompleteModal(false);
//                     setServerPathError("");
//                   }}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Server Path</label>
//                   <input
//                     type="text"
//                     className={`form-control ${
//                       serverPathError ? "is-invalid" : ""
//                     }`}
//                     value={serverPath}
//                     onChange={(e) => {
//                       setServerPath(e.target.value);
//                       if (serverPathError) setServerPathError("");
//                     }}
//                     required
//                   />
//                   {serverPathError && (
//                     <div className="invalid-feedback">{serverPathError}</div>
//                   )}
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Notes</label>
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                   ></textarea>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => {
//                     setShowCompleteModal(false);
//                     setServerPathError("");
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleCompleteTask}
//                 >
//                   Complete Task
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showReassignModal && selectedTask && (
//         <div
//           className="modal fade show"
//           style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content bg-card">
//               <div className="modal-header">
//                 <h5 className="modal-title">Request Reassignment</h5>
//                 <button
//                   type="button"
//                   className="btn-close text-white"
//                   onClick={() => setShowReassignModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Reason for Reassignment</label>
//                   <textarea
//                     className="form-control bg-card"
//                     rows="4"
//                     value={reassignReason}
//                     onChange={(e) => setReassignReason(e.target.value)}
//                     required
//                   ></textarea>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowReassignModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-warning"
//                   onClick={handleReassignRequest}
//                 >
//                   Submit Request
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showDetailsModal && selectedTask && (
//         <div
//           className="modal fade show"
//           style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content bg-card">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   Task Details: {selectedTask.name}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowDetailsModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="row mb-3">
//                   <div className="col-md-6">
//                     <div className="mb-2">
//                       <strong>Project:</strong> {selectedTask.project}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Status:</strong>{" "}
//                       <span
//                         className={`badge ${getStatusBadgeColor(
//                           selectedTask.status
//                         )}`}
//                       >
//                         {selectedTask.status}
//                       </span>
//                     </div>
//                     <div className="mb-2">
//                       <strong>Priority:</strong> {selectedTask.priority}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-2">
//                       <strong>Assignee:</strong> {selectedTask.assignee}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Due Date:</strong> {selectedTask.dueDate}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Time Tracked:</strong>{" "}
//                       {selectedTask.timeTracked.toFixed(2)} hours
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <h6>Files:</h6>
//                   <ul className="list-group bg-card">
//                     {selectedTask.files.map((file, index) => (
//                       <li key={index} className="list-group-item bg-card">
//                         {file}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="mb-3">
//                   <h6>Comments:</h6>
//                   {selectedTask.comments.map((comment, index) => (
//                     <div key={index} className="card mb-2 bg-card">
//                       <div className="card-body p-2">
//                         <div className="d-flex justify-content-between">
//                           <strong>{comment.user}</strong>
//                           <small className="bg-card">{comment.date}</small>
//                         </div>
//                         <p className="mb-0">{comment.text}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowDetailsModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Task;



import React, { useState, useEffect } from 'react';
import BASE_URL from '../../../config';
import axiosInstance from '../../Utilities/axiosInstance';

const Task = () => {
  const [activeTask, setActiveTask] = useState(null);
  const [isTaskCardOpen, setIsTaskCardOpen] = useState(true); // Start with task card open
  const [timer, setTimer] = useState("00:05:07");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(307); // 00:05:07 in seconds
  const [memberId, setMemberId] = useState(2); // Using the ID from the API response
  const [managerId, setManagerId] = useState(2); // Default manager ID
  const [userType, setUserType] = useState('manager'); // 'manager' or 'team-member'
  
  // Modal states
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reassignReason, setReassignReason] = useState("");
  
  // Sample data for the tasks table
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects by manager ID
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${BASE_URL}project/getProjectsByManagerId/${managerId}`);
        
        if (response.data && response.data.data) {
          // The API response structure is different than expected
          const managerData = response.data.data;
          
          // Transform projects to tasks format
          if (managerData.projects && Array.isArray(managerData.projects)) {
            const formattedTasks = managerData.projects.map(project => ({
              id: project.id,
              projectTitle: project.projectTitle || "Unnamed Project",
              client: project.clientName || "Unknown Client",
              task: "Task", // Default task name since it's not in the response
              Language: project.languageId?.toString() || "atlantic",
              Applicaton: project.applicationId?.toString() || "Web",
              totalPages: project.totalProjectPages || 0,
              AssignedPages: project.totalPagesLang || 0,
              deadline: project.deadline || "0000-00-00",
              readyforqcdeadline: project.readyQCDeadline || "0000-00-00",
              qcduedate: project.qcDueDate || "0000-00-00",
              status: project.status || "Not Started",
              progress: project.status === "Completed" ? 100 : 
                      project.status === "In Progress" ? 50 : 0,
              dueDate: project.deadline || "0000-00-00",
              priority: project.priority || "Medium",
              assignee: managerData.fullName || "Current User",
              description: project.notes || "No description available",
              files: [],
              comments: [],
              timeTracked: 0,
              isPaused: false
            }));
            
            setTasks(formattedTasks);
          } else {
            // Fallback to empty array if no projects
            setTasks([]);
          }
        } else {
          console.error('Failed to fetch projects: Invalid response structure');
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to fetch projects. Please try again.');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [managerId]);

  // Current active task (Project 1 High)
  const currentTask = {
    id: 0,
    projectTitle: "Project 1",
    client: "High Priority",
    task: "Image Localization",
     Language:"atlantic",
     Applicaton:"Web",
    totalPages: 100,
    AssignedPages: 85,
    deadline:"2023-06-20",
    readyforqcdeadline:"2023-06-15",
    qcduedate:"2023-06-17",
    status: "In Progress",
    progress: 85,
    dueDate: "2023-06-17",
    priority: "High",
    assignee: "Current User",
    description: "Localize images for Project 1 as per client requirements.",
    files: ["image1.jpg", "image2.png", "localization_guide.pdf"],
    comments: [
      {
        user: "Project Manager",
        text: "Please ensure all images are localized by Friday",
        date: "2023-06-10"
      }
    ],
    timeTracked: 0,
    isPaused: false
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          // Format time as HH:MM:SS
          const hours = Math.floor(newSeconds / 3600);
          const minutes = Math.floor((newSeconds % 3600) / 60);
          const secs = newSeconds % 60;
          setTimer(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          );
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // API call to start tracking
  const startTracking = async (taskId) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}tracking/startTracking`, {
          taskId: taskId,
          memberId: memberId
        }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // The API might return a success message instead of a success flag
      if (response.data) {
        console.log('Tracking started:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to start tracking');
      }
    } catch (error) {
      console.error('Error starting tracking:', error);
      // For demo purposes, we'll continue even if API fails
      return { success: true };
    }
  };

  // API call to pause tracking
  const pauseTracking = async (taskId) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}tracking/pauseTracking`, {
          taskId: taskId,
          memberId: memberId
        }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // The API might return a success message instead of a success flag
      if (response.data) {
        console.log('Tracking paused:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to pause tracking');
      }
    } catch (error) {
      console.error('Error pausing tracking:', error);
      // For demo purposes, we'll continue even if API fails
      return { success: true };
    }
  };

  // API call to stop tracking
  const stopTracking = async (taskId) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}tracking/stopTracking`, {
          taskId: taskId,
          memberId: memberId
        }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // The API might return a success message instead of a success flag
      if (response.data) {
        console.log('Tracking stopped:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to stop tracking');
      }
    } catch (error) {
      console.error('Error stopping tracking:', error);
      // For demo purposes, we'll continue even if API fails
      return { success: true };
    }
  };

  // API call to reassign task
  const reassignTask = async (task, reason) => {
    try {
      // Get admin_id from localStorage or use a default value
      const adminId = localStorage.getItem('roleId') || 5;
      
      const response = await axiosInstance.post(`${BASE_URL}reassign`, {
        project_id: task.id, // Using task.id as project_id
        task_id: task.id,   // Using task.id as task_id
        admin_id: parseInt(adminId),
        reason: reason,
        projectManagerId: managerId,
        status: "pending"
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data) {
        console.log('Task reassigned successfully:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to reassign task');
      }
    } catch (error) {
      console.error('Error reassigning task:', error);
      throw error;
    }
  };

  const handlePauseTask = async () => {
    setIsTimerRunning(false);
    
    // Update task status to paused
    if (activeTask) {
      const updatedTasks = tasks.map(task => 
        task.id === activeTask.id ? { ...task, status: "WIP (Paused)", isPaused: true } : task
      );
      setTasks(updatedTasks);
      
      // Call API to pause tracking
      await pauseTracking(activeTask.id);
    }
  };

  const handleResumeTask = async () => {
    setIsTimerRunning(true);
    
    // Update task status to in progress
    if (activeTask) {
      const updatedTasks = tasks.map(task => 
        task.id === activeTask.id ? { ...task, status: "WIP", isPaused: false } : task
      );
      setTasks(updatedTasks);
      
      // Call API to resume tracking (using startTracking API)
      await startTracking(activeTask.id);
    }
  };

  const handleCompleteTask = async () => {
    // Update task status to completed
    if (activeTask) {
      const updatedTasks = tasks.map(task => 
        task.id === activeTask.id ? { 
          ...task, 
          status: "Completed", 
          progress: 100,
          timeTracked: task.timeTracked + (seconds / 3600) // Add current time in hours
        } : task
      );
      setTasks(updatedTasks);
      
      // Call API to stop tracking
      await stopTracking(activeTask.id);
    }
    
    setIsTimerRunning(false);
    setIsTaskCardOpen(false);
    setSeconds(0);
    setTimer("00:00:00");
    setActiveTask(null);
    
    // Here you would typically update the task status in your backend
    alert("Task marked as completed!");
  };

  const handleTaskAction = async (task, action) => {
    if (action === 'pause') {
      setActiveTask(task);
      setIsTaskCardOpen(true);
      setIsTimerRunning(false);
      
      // Update task status to paused
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, status: "WIP (Paused)", isPaused: true } : t
      );
      setTasks(updatedTasks);
      
      // Set timer to the tracked time for this task
      setSeconds(Math.floor(task.timeTracked * 3600));
      setTimer(formatTime(Math.floor(task.timeTracked * 3600)));
      
      // Call API to pause tracking
      await pauseTracking(task.id);
    } else if (action === 'resume') {
      setActiveTask(task);
      setIsTaskCardOpen(true);
      setIsTimerRunning(true);
      
      // Update task status to in progress
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, status: "WIP", isPaused: false } : t
      );
      setTasks(updatedTasks);
      
      // Set timer to the tracked time for this task
      setSeconds(Math.floor(task.timeTracked * 3600));
      setTimer(formatTime(Math.floor(task.timeTracked * 3600)));
      
      // Call API to resume tracking (using startTracking API)
      await startTracking(task.id);
    } else if (action === 'complete') {
      alert(`Task "${task.task}" marked as completed!`);
    } else if (action === 'reassign') {
      setSelectedTask(task);
      setShowReassignModal(true);
    } else if (action === 'details') {
      setSelectedTask(task);
      setShowDetailsModal(true);
    } else if (action === 'start') {
      setActiveTask(task);
      setIsTaskCardOpen(true);
      setIsTimerRunning(true);
      
      // Update task status to in progress
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, status: "WIP", isPaused: false } : t
      );
      setTasks(updatedTasks);
      
      // Reset timer for new task
      setSeconds(0);
      setTimer("00:00:00");
      
      // Call API to start tracking
      await startTracking(task.id);
    }
  };

  const handleReassignSubmit = async () => {
    if (!reassignReason.trim()) {
      alert("Please provide a reason for reassignment");
      return;
    }
    
    try {
      // Call the reassign API
      await reassignTask(selectedTask, reassignReason);
      
      // Show success message
      alert(`Task "${selectedTask.task}" has been reassigned successfully with reason: ${reassignReason}`);
      
      // Close the modal and reset the reason
      setShowReassignModal(false);
      setReassignReason("");
      
      // Update the task status in the local state
      const updatedTasks = tasks.map(task => 
        task.id === selectedTask.id ? { ...task, status: "Reassigned" } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      alert(`Failed to reassign task: ${error.message || "Unknown error occurred"}`);
    }
  };

  // Format time helper function
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Function to determine which buttons to show based on task status
  const renderTaskActions = (task) => {
    const isRunning = task.status === "WIP";
    const isPaused = task.status === "WIP (Paused)";
    
    return (
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {isRunning && (
          <button 
            style={{
              padding: '4px 8px',
              backgroundColor: '#fa8c16',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
            onClick={() => handleTaskAction(task, 'pause')}
          >
            Pause
          </button>
        )}
        
        {isPaused && (
          <button 
            style={{
              padding: '4px 8px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
            onClick={() => handleTaskAction(task, 'resume')}
          >
            Resume
          </button>
        )}
        
        {!isRunning && !isPaused && (
          <button 
            style={{
              padding: '4px 8px',
              backgroundColor: '#52c41a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
            onClick={() => handleTaskAction(task, 'start')}
          >
            Start
          </button>
        )}
        
        <button 
          style={{
            padding: '4px 8px',
            backgroundColor: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
          onClick={() => handleTaskAction(task, 'complete')}
        >
          Complete
        </button>
        
        <button 
          style={{
            padding: '4px 8px',
            backgroundColor: '#722ed1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
          onClick={() => handleTaskAction(task, 'reassign')}
        >
          Reassign
        </button>
        
        <button 
          style={{
            padding: '4px 8px',
            backgroundColor: '#13c2c2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
          onClick={() => handleTaskAction(task, 'details')}
        >
          Details
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        padding: '20px',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      padding: '20px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      {/* Task Card - shown when a task is active */}
      {isTaskCardOpen && activeTask && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginBottom: '20px',
          width: '100%' // Full width as requested
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>My Tasks</h2>
            <div style={{
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#ff4d4f',
              color: 'white'
            }}>
              Project 1 (High)
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
              {activeTask.task}
            </h3>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1890ff',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              {timer}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            {!isTimerRunning ? (
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                minWidth: '120px'
              }} onClick={activeTask.isPaused ? handleResumeTask : handlePauseTask}>
                {activeTask.isPaused ? "Resume Task" : "Start Task"}
              </button>
            ) : (
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#fa8c16',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                minWidth: '120px'
              }} onClick={handlePauseTask}>
                Pause Task
              </button>
            )}
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#52c41a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              minWidth: '120px'
            }} onClick={handleCompleteTask}>
              Complete Task
            </button>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1200px' // Ensures table has a minimum width for horizontal scrolling
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f5ff' }}>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>S.No.</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Project Title</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Client</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Task</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Language</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Applicaton</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Total Pages</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Assigned Pages</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Deadline</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Ready For Qc Deadline</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Qc Due Date</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Status</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Progress</th>
                <th style={{
                  padding: '12px 15px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr 
                  key={task.id} 
                  style={{ 
                    borderBottom: '1px solid #e8e8e8',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f5ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.id}</td>
                  <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.projectTitle}</td>
                  <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.client}</td>
                  <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.task}</td>
                   <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.Language}</td>
                   <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.Applicaton}</td>
                  
                  <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.totalPages}</td>
                   <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.AssignedPages}</td>
                   <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.deadline}</td>
                   <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.readyforqcdeadline}</td>
                   <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>{task.qcduedate}</td>
                  <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: 
                        task.status === 'Completed' ? '#f6ffed' : 
                        task.status === 'QC WIP' ? '#e6f7ff' : 
                        task.status === 'Corr YTS' ? '#fff7e6' :
                        task.status === 'WIP (Paused)' ? '#fff2e8' : '#fff2e8',
                      color: 
                        task.status === 'Completed' ? '#52c41a' : 
                        task.status === 'QC WIP' ? '#1890ff' : 
                        task.status === 'Corr YTS' ? '#fa8c16' :
                        task.status === 'WIP (Paused)' ? '#fa8c16' : '#fa8c16'
                    }}>
                      {task.status}
                    </span>
                  </td>
                  <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '100px',
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        marginRight: '8px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{
                            height: '100%',
                            width: `${task.progress}%`,
                            backgroundColor: 
                              task.progress === 100 ? '#52c41a' : 
                              task.progress >= 70 ? '#1890ff' : '#fa8c16',
                            borderRadius: '4px'
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '12px' }}>{task.progress}%</span>
                    </div>
                  </td>
                  <td style={{
                    padding: '12px 15px',
                    color: '#2c3e50'
                  }}>
                    {renderTaskActions(task)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            width: '500px',
            maxWidth: '90%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>Reassign Task</h3>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#666'
                }}
                onClick={() => setShowReassignModal(false)}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                <strong>Task:</strong> {selectedTask.task}
              </p>
              <p style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                <strong>Project:</strong> {selectedTask.projectTitle}
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                Reason for Reassignment:
              </label>
              <textarea 
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Please provide a reason for reassigning this task..."
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={() => setShowReassignModal(false)}
              >
                Cancel
              </button>
              <button 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={handleReassignSubmit}
              >
                Submit Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            width: '700px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>Task Details</h3>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#666'
                }}
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                General Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Task Name</p>
                  <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{selectedTask.task}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Project</p>
                  <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{selectedTask.projectTitle}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Client</p>
                  <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{selectedTask.client}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Priority</p>
                  <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{selectedTask.priority}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Status</p>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: 
                      selectedTask.status === 'Completed' ? '#f6ffed' : 
                      selectedTask.status === 'QC WIP' ? '#e6f7ff' : 
                      selectedTask.status === 'Corr YTS' ? '#fff7e6' :
                      selectedTask.status === 'WIP (Paused)' ? '#fff2e8' : '#fff2e8',
                    color: 
                      selectedTask.status === 'Completed' ? '#52c41a' : 
                      selectedTask.status === 'QC WIP' ? '#1890ff' : 
                      selectedTask.status === 'Corr YTS' ? '#fa8c16' :
                      selectedTask.status === 'WIP (Paused)' ? '#fa8c16' : '#fa8c16'
                  }}>
                    {selectedTask.status}
                  </span>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Due Date</p>
                  <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{selectedTask.dueDate}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Assignee</p>
                  <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{selectedTask.assignee}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Progress</p>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '100px',
                      height: '8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      marginRight: '8px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{
                          height: '100%',
                          width: `${selectedTask.progress}%`,
                          backgroundColor: 
                            selectedTask.progress === 100 ? '#52c41a' : 
                            selectedTask.progress >= 70 ? '#1890ff' : '#fa8c16',
                          borderRadius: '4px'
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: '12px' }}>{selectedTask.progress}%</span>
                  </div>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Time Tracked</p>
                  <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{selectedTask.timeTracked.toFixed(2)} hours</p>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                Description
              </h4>
              <p style={{ margin: 0, color: '#2c3e50' }}>{selectedTask.description}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                Files
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#2c3e50' }}>
                {selectedTask.files.map((file, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{file}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#2c3e50', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                Comments
              </h4>
              {selectedTask.comments.length > 0 ? (
                selectedTask.comments.map((comment, index) => (
                  <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong style={{ color: '#2c3e50' }}>{comment.user}</strong>
                      <span style={{ color: '#666', fontSize: '12px' }}>{comment.date}</span>
                    </div>
                    <p style={{ margin: 0, color: '#2c3e50' }}>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>No comments yet</p>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;