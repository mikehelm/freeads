import { Handler } from '@netlify/functions';
import express, { Router } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { getDataPath } from './utils';

// Ensure data directory exists
const dataDir = getDataPath();
const usersDir = path.join(dataDir, 'users');
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

// Initialize user_details.csv if it doesn't exist
const userDetailsPath = path.join(usersDir, 'user_details.csv');
if (!fs.existsSync(userDetailsPath)) {
  fs.writeFileSync(userDetailsPath, 'wallet,first_name,last_name,email\n', 'utf-8');
}

const api = express();

// Enable CORS
api.use(cors());
api.use(express.json());

// Test route
api.get('/api/test', (req, res) => {
  res.json({ status: 'ok' });
});

// User details route
api.post('/api/user-details', async (req, res) => {
  try {
    const { wallet, email } = req.body;
    
    if (!wallet || !email) {
      return res.status(400).json({ error: 'Wallet and email are required' });
    }

    const content = fs.readFileSync(userDetailsPath, 'utf-8');
    const lines = content.split('\n');
    const headers = lines[0];
    const users = lines.slice(1).filter(line => line.trim());
    
    const userIndex = users.findIndex(line => {
      const [userWallet] = line.split(',');
      return userWallet.toLowerCase() === wallet.toLowerCase();
    });

    if (userIndex === -1) {
      // Add new user
      users.push(`${wallet},,,"${email}"`);
    } else {
      // Update existing user's email
      const userData = users[userIndex].split(',');
      userData[3] = `"${email}"`;
      users[userIndex] = userData.join(',');
    }

    // Write back to file
    fs.writeFileSync(userDetailsPath, [headers, ...users].join('\n') + '\n', 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
});

// Admin update route
api.post('/api/admin/update-user', async (req, res) => {
  try {
    const updates = req.body;
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: 'Invalid updates format' });
    }

    const content = fs.readFileSync(userDetailsPath, 'utf-8');
    const lines = content.split('\n');
    const headers = lines[0];
    const users = lines.slice(1).filter(line => line.trim());
    
    for (const update of updates) {
      const { wallet, firstName, lastName } = update;
      const userIndex = users.findIndex(line => {
        const [userWallet] = line.split(',');
        return userWallet.toLowerCase() === wallet.toLowerCase();
      });

      if (userIndex !== -1) {
        const userData = users[userIndex].split(',');
        if (firstName !== undefined) userData[1] = `"${firstName}"`;
        if (lastName !== undefined) userData[2] = `"${lastName}"`;
        users[userIndex] = userData.join(',');
      }
    }

    // Write back to file
    fs.writeFileSync(userDetailsPath, [headers, ...users].join('\n') + '\n', 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
});

// Wrap express app in serverless handler
const handler: Handler = serverless(api);
export { handler };
