import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clipboard,
  CheckCircle,
  Clock,
  Lightbulb,
} from 'lucide-react';
import '../styles/Dashboard.css';
import { StaffDashboardService } from '../services/StaffDashboardService';
import type { StaffDashboardData } from '../services/StaffDashboardService';

export const StaffDashboard = () => {
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardData = await StaffDashboardService.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching staff dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Pending Incidents', value: loading ? '...' : data?.urgentIncidents?.toString() || '0', icon: AlertTriangle, color: '#f59e0b', change: loading ? 'Loading...' : 'High priority issues' },
    { title: 'Assigned Tasks', value: loading ? '...' : data?.assignedTasks?.toString() || '0', icon: Clipboard, color: '#0891b2', change: loading ? 'Loading...' : 'Total assigned to you' },
    { title: 'Completed Today', value: loading ? '...' : data?.completedToday?.toString() || '0', icon: CheckCircle, color: '#10b981', change: loading ? 'Loading...' : 'Tasks finished' },
    { title: 'Avg Response Time', value: loading ? '...' : '-', icon: Clock, color: '#8b5cf6', change: loading ? 'Loading...' : 'This week' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}

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
              <div className="booking-item" style={{ 
                justifyContent: 'center', 
                textAlign: 'center', 
                padding: '3rem 2rem',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <AlertTriangle size={48} style={{ color: '#94a3b8', margin: '0 auto' }} />
                <div>
                  <h4 className="booking-facility" style={{ color: '#64748b' }}>No Pending Incidents</h4>
                  <p className="booking-date">Assigned incidents will appear here</p>
                </div>
              </div>
            </div>
          </section>

          {/* Today's Schedule */}
          <section className="section">
            <h2 className="section-title">Today's Schedule</h2>
            <div className="bookings-list">
              <div className="booking-item" style={{ 
                justifyContent: 'center', 
                textAlign: 'center', 
                padding: '3rem 2rem',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <Clock size={48} style={{ color: '#94a3b8', margin: '0 auto' }} />
                <div>
                  <h4 className="booking-facility" style={{ color: '#64748b' }}>No Tasks Scheduled</h4>
                  <p className="booking-date">Your daily tasks will appear here</p>
                </div>
              </div>
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
