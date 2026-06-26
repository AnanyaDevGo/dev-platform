import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Dev Portal</Link>
      </div>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="link-button" type="button" onClick={logout}>
              Sign out
            </button>
            {user ? <span className="navbar-user">{user.name}</span> : null}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
