import React, { useState } from 'react';


function TaskRequest() {
   // Mock data for task reassignment requests
   const [requests, setRequests] = useState([
     {
       id: 1,
       requester: {
         name: 'Emma Johnson',
         avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20a%20young%20businesswoman%20with%20short%20brown%20hair%20and%20friendly%20smile%2C%20minimal%20clean%20background%2C%20high%20quality%20professional%20linkedin%20profile%20photo&width=60&height=60&seq=avatar1&orientation=squarish'
       },
       task: {
         name: 'Q2 Marketing Report',
         description: 'Complete the quarterly marketing performance analysis and prepare presentation for stakeholders.'
       },
       requestDate: '2025-06-18T14:30:00',
       status: 'pending',
       reason: 'I have a conflicting deadline with another high-priority project that was assigned yesterday.'
     },
     {
       id: 2,
       requester: {
         name: 'Michael Chen',
         avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20an%20asian%20businessman%20with%20glasses%20and%20neat%20black%20hair%2C%20minimal%20clean%20background%2C%20high%20quality%20professional%20linkedin%20profile%20photo&width=60&height=60&seq=avatar2&orientation=squarish'
       },
       task: {
         name: 'Client Onboarding Process',
         description: 'Create documentation and workflow for new enterprise client onboarding procedures.'
       },
       requestDate: '2025-06-17T09:15:00',
       status: 'approved',
       reason: 'I need to focus on resolving critical issues with our existing enterprise clients this week.'
     },
     {
       id: 3,
       requester: {
         name: 'Sarah Williams',
         avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20a%20woman%20with%20curly%20dark%20hair%20and%20confident%20expression%2C%20minimal%20clean%20background%2C%20high%20quality%20professional%20linkedin%20profile%20photo&width=60&height=60&seq=avatar3&orientation=squarish'
       },
       task: {
         name: 'Product Feature Development',
         description: 'Implement new dashboard analytics feature based on recent user feedback.'
       },
       requestDate: '2025-06-19T10:45:00',
       status: 'rejected',
       reason: 'I lack the technical expertise required for this task and would be more effective working on UX improvements.'
     },
     {
       id: 4,
       requester: {
         name: 'David Rodriguez',
         avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20a%20latino%20man%20with%20short%20dark%20hair%20and%20professional%20attire%2C%20minimal%20clean%20background%2C%20high%20quality%20professional%20linkedin%20profile%20photo&width=60&height=60&seq=avatar4&orientation=squarish'
       },
       task: {
         name: 'Vendor Contract Negotiation',
         description: 'Review and negotiate terms with software vendors for upcoming license renewals.'
       },
       requestDate: '2025-06-16T16:20:00',
       status: 'pending',
       reason: 'I am currently out of office dealing with a family emergency and will not return until next week.'
     }
   ]);

   // Filter state
   const [filter, setFilter] = useState('all');
   const [showDetails, setShowDetails] = useState(null);
   const [isLoading, setIsLoading] = useState({});
   const [notification, setNotification] = useState(null);

   // Handle request approval
   const handleApprove = (id) => {
     setIsLoading(prev => ({...prev, [id]: {...(prev[id] || {}), approve: true}}));
     
     // Simulate API call
     setTimeout(() => {
       setRequests(requests.map(request => 
         request.id === id ? {...request, status: 'approved'} : request
       ));
       setIsLoading(prev => ({...prev, [id]: {...(prev[id] || {}), approve: false}}));
       setNotification({message: 'Request approved successfully', type: 'success'});
       
       // Auto-hide notification
       setTimeout(() => setNotification(null), 3000);
     }, 800);
   };

   // Handle request rejection
   const handleReject = (id) => {
     setIsLoading(prev => ({...prev, [id]: {...(prev[id] || {}), reject: true}}));
     
     // Simulate API call
     setTimeout(() => {
       setRequests(requests.map(request => 
         request.id === id ? {...request, status: 'rejected'} : request
       ));
       setIsLoading(prev => ({...prev, [id]: {...(prev[id] || {}), reject: false}}));
       setNotification({message: 'Request rejected', type: 'error'});
       
       // Auto-hide notification
       setTimeout(() => setNotification(null), 3000);
     }, 800);
   };

   // Filter requests
   const filteredRequests = filter === 'all' 
     ? requests 
     : requests.filter(request => request.status === filter);

   // Format date
   const formatDate = (dateString) => {
     const date = new Date(dateString);
     return new Intl.DateTimeFormat('en-US', {
       month: 'short',
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit'
     }).format(date);
   };

  return (
    <div className="container-fluid bg-main">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between mb-4 gap-2">
          <h1 className="h2 mb-2 mb-md-0 gradient-heading text-center text-md-start">
            Task Reassignment Requests
          </h1>
          <div className="d-flex justify-content-md-end">
            <div className="dropdown w-100 w-md-auto">
              <button 
                className="btn btn-outline-primary dropdown-toggle w-100"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-filter me-2"></i>
                Filter: {filter === 'all' ? 'All Requests' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
              <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                <li>
                  <button 
                    className={`dropdown-item ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All Requests
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                  >
                    Pending
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${filter === 'approved' ? 'active' : ''}`}
                    onClick={() => setFilter('approved')}
                  >
                    Approved
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item ${filter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setFilter('rejected')}
                  >
                    Rejected
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`position-fixed top-0 end-0 p-3 ${notification.type === 'success' ? 'alert alert-success' : 'alert alert-danger'}`}
            style={{zIndex: 11, marginTop: '1rem', marginRight: '1rem'}}>
            <div className="d-flex align-items-center">
              <i className={`me-2 ${notification.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}`}></i>
              <div>{notification.message}</div>
            </div>
          </div>
        )}

        {/* Request List */}
        <div className="mb-4">
          {filteredRequests.length > 0 ? (
            <div className="row g-4">
              {filteredRequests.map(request => (
                <div key={request.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 bg-card">
                    <div className="card-body d-flex flex-column">
                      {/* Header with requester info and date */}
                      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap">
                        <div className="d-flex align-items-center">
                          <img 
                            src={request.requester.avatar} 
                            alt={request.requester.name} 
                            className="rounded-circle me-3"
                            width="40"
                            height="40"
                          />
                          <div>
                            <h5 className="mb-0">{request.requester.name}</h5>
                            <small>{formatDate(request.requestDate)}</small>
                          </div>
                        </div>
                        <div className="mt-2 mt-md-0">
                          <span className={`badge ${
                            request.status === 'pending' ? 'bg-warning text-dark' :
                            request.status === 'approved' ? 'bg-success' :
                            'bg-danger'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Task details */}
                      <div className="mb-3">
                        <h6 className="card-title mb-1">{request.task.name}</h6>
                        <p className="card-text small">{request.task.description}</p>
                      </div>
                      
                      {/* Reason (only shown when details are expanded) */}
                      {showDetails === request.id && (
                        <div className="mb-3 bg-light p-3 rounded">
                          <h6 className="small fw-bold mb-1">Reason for reassignment:</h6>
                          <p className="small mb-0">{request.reason}</p>
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="d-flex flex-column mt-auto">
                        <div className="d-flex justify-content-between mb-2">
                          <button
                            className="btn btn-link p-0 text-primary small"
                            onClick={() => setShowDetails(showDetails === request.id ? null : request.id)}
                          >
                            {showDetails === request.id ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="d-grid gap-2 d-md-flex">
                            <button
                              className="btn btn-primary me-md-2 flex-grow-1"
                              onClick={() => handleApprove(request.id)}
                              disabled={isLoading[request.id]?.approve || isLoading[request.id]?.reject}
                            >
                              {isLoading[request.id]?.approve ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="fas fa-check me-2"></i>
                              )}
                              Approve
                            </button>
                            <button
                              className="btn btn-outline-secondary flex-grow-1"
                              onClick={() => handleReject(request.id)}
                              disabled={isLoading[request.id]?.approve || isLoading[request.id]?.reject}
                            >
                              {isLoading[request.id]?.reject ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="fas fa-times me-2"></i>
                              )}
                              Reject
                            </button>
                          </div>
                        )}
                        
                        {request.status !== 'pending' && (
                          <div className={`small d-flex align-items-center ${
                            request.status === 'approved' ? 'text-success' : 'text-danger'
                          }`}>
                            <i className={`me-2 ${
                              request.status === 'approved' ? 'fas fa-check-circle' : 'fas fa-times-circle'
                            }`}></i>
                            <span>
                              {request.status === 'approved' 
                                ? 'This request has been approved' 
                                : 'This request has been rejected'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center p-5">
              <div className="mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '6rem', height: '6rem'}}>
                <i className="fas fa-inbox text-muted fs-3"></i>
              </div>
              <h3 className="h5 mb-2">No requests found</h3>
              <p className="text-muted mb-4">There are no task reassignment requests matching your current filter.</p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="btn btn-outline-secondary"
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Show All Requests
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskRequest;