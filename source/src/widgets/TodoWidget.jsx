import { useMemo, useState } from 'react';
import { Check, ListChecks, Plus, Trash2 } from 'lucide-react';
import { useTasks } from '../store/useTasks.js';
import { Button, IconButton } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';

export default function TodoWidget() {
  const { tasks, add, toggle, remove, clearCompleted } = useTasks();
  const [text, setText] = useState('');

  const ordered = useMemo(() => [...tasks.filter((t) => !t.done), ...tasks.filter((t) => t.done)], [tasks]);
  const doneCount = tasks.filter((t) => t.done).length;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const onSubmit = (event) => {
    event.preventDefault();
    if (add(text)) setText('');
  };

  return (
    <div className="todo">
      <form className="todo-form" onSubmit={onSubmit}>
        <input
          className="input"
          value={text}
          placeholder="Add a task…"
          aria-label="New task"
          maxLength={200}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" variant="primary" icon={Plus} disabled={!text.trim()}>
          Add
        </Button>
      </form>

      {tasks.length > 0 && (
        <div className="todo-summary">
          <span>
            {doneCount} of {tasks.length} done
          </span>
          <div className="todo-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Tasks completed">
            <div className="todo-progress-bar" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      {ordered.length === 0 ? (
        <EmptyState compact icon={ListChecks} title="Nothing planned yet" description="Add your first task for today." />
      ) : (
        <ul className="todo-list">
          {ordered.map((task) => (
            <li key={task.id} className={`todo-item ${task.done ? 'is-done' : ''}`}>
              <button
                type="button"
                className="todo-check"
                role="checkbox"
                aria-checked={task.done}
                aria-label={`${task.done ? 'Mark as not done' : 'Mark as done'}: ${task.text}`}
                onClick={() => toggle(task.id)}
              >
                {task.done && <Check size={12} strokeWidth={3} aria-hidden="true" />}
              </button>
              <span className="todo-text">{task.text}</span>
              <IconButton icon={Trash2} label={`Delete task: ${task.text}`} className="todo-delete is-danger" onClick={() => remove(task.id)} />
            </li>
          ))}
        </ul>
      )}

      {doneCount > 0 && (
        <button type="button" className="todo-footer" onClick={clearCompleted}>
          Clear {doneCount} completed
        </button>
      )}
    </div>
  );
}
