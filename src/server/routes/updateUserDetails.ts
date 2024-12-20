import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { logger } from '../../utils/logger';

interface UserUpdate {
  wallet: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
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

router.post('/api/user-details', async (req, res) => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'users', 'user_details.csv');

  try {
    console.log('Received request body:', req.body);
    const { wallet, email, firstName, lastName, country } = req.body;
    
    if (!wallet) {
      console.log('Missing wallet address');
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      console.log('Creating directory:', dirPath);
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create file with headers if it doesn't exist
    if (!fs.existsSync(filePath)) {
      console.log('Creating new CSV file with headers');
      fs.writeFileSync(filePath, 'wallet,first_name,last_name,email,country\n', 'utf-8');
    }

    const users = await readCSV(filePath);
    console.log('Current users:', users);
    
    const userIndex = users.findIndex((user: any) => 
      user.wallet?.toLowerCase() === wallet.toLowerCase()
    );
    console.log('Found user at index:', userIndex);
    
    if (userIndex === -1) {
      // Add new user
      const newUser = {
        wallet,
        first_name: firstName || '',
        last_name: lastName || '',
        email: email || '',
        country: country || ''
      };
      console.log('Adding new user:', newUser);
      users.push(newUser);
    } else {
      // Update existing user
      if (email !== undefined) users[userIndex].email = email;
      if (firstName !== undefined) users[userIndex].first_name = firstName;
      if (lastName !== undefined) users[userIndex].last_name = lastName;
      if (country !== undefined) users[userIndex].country = country;
      console.log('Updated user:', users[userIndex]);
    }

    await writeCSV(filePath, users);
    console.log('Successfully wrote to CSV');
    return res.json({ success: true });
  } catch (error) {
    console.error('Error updating user details:', error);
    logger.log('error', 'Failed to update user details', error);
    return res.status(500).json({ error: 'Failed to update user details' });
  }
});

export default router;
