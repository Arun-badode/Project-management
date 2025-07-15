import React, { useState } from "react";
import MemberTable from "./MemberTable";
import MemberModal from "./MemberModal";

function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState("live");
  
  const [teamMembers, setTeamMembers] = useState([
    {
      empId: "E001",
      fullName: "John Doe",
      doj: "2022-01-01",
      dob: "1990-05-10",
      team: "Dev",
      role: "Frontend",
      appSkills: ["React", "JS"],
      username: "johnd",
      status: "active",
    },
    // ... other members data
  ]);

  const toggleFreezeMember = (empId) => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.empId === empId
          ? {
              ...member,
              status: member.status === "active" ? "freezed" : "active",
            }
          : member
      )
    );
  };

  const deleteMember = (empId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setTeamMembers((prevMembers) =>
        prevMembers.filter((member) => member.empId !== empId)
      );
    }
  };

  const openMemberModal = (type, member) => {
    setModalType(type);
    setSelectedMember(member);
    setShowModal(true);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between">
        <h2 className="gradient-heading mt-2">User Management</h2>
        <div className="text-end mb-3">
          <button
            className="btn gradient-button"
            onClick={() => openMemberModal("add", null)}
          >
            + Add Member
          </button>
        </div>
      </div>

      <MemberTable
        teamMembers={teamMembers}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleFreezeMember={toggleFreezeMember}
        deleteMember={deleteMember}
        openMemberModal={openMemberModal}
      />

      {showModal && (
        <MemberModal
          showModal={showModal}
          setShowModal={setShowModal}
          modalType={modalType}
          selectedMember={selectedMember}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
        />
      )}
    </div>
  );
}

export default UserManagement;