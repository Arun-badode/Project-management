import React, { useState } from "react";



// --- Data ---
const knownIssues = [
  "Login not working",
  "Unable to upload file",
  "Slow dashboard loading",
  "Notifications not received",
];
const categories = [
  "Bug",
  "Feature Request",
  "Access Issue",
  "Performance",
  "Other",
];
const priorities = ["Low", "Medium", "High", "Urgent"];
const projects = [
  "Website Redesign",
  "Mobile App",
  "API Integration",
  "Internal Tools",
];
const statusBadges = {
  Open: "primary",
  "In Progress": "warning",
  Resolved: "success",
};
const ticketHistory = [
  {
    id: 1,
    title: "Login not working",
    status: "Resolved",
    date: "2025-06-10",
  },
  {
    id: 2,
    title: "Unable to upload file",
    status: "In Progress",
    date: "2025-06-12",
  },
  {
    id: 3,
    title: "Slow dashboard loading",
    status: "Open",
    date: "2025-06-14",
  },
];
const helpCategories = [
  {
    key: "getting-started",
    icon: "bi-rocket-takeoff",
    name: "Getting Started",
    articles: [
      { title: "How to create a new project", updated: true, popular: true, content: "To create a new project, click the 'New Project' button on your dashboard and fill in the required details." },
      { title: "Inviting your team", content: "Go to the Team section and use the 'Invite' button to add members by email." },
      { title: "Setting up your profile", content: "Click your avatar in the top right and select 'Profile' to update your information." },
    ],
  },
  {
    key: "managing-tasks",
    icon: "bi-list-check",
    name: "Managing Tasks",
    articles: [
      { title: "Assigning team members", content: "Open a task and use the 'Assign' dropdown to select team members." },
      { title: "Changing task status", updated: true, content: "Click the status badge on a task to update its progress." },
      { title: "Task dependencies", content: "Use the 'Dependencies' tab in the task details to link related tasks." },
    ],
  },
  {
    key: "time-tracking",
    icon: "bi-clock-history",
    name: "Time Tracking",
    articles: [
      { title: "Logging time on tasks", content: "Open a task and click 'Log Time' to record hours spent." },
      { title: "Viewing timesheets", content: "Go to the Reports section and select 'Timesheets' to view logged time." },
    ],
  },
  {
    key: "reports-analytics",
    icon: "bi-bar-chart-line",
    name: "Reports & Analytics",
    articles: [
      { title: "Generating project reports", popular: true, content: "Navigate to Reports and choose the type of report you want to generate." },
      { title: "Understanding analytics", content: "Analytics dashboards provide insights into project progress and team performance." },
    ],
  },
  {
    key: "billing-payments",
    icon: "bi-credit-card-2-front",
    name: "Billing & Payments",
    articles: [
      { title: "Updating payment method", content: "Go to Settings > Billing to update your payment information." },
      { title: "Viewing invoices", content: "All invoices are available under the Billing section for download." },
    ],
  },
];
const popularArticles = [
  { title: "How to create a new project", category: "Getting Started", popular: true },
  { title: "Generating project reports", category: "Reports & Analytics", popular: true },
  { title: "Changing task status", category: "Managing Tasks", updated: true },
];
const userGuideSections = [
  { key: "dashboard", label: "Dashboard Overview" },
  { key: "projects", label: "Creating Projects" },
  { key: "tasks", label: "Task Management" },
  { key: "permissions", label: "User Permissions" },
  { key: "notifications", label: "Notifications & Alerts" },
  { key: "reports", label: "Reports" },
];

// --- Markdown Preview ---
const renderMarkdown = (text) =>
  text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br/>");

// --- Raise Ticket Page ---
function RaiseTicketSection() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
    file: null,
    project: "",
    assigned: "",
  });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [autocomplete, setAutocomplete] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (name === "title") {
      setAutocomplete(
        value.length > 1
          ? knownIssues.filter((issue) =>
              issue.toLowerCase().includes(value.toLowerCase())
            )
          : []
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    setLoading(true);
    setAlert({ type: "", message: "" });
    setTimeout(() => {
      setLoading(false);
      setAlert({ type: "success", message: "Ticket submitted successfully!" });
      setForm({
        title: "",
        category: "",
        priority: "",
        description: "",
        file: null,
        project: "",
        assigned: "",
      });
    }, 1500);
  };

  const validateForm = () =>
    form.title &&
    form.category &&
    form.priority &&
    form.description &&
    form.project;

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-xl-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-flag-fill text-danger fs-2 me-2"></i>
                <h2 className="mb-0 fw-bold">Raise a Ticket</h2>
              </div>
              <p className="text-muted mb-4">
                Report bugs, technical issues, or request support related to tasks, teams, or the platform.
              </p>
              {alert.message && (
                <div className={`alert alert-${alert.type} d-flex align-items-center`} role="alert">
                  <i className={`bi me-2 ${alert.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
                  {alert.message}
                </div>
              )}
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="form-floating mb-3 position-relative">
                  <input
                    type="text"
                    className="form-control"
                    id="issueTitle"
                    name="title"
                    placeholder="Issue Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="issueTitle">
                    Issue Title <span className="text-danger">*</span>
                  </label>
                  {autocomplete.length > 0 && (
                    <div className="list-group position-absolute w-100 z-3" style={{ top: "100%" }}>
                      {autocomplete.map((item, idx) => (
                        <button
                          type="button"
                          className="list-group-item list-group-item-action"
                          key={idx}
                          onClick={() => {
                            setForm((prev) => ({ ...prev, title: item }));
                            setAutocomplete([]);
                          }}
                        >
                          <i className="bi bi-lightbulb me-2 text-warning"></i>
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                      <label htmlFor="category">
                        Category <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="priority"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Priority</option>
                        {priorities.map((pri) => (
                          <option key={pri}>{pri}</option>
                        ))}
                      </select>
                      <label htmlFor="priority">
                        Priority <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-floating mt-3 mb-3">
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Describe your issue"
                    style={{ minHeight: 100 }}
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="description">
                    Description <span className="text-danger">*</span>
                  </label>
                  <div className="form-text">
                    <i className="bi bi-markdown-fill text-secondary"></i> Markdown supported
                  </div>
                  {form.description && (
                    <div className="border rounded p-2 mt-2 bg-light-subtle">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(form.description),
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Attachments <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="file"
                    onChange={handleChange}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="project"
                        name="project"
                        value={form.project}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map((proj) => (
                          <option key={proj}>{proj}</option>
                        ))}
                      </select>
                      <label htmlFor="project">
                        Assigned Project <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="assigned"
                        name="assigned"
                        placeholder="Assigned Team Member"
                        value={form.assigned}
                        onChange={handleChange}
                      />
                      <label htmlFor="assigned">
                        Assigned Team Member <span className="text-muted">(optional)</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading || !validateForm()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Ticket"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Ticket History Panel */}
        <div className="col-lg-4 d-none d-lg-block">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white d-flex align-items-center justify-content-between">
              <span className="fw-bold">
                <i className="bi bi-clock-history me-2 text-secondary"></i>
                Ticket History
              </span>
            </div>
            <div className="card-body">
              {ticketHistory.map((t) => (
                <div key={t.id} className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-semibold">{t.title}</span>
                    <span className={`badge bg-${statusBadges[t.status]}`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="text-muted small">
                    <i className="bi bi-calendar-event me-1"></i>
                    {t.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modal Confirmation */}
      {showConfirm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(24,25,42,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-question-circle-fill text-info me-2"></i>
                  Confirm Submission
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to submit this ticket?</p>
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-outline-secondary" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={confirmSubmit}>
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Help Center Page ---
function HelpCenterSection() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(helpCategories[0].key);
  const [feedback, setFeedback] = useState({});
  const [showSupport, setShowSupport] = useState(false);

  // Filter articles by search
  const filteredCategories = helpCategories.map((cat) => ({
    ...cat,
    articles: cat.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.content && a.content.toLowerCase().includes(search.toLowerCase()))
    ),
  }));

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="row justify-content-center">
        {/* Sidebar */}
        <nav className="col-lg-3 mb-4 mb-lg-0">
          <div className="card shadow-sm sticky-top" style={{ top: 24 }}>
            <div className="card-body p-3">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-life-preserver text-primary me-2"></i>
                Help Center
              </h5>
              <ul className="nav flex-column">
                {helpCategories.map((cat) => (
                  <li className="nav-item mb-2" key={cat.key}>
                    <button
                      className={`nav-link text-start fw-semibold d-flex align-items-center ${activeCategory === cat.key ? "active text-primary" : "text-dark"}`}
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                      onClick={() => setActiveCategory(cat.key)}
                    >
                      <i className={`bi ${cat.icon} me-2`}></i>
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        {/* Main Content */}
        <main className="col-lg-7">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search articles, topics, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Popular Articles */}
          <div className="mb-4">
            <h6 className="fw-bold mb-2">
              <i className="bi bi-stars text-warning me-2"></i>
              Popular Articles
            </h6>
            <div className="row g-3">
              {popularArticles
                .filter(
                  (a) =>
                    a.title.toLowerCase().includes(search.toLowerCase()) ||
                    a.category.toLowerCase().includes(search.toLowerCase())
                )
                .map((a, idx) => (
                  <div className="col-md-6" key={idx}>
                    <div className="card card-body d-flex flex-row align-items-center gap-2">
                      <i className="bi bi-lightbulb text-warning fs-4"></i>
                      <div>
                        <div className="fw-semibold">{a.title}</div>
                        <div className="small text-muted">{a.category}</div>
                        {a.popular && (
                          <span className="badge bg-primary-subtle text-primary me-1">Popular</span>
                        )}
                        {a.updated && (
                          <span className="badge bg-info-subtle text-info">Updated</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Category Accordions */}
          <div className="accordion" id="helpAccordion">
            {filteredCategories
              .filter((cat) => cat.key === activeCategory)
              .map((cat) => (
                <div key={cat.key}>
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <i className={`bi ${cat.icon} me-2`}></i>
                    {cat.name}
                  </h5>
                  {cat.articles.length === 0 && (
                    <div className="alert alert-warning">No articles found for this search.</div>
                  )}
                  <div className="accordion" id={`accordion-${cat.key}`}>
                    {cat.articles.map((a, idx) => (
                      <div className="accordion-item mb-2" key={idx}>
                        <h2 className="accordion-header" id={`heading-${cat.key}-${idx}`}>
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${cat.key}-${idx}`}
                            aria-expanded="false"
                            aria-controls={`collapse-${cat.key}-${idx}`}
                          >
                            {a.title}
                            {a.popular && (
                              <span className="badge bg-primary-subtle text-primary ms-2">Popular</span>
                            )}
                            {a.updated && (
                              <span className="badge bg-info-subtle text-info ms-2">Updated</span>
                            )}
                          </button>
                        </h2>
                        <div
                          id={`collapse-${cat.key}-${idx}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading-${cat.key}-${idx}`}
                          data-bs-parent={`#accordion-${cat.key}`}
                        >
                          <div className="accordion-body">
                            <div>{a.content}</div>
                            {/* Article rating system */}
                            <div className="mt-3">
                              <div className="fw-semibold mb-1">Was this helpful?</div>
                              <button
                                className={`btn btn-sm me-2 ${feedback[`${cat.key}-${idx}`] === "yes" ? "btn-success" : "btn-outline-success"}`}
                                onClick={() =>
                                  setFeedback((f) => ({
                                    ...f,
                                    [`${cat.key}-${idx}`]: "yes",
                                  }))
                                }
                              >
                                👍 Yes
                              </button>
                              <button
                                className={`btn btn-sm ${feedback[`${cat.key}-${idx}`] === "no" ? "btn-danger" : "btn-outline-danger"}`}
                                onClick={() =>
                                  setFeedback((f) => ({
                                    ...f,
                                    [`${cat.key}-${idx}`]: "no",
                                  }))
                                }
                              >
                                👎 No
                              </button>
                              {feedback[`${cat.key}-${idx}`] && (
                                <div className="small mt-2 text-success">
                                  Thank you for your feedback!
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          {/* Contact Support CTA */}
          <div className="card card-body mt-5 text-center shadow-sm">
            <h5 className="fw-bold mb-2">
              <i className="bi bi-chat-dots text-primary me-2"></i>
              Need more help?
            </h5>
            <p className="mb-3 text-muted">
              Our support team is here for you. Start a live chat or contact us directly.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowSupport(true)}
            >
              <i className="bi bi-headset me-2"></i>
              Contact Support
            </button>
            {/* Simulated support bot popup */}
            {showSupport && (
              <div className="alert alert-info mt-3 d-flex align-items-center justify-content-between">
                <span>
                  <i className="bi bi-robot me-2"></i>
                  Hi! How can I assist you today?
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowSupport(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- User Guide Page ---
function UserGuideSection() {
  const [activeSection, setActiveSection] = useState(userGuideSections[0].key);

  const sectionContent = {
    dashboard: (
      <>
        <h3>Dashboard Overview</h3>
        <p>
          The dashboard gives you a quick summary of your projects, tasks, and notifications.
        </p>
        <img
          src="https://dummyimage.com/600x200/eee/aaa&text=Dashboard+Screenshot"
          alt="Dashboard"
          className="img-fluid rounded mb-3"
        />
        <ul>
          <li>View project progress at a glance</li>
          <li>See recent activity and alerts</li>
          <li>Quick links to your most important actions</li>
        </ul>
      </>
    ),
    projects: (
      <>
        <h3>Creating Projects</h3>
        <p>
          To create a new project, click the <b>New Project</b> button and fill in the required details.
        </p>
        <pre className="bg-light p-2 rounded">
          {`1. Go to Projects tab
2. Click "New Project"
3. Enter project name and details
4. Click "Create"`}
        </pre>
      </>
    ),
    tasks: (
      <>
        <h3>Task Management</h3>
        <p>
          Assign, update, and track tasks for your team. Use filters to find tasks quickly.
        </p>
        <img
          src="https://dummyimage.com/600x200/eee/aaa&text=Task+Board"
          alt="Task Board"
          className="img-fluid rounded mb-3"
        />
      </>
    ),
    permissions: (
      <>
        <h3>User Permissions</h3>
        <p>
          Manage who can view or edit projects, tasks, and reports. Set roles for each team member.
        </p>
        <ul>
          <li>Admin: Full access</li>
          <li>Editor: Can modify tasks and projects</li>
          <li>Viewer: Read-only access</li>
        </ul>
      </>
    ),
    notifications: (
      <>
        <h3>Notifications & Alerts</h3>
        <p>
          Stay up to date with real-time notifications for task updates, mentions, and deadlines.
        </p>
      </>
    ),
    reports: (
      <>
        <h3>Reports</h3>
        <p>
          Generate and download reports on project progress, time tracking, and team performance.
        </p>
        <a href="#" className="btn btn-outline-primary btn-sm mt-2">
          <i className="bi bi-file-earmark-arrow-down me-1"></i>
          Download Sample PDF
        </a>
      </>
    ),
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-md-3 mb-4 mb-md-0">
          <div className="card sticky-top" style={{ top: 24 }}>
            <div className="card-body p-3">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-journal-bookmark-fill text-success me-2"></i>
                User Guide
              </h5>
              <ul className="nav flex-column">
                {userGuideSections.map((section) => (
                  <li className="nav-item mb-2" key={section.key}>
                    <button
                      className={`nav-link text-start fw-semibold ${activeSection === section.key ? "active text-success" : "text-dark"}`}
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                      onClick={() => setActiveSection(section.key)}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="col-md-9">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="mb-3">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#" onClick={e => {e.preventDefault(); setActiveSection(userGuideSections[0].key);}}>User Guide</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {userGuideSections.find(s => s.key === activeSection)?.label}
                    </li>
                  </ol>
                </nav>
              </div>
              {sectionContent[activeSection]}
              {/* Progress bar (simulated) */}
              <div className="mt-4">
                <label className="form-label">Documentation Progress</label>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${((userGuideSections.findIndex(s => s.key === activeSection) + 1) / userGuideSections.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          {/* Getting Started Checklist */}
          {activeSection === "dashboard" && (
            <div className="card card-body mb-4">
              <h6 className="fw-bold mb-2">
                <i className="bi bi-check2-circle text-primary me-2"></i>
                Getting Started Checklist
              </h6>
              <ul className="list-unstyled">
                <li><i className="bi bi-check2 text-success me-1"></i> Complete your profile</li>
                <li><i className="bi bi-check2 text-success me-1"></i> Create your first project</li>
                <li><i className="bi bi-check2 text-success me-1"></i> Invite your team</li>
                <li><i className="bi bi-check2 text-success me-1"></i> Set up notifications</li>
              </ul>
            </div>
          )}
          {/* Dark mode toggle (simulated) */}
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-moon-stars"></i>
            <span>Dark Mode (coming soon)</span>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Main App ---
export default function ProjectSupportPortal() {
  const [tab, setTab] = useState("ticket");
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-tools me-2"></i>
            Project Support Portal
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className={`btn btn-link nav-link text-white ${tab === "ticket" ? "fw-bold" : ""}`} onClick={() => setTab("ticket")}>
                Raise Ticket
              </button>
            </li>
            <li className="nav-item">
              <button className={`btn btn-link nav-link text-white ${tab === "help" ? "fw-bold" : ""}`} onClick={() => setTab("help")}>
                Help Center
              </button>
            </li>
            <li className="nav-item">
              <button className={`btn btn-link nav-link text-white ${tab === "guide" ? "fw-bold" : ""}`} onClick={() => setTab("guide")}>
                User Guide
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {tab === "ticket" && <RaiseTicketSection />}
      {tab === "help" && <HelpCenterSection />}
      {tab === "guide" && <UserGuideSection />}
    </div>
  );
}