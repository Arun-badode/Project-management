// sidebarConfig.js
export const sidebarMenuByRole = {
  Admin: [
    { label: "Dashboard", path: "/admin-dashboard", icon: "fa-compass" },
    { label: "Active Projects", path: "/LeadDashboard", icon: "fa-diagram-project" },
    { label: "Task Management", path: "/taskmanagement", icon: "fa-tasks" },
    { label: "Projects", path: "/project", icon: "fa-diagram-project" },
    { label: "Action Center", path: "/actioncenter", icon: "fa-bolt" },
    { label: "Reporting & Analytics", path: "/reportinganalytics", icon: "fa-chart-line" },
    { label: "Audit Logs", path: "/auditlog", icon: "fa-shield" },
    { label: "Attendance", path: "/attendance", icon: "fa-calendar-days" },
    { label: "Calendar", path: "/calendar", icon: "fa-calendar" },
    { label: "User", path: "/usermanage", icon: "fa-users-gear" },
  ],
  Manager: [
    { label: "Manager Dashboard", path: "/manager-dashboard", icon: "fa-chart-pie" },
    { label: "Create Project", path: "/createproject", icon: "fa-plus" },
    { label: "Assigned Tasks", path: "/assigned", icon: "fa-tasks" },
    { label: "Resource Workload", path: "/sourcework", icon: "fa-users" },
    { label: "Collaboration", path: "/collaboration", icon: "fa-handshake" },
    { label: "Attendance", path: "/attendance", icon: "fa-calendar-days" },
  ],
  Employee: [
    { label: "Team Dashboard", path: "/team-dashboard", icon: "fa-gauge" },
    { label: "My Tasks", path: "/task", icon: "fa-tasks" },
    { label: "Attendance", path: "/attendance", icon: "fa-calendar-days" },
    { label: "Messages", path: "/messages", icon: "fa-envelope" },
    { label: "Activity", path: "/activity", icon: "fa-list" },
  ],
};
