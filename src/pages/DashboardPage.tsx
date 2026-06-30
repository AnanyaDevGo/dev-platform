import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';
import { auditService } from '../services/audit.service';
import { healthService } from '../services/health.service';
import { projectService } from '../services/project.service';
import type { AuditLogEntry } from '../types/audit';
import type { Project } from '../types/project';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditLogEntry[]>([]);
  const [systemStatuses, setSystemStatuses] = useState([
    { name: 'API', status: 'Checking…' },
    { name: 'Database', status: 'Checking…' },
    { name: 'Redis', status: 'Checking…' },
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [projectData, auditData, health] = await Promise.all([
          projectService.getProjects(),
          auditService.getAuditLogs().catch(() => []),
          healthService.getHealth(),
        ]);

        setProjects(projectData.slice(0, 5));
        setRecentActivity(auditData.slice(0, 5));
        setSystemStatuses([
          { name: 'API', status: health.status === 'ok' ? 'Operational' : 'Degraded' },
          { name: 'Database', status: health.db === 'connected' ? 'Healthy' : 'Unavailable' },
          { name: 'Redis', status: health.redis === 'connected' ? 'Healthy' : 'Unavailable' },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
      }
    }

    loadDashboard();
  }, []);

  return (
    <PageContainer title="Dashboard" description={`Welcome back${user ? `, ${user.name}` : ''}. Here’s the current status of your workspace.`}>
      {error ? <p className="form-error">{error}</p> : null}

      <div className="dashboard-welcome">
        <div>
          <div className="welcome-pill">👤 Welcome{user ? ` ${user.name}` : ''}</div>
          <h2>Projects, activity, and system status all in one place.</h2>
        </div>
      </div>

      <div className="dashboard-section-grid">
        <Card title="Projects">
          {projects.length === 0 ? (
            <p>No projects yet.</p>
          ) : (
            <ul className="dashboard-list">
              {projects.map((project) => (
                <li key={project.id} className="dashboard-list-item">
                  <span>{project.name}</span>
                  <strong>{project.status}</strong>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent activity">
          {recentActivity.length === 0 ? (
            <p>No recent activity.</p>
          ) : (
            <ul className="dashboard-list">
              {recentActivity.map((activity) => (
                <li key={activity.id}>{activity.details || activity.event}</li>
              ))}
            </ul>
          )}
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
