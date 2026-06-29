import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { Button } from '../components/ui/Button';
import { PasswordInput } from '../components/ui/PasswordInput';
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
      <div className="auth-card auth-card--wide auth-central-card">
        <div className="auth-header">
          <span className="auth-badge">Dev Portal</span>
          <h1>Welcome back</h1>
          <p>Sign in to continue to your workspace, manage projects, and review audit logs.</p>
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

          <PasswordInput
            label="Password"
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

          <div className="auth-divider"><span>or continue with</span></div>

          <div className="oauth-actions">
            <Button type="button" variant="ghost" className="oauth-button" onClick={() => (window.location.href = '/oauth?provider=google')}>
              <span className="oauth-icon">G</span> Google
            </Button>
            <Button type="button" variant="ghost" className="oauth-button" onClick={() => (window.location.href = '/oauth?provider=github')}>
              <span className="oauth-icon"></span> GitHub
            </Button>
            <Button type="button" variant="ghost" className="oauth-button" onClick={() => (window.location.href = '/oauth?provider=microsoft')}>
              <span className="oauth-icon">M</span> Microsoft
            </Button>
          </div>
        </form>

        <div className="auth-footer auth-footer--center">
          <span>New to Dev Portal?</span>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </section>
  );
}
