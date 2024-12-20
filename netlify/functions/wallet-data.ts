import { Handler } from '@netlify/functions';

interface WalletData {
  id: string;
  address: string;
  nodes: number;
  email: string;
  level: number;
  flipit?: {
    nodes: number;
    email: string;
  };
}

const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const address = event.path.split('/').pop();
    
    if (!address) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Wallet address is required' }),
      };
    }

    // Mock data for testing - replace with actual API call
    const mockData: WalletData = {
      id: '1',
      address: address.toLowerCase(),
      nodes: 1,
      email: '',
      level: 1,
      flipit: {
        nodes: 13,
        email: ''
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        code: 200,
        status: 1,
        data: mockData
      }),
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch wallet data' }),
    };
  }
};

export { handler };
