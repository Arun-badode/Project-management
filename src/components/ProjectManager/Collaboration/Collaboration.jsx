// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import "./Collaboration.css"; // Import your CSS styles
// import axios from "axios";
// import BASE_URL from "../../../config";

// function Collaboration() {
//   // State for team members
//   const [teamMembers, setTeamMembers] = useState([
//     {
//       id: 101,
//       name: "Sarah Johnson",
//       avatar:
//         "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20woman%20with%20brown%20hair%20and%20friendly%20smile%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user1sm&orientation=squarish",
//       isOnline: true,
//       lastSeen: "Just now",
//       role: "Admin",
//     },
//     {
//       id: 102,
//       name: "Michael Chen",
//       avatar:
//         "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20man%20with%20glasses%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user2sm&orientation=squarish",
//       isOnline: true,
//       lastSeen: "Just now",
//       role: "Manager",
//     },
//     {
//       id: 103,
//       name: "Alex Rodriguez",
//       avatar:
//         "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latino%20man%20with%20short%20dark%20hair%20wearing%20a%20blue%20shirt%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user3sm&orientation=squarish",
//       isOnline: false,
//       lastSeen: "2 hours ago",
//       role: "Member",
//     },
//     {
//       id: 104,
//       name: "Emma Wilson",
//       avatar:
//         "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20blonde%20woman%20with%20medium%20length%20hair%20wearing%20professional%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user4sm&orientation=squarish",
//       isOnline: true,
//       lastSeen: "Just now",
//       role: "Member",
//     },
//     {
//       id: 105,
//       name: "David Thompson",
//       avatar:
//         "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20man%20with%20short%20brown%20hair%20wearing%20a%20suit%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user5sm&orientation=squarish",
//       isOnline: false,
//       lastSeen: "5 hours ago",
//       role: "Member",
//     },
//   ]);

//   // Current user (you)
//   const currentUser = {
//     id: 100,
//     name: "You",
//     avatar:
//       "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=userme&orientation=squarish",
//     isOnline: true,
//     role: "Admin",
//   };

//   const [messages, setMessages] = useState([]);

//   // State for UI
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingUser, setTypingUser] = useState(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showCreateGroup, setShowCreateGroup] = useState(false);
//   const [newGroupName, setNewGroupName] = useState("");
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editedMessageContent, setEditedMessageContent] = useState("");
//   const [activeChat, setActiveChat] = useState("group");
//   const [activePrivateChat, setActivePrivateChat] = useState(null);
//   const [mentionQuery, setMentionQuery] = useState("");
//   const [showMentionList, setShowMentionList] = useState(false);
//   const [mentionPosition, setMentionPosition] = useState(0);
//   const token = localStorage.getItem("authToken");

//   // Refs
//   const messageEndRef = useRef(null);
//   const emojiPickerRef = useRef(null);
//   const messageInputRef = useRef(null);
//   const socketRef = useRef(null);

//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeGroup, setActiveGroup] = useState(null);
//   const [replyTo, setReplyTo] = useState(null);
//   const [showMobileChat, setShowMobileChat] = useState(false); // New state for mobile chat view

//   // Available emojis
//   const emojis = ["😀", "😂", "😍", "👍", "👋", "🎉", "❤️", "🔥", "👏", "🙏"];

//   useEffect(() => {
//     fetchGroups();
//     fetchMessages();
    
//     // Initialize socket connection
//     socketRef.current = io(BASE_URL);
    
//     // Set up socket listeners
//     socketRef.current.on("connect", () => {
//       console.log("Connected to server");
//     });
    
//     socketRef.current.on("newMessage", (message) => {
//       if (message.groupId === activeGroup?.id) {
//         const formattedMessage = {
//           id: message.id,
//           groupId: message.groupId,
//           senderId: message.memberId,
//           sender: message.memberName,
//           avatar: "/default-avatar.png",
//           content: message.message,
//           replyTo: message.replyTo ? parseInt(message.replyTo) : null,
//           reactions: groupReactions(message.reaction),
//           timestamp: message.createdAt
//             ? new Date(message.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "Just now",
//           isEdited: false,
//           seenBy: [],
//           mentionedUsers: [],
//         };
//         setMessages((prev) => [...prev, formattedMessage]);
//       }
//     });
    
//     socketRef.current.on("typing", (data) => {
//       if (data.groupId === activeGroup?.id && data.userId !== currentUser.id) {
//         setIsTyping(true);
//         setTypingUser(teamMembers.find(m => m.id === data.userId));
        
//         // Clear typing indicator after 3 seconds
//         setTimeout(() => {
//           setIsTyping(false);
//           setTypingUser(null);
//         }, 3000);
//       }
//     });
    
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, [activeGroup]);

//   useEffect(() => {
//     // Scroll to bottom when messages change
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const fetchGroups = async () => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}group/getAllGroups`,
//         {
//           headers: { authorization: `Bearer ${token}` },
//         }
//       );
//       if (response.data.status) {
//         setGroups(response.data.data);
//         // Set the first group as active by default
//         if (response.data.data.length > 0 && !activeGroup) {
//           setActiveGroup(response.data.data[0]);
//           fetchGroupMessages(response.data.data[0].id);
//         }
//       } else {
//         setError(response.data.message || "Failed to fetch groups");
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch groups:", err);
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}groupChat/getAllGroupMessages`,
//         {
//           headers: { authorization: `Bearer ${token}` },
//         }
//       );
//       if (response.data.status) {
//         const formattedMessages = response.data.data.map((msg) => ({
//           id: msg.id,
//           groupId: msg.groupId,
//           senderId: msg.memberId,
//           sender: msg.memberName,
//           avatar: "/default-avatar.png",
//           content: msg.message,
//           replyTo: msg.replyTo ? parseInt(msg.replyTo) : null,
//           reactions: groupReactions(msg.reaction),
//           timestamp: msg.createdAt
//             ? new Date(msg.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "Just now",
//           isEdited: false,
//           seenBy: [],
//           mentionedUsers: [],
//         }));
//         setMessages(formattedMessages);
//       }
//     } catch (err) {
//       console.error("Failed to fetch messages:", err);
//     }
//   };

//   const groupReactions = (reactionsArray) => {
//     if (!reactionsArray || !Array.isArray(reactionsArray)) return [];

//     const reactionMap = {};
//     reactionsArray.forEach(({ emoji, by }) => {
//       if (!reactionMap[emoji]) {
//         reactionMap[emoji] = { emoji, count: 0, users: [] };
//       }
//       reactionMap[emoji].count++;
//       reactionMap[emoji].users.push(by);
//     });

//     return Object.values(reactionMap).map((r) => ({
//       emoji: r.emoji,
//       count: r.count,
//       reacted: r.users.includes(currentUser.id),
//     }));
//   };

//   const fetchGroupMessages = async (groupId) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}groupChat/getGroupMessages/${groupId}`,
//         {
//           headers: { authorization: `Bearer ${token}` },
//         }
//       );
//       if (response.data.status) {
//         const formattedMessages = response.data.data.map((msg) => ({
//           id: msg.id,
//           groupId: msg.groupId,
//           senderId: msg.memberId,
//           sender: msg.memberName,
//           avatar: "/default-avatar.png",
//           content: msg.message,
//           replyTo: msg.replyTo ? parseInt(msg.replyTo) : null,
//           reactions: groupReactions(msg.reaction),
//           timestamp: msg.createdAt
//             ? new Date(msg.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "Just now",
//           isEdited: false,
//           seenBy: [],
//           mentionedUsers: [],
//         }));
//         setMessages(formattedMessages);
//       }
//     } catch (err) {
//       console.error("Failed to fetch group messages:", err);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "" || !activeGroup) return;

//     try {
//       const response = await axios.post(
//         `${BASE_URL}groupChat/addGroupMessage`,
//         {
//           groupId: activeGroup.id,
//           memberId: currentUser.id,
//           memberName: currentUser.name,
//           message: newMessage,
//           replyTo: replyTo || null,
//           groupName: activeGroup.name,
//           role: currentUser.role,
//           reaction: [],
//         },
//         {
//           headers: { authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.status) {
//         // Emit the new message through socket
//         socketRef.current.emit("sendMessage", {
//           groupId: activeGroup.id,
//           memberId: currentUser.id,
//           memberName: currentUser.name,
//           message: newMessage,
//           replyTo: replyTo || null,
//           groupName: activeGroup.name,
//           role: currentUser.role,
//           reaction: [],
//         });

//         setNewMessage("");
//         setReplyTo(null);
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       alert("Failed to send message. Please try again.");
//     }
//   };

//   const handleKeyDown = (e) => {
//     // Handle Enter key to send message
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (editingMessageId) {
//         handleSaveEdit();
//       } else {
//         handleSendMessage();
//       }
//     }
    
//     // Handle typing indicator
//     if (e.key !== "Enter" && activeGroup) {
//       socketRef.current.emit("typing", {
//         groupId: activeGroup.id,
//         userId: currentUser.id,
//       });
//     }
//   };

//   const handleEditMessage = (messageId) => {
//     const message = messages.find((m) => m.id === messageId);
//     if (message) {
//       setEditingMessageId(messageId);
//       setEditedMessageContent(message.content);
//       messageInputRef.current.focus();
//     }
//   };

//   const handleSaveEdit = async () => {
//     if (editedMessageContent.trim() === "") return;

//     try {
//       const response = await axios.put(
//         `${BASE_URL}groupChat/updateGroupMessage/${editingMessageId}`,
//         {
//           message: editedMessageContent,
//         },
//         {
//           headers: { authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.status) {
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.id === editingMessageId
//               ? {
//                   ...msg,
//                   content: editedMessageContent,
//                   isEdited: true,
//                 }
//               : msg
//           )
//         );
//         setEditingMessageId(null);
//         setEditedMessageContent("");
//       }
//     } catch (error) {
//       console.error("Error editing message:", error);
//       alert("Failed to edit message. Please try again.");
//     }
//   };

//   const handleDeleteMessage = async (messageId) => {
//     if (!window.confirm("Are you sure you want to delete this message?")) return;

//     try {
//       const response = await axios.delete(
//         `${BASE_URL}groupChat/deleteGroupMessage/${messageId}`,
//         {
//           headers: { authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.status) {
//         setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
//       }
//     } catch (error) {
//       console.error("Error deleting message:", error);
//       alert("Failed to delete message. Please try again.");
//     }
//   };

//   const handleReaction = async (messageId, emoji) => {
//     try {
//       const response = await axios.post(
//         `${BASE_URL}groupChat/addReaction`,
//         {
//           messageId,
//           emoji,
//           userId: currentUser.id,
//         },
//         {
//           headers: { authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.status) {
//         // Update the message with the new reaction
//         setMessages((prev) =>
//           prev.map((msg) => {
//             if (msg.id === messageId) {
//               const updatedReactions = [...msg.reactions];
//               const existingReactionIndex = updatedReactions.findIndex(
//                 (r) => r.emoji === emoji
//               );

//               if (existingReactionIndex >= 0) {
//                 // Update existing reaction
//                 const reaction = updatedReactions[existingReactionIndex];
//                 if (reaction.reacted) {
//                   // Remove reaction
//                   reaction.count--;
//                   reaction.reacted = false;
//                 } else {
//                   // Add reaction
//                   reaction.count++;
//                   reaction.reacted = true;
//                 }
//               } else {
//                 // Add new reaction
//                 updatedReactions.push({
//                   emoji,
//                   count: 1,
//                   reacted: true,
//                 });
//               }

//               return {
//                 ...msg,
//                 reactions: updatedReactions,
//               };
//             }
//             return msg;
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Error adding reaction:", error);
//       alert("Failed to add reaction. Please try again.");
//     }
//   };

//   const handleCreateGroup = async () => {
//     if (newGroupName.trim() === "" || selectedMembers.length === 0) return;

//     try {
//       const response = await axios.post(
//         `${BASE_URL}group/createGroup`,
//         {
//           name: newGroupName,
//           members: [...selectedMembers, currentUser.id],
//           admin: currentUser.id,
//         },
//         {
//           headers: { authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.status) {
//         // Add the new group to the list
//         const newGroup = {
//           id: response.data.data.id,
//           name: newGroupName,
//           createdAt: new Date().toISOString(),
//         };
//         setGroups((prev) => [...prev, newGroup]);
        
//         // Reset form
//         setNewGroupName("");
//         setSelectedMembers([]);
//         setShowCreateGroup(false);
        
//         // Switch to the new group
//         setActiveGroup(newGroup);
//         fetchGroupMessages(newGroup.id);
//       } else {
//         alert(response.data.message || "Failed to create group");
//       }
//     } catch (error) {
//       console.error("Error creating group:", error);
//       alert("Failed to create group. Please try again.");
//     }
//   };

//   const toggleMemberSelection = (memberId) => {
//     setSelectedMembers((prev) =>
//       prev.includes(memberId)
//         ? prev.filter((id) => id !== memberId)
//         : [...prev, memberId]
//     );
//   };

//   const handleMentionSelect = (member) => {
//     const mentionText = `@${member.name} `;
//     const beforeMention = newMessage.substring(0, mentionPosition);
//     const afterMention = newMessage.substring(
//       messageInputRef.current.selectionStart
//     );
    
//     setNewMessage(beforeMention + mentionText + afterMention);
//     setShowMentionList(false);
    
//     // Focus back on input and move cursor to end of mention
//     setTimeout(() => {
//       messageInputRef.current.focus();
//       const newPosition = beforeMention.length + mentionText.length;
//       messageInputRef.current.setSelectionRange(newPosition, newPosition);
//     }, 0);
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setNewMessage(value);
    
//     // Check for mentions (triggered by @)
//     const cursorPosition = e.target.selectionStart;
//     const textBeforeCursor = value.substring(0, cursorPosition);
//     const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
    
//     if (atSymbolIndex >= 0 && (atSymbolIndex === 0 || textBeforeCursor[atSymbolIndex - 1] === ' ')) {
//       const mentionText = textBeforeCursor.substring(atSymbolIndex + 1);
//       if (mentionText && !mentionText.includes(' ')) {
//         setMentionQuery(mentionText);
//         setMentionPosition(atSymbolIndex);
//         setShowMentionList(true);
//       } else {
//         setShowMentionList(false);
//       }
//     } else {
//       setShowMentionList(false);
//     }
    
//     // Auto-resize textarea
//     e.target.style.height = 'auto';
//     e.target.style.height = `${e.target.scrollHeight}px`;
//   };

//   // Handle mobile chat selection
//   const handleMobileChatSelect = (type, id) => {
//     if (type === "group") {
//       const group = groups.find(g => g.id === id);
//       if (group) {
//         setActiveGroup(group);
//         setActivePrivateChat(null);
//         fetchGroupMessages(group.id);
//       }
//     } else if (type === "private") {
//       const member = teamMembers.find(m => m.id === id);
//       if (member) {
//         setActivePrivateChat(id);
//         setActiveGroup(null);
//       }
//     }
//     setShowMobileChat(true);
//   };

//   // Handle back to chat list on mobile
//   const handleBackToChatList = () => {
//     setShowMobileChat(false);
//   };

//   return (
//     <div className="container-fluid d-flex flex-column" style={{ height: "88vh" }}>
//       {/* Main Content */}
//       <div className="flex-grow-1 d-flex overflow-hidden">
//         {/* Left Sidebar - Always visible on mobile when not in chat */}
//         <div className={`d-lg-block col-lg-3 border-end bg-card p-3 overflow-auto ${showMobileChat ? 'd-none' : 'd-block'}`}>
//           {/* User Profile */}
//           <div className="d-flex align-items-center mb-4 p-2 rounded bg-light">
//             <img
//               src={currentUser.avatar}
//               alt={currentUser.name}
//               className="rounded-circle me-2"
//               width="40"
//               height="40"
//             />
//             <div>
//               <strong className="text-black">{currentUser.name}</strong>
//               <small className="d-block text-success">Online</small>
//             </div>
//           </div>

//           {/* Chat Type Toggle */}
//           <div className="btn-group w-100 mb-3">
//             <button
//               className={`btn btn-sm ${
//                 activeChat === "group" ? "btn-primary" : "btn-outline-secondary"
//               }`}
//               onClick={() => setActiveChat("group")}
//             >
//               Groups
//             </button>
//             <button
//               className={`btn btn-sm ${
//                 activeChat === "private"
//                   ? "btn-primary"
//                   : "btn-outline-secondary"
//               }`}
//               onClick={() => setActiveChat("private")}
//             >
//               Private
//             </button>
//           </div>

//           {activeChat === "group" ? (
//             <>
//               {/* Group Chat Section */}
//               {currentUser.role === "Admin" ||
//               currentUser.role === "Manager" ? (
//                 <button
//                   className="btn btn-primary btn-sm w-100 mb-3"
//                   onClick={() => setShowCreateGroup(true)}
//                 >
//                   Create New Group
//                 </button>
//               ) : null}

//               {/* Group List */}
//               <h6 className="mb-3">GROUP CHATS</h6>
//               <div className="list-group mb-4">
//                 {loading ? (
//                   <div>Loading groups...</div>
//                 ) : error ? (
//                   <div className="text-danger">Error: {error}</div>
//                 ) : groups.length > 0 ? (
//                   groups.map((group) => (
//                     <button
//                       key={group.id}
//                       className={`list-group-item list-group-item-action ${
//                         activeGroup?.id === group.id ? "active" : ""
//                       }`}
//                       onClick={() => {
//                         setActiveGroup(group);
//                         setActivePrivateChat(null); // Clear private chat if any
//                         fetchGroupMessages(group.id);
//                         // For mobile, show chat view
//                         if (window.innerWidth < 992) {
//                           setShowMobileChat(true);
//                         }
//                       }}
//                     >
//                       <div className="d-flex justify-content-between">
//                         <strong>{group.name}</strong>
//                       </div>
//                       <small>
//                         Created:{" "}
//                         {new Date(group.createdAt).toLocaleDateString()}
//                       </small>
//                     </button>
//                   ))
//                 ) : (
//                   <div>No groups found</div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Private Chat Section */}
//               <h6 className="mb-3">DIRECT MESSAGES</h6>
//               <ul className="list-unstyled">
//                 {teamMembers.map((member) => (
//                   <li
//                     key={member.id}
//                     className={`mb-2 p-2 rounded ${
//                       activePrivateChat === member.id
//                         ? "bg-primary text-white"
//                         : ""
//                     }`}
//                     onClick={() => {
//                       setActivePrivateChat(member.id);
//                       setActiveGroup(null);
//                       // For mobile, show chat view
//                       if (window.innerWidth < 992) {
//                         setShowMobileChat(true);
//                       }
//                     }}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <div className="d-flex align-items-center">
//                       <div className="position-relative me-2">
//                         <img
//                           src={member.avatar}
//                           alt={member.name}
//                           className="rounded-circle"
//                           width="32"
//                         />
//                         {member.isOnline ? (
//                           <span
//                             className="position-absolute bottom-0 end-0 bg-success rounded-circle"
//                             style={{
//                               width: "10px",
//                               height: "10px",
//                               border: "2px solid #f8f9fa",
//                             }}
//                           ></span>
//                         ) : null}
//                       </div>
//                       <div>
//                         <div>{member.name}</div>
//                         <small
//                           className={
//                             member.isOnline ? "text-success" : "text-muted"
//                           }
//                         >
//                           {member.isOnline ? "Online" : member.lastSeen}
//                         </small>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}

//           {/* Team Members */}
//           <h6 className="mb-3">TEAM MEMBERS</h6>
//           <ul className="list-unstyled">
//             {teamMembers.map((member) => (
//               <li key={member.id} className="mb-2 d-flex align-items-center">
//                 <div className="position-relative me-2">
//                   <img
//                     src={member.avatar}
//                     alt={member.name}
//                     className="rounded-circle"
//                     width="32"
//                     height="32"
//                   />
//                   {member.isOnline && (
//                     <span
//                       className="position-absolute bottom-0 end-0 bg-success rounded-circle"
//                       style={{
//                         width: "10px",
//                         height: "10px",
//                         border: "2px solid #f8f9fa",
//                       }}
//                     ></span>
//                   )}
//                 </div>
//                 <span className="small">{member.name}</span>
//                 {member.role === "Admin" && (
//                   <span className="badge bg-danger ms-2">Admin</span>
//                 )}
//                 {member.role === "Manager" && (
//                   <span className="badge bg-warning ms-2">Manager</span>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right Content Area - Hidden on mobile when not in chat */}
//         <div className={`col-12 col-lg-9 d-flex flex-column h-100 ${showMobileChat ? 'd-flex' : 'd-none d-lg-flex'}`}>
//           {/* Chat Header - Fixed */}
//           <div className="p-3 border-bottom bg-main d-flex justify-content-between align-items-center chat-header">
//             <div className="d-flex align-items-center">
//               {/* Back button for mobile */}
//               <button 
//                 className="btn btn-sm btn-outline-light me-2 d-lg-none" 
//                 onClick={handleBackToChatList}
//               >
//                 <i className="fas fa-arrow-left"></i>
//               </button>
//               <div>
//                 <h4 className="mb-0 text-white">
//                   {activePrivateChat
//                     ? teamMembers.find((m) => m.id === activePrivateChat)?.name
//                     : activeGroup?.name || "Select a group"}
//                 </h4>
//                 <small className="text-white">
//                   {activePrivateChat
//                     ? teamMembers.find((m) => m.id === activePrivateChat)?.isOnline
//                       ? "Online"
//                       : `Last seen ${
//                           teamMembers.find((m) => m.id === activePrivateChat)
//                             ?.lastSeen
//                         }`
//                     : activeGroup
//                     ? `Group • ${activeGroup.members?.length || 0} members`
//                     : ""}
//                 </small>
//               </div>
//             </div>
//             <div className="d-flex">
//               <button className="btn btn-sm btn-outline-light me-2">
//                 <i className="fas fa-search"></i>
//               </button>
//               <div className="dropdown">
//                 <button
//                   className="btn btn-sm btn-outline-light dropdown-toggle"
//                   data-bs-toggle="dropdown"
//                 >
//                   <i className="fas fa-ellipsis-v"></i>
//                 </button>
//                 <ul className="dropdown-menu dropdown-menu-end">
//                   <li>
//                     <button className="dropdown-item">View Members</button>
//                   </li>
//                   {activeChat === "group" && (
//                     <li>
//                       <button className="dropdown-item">Group Settings</button>
//                     </li>
//                   )}
//                   <li>
//                     <button className="dropdown-item">Clear History</button>
//                   </li>
//                   <li>
//                     <hr className="dropdown-divider" />
//                   </li>
//                   <li>
//                     <button className="dropdown-item text-danger">
//                       Leave Chat
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Chat Messages - Scrollable Area */}
//           <div
//             className="flex-grow-1 overflow-auto p-3 bg-main chat-messages"
//             style={{ backgroundColor: "#1e1e1e" }}
//           >
//             {messages
//               .filter((message) =>
//                 activePrivateChat
//                   ? message.senderId === activePrivateChat ||
//                     message.senderId === currentUser.id
//                   : activeGroup && message.groupId === activeGroup.id
//               )
//               .map((message) => (
//                 <div
//                   key={message.id}
//                   className={`mb-3 ${
//                     message.senderId === currentUser.id ? "text-end" : ""
//                   }`}
//                 >
//                   {message.replyTo && (
//                     <div
//                       className={`small text-white mb-1 ${
//                         message.senderId === currentUser.id ? "text-end" : ""
//                       }`}
//                     >
//                       Replying to:{" "}
//                       {messages
//                         .find((m) => m.id === message.replyTo)
//                         ?.content.substring(0, 50)}
//                       ...
//                     </div>
//                   )}
//                   <div
//                     className={`d-flex ${
//                       message.senderId === currentUser.id
//                         ? "justify-content-end"
//                         : ""
//                     }`}
//                   >
//                     {message.senderId !== currentUser.id && (
//                       <img
//                         src={message.avatar}
//                         alt={message.sender}
//                         className="rounded-circle me-2"
//                         width="40"
//                         height="40"
//                       />
//                     )}
//                     <div
//                       className={`rounded p-3 position-relative ${
//                         message.senderId === currentUser.id
//                           ? "bg-primary"
//                           : "bg-card"
//                       }`}
//                       style={{ maxWidth: "75%" }}
//                     >
//                       <div className="d-flex justify-content-between align-items-center mb-1">
//                         <strong
//                           className={
//                             message.senderId === currentUser.id
//                               ? "text-white"
//                               : "text-white"
//                           }
//                         >
//                           {message.sender}
//                         </strong>
//                         <small
//                           className={
//                             message.senderId === currentUser.id
//                               ? "text-white-50"
//                               : "text-white-50"
//                           }
//                         >
//                           {message.timestamp}
//                           {message.isEdited && (
//                             <span className="ms-1">(edited)</span>
//                           )}
//                         </small>
//                       </div>
//                       <p className="mb-2 text-white">
//                         {message.content}
//                         {message.mentionedUsers?.includes(currentUser.id) && (
//                           <span className="badge bg-warning ms-2">
//                             Mentioned
//                           </span>
//                         )}
//                       </p>

//                       <div
//                         className={`position-absolute ${
//                           message.senderId === currentUser.id
//                             ? "left-0 start-100"
//                             : "right-0 end-100"
//                         } px-2 d-flex`}
//                       >
//                         <button
//                           className="btn btn-sm p-0 text-white-50"
//                           onClick={() => {
//                             setReplyTo(message.id);
//                             messageInputRef.current.focus();
//                           }}
//                           title="Reply"
//                         >
//                           <i className="fas fa-reply"></i>
//                         </button>
//                         {message.senderId === currentUser.id && (
//                           <>
//                             <button
//                               className="btn btn-sm p-0 mx-1 text-white-50"
//                               onClick={() => handleEditMessage(message.id)}
//                               title="Edit"
//                             >
//                               <i className="fas fa-edit"></i>
//                             </button>
//                             <button
//                               className="btn btn-sm p-0 text-white-50"
//                               onClick={() => handleDeleteMessage(message.id)}
//                               title="Delete"
//                             >
//                               <i className="fas fa-trash"></i>
//                             </button>
//                           </>
//                         )}
//                       </div>

//                       {message.reactions.length > 0 && (
//                         <div className="d-flex flex-wrap gap-1 mt-2">
//                           {message.reactions.map((reaction, idx) => (
//                             <button
//                               key={idx}
//                               className={`btn btn-sm p-0 px-1 rounded-pill ${
//                                 reaction.reacted
//                                   ? "bg-white"
//                                   : message.senderId === currentUser.id
//                                   ? "bg-white-10"
//                                   : "bg-light"
//                               }`}
//                               onClick={() =>
//                                 handleReaction(message.id, reaction.emoji)
//                               }
//                             >
//                               <span>{reaction.emoji}</span>
//                               <small className="ms-1">{reaction.count}</small>
//                             </button>
//                           ))}
//                         </div>
//                       )}

//                       {activePrivateChat &&
//                         message.senderId === currentUser.id && (
//                           <div className="text-end mt-1">
//                             <small className="text-white-50">
//                               {message.seenBy.includes(activePrivateChat)
//                                 ? "Seen"
//                                 : "Delivered"}
//                             </small>
//                           </div>
//                         )}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//             {editingMessageId && (
//               <div className="mb-3 p-3 bg-dark rounded">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <strong>Editing message</strong>
//                   <button
//                     className="btn btn-sm btn-outline-light"
//                     onClick={() => setEditingMessageId(null)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//                 <textarea
//                   value={editedMessageContent}
//                   onChange={(e) => setEditedMessageContent(e.target.value)}
//                   className="form-control mb-2"
//                   rows="3"
//                 />
//                 <button
//                   onClick={handleSaveEdit}
//                   className="btn btn-primary btn-sm"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             )}

//             {isTyping && typingUser && (
//               <div className="d-flex align-items-center mb-3">
//                 <img
//                   src={typingUser.avatar}
//                   alt="Typing"
//                   className="rounded-circle me-2"
//                   width="40"
//                   height="40"
//                 />
//                 <div className="rounded p-2 bg-card">
//                   <div className="d-flex align-items-center">
//                     <div className="typing-dots">
//                       <div className="typing-dot"></div>
//                       <div className="typing-dot"></div>
//                       <div className="typing-dot"></div>
//                     </div>
//                     <small className="ms-2 text-white">
//                       {typingUser.name} is typing...
//                     </small>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messageEndRef} />
//           </div>

//           {/* Message Input - Fixed Footer */}
//           <div className="p-3 border-top bg-main chat-footer">
//             <div className="position-relative">
//               {showMentionList && (
//                 <div
//                   className="position-absolute bottom-100 mb-2 bg-white border rounded p-2 mb-5"
//                   style={{
//                     zIndex: 1000,
//                     maxHeight: "200px",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {teamMembers
//                     .filter(
//                       (member) =>
//                         member.name
//                           .toLowerCase()
//                           .includes(mentionQuery.toLowerCase()) &&
//                         member.id !== currentUser.id
//                     )
//                     .map((member) => (
//                       <div
//                         key={member.id}
//                         className="p-2 hover-bg cursor-pointer"
//                         onClick={() => handleMentionSelect(member)}
//                       >
//                         <div className="d-flex align-items-center">
//                           <img
//                             src={member.avatar}
//                             alt={member.name}
//                             className="rounded-circle me-2"
//                             width="32"
//                             height="32"
//                           />
//                           <div>
//                             <div>{member.name}</div>
//                             <small className="text-muted">
//                               {member.role}
//                             </small>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               )}

//               {replyTo && (
//                 <div className="bg-dark p-2 mb-2 rounded d-flex justify-content-between align-items-center">
//                   <small className="text-white">
//                     Replying to:{" "}
//                     {messages
//                       .find((m) => m.id === replyTo)
//                       ?.content.substring(0, 50)}
//                     ...
//                   </small>
//                   <button
//                     className="btn btn-sm btn-outline-light"
//                     onClick={() => setReplyTo(null)}
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </div>
//               )}

//               <textarea
//                 ref={messageInputRef}
//                 value={editingMessageId ? editedMessageContent : newMessage}
//                 onChange={handleInputChange}
//                 onKeyDown={handleKeyDown}
//                 className="form-control mb-2 bg-card text-white"
//                 rows="1"
//                 placeholder="Type your message here..."
//                 style={{ resize: "none", overflow: "hidden" }}
//               />
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <button
//                     className="btn btn-sm btn-outline-light me-2"
//                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                   >
//                     <i className="far fa-smile"></i>
//                   </button>
//                 </div>
//                 <button
//                   onClick={editingMessageId ? handleSaveEdit : handleSendMessage}
//                   disabled={
//                     editingMessageId
//                       ? editedMessageContent.trim() === ""
//                       : newMessage.trim() === "" || !activeGroup
//                   }
//                   className={`btn ${
//                     editingMessageId
//                       ? "btn-warning"
//                       : newMessage.trim() === "" || !activeGroup
//                       ? "btn-outline-primary"
//                       : "btn-primary"
//                   }`}
//                 >
//                   {editingMessageId ? "Save Edit" : "Send"}{" "}
//                   <i className="fas fa-paper-plane ms-1"></i>
//                 </button>
//               </div>

//               {/* Emoji Picker */}
//               {showEmojiPicker && (
//                 <div
//                   ref={emojiPickerRef}
//                   className="position-absolute bottom-100 bg-white border rounded p-2 mb-2 shadow-sm"
//                   style={{ zIndex: 1000 }}
//                 >
//                   <div
//                     className="d-flex flex-wrap"
//                     style={{ width: "200px" }}
//                   >
//                     {emojis.map((emoji, idx) => (
//                       <button
//                         key={idx}
//                         className="btn btn-sm p-1"
//                         onClick={() => {
//                           setNewMessage((prev) => prev + emoji);
//                           setShowEmojiPicker(false);
//                         }}
//                       >
//                         {emoji}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Create Group Modal */}
//       {showCreateGroup && (
//         <div
//           className="modal show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Create New Group</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowCreateGroup(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="mb-3">
//                   <label className="form-label">Group Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={newGroupName}
//                     onChange={(e) => setNewGroupName(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Select Members</label>
//                   <div>
//                     {teamMembers
//                       .filter((member) => member.id !== currentUser.id)
//                       .map((member) => (
//                         <div key={member.id} className="form-check mb-2">
//                           <input
//                             className="form-check-input"
//                             type="checkbox"
//                             id={`member-${member.id}`}
//                             checked={selectedMembers.includes(member.id)}
//                             onChange={() => toggleMemberSelection(member.id)}
//                           />
//                           <label
//                             className="form-check-label d-flex align-items-center"
//                             htmlFor={`member-${member.id}`}
//                           >
//                             <img
//                               src={member.avatar}
//                               alt={member.name}
//                               className="rounded-circle me-2"
//                               width="32"
//                               height="32"
//                             />
//                             {member.name}
//                           </label>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowCreateGroup(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleCreateGroup}
//                   disabled={
//                     newGroupName.trim() === "" || selectedMembers.length === 0
//                   }
//                 >
//                   Create Group
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Collaboration;



import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./Collaboration.css"; // Import your CSS styles
import axios from "axios";
import BASE_URL from "../../../config";

function Collaboration() {
  // State for team members - will be fetched from API
  const [teamMembers, setTeamMembers] = useState([]);
  // Current user (you)
  const currentUser = {
    id: 100,
    name: "You",
    avatar:
      "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=userme&orientation=squarish",
    isOnline: true,
    role: "Admin",
  };
  const [messages, setMessages] = useState([]);
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
  const token = localStorage.getItem("authToken");
  // Refs
  const messageEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messageInputRef = useRef(null);
  const socketRef = useRef(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false); // New state for mobile chat view
  // Available emojis
  const emojis = ["😀", "😂", "😍", "👍", "👋", "🎉", "❤️", "🔥", "👏", "🙏"];

  useEffect(() => {
    // Fetch team members from API
    fetchTeamMembers();
    fetchGroups();
    fetchMessages();
    // Initialize socket connection
    socketRef.current = io("https://3bk13b04-8800.inc1.devtunnels.ms/");
    // Set up socket listeners
    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });
    socketRef.current.on("newMessage", (message) => {
      if (message.groupId === activeGroup?.id) {
        const formattedMessage = {
          id: message.id,
          groupId: message.groupId,
          senderId: message.memberId,
          sender: message.memberName,
          avatar: "/default-avatar.png",
          content: message.message,
          replyTo: message.replyTo ? parseInt(message.replyTo) : null,
          reactions: groupReactions(message.reaction),
          timestamp: message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Just now",
          isEdited: false,
          seenBy: [],
          mentionedUsers: [],
        };
        setMessages((prev) => [...prev, formattedMessage]);
      }
    });
    socketRef.current.on("typing", (data) => {
      if (data.groupId === activeGroup?.id && data.userId !== currentUser.id) {
        setIsTyping(true);
        setTypingUser(teamMembers.find(m => m.id === data.userId));
        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          setIsTyping(false);
          setTypingUser(null);
        }, 3000);
      }
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [activeGroup]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}member/getAllMembers`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        setTeamMembers(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch team members");
      }
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      setError(err.message);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}group/getAllGroups`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        setGroups(response.data.data);
        // Set the first group as active by default
        if (response.data.data.length > 0 && !activeGroup) {
          setActiveGroup(response.data.data[0]);
          fetchGroupMessages(response.data.data[0].id);
        }
      } else {
        setError(response.data.message || "Failed to fetch groups");
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}groupChat/getAllGroupMessages`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        const formattedMessages = response.data.data.map((msg) => ({
          id: msg.id,
          groupId: msg.groupId,
          senderId: msg.memberId,
          sender: msg.memberName,
          avatar: "/default-avatar.png",
          content: msg.message,
          replyTo: msg.replyTo ? parseInt(msg.replyTo) : null,
          reactions: groupReactions(msg.reaction),
          timestamp: msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Just now",
          isEdited: false,
          seenBy: [],
          mentionedUsers: [],
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const groupReactions = (reactionsArray) => {
    if (!reactionsArray || !Array.isArray(reactionsArray)) return [];
    const reactionMap = {};
    reactionsArray.forEach(({ emoji, by }) => {
      if (!reactionMap[emoji]) {
        reactionMap[emoji] = { emoji, count: 0, users: [] };
      }
      reactionMap[emoji].count++;
      reactionMap[emoji].users.push(by);
    });
    return Object.values(reactionMap).map((r) => ({
      emoji: r.emoji,
      count: r.count,
      reacted: r.users.includes(currentUser.id),
    }));
  };

  const fetchGroupMessages = async (groupId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}groupChat/getGroupMessages/${groupId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        const formattedMessages = response.data.data.map((msg) => ({
          id: msg.id,
          groupId: msg.groupId,
          senderId: msg.memberId,
          sender: msg.memberName,
          avatar: "/default-avatar.png",
          content: msg.message,
          replyTo: msg.replyTo ? parseInt(msg.replyTo) : null,
          reactions: groupReactions(msg.reaction),
          timestamp: msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Just now",
          isEdited: false,
          seenBy: [],
          mentionedUsers: [],
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Failed to fetch group messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeGroup) return;
    
    // Create a temporary message object to show immediately
    const tempMessage = {
      id: Date.now(), // Temporary ID
      groupId: activeGroup.id,
      senderId: currentUser.id,
      sender: currentUser.name,
      avatar: currentUser.avatar,
      content: newMessage,
      replyTo: replyTo || null,
      reactions: [],
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isEdited: false,
      seenBy: [],
      mentionedUsers: [],
    };
    
    // Add the temporary message to the state immediately
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      const response = await axios.post(
        `${BASE_URL}groupChat/addGroupMessage`,
        {
          groupId: activeGroup.id,
          memberId: currentUser.id,
          memberName: currentUser.name,
          message: newMessage,
          replyTo: replyTo || null,
          groupName: activeGroup.name,
          role: currentUser.role,
          reaction: [],
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.status) {
        // Update the temporary message with the real ID from the server
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...msg, id: response.data.data.id } // Update with real ID
              : msg
          )
        );
        
        // Emit the new message through socket
        socketRef.current.emit("sendMessage", {
          groupId: activeGroup.id,
          memberId: currentUser.id,
          memberName: currentUser.name,
          message: newMessage,
          replyTo: replyTo || null,
          groupName: activeGroup.name,
          role: currentUser.role,
          reaction: [],
        });
        
        setNewMessage("");
        setReplyTo(null);
      } else {
        // If the API call fails, remove the temporary message
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        alert(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // If the API call fails, remove the temporary message
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key to send message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessageId) {
        handleSaveEdit();
      } else {
        handleSendMessage();
      }
    }
    // Handle typing indicator
    if (e.key !== "Enter" && activeGroup) {
      socketRef.current.emit("typing", {
        groupId: activeGroup.id,
        userId: currentUser.id,
      });
    }
  };

  const handleEditMessage = (messageId) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditedMessageContent(message.content);
      messageInputRef.current.focus();
    }
  };

  const handleSaveEdit = async () => {
    if (editedMessageContent.trim() === "") return;
    
    // Update the message in the state immediately
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId
          ? {
              ...msg,
              content: editedMessageContent,
              isEdited: true,
            }
          : msg
      )
    );
    
    try {
      const response = await axios.put(
        `${BASE_URL}groupChat/updateGroupMessage/${editingMessageId}`,
        {
          message: editedMessageContent,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.status) {
        // The message is already updated in the state, so we just need to clear the editing state
        setEditingMessageId(null);
        setEditedMessageContent("");
      } else {
        // If the API call fails, revert the change
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessageId
              ? {
                  ...msg,
                  content: messages.find(m => m.id === editingMessageId).content,
                  isEdited: false,
                }
              : msg
          )
        );
        alert(response.data.message || "Failed to edit message");
      }
    } catch (error) {
      console.error("Error editing message:", error);
      // If the API call fails, revert the change
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessageId
            ? {
                ...msg,
                content: messages.find(m => m.id === editingMessageId).content,
                isEdited: false,
              }
            : msg
        )
      );
      alert("Failed to edit message. Please try again.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    // Remove the message from the state immediately
    const originalMessages = [...messages];
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    
    try {
      const response = await axios.delete(
        `${BASE_URL}groupChat/deleteGroupMessage/${messageId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      
      if (!response.data.status) {
        // If the API call fails, restore the message
        setMessages(originalMessages);
        alert(response.data.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      // If the API call fails, restore the message
      setMessages(originalMessages);
      alert("Failed to delete message. Please try again.");
    }
  };

  const handleReaction = async (messageId, emoji) => {
    // Update the reaction in the state immediately
    const updatedMessages = messages.map((msg) => {
      if (msg.id === messageId) {
        const updatedReactions = [...msg.reactions];
        const existingReactionIndex = updatedReactions.findIndex(
          (r) => r.emoji === emoji
        );
        
        if (existingReactionIndex >= 0) {
          // Update existing reaction
          const reaction = updatedReactions[existingReactionIndex];
          if (reaction.reacted) {
            // Remove reaction
            reaction.count--;
            reaction.reacted = false;
          } else {
            // Add reaction
            reaction.count++;
            reaction.reacted = true;
          }
        } else {
          // Add new reaction
          updatedReactions.push({
            emoji,
            count: 1,
            reacted: true,
          });
        }
        
        return {
          ...msg,
          reactions: updatedReactions,
        };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    
    try {
      const response = await axios.post(
        `${BASE_URL}groupChat/addReaction`,
        {
          messageId,
          emoji,
          userId: currentUser.id,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      
      if (!response.data.status) {
        // If the API call fails, revert the reaction
        setMessages(messages);
        alert(response.data.message || "Failed to add reaction");
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
      // If the API call fails, revert the reaction
      setMessages(messages);
      alert("Failed to add reaction. Please try again.");
    }
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim() === "" || selectedMembers.length === 0) return;
    try {
      const response = await axios.post(
        `${BASE_URL}group/createGroup`,
        {
          name: newGroupName,
          members: [...selectedMembers, currentUser.id],
          admin: currentUser.id,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        // Add the new group to the list
        const newGroup = {
          id: response.data.data.id,
          name: newGroupName,
          createdAt: new Date().toISOString(),
        };
        setGroups((prev) => [...prev, newGroup]);
        // Reset form
        setNewGroupName("");
        setSelectedMembers([]);
        setShowCreateGroup(false);
        // Switch to the new group
        setActiveGroup(newGroup);
        fetchGroupMessages(newGroup.id);
      } else {
        alert(response.data.message || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleMentionSelect = (member) => {
    const mentionText = `@${member.name} `;
    const beforeMention = newMessage.substring(0, mentionPosition);
    const afterMention = newMessage.substring(
      messageInputRef.current.selectionStart
    );
    setNewMessage(beforeMention + mentionText + afterMention);
    setShowMentionList(false);
    // Focus back on input and move cursor to end of mention
    setTimeout(() => {
      messageInputRef.current.focus();
      const newPosition = beforeMention.length + mentionText.length;
      messageInputRef.current.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    // Check for mentions (triggered by @)
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
    if (atSymbolIndex >= 0 && (atSymbolIndex === 0 || textBeforeCursor[atSymbolIndex - 1] === ' ')) {
      const mentionText = textBeforeCursor.substring(atSymbolIndex + 1);
      if (mentionText && !mentionText.includes(' ')) {
        setMentionQuery(mentionText);
        setMentionPosition(atSymbolIndex);
        setShowMentionList(true);
      } else {
        setShowMentionList(false);
      }
    } else {
      setShowMentionList(false);
    }
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Handle mobile chat selection
  const handleMobileChatSelect = (type, id) => {
    if (type === "group") {
      const group = groups.find(g => g.id === id);
      if (group) {
        setActiveGroup(group);
        setActivePrivateChat(null);
        fetchGroupMessages(group.id);
      }
    } else if (type === "private") {
      const member = teamMembers.find(m => m.id === id);
      if (member) {
        setActivePrivateChat(id);
        setActiveGroup(null);
      }
    }
    setShowMobileChat(true);
  };

  // Handle back to chat list on mobile
  const handleBackToChatList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="container-fluid d-flex flex-column" style={{ height: "88vh" }}>
      {/* Main Content */}
      <div className="flex-grow-1 d-flex overflow-hidden">
        {/* Left Sidebar - Always visible on mobile when not in chat */}
        <div className={`d-lg-block col-lg-3 border-end bg-card p-3 overflow-auto ${showMobileChat ? 'd-none' : 'd-block'}`}>
          {/* User Profile */}
          <div className="d-flex align-items-center mb-4 p-2 rounded bg-light">
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
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
                {loading ? (
                  <div>Loading groups...</div>
                ) : error ? (
                  <div className="text-danger">Error: {error}</div>
                ) : groups.length > 0 ? (
                  groups.map((group) => (
                    <button
                      key={group.id}
                      className={`list-group-item list-group-item-action ${
                        activeGroup?.id === group.id ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveGroup(group);
                        setActivePrivateChat(null); // Clear private chat if any
                        fetchGroupMessages(group.id);
                        // For mobile, show chat view
                        if (window.innerWidth < 992) {
                          setShowMobileChat(true);
                        }
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <strong>{group.name}</strong>
                      </div>
                      <small>
                        Created:{" "}
                        {new Date(group.createdAt).toLocaleDateString()}
                      </small>
                    </button>
                  ))
                ) : (
                  <div>No groups found</div>
                )}
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
                    onClick={() => {
                      setActivePrivateChat(member.id);
                      setActiveGroup(null);
                      // For mobile, show chat view
                      if (window.innerWidth < 992) {
                        setShowMobileChat(true);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-2">
                        <img
                          src={member.avatar}
                          alt={member.fullName}
                          className="rounded-circle"
                          width="32"
                        />
                        {member.isOnline ? (
                          <span
                            className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                            style={{
                              width: "10px",
                              height: "10px",
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
                 {member.fullName}
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
        {/* Right Content Area - Hidden on mobile when not in chat */}
        <div className={`col-12 col-lg-9 d-flex flex-column h-100 ${showMobileChat ? 'd-flex' : 'd-none d-lg-flex'}`}>
          {/* Chat Header - Fixed */}
          <div className="p-3 border-bottom bg-main d-flex justify-content-between align-items-center chat-header">
            <div className="d-flex align-items-center">
              {/* Back button for mobile */}
              <button 
                className="btn btn-sm btn-outline-light me-2 d-lg-none" 
                onClick={handleBackToChatList}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <h4 className="mb-0 text-white">
                  {activePrivateChat
                    ? teamMembers.find((m) => m.id === activePrivateChat)?.name
                    : activeGroup?.name || "Select a group"}
                </h4>
                <small className="text-white">
                  {activePrivateChat
                    ? teamMembers.find((m) => m.id === activePrivateChat)?.isOnline
                      ? "Online"
                      : `Last seen ${
                          teamMembers.find((m) => m.id === activePrivateChat)
                            ?.lastSeen
                        }`
                    : activeGroup
                    ? `Group • ${activeGroup.members?.length || 0} members`
                    : ""}
                </small>
              </div>
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
                      <button className="dropdown-item">Group Settings</button>
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
          {/* Chat Messages - Scrollable Area */}
          <div
            className="flex-grow-1 overflow-auto p-3 bg-main chat-messages"
            style={{ 
              backgroundColor: "#1e1e1e",
              paddingBottom: "80px" // This padding ensures messages don't hide behind the footer
            }}
          >
            {messages
              .filter((message) =>
                activePrivateChat
                  ? message.senderId === activePrivateChat ||
                    message.senderId === currentUser.id
                  : activeGroup && message.groupId === activeGroup.id
              )
              .map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 d-flex ${
                    message.senderId === currentUser.id ? "justify-content-end" : "justify-content-start"
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
                        : "justify-content-start"
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
                      style={{ 
                        maxWidth: "75%",
                        textAlign: "left" // Ensures text is always left-aligned
                      }}
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
                      <div
                        className={`position-absolute ${
                          message.senderId === currentUser.id
                            ? "left-0 start-100"
                            : "right-0 end-100"
                        } px-2 d-flex`}
                      >
                        <button
                          className="btn btn-sm p-0 text-white-50"
                          onClick={() => {
                            setReplyTo(message.id);
                            messageInputRef.current.focus();
                          }}
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
            {isTyping && typingUser && (
              <div className="d-flex align-items-center mb-3">
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
                    <small className="ms-2 text-white">
                      {typingUser.name} is typing...
                    </small>
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
          {/* Message Input - Footer (NOT absolute positioned) */}
          <div className="p-3 border-top bg-main chat-footer" style={{ 
            position: "static", // Changed from absolute to static
            width: "100%",
            zIndex: 1000 // Keep it on top if needed
          }}>
            <div className="position-relative">
              {showMentionList && (
                <div
                  className="position-absolute bottom-100 mb-2 bg-white border rounded p-2 mb-5"
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
              {replyTo && (
                <div className="bg-dark p-2 mb-2 rounded d-flex justify-content-between align-items-center">
                  <small className="text-white">
                    Replying to:{" "}
                    {messages
                      .find((m) => m.id === replyTo)
                      ?.content.substring(0, 50)}
                    ...
                  </small>
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setReplyTo(null)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              <textarea
                ref={messageInputRef}
                value={editingMessageId ? editedMessageContent : newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="form-control mb-2 bg-card text-white"
                rows="1"
                placeholder="Type your message here..."
                style={{ resize: "none", overflow: "hidden" }}
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
                  onClick={editingMessageId ? handleSaveEdit : handleSendMessage}
                  disabled={
                    editingMessageId
                      ? editedMessageContent.trim() === ""
                      : newMessage.trim() === "" || !activeGroup
                  }
                  className={`btn ${
                    editingMessageId
                      ? "btn-warning"
                      : newMessage.trim() === "" || !activeGroup
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
                            {member.fullName}
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