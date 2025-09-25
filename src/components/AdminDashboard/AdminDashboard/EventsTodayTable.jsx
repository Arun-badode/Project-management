import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const EventsTodayTable = ({ scrollContainerRef }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://eminoids-backend-production.up.railway.app/api/adminDashboard/getAdminDashboardData",
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        // Transform the API data to match the table format
        const formattedEvents = response.data.data.eventsToday.list.map(event => ({
          id: event.id,
          title: event.eventType,
          description: event.details,
          deadline: new Date(event.eventDate).toLocaleDateString(),
          assignedTo: "Team",
          createdAt: new Date(event.createdAt).toLocaleString()
        }));

        setEvents(formattedEvents);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5 text-danger">
        Error loading events: {error}
      </div>
    );
  }

  return (
    <div className="text-white p-3 mb-4 table-gradient-bg">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Today's Events</h4>
        <Link to="/calendar" className="text-decoration-none">
          <Button className="gradient-button me-2">Go To Calendar</Button>
        </Link>
      </div>
      <div
        ref={scrollContainerRef}
        style={{
          maxHeight: "500px",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
      >
        <table className="table table-hover mb-0">
          <thead
            className="table-gradient-bg table"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 0,
              backgroundColor: "#fff",
            }}
          >
            <tr className="text-center">
              <th>Event Type</th>
              <th>Details</th>
              <th>Event Date</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{event.deadline}</td>
                  <td>{event.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No events scheduled for today
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTodayTable;