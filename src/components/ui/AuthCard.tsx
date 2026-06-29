import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="auth-card auth-card--panel">
      <div className="auth-header">
        <span className="auth-badge">Dev Portal</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
      {footer ? <div className="auth-footer auth-footer--center">{footer}</div> : null}
    </div>
  );
}
