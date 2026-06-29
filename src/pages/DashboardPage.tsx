import { useAuth } from '../hooks/useAuth';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';

const projects = [
  { name: 'AI Inference Platform', status: 'Active' },
  { name: 'Dev Portal', status: 'Ready' },
];

const recentActivity = [
  'User Jenna invited to Project Alpha',
  'Deployment completed for AI inference endpoint',
  'Audit log review completed',
];

const systemStatuses = [
  { name: 'API', status: 'Operational' },
  { name: 'Database', status: 'Healthy' },
  { name: 'Auth', status: 'Secure' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageContainer title="Dashboard" description={`Welcome back${user ? `, ${user.name}` : ''}. Here’s the current status of your workspace.`}>
      <div className="dashboard-welcome">
        <div>
          <div className="welcome-pill">👤 Welcome{user ? ` ${user.name}` : ''}</div>
          <h2>Projects, activity, and system status all in one place.</h2>
        </div>
      </div>

      <div className="dashboard-section-grid">
        <Card title="Projects">
          <ul className="dashboard-list">
            {projects.map((project) => (
              <li key={project.name} className="dashboard-list-item">
                <span>{project.name}</span>
                <strong>{project.status}</strong>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent activity">
          <ul className="dashboard-list">
            {recentActivity.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
        </Card>

        <Card title="System status">
          <ul className="dashboard-list">
            {systemStatuses.map((item) => (
              <li key={item.name} className="dashboard-list-item">
                <span>{item.name}</span>
                <strong>{item.status}</strong>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
