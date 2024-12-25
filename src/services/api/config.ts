export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  endpoints: {
    wallet: {
      get: (address: string) => `/wallet/${address.toLowerCase()}`,
      create: '/wallet',
      update: (address: string) => `/wallet/${address.toLowerCase()}`,
      delete: (address: string) => `/wallet/${address.toLowerCase()}`,
    },
    health: '/health',
    docs: '/docs'
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
