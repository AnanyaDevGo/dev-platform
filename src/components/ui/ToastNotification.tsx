import { useEffect } from 'react';

interface ToastNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  timeout?: number;
  onClose: () => void;
}

export function ToastNotification({ message, type = 'info', timeout = 5000, onClose }: ToastNotificationProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, timeout);
    return () => window.clearTimeout(timer);
  }, [onClose, timeout]);

  return <div className={`toast toast-${type}`}>{message}</div>;
}
