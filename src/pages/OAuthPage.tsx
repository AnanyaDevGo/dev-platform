import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function OAuthPage() {
  const navigate = useNavigate();
  const completeOAuthLogin = useAuthStore((state) => state.completeOAuthLogin);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      await completeOAuthLogin();
      navigate('/dashboard', { replace: true });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [completeOAuthLogin, navigate]);

  return (
    <section className="oauth-page">
      <div className="oauth-card">
        <h1>OAuth / OIDC login</h1>
        <p>Simulating a redirect to an external identity provider.</p>
        <div className="oauth-status">
          <span className="dot" />
          <span>Authenticating with an external identity provider…</span>
        </div>
      </div>
    </section>
  );
}
