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

  // Only one instance for all tables
  const {
    scrollContainerRef,
    fakeScrollbarRef,
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
      title: "Near Due Projects",
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
          .tab-card {
            transition: all 0.3s ease;
            position: relative;
            cursor: pointer;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .tab-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .tab-card:hover::before {
            opacity: 0.2;
          }
          
          .tab-card.active-tab {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
            border: 3px solid white !important;
            position: relative;
            z-index: 2;
          }
          
          .tab-card.active-tab::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: white;
            border-radius: 0 0 4px 4px;
            animation: bubbleUp 0.5s ease forwards;
          }
          
          @keyframes bubbleUp {
            0% {
              transform: scaleX(0);
              opacity: 0;
            }
            50% {
              transform: scaleX(1.2);
              opacity: 1;
            }
            100% {
              transform: scaleX(1);
              opacity: 1;
            }
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
          
          /* Hide default scrollbar */
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
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
            <div 
              className={`tab-card ${activeTab === card.key ? 'active-tab' : ''}`}
              onClick={() => card.link ? (window.location.href = card.link) : handleCardFilter(card.key)}
            >
              <ProjectCard
                key={card.key}
                title={card.title}
                icon={card.icon}
                color={card.color}
                activeColor={card.activeColor}
                activeTab={activeTab}
                count={getCardCount(card.key)}
              />
            </div>
          </Col>
        ))}
      </Row>

      {/* Fake scrollbar - only render once */}
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
          display: activeFilter ? "block" : "none", // Only show when a table is visible
        }}
      >
        <div style={{ width: "2000px", height: 1 }} />
      </div>

      {activeFilter === "active" && (
        <ProjectTables
          filteredProjects={filteredProjects}
          handleView={handleView}
          title="Active Projects"
          scrollContainerRef={scrollContainerRef}
        />
      )}

      {activeFilter === "nearDue" && (
        <ProjectTables
          filteredProjects={filteredProjects}
          handleView={handleView}
          title="Near Due Projects (Next 30 Minutes)"
          scrollContainerRef={scrollContainerRef}
        />
      )}

      {activeFilter === "overdue" && (
        <ProjectTables
          filteredProjects={filteredProjects}
          handleView={handleView}
          title="Overdue Projects"
          scrollContainerRef={scrollContainerRef}
        />
      )}

      {activeFilter === "teamOnDuty" && (
        <Card className="text-white p-3 mb-4 table-gradient-bg">
          <TeamOnDutyTable scrollContainerRef={scrollContainerRef} />
        </Card>
      )}

      {activeFilter === "eventsToday" && (
        <EventsTodayTable
          tasksToday={tasksToday}
          title="Events Today"
          scrollContainerRef={scrollContainerRef}
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