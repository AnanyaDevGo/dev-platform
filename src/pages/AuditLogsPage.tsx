import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';
import { auditService } from '../services/audit.service';
import type { AuditLogEntry } from '../types/audit';

export default function AuditLogsPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        const fetched = await auditService.getAuditLogs();
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
        <p className="form-error">{error}</p>
      ) : entries.length === 0 ? (
        <p>No audit logs recorded yet.</p>
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
