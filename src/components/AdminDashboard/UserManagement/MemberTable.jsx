import React from "react";

const MemberTable = ({
  teamMembers,
  activeTab,
  setActiveTab,
  toggleFreezeMember,
  deleteMember,
  openMemberModal,
}) => {
  const liveMembers = teamMembers.filter((m) => m.status === "active");
  const freezedMembers = teamMembers.filter((m) => m.status === "freezed");

  return (
    <div className="table-container">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "live" ? "active" : ""}`}
            onClick={() => setActiveTab("live")}
          >
            Live
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "freezed" ? "active" : ""}`}
            onClick={() => setActiveTab("freezed")}
          >
            Freezed
          </button>
        </li>
      </ul>

      {activeTab === "live" && (
        <TableContent
          members={liveMembers}
          statusType="active"
          toggleFreezeMember={toggleFreezeMember}
          deleteMember={deleteMember}
          openMemberModal={openMemberModal}
          freezeButtonClass="btn-warning"
          freezeButtonIcon="fa-snowflake"
          statusBadgeClass="bg-success"
          statusText="Active"
        />
      )}

      {activeTab === "freezed" && (
        <TableContent
          members={freezedMembers}
          statusType="freezed"
          toggleFreezeMember={toggleFreezeMember}
          deleteMember={deleteMember}
          openMemberModal={openMemberModal}
          freezeButtonClass="btn-success"
          freezeButtonIcon="fa-sun"
          statusBadgeClass="bg-secondary"
          statusText="Freezed"
        />
      )}
    </div>
  );
};

const TableContent = ({
  members,
  statusType,
  toggleFreezeMember,
  deleteMember,
  openMemberModal,
  freezeButtonClass,
  freezeButtonIcon,
  statusBadgeClass,
  statusText,
}) => (
  <div
    className="table-responsive table-gradient-bg"
    style={{ maxHeight: "400px", overflowY: "auto" }}
  >
    <table className="table table-bordered align-middle">
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
          <th>Emp ID</th>
          <th>Full Name</th>
          <th>DOJ</th>
          <th>DOB</th>
          <th>Team</th>
          <th>Role</th>
          <th>App Skills</th>
          <th>Username</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.length === 0 ? (
          <tr>
            <td colSpan="10" className="text-center text-muted">
              No {statusType} members found.
            </td>
          </tr>
        ) : (
          members.map((member, idx) => (
            <tr key={idx} className="text-center">
              <td>{member.empId}</td>
              <td>{member.fullName}</td>
              <td>{member.doj}</td>
              <td>{member.dob}</td>
              <td>{member.team}</td>
              <td>{member.role}</td>
              <td>{member.appSkills.join(", ")}</td>
              <td>{member.username}</td>
              <td>
                <span className={`badge ${statusBadgeClass}`}>{statusText}</span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => openMemberModal("view", member)}
                  title="View Member"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => openMemberModal("edit", member)}
                  title="Edit Member"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className={`btn btn-sm ${freezeButtonClass} me-2`}
                  onClick={() => toggleFreezeMember(member.empId)}
                  title={statusType === "active" ? "Freeze Account" : "Activate Account"}
                >
                  <i className={`fas ${freezeButtonIcon}`}></i>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteMember(member.empId)}
                  title="Delete Member"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default MemberTable;