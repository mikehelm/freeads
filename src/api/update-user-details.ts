import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { logger } from '../utils/logger';

export async function updateUserDetails(req: Request): Promise<Response> {
  try {
    const { wallet, email } = await req.json();
    
    if (!wallet || !email) {
      return new Response(
        JSON.stringify({ error: 'Wallet and email are required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'users', 'user_details.csv');
    
    // Read existing data
    let data = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      data = Papa.parse(fileContent, { header: true }).data;
    }

    // Find if user exists
    const index = data.findIndex((row: any) => row.wallet?.toLowerCase() === wallet?.toLowerCase());
    
    if (index >= 0) {
      // Update existing user
      data[index] = { ...data[index], email };
    } else {
      // Add new user
      data.push({ wallet, email });
    }

    // Write back to CSV
    const csv = Papa.unparse(data);
    fs.writeFileSync(filePath, csv, 'utf-8');
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.log('error', 'Failed to update user details file', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update user details' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
