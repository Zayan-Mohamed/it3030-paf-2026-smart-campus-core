import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </header>

      <section className="profile-section">
        <h2>Your Profile</h2>
        <div className="profile-card">
          {user.pictureUrl && (
            <img src={user.pictureUrl} alt="Profile" className="profile-image" />
          )}
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Roles:</strong> {user.roles.join(', ') || 'None assigned'}</p>
          </div>
        </div>
      </section>

      <section className="actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="btn-action">View Facilities</button>
          <button className="btn-action">My Bookings</button>
          <button className="btn-action">Report Incident</button>
        </div>
      </section>
    </div>
  );
};
