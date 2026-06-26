import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterPayload } from '../types/auth';
import { useAuth } from './useAuth';

export function useRegister() {
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(payload: RegisterPayload) {
    setError('');
    setIsBusy(true);

    try {
      await register(payload.name, payload.email, payload.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsBusy(false);
    }
  }

  return {
    handleRegister,
    error,
    isBusy,
  };
}
