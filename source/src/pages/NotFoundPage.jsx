import { Compass } from 'lucide-react';
import { Link } from '../app/router.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';

export default function NotFoundPage({
  title = 'Page not found',
  message = 'The page you’re looking for doesn’t exist or has moved.',
  backTo = '/',
  backLabel = 'Go to Home',
}) {
  return (
    <div className="page">
      <div className="card">
        <EmptyState
          icon={Compass}
          title={title}
          description={message}
          action={
            <Link to={backTo} className="btn btn-primary btn-md">
              {backLabel}
            </Link>
          }
        />
      </div>
    </div>
  );
}
