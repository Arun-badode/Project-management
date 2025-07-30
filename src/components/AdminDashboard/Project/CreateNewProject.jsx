import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Select from "react-select";
import axios from "axios";
import BASE_URL from "../../../config";

// Helper functions moved outside the component
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const generateCalendarDays = (selectedMonth, selectedYear) => {
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

const CreateNewProject = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);

  const calendarDays = generateCalendarDays(selectedMonth, selectedYear);

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

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Options for dropdowns
  const clientOptions = [
    "PN",
    "MMP Auburn",
    "MMP Eastlake",
    "MMP Kirkland",
    "GN",
    "DM",
    "RN",
    "NI",
    "LB",
    "SSS",
    "Cpea",
    "CV",
  ];

  const gradientSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
      borderColor: state.isFocused ? "#ffffff66" : "#ffffff33",
      boxShadow: state.isFocused ? "0 0 0 1px #ffffff66" : "none",
      minHeight: "38px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#1b2f6e",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#293d80"
        : "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      background: "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
    }),
  };

  const projectManagerOptions = [
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Wilson",
    "David Lee",
  ];

  const [taskOptions, setTaskOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}tasks/getAllTasks`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          const options = res.data.tasks.map((task) => ({
            value: task.id,
            label: task.taskName,
          }));
          setTaskOptions(options);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [applicationOptions, setApplicationOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}application/getAllApplication`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          const options = res.data.application.map((app) => ({
            value: app.id,
            label: app.applicationName,
          }));
          setApplicationOptions(options);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const [languageOptions, setLanguageOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}language/getAlllanguage`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          const options = res.data.languages.map((lang) => ({
            value: lang.id,
            label: lang.languageName,
          }));
          setLanguageOptions(options);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDateTime = () => {
    if (selectedDate === null) {
      return "00/00/00 00:00 AM";
    }
    const date = `${selectedDate.toString().padStart(2, "0")}/${(
      selectedMonth + 1
    )
      .toString()
      .padStart(2, "0")}/${selectedYear.toString().slice(-2)}`;
    const time = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${isAM ? "AM" : "PM"}`;
    return `${date} ${time}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Project Title */}
        <div className="row mb-3 col-md-12">
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
          <div className="form-text text-white">
            Max allowed Character length – 80, (ignore or remove any special
            character by itself)
          </div>
        </div>

        {/* Client, Country, Project Manager */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label htmlFor="client" className="form-label">
              Client <span className="text-danger">*</span>
            </label>
            <Select
              id="client"
              name="client"
              options={clientOptions.map((c) => ({
                value: c,
                label: c,
              }))}
              value={
                formData.client
                  ? { value: formData.client, label: formData.client }
                  : null
              }
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  client: opt ? opt.value : "",
                }))
              }
              isSearchable
              placeholder="Select Client"
              styles={gradientSelectStyles}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              type="text"
              className="form-control"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder=""
             
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="projectManager" className="form-label">
              Project Manager
            </label>
            <Select
              id="projectManager"
              name="projectManager"
              options={projectManagerOptions.map((pm) => ({
                value: pm,
                label: pm,
              }))}
              value={
                formData.projectManager
                  ? {
                      value: formData.projectManager,
                      label: formData.projectManager,
                    }
                  : null
              }
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  projectManager: opt ? opt.value : "",
                }))
              }
              isSearchable
              placeholder="Searchable Dropdown"
              styles={gradientSelectStyles}
            />
          </div>
        </div>

        {/* Task & Applications */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="task" className="form-label">
              Task <span className="text-danger">*</span>
            </label>
            <Select
              id="task"
              name="task"
              options={taskOptions}
              value={
                taskOptions?.length && formData?.tasks?.length
                  ? taskOptions.filter((opt) =>
                      formData.tasks.includes(opt.value)
                    )
                  : []
              }
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  tasks: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
              isMulti
              isSearchable
              placeholder={loading ? "Loading..." : "Select Task(s)"}
              styles={gradientSelectStyles}
            />
            <div className="form-text text-white">
              {formData?.tasks?.length || 0} selected
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="application" className="form-label">
              Applications <span className="text-danger">*</span>
            </label>
            <Select
              id="application"
              name="application"
              options={applicationOptions}
              value={applicationOptions?.filter((opt) =>
                formData?.application?.includes(opt.value)
              )}
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  application: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
              isMulti
              isSearchable
              placeholder={loading ? "Loading..." : "Select Application(s)"}
              styles={gradientSelectStyles}
            />
          </div>
        </div>

        {/* Languages */}
        <div className="mb-3">
          <label className="form-label">
            Languages <span className="text-danger">*</span>
          </label>
          <Select
            options={languageOptions}
            value={languageOptions?.filter((opt) =>
              formData?.languages?.includes(opt.value)
            )}
            onChange={(selectedOptions) =>
              setFormData((prev) => ({
                ...prev,
                languages: selectedOptions
                  ? selectedOptions.map((opt) => opt.value)
                  : [],
              }))
            }
            isMulti
            isSearchable
            placeholder={loading ? "Loading..." : "Select Languages"}
            styles={gradientSelectStyles}
          />
          <div className="form-text text-white">
            {formData?.languages?.length} selected
          </div>
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
              onChange={(e) => {
                const count = Math.max(1, Number(e.target.value));
                setFormData((prev) => ({
                  ...prev,
                  files: Array.from(
                    { length: count },
                    (_, i) =>
                      prev.files[i] || {
                        name: "",
                        pageCount: 0,
                        application: "",
                      }
                  ),
                }));
              }}
            />
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => {
                /* handle excel upload */
              }}
            >
              Upload Excel
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead
                className="table-gradient-bg table"
                style={{
                  position: "sticky",
                  top: "-2px",
                  zIndex: 0,
                  backgroundColor: "#fff",
                }}
              >
                <tr className="text-center">
                  <th>
                    S.No.
                    <input
                      type="checkbox"
                      checked={formData.files.every((file) => file.selected)}
                      onChange={(e) => {
                        const files = formData.files.map((file) => ({
                          ...file,
                          selected: e.target.checked,
                        }));
                        setFormData((prev) => ({ ...prev, files }));
                      }}
                    />
                  </th>
                  <th>File Name</th>
                  <th>Pages</th>
                  <th>Application</th>
                </tr>
              </thead>
              <tbody>
                {formData.files.map((file, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {idx + 1}
                        <input
                          type="checkbox"
                          checked={file.selected || false}
                          onChange={(e) => {
                            const files = [...formData.files];
                            files[idx].selected = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              files,
                            }));
                          }}
                        />
                      </div>
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={file.name}
                        onChange={(e) => {
                          const files = [...formData.files];
                          files[idx].name = e.target.value;
                          setFormData((prev) => ({ ...prev, files }));
                        }}
                        placeholder="File Name"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min={1}
                        className="form-control"
                        value={file.pageCount || ""}
                        onChange={(e) => {
                          const files = [...formData.files];
                          files[idx].pageCount = Number(e.target.value);
                          setFormData((prev) => ({ ...prev, files }));
                        }}
                        placeholder="Pages"
                      />
                    </td>

                    <td>
                      <select
                        className="form-select"
                        value={file.application || ""}
                        onChange={(e) => {
                          const newApp = e.target.value;
                          const files = [...formData.files];

                          if (files[idx].selected) {
                            files.forEach((f) => {
                              if (f.selected) f.application = newApp;
                            });
                          } else {
                            files[idx].application = newApp;
                          }

                          setFormData((prev) => ({ ...prev, files }));
                        }}
                      >
                        <option value="">Select</option>
                        {applicationOptions.map((app) => (
                          <option key={app.value} value={app.value}>
                            {app.label}
                          </option>
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
                value={formData.files.reduce(
                  (sum, file) => sum + (file.pageCount || 0),
                  0
                )}
                readOnly
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Total Project Pages</label>
              <input
                type="number"
                className="form-control"
                value={
                  formData.files.reduce(
                    (sum, file) => sum + (file.pageCount || 0),
                    0
                  ) * (formData.languages.length || 1)
                }
                readOnly
              />
            </div>
          </div>
          <div className="form-text text-white">
            Total Project Pages = Total Pages × Language Count
          </div>
        </div>

        {/* Received Date, Server Path, Notes */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label">
              Received Date <span className="text-danger">*</span>
            </label>
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
            <label className="form-label">
              Server Path <span className="text-danger">*</span>
            </label>
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
          {/* Estimated Hrs with radio */}
          <div className="col-md-3">
            <label className="form-label d-flex align-items-center gap-2">
              <input
                type="radio"
                name="billingMode"
                value="estimated"
                checked={
                  formData.billingMode === "estimated" || !formData.billingMode
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    billingMode: e.target.value,
                    rate: e.target.value === "estimated" ? "" : prev.rate,
                  }))
                }
              />
              Estimated Hrs
            </label>
            <input
              type="number"
              className="form-control"
              min="0"
              step="0.25"
              value={formData.estimatedHrs || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setFormData((prev) => ({
                  ...prev,
                  estimatedHrs: value,
                  cost: value * (prev.hourlyRate || 0),
                  inrCost:
                    value * (prev.hourlyRate || 0) * (prev.exchangeRate || 1),
                }));
              }}
              placeholder="00.00"
              disabled={
                formData.billingMode !== "estimated" &&
                formData.billingMode !== undefined
              }
            />
            <div className="form-text text-white">
              (in multiple of 0.25 only)
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="col-md-2">
            <label className="form-label">Hourly Rate</label>
            <input
              type="number"
              className="form-control"
              value={formData.hourlyRate || ""}
              onChange={(e) => {
                const rate = parseFloat(e.target.value) || 0;
                setFormData((prev) => ({
                  ...prev,
                  hourlyRate: rate,
                  cost: prev.estimatedHrs * rate,
                  inrCost: prev.estimatedHrs * rate * (prev.exchangeRate || 1),
                }));
              }}
              placeholder="Auto from Client"
            />
          </div>

          {/* Per Page Rate with radio */}
          <div className="col-md-3">
            <label className="form-label d-flex align-items-center gap-2">
              <input
                type="radio"
                name="billingMode"
                value="perPage"
                checked={formData.billingMode === "perPage"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    billingMode: e.target.value,
                    estimatedHrs:
                      e.target.value === "perPage" ? "" : prev.estimatedHrs,
                  }))
                }
              />
              Per Page Rate
            </label>
            <input
              type="number"
              className="form-control"
              min="0"
              step="0.01"
              value={formData.rate || ""}
              onChange={(e) => {
                const rate = parseFloat(e.target.value) || 0;
                const totalPages = formData.files.reduce(
                  (sum, file) => sum + (file.pageCount || 0),
                  0
                );
                setFormData((prev) => ({
                  ...prev,
                  rate: rate,
                  cost: rate * totalPages,
                  inrCost: rate * totalPages * (prev.exchangeRate || 1),
                }));
              }}
              placeholder="00.00"
              disabled={formData.billingMode !== "perPage"}
            />
            <div className="form-text text-white">(with only 2 decimals)</div>
          </div>

          {/* Currency */}
          <div className="col-md-2">
            <label className="form-label">Currency</label>
            <input
              type="text"
              className="form-control"
              value={formData.currency || "USD"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  currency: e.target.value,
                }))
              }
              placeholder="Auto from Client"
            />
          </div>

          {/* Total Cost */}
          <div className="col-md-2">
            <label className="form-label">Total Cost</label>
            <input
              type="text"
              className="form-control"
              value={formData.cost?.toFixed(2) || "0.00"}
              readOnly
              placeholder="Auto Calculated"
            />
          </div>

          {/* Cost in INR */}
          <div className="col-md-2">
            <label className="form-label">Cost in INR</label>
            <input
              type="text"
              className="form-control"
              value={formData.inrCost?.toFixed(2) || "0.00"}
              readOnly
              placeholder="Auto Calculated"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center mt-3 gap-3">
            <label className="text-white" style={{ fontWeight: "bold" }}>
              Deadline
            </label>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input  
                  type="text"
                  value={formatDateTime()}
                  readOnly
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-card w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  placeholder="00/00/00 00:00 AM"
                />
               
              </div>

              {isOpen && (
                <div className="calendar-dropdown">
                  <div className="time-display">
                    <div className="time">
                      {selectedHour.toString().padStart(2, "0")}:
                      {selectedMinute.toString().padStart(2, "0")}
                    </div>
                    <div className="period">{isAM ? "AM" : "PM"}</div>
                    <div className="date">
                      {selectedDate !== null
                        ? `${months[selectedMonth].substring(
                            0,
                            3
                          )}, ${selectedYear}`
                        : "00/00/00"}
                    </div>
                  </div>

                  <div className="time-calendar-container">
                    <div className="time-selector">
                      <div className="time-column">
                        <div className="time-column-label">Hour</div>
                        <div className="time-scroll">
                          <div className="time-options">
                            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
                              (hour) => (
                                <button
                                  key={hour}
                                  onClick={() => setSelectedHour(hour)}
                                  className={`time-option ${
                                    selectedHour === hour ? "selected-hour" : ""
                                  }`}
                                >
                                  {hour.toString().padStart(2, "0")}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="time-column">
                        <div className="time-column-label">Min</div>
                        <div className="time-scroll">
                          <div className="time-options">
                            {[0, 15, 30, 45].map((minute) => (
                              <button
                                key={minute}
                                onClick={() => setSelectedMinute(minute)}
                                className={`time-option ${
                                  selectedMinute === minute
                                    ? "selected-minute"
                                    : ""
                                }`}
                              >
                                {minute.toString().padStart(2, "0")}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="time-column">
                        <div className="time-column-label">Period</div>
                        <div className="period-options">
                          <button
                            onClick={() => setIsAM(true)}
                            className={`period-option ${
                              isAM ? "selected" : ""
                            }`}
                          >
                            AM
                          </button>
                          <button
                            onClick={() => setIsAM(false)}
                            className={`period-option ${
                              !isAM ? "selected" : ""
                            }`}
                          >
                            PM
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="calendar-section">
                      <div className="month-nav">
                        <button onClick={handlePrevMonth}>
                          <ChevronLeft size={20} />
                        </button>
                        <h3>
                          {months[selectedMonth]}, {selectedYear}
                        </h3>
                        <button onClick={handleNextMonth}>
                          <ChevronRight size={20} />
                        </button>
                      </div>

                      <div className="weekdays">
                        {weekDays.map((day) => (
                          <div key={day} className="weekday">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="calendar-grid">
                        {calendarDays.map((dayObj, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              dayObj.isCurrentMonth &&
                              setSelectedDate(dayObj.day)
                            }
                            className={`calendar-day ${
                              dayObj.isCurrentMonth
                                ? selectedDate === dayObj.day
                                  ? "current-month selected"
                                  : "current-month"
                                : "other-month"
                            }`}
                          >
                            {dayObj.day}
                          </button>
                        ))}
                      </div>

                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setSelectedDate(null);
                            setSelectedHour(0);
                            setSelectedMinute(0);
                            setIsAM(true);
                          }}
                          className="action-button"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => {
                            const today = new Date();
                            setSelectedDate(today.getDate());
                            setSelectedMonth(today.getMonth());
                            setSelectedYear(today.getFullYear());
                            setSelectedHour(today.getHours() % 12 || 12);
                            setSelectedMinute(today.getMinutes());
                            setIsAM(today.getHours() < 12);
                          }}
                          className="action-button"
                        >
                          Today
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="done-section">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="done-button"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-warning fw-bold">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewProject;
