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
            }}
          >
            {clients.map((c, idx) => (
              <div
                className="client-item d-flex justify-content-between align-items-start"
                key={idx}
                style={{
                  border: "none",
                  background: "transparent",
                  marginBottom: 0,
                  marginTop: 8,
                }}
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
        </div>
      </div>
    </div>
  );
}
