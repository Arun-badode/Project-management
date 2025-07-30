import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import BASE_URL from "../../../config";

const ProjectsTable = ({  onViewProject, onMarkComplete, onDeleteProject, expandedRow }) => {
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const token = localStorage.getItem("authToken");
   const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-primary";
      case "QA Review":
        return "bg-info";
      case "Ready for QA":
        return "bg-warning";
      case "Completed":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const fakeScrollbar = fakeScrollbarRef.current;

    if (scrollContainer && fakeScrollbar) {
      const updateScrollbarVisibility = () => {
        const needsHorizontalScroll =
          scrollContainer.scrollWidth > scrollContainer.clientWidth;

        fakeScrollbar.style.display = needsHorizontalScroll ? "block" : "none";
      };

      // Sync scroll positions
      const syncScroll = () => {
        fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
      };
      const syncFakeScroll = () => {
        scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
      };

      scrollContainer.addEventListener("scroll", syncScroll);
      fakeScrollbar.addEventListener("scroll", syncFakeScroll);

      updateScrollbarVisibility();
      window.addEventListener("resize", updateScrollbarVisibility);

      return () => {
        scrollContainer.removeEventListener("scroll", syncScroll);
        fakeScrollbar.removeEventListener("scroll", syncFakeScroll);
        window.removeEventListener("resize", updateScrollbarVisibility);
      };
    }
  }, []);

 

  useEffect(() => {
    axios
      .get(`${BASE_URL}project/getAllProjects`,
        {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
      )
      .then((res) => {
        console.log("Projects fetched successfully", res.data);
        setProjects(res.data?.projects); // Assuming API returns { data: [...] }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;


  return (
    <>
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
          display: "none",
        }}
      >
        <div style={{ width: "2000px", height: 1 }} />
      </div>

      {/* Scrollable Table Container */}
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
        <table className="table-gradient-bg align-middle mt-0 table table-bordered table-hover">
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
              <th>Client</th>
              <th>Task</th>
              <th>Language</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Due Date & Time</th>
              <th>Handlers</th>
              <th>QA Reviewers</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project, index) => (
              <React.Fragment key={project.id}>
                <tr
                  className={
                    expandedRow === project.id ? "table-active " : ""
                  }
                >
                  <td>{index + 1}</td>
                  <td>{project.projectTitle}</td>
                  <td>{project.clientName}</td>
                  <td>{project.task_name}</td>
                  <td>{project.language_name}</td>
                  <td>{project.application_name}</td>
                  <td>{project.totalProjectPages}</td>
                  <td>{project.qcDueDate}</td>
                  <td>{project.qcHrs}</td>
                  <td>{project.receiveDate}</td>
                  <td>
                    <div
                      className="progress cursor-pointer"
                      style={{ height: "24px" }}
                     
                    >
                      <div
                        className={`progress-bar 
                          ${
                            project.progress < 30
                              ? "bg-danger"
                              : project.progress < 70
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        role="progressbar"
                        style={{ width: `${project?.progress}%` }}
                        aria-valuenow={project?.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        {project.progress}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onViewProject(project)}
                      >
                        <i
                          className={`fas ${
                            expandedRow === project.id
                              ? "fa-chevron-up"
                              : "fa-eye"
                          }`}
                        ></i>
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {}}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {project.progress === 100 && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onMarkComplete(project.id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDeleteProject(project.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === project.id && (
                  <tr className="table-active">
                    <td colSpan="12" className="p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.075)" }}>
                      <div className="bg-card p-3 rounded" style={{ 
                        border: "1px solid #dee2e6",
                        
                      }}>
                        <h5 className="text-dark">Project Details</h5>
                        <div className="row mt-3">
                          <div className="col-md-6">
                            <p><strong>Description:</strong> {project.description || "No description available"}</p>
                            <p><strong>Start Date:</strong> {project.startDate || "Not specified"}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Status:</strong> 
                              <span className={`badge ${getStatusColor(project.status)} ms-2`}>
                                {project.status}
                              </span>
                            </p>
                            <p><strong>Priority:</strong> {project.priority || "Normal"}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProjectsTable;