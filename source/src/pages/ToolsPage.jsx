import { useMemo, useState } from 'react';
import { ArrowUpRight, SearchX } from 'lucide-react';
import { Link } from '../app/router.jsx';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { CATEGORIES, TOOLS, toolPath } from '../config/tools.js';

function ToolCard({ tool }) {
  const Icon = tool.icon;
  const soon = tool.status === 'soon';

  const content = (
    <>
      <div className="tool-card-top">
        <span className="tool-card-icon">
          <Icon size={20} aria-hidden="true" />
        </span>
        {soon ? (
          <span className="badge badge-soon">Coming soon</span>
        ) : (
          <ArrowUpRight size={16} className="tool-card-arrow" aria-hidden="true" />
        )}
      </div>
      <h3 className="tool-card-name">{tool.name}</h3>
      <p className="tool-card-desc">{tool.description}</p>
      <span className="badge">{tool.category}</span>
    </>
  );

  if (soon) {
    return (
      <li className="tool-card is-soon" aria-label={`${tool.name}, coming soon`}>
        {content}
      </li>
    );
  }
  return (
    <li>
      <Link to={toolPath(tool)} className="tool-card" aria-label={`Open ${tool.name}`}>
        {content}
      </Link>
    </li>
  );
}

export default function ToolsPage() {
  const [category, setCategory] = useState('All');
  const [filter, setFilter] = useState('');

  const readyCount = TOOLS.filter((t) => t.status === 'ready').length;
  const soonCount = TOOLS.length - readyCount;

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const matches = (tool) =>
      !q || `${tool.name} ${tool.description} ${tool.keywords || ''} ${tool.category}`.toLowerCase().includes(q);
    return CATEGORIES.filter((c) => category === 'All' || c === category)
      .map((c) => ({ category: c, tools: TOOLS.filter((t) => t.category === c && matches(t)) }))
      .filter((g) => g.tools.length > 0);
  }, [category, filter]);

  return (
    <div className="page">
      <PageHeader title="Tools" description={`${readyCount} ready to use, ${soonCount} coming soon.`} />

      <div className="toolbar">
        <div className="chip-row" role="group" aria-label="Filter by category">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              className={`chip ${category === c ? 'is-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          className="input toolbar-search"
          type="search"
          placeholder="Filter tools…"
          aria-label="Filter tools"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {groups.length === 0 ? (
        <div className="card">
          <EmptyState icon={SearchX} title="No tools match" description="Try a different word or choose another category." />
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.category} className="tool-group" aria-labelledby={`cat-${group.category}`}>
            <h2 className="section-title" id={`cat-${group.category}`}>
              {group.category}
            </h2>
            <ul className="tool-grid">
              {group.tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
