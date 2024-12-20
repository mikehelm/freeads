import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

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

// Hardcoded node data for specific addresses
const NODE_DATA: Record<string, { owned: number; sold: number }> = {
  '0xbf885d3e646168c35df2aa9f516d3e9480b57eb4': { owned: 1, sold: 13 },
  '0x14a0469902aec7e5d80013f545976714377f2929': { owned: 1, sold: 13 }
};

const handler: Handler = async (event) => {
  const origin = event.headers.origin || '';
  
  // Enable CORS for specific origins
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
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
    // Extract address from path parameters
    const pathParts = event.path.split('/');
    const address = pathParts[pathParts.length - 1]?.toLowerCase();
    
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

    // Get node data for the address, default to 0 if not found
    const nodeData = NODE_DATA[address] || { owned: 0, sold: 0 };

    // Get user details from KV store
    const store = getStore('user-details');
    const userDetailsStr = await store.get(address);
    const userDetails = userDetailsStr ? JSON.parse(userDetailsStr as string) : {};

    const responseData: WalletData = {
      id: address,
      address: address,
      nodes: nodeData.owned,
      email: userDetails.email || '',
      level: 1,
      flipit: {
        nodes: nodeData.sold,
        email: userDetails.email || ''
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: responseData
      }),
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch wallet data' 
      }),
    };
  }
};

export { handler };
