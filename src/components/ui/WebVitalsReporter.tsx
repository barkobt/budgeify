'use client';

/**
 * WebVitalsReporter — P8 Performance Monitoring
 *
 * Client component that initializes Web Vitals reporting on mount.
 * Renders nothing — pure side-effect component.
 */

import { useEffect } from 'react';

export function WebVitalsReporter() {
  useEffect(() => {
    import('@/lib/web-vitals').then(({ reportWebVitals }) => {
      reportWebVitals();
    });
  }, []);

  return null;
}
