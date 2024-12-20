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

const ALLOWED_ORIGINS = [
  'https://getfreeads.netlify.app',
  'http://localhost:4001',
  'http://localhost:8888'
];

const handler: Handler = async (event) => {
  const origin = event.headers.origin || '';
  
  // Enable CORS for specific origins
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
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
    const address = event.path.split('/').pop()?.toLowerCase();
    
    if (!address) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Wallet address is required' }),
      };
    }

    if (!/^0x[a-f0-9]{40}$/i.test(address)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid wallet address format' }),
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
