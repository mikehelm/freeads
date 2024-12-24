export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  endpoints: {
    wallet: {
      get: (address: string) => `/api/wallet/${address}`,
      create: '/api/wallet',
      update: (address: string) => `/api/wallet/${address}`,
      delete: (address: string) => `/api/wallet/${address}`,
    },
    health: '/api/health',
    docs: '/api-docs'
  },
  headers: {
    common: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  rateLimits: {
    perMinute: 100,
    perHour: 1000
  }
};
