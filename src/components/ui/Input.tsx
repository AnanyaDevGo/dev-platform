import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: string;
  error?: string;
}

export function Input({ label, helpText, error, ...props }: InputProps) {
  return (
    <label className="field-group">
      <span className="field-label">{label}</span>
      <input className={error ? 'field-input field-input--error' : 'field-input'} {...props} />
      {helpText ? <span className="field-help">{helpText}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
