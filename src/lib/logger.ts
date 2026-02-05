/**
 * Centralized Logger Utility
 *
 * Replaces raw console.log/error usage across the codebase.
 * In production, suppresses debug/info output.
 * In development, provides structured output.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isProduction = process.env.NODE_ENV === 'production';
const minLevel: LogLevel = isProduction ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatMessage(level: LogLevel, context: string, message: string): string {
  return `[${level.toUpperCase()}] ${context}: ${message}`;
}

export const logger = {
  debug(context: string, message: string, ...args: unknown[]) {
    if (shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.debug(formatMessage('debug', context, message), ...args);
    }
  },

  info(context: string, message: string, ...args: unknown[]) {
    if (shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info(formatMessage('info', context, message), ...args);
    }
  },

  warn(context: string, message: string, ...args: unknown[]) {
    if (shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn(formatMessage('warn', context, message), ...args);
    }
  },

  error(context: string, message: string, ...args: unknown[]) {
    if (shouldLog('error')) {
      // eslint-disable-next-line no-console
      console.error(formatMessage('error', context, message), ...args);
    }
  },
};
