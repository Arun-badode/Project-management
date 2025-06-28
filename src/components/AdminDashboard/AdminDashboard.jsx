import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { FaPlus, FaEye } from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
const AdminDashboard = () => {
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("summary");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const fakeScrollbar = fakeScrollbarRef.current;

    if (scrollContainer && fakeScrollbar) {
      fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;

      const syncScroll = () => {
        fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
      };
      const syncFakeScroll = () => {
        scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
      };

      scrollContainer.addEventListener("scroll", syncScroll);
      fakeScrollbar.addEventListener("scroll", syncFakeScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", syncScroll);
        fakeScrollbar.removeEventListener("scroll", syncFakeScroll);
      };
    }
  }, []);

  // 

  const staticProjects = [
    {
      id: 1,
      title: "Project 1",
      client: "Acme Corp",
      tasks: 8,
      languages: 3,
      platform: "Web",
      pages: 120,
      dueDate: "2025-06-28",
      qcDeadline: "2025-06-26",
      qcHours: 14,
      qcDueDate: "2025-06-27",
      status: "Active",
      handler: "Jane",
      processStatus: "Ongoing",
      qaReviewer: "Alan",
      qaStatus: "Pending",
      serverPath: "/mnt/server/project/project-1",
    },
    {
      id: 2,
      title: "Project 2",
      client: "Globex",
      tasks: 6,
      languages: 4,
      platform: "Mobile",
      pages: 180,
      dueDate: "2025-07-05",
      qcDeadline: "2025-07-03",
      qcHours: 8,
      qcDueDate: "2025-07-04",
      status: "Team On-Duty",
      handler: "John",
      processStatus: "Delayed",
      qaReviewer: "Sarah",
      qaStatus: "Failed",
      serverPath: "/mnt/server/project/project-2",
    },
    {
      id: 3,
      title: "Project 3",
      client: "Soylent",
      tasks: 10,
      languages: 2,
      platform: "Desktop",
      pages: 95,
      dueDate: "2025-06-20",
      qcDeadline: "2025-06-18",
      qcHours: 12,
      qcDueDate: "2025-06-19",
      status: "Overdue",
      handler: "Alice",
      processStatus: "Completed",
      qaReviewer: "Mike",
      qaStatus: "Passed",
      serverPath: "/mnt/server/project/project-3",
    },
    {
      id: 4,
      title: "Project 4",
      client: "Initech",
      tasks: 5,
      languages: 1,
      platform: "Web",
      pages: 60,
      dueDate: "2025-06-29",
      qcDeadline: "2025-06-27",
      qcHours: 6,
      qcDueDate: "2025-06-28",
      status: "Near Due",
      handler: "Bob",
      processStatus: "Ongoing",
      qaReviewer: "Lisa",
      qaStatus: "In Review",
      serverPath: "/mnt/server/project/project-4",
    },
    {
      id: 5,
      title: "Project 5",
      client: "Umbrella",
      tasks: 3,
      languages: 3,
      platform: "Mobile",
      pages: 130,
      dueDate: "2025-07-10",
      qcDeadline: "2025-07-08",
      qcHours: 10,
      qcDueDate: "2025-07-09",
      status: "Active",
      handler: "Charlie",
      processStatus: "Ongoing",
      qaReviewer: "David",
      qaStatus: "Pending",
      serverPath: "/mnt/server/project/project-5",
    },
    {
      id: 6,
      title: "Project 6",
      client: "Wayne Ent",
      tasks: 7,
      languages: 4,
      platform: "Desktop",
      pages: 110,
      dueDate: "2025-06-22",
      qcDeadline: "2025-06-20",
      qcHours: 11,
      qcDueDate: "2025-06-21",
      status: "Overdue",
      handler: "Eve",
      processStatus: "Completed",
      qaReviewer: "Alan",
      qaStatus: "Passed",
      serverPath: "/mnt/server/project/project-6",
    },
    {
      id: 7,
      title: "Project 7",
      client: "Stark Ind",
      tasks: 4,
      languages: 5,
      platform: "Web",
      pages: 150,
      dueDate: "2025-07-02",
      qcDeadline: "2025-06-30",
      qcHours: 7,
      qcDueDate: "2025-07-01",
      status: "Near Due",
      handler: "Jane",
      processStatus: "Ongoing",
      qaReviewer: "Sarah",
      qaStatus: "In Review",
      serverPath: "/mnt/server/project/project-7",
    },
    {
      id: 8,
      title: "Project 8",
      client: "Oscorp",
      tasks: 9,
      languages: 3,
      platform: "Mobile",
      pages: 200,
      dueDate: "2025-07-15",
      qcDeadline: "2025-07-13",
      qcHours: 20,
      qcDueDate: "2025-07-14",
      status: "Active",
      handler: "John",
      processStatus: "Pending",
      qaReviewer: "Mike",
      qaStatus: "Failed",
      serverPath: "/mnt/server/project/project-8",
    },
    {
      id: 9,
      title: "Project 9",
      client: "Acme Corp",
      tasks: 2,
      languages: 1,
      platform: "Desktop",
      pages: 80,
      dueDate: "2025-06-19",
      qcDeadline: "2025-06-17",
      qcHours: 3,
      qcDueDate: "2025-06-18",
      status: "Overdue",
      handler: "Alice",
      processStatus: "Delayed",
      qaReviewer: "Lisa",
      qaStatus: "In Review",
      serverPath: "/mnt/server/project/project-9",
    },
    {
      id: 10,
      title: "Project 10",
      client: "Globex",
      tasks: 6,
      languages: 2,
      platform: "Web",
      pages: 105,
      dueDate: "2025-07-01",
      qcDeadline: "2025-06-29",
      qcHours: 5,
      qcDueDate: "2025-06-30",
      status: "Team On-Duty",
      handler: "Bob",
      processStatus: "Ongoing",
      qaReviewer: "David",
      qaStatus: "Passed",
      serverPath: "/mnt/server/project/project-10",
    },
    {
      id: 11,
      title: "Project 11",
      client: "Soylent",
      tasks: 4,
      languages: 5,
      platform: "Mobile",
      pages: 140,
      dueDate: "2025-06-30",
      qcDeadline: "2025-06-28",
      qcHours: 9,
      qcDueDate: "2025-06-29",
      status: "Near Due",
      handler: "Eve",
      processStatus: "Ongoing",
      qaReviewer: "Alan",
      qaStatus: "Passed",
      serverPath: "/mnt/server/project/project-11",
    },
    {
      id: 12,
      title: "Project 12",
      client: "Initech",
      tasks: 7,
      languages: 3,
      platform: "Web",
      pages: 90,
      dueDate: "2025-06-21",
      qcDeadline: "2025-06-19",
      qcHours: 6,
      qcDueDate: "2025-06-20",
      status: "Overdue",
      handler: "Charlie",
      processStatus: "Completed",
      qaReviewer: "Sarah",
      qaStatus: "Failed",
      serverPath: "/mnt/server/project/project-12",
    },
    {
      id: 13,
      title: "Project 13",
      client: "Umbrella",
      tasks: 8,
      languages: 2,
      platform: "Desktop",
      pages: 160,
      dueDate: "2025-07-03",
      qcDeadline: "2025-07-01",
      qcHours: 13,
      qcDueDate: "2025-07-02",
      status: "Team On-Duty",
      handler: "David",
      processStatus: "Pending",
      qaReviewer: "Lisa",
      qaStatus: "In Review",
      serverPath: "/mnt/server/project/project-13",
    },
    {
      id: 14,
      title: "Project 14",
      client: "Wayne Ent",
      tasks: 5,
      languages: 4,
      platform: "Mobile",
      pages: 115,
      dueDate: "2025-07-07",
      qcDeadline: "2025-07-05",
      qcHours: 10,
      qcDueDate: "2025-07-06",
      status: "Active",
      handler: "Jane",
      processStatus: "Ongoing",
      qaReviewer: "Mike",
      qaStatus: "Pending",
      serverPath: "/mnt/server/project/project-14",
    },
    {
      id: 15,
      title: "Project 15",
      client: "Stark Ind",
      tasks: 3,
      languages: 1,
      platform: "Web",
      pages: 70,
      dueDate: "2025-06-23",
      qcDeadline: "2025-06-21",
      qcHours: 4,
      qcDueDate: "2025-06-22",
      status: "Overdue",
      handler: "John",
      processStatus: "Delayed",
      qaReviewer: "David",
      qaStatus: "Failed",
      serverPath: "/mnt/server/project/project-15",
    },
  ];

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      position: "Senior Developer",
      month: "May 2025",
      daysPresent: 18,
      daysAbsent: 2,
      lateArrivals: 3,
      earlyDepartures: 1,
      leaves: [
        { date: "2025-05-05", type: "Sick Leave", status: "Approved" },
        { date: "2025-05-06", type: "Sick Leave", status: "Approved" },
      ],
      dailyRecords: generateDailyRecords(1),
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      department: "Design",
      position: "UI/UX Designer",
      month: "May 2025",
      daysPresent: 20,
      daysAbsent: 0,
      lateArrivals: 1,
      earlyDepartures: 0,
      leaves: [],
      dailyRecords: generateDailyRecords(2),
    },
    {
      id: 3,
      employeeName: "Michael Johnson",
      employeeId: "EMP003",
      department: "Marketing",
      position: "Marketing Specialist",
      month: "May 2025",
      daysPresent: 16,
      daysAbsent: 4,
      lateArrivals: 2,
      earlyDepartures: 3,
      leaves: [
        { date: "2025-05-12", type: "Vacation", status: "Approved" },
        { date: "2025-05-13", type: "Vacation", status: "Approved" },
        { date: "2025-05-14", type: "Vacation", status: "Approved" },
        { date: "2025-05-15", type: "Vacation", status: "Approved" },
      ],
      dailyRecords: generateDailyRecords(3),
    },
    {
      id: 4,
      employeeName: "Emily Davis",
      employeeId: "EMP004",
      department: "HR",
      position: "HR Manager",
      month: "May 2025",
      daysPresent: 19,
      daysAbsent: 1,
      lateArrivals: 0,
      earlyDepartures: 2,
      leaves: [
        { date: "2025-05-20", type: "Personal Leave", status: "Approved" },
      ],
      dailyRecords: generateDailyRecords(4),
    },
    {
      id: 5,
      employeeName: "Robert Wilson",
      employeeId: "EMP005",
      department: "Finance",
      position: "Financial Analyst",
      month: "May 2025",
      daysPresent: 17,
      daysAbsent: 3,
      lateArrivals: 4,
      earlyDepartures: 1,
      leaves: [
        { date: "2025-05-07", type: "Sick Leave", status: "Approved" },
        { date: "2025-05-26", type: "Personal Leave", status: "Approved" },
        { date: "2025-05-27", type: "Personal Leave", status: "Approved" },
      ],
      dailyRecords: generateDailyRecords(5),
    },
  ]);

  const tasksToday = [
    {
      id: 1,
      title: "Prepare Report",
      description: "Compile monthly sales data and generate report.",
      deadline: "2025-06-28 17:00",
      assignedTo: "John Doe",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync to discuss progress.",
      deadline: "2025-06-28 10:30",
      assignedTo: "Sarah Khan",
    },
    {
      id: 3,
      title: "Client Follow-up",
      description: "Call client for feedback and renewal discussion.",
      deadline: "2025-06-28 15:00",
      assignedTo: "Amit Patel",
    },
    {
      id: 4,
      title: "Design Review",
      description: "Review new UI mockups from design team.",
      deadline: "2025-06-28 12:00",
      assignedTo: "Emily Smith",
    },
  ];


  function generateDailyRecords(seed) {
    const records = [];
    // Generate records from 28th of previous month to 27th of current month
    const startDate = new Date(2025, 3, 28); // April 28, 2025
    const endDate = new Date(2025, 4, 27); // May 27, 2025

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const date = new Date(d);

      // Use seed to create some variation in the data
      const random = (seed * date.getDate()) % 10;
      let status = "Present";
      let checkIn = null;
      let checkOut = null;

      if (isWeekend) {
        status = "Weekend";
      } else if (random === 1) {
        status = "Absent";
      } else if (random === 2) {
        status = "Leave";
      } else {
        // Normal working day
        const baseCheckIn = 9 * 60; // 9:00 AM in minutes
        const baseCheckOut = 17 * 60; // 5:00 PM in minutes

        // Add some variation
        const checkInVariation = (random - 5) * 10;
        const checkOutVariation = (random - 3) * 10;

        const checkInMinutes = baseCheckIn + checkInVariation;
        const checkOutMinutes = baseCheckOut + checkOutVariation;

        const checkInHour = Math.floor(checkInMinutes / 60);
        const checkInMin = checkInMinutes % 60;
        const checkOutHour = Math.floor(checkOutMinutes / 60);
        const checkOutMin = checkOutMinutes % 60;

        checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMin
          .toString()
          .padStart(2, "0")}`;
        checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMin
          .toString()
          .padStart(2, "0")}`;

        if (checkInMinutes > 9 * 60 + 15) {
          // If check-in after 9:15
          status = "Late";
        } else if (checkOutMinutes < 17 * 60 - 15) {
          // If check-out before 4:45
          status = "Early Departure";
        }
      }

      records.push({
        date: date.toISOString().split("T")[0],
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
        status,
        checkIn,
        checkOut,
        workHours:
          checkIn && checkOut ? calculateWorkHours(checkIn, checkOut) : 0,
      });
    }
    return records;
  }

  function calculateWorkHours(checkIn, checkOut) {
    const [inHour, inMin] = checkIn.split(":").map(Number);
    const [outHour, outMin] = checkOut.split(":").map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;

    // Calculate difference in hours, rounded to 1 decimal place
    return Math.round((outMinutes - inMinutes) / 6) / 10;
  }

  // Function to handle employee selection
  const handleEmployeeSelect = (id) => {
    setSelectedEmployee(id);
    setViewMode("detailed");
  };

  // Filter employees based on search and department
  const filteredEmployees = attendanceData.filter((employee) => {
    const matchesSearch =
      employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });


  // Generate projects on component mount
  useEffect(() => {
    setProjects(staticProjects);
    setFilteredProjects(staticProjects);

  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);



  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  // Unified filter handler
  const handleCardFilter = (type) => {
    let filtered = [];
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    switch (type) {
      case 'active':
        filtered = projects.filter(p => p.status === 'Active');
        break;
      case 'nearDue':
        filtered = projects.filter(project => {
          if (project.status !== 'Active') return false;
          const dueDate = new Date(project.dueDate);
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        });
        break;
      case 'overdue':
        filtered = projects.filter(project => {
          const dueDate = new Date(project.dueDate);
          return dueDate < today && project.status !== 'Completed';
        });
        break;
      case 'teamOnDuty':
        filtered = projects.filter(p => p.status === 'Team On-Duty');
        break;
      case 'eventsToday':
        const todayStr = today.toISOString().split('T')[0];
        filtered = projects.filter(project => {
          return project.dueDate === todayStr || project.qcDueDate === todayStr;
        });
        break;
      case 'pendingApproval':
        filtered = projects.filter(p => p.qaStatus === 'Pending');
        break;
      default:
        filtered = projects;
    }
    setFilteredProjects(filtered);
    setActiveFilter(type);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Unified counting function
  const getCardCount = (cardType) => {
    switch (cardType) {
      // Project-related counts
      case 'active':
        return projects.filter(p => p.status === 'Active').length;
      case 'nearDue':
        return projects.filter(p => {
          if (p.status !== 'Active') return false;
          const dueDate = new Date(p.dueDate);
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        }).length;
      case 'overdue':
        return projects.filter(p => new Date(p.dueDate) < new Date() && p.status !== 'Completed').length;
      case 'pendingApproval':
        return projects.filter(p => p.qaStatus === 'Pending').length;

      // Attendance-related counts  
      case 'teamOnDuty':
        return attendanceData.length;

      // Today's tasks count
      case 'eventsToday':
        return tasksToday.length;

      default:
        return 0;
    }
  };


  // Card counts based on filteredProjects (so cards always match table)
  // const countFiltered = (type) => {
  //   const today = new Date();
  //   const nearDueDate = new Date();
  //   nearDueDate.setDate(today.getDate() + 3);

  //   switch (type) {
  //     case 'active':
  //       return filteredProjects.filter(p => p.status === 'Active').length;
  //     case 'nearDue':
  //       return filteredProjects.filter(project => {
  //         const dueDate = new Date(project.dueDate);
  //         return dueDate > today && dueDate <= nearDueDate && project.status !== 'Completed';
  //       }).length;
  //     case 'overdue':
  //       return filteredProjects.filter(project => {
  //         const dueDate = new Date(project.dueDate);
  //         return dueDate < today && project.status !== 'Completed';
  //       }).length;
  //     case 'teamOnDuty':
  //       return filteredProjects.filter(p => p.status === 'Team On-Duty').length;
  //     case 'eventsToday':
  //       const todayStr = today.toISOString().split('T')[0];
  //       return filteredProjects.filter(project => {
  //         return project.dueDate === todayStr || project.qcDueDate === todayStr;
  //       }).length;
  //     case 'pendingApproval':
  //       return filteredProjects.filter(p => p.qaStatus === 'Pending').length;
  //     default:
  //       return filteredProjects.length;
  //   }
  // };

  const countFiltered = (type) => {
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    switch (type) {
      case 'active':
        return projects.filter(p => p.status === 'Active').length;
      case 'nearDue':
        return projects.filter(project => {
          if (project.status !== 'Active') return false;
          const dueDate = new Date(project.dueDate);
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        }).length;
      case 'overdue':
        return projects.filter(project => {
          const dueDate = new Date(project.dueDate);
          return dueDate < today && project.status !== 'Completed';
        }).length;
      case 'teamOnDuty':
        return projects.filter(p => p.status === 'Team On-Duty').length;
      case 'eventsToday':
        return projects.filter(project => {
          const todayStr = today.toISOString().split('T')[0];
          return project.dueDate === todayStr || project.qcDueDate === todayStr;
        }).length;
      case 'pendingApproval':
        return projects.filter(p => p.qaStatus === 'Pending').length;
      default:
        return projects.length;
    }
  };


  // Show all projects
  const showAllProjects = () => {
    setFilteredProjects(projects);
    setActiveFilter('all');
  };

  const [setAllProjects] = useState([]);

  

  // const generateRandomProjects = (count) => {
  //   const clients = [
  //     "Acme Corp",
  //     "Globex",
  //     "Soylent",
  //     "Initech",
  //     "Umbrella",
  //     "Wayne Ent",
  //     "Stark Ind",
  //     "Oscorp",
  //   ];
  //   const platforms = ["Web", "Mobile", "Desktop"];
  //   const statuses = ["Active", "Near Due", "Overdue", "Team On-Duty"];
  //   const handlers = ["Jane", "John", "Alice", "Bob", "Charlie", "Eve"];
  //   const qaReviewers = ["Alan", "Sarah", "Mike", "Lisa", "David"];
  //   const qaStatuses = ["Passed", "Failed", "Pending", "In Review"];
  //   const processStatuses = ["Ongoing", "Completed", "Pending", "Delayed"];

  //   const projects = [];
  //   const today = new Date();

  //   for (let i = 0; i < count; i++) {
  //     const randomDays = Math.floor(Math.random() * 30) - 5; // Some will be overdue
  //     const dueDate = new Date(today);
  //     dueDate.setDate(today.getDate() + randomDays);

  //     const qcDeadline = new Date(dueDate);
  //     qcDeadline.setDate(dueDate.getDate() - 2);

  //     const qcDueDate = new Date(qcDeadline);
  //     qcDueDate.setDate(qcDeadline.getDate() + 1);

  //     projects.push({
  //       id: i + 1,
  //       title: `Project ${i + 1}`,
  //       client: clients[Math.floor(Math.random() * clients.length)],
  //       tasks: Math.floor(Math.random() * 10) + 1,
  //       languages: Math.floor(Math.random() * 5) + 1,
  //       platform: platforms[Math.floor(Math.random() * platforms.length)],
  //       pages: Math.floor(Math.random() * 200) + 50,
  //       dueDate: dueDate.toISOString().split("T")[0],
  //       qcDeadline: qcDeadline.toISOString().split("T")[0],
  //       qcHours: Math.floor(Math.random() * 24) + 1,
  //       qcDueDate: qcDueDate.toISOString().split("T")[0],
  //       status: statuses[Math.floor(Math.random() * statuses.length)],
  //       handler: handlers[Math.floor(Math.random() * handlers.length)],
  //       processStatus:
  //         processStatuses[Math.floor(Math.random() * processStatuses.length)],
  //       qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
  //       qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
  //       serverPath: `/mnt/server/project/project-${i + 1}`,
  //     });
  //   }

  //   return projects;
  // };

  const barData = [
    { name: 'Mon', Design: 20, Development: 40, Testing: 10, Deployment: 10 },
    { name: 'Tue', Design: 30, Development: 35, Testing: 15, Deployment: 10 },
    { name: 'Wed', Design: 40, Development: 30, Testing: 10, Deployment: 15 },
    { name: 'Thu', Design: 30, Development: 35, Testing: 10, Deployment: 10 },
    { name: 'Fri', Design: 25, Development: 35, Testing: 15, Deployment: 10 }
  ];

  const pieData = [
    { name: 'Development', value: 60 },
    { name: 'Meetings', value: 30 },
    { name: 'Planning', value: 20 },
    { name: 'QA', value: 25 },
    { name: 'Documentation', value: 10 }
  ];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="admin-dashboard text-white p-3 p-md-4 bg-main">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="gradient-heading">Admin Dashboard</h2>
        <div className="d-flex flex-column flex-sm-row gap-2">
          {/* <Button className="gradient-button" onClick={handleShow}>
            <FaPlus className="me-2" /> Create New Project
          </Button> */}
        </div>
      </div>

      {/* KPIs */}
      {/* <Row className="mb-4 g-3">
        {[
          { key: 'active', title: 'Active Projects', icon: 'bi-rocket-takeoff', color: 'primary' },
          { key: 'nearDue', title: 'Near Due', icon: 'bi-hourglass-split', color: 'warning text-dark' },
          { key: 'overdue', title: 'Overdue', icon: 'bi-exclamation-octagon', color: 'danger' },
          { key: 'teamOnDuty', title: 'Team On-Duty', icon: 'bi-people-fill', color: 'info' },
          { key: 'eventsToday', title: 'Events Today', icon: 'bi-calendar-event', color: 'success' },
          { key: 'pendingApproval', title: 'Pending Approval', icon: 'bi-clock-history', color: 'secondary' }
        ].map(({ key, title, icon, color, link }) => (
          <Col xs={12} sm={6} md={2} key={key}>
            <Card
              className={`bg-${color} bg-gradient text-white p-3 rounded-4 shadow-sm border-0 w-100 ${activeFilter === key ? 'border border-3 border-light' : ''
                }`}
              onClick={() => !link && handleCardFilter(key)}
              style={{ cursor: 'pointer', minHeight: '150px', height: '150px' }}
            >
              {link ? (
                <Link to={link} className="text-white text-decoration-none d-flex flex-column h-100 justify-content-between">
                  <Card.Body className="d-flex flex-column justify-content-between h-100">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${icon} fs-4`}></i>
                      <Card.Title className="fs-6 fw-semibold mb-0">{title}</Card.Title>
                    </div>
                    <h3 className="fw-bold text-end m-0">{countFiltered(key)}</h3>
                  </Card.Body>
                </Link>
              ) : (
                <Card.Body className="d-flex flex-column justify-content-between h-100">
                  <div className="d-flex align-items-center gap-2">
                    <i className={`bi ${icon} fs-4`}></i>
                    <Card.Title className="fs-6 fw-semibold mb-0">{title}</Card.Title>
                  </div>
                  <h3 className="fw-bold text-end m-0">{countFiltered(key)}</h3>
                </Card.Body>
              )}
            </Card>
          </Col>
        ))}
      </Row> */}

      <Row className="mb-4 g-3">
        {[
          { key: 'active', title: 'Active Projects', icon: 'bi-rocket-takeoff', color: 'primary' },
          { key: 'nearDue', title: 'Near Due', icon: 'bi-hourglass-split', color: 'warning text-dark' },
          { key: 'overdue', title: 'Overdue', icon: 'bi-exclamation-octagon', color: 'danger' },
          { key: 'teamOnDuty', title: 'Team On-Duty', icon: 'bi-people-fill', color: 'info' },
          { key: 'eventsToday', title: 'Events Today', icon: 'bi-calendar-event', color: 'success' },
          { key: 'pendingApproval', title: 'Pending Approval', icon: 'bi-clock-history', color: 'secondary' }
        ].map(({ key, title, icon, color }) => (
          <Col xs={12} sm={6} md={2} key={key}>
            <Card
              className={`bg-${color} bg-gradient p-3 rounded-4 shadow-sm border-0 w-100 ${activeFilter === key ? 'border border-3 border-light' : ''}`}
              onClick={() => handleCardFilter(key)}
              style={{ cursor: 'pointer', minHeight: '150px', height: '150px' }}
            >
              <Card.Body className="d-flex flex-column justify-content-between h-100 text-white">
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${icon} fs-4`}></i>
                  <Card.Title className="fs-6 fw-semibold mb-0">{title}</Card.Title>
                </div>
                <h3 className="fw-bold text-end m-0">{getCardCount(key)}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      {/* Show All button */}
      {activeFilter !== 'all' && (
        <Button variant="outline-light" size="sm" onClick={showAllProjects}>
          Show All
        </Button>
      )}

      {activeFilter == 'teamOnDuty' && (
        <div
          className="table-responsive text-white p-3 mb-5 table-gradient-bg"
          style={{ maxHeight: "600px", overflowY: "auto", overflowX: "auto" }}
          ref={scrollContainerRef}
        >
          <h4 className="mb-3">Team's List</h4>
          <table className="table table-hover mb-0">
            <thead
              className="table bg-dark p-2 sticky-top"
              style={{ position: "sticky", top: 0, zIndex: 2 }}
            >
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Late Arrivals</th>
                <th>Early Departures</th>
                <th>Leaves</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm bg-light-primary rounded me-3">
                        <span className="avatar-text">
                          {employee.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="fw-semibold">
                          {employee.employeeName}
                        </div>
                        <div className="small ">{employee.employeeId}</div>
                        {/* <div className="small text-white">
                          {employee.employeeId}
                        </div> */}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{employee.department}</div>
                    <div className="small ">{employee.position}</div>
                  </td>
                  <td>
                    <span className="badge bg-success-subtle text-success">
                      {employee.daysPresent}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-danger-subtle text-danger">
                      {employee.daysAbsent}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-warning-subtle text-warning">
                      {employee.lateArrivals}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-warning-subtle text-warning">
                      {employee.earlyDepartures}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info-subtle text-info">
                      {employee.leaves.length}
                    </span>
                  </td>
                  <td className="text-center mt-2">
                    <button
                      onClick={() => handleEmployeeSelect(employee.id)}
                      className="btn btn-sm btn-info"
                    >
                      <i className="fas fa-eye me-1"></i> View
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeFilter == 'eventsToday' && (
        <div
          className="table-responsive text-white p-3 mb-5 table-gradient-bg"
          style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
          ref={scrollContainerRef}
        >
          <h4 className="mb-3">Today's Event</h4>
          <table className="table table-hover mb-0">
            <thead
              className="table bg-dark p-2 sticky-top"
              style={{ position: "sticky", top: 0, zIndex: 2 }}
            >
              <tr>
                <th>Task Title</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Assign to</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasksToday.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.deadline}</td>
                  <td>{task.assignedTo}</td>
                  <td className="text-end">
                    <button
                      onClick={() => navigate('/calendar')}
                      className="btn btn-sm btn-info"
                    >
                      <i className="fas fa-eye me-1"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {activeFilter !== 'teamOnDuty' && activeFilter !== 'eventsToday' && <Card className="text-white p-3 mb-5 table-gradient-bg">
        <h4 className="mb-3">Project List</h4>
        {activeFilter !== 'active' && (
          <div className="mb-3">
          </div>
        )}

        {/* SCROLLABLE CONTAINER */}
        <div
          ref={fakeScrollbarRef}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            height: 16,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1050,
          }}
        >
          <div style={{ width: "2000px", height: 1 }} />
        </div>

        {/* Actual Table Container with horizontal scroll */}
        <div
          ref={scrollContainerRef}
          className="table-responsive"
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <Table className="table-gradient-bg align-middle table table-bordered table-hover">
            <thead className="table bg-dark p-2 sticky-top">
              <tr>
                <th>ID</th>
                <th>Project Title</th>
                <th>Client</th>
                <th>Tasks</th>
                <th>Languages</th>
                <th>Application</th>
                <th>Total Pages</th>
                <th>Actual Due Date</th>
                <th>Ready for QC Deadline</th>
                <th>QC Hrs</th>
                <th>QC Due Date</th>
                <th>Status</th>
                <th>Handler</th>
                <th>QA Reviewer</th>
                <th>QA Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.title}</td>
                  <td>{project.client}</td>
                  <td>{project.tasks}</td>
                  <td>{project.languages}</td>
                  <td>{project.platform}</td>
                  <td>{project.pages}</td>
                  <td>{project.dueDate}</td>
                  <td>{project.qcDeadline}</td>
                  <td>{project.qcHours}</td>
                  <td>{project.qcDueDate}</td>
                  <td>
                    <Badge
                      bg={
                        project.status === "Completed"
                          ? "success"
                          : project.status === "On Hold"
                            ? "warning"
                            : project.status === "Active"
                              ? "primary"
                              : project.status === "Near Due"
                                ? "info"
                                : project.status === "Overdue"
                                  ? "danger"
                                  : project.status === "Team On-Duty"
                                    ? "secondary"
                                    : "dark"
                      }
                    >
                      {project.status}
                    </Badge>
                  </td>
                  <td>{project.handler}</td>
                  <td>{project.qaReviewer}</td>
                  <td>
                    <Badge
                      bg={
                        project.qaStatus === "Passed"
                          ? "success"
                          : project.qaStatus === "Failed"
                            ? "danger"
                            : project.qaStatus === "In Review"
                              ? "info"
                              : "secondary"
                      }
                    >
                      {project.qaStatus}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="link"
                      className="text-info p-0 ms-3"
                      title="View"
                      onClick={() => handleView(project)}
                    >
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>}

      {/* Charts */}
      <div className="row g-4 mb-4">
        {/* Resource Utilization */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm h-100 bg-card">
            <h5>Resource Utilization</h5>
            <p className="text-muted">Utilization %</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} stackOffset="expand">
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value * 100}%`} />
                <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Legend />
                <Bar dataKey="Design" stackId="a" fill="#6366F1" />
                <Bar dataKey="Development" stackId="a" fill="#10B981" />
                <Bar dataKey="Testing" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Deployment" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <p className="mb-0">Average utilization: <strong className="text-primary">76%</strong></p>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-primary">Daily</button>
                <button className="btn btn-sm btn-primary">Weekly</button>
                <button className="btn btn-sm btn-outline-primary">Monthly</button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Tracking Summary */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm h-100 bg-card">
            <h5>Time Tracking Summary</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="row text-center mt-3">
              <div className="col-6 border-end">
                <p className="mb-1">Total Hours This Week</p>
                <h5 className="text-primary fw-bold">187 hours</h5>
              </div>
              <div className="col-6">
                <p className="mb-1">Productivity Score</p>
                <h5 className="text-success fw-bold">92%</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}


      {/* Create Project Modal */}
      {/* <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Control type="text" placeholder="Enter client name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Platform</Form.Label>
              <Form.Select className="text-white border-secondary">
                <option>Web</option>
                <option>Mobile</option>
                <option>Desktop</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Pages</Form.Label>
              <Form.Control type="number" placeholder="Enter page count" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Actual Due Date</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ready for QC Deadline</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>QC Hours Allocated</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>QC Due Date</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 gradient-button"
            >
              Create Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal> */}

      {/* View Project Details Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div>
              <p><strong>Title:</strong> {selectedProject.title}</p>
              <p><strong>Client:</strong> {selectedProject.client}</p>
              <p><strong>Application:</strong> {selectedProject.platform}</p>
              <p><strong>Pages:</strong> {selectedProject.pages}</p>
              <p><strong>Due Date:</strong> {selectedProject.dueDate}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Handler:</strong> {selectedProject.handler}</p>
              <p><strong>QA Reviewer:</strong> {selectedProject.qaReviewer}</p>
              <p><strong>QA Status:</strong> {selectedProject.qaStatus}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Project Modal */}
      {/* <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProject && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Project Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.title}
                  onChange={e =>
                    setEditProject({ ...editProject, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Client</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.client}
                  onChange={e =>
                    setEditProject({ ...editProject, client: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Platform</Form.Label>
                <Form.Select
                  className="text-white border-secondary"
                  defaultValue={editProject.platform}
                >
                  <option>Web</option>
                  <option>Mobile</option>
                  <option>Desktop</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Total Pages</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter page count"
                  defaultValue={editProject.pages}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Actual Due Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={editProject.dueDate}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ready for QC Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={editProject.qcDeadline}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>QC Hours Allocated</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={editProject.qcHours}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>QC Due Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={editProject.qcDueDate}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select defaultValue={editProject.status}>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 gradient-button"
              >
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal> */}

      <Col md={12} className="text-end">
        {activeFilter === 'teamOnDuty' ? (
          <Link to="/Attendance?tab=today" className="text-decoration-none">
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) : activeFilter === 'eventsToday' ? (
          <Link to="/calendar" className="text-decoration-none">
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) : activeFilter === 'nearDue' ? (
          <Link to="/LeadDashboard?filter=nearDue" className="text-decoration-none">
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) : activeFilter === 'active' ? (
          <Link to="/LeadDashboard?filter=active" className="text-decoration-none">
            <Button className="gradient-button me-2">Go To</Button>
          </Link>
        ) :

          activeFilter === 'pendingApproval' ? (
            <Link to="/actioncenter" className="text-decoration-none">
              <Button className="gradient-button me-2">Go To</Button>
            </Link>
          )
            :

            (
              <Link to="/LeadDashboard" className="text-decoration-none">
                <Button className="gradient-button me-2">Go To</Button>
              </Link>
            )}


        {/* <Link to='/Project' className="text-decoration-none">
          <Button className="gradient-button me-2">Go To</Button>
        </Link> */}
      </Col>
    </div>
  );
};

export default AdminDashboard;
