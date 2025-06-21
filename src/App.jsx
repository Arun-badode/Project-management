import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { useState } from "react";
import LoginPage from "./authtication/Login";
import SignupPage from "./authtication/singup";

import LeadDashboard from "./components/AdminDashboard/Lead/LeadDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
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

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menusidebarcollaps = () => {
    setIsSidebarCollapsed(true);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const location = useLocation();

  // Define routes where navbar and sidebar should be hidden
  const NO_LAYOUT_ROUTES = ["/", "/singup"];
  const hideLayout = NO_LAYOUT_ROUTES.includes(location.pathname);

  return (
    <>
      {/* navbar - hidden on login/signup page */}
      {!hideLayout && <Navbar toggleSidebar={toggleSidebar} />}

      {/* main content area */}
      <div className={`main-content ${hideLayout ? "full-width" : ""}`}>
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
            {/* Authentication routes (no navbar/sidebar) */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/singup" element={<SignupPage />} />

            {/* Admin routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/taskmanagement" element={<TaskManagement />} />
            <Route path="/usermanage" element={<UserManagement />} />
            <Route path="/resourcemanagement" element={<ResourceManagement />} />
            <Route path="/projectsupport" element={<ProjectSupportPortal />} />
            <Route path="/settingpage" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfileAcc />} />
            <Route path="/auditlog" element={<AuditLog />} />
            <Route path="/timetracker" element={<TimeTracker />} />
            <Route path="/reportinganalytics" element={<ReportingAnalytics />} />
            <Route path="/filemanagementsystem" element={<FileManagementSystem />} />
            <Route path="/qamanagement" element={<QAManagement />} />
            <Route path="/changepassword" element={<ChangesPassword/>}/>
            <Route path="/role&permission" element={<RoleManagementSystem/>}/>

            {/* Lead routes */}
            <Route path="/LeadDashboard" element={<LeadDashboard />} />

            {/* Team Member routes */}
            <Route path="/team-dashboard" element={<TaskDashboard />} />
            <Route path="/attendance" element={<Attendance />} />

            {/* team Member */}
            <Route path="/task" element={<Task/>}/>
            <Route path="/team-dashboard" element={<TaskDashboard/>} />
            <Route path='/messages'element={<Messages/>}/>
            <Route path="/activity" element={<ActivitySummary/>}/>
              <Route path="/attendance" element={<Attendance/>} />

            {/* Add your other routes here */}

            {/*manager project */}

            <Route path="/manager-dashboard" element={<ManagerDashboard/>}/>
            <Route path="/createproject" element={<CreateProject/>}/>
            <Route path="/attendance" element={<Attendance/>} />
               <Route path="/assigned" element={<Assigned/>} />

            <Route path="/taskrequest" element={<TaskRequest/>}/>
            <Route path="/sourcework" element={<ResourceWorkload/>}/>
            <Route path="/collaboration" element={<Collaboration/>}/>
          
             {/* <Route path="/task" element={<Task/>} /> */}


            {/* productivity */}

             <Route path="/productivity" element={<Productivity/>} />



            {/* Add your other routes here */}
             {/* End team Member */}



            {/* Manager */}



            {/* End Manager */}
            
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;