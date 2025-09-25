import React, { useEffect, useState } from "react";
import { Table, Badge, Button, Spinner } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import axiosInstance from "../../Utilities/axiosInstance";

const ProjectTables = ({
  title,
  scrollContainerRef,
  handleView
}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "adminDashboard/getAdminDashboardData",
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        // Determine which data to show based on the title prop
        let projectData = [];
        if (title === "Active Projects") {
          projectData = response.data.data.activeProjects.list;
        } else if (title === "Near Due Projects (Next 30 Minutes)") {
          projectData = response.data.data.nearDue.list;
        } else if (title === "Overdue Projects") {
          projectData = response.data.data.overdue.list;
        }

        // Transform the data to match the table format
        const formattedProjects = projectData.map(project => ({
          id: project.id,
          title: project.projectTitle,
          client: project.clientId,
          tasks: project.taskId,
          languages: project.languageId,
          application: project.applicationId,
          pages: project.totalProjectPages,
          dueDate: new Date(project.deadline).toLocaleDateString(),
          qcDeadline: new Date(project.readyQCDeadline).toLocaleDateString(),
          qcHours: project.qcHrs,
          qcDueDate: new Date(project.qcDueDate).toLocaleDateString(),
          status: project.status,
          handler: project.projectManagerId,
          qaReviewer: "",
          qaStatus: ""
        }));

        setProjects(formattedProjects);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [title, token]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5 text-danger">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="text-white p-3 mb-4 table-gradient-bg">
      <h4 className="mb-3">{title}</h4>
      <div
        ref={scrollContainerRef}
        style={{
          maxHeight: "500px",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
      >
        <Table className="table-gradient-bg align-middle table table-bordered table-hover">
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
              <th>ID</th>
              <th>Project Title</th>
              <th>Client</th>
              <th>Tasks</th>
              <th>Languages</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Actual Due Date</th>
              <th>Ready for QC Deadline</th>
              <th>QC Hrs</th>
              <th>QC Due Date</th>
              <th>Status</th>
              <th>Handler</th>
              <th>QA Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.title}</td>
                  <td>{project.client}</td>
                  <td>{project.tasks}</td>
                  <td>{project.languages}</td>
                  <td>{project.application}</td>
                  <td>{project.pages}</td>
                  <td>{project.dueDate}</td>
                  <td>{project.qcDeadline}</td>
                  <td>{project.qcHours}</td>
                  <td>{project.qcDueDate}</td>
                  <td>
                    <Badge
                      bg={
                        project.status === "Completed"
                          ? "success"
                          : project.status === "On Hold"
                            ? "warning"
                            : project.status === "Active"
                              ? "primary"
                              : project.status === "Near Due"
                                ? "info"
                                : project.status === "Overdue"
                                  ? "danger"
                                  : project.status === "Team On-Duty"
                                    ? "secondary"
                                    : "dark"
                      }
                    >
                      {project.status}
                    </Badge>
                  </td>
                  <td>{project.handler}</td>
                  <td>
                    <Badge
                      bg={
                        project.qaStatus === "Passed"
                          ? "success"
                          : project.qaStatus === "Failed"
                            ? "danger"
                            : project.qaStatus === "In Review"
                              ? "info"
                              : "secondary"
                      }
                    >
                      {project.qaStatus || "N/A"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="link"
                      className="text-info p-0 ms-3"
                      title="View"
                      onClick={() => handleView(project)}
                    >
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="text-center">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectTables;