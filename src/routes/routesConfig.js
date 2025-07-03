// routesConfig.js

import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import Calander from "../components/AdminDashboard/Calander/Calander";


export const routesByRole = {
  Admin: [
    { path: "/admin-dashboard", element: <AdminDashboard /> },
    { path: "/taskmanagement", element: <TaskManagement /> },


   
    { path: "/calendar", element: <Calander /> },
    { path: "/attendance", element: <Attendance /> },
    { path: "/usermanage", element: <UserManagement /> },
    { path: "/manager-dashboard", element: <ManagerDashboard /> },
 
  ],
  Manager: [
    { path: "/manager-dashboard", element: <ManagerDashboard /> },
    { path: "/createproject", element: <CreateProject /> },
    { path: "/attendance", element: <Attendance /> },
 
  ],
  Employee: [
    { path: "/team-dashboard", element: <TaskDashboard /> },
    { path: "/attendance", element: <Attendance /> },
    { path: "/task", element: <Task /> },
    // ...add more Employee routes
  ],
};
