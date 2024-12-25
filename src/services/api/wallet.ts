import axios from 'axios';
import { API_CONFIG } from './config';
import type { ApiResponse, WalletData, RateLimitError } from './types';
import { RateLimitHandler } from './rateLimit';
import { logger } from '../../utils/logger';

const rateLimitHandler = RateLimitHandler.getInstance();

// Create axios instance with default config
const api = axios.create({
  headers: API_CONFIG.headers.common,
  baseURL: API_CONFIG.baseURL
});

// Add request/response interceptors for debugging
api.interceptors.request.use(request => {
  logger.info('Starting API Request', {
    method: request.method?.toUpperCase(),
    url: request.url,
    baseURL: request.baseURL,
    headers: request.headers,
    data: request.data
  });
  return request;
});

api.interceptors.response.use(
  response => {
    logger.info('API Response Success', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  error => {
    logger.error('API Response Error', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

export const walletService = {
  async getWallet(address: string): Promise<WalletData> {
    if (!address) {
      throw new Error('Wallet address is required');
    }

    const endpoint = API_CONFIG.endpoints.wallet.get(address);
    
    if (!rateLimitHandler.canRetry(endpoint)) {
      const retryAfter = rateLimitHandler.getRetryAfter(endpoint);
      throw {
        error: {
          type: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Retry after ${retryAfter} seconds`,
          details: {
            retryAfter,
            endpoint
          }
        }
      } as RateLimitError;
    }

    try {
      logger.info('Fetching wallet data', { address, endpoint });
      const response = await api.get<ApiResponse<WalletData>>(endpoint, {
        headers: {
          'If-None-Match': localStorage.getItem(`etag-${endpoint}`) || ''
        }
      });

      // Store ETag if provided
      const etag = response.headers['etag'];
      if (etag) {
        localStorage.setItem(`etag-${endpoint}`, etag);
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        const rateLimitError = error.response.data as RateLimitError;
        rateLimitHandler.handleRateLimit(rateLimitError, endpoint);
        throw rateLimitError;
      }
      logger.error('Error fetching wallet data', { error, endpoint, address });
      throw error;
    }
  },

  async updateWallet(address: string, data: Partial<WalletData>): Promise<WalletData> {
    if (!address) {
      throw new Error('Wallet address is required');
    }
    
    const endpoint = API_CONFIG.endpoints.wallet.update(address);
    try {
      const response = await api.put<ApiResponse<WalletData>>(endpoint, data);
      return response.data.data;
    } catch (error) {
      logger.error('Error updating wallet data', { error, endpoint, address });
      throw error;
    }
  }
};
