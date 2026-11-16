import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, X } from 'lucide-react';
import { ErrorBoundary } from '../../components/ErrorBoundary.jsx';
import { IconButton } from '../../components/ui/Button.jsx';
import { WIDGET_BY_TYPE } from '../../config/widgets.js';

function WidgetFrame({ def, isFirst, isLast, dragActive, isDragging, isOver, handlers, onRemove, onNudge }) {
  // Only the grip starts a drag, so typing, selecting text and using buttons inside widgets is unaffected.
  const [armed, setArmed] = useState(false);
  const Icon = def.icon;
  const Body = def.component;

  return (
    <section
      className={`widget widget-${def.size} ${isDragging ? 'is-dragging' : ''} ${isOver ? 'is-over' : ''}`}
      aria-label={def.title}
      draggable={armed}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', def.type);
        handlers.onDragStart();
      }}
      onDragEnd={() => {
        setArmed(false);
        handlers.onDragEnd();
      }}
      onDragOver={(event) => {
        if (!dragActive) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        handlers.onDragOver();
      }}
      onDrop={(event) => {
        event.preventDefault();
        setArmed(false);
        handlers.onDrop();
      }}
    >
      <header className="widget-head">
        <span
          className="widget-grip"
          title="Drag to rearrange"
          aria-hidden="true"
          onPointerDown={() => setArmed(true)}
          onPointerUp={() => setArmed(false)}
        >
          <GripVertical size={16} />
        </span>
        <Icon size={15} className="widget-icon" aria-hidden="true" />
        <h2 className="widget-title">{def.title}</h2>
        <div className="widget-actions">
          <IconButton icon={ChevronUp} size={15} label={`Move ${def.title} earlier`} disabled={isFirst} onClick={() => onNudge(def.type, -1)} />
          <IconButton icon={ChevronDown} size={15} label={`Move ${def.title} later`} disabled={isLast} onClick={() => onNudge(def.type, 1)} />
          <IconButton icon={X} size={15} label={`Remove ${def.title}`} className="is-danger" onClick={() => onRemove(def.type)} />
        </div>
      </header>
      <div className="widget-body">
        <ErrorBoundary title={`${def.title} stopped working`}>
          <Body />
        </ErrorBoundary>
      </div>
    </section>
  );
}

export function WidgetGrid({ layout, onRemove, onReorder, onNudge }) {
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const finish = () => {
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="widget-grid">
      {layout.map((type, index) => (
        <WidgetFrame
          key={type}
          def={WIDGET_BY_TYPE[type]}
          isFirst={index === 0}
          isLast={index === layout.length - 1}
          dragActive={dragging !== null}
          isDragging={dragging === type}
          isOver={over === type && dragging !== type}
          onRemove={onRemove}
          onNudge={onNudge}
          handlers={{
            onDragStart: () => setDragging(type),
            onDragEnd: finish,
            onDragOver: () => setOver(type),
            onDrop: () => {
              if (dragging && dragging !== type) onReorder(dragging, type);
              finish();
            },
          }}
        />
      ))}
    </div>
  );
}
