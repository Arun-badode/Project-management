import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const Setting = () => {
  const [activeTab] = useState("created");
  const [searchQuery] = useState("");
  const [setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [setShowSettings] = useState(false);

  const searchInputRef = useRef(null);
  const chartRef = useRef(null);

  const [clients, setClients] = useState([
    { alias: "Client Alpha (Alias)", actualName: "Actual Client Alpha Inc.", country: "USA", managers: "Jane Doe, John Smith" },
    { alias: "Company Beta (Alias)", actualName: "Actual Company Beta Ltd.", country: "UK", managers: "Peter Jones" },
    { alias: "Service Gamma (Alias)", actualName: "Actual Service Gamma LLC", country: "Canada", managers: "Alice Brown, Bob White" },
  ]);

  const [tasks, setTasks] = useState(["Backend Dev", "API Integration", "Frontend Dev", "QA Testing"]);
  const [languages, setLanguages] = useState(["English", "Spanish", "French", "German"]);
  const [applications, setapplications] = useState(["Web", "Mobile Responsive", "iOS", "Android"]);
  const [currencies, setCurrencies] = useState([{ name: "USD", rate: "83" }, { name: "EUR", rate: "90" }, { name: "GBP", rate: "90" }]);

  const [newClient, setNewClient] = useState({ alias: "", actualName: "", country: "", managers: "" , currency: "", hourlyRate: "" });
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

  return (
    <div className="container">
      <h6 className="text-white-50">Manage predefined lists for project creation and other application settings.</h6>

      {/* Manage Clients */}
      <div className="mb-4">
        <h6 className="mb-3 text-white">Manage Clients</h6>
        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <input type="text" className="form-control text-white border-secondary" placeholder="New Client Alias Name" value={newClient.alias} onChange={(e) => setNewClient({ ...newClient, alias: e.target.value })} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control bg-secondary text-white border-secondary" placeholder="Actual Client Name*" value={newClient.actualName} onChange={(e) => setNewClient({ ...newClient, actualName: e.target.value })} />
          </div>
        </div>
        <div className="row g-2 mb-2">
          <div className="col-md-4">
            <input type="text" className="form-control bg-secondary text-white border-secondary" placeholder="Country*" value={newClient.country} onChange={(e) => setNewClient({ ...newClient, country: e.target.value })} />
          </div>
            <div className="col-md-4">
            <input type="text" className="form-control bg-secondary text-white border-secondary" placeholder="Currency*" value={newClient.country} onChange={(e) => setNewClient({ ...newClient, currency: e.target.value })} />
          </div>
            <div className="col-md-4">
            <input type="text" className="form-control bg-secondary text-white border-secondary" placeholder="Hourly Rate" value={newClient.country} onChange={(e) => setNewClient({ ...newClient, hourlyRate: e.target.value })} />
          </div>
        </div>
        <div className="input-group mb-2">
          <input type="text" className="form-control bg-secondary text-white border-secondary" placeholder="Project Managers (comma-sep)" value={newClient.managers} onChange={(e) => setNewClient({ ...newClient, managers: e.target.value })} />
          <button className="btn btn-primary" onClick={handleAddClient} disabled={!newClient.alias || !newClient.actualName || !newClient.country}>+</button>
        </div>
        <div className="border rounded p-2 mb-2 border-secondary bg-card">
          {clients.map((client, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center py-2 px-2 mb-2 rounded">
              <span className="text-white">
                <strong>{client.alias}</strong> ({client.actualName})<br />
                Country: {client.country}<br />
                PMs: {client.managers}
              </span>
              <div className="btn-group btn-group-sm gap-2">
               <div>
                 <button className="btn btn-outline-secondary btn-sm me-2" ><i class="fa-solid fa-pen"></i></button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteItem(applications, setapplications, index)}>
                <i className="fas fa-trash-alt"></i>
              </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manage Tasks List */}
      <div className="mb-4">
        <h6 className="mb-3 text-white">Manage Tasks List</h6>
        <div className="input-group mb-2">
          <input type="text" className="form-control bg-secondary text-white border-secondary" placeholder="New task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} />
          <button className="btn btn-primary" onClick={handleAddTask} disabled={!newTask}>+</button>
        </div>
        <div className="border rounded p-2 mb-2 border-secondary bg-card">
          {tasks.map((task, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center py-2 px-2 mb-1 rounded">
              <span className="text-white">{task}</span>
              <div>
                 <button className="btn btn-outline-secondary btn-sm me-2" ><i class="fa-solid fa-pen"></i></button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteItem(applications, setapplications, index)}>
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
          <input type="text" className="form-control bg-secondary text-white border-secondary" placeholder="New application..." value={newapplication} onChange={(e) => setNewapplication(e.target.value)} />
          <button className="btn btn-primary" onClick={handleAddapplication} disabled={!newapplication}>+</button>
        </div>
        <div className="border rounded p-2 mb-2 border-secondary bg-card">
          {applications.map((application, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center py-2 px-2 mb-1 rounded">
              <span className="text-white">{application}</span>
              <div>
                 <button className="btn btn-outline-secondary btn-sm me-2" ><i class="fa-solid fa-pen"></i></button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteItem(applications, setapplications, index)}>
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
          <input type="text" className="form-control bg-secondary text-white border-secondary" placeholder="New language..." value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} />
          <button className="btn btn-primary" onClick={handleAddLanguage} disabled={!newLanguage}>+</button>
        </div>
        <div className="border rounded p-2 mb-2 border-secondary bg-card">
          {languages.map((language, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center py-2 px-2 mb-1 rounded">
              <span className="text-white">{language}</span>
              <div>
                 <button className="btn btn-outline-secondary btn-sm me-2" ><i class="fa-solid fa-pen"></i></button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteItem(languages, setLanguages, index)}>
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
          <div className="col-md-6">
            <input type="text" className="form-control bg-card text-white border-secondary" placeholder="Currency (e.g. USD)" value={newCurrency.name} onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control bg-card text-white border-secondary" placeholder="Rate to INR" value={newCurrency.rate} onChange={(e) => setNewCurrency({ ...newCurrency, rate: e.target.value })} />
          </div>
        </div>
        <div className="border rounded p-2 mb-2 border-secondary">
          <table className="table table-gradient-bg table-sm mb-0">
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
                    <button className="btn btn-outline-secondary btn-sm me-2" ><i class="fa-solid fa-pen"></i></button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteItem(currencies, setCurrencies, index)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <button className="btn btn-sm btn-primary" onClick={handleAddCurrency} disabled={!newCurrency.name || !newCurrency.rate}>
          <i className="fas fa-plus me-1"></i> Add Currency
        </button> */}
      </div>
    </div>
  );
};

export default Setting;
