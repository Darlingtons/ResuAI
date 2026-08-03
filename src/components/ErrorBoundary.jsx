import React, { Component } from 'react';
import { ErrorPage } from '../pages/ErrorPage';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container">
          <main className="main-content">
            <ErrorPage errorCode={500} />
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
