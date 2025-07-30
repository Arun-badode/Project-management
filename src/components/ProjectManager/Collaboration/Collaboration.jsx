import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./Collaboration.css"; // Import your CSS styles

function Collaboration() {
  // State for messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Johnson",
      senderId: 101,
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20woman%20with%20brown%20hair%20and%20friendly%20smile%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=user1&orientation=squarish",
      content:
        "Hey team, I just uploaded the latest design files for the project. Could everyone please review and share your thoughts?",
      timestamp: "10:32 AM",
      reactions: [
        { emoji: "👍", count: 3, reacted: true },
        { emoji: "🔥", count: 1, reacted: false },
      ],
      isUnread: false,
      isEdited: false,
      replyTo: null,
      seenBy: [101, 102, 103],
    },
    {
      id: 2,
      sender: "Michael Chen",
      senderId: 102,
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20man%20with%20glasses%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=user2&orientation=squarish",
      content:
        "I've looked through it and I think the color palette works really well with our brand guidelines. Nice work!",
      timestamp: "10:45 AM",
      reactions: [{ emoji: "👍", count: 2, reacted: false }],
      isUnread: false,
      isEdited: false,
      replyTo: 1,
      seenBy: [101, 102],
    },
    {
      id: 3,
      sender: "Alex Rodriguez",
      senderId: 103,
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latino%20man%20with%20short%20dark%20hair%20wearing%20a%20blue%20shirt%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=user3&orientation=squarish",
      content:
        "I have some concerns about the mobile responsiveness of the new layout. Can we schedule a quick call to discuss?",
      timestamp: "11:15 AM",
      reactions: [],
      isUnread: true,
      isEdited: false,
      replyTo: null,
      seenBy: [103],
    },
  ]);

  // State for team members
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 101,
      name: "Sarah Johnson",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20woman%20with%20brown%20hair%20and%20friendly%20smile%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user1sm&orientation=squarish",
      isOnline: true,
      lastSeen: "Just now",
      role: "Admin",
    },
    {
      id: 102,
      name: "Michael Chen",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20man%20with%20glasses%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user2sm&orientation=squarish",
      isOnline: true,
      lastSeen: "Just now",
      role: "Manager",
    },
    {
      id: 103,
      name: "Alex Rodriguez",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latino%20man%20with%20short%20dark%20hair%20wearing%20a%20blue%20shirt%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user3sm&orientation=squarish",
      isOnline: false,
      lastSeen: "2 hours ago",
      role: "Member",
    },
    {
      id: 104,
      name: "Emma Wilson",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20blonde%20woman%20with%20medium%20length%20hair%20wearing%20professional%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user4sm&orientation=squarish",
      isOnline: true,
      lastSeen: "Just now",
      role: "Member",
    },
    {
      id: 105,
      name: "David Thompson",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20man%20with%20short%20brown%20hair%20wearing%20a%20suit%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user5sm&orientation=squarish",
      isOnline: false,
      lastSeen: "5 hours ago",
      role: "Member",
    },
  ]);

  // Current user (you)
  const currentUser = {
    id: 100,
    name: "You",
    avatar:
      "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=userme&orientation=squarish",
    isOnline: true,
    role: "Admin",
  };

  // State for UI
  const [activeFilter, setActiveFilter] = useState("All");
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");
  const [activeChat, setActiveChat] = useState("group");
  const [activePrivateChat, setActivePrivateChat] = useState(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionPosition, setMentionPosition] = useState(0);

  // Refs
  const messageEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messageInputRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // In a real app, you would connect to your actual server
    socketRef.current = io("http://localhost:3001", {
      auth: {
        userId: currentUser.id,
        userName: currentUser.name,
      },
    });

    // Socket event listeners
    socketRef.current.on("message", handleNewMessage);
    socketRef.current.on("typing", handleTyping);
    socketRef.current.on("messageSeen", handleMessageSeen);
    socketRef.current.on("messageEdited", handleMessageEdited);
    socketRef.current.on("messageDeleted", handleMessageDeleted);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
      setTypingUser(null);
    }, 3000);
    return () => clearTimeout(typingTimeout);
  }, [isTyping]);

  // Handle @mentions in message input
  useEffect(() => {
    if (newMessage.includes("@")) {
      const atPosition = newMessage.lastIndexOf("@");
      setMentionPosition(atPosition);
      const query = newMessage.substring(atPosition + 1);
      setMentionQuery(query);
      setShowMentionList(query.length > 0);
    } else {
      setShowMentionList(false);
    }
  }, [newMessage]);

  // Socket event handlers
  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleTyping = ({ userId, isTyping }) => {
    if (isTyping) {
      setIsTyping(true);
      const user = teamMembers.find((m) => m.id === userId);
      setTypingUser(user);
    } else {
      setIsTyping(false);
      setTypingUser(null);
    }
  };

  const handleMessageSeen = ({ messageId, userId }) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && !msg.seenBy.includes(userId)) {
          return { ...msg, seenBy: [...msg.seenBy, userId] };
        }
        return msg;
      })
    );
  };

  const handleMessageEdited = ({ messageId, newContent }) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return { ...msg, content: newContent, isEdited: true };
        }
        return msg;
      })
    );
  };

  const handleMessageDeleted = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  // Message handlers
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Check for mentions
    let mentionedUsers = [];
    if (newMessage.includes("@")) {
      const mentions = newMessage.match(/@(\w+)/g) || [];
      mentions.forEach((mention) => {
        const username = mention.substring(1);
        const user = teamMembers.find((m) =>
          m.name.toLowerCase().includes(username.toLowerCase())
        );
        if (user) mentionedUsers.push(user.id);
      });
    }

    const newMsg = {
      id: Date.now(), // Using timestamp as ID for simplicity
      sender: currentUser.name,
      senderId: currentUser.id,
      avatar: currentUser.avatar,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      reactions: [],
      isUnread: false,
      isEdited: false,
      replyTo: null,
      seenBy: [currentUser.id],
      mentionedUsers,
    };

    // In a real app, you would emit this to the server
    // socketRef.current.emit('sendMessage', newMsg);
    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate someone typing after your message
    setTimeout(() => {
      const randomUser =
        teamMembers[Math.floor(Math.random() * teamMembers.length)];
      setTypingUser(randomUser);
      setIsTyping(true);
    }, 1000);
  };

  const handleReaction = (messageId, emoji) => {
    const updatedMessages = messages.map((msg) => {
      if (msg.id === messageId) {
        const existingReactionIndex = msg.reactions.findIndex(
          (r) => r.emoji === emoji
        );
        if (existingReactionIndex >= 0) {
          // Toggle reaction
          const updatedReactions = [...msg.reactions];
          const reaction = updatedReactions[existingReactionIndex];
          if (reaction.reacted) {
            reaction.count -= 1;
            reaction.reacted = false;
            if (reaction.count === 0) {
              updatedReactions.splice(existingReactionIndex, 1);
            }
          } else {
            reaction.count += 1;
            reaction.reacted = true;
          }
          return { ...msg, reactions: updatedReactions };
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, reacted: true }],
          };
        }
      }
      return msg;
    });

    setMessages(updatedMessages);
    setShowEmojiPicker(false);
  };

  const handleReply = (messageId) => {
    const messageToReply = messages.find((m) => m.id === messageId);
    messageInputRef.current.focus();
    setNewMessage(`@${messageToReply.sender} `);
  };

  const handleEditMessage = (messageId) => {
    const messageToEdit = messages.find((m) => m.id === messageId);
    setEditingMessageId(messageId);
    setEditedMessageContent(messageToEdit.content);
  };

  const handleSaveEdit = () => {
    if (editedMessageContent.trim() === "") return;

    // In a real app, you would emit this to the server
    // socketRef.current.emit('editMessage', {
    //     messageId: editingMessageId,
    //     newContent: editedMessageContent
    // });

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === editingMessageId) {
          return { ...msg, content: editedMessageContent, isEdited: true };
        }
        return msg;
      })
    );

    setEditingMessageId(null);
    setEditedMessageContent("");
  };

  const handleDeleteMessage = (messageId) => {
    // In a real app, you would emit this to the server
    // socketRef.current.emit('deleteMessage', messageId);

    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessageId) {
        handleSaveEdit();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleMentionSelect = (user) => {
    const messageBefore = newMessage.substring(0, mentionPosition);
    const messageAfter = newMessage.substring(
      mentionPosition + mentionQuery.length + 1
    );
    setNewMessage(`${messageBefore}@${user.name} ${messageAfter}`);
    setShowMentionList(false);
    messageInputRef.current.focus();
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() === "" || selectedMembers.length === 0) return;

    // In a real app, you would send this to the server
    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      members: [...selectedMembers, currentUser.id],
      admin: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    // Reset form
    setNewGroupName("");
    setSelectedMembers([]);
    setShowCreateGroup(false);

    // For demo purposes, just show an alert
    alert(
      `Group "${newGroupName}" created with ${
        selectedMembers.length + 1
      } members!`
    );
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const filteredMessages = messages.filter((msg) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return msg.isUnread;
    if (activeFilter === "Mentions")
      return msg.mentionedUsers && msg.mentionedUsers.includes(currentUser.id);
    return true;
  });

  const emojis = ["👍", "❤️", "😂", "🎉", "🔥", "💯", "👏", "🙌", "A"];

  return (
    <div className=" container-fluid d-flex flex-column">
      {/* Main Content */}
      <div className="flex-grow-1 d-flex ">
        {/* Left Sidebar */}
        <div className="d-none d-lg-block col-lg-3 border-end  bg-card p-3 overflow-auto">
          {/* User Profile */}
          <div className="d-flex align-items-center mb-4 p-2  rounded bg-light">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <div>
              <strong className="text-black">{currentUser.name}</strong>
              <small className="d-block text-success">Online</small>
            </div>
          </div>

          {/* Chat Type Toggle */}
          <div className="btn-group w-100 mb-3">
            <button
              className={`btn btn-sm ${
                activeChat === "group" ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setActiveChat("group")}
            >
              Groups
            </button>
            <button
              className={`btn btn-sm ${
                activeChat === "private"
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setActiveChat("private")}
            >
              Private
            </button>
          </div>

          {activeChat === "group" ? (
            <>
              {/* Group Chat Section */}
              {currentUser.role === "Admin" ||
              currentUser.role === "Manager" ? (
                <button
                  className="btn btn-primary btn-sm w-100 mb-3"
                  onClick={() => setShowCreateGroup(true)}
                >
                  Create New Group
                </button>
              ) : null}

              {/* Group List */}
              <h6 className="mb-3">GROUP CHATS</h6>
              <div className="list-group mb-4">
                <button
                  className="list-group-item list-group-item-action active"
                  onClick={() => setActivePrivateChat(null)}
                >
                  <div className="d-flex justify-content-between">
                    <strong>Project Team</strong>
                    <span className="badge bg-white text-dark">3 new</span>
                  </div>
                  <small>Last message: 11:32 AM</small>
                </button>
                <button className="list-group-item list-group-item-action">
                  <div className="d-flex justify-content-between">
                    <strong>Marketing Team</strong>
                  </div>
                  <small>Last message: Yesterday</small>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Private Chat Section */}
              <h6 className="mb-3">DIRECT MESSAGES</h6>
              <ul className="list-unstyled">
                {teamMembers.map((member) => (
                  <li
                    key={member.id}
                    className={`mb-2 p-2 rounded ${
                      activePrivateChat === member.id
                        ? "bg-primary text-white"
                        : ""
                    }`}
                    onClick={() => setActivePrivateChat(member.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-2">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="rounded-circle"
                          width="32"
                        />
                        {member.isOnline ? (
                          <span
                            className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                            style={{
                              width: "10px",

                              border: "2px solid #f8f9fa",
                            }}
                          ></span>
                        ) : null}
                      </div>
                      <div>
                        <div>{member.name}</div>
                        <small
                          className={
                            member.isOnline ? "text-success" : "text-muted"
                          }
                        >
                          {member.isOnline ? "Online" : member.lastSeen}
                        </small>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Team Members */}
          <h6 className="mb-3">TEAM MEMBERS</h6>
          <ul className="list-unstyled">
            {teamMembers.map((member) => (
              <li key={member.id} className="mb-2 d-flex align-items-center">
                <div className="position-relative me-2">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="rounded-circle"
                    width="32"
                    height="32"
                  />
                  {member.isOnline && (
                    <span
                      className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                      style={{
                        width: "10px",
                        height: "10px",
                        border: "2px solid #f8f9fa",
                      }}
                    ></span>
                  )}
                </div>
                <span className="small">{member.name}</span>
                {member.role === "Admin" && (
                  <span className="badge bg-danger ms-2">Admin</span>
                )}
                {member.role === "Manager" && (
                  <span className="badge bg-warning ms-2">Manager</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="col-12 col-lg-9 d-flex flex-column chat-main-panel">
          <div className="row chat" style={{ position: "fixed" }}>
            <div className="col-12  d-flex flex-column">
              {/* Chat Header */}
              <div className="p-3 border-bottom bg-main d-flex justify-content-between align-items-center chat-header-sticky">
                <div>
                  <h4 className="mb-0 text-white">
                    {activePrivateChat
                      ? teamMembers.find((m) => m.id === activePrivateChat)
                          ?.name
                      : "Project Team"}
                  </h4>
                  <small className="text-white">
                    {activePrivateChat
                      ? teamMembers.find((m) => m.id === activePrivateChat)
                          ?.isOnline
                        ? "Online"
                        : `Last seen ${
                            teamMembers.find((m) => m.id === activePrivateChat)
                              ?.lastSeen
                          }`
                      : `${
                          teamMembers.length + 1
                        } members • Last activity 11:32 AM`}
                  </small>
                </div>
                <div className="d-flex">
                  <button className="btn btn-sm btn-outline-light me-2">
                    <i className="fas fa-search"></i>
                  </button>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-light dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button className="dropdown-item">View Members</button>
                      </li>
                      {activeChat === "group" && (
                        <li>
                          <button className="dropdown-item">
                            Group Settings
                          </button>
                        </li>
                      )}
                      <li>
                        <button className="dropdown-item">Clear History</button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item text-danger">
                          Leave Chat
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="chat-messages-scrollable  scrollbar-hidden overflow-auto p-3 bg-main"
                style={{ backgroundColor: "#1e1e1e" }}
              >
                <div ref={messageEndRef} />
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 ${
                      message.senderId === currentUser.id ? "text-end" : ""
                    }`}
                  >
                    {message.replyTo && (
                      <div
                        className={`small text-white mb-1 ${
                          message.senderId === currentUser.id ? "text-end" : ""
                        }`}
                      >
                        Replying to:{" "}
                        {messages
                          .find((m) => m.id === message.replyTo)
                          ?.content.substring(0, 50)}
                        ...
                      </div>
                    )}
                    <div
                      className={`d-flex ${
                        message.senderId === currentUser.id
                          ? "justify-content-end"
                          : ""
                      }`}
                    >
                      {message.senderId !== currentUser.id && (
                        <img
                          src={message.avatar}
                          alt={message.sender}
                          className="rounded-circle me-2"
                          width="40"
                          height="40"
                        />
                      )}
                      <div
                        className={`rounded p-3 position-relative ${
                          message.senderId === currentUser.id
                            ? "bg-primary"
                            : "bg-card"
                        }`}
                        style={{ maxWidth: "75%" }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong
                            className={
                              message.senderId === currentUser.id
                                ? "text-white"
                                : "text-white"
                            }
                          >
                            {message.sender}
                          </strong>
                          <small
                            className={
                              message.senderId === currentUser.id
                                ? "text-white-50"
                                : "text-white-50"
                            }
                          >
                            {message.timestamp}
                            {message.isEdited && (
                              <span className="ms-1">(edited)</span>
                            )}
                          </small>
                        </div>
                        <p className="mb-2 text-white">
                          {message.content}
                          {message.mentionedUsers?.includes(currentUser.id) && (
                            <span className="badge bg-warning ms-2">
                              Mentioned
                            </span>
                          )}
                        </p>

                        {/* Message actions */}
                        <div
                          className={`position-absolute ${
                            message.senderId === currentUser.id
                              ? "left-0 start-100"
                              : "right-0 end-100"
                          } px-2 d-flex`}
                        >
                          <button
                            className="btn btn-sm p-0 text-white-50"
                            onClick={() => handleReply(message.id)}
                            title="Reply"
                          >
                            <i className="fas fa-reply"></i>
                          </button>
                          {message.senderId === currentUser.id && (
                            <>
                              <button
                                className="btn btn-sm p-0 mx-1 text-white-50"
                                onClick={() => handleEditMessage(message.id)}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm p-0 text-white-50"
                                onClick={() => handleDeleteMessage(message.id)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </>
                          )}
                        </div>

                        {/* Reactions */}
                        {message.reactions.length > 0 && (
                          <div className="d-flex flex-wrap gap-1 mt-2">
                            {message.reactions.map((reaction, idx) => (
                              <button
                                key={idx}
                                className={`btn btn-sm p-0 px-1 rounded-pill ${
                                  reaction.reacted
                                    ? "bg-white"
                                    : message.senderId === currentUser.id
                                    ? "bg-white-10"
                                    : "bg-light"
                                }`}
                                onClick={() =>
                                  handleReaction(message.id, reaction.emoji)
                                }
                              >
                                <span>{reaction.emoji}</span>
                                <small className="ms-1">{reaction.count}</small>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Seen status */}
                        {activePrivateChat &&
                          message.senderId === currentUser.id && (
                            <div className="text-end mt-1">
                              <small className="text-white-50">
                                {message.seenBy.includes(activePrivateChat)
                                  ? "Seen"
                                  : "Delivered"}
                              </small>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Editing Message */}
                {editingMessageId && (
                  <div className="mb-3 p-3 bg-dark rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>Editing message</strong>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => setEditingMessageId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      value={editedMessageContent}
                      onChange={(e) => setEditedMessageContent(e.target.value)}
                      className="form-control mb-2"
                      rows="3"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="btn btn-primary btn-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                )}

                {/* Typing Indicator */}
                {isTyping && typingUser && (
                  <div className="d-flex align-items-center mb-3 ">
                    <img
                      src={typingUser.avatar}
                      alt="Typing"
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                    />
                    <div className="rounded p-2 bg-card">
                      <div className="d-flex align-items-center">
                        <div className="typing-dots">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                        <small className="ms-2 text-white ">
                          {typingUser.name} is typing...
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messageEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 border-top bg-main chat-footer-sticky">
                <div className="position-relative">
                  {showMentionList && (
                    <div
                      className="position-absolute bottom-100 mb-2 bg-white border rounded p-2 w-100"
                      style={{
                        zIndex: 1000,
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {teamMembers
                        .filter(
                          (member) =>
                            member.name
                              .toLowerCase()
                              .includes(mentionQuery.toLowerCase()) &&
                            member.id !== currentUser.id
                        )
                        .map((member) => (
                          <div
                            key={member.id}
                            className="p-2 hover-bg cursor-pointer"
                            onClick={() => handleMentionSelect(member)}
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="rounded-circle me-2"
                                width="32"
                                height="32"
                              />
                              <div>
                                <div>{member.name}</div>
                                <small className="text-muted">
                                  {member.role}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      // In a real app, you would emit typing status to the server
                      // socketRef.current.emit('typing', {
                      //     isTyping: e.target.value.length > 0
                      // });
                    }}
                    onKeyDown={handleKeyDown}
                    className="form-control mb-2 bg-card text-white"
                    rows="2"
                    placeholder="Type your message here..."
                    style={{ resize: "none" }}
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <button
                        className="btn btn-sm btn-outline-light me-2"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <i className="far fa-smile"></i>
                      </button>
                    </div>
                    <button
                      onClick={
                        editingMessageId ? handleSaveEdit : handleSendMessage
                      }
                      disabled={
                        editingMessageId
                          ? editedMessageContent.trim() === ""
                          : newMessage.trim() === ""
                      }
                      className={`btn ${
                        editingMessageId
                          ? "btn-warning"
                          : newMessage.trim() === ""
                          ? "btn-outline-primary"
                          : "btn-primary"
                      }`}
                    >
                      {editingMessageId ? "Save Edit" : "Send"}{" "}
                      <i className="fas fa-paper-plane ms-1"></i>
                    </button>
                  </div>

                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="position-absolute bottom-100 bg-white border rounded p-2 mb-2 shadow-sm"
                      style={{ zIndex: 1000 }}
                    >
                      <div
                        className="d-flex flex-wrap"
                        style={{ width: "200px" }}
                      >
                        {emojis.map((emoji, idx) => (
                          <button
                            key={idx}
                            className="btn btn-sm p-1"
                            onClick={() => {
                              setNewMessage((prev) => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Group</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateGroup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Group Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Members</label>
                  <div>
                    {teamMembers
                      .filter((member) => member.id !== currentUser.id)
                      .map((member) => (
                        <div key={member.id} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`member-${member.id}`}
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => toggleMemberSelection(member.id)}
                          />
                          <label
                            className="form-check-label d-flex align-items-center"
                            htmlFor={`member-${member.id}`}
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="rounded-circle me-2"
                              width="32"
                              height="32"
                            />
                            {member.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateGroup(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateGroup}
                  disabled={
                    newGroupName.trim() === "" || selectedMembers.length === 0
                  }
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collaboration;
