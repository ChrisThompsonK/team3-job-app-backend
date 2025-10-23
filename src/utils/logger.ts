export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LoggerConfig {
  level: LogLevel;
  enableColors: boolean;
  enableTimestamp: boolean;
}

class Logger {
  private config: LoggerConfig;
  private colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
  };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: this.getLogLevelFromEnv(),
      enableColors: process.env['NODE_ENV'] !== 'production',
      enableTimestamp: true,
      ...config,
    };
  }

  private getLogLevelFromEnv(): LogLevel {
    const logLevel = process.env['LOG_LEVEL']?.toUpperCase();
    switch (logLevel) {
      case 'DEBUG':
        return LogLevel.DEBUG;
      case 'INFO':
        return LogLevel.INFO;
      case 'WARN':
        return LogLevel.WARN;
      case 'ERROR':
        return LogLevel.ERROR;
      default:
        return process.env['NODE_ENV'] === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
    }
  }

  private formatMessage(level: string, message: string, color?: string): string {
    const timestamp = this.config.enableTimestamp ? `${new Date().toISOString()} ` : '';

    const levelStr = `[${level}]`;

    if (this.config.enableColors && color) {
      return `${this.colors.gray}${timestamp}${color}${levelStr}${this.colors.reset} ${message}`;
    }

    return `${timestamp}${levelStr} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', message, this.colors.gray), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage('INFO', message, this.colors.blue), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, this.colors.yellow), ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, this.colors.red), error, ...args);
    }
  }

  // Database-specific logging methods
  db = {
    connecting: (url: string) => this.debug(`Connecting to database: ${url}`),
    connected: () => this.info('Database connection established'),
    query: (query: string) => this.debug(`Database query: ${query}`),
    error: (message: string, error?: Error) => this.error(`Database error: ${message}`, error),
  };

  // HTTP-specific logging methods
  http = {
    request: (method: string, url: string) => this.debug(`${method} ${url}`),
    response: (method: string, url: string, status: number, duration?: number) => {
      const durationStr = duration ? ` (${duration}ms)` : '';
      this.info(`${method} ${url} - ${status}${durationStr}`);
    },
    error: (message: string, error?: Error) => this.error(`HTTP error: ${message}`, error),
  };

  // Application-specific logging methods
  app = {
    starting: (port: number | string) => this.info(`Starting server on port ${port}`),
    started: (port: number | string) => this.info(`Server is running on port ${port}`),
    stopping: () => this.info('Server is shutting down...'),
    stopped: () => this.info('Server stopped'),
    error: (message: string, error?: Error) => this.error(`Application error: ${message}`, error),
  };
}

// Create and export a singleton logger instance
export const logger = new Logger();

// Export the Logger class for custom instances if needed
export { Logger };
