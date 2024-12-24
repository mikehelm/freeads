import type { RateLimitError } from './types';

interface RateLimitHeaders {
  'RateLimit-Policy': string;
  'RateLimit-Limit': string;
  'RateLimit-Remaining': string;
  'RateLimit-Reset': string;
}

export class RateLimitHandler {
  private static instance: RateLimitHandler;
  private retryQueue: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): RateLimitHandler {
    if (!RateLimitHandler.instance) {
      RateLimitHandler.instance = new RateLimitHandler();
    }
    return RateLimitHandler.instance;
  }

  handleRateLimit(error: RateLimitError, endpoint: string): void {
    const { retryAfter, resetAt } = error.error.details;
    this.retryQueue.set(endpoint, Date.now() + (retryAfter * 1000));
    console.warn(`Rate limit exceeded for ${endpoint}. Reset at: ${resetAt}`);
  }

  canRetry(endpoint: string): boolean {
    const retryTime = this.retryQueue.get(endpoint);
    if (!retryTime) return true;
    return Date.now() >= retryTime;
  }

  getRetryAfter(endpoint: string): number {
    const retryTime = this.retryQueue.get(endpoint);
    if (!retryTime) return 0;
    const waitTime = retryTime - Date.now();
    return waitTime > 0 ? Math.ceil(waitTime / 1000) : 0;
  }

  parseRateLimitHeaders(headers: RateLimitHeaders): {
    limit: number;
    remaining: number;
    resetAt: Date;
  } {
    return {
      limit: parseInt(headers['RateLimit-Limit'], 10),
      remaining: parseInt(headers['RateLimit-Remaining'], 10),
      resetAt: new Date(parseInt(headers['RateLimit-Reset'], 10) * 1000)
    };
  }

  clearEndpoint(endpoint: string): void {
    this.retryQueue.delete(endpoint);
  }
}
