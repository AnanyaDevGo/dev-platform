import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useLocalStorage<boolean>('dev-portal-sidebar-collapsed', false);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Workspace</span>
        <button type="button" className="sidebar-toggle" onClick={() => setCollapsed((prev) => !prev)}>
          {collapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
      <ul className="sidebar-list">
        <li>
          <Link to="/dashboard">Overview</Link>
        </li>
        <li>
          <Link to="/dashboard/projects">Projects</Link>
        </li>
        <li>
          <Link to="/dashboard/users">User Management</Link>
        </li>
        <li>
          <Link to="/dashboard/audit">Audit Logs</Link>
        </li>
        <li>
          <Link to="/dashboard/monitoring">Monitoring</Link>
        </li>
      </ul>
    </aside>
  );
}
