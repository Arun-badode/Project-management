import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import Select from 'react-select';
// import { ProjectsData } from '../AdminDashboard';

const ActiveProject = () => {



  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'Admin';

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    country: '',
    projectManager: '',
    tasks: [],
    languages: [],
    application: [],
    files: [{ name: '', pageCount: 0 }],
    totalPages: 0,
    receivedDate: new Date().toISOString().split('T')[0],
    serverPath: '',
    notes: '',
    rate: 0,
    currency: 'USD',
    cost: 0,
    inrCost: 0
  });


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    const due = params.get('due');

    let result = [...projects];

    // Filter for "active" projects
    if (filter === 'active') {
      result = result.filter(project => project.progress < 100); // or use your own status logic
    }

    // Filter for "near due" (due in next 30 minutes)
    if (due === '30min') {
      const now = new Date();
      const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      result = result.filter(project => {
        // Parse your dueDate string to Date
        const match = project.dueDate.match(/(\d{2}):(\d{2}) (AM|PM) (\d{2})-(\d{2})-(\d{2})/);
        if (!match) return false;
        let [_, hour, min, ampm, day, month, year] = match;
        hour = parseInt(hour, 10);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        const dueDateObj = new Date(`20${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${min}`);
        return dueDateObj > now && dueDateObj <= thirtyMinsFromNow;
      });
    }

    setFilteredProjects(result);
  }, [location.search, projects]);

 

  const clientOptions = ['PN','MMP Auburn','MMP Eastlake','MMP Kirkland','GN','DM','RN','NI','LB','SSS','Cpea','CV'];
  const countryOptions = ['United States', 'Canada', 'UK', 'Australia', 'Germany', 'India'];
  const projectManagerOptions = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson', 'David Lee'];
  const taskOptions = ['Source Creation', 'Callout', 'Prep', 'Image Creation', 'DTP', 'Image Localization', 'OVA'];
  const languageOptions = ['af','am','ar','az','be','bg','bn','bs','ca','cs','cy','da','de','el','en','en-US','en-GB','es','es-ES','es-MX','et','eu','fa','fi','fil','fr','fr-FR','fr-CA','ga','gl','gu','ha','he','hi','hr','hu','hy','id','ig','is','it','ja','jv','ka','kk','km','kn','ko','ku','ky','lo','lt','lv','mk','ml','mn','mr','ms','mt','my','ne','nl','no','or','pa','pl','ps','pt','pt-BR','pt-PT','ro','ru','sd','si','sk','sl','so','sq','sr','sr-Cyrl','sr-Latn','sv','sw','ta','te','th','tl','tr','uk','ur','uz','vi','xh','yo','zh','zh-Hans','zh-Hant','zh-TW'];
  const applicationOptions = ['Word', 'PPT', 'Excel', 'INDD','AI','PSD','AE','CDR','Visio','Project','FM'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'];

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  // Filter states
  const [clientFilter, setClientFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ selectedApplications, setSelectedApplications] = useState([]);

   const [activeButton , setActivebutton]  = useState('');

   console.log("Projects", projects);

   console.log("filteredProjects", filteredProjects)

    const handleCardFilter = (type) => {
    let filtered = [];
    const today = new Date();
    const nearDueDate = new Date();
    nearDueDate.setDate(today.getDate() + 3);

    switch (type) {
      case 'all':
        filtered = projects;
        break;
      case 'nearDue':
        filtered = projects.filter(project => {
          if (project.status !== 'Active') return false;
          const dueDate = new Date(project.dueDate);
          const now = new Date();
          const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
          return dueDate > now && dueDate <= thirtyMinsFromNow;
        });
        break;
      case 'overdue':
        filtered = projects.filter(project => {
          const dueDate = new Date(project.dueDate);
          return dueDate < today && project.status !== 'Completed';
        });
        break;

      case 'MSOffice': {
  const msOfficeApps = ['Word', 'PPT', 'Excel', 'Visio', 'Project', 'Canva', 'MS Office'];
  filtered = projects.filter(project =>
    msOfficeApps.includes(project.application) 
  );
  break;
}
case 'Adobe': {
  const adobeApps = ['INDD', 'AI', 'PSD', 'AE', 'CDR', 'FM', 'Adobe'];
  filtered = projects.filter(project =>
    adobeApps.includes(project.application) 
   
  );
  break;
}


      case 'teamOnDuty':
        filtered = projects.filter(p => p.status === 'Team On-Duty');
        break;
      case 'eventsToday':
        const todayStr = today.toISOString().split('T')[0];
        filtered = projects.filter(project => {
          return project.dueDate === todayStr || project.qcDueDate === todayStr;
        });
        break;
      case 'pendingApproval':
        filtered = projects.filter(p => p.qaStatus === 'Pending');
        break;
      default:
        filtered = projects;
    }
    setFilteredProjects(filtered);
    setActivebutton(type);
    // setActiveFilter(type);
  };

 const applicationsOptio = [
  { value: 'Adobe', label: 'Adobe' },
  { value: 'MSOffice', label: 'MS Office' },

];

  const handleShow = () => setShowModal(true);  
  const handleClose = () => setShowModal(false);

  // Batch edit states
  const [batchEditValues, setBatchEditValues] = useState({
    application: '',
    handler: '',
    qaReviewer: '',
    qcDue: '',
    qcAllocatedHours: '',
    priority: ''
  });
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('01');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleHourChange = (e) => {
    setHour(e.target.value);
  };

  const handleMinuteChange = (e) => {
    setMinute(e.target.value);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  // const handleQcDateTimeChange = (field, value) => {
  //   const updatedValues = {
  //     ...batchEditValues,
  //     [field]: value
  //   };

  //   const { qcDate, qcTime } = {
  //     ...updatedValues,
  //     [field]: value
  //   };

  //   if (qcDate && qcTime) {
  //     const formatted = moment(`${qcDate} ${qcTime}`, 'YYYY-MM-DD HH:mm').format('hh:mm A DD-MM-YY');
  //     updatedValues.qcDue = formatted;
  //   }

  //   setBatchEditValues(updatedValues);
  // };

  // Expanded row state
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showEditModal !== false) {
      // Update existing project
      setProjects(projects.map(project =>
        project.id === showEditModal ? {
          ...project,
          ...formData,
          status: project.status,
          id: project.id
        } : project
      ));
      setShowEditModal(false);
    } else {
      // Create new project
      const newProject = {
        ...formData,
        id: projects.length + 1,
        status: 'created',
        receivedDate: formData.receivedDate || new Date().toISOString().split('T')[0]
      };
      setProjects([...projects, newProject]);
      setShowCreateModal(false);
    }
    // Reset form
    setFormData({
      title: '',
      client: '',
      country: '',
      projectManager: '',
      tasks: [],
      languages: [],
      application: [],
      files: [{ name: '', pageCount: 0 }],
      totalPages: 0,
      receivedDate: new Date().toISOString().split('T')[0],
      serverPath: '',
      notes: '',
      rate: 0,
      currency: 'USD',
      cost: 0,
      inrCost: 0
    });
  };

  const scrollContainerRef = useRef(null);
  const fakeScrollbarRef = useRef(null);

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


  const tabScrollContainerRef = useRef(null);
  const tabFakeScrollbarRef = useRef(null);
  const tabFakeScrollbarInnerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = tabScrollContainerRef.current;
    const fakeScrollbar = tabFakeScrollbarRef.current;
    const fakeScrollbarInner = tabFakeScrollbarInnerRef.current;

    if (scrollContainer && fakeScrollbar && fakeScrollbarInner) {
      const updateScrollbar = () => {
        const needsHorizontalScroll =
          scrollContainer.scrollWidth > scrollContainer.clientWidth;

        fakeScrollbar.style.display = needsHorizontalScroll ? "block" : "none";
        fakeScrollbarInner.style.width = `${scrollContainer.scrollWidth}px`;
      };

      const syncScroll = () => {
        fakeScrollbar.scrollLeft = scrollContainer.scrollLeft;
      };
      const syncFakeScroll = () => {
        scrollContainer.scrollLeft = fakeScrollbar.scrollLeft;
      };

      scrollContainer.addEventListener("scroll", syncScroll);
      fakeScrollbar.addEventListener("scroll", syncFakeScroll);
      window.addEventListener("resize", updateScrollbar);

      // Delay to handle tabs rendering
      setTimeout(updateScrollbar, 100);

      return () => {
        scrollContainer.removeEventListener("scroll", syncScroll);
        fakeScrollbar.removeEventListener("scroll", syncFakeScroll);
        window.removeEventListener("resize", updateScrollbar);
      };
    }
  }, [selectedProject]); // rerun when project changes
    
  // const staticProjects = ProjectsData;

  const statuses =  [ 

    {
      key: "allstatus",
      label: "All Status "
    },
    {
      key: "yts",
      label: "YTS"
    },
    {
      key: "wip",
      label: "WIP"
    },
    {
      key: "readyforqc",
      label: "Ready for QC"
    },
    {
      key: "qareview",
      label: "QA Review"
    },
    {
      key: "corryts",
      label: "Corr YTS"
    },
    {
      key: "corrwip,",
      label: "Corr WIP"
      },
        {
      key: "rfd,",
      label: "RFD"
      },


  ]

  // Generate dummy data
  useEffect(() => {
    // const dummyProjects = generateDummyProjects(15);
    setProjects(generateDummyProjects(15));
    setFilteredProjects(generateDummyProjects(15));
    // setFilteredProjects(staticProjects);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...projects];

    // Apply tab filter
    if (activeTab === 'unhandled') {
      result = result.filter(project => !project.handler || project.handler === '');
    }

    // Apply dropdown filters
    if (clientFilter) {
      result = result.filter(project => project.client === clientFilter);
    }
    if (taskFilter) {
      result = result.filter(project => project.task === taskFilter);
    }
    if (languageFilter) {
      result = result.filter(project => project.language === languageFilter);
    }

    // Sort by due date
    result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    setFilteredProjects(result);
  }, [projects, activeTab, clientFilter, taskFilter, languageFilter]);

  // Handle project deletion
  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  // Handle marking project as complete
  const handleMarkComplete = (id) => {
    if (window.confirm('Are you sure you want to mark this project as complete?')) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  // Open project detail modal
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setSelectedFiles([]);
    setShowDetailModal(false); // Don't show modal
    setHasUnsavedChanges(false);
    setBatchEditValues({
      application: '',
      handler: '',
      qaReviewer: '',
      qcDue: '',
      qcAllocatedHours: '',
      priority: ''
    });
    // Toggle expanded row
    setExpandedRow(expandedRow === project.id ? null : project.id);
  };

  // Toggle file selection for batch editing
  const toggleFileSelection = (file) => {
    if (selectedFiles.some(f => f.id === file.id)) {
      setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
    setHasUnsavedChanges(true);
  };

  // Apply batch edits to selected files
  const applyBatchEdits = () => {
    if (selectedProject && selectedFiles.length > 0) {
      const updatedFiles = selectedProject.files.map(file => {
        if (selectedFiles.some(f => f.id === file.id)) {
          return {
            ...file,
            application: batchEditValues.application || file.application,
            handler: batchEditValues.handler || file.handler,
            qaReviewer: batchEditValues.qaReviewer || file.qaReviewer,
            qcDue: batchEditValues.qcDue || file.qcDue,
            qcAllocatedHours: batchEditValues.qcAllocatedHours || file.qcAllocatedHours,
            priority: batchEditValues.priority || file.priority
          };
        }
        return file;
      });

      const updatedProject = {
        ...selectedProject,
        files: updatedFiles
      };

      setSelectedProject(updatedProject);
      // Update the project in the main projects array
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      // Reset batch edit values
      setBatchEditValues({
        application: '',
        handler: '',
        qaReviewer: '',
        qcDue: '',
        qcAllocatedHours: '',
        priority: ''
      });
      setSelectedFiles([]);
      setHasUnsavedChanges(false);
    }
  };

  // Close modal with confirmation if there are unsaved changes
  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        setShowDetailModal(false);
      }
    } else {
      setShowDetailModal(false);
    }
  };

  // Get unique values for filters
  const getUniqueValues = (key) => {
    return Array.from(new Set(projects.map(project => project[key])));
  };

  const applicationOptio = getUniqueValues('application').map((app) => ({
  value: app,
  label: app
}));


  const handleEditProject = (project) => {
    setEditedProject({ ...project });
    setShowEditModal(true);
  };

  const handleSaveProjectEdit = () => {
    if (editedProject) {
      setProjects(projects.map(p => p.id === editedProject.id ? editedProject : p));
      setShowEditModal(false);
      setEditedProject(null);
    }
  };


    const gradientSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      background: 'linear-gradient(to bottom right, #141c3a, #1b2f6e)',
      color: 'white',
      borderColor: state.isFocused ? '#ffffff66' : '#ffffff33',
      boxShadow: state.isFocused ? '0 0 0 1px #ffffff66' : 'none',
      minHeight: '38px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#1b2f6e',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'white',
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#293d80' : 'linear-gradient(to bottom right, #141c3a, #1b2f6e)',
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      background: 'linear-gradient(to bottom right, #141c3a, #1b2f6e)',
      color: 'white',
    }),
  };
  return (
    <div className="container-fluid py-4">
      {/* Edit Project Modal */}
      {showEditModal && editedProject && (
        <div className="modal fade show custom-modal-dark" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">Project Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editedProject.title}
                      onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Client</label>
                    <select
                      className="form-select"
                      value={editedProject.client}
                      onChange={(e) => setEditedProject({ ...editedProject, client: e.target.value })}
                    >
                      {getUniqueValues('client').map((client, index) => (
                        <option key={index} value={client}>{client}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Task</label>
                    <select
                      className="form-select"
                      value={editedProject.task}
                      onChange={(e) => setEditedProject({ ...editedProject, task: e.target.value })}
                    >
                      {getUniqueValues('task').map((task, index) => (
                        <option key={index} value={task}>{task}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={editedProject.language}
                      onChange={(e) => setEditedProject({ ...editedProject, language: e.target.value })}
                    >
                      {getUniqueValues('language').map((language, index) => (
                        <option key={index} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Application</label>
                    <select
                      className="form-select"
                      value={editedProject.application}
                      onChange={(e) => setEditedProject({ ...editedProject, application: e.target.value })}
                    >
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Desktop">Desktop</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Due Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={customToInputDate(editedProject.dueDate)}
                      onChange={(e) => {
                        setEditedProject({
                          ...editedProject,
                          dueDate: inputToCustomDate(e.target.value)
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
 {/* Old */}
     

 {(showCreateModal || showEditModal !== false) && (
  <div className="modal fade show d-block custom-modal-dark" tabIndex="-1" aria-modal="true" role="dialog">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {showEditModal !== false ? 'Edit Project Details' : 'Create New Project'}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
            }}
          ></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Project Title */}
            <div className=" row mb-3 col-md-12">
              <label htmlFor="title" className="form-label">
                Project Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                maxLength={80}
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title (max 80 chars)"
              />
              <div className="form-text">
                Max allowed Character length – 80, (ignore or remove any special character by itself)
              </div>
            </div>

            {/* Client, Country, Project Manager */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label htmlFor="client" className="form-label">Client <span className="text-danger">*</span></label>
                <Select
                  id="client"
                  name="client"
                  options={clientOptions.map(c => ({ value: c, label: c }))}
                  value={formData.client ? { value: formData.client, label: formData.client } : null}
                  onChange={opt => setFormData(prev => ({ ...prev, client: opt ? opt.value : '' }))}
                  isSearchable
                  placeholder="Select Client"
                   styles={gradientSelectStyles}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Auto update with Client"
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="projectManager" className="form-label">Project Manager</label>
                <Select
                  id="projectManager"
                  name="projectManager"
                  options={projectManagerOptions.map(pm => ({ value: pm, label: pm }))}
                  value={formData.projectManager ? { value: formData.projectManager, label: formData.projectManager } : null}
                  onChange={opt => setFormData(prev => ({ ...prev, projectManager: opt ? opt.value : '' }))}
                  isSearchable
                  placeholder="Refined Searchable Dropdown"
                   styles={gradientSelectStyles}
                />
              </div>
            </div>

            {/* Task & Applications */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="task" className="form-label">Task <span className="text-danger">*</span></label>
                <Select 
                  id="task"
                  name="task"
                  options={taskOptions.map(t => ({ value: t, label: t }))}
                  value={formData.tasks.length ? formData.tasks.map(t => ({ value: t, label: t })) : []}
                  onChange={opts => setFormData(prev => ({ ...prev, tasks: opts ? opts.map(o => o.value) : [] }))}
                  isMulti
                  isSearchable
                  placeholder="Select Task(s)"
                   styles={gradientSelectStyles}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="application" className="form-label">Applications <span className="text-danger">*</span></label>
                <Select
                  id="application"
                  name="application"
                  options={applicationOptions.map(a => ({ value: a, label: a }))}
                  value={formData.application.length ? formData.application.map(a => ({ value: a, label: a })) : []}
                  onChange={opts => setFormData(prev => ({ ...prev, application: opts ? opts.map(o => o.value) : [] }))}
                  isMulti
                  isSearchable
                  placeholder="Select Application(s)"
                   styles={gradientSelectStyles}
                />
              </div>
            </div>

            {/* Languages */}
            <div className="mb-3">
              <label className="form-label">Languages <span className="text-danger">*</span></label>
              <Select
                options={languageOptions.map(l => ({ value: l, label: l }))}
                value={formData.languages.length ? formData.languages.map(l => ({ value: l, label: l })) : []}
                onChange={opts => setFormData(prev => ({ ...prev, languages: opts ? opts.map(o => o.value) : [] }))}
                isMulti
                isSearchable
                placeholder="Select Languages"
                 styles={gradientSelectStyles}
              />
              <div className="form-text">{formData.languages.length} selected</div>
            </div>

            {/* File Details */}
            <div className="mb-3">
              <label className="form-label">File Details*:</label>
              <div className="d-flex align-items-center gap-2 mb-2 bg-[#201E7E]">
                <span>Count</span>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  style={{ width: 80 }}
                  value={formData.files.length}
                  onChange={e => {
                    const count = Math.max(1, Number(e.target.value));
                    setFormData(prev => ({
                      ...prev,
                      files: Array.from({ length: count }, (_, i) => prev.files[i] || { name: '', pageCount: 0, application: '' })
                    }));
                  }}
                />
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => {/* handle excel upload */}}
                >
                  Upload Excel
                </button>
              </div>
              <div className="table-responsive " >
                <table className="table table-bordered  ">
                  <thead  style={{backgroundColor: '#201E7E', color: 'white'}}>
                    <tr style={{backgroundColor: '#201E7E', color: 'white'}}>
                      <th>S.No.</th>
                      <th>File Name</th>
                      <th>Pages</th>
                      <th>Application</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.files.map((file, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={file.name}
                            onChange={e => {
                              const files = [...formData.files];
                              files[idx].name = e.target.value;
                              setFormData(prev => ({ ...prev, files }));
                            }}
                            placeholder="File Name"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={1}
                            className="form-control"
                            value={file.pageCount || ''}
                            onChange={e => {
                              const files = [...formData.files];
                              files[idx].pageCount = Number(e.target.value);
                              setFormData(prev => ({ ...prev, files }));
                            }}
                            placeholder="Pages"
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={file.application || ''}
                            onChange={e => {
                              const files = [...formData.files];
                              files[idx].application = e.target.value;
                              setFormData(prev => ({ ...prev, files }));
                            }}
                          >
                            <option value="">Select</option>
                            {applicationOptions.map(app => (
                              <option key={app} value={app}>{app}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Pages */}
            <div className="mb-3">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Total Pages Per Lang</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.files.reduce((sum, file) => sum + (file.pageCount || 0), 0)}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Total Project Pages</label>
                  <input
                    type="number"
                    className="form-control"
                    value={
                      formData.files.reduce((sum, file) => sum + (file.pageCount || 0), 0) *
                      (formData.languages.length || 1)
                    }
                    readOnly
                  />
                </div>
              </div>
              <div className="form-text">
                Total Project Pages = Total Pages × Language Count
              </div>
            </div>

            {/* Received Date, Server Path, Notes */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Received Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  name="receivedDate"
                  value={formData.receivedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-8">
                <label className="form-label">Server Path <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="serverPath"
                  value={formData.serverPath}
                  onChange={handleInputChange}
                  required
                  placeholder="/projects/client/project-name"
                />
              </div>
              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes or instructions..."
                />
              </div>
            </div>

            {/* Financial Section */}
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label">Estimated Hrs</label>
                <input
                  type="number"
                  className="form-control"
                  step="0.25"
                  value={formData.estimatedHrs || ''}
                  onChange={e => setFormData(prev => ({ ...prev, estimatedHrs: e.target.value }))}
                  placeholder="00.00"
                />
                <div className="form-text">(in multiple of 0.25 only)</div>
              </div>
              <div className="col-md-3">
                <label className="form-label">Per page Page Rate</label>
                <input
                  type="number"
                  className="form-control"
                  step="0.01"
                  value={formData.rate || ''}
                  onChange={e => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                  placeholder="00.00"
                />
                <div className="form-text">(with only 2 decimals)</div>
              </div>
              <div className="col-md-2">
                <label className="form-label">Currency</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.currency}
                  readOnly
                  placeholder="Auto updated from Client details"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Total Cost</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.cost.toFixed(2)}
                  readOnly
                  placeholder="Auto Calculated"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Cost in INR</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.inrCost.toFixed(2)}
                  readOnly
                  placeholder="Auto Calculated"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="text-end">
              <button type="submit" className="btn btn-warning fw-bold">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Header with action buttons */}
      <div className="row mb-4">


        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <h2 className="gradient-heading">Active Projects</h2>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <Button className="gradient-button"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus me-2"></i> Create New Project
            </Button>
          </div>
        </div>
        {/* <div className="col-md-6 text-md-end">
          <div className="d-flex flex-wrap justify-content-md-end gap-2">
            <button className="btn btn-dark">
              <i className="fas fa-file-excel me-2"></i>Download Excel
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-file-import me-2"></i>Import Excel
            </button>
            <button className="btn btn-success">
              <i className="fas fa-download me-2"></i>Download Excel
            </button>
          </div>
        </div> */}
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className='col-md-6'>
        <div className='d-flex  gap-2'>
             <button 
              className="btn btn-light" onClick={() => handleCardFilter('all')} >
                All
             </button>

              <button 
              className="btn btn-light" onClick={() => handleCardFilter('nearDue')} >
                Near Due
             </button>

                <button 
              className="btn btn-light"  onClick={() => handleCardFilter('overDue')}  >
                Over  Due
             </button>


               <button 
              className="btn btn-light" onClick={() => handleCardFilter('Adobe')} >
                Adobe
             </button>

              <button 
              className="btn btn-light" onClick={() => handleCardFilter('MSOffice')} >
               MS Office
             </button>

          </div>
          

        </div>
        <div className="col-md-6
         d-flex gap-2">
        <div className=" ">
          <select
            className="form-select"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="">All Clients</option>
            {getUniqueValues('client').map((client, index) => (
              <option key={index} value={client}>{client}</option>
            ))}
          </select>
        </div>
        <div className="">
          <select
            className="form-select"
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
          >
            <option value="">All Tasks</option>
            {getUniqueValues('task').map((task, index) => (
              <option key={index} value={task}>{task}</option>
            ))}
          </select>
        </div>
        <div className="  ">
          <select
            className="form-select"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            {
              statuses.map((status, index) => (
                <option key={index} value={status.key}>{status.label}</option>
              ))
            }




            {/* {getUniqueValues('language').map((language, index) => (
              <option key={index} value={language}>{language}</option>
            ))} */}
          </select>
        </div>
      
        
         <div className="">
   
    <Select
   
      options={applicationsOptio}
      isMulti
      className="basic-multi-select"
      classNamePrefix="select"
      value={selectedApplications}
      placeholder="Select"
      onChange={(selected) => setSelectedApplications(selected)}
    />
    {/* <div className="mt-1 text-muted small">
      Selected: {selectedApplications.map((app) => app.label).join(', ')}
    </div> */}
  </div>

        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item ">
          <button
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Active Projects
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'unhandled' ? 'active' : ''}`}
            onClick={() => setActiveTab('unhandled')}
          >
            Unhandled Projects
          </button>
        </li>
      </ul>

      {/* Projects Table */}
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
          display: "none", // start hidden
        }}
      >
        <div style={{ width: "2000px", height: 1 }} />
      </div>

      {/* 🔻 Scrollable Table Container */}
      <div
        className="table-responsive"
        ref={scrollContainerRef}
        style={{ maxHeight: "500px", overflowY: "auto", overflowX: "auto" }}
      >
        <table className="table-gradient-bg align-middle mt-0 table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>S. No.</th>
              <th>Project Title</th>
              <th>Client</th>
              <th>Task</th>
              <th>Language</th>
              <th>Application</th>
              <th>Total Pages</th>
              <th>Due Date & Time</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <React.Fragment key={project.id}>
                <tr className={expandedRow === project.id ? "table-active" : ""}>
                  <td>{index + 1}</td>
                  <td>{project.title}</td>
                  <td>{project.client}</td>
                  <td>{project.task}</td>
                  <td>{project.language}</td>
                  <td>{project.application}</td>
                  <td>{project.totalPages}</td>
                  <td>{project.dueDate}</td>
                  <td>
                    <div
                      className="progress cursor-pointer"
                      style={{ height: "24px" }}
                      onClick={() => handleViewProject(project)}
                    >
                      <div
                        className={`progress-bar 
                          ${project.progress < 30
                            ? "bg-danger"
                            : project.progress < 70
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        role="progressbar"
                        style={{ width: `${project.progress}%` }}
                        aria-valuenow={project.progress}
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
                        onClick={() => handleViewProject(project)}
                      >
                        <i
                          className={`fas ${expandedRow === project.id
                            ? "fa-chevron-up"
                            : "fa-eye"
                            }`}
                        ></i>
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEditProject(project)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {project.progress === 100 && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleMarkComplete(project.id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedRow === project.id && (
                  <tr>
                    <td colSpan={10} className="p-0 border-top-0">
                      <div className="p-4">
                        {/* Header */}
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Project Files</h5>
                            {selectedFiles.length > 0 && (
                              <span className="badge bg-primary">
                                {selectedFiles.length} files selected
                              </span>
                            )}
                          </div>

                          {/* Batch Edit */}
                          {selectedFiles.length > 0 && (
                            <div className="card mb-4">
                              <div className="card-body bg-card">
                                <h6 className="card-title mb-3">Batch Edit</h6>
                                <div className="row g-3">
                                  {/* application */}
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">Application</label>
                                    <select
                                      className="form-select form-select-sm"
                                      value={batchEditValues.application}
                                      onChange={(e) =>
                                        setBatchEditValues({
                                          ...batchEditValues,
                                          application: e.target.value,
                                        })
                                      }
                                    >
                                      <option value="">Select</option>
                                      <option value="Web">Web</option>
                                      <option value="Mobile">Mobile</option>
                                      <option value="Desktop">Desktop</option>
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
                                    </select>
                                  </div>
                                  {/* QA Reviewer */}
                                  {/* <div className="col-md-4 col-lg-2">
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
                                  <div className="col-md-4 col-lg-2">
                                    <label className="form-label">QC Due</label>
                                    <input
                                      type="date"
                                      className="form-control form-control-sm"
                                      value={batchEditValues.qcDue}
                                      onChange={(e) =>
                                        setBatchEditValues({
                                          ...batchEditValues,
                                          qcDue: e.target.value,
                                        })
                                      }
                                    />
                                  </div> */}
                                  <div className="col-md-5 col-lg-5 mb-3">
                                    <label className="form-label">QC Due</label>
                                    <div className="row gx-2 gy-2 align-items-center">
                                      {/* Date Picker */}
                                      <div className="col-12 col-sm-6 col-md-5">
                                        <input
                                          type="date"
                                          className="form-control"
                                          value={date}
                                          onChange={handleDateChange}
                                        />
                                      </div>

                                      {/* Hour Selector */}
                                      <div className="col-4 col-sm-2 col-md-2">
                                        <select
                                          className="form-select"
                                          value={hour}
                                          onChange={handleHourChange}
                                        >
                                          {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i} value={String(i + 1).padStart(2, '0')}>
                                              {String(i + 1).padStart(2, '0')}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Minute Selector */}
                                      <div className="col-4 col-sm-2 col-md-2">
                                        <select
                                          className="form-select"
                                          value={minute}
                                          onChange={handleMinuteChange}
                                        >
                                          {['00', '15', '30', '45'].map((min) => (
                                            <option key={min} value={min}>
                                              {min}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* AM/PM Selector */}
                                      <div className="col-4 col-sm-2 col-md-2">
                                        <select
                                          className="form-select"
                                          value={period}
                                          onChange={handlePeriodChange}
                                        >
                                          <option value="AM">AM</option>
                                          <option value="PM">PM</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>



                                  {/* QC Hours */}
                                  {/* <div className="col-md-4 col-lg-2">
                                    <label className="form-label">QC Hours</label>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={batchEditValues.qcAllocatedHours}
                                      onChange={(e) =>
                                        setBatchEditValues({
                                          ...batchEditValues,
                                          qcAllocatedHours: e.target.value,
                                        })
                                      }
                                    />
                                  </div> */}
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
                              <thead className="table-light">
                                <tr>
                                  <th>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      checked={
                                        selectedFiles.length === project?.files?.length
                                      }
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
                                {project.files.map((file) => (
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
                                        checked={selectedFiles.some(
                                          (f) => f.id === file.id
                                        )}
                                        onChange={() => toggleFileSelection(file)}
                                      />
                                    </td>
                                    <td>{file.name}</td>
                                    <td>{file.pages}</td>
                                    <td>{file.language}</td>
                                    <td>
                                      <select
                                        className="form-select form-select-sm"
                                        value={file.application}
                                        onChange={(e) => {
                                          const updatedFiles = project.files.map((f) =>
                                            f.id === file.id
                                              ? { ...f, application: e.target.value }
                                              : f
                                          );
                                          setSelectedProject({
                                            ...project,
                                            files: updatedFiles,
                                          });
                                          setHasUnsavedChanges(true);
                                        }}
                                      >
                                        <option value="Web">Web</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Desktop">Desktop</option>
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
                                          setSelectedProject({
                                            ...project,
                                            files: updatedFiles,
                                          });
                                          setHasUnsavedChanges(true);
                                        }}
                                      >
                                        <option value="">Not Assigned</option>
                                        <option value="John Doe">John Doe</option>
                                        <option value="Jane Smith">Jane Smith</option>
                                        <option value="Mike Johnson">Mike Johnson</option>
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
                                          setSelectedProject({
                                            ...project,
                                            files: updatedFiles,
                                          });
                                          setHasUnsavedChanges(true);
                                        }}
                                      >
                                        <option value="">Not Assigned</option>
                                        <option value="Sarah Williams">
                                          Sarah Williams
                                        </option>
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

                        {/* Footer buttons */}
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 bg-card px-3 py-2 rounded-3 border">
                          <div className="text-center border border-dark rounded bg-card px-3 py-2">
                            <div className="fw-semibold bg-info border-bottom small py-1">
                              Ready for QC Due
                            </div>
                            <div className="fw-semibold text-light">
                              hh:mm:tt &nbsp; DD-MM-YY
                            </div>
                            <div className="text-success small fw-semibold">
                              Early (20 minutes)
                            </div>
                          </div>

                          <div className="text-center bg-card px-2">
                            <div className="fw-bold">QC Allocated hours</div>
                            <div>h.mm</div>
                            <button
                              className="btn btn-sm text-white fw-bold px-3 py-1 mt-1"
                              style={{ backgroundColor: "#006400" }}
                            >
                              OK
                            </button>
                          </div>

                          <div className="text-center border border-dark rounded bg-card px-3 py-2">
                            <div className="fw-semibold bg-info border-bottom small py-1">
                              QC Due
                            </div>
                            <div className="fw-semibold text-light">
                              hh:mm:tt &nbsp; DD-MM-YY{" "}
                              <span className="text-warning">(Auto)</span>
                            </div>
                            <div className="text-danger small fw-semibold">
                              Delay by 30 minutes
                            </div>
                          </div>

                          <button className="btn btn-outline-success fw-semibold px-3 py-1">
                            Priority
                          </button>

                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-secondary rounded-5 px-4"
                            >
                              Close
                            </button>
                            {hasUnsavedChanges && (
                              <button
                                type="button"
                                className="btn btn-primary rounded-5 px-4"
                              >
                                Save Changes
                              </button>
                            )}
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

      {/* Project Detail Modal - Keeping this for potential future use */}
      {showDetailModal && selectedProject && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProject.title} - Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Project Files</h5>
                    {selectedFiles.length > 0 && (
                      <span className="badge bg-primary">
                        {selectedFiles.length} files selected
                      </span>
                    )}
                  </div>

                  {/* Batch Edit Controls */}
                  {selectedFiles.length > 0 && (
                    <div className="card mb-4">
                      <div className="card-body">
                        <h6 className="card-title mb-3">Batch Edit</h6>
                        <div className="row g-3">
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">Application</label>
                            <select
                              className="form-select form-select-sm"
                              value={batchEditValues.application}
                              onChange={(e) => setBatchEditValues({ ...batchEditValues, application: e.target.value })}
                            >
                              <option value="">Select</option>
                              <option value="Web">Web</option>
                              <option value="Mobile">Mobile</option>
                              <option value="Desktop">Desktop</option>
                            </select>
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">Handler</label>
                            <select
                              className="form-select form-select-sm"
                              value={batchEditValues.handler}
                              onChange={(e) => setBatchEditValues({ ...batchEditValues, handler: e.target.value })}
                            >
                              <option value="">Select</option>
                              <option value="John Doe">John Doe</option>
                              <option value="Jane Smith">Jane Smith</option>
                              <option value="Mike Johnson">Mike Johnson</option>
                            </select>
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">QA Reviewer</label>
                            <select
                              className="form-select form-select-sm"
                              value={batchEditValues.qaReviewer}
                              onChange={(e) => setBatchEditValues({ ...batchEditValues, qaReviewer: e.target.value })}
                            >
                              <option value="">Select</option>
                              <option value="Sarah Williams">Sarah Williams</option>
                              <option value="David Brown">David Brown</option>
                              <option value="Emily Davis">Emily Davis</option>
                            </select>
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">QC Due</label>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              value={batchEditValues.qcDue}
                              onChange={(e) => setBatchEditValues({ ...batchEditValues, qcDue: e.target.value })}
                            />
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">QC Hours</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={batchEditValues.qcAllocatedHours}
                              onChange={(e) => setBatchEditValues({ ...batchEditValues, qcAllocatedHours: e.target.value })}
                            />
                          </div>
                          <div className="col-md-4 col-lg-2">
                            <label className="form-label">Priority</label>
                            <select
                              className="form-select form-select-sm"
                              value={batchEditValues.priority}
                              onChange={(e) => setBatchEditValues({ ...batchEditValues, priority: e.target.value })}
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
                            className="btn btn-sm btn-primary"
                            onClick={applyBatchEdits}
                          >
                            Apply to Selected Files
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Files Table */}
                  {/* Fake Scrollbar */}
                  <div
                    ref={tabFakeScrollbarRef}
                    style={{
                      overflowX: "auto",
                      overflowY: "hidden",
                      height: 16,
                      position: "sticky",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 1050,
                      display: "none",
                      background: "#f8f9fa",
                    }}
                  >
                    <div ref={tabFakeScrollbarInnerRef} style={{ height: 1 }} />
                  </div>

                  {/* Actual Table */}
                  <div
                    ref={tabScrollContainerRef}
                    className="table-responsive"
                    style={{ maxHeight: "500px", overflowY: "auto", overflowX: "auto" }}
                  >
                    <table className="table table-sm table-striped table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedFiles.length === selectedProject.files.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFiles([...selectedProject.files]);
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
                        {selectedProject.files.map((file) => (
                          <tr
                            key={file.id}
                            className={
                              selectedFiles.some((f) => f.id === file.id) ? "table-primary" : ""
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
                                value={file.application}
                                onChange={(e) => {
                                  const updatedFiles = selectedProject.files.map((f) =>
                                    f.id === file.id ? { ...f, application: e.target.value } : f
                                  );
                                  setSelectedProject({ ...selectedProject, files: updatedFiles });
                                  setHasUnsavedChanges(true);
                                }}
                              >
                                <option value="Web">Web</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Desktop">Desktop</option>
                              </select>
                            </td>
                            <td>{file.stage}</td>
                            <td>{file.assigned}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={file.handler || ""}
                                onChange={(e) => {
                                  const updatedFiles = selectedProject.files.map((f) =>
                                    f.id === file.id ? { ...f, handler: e.target.value } : f
                                  );
                                  setSelectedProject({ ...selectedProject, files: updatedFiles });
                                  setHasUnsavedChanges(true);
                                }}
                              >
                                <option value="">Not Assigned</option>
                                <option value="John Doe">John Doe</option>
                                <option value="Jane Smith">Jane Smith</option>
                                <option value="Mike Johnson">Mike Johnson</option>
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={file.qaReviewer || ""}
                                onChange={(e) => {
                                  const updatedFiles = selectedProject.files.map((f) =>
                                    f.id === file.id ? { ...f, qaReviewer: e.target.value } : f
                                  );
                                  setSelectedProject({ ...selectedProject, files: updatedFiles });
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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"

                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Converts "hh:mm AM/PM DD-MM-YY" to "YYYY-MM-DDTHH:mm"
function customToInputDate(str) {
  // Example input: "01:23 PM 25-06-25"
  if (!str) return '';
  const match = str.match(/(\d{2}):(\d{2}) (AM|PM) (\d{2})-(\d{2})-(\d{2})/);
  if (!match) return '';
  let [_, hour, min, ampm, day, month, year] = match;
  hour = parseInt(hour, 10);
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  // Pad hour
  hour = hour.toString().padStart(2, '0');
  // Compose ISO string
  return `20${year}-${month}-${day}T${hour}:${min}`;
}

// Converts "YYYY-MM-DDTHH:mm" to "hh:mm AM/PM DD-MM-YY"
function inputToCustomDate(str) {
  // Example input: "2025-06-25T13:23"
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d)) return '';
  let hour = d.getHours();
  const min = d.getMinutes().toString().padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(2);
  return `${hour.toString().padStart(2, '0')}:${min} ${ampm} ${day}-${month}-${year}`;
}


;

// Generate dummy  datafunction
const generateDummyProjects = (count) => {
  const clients = ['PN','MMP Auburn','MMP Eastlake','MMP Kirkland','GN','DM','RN','NI','LB','SSS','Cpea','CV'];
  const tasks = ['Source Creation', 'Callout', 'Prep', 'Image Creation', 'DTP','Image Localization','OVA'
  ];
  const languages = ['af','am','ar','az','be','bg','bn','bs','ca','cs','cy','da','de','el','en','en-US','en-GB','es','es-ES','es-MX','et','eu','fa','fi','fil','fr','fr-FR','fr-CA','ga','gl','gu','ha','he','hi','hr','hu','hy','id','ig','is','it','ja','jv','ka','kk','km','kn','ko','ku','ky','lo','lt','lv','mk','ml','mn','mr','ms','mt','my','ne','nl','no','or','pa','pl','ps','pt','pt-BR','pt-PT','ro','ru','sd','si','sk','sl','so','sq','sr','sr-Cyrl','sr-Latn','sv','sw','ta','te','th','tl','tr','uk','ur','uz','vi','xh','yo','zh','zh-Hans','zh-Hant','zh-TW'];
  const applications =  ['Word', 'PPT', 'Excel', 'INDD','AI','PSD','AE','CDR','Visio','Project','FM'];
  const stages = ['In Progress', 'Review', 'Completed', 'On Hold'];
  const qaStatuses = ['Pending', 'In Progress', 'Approved', 'Rejected'];
  const handlers = ['John Doe', 'Jane Smith', 'Mike Johnson', ''];
  const qaReviewers = ['Sarah Williams', 'David Brown', 'Emily Davis', ''];

  const projects = [];

  for (let i = 1; i <= count; i++) {
    const totalPages = Math.floor(Math.random() * 100) + 10;
    const progress = Math.floor(Math.random() * 101);
    const handler = handlers[Math.floor(Math.random() * handlers.length)];

    // Generate random due date (between now and 30 days in the future)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    dueDate.setHours(hours, minutes);

    // Format due date as "hh:mm tt DD-MM-YY"
    const formattedDueDate = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'} ${dueDate.getDate().toString().padStart(2, '0')}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getFullYear().toString().slice(2)}`;

    // Generate files
    const fileCount = Math.floor(Math.random() * 5) + 1;
    const files = [];

    for (let j = 1; j <= fileCount; j++) {
      const filePages = Math.floor(Math.random() * 20) + 1;
      files.push({
        id: j,
        name: `File_${i}_${j}.docx`,
        pages: filePages,
        language: languages[Math.floor(Math.random() * languages.length)],
        application: applications[Math.floor(Math.random() * applications.length)],
        stage: stages[Math.floor(Math.random() * stages.length)],
        assigned: new Date(dueDate.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
        handler: handler,
        qaReviewer: qaReviewers[Math.floor(Math.random() * qaReviewers.length)],
        qaStatus: qaStatuses[Math.floor(Math.random() * qaStatuses.length)],
        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
      });
    }

    projects.push({
      id: i,
      title: `Project ${i}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      task: tasks[Math.floor(Math.random() * tasks.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      application: applications[Math.floor(Math.random() * applications.length)],
      totalPages,
      dueDate: formattedDueDate,
      progress,
      handler,
      files
    });
  }

  return projects;
};

export default ActiveProject;