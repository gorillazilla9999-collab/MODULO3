import { History, Wrench } from 'lucide-react';
import { Link } from '../../app/router.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { QUICK_ACCESS_IDS, getTool, toolPath } from '../../config/tools.js';
import { useRecentTools } from '../../store/useRecentTools.js';

function ToolChip({ tool }) {
  const Icon = tool.icon;
  return (
    <Link to={toolPath(tool)} className="tool-chip">
      <span className="tool-chip-icon">
        <Icon size={16} aria-hidden="true" />
      </span>
      <span className="tool-chip-name truncate">{tool.name}</span>
    </Link>
  );
}

export function QuickAccess() {
  const tools = QUICK_ACCESS_IDS.map(getTool).filter((t) => t && t.status === 'ready');
  return (
    <section className="card shortcut-card" aria-labelledby="quick-access-title">
      <div className="card-head">
        <h2 className="card-title" id="quick-access-title">
          Quick access
        </h2>
        <Link to="/tools" className="card-link">
          All tools
        </Link>
      </div>
      <div className="tool-chip-grid">
        {tools.map((tool) => (
          <ToolChip key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export function RecentTools() {
  const { recent } = useRecentTools();
  const tools = recent
    .map(getTool)
    .filter((t) => t && t.status === 'ready')
    .slice(0, 4);

  return (
    <section className="card shortcut-card" aria-labelledby="recent-tools-title">
      <div className="card-head">
        <h2 className="card-title" id="recent-tools-title">
          Recently used
        </h2>
      </div>
      {tools.length === 0 ? (
        <EmptyState
          compact
          icon={History}
          title="No tools opened yet"
          description="Tools you open will show up here."
          action={
            <Link to="/tools" className="btn btn-secondary btn-sm">
              <Wrench size={14} aria-hidden="true" />
              Browse tools
            </Link>
          }
        />
      ) : (
        <ul className="recent-list">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={tool.id}>
                <Link to={toolPath(tool)} className="recent-item">
                  <span className="tool-chip-icon">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="recent-text">
                    <span className="recent-name truncate">{tool.name}</span>
                    <span className="recent-cat truncate">{tool.category}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
