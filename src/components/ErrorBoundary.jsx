import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.toString() || 'Unknown runtime error';
      const stack = this.state.error?.stack || '';
      const componentStack = this.state.errorInfo?.componentStack || '';

      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#1a0f08',
          color: '#fff4e0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxSizing: 'border-box',
        }}>
          <div style={{
            maxWidth: '700px',
            width: '100%',
            backgroundColor: '#2a1a10',
            border: '2px solid #ef4444',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '1px',
              }}>
                APPLICATION ERROR
              </span>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#fca5a5' }}>
                Game Runtime Error Detected
              </h2>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#ffd1a3', lineHeight: '1.5' }}>
              An unexpected error occurred during rendering. You can review the trace below or reset local storage to clear any corrupted game state.
            </p>

            <div style={{
              backgroundColor: '#120803',
              border: '1px solid #7f1d1d',
              borderRadius: '8px',
              padding: '12px',
              overflowX: 'auto',
              marginBottom: '16px',
            }}>
              <div style={{ color: '#f87171', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
                {errorMsg}
              </div>
              {stack && (
                <pre style={{
                  margin: 0,
                  fontSize: '11px',
                  color: '#fca5a5',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '160px',
                  overflowY: 'auto',
                }}>
                  {stack}
                </pre>
              )}
              {componentStack && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>Component Stack:</div>
                  <pre style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#fcd34d',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '120px',
                    overflowY: 'auto',
                  }}>
                    {componentStack}
                  </pre>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#f97316',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Clear Saved Data & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
