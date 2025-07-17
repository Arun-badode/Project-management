import React, { useState } from 'react'

function EditModal() {
  const [editedProject, setEditedProject] = useState(null);
  
const initialFormData = {
    title: "",
    client: "",
    country: "",
    projectManager: "",
    tasks: [],
    languages: [],
    application: [],
    files: [
      [
        { name: "File_1", pageCount: 3, application: "", selected: false },
        { name: "File_2", pageCount: 5, application: "", selected: false },
        { name: "File_3", pageCount: 4, application: "", selected: false },
        { name: "File_4", pageCount: 2, application: "", selected: false },
        { name: "File_5", pageCount: 6, application: "", selected: false },
        { name: "File_6", pageCount: 7, application: "", selected: false },
        { name: "File_7", pageCount: 8, application: "", selected: false },
      ],
    ],
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
  };

  const [formData, setFormData] = useState(initialFormData);


   const handleSaveProjectEdit = () => {
    if (editedProject) {
      setProjects(
        projects.map((p) => (p.id === editedProject.id ? editedProject : p))
      );
      setShowEditModal(false);
      setEditedProject(null);
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
                      value={editedProject.title}
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
                      value={editedProject.client}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          client: e.target.value,
                        })
                      }
                    >
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
                      value={editedProject.task}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          task: e.target.value,
                        })
                      }
                    >
                      {getUniqueValues("task").map((task, index) => (
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
                      value={editedProject.language}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          language: e.target.value,
                        })
                      }
                    >
                      {getUniqueValues("language").map((language, index) => (
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
                      value={editedProject.application}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          application: e.target.value,
                        })
                      }
                    >
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Desktop">Desktop</option>
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
    
  )
  
}

export default EditModal
