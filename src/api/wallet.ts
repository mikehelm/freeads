import { logger } from '../utils/logger';

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

interface WalletDataResponse {
  data: WalletData;
}

// In development, we use the relative path since it's proxied by Vite
const API_BASE_URL = '/.netlify/functions';

export const fetchWalletData = async (address: string): Promise<WalletData> => {
  try {
    logger.log('info', 'Fetching wallet data', { address });
    const response = await fetch(`${API_BASE_URL}/wallet-data/${address}`);
    
    if (!response.ok) {
      const error = await response.text();
      logger.log('error', 'Failed to fetch wallet data', { 
        status: response.status, 
        statusText: response.statusText,
        error 
      });
      throw new Error(error || `Failed to fetch wallet data: ${response.status} ${response.statusText}`);
    }

    const data: WalletDataResponse = await response.json();
    logger.log('success', 'Wallet data fetched successfully', data);
    return data.data;
  } catch (error) {
    logger.log('error', 'Error fetching wallet data', error);
    throw error;
  }
};

export const submitEmail = async (email: string, address: string): Promise<void> => {
  try {
    logger.log('info', 'Submitting email', { email, address });
    const response = await fetch(`${API_BASE_URL}/email-submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, address }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.log('error', 'Failed to submit email', { 
        status: response.status, 
        statusText: response.statusText,
        error 
      });
      throw new Error(error || `Failed to submit email: ${response.status} ${response.statusText}`);
    }

    logger.log('success', 'Email submitted successfully');
  } catch (error) {
    logger.log('error', 'Error submitting email', error);
    throw error;
  }
};
