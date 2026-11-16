/** Buttons. `variant`: primary | secondary | ghost | danger. */
export function Button({ variant = 'secondary', size = 'md', icon: Icon, children, className = '', type = 'button', ...rest }) {
  return (
    <button type={type} className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 14 : 16} aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Icon-only button. `label` is required for accessibility and doubles as the tooltip. */
export function IconButton({ icon: Icon, label, size = 16, className = '', type = 'button', ...rest }) {
  return (
    <button type={type} className={`icon-btn ${className}`} aria-label={label} title={label} {...rest}>
      <Icon size={size} aria-hidden="true" />
    </button>
  );
}
