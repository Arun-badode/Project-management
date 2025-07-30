import React from "react";
import { Table, Badge, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

const ProjectTables = ({ 
  filteredProjects, 
  handleView, 
  title,
  scrollContainerRef,
  fakeScrollbarRef
}) => {
  return (
    <div className="text-white p-3 mb-4 table-gradient-bg">
      <div
        ref={fakeScrollbarRef}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          height: 16,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
        }}
      >
        <div style={{ width: "2000px", height: 1 }} />
      </div>
      <h4 className="mb-3">{title}</h4>
      <div
        className=""
        ref={scrollContainerRef}
        style={{
          maxHeight: "500px",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
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
              <th>QA Reviewer</th>
              <th>QA Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr  key={project.id}>
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
                <td>{project.qaReviewer}</td>
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
                    {project.qaStatus}
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
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectTables;