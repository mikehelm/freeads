import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

// CSP for development - allows HMR and other dev tools
const devCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:* http://127.0.0.1:*",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' http://localhost:* ws://localhost:* ws://127.0.0.1:* http://127.0.0.1:*",
  "img-src 'self' data: blob: https:",
  "frame-src 'self'"
].join('; ');

// CSP for production - more restrictive
const prodCSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",
  "img-src 'self' data: https:",
  "frame-src 'self'"
].join('; ');

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    open: false,
    host: 'localhost',
    cors: false,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    },
    headers: {
      'Content-Security-Policy': isDev ? devCSP : prodCSP
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});