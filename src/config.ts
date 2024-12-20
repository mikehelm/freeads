// config.ts
const isDevelopment = import.meta.env.DEV;

export const config = {
  apiBaseUrl: isDevelopment ? '' : '/.netlify',
  isProduction: !isDevelopment,
};
