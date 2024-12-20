import { WalletError, WalletResponse } from '../types/ethereum';
import { logger } from './logger';

export const formatAddress = (address: string | null | undefined): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const normalizeAddress = (address: string | null | undefined): string => {
  if (!address) return '';
  return address.trim().toLowerCase();
};

export const getWalletError = (error: WalletError | null | undefined): string => {
  if (!error) return 'An unknown error occurred';

  // Check if error has a code
  if (typeof error.code === 'number') {
    // User rejected request
    if (error.code === 4001) {
      return 'Request was rejected by the user';
    }

    // Request already pending
    if (error.code === -32002) {
      return 'Request is already pending. Please check MetaMask';
    }

    // Chain/network not supported
    if (error.code === 4902) {
      return 'Network not supported. Please switch to a supported network';
    }
  }

  return error.message || 'An unknown error occurred';
};

export const connectWallet = async (): Promise<WalletResponse> => {
  try {
    // Early check for window and ethereum
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask to connect your wallet.');
    }

    // Type guard for ethereum provider
    if (!window.ethereum.request) {
      throw new Error('Invalid ethereum provider');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    // Validate response
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      throw new Error('No accounts found. Please make sure your MetaMask is unlocked');
    }

    // Get the first account
    const address = normalizeAddress(accounts[0]);
    logger.log('info', 'Wallet connected', { address });

    return {
      address,
      error: null
    };
  } catch (error) {
    console.error('MetaMask connection error:', error);
    const errorMessage = getWalletError(error as WalletError);
    logger.log('error', 'Error connecting wallet', error);
    
    return {
      address: null,
      error: errorMessage
    };
  }
};

export const disconnectWallet = async (): Promise<void> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum || !window.ethereum.request) {
      throw new Error('MetaMask not found');
    }

    // Clear permissions
    await window.ethereum.request({
      method: 'wallet_revokePermissions',
      params: [{ eth_accounts: {} }]
    });

    logger.log('info', 'Wallet disconnected');
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    logger.log('error', 'Error disconnecting wallet', error);
    throw error;
  }
};