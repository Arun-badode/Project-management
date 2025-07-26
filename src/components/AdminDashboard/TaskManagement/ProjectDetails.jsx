import React, { useState } from "react";

const ProjectDetails = ({ project, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [batchEditValues, setBatchEditValues] = useState({
    platform: "",
    handler: "",
    qaReviewer: "",
    priority: "",
  });

  const applyBatchEdits = () => {
    if (selectedFiles.length > 0) {
      const updatedFiles = project.files.map((file) => {
        if (selectedFiles.some((f) => f.id === file.id)) {
          return {
            ...file,
            platform: batchEditValues.platform || file.platform,
            handler: batchEditValues.handler || file.handler,
            qaReviewer: batchEditValues.qaReviewer || file.qaReviewer,
            priority: batchEditValues.priority || file.priority,
          };
        }
        return file;
      });

      setSelectedFiles([]);
      setHasUnsavedChanges(false);
      setBatchEditValues({
        platform: "",
        handler: "",
        qaReviewer: "",
        priority: "",
      });
    }
  };

  const toggleFileSelection = (file) => {
    if (selectedFiles.some((f) => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
    setHasUnsavedChanges(true);
  };

  return (
    <div className="p-4">
      {/* Project Notes */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              Handler Notes
            </div>
            <div className="card-body">
              <p>{project.handlerNote}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-info text-white">
              QA Notes
            </div>
            <div className="card-body">
              <p>{project.qaNote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Edit */}
      {selectedFiles.length > 0 && (
        <div className="card mb-4">
          <div className="card-body bg-card">
            <h6 className="card-title mb-3">Batch Edit</h6>
            <div className="row g-3">
              {/* Platform */}
              <div className="col-md-4 col-lg-2">
                <label className="form-label">Application</label>
                <select
                  className="form-select form-select-sm"
                  value={batchEditValues.platform}
                  onChange={(e) =>
                    setBatchEditValues({
                      ...batchEditValues,
                      platform: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="Web">Web</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Desktop">Desktop</option>
                  <option value="MS Office">MS Office</option>
                  <option value="Adobe">Adobe</option>
                </select>
              </div>
              {/* Handler */}
              <div className="col-md-4 col-lg-2">
                <label className="form-label">Handler</label>
                <select
                  className="form-select form-select-sm"
                  value={batchEditValues.handler}
                  onChange={(e) =>
                    setBatchEditValues({
                      ...batchEditValues,
                      handler: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Emily Chen">Emily Chen</option>
                </select>
              </div>
              {/* QA Reviewer */}
              <div className="col-md-4 col-lg-2">
                <label className="form-label">QA Reviewer</label>
                <select
                  className="form-select form-select-sm"
                  value={batchEditValues.qaReviewer}
                  onChange={(e) =>
                    setBatchEditValues({
                      ...batchEditValues,
                      qaReviewer: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="Sarah Williams">Sarah Williams</option>
                  <option value="David Brown">David Brown</option>
                  <option value="Emily Davis">Emily Davis</option>
                </select>
              </div>
              {/* Priority */}
              <div className="col-md-4 col-lg-2">
                <label className="form-label">Priority</label>
                <select
                  className="form-select form-select-sm"
                  value={batchEditValues.priority}
                  onChange={(e) =>
                    setBatchEditValues({
                      ...batchEditValues,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <button
                className="btn gradient-button"
                onClick={applyBatchEdits}
              >
                Apply to Selected Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files Table */}
      <div className="table-responsive">
        <table className="table table-sm table-striped table-hover">
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
              <th>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedFiles?.length === project?.files?.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles([...project.files]);
                    } else {
                      setSelectedFiles([]);
                    }
                    setHasUnsavedChanges(true);
                  }}
                />
              </th>
              <th>File Name</th>
              <th>Pages</th>
              <th>Language</th>
              <th>Application</th>
              <th>Stage</th>
              <th>Assigned</th>
              <th>Handler</th>
              <th>QA Reviewer</th>
              <th>QA Status</th>
            </tr>
          </thead>
          <tbody>
            {project?.files?.map((file) => (
              <tr
                key={file.id}
                className={
                  selectedFiles.some((f) => f.id === file.id)
                    ? "table-primary"
                    : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedFiles.some((f) => f.id === file.id)}
                    onChange={() => toggleFileSelection(file)}
                  />
                </td>
                <td>{file.name}</td>
                <td>{file.pages}</td>
                <td>{file.language}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={file.platform}
                    onChange={(e) => {
                      const updatedFiles = project.files.map((f) =>
                        f.id === file.id
                          ? { ...f, platform: e.target.value }
                          : f
                      );
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Desktop">Desktop</option>
                    <option value="MS Office">MS Office</option>
                    <option value="Adobe">Adobe</option>
                  </select>
                </td>
                <td>{file.stage}</td>
                <td>{file.assigned}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={file.handler || ""}
                    onChange={(e) => {
                      const updatedFiles = project.files.map((f) =>
                        f.id === file.id
                          ? { ...f, handler: e.target.value }
                          : f
                      );
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <option value="">Not Assigned</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Emily Chen">Emily Chen</option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={file.qaReviewer || ""}
                    onChange={(e) => {
                      const updatedFiles = project.files.map((f) =>
                        f.id === file.id
                          ? { ...f, qaReviewer: e.target.value }
                          : f
                      );
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <option value="">Not Assigned</option>
                    <option value="Sarah Williams">Sarah Williams</option>
                    <option value="David Brown">David Brown</option>
                    <option value="Emily Davis">Emily Davis</option>
                  </select>
                </td>
                <td>{file.qaStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetails;