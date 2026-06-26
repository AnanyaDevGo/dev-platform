import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginPayload } from '../types/auth';
import { useAuth } from './useAuth';

export function useLogin() {
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  async function handleLogin(payload: LoginPayload) {
    setError('');
    setIsBusy(true);

    try {
      await login(payload.email, payload.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsBusy(false);
    }
  }

  return {
    handleLogin,
    error,
    isBusy,
  };
}
