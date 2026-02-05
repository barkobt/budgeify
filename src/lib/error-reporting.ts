/**
 * Error Reporting Abstraction
 *
 * Sentry-ready error tracking that works without any external dependency.
 * When Sentry is configured, it captures errors + context automatically.
 * Without Sentry, falls back to structured console logging via logger.
 *
 * Usage:
 *   import { reportError, setUser, addBreadcrumb } from '@/lib/error-reporting';
 *   reportError(error, { context: 'PaymentForm', extra: { amount: 500 } });
 */

import { logger } from './logger';

// ── Types ──────────────────────────────────────────────────────────────

interface ErrorContext {
  context: string;
  extra?: Record<string, unknown>;
  tags?: Record<string, string>;
  level?: 'fatal' | 'error' | 'warning' | 'info';
}

interface UserContext {
  id: string;
  email?: string;
}

interface Breadcrumb {
  category: string;
  message: string;
  level?: 'debug' | 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}

type ErrorReporter = (error: Error, context: ErrorContext) => void;

// ── State ──────────────────────────────────────────────────────────────

let externalReporter: ErrorReporter | null = null;
let currentUser: UserContext | null = null;
const breadcrumbs: Breadcrumb[] = [];
const MAX_BREADCRUMBS = 20;

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Register an external error reporter (e.g., Sentry).
 *
 * Example with Sentry:
 *   import * as Sentry from '@sentry/nextjs';
 *   registerReporter((error, ctx) => {
 *     Sentry.captureException(error, {
 *       tags: ctx.tags,
 *       extra: ctx.extra,
 *       level: ctx.level,
 *     });
 *   });
 */
export function registerReporter(reporter: ErrorReporter): void {
  externalReporter = reporter;
}

/**
 * Report an error with structured context.
 * Routes to external reporter if registered, otherwise logs.
 */
export function reportError(error: Error, context: ErrorContext): void {
  const { context: ctx, extra, level = 'error' } = context;

  // Always log locally
  logger.error(ctx, error.message, { extra, level });

  // Forward to external reporter if registered
  if (externalReporter) {
    try {
      externalReporter(error, context);
    } catch (reporterError) {
      logger.warn('ErrorReporting', 'External reporter failed', reporterError);
    }
  }
}

/**
 * Set the current user context for error reports.
 */
export function setUser(user: UserContext | null): void {
  currentUser = user;
}

/**
 * Get the current user context.
 */
export function getUser(): UserContext | null {
  return currentUser;
}

/**
 * Add a breadcrumb for debugging context.
 * Breadcrumbs are included with error reports to show what happened before the error.
 */
export function addBreadcrumb(crumb: Breadcrumb): void {
  breadcrumbs.push({
    ...crumb,
    level: crumb.level ?? 'info',
  });

  // Keep only the most recent breadcrumbs
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs.shift();
  }
}

/**
 * Get recent breadcrumbs (useful for error context).
 */
export function getBreadcrumbs(): ReadonlyArray<Breadcrumb> {
  return breadcrumbs;
}
