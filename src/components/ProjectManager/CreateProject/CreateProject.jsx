import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [teamMembers, setTeamMembers] = useState([]); // TypeScript type hata diya
  const [memberInput, setMemberInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [errors, setErrors] = useState({});

  const projectTypes = [
    "Web Development",
    "Mobile App",
    "Design",
    "Marketing",
    "Research",
    "Content Creation",
  ];

  const priorityLevels = ["Low", "Medium", "High", "Urgent"];

  const suggestedMembers = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Sophia Davis",
    "William Wilson",
    "Olivia Martinez",
  ];

  const handleAddMember = () => {
    if (memberInput && !teamMembers.includes(memberInput)) {
      setTeamMembers([...teamMembers, memberInput]);
      setMemberInput("");
    }
  };

  const handleRemoveMember = (member) => {
    setTeamMembers(teamMembers.filter((m) => m !== member));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    if (!projectType) {
      newErrors.projectType = "Project type is required";
    }

    if (!deadline) {
      newErrors.deadline = "Deadline is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        alert("Project created successfully!");
        // Reset form or redirect
      }, 1500);
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
      // Reset form or redirect
      alert("Form cancelled");
    }
  };

  return (
    <div>
      <div className="container-fluid mt-3 p-4  text-white rounded shadow custom-modal-dark">
        <h2 className="mb-4 gradient-heading">Create New Project</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control type="text" placeholder="Enter title" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Client Name</Form.Label>
            <Form.Control type="text" placeholder="Enter client name" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Application</Form.Label>
            <Form.Select className="text-white border-secondary bg-dark">
              <option>Web</option>
              <option>Mobile</option>
              <option>Desktop</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Pages</Form.Label>
            <Form.Control type="number" placeholder="Enter page count" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Actual Due Date</Form.Label>
            <Form.Control type="datetime-local" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ready for QC Deadline</Form.Label><br/>
            <DatePicker
              selected={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select date and time"
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>QC Hours Allocated</Form.Label>
            <Form.Control type="number" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>QC Due Date</Form.Label>
             <DatePicker
              selected={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select date and time"
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select>
              <option>In Progress</option>
              <option>Completed</option>
              <option>On Hold</option>
            </Form.Select>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 gradient-button"
          >
            Create Project
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default CreateProject;
