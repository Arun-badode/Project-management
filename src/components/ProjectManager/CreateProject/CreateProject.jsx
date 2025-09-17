import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import BASE_URL from "../../../config";

function CreateProject() {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const managerId = localStorage.getItem("managerId");

  // Sample data for dropdowns - you might want to fetch these from APIs
  const clients = [
    { id: 1, name: "ABC Global Services" },
    { id: 2, name: "ABC International Services" },
  ];

  const applications = [
    { id: 1, name: "ppt" },
    { id: 2, name: "excel" },
    { id: 3, name: "AI" },
  ];

  const languages = [
    { id: 1, name: "English" },
    { id: 2, name: "Afrikaans" },
    { id: 3, name: "Arabic" },
    { id: 4, name: "Belarusian" },
  ];

  const tasks = [
    { id: 1, name: "Translation" },
    { id: 2, name: "Editing" },
  ];

  const statusOptions = ["Active", "In Progress", "Completed", "On Hold"];
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];
  const currencyOptions = ["USD", "EUR", "INR"];

  const [formData, setFormData] = useState({
    projectTitle: "",
    clientId: "",
    applicationId: "",
    totalProjectPages: "",
    deadline: "",
    readyQCDeadline: "",
    qcHrs: "",
    qcDueDate: "",
    status: "",
    priority: "",
    notes: "",
    hourlyRate: "",
    perPageRate: "",
    currency: "",
    estimatedHours: "",
    totalCost: "",
    country: "",
    languageId: "",
    taskId: "",
    totalPagesLang: "",
    projectManagerId: managerId || "", // Initialize with managerId from localStorage
    receiveDate: "",
    serverPath: ""
  });

  useEffect(() => {
    // Update formData when managerId changes
    setFormData(prev => ({
      ...prev,
      projectManagerId: managerId || ""
    }));
  }, [managerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: date ? date.toISOString() : "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
    }

    if (!formData.clientId) {
      newErrors.clientId = "Client is required";
    }

    if (!formData.applicationId) {
      newErrors.applicationId = "Application is required";
    }

    if (!formData.totalProjectPages) {
      newErrors.totalProjectPages = "Total pages is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    }

    if (!formData.projectManagerId) {
      newErrors.projectManagerId = "Manager ID is missing";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        // Ensure projectManagerId is included in the submission
        const submitData = {
          ...formData,
          projectManagerId: Number(managerId) // Convert to number if needed by backend
        };

        const response = await axios.post(
          "https://eminoids-backend-production.up.railway.app/api/project/addProject",
          submitData, // Use submitData instead of formData
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.status) {
          setSuccessMessage("Project created successfully!");
          // Reset form
          setFormData({
            projectTitle: "",
            clientId: "",
            applicationId: "",
            totalProjectPages: "",
            deadline: "",
            readyQCDeadline: "",
            qcHrs: "",
            qcDueDate: "",
            status: "",
            priority: "",
            notes: "",
            hourlyRate: "",
            perPageRate: "",
            currency: "",
            estimatedHours: "",
            totalCost: "",
            country: "",
            languageId: "",
            taskId: "",
            totalPagesLang: "",
            projectManagerId: managerId || "",
            receiveDate: "",
            serverPath: ""
          });
        } else {
          setErrors({ submit: response.data.message });
        }
      } catch (error) {
        console.error("Error creating project:", error);
        setErrors({ submit: "Failed to create project. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const [permissions, setPermissions] = useState([]);
  const roleId = localStorage.getItem("roleId");

  // 🔹 Fetch permissions from API
  useEffect(() => {
    axios
      .get(`${BASE_URL}roles/permission/${roleId}`)
      .then((res) => {
        if (res.data.status) {
          setPermissions(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching permissions", err);
      });
  }, [roleId])

  const projectPermission = permissions.find(p => p.featureName === "Create Project");
  const CreateProjectPermission = Number(projectPermission?.canAdd);

  return (
    <div>
      <div className="container-fluid mt-3 p-4 text-white rounded shadow custom-modal-dark">
        <h2 className="mb-4 gradient-heading">Create New Project</h2>
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {errors.submit && (
          <div className="alert alert-danger">{errors.submit}</div>
        )}
        {errors.projectManagerId && (
          <div className="alert alert-danger">{errors.projectManagerId}</div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Project Title</Form.Label>
            <Form.Control
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              placeholder="Enter project title"
              isInvalid={!!errors.projectTitle}
            />
            <Form.Control.Feedback type="invalid">
              {errors.projectTitle}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Client</Form.Label>
            <Form.Select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="text-white border-secondary bg-dark"
              isInvalid={!!errors.clientId}
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.clientId}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Application</Form.Label>
            <Form.Select
              name="applicationId"
              value={formData.applicationId}
              onChange={handleChange}
              className="text-white border-secondary bg-dark"
              isInvalid={!!errors.applicationId}
            >
              <option value="">Select application</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.applicationId}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Pages</Form.Label>
            <Form.Control
              type="number"
              name="totalProjectPages"
              value={formData.totalProjectPages}
              onChange={handleChange}
              placeholder="Enter total pages"
              isInvalid={!!errors.totalProjectPages}
            />
            <Form.Control.Feedback type="invalid">
              {errors.totalProjectPages}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Language Pages (e.g., ES:30,DE:20)</Form.Label>
            <Form.Control
              type="text"
              name="totalPagesLang"
              value={formData.totalPagesLang}
              onChange={handleChange}
              placeholder="Enter language pages"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deadline</Form.Label>
            <DatePicker
              selected={formData.deadline ? new Date(formData.deadline) : null}
              onChange={(date) => handleDateChange(date, "deadline")}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select deadline"
              className="form-control"
              isInvalid={!!errors.deadline}
            />
            {errors.deadline && (
              <div className="text-danger">{errors.deadline}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ready for QC Deadline</Form.Label>
            <DatePicker
              selected={
                formData.readyQCDeadline ? new Date(formData.readyQCDeadline) : null
              }
              onChange={(date) => handleDateChange(date, "readyQCDeadline")}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select QC deadline"
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>QC Hours Allocated</Form.Label>
            <Form.Control
              type="number"
              name="qcHrs"
              value={formData.qcHrs}
              onChange={handleChange}
              placeholder="Enter QC hours"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>QC Due Date</Form.Label>
            <DatePicker
              selected={formData.qcDueDate ? new Date(formData.qcDueDate) : null}
              onChange={(date) => handleDateChange(date, "qcDueDate")}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select QC due date"
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Select
              name="languageId"
              value={formData.languageId}
              onChange={handleChange}
              className="text-white border-secondary bg-dark"
            >
              <option value="">Select language</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Task</Form.Label>
            <Form.Select
              name="taskId"
              value={formData.taskId}
              onChange={handleChange}
              className="text-white border-secondary bg-dark"
            >
              <option value="">Select task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hourly Rate</Form.Label>
            <Form.Control
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              placeholder="Enter hourly rate"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Per Page Rate</Form.Label>
            <Form.Control
              type="number"
              name="perPageRate"
              value={formData.perPageRate}
              onChange={handleChange}
              placeholder="Enter per page rate"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Currency</Form.Label>
            <Form.Select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estimated Hours</Form.Label>
            <Form.Control
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              placeholder="Enter estimated hours"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Cost</Form.Label>
            <Form.Control
              type="number"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleChange}
              placeholder="Enter total cost"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any notes"
              rows={3}
            />
          </Form.Group>

          <div className="d-flex gap-3">
            {CreateProjectPermission === 1 &&
              <Button
                variant="primary"
                type="submit"
                className="w-100 gradient-button"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            }
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CreateProject;