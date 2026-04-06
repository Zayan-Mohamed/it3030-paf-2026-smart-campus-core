import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { OAuthCallback } from './pages/OAuthCallback';
import { NewIncident } from './pages/NewIncident';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardRedirect } from './components/DashboardRedirect';
import { Unauthorized } from './pages/Unauthorized';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import './App.css';

/**
 * Main Application Router with Role-Based Access Control
 * 
 * Route Structure:
 * - /dashboard: Smart redirect to role-appropriate dashboard
 * - /dashboard/student: STUDENT, ADMIN access
 * - /dashboard/admin: ADMIN only
 * - /dashboard/staff: STAFF, ADMIN access
 * 
 * Security Note: These are client-side checks for UX only.
 * Backend MUST enforce the same authorization rules.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
                <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'STAFF', 'ADMIN']} />}>
                <Route path="/incidents/new" element={<NewIncident />} />
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Smart redirect to role-appropriate dashboard */}
              <Route path="/dashboard" element={<DashboardRedirect />} />

              {/* Protected Role-Based Dashboards */}
              <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
                <Route path="/dashboard/student" element={<StudentDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
                <Route path="/dashboard/staff" element={<StaffDashboard />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
