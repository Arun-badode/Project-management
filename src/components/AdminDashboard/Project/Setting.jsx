import React, { useEffect, useState } from "react";
import "./Setting.css";
import axios from "axios";
import BASE_URL from "../../../config";

const initialClients = [
  {
    id: 1,
    clientName: "Client Alpha Inc.",
    country: "US",
    currency: "USD",
    hourlyRate: "50.00",
    managers: "Jane Doe, John Smith",
  },
  {
    id: 2,
    clientName: "Company Beta Ltd.",
    country: "GB",
    currency: "GBP",
    hourlyRate: "60.00",
    managers: "Peter Jones",
  },
  {
    id: 3,
    clientName: "Service Gamma LLC",
    country: "CA",
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
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});

  const [clientForm, setClientForm] = useState({
    id: "",
    clientName: "",
    country: "",
    currency: "",
    hourlyRate: "",
    managers: "",
  });

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get("https://open.er-api.com/v6/latest/USD");
        const currencyCodes = Object.keys(res.data.rates);
        setCurrencyOptions(currencyCodes);
        setExchangeRates(res.data.rates);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  // fetch project details from the api 
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
        const res = await fetch("https://restcountries.com/v3.1/all?fields=cca2,currencies");
        const data = await res.json();

        // Extract country codes and their currencies
        const countryList = data
          .map((c) => ({
            code: c.cca2,
            currency: c.currencies ? Object.keys(c.currencies)[0] : null
          }))
          .filter(c => c.currency) // Only include countries with currencies
          .sort((a, b) => a.code.localeCompare(b.code));

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
          // Sort applications alphabetically
          const sortedApplications = [...res.data.application].sort((a, b) => 
            a.applicationName.localeCompare(b.applicationName)
          );
          setApplications(sortedApplications);
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
          setClients(response.data.clients);
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleClientChange = (e) => {
    const { name, value } = e.target;

    if (name === "id") {
      const selectedClient = clients.find(client => client.id.toString() === value);

      setClientForm((prev) => ({
        ...prev,
        [name]: value,
        clientName: selectedClient?.clientName || "",
        country: selectedClient?.country || "",
        currency: selectedClient?.currency || "",
        hourlyRate: selectedClient?.hourlyRate || "",
        managers: selectedClient?.managers || "",
      }));
    } else if (name === "country") {
      // Auto-select currency based on country
      const selectedCountry = countries.find(c => c.code === value);
      const currencyForCountry = selectedCountry ? selectedCountry.currency : "";
      
      setClientForm((prev) => ({
        ...prev,
        [name]: value,
        currency: currencyForCountry
      }));
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

  const handleAddOrEditClient = async () => {
    if (
      !clientForm.clientName.trim() ||
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

    try {
      if (editClientIdx !== null) {
        // Update existing client
        const response = await axios.put(
          `${BASE_URL}client/updateClient/${clientForm.id}`,
          updatedClient,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          const updated = [...clients];
          updated[editClientIdx] = updatedClient;
          setClients(updated);
          setEditClientIdx(null);
        }
      } else {
        // Add new client
        const response = await axios.post(
          `${BASE_URL}client/addClients`,
          updatedClient,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setClients([...clients, response.data.client]);
        }
      }

      setClientForm({
        id: "",
        clientName: "",
        country: "",
        currency: "",
        hourlyRate: "",
        managers: "",
      });
    } catch (error) {
      console.error("Failed to save client:", error);
    }
  };

  const handleEditClient = (idx) => {
    setEditClientIdx(idx);
    setClientForm(clients[idx]);
  };

  const handleDeleteClient = async (idx) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    try {
      const clientId = clients[idx].id;
      // Make sure the URL matches your API endpoint exactly
      const response = await axios.delete(
        `${BASE_URL}client/deleteClient/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setClients(clients.filter((_, i) => i !== idx));
        if (editClientIdx === idx) setEditClientIdx(null);
      } else {
        alert("Failed to delete client: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(`Error: ${error.response.status} - ${error.response.data.message || "Server error"}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response received from server. Please check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        alert("Error: " + error.message);
      }
    }
  };

  const [newLanguage, setNewLanguage] = useState("");
  const [newCurrency, setNewCurrency] = useState({ name: "", rate: "" });
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
        // Sort tasks alphabetically
        const sortedTasks = [...res.data.tasks].sort((a, b) => 
          a.taskName.localeCompare(b.taskName)
        );
        setTasks(sortedTasks);
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
        
        // Add new task and sort alphabetically
        const updatedTasks = [...tasks, newAddedTask].sort((a, b) => 
          a.taskName.localeCompare(b.taskName)
        );
        setTasks(updatedTasks);
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

        // Update task and maintain alphabetical order
        const updatedTasks = tasks
          .map((task) => task.id === id ? updatedTask : task)
          .sort((a, b) => a.taskName.localeCompare(b.taskName));
        
        setTasks(updatedTasks);
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
        // Add new language and sort alphabetically
        const updatedLanguages = [...languages, res.data.language].sort((a, b) => 
          a.languageName.localeCompare(b.languageName)
        );
        setLanguages(updatedLanguages);
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
        
        // Add new application and sort alphabetically
        const updatedApplications = [...applications, addedApp].sort((a, b) => 
          a.applicationName.localeCompare(b.applicationName)
        );
        setApplications(updatedApplications);
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

        // Update language and maintain alphabetical order
        const updatedLanguages = languages
          .map((lang) => (lang.id === id ? updatedLang : lang))
          .sort((a, b) => a.languageName.localeCompare(b.languageName));
        
        setLanguages(updatedLanguages);
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

        // Update application and maintain alphabetical order
        const updatedApplications = applications
          .map((app) => (app.id === id ? updatedApp : app))
          .sort((a, b) => a.applicationName.localeCompare(b.applicationName));
        
        setApplications(updatedApplications);
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

  const handleDeleteApplication = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this application?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.delete(
        `${BASE_URL}application/deleteApplicationById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        // Remove the deleted application from the UI
        setApplications((prev) => prev.filter((app) => app.id !== id));
      } else {
        alert("Failed to delete the application.");
      }
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Something went wrong while deleting.");
    }
  };

  const handleAddCurrency = () => {
    if (newCurrency.name && newCurrency.rate) {
      setCurrencies([...currencies, newCurrency]);
      setNewCurrency({ name: "", rate: "" });
    }
  };

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
          // Sort languages alphabetically
          const sortedLanguages = [...res.data.languages].sort((a, b) => 
            a.languageName.localeCompare(b.languageName)
          );
          setLanguages(sortedLanguages);
        }
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      } finally {
        // Optional: setLoadingLanguages(false); if you're handling loading state
      }
    };

    fetchLanguages();
  }, []);

  const [currencies, setCurrencies] = useState([
    { name: "USD", rate: "83" },
    { name: "EUR", rate: "90" },
    { name: "GBP", rate: "90" },
  ]);

  const handleDeleteItem = (list, setList, index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    if (currency && exchangeRates[currency]) {
      // Convert to INR (assuming USD is base)
      const rateToINR = (1 / exchangeRates[currency]).toFixed(2);
      setNewCurrency({
        name: currency,
        rate: rateToINR
      });
    }
  };

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
              <input
                className="form-control"
                style={{ background: "#181f3a", color: "#fff" }}
                placeholder="Client Name*"
                name="clientName"
                value={clientForm.clientName}
                onChange={handleClientChange}
              />
            </div>
            <div className="col-md-6 mb-2">
              <select
                className="form-control"
                name="country"
                value={clientForm.country}
                onChange={handleClientChange}
                style={{ background: "#181f3a", color: "#fff" }}
              >
                <option value="">-- Select Country --</option>
                {countries.map((country, idx) => (
                  <option key={idx} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second row */}
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
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

            <div className="col-md-6 mb-2">
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

          {/* Third row */}
          <div className="d-flex gap-2 mb-2 flex-wrap">
            <input
              type="text"
              className="form-control"
              placeholder="Project Managers (comma-separated)"
              name="managers"
              value={clientForm.managers}
              onChange={handleClientChange}
              style={{ background: "#181f3a", color: "#fff" }}
            />

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
            {clients.length === 0 ? (
              <p className="text-white" style={{ opacity: 0.6 }}>
                No clients available.
              </p>
            ) : (
              clients.map((client, index) => (
                <div key={client.id} className="client-item d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <b className="text-white">{client?.clientName}</b>
                    <div style={{ fontSize: "0.95em" }}>
                      <span className="text-white" style={{ opacity: 0.7 }}>
                        Country: {client?.country}
                      </span>
                      <br />
                      <span className="text-white" style={{ opacity: 0.7 }}>
                        Currency: {client?.currency} | Hourly: {client?.hourlyRate}
                      </span>
                      <br />
                      <span className="text-white" style={{ opacity: 0.7 }}>
                        PMs: {client?.managers}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-link text-light"
                      onClick={() => handleEditClient(index)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-link text-danger"
                      onClick={() => handleDeleteClient(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))
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
                maxHeight: "400px",
                overflowY: "auto",
                padding: "10px",
              }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="d-flex justify-content-between align-items-center py-2 px-2 bg-card mb-1 rounded"
                >
                  <span className="text-white">{task.taskName}</span>
                  <div className="btn-group btn-group-sm">
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
                maxHeight: "400px",
                overflowY: "auto",
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
                maxHeight: "400px",
                overflowY: "auto",
                padding: "10px",
              }}>
              {languages.map((language) => (
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
          </div>

          {/* Currency Conversion Rates */}
          <div className="mb-4">
            <h6 className="mb-3 text-white">Currency Conversion Rates</h6>
            <div className="row g-2 mb-2">
              <div className="col-md-5">
                <select
                  className="form-control bg-card text-white border-secondary"
                  value={newCurrency.name}
                  onChange={handleCurrencyChange}
                  style={{ background: "#181f3a", color: "#fff" }}
                >
                  <option value="">-- Select Currency --</option>
                  {currencyOptions.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control bg-card text-white border-secondary"
                  placeholder="Rate to INR"
                  value={newCurrency.rate}
                  readOnly
                  style={{ background: "#181f3a", color: "#fff" }}
                />
              </div>
              <div className="col-md-2">
               <button
              className="btn  btn-gradient"
              onClick={handleAddCurrency}
              disabled={!newCurrency.name || !newCurrency.rate}
            >
              <i className="fas fa-plus me-1"></i> 
            </button>
            </div>
            </div>
            <div className="border rounded p-2 mb-2 border-secondary table-gradient-bg"
              style={{
                border: "2px solid #7b2ff2",
                borderRadius: 10,
                background: "rgba(20,30,70,0.7)",
                maxHeight: "400px",
                overflowY: "auto",
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
                            onClick={() => handleEditClient(index)}
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
           
          </div>
        </div>
      </div>
    </div>
  );
}