import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface EmailSubmission {
  email: string;
  address: string;
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const submission: EmailSubmission = JSON.parse(event.body);

    if (!submission.email || !submission.address) {
      throw new Error('Email and wallet address are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submission.email)) {
      throw new Error('Invalid email format');
    }

    // Validate wallet address format
    if (!/^0x[a-f0-9]{40}$/i.test(submission.address)) {
      throw new Error('Invalid wallet address format');
    }

    // Store the submission
    const store = getStore('user-details', {
      siteID: '1ceab40b-f6e1-4dcc-ab15-21f2af2fd7e2',
      token: process.env.NETLIFY_ACCESS_TOKEN || ''
    });

    try {
      await store.set(submission.address.toLowerCase(), JSON.stringify({
        email: submission.email,
        timestamp: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Error writing to store:', err);
      throw new Error('Failed to save email. Please try again.');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Email submitted successfully',
        data: {
          email: submission.email,
          address: submission.address
        }
      }),
    };
  } catch (error) {
    console.error('Error processing email submission:', error);
    return {
      statusCode: error instanceof SyntaxError ? 400 : 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
    };
  }
};

export { handler };
