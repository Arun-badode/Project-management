import React from "react";
import { Modal } from "react-bootstrap";

const ProjectModal = ({ showViewModal, setShowViewModal, selectedProject }) => {
  return (
    <Modal
      show={showViewModal}
      onHide={() => setShowViewModal(false)}
      centered
      className="custom-modal-dark"
    >
      <Modal.Header closeButton>
        <Modal.Title>Project Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedProject && (
          <div>
            <p>
              <strong>Title:</strong> {selectedProject.title}
            </p>
            <p>
              <strong>Client:</strong> {selectedProject.client}
            </p>
            <p>
              <strong>Application:</strong> {selectedProject.application}
            </p>
            <p>
              <strong>Pages:</strong> {selectedProject.pages}
            </p>
            <p>
              <strong>Due Date:</strong> {selectedProject.dueDate}
            </p>
            <p>
              <strong>Status:</strong> {selectedProject.status}
            </p>
            <p>
              <strong>Handler:</strong> {selectedProject.handler}
            </p>
            <p>
              <strong>QA Reviewer:</strong> {selectedProject.qaReviewer}
            </p>
            <p>
              <strong>QA Status:</strong> {selectedProject.qaStatus}
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProjectModal;