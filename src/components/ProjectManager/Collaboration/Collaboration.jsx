import React, { useEffect, useState, useRef } from 'react';


function Collaboration() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'Sarah Johnson',
            avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20woman%20with%20brown%20hair%20and%20friendly%20smile%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=user1&orientation=squarish',
            content: 'Hey team, I just uploaded the latest design files for the project. Could everyone please review and share your thoughts?',
            timestamp: '10:32 AM',
            reactions: [
                { emoji: '👍', count: 3, reacted: true },
                { emoji: '🔥', count: 1, reacted: false }
            ],
            attachments: [
                { name: 'Project_Design_V2.pdf', size: '3.2 MB' }
            ],
            isUnread: false
        },
        {
            id: 2,
            sender: 'Michael Chen',
            avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20man%20with%20glasses%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=user2&orientation=squarish',
            content: 'I\'ve looked through it and I think the color palette works really well with our brand guidelines. Nice work!',
            timestamp: '10:45 AM',
            reactions: [
                { emoji: '👍', count: 2, reacted: false }
            ],
            attachments: [],
            isUnread: false
        },
        {
            id: 3,
            sender: 'Alex Rodriguez',
            avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latino%20man%20with%20short%20dark%20hair%20wearing%20a%20blue%20shirt%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=user3&orientation=squarish',
            content: 'I have some concerns about the mobile responsiveness of the new layout. Can we schedule a quick call to discuss?',
            timestamp: '11:15 AM',
            reactions: [],
            attachments: [],
            isUnread: true
        },
        {
            id: 4,
            sender: 'Emma Wilson',
            avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20blonde%20woman%20with%20medium%20length%20hair%20wearing%20professional%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=user4&orientation=squarish',
            content: 'Just finished reviewing the user flow. I think we need to simplify the checkout process - too many steps currently.',
            timestamp: '11:32 AM',
            reactions: [
                { emoji: '💯', count: 4, reacted: true }
            ],
            attachments: [
                { name: 'User_Flow_Feedback.docx', size: '1.8 MB' }
            ],
            isUnread: true
        }
    ]);
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Sarah Johnson', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20woman%20with%20brown%20hair%20and%20friendly%20smile%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user1sm&orientation=squarish', isOnline: true },
        { id: 2, name: 'Michael Chen', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20man%20with%20glasses%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user2sm&orientation=squarish', isOnline: true },
        { id: 3, name: 'Alex Rodriguez', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latino%20man%20with%20short%20dark%20hair%20wearing%20a%20blue%20shirt%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user3sm&orientation=squarish', isOnline: false },
        { id: 4, name: 'Emma Wilson', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20blonde%20woman%20with%20medium%20length%20hair%20wearing%20professional%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user4sm&orientation=squarish', isOnline: true },
        { id: 5, name: 'David Thompson', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20man%20with%20short%20brown%20hair%20wearing%20a%20suit%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=40&height=40&seq=user5sm&orientation=squarish', isOnline: false }
    ]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [currentThread, setCurrentThread] = useState({
        id: 1,
        title: 'Project Redesign Discussion',
        participants: ['Sarah Johnson', 'Michael Chen', 'Alex Rodriguez', 'Emma Wilson', 'You'],
        unreadCount: 2,
        lastActivity: '11:32 AM'
    });
    const messageEndRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const currentDateTime = new Date().toLocaleString();

    useEffect(() => {
        // Scroll to bottom of messages
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Simulate typing indicator
        const typingTimeout = setTimeout(() => {
            setIsTyping(false);
        }, 3000);
        return () => clearTimeout(typingTimeout);
    }, [isTyping]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const newMsg = {
            id: messages.length + 1,
            sender: 'You',
            avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20wearing%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photo%2C%20soft%20lighting&width=80&height=80&seq=userme&orientation=squarish',
            content: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: [],
            attachments: [],
            isUnread: false
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
        // Simulate someone typing after your message
        setTimeout(() => {
            setIsTyping(true);
        }, 1000);
    };

    const handleReaction = (messageId, emoji) => {
        setMessages(messages.map(msg => {
            if (msg.id === messageId) {
                const existingReactionIndex = msg.reactions.findIndex(r => r.emoji === emoji);
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
                        reactions: [...msg.reactions, { emoji, count: 1, reacted: true }]
                    };
                }
            }
            return msg;
        }));
        setShowEmojiPicker(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatFileSize = (size) => {
        return size;
    };

    const emojis = ['👍', '❤️', '😂', '🎉', '🔥', '💯', '👏', '🙌'];

    return (
        <div className="vh-100 d-flex  flex-column">
            {/* Header */}
            {/* <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <button className="btn btn-outline-secondary me-3 d-lg-none">
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="d-flex align-items-center">
                        <i className="fas fa-comments text-primary fs-4 me-2"></i>
                        <h1 className="h5 mb-0 d-none d-sm-inline">TeamCollab</h1>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <span className="text-muted small me-3 d-none d-md-inline">{currentDateTime}</span>
                    <div className="input-group input-group-sm ms-3" style={{ maxWidth: '250px' }}>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="form-control"
                        />
                        <button className="btn btn-outline-secondary">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </header> */}

            {/* Main Content */}
            <div className="flex-grow-1 d-flex overflow-hidden">
                {/* Left Sidebar - Collapsible on mobile */}
                <div className="d-none d-lg-block col-lg-3 border-end bg-card p-3 overflow-auto">
                    {/* Filters */}
                    <div className="mb-4">
                        <h6 className="text-muted mb-3">FILTERS</h6>
                        <div className="d-grid gap-2">
                            {['All', 'Unread', 'Mentions', 'Files'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`btn btn-sm text-start ${activeFilter === filter ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {filter} {filter === 'Unread' && <span className="badge bg-white text-dark ms-2">{currentThread.unreadCount}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="mb-4">
                        <h6 className=" mb-3">TEAM MEMBERS</h6>
                        <ul className="list-unstyled">
                            {teamMembers.map(member => (
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
                                            <span className="position-absolute bottom-0 end-0 bg-success rounded-circle" style={{ width: '10px', height: '10px', border: '2px solid #f8f9fa' }}></span>
                                        )}
                                    </div>
                                    <span className="small">{member.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Conversations List */}
                    <div>
                        <h6 className=" mb-3">RECENT CONVERSATIONS</h6>
                        <div className="list-group">
                            {['Project Redesign Discussion', 'Marketing Campaign Planning', 'Q2 Budget Review'].map((thread, index) => (
                                <button 
                                    key={index} 
                                    className={`list-group-item bg-card list-group-item-action  ${currentThread.title === thread ? 'active' : ''}`}
                                    onClick={() => setCurrentThread({
                                        ...currentThread,
                                        title: thread
                                    })}
                                >
                                    <div className="d-flex justify-content-between">
                                        <strong>{thread}</strong>
                                        <small>11:32 AM</small>
                                    </div>
                                    <small className="text-truncate d-block">Last message preview...</small>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="col-12 col-lg-9 d-flex flex-column ">
                    {/* Thread Header */}
                    <div className="p-3 border-bottom bg-main d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="mb-0 text-white">{currentThread.title}</h4>
                            <small className="text-white">
                                {currentThread.participants.length} participants • Last activity {currentThread.lastActivity}
                            </small>
                        </div>
                        {/* <div className="d-flex">
                            <button className="btn btn-sm btn-outline-secondary me-2">
                                <i className="fas fa-search"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                                <i className="fas fa-ellipsis-v"></i>
                            </button>
                        </div> */}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow-1 p-3 bg-main overflow-auto " style={{ backgroundColor: '#f8f9fa' }}>
                        {messages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`mb-3  ${message.sender === 'You' ? 'text-end' : ''}`}
                            >
                                <div className={`d-flex  ${message.sender === 'You' ? 'justify-content-end' : ''}`}>
                                    {message.sender !== 'You' && (
                                        <img 
                                            src={message.avatar} 
                                            alt={message.sender} 
                                            className="rounded-circle me-2  " 
                                            width="40" 
                                            height="40"
                                        />
                                    )}
                                    <div 
                                        className={`rounded p-3 ${message.sender === 'You' ? '' : 'bg-card'}`}
                                        style={{ maxWidth: '75%' }}
                                    >
                                        <div className="d-flex   justify-content-between align-items-center mb-1">
                                            <strong>{message.sender}</strong>
                                            <small className={message.sender === 'You' ? 'text-white-50' : 'text-muted'}>
                                                {message.timestamp}
                                            </small>
                                        </div>
                                        <p className="mb-2 ">{message.content}</p>
                                        
                                        {/* Attachments */}
                                        {message.attachments.length > 0 && (
                                            <div className="mb-2 text-dark">
                                                {message.attachments.map((file, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`p-2 rounded small d-flex align-items-center ${message.sender === 'You' ? 'bg-primary-dark' : 'bg-light'}`}
                                                    >
                                                        <i className="fas fa-file me-2"></i>
                                                        <div className="flex-grow-1">
                                                            <div>{file.name}</div>
                                                            <small className={message.sender === 'You' ? 'text-dark' : 'text-dark'}>
                                                                {formatFileSize(file.size)}
                                                            </small>
                                                        </div>
                                                        <button className="btn btn-link p-0 ms-2">
                                                            <i className={`fas fa-download ${message.sender === 'You' ? 'text-white-50' : 'text-muted'}`}></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Reactions */}
                                        {message.reactions.length > 0 && (
                                            <div className="d-flex flex-wrap gap-1 mt-2">
                                                {message.reactions.map((reaction, idx) => (
                                                    <button 
                                                        key={idx} 
                                                        className={`btn btn-sm p-0 px-1 rounded-pill ${reaction.reacted ? 'bg-white text-dark' : message.sender === 'You' ? 'bg-white-10' : 'bg-light'}`}
                                                        onClick={() => handleReaction(message.id, reaction.emoji)}
                                                    >
                                                        <span>{reaction.emoji}</span> 
                                                        <small className="ms-1">{reaction.count}</small>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="d-flex  align-items-center mb-3">
                                <img 
                                    src={teamMembers[0].avatar} 
                                    alt="Typing" 
                                    className="rounded-circle me-2 " 
                                    width="40" 
                                    height="40"
                                />
                                <div className=" rounded p-2">
                                    <div className="d-flex align-items-center ">
                                        <div className="typing-dots">
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                        </div>
                                        <small className="ms-2 text-muted">typing...</small>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messageEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-top bg-main">
                        <div className="position-relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="form-control mb-2 bg-card"
                                rows="2"
                                placeholder="Type your message here..."
                                style={{ resize: 'none' }}
                            ></textarea>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <button 
                                        className="btn btn-sm btn-outline-secondary me-2"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    >
                                        <i className="far fa-smile"></i>
                                    </button>
                                    {/* <button className="btn btn-sm btn-outline-secondary me-2">
                                        <i className="fas fa-paperclip"></i>
                                    </button> */}
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={newMessage.trim() === ''}
                                    className={`btn ${newMessage.trim() === '' ? 'btn-outline-primary' : 'btn-primary'}`}
                                >
                                    Send <i className="fas fa-paper-plane ms-1"></i>
                                </button>
                            </div>
                            
                            {/* Emoji Picker */}
                            {showEmojiPicker && (
                                <div 
                                    ref={emojiPickerRef}
                                    className="position-absolute bottom-100 bg-white border rounded p-2 mb-2 shadow-sm"
                                    style={{ zIndex: 1000 }}
                                >
                                    <div className="d-flex flex-wrap" style={{ width: '200px' }}>
                                        {emojis.map((emoji, idx) => (
                                            <button
                                                key={idx}
                                                className="btn btn-sm p-1"
                                                onClick={() => {
                                                    setNewMessage(prev => prev + emoji);
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
    );
}

export default Collaboration;