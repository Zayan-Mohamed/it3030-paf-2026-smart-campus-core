import { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Rocket,
  Calendar,
  BarChart3,
  Settings,
  User,
  CheckCircle,
  Shield,
  Clipboard,
} from 'lucide-react';
import '../styles/Dashboard.css';
import { AdminDashboardService } from '../services/AdminDashboardService';
import type { AdminDashboardData } from '../services/AdminDashboardService';

export const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardData = await AdminDashboardService.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Users', value: loading ? '...' : data?.totalUsers?.toString() || '0', icon: Users, color: '#0891b2', change: loading ? 'Loading...' : 'Total registered' },
    { title: 'Active Incidents', value: loading ? '...' : data?.openIncidents?.toString() || '0', icon: AlertTriangle, color: '#f59e0b', change: loading ? 'Loading...' : 'Require attention' },
    { title: 'System Uptime', value: loading ? '...' : '99.9%', icon: Rocket, color: '#10b981', change: loading ? 'Loading...' : 'All systems operational' },
    { title: 'Total Bookings', value: loading ? '...' : data?.activeBookings?.toString() || '0', icon: Calendar, color: '#8b5cf6', change: loading ? 'Loading...' : 'Across all facilities' },
  ];

  const quickActions = [
    { title: 'User Management', icon: Users, desc: 'Manage users and roles', color: '#0891b2' },
    { title: 'System Settings', icon: Settings, desc: 'Configure system parameters', color: '#8b5cf6' },
    { title: 'View Reports', icon: BarChart3, desc: 'Analytics and insights', color: '#10b981' },
    { title: 'Audit Logs', icon: Clipboard, desc: 'Security and activity logs', color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {/* Recent Users */}
          <section className="section">
            <h2 className="section-title">Recent Users</h2>
            <div className="card p-4">
              {loading ? (
                <div className="text-center p-4">Loading recent users...</div>
              ) : data?.recentUsers && data.recentUsers.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {data.recentUsers.slice(0, 3).map(user => (
                    <div key={user.id} className="flex items-center gap-3 border-b last:border-0 pb-3 last:pb-0">
                      <div className="bg-cyan-100 text-cyan-600 p-2 rounded-full">
                        <User size={20} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium truncate">{user.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full">
                        {user.roles && user.roles.length > 0 ? user.roles[0] : 'USER'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-400">
                  <User size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No Users Yet</p>
                </div>
              )}
            </div>
          </section>

          {/* System Metrics */}
          <section className="section">
            <h2 className="section-title">System Health</h2>
            <div className="card p-4">
              {loading ? (
                <div className="text-center p-4">Loading metrics...</div>
              ) : data?.systemHealth ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">App Status</p>
                    <p className={`font-semibold ${data.systemHealth.status === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
                      {data.systemHealth.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">DB Status</p>
                    <p className={`font-semibold ${data.systemHealth.database === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
                      {data.systemHealth.database}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Uptime</p>
                    <p className="font-semibold text-blue-600">{data.systemHealth.uptime}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Memory</p>
                    <p className="font-semibold text-amber-600">{data.systemHealth.memoryUsagePercentage}%</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-400">
                  <CheckCircle size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No Metrics Available</p>
                </div>
              )}
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
