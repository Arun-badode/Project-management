import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../../config";

const CompletedProjects = () => {
  const [activeTab, setActiveTab] = useState("completed");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("authToken");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}project/getAllProjects`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          const completedProjects = res.data.projects.filter(
            (project) => project.status?.toLowerCase() === "completed"
          );
          setProjects(completedProjects);
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

  const calculateEfficiency = (expectedHours, actualHours) => {
    if (!expectedHours || !actualHours) return "-";
    const efficiency = ((expectedHours - actualHours) / expectedHours) * 100;
    return `${efficiency.toFixed(1)}%`;
  };

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
              <th>S. No.</th>
              <th>Project Title</th>
              <th>Client Alise Name</th>
              <th>Client</th>
              <th>Country</th>
              <th>Project Manager</th>
              <th>Task</th>
              <th>Languages</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Received Date</th>
              <th>Estimated Hrs</th>
              <th>Actual Hrs</th>
              {/* <th>Efficiency</th> */}
              <th>Cost with Currency</th>
              <th>Cost in INR</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={project.id} className="text-center">
                <td>{index + 1}</td>
                <td>
                  {project.projectTitle}
                  <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                    {project.status}
                  </span>
                </td>
                <td>{project.full_name || "-"}</td>
                <td>{project.clientName}</td>
                <td>{project.country}</td>
                <td>{project.projectManagerId}</td>
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
                <td>
                  {project.receiveDate
                    ? new Date(project.receiveDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>{project.estimatedHours || "-"}</td>
                <td>{project.hourlyRate || "-"}</td>
                {/* <td>
                  {calculateEfficiency(project.expectedHours, project.hourlyRate)}
                </td> */}
                <td>
                  {project.currency 
                    ? `${project.currency} `
                    : "-"}
                </td>
                <td>{project.totalCost ? `₹${project.totalCost}` : "-"}</td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
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

export default CompletedProjects;