import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import BASE_URL from "../../../config";

const ProjectsTable = ({
  projects,
  teamFilter,
  isManager,
  onMarkComplete,
  onDeleteProject,
  onReassign,
  onViewDetails,
}) => {
  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);
  const tableWrapperRef = useRef(null);
  const token = localStorage.getItem("authToken");

  const [Employeeprojects, setEmployeeProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null); // tracks which project row is expanded

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

  // Map status to a default progress percentage
  const getStatusProgress = (status) => {
    switch (status) {
      case "In Progress":
        return 50;
      case "QA Review":
        return 80;
      case "Ready for QA":
        return 90;
      case "Completed":
        return 100;
      default:
        return 10; // small default for unknown or not started
    }
  };

  // Scroll synchronization
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const fakeScrollbar = fakeScrollbarRef.current;
    const tableWrapper = tableWrapperRef.current;
    if (!scrollContainer || !fakeScrollbar || !tableWrapper) return;

    const updateScrollbar = () => {
      const needsScroll =
        scrollContainer.scrollWidth > scrollContainer.clientWidth;
      fakeScrollbar.style.display = needsScroll ? "block" : "none";
      const scrollContent = fakeScrollbar.querySelector(".scroll-content");
      if (scrollContent) {
        scrollContent.style.width = `${scrollContainer.scrollWidth}px`;
      }
      fakeScrollbar.style.width = `${tableWrapper.clientWidth}px`;
    };

    const handleScroll = () => {
      fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
    };

    const handleFakeScroll = () => {
      scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
    };

    updateScrollbar();
    scrollContainer.addEventListener("scroll", handleScroll);
    fakeScrollbar.addEventListener("scroll", handleFakeScroll);
    window.addEventListener("resize", updateScrollbar);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      fakeScrollbar.removeEventListener("scroll", handleFakeScroll);
      window.removeEventListener("resize", updateScrollbar);
    };
  }, [Employeeprojects]);

  // Use the projects passed from props instead of fetching new data
  useEffect(() => {
    // If we're using filtered projects from props, transform them to match the expected structure
    if (projects && projects.length > 0) {
      // Group projects by employee for display
      const groupedByEmployee = {};
      
      projects.forEach(project => {
        // Create a mock employee structure for each project
        const employeeId = project.assignedEmployee?.id || "EMP001";
        const employeeName = project.assignedEmployee?.name || "John Doe";
        const employeeTeam = project.platform === "Adobe" ? "Adobe" : 
                            project.platform === "MS Office" ? "MS Office" : "QA";
        const employeeDesignation = employeeTeam === "QA" ? "QA Specialist" : 
                                  employeeTeam === "Adobe" ? "Adobe Specialist" : "MS Office Specialist";
        
        if (!groupedByEmployee[employeeId]) {
          groupedByEmployee[employeeId] = {
            empId: employeeId,
            fullName: employeeName,
            designation: employeeDesignation,
            projects: []
          };
        }
        
        // Transform project to match expected structure
        const transformedProject = {
          id: project.id,
          projectTitle: project.title,
          clientName: project.client,
          taskName: project.task,
          languageName: project.language,
          applicationName: project.platform,
          totalProjectPages: project.totalPages,
          qcDueDate: project.dueDate,
          qcHrs: project.dueDate,
          receiveDate: project.dueDate,
          status: project.status,
          progress: project.progress,
          description: project.handlerNote,
          priority: "Medium",
          startDate: new Date().toLocaleDateString(),
          files: project.files || []
        };
        
        groupedByEmployee[employeeId].projects.push(transformedProject);
      });
      
      // Convert to array and sort by employee ID
      const employeeArray = Object.values(groupedByEmployee);
      employeeArray.sort((a, b) => a.empId.localeCompare(b.empId));
      
      setEmployeeProjects(employeeArray);
      setLoading(false);
    } else {
      // If no projects from props, fetch from API
      axios
        .get(`${BASE_URL}project/getAllMembersWithProjects`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // Filter employees based on team filter
          let filteredData = res.data.data;
          
          if (teamFilter !== "All") {
            filteredData = res.data.data.filter(employee => {
              // Determine employee team based on their projects or designation
              const employeeTeam = employee.designation?.toLowerCase().includes("qa") ? "QA" : 
                                 employee.projects?.some(p => p.applicationName === "Adobe") ? "Adobe" :
                                 employee.projects?.some(p => p.applicationName === "MS Office") ? "MS Office" : "Other";
              
              return employeeTeam === teamFilter;
            });
          }
          
          // Sort employees by Employee ID in ascending order
          filteredData.sort((a, b) => a.empId.localeCompare(b.empId));
          
          setEmployeeProjects(filteredData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching projects", err);
          setLoading(false);
        });
    }
  }, [projects, teamFilter, token]);

  const toggleRow = (projId) => {
    setExpandedRow((prev) => (prev === projId ? null : projId));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="position-relative"
      style={{ height: "10%", display: "flex", flexDirection: "column" }}
    >
      <div
        ref={tableWrapperRef}
        style={{
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: "500px",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            width: "100%",
          }}
          className="hide-scrollbar"
        >
          {Employeeprojects?.length > 0 ? (
            Employeeprojects.map((employee) => (
              <div className="table-responsive" key={employee.empId}>
                <table
                  className="table-gradient-bg align-middle mt-0 table table-bordered table-hover"
                  style={{ width: "100%" }}
                >
                  {/* Employee Header */}
                  <thead
                    className="table-gradient-bg"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#133EB3",
                      color: "white",
                    }}
                  >
                    <tr style={{ height: "50px" }}>
                      <td colSpan="100%">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0 20px",
                            height: "50px",
                            borderRadius: "4px",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                              {employee?.empId}
                            </div>
                            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                              {employee?.fullName}
                            </div>
                          </div>
                          <div>
                            <button
                              style={{
                                backgroundColor: "#ddd",
                                border: "none",
                                borderRadius: "12px",
                                padding: "5px 15px",
                                fontWeight: "bold",
                              }}
                            >
                              {employee.designation?.toLowerCase().includes("qa") ? "QA" : 
                               employee.projects?.some(p => p.applicationName === "Adobe") ? "Adobe" :
                               employee.projects?.some(p => p.applicationName === "MS Office") ? "MS Office" : "Other"}
                            </button>
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {employee.designation}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </thead>

                  {/* Project Table Head */}
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
                      <th>Assigned Pages</th>
                      <th>Deadline</th>
                      <th>Ready For Qc Deadline</th>
                      <th>QC Due</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employee.projects?.map((proj, index) => (
                      <React.Fragment key={proj.id}>
                        <tr className={expandedRow === proj.id ? "table-active" : ""}>
                          <td>{index + 1}</td>
                          <td>{proj.projectTitle}</td>
                          <td>{proj.clientName}</td>
                          <td>{proj.taskName}</td>
                          <td>{proj.languageName}</td>
                          <td>{proj.applicationName}</td>
                          <td>{proj.totalProjectPages}</td>
                          <td>54</td>
                          <td>{proj.qcDueDate}</td>
                          <td>{proj.qcHrs}</td>
                          <td>{proj.receiveDate}</td>
                          <td>{proj.status}</td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              {/* Progress Bar */}
                              <div className="progress w-100" style={{ height: "24px" }}>
                                <div
                                  className={`progress-bar ${getStatusColor(proj.status)}`}
                                  role="progressbar"
                                  style={{
                                    width: `${proj?.progress && proj.progress > 0
                                        ? proj.progress
                                        : getStatusProgress(proj.status)
                                      }%`,
                                  }}
                                  aria-valuenow={
                                    proj?.progress && proj.progress > 0
                                      ? proj.progress
                                      : getStatusProgress(proj.status)
                                  }
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>

                              {/* Status & Percentage Below */}
                              <div style={{ marginTop: "4px", fontSize: "12px", textAlign: "center" }}>
                                <strong>
                                  {proj?.progress && proj.progress > 0
                                    ? proj.progress
                                    : getStatusProgress(proj.status)}
                                  %
                                </strong>{" "}
                                — {proj.status || "Unknown"}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                  setExpandedRow(expandedRow === proj.id ? null : proj.id)
                                }
                              >
                                <i
                                  className={`fas ${expandedRow === proj.id ? "fa-chevron-up" : "fa-eye"
                                    }`}
                                ></i>
                              </button>
                              {proj.progress === 100 && (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => onMarkComplete(proj.id)}
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-sm"
                                style={{ backgroundColor: "#d8ca00ff", color: "black" }}
                                onClick={() => onReassign(proj.id)}
                              >
                                <i className="fas fa-exchange-alt me-1"></i> Reassign
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{ backgroundColor: "#6c757d", color: "white" }}
                                onClick={() => onViewDetails(proj.id)}
                              >
                                Details <i className="fas fa-external-link-alt ms-1"></i>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded project details */}
                        {expandedRow === proj.id && (
                          <tr>
                            <td colSpan="13">
                              <div
                                style={{
                                  backgroundColor: "#0B1444",
                                  padding: "15px",
                                  borderRadius: "6px",
                                  color: "white",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                }}
                              >
                                <h5 style={{ marginBottom: "15px" }}>Project Details</h5>
                                <div className="row">
                                  <div className="col-md-6">
                                    <p>
                                      <strong>Description:</strong>{" "}
                                      {proj.description || "No description available"}
                                    </p>
                                    <p>
                                      <strong>Start Date:</strong>{" "}
                                      {proj.startDate || "Not specified"}
                                    </p>
                                  </div>
                                  <div className="col-md-6">
                                    <p>
                                      <strong>Status:</strong>{" "}
                                      <span
                                        className="badge"
                                        style={{
                                          backgroundColor:
                                            proj.status === "Completed" ? "green" : "#6c757d",
                                        }}
                                      >
                                        {proj.status}
                                      </span>
                                    </p>
                                    <p>
                                      <strong>Priority:</strong> {proj.priority || "Normal"}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* QA self-assignment functionality */}
                                {teamFilter === "QA" && proj.status === "Ready for QA" && (
                                  <div className="mt-3">
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => {
                                        // Logic for QA self-assignment
                                        alert("Files assigned to QA team member");
                                      }}
                                    >
                                      Assign Files to Myself
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <p className="text-light">No projects found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Fake Scrollbar */}
      <div
        ref={fakeScrollbarRef}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          height: "16px",
          bottom: 0,
          left: 0,
          right: 0,
          display: "none",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div className="scroll-content" style={{ height: "1px" }} />
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProjectsTable;