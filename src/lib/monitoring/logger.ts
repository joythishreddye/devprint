import * as Sentry from '@sentry/nextjs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (level === 'debug' || level === 'info') {
    console.log(JSON.stringify(entry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry));
    Sentry.addBreadcrumb({ level: 'warning', message, data: context });
  } else if (level === 'error') {
    console.error(JSON.stringify(entry));
    Sentry.addBreadcrumb({ level: 'error', message, data: context });
  }
}

export const logger = {
  debug: (message: string, context?: LogContext): void => log('debug', message, context),
  info: (message: string, context?: LogContext): void => log('info', message, context),
  warn: (message: string, context?: LogContext): void => log('warn', message, context),
  error: (message: string, context?: LogContext): void => log('error', message, context),
  captureException: (error: unknown, context?: LogContext): void => {
    Sentry.captureException(error, { extra: context });
  },
};
