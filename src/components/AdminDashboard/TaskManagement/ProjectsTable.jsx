import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../config";

const ProjectsTable = ({ onMarkComplete, onDeleteProject, expandedRowId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}project/getAllProjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data.projects || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-danger";
    if (progress < 70) return "bg-warning";
    return "bg-success";
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const fakeScrollbar = fakeScrollbarRef.current;

    if (scrollContainer && fakeScrollbar) {
      const updateScrollbarVisibility = () => {
        fakeScrollbar.style.display =
          scrollContainer.scrollWidth > scrollContainer.clientWidth ? "block" : "none";
      };

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

  if (loading) return <div className="text-center py-5">Loading projects...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <>
      {/* View Project Modal */}
      {showModal && selectedProject && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered ">
            <div className="modal-content bg-card">
              <div className="modal-header">
                <h5 className="modal-title">Project Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Project Title</h6>
                    <p>{selectedProject.projectTitle}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Client</h6>
                    <p>{selectedProject.clientName}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <h6>Task</h6>
                    <p>{selectedProject.task_name}</p>
                  </div>
                  <div className="col-md-4">
                    <h6>Language</h6>
                    <p>{selectedProject.language_name}</p>
                  </div>
                  <div className="col-md-4">
                    <h6>Application</h6>
                    <p>{selectedProject.application_name}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Total Pages</h6>
                    <p>{selectedProject.totalProjectPages}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Deadline</h6>
                    <p>{selectedProject.deadline}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Handlers</h6>
                    <p>Not Assigned</p>
                  </div>
                  <div className="col-md-6">
                    <h6>QA Reviewers</h6>
                    <p>QA Pending</p>
                  </div>
                </div>
                <div className="progress-container">
                  <h6>Progress</h6>
                  <div className="progress" style={{ height: "24px" }}>
                    <div
                      className={`progress-bar ${getProgressColor(selectedProject.progress || 0)}`}
                      style={{ width: `${selectedProject.progress || 0}%` }}
                    >
                      {selectedProject.progress || 0}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <div ref={scrollContainerRef} style={{ maxHeight: "500px", overflowX: "auto" }}>
        <table className="table-gradient-bg align-middle mt-0 table table-bordered table-hover">
          <thead >
            <tr className="text-center">
              <th>S. No.</th>
              <th>Project Title</th>
              <th>Client</th>
              <th>Task</th>
              <th>Language</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Deadline</th>
              <th>Handlers</th>
              <th>QA Reviewers</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => {
              const dummyProgress = Math.floor(Math.random() * 100) + 1;
              return (
                <tr key={project.id} className={expandedRowId === project.id ? "table-active text-center" : ""}>
                  <td>{index + 1}</td>
                  <td>{project.projectTitle}</td>
                  <td>{project.clientName}</td>
                  <td>{project.task_name}</td>
                  <td>{project.language_name}</td>
                  <td>{project.application_name}</td>
                  <td>{project.totalProjectPages}</td>
                  <td>{project.deadline}</td>
                  <td>Not Assigned</td>
                  <td>QA Pending</td>
                  <td>
                    <div
                      className="progress cursor-pointer"
                      style={{ height: "24px" }}
                      onClick={() => handleViewProject(project)}
                    >
                      <div
                        className={`progress-bar ${getProgressColor(dummyProgress)}`}
                        style={{ width: `${dummyProgress}%` }}
                      >
                        {dummyProgress}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handleViewProject(project)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={() => {}}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {dummyProgress === 100 && (
                        <button 
                          className="btn btn-sm btn-success" 
                          onClick={() => onMarkComplete(project.id)}
                          title="Mark Complete"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => onDeleteProject(project.id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProjectsTable;