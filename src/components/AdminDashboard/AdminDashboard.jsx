// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Card,
//   Button,
//   Table,
//   Badge,
//   Modal,
//   Form,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { FaPlus, FaEye } from "react-icons/fa";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// export const ProjectsData = [
//   {
//     id: 1,
//     title: "Project 1",
//     client: "PN",
//     tasks: 8,
//     languages: 2,
//     application: "Word",
//     pages: 150,
//     dueDate: "2025-07-06",
//     qcDeadline: "2025-07-04",
//     qcHours: 12,
//     qcDueDate: "2025-07-05",
//     status: "Near Due",
//     handler: "Alice",
//     processStatus: "Completed",
//     qaReviewer: "Lisa",
//     qaStatus: "Passed",
//     serverPath: "/mnt/server/project/project-1",
//     taskTypes: ["OVA", "Image Localization", "Source Creation"],
//     applications: ["PPT", "Word", "AI"],
//     languagesList: ["sv", "de"],
//   },
//   {
//     id: 2,
//     title: "Project 2",
//     client: "MMP Auburn",
//     tasks: 8,
//     languages: 3,
//     application: "FM",
//     pages: 150,
//     dueDate: "2025-07-01",
//     qcDeadline: "2025-06-29",
//     qcHours: 10,
//     qcDueDate: "2025-06-30",
//     status: "Active",
//     handler: "John",
//     processStatus: "Completed",
//     qaReviewer: "Lisa",
//     qaStatus: "Passed",
//     serverPath: "/mnt/server/project/project-2",
//     taskTypes: ["Source Creation", "DTP"],
//     applications: ["Project", "Word", "CDR"],
//     languagesList: ["es-ES", "hi", "ne"],
//   },
//   {
//     id: 3,
//     title: "Project 3",
//     client: "MMP Eastlake",
//     tasks: 4,
//     languages: 4,
//     application: "Project",
//     pages: 150,
//     dueDate: "2025-07-13",
//     qcDeadline: "2025-07-11",
//     qcHours: 7,
//     qcDueDate: "2025-07-12",
//     status: "Active",
//     handler: "Bob",
//     processStatus: "Pending",
//     qaReviewer: "Lisa",
//     qaStatus: "In Review",
//     serverPath: "/mnt/server/project/project-3",
//     taskTypes: ["Source Creation"],
//     applications: ["PSD"],
//     languagesList: ["he", "mr", "es-MX", "bg"],
//   },
//   {
//     id: 4,
//     title: "Project 4",
//     client: "MMP Kirkland",
//     tasks: 3,
//     languages: 1,
//     application: "Visio",
//     pages: 120,
//     dueDate: "2025-07-13",
//     qcDeadline: "2025-07-11",
//     qcHours: 5,
//     qcDueDate: "2025-07-12",
//     status: "Near Due",
//     handler: "Eve",
//     processStatus: "Ongoing",
//     qaReviewer: "Mike",
//     qaStatus: "In Review",
//     serverPath: "/mnt/server/project/project-4",
//     taskTypes: ["Prep", "Image Localization", "DTP"],
//     applications: ["CDR", "PPT"],
//     languagesList: ["be"],
//   },
//   {
//     id: 5,
//     title: "Project 5",
//     client: "GN",
//     tasks: 3,
//     languages: 4,
//     application: "CDR",
//     pages: 180,
//     dueDate: "2025-07-07",
//     qcDeadline: "2025-07-05",
//     qcHours: 5,
//     qcDueDate: "2025-07-06",
//     status: "Active",
//     handler: "Bob",
//     processStatus: "Completed",
//     qaReviewer: "Mike",
//     qaStatus: "Pending",
//     serverPath: "/mnt/server/project/project-5",
//     taskTypes: ["Image Localization", "Prep"],
//     applications: ["PSD", "INDD", "PPT"],
//     languagesList: ["bs", "zh-TW", "sr-Cyrl", "zh"],
//   },
//   {
//     id: 6,
//     title: "Project 6",
//     client: "DM",
//     tasks: 3,
//     languages: 4,
//     application: "AE",
//     pages: 150,
//     dueDate: "2025-07-10",
//     qcDeadline: "2025-07-08",
//     qcHours: 5,
//     qcDueDate: "2025-07-09",
//     status: "Active",
//     handler: "Bob",
//     processStatus: "Ongoing",
//     qaReviewer: "Alan",
//     qaStatus: "Failed",
//     serverPath: "/mnt/server/project/project-6",
//     taskTypes: ["Source Creation", "OVA", "Callout"],
//     applications: ["CDR", "Word", "AI"],
//     languagesList: ["pa", "mn", "mt", "lt"],
//   },
//   {
//     id: 7,
//     title: "Project 7",
//     client: "RN",
//     tasks: 3,
//     languages: 1,
//     application: "PSD",
//     pages: 60,
//     dueDate: "2025-07-02",
//     qcDeadline: "2025-06-30",
//     qcHours: 14,
//     qcDueDate: "2025-07-01",
//     status: "Near Due",
//     handler: "John",
//     processStatus: "Ongoing",
//     qaReviewer: "Mike",
//     qaStatus: "Passed",
//     serverPath: "/mnt/server/project/project-7",
//     taskTypes: ["Image Creation"],
//     applications: ["PPT", "Word"],
//     languagesList: ["so"],
//   },
//   {
//     id: 8,
//     title: "Project 8",
//     client: "NI",
//     tasks: 4,
//     languages: 5,
//     application: "AI",
//     pages: 90,
//     dueDate: "2025-06-30",
//     qcDeadline: "2025-06-28",
//     qcHours: 12,
//     qcDueDate: "2025-06-29",
//     status: "Active",
//     handler: "Charlie",
//     processStatus: "Ongoing",
//     qaReviewer: "Alan",
//     qaStatus: "Failed",
//     serverPath: "/mnt/server/project/project-8",
//     taskTypes: ["Prep"],
//     applications: ["INDD", "Excel"],
//     languagesList: ["es-MX", "vi", "fil", "km", "am"],
//   },
//   {
//     id: 9,
//     title: "Project 9",
//     client: "LB",
//     tasks: 8,
//     languages: 5,
//     application: "INDD",
//     pages: 150,
//     dueDate: "2025-07-08",
//     qcDeadline: "2025-07-06",
//     qcHours: 14,
//     qcDueDate: "2025-07-07",
//     status: "Near Due",
//     handler: "David",
//     processStatus: "Pending",
//     qaReviewer: "Mike",
//     qaStatus: "In Review",
//     serverPath: "/mnt/server/project/project-9",
//     taskTypes: ["Callout", "DTP"],
//     applications: ["Project", "FM", "Word"],
//     languagesList: ["he", "km", "ku", "zh-Hant", "en"],
//   },
//   {
//     id: 10,
//     title: "Project 10",
//     client: "SSS",
//     tasks: 8,
//     languages: 2,
//     application: "Excel",
//     pages: 120,
//     dueDate: "2025-07-03",
//     qcDeadline: "2025-07-01",
//     qcHours: 7,
//     qcDueDate: "2025-07-02",
//     status: "Near Due",
//     handler: "Bob",
//     processStatus: "Completed",
//     qaReviewer: "Sarah",
//     qaStatus: "Failed",
//     serverPath: "/mnt/server/project/project-10",
//     taskTypes: ["DTP"],
//     applications: ["AI", "Excel"],
//     languagesList: ["af", "el"],
//   },
//   {
//     id: 11,
//     title: "Project 11",
//     client: "Cpea",
//     tasks: 6,
//     languages: 5,
//     application: "PPT",
//     pages: 60,
//     dueDate: "2025-06-30",
//     qcDeadline: "2025-06-28",
//     qcHours: 14,
//     qcDueDate: "2025-06-29",
//     status: "Overdue",
//     handler: "Alice",
//     processStatus: "Delayed",
//     qaReviewer: "Lisa",
//     qaStatus: "In Review",
//     serverPath: "/mnt/server/project/project-11",
//     taskTypes: ["Image Creation"],
//     applications: ["INDD", "Visio"],
//     languagesList: ["mn", "zh", "nl", "ar", "te"],
//   },
//   {
//     id: 12,
//     title: "Project 12",
//     client: "CV",
//     tasks: 7,
//     languages: 5,
//     application: "Word",
//     pages: 180,
//     dueDate: "2025-07-02",
//     qcDeadline: "2025-06-30",
//     qcHours: 10,
//     qcDueDate: "2025-07-01",
//     status: "Near Due",
//     handler: "Bob",
//     processStatus: "Completed",
//     qaReviewer: "Lisa",
//     qaStatus: "In Review",
//     serverPath: "/mnt/server/project/project-12",
//     taskTypes: ["DTP", "Source Creation", "OVA"],
//     applications: ["Project", "PSD", "INDD"],
//     languagesList: ["sr-Latn", "bs", "vi", "mt", "gl"],
//   },
// ];

// const getStatusColor = (status) => {
//   if (!status) return "secondary";

//   const statusMap = {
//     present: "success",
//     absent: "danger",
//     late: "warning",
//     "on leave": "info",
//     "half day": "primary",
//     holiday: "purple",
//     weekend: "dark",
//   };

//   return statusMap[status.toLowerCase()] || "secondary";
// };

// const useSyncScroll = () => {
//   const scrollContainerRef = useRef(null);
//   const fakeScrollbarRef = useRef(null);

//   useEffect(() => {
//     const scrollContainer = scrollContainerRef.current;
//     const fakeScrollbar = fakeScrollbarRef.current;

//     if (scrollContainer && fakeScrollbar) {
//       fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;

//       const syncScroll = () => {
//         fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
//       };
//       const syncFakeScroll = () => {
//         scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
//       };

//       scrollContainer.addEventListener("scroll", syncScroll);
//       fakeScrollbar.addEventListener("scroll", syncFakeScroll);

//       return () => {
//         scrollContainer.removeEventListener("scroll", syncScroll);
//         fakeScrollbar.removeEventListener("scroll", syncFakeScroll);
//       };
//     }
//   }, []);

//   return { scrollContainerRef, fakeScrollbarRef };
// };

// const AdminDashboard = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [editProject, setEditProject] = useState(null);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [activeFilter, setActiveFilter] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [viewMode, setViewMode] = useState("summary");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("All");
//   const [activeTab, setActiveTab] = useState(null);

//   const navigate = useNavigate();

//   const {
//     scrollContainerRef: scrollContainerRef1,
//     fakeScrollbarRef: fakeScrollbarRef1,
//   } = useSyncScroll();

//   const {
//     scrollContainerRef: scrollContainerRef2,
//     fakeScrollbarRef: fakeScrollbarRef2,
//   } = useSyncScroll();

//   const {
//     scrollContainerRef: scrollContainerRef3,
//     fakeScrollbarRef: fakeScrollbarRef3,
//   } = useSyncScroll();

//   const {
//     scrollContainerRef: scrollContainerRef4,
//     fakeScrollbarRef: fakeScrollbarRef4,
//   } = useSyncScroll();

//   const {
//     scrollContainerRef: scrollContainerRef5,
//     fakeScrollbarRef: fakeScrollbarRef5,
//   } = useSyncScroll();

//   useEffect(() => {
//     setProjects(ProjectsData);
//     setFilteredProjects(ProjectsData);
//   }, []);

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => setShowModal(false);

//   const handleView = (project) => {
//     setSelectedProject(project);
//     setShowViewModal(true);
//   };

//   const handleCardFilter = (type) => {
//     if (activeFilter === type) {
//       setActiveFilter(null);
//       setActiveTab(null);
//       setFilteredProjects([]);
//       return;
//     }

//     let filtered = [];
//     const today = new Date();
//     const nearDueDate = new Date();
//     nearDueDate.setDate(today.getDate() + 3);

//     switch (type) {
//       case "active":
//         filtered = projects.filter((p) => p.status === "Active");
//         break;
//       case "nearDue":
//         filtered = projects.filter((project) => {
//           if (project.status !== "Active") return false;
//           const dueDate = new Date(project.dueDate);
//           const now = new Date();
//           const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
//           return dueDate > now && dueDate <= thirtyMinsFromNow;
//         });
//         break;
//       case "overdue":
//         filtered = projects.filter((project) => {
//           const dueDate = new Date(project.dueDate);
//           return dueDate < today && project.status !== "Completed";
//         });
//         break;
//       case "teamOnDuty":
//         filtered = projects.filter((p) => p.status === "Team On-Duty");
//         break;
//       case "eventsToday":
//         const todayStr = today.toISOString().split("T")[0];
//         filtered = projects.filter((project) => {
//           return project.dueDate === todayStr || project.qcDueDate === todayStr;
//         });
//         break;
//       case "pendingApproval":
//         filtered = projects.filter((p) => p.qaStatus === "Pending");
//         break;
//       default:
//         filtered = projects;
//     }
//     setFilteredProjects(filtered);
//     setActiveFilter(type);
//     setActiveTab(type);
//   };

//   const todayStr = new Date().toISOString().split("T")[0];

//   const getCardCount = (cardType) => {
//     switch (cardType) {
//       case "active":
//         return projects.filter((p) => p.status === "Active").length;
//       case "nearDue":
//         return projects.filter((p) => {
//           if (p.status !== "Active") return false;
//           const dueDate = new Date(p.dueDate);
//           const now = new Date();
//           const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
//           return dueDate > now && dueDate <= thirtyMinsFromNow;
//         }).length;
//       case "overdue":
//         return projects.filter(
//           (p) => new Date(p.dueDate) < new Date() && p.status !== "Completed"
//         ).length;
//       case "pendingApproval":
//         return projects.filter((p) => p.qaStatus === "Pending").length;
//       case "teamOnDuty":
//         return attendanceData.length;
//       case "eventsToday":
//         return tasksToday.length;
//       default:
//         return 0;
//     }
//   };

//   const countFiltered = (type) => {
//     const today = new Date();
//     const nearDueDate = new Date();
//     nearDueDate.setDate(today.getDate() + 3);

//     switch (type) {
//       case "active":
//         return projects.filter((p) => p.status === "Active").length;
//       case "nearDue":
//         return projects.filter((project) => {
//           if (project.status !== "Active") return false;
//           const dueDate = new Date(project.dueDate);
//           const now = new Date();
//           const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
//           return dueDate > now && dueDate <= thirtyMinsFromNow;
//         }).length;
//       case "overdue":
//         return projects.filter((project) => {
//           const dueDate = new Date(project.dueDate);
//           return dueDate < today && project.status !== "Completed";
//         }).length;
//       case "teamOnDuty":
//         return projects.filter((p) => p.status === "Team On-Duty").length;
//       case "eventsToday":
//         return projects.filter((project) => {
//           const todayStr = today.toISOString().split("T")[0];
//           return project.dueDate === todayStr || project.qcDueDate === todayStr;
//         }).length;
//       case "pendingApproval":
//         return projects.filter((p) => p.qaStatus === "Pending").length;
//       default:
//         return projects.length;
//     }
//   };

//   const showAllProjects = () => {
//     setFilteredProjects(projects);
//     setActiveFilter("all");
//   };

//   const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

//   const [attendanceData, setAttendanceData] = useState([
//     {
//       id: 1,
//       employeeName: "John Doe",
//       employeeId: "EMP001",
//       department: "Engineering",
//       position: "Senior Developer",
//       month: "May 2025",
//       daysPresent: 18,
//       daysAbsent: 2,
//       lateArrivals: 3,
//       earlyDepartures: 1,
//       leaves: [
//         { date: "2025-05-05", type: "Sick Leave", status: "Approved" },
//         { date: "2025-05-06", type: "Sick Leave", status: "Approved" },
//       ],
//       dailyRecords: generateDailyRecords(1),
//     },
//     {
//       id: 2,
//       employeeName: "Jane Smith",
//       employeeId: "EMP002",
//       department: "Design",
//       position: "UI/UX Designer",
//       month: "May 2025",
//       daysPresent: 20,
//       daysAbsent: 0,
//       lateArrivals: 1,
//       earlyDepartures: 0,
//       leaves: [],
//       dailyRecords: generateDailyRecords(2),
//     },
//     {
//       id: 3,
//       employeeName: "Michael Johnson",
//       employeeId: "EMP003",
//       department: "Marketing",
//       position: "Marketing Specialist",
//       month: "May 2025",
//       daysPresent: 16,
//       daysAbsent: 4,
//       lateArrivals: 2,
//       earlyDepartures: 3,
//       leaves: [
//         { date: "2025-05-12", type: "Vacation", status: "Approved" },
//         { date: "2025-05-13", type: "Vacation", status: "Approved" },
//         { date: "2025-05-14", type: "Vacation", status: "Approved" },
//         { date: "2025-05-15", type: "Vacation", status: "Approved" },
//       ],
//       dailyRecords: generateDailyRecords(3),
//     },
//     {
//       id: 4,
//       employeeName: "Emily Davis",
//       employeeId: "EMP004",
//       department: "HR",
//       position: "HR Manager",
//       month: "May 2025",
//       daysPresent: 19,
//       daysAbsent: 1,
//       lateArrivals: 0,
//       earlyDepartures: 2,
//       leaves: [
//         { date: "2025-05-20", type: "Personal Leave", status: "Approved" },
//       ],
//       dailyRecords: generateDailyRecords(4),
//     },
//     {
//       id: 5,
//       employeeName: "Robert Wilson",
//       employeeId: "EMP005",
//       department: "Finance",
//       position: "Financial Analyst",
//       month: "May 2025",
//       daysPresent: 17,
//       daysAbsent: 3,
//       lateArrivals: 4,
//       earlyDepartures: 1,
//       leaves: [
//         { date: "2025-05-07", type: "Sick Leave", status: "Approved" },
//         { date: "2025-05-26", type: "Personal Leave", status: "Approved" },
//         { date: "2025-05-27", type: "Personal Leave", status: "Approved" },
//       ],
//       dailyRecords: generateDailyRecords(5),
//     },
//   ]);

//   function generateDailyRecords(seed) {
//     const records = [];
//     const startDate = new Date(2025, 3, 28);
//     const endDate = new Date(2025, 4, 27);

//     for (
//       let d = new Date(startDate);
//       d <= endDate;
//       d.setDate(d.getDate() + 1)
//     ) {
//       const isWeekend = d.getDay() === 0 || d.getDay() === 6;
//       const date = new Date(d);

//       const random = (seed * date.getDate()) % 10;
//       let status = "Present";
//       let checkIn = null;
//       let checkOut = null;

//       if (isWeekend) {
//         status = "Weekend";
//       } else if (random === 1) {
//         status = "Absent";
//       } else if (random === 2) {
//         status = "Leave";
//       } else {
//         const baseCheckIn = 9 * 60;
//         const baseCheckOut = 17 * 60;

//         const checkInVariation = (random - 5) * 10;
//         const checkOutVariation = (random - 3) * 10;

//         const checkInMinutes = baseCheckIn + checkInVariation;
//         const checkOutMinutes = baseCheckOut + checkOutVariation;

//         const checkInHour = Math.floor(checkInMinutes / 60);
//         const checkInMin = checkInMinutes % 60;
//         const checkOutHour = Math.floor(checkOutMinutes / 60);
//         const checkOutMin = checkOutMinutes % 60;

//         checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMin
//           .toString()
//           .padStart(2, "0")}`;
//         checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMin
//           .toString()
//           .padStart(2, "0")}`;

//         if (checkInMinutes > 9 * 60 + 15) {
//           status = "Late";
//         } else if (checkOutMinutes < 17 * 60 - 15) {
//           status = "Early Departure";
//         }
//       }

//       records.push({
//         date: date.toISOString().split("T")[0],
//         day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
//         status,
//         checkIn,
//         checkOut,
//         workHours:
//           checkIn && checkOut ? calculateWorkHours(checkIn, checkOut) : 0,
//       });
//     }
//     return records;
//   }

//   function calculateWorkHours(checkIn, checkOut) {
//     const [inHour, inMin] = checkIn.split(":").map(Number);
//     const [outHour, outMin] = checkOut.split(":").map(Number);
//     const inMinutes = inHour * 60 + inMin;
//     const outMinutes = outHour * 60 + outMin;

//     return Math.round((outMinutes - inMinutes) / 6) / 10;
//   }

//   const tasksToday = [
//     {
//       id: 1,
//       title: "Prepare Report",
//       description: "Compile monthly sales data and generate report.",
//       deadline: "2025-06-28 17:00",
//       assignedTo: "John Doe",
//     },
//     {
//       id: 2,
//       title: "Team Meeting",
//       description: "Weekly team sync to discuss progress.",
//       deadline: "2025-06-28 10:30",
//       assignedTo: "Sarah Khan",
//     },
//     {
//       id: 3,
//       title: "Client Follow-up",
//       description: "Call client for feedback and renewal discussion.",
//       deadline: "2025-06-28 15:00",
//       assignedTo: "Amit Patel",
//     },
//     {
//       id: 4,
//       title: "Design Review",
//       description: "Review new UI mockups from design team.",
//       deadline: "2025-06-28 12:00",
//       assignedTo: "Emily Smith",
//     },
//   ];

//   const todayAttendanceData = [
//     {
//       id: 1,
//       employeeName: "Arun Badode",
//       department: "Development",
//       position: "UI Developer",
//       status: "Present",
//       checkInTime: "10:05 AM",
//       checkOutTime: "07:30 PM",
//       isLate: true,
//       lateMinutes: 35,
//       isEarlyDeparture: false,
//       earlyMinutes: 0,
//       remarks: "Late due to traffic",
//     },
//     {
//       id: 2,
//       employeeName: "Neha Sharma",
//       department: "Management",
//       position: "Project Manager",
//       status: "Present",
//       checkInTime: "09:50 AM",
//       checkOutTime: "06:45 PM",
//       isLate: false,
//       lateMinutes: 0,
//       isEarlyDeparture: true,
//       earlyMinutes: 15,
//       remarks: "Left early for client meeting",
//     },
//     {
//       id: 3,
//       employeeName: "Ravi Verma",
//       department: "Development",
//       position: "Backend Developer",
//       status: "Absent",
//       checkInTime: null,
//       checkOutTime: null,
//       isLate: false,
//       lateMinutes: 0,
//       isEarlyDeparture: false,
//       earlyMinutes: 0,
//       remarks: "Informed sick leave",
//     },
//     {
//       id: 4,
//       employeeName: "Pooja Mehta",
//       department: "Testing",
//       position: "QA Engineer",
//       status: "Present",
//       checkInTime: "10:15 AM",
//       checkOutTime: "07:00 PM",
//       isLate: true,
//       lateMinutes: 45,
//       isEarlyDeparture: false,
//       earlyMinutes: 0,
//       remarks: "Working from home",
//     },
//     {
//       id: 5,
//       employeeName: "Kunal Joshi",
//       department: "Operations",
//       position: "DevOps Engineer",
//       status: "On Leave",
//       checkInTime: null,
//       checkOutTime: null,
//       isLate: false,
//       lateMinutes: 0,
//       isEarlyDeparture: false,
//       earlyMinutes: 0,
//       remarks: "Annual leave",
//     },
//   ];

//   // Helper function for status colors
//   const getStatusColor = (status) => {
//     if (!status) return "secondary";

//     const statusMap = {
//       present: "success",
//       absent: "danger",
//       late: "warning",
//       "on leave": "info",
//       "half day": "primary",
//     };

//     return statusMap[status.toLowerCase()] || "secondary";
//   };

//   const handleEmployeeSelect = (id) => {
//     setSelectedEmployee(id);
//     setViewMode("detailed");
//   };

//   const filteredEmployees = attendanceData.filter((employee) => {
//     const matchesSearch =
//       employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDepartment =
//       departmentFilter === "All" || employee.department === departmentFilter;
//     return matchesSearch && matchesDepartment;
//   });

//   return (
//     <div className="admin-dashboard text-white p-3 p-md-4 bg-main">
//       <style>
//         {`
//           .active-tab {
//             transform: translateY(-5px);
//             box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
//             border: 3px solid white !important;
//           }
          
//           .primary-active {
//             background: linear-gradient(135deg, #4F46E5, #7C73E6) !important;
//           }
          
//           .warning-active {
//             background: linear-gradient(135deg, #F59E0B, #FBBF24) !important;
//             color: white !important;
//           }
          
//           .danger-active {
//             background: linear-gradient(135deg, #EF4444, #F87171) !important;
//           }
          
//           .info-active {
//             background: linear-gradient(135deg, #0EA5E9, #38BDF8) !important;
//           }
          
//           .success-active {
//             background: linear-gradient(135deg, #10B981, #34D399) !important;
//           }
          
//           .secondary-active {
//             background: linear-gradient(135deg, #64748B, #94A3B8) !important;
//           }
          
//           .active-tab .text-white {
//             color: white !important;
//           }
//         `}
//       </style>

//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
//         <h2 className="gradient-heading">Admin Dashboard</h2>
//         <div className="d-flex flex-column flex-sm-row gap-2"></div>
//       </div>

//       <Row className="mb-4 g-3">
//         {[
//           {
//             key: "active",
//             title: "Active Projects",
//             icon: "bi-rocket-takeoff",
//             color: "primary",
//             activeColor: "primary-active",
//           },
//           {
//             key: "nearDue",
//             title: "Near Due",
//             icon: "bi-hourglass-split",
//             color: "warning text-dark",
//             activeColor: "warning-active",
//           },
//           {
//             key: "overdue",
//             title: "Overdue",
//             icon: "bi-exclamation-octagon",
//             color: "danger",
//             activeColor: "danger-active",
//           },
//           {
//             key: "teamOnDuty",
//             title: "Team On-Duty",
//             icon: "bi-people-fill",
//             color: "info",
//             activeColor: "info-active",
//           },
//           {
//             key: "eventsToday",
//             title: "Events Today",
//             icon: "bi-calendar-event",
//             color: "success",
//             activeColor: "success-active",
//           },
//           {
//             key: "pendingApproval",
//             title: "Pending Approval",
//             icon: "bi-clock-history",
//             color: "secondary",
//             activeColor: "secondary-active",
//             link: "/action-center",
//           },
//         ].map(({ key, title, icon, color, activeColor, link }) => (
//           <Col xs={12} sm={6} md={2} key={key}>
//             <Card
//               className={`bg-${
//                 color.split(" ")[0]
//               } bg-gradient p-3 rounded-4 shadow-sm border-0 w-100  ${
//                 activeTab === key ? `active-tab ${activeColor}` : ""
//               }`}
//               onClick={() =>
//                 link ? (window.location.href = link) : handleCardFilter(key)
//               }
//               style={{
//                 cursor: "pointer",
//                 minHeight: "140px",
//                 height: "130px",
//                 transition: "all 0.2s ease-in-out",
//               }}
//             >
//               <Card.Body className="d-flex flex-column justify-content-between h-100 text-white">
//                 <div className="d-flex  justify-content-center  align-items-center gap-2">
//                   <i className={`bi ${icon} fs-4`}></i>
//                   <Card.Title className="fs-6  fw-semibold mb-0">
//                     {title}
//                   </Card.Title>
//                 </div>
//                 <h3 className="fw-bold text-center m-0">{getCardCount(key)}</h3>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {activeFilter === "active" && (
//         <Card className="text-white p-3 mb-4 table-gradient-bg">
//           <div
//             ref={fakeScrollbarRef1}
//             style={{
//               overflowX: "auto",
//               overflowY: "hidden",
//               height: 16,
//               position: "fixed",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               zIndex: 1050,
//             }}
//           >
//             <div style={{ width: "2000px", height: 1 }} />
//           </div>
//           <h4 className="mb-3">Active Projects</h4>
//           <div
//             className=""
//             ref={scrollContainerRef1}
//             style={{
//               maxHeight: "500px",
//               overflowX: "auto",
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             <Table className="table-gradient-bg align-middle table table-bordered table-hover">
//               <thead
//                 className="table-gradient-bg table"
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 0,
//                   backgroundColor: "#fff", // Match your background color
//                 }}
//               >
//                 <tr className="text-center">
//                   <th>ID</th>
//                   <th>Project Title</th>
//                   <th>Client</th>
//                   <th>Tasks</th>
//                   <th>Languages</th>
//                   <th>Application</th>
//                   <th>Total Pages</th>
//                   <th>Actual Due Date</th>
//                   <th>Ready for QC Deadline</th>
//                   <th>QC Hrs</th>
//                   <th>QC Due Date</th>
//                   <th>Status</th>
//                   <th>Handler</th>
//                   <th>QA Reviewer</th>
//                   <th>QA Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProjects.map((project) => (
//                   <tr className="text-center" key={project.id}>
//                     <td>{project.id}</td>
//                     <td>{project.title}</td>
//                     <td>{project.client}</td>
//                     <td>{project.tasks}</td>
//                     <td>{project.languages}</td>
//                     <td>{project.application}</td>
//                     <td>{project.pages}</td>
//                     <td>{project.dueDate}</td>
//                     <td>{project.qcDeadline}</td>
//                     <td>{project.qcHours}</td>
//                     <td>{project.qcDueDate}</td>
//                     <td>
//                       <Badge
//                         bg={
//                           project.status === "Completed"
//                             ? "success"
//                             : project.status === "On Hold"
//                             ? "warning"
//                             : project.status === "Active"
//                             ? "primary"
//                             : project.status === "Near Due"
//                             ? "info"
//                             : project.status === "Overdue"
//                             ? "danger"
//                             : project.status === "Team On-Duty"
//                             ? "secondary"
//                             : "dark"
//                         }
//                       >
//                         {project.status}
//                       </Badge>
//                     </td>
//                     <td>{project.handler}</td>
//                     <td>{project.qaReviewer}</td>
//                     <td>
//                       <Badge
//                         bg={
//                           project.qaStatus === "Passed"
//                             ? "success"
//                             : project.qaStatus === "Failed"
//                             ? "danger"
//                             : project.qaStatus === "In Review"
//                             ? "info"
//                             : "secondary"
//                         }
//                       >
//                         {project.qaStatus}
//                       </Badge>
//                     </td>
//                     <td>
//                       <Button
//                         variant="link"
//                         className="text-info p-0 ms-3"
//                         title="View"
//                         onClick={() => handleView(project)}
//                       >
//                         <FaEye />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card>
//       )}

//       {activeFilter === "nearDue" && (
//         <Card className="text-white p-3 mb-4 table-gradient-bg">
//           <div
//             ref={fakeScrollbarRef2}
//             style={{
//               overflowX: "auto",
//               overflowY: "hidden",
//               height: 16,
//               position: "fixed",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               zIndex: 1050,
//             }}
//           >
//             <div style={{ width: "2000px", height: 1 }} />
//           </div>
//           <h4 className="mb-3">Near Due Projects (Next 30 Minutes)</h4>
//           <div
//             className=""
//             ref={scrollContainerRef2}
//             style={{
//               maxHeight: "500px",
//               overflowX: "auto",
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             <Table className="table-gradient-bg align-middle table table-bordered table-hover">
//               <thead
//                 className="table-gradient-bg table"
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 0,
//                   backgroundColor: "#fff", // Match your background color
//                 }}
//               >
//                 <tr className="text-center">
//                   <th>ID</th>
//                   <th>Project Title</th>
//                   <th>Client</th>
//                   <th>Tasks</th>
//                   <th>Languages</th>
//                   <th>Application</th>
//                   <th>Total Pages</th>
//                   <th>Actual Due Date</th>
//                   <th>Ready for QC Deadline</th>
//                   <th>QC Hrs</th>
//                   <th>QC Due Date</th>
//                   <th>Status</th>
//                   <th>Handler</th>
//                   <th>QA Reviewer</th>
//                   <th>QA Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProjects.map((project) => (
//                   <tr className="text-center" key={project.id}>
//                     <td>{project.id}</td>
//                     <td>{project.title}</td>
//                     <td>{project.client}</td>
//                     <td>{project.tasks}</td>
//                     <td>{project.languages}</td>
//                     <td>{project.application}</td>
//                     <td>{project.pages}</td>
//                     <td>{project.dueDate}</td>
//                     <td>{project.qcDeadline}</td>
//                     <td>{project.qcHours}</td>
//                     <td>{project.qcDueDate}</td>
//                     <td>
//                       <Badge
//                         bg={
//                           project.status === "Completed"
//                             ? "success"
//                             : project.status === "On Hold"
//                             ? "warning"
//                             : project.status === "Active"
//                             ? "primary"
//                             : project.status === "Near Due"
//                             ? "info"
//                             : project.status === "Overdue"
//                             ? "danger"
//                             : project.status === "Team On-Duty"
//                             ? "secondary"
//                             : "dark"
//                         }
//                       >
//                         {project.status}
//                       </Badge>
//                     </td>
//                     <td>{project.handler}</td>
//                     <td>{project.qaReviewer}</td>
//                     <td>
//                       <Badge
//                         bg={
//                           project.qaStatus === "Passed"
//                             ? "success"
//                             : project.qaStatus === "Failed"
//                             ? "danger"
//                             : project.qaStatus === "In Review"
//                             ? "info"
//                             : "secondary"
//                         }
//                       >
//                         {project.qaStatus}
//                       </Badge>
//                     </td>
//                     <td>
//                       <Button
//                         variant="link"
//                         className="text-info p-0 ms-3"
//                         title="View"
//                         onClick={() => handleView(project)}
//                       >
//                         <FaEye />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card>
//       )}

//       {activeFilter === "overdue" && (
//         <Card className="text-white p-3 mb-4 table-gradient-bg">
//           <div
//             ref={fakeScrollbarRef3}
//             style={{
//               overflowX: "auto",
//               overflowY: "hidden",
//               height: 16,
//               position: "fixed",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               zIndex: 1050,
//             }}
//           >
//             <div style={{ width: "2000px", height: 1 }} />
//           </div>
//           <h4 className="mb-3">Overdue Projects</h4>
//           <div
//             className=""
//             ref={scrollContainerRef3}
//             style={{
//               maxHeight: "500px",
//               overflowX: "auto",
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             <Table className="table-gradient-bg align-middle table table-bordered table-hover">
//               <thead
//                 className="table-gradient-bg table"
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 0,
//                   backgroundColor: "#fff", // Match your background color
//                 }}
//               >
//                 <tr className="text-center">
//                   <th>ID</th>
//                   <th>Project Title</th>
//                   <th>Client</th>
//                   <th>Tasks</th>
//                   <th>Languages</th>
//                   <th>Application</th>
//                   <th>Total Pages</th>
//                   <th>Actual Due Date</th>
//                   <th>Ready for QC Deadline</th>
//                   <th>QC Hrs</th>
//                   <th>QC Due Date</th>
//                   <th>Status</th>
//                   <th>Handler</th>
//                   <th>QA Reviewer</th>
//                   <th>QA Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProjects.map((project) => (
//                   <tr className="text-center" key={project.id}>
//                     <td>{project.id}</td>
//                     <td>{project.title}</td>
//                     <td>{project.client}</td>
//                     <td>{project.tasks}</td>
//                     <td>{project.languages}</td>
//                     <td>{project.application}</td>
//                     <td>{project.pages}</td>
//                     <td>{project.dueDate}</td>
//                     <td>{project.qcDeadline}</td>
//                     <td>{project.qcHours}</td>
//                     <td>{project.qcDueDate}</td>
//                     <td>
//                       <Badge
//                         bg={
//                           project.status === "Completed"
//                             ? "success"
//                             : project.status === "On Hold"
//                             ? "warning"
//                             : project.status === "Active"
//                             ? "primary"
//                             : project.status === "Near Due"
//                             ? "info"
//                             : project.status === "Overdue"
//                             ? "danger"
//                             : project.status === "Team On-Duty"
//                             ? "secondary"
//                             : "dark"
//                         }
//                       >
//                         {project.status}
//                       </Badge>
//                     </td>
//                     <td>{project.handler}</td>
//                     <td>{project.qaReviewer}</td>
//                     <td>
//                       <Badge
//                         bg={
//                           project.qaStatus === "Passed"
//                             ? "success"
//                             : project.qaStatus === "Failed"
//                             ? "danger"
//                             : project.qaStatus === "In Review"
//                             ? "info"
//                             : "secondary"
//                         }
//                       >
//                         {project.qaStatus}
//                       </Badge>
//                     </td>
//                     <td>
//                       <Button
//                         variant="link"
//                         className="text-info p-0 ms-3"
//                         title="View"
//                         onClick={() => handleView(project)}
//                       >
//                         <FaEye />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card>
//       )}

//       {activeFilter === "teamOnDuty" && (
//         <Card className="text-white p-3 mb-4 table-gradient-bg">
//           {/* ... other existing card code ... */}
//           <table className="table table-hover mb-0">
//             <thead
//               className="table-gradient-bg table"
//               style={{
//                 position: "sticky",
//                 top: 0,
//                 zIndex: 0,
//                 backgroundColor: "#fff", // Match your background color
//               }}
//             >
//               <tr className="text-center">
//                 <th>Employee</th>
//                 <th>Department</th>
//                 <th>Check-In Time</th>
//                 <th>Check-Out Time</th>
//                 <th>Status</th>
//                 <th>Late Arrival</th>
//                 <th>Early Departure</th>
//                 <th>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {todayAttendanceData.map((employee) => {
//                 const initials = employee.employeeName
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("");
//                 const statusColor = getStatusColor(employee.status);

//                 return (
//                   <tr className="text-center" key={employee.id}>
//                     <td>
//                       <div className="d-flex align-items-center">
//                         <div className="avatar avatar-sm bg-light-primary rounded me-3">
//                           <span className="avatar-text">{initials}</span>
//                         </div>
//                         <div>
//                           <div className="fw-semibold">
//                             {employee.employeeName}
//                           </div>
//                           <div className="small">{employee.position}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>{employee.department}</td>
//                     <td>
//                       {employee.checkInTime ? (
//                         <span className="badge bg-success-subtle text-success">
//                           {employee.checkInTime}
//                         </span>
//                       ) : (
//                         <span className="badge bg-secondary-subtle text-secondary">
//                           Not Checked In
//                         </span>
//                       )}
//                     </td>
//                     <td>
//                       {employee.checkOutTime ? (
//                         <span className="badge bg-info-subtle text-info">
//                           {employee.checkOutTime}
//                         </span>
//                       ) : (
//                         <span className="badge bg-secondary-subtle text-secondary">
//                           Not Checked Out
//                         </span>
//                       )}
//                     </td>
//                     <td>
//                       <span
//                         className={`badge bg-${statusColor}-subtle text-${statusColor}`}
//                       >
//                         {employee.status}
//                       </span>
//                     </td>
//                     <td>
//                       {employee.isLate ? (
//                         <span className="badge bg-warning-subtle text-warning">
//                           Yes ({employee.lateMinutes} mins)
//                         </span>
//                       ) : (
//                         <span className="badge bg-success-subtle text-success">
//                           No
//                         </span>
//                       )}
//                     </td>
//                     <td>
//                       {employee.isEarlyDeparture ? (
//                         <span className="badge bg-warning-subtle text-warning">
//                           Yes ({employee.earlyMinutes} mins)
//                         </span>
//                       ) : (
//                         <span className="badge bg-success-subtle text-success">
//                           No
//                         </span>
//                       )}
//                     </td>
//                     <td>{employee.remarks}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//           {/* ... rest of card code ... */}
//         </Card>
//       )}

//       {activeFilter === "eventsToday" && (
//         <Card className="text-white p-3 mb-4 table-gradient-bg">
//           <div
//             ref={fakeScrollbarRef5}
//             style={{
//               overflowX: "auto",
//               overflowY: "hidden",
//               height: 16,
//               position: "fixed",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               zIndex: 1050,
//             }}
//           >
//             <div style={{ width: "2000px", height: 1 }} />
//           </div>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h4 className="mb-0">Today's Events</h4>
//             <Link to="/calendar" className="text-decoration-none">
//               <Button className="gradient-button me-2">Go To Calendar</Button>
//             </Link>
//           </div>
//           <div
//             className="table-responsive"
//             ref={scrollContainerRef5}
//             style={{
//               maxHeight: "500px",
//               overflowX: "auto",
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             <table className="table table-hover mb-0">
//               <thead
//                 className="table-gradient-bg table"
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   zIndex: 0,
//                   backgroundColor: "#fff", // Match your background color
//                 }}
//               >
//                 <tr className="text-center">
//                   <th>Task Title</th>
//                   <th>Description</th>
//                   <th>Deadline</th>
//                   <th>Assign to</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasksToday.map((task) => (
//                   <tr className="text-center" key={task.id}>
//                     <td>{task.title}</td>
//                     <td>{task.description}</td>
//                     <td>{task.deadline}</td>
//                     <td>{task.assignedTo}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       <Modal
//         show={showViewModal}
//         onHide={() => setShowViewModal(false)}
//         centered
//         className="custom-modal-dark"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Project Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedProject && (
//             <div>
//               <p>
//                 <strong>Title:</strong> {selectedProject.title}
//               </p>
//               <p>
//                 <strong>Client:</strong> {selectedProject.client}
//               </p>
//               <p>
//                 <strong>Application:</strong> {selectedProject.application}
//               </p>
//               <p>
//                 <strong>Pages:</strong> {selectedProject.pages}
//               </p>
//               <p>
//                 <strong>Due Date:</strong> {selectedProject.dueDate}
//               </p>
//               <p>
//                 <strong>Status:</strong> {selectedProject.status}
//               </p>
//               <p>
//                 <strong>Handler:</strong> {selectedProject.handler}
//               </p>
//               <p>
//                 <strong>QA Reviewer:</strong> {selectedProject.qaReviewer}
//               </p>
//               <p>
//                 <strong>QA Status:</strong> {selectedProject.qaStatus}
//               </p>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default AdminDashboard;
