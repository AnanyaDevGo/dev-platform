import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, startOAuthLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsBusy(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign in</h1>
          <p>Use a developer account or continue with OAuth.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="btn btn-primary" type="submit" disabled={isBusy}>
            {isBusy ? 'Signing in…' : 'Sign in'}
          </button>

          <button className="btn btn-secondary" type="button" onClick={startOAuthLogin}>
            Continue with External IDP
          </button>
        </form>

        <div className="auth-footer">
          <span>New to Dev Portal?</span>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </section>
  );
}
