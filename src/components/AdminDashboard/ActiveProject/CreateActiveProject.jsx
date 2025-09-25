import React from 'react'
import BASE_URL from '../../../config';

const CreateActiveProject = () => {
      const [showCreateModal, setShowCreateModal] = useState(false);
       const [formData, setFormData] = useState({ languages: [] });

    const handleLanguageChange = (opts) => {
        const selectedLanguages = opts ? opts.map((o) => o.value) : [];

        setFormData((prev) => ({
            ...prev,
            languages: selectedLanguages,
        }));

        // Call API for each newly selected language
        selectedLanguages.forEach((lang) => {
            addLanguageAPI(lang);
        });
    };

    const addLanguageAPI = async (languageName) => {
        try {
            const response = await fetch(`${BASE_URL}language/addlanguage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ languageName }),
            });

            if (response.ok) {
                console.log(`${languageName} added successfully`);
            } else {
                console.error(`Failed to add ${languageName}`);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <div
                className="modal fade show d-block custom-modal-dark"
                tabIndex="-1"
                aria-modal="true"
                role="dialog"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between">
                            <div>
                                <h5 className="modal-title">Create New Project</h5>
                            </div>

                            <div>
                                {/* <button className="btn btn-light btn-sm me-4 ">
                          <i className="fas fa-cog text-muted"></i>
                        </button> */}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCreateModal(false)}
                                ></button>
                            </div>
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
                                    <div className="form-text text-white">
                                        Max allowed Character length – 80, (ignore or remove any
                                        special character by itself)
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
                                            readOnly
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
                                            placeholder=" Searchable Dropdown"
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
                                            options={taskOptions.map((t) => ({
                                                value: t,
                                                label: t,
                                            }))}
                                            value={
                                                formData.tasks.length
                                                    ? formData.tasks.map((t) => ({
                                                        value: t,
                                                        label: t,
                                                    }))
                                                    : []
                                            }
                                            onChange={(opts) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    tasks: opts ? opts.map((o) => o.value) : [],
                                                }))
                                            }
                                            isMulti
                                            isSearchable
                                            placeholder="Select Task(s)"
                                            styles={gradientSelectStyles}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="application" className="form-label">
                                            Applications <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            id="application"
                                            name="application"
                                            options={applicationOptions.map((a) => ({
                                                value: a,
                                                label: a,
                                            }))}
                                            value={
                                                formData.application.length
                                                    ? formData.application.map((a) => ({
                                                        value: a,
                                                        label: a,
                                                    }))
                                                    : []
                                            }
                                            onChange={(opts) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    application: opts ? opts.map((o) => o.value) : [],
                                                }))
                                            }
                                            isMulti
                                            isSearchable
                                            placeholder="Select Application(s)"
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
                                        options={languageOptions.map((l) => ({
                                            value: l,
                                            label: l,
                                        }))}
                                        value={
                                            formData.languages.length
                                                ? formData.languages.map((l) => ({
                                                    value: l,
                                                    label: l,
                                                }))
                                                : []
                                        }
                                        onChange={(opts) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                languages: opts ? opts.map((o) => o.value) : [],
                                            }))
                                        }
                                        isMulti
                                        isSearchable
                                        placeholder="Select Languages"
                                        styles={gradientSelectStyles}
                                    />
                                    <div className="form-text text-white">
                                        {formData.languages.length} selected
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
                                                    backgroundColor: "#fff", // Match your background color
                                                }}
                                            >
                                                <tr className="text-center">
                                                    <th>
                                                        S.No.
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.files.every(
                                                                (file) => file.selected
                                                            )}
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
                                                    {/* <th>Language</th> */}
                                                    <th>Application</th>
                                                    {/* <th>Status</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.files.map((file, idx) => (
                                                    <tr key={idx} className="text-center">
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
                                                                    files[idx].pageCount = Number(
                                                                        e.target.value
                                                                    );
                                                                    setFormData((prev) => ({ ...prev, files }));
                                                                }}
                                                                placeholder="Pages"
                                                            />
                                                        </td>

                                                        {/* <td>th</td> */}

                                                        <td>
                                                            <select
                                                                className="form-select"
                                                                value={file.application || ""}
                                                                onChange={(e) => {
                                                                    const newApp = e.target.value;
                                                                    const files = [...formData.files];

                                                                    // check if current row is selected
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
                                                                    <option key={app} value={app}>
                                                                        {app}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>

                                                        {/* <td>TYS</td> */}
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
                                            <label className="form-label">
                                                Total Pages Per Lang
                                            </label>
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
                                            <label className="form-label">
                                                Total Project Pages
                                            </label>
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
                                                    formData.billingMode === "estimated" ||
                                                    !formData.billingMode
                                                }
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        billingMode: e.target.value,
                                                        // Reset rate when switching to estimated hours
                                                        rate:
                                                            e.target.value === "estimated" ? "" : prev.rate,
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
                                                    // Auto-calculate cost when estimated hours change
                                                    cost: value * (prev.hourlyRate || 0),
                                                    inrCost:
                                                        value *
                                                        (prev.hourlyRate || 0) *
                                                        (prev.exchangeRate || 1),
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

                                    {/* Hourly Rate (auto-filled from client settings) */}
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
                                                    // Recalculate costs when rate changes
                                                    cost: prev.estimatedHrs * rate,
                                                    inrCost:
                                                        prev.estimatedHrs *
                                                        rate *
                                                        (prev.exchangeRate || 1),
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
                                                        // Reset estimated hours when switching to per page
                                                        estimatedHrs:
                                                            e.target.value === "perPage"
                                                                ? ""
                                                                : prev.estimatedHrs,
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
                                                    // Auto-calculate cost when rate changes
                                                    cost: rate * totalPages,
                                                    inrCost:
                                                        rate * totalPages * (prev.exchangeRate || 1),
                                                }));
                                            }}
                                            placeholder="00.00"
                                            disabled={formData.billingMode !== "perPage"}
                                        />
                                        <div className="form-text text-white">
                                            (with only 2 decimals)
                                        </div>
                                    </div>

                                    {/* Currency (auto-filled from client settings) */}
                                    <div className="col-md-2">
                                        <label className="form-label">Currency</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.currency || "USD"} // Default to USD if not set
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
                                        <label
                                            className="text-white"
                                            style={{ fontWeight: "bold" }}
                                        >
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
                                                    placeholder="Select date and time"
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
                                                            {months[selectedMonth].substring(0, 3)},{" "}
                                                            {selectedYear}
                                                        </div>
                                                    </div>

                                                    <div className="time-calendar-container">
                                                        <div className="time-selector">
                                                            <div className="time-column">
                                                                <div className="time-column-label">Hour</div>
                                                                <div className="time-scroll">
                                                                    <div className="time-options">
                                                                        {[
                                                                            12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                                                        ].map((hour) => (
                                                                            <button
                                                                                key={hour}
                                                                                onClick={() => setSelectedHour(hour)}
                                                                                className={`time-option ${selectedHour === hour
                                                                                    ? "selected-hour"
                                                                                    : ""
                                                                                    }`}
                                                                            >
                                                                                {hour.toString().padStart(2, "0")}
                                                                            </button>
                                                                        ))}
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
                                                                                onClick={() =>
                                                                                    setSelectedMinute(minute)
                                                                                }
                                                                                className={`time-option ${selectedMinute === minute
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
                                                                <div className="time-column-label">
                                                                    Period
                                                                </div>
                                                                <div className="period-options">
                                                                    <button
                                                                        onClick={() => setIsAM(true)}
                                                                        className={`period-option ${isAM ? "selected" : ""
                                                                            }`}
                                                                    >
                                                                        AM
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setIsAM(false)}
                                                                        className={`period-option ${!isAM ? "selected" : ""
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
                                                                        className={`calendar-day ${dayObj.isCurrentMonth
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
                                                                        setSelectedDate(new Date().getDate());
                                                                        setSelectedMonth(new Date().getMonth());
                                                                        setSelectedYear(new Date().getFullYear());
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateActiveProject
