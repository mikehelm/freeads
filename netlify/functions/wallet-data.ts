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

const WALLET_DATA = {
  // Add your wallet addresses and their corresponding node counts here
  '0xbf885d3e646168c35df2aa9f516d3e9480b57eb4': { owned: 1, sold: 13 },
  '0x14a0469902aec7e5d80013f545976714377f2929': { owned: 1, sold: 13 },
  // Add more wallets as needed
};

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
    const address = event.path.split('/').pop()?.toLowerCase();
    
    if (!address) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Wallet address is required' }),
      };
    }

    // Get wallet data from our mapping
    const walletInfo = WALLET_DATA[address] || { owned: 0, sold: 0 };

    // Get user details from KV store
    const store = getStore('user-details');
    const userDetailsStr = await store.get(address);
    const userDetails = userDetailsStr ? JSON.parse(userDetailsStr as string) : {};

    const responseData: WalletData = {
      id: address,
      address: address,
      nodes: walletInfo.owned,
      email: userDetails.email || '',
      level: 1,
      flipit: {
        nodes: walletInfo.sold,
        email: userDetails.email || ''
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        code: 200,
        status: 1,
        data: responseData
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
