import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { isValidEmail, isValidPassword } from '../utils/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { handleLogin, error, isBusy } = useLogin();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError('');

    if (!isValidEmail(email)) {
      setValidationError('Enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setValidationError('Password must be at least 8 characters and contain letters and numbers.');
      return;
    }

    handleLogin({ email, password });
  }

  return (
    <section className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <h1>Sign in</h1>
          <p>Secure access to your dashboard and identity provider integrations.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            error={validationError && !isValidEmail(email) ? validationError : undefined}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            error={validationError && !isValidPassword(password) ? validationError : undefined}
          />

          {validationError ? <div className="form-error">{validationError}</div> : null}
          {error ? <div className="form-error">{error}</div> : null}

          <Button type="submit" variant="primary" disabled={isBusy}>
            {isBusy ? 'Signing in…' : 'Sign in'}
          </Button>

          <div className="oauth-actions">
            <Button type="button" variant="secondary" onClick={() => (window.location.href = '/oauth')}>
              Continue with Google
            </Button>
            <Button type="button" variant="secondary" onClick={() => (window.location.href = '/oauth')}>
              Continue with GitHub
            </Button>
            <Button type="button" variant="secondary" onClick={() => (window.location.href = '/oauth')}>
              Continue with Microsoft
            </Button>
          </div>
        </form>

        <div className="auth-footer">
          <span>New to Dev Portal?</span>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </section>
  );
}
