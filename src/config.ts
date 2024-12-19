// config.ts
const isDevelopment = import.meta.env.DEV;

export const config = {
  apiBaseUrl: isDevelopment ? 'http://localhost:4000' : 'https://api.yourdomain.com', // Update this with your production API domain
  isProduction: !isDevelopment,
};
