import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';
import { healthService } from '../services/health.service';

export default function MonitoringPage() {
  const [health, setHealth] = useState<{ status: string; db: string; redis: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHealth() {
      try {
        const response = await healthService.getHealth();
        setHealth(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load health status.');
      }
    }

    loadHealth();
  }, []);

  const statusBlocks = health
    ? [
        { title: 'API status', value: health.status, detail: 'Overall application health from /health.' },
        { title: 'Database', value: health.db, detail: 'PostgreSQL connection status.' },
        { title: 'Redis cache', value: health.redis, detail: 'Redis connection used for caching and rate limiting.' },
      ]
    : [];

  return (
    <PageContainer title="Monitoring" description="View system health, API usage, and authentication stability at a glance.">
      {error ? <p className="form-error">{error}</p> : null}
      {!health && !error ? <p>Loading health metrics…</p> : null}
      <div className="card-grid">
        {statusBlocks.map((block) => (
          <Card key={block.title} title={block.title} footer={<span>{block.value}</span>}>
            <p>{block.detail}</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
