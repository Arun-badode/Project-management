import React, { useState } from 'react';
import { Search, Upload, HelpCircle, FileText, MessageSquare, Users, Settings, BarChart3, CheckSquare, Shield, Play, Code, Book } from 'lucide-react';
// import "./ProjectSupport.css"

const ProjectSupport = () => {
  const [activeTab, setActiveTab] = useState('raise-ticket');
  const [ticketForm, setTicketForm] = useState({
    title: '',
    category: '',
    priority: '',
    description: '',
    project: '',
    assignedMember: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAlert, setShowAlert] = useState({ show: false, type: '', message: '' });
  const [expandedFaq, setExpandedFaq] = useState({});

  const categories = [
    'Bug Report',
    'Feature Request',
    'Technical Support',
    'Account Issues',
    'General Inquiry'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'];
  const members = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];

  const faqData = {
    'Getting Started': [
      { q: 'How do I create my first project?', a: 'Navigate to the Dashboard and click on "New Project". Fill in the required details and click Create.' },
      { q: 'How do I invite team members?', a: 'Go to Project Settings > Team Members > Invite. Enter email addresses and set permissions.' },
      { q: 'What are the system requirements?', a: 'Modern web browser (Chrome, Firefox, Safari, Edge), stable internet connection, and JavaScript enabled.' },
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and follow the email instructions.' }
    ],
    'Project Management': [
      { q: 'How do I create tasks?', a: 'In your project dashboard, click "Add Task", fill in details, assign members, and set due dates.' },
      { q: 'How do I track project progress?', a: 'Use the Progress tab to view completion percentages, milestones, and team performance metrics.' },
      { q: 'Can I set project templates?', a: 'Yes, go to Settings > Templates to create reusable project structures.' },
      { q: 'How do I generate reports?', a: 'Navigate to Reports section, select your criteria, and export in PDF or Excel format.' }
    ],
    'Account & Billing': [
      { q: 'How do I upgrade my plan?', a: 'Go to Account Settings > Billing > Upgrade Plan. Choose your desired plan and payment method.' },
      { q: 'How do I cancel my subscription?', a: 'Visit Account Settings > Billing > Cancel Subscription. Your access continues until the billing period ends.' },
      { q: 'Can I get a refund?', a: 'Refunds are available within 30 days of purchase. Contact support for assistance.' },
      { q: 'How do I update payment information?', a: 'Go to Account Settings > Billing > Payment Methods to add or update cards.' }
    ],
    'Troubleshooting': [
      { q: 'Why is the page loading slowly?', a: 'Clear your browser cache, check internet connection, or try a different browser.' },
      { q: 'I cannot upload files', a: 'Ensure file size is under 10MB and format is supported (PDF, DOC, JPG, PNG).' },
      { q: 'Notifications are not working', a: 'Check browser notification permissions and email notification settings in your profile.' },
      { q: 'How do I report a bug?', a: 'Use the "Raise Ticket" tab above to report bugs with detailed steps to reproduce.' }
    ]
  };

  const userGuideContent = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      icon: <BarChart3 className="me-2" size={16} />,
      content: `
        <h4>Dashboard Overview</h4>
        <p>The dashboard is your central hub for managing projects and tracking progress. Here you'll find:</p>
        <ul>
          <li><strong>Project Summary Cards:</strong> Quick overview of all your active projects</li>
          <li><strong>Recent Activity Feed:</strong> Latest updates from your team</li>
          <li><strong>Task Statistics:</strong> Visual representation of completed vs pending tasks</li>
          <li><strong>Calendar Integration:</strong> Upcoming deadlines and meetings</li>
        </ul>
        <div class="alert alert-info">
          <strong>Pro Tip:</strong> Customize your dashboard by dragging and dropping widgets to match your workflow.
        </div>
      `
    },
    {
      id: 'tasks',
      title: 'Task Management',
      icon: <CheckSquare className="me-2" size={16} />,
      content: `
        <h4>Managing Tasks Effectively</h4>
        <p>Our task management system helps you organize work efficiently:</p>
        
        <h5>Creating Tasks</h5>
        <ol>
          <li>Click the "+" button in your project view</li>
          <li>Fill in task details including title, description, and due date</li>
          <li>Assign team members and set priority levels</li>
          <li>Add tags and attachments if needed</li>
        </ol>
        
        <h5>Task Status Workflow</h5>
        <div class="row">
          <div class="col-md-3"><span class="badge bg-secondary">To Do</span></div>
          <div class="col-md-3"><span class="badge bg-primary">In Progress</span></div>
          <div class="col-md-3"><span class="badge bg-warning">Review</span></div>
          <div class="col-md-3"><span class="badge bg-success">Complete</span></div>
        </div>
        
        <pre class="bg-card p-3 mt-3"><code>// Example API call for creating tasks
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Task',
    assignee: 'user@example.com',
    priority: 'high'
  })
})</code></pre>
      `
    },
    {
      id: 'permissions',
      title: 'User Permissions',
      icon: <Shield className="me-2" size={16} />,
      content: `
        <h4>Understanding User Permissions</h4>
        <p>Our role-based permission system ensures secure collaboration:</p>
        
        <div class="table-responsive ">
          <table class="table table-striped table-gradient-bg">
            <thead >
              <tr><th>Role</th><th>View Projects</th><th>Edit Tasks</th><th>Manage Team</th><th>Billing Access</th></tr>
            </thead>
            <tbody>
              <tr><td><span class="badge bg-danger">Owner</span></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
              <tr><td><span class="badge bg-warning">Admin</span></td><td>✅</td><td>✅</td><td>✅</td><td>❌</td></tr>
              <tr><td><span class="badge bg-info">Member</span></td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
              <tr><td><span class="badge bg-secondary">Viewer</span></td><td>✅</td><td>❌</td><td>❌</td><td>❌</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="alert alert-warning">
          <strong>Important:</strong> Only Owners can delete projects or remove team members with Admin roles.
        </div>
        
        <h5>Setting Permissions</h5>
        <p>To modify user permissions:</p>
        <ol>
          <li>Navigate to Project Settings → Team Members</li>
          <li>Click the role dropdown next to the user's name</li>
          <li>Select the appropriate permission level</li>
          <li>Changes take effect immediately</li>
        </ol>
      `
    }
  ];

  const handleInputChange = (e) => {
    setTicketForm({
      ...ticketForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!ticketForm.title || !ticketForm.category || !ticketForm.priority || !ticketForm.description) {
      setShowAlert({
        show: true,
        type: 'danger',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setShowAlert({
        show: true,
        type: 'success',
        message: 'Ticket submitted successfully! Reference ID: #TK' + Math.floor(Math.random() * 10000)
      });

      // Reset form
      setTicketForm({
        title: '',
        category: '',
        priority: '',
        description: '',
        project: '',
        assignedMember: ''
      });
      setSelectedFile(null);
    }, 1000);
  };

  const toggleFaq = (category, index) => {
    const key = `${category}-${index}`;
    setExpandedFaq({
      ...expandedFaq,
      [key]: !expandedFaq[key]
    });
  };

  const filteredFaqs = Object.keys(faqData).reduce((acc, category) => {
    const filtered = faqData[category].filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="p-4">
      <div className="card-header  text-white">
        <h2 className=" gradient-heading ">
          Support Center
        </h2>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">

            <div className="card-body bg-main p-0">
              {/* Navigation Tabs */}
              <ul className="nav nav-tabs nav-fill" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'raise-ticket' ? 'active' : ''}`}
                    onClick={() => setActiveTab('raise-ticket')}
                    type="button"
                  >
                    <MessageSquare className="me-2" size={16} />
                    <span className="d-none d-sm-inline">Raise Ticket</span>
                    <span className="d-sm-none">Ticket</span>
                  </button>
                </li>
                <li className="nav-item " role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'help-center' ? 'active' : ''}`}
                    onClick={() => setActiveTab('help-center')}
                    type="button"
                  >
                    <Search className="me-2" size={16} />
                    <span className="d-none d-sm-inline">Help Center</span>
                    <span className="d-sm-none">Help</span>
                  </button>
                </li>
                <li className="nav-item " role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'user-guide' ? 'active' : ''}`}
                    onClick={() => setActiveTab('user-guide')}
                    type="button"
                  >
                    <Book className="me-2" size={16} />
                    <span className="d-none d-sm-inline">User Guide</span>
                    <span className="d-sm-none">Guide</span>
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content p-4">

                {/* Raise Ticket Tab */}
                {activeTab === 'raise-ticket' && (
                  <div className="tab-pane fade show active">
                    <div className="row   justify-content-center">
                      <div className="col-lg-10 bg-card col-xl-8">
                        <div className="card bg-card shadow-sm">
                          <div className="card-header ">
                            <h4 className="mb-0">Submit a Support Ticket</h4>
                          </div>
                          <div className="card-body">
                            {showAlert.show && (
                              <div className={`alert alert-${showAlert.type} alert-dismissible`} role="alert">
                                {showAlert.message}
                                <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() => setShowAlert({ show: false, type: '', message: '' })}
                                ></button>
                              </div>
                            )}

                            <form onSubmit={handleSubmit}>
                              <div className="row">
                                <div className="col-md-8 mb-3">
                                  <label htmlFor="title" className="form-label">
                                    Title <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    value={ticketForm.title}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of your issue"
                                    required
                                  />
                                </div>

                                <div className="col-md-4 mb-3">
                                  <label htmlFor="priority" className="form-label">
                                    Priority <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    id="priority"
                                    name="priority"
                                    value={ticketForm.priority}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Select Priority</option>
                                    {priorities.map(priority => (
                                      <option key={priority} value={priority}>{priority}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-6   mb-3">
                                  <label htmlFor="category" className="form-label">
                                    Category <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    id="category"
                                    name="category"
                                    value={ticketForm.category}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                      <option key={category} value={category}>{category}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                  <label htmlFor="project" className="form-label">
                                    Project
                                    <HelpCircle className="ms-1" size={14} title="Select the project related to this issue" />
                                  </label>
                                  <select
                                    className="form-select"
                                    id="project"
                                    name="project"
                                    value={ticketForm.project}
                                    onChange={handleInputChange}
                                  >
                                    <option value="">Select Project</option>
                                    {projects.map(project => (
                                      <option key={project} value={project}>{project}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="assignedMember" className="form-label">
                                    Assign to Member
                                  </label>
                                  <select
                                    className="form-select"
                                    id="assignedMember"
                                    name="assignedMember"
                                    value={ticketForm.assignedMember}
                                    onChange={handleInputChange}
                                  >
                                    <option value="">Auto-assign</option>
                                    {members.map(member => (
                                      <option key={member} value={member}>{member}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                  <label htmlFor="attachment" className="form-label">
                                    Attachment
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    id="attachment"
                                    onChange={handleFileChange}
                                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                                  />
                                  <div className="form-text text-white">
                                    Max file size: 10MB. Supported formats: JPG, PNG, PDF, DOC, TXT
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                  Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                  className="form-control"
                                  id="description"
                                  name="description"
                                  rows="5"
                                  value={ticketForm.description}
                                  onChange={handleInputChange}
                                  placeholder="Please provide detailed information about your issue..."
                                  required
                                ></textarea>
                              </div>

                              <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-outline-secondary">
                                  Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                  <Upload className="me-2" size={16} />
                                  Submit Ticket
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                )}

                {/* Help Center Tab */}
                {activeTab === 'help-center' && (
                  <div className="tab-pane fade show active">
                    <div className="row">
                      <div className="col-lg-3 bg-card mb-4">
                        <div className="card bg-card h-100">
                          <div className="card-header ">
                            <h5 className="mb-0">Categories</h5>
                          </div>
                          <div className="list-group list-group-flush ">
                            {Object.keys(faqData).map(category => (
                              <a
                                key={category}
                                href={`#${category.replace(/\s+/g, '-').toLowerCase()}`}
                                className="list-group-item list-group-item-action bg-card"
                              >
                                {category}
                                <span className="badge bg-primary rounded-pill float-end">
                                  {faqData[category].length}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-9">
                        <div className="card bg-card">
                          <div className="card-header">
                            <div className="input-group">
                              <span className="input-group-text ">
                                <Search size={20} />
                              </span>
                              <input
                                type="text"
                                className="form-control form-control-lg  "
                                placeholder="Search help articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="card-body   ">
                            {Object.keys(filteredFaqs).length === 0 ? (
                              <div className="text-center  py-5 ">
                                <Search size={48} className="text-muted   mb-3" />
                                <h4>No results found</h4>
                                <p className="text-muted">Try adjusting your search terms</p>
                              </div>
                            ) : (
                              Object.keys(filteredFaqs).map(category => (
                                <div key={category} className="mb-4 ">
                                  <h4 className="  pb-2 " id={category.replace(/\s+/g, '-').toLowerCase()}>
                                    {category}
                                  </h4>
                                  <div className="accordion " id={`accordion-${category.replace(/\s+/g, '-')}`}>
                                    {filteredFaqs[category].map((item, index) => {
                                      const isExpanded = expandedFaq[`${category}-${index}`];
                                      return (
                                        <div key={index} className="accordion-item">
                                          <h2 className="accordion-header">
                                            <button
                                              className={`accordion-button table-gradient-bg  ${isExpanded ? '' : 'collapsed'}`}
                                              type="button text-white"
                                              onClick={() => toggleFaq(category, index)}
                                            >
                                              {item.q}
                                            </button>
                                          </h2>
                                          <div className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}>
                                            <div className="accordion-body bg-dark text-white">
                                              {item.a}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))
                            )}

                            <div className="text-center mt-5 pt-4 ">
                              <h5>Still need help?</h5>
                              <p className="">Can't find what you're looking for?</p>
                              <button
                                className="btn btn-primary"
                                onClick={() => setActiveTab('raise-ticket')}
                              >
                                <MessageSquare className="me-2" size={16} />
                                Contact Support
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Guide Tab */}
                {activeTab === 'user-guide' && (
                  <div className="tab-pane fade show active">
                    <div className="row">
                      {/* Sidebar Navigation */}
                      <div className="col-lg-3 mb-4  ">
                        <div className=" " style={{ top: '1rem', zIndex: 1020, }}>
                          <div className="card border-0   rounded-2">
                            <div className="card-header bg-card  border-bottom">
                              <h5 className="mb-0 d-flex align-items-center  text-primary">
                                <FileText className="me-2" size={18} />
                                Navigation
                              </h5>
                            </div>

                            <div className="list-group  list-group-flush">
                              {userGuideContent.map((section) => (
                                <a
                                  key={section.id}
                                  href={`#${section.id}`}
                                  className="list-group-item  bg-card list-group-item-action d-flex align-items-center px-3"
                                  style={{
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                >
                                  {section.icon}
                                  <span className="ms-2">{section.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Main Content Area */}
                      <div className="col-lg-9 b">
                        <div className="card border-0 bg-card shadow-smanimate__animated animate__fadeIn">
                          <div className="card-header  d-flex justify-content-between  align-items-center border-bottom">
                            <h3 className="mb-0 ">📘 Project Management Tool - User Guide</h3>
                            <span className="badge bg-info fs-6">v2.1</span>
                          </div>

                          <div className="card-body">
                            {/* Welcome Alert */}
                            <div className="alert alert-info d-flex align-items-center mb-4 shadow-sm animate__animated animate__fadeInDown">
                              <HelpCircle className="me-2 text-info" size={20} />
                              <div>
                                <strong>Welcome to the User Guide!</strong> This comprehensive guide will help you master our project management tool.
                              </div>
                            </div>

                            {/* Guide Sections */}
                            {userGuideContent.map((section, index) => (
                              <div key={section.id} className="mb-5">
                                <div id={section.id} className="scroll-margin-top">
                                  <div className="card shadow border-0 animate__animated animate__fadeInUp">
                                    <div className="card-body bg-card">
                                      <div
                                        className="content-section "
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {index < userGuideContent.length - 1 && (
                                  <hr className="my-5 border border-secondary-subtle" />
                                )}
                              </div>

                            ))}

                            {/* Bottom Call to Action */}
                            <div className="card bg-card shadow-sm animate__animated animate__fadeInUp">
                              <div className="card-body text-center">
                                <h5 className="mb-2">Need More Help?</h5>
                                <p className="mb-3 ">Explore our other support resources:</p>
                                <div className="d-flex flex-wrap justify-content-center gap-2">
                                  <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => setActiveTab('raise-ticket')}
                                  >
                                    <MessageSquare className="me-1" size={14} />
                                    Contact Support
                                  </button>

                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                )}

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProjectSupport;