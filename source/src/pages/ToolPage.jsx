import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '../app/router.jsx';
import { PageHeader } from '../components/ui/PageHeader.jsx';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';
import { getTool } from '../config/tools.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function ToolPage({ id }) {
  const { navigate } = useRouter();
  const tool = getTool(id);

  // Tools that live on their own page (like Notes) redirect there.
  useEffect(() => {
    if (tool?.to) navigate(tool.to);
  }, [tool, navigate]);

  if (!tool || tool.status !== 'ready' || tool.to) {
    if (tool?.to) return null;
    return (
      <NotFoundPage
        title={tool ? `${tool.name} is coming soon` : 'Tool not found'}
        message={tool ? 'This tool isn’t available yet.' : 'We couldn’t find a tool with that name.'}
        backTo="/tools"
        backLabel="Back to tools"
      />
    );
  }

  const Component = tool.component;

  return (
    <div className="page">
      <Link to="/tools" className="back-link">
        <ArrowLeft size={14} aria-hidden="true" />
        All tools
      </Link>
      <PageHeader title={tool.name} description={tool.description} actions={<span className="badge">{tool.category}</span>} />
      <div className={`card tool-frame tool-frame-${tool.width || 'regular'}`}>
        <ErrorBoundary title={`${tool.name} stopped working`}>
          <Component />
        </ErrorBoundary>
      </div>
    </div>
  );
}
