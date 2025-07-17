import React, { useState, useEffect } from 'react';

function EditModal({ project, projects, setProjects, setShowEditModal }) {
  const [editedProject, setEditedProject] = useState({
    title: "",
    client: "",
    country: "",
    projectManager: "",
    tasks: [],
    languages: [],
    application: "",
    files: [],
    totalPages: 0,
    deadline: "",
    readyDeadline: "",
    qcHrs: "",
    receivedDate: new Date().toISOString().split("T")[0],
    serverPath: "",
    notes: "",
    rate: 0,
    currency: "USD",
    cost: 0,
    inrCost: 0,
    dueDate: new Date().toISOString(),
  });

  useEffect(() => {
    if (project) {
      setEditedProject(project);
    }
  }, [project]);

 const getUniqueValues = (key) => {
  if (!Array.isArray(projects)) return [];
  return Array.from(
    new Set(
      projects
        .map((project) => project?.[key])
        .filter((val) => val !== undefined && val !== null && val !== "")
        .flat() // if key holds array, flatten it 
    )
  );
};

  const applicationOptio = getUniqueValues("application").map((app) => ({
    value: app,
    label: app,
  }));

  const customToInputDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const inputToCustomDate = (inputString) => {
    if (!inputString) return '';
    return new Date(inputString).toISOString();
  };

  const handleSaveProjectEdit = () => {
    if (editedProject) {
      setProjects(
        projects.map((p) => (p.id === editedProject.id ? editedProject : p))
      );
      setShowEditModal(false);
    }
  };

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-12">
          <label className="form-label">Project Title</label>
          <input
            type="text"
            className="form-control"
            value={editedProject.title || ''}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                title: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Client</label>
          <select
            className="form-select"
            value={editedProject.client || ''}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                client: e.target.value,
              })
            }
          >
            <option value="">Select Client</option>
            {getUniqueValues("client").map((client, index) => (
              <option key={index} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Task</label>
          <select
            className="form-select"
            value={editedProject.tasks[0] || ''}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                tasks: [e.target.value],
              })
            }
          >
            <option value="">Select Task</option>
            {getUniqueValues("tasks").map((task, index) => (
              <option key={index} value={task}>
                {task}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Language</label>
          <select
            className="form-select"
            value={editedProject.languages[0] || ''}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                languages: [e.target.value],
              })
            }
          >
            <option value="">Select Language</option>
            {getUniqueValues("languages").map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Application</label>
          <select
            className="form-select"
            value={editedProject.application || ''}
            onChange={(e) =>
              setEditedProject({
                ...editedProject,
                application: e.target.value,
              })
            }
          >
            <option value="">Select Application</option>
            <option value="Word">Word</option>
            <option value="PPT">PPT</option>
            <option value="Excel">Excel</option>
            <option value="INDD">INDD</option>
            <option value="AI">AI</option>
            <option value="PSD">PSD</option>
            <option value="AE">AE</option>
            <option value="CDR">CDR</option>
            <option value="Visio">Visio</option>
            <option value="Project">Project</option>
            <option value="FM">FM</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Due Date & Time</label>
          <div className="input-group">
            <input
              type="datetime-local"
              className="form-control"
              value={customToInputDate(editedProject.dueDate)}
              onChange={(e) => {
                setEditedProject({
                  ...editedProject,
                  dueDate: inputToCustomDate(e.target.value),
                });
              }}
            />
            <span className="input-group-text">
              <i className="fa fa-calendar"></i>
            </span>
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default EditModal;
