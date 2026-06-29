import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';
import { apiClient } from '../services/api';

interface AuditLogEntry {
  id: string;
  event: string;
  details?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AuditLogsPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        const fetched = await apiClient.request<AuditLogEntry[]>('/api/audit-logs', {
          method: 'GET',
        });
        setEntries(fetched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load audit logs.');
      } finally {
        setLoading(false);
      }
    }

    loadAuditLogs();
  }, []);

  return (
    <PageContainer title="Audit Logs" description="Track recent events and user actions for compliance and troubleshooting.">
      {loading ? (
        <p>Loading audit logs…</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="card-grid">
          {entries.map((entry) => (
            <Card key={entry.id} title={entry.event} footer={<span>{new Date(entry.createdAt).toLocaleString()}</span>}>
              <p>{entry.details || 'No details provided.'}</p>
              <p>User: {entry.user.name} ({entry.user.email})</p>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
