import { useState } from 'react';
import { Input } from './Input';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="field-group field-group--password">
      <span className="field-label">{label}</span>
      <div className="password-field">
        <input
          className={error ? 'field-input field-input--error' : 'field-input'}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <span aria-hidden="true">👁️</span>
          ) : (
            <span aria-hidden="true">🙈</span>
          )}
        </button>
      </div>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
