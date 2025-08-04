import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../../config";

const Created = () => {
  const [activeTab, setActiveTab] = React.useState("created");
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




  const markAsCompleted = async (projectId) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.patch(
        `${BASE_URL}project/updateProject/${projectId}`,
        {
          status: "Completed", // 👈 Change the project status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Project marked as Completed successfully!");
        // optionally refresh the project list here
        // refresh the list
        const refreshed = await axios.get(`${BASE_URL}project/getAllProjects`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (refreshed.data.status) {
          setProjects(refreshed.data.projects);
        }
        //fetchProjects(); // you must define this function to reload projects
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
      alert("Error updating project status");
    }
  };


  const handleEditProject = (id) => {
    // Implement edit project functionality
    console.log("Edit project:", id);
  };

  const handleDeleteProject = (id) => {
    // Implement delete project functionality
    console.log("Delete project:", id);
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
              <th>S.No.</th>
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
              <th>Cost with Currency</th>
              <th>Cost in INR</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects
              // .filter((project) => project.status != "Completed")
              .filter((project) => project.status == "Active" || project.status == "In Progress" )
              .map((project, index) => (
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
                  <td>
                    {project.currency
                      ? `${project.currency || "USD"} ${project.currency}`
                      : "-"}
                  </td>
                  <td>{project.totalCost ? `₹${project.totalCost}` : "-"}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => markAsCompleted(project.id)}
                        className="btn btn-sm btn-success"
                        title="Mark as Completed"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        onClick={() => handleEditProject(project.id)}
                        className="btn btn-sm btn-primary"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
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