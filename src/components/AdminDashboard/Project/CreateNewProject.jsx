import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Trash2,
  Upload,
} from "lucide-react";
import Select from "react-select";
import axios from "axios";
import BASE_URL from "../../../config";
import * as XLSX from "xlsx";

// Helper functions moved outside the component
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const generateCalendarDays = (selectedMonth, selectedYear, today) => {
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const days = [];

  // Previous month's trailing days
  const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const isPast =
      prevYear < today.getFullYear() ||
      (prevYear === today.getFullYear() && prevMonth < today.getMonth()) ||
      (prevYear === today.getFullYear() &&
        prevMonth === today.getMonth() &&
        day < today.getDate());

    days.push({
      day,
      isCurrentMonth: false,
      isNextMonth: false,
      isPast,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      selectedYear === today.getFullYear() &&
      selectedMonth === today.getMonth() &&
      day === today.getDate();
    const isPast =
      selectedYear < today.getFullYear() ||
      (selectedYear === today.getFullYear() &&
        selectedMonth < today.getMonth()) ||
      (selectedYear === today.getFullYear() &&
        selectedMonth === today.getMonth() &&
        day < today.getDate());

    days.push({
      day,
      isCurrentMonth: true,
      isNextMonth: false,
      isToday,
      isPast,
    });
  }

  // Next month's leading days
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      isNextMonth: true,
      isPast: false,
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
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const today = new Date();

  // State for showing/hiding input fields
  const [showClientInput, setShowClientInput] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [showApplicationInput, setShowApplicationInput] = useState(false);
  const [showLanguageInput, setShowLanguageInput] = useState(false);

  // State for new item names
  const [newClientName, setNewClientName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newApplicationName, setNewApplicationName] = useState("");
  const [newLanguageName, setNewLanguageName] = useState("");

  // State for form validation errors
  const [errors, setErrors] = useState({});

  const calendarDays = generateCalendarDays(selectedMonth, selectedYear, today);

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    country: "",
    projectManager: "",
    tasks: [],
    languages: [],
    application: [],
    files: [{ fileName: "", pageCount: 0, applicationId: "", selected: false }],
    totalPages: 0,
    receivedDate: new Date().toISOString().split("T")[0],
    serverPath: "",
    notes: "",
    rate: 0,
    currency: "USD",
    cost: 0,
    inrCost: 0,
    billingMode: "estimated",
    estimatedHrs: 0,
    hourlyRate: 0,
    exchangeRate: 1, // Added for INR conversion
  });

  // this state is for storing the file data form the ui
  const [fileList, setFileList] = useState([
    { fileName: "", pages: "", application: "" },
  ]);

  // Fetch managers from the API
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}member/getAllMembers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.client) {
      newErrors.client = "Client is required";
    }

    if (!formData.tasks.length) {
      newErrors.tasks = "At least one task is required";
    }

    if (!formData.application.length) {
      newErrors.application = "At least one application is required";
    }

    if (!formData.languages.length) {
      newErrors.languages = "At least one language is required";
    }

    // Validate files
    const fileErrors = [];
    formData.files.forEach((file, index) => {
      if (!file.fileName.trim()) {
        fileErrors[index] = {
          ...fileErrors[index],
          fileName: "File name is required",
        };
      }
      if (!file.pageCount || file.pageCount <= 0) {
        fileErrors[index] = {
          ...fileErrors[index],
          pageCount: "Valid page count is required",
        };
      }
      if (!file.applicationId) {
        fileErrors[index] = {
          ...fileErrors[index],
          applicationId: "Application is required",
        };
      }
    });

    if (fileErrors.length > 0) {
      newErrors.files = fileErrors;
    }

    if (!formData.receivedDate) {
      newErrors.receivedDate = "Received date is required";
    }

    if (!formData.serverPath.trim()) {
      newErrors.serverPath = "Server path is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Delete file function
  const handleDeleteFile = async (fileId, index) => {
    try {
      // If file has an ID, delete from backend
      if (fileId) {
        await axios.delete(
          `${BASE_URL}projectFiles/deleteProjectFile/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("File deleted from backend");
      }

      // Remove from frontend state
      const newFiles = [...formData.files];
      newFiles.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        files: newFiles.length
          ? newFiles
          : [
              {
                fileName: "",
                pageCount: 0,
                applicationId: "",
                selected: false,
              },
            ],
      }));
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("An error occurred while deleting the file.");
    }
  };

  // Post API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorElement = document.querySelector(".is-invalid");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const deadline =
      selectedYear && selectedMonth !== null && selectedDate !== null
        ? `${selectedYear}-${(selectedMonth + 1)
            .toString()
            .padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`
        : "0000-00-00";

    // Step 1: Prepare project data
    const formDataForApi = {
      projectTitle: formData.title,
      clientId: formData.client,
      country: formData.country,
      projectManagerId: formData.projectManager,
      taskId: formData.tasks[0],
      applicationId: formData.application[0],
      languageId: formData.languages[0],
      totalPagesLang: formData.files.reduce(
        (sum, file) => sum + (file.pageCount || 0),
        0
      ),
      totalProjectPages:
        formData.files.reduce((sum, file) => sum + (file.pageCount || 0), 0) *
        (formData.languages.length || 1),
      receiveDate: formData.receivedDate,
      serverPath: formData.serverPath,
      notes: formData.notes,
      estimatedHours: formData.estimatedHrs || 0,
      hourlyRate: formData.hourlyRate || 0,
      perPageRate: formData.rate || 0,
      currency: formData.currency,
      totalCost: formData.cost || 0,
      deadline,
      readyQCDeadline: "",
      qcHrs: 0,
      qcDueDate: "",
      priority: "Medium",
      status: deadline === "0000-00-00" ? "In Progress" : "Active",
    };

    try {
      // Step 2: Create project
      const response = await axios.post(
        `${BASE_URL}project/addProject`,
        formDataForApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const projectId = response?.data?.project?.id;

      console.log("✅ Project created:", response?.data);

      // Get language names for sorting
      const selectedLanguages = languageOptions
        .filter((lang) => formData.languages.includes(lang.value))
        .sort((a, b) => a.label.localeCompare(b.label));

      // Step 3: Create files for each language
      for (const lang of selectedLanguages) {
        for (const file of formData.files) {
          const filePayload = {
            projectId,
            fileName: file.fileName,
            pages: file.pageCount?.toString() || "0",
            languageId: lang.value,
            applicationId: file.applicationId,
            status: "Completed", // Default status
            deadline,
          };

          await axios.post(
            `${BASE_URL}projectFiles/addProjectFile`,
            filePayload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(
            "📁 File added for language",
            lang.label,
            ":",
            filePayload
          );
        }
      }

      alert("Project and all files created successfully!");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error creating project or adding files. Please try again.");
    }
  };

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
  const gradientSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
      borderColor: state.isFocused ? "#ffffff66" : "#ffffff33",
      boxShadow: state.isFocused ? "0 0 0 1px #ffffff66" : "none",
      minHeight: "38px",
      ...(errors.client && !formData.client ? { borderColor: "#dc3545" } : {}),
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
      backgroundColor: state.isFocused ? "#293d80" : "transparent",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      background: "linear-gradient(to bottom right, #141c3a, #1b2f6e)",
      color: "white",
    }),
  };

  const [taskOptions, setTaskOptions] = useState([]);
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);

  // Fetch tasks, applications, languages, and clients
  useEffect(() => {
    // Fetch tasks
    axios
      .get(`${BASE_URL}tasks/getAllTasks`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setTaskOptions(
            res.data.tasks.map((task) => ({
              value: task.id,
              label: task.taskName,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching tasks:", err));

    // Fetch applications
    axios
      .get(`${BASE_URL}application/getAllApplication`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setApplicationOptions(
            res.data.application.map((app) => ({
              value: app.id,
              label: app.applicationName,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching applications:", err));

    // Fetch languages
    axios
      .get(`${BASE_URL}language/getAlllanguage`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setLanguageOptions(
            res.data.languages.map((lang) => ({
              value: lang.id,
              label: lang.languageName,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching languages:", err));

    // Fetch clients
    axios
      .get(`${BASE_URL}client/getAllClients`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setClientOptions(
            res.data.clients.map((client) => ({
              value: client.id,
              label: client.clientName,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching clients:", err))
      .finally(() => setLoading(false));
  }, [token]);

  // Updated formatDateTime function to show Time first, then Date
  const formatDateTime = () => {
    if (selectedDate === null) {
      return "00:00 AM 00-00-00";
    }

    // Format time: HH:MM tt
    const hour =
      selectedHour === 0
        ? 12
        : selectedHour > 12
        ? selectedHour - 12
        : selectedHour;
    const time = `${hour.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${isAM ? "AM" : "PM"}`;

    // Format date: DD-MM-YY
    const date = `${selectedDate.toString().padStart(2, "0")}-${(
      selectedMonth + 1
    )
      .toString()
      .padStart(2, "0")}-${selectedYear.toString().slice(-2)}`;

    return `${time} ${date}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Client functions
  const handleAddClient = () => {
    setShowClientInput((prev) => {
      if (prev) setNewClientName("");
      return !prev;
    });
  };

  const handleConfirmAddClient = async () => {
    if (newClientName.trim() === "") return;

    try {
      const response = await axios.post(
        `${BASE_URL}client/addClients`,
        {
          clientName: newClientName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.status && data.club) {
        const newOption = {
          value: data.club.id,
          label: data.club.clientName,
        };

        setClientOptions((prev) => [...prev, newOption]);

        setFormData((prev) => ({
          ...prev,
          client: data.club.id,
        }));

        setNewClientName("");
        setShowClientInput(false);

        // Clear error when client is added
        if (errors.client) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.client;
            return newErrors;
          });
        }
      } else {
        alert("Failed to add client. Please try again.");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      alert("An error occurred while adding client.");
    }
  };

  // Task functions
  const handleAddTask = () => {
    setShowTaskInput((prev) => {
      if (prev) setNewTaskName("");
      return !prev;
    });
  };

  const handleConfirmAddTask = async () => {
    if (newTaskName.trim() === "") return;

    try {
      const response = await axios.post(
        `${BASE_URL}tasks/addTasks`,
        {
          taskName: newTaskName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.status && data.task) {
        const newOption = {
          value: data.task.id,
          label: data.task.taskName,
        };

        setTaskOptions((prev) => [...prev, newOption]);

        setFormData((prev) => ({
          ...prev,
          tasks: [...prev.tasks, data.task.id],
        }));

        setNewTaskName("");
        setShowTaskInput(false);

        // Clear error when task is added
        if (errors.tasks) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.tasks;
            return newErrors;
          });
        }
      } else {
        alert("Task added successfully!");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("An error occurred while adding task.");
    }
  };

  // Application functions
  const handleAddApplication = () => {
    setShowApplicationInput((prev) => {
      if (prev) setNewApplicationName("");
      return !prev;
    });
  };

  const handleConfirmAddApplication = async () => {
    if (newApplicationName.trim() === "") return;

    try {
      const response = await axios.post(
        `${BASE_URL}application/addApplication`,
        {
          applicationName: newApplicationName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.status && data.application) {
        const newOption = {
          value: data.application.id,
          label: data.application.applicationName,
        };

        setApplicationOptions((prev) => [...prev, newOption]);

        setFormData((prev) => ({
          ...prev,
          application: [...prev.application, data.application.id],
        }));

        setNewApplicationName("");
        setShowApplicationInput(false);

        // Clear error when application is added
        if (errors.application) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.application;
            return newErrors;
          });
        }
      } else {
        alert("Failed to add application. Please try again.");
      }
    } catch (error) {
      console.error("Error adding application:", error);
      alert("An error occurred while adding application.");
    }
  };

  // Language functions
  const handleAddLanguage = () => {
    setShowLanguageInput((prev) => {
      if (prev) setNewLanguageName("");
      return !prev;
    });
  };

  const handleConfirmAddLanguage = async () => {
    if (newLanguageName.trim() === "") return;

    try {
      const response = await axios.post(
        `${BASE_URL}language/addLanguage`,
        {
          languageName: newLanguageName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.status && data.language) {
        const newOption = {
          value: data.language.id,
          label: data.language.languageName,
        };

        setLanguageOptions((prev) => [...prev, newOption]);

        setFormData((prev) => ({
          ...prev,
          languages: [...prev.languages, data.language.id],
        }));

        setNewLanguageName("");
        setShowLanguageInput(false);

        // Clear error when language is added
        if (errors.languages) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.languages;
            return newErrors;
          });
        }
      } else {
        alert("Failed to add language. Please try again.");
      }
    } catch (error) {
      console.error("Error adding language:", error);
      alert("An error occurred while adding language.");
    }
  };

  // Updated Excel upload function
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        // Expecting columns: fileName, pageCount, applicationId
        const files = rows.map((row) => ({
          fileName: row.fileName || "",
          pageCount: Number(row.pageCount) || 0,
          applicationId: row.applicationId || "",
          selected: false,
        }));

        setFormData((prev) => ({
          ...prev,
          files: files.length ? files : prev.files,
        }));

        // Clear file errors when new files are uploaded
        if (errors.files) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.files;
            return newErrors;
          });
        }

        alert("Excel file uploaded successfully!");
      } catch (error) {
        console.error("Error processing Excel file:", error);
        alert("Error processing Excel file. Please check the format.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Filter application options based on selected applications in formData
  const filteredApplicationOptions = applicationOptions.filter((app) =>
    formData.application.includes(app.value)
  );

  // Function to check if a date is in the past
  const isDateInPast = (day, month, year) => {
    const selectedDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  // Function to check if time is in the past for today
  const isTimeInPast = (hour, minute, isAM, date) => {
    if (
      !date ||
      date !== today.getDate() ||
      selectedMonth !== today.getMonth() ||
      selectedYear !== today.getFullYear()
    ) {
      return false;
    }

    const selectedHour24 = isAM
      ? hour === 12
        ? 0
        : hour
      : hour === 12
      ? 12
      : hour + 12;
    const selectedTime = new Date(
      selectedYear,
      selectedMonth,
      date,
      selectedHour24,
      minute
    );
    const now = new Date();

    return selectedTime < now;
  };

  // Handle file input changes with validation
  const handleFileInputChange = (index, field, value) => {
    const newFiles = [...formData.files];
    newFiles[index] = { ...newFiles[index], [field]: value };

    setFormData((prev) => ({
      ...prev,
      files: newFiles,
    }));

    // Clear error for this field if it exists
    if (errors.files && errors.files[index] && errors.files[index][field]) {
      const newFileErrors = [...errors.files];
      delete newFileErrors[index][field];

      // If no errors left for this file, remove the file error entry
      if (Object.keys(newFileErrors[index]).length === 0) {
        newFileErrors.splice(index, 1);
      }

      setErrors((prev) => ({
        ...prev,
        files: newFileErrors.length ? newFileErrors : undefined,
      }));
    }
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
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            id="title"
            name="title"
            maxLength={80}
            required
            value={formData.title}
            onChange={(e) => {
              // Get the input value
              let inputValue = e.target.value;

              // Remove forbidden characters: \ / : * ? " < > |
              inputValue = inputValue.replace(/[\\/:*?"<>|]/g, "");

              // Trim trailing spaces and periods
              inputValue = inputValue.replace(/[. ]+$/, "");

              // Limit to 80 characters
              if (inputValue.length > 80) {
                inputValue = inputValue.substring(0, 80);
              }

              // Update form data
              handleInputChange({
                target: {
                  name: "title",
                  value: inputValue,
                },
              });
            }}
            placeholder="Enter project title (max 80 chars)"
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title}</div>
          )}
        </div>

        {/* Client, Country, Project Manager */}
        <div className="row g-3 mb-3">
          <div className="col-md-4 mt-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label htmlFor="client" className="form-label mb-0">
                Client <span className="text-danger">*</span>
              </label>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddClient}
                title="Add Client"
              >
                {showClientInput ? "×" : "+"}
              </button>
            </div>

            <div className="d-flex align-items-center gap-2 mt-2">
              <div style={{ flex: 1 }}>
                <Select
                  id="client"
                  name="client"
                  options={clientOptions}
                  value={
                    formData.client
                      ? clientOptions.find(
                          (opt) => opt.value === formData.client
                        )
                      : null
                  }
                  onChange={(opt) => {
                    setFormData((prev) => ({
                      ...prev,
                      client: opt ? opt.value : "",
                    }));

                    // Clear error when client is selected
                    if (errors.client) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.client;
                        return newErrors;
                      });
                    }
                  }}
                  isSearchable
                  placeholder="Select Client"
                  styles={{
                    ...gradientSelectStyles,
                    control: (provided, state) => ({
                      ...gradientSelectStyles.control(provided, state),
                      ...(errors.client && !formData.client
                        ? { borderColor: "#dc3545" }
                        : {}),
                    }),
                  }}
                />
                {errors.client && (
                  <div className="text-danger">{errors.client}</div>
                )}

                {showClientInput && (
                  <div className="d-flex mt-2 gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter new client name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleConfirmAddClient}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-4">
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
          <div className="col-md-4 mt-4">
            <label htmlFor="projectManager" className="form-label">
              Project Manager
            </label>
            <Select
              id="projectManager"
              name="projectManager"
              options={managers}
              value={
                managers.find((opt) => opt.value === formData.projectManager) ||
                null
              }
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  projectManager: opt ? opt.value : "",
                }))
              }
              isSearchable
              placeholder={
                loadingManagers ? "Loading..." : "Select Project Manager"
              }
              styles={gradientSelectStyles}
              isDisabled={loadingManagers}
            />
          </div>
        </div>

        {/* Task & Applications */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label htmlFor="task" className="form-label mb-0">
                Task <span className="text-danger">*</span>
              </label>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddTask}
                title="Add Task"
              >
                {showTaskInput ? "×" : "+"}
              </button>
            </div>

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
              onChange={(selectedOptions) => {
                setFormData((prev) => ({
                  ...prev,
                  tasks: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }));

                // Clear error when task is selected
                if (
                  errors.tasks &&
                  selectedOptions &&
                  selectedOptions.length > 0
                ) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.tasks;
                    return newErrors;
                  });
                }
              }}
              isMulti
              isSearchable
              placeholder={loading ? "Loading..." : "Select Task(s)"}
              styles={{
                ...gradientSelectStyles,
                control: (provided, state) => ({
                  ...gradientSelectStyles.control(provided, state),
                  ...(errors.tasks && !formData.tasks.length
                    ? { borderColor: "#dc3545" }
                    : {}),
                }),
              }}
              required
            />
            {errors.tasks && <div className="text-danger">{errors.tasks}</div>}
            <div className="form-text text-white">
              {formData.tasks.length} selected
            </div>

            {showTaskInput && (
              <div className="d-flex mt-2 gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new task name"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleConfirmAddTask}
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label htmlFor="application" className="form-label mb-0">
                Applications <span className="text-danger">*</span>
              </label>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddApplication}
                title="Add Application"
              >
                {showApplicationInput ? "×" : "+"}
              </button>
            </div>

            <Select
              id="application"
              name="application"
              options={applicationOptions}
              value={applicationOptions?.filter((opt) =>
                formData.application.includes(opt.value)
              )}
              onChange={(selectedOptions) => {
                setFormData((prev) => ({
                  ...prev,
                  application: selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }));

                // Clear error when application is selected
                if (
                  errors.application &&
                  selectedOptions &&
                  selectedOptions.length > 0
                ) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.application;
                    return newErrors;
                  });
                }
              }}
              isMulti
              isSearchable
              placeholder={loading ? "Loading..." : "Select Application(s)"}
              styles={{
                ...gradientSelectStyles,
                control: (provided, state) => ({
                  ...gradientSelectStyles.control(provided, state),
                  ...(errors.application && !formData.application.length
                    ? { borderColor: "#dc3545" }
                    : {}),
                }),
              }}
              required
            />
            {errors.application && (
              <div className="text-danger">{errors.application}</div>
            )}

            {showApplicationInput && (
              <div className="d-flex mt-2 gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new application name"
                  value={newApplicationName}
                  onChange={(e) => setNewApplicationName(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleConfirmAddApplication}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label mb-0">
              Languages <span className="text-danger">*</span>
            </label>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAddLanguage}
              title="Add Language"
            >
              {showLanguageInput ? "×" : "+"}
            </button>
          </div>

          <Select
            options={languageOptions}
            value={languageOptions?.filter((opt) =>
              formData.languages.includes(opt.value)
            )}
            onChange={(selectedOptions) => {
              setFormData((prev) => ({
                ...prev,
                languages: selectedOptions
                  ? selectedOptions.map((opt) => opt.value)
                  : [],
              }));

              // Clear error when language is selected
              if (
                errors.languages &&
                selectedOptions &&
                selectedOptions.length > 0
              ) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.languages;
                  return newErrors;
                });
              }
            }}
            isMulti
            isSearchable
            placeholder={loading ? "Loading..." : "Select Languages"}
            styles={{
              ...gradientSelectStyles,
              control: (provided, state) => ({
                ...gradientSelectStyles.control(provided, state),
                ...(errors.languages && !formData.languages.length
                  ? { borderColor: "#dc3545" }
                  : {}),
              }),
            }}
            required
          />
          {errors.languages && (
            <div className="text-danger">{errors.languages}</div>
          )}
          <div className="form-text text-white">
            {formData.languages.length} selected
          </div>

          {showLanguageInput && (
            <div className="d-flex mt-2 gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter new language name"
                value={newLanguageName}
                onChange={(e) => setNewLanguageName(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-success"
                onClick={handleConfirmAddLanguage}
              >
                Add
              </button>
            </div>
          )}
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
                        fileName: "",
                        pageCount: 0,
                        applicationId: "",
                        selected: false,
                      }
                  ),
                }));
              }}
            />
            {/* Hidden file input for Excel upload */}
            <input
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              id="excel-upload"
              onChange={handleExcelUpload}
            />
            <button
              type="button"
              className="btn btn-success btn-sm d-flex align-items-center gap-1"
              onClick={() => document.getElementById("excel-upload").click()}
            >
              <Upload size={16} /> Upload Excel
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
                  <th>Actions</th>
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
                        className={`form-control ${
                          errors.files &&
                          errors.files[idx] &&
                          errors.files[idx].fileName
                            ? "is-invalid"
                            : ""
                        }`}
                        value={file.fileName || ""}
                        onChange={(e) =>
                          handleFileInputChange(idx, "fileName", e.target.value)
                        }
                        placeholder="File Name"
                        required
                      />
                      {errors.files &&
                        errors.files[idx] &&
                        errors.files[idx].fileName && (
                          <div className="invalid-feedback">
                            {errors.files[idx].fileName}
                          </div>
                        )}
                    </td>

                    <td>
                      <input
                        type="number"
                        min={1}
                        className={`form-control ${
                          errors.files &&
                          errors.files[idx] &&
                          errors.files[idx].pageCount
                            ? "is-invalid"
                            : ""
                        }`}
                        value={file.pageCount || ""}
                        onChange={(e) =>
                          handleFileInputChange(
                            idx,
                            "pageCount",
                            Number(e.target.value)
                          )
                        }
                        placeholder="Pages"
                        required
                      />
                      {errors.files &&
                        errors.files[idx] &&
                        errors.files[idx].pageCount && (
                          <div className="invalid-feedback">
                            {errors.files[idx].pageCount}
                          </div>
                        )}
                    </td>

                    <td>
                      <select
                        className={`form-select ${
                          errors.files &&
                          errors.files[idx] &&
                          errors.files[idx].applicationId
                            ? "is-invalid"
                            : ""
                        }`}
                        value={file.applicationId || ""}
                        onChange={(e) => {
                          const newAppId = Number(e.target.value);
                          const files = [...formData.files];

                          if (files[idx].selected) {
                            files.forEach((f) => {
                              if (f.selected) f.applicationId = newAppId;
                            });
                          } else {
                            files[idx].applicationId = newAppId;
                          }

                          setFormData((prev) => ({ ...prev, files }));

                          // Clear error when application is selected
                          if (
                            errors.files &&
                            errors.files[idx] &&
                            errors.files[idx].applicationId
                          ) {
                            const newFileErrors = [...errors.files];
                            delete newFileErrors[idx].applicationId;

                            // If no errors left for this file, remove the file error entry
                            if (Object.keys(newFileErrors[idx]).length === 0) {
                              newFileErrors.splice(idx, 1);
                            }

                            setErrors((prev) => ({
                              ...prev,
                              files: newFileErrors.length
                                ? newFileErrors
                                : undefined,
                            }));
                          }
                        }}
                        required
                      >
                        <option value="">Select</option>
                        {/* Use filtered application options here */}
                        {filteredApplicationOptions.map((app) => (
                          <option key={app.value} value={app.value}>
                            {app.label}
                          </option>
                        ))}
                      </select>
                      {errors.files &&
                        errors.files[idx] &&
                        errors.files[idx].applicationId && (
                          <div className="invalid-feedback">
                            {errors.files[idx].applicationId}
                          </div>
                        )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteFile(file.id, idx)}
                        title="Delete file"
                      >
                        <Trash2 size={16} />
                      </button>
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
              className={`form-control ${
                errors.receivedDate ? "is-invalid" : ""
              }`}
              name="receivedDate"
              value={formData.receivedDate}
              onChange={(e) => {
                handleInputChange(e);
              }}
              required
            />
            {errors.receivedDate && (
              <div className="invalid-feedback">{errors.receivedDate}</div>
            )}
          </div>
          <div className="col-md-8">
            <label className="form-label">
              Server Path <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.serverPath ? "is-invalid" : ""
              }`}
              name="serverPath"
              value={formData.serverPath}
              onChange={handleInputChange}
              required
              placeholder="/projects/client/project-name"
            />
            {errors.serverPath && (
              <div className="invalid-feedback">{errors.serverPath}</div>
            )}
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
                    rate: e.target.value === "estimated" ? 0 : prev.rate,
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
              disabled={formData.billingMode !== "estimated"}
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
              placeholder=""
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
                      e.target.value === "perPage" ? 0 : prev.estimatedHrs,
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
                  placeholder="00:00 AM 00-00-00"
                />
              </div>

              {isOpen && (
                <div className="calendar-dropdown">
                  <div className="time-display">
                    <div className="time">
                      {selectedHour === 0
                        ? "12"
                        : selectedHour > 12
                        ? selectedHour - 12
                        : selectedHour.toString().padStart(2, "0")}
                      :{selectedMinute.toString().padStart(2, "0")}
                    </div>
                    <div className="period">{isAM ? "AM" : "PM"}</div>
                    <div className="date">
                      {selectedDate !== null
                        ? `${selectedDate.toString().padStart(2, "0")}-${(
                            selectedMonth + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${selectedYear
                            .toString()
                            .slice(-2)}`
                        : "00-00-00"}
                    </div>
                  </div>

                  <div className="time-calendar-container">
                    <div className="time-selector">
                      <div className="time-column">
                        <div className="time-column-label">Hour</div>
                        <div className="time-scroll">
                          <div className="time-options">
                            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
                              (hour) => {
                                const isPast = isTimeInPast(
                                  hour,
                                  selectedMinute,
                                  isAM,
                                  selectedDate
                                );
                                return (
                                  <button
                                    key={hour}
                                    onClick={() => setSelectedHour(hour)}
                                    className={`time-option ${
                                      selectedHour === hour
                                        ? "selected-hour"
                                        : ""
                                    } ${isPast ? "past-time" : ""}`}
                                    disabled={isPast}
                                  >
                                    {hour.toString().padStart(2, "0")}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="time-column">
                        <div className="time-column-label">Min</div>
                        <div className="time-scroll">
                          <div className="time-options">
                            {[0, 15, 30, 45].map((minute) => {
                              const isPast = isTimeInPast(
                                selectedHour,
                                minute,
                                isAM,
                                selectedDate
                              );
                              return (
                                <button
                                  key={minute}
                                  onClick={() => setSelectedMinute(minute)}
                                  className={`time-option ${
                                    selectedMinute === minute
                                      ? "selected-minute"
                                      : ""
                                  } ${isPast ? "past-time" : ""}`}
                                  disabled={isPast}
                                >
                                  {minute.toString().padStart(2, "0")}
                                </button>
                              );
                            })}
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
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          disabled={
                            selectedMonth === today.getMonth() &&
                            selectedYear === today.getFullYear()
                          }
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h3>
                          {months[selectedMonth]}, {selectedYear}
                        </h3>
                        <button type="button" onClick={handleNextMonth}>
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
                            type="button"
                            onClick={() =>
                              dayObj.isCurrentMonth &&
                              !dayObj.isPast &&
                              setSelectedDate(dayObj.day)
                            }
                            className={`calendar-day ${
                              dayObj.isCurrentMonth
                                ? selectedDate === dayObj.day
                                  ? "current-month selected"
                                  : dayObj.isToday
                                  ? "current-month today"
                                  : "current-month"
                                : "other-month"
                            } ${dayObj.isPast ? "past-date" : ""}`}
                            disabled={dayObj.isPast}
                          >
                            {dayObj.day}
                          </button>
                        ))}
                      </div>

                      <div className="action-buttons">
                        <button
                          type="button"
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
                          type="button"
                          onClick={() => {
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
                      type="button"
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
