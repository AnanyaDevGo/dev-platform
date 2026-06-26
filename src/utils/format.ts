export function emailToInitials(email: string) {
  const name = email.split('@')[0] || '';
  return name
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((s) => s[0].toUpperCase())
    .join('')
    .slice(0, 2);
}
