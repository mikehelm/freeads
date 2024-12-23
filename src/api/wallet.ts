import { WalletData } from '../types/wallet';
import { apiClient } from './client';

// Base URL for API requests
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:4001/.netlify/functions'
  : '/.netlify/functions';

export interface UpdateWalletRequest {
  address: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  country?: string;
}

export async function getWalletDetails(address: string): Promise<WalletData> {
  return apiClient<WalletData>(`/wallet/${address}`);
}

export async function updateWalletDetails(data: UpdateWalletRequest): Promise<WalletData> {
  return apiClient<WalletData>('/wallet/update', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getWalletTransactions(address: string): Promise<WalletData> {
  return apiClient<WalletData>(`/wallet/${address}/transactions`);
}

export async function submitEmail(email: string, address: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/email-submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, address }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || `Failed to submit email: ${response.status}`);
    }
  } catch (error) {
    console.error('Error submitting email:', error);
    throw error;
  }
};
