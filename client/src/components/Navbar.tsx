import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Smart Campus</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/facilities" className="navbar-link">Facilities</Link>
            <span className="navbar-user">{user.email}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn-login-nav">Login</Link>
        )}
      </div>
    </nav>
  );
};
