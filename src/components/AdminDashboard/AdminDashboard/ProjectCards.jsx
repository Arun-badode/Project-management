import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";

const ProjectCards = ({
  key,
  title,
  icon,
  color,
  activeColor,
  activeTab,
  onClick,
  link
}) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://eminoids-backend-production.up.railway.app/api/adminDashboard/getAdminDashboardData"
          , {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        const data = response.data.data;

        switch (title) {
          case "Active Projects":
            setCount(data.activeProjects?.count || 0);
            break;
          case "Near Due Projects":
            setCount(data.nearDue?.count || 0);
            break;
          case "Overdue Projects":
            setCount(data.overdue?.count || 0);
            break;
          case "Team On-Duty":
            setCount(data.onDuty?.count || 0);
            break;
          case "Events Today":
            setCount(data.eventsToday?.count || 0);
            break;
          default:
            setCount(0);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setCount(0);
      }
    };

    fetchData();
  }, [title]);

  if (loading) {
    return (
      <Card
        className={`bg-${color.split(" ")[0]} bg-gradient p-3 rounded-4 shadow-sm border-0 w-100 ${activeTab === key ? `active-tab ${activeColor}` : ""
          }`}
        style={{
          cursor: "pointer",
          minHeight: "140px",
          height: "130px",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100 text-white">
          <Spinner animation="border" variant="light" />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={`bg-${color.split(" ")[0]} bg-gradient p-3 rounded-4 shadow-sm border-0 w-100 ${activeTab === key ? `active-tab ${activeColor}` : ""
          }`}
        style={{
          cursor: "pointer",
          minHeight: "140px",
          height: "130px",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100 text-white">
          <small className="text-danger">Error loading data</small>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-${color.split(" ")[0]
        } bg-gradient p-3 rounded-4 shadow-sm border-0 w-100  ${activeTab === key ? `active-tab ${activeColor}` : ""
        }`}
      onClick={onClick}
      style={{
        cursor: "pointer",
        minHeight: "140px",
        height: "130px",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-between h-100 text-white">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <i className={`bi ${icon} fs-4`}></i>
          <Card.Title className="fs-6 fw-semibold mb-0">
            {title}
          </Card.Title>
        </div>
        <h3 className="fw-bold text-center m-0">{count}</h3>
      </Card.Body>
    </Card>
  );
};

export default ProjectCards;