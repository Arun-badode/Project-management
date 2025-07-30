import { Route, Router, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { useEffect, useState } from "react";
import LoginPage from "./authtication/Login";
import SignupPage from "./authtication/singup";

import LeadDashboard from "./components/AdminDashboard/ActiveProject/ActiveProject";
// import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
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
import Messages from "./components/TeamMember/Messages/Messages";
import ActivitySummary from "./components/TeamMember/Activity/ActivitySummary";
import ManagerDashboard from "./components/ProjectManager/ManagerDashboard/ManagerDashboard";
import CreateProject from "./components/ProjectManager/CreateProject/CreateProject";
import Attendance from "./components/TeamMember/Attendance/Attendance";
import Productivity from "./components/TeamMember/Productivity/Productivity";
import TaskRequest from "./components/ProjectManager/TaskRequest/TaskRequest";
import ResourceWorkload from "./components/ProjectManager/ResourceWorkload/ResourceWorkload";
import Collaboration from "./components/ProjectManager/Collaboration/Collaboration";
import Assigned from "./components/ProjectManager/Assigne/Assigned";
import Task from "./components/TeamMember/Task/Task";
import ChangesPassword from "./components/AdminDashboard/ChangePassword/ChangesPassword";
import RoleManagementSystem from "./components/AdminDashboard/Role&Permission/Role&PErmission";
import Project from "./components/AdminDashboard/Project/Project";
import Calander from "./components/AdminDashboard/Calander/Calander";
import ActionCenter from "./components/AdminDashboard/ActionCenter/ActionCenter";
import AuthLayout from "./layout/authLayout";
import MainLayout from "./layout/MainLayout";
import ManagerTask from "./components/ProjectManager/ManagerTask/ManagerTask";
import ShiftAllocation from "./components/ProjectManager/ShiftAllocation/ShiftAllocation";
import MainDashboard from "./components/AdminDashboard/AdminDashboard/MainDashboard";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const menusidebarcollaps = () => setIsSidebarCollapsed(true);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, []);
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* App Routes */}
      <Route
        element={
          <MainLayout
            isSidebarCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            menusidebarcollaps={menusidebarcollaps}
          />
        }
      >
        <Route path="/admin-dashboard" element={<MainDashboard />} />
        <Route path="/calendar" element={<Calander />} />
        <Route path="/attendance" element={<Attendance />} />

        <Route path="/task-management" element={<TaskManagement />} />
        <Route path="/calendar" element={<Calander />} />
        <Route path="/usermanage" element={<UserManagement />} />
        <Route path="/resourcemanagement" element={<ResourceManagement />} />
        <Route path="/projectsupport" element={<ProjectSupportPortal />} />
        <Route path="/settingpage" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfileAcc />} />
        <Route path="/auditlog" element={<AuditLog />} />
        <Route path="/timetracker" element={<TimeTracker />} />
        <Route path="/reportinganalytics" element={<ReportingAnalytics />} />
        <Route
          path="/filemanagementsystem"
          element={<FileManagementSystem />}
        />
        <Route path="/qamanagement" element={<QAManagement />} />
        <Route path="/changepassword" element={<ChangesPassword />} />
        <Route path="/role-permission" element={<RoleManagementSystem />} />
        <Route path="/project" element={<Project />} />
        <Route path="/action-center" element={<ActionCenter />} />

        {/* Lead routes */}
        <Route path="/active-project" element={<LeadDashboard />} />

        {/* Team Member routes */}
        <Route path="/team-dashboard" element={<TaskDashboard />} />
        <Route path="/attendance" element={<Attendance />} />

        {/* team Member */}
        <Route path="/task" element={<Task />} />
        <Route path="/team-dashboard" element={<TaskDashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/activity" element={<ActivitySummary />} />

        {/* Add your other routes here */}

        {/*manager project */}

        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/createproject" element={<CreateProject />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/assigned" element={<Assigned />} />
        <Route path="/managertask" element={<ManagerTask />} />
        <Route path="/shift-allocation" element={<ShiftAllocation />} />

        <Route path="/taskrequest" element={<TaskRequest />} />
        <Route path="/sourcework" element={<ResourceWorkload />} />
        <Route path="/collaboration" element={<Collaboration />} />

        {/* <Route path="/task" element={<Task/>} /> */}

        {/* productivity */}

        <Route path="/productivity" element={<Productivity />} /> 
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}


export default App;
