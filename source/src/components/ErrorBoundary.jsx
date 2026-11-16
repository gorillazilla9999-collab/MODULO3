import { Component } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from './ui/Button.jsx';

/** Contains render errors so one broken widget or page can't take down the whole app. */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('MODULO caught a render error:', error, info?.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="error-box" role="alert">
        <TriangleAlert size={20} aria-hidden="true" />
        <p className="error-title">{this.props.title || 'Something went wrong'}</p>
        <p className="error-desc">This part of the app stopped working. Your saved data is safe.</p>
        <Button size="sm" onClick={this.reset}>
          Try again
        </Button>
      </div>
    );
  }
}
