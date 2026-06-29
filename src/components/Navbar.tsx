import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('dev-portal-theme', 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Dev Portal</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        {isAuthenticated ? <Link to="/dashboard">Dashboard</Link> : null}
      </div>

      <div className="navbar-actions">
        <button
          className="link-button"
          type="button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
        {isAuthenticated ? (
          <>
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
