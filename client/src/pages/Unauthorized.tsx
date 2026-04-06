import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
      <h2 style={{ marginBottom: '1rem' }}>Access Denied</h2>
      <p style={{ 
        maxWidth: '500px', 
        marginBottom: '2rem',
        color: '#666'
      }}>
        You do not have permission to access this resource. 
        Please contact your administrator if you believe this is an error.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={handleGoBack}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Go Back
        </button>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
