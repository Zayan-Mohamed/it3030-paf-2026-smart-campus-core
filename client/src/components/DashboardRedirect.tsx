import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRolesFromToken, getStoredToken } from '../utils/jwtUtils';

/**
 * Smart redirect component that sends users to their role-appropriate dashboard
 * 
 * Used for the generic /dashboard route to maintain backward compatibility
 * while properly routing users based on their roles.
 */
export const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get roles from JWT token
  const token = getStoredToken();
  if (token) {
    const roles = getRolesFromToken(token);
    
    // Redirect based on highest privilege role
    if (roles.includes('ADMIN')) {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (roles.includes('STAFF')) {
      return <Navigate to="/dashboard/staff" replace />;
    } else if (roles.includes('STUDENT')) {
      return <Navigate to="/dashboard/student" replace />;
    }
  }

  // Fallback: show generic dashboard if role detection fails
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
            <p><strong>Roles:</strong> {user.roles.map(r => r.replace('ROLE_', '')).join(', ') || 'None assigned'}</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <p>Your account doesn't have a recognized role. Please contact an administrator.</p>
      </section>
    </div>
  );
};
