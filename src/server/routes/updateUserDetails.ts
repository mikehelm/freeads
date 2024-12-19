import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { logger } from '../../utils/logger';

interface UserEmailUpdate {
  wallet: string;
  email: string;
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
    const { wallet, email } = req.body as UserEmailUpdate;
    
    if (!wallet || !email) {
      return res.status(400).json({ error: 'Wallet and email are required' });
    }

    // Log the email update
    logger.log('info', 'Updating user email:', { wallet, email });

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create file with headers if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'wallet,first_name,last_name,email\n', 'utf-8');
    }

    const users = await readCSV(filePath);
    const userIndex = users.findIndex((user: any) => 
      user.wallet?.toLowerCase() === wallet.toLowerCase()
    );
    
    if (userIndex === -1) {
      // Add new user with just email
      users.push({
        wallet,
        first_name: '',
        last_name: '',
        email
      });
    } else {
      // Update email only
      users[userIndex].email = email;
    }

    await writeCSV(filePath, users);
    return res.json({ success: true });
  } catch (error) {
    console.error('Error updating user email:', error);
    logger.log('error', 'Failed to update user email', error);
    return res.status(500).json({ error: 'Failed to update user email' });
  }
});

export default router;
