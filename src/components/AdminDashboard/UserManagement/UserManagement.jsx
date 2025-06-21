import React, { useState } from "react";

function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ initials: "", name: "", role: "" });
  const teamMembers = [
    { initials: "AJ", name: "Alice Johnson", role: "Frontend Developer" },
    { initials: "BS", name: "Bob Smith", role: "Backend Developer" },
    { initials: "CB", name: "Charlie Brown", role: "UI/UX Designer" },
    { initials: "DW", name: "David Wilson", role: "Frontend Developer" },
    { initials: "ED", name: "Eve Davis", role: "Backend Developer" },
    { initials: "FM", name: "Frank Miller", role: "UI/UX Designer" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to add member to teamMembers (currently static)
    setShowModal(false);
    setForm({ initials: "", name: "", role: "" });
  };
  return (
    <div>
      <div className="team-section py-5 px-3 text-white">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Team</h3>
          <button
            className="btn btn-outline-light rounded-pill px-3 gradient-button"
            onClick={() => setShowModal(true)}
          >
            + Add Member
          </button>
        </div>

        <div className="row g-4">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="col-sm-6 col-md-4 ">
              <div className="bg-card team-card text-center p-3 shadow-sm h-100">
                <div className="avatar mx-auto mb-2">
                  <span>{member.initials}</span>
                </div>
                <h6 className="mb-1">{member.name}</h6>
                <p className=" small">{member.role}</p>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-dark btn-sm px-3">
                    View Profile
                  </button>
                  <button className="btn btn-dark btn-sm px-3">Message</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block custom-modal-dark"
          tabIndex="-1"
          style={{
            background: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Member</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Initials</label>
                    <input
                      type="text"
                      className="form-control"
                      name="initials"
                      value={form.initials}
                      onChange={(e) =>
                        setForm({ ...form, initials: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="name"
                      className="form-control"
                      name="name"
                      value={form.name}
                       onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      name="role"
                      value={form.role}
                      required
                       onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
