import { useAuth } from '../auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="dashboard-page">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back{user ? `, ${user.name}` : ''}! Your secure session is active.</p>
        </div>

        <div className="dashboard-summary">
          <div className="stat-card">
            <span className="stat-label">Account</span>
            <strong>{user?.email}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">User ID</span>
            <strong>{user?.id}</strong>
          </div>
        </div>

        <div className="dashboard-explain">
          <h2>What this app shows</h2>
          <p>
            This demo uses React router for protected routes, an auth provider for session state,
            and a mocked OAuth/OIDC flow UI to represent what a real IDP login feels like.
          </p>
        </div>
      </div>
    </section>
  );
}
