import React, { useState } from "react";

const ProjectDetails = ({ project, teamFilter, onClose }) => {
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

  const handleQAAssignToMe = (fileId) => {
    // Logic for QA self-assignment
    alert(`File ${fileId} assigned to you for QA review`);
    // In a real app, this would update the backend and refresh the data
  };

  return (
    <div className="p-4">
      {/* Project Notes */}
      <div className="card mb-4">
        <div className="card-body bg-card">
          <h5 className="card-title mb-3">Project Notes</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Handler Note</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  defaultValue={project.handlerNote}
                  disabled={teamFilter === "QA"}
                ></textarea>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">QA Note</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  defaultValue={project.qaNote}
                ></textarea>
              </div>
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
      <div className="card">
        <div className="card-body bg-card">
          <h5 className="card-title mb-3">Files</h5>
          <div className="table-responsive">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(project.files);
                        } else {
                          setSelectedFiles([]);
                        }
                        setHasUnsavedChanges(e.target.checked);
                      }}
                      checked={selectedFiles.length === project.files.length}
                    />
                  </th>
                  <th>File Name</th>
                  <th>Pages</th>
                  <th>Language</th>
                  <th>Platform</th>
                  <th>Stage</th>
                  <th>Assigned Date</th>
                  <th>Handler</th>
                  <th>QA Reviewer</th>
                  <th>QA Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {project.files?.map((file) => (
                  <tr key={file.id}>
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
                    <td>{file.platform}</td>
                    <td>{file.stage}</td>
                    <td>{file.assigned}</td>
                    <td>{file.handler}</td>
                    <td>{file.qaReviewer}</td>
                    <td>{file.qaStatus}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {teamFilter === "QA" && file.stage === "QC YTS" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleQAAssignToMe(file.id)}
                          >
                            Assign to Me
                          </button>
                        )}
                        <button className="btn btn-sm btn-primary">
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;