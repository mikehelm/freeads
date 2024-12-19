import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import updateUserDetailsRoute from './routes/updateUserDetails';
import adminUpdateUserRoute from './routes/adminUpdateUser';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createServer() {
  const app = express();
  const PORT = 4000;

  // Enable CORS and JSON parsing
  app.use(cors());
  app.use(express.json());

  // API routes
  app.use(updateUserDetailsRoute);  // Mount at root since route already includes /api prefix
  app.use('/api/admin/update-user', adminUpdateUserRoute);

  // Test route
  app.get('/api/test', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Proxy endpoint for the Oracle API
  app.get('/api/wallet/:address/data', async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ 
          error: 'Wallet address is required' 
        });
      }

      const PROJECT_ID = '0x1ec12215d0b9757c9d77124bb02c949a0377ac94';
      const API_BASE_URL = 'https://oracle-api.lfg.inc/api/v1';
      const apiUrl = `${API_BASE_URL}/projects/${PROJECT_ID}/wallets/${address}/connects`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.code !== 200 || data.status !== 1) {
        return res.status(400).json({
          error: 'Failed to fetch wallet data',
          details: data
        });
      }

      res.json(data);
    } catch (error) {
      logger.error('Error fetching wallet data:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Watch for file changes
  const userDetailsPath = path.join(process.cwd(), 'public', 'data', 'users', 'user_details.csv');
  fs.watch(userDetailsPath, (eventType, filename) => {
    logger.log('info', 'File change detected', { eventType, filename });
  });

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

// Start the server
if (isMainModule) {
  createServer().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
}
