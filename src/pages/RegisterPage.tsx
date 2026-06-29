import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { isValidEmail, isValidPassword, doPasswordsMatch } from '../utils/validation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { handleRegister, error, isBusy } = useRegister();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError('Enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setValidationError('Password must be at least 8 characters and include letters and numbers.');
      return;
    }

    if (!doPasswordsMatch(password, confirmPassword)) {
      setValidationError('Password and confirm password must match.');
      return;
    }

    await handleRegister({ name, email, password });
  }

  return (
    <section className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <span className="auth-badge">Dev Portal</span>
          <h1>Create your account</h1>
          <p>Join Dev Portal to manage projects, monitor activity, and enable secure sign-on.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <Input
            label="Full name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
            required
          />

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
            placeholder="Create a strong password"
            required
          />

          <PasswordInput
            label="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter password"
            required
            error={validationError && !doPasswordsMatch(password, confirmPassword) ? validationError : undefined}
          />

          {validationError ? <div className="form-error">{validationError}</div> : null}
          {error ? <div className="form-error">{error}</div> : null}

          <Button type="submit" variant="primary" disabled={isBusy}>
            {isBusy ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <div className="auth-footer auth-footer--center">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </section>
  );
}
