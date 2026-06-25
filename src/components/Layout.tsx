import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Dev Portal</div>
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="link-button" type="button" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <span>Modern React, auth flows, and protected routes.</span>
        {isAuthenticated && user ? <span>Signed in as {user.name}</span> : null}
      </footer>
    </div>
  );
}
