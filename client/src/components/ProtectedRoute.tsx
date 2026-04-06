import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasRequiredRole } from '../utils/jwtUtils';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

/**
 * ProtectedRoute component for role-based access control.
 * 
 * SECURITY ARCHITECTURE:
 * - Client-side check for UX (prevents unnecessary page loads)
 * - Backend MUST enforce the same authorization rules
 * - Never trust client-side authorization alone
 * 
 * Usage:
 * <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
 *   <Route path="/dashboard/student" element={<StudentDashboard />} />
 * </Route>
 */
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!hasRequiredRole(token, allowedRoles)) {
    // User is authenticated but doesn't have required role
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required role
  return <Outlet />;
};
