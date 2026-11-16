import { Plus, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal.jsx';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { WIDGETS } from '../../config/widgets.js';

/** Side panel for adding widgets to, or removing them from, the dashboard. */
export function AddWidgetPanel({ open, onClose, layout, onAdd, onRemove }) {
  return (
    <Modal open={open} onClose={onClose} label="Add a widget" variant="drawer">
      <div className="drawer">
        <div className="drawer-head">
          <div>
            <h2 className="drawer-title">Add a widget</h2>
            <p className="drawer-sub">
              {layout.length} of {WIDGETS.length} on your dashboard
            </p>
          </div>
          <IconButton icon={X} label="Close panel" onClick={onClose} data-autofocus />
        </div>

        <ul className="drawer-list">
          {WIDGETS.map((widget) => {
            const Icon = widget.icon;
            const added = layout.includes(widget.type);
            return (
              <li key={widget.type} className={`drawer-item ${added ? 'is-added' : ''}`}>
                <span className="drawer-item-icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="drawer-item-text">
                  <p className="drawer-item-title">{widget.title}</p>
                  <p className="drawer-item-desc">{widget.description}</p>
                </div>
                {added ? (
                  <Button size="sm" onClick={() => onRemove(widget.type)} aria-label={`Remove ${widget.title}`}>
                    Remove
                  </Button>
                ) : (
                  <Button size="sm" variant="primary" icon={Plus} onClick={() => onAdd(widget.type)} aria-label={`Add ${widget.title}`}>
                    Add
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
