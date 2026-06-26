interface SpinnerProps {
  label?: string;
}

export function Spinner({ label }: SpinnerProps) {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      {label ? <span className="spinner-label">{label}</span> : null}
    </div>
  );
}
