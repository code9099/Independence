import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export default class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Log to console; can be wired to a backend later
    console.error("App crashed:", error, info);
  }

  componentDidMount(): void {
    this.onWindowError = (event: ErrorEvent) => {
      this.setState({ hasError: true, error: event.error || event.message });
    };
    this.onUnhandledRejection = (event: PromiseRejectionEvent) => {
      this.setState({ hasError: true, error: event.reason });
    };
    window.addEventListener('error', this.onWindowError);
    window.addEventListener('unhandledrejection', this.onUnhandledRejection as any);
  }

  componentWillUnmount(): void {
    window.removeEventListener('error', this.onWindowError);
    window.removeEventListener('unhandledrejection', this.onUnhandledRejection as any);
  }

  private onWindowError?: (event: ErrorEvent) => void;
  private onUnhandledRejection?: (event: PromiseRejectionEvent) => void;

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container pt-24">
          <div className="card-premium p-6 rounded-xl">
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-4">An unexpected error occurred while rendering this page.</p>
            <pre className="text-xs bg-secondary p-3 rounded border border-border overflow-auto max-h-40">
              {String(this.state.error?.message || this.state.error || "Unknown error")}
            </pre>
            <button onClick={this.handleReload} className="mt-4 btn-gradient px-4 py-2 rounded">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


