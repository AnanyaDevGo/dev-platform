import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';

const statusBlocks = [
  { title: 'API Uptime', value: '99.98%', detail: 'No incidents reported in the past 24 hours.' },
  { title: 'Request throughput', value: '1.2k/min', detail: 'Stable response times across all endpoints.' },
  { title: 'OAuth health', value: 'Healthy', detail: 'Identity providers are responding within normal thresholds.' },
];

export default function MonitoringPage() {
  return (
    <PageContainer title="Monitoring" description="View system health, API usage, and authentication stability at a glance.">
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
