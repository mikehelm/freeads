import { ApiResponse } from '../types/api';
import { logger } from '../utils/logger';

const etagCache = new Map<string, string>();
const RETRY_AFTER_DEFAULT = 1000; // 1 second default retry
const MAX_RETRIES = 3;

interface FetchOptions extends RequestInit {
  skipCache?: boolean;
  maxRetries?: number;
}

class RateLimitError extends Error {
  retryAfter: number;
  
  constructor(retryAfter: number) {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function apiClient<T>(
  endpoint: string, 
  options: FetchOptions = {},
  retryCount = 0
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const url = `${baseUrl}${endpoint}`;
  const { skipCache = false, maxRetries = MAX_RETRIES, ...fetchOptions } = options;

  // Add ETag if available and not skipping cache
  if (!skipCache && etagCache.has(url)) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'If-None-Match': etagCache.get(url)!
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers
      },
      ...fetchOptions
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || String(RETRY_AFTER_DEFAULT));
      
      if (retryCount < maxRetries) {
        await sleep(retryAfter);
        return apiClient(endpoint, options, retryCount + 1);
      }
      
      throw new RateLimitError(retryAfter);
    }

    // Handle 304 Not Modified
    if (response.status === 304) {
      const cachedResponse = localStorage.getItem(`cache_${url}`);
      return cachedResponse ? JSON.parse(cachedResponse) : null;
    }

    // Store new ETag if present
    const etag = response.headers.get('ETag');
    if (etag) {
      etagCache.set(url, etag);
    }

    const data = await response.json();

    // Handle API-specific error responses
    if (!response.ok) {
      logger.error('API Error', { endpoint, status: response.status, data });
      throw new Error(data.error?.message || 'API request failed');
    }

    // Cache the successful response
    if (etag) {
      localStorage.setItem(`cache_${url}`, JSON.stringify(data));
    }

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.data!;
  } catch (error) {
    logger.error('API Request Failed', { endpoint, error });
    if (error instanceof RateLimitError) {
      throw error;
    }
    
    // Handle other errors and retry if possible
    if (retryCount < maxRetries) {
      await sleep(Math.pow(2, retryCount) * 1000); // Exponential backoff
      return apiClient(endpoint, options, retryCount + 1);
    }
    
    throw error;
  }
}
