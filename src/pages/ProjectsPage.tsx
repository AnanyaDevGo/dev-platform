import { FormEvent, useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';
import { projectService } from '../services/project.service';
import { Project } from '../types/project';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'ACTIVE' });

  useEffect(() => {
    async function loadProjects() {
      try {
        const fetched = await projectService.getProjects();
        setProjects(fetched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects.');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Project name is required.');
      return;
    }

    setSaving(true);

    try {
      const created = await projectService.createProject(formData);
      setProjects((current) => [created, ...current]);
      setFormData({ name: '', description: '', status: 'ACTIVE' });
      setExpandedProject(created.id);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create project.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(projectId: string) {
    try {
      await projectService.deleteProject(projectId);
      setProjects((current) => current.filter((project) => project.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project.');
    }
  }

  return (
    <PageContainer title="Project Management" description="Manage your projects, teams, and deployment pipelines from one central dashboard.">
      <section className="project-action-panel">
        <div className="project-action-card">
          <h2>Create a new project</h2>
          <form className="project-form" onSubmit={handleCreate}>
            <label>
              <span>Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Project name"
                required
              />
            </label>
            <label>
              <span>Description</span>
              <textarea
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Describe the project goals or requirements"
                rows={3}
              />
            </label>
            <label>
              <span>Status</span>
              <select
                value={formData.status}
                onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {formError ? <div className="form-error">{formError}</div> : null}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create project'}
            </button>
          </form>
        </div>
      </section>

      {loading ? (
        <p>Loading projects…</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : projects.length === 0 ? (
        <p>No projects yet. Create your first project above.</p>
      ) : (
        <div className="card-grid">
          {projects.map((project) => {
            const isExpanded = expandedProject === project.id;
            return (
              <Card key={project.id} title={project.name} footer={<span>{project.status}</span>}>
                <p>{project.description || 'No description available.'}</p>
                <p>Owner: {project.owner?.name || 'Unknown'}</p>
                <p>Project ID: {project.id}</p>
                <button
                  type="button"
                  className="btn btn-secondary details-toggle"
                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                >
                  {isExpanded ? 'Hide details' : 'Show details'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => handleDelete(project.id)}>
                  Delete
                </button>
                {isExpanded ? (
                  <div className="project-details-panel">
                    {project.completedAt ? <p>Completed: {new Date(project.completedAt).toLocaleDateString()}</p> : null}
                    {project.createdAt ? <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p> : null}
                    <p>Status: {project.status}</p>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
