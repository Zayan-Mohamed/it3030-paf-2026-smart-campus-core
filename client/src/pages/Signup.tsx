import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { getRolesFromToken, getStoredToken } from '../utils/jwtUtils';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');

export const Signup = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  // Redirect authenticated users to their role-specific dashboard
  if (user) {
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
    // Fallback to generic dashboard if role detection fails
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null) as { token?: string; message?: string } | null;

      if (response.ok && data?.token) {
        login(data.token);
        
        // New users get STUDENT role by default (from backend)
        // Redirect based on user role from JWT token
        const roles = getRolesFromToken(data.token);
        
        if (roles.includes('ADMIN')) {
          navigate('/dashboard/admin', { replace: true });
        } else if (roles.includes('STAFF')) {
          navigate('/dashboard/staff', { replace: true });
        } else if (roles.includes('STUDENT')) {
          navigate('/dashboard/student', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError(data?.message || `Signup failed (HTTP ${response.status})`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown network error';
      setError(`Network error: ${message}. Check backend at ${API_BASE_URL}.`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required minLength={6} />
          <button type="submit" className="btn-primary">Sign Up</button>
        </form>
        <p className="mt-4">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};
