/**
 * API Configuration
 */

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  endpoints: {
    wallet: {
      details: (address: string) => `/wallet/${address}`,
      update: '/wallet/update',
      transactions: (address: string) => `/wallet/${address}/transactions`,
    },
    user: {
      details: (address: string) => `/user/${address}`,
      update: '/user/update',
    },
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

export const API_TIMEOUTS = {
  default: 5000,    // 5 seconds
  long: 15000,      // 15 seconds
  short: 2000,      // 2 seconds
};

export const API_RETRY = {
  maxRetries: 3,
  baseDelay: 1000,  // 1 second
  maxDelay: 5000,   // 5 seconds
};
