'use client';

import React from 'react';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import { reportError, addBreadcrumb } from '@/lib/error-reporting';

/**
 * ErrorBoundary - React Error Boundary Component
 *
 * Production'da beklenmeyen hataları yakalar ve kullanıcıya fallback UI gösterir.
 * Development'ta hatalar console'da görünür.
 * Error reporting abstraction aracılığıyla Sentry-ready.
 */

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    addBreadcrumb({
      category: 'react',
      message: 'Component stack trace available',
      level: 'error',
      data: { componentStack: errorInfo.componentStack },
    });

    reportError(error, {
      context: 'ErrorBoundary',
      extra: { componentStack: errorInfo.componentStack },
      level: 'fatal',
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI — dark theme matching Depth Black design
      return (
        <div className="flex min-h-screen items-center justify-center px-4" style={{ background: '#050505' }}>
          <div className="w-full max-w-md">
            <Card variant="glass">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                  <span className="text-3xl">⚠️</span>
                </div>
                <CardTitle className="text-center">Bir Hata Oluştu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-center text-slate-400">
                  Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyerek tekrar
                  deneyin.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                    <p className="text-xs font-mono text-red-400">
                      {this.state.error.message}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="primary"
                  isFullWidth
                  onClick={() => window.location.reload()}
                >
                  Sayfayı Yenile
                </Button>
                <Button
                  variant="ghost"
                  isFullWidth
                  onClick={this.handleReset}
                >
                  Tekrar Dene
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
