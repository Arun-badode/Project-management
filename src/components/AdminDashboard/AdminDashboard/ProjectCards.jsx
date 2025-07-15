import React from "react";
import { Card } from "react-bootstrap";

const ProjectCards = ({ 
  key, 
  title, 
  icon, 
  color, 
  activeColor, 
  activeTab, 
  count,
  onClick,
  link
}) => {
  return (
    <Card
      className={`bg-${
        color.split(" ")[0]
      } bg-gradient p-3 rounded-4 shadow-sm border-0 w-100  ${
        activeTab === key ? `active-tab ${activeColor}` : ""
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
        <div className="d-flex  justify-content-center  align-items-center gap-2">
          <i className={`bi ${icon} fs-4`}></i>
          <Card.Title className="fs-6  fw-semibold mb-0">
            {title}
          </Card.Title>
        </div>
        <h3 className="fw-bold text-center m-0">{count}</h3>
      </Card.Body>
    </Card>
  );
};

export default ProjectCards;