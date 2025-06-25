import React, { useState, useEffect } from 'react';
import { 
  Container, Button, Form, InputGroup, Row, Col, 
  Card, Nav, Tab, Table, Badge, Modal 
} from 'react-bootstrap';

function Project() {
  // State for projects data
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('created');
  
  // State for file count modal
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [fileCount, setFileCount] = useState(0);
  
  // State for new project form
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    dueDate: '',
    team: []
  });
  const [teamMember, setTeamMember] = useState('');

  // Load sample data on component mount
  useEffect(() => {
    const sampleProjects = [
      {
        id: 1,
        name: 'E-commerce Website',
        description: 'Development of online shopping platform',
        status: 'created',
        files: 24,
        createdDate: '2023-05-15',
        dueDate: '2023-08-30',
        team: ['John', 'Sarah', 'Mike']
      },
      {
        id: 2,
        name: 'Mobile App Redesign',
        description: 'UI/UX overhaul for customer app',
        status: 'completed',
        files: 18,
        createdDate: '2023-03-10',
        completedDate: '2023-06-25',
        team: ['Sarah', 'David']
      },
      {
        id: 3,
        name: 'Database Migration',
        description: 'Moving from MySQL to PostgreSQL',
        status: 'created',
        files: 32,
        createdDate: '2023-06-01',
        dueDate: '2023-09-15',
        team: ['Mike', 'Lisa', 'John']
      }
    ];
    setProjects(sampleProjects);
  }, []);

  // Add Ctrl+F shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('projectSearch').focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle project creation
  const handleCreateProject = (e) => {
    e.preventDefault();
    setProjects([...projects, {
      ...projectData,
      id: projects.length + 1,
      status: 'created',
      files: 0,
      createdDate: new Date().toISOString().split('T')[0]
    }]);
    setProjectData({
      name: '',
      description: '',
      dueDate: '',
      team: []
    });
    setShowCreateModal(false);
  };

  // Mark project as completed
  const markAsCompleted = (projectId) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, status: 'completed', completedDate: new Date().toISOString().split('T')[0] } 
        : project
    ));
  };

  // Update file count for a project
  const updateFileCount = () => {
    setProjects(projects.map(project => 
      project.id === currentProject.id 
        ? { ...project, files: fileCount } 
        : project
    ));
    setShowFileModal(false);
  };

  // Add team member to new project
  const addTeamMember = () => {
    if (teamMember && !projectData.team.includes(teamMember)) {
      setProjectData({
        ...projectData,
        team: [...projectData.team, teamMember]
      });
      setTeamMember('');
    }
  };

  // Remove team member from new project
  const removeTeamMember = (member) => {
    setProjectData({
      ...projectData,
      team: projectData.team.filter(m => m !== member)
    });
  };

  // Filter projects based on search term and active tab
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'created' ? project.status === 'created' : project.status === 'completed';
    return matchesSearch && matchesTab;
  });

  return (
    <Container fluid className="p-4">
      {/* Header with Search and Create Button */}
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              id="projectSearch"
              type="text"
              placeholder="Search projects (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="text-end">
          <Button 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
            className="ms-2"
          >
            <i className="bi bi-plus-lg me-2"></i>Create New Project
          </Button>
        </Col>
      </Row>
      
      {/* Projects Tabs */}
      <Card>
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="created">
            <Nav.Item>
              <Nav.Link 
                eventKey="created" 
                active={activeTab === 'created'}
                onClick={() => setActiveTab('created')}
              >
                Created Projects <Badge bg="secondary">{projects.filter(p => p.status === 'created').length}</Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="completed" 
                active={activeTab === 'completed'}
                onClick={() => setActiveTab('completed')}
              >
                Completed Projects <Badge bg="success">{projects.filter(p => p.status === 'completed').length}</Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey={activeTab}>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-folder-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  <p className="mt-3">No projects found</p>
                </div>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Description</th>
                      <th>Files</th>
                      <th>Dates</th>
                      <th>Team</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map(project => (
                      <tr key={project.id}>
                        <td>
                          <strong>{project.name}</strong>
                          {project.status === 'completed' && (
                            <Badge bg="success" className="ms-2">Completed</Badge>
                          )}
                        </td>
                        <td>{project.description}</td>
                        <td>
                          {project.files}
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => {
                              setCurrentProject(project);
                              setFileCount(project.files);
                              setShowFileModal(true);
                            }}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Button>
                        </td>
                        <td>
                          <div>Created: {project.createdDate}</div>
                          {project.dueDate && <div>Due: {project.dueDate}</div>}
                          {project.completedDate && <div>Completed: {project.completedDate}</div>}
                        </td>
                        <td>
                          {project.team.join(', ')}
                        </td>
                        <td>
                          {project.status === 'created' && (
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => markAsCompleted(project.id)}
                              className="me-2"
                            >
                              Complete
                            </Button>
                          )}
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <i className="bi bi-download"></i>
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <i className="bi bi-gear"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
      
      {/* Create Project Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateProject}>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="projectName">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter project name"
                  value={projectData.name}
                  onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="dueDate">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={projectData.dueDate}
                  onChange={(e) => setProjectData({...projectData, dueDate: e.target.value})}
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="projectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter project description"
                value={projectData.description}
                onChange={(e) => setProjectData({...projectData, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="projectTeam">
              <Form.Label>Team Members</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  placeholder="Add team member"
                  value={teamMember}
                  onChange={(e) => setTeamMember(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={addTeamMember} className="ms-2">
                  Add
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {projectData.team.map(member => (
                  <Badge key={member} bg="light" text="dark" className="p-2 d-flex align-items-center">
                    {member}
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => removeTeamMember(member)}
                      className="p-0 ms-2"
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Files (Excel/CSV)</Form.Label>
              <Form.Control type="file" accept=".xlsx,.xls,.csv" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Project
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* File Count Modal */}
      <Modal show={showFileModal} onHide={() => setShowFileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update File Count</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Number of Files for {currentProject?.name}</Form.Label>
            <Form.Control 
              type="number" 
              value={fileCount} 
              onChange={(e) => setFileCount(parseInt(e.target.value) || 0)} 
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => setShowFileModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={updateFileCount}>
              Save Changes
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Project;