import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function OAuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState('google');
  const [status, setStatus] = useState('Preparing secure sign in...');
  const completeOAuthLogin = useAuthStore((state) => state.completeOAuthLogin);

  useEffect(() => {
    const selectedProvider = searchParams.get('provider') || 'google';
    setProvider(selectedProvider);
    setStatus(`Verifying ${selectedProvider} account...`);

    const timer = window.setTimeout(async () => {
      try {
        await completeOAuthLogin(selectedProvider);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        setStatus('Account verification failed. Please try again.');
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [searchParams, completeOAuthLogin, navigate]);

  return (
    <section className="oauth-page">
      <div className="oauth-card">
        <h1>Secure sign in</h1>
        <p>Verifying your {provider} account before continuing.</p>
        <div className="oauth-status">
          <span className="dot" />
          <span>{status}</span>
        </div>
      </div>
    </section>
  );
}
