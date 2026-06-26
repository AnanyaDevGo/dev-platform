import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';

const users = [
  { id: 'u-1', name: 'Ananya Patel', role: 'Admin' },
  { id: 'u-2', name: 'Noah Carter', role: 'Product' },
  { id: 'u-3', name: 'Mia Chen', role: 'Support' },
];

export default function UsersPage() {
  return (
    <PageContainer title="User Management" description="Review team members, roles, and access levels across the platform.">
      <div className="card-grid">
        {users.map((user) => (
          <Card key={user.id} title={user.name} footer={<span>{user.role}</span>}>
            <p>ID: {user.id}</p>
            <p>Access: {user.role}</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
