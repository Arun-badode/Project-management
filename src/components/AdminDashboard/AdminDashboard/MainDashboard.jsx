import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import ProjectTables from "./ProjectTables";
import TeamOnDutyTable from "./TeamOnDutyTable";
import EventsTodayTable from "./EventsTodayTable";
import ProjectModal from "./ProjectModal";
import { ProjectsData } from "./ProjectData"; 

const useSyncScroll = () => {
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);

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

  return { scrollContainerRef, fakeScrollbarRef };
};

const MainDashboard = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const {
    scrollContainerRef: scrollContainerRef1,
    fakeScrollbarRef: fakeScrollbarRef1,
  } = useSyncScroll();

  const {
    scrollContainerRef: scrollContainerRef2,
    fakeScrollbarRef: fakeScrollbarRef2,
  } = useSyncScroll();

  const {
    scrollContainerRef: scrollContainerRef3,
    fakeScrollbarRef: fakeScrollbarRef3,
  } = useSyncScroll();

  const {
    scrollContainerRef: scrollContainerRef4,
    fakeScrollbarRef: fakeScrollbarRef4,
  } = useSyncScroll();

  const {
    scrollContainerRef: scrollContainerRef5,
    fakeScrollbarRef: fakeScrollbarRef5,
  } = useSyncScroll();

  useEffect(() => {
    setProjects(ProjectsData);
    setFilteredProjects(ProjectsData);
  }, []);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleCardFilter = (type) => {
    if (activeFilter === type) {
      setActiveFilter(null);
      setActiveTab(null);
      setFilteredProjects([]);
      return;
    }

    let filtered = [];
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    switch (type) {
      case "active":
        filtered = projects.filter((p) => p.status === "Active");
        break;
      case "nearDue":
        filtered = projects.filter((project) => {
          if (project.status !== "Active") return false;
          const dueDate = new Date(project.dueDate);
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        });
        break;
      case "overdue":
        filtered = projects.filter((project) => {
          const dueDate = new Date(project.dueDate);
          return dueDate < today && project.status !== "Completed";
        });
        break;
      case "teamOnDuty":
        filtered = projects.filter((p) => p.status === "Team On-Duty");
        break;
      case "eventsToday":
        const todayStr = today.toISOString().split("T")[0];
        filtered = projects.filter((project) => {
          return project.dueDate === todayStr || project.qcDueDate === todayStr;
        });
        break;
      case "pendingApproval":
        filtered = projects.filter((p) => p.qaStatus === "Pending");
        break;
      default:
        filtered = projects;
    }
    setFilteredProjects(filtered);
    setActiveFilter(type);
    setActiveTab(type);
  };

  const getCardCount = (cardType) => {
    switch (cardType) {
      case "active":
        return projects.filter((p) => p.status === "Active").length;
      case "nearDue":
        return projects.filter((p) => {
          if (p.status !== "Active") return false;
          const dueDate = new Date(p.dueDate);
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        }).length;
      case "overdue":
        return projects.filter(
          (p) => new Date(p.dueDate) < new Date() && p.status !== "Completed"
        ).length;
      case "pendingApproval":
        return projects.filter((p) => p.qaStatus === "Pending").length;
      case "teamOnDuty":
        return todayAttendanceData.length;
      case "eventsToday":
        return tasksToday.length;
      default:
        return 0;
    }
  };

  // Sample data
  const todayAttendanceData = [
    // ... (same as original)
  ];

  const tasksToday = [
    // ... (same as original)
  ];

  const cardData = [
    {
      key: "active",
      title: "Active Projects",
      icon: "bi-rocket-takeoff",
      color: "primary",
      activeColor: "primary-active",
    },
    {
      key: "nearDue",
      title: "Near Due",
      icon: "bi-hourglass-split",
      color: "warning text-dark",
      activeColor: "warning-active",
    },
    {
      key: "overdue",
      title: "Overdue",
      icon: "bi-exclamation-octagon",
      color: "danger",
      activeColor: "danger-active",
    },
    {
      key: "teamOnDuty",
      title: "Team On-Duty",
      icon: "bi-people-fill",
      color: "info",
      activeColor: "info-active",
    },
    {
      key: "eventsToday",
      title: "Events Today",
      icon: "bi-calendar-event",
      color: "success",
      activeColor: "success-active",
    },
    {
      key: "pendingApproval",
      title: "Pending Approval",
      icon: "bi-clock-history",
      color: "secondary",
      activeColor: "secondary-active",
      link: "/action-center",
    },
  ];

  return (
    <div className="admin-dashboard text-white p-3 p-md-4 bg-main">
      <style>
        {`
          .active-tab {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
            border: 3px solid white !important;
          }
          
          .primary-active {
            background: linear-gradient(135deg, #4F46E5, #7C73E6) !important;
          }
          
          .warning-active {
            background: linear-gradient(135deg, #F59E0B, #FBBF24) !important;
            color: white !important;
          }
          
          .danger-active {
            background: linear-gradient(135deg, #EF4444, #F87171) !important;
          }
          
          .info-active {
            background: linear-gradient(135deg, #0EA5E9, #38BDF8) !important;
          }
          
          .success-active {
            background: linear-gradient(135deg, #10B981, #34D399) !important;
          }
          
          .secondary-active {
            background: linear-gradient(135deg, #64748B, #94A3B8) !important;
          }
          
          .active-tab .text-white {
            color: white !important;
          }
        `}
      </style>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="gradient-heading">Admin Dashboard</h2>
        <div className="d-flex flex-column flex-sm-row gap-2"></div>
      </div>

      <Row className="mb-4 g-3">
        {cardData.map((card) => (
          <Col xs={12} sm={6} md={2} key={card.key}>
            <ProjectCard
              key={card.key}
              title={card.title}
              icon={card.icon}
              color={card.color}
              activeColor={card.activeColor}
              activeTab={activeTab}
              count={getCardCount(card.key)}
              onClick={() => card.link ? (window.location.href = card.link) : handleCardFilter(card.key)}
            />
          </Col>
        ))}
      </Row>

      {activeFilter === "active" && (
        <ProjectTables
          filteredProjects={filteredProjects}
          handleView={handleView}
          title="Active Projects"
          scrollContainerRef={scrollContainerRef1}
          fakeScrollbarRef={fakeScrollbarRef1}
        />
      )}

      {activeFilter === "nearDue" && (
        <ProjectTables
          filteredProjects={filteredProjects}
          handleView={handleView}
          title="Near Due Projects (Next 30 Minutes)"
          scrollContainerRef={scrollContainerRef2}
          fakeScrollbarRef={fakeScrollbarRef2}
        />
      )}

      {activeFilter === "overdue" && (
        <ProjectTables
          filteredProjects={filteredProjects}
          handleView={handleView}
          title="Overdue Projects"
          scrollContainerRef={scrollContainerRef3}
          fakeScrollbarRef={fakeScrollbarRef3}
        />
      )}

      {activeFilter === "teamOnDuty" && (
        <Card className="text-white p-3 mb-4 table-gradient-bg">
          <TeamOnDutyTable todayAttendanceData={todayAttendanceData} />
        </Card>
      )}

      {activeFilter === "eventsToday" && (
        <EventsTodayTable
          tasksToday={tasksToday}
          scrollContainerRef={scrollContainerRef5}
          fakeScrollbarRef={fakeScrollbarRef5}
        />
      )}

      <ProjectModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        selectedProject={selectedProject}
      />
    </div>
  );
};

export default MainDashboard;