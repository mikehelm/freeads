import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Configure static file serving
app.use('/data', express.static(path.join(__dirname, 'public', 'data'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.csv')) {
      res.setHeader('Content-Type', 'text/csv');
    }
  }
}));

// Serve static files from the public directory
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

const CSV_FILE = path.join(__dirname, 'public', 'data', 'users', 'user_details.csv');
const CSV_DIR = path.dirname(CSV_FILE);

console.log('Current directory:', __dirname);
console.log('Public directory:', path.join(__dirname, 'public'));
console.log('CSV file path:', CSV_FILE);
console.log('CSV directory:', CSV_DIR);

// Ensure directory exists with proper permissions
if (!fs.existsSync(CSV_DIR)) {
  console.log('Creating directory:', CSV_DIR);
  fs.mkdirSync(CSV_DIR, { recursive: true });
}

// Ensure CSV file exists with headers
if (!fs.existsSync(CSV_FILE)) {
  console.log('Creating CSV file with headers');
  fs.writeFileSync(CSV_FILE, 'wallet,first_name,last_name,email,nick_name\n', 'utf-8');
}

// Test write permissions
try {
  fs.accessSync(CSV_FILE, fs.constants.W_OK);
  console.log('CSV file is writable');
  
  // Try a test write
  const testContent = fs.readFileSync(CSV_FILE, 'utf-8');
  fs.writeFileSync(CSV_FILE, testContent, 'utf-8');
  console.log('Successfully performed test write');
} catch (error) {
  console.error('CSV file is not writable:', error);
}

app.post('/api/update-user-details', async (req, res) => {
  console.log('Received update request:', req.body);
  
  try {
    const { wallet, email } = req.body;
    if (!wallet || !email) {
      console.log('Missing required fields:', { wallet, email });
      return res.status(400).json({ error: 'Wallet and email are required' });
    }

    // Normalize wallet address to lowercase
    const normalizedWallet = wallet.toLowerCase();
    
    // Read existing data
    const fileContent = fs.readFileSync(CSV_FILE, 'utf-8');
    const results = Papa.parse(fileContent, { header: true });
    const data = results.data;

    // Find if user exists
    const index = data.findIndex(row => 
      row.wallet?.toLowerCase() === normalizedWallet
    );
    
    if (index >= 0) {
      // Update existing user
      data[index] = { ...data[index], email };
    } else {
      // Add new user
      data.push({ wallet: normalizedWallet, email });
    }

    // Write back to CSV
    const csv = Papa.unparse(data);
    fs.writeFileSync(CSV_FILE, csv, 'utf-8');
    console.log('Successfully wrote user data for wallet:', normalizedWallet);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update user details:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
