// config.ts
const isDevelopment = import.meta.env.DEV;

export const config = {
  apiBaseUrl: isDevelopment ? 'http://localhost:4000' : '', // Empty string means same domain
  isProduction: !isDevelopment,
};
