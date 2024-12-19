import { WalletError } from '../types/ethereum';

const MAX_LOG_SIZE = 100;

type LogType = 'error' | 'info' | 'warning';
type LogLevel = 'info' | 'warn' | 'error';
type LogCallback = (level: LogLevel, message: string, data?: any) => void;

interface LogEntry {
  timestamp: number;
  type: LogType;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private subscribers: LogCallback[] = [];

  subscribe(callback: LogCallback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: LogCallback) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  private notify(level: LogLevel, message: string, data?: any) {
    this.subscribers.forEach(callback => callback(level, message, data));
  }

  log(type: LogType, message: string, data?: any) {
    const logEntry = {
      timestamp: Date.now(),
      type,
      message,
      data
    };

    this.logs.unshift(logEntry);

    // Keep log size manageable
    if (this.logs.length > MAX_LOG_SIZE) {
      this.logs.pop();
    }

    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      switch (type) {
        case 'error':
          console.error(message, data);
          break;
        case 'warning':
          console.warn(message, data);
          break;
        case 'info':
          console.info(message, data);
          break;
      }
    }

    // Notify subscribers (debug window)
    switch (type) {
      case 'error':
        this.notify('error', message, data);
        break;
      case 'warning':
        this.notify('warn', message, data);
        break;
      case 'info':
        this.notify('info', message, data);
        break;
    }
  }

  getRecentLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  hasErrors(): boolean {
    return this.logs.some(log => log.type === 'error');
  }

  getLastError(): LogEntry | null {
    return this.logs.find(log => log.type === 'error') || null;
  }
}

export const logger = new Logger();