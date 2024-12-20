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

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions'
  : 'https://getfreeads.netlify.app/.netlify/functions';

export const fetchWalletData = async (address: string): Promise<WalletData> => {
  try {
    logger.log('info', 'Fetching wallet data', { address });
    const response = await fetch(`${API_BASE_URL}/wallet-data/${address}`);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch wallet data');
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
      throw new Error(error || 'Failed to submit email');
    }

    logger.log('success', 'Email submitted successfully');
  } catch (error) {
    logger.log('error', 'Error submitting email', error);
    throw error;
  }
};
