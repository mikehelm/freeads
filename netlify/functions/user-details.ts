import { Handler } from '@netlify/functions';
import { getKVStore } from '@netlify/blobs';

interface UserDetails {
  wallet: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
}

const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const data = JSON.parse(event.body) as UserDetails;
    
    if (!data.wallet) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Wallet address is required' }),
      };
    }

    // Get the KV store
    const store = getKVStore('user-details');
    
    // Get existing user data
    const existingDataStr = await store.get(data.wallet.toLowerCase());
    const existingData = existingDataStr ? JSON.parse(existingDataStr as string) : {};
    
    // Merge new data with existing data
    const updatedData = {
      ...existingData,
      wallet: data.wallet.toLowerCase(),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.country !== undefined && { country: data.country }),
    };

    // Save the updated data
    await store.set(data.wallet.toLowerCase(), JSON.stringify(updatedData));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error updating user details:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update user details' }),
    };
  }
};

export { handler };
