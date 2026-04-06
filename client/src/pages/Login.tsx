import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');

export const Login = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null) as { token?: string; message?: string } | null;

      if (response.ok && data?.token) {
        login(data.token);
      } else {
        setError(data?.message || `Login failed (HTTP ${response.status})`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown network error';
      setError(`Network error: ${message}. Check backend at ${API_BASE_URL}.`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        <div className="divider">or</div>
        <button onClick={handleGoogleLogin} className="google-btn">
          Sign in with Google
        </button>
        <p className="mt-4">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};
