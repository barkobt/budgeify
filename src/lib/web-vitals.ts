/**
 * Web Vitals — P8 Performance Monitoring
 *
 * Reports Core Web Vitals (LCP, FID, CLS, INP, TTFB, FCP)
 * to console in development and can be extended to send
 * to an analytics endpoint in production.
 */

import type { Metric } from 'web-vitals';

const vitalsUrl = '/api/vitals'; // Future: analytics endpoint

function getConnectionSpeed(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
  if (nav?.connection?.effectiveType) {
    return nav.connection.effectiveType;
  }
  return 'unknown';
}

/**
 * Send metric to analytics endpoint (production)
 * or log to console (development)
 */
function sendMetric(metric: Metric): void {
  const body = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,
    navigationType: metric.navigationType,
    connectionSpeed: getConnectionSpeed(),
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  };

  if (process.env.NODE_ENV === 'development') {
    const color = metric.rating === 'good' ? '#10B981'
      : metric.rating === 'needs-improvement' ? '#F59E0B'
      : '#F43F5E';

    // eslint-disable-next-line no-console
    console.log(
      `%c[Web Vitals] ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`,
      `color: ${color}; font-weight: bold;`
    );
    return;
  }

  // Production: beacon API for non-blocking send
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
    navigator.sendBeacon(vitalsUrl, blob);
  }
}

/**
 * Initialize Web Vitals reporting.
 * Dynamically imports web-vitals to avoid adding to main bundle.
 */
export function reportWebVitals(): void {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onCLS, onLCP, onINP, onTTFB, onFCP }) => {
    onCLS(sendMetric);
    onLCP(sendMetric);
    onINP(sendMetric);
    onTTFB(sendMetric);
    onFCP(sendMetric);
  }).catch(() => {
    // web-vitals not available — silently ignore
  });
}
