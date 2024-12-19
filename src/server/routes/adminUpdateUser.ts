import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { logger } from '../../utils/logger';

interface AdminUserUpdate {
  wallet: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  nick_name?: string;
}

async function readCSV(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const results = Papa.parse(content, { header: true, skipEmptyLines: true });
  return results.data;
}

async function writeCSV(filePath: string, data: any[]) {
  const csv = Papa.unparse(data);
  fs.writeFileSync(filePath, csv, 'utf-8');
}

const router = Router();

router.get('/api/admin/test', async (req, res) => {
  return res.json({ status: 'admin route working' });
});

router.put('/api/admin/update-user', async (req, res) => {
  console.log('Admin update request received:', req.body);
  
  const filePath = path.join(process.cwd(), 'public', 'data', 'users', 'user_details.csv');
  const changesLogPath = path.join(process.cwd(), 'public', 'data', 'users', 'changes_log.csv');

  try {
    const updates = req.body as AdminUserUpdate;
    
    if (!updates.wallet) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Log the incoming admin update
    logger.log('info', 'Admin updating user details:', updates);

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create file with headers if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'wallet,first_name,last_name,email,nick_name\n', 'utf-8');
    }

    const users = await readCSV(filePath);
    const userIndex = users.findIndex((user: any) => 
      user.wallet?.toLowerCase() === updates.wallet.toLowerCase()
    );
    
    // Prepare changes log entries
    const logEntries = [];
    const timestamp = new Date().toISOString();

    if (userIndex === -1) {
      // Add new user
      const newUser = {
        wallet: updates.wallet,
        first_name: updates.first_name || '',
        last_name: updates.last_name || '',
        email: updates.email || '',
        nick_name: updates.nick_name || ''
      };
      users.push(newUser);
      
      // Log the addition
      logEntries.push({
        timestamp,
        wallet: updates.wallet,
        action: 'add',
        changes: JSON.stringify(newUser)
      });
    } else {
      // Update existing user
      const user = users[userIndex];
      const changes: Record<string, any> = {};
      
      // Always update all fields that were sent
      ['first_name', 'last_name', 'email', 'nick_name'].forEach((field) => {
        const updateValue = updates[field as keyof AdminUserUpdate];
        if (updateValue !== undefined) {
          changes[field] = updateValue;
          user[field] = updateValue;
        }
      });
      
      // Log the update if there were changes
      if (Object.keys(changes).length > 0) {
        logEntries.push({
          timestamp,
          wallet: updates.wallet,
          action: 'update',
          changes: JSON.stringify(changes)
        });
      }
    }

    // Write user updates
    await writeCSV(filePath, users);
    
    // Append to changes log if there are entries
    if (logEntries.length > 0) {
      const logExists = fs.existsSync(changesLogPath);
      const logStream = fs.createWriteStream(changesLogPath, { flags: 'a' });
      
      if (!logExists) {
        logStream.write('timestamp,wallet,action,changes\n');
      }
      
      logEntries.forEach(entry => {
        logStream.write(`${entry.timestamp},${entry.wallet},${entry.action},${entry.changes}\n`);
      });
      
      logStream.end();
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Error in admin update:', error);
    logger.log('error', 'Failed to update user details', error);
    return res.status(500).json({ error: 'Failed to update user details' });
  }
});

export default router;
