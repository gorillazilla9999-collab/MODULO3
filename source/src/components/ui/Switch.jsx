/** Labelled on/off switch. */
export function Switch({ checked, onChange, label, description, id }) {
  return (
    <div className="switch-row">
      <div className="switch-text">
        <label className="switch-label" htmlFor={id}>
          {label}
        </label>
        {description && <p className="switch-desc">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? 'is-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-thumb" />
      </button>
    </div>
  );
}
