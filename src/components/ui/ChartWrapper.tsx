import React, { ErrorInfo, ReactNode } from 'react';

interface ChartWrapperProps {
  children: ReactNode;
}

interface ChartWrapperState {
  hasError: boolean;
}

class ChartWrapper extends React.Component<ChartWrapperProps, ChartWrapperState> {
  constructor(props: ChartWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ChartWrapperState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chart rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <p>Chart temporarily unavailable</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default ChartWrapper; 