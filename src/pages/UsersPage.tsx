import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/Card';
import { demoUsers } from '../data/demoData';
import { userService } from '../services/user.service';
import { User } from '../types/auth';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers.length ? fetchedUsers : demoUsers);
      } catch {
        setUsers(demoUsers);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <PageContainer title="User Management" description="Review team members, roles, and access levels across the platform.">
      {loading ? (
        <p>Loading users…</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="card-grid">
          {users.map((user) => (
            <Card key={user.id} title={user.name} footer={<span>{user.role ?? 'User'}</span>}>
              <p>Email: {user.email}</p>
              <p>User ID: {user.id}</p>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
