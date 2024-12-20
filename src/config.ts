// config.ts
const isDevelopment = import.meta.env.DEV;

export const config = {
  apiBaseUrl: isDevelopment ? 'http://localhost:8888/.netlify' : '/.netlify',
  isProduction: !isDevelopment,
};
