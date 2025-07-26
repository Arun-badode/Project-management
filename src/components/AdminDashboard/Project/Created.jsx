import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../../config";

const Created = () => {
 
  const [activeTab, setActiveTab] = React.useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("authToken");

//  const [projects, setProjects] = useState([
//     {
//       id: 1,
//       title: "Website Redesign",
//       client: "Acme Corp",
//       country: "United States",
//       projectManager: "John Smith",
//       tasks: ["Design", "Development"],
//       languages: ["English", "Spanish"],
//       application: "Web",
//       files: [
//         { name: "Homepage.psd", pageCount: 5 },
//         { name: "About.psd", pageCount: 3 },
//       ],
//       totalPages: 16,
//       receivedDate: "2025-06-20",
//       status: "created",
//       serverPath: "/projects/acme/redesign",
//       notes: "Priority project for Q3",
//       rate: 25,
//       currency: "USD",
//       cost: 400,
//       inrCost: 33200,
//     },
//     {
//       id: 2,
//       title: "Mobile App Development",
//       client: "TechStart",
//       country: "Canada",
//       projectManager: "Emily Johnson",
//       tasks: ["Development", "Testing"],
//       languages: ["English", "French"],
//       application: "Mobile",
//       files: [
//         { name: "Login.sketch", pageCount: 2 },
//         { name: "Dashboard.sketch", pageCount: 7 },
//       ],
//       totalPages: 18,
//       receivedDate: "2025-06-15",
//       status: "active",
//       progress: 65,
//       serverPath: "/projects/techstart/mobile",
//       notes: "Beta release scheduled for August",
//       rate: 30,
//       currency: "USD",
//       cost: 540,
//       inrCost: 44820,
//     },
//     {
//       id: 3,
//       title: "E-commerce application",
//       client: "RetailPlus",
//       country: "UK",
//       projectManager: "Michael Brown",
//       tasks: ["Design", "Development", "Testing"],
//       languages: ["English"],
//       application: "Web",
//       files: [
//         { name: "ProductPage.fig", pageCount: 4 },
//         { name: "Checkout.fig", pageCount: 3 },
//       ],
//       totalPages: 7,
//       receivedDate: "2025-05-10",
//       status: "completed",
//       completedDate: "2025-06-10",
//       serverPath: "/projects/retailplus/ecommerce",
//       notes: "Successfully launched",
//       rate: 28,
//       currency: "GBP",
//       cost: 196,
//       inrCost: 20776,
//       performance: {
//         expectedHours: 42,
//         actualHours: 38,
//         stages: [
//           {
//             name: "Design",
//             start: "2025-05-12",
//             end: "2025-05-20",
//             handler: "Sarah Wilson",
//           },
//           {
//             name: "Development",
//             start: "2025-05-21",
//             end: "2025-06-05",
//             handler: "David Lee",
//           },
//           {
//             name: "Testing",
//             start: "2025-06-06",
//             end: "2025-06-10",
//             handler: "Rachel Chen",
//           },
//         ],
//       },
//     },
//   ]);

    const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    axios
      .get(`${BASE_URL}project/getAllProjects`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setProjects(res.data.projects);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);


   const filteredProjects = projects.filter((project) => {
    const matchesTab = project.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.projectManager &&
        project.projectManager
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      project.files.some((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  return (
  <div>
      {loading ? (
        <p>Loading Projects...</p>
      ) : (
        <table className="table table-hover mb-0" style={{ minWidth: 900 }}>
          <thead
            className="table-gradient-bg table"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 0,
              backgroundColor: "#fff",
            }}
          >
            <tr className="text-center">
              <th>Project Title</th>
              <th>Client</th>
              <th>Country</th>
              <th>Project Manager</th>
              <th>Due Date</th>
              <th>Progress</th>
              <th>Tasks</th>
              <th>Languages</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  {project.projectTitle}
                  <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                    {project.status}
                  </span>
                </td>
                <td>{project.clientName}</td>
                <td>{project.country}</td>
                <td>{project.full_name}</td>
                <td>
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div
                      className="progress flex-grow-1 me-2"
                      style={{ height: "6px" }}
                    >
                      <div
                        className="progress-bar bg-primary"
                        style={{
                          width: `${project.progress || 0}%`,
                        }}
                      ></div>
                    </div>
                    <small className="text-primary">
                      {project.progress || 0}%
                    </small>
                  </div>
                </td>
                <td>
                  <span className="badge bg-primary bg-opacity-10 text-primary">
                    {project.task_name}
                  </span>
                </td>
                <td>
                  <span className="badge bg-success bg-opacity-10 text-success">
                    {project.language_name}
                  </span>
                </td>
                <td>
                  <span className="badge bg-purple bg-opacity-10 text-purple">
                    {project.application_name}
                  </span>
                </td>
                <td>{project.totalProjectPages}</td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      onClick={() => markAsCompleted(project.id)}
                      className="btn btn-sm btn-success"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleEditProject(project.id)}
                      className="btn btn-sm btn-success"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Created;
