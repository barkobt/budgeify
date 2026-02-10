/**
 * Web Vitals Beacon Endpoint — P8 Performance Monitoring
 *
 * Receives Core Web Vitals data from navigator.sendBeacon() in production.
 * Returns 204 No Content — fire-and-forget pattern.
 */
import { NextResponse } from 'next/server';

export async function POST() {
  // Future: persist metrics to analytics service
  return new NextResponse(null, { status: 204 });
}
