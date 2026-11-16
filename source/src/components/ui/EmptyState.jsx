export function EmptyState({ icon: Icon, title, description, action, compact = false }) {
  return (
    <div className={`empty ${compact ? 'empty-compact' : ''}`}>
      {Icon && (
        <span className="empty-icon">
          <Icon size={compact ? 18 : 22} aria-hidden="true" />
        </span>
      )}
      <p className="empty-title">{title}</p>
      {description && <p className="empty-desc">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
