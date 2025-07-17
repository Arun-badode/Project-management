import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const EventsTodayTable = ({ tasksToday, scrollContainerRef, fakeScrollbarRef }) => {
  return (
    <div className="text-white p-3 mb-4 table-gradient-bg">
      <div
        ref={fakeScrollbarRef}
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          height: 16,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
        }}
      >
        <div style={{ width: "2000px", height: 1 }} />
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Today's Events</h4>
        <Link to="/calendar" className="text-decoration-none">
          <Button className="gradient-button me-2">Go To Calendar</Button>
        </Link>
      </div>
      <div
        className="table-responsive"
        ref={scrollContainerRef}
        style={{
          maxHeight: "500px",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
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
              <th>Task Title</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Assign to</th>
            </tr>
          </thead>
          <tbody>
            {tasksToday.map((task) => (
              <tr  key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.deadline}</td>
                <td>{task.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTodayTable;