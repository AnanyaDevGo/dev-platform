import { useAuth } from '../hooks/useAuth';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';

const quickStats = [
  { label: 'Projects', value: '12' },
  { label: 'Active users', value: '28' },
  { label: 'Audit events', value: '124' },
  { label: 'OAuth providers', value: '3' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageContainer title="Dashboard" description={`Welcome back${user ? `, ${user.name}` : ''}! Manage your workspace and identity providers from one place.`}>
      <div className="dashboard-grid-cards">
        {quickStats.map((stat) => (
          <Card key={stat.label} title={stat.label} footer={<strong>{stat.value}</strong>}>
            <p>Monitor usage, health, and user activity in real time.</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
