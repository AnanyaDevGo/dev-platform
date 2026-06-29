import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const featureCards = [
  {
    title: 'Projects',
    description: 'Manage active projects like AI Inference Platform and Dev Portal from one place.',
  },
  {
    title: 'Recent activity',
    description: 'Quickly review the latest events, sign-ins, and system changes.',
  },
  {
    title: 'System status',
    description: 'Monitor your workspace health with clear status and alerts.',
  },
];

export default function HomePage() {
  return (
    <main className="home-shell">
      <section className="home-page">
        <div className="home-hero">
          <div className="home-hero-copy">
            <span className="hero-pill">Developer Portal</span>
            <h1>Build and manage your workspace with confidence.</h1>
            <p>Sign in to access project dashboards, user controls, and a secure audit trail.</p>
            <div className="home-hero-actions">
              <Link to="/login">
                <Button variant="primary">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Create account</Button>
              </Link>
            </div>
          </div>
          <div className="home-hero-panel">
            <div className="home-panel-item">
              <strong>Projects</strong>
              <p>AI Inference Platform</p>
              <p>Dev Portal</p>
            </div>
            <div className="home-panel-item home-panel-item--accent">
              <strong>Recent activity</strong>
              <p>Audit summary, sign-in events, and status checks.</p>
            </div>
          </div>
        </div>

        <div className="home-features">
          {featureCards.map((card) => (
            <Card key={card.title} title={card.title}>
              <p>{card.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
