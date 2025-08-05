import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [filter, setFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(null);
  const [isLoading, setIsLoading] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        'https://eminoids-backend-production.up.railway.app/api/requestActivity/getAllReviewedRequests'
      );
      
      // Combine approved and rejected requests into one array
      const allRequests = [
        ...response.data.data.approvedRequests.map(req => ({
          ...req,
          status: req.status.toLowerCase()
        })),
        ...response.data.data.rejectedRequests.map(req => ({
          ...req,
          status: req.status.toLowerCase()
        }))
      ];
      
      setRequests(allRequests);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle request approval
  const handleApprove = async (id) => {
    setIsLoading(prev => ({...prev, [id]: {...(prev[id] || {}), approve: true}}));
    
    try {
      // In a real app, you would call your API endpoint to approve the request
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setRequests(requests.map(request => 
        request.id === id ? {...request, status: 'approved'} : request
      ));
      
      setNotification({message: 'Request approved successfully', type: 'success'});
    } catch (err) {
      setNotification({message: 'Failed to approve request', type: 'error'});
    } finally {
      setIsLoading(prev => ({...prev, [id]: {...(prev[id] || {}), approve: false}}));
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Handle request rejection
  const handleReject = async (id) => {
    setIsLoading(prev => ({...prev, [id]: {...(prev[id] || {}), reject: true}}));
    
    try {
      // In a real app, you would call your API endpoint to reject the request
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setRequests(requests.map(request => 
        request.id === id ? {...request, status: 'rejected'} : request
      ));
      
      setNotification({message: 'Request rejected', type: 'error'});
    } catch (err) {
      setNotification({message: 'Failed to reject request', type: 'error'});
    } finally {
      setIsLoading(prev => ({...prev, [id]: {...(prev[id] || {}), reject: false}}));
      setTimeout(() => setNotification(null), 3000);
    }
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

  // Generate avatar based on requester name
  const getAvatar = (name) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=random&size=60`;
  };

  if (loading) {
    return (
      <div className="container-fluid bg-main">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid bg-main">
        <div className="container-fluid py-4">
          <div className="alert alert-danger">
            Error loading requests: {error}
          </div>
        </div>
      </div>
    );
  }

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
                            src={getAvatar(request.requesterName)} 
                            alt={request.requesterName} 
                            className="rounded-circle me-3"
                            width="40"
                            height="40"
                          />
                          <div>
                            <h5 className="mb-0">{request.requesterName}</h5>
                            <small>{formatDate(request.createdAt)}</small>
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
                        <h6 className="card-title mb-1">{request.requestType}</h6>
                        <p className="card-text small">{request.message}</p>
                        <div className="small ">
                          <span>From: {request.fromRole}</span>
                          <span className="mx-2">•</span>
                          <span>To: {request.toRole}</span>
                        </div>
                      </div>
                      
                      {/* Reason (only shown when details are expanded) */}
                      {showDetails === request.id && (
                        <div className="mb-3 bg-card p-3 rounded">
                          <h6 className="small fw-bold mb-1">Reason for request:</h6>
                          <p className="small mb-0">{request.reason || "No reason provided"}</p>
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
            <div className="card text-center p-5 bg-card">
              <div className="mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '6rem', height: '6rem'}}>
                <i className="fas fa-inbox text-muted fs-3"></i>
              </div>
              <h3 className="h5 mb-2">No requests found</h3>
              <p className=" mb-4">There are no task reassignment requests matching your current filter.</p>
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