import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  Lock, 
  Unlock, 
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  X
} from 'lucide-react';

const UserManagement = () => {
  // Sample user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2023-06-15 14:30',
      joinDate: '2022-01-10'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'Lead',
      status: 'Active',
      lastActive: '2023-06-16 09:15',
      joinDate: '2022-03-22'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      role: 'DTP',
      status: 'Inactive',
      lastActive: '2023-05-30 16:45',
      joinDate: '2022-05-15'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma.d@example.com',
      role: 'QA',
      status: 'Active',
      lastActive: '2023-06-16 11:20',
      joinDate: '2022-07-18'
    },
    {
      id: 5,
      name: 'Alex Rivera',
      email: 'alex.r@example.com',
      role: 'DTP',
      status: 'Active',
      lastActive: '2023-06-15 17:10',
      joinDate: '2022-09-05'
    }
  ]);

  // State for form and UI
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserActivity, setShowUserActivity] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'DTP',
    status: 'Active'
  });

  // Available roles
  const roles = ['Admin', 'Lead', 'DTP', 'QA'];

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Filter users
  const filteredUsers = sortedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Create new user
  const handleCreateUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: Date.now(),
        ...newUser,
        lastActive: new Date().toISOString().split('T')[0] + ' ' + 
                   new Date().toTimeString().split(' ')[0].substring(0, 5),
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, user]);
      setNewUser({
        name: '',
        email: '',
        role: 'DTP',
        status: 'Active'
      });
      setShowCreateForm(false);
    }
  };

  // Update user
  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
    }
  };

  // Toggle user status
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { 
        ...user, 
        status: user.status === 'Active' ? 'Inactive' : 'Active' 
      } : user
    ));
  };

  // Delete user
  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Get status badge class
  const getStatusClass = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  // Get role badge class
  const getRoleClass = (role) => {
    switch (role) {
      case 'Admin': return 'bg-danger';
      case 'Lead': return 'bg-primary';
      case 'DTP': return 'bg-warning text-dark';
      case 'QA': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  };

  // Render create user form
  const renderCreateForm = () => (
    <div className="modal show d-block custom-modal-dark" >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New User</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowCreateForm(false)}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              className="btn btn-danger rounded-pill"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
            <button
              className="gradient-button"
              onClick={handleCreateUser}
            >
              Create User
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render edit user form
  const renderEditForm = () => (
    <div className="modal show d-block custom-modal-dark">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setEditingUser(null)}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.name}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={editingUser.role}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={editingUser.status}
                onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              className="btn btn-danger rounded-pill"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
            <button
              className="gradient-button"
              onClick={handleUpdateUser}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render user activity modal
  const renderUserActivity = () => (
    <div className="modal show d-block custom-modal-dark" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">User Activity: {showUserActivity.name}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowUserActivity(null)}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body bg-card">
                    <h6 className="card-title">User Information</h6>
                    <div className="mb-2"><strong>Email:</strong> {showUserActivity.email}</div>
                    <div className="mb-2"><strong>Role:</strong> <span className={`badge ${getRoleClass(showUserActivity.role)}`}>{showUserActivity.role}</span></div>
                    <div className="mb-2"><strong>Status:</strong> <span className={`badge ${getStatusClass(showUserActivity.status)}`}>{showUserActivity.status}</span></div>
                    <div><strong>Joined:</strong> {showUserActivity.joinDate}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body bg-card">
                    <h6 className="card-title">Recent Activity</h6>
                    <div className="activity-timeline">
                      <div className="activity-item">
                        <div className="activity-badge"></div>
                        <div className="activity-content">
                          <strong>Last Active:</strong> {showUserActivity.lastActive}
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-badge"></div>
                        <div className="activity-content">
                          Created 15 tasks in the last week
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-badge"></div>
                        <div className="activity-content">
                          Completed 8 QA reviews
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-badge"></div>
                        <div className="activity-content">
                          Logged in from Chrome on Windows
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card ">
              <div className="card-body table-gradient-bg">
                <h6 className="card-title">Detailed Activity Log</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-gradient-bg">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Activity</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2023-06-16 11:20</td>
                        <td>Logged in</td>
                        <td>IP: 192.168.1.5, Browser: Chrome</td>
                      </tr>
                      <tr>
                        <td>2023-06-16 10:45</td>
                        <td>Completed task</td>
                        <td>Task ID: TSK-1254</td>
                      </tr>
                      <tr>
                        <td>2023-06-16 09:30</td>
                        <td>Created task</td>
                        <td>Task ID: TSK-1253</td>
                      </tr>
                      <tr>
                        <td>2023-06-15 17:10</td>
                        <td>Logged out</td>
                        <td>Session duration: 4h 25m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              className="btn btn-danger rounded-pill"
              onClick={() => setShowUserActivity(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return <ChevronDown size={16} className="text-muted" />;
  };

  return (
    <div className="container-fluid py-4 bg-main">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className='gradient-heading'>User Management</h2>
        <button 
          className="gradient-button"
          onClick={() => setShowCreateForm(true)}
        >
          <UserPlus size={18} className="me-2" />
          Create User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4 bg-card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="card">
        <div className="card-body bg-card">
          <div className="table-responsive">
            <table className="table table-gradient-bg">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center">
                      Name
                      <span className="ms-2">{renderSortIndicator('name')}</span>
                    </div>
                  </th>
                  <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center">
                      Email
                      <span className="ms-2">{renderSortIndicator('email')}</span>
                    </div>
                  </th>
                  <th onClick={() => requestSort('role')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center">
                      Role
                      <span className="ms-2">{renderSortIndicator('role')}</span>
                    </div>
                  </th>
                  <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center">
                      Status
                      <span className="ms-2">{renderSortIndicator('status')}</span>
                    </div>
                  </th>
                  <th onClick={() => requestSort('lastActive')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center">
                      Last Active
                      <span className="ms-2">{renderSortIndicator('lastActive')}</span>
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${getRoleClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.lastActive}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setShowUserActivity(user)}
                            title="View Activity"
                          >
                            <Activity size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setEditingUser(user)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`btn btn-sm ${user.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            onClick={() => toggleUserStatus(user.id)}
                            title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteUser(user.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateForm && renderCreateForm()}
      {editingUser && renderEditForm()}
      {showUserActivity && renderUserActivity()}
    </div>
  );
};

export default UserManagement;