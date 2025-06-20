import React, { useState } from 'react';

function Messages() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for messages
  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20woman%20with%20short%20brown%20hair%2C%20natural%20makeup%2C%20friendly%20smile%2C%20soft%20lighting%2C%20neutral%20background%2C%20high%20quality%20photorealistic%20image&width=100&height=100&seq=1&orientation=squarish',
      preview: 'Hey, just checking in about the project deadline. Do you think we can meet this Friday to discuss the progress?',
      timestamp: '10:32 AM',
      unread: true,
      status: 'read'
    },
    {
      id: 2,
      sender: 'Michael Chen',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20asian%20man%20with%20glasses%2C%20business%20casual%20attire%2C%20neutral%20expression%2C%20clean%20background%2C%20high%20quality%20photorealistic%20headshot&width=100&height=100&seq=2&orientation=squarish',
      preview: 'I\'ve sent you the updated design files. Let me know what you think about the new color scheme.',
      timestamp: 'Yesterday',
      unread: false,
      status: 'delivered'
    },
    {
      id: 3,
      sender: 'Alex Rodriguez',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20latino%20man%20with%20dark%20hair%2C%20warm%20smile%2C%20business%20attire%2C%20soft%20lighting%2C%20neutral%20background%2C%20high%20quality%20photorealistic%20image&width=100&height=100&seq=3&orientation=squarish',
      preview: 'The team meeting has been rescheduled to next Monday at 2 PM. Please update your calendar.',
      timestamp: 'Yesterday',
      unread: true,
      status: 'sent'
    },
    {
      id: 4,
      sender: 'Emily Wilson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20woman%20with%20blonde%20hair%2C%20professional%20attire%2C%20confident%20pose%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20photorealistic%20headshot&width=100&height=100&seq=4&orientation=squarish',
      preview: 'Thanks for your help with the client presentation. They were really impressed with our proposal.',
      timestamp: 'Monday',
      unread: false,
      status: 'read'
    },
    {
      id: 5,
      sender: 'David Thompson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20middle%20aged%20man%20with%20gray%20hair%2C%20business%20suit%2C%20serious%20expression%2C%20office%20setting%2C%20neutral%20background%2C%20high%20quality%20photorealistic%20image&width=100&height=100&seq=5&orientation=squarish',
      preview: 'Can we schedule a call to discuss the quarterly report? I have some concerns about the numbers.',
      timestamp: 'Monday',
      unread: false,
      status: 'read'
    },
    {
      id: 6,
      sender: 'Lisa Wang',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20an%20asian%20woman%20with%20long%20black%20hair%2C%20business%20casual%20attire%2C%20friendly%20smile%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20photorealistic%20headshot&width=100&height=100&seq=6&orientation=squarish',
      preview: 'The client has approved our proposal! We can start the implementation phase next week.',
      timestamp: 'Last week',
      unread: false,
      status: 'read'
    },
    {
      id: 7,
      sender: 'Project Team',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20group%20of%20diverse%20business%20people%20in%20a%20meeting%20room%2C%20collaborative%20environment%2C%20modern%20office%20setting%2C%20neutral%20colors%2C%20high%20quality%20photorealistic%20image&width=100&height=100&seq=7&orientation=squarish',
      preview: 'New task assigned: Review the marketing materials before the campaign launch next week.',
      timestamp: 'Last week',
      unread: false,
      status: 'delivered'
    },
    {
      id: 8,
      sender: 'HR Department',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20corporate%20logo%20with%20HR%20letters%2C%20modern%20design%2C%20clean%20lines%2C%20business%20appropriate%2C%20neutral%20background%2C%20high%20quality%20vector%20style%20image&width=100&height=100&seq=8&orientation=squarish',
      preview: 'Reminder: Please complete your quarterly performance review by the end of this month.',
      timestamp: '06/15/2025',
      unread: true,
      status: 'sent'
    }
  ];
  
  // Filter messages based on search term
  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
        <h1 className="gradient-heading ">Messages</h1>
      {/* Header */}
      <header className="bg-light p-3 bg-card mb-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
        
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div>
        {filteredMessages.length > 0 ? (
          <ul className="list-group ">
            {filteredMessages.map((message) => (
              <li key={message.id} className=" table-gradient-bg list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img
                    src={message.avatar}
                    alt={message.sender}
                    className="rounded-circle mr-3"
                    style={{ width: '50px', height: '50px' }}
                  />
                  <div>
                    <div className="d-flex justify-content-between">
                      <strong>{message.sender}</strong>
                      <span className="text-muted small">{message.timestamp}</span>
                    </div>
                    <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                      {message.preview}
                    </p>
                  </div>
                </div>
                <div>
                  <span className={`badge ${message.unread ? 'bg-primary' : 'bg-secondary'}`}>
                    {message.unread ? 'Unread' : 'Read'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-inbox fa-3x text-muted"></i>
            <h4 className="mt-3">No messages found</h4>
            <p>{searchTerm ? 'Try adjusting your search terms.' : 'Start a conversation with your team.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
