import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Dashboard.css';

type AdminFacilitiesLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const navItems = [
  { to: '/dashboard/admin', label: 'Dashboard', icon: Home },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/facilities', label: 'Facilities', icon: Building2 },
  { to: '/admin/incidents', label: 'All Incidents', icon: AlertTriangle },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'System Settings', icon: Settings },
  { to: '/admin/audit', label: 'Audit Logs', icon: FileText },
];

export const AdminFacilitiesLayout = ({
  title,
  subtitle,
  children,
}: AdminFacilitiesLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen((current) => !current)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          {sidebarOpen && <h2 className="sidebar-title">Admin Panel</h2>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-item${location.pathname.startsWith(to) ? ' active' : ''}`}
            >
              <span className="nav-icon"><Icon size={20} /></span>
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
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

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">{title}</h1>
            <p className="dashboard-subtitle">{subtitle}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};
