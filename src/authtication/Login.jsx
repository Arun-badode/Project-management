// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import "./Login.css";
// import BASE_URL from "../config";
// import axios from "axios";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [showVideo, setShowVideo] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [fadeOut, setFadeOut] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);

//     return () => {
//       window.removeEventListener('resize', checkIfMobile);
//     };
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setFadeOut(true);
//       setTimeout(() => {
//         setShowVideo(false);
//       }, 1000);
//     }, 7000);
//     return () => clearTimeout(timer);
//   }, []);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");


//     setIsLoading(true);

//     try {
//       const response = await axios.post(`${BASE_URL}user/login`, {
//         email: email,
//         password: password
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       const { id, token, role, roleId } = response.data.data;
//       console.log('Login response:', response.data); // Debug log


//       // Store authentication data
//       localStorage.setItem('authToken', token);
//       localStorage.setItem('userRole', role);
//       localStorage.setItem('userEmail', email);
//       localStorage.setItem('roleId', roleId);
//       localStorage.setItem('userData', JSON.stringify(response.data.data));
//       //       // after successful login
//       // localStorage.setItem("username", response.data.user.username); // or use email


//       // Store managerId based on different possible response structures
//       if (id) {
//         localStorage.setItem("managerId", id);
//       } else {
//         console.warn('No managerId found in response');
//       }

//       // Redirect based on role
//       switch (role) {
//         case "Admin":
//           navigate("/admin-dashboard");
//           break;
//         case "Manager":
//           navigate("/manager-dashboard");
//           break;
//         case "Team-Member":
//           navigate("/team-dashboard");
//           break;
//         default:
//           navigate("/dashboard");
//       }

//     } catch (error) {
//       console.error('Login error:', error);
//       setError(error.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   if (showVideo) {
//     return (
//       <div className={`video-splash-screen ${fadeOut ? "" : ""}`}>
//         <video
//           autoPlay
//           muted
//           playsInline
//           className="splash-video"
//           style={{ height: isMobile ? "100%" : "100%" }}
//         >
//           <source
//             src={isMobile ? "Video/mob.mp4" : "/Video/web.mp4"}
//             type="video/mp4"
//           />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     );
//   }

//   return (
//     <div className="login-page">
//       <div className="login-container row">
//         {/* Left Panel */}
//         <div className="col-md-6 login-left d-flex justify-content-center align-items-center">
//           <div className="login-left-content">
//             <img
//               src="https://ik.imagekit.io/43o9qlnbg/Eminoids%20-%20Logo_W.png"
//               alt="Logo"
//               className="login-logo"
//               style={{ width: "250px", height: "auto", marginBottom: "24px" }}
//             />
//             <h1 className="text-white">Welcome Back!</h1>
//             <p className="fw-bold text-strong">
//               Let's turn tasks into triumphs!
//             </p>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="col-md-6 login-right d-flex justify-content-center align-items-center">
//           <div className="login-form-container">
//             <form className="login-form" onSubmit={handleSubmit}>
//               <h4 className="login-form-title">
//                 Hello!
//                 <br />
//                 <span className="text-muted">Step in and take control.</span>
//               </h4>

//               {error && (
//                 <div className="alert alert-danger" role="alert">
//                   {error}
//                 </div>
//               )}

//               <div className="login-input-group">
//                 <FontAwesomeIcon
//                   icon={faEnvelope}
//                   className="login-input-icon"
//                 />
//                 <input
//                   type="text"
//                   className="form-control login-input"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="login-input-group">
//                 <FontAwesomeIcon icon={faLock} className="login-input-icon" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="form-control login-input"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <span
//                   className="password-toggle-icon"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//                 </span>
//               </div>

//               {/* Role Selection Buttons */}


//               <button
//                 type="submit"
//                 className="btn login-submit-btn mt-3"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'LOGGING IN...' : 'LOG IN'}
//               </button>
//               <div className="text-center mt-3">
//                 <p className="text-muted">
//                   Version Build 1.0
//                 </p>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import "./Login.css";
// import BASE_URL from "../config";
// import axios from "axios";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [showVideo, setShowVideo] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [fadeOut, setFadeOut] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Modal states
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalTitle, setModalTitle] = useState("");

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);

//     return () => {
//       window.removeEventListener('resize', checkIfMobile);
//     };
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setFadeOut(true);
//       setTimeout(() => {
//         setShowVideo(false);
//       }, 1000);
//     }, 7000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       // Step 1: Login
//       const loginResponse = await axios.post(`${BASE_URL}user/login`, {
//         email: email,
//         password: password
//       }, {
//         headers: { 'Content-Type': 'application/json' }
//       });

//       const { id, token, role, roleId } = loginResponse.data.data;
//       console.log('Login response:', loginResponse.data);

//       // Store in localStorage immediately (needed for shift API)
//       localStorage.setItem('authToken', token);
//       localStorage.setItem('userRole', role);
//       localStorage.setItem('userEmail', email);
//       localStorage.setItem('roleId', roleId);
//       localStorage.setItem('managerId', id);
//       localStorage.setItem('userData', JSON.stringify(loginResponse.data.data));

//       // Step 2: If Admin → skip shift check
//       if (role === "Admin") {
//         navigate("/admin-dashboard");
//         setIsLoading(false);
//         return;
//       }

//       // Step 3: Fetch shifts
//       const shiftsResponse = await axios.get(`${BASE_URL}shift/getAllShifts`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const allShifts = shiftsResponse.data.data || [];
//       const memberId = parseInt(id, 10);
//       const userShifts = allShifts.filter(shift => shift.memberId === memberId);

//       // Get today in YYYY-MM-DD
//       const today = new Date().toISOString().split('T')[0];

//       // Filter today’s shifts
//       const todayShifts = userShifts.filter(shift => shift.shiftDate === today);

//       // Helper: Convert "HH:MM AM/PM" → minutes since midnight
//       const parseTimeToMinutes = (timeStr) => {
//         if (!timeStr) return null;
//         const [time, modifier] = timeStr.split(' ');
//         let [hours, minutes] = time.split(':').map(Number);
//         if (modifier === 'PM' && hours < 12) hours += 12;
//         if (modifier === 'AM' && hours === 12) hours = 0;
//         return hours * 60 + minutes;
//       };

//       const now = new Date();
//       const currentMinutes = now.getHours() * 60 + now.getMinutes();

//       let hasValidShift = false;
//       let isEarly = false;
//       let isLate = false;
//       let nextShift = null;

//       // Check each shift
//       for (const shift of todayShifts) {
//         const startMinutes = parseTimeToMinutes(shift.startTime);
//         const endMinutes = parseTimeToMinutes(shift.endTime);

//         if (startMinutes === null || endMinutes === null) continue;

//         // Overnight shift (e.g., 10PM to 6AM)
//         if (startMinutes > endMinutes) {
//           if (currentMinutes >= startMinutes || currentMinutes <= endMinutes) {
//             hasValidShift = true;
//             break;
//           } else if (currentMinutes < startMinutes && currentMinutes > endMinutes) {
//             isEarly = true;
//             nextShift = shift;
//             break;
//           }
//         } else {
//           // Normal shift
//           if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
//             hasValidShift = true;
//             break;
//           } else if (currentMinutes < startMinutes) {
//             isEarly = true;
//             nextShift = shift;
//             break;
//           } else if (currentMinutes > endMinutes) {
//             isLate = true;
//             nextShift = shift;
//             break;
//           }
//         }
//       }

//       // Handle invalid cases
//       if (!hasValidShift) {
//         // Clean up localStorage
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userEmail');
//         localStorage.removeItem('roleId');
//         localStorage.removeItem('managerId');
//         localStorage.removeItem('userData');

//         if (todayShifts.length === 0) {
//           setModalTitle("No Shift Scheduled 📅");
//           setModalMessage("You don’t have any shift assigned for today.");
//           setShowModal(true);
//         } else if (isEarly && nextShift) {
//           const startMinutes = parseTimeToMinutes(nextShift.startTime);
//           const diffMinutes = startMinutes - currentMinutes;
//           const hours = Math.floor(diffMinutes / 60);
//           const mins = diffMinutes % 60;

//           let timeStr = "";
//           if (hours > 0) {
//             timeStr = `${hours} hour${hours > 1 ? 's' : ''}`;
//             if (mins > 0) timeStr += ` and ${mins} minute${mins > 1 ? 's' : ''}`;
//           } else {
//             timeStr = `${mins} minute${mins !== 1 ? 's' : ''}`;
//           }

//           setModalTitle("You're Early! ⏰");
//           setModalMessage(`Your shift starts at ${nextShift.startTime}. Please wait ${timeStr}.`);
//           setShowModal(true);
//         } else if (isLate && nextShift) {
//           setModalTitle("Shift Ended ⏹️");
//           setModalMessage(`Your shift ended at ${nextShift.endTime}. Login is only allowed during active shift hours.`);
//           setShowModal(true);
//         } else {
//           setError("Access denied. No valid shift window found.");
//         }
//       } else {
//         // ✅ Valid shift → Redirect
//         switch (role) {
//           case "Manager":
//             navigate("/manager-dashboard");
//             break;
//           case "Team-Member":
//             navigate("/team-dashboard");
//             break;
//           default:
//             navigate("/dashboard");
//         }
//       }

//     } catch (err) {
//       console.error('Login error:', err);
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//       // Also clear storage on error
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userRole');
//       localStorage.removeItem('userEmail');
//       localStorage.removeItem('roleId');
//       localStorage.removeItem('managerId');
//       localStorage.removeItem('userData');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (showVideo) {
//     return (
//       <div className={`video-splash-screen ${fadeOut ? "" : ""}`}>
//         <video
//           autoPlay
//           muted
//           playsInline
//           className="splash-video"
//           style={{ height: isMobile ? "100%" : "100%" }}
//         >
//           <source
//             src={isMobile ? "Video/mob.mp4" : "/Video/web.mp4"}
//             type="video/mp4"
//           />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     );
//   }

//   return (
//     <div className="login-page">
//       <div className="login-container row">
//         {/* Left Panel */}
//         <div className="col-md-6 login-left d-flex justify-content-center align-items-center">
//           <div className="login-left-content">
//             <img
//               src="https://ik.imagekit.io/43o9qlnbg/Eminoids%20-%20Logo_W.png"
//               alt="Logo"
//               className="login-logo"
//               style={{ width: "250px", height: "auto", marginBottom: "24px" }}
//             />
//             <h1 className="text-white">Welcome Back!</h1>
//             <p className="fw-bold text-strong">
//               Let's turn tasks into triumphs!
//             </p>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="col-md-6 login-right d-flex justify-content-center align-items-center">
//           <div className="login-form-container">
//             <form className="login-form" onSubmit={handleSubmit}>
//               <h4 className="login-form-title">
//                 Hello!
//                 <br />
//                 <span className="text-muted">Step in and take control.</span>
//               </h4>

//               {error && (
//                 <div className="alert alert-danger" role="alert">
//                   {error}
//                 </div>
//               )}

//               <div className="login-input-group">
//                 <FontAwesomeIcon
//                   icon={faEnvelope}
//                   className="login-input-icon"
//                 />
//                 <input
//                   type="text"
//                   className="form-control login-input"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="login-input-group">
//                 <FontAwesomeIcon icon={faLock} className="login-input-icon" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="form-control login-input"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <span
//                   className="password-toggle-icon"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//                 </span>
//               </div>

//               <button
//                 type="submit"
//                 className="btn login-submit-btn mt-3"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'LOGGING IN...' : 'LOG IN'}
//               </button>
//               <div className="text-center mt-3">
//                 <p className="text-muted">
//                   Version Build 1.0
//                 </p>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Shift Info Modal */}
//       <div className={`modal fade ${showModal ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
//         <div className="modal-dialog modal-dialog-centered" role="document">
//           <div className="modal-content">
//             <div className="modal-header bg-warning">
//               <h5 className="modal-title">{modalTitle}</h5>
//               <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
//             </div>
//             <div className="modal-body">
//               <p>{modalMessage}</p>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import BASE_URL from "../config";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowVideo(false);
      }, 1000);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Login
      const loginResponse = await axios.post(`${BASE_URL}user/login`, {
        email: email,
        password: password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { id, token, role, roleId } = loginResponse.data.data;
      console.log('Login response:', loginResponse.data);

      // Store in localStorage immediately (needed for shift API)
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('roleId', roleId);
      localStorage.setItem('managerId', id);
      localStorage.setItem('userData', JSON.stringify(loginResponse.data.data));

      // Step 2: If Admin → skip shift check
      if (role === "Admin") {
        navigate("/admin-dashboard");
        setIsLoading(false);
        return;
      }

      // Step 3: Fetch shifts
      const shiftsResponse = await axios.get(`${BASE_URL}shift/getAllShifts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allShifts = shiftsResponse.data.data || [];
      const memberId = parseInt(id, 10);
      const userShifts = allShifts.filter(shift => shift.memberId === memberId);

      // Get today in YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];

      // Filter today’s shifts
      const todayShifts = userShifts.filter(shift => shift.shiftDate === today);

      // Helper: Convert "HH:MM AM/PM" → minutes since midnight
      const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let hasValidShift = false;
      let isEarly = false;
      let isLate = false;
      let nextShift = null;

      // Check each shift
      for (const shift of todayShifts) {
        const startMinutes = parseTimeToMinutes(shift.startTime);
        const endMinutes = parseTimeToMinutes(shift.endTime);

        if (startMinutes === null || endMinutes === null) continue;

        // Overnight shift (e.g., 10PM to 6AM)
        if (startMinutes > endMinutes) {
          if (currentMinutes >= startMinutes || currentMinutes <= endMinutes) {
            hasValidShift = true;
            break;
          } else if (currentMinutes < startMinutes && currentMinutes > endMinutes) {
            isEarly = true;
            nextShift = shift;
            break;
          }
        } else {
          // Normal shift
          if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
            hasValidShift = true;
            break;
          } else if (currentMinutes < startMinutes) {
            isEarly = true;
            nextShift = shift;
            break;
          } else if (currentMinutes > endMinutes) {
            isLate = true;
            nextShift = shift;
            break;
          }
        }
      }

      // Handle invalid cases
      if (!hasValidShift) {
        // Clean up localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('roleId');
        localStorage.removeItem('managerId');
        localStorage.removeItem('userData');

        if (todayShifts.length === 0) {
          setModalTitle("No Shift Scheduled 📅");
          setModalMessage("You don’t have any shift assigned for today.");
          setShowModal(true);
        } else if (isEarly && nextShift) {
          const startMinutes = parseTimeToMinutes(nextShift.startTime);
          const diffMinutes = startMinutes - currentMinutes;
          const hours = Math.floor(diffMinutes / 60);
          const mins = diffMinutes % 60;

          let timeStr = "";
          if (hours > 0) {
            timeStr = `${hours} hour${hours > 1 ? 's' : ''}`;
            if (mins > 0) timeStr += ` and ${mins} minute${mins > 1 ? 's' : ''}`;
          } else {
            timeStr = `${mins} minute${mins !== 1 ? 's' : ''}`;
          }

          setModalTitle("You're Early! ⏰");
          setModalMessage(`Your shift starts at ${nextShift.startTime}. Please wait ${timeStr}.`);
          setShowModal(true);
        } else if (isLate && nextShift) {
          setModalTitle("Shift Ended ⏹️");
          setModalMessage(`Your shift ended at ${nextShift.endTime}. Login is only allowed during active shift hours.`);
          setShowModal(true);
        } else {
          setError("Access denied. No valid shift window found.");
        }
      } else {
        // ✅ Valid shift → Mark Attendance First

        try {
          const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const now = new Date();
          // Format time as "HH:MM AM/PM" e.g., "2:30 PM"
          const inTime = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
          });

          // Call markAttendance API
          // await axios.post(`${BASE_URL}attendance/markAttendance`, {
          //   memberId: id, // from login response
          //   attendanceDate: todayDate,
          //   status: "Present",
          //   inTime: inTime,
          //   outTime: "", // will be updated when user clocks out
          //   remarks: "Auto-marked on login during active shift"
          // }, {
          //   headers: { Authorization: `Bearer ${token}` }
          // });

          // console.log("✅ Attendance marked successfully on login.");

          // Call markAttendance API
          const attendanceResponse = await axios.post(`${BASE_URL}attendance/markAttendance`, {
            memberId: id, // from login response
            attendanceDate: todayDate,
            status: "Present",
            inTime: inTime,
            outTime: "", // will be updated when user clocks out
            remarks: "Auto-marked on login during active shift"
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Save attendance ID in localStorage
          const attendance = attendanceResponse.data.data; // Adjust if your API returns ID differently
          localStorage.setItem('attendance', JSON.stringify(attendance));
          console.log("✅ Attendance marked successfully on login.");

        } catch (attendanceError) {
          console.error("⚠️ Failed to mark attendance automatically:", attendanceError);
          // Do not block login — attendance is a side effect
        }

        // Now redirect based on role
        switch (role) {
          case "Manager":
            navigate("/manager-dashboard");
            break;
          case "Team-Member":
            navigate("/team-dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      // Also clear storage on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('roleId');
      localStorage.removeItem('managerId');
      localStorage.removeItem('userData');
    } finally {
      setIsLoading(false);
    }
  };

  if (showVideo) {
    return (
      <div className={`video-splash-screen ${fadeOut ? "" : ""}`}>
        <video
          autoPlay
          muted
          playsInline
          className="splash-video"
          style={{ height: isMobile ? "100%" : "100%" }}
        >
          <source
            src={isMobile ? "Video/mob.mp4" : "/Video/web.mp4"}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container row">
        {/* Left Panel */}
        <div className="col-md-6 login-left d-flex justify-content-center align-items-center">
          <div className="login-left-content">
            <img
              src="https://ik.imagekit.io/43o9qlnbg/Eminoids%20-%20Logo_W.png"
              alt="Logo"
              className="login-logo"
              style={{ width: "250px", height: "auto", marginBottom: "24px" }}
            />
            <h1 className="text-white">Welcome Back!</h1>
            <p className="fw-bold text-strong">
              Let's turn tasks into triumphs!
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 login-right d-flex justify-content-center align-items-center">
          <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
              <h4 className="login-form-title">
                Hello!
                <br />
                <span className="text-muted">Step in and take control.</span>
              </h4>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="login-input-group">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="login-input-icon"
                />
                <input
                  type="text"
                  className="form-control login-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-input-group">
                <FontAwesomeIcon icon={faLock} className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              <button
                type="submit"
                className="btn login-submit-btn mt-3"
                disabled={isLoading}
              >
                {isLoading ? 'LOGGING IN...' : 'LOG IN'}
              </button>
              <div className="text-center mt-3">
                <p className="text-muted">
                  Version Build 1.0
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Shift Info Modal */}
      <div className={`modal fade ${showModal ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-warning">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;