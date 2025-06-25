// import React, { useState } from "react";
// import {
//   Card,
//   Button,
//   Table,
//   Badge,
//   Modal,
//   Form,
// } from "react-bootstrap";
// import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

// // Define arrays used in random project generation
// const platforms = ["Web", "Mobile", "Desktop"];
// const statuses = ["In Progress", "Completed", "On Hold"];
// const handlers = ["Alice", "Bob", "Charlie", "David"];
// // const processStatuses = ["Pending", "Completed", "Delayed"];
// const qaReviewers = ["Eve", "Mallory", "Trent"];
// const qaStatuses = ["Passed", "Failed", "In Review"];

// const Project = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [editProject, setEditProject] = useState(null);

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => setShowModal(false);

//   const handleView = (project) => {
//     setSelectedProject(project);
//     setShowViewModal(true);
//   };

//   const handleEdit = (project) => {
//     setEditProject(project);
//     setShowEditModal(true);
//   };

//   const generateRandomProjects = (count) => {
//     const clients = [
//       "Acme Corp",
//       "Globex",
//       "Soylent",
//       "Initech",
//       "Umbrella",
//       "Wayne Ent",
//       "Stark Ind",
//       "Oscorp",
//     ];

//     const projects = [];
//     const today = new Date();

//     for (let i = 0; i < count; i++) {
//       const randomDays = Math.floor(Math.random() * 30) + 1;
//       const dueDate = new Date(today);
//       dueDate.setDate(today.getDate() + randomDays);

//       const qcDeadline = new Date(dueDate);
//       qcDeadline.setDate(dueDate.getDate() - 2);

//       const qcDueDate = new Date(qcDeadline);
//       qcDueDate.setDate(qcDeadline.getDate() + 1);

//       projects.push({
//         id: i + 1,
//         title: `Project ${i + 1}`,
//         client: clients[Math.floor(Math.random() * clients.length)],
//         tasks: Math.floor(Math.random() * 10) + 1,
//         languages: Math.floor(Math.random() * 5) + 1,
//         platform: platforms[Math.floor(Math.random() * platforms.length)],
//         pages: Math.floor(Math.random() * 200) + 50,
//         dueDate: dueDate.toISOString().split("T")[0],
//         qcDeadline: qcDeadline.toISOString().split("T")[0],
//         qcHours: Math.floor(Math.random() * 24) + 1,
//         qcDueDate: qcDueDate.toISOString().split("T")[0],
//         status: statuses[Math.floor(Math.random() * statuses.length)],
//         handler: handlers[Math.floor(Math.random() * handlers.length)],
//         // processStatus:
//         //   processStatuses[Math.floor(Math.random() * processStatuses.length)],
//         qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
//         qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
//         serverPath: `/server/path/project${i + 1}`,
//       });
//     }

//     return projects;
//   };

//   const projects = generateRandomProjects(15);

//   return (
//     <div className="admin-dashboard text-white p-3 p-md-4 bg-main">
//       {/* Header */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
//         <h2 className="gradient-heading">All Project</h2>
//         <div className="d-flex flex-column flex-sm-row gap-2">
//           <Button className="gradient-button"><i class="fa-solid fa-download me-2"></i>Black Excel Download</Button>  
//           <Button className="gradient-button"><i class="fa-solid fa-upload me-2"></i>Import Excel</Button>
//            <Button className="gradient-button"><i class="fa-solid fa-download me-2"></i>Download Excel</Button>
//           <Button className="gradient-button" onClick={handleShow}>
//             <FaPlus className="me-2" /> Create New Project
//           </Button>
         
//         </div>
//       </div>

//       {/* Main Table */}
//       <Card className="text-white p-3 mb-5 table-gradient-bg">
//   <h4 className="mb-3">Project List</h4>

//   {/* ✅ Scrollable Wrapper */}
//  <div
//   className="table-responsive table-gradient-bg"
//   style={{ maxHeight: '400px', overflowY: 'auto' }}
// >
//   <Table className="table-gradient-bg align-middle mb-0 table table-bordered table-hover">
//     <thead className="table-light bg-dark sticky-top">
//       <tr>
//         <th>S. No.</th>
//         <th>Project Title</th>
//         <th>Client</th>
//         <th>Task</th>
//         <th>Language</th>
//         <th>Platform</th>
//         <th>Total Pages</th>
//         <th>Actual Due Date & Time</th>
//         <th>Progress</th>
//         <th>Action</th>
//       </tr>
//     </thead>

//     <tbody>
//       {projects.map((project, index) => (
//         <tr key={project.id}>
//           <td>{index + 1}</td>
//           <td>{project.title}</td>
//           <td>{project.client}</td>
//           <td>{project.tasks}</td>
//           <td>{project.languages}</td>
//           <td>{project.platform}</td>
//           <td>{project.pages}</td>
//           <td>{project.dueDate}</td>
//           <td>
//             <Badge
//               bg={
//                 project.status === "Completed"
//                   ? "success"
//                   : project.status === "On Hold"
//                   ? "warning"
//                   : "info"
//               }
//             >
//               {project.status}
//             </Badge>
//           </td>
//           <td>
//             <Button
//               variant="link"
//               className="text-info p-0 me-2"
//               title="View"
//               onClick={() => handleView(project)}
//             >
//               <FaEye />
//             </Button>
//             <Button
//               variant="link"
//               className="text-warning p-0 me-2"
//               title="Edit"
//               onClick={() => handleEdit(project)}
//             >
//               <FaEdit />
//             </Button>
//             <Button
//               variant="link"
//               className="text-danger p-0"
//               title="Delete"
//             >
//               <FaTrash />
//             </Button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </Table>
// </div>
// </Card>


//       {/* Create Project Modal */}
//       <Modal
//         show={showModal}
//         onHide={handleClose}
//         centered
//         className="custom-modal-dark"
//       >
//         <Modal.Header closeButton className="bg-dark text-white">
//           <Modal.Title>Create New Project</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="bg-dark text-white">
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Project Name</Form.Label>
//               <Form.Control type="text" placeholder="Enter title" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Client Name</Form.Label>
//               <Form.Control type="text" placeholder="Enter client name" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Platform</Form.Label>
//               <Form.Select className="text-white border-secondary">
//                 <option>Web</option>
//                 <option>Mobile</option>
//                 <option>Desktop</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Total Pages</Form.Label>
//               <Form.Control type="number" placeholder="Enter page count" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Actual Due Date</Form.Label>
//               <Form.Control type="datetime-local" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Ready for QC Deadline</Form.Label>
//               <Form.Control type="datetime-local" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>QC Hours Allocated</Form.Label>
//               <Form.Control type="number" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>QC Due Date</Form.Label>
//               <Form.Control type="datetime-local" />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Status</Form.Label>
//               <Form.Select>
//                 <option>In Progress</option>
//                 <option>Completed</option>
//                 <option>On Hold</option>
//               </Form.Select>
//             </Form.Group>
//             <Button
//               variant="primary"
//               type="submit"
//               className="w-100 gradient-button"
//             >
//               Create Project
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* View Project Details Modal */}
//       <Modal
//         show={showViewModal}
//         onHide={() => setShowViewModal(false)}
//         centered
//         className="custom-modal-dark"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Project Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedProject && (
//             <div>
//               <p>
//                 <strong>Title:</strong> {selectedProject.title}
//               </p>
//               <p>
//                 <strong>Client:</strong> {selectedProject.client}
//               </p>
//               <p>
//                 <strong>Platform:</strong> {selectedProject.platform}
//               </p>
//               <p>
//                 <strong>Pages:</strong> {selectedProject.pages}
//               </p>
//               <p>
//                 <strong>Due Date:</strong> {selectedProject.dueDate}
//               </p>
//               <p>
//                 <strong>Status:</strong> {selectedProject.status}
//               </p>
//               <p>
//                 <strong>Handler:</strong> {selectedProject.handler}
//               </p>
//               <p>
//                 <strong>QA Reviewer:</strong> {selectedProject.qaReviewer}
//               </p>
//               <p>
//                 <strong>QA Status:</strong> {selectedProject.qaStatus}
//               </p>
//               {/* <p>
//                 <strong>Server Path:</strong> {selectedProject.serverPath}
//               </p> */}
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* Edit Project Modal */}
//       <Modal
//         show={showEditModal}
//         onHide={() => setShowEditModal(false)}
//         centered
//         className="custom-modal-dark"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Project</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {editProject && (
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Project Title</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={editProject.title}
//                   onChange={(e) =>
//                     setEditProject({ ...editProject, title: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Client</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={editProject.client}
//                   onChange={(e) =>
//                     setEditProject({ ...editProject, client: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Platform</Form.Label>
//                 <Form.Select
//                   className="text-white border-secondary"
//                   value={editProject.platform}
//                   onChange={(e) =>
//                     setEditProject({ ...editProject, platform: e.target.value })
//                   }
//                 >
//                   <option>Web</option>
//                   <option>Mobile</option>
//                   <option>Desktop</option>
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Total Pages</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={editProject.pages}
//                   onChange={(e) =>
//                     setEditProject({ ...editProject, pages: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Actual Due Date</Form.Label>
//                 <Form.Control
//                   type="datetime-local"
//                   value={editProject.dueDate}
//                   onChange={(e) =>
//                     setEditProject({ ...editProject, dueDate: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Ready for QC Deadline</Form.Label>
//                 <Form.Control
//                   type="datetime-local"
//                   value={editProject.qcDeadline}
//                   onChange={(e) =>
//                     setEditProject({
//                       ...editProject,
//                       qcDeadline: e.target.value,
//                     })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>QC Hours Allocated</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={editProject.qcHours}
//                   onChange={(e) =>
//                     setEditProject({ ...editProject, qcHours: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>QC Due Date</Form.Label>
//                 <Form.Control
//                   type="datetime-local"
//                   value={editProject.qcDueDate}
//                   onChange={(e) =>
//                     setEditProject({
//                       ...editProject,
//                       qcDueDate: e.target.value,
//                     })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Status</Form.Label>
//                 <Form.Select
//                   value={editProject.status}
//                   onChange={(e) =>
//                     setEditProject({ ...editProject, status: e.target.value })
//                   }
//                 >
//                   <option>In Progress</option>
//                   <option>Completed</option>
//                   <option>On Hold</option>
//                 </Form.Select>
//               </Form.Group>
//               <Button
//                 variant="primary"
//                 type="submit"
//                 className="w-100 gradient-button"
//               >
//                 Save Changes
//               </Button>
//             </Form>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Project;




import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
  ProgressBar,
  Dropdown,
} from "react-bootstrap";
import { FaPlus, FaEye, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

// Define arrays used in random project generation
const platforms = ["Web", "Mobile", "Desktop"];
const statuses = ["In Progress", "Completed", "On Hold"];
const handlers = ["Alice", "Bob", "Charlie", "David"];
const qaReviewers = ["Eve", "Mallory", "Trent"];
const qaStatuses = ["Passed", "Failed", "In Review"];
const fileStatuses = ["Not Started", "In Progress", "Completed", "QA Passed", "QA Failed"];

const Project = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowEditModal(true);
  };

  const toggleFileDetails = (projectId) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(projectId);
    }
  };

  // Generate random files for each project
  const generateRandomFiles = (count) => {
    const files = [];
    for (let i = 0; i < count; i++) {
      files.push({
        id: i + 1,
        name: `File_${i + 1}.ext`,
        status: fileStatuses[Math.floor(Math.random() * fileStatuses.length)],
        progress: Math.floor(Math.random() * 100),
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
        assignedTo: handlers[Math.floor(Math.random() * handlers.length)],
      });
    }
    return files;
  };

  const generateRandomProjects = (count) => {
    const clients = [
      "Acme Corp",
      "Globex",
      "Soylent",
      "Initech",
      "Umbrella",
      "Wayne Ent",
      "Stark Ind",
      "Oscorp",
    ];

    const projects = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const randomDays = Math.floor(Math.random() * 30) + 1;
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + randomDays);

      const qcDeadline = new Date(dueDate);
      qcDeadline.setDate(dueDate.getDate() - 2);

      const qcDueDate = new Date(qcDeadline);
      qcDueDate.setDate(qcDeadline.getDate() + 1);

      const fileCount = Math.floor(Math.random() * 5) + 3; // 3-7 files per project
      const files = generateRandomFiles(fileCount);

      projects.push({
        id: i + 1,
        title: `Project ${i + 1}`,
        client: clients[Math.floor(Math.random() * clients.length)],
        tasks: Math.floor(Math.random() * 10) + 1,
        languages: Math.floor(Math.random() * 5) + 1,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        pages: Math.floor(Math.random() * 200) + 50,
        dueDate: dueDate.toISOString().split("T")[0],
        qcDeadline: qcDeadline.toISOString().split("T")[0],
        qcHours: Math.floor(Math.random() * 24) + 1,
        qcDueDate: qcDueDate.toISOString().split("T")[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        handler: handlers[Math.floor(Math.random() * handlers.length)],
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        serverPath: `/server/path/project${i + 1}`,
        files: files,
        progress: Math.floor(Math.random() * 100),
      });
    }

    return projects;
  };

  const projects = generateRandomProjects(15);

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.file-details-dropdown') && !e.target.closest('.progress-clickable')) {
      setExpandedProjectId(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "QA Passed":
        return "success";
      case "In Progress":
        return "primary";
      case "QA Failed":
        return "danger";
      case "On Hold":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="admin-dashboard text-white p-3 p-md-4 bg-main">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="gradient-heading">All Projects</h2>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button className="gradient-button"><i className="fa-solid fa-download me-2"></i>Black Excel Download</Button>  
          <Button className="gradient-button"><i className="fa-solid fa-upload me-2"></i>Import Excel</Button>
          <Button className="gradient-button"><i className="fa-solid fa-download me-2"></i>Download Excel</Button>
          <Button className="gradient-button" onClick={handleShow}>
            <FaPlus className="me-2" /> Create New Project
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <Card className="text-white p-3 mb-5 table-gradient-bg">
        <h4 className="mb-3">Project List</h4>

        <div
          className="table-responsive table-gradient-bg"
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          <Table className="table-gradient-bg align-middle mb-0 table table-bordered table-hover">
            <thead className="table-light bg-dark sticky-top">
              <tr>
                <th>S. No.</th>
                <th>Project Title</th>
                <th>Client</th>
                <th>Task</th>
                <th>Language</th>
                <th>Platform</th>
                <th>Total Pages</th>
                <th>Actual Due Date & Time</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{project.title}</td>
                    <td>{project.client}</td>
                    <td>{project.tasks}</td>
                    <td>{project.languages}</td>
                    <td>{project.platform}</td>
                    <td>{project.pages}</td>
                    <td>{project.dueDate}</td>
                    <td>
                      <div 
                        className="progress-clickable" 
                        onClick={() => toggleFileDetails(project.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex justify-content-between mb-1">
                          <small>{project.progress}%</small>
                          {expandedProjectId === project.id ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <ProgressBar 
                          now={project.progress} 
                          variant={
                            project.progress < 30 ? "danger" : 
                            project.progress < 70 ? "warning" : "success"
                          } 
                        />
                      </div>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        className="text-info p-0 me-2"
                        title="View"
                        onClick={() => handleView(project)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="link"
                        className="text-warning p-0 me-2"
                        title="Edit"
                        onClick={() => handleEdit(project)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        title="Delete"
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                  {expandedProjectId === project.id && (
                    <tr>
                      <td colSpan="10" className="p-0">
                        <div className="file-details-dropdown p-3 bg-dark">
                          <h5>File Details for {project.title}</h5>
                          <Table striped bordered hover variant="dark" className="mt-2">
                            <thead>
                              <tr>
                                <th>File Name</th>
                                <th>Status</th>
                                <th>Progress</th>
                                <th>Last Updated</th>
                                <th>Assigned To</th>
                              </tr>
                            </thead>
                            <tbody>
                              {project.files.map(file => (
                                <tr key={file.id}>
                                  <td>{file.name}</td>
                                  <td>
                                    <Badge bg={getStatusColor(file.status)}>
                                      {file.status}
                                    </Badge>
                                  </td>
                                  <td>
                                    <ProgressBar 
                                      now={file.progress} 
                                      variant={
                                        file.progress < 30 ? "danger" : 
                                        file.progress < 70 ? "warning" : "success"
                                      } 
                                      label={`${file.progress}%`}
                                    />
                                  </td>
                                  <td>{file.lastUpdated}</td>
                                  <td>{file.assignedTo}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Create Project Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control type="text" placeholder="Enter title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control type="text" placeholder="Enter client name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Platform</Form.Label>
              <Form.Select className="text-white border-secondary">
                <option>Web</option>
                <option>Mobile</option>
                <option>Desktop</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Pages</Form.Label>
              <Form.Control type="number" placeholder="Enter page count" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Actual Due Date</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 gradient-button"
            >
              Create Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Project Details Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {selectedProject && (
            <div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p><strong>Title:</strong> {selectedProject.title}</p>
                  <p><strong>Client:</strong> {selectedProject.client}</p>
                  <p><strong>Platform:</strong> {selectedProject.platform}</p>
                  <p><strong>Pages:</strong> {selectedProject.pages}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Due Date:</strong> {selectedProject.dueDate}</p>
                  <p><strong>Status:</strong> 
                    <Badge bg={getStatusColor(selectedProject.status)} className="ms-2">
                      {selectedProject.status}
                    </Badge>
                  </p>
                  <p><strong>Handler:</strong> {selectedProject.handler}</p>
                  <p><strong>QA Reviewer:</strong> {selectedProject.qaReviewer}</p>
                </div>
              </div>
              
              <h5>Files</h5>
              <Table striped bordered hover variant="dark" className="mt-2">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProject.files.map(file => (
                    <tr key={file.id}>
                      <td>{file.name}</td>
                      <td>
                        <Badge bg={getStatusColor(file.status)}>
                          {file.status}
                        </Badge>
                      </td>
                      <td>
                        <ProgressBar 
                          now={file.progress} 
                          variant={
                            file.progress < 30 ? "danger" : 
                            file.progress < 70 ? "warning" : "success"
                          } 
                          label={`${file.progress}%`}
                        />
                      </td>
                      <td>{file.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className="custom-modal-dark"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {editProject && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Project Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.title}
                  onChange={(e) =>
                    setEditProject({ ...editProject, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Client</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.client}
                  onChange={(e) =>
                    setEditProject({ ...editProject, client: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Platform</Form.Label>
                <Form.Select
                  className="text-white border-secondary"
                  value={editProject.platform}
                  onChange={(e) =>
                    setEditProject({ ...editProject, platform: e.target.value })
                  }
                >
                  <option>Web</option>
                  <option>Mobile</option>
                  <option>Desktop</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total Pages</Form.Label>
                <Form.Control
                  type="number"
                  value={editProject.pages}
                  onChange={(e) =>
                    setEditProject({ ...editProject, pages: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Actual Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editProject.dueDate}
                  onChange={(e) =>
                    setEditProject({ ...editProject, dueDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editProject.status}
                  onChange={(e) =>
                    setEditProject({ ...editProject, status: e.target.value })
                  }
                >
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 gradient-button"
              >
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Project;