import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';

const projectData = [
  { id: 'p-1', name: 'Apollo API Gateway', status: 'Active' },
  { id: 'p-2', name: 'Meridian Data Sync', status: 'Paused' },
  { id: 'p-3', name: 'Aurora Audit Trail', status: 'Live' },
];

export default function ProjectsPage() {
  return (
    <PageContainer title="Project Management" description="Manage your projects, teams, and deployment pipelines from one central dashboard.">
      <div className="card-grid">
        {projectData.map((project) => (
          <Card key={project.id} title={project.name} footer={<span>{project.status}</span>}>
            <p>Project ID: {project.id}</p>
            <p>Status: {project.status}</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
