import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { useState } from "react";
import LoginPage from "./authtication/Login";

import LeadDashboard from "./components/AdminDashboard/Lead/LeadDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import TaskManagementPage from "./components/AdminDashboard/TaskManagement/TaskManagemnet";
import TaskManagement from "./components/AdminDashboard/TaskManagement/TaskManagemnet";
import UserManagement from "./components/AdminDashboard/UserManagement/UserManagement";
import ResourceManagement from "./components/AdminDashboard/ResourceManagement/ResourceManagement";
import ProjectSupportPortal from "./components/AdminDashboard/ProjectSupport/ProjectSupport";
import SettingsPage from "./components/AdminDashboard/Setting/Setting";
import ProfileAcc from "./components/AdminDashboard/ProfileAcc/ProfileAcc";
import AuditLog from "./components/AdminDashboard/AuthLog/AuditLog";
import QAManagement from "./components/AdminDashboard/QAManagement/QAManagement";
import TimeTracker from "./components/AdminDashboard/TimeTracker/TimeTracker";
import ReportingAnalytics from "./components/AdminDashboard/ReportingAnalytics/ReportingAnalytics";
import FileManagementSystem from "./components/AdminDashboard/FileManagementSystem/FileManagementSystem";
import TaskDashboard from "./components/TeamMember/Taskmanagementdashboard/TaskDashboard";
import Productivity from "./components/TeamMember/Productivity/Productivity";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menusidebarcollaps = () => {
    setIsSidebarCollapsed(true);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const location = useLocation();

  // Check if current path is exactly "/" (login page) or "/signup" (sign up page)
  const hideLayout =
    location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {/* navbar - hidden on login/signup page */}
      {!hideLayout && <Navbar toggleSidebar={toggleSidebar} />}

      {/* main content area */}
      <div className={`main-content ${hideLayout ? "full-width" : ""}`}>
        {/* sidebar - hidden on login/signup page */}
        {/* sidebar - hidden on login/signup page */}
        {!hideLayout && (
          <Sidebar
            collapsed={isSidebarCollapsed}
            menuItemClick={menusidebarcollaps}
          />
        )}

        {/* right side content */}
        <div
          className={`right-side-content ${
            isSidebarCollapsed && !hideLayout ? "collapsed" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/*Admin Start */}

            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/taskmanagement" element={<TaskManagement />} />
            <Route path="/usermanage" element={<UserManagement />} />
            <Route
              path="/resourcemanagement"
              element={<ResourceManagement />}
            />
            <Route path="/projectsupport" element={<ProjectSupportPortal />} />
            <Route path="/settingpage" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfileAcc />} />
            <Route path="/auditlog" element={<AuditLog />} />
            <Route path="/timetracker" element={<TimeTracker />} />
            <Route
              path="/reportinganalytics"
              element={<ReportingAnalytics />}
            />
            <Route
              path="/filemanagementsystem"
              element={<FileManagementSystem />}
            />
            <Route path="/qamanagement" element={<QAManagement />} />

            {/*Admin End */}

            <Route path="/LeadDashboard" element={<LeadDashboard />} />


            {/* team Member */}
            
            <Route path="/team-dashboard" element={<TaskDashboard/>} />


            {/* productivity */}

             <Route path="/productivity" element={<Productivity/>} />



            {/* Add your other routes here */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
