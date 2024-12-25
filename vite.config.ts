import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import debugPlugin from './vite.debug-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    debugPlugin(),  // Add debug plugin first
    react()
  ],
  server: {
    port: 3000,
    headers: {
      // Remove empty CSP as it's now handled by debug plugin
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      },
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: { 
        'bigint': true 
      },
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: mode === 'development' 
          ? resolve(__dirname, 'index-dev.html')
          : resolve(__dirname, 'index.html')
      }
    }
  }
}));