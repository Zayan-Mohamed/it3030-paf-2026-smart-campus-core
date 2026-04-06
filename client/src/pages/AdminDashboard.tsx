import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  AlertTriangle,
  Rocket,
  Calendar,
  Home,
  Building2,
  BarChart3,
  Settings,
  FileText,
  User,
  CheckCircle,
  LogOut,
  Shield,
  Clipboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import '../styles/Dashboard.css';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { title: 'Total Users', value: '2,847', icon: Users, color: '#3b82f6', change: '+124 this month' },
    { title: 'Active Incidents', value: '23', icon: AlertTriangle, color: '#f59e0b', change: '-5 from yesterday' },
    { title: 'System Uptime', value: '99.9%', icon: Rocket, color: '#10b981', change: '30 days avg' },
    { title: 'Total Bookings', value: '1,456', icon: Calendar, color: '#8b5cf6', change: '+18% vs last month' },
  ];

  const recentUsers = [
    { name: 'John Smith', email: 'john.smith@campus.edu', role: 'Student', status: 'Active', joined: '2 days ago' },
    { name: 'Sarah Johnson', email: 'sarah.j@campus.edu', role: 'Staff', status: 'Active', joined: '5 days ago' },
    { name: 'Mike Wilson', email: 'mike.w@campus.edu', role: 'Student', status: 'Pending', joined: '1 week ago' },
  ];

  const systemMetrics = [
    { label: 'API Response Time', value: '125ms', status: 'good' },
    { label: 'Database Health', value: 'Optimal', status: 'good' },
    { label: 'Storage Used', value: '67%', status: 'warning' },
    { label: 'Active Sessions', value: '342', status: 'good' },
  ];

  const quickActions = [
    { title: 'User Management', icon: Users, desc: 'Manage users and roles', color: '#3b82f6' },
    { title: 'System Settings', icon: Settings, desc: 'Configure system parameters', color: '#8b5cf6' },
    { title: 'View Reports', icon: BarChart3, desc: 'Analytics and insights', color: '#10b981' },
    { title: 'Audit Logs', icon: Clipboard, desc: 'Security and activity logs', color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          {sidebarOpen && <h2 className="sidebar-title">Admin Panel</h2>}
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard/admin" className="nav-item active">
            <span className="nav-icon"><Home size={20} /></span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/users" className="nav-item">
            <span className="nav-icon"><Users size={20} /></span>
            {sidebarOpen && <span>User Management</span>}
          </Link>
          <Link to="/admin/facilities" className="nav-item">
            <span className="nav-icon"><Building2 size={20} /></span>
            {sidebarOpen && <span>Facilities</span>}
          </Link>
          <Link to="/admin/incidents" className="nav-item">
            <span className="nav-icon"><AlertTriangle size={20} /></span>
            {sidebarOpen && <span>All Incidents</span>}
          </Link>
          <Link to="/admin/analytics" className="nav-item">
            <span className="nav-icon"><BarChart3 size={20} /></span>
            {sidebarOpen && <span>Analytics</span>}
          </Link>
          <Link to="/admin/settings" className="nav-item">
            <span className="nav-icon"><Settings size={20} /></span>
            {sidebarOpen && <span>System Settings</span>}
          </Link>
          <Link to="/admin/audit" className="nav-item">
            <span className="nav-icon"><FileText size={20} /></span>
            {sidebarOpen && <span>Audit Logs</span>}
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
                <p className="user-role">Administrator</p>
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
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Manage system operations, users, and monitor performance</p>
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

        {/* Quick Actions */}
        <section className="section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid-modern">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <div key={index} className="action-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="action-icon" style={{ background: `${action.color}20`, color: action.color }}>
                    <IconComponent size={24} />
                  </div>
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-desc">{action.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Recent Users */}
          <section className="section">
            <h2 className="section-title">Recent Users</h2>
            <div className="bookings-list">
              {recentUsers.map((user, index) => (
                <div key={index} className="booking-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="booking-icon"><User size={24} /></div>
                  <div className="booking-details">
                    <h4 className="booking-facility">{user.name}</h4>
                    <p className="booking-date">{user.email} • {user.joined}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span 
                      className="booking-status" 
                      style={{ 
                        background: user.role === 'Staff' ? '#3b82f620' : '#8b5cf620',
                        color: user.role === 'Staff' ? '#3b82f6' : '#8b5cf6',
                        fontSize: '0.75rem',
                        padding: '0.375rem 0.75rem'
                      }}
                    >
                      {user.role}
                    </span>
                    <span 
                      className="booking-status" 
                      style={{ 
                        background: user.status === 'Active' ? '#10b98120' : '#f59e0b20',
                        color: user.status === 'Active' ? '#10b981' : '#f59e0b',
                        fontSize: '0.75rem',
                        padding: '0.375rem 0.75rem'
                      }}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* System Metrics */}
          <section className="section">
            <h2 className="section-title">System Health</h2>
            <div className="bookings-list">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="booking-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div 
                    className="booking-icon"
                    style={{
                      background: metric.status === 'good' ? '#10b98120' : '#f59e0b20',
                      color: metric.status === 'good' ? '#10b981' : '#f59e0b'
                    }}
                  >
                    {metric.status === 'good' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div className="booking-details">
                    <h4 className="booking-facility">{metric.label}</h4>
                    <p className="booking-date">{metric.value}</p>
                  </div>
                  <span 
                    className="booking-status" 
                    style={{ 
                      background: metric.status === 'good' ? '#10b98120' : '#f59e0b20',
                      color: metric.status === 'good' ? '#10b981' : '#f59e0b'
                    }}
                  >
                    {metric.status === 'good' ? 'Healthy' : 'Warning'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Admin Tips */}
        <section className="section">
          <div className="tips-card">
            <div className="tips-icon"><Shield size={24} /></div>
            <div className="tips-content">
              <h3 className="tips-title">Security Reminder</h3>
              <p className="tips-text">
                Regularly review audit logs for suspicious activities. Enable two-factor authentication for all admin accounts.
                Schedule weekly database backups and test disaster recovery procedures monthly.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
