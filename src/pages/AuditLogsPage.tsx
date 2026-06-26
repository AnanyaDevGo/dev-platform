import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';

const auditEntries = [
  { id: 'a-1', event: 'User login', actor: 'Ananya Patel', time: '2 minutes ago' },
  { id: 'a-2', event: 'Project created', actor: 'Noah Carter', time: '1 hour ago' },
  { id: 'a-3', event: 'OAuth session refreshed', actor: 'Mia Chen', time: 'Yesterday' },
];

export default function AuditLogsPage() {
  return (
    <PageContainer title="Audit Logs" description="Track recent events and user actions for compliance and troubleshooting.">
      <div className="card-grid">
        {auditEntries.map((entry) => (
          <Card key={entry.id} title={entry.event} footer={<span>{entry.time}</span>}>
            <p>Actor: {entry.actor}</p>
            <p>Entry ID: {entry.id}</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
