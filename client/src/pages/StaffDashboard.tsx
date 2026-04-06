import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AlertTriangle,
  Clipboard,
  CheckCircle,
  Clock,
  Home,
  Wrench,
  Calendar,
  BarChart3,
  Building2,
  LogOut,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import '../styles/Dashboard.css';

export const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { title: 'Pending Incidents', value: '8', icon: AlertTriangle, color: '#f59e0b', change: '+3 today' },
    { title: 'Assigned Tasks', value: '12', icon: Clipboard, color: '#3b82f6', change: '4 due today' },
    { title: 'Completed Today', value: '15', icon: CheckCircle, color: '#10b981', change: '↑ 25% vs yesterday' },
    { title: 'Avg Response Time', value: '2.5h', icon: Clock, color: '#8b5cf6', change: '↓ 15% improvement' },
  ];

  const incidentQueue = [
    { id: 'INC-1234', title: 'Library AC Not Working', location: 'Main Library - 3rd Floor', priority: 'High', time: '15 min ago', color: '#ef4444' },
    { title: 'Broken Chair in Classroom', location: 'Building A - Room 301', priority: 'Medium', time: '1 hour ago', color: '#f59e0b' },
    { title: 'WiFi Connection Issues', location: 'Student Center', priority: 'High', time: '2 hours ago', color: '#ef4444' },
    { title: 'Lighting Problem', location: 'Engineering Block - Lab 5', priority: 'Low', time: '3 hours ago', color: '#10b981' },
  ];

  const todaySchedule = [
    { time: '09:00 AM', task: 'Inspect HVAC System - Science Building', status: 'Completed' },
    { time: '11:00 AM', task: 'Fix Projector - Lecture Hall 2', status: 'In Progress' },
    { time: '02:00 PM', task: 'Maintenance Check - Sports Complex', status: 'Upcoming' },
    { time: '04:00 PM', task: 'Resolve Network Issues - IT Lab', status: 'Upcoming' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          {sidebarOpen && <h2 className="sidebar-title">Staff Portal</h2>}
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard/staff" className="nav-item active">
            <span className="nav-icon"><Home size={20} /></span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/incidents/queue" className="nav-item">
            <span className="nav-icon"><AlertTriangle size={20} /></span>
            {sidebarOpen && <span>Incident Queue</span>}
          </Link>
          <Link to="/maintenance" className="nav-item">
            <span className="nav-icon"><Wrench size={20} /></span>
            {sidebarOpen && <span>Maintenance</span>}
          </Link>
          <Link to="/schedule" className="nav-item">
            <span className="nav-icon"><Calendar size={20} /></span>
            {sidebarOpen && <span>My Schedule</span>}
          </Link>
          <Link to="/reports" className="nav-item">
            <span className="nav-icon"><BarChart3 size={20} /></span>
            {sidebarOpen && <span>Reports</span>}
          </Link>
          <Link to="/facilities/manage" className="nav-item">
            <span className="nav-icon"><Building2 size={20} /></span>
            {sidebarOpen && <span>Facilities</span>}
          </Link>
        </nav>

        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="user-info">
              {user?.pictureUrl && (
                <img src={user.pictureUrl} alt="Profile" className="user-avatar" />
              )}
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">Staff Member</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Staff Dashboard</h1>
            <p className="dashboard-subtitle">Manage incidents, maintenance tasks, and campus operations</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  <IconComponent size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-change">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Incident Queue */}
          <section className="section">
            <h2 className="section-title">Incident Queue</h2>
            <div className="bookings-list">
              {incidentQueue.map((incident, index) => (
                <div key={index} className="booking-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="booking-icon"><AlertTriangle size={24} /></div>
                  <div className="booking-details">
                    <h4 className="booking-facility">{incident.title}</h4>
                    <p className="booking-date">{incident.location} • {incident.time}</p>
                  </div>
                  <span className="booking-status" style={{ background: `${incident.color}20`, color: incident.color }}>
                    {incident.priority}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Schedule */}
          <section className="section">
            <h2 className="section-title">Today's Schedule</h2>
            <div className="bookings-list">
              {todaySchedule.map((item, index) => (
                <div key={index} className="booking-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="booking-icon"><Clock size={24} /></div>
                  <div className="booking-details">
                    <h4 className="booking-facility">{item.task}</h4>
                    <p className="booking-date">{item.time}</p>
                  </div>
                  <span 
                    className="booking-status" 
                    style={{ 
                      background: item.status === 'Completed' ? '#10b98120' : 
                                 item.status === 'In Progress' ? '#3b82f620' : '#94a3b820',
                      color: item.status === 'Completed' ? '#10b981' : 
                            item.status === 'In Progress' ? '#3b82f6' : '#94a3b8'
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Tips Section */}
        <section className="section">
          <div className="tips-card">
            <div className="tips-icon"><Lightbulb size={24} /></div>
            <div className="tips-content">
              <h3 className="tips-title">Staff Tip</h3>
              <p className="tips-text">
                Prioritize high-priority incidents first. Use the mobile app to update task status in real-time 
                while on the field. Don't forget to log completion notes for tracking purposes.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
