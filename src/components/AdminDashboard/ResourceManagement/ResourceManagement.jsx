import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


import { 
  BarChart2,
  PieChart,
  Calendar as CalendarIcon,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  Settings,
  Loader,
  Pie,
  
} from 'lucide-react';

import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar'; // Importing momentLocalizer
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Initialize calendar localizer
const localizer = momentLocalizer(moment);

const ResourceManagement = () => {
  // Sample data
  const [resources, setResources] = useState([
    {
      id: 1,
      name: 'John Smith',
      role: 'Developer',
      skills: ['React', 'Node.js', 'TypeScript'],
      availability: 80,
      currentProjects: ['Project A', 'Project B'],
      allocation: 65
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Designer',
      skills: ['UI/UX', 'Figma', 'Photoshop'],
      availability: 90,
      currentProjects: ['Project C'],
      allocation: 45
    },
    {
      id: 3,
      name: 'Mike Chen',
      role: 'QA Engineer',
      skills: ['Testing', 'Automation', 'Selenium'],
      availability: 70,
      currentProjects: ['Project A', 'Project D'],
      allocation: 85
    },
    {
      id: 4,
      name: 'Emma Davis',
      role: 'Project Manager',
      skills: ['Agile', 'Scrum', 'JIRA'],
      availability: 60,
      currentProjects: ['Project B', 'Project C'],
      allocation: 55
    },
    {
      id: 5,
      name: 'Alex Rivera',
      role: 'DevOps',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      availability: 85,
      currentProjects: ['Project D'],
      allocation: 30
    }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, name: 'Project A', startDate: '2023-06-01', endDate: '2023-08-31', teamSize: 3 },
    { id: 2, name: 'Project B', startDate: '2023-06-15', endDate: '2023-09-30', teamSize: 2 },
    { id: 3, name: 'Project C', startDate: '2023-07-01', endDate: '2023-10-15', teamSize: 4 },
    { id: 4, name: 'Project D', startDate: '2023-05-15', endDate: '2023-07-31', teamSize: 2 }
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Project A - Sprint Planning',
      start: new Date(2023, 5, 12, 9, 0),
      end: new Date(2023, 5, 12, 11, 0),
      resourceId: 1,
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Project B - Review',
      start: new Date(2023, 5, 14, 14, 0),
      end: new Date(2023, 5, 14, 16, 0),
      resourceId: 4,
      type: 'review'
    },
    {
      id: 3,
      title: 'Project C - Kickoff',
      start: new Date(2023, 5, 16, 10, 0),
      end: new Date(2023, 5, 16, 12, 0),
      resourceId: 2,
      type: 'meeting'
    }
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState('utilization');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showResourceForm, setShowResourceForm] = useState(false);

  // Form state
  const [newResource, setNewResource] = useState({
    name: '',
    role: 'Developer',
    skills: [],
    availability: 100
  });

  // Available options
  const roles = ['All', 'Developer', 'Designer', 'QA Engineer', 'Project Manager', 'DevOps'];
  const allSkills = ['React', 'Node.js', 'TypeScript', 'UI/UX', 'Figma', 'Photoshop', 
                   'Testing', 'Automation', 'Selenium', 'Agile', 'Scrum', 'JIRA',
                   'AWS', 'Docker', 'Kubernetes'];

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || resource.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Calculate utilization metrics
  const utilizationMetrics = {
    totalResources: resources.length,
    averageUtilization: Math.round(resources.reduce((sum, resource) => sum + resource.allocation, 0) / resources.length),
    fullyAllocated: resources.filter(r => r.allocation >= 90).length,
    underAllocated: resources.filter(r => r.allocation < 60).length
  };

  // Handle adding new resource
  const addResource = () => {
    if (newResource.name) {
      const resource = {
        id: Date.now(),
        ...newResource,
        currentProjects: [],
        allocation: 0
      };
      setResources([...resources, resource]);
      setNewResource({
        name: '',
        role: 'Developer',
        skills: [],
        availability: 100
      });
      setShowResourceForm(false);
    }
  };

  // Toggle skill selection
  const toggleSkill = (skill) => {
    setNewResource(prev => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  // Render utilization report
  const renderUtilizationReport = () => (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card h-100">
          <div className="card-body text-center">
            <h6 className="card-title">Total Resources</h6>
            <h3 className="text-primary">{utilizationMetrics.totalResources}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card h-100">
          <div className="card-body text-center">
            <h6 className="card-title">Avg Utilization</h6>
            <h3 className="text-info">{utilizationMetrics.averageUtilization}%</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card h-100">
          <div className="card-body text-center">
            <h6 className="card-title">Fully Allocated</h6>
            <h3 className="text-warning">{utilizationMetrics.fullyAllocated}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card h-100">
          <div className="card-body text-center">
            <h6 className="card-title">Under Allocated</h6>
            <h3 className="text-danger">{utilizationMetrics.underAllocated}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-8 mb-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title">Resource Utilization</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Role</th>
                    <th>Projects</th>
                    <th>Allocation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map(resource => (
                    <tr key={resource.id}>
                      <td>{resource.name}</td>
                      <td>{resource.role}</td>
                      <td>
                        {resource.currentProjects.length > 0 ? (
                          resource.currentProjects.join(', ')
                        ) : (
                          <span className="text-muted">No projects</span>
                        )}
                      </td>
                      <td>
                        <div className="progress" style={{ height: '20px' }}>
                          <div 
                            className={`progress-bar ${getAllocationClass(resource.allocation)}`} 
                            role="progressbar" 
                            style={{ width: `${resource.allocation}%` }}
                            aria-valuenow={resource.allocation}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {resource.allocation}%
                          </div>
                        </div>
                      </td>
                      <td>
                        {resource.allocation >= 90 ? (
                          <span className="badge bg-warning text-dark">Overloaded</span>
                        ) : resource.allocation < 60 ? (
                          <span className="badge bg-danger">Underutilized</span>
                        ) : (
                          <span className="badge bg-success">Optimal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title">Allocation Distribution</h5>
          </div>
          <div className="card-body d-flex justify-content-center">
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <PieChart width={300} height={300}>
                <Pie



                  data={[ 
                    { name: 'Optimal (60-90%)', value: resources.filter(r => r.allocation >= 60 && r.allocation < 90).length },
                    { name: 'Overloaded (≥90%)', value: utilizationMetrics.fullyAllocated },
                    { name: 'Underutilized (<60%)', value: utilizationMetrics.underAllocated }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {resources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getAllocationColor(entry.allocation)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render skill set allocation
  const renderSkillSetAllocation = () => (
    <div className="row">
      <div className="col-md-12 mb-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Skill Set Distribution</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {allSkills.map(skill => {
                const count = resources.filter(r => r.skills.includes(skill)).length;
                const percentage = Math.round((count / resources.length) * 100);
                
                return (
                  <div key={skill} className="col-md-3 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title">{skill}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{count} resources</span>
                          <span className="text-muted">{percentage}%</span>
                        </div>
                        <div className="progress mt-2" style={{ height: '5px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            role="progressbar" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper functions
  const getAllocationClass = (allocation) => {
    if (allocation >= 90) return 'bg-warning';
    if (allocation < 60) return 'bg-danger';
    return 'bg-success';
  };

  const getAllocationColor = (allocation) => {
    if (allocation >= 90) return '#ffc107';
    if (allocation < 60) return '#dc3545';
    return '#28a745';
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Resource Management</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary"
            onClick={() => setShowResourceForm(true)}
          >
            <Plus size={18} className="me-2" />
            Add Resource
          </button>
          <button className="btn btn-outline-secondary">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'utilization' ? 'active' : ''}`}
            onClick={() => setActiveTab('utilization')}
          >
            <BarChart2 size={18} className="me-2" />
            Utilization Report
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <PieChart size={18} className="me-2" />
            Skill Set Allocation
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarIcon size={18} className="me-2" />
            Availability Calendar
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'load' ? 'active' : ''}`}
            onClick={() => setActiveTab('load')}
          >
            <Users size={18} className="me-2" />
            Team Load Balancing
          </button>
        </li>
      </ul>

      {/* Main Content */}
      {loading ? (
        <div className="text-center py-5">
          <Loader className="animate-spin" size={48} />
          <p className="mt-3">Loading resource data...</p>
        </div>
      ) : (
        renderUtilizationReport() // or call renderContent() to switch content based on active tab
      )}
    </div>
  );
};

export default ResourceManagement;
