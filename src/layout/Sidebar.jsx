import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import BASE_URL from "../config";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [permissions, setPermissions] = useState([]);
  const roleId = localStorage.getItem("roleId");

  // 🔹 Fetch permissions from API
  useEffect(() => {
    axios
      .get(`${BASE_URL}roles/permission/${roleId}`)
      .then((res) => {
        if (res.data.status) {
          setPermissions(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching permissions", err);
      });
  }, [roleId]);

  const isActive = (path) => location.pathname === path;

  // 🔹 Map featureName → UI Config (label, path, icon)
  const featureConfig = {
    "Admin-Dashboard": { path: "/admin-dashboard", label: "Dashboard", icon: "fa-compass" },
    "Manager-Dashboard": { path: "/manager-dashboard", label: "Dashboard", icon: "fa-compass" },
    "Team-Dashboard": { path: "/team-dashboard", label: "Dashboard", icon: "fa-compass" },
    "Active Projects": { path: "/active-project", label: "Active Projects", icon: "fa-diagram-project" },
    "Projects": { path: "/project", label: "Projects", icon: "fa-diagram-project" },
    "Task Management": { path: "/task-management", label: "Task Management", icon: "fa-tasks" },
    "Resource Workload": { path: "/sourcework", label: "Resource Workload", icon: "fa-chart-line" },
    "Action Center": { path: "/action-center", label: "Action Center", icon: "fa-bolt" },
    "Shift Allocation": { path: "/shift-allocation", label: "Shift Allocation", icon: "fa-life-ring" },
    "Attendance": { path: "/attendance", label: "Attendance", icon: "fa-calendar-days" },
    "Calendar": { path: "/calendar", label: "Calendar", icon: "fa-calendar" },
    "Reporting & Analytics": { path: "/reportinganalytics", label: "Reporting & Analytics", icon: "fa-chart-line" },
    "Audit Logs": { path: "/auditlog", label: "Audit Logs", icon: "fa-shield" },
    "User": { path: "/usermanage", label: "User", icon: "fa-users-gear" },
    "Role & Permission": { path: "/role-permission", label: "Role & Permission", icon: "fa-key" },
    "Chat Room": { path: "/collaboration", label: "Chat Room", icon: "fa-comments" },
    "Assigned Projects": { path: "/assigned", label: "Assigned Projects", icon: "fa-address-card" },
    "Create Project": { path: "/createproject", label: "Create Project", icon: "fa-circle-plus" },
    "My Task": { path: "/task", label: "My Task", icon: "fa-list" },
    "Task Requests": { path: "/taskrequest", label: "Task Requests", icon: "fa-bell" },
    "Setting": { path: "/settingpage", label: "Setting", icon: "fa-gear" },
    "Productivity": { path: "/productivity", label: "Productivity", icon: "fa-chart-line" },
    "Activity": { path: "/activity", label: "Activity", icon: "fa-clock-rotate-left" },
    "Messaging": { path: "/messages", label: "Messaging", icon: "fa-comment" },
  };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar bg-card" style={{ height: "105vh" }}>
        <ul className="menu">
          {permissions
            .filter((p) => p.canView === "1") // ✅ only visible items
            .map((p) => {
              const config = featureConfig[p.featureName];
              if (!config) return null; // ignore unmapped features
              return (
                <li key={p.id} className={`menu-item ${isActive(config.path) ? "active" : ""}`}>
                  <div
                    className="menu-link menu-i"
                    onClick={() => navigate(config.path)}
                  >
                    <i className={`fa-solid ${config.icon}`}></i>
                    <span className="menu-text">{config.label}</span>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;