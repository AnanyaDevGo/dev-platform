import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-welcome-card">
          <h1>Dev Portal</h1>
          <p>Sign in to your secure workspace for projects, users, and audit monitoring.</p>
        </div>

        <div className="auth-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
