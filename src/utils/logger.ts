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

  private addLog(type: LogType, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      type,
      message,
      data
    };

    this.logs.push(entry);
    if (this.logs.length > MAX_LOG_SIZE) {
      this.logs.shift();
    }
  }

  error(message: string, data?: any) {
    console.error(message, data);
    this.addLog('error', message, data);
    this.notify('error', message, data);
  }

  info(message: string, data?: any) {
    console.info(message, data);
    this.addLog('info', message, data);
    this.notify('info', message, data);
  }

  warning(message: string, data?: any) {
    console.warn(message, data);
    this.addLog('warning', message, data);
    this.notify('warn', message, data);
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