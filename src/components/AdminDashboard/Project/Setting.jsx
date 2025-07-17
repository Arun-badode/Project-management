import React from 'react'
import { useState } from 'react'

const Setting = () => {
    const [activeTab] = useState("created");
    const [searchQuery] = useState("");
    const [setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [setShowSettings] = useState(false);

    const searchInputRef = useRef(null);
    const chartRef = useRef(null);

    const [clients, setClients] = useState([
        {
            alias: "Client Alpha (Alias)",
            actualName: "Actual Client Alpha Inc.",
            country: "USA",
            managers: "Jane Doe, John Smith",
        },
        {
            alias: "Company Beta (Alias)",
            actualName: "Actual Company Beta Ltd.",
            country: "UK",
            managers: "Peter Jones",
        },
        {
            alias: "Service Gamma (Alias)",
            actualName: "Actual Service Gamma LLC",
            country: "Canada",
            managers: "Alice Brown, Bob White",
        },
    ]);

    const [tasks, setTasks] = useState([
        "Backend Dev",
        "API Integration",
        "Frontend Dev",
        "QA Testing",
    ]);

    const [languages, setLanguages] = useState([
        "English",
        "Spanish",
        "French",
        "German",
    ]);

    const [applications, setapplications] = useState([
        "Web",
        "Mobile Responsive",
        "iOS",
        "Android",
    ]);

    const [currencies, setCurrencies] = useState([
        { name: "USD", rate: "83" },
        { name: "EUR", rate: "90" },
        { name: "GBP", rate: "90" },
    ]);

    const [newClient, setNewClient] = useState({
        alias: "",
        actualName: "",
        country: "",
        managers: "",
    });

    const [newTask, setNewTask] = useState("");
    const [newLanguage, setNewLanguage] = useState("");
    const [newapplication, setNewapplication] = useState("");
    const [newCurrency, setNewCurrency] = useState({ name: "", rate: "" });

    const handleAddClient = () => {
        if (newClient.alias && newClient.actualName && newClient.country) {
            setClients([...clients, newClient]);
            setNewClient({ alias: "", actualName: "", country: "", managers: "" });
        }
    };

    const handleAddTask = () => {
        if (newTask) {
            setTasks([...tasks, newTask]);
            setNewTask("");
        }
    };

    const handleAddLanguage = () => {
        if (newLanguage) {
            setLanguages([...languages, newLanguage]);
            setNewLanguage("");
        }
    };

    const handleAddapplication = () => {
        if (newapplication) {
            setapplications([...applications, newapplication]);
            setNewapplication("");
        }
    };

    const handleAddCurrency = () => {
        if (newCurrency.name && newCurrency.rate) {
            setCurrencies([...currencies, newCurrency]);
            setNewCurrency({ name: "", rate: "" });
        }
    };

    const handleDeleteItem = (list, setList, index) => {
        const newList = [...list];
        newList.splice(index, 1);
        setList(newList);
    };

    // Apply deadline logic here
    alert(`Deadline ${formData.deadline} applied to selected files.`);
};
// Sample data for projects
const [projects, setProjects] = useState([
    {
        id: 1,
        title: "Website Redesign",
        client: "Acme Corp",
        country: "United States",
        projectManager: "John Smith",
        tasks: ["Design", "Development"],
        languages: ["English", "Spanish"],
        application: "Web",
        files: [
            { name: "Homepage.psd", pageCount: 5 },
            { name: "About.psd", pageCount: 3 },
        ],
        totalPages: 16,
        receivedDate: "2025-06-20",
        status: "created",
        serverPath: "/projects/acme/redesign",
        notes: "Priority project for Q3",
        rate: 25,
        currency: "USD",
        cost: 400,
        inrCost: 33200,
    },
    {
        id: 2,
        title: "Mobile App Development",
        client: "TechStart",
        country: "Canada",
        projectManager: "Emily Johnson",
        tasks: ["Development", "Testing"],
        languages: ["English", "French"],
        application: "Mobile",
        files: [
            { name: "Login.sketch", pageCount: 2 },
            { name: "Dashboard.sketch", pageCount: 7 },
        ],
        totalPages: 18,
        receivedDate: "2025-06-15",
        status: "active",
        progress: 65,
        serverPath: "/projects/techstart/mobile",
        notes: "Beta release scheduled for August",
        rate: 30,
        currency: "USD",
        cost: 540,
        inrCost: 44820,
    },
    {
        id: 3,
        title: "E-commerce application",
        client: "RetailPlus",
        country: "UK",
        projectManager: "Michael Brown",
        tasks: ["Design", "Development", "Testing"],
        languages: ["English"],
        application: "Web",
        files: [
            { name: "ProductPage.fig", pageCount: 4 },
            { name: "Checkout.fig", pageCount: 3 },
        ],
        totalPages: 7,
        receivedDate: "2025-05-10",
        status: "completed",
        completedDate: "2025-06-10",
        serverPath: "/projects/retailplus/ecommerce",
        notes: "Successfully launched",
        rate: 28,
        currency: "GBP",
        cost: 196,
        inrCost: 20776,
        performance: {
            expectedHours: 42,
            actualHours: 38,
            stages: [
                {
                    name: "Design",
                    start: "2025-05-12",
                    end: "2025-05-20",
                    handler: "Sarah Wilson",
                },
                {
                    name: "Development",
                    start: "2025-05-21",
                    end: "2025-06-05",
                    handler: "David Lee",
                },
                {
                    name: "Testing",
                    start: "2025-06-06",
                    end: "2025-06-10",
                    handler: "Rachel Chen",
                },
            ],
        },
    },
]);

// Form state
const [formData, setFormData] = useState({
    title: "",
    client: "",
    country: "",
    projectManager: "",
    tasks: [],
    languages: [],
    application: [],
    files: [{ name: "", pageCount: 0 }],
    totalPages: 0,
    receivedDate: new Date().toISOString().split("T")[0],
    serverPath: "",
    notes: "",
    rate: 0,
    currency: "USD",
    cost: 0,
    inrCost: 0,

});

// Filter projects based on active tab and search query
const filteredProjects = projects.filter((project) => {
    const matchesTab = project.status === activeTab;
    const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.projectManager &&
            project.projectManager
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
        project.files.some((file) =>
            file.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    return matchesTab && matchesSearch;
});

// Handle keyboard shortcut for search
useEffect(() => {
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "f") {
            e.preventDefault();
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}, []);

// Initialize chart for completed projects
useEffect(() => {
    if (activeTab === "completed" && chartRef.current) {
        const chart = echarts.init(chartRef.current);
        const option = {
            animation: false,
            title: {
                text: "Project Performance",
                left: "center",
            },
            tooltip: {
                trigger: "axis",
            },
            legend: {
                data: ["Expected Hours", "Actual Hours"],
                bottom: 10,
            },
            xAxis: {
                type: "category",
                data: filteredProjects.map((p) => p.title),
            },
            yAxis: {
                type: "value",
                name: "Hours",
            },
            series: [
                {
                    name: "Expected Hours",
                    type: "bar",
                    data: filteredProjects.map(
                        (p) => p.performance?.expectedHours || 0
                    ),
                    color: "#4F46E5",
                },
                {
                    name: "Actual Hours",
                    type: "bar",
                    data: filteredProjects.map((p) => p.performance?.actualHours || 0),
                    color: "#10B981",
                },
            ],
        };
        chart.setOption(option);
        return () => {
            chart.dispose();
        };
    }
}, [activeTab, filteredProjects]);

// Calculate total pages
const calculateTotalPages = () => {
    const totalFilePages = formData.files.reduce(
        (sum, file) => sum + (file.pageCount || 0),
        0
    );
    return totalFilePages * formData.languages.length * formData.tasks.length;
};

// Update total pages when form changes
useEffect(() => {
    setFormData((prev) => ({
        ...prev,
        totalPages: calculateTotalPages(),
    }));
}, [formData.files, formData.languages, formData.tasks]);

// Calculate cost
useEffect(() => {
    const cost = formData.rate * formData.totalPages;
    let inrCost = cost;
    // Simple conversion rates (in real app would use API)
    const conversionRates = {
        USD: 83,
        EUR: 90,
        GBP: 106,
        CAD: 61,
        AUD: 55,
        INR: 1,
    };
    inrCost = cost * conversionRates[formData.currency];
    setFormData((prev) => ({
        ...prev,
        cost,
        inrCost,
    }));
}, [formData.rate, formData.totalPages, formData.currency]);

const [selectedDate, setSelectedDate] = useState(12);
const [selectedMonth, setSelectedMonth] = useState(6); // July (0-indexed)
const [selectedYear, setSelectedYear] = useState(2025);
const [selectedHour, setSelectedHour] = useState(12);
const [selectedMinute, setSelectedMinute] = useState(0);
const [isAM, setIsAM] = useState(true);

const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
};

const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Previous month's trailing days
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            isNextMonth: false,
        });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        days.push({
            day,
            isCurrentMonth: true,
            isNextMonth: false,
        });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
        days.push({
            day,
            isCurrentMonth: false,
            isNextMonth: true,
        });
    }

    return days;
};

return (
    <div>
        <div
            className="modal fade show d-block custom-modal-dark"
            tabIndex="-1"
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header bg-dark border-secondary">
                        <h5 className="modal-title text-white">Settings</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => setShowSettings(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <h6 className="text-white-50">
                            Manage predefined lists for project creation and other
                            application settings.
                        </h6>

                        {/* Manage Clients */}
                        <div className="mb-4">
                            <h6 className="mb-3 text-white">Manage Clients</h6>
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control bg-secondary text-white border-secondary"
                                    placeholder="New Client Alias Name"
                                    value={newClient.alias}
                                    onChange={(e) =>
                                        setNewClient({ ...newClient, alias: e.target.value })
                                    }
                                />
                            </div>
                            <div className="row g-2 mb-2">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control bg-secondary text-white border-secondary"
                                        placeholder="Actual Client Name*"
                                        value={newClient.actualName}
                                        onChange={(e) =>
                                            setNewClient({
                                                ...newClient,
                                                actualName: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control bg-secondary text-white border-secondary"
                                        placeholder="Country*"
                                        value={newClient.country}
                                        onChange={(e) =>
                                            setNewClient({
                                                ...newClient,
                                                country: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control bg-secondary text-white border-secondary"
                                    placeholder="Project Managers (comma-sep)"
                                    value={newClient.managers}
                                    onChange={(e) =>
                                        setNewClient({ ...newClient, managers: e.target.value })
                                    }
                                />
                                <button className="btn btn-primary" onClick={handleAddClient}
                                    disabled={
                                        !newClient.alias ||
                                        !newClient.actualName ||
                                        !newClient.country
                                    }>+</button>
                            </div>
                            <div className="border rounded p-2 mb-2 border-secondary">
                                {clients.map((client, index) => (
                                    <div key={index}>
                                        <div className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-2 rounded">
                                            <span className="text-white">
                                                <strong>{client.alias}</strong> ({client.actualName}
                                                )<br />
                                                Country: {client.country}
                                                <br />
                                                PMs: {client.managers}
                                            </span>
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() =>
                                                        handleDeleteItem(clients, setClients, index)
                                                    }
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddClient}
                    disabled={
                      !newClient.alias ||
                      !newClient.actualName ||
                      !newClient.country
                    }
                  >
                    <i className="fas fa-plus me-1"></i> Add Client
                  </button> */}
                        </div>

                        {/* Manage Tasks List */}
                        <div className="mb-4">
                            <h6 className="mb-3 text-white">Manage Tasks List</h6>
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control bg-secondary text-white border-secondary"
                                    placeholder="New task..."
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleAddTask}
                                    disabled={!newTask}>+</button>
                            </div>
                            <div className="border rounded p-2 mb-2 border-secondary">
                                {tasks.map((task, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                                    >
                                        <span className="text-white">{task}</span>
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleDeleteItem(tasks, setTasks, index)
                                                }
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddTask}
                    disabled={!newTask}
                  >
                    <i className="fas fa-plus me-1"></i> Add Task
                  </button> */}
                        </div>

                        {/* Manage Application List */}
                        <div className="mb-4">
                            <h6 className="mb-3 text-white">Manage Application List</h6>
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control bg-secondary text-white border-secondary"
                                    placeholder="New application..."
                                    value={newapplication}
                                    onChange={(e) => setNewapplication(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleAddapplication}
                                    disabled={!newapplication}>+</button>
                            </div>
                            <div className="border rounded p-2 mb-2 border-secondary">
                                {applications.map((application, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                                    >
                                        <span className="text-white">{application}</span>
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleDeleteItem(
                                                        applications,
                                                        setapplications,
                                                        index
                                                    )
                                                }
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddapplication}
                    disabled={!newapplication}
                  >
                    <i className="fas fa-plus me-1"></i> Add application
                  </button> */}
                        </div>

                        {/* Manage Languages List */}
                        <div className="mb-4">
                            <h6 className="mb-3 text-white">Manage Languages List</h6>
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control bg-secondary text-white border-secondary"
                                    placeholder="New language..."
                                    value={newLanguage}
                                    onChange={(e) => setNewLanguage(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleAddLanguage}
                                    disabled={!newLanguage}>+</button>
                            </div>
                            <div className="border rounded p-2 mb-2 border-secondary">
                                {languages.map((language, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                                    >
                                        <span className="text-white">{language}</span>
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleDeleteItem(languages, setLanguages, index)
                                                }
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <button
                    className="btn btn-sm btn-primary"
                    onClick={handleAddLanguage}
                    disabled={!newLanguage}
                  >
                    <i className="fas fa-plus me-1"></i> Add Language
                  </button> */}
                        </div>

                        {/* Currency Conversion Rates */}
                        <div className="mb-4">
                            <h6 className="mb-3 text-white">Currency Conversion Rates</h6>
                            <div className="row g-2 mb-2">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control bg-card text-white border-secondary"
                                        placeholder="Currency (e.g. USD)"
                                        value={newCurrency.name}
                                        onChange={(e) =>
                                            setNewCurrency({
                                                ...newCurrency,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control bg-card text-white border-secondary"
                                        placeholder="Rate to INR"
                                        value={newCurrency.rate}
                                        onChange={(e) =>
                                            setNewCurrency({
                                                ...newCurrency,
                                                rate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="border rounded p-2 mb-2 border-secondary table-gradient-bg">
                                <table className="table table-dark table-sm mb-0">
                                    <thead>
                                        <tr>
                                            <th>Currency</th>
                                            <th>Rate to INR</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currencies.map((currency, index) => (
                                            <tr key={index}>
                                                <td>{currency.name}</td>
                                                <td>{currency.rate}</td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() =>
                                                                handleDeleteItem(
                                                                    currencies,
                                                                    setCurrencies,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={handleAddCurrency}
                                disabled={!newCurrency.name || !newCurrency.rate}
                            >
                                <i className="fas fa-plus me-1"></i> Add Currency
                            </button>
                        </div>

                        {/* Save All Settings */}
                        <div className="mb-4">
                            <h6 className="mb-3 text-white">Save All Settings</h6>
                            <div className="border rounded p-2 mb-2 border-secondary">
                                <p className="small text-white-50 mb-0">
                                    Remember to save your changes. Settings are stored
                                    locally.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer  border-secondary">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowSettings(false)}
                        >
                            Close
                        </button>
                        <button type="button" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
export default Setting;