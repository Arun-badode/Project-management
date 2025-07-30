import React, { useState } from "react";
import "./SettingsPage.css";

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
  const [clients, setClients] = useState(initialClients);
  const [clientForm, setClientForm] = useState({
    alias: "",
    actual: "",
    country: "",
    currency: "",
    hourlyRate: "",
    managers: "",
  });
  const [editClientIdx, setEditClientIdx] = useState(null);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientForm((prev) => ({ ...prev, [name]: value }));
  };

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

        const handleDeleteItem = (list, setList, index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
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
                placeholder="New Client Alias Name*"
                name="alias"
                value={clientForm.alias}
                onChange={handleClientChange}
              />
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
              <input
                className="form-control"
                style={{ background: "#181f3a", color: "#fff" }}
                placeholder="Country*"
                name="country"
                value={clientForm.country}
                onChange={handleClientChange}
              />
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
            <input
              className="form-control"
              style={{ background: "#181f3a", color: "#fff" }}
              placeholder="Project Managers (comma-sep)"
              name="managers"
              value={clientForm.managers}
              onChange={handleClientChange}
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
              maxHeight: "400px", // Added fixed height
              overflowY: "auto", // Added scroll for overflow
              padding: "10px",
            }}
          >
            {clients.map((c, idx) => (
              <div
                className="client-item d-flex justify-content-between align-items-start"
                key={idx}
              
              >
                <div>
                  <b className="text-white">{c.alias} (Alias)</b>{" "}
                  <span className="text-white" style={{ opacity: 0.7 }}>
                    ({c.actual})
                  </span>
                  <div style={{ fontSize: "0.95em" }}>
                    <span className="text-white" style={{ opacity: 0.7 }}>
                      Country: {c.country}
                    </span>
                    <br />
                    <span className="text-white" style={{ opacity: 0.7 }}>
                      Currency: {c.currency} | Hourly: {c.hourlyRate}
                    </span>
                    <br />
                    <span className="text-white" style={{ opacity: 0.7 }}>
                      PMs: {c.managers}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-link text-light"
                    onClick={() => handleEditClient(idx)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => handleDeleteClient(idx)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
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
                    <button className="btn btn-primary"  onClick={handleAddTask}
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
                    className="btn btn-sm btn-link text-light"
                    onClick={() => handleEditClient(idx)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
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
                    <button className="btn btn-primary"  onClick={handleAddLanguage}
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
                    className="btn btn-sm btn-link text-light"
                    onClick={() => handleEditClient(idx)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
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