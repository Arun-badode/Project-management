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
        <div>
            <div className="container-fluid bg-card">
                {/* Header */}
                {/* <header className=" border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm">
                    <div className="d-flex align-items-center">
                        <button className="btn btn-light p-2 rounded-circle">
                            <i className="fas fa-bars text-gray-600"></i>
                        </button>
                        <div className="ml-4 d-flex align-items-center">
                            <i className="fas fa-comments text-primary text-xl"></i>
                            <h1 className="ml-2 h4 text-gray-800">TeamCollab</h1>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-gray-600 "> {currentDateTime} </span>
                        <button
                            onClick={handleSendMessage}
                            className="btn btn-outline-secondary ml-3"
                            title="Refresh data"
                        >
                            <i className="fas fa-sync-alt"></i>
                        </button>
                        <div className="ml-3 position-relative">
                          
                            <input
                                type="text"
                                placeholder="Search messages and files..."
                                className="form-control form-control-sm"
                            />
                            
                        </div>
                    </div>
                </header> */}

                {/* Main Content */}
                <div className="d-flex">
                    {/* Left Sidebar */}
                    <div className="col-3  border-right p-3">
                        {/* Filters */}
                        <div className="mb-3">
                            {['All', 'Unread', 'Mentions', 'Files'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`btn btn-sm ${activeFilter === filter ? 'btn-primary' : 'btn-light'} mb-2 w-100`}
                                >
                                    {filter} {filter === 'Unread' && <span className="badge badge-pill text-black">2</span>}
                                </button>
                            ))}
                        </div>

                        {/* Conversations List */}
                        <div>
                            <h6>Recent Conversations</h6>
                            {['Project Redesign Discussion', 'Marketing Campaign Planning', 'Q2 Budget Review'].map((thread, index) => (
                                <div key={index} className="border p-2 mb-2">
                                    <h5>{thread}</h5>
                                    <p>Last message content...</p>
                                    <button className="btn btn-link btn-sm">Open</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="col-9 bg-card">
                        {/* Thread Header */}
                        <div className="p-4 border-bottom">
                            <h3>{currentThread.title}</h3>
                            <p>{currentThread.participants.length} participants</p>
                        </div>

                        {/* Messages */}
                        <div className="p-4 bg-card">
                            {messages.map((message, index) => (
                                <div key={index} className={`mb-4 bg-card ${message.sender === 'You' ? 'text-right' : ''}`}>
                                    <div className="d-flex">
                                        {message.sender !== 'You' && (
                                            <img src={message.avatar} alt={message.sender} className="rounded-circle me-3" width="40" 
                                            style={{width:"40px",height:"40px"}} />
                                        )}
                                        <div className="p-2 rounded">
                                            <p><strong>{message.sender}</strong> <small>{message.timestamp}</small></p>
                                            <p>{message.content}</p>
                                            {message.reactions.length > 0 && (
                                                <div>
                                                    {message.reactions.map((reaction, idx) => (
                                                        <span key={idx} className="badge badge-light mr-1">{reaction.emoji} {reaction.count}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="d-flex bg-card">
                                <div className="spinner-border text-primary mr-2" role="status"></div>
                                <p>Someone is typing...</p>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="input-group mb-3 bg-card">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="form-control bg-card placeholder-white"
                                rows="3"
                                placeholder="Type your message here..."
                            ></textarea>
                            <button
                                onClick={handleSendMessage}
                                disabled={newMessage.trim() === ''}
                                className={`btn ${newMessage.trim() === '' ? 'btn-secondary' : 'btn-primary'} ml-2`}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Collaboration;
