import React, { useEffect, useState } from "react";
import "./Setting.css";
import axios from "axios";
import BASE_URL from "../../../config";

const currencyOptions = ["USD", "EUR", "INR", "GBP", "CAD", "AUD"];

const initialClients = [
  {
    alias: "Client Alpha",
    actual: "Actual Client Alpha Inc.",
    country: "USA",
    currency: "USD",
    hourlyRate: "50.00",
    managers: "Jane Doe, John Smith",
  },
  {
    alias: "Company Beta",
    actual: "Actual Company Beta Ltd.",
    country: "UK",
    currency: "GBP",
    hourlyRate: "60.00",
    managers: "Peter Jones",
  },
  {
    alias: "Service Gamma",
    actual: "Actual Service Gamma LLC",
    country: "Canada",
    currency: "CAD",
    hourlyRate: "70.00",
    managers: "Alice Brown, Bob White",
  },
];

export default function SettingsPage() {

  const token = localStorage.getItem("authToken");
  const [applications, setApplications] = useState([]);
  const [newapplication, setNewapplication] = useState("");
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState(initialClients);
  const [showAllClients, setShowAllClients] = useState(true); // default to showing all
   const [currencyOptions, setCurrencyOptions] = useState([]); // storing currency option

  const [clientForm, setClientForm] = useState({
    alias: "",
    actual: "",
    country: "",
    currency: "",
    hourlyRate: "",
    managers: "",
  });

  const [countries, setCountries] = useState([]);
useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get("https://open.er-api.com/v6/latest/USD");
        const currencyCodes = Object.keys(res.data.rates);
        setCurrencyOptions(currencyCodes);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  // fetch project detaisl form the api 
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}project/getAllProjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          setProjects(response.data.projects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await res.json();

        // Extract only common names
        const countryList = data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));

        setCountries(countryList);
      } catch (err) {
        console.error("Failed to fetch countries", err);
      }
    };

    fetchCountries();
  }, []);

  // this is use effect for the fetch application list 
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}application/getAllApplication`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status) {
          setApplications(res.data.application); // from API response
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };

    fetchApplications();
  }, []);


  // useeffect to fetch the clients from api 
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${BASE_URL}client/getAllClients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          setClients(response.data.clients); // only dynamic data
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    fetchClients();
  }, []);
 const handleClientChange = (e) => {
  const { name, value } = e.target;

  if (name === "clientId") {
    const selectedClient = clients.find(client => client.id.toString() === value);

    setClientForm((prev) => ({
      ...prev,
      [name]: value,
      country: selectedClient?.country || "",
      currency: selectedClient?.currency || "",
      hourlyRate: selectedClient?.hourlyRate || "",
    }));

    // If you have a state to hold selected client (optional)
    // setSelectedClient(selectedClient ? [selectedClient] : []);
  } else {
    setClientForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const [editClientIdx, setEditClientIdx] = useState(null);

  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  // this is for getting managers form the api 
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${BASE_URL}member/getAllMembers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched members:", res.data.data);

        if (res.data.status && Array.isArray(res.data.data)) {
          const onlyManagers = res.data.data.filter(
            (member) => member.role?.toLowerCase() === "manager"
          );

          const formatted = onlyManagers.map((manager) => ({
            value: manager.id,
            label: manager.fullName,
          }));

          setManagers(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch project managers:", err);
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchManagers();
  }, []);



  // const handleClientChange = (e) => {
  //   const { name, value } = e.target;
  //   setClientForm((prev) => ({ ...prev, [name]: value }));
  // };

  const handleAddOrEditClient = () => {
    if (
      !clientForm.alias.trim() ||
      !clientForm.actual.trim() ||
      !clientForm.country.trim() ||
      !clientForm.currency.trim() ||
      !clientForm.hourlyRate.trim()
    )
      return;

    const formattedRate = parseFloat(clientForm.hourlyRate).toFixed(2);

    const updatedClient = {
      ...clientForm,
      hourlyRate: formattedRate,
    };

    if (editClientIdx !== null) {
      const updated = [...clients];
      updated[editClientIdx] = updatedClient;
      setClients(updated);
      setEditClientIdx(null);
    } else {
      setClients([...clients, updatedClient]);
    }

    setClientForm({
      alias: "",
      actual: "",
      country: "",
      currency: "",
      hourlyRate: "",
      managers: "",
    });
  };

  const handleEditClient = (idx) => {
    setEditClientIdx(idx);
    setClientForm(clients[idx]);
  };

  const handleDeleteClient = (idx) => {
    setClients(clients.filter((_, i) => i !== idx));
    if (editClientIdx === idx) setEditClientIdx(null);
  };


  const [newLanguage, setNewLanguage] = useState("");

  const [newCurrency, setNewCurrency] = useState({ name: "", rate: "" });

  const handleAddClient = () => {
    if (newClient.alias && newClient.actualName && newClient.country) {
      setClients([...clients, newClient]);
      setNewClient({ alias: "", actualName: "", country: "", managers: "" });
    }
  };

  // this part of code is for set the task and disply the tasks dynamically 
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}tasks/getAllTasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // add task api
  const handleAddTask = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}tasks/addTasks`,
        { taskName: newTask },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        const newAddedTask = res.data.club; // from the response

        setTasks((prevTasks) => [...prevTasks, newAddedTask]); // append to existing list
        setNewTask(""); // clear input
      }
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  // handle edit task api 
  const handleEditTask = async (id, oldName) => {
    const newTaskName = prompt("Enter new task name:", oldName);

    if (!newTaskName || newTaskName.trim() === "" || newTaskName === oldName) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}tasks/updateTaskById/${id}`,
        { taskName: newTaskName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        const updatedTask = res.data.task;

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? updatedTask : task
          )
        );
      }
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  // handle delete task api 

  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${BASE_URL}tasks/deleteTaskById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        alert("Failed to delete task.");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("An error occurred while deleting the task.");
    }
  };


  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddLanguage = async () => {
    if (!newLanguage) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${BASE_URL}language/addlanguage`,
        { languageName: newLanguage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Add language response:", res.data);

      if (res.data.status) {
        // Append the new language object to the current list
        setLanguages([...languages, res.data.language]);
        setNewLanguage(""); // Clear the input
      } else {
        console.error("Failed to add language");
      }
    } catch (error) {
      console.error("Error adding language:", error);
    }
  };


  // function to add the application 
  const handleAddapplication = async () => {
    if (!newapplication.trim()) return;

    try {
      const res = await axios.post(
        `${BASE_URL}application/addApplication`,
        { applicationName: newapplication },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        const addedApp = res.data.application;

        setApplications((prev) => [...prev, addedApp]);
        setNewapplication("");
      } else {
        alert("Failed to add application.");
      }
    } catch (err) {
      console.error("Error adding application:", err);
      alert("Something went wrong.");
    }
  };

  const handleEditLanguage = async (id, currentName) => {
    const updatedName = prompt("Edit Language Name:", currentName);

    if (!updatedName || updatedName.trim() === "" || updatedName === currentName) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.patch(
        `${BASE_URL}language/updateLanguageById/${id}`,
        { languageName: updatedName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status) {
        const updatedLang = res.data.language;

        setLanguages((prev) =>
          prev.map((lang) => (lang.id === id ? updatedLang : lang))
        );
      } else {
        alert("Failed to update language.");
      }
    } catch (err) {
      console.error("Error updating language:", err);
      alert("Something went wrong while updating.");
    }
  };


  // this is for edit application function from api 
  const handleEditApplication = async (id, currentName) => {
    const updatedName = prompt("Edit Application Name:", currentName);

    if (!updatedName || updatedName.trim() === "" || updatedName === currentName) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}application/updateApplicationById/${id}`,
        { applicationName: updatedName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        const updatedApp = res.data.application;

        setApplications((prev) =>
          prev.map((app) => (app.id === id ? updatedApp : app))
        );
      } else {
        alert("Failed to update application.");
      }
    } catch (err) {
      console.error("Error updating application:", err);
      alert("Something went wrong while updating.");
    }
  };

  const handleDeleteLanguage = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this language?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.delete(
        `${BASE_URL}language/deleteLanguageById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        // Remove the deleted language from the UI
        setLanguages((prev) => prev.filter((lang) => lang.id !== id));
      } else {
        alert("Failed to delete the language.");
      }
    } catch (err) {
      console.error("Error deleting language:", err);
      alert("Something went wrong while deleting.");
    }
  };



  const handleAddCurrency = () => {
    if (newCurrency.name && newCurrency.rate) {
      setCurrencies([...currencies, newCurrency]);
      setNewCurrency({ name: "", rate: "" });
    }
  };

  // const [tasks, setTasks] = useState([
  //   "Backend Dev",
  //   "API Integration",
  //   "Frontend Dev",
  //   "QA Testing",
  // ]);

  const [languages, setLanguages] = useState([]); // this is language state 
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${BASE_URL}language/getAlllanguage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched languages:", res.data.languages);

        if (res.data.status && Array.isArray(res.data.languages)) {
          setLanguages(res.data.languages); // store full objects: id, languageName, createdAt
        }
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      } finally {
        // Optional: setLoadingLanguages(false); if you're handling loading state
      }
    };

    fetchLanguages();
  }, []);


  // const [languages, setLanguages] = useState([
  //   "English",
  //   "Spanish",
  //   "French",
  //   "German",
  // ]);

  // const [applications, setapplications] = useState([
  //   "Web",
  //   "Mobile Responsive",
  //   "iOS",
  //   "Android",
  // ]);

  const [currencies, setCurrencies] = useState([
    { name: "USD", rate: "83" },
    { name: "EUR", rate: "90" },
    { name: "GBP", rate: "90" },
  ]);

  const selectedClientData = showAllClients
    ? clients
    : clients.filter((client) => client.id === parseInt(clientForm.actual));


  return (
    <div className="p-4 settings-main-unique py-4">
      <h2 className="gradient-heading mb-1">Client Management</h2>
      <div
        className="text-white mb-4"
        style={{ opacity: 0.7, fontSize: "1.05em" }}
      >
        Manage your client details including currency, hourly rate, and project
        managers.
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h5 className="text-white">Manage Clients</h5>

          {/* First row */}
          <div className="row mb-2">
            <div className="col-md-6 mb-2">
              <select
                name="actual"
                value={clientForm.actual}
                onChange={(e) => {
                  const selectedClientId = parseInt(e.target.value);
                  const relatedProjects = projects.filter(
                    (project) => project.clientId === selectedClientId
                  );

                  const latestProject = relatedProjects[0]; // pick the first or latest

                  setClientForm((prevForm) => ({
                    ...prevForm,
                    actual: selectedClientId,
                    country: latestProject?.country || "",
                    currency: latestProject?.currency || "",
                    hourlyRate: latestProject?.hourlyRate || "",
                    projectManager: latestProject?.full_name || "",
                  }));
                }}
                className="form-control"
              >
                <option value="">-- Select Client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-2">
              <input
                className="form-control"
                style={{ background: "#181f3a", color: "#fff" }}
                placeholder="Actual Client Name*"
                name="actual"
                value={clientForm.actual}
                onChange={handleClientChange}
              />
            </div>
          </div>

          {/* Second row */}
          <div className="row mb-3">
            <div className="col-md-4 mb-2">
              <select
                className="form-control"
                name="country"
                value={clientForm.country}
                onChange={handleClientChange}
                style={{ background: "#181f3a", color: "#fff" }}
              >
                <option value="">-- Select Country --</option>
                {countries.map((country, idx) => (
                  <option key={idx} value={country}>
                    {country}
                  </option>
                ))}
              </select>


            </div>

            <div className="col-md-8 mb-2">
              <div className="row">
                <div className="col-md-3">
                  <select
                    className="form-control"
                    style={{ background: "#181f3a", color: "#fff" }}
                    name="currency"
                    value={clientForm.currency}
                    onChange={handleClientChange}
                  >
                    <option value="">Currency*</option>
                    {currencyOptions.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-5 d-flex align-items-end">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Hourly Rate*"
                    name="hourlyRate"
                    value={clientForm.hourlyRate}
                    onChange={handleClientChange}
                    style={{ background: "#181f3a", color: "#fff" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Third row */}
          <div className="d-flex gap-2 mb-2 flex-wrap">
            <select
              className="form-control"
              name="managers"
              value={clientForm.managers}
              onChange={(e) => {
                const selectedId = e.target.value;

                setClientForm((prevForm) => ({
                  ...prevForm,
                  managers: selectedId, // ✅ only manager ID stored here
                }));
              }}
              style={{ background: "#181f3a", color: "#fff" }}
            >
              <option value="">-- Select Project Manager --</option>
              {managers.map((manager) => (
                <option key={manager.value} value={manager.value}>
                  {manager.label}
                </option>
              ))}
            </select>

            <button
              className="btn btn-gradient"
              onClick={handleAddOrEditClient}
              title={editClientIdx !== null ? "Update Client" : "Add Client"}
            >
              {editClientIdx !== null ? (
                <i className="bi bi-check-lg"></i>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </button>
          </div>

          {/* Client List */}
          <div
            className="client-list"
            style={{
              border: "2px solid #7b2ff2",
              borderRadius: 10,
              background: "rgba(20,30,70,0.7)",
              maxHeight: "400px",
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {!clientForm.actual ? (
              <p className="text-white" style={{ opacity: 0.6 }}>
                No client selected.
              </p>
            ) : (
              <div className="client-item d-flex justify-content-between align-items-start mb-3">
                <div>
                  <b className="text-white">{clientForm.alias} (Alias)</b>{" "}
                  <span className="text-white" style={{ opacity: 0.7 }}>
                    ({clientForm.actual})
                  </span>
                  <div style={{ fontSize: "0.95em" }}>
                    <span className="text-white" style={{ opacity: 0.7 }}>
                      Country: {clientForm.country}
                    </span>
                    <br />
                    <span className="text-white" style={{ opacity: 0.7 }}>
                      Currency: {clientForm.currency} | Hourly: {clientForm.hourlyRate}
                    </span>
                    <br />
                    <span className="text-white" style={{ opacity: 0.7 }}>
                      PMs: {clientForm.managers}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-link text-light"
                    onClick={() => handleEditClient(0)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => handleDeleteClient(0)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            )}

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
              <button
                className="btn btn-primary"
                onClick={handleAddTask}
                disabled={!newTask.trim()}
              >
                +
              </button>
            </div>

            <div className="border rounded p-2 mb-2 border-secondary"
              style={{
                border: "2px solid #7b2ff2",
                borderRadius: 10,
                background: "rgba(20,30,70,0.7)",
                maxHeight: "400px", // Added fixed height
                overflowY: "auto", // Added scroll for overflow
                padding: "10px",
              }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                >
                  <span className="text-white">{task.taskName}</span>
                  <div className="btn-group btn-group-sm">
                    {/* Placeholder for future edit functionality */}
                    <button
                      className="btn btn-sm btn-link text-light"
                      onClick={() => handleEditTask(task.id, task.taskName)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

              <button
                className="btn btn-primary"
                onClick={handleAddapplication}
                disabled={!newapplication.trim()}
              >
                +
              </button>

            </div>
            <div className="border rounded p-2 mb-2 border-secondary"
              style={{
                border: "2px solid #7b2ff2",
                borderRadius: 10,
                background: "rgba(20,30,70,0.7)",
                maxHeight: "400px", // Added fixed height
                overflowY: "auto", // Added scroll for overflow
                padding: "10px",
              }}>
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                >
                  <span className="text-white">{application.applicationName}</span>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-sm btn-link text-light"
                      onClick={() =>
                        handleEditApplication(application.id, application.applicationName)
                      }
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteApplication(application.id)}
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
            <div className="border rounded p-2 mb-2 border-secondary"
              style={{
                border: "2px solid #7b2ff2",
                borderRadius: 10,
                background: "rgba(20,30,70,0.7)",
                maxHeight: "400px", // Added fixed height
                overflowY: "auto", // Added scroll for overflow
                padding: "10px",
              }}>
              {languages.map((language, index) => (
                <div
                  key={language.id}
                  className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                >
                  <span className="text-white">{language.languageName}</span>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-sm btn-link text-light"
                      onClick={() => handleEditLanguage(language.id, language.languageName)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteLanguage(language.id)}
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
            <div className="border rounded p-2 mb-2 border-secondary table-gradient-bg"
              style={{
                border: "2px solid #7b2ff2",
                borderRadius: 10,
                background: "rgba(20,30,70,0.7)",
                maxHeight: "400px", // Added fixed height
                overflowY: "auto", // Added scroll for overflow
                padding: "10px",
              }}>
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
                            className="btn btn-sm btn-link text-light"
                            onClick={() => handleEditClient(idx)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
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

        </div>
      </div>
    </div>
  );
}