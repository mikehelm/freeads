export const API_CONFIG = {
  baseURL: process.env.VITE_API_URL || 'http://localhost:4000',
  endpoints: {
    wallet: {
      get: (address: string) => `/api/wallet/${address}`,
      create: '/api/wallet',
      update: (address: string) => `/api/wallet/${address}`,
      delete: (address: string) => `/api/wallet/${address}`,
    },
    health: '/api/health'
  }
};
