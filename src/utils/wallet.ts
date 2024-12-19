import { WalletError } from '../types/ethereum';
import { logger } from './logger';

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const normalizeAddress = (address: string): string => {
  return address?.trim().toLowerCase() || '';
};

export const getWalletError = (error: WalletError): string => {
  if (!error) return 'An unknown error occurred';

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

  return error.message || 'An unknown error occurred';
};

export const connectWallet = async () => {
  try {
    // Early check for MetaMask
    if (typeof window === 'undefined') {
      throw new Error('Window object not available');
    }

    if (!window.ethereum) {
      console.error('window.ethereum is not available');
      throw new Error('MetaMask not found. Please install MetaMask to connect your wallet.');
    }

    // Check if MetaMask is actually installed
    if (!window.ethereum.isMetaMask) {
      console.error('Not a MetaMask provider:', window.ethereum);
      throw new Error('Please install MetaMask to connect your wallet');
    }

    console.log('Requesting MetaMask accounts...');
    
    // Request account access - this triggers the MetaMask popup
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    console.log('MetaMask response:', accounts);

    // Validate response
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      console.error('No accounts returned from MetaMask');
      throw new Error('No accounts found. Please make sure your MetaMask is unlocked');
    }

    // Get the first account
    const address = accounts[0].toLowerCase();
    logger.log('info', 'Wallet connected', { address });
    console.log('Successfully connected to address:', address);

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

export const disconnectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    console.log('Attempting to disconnect wallet...');

    // Clear permissions
    await window.ethereum.request({
      method: 'wallet_revokePermissions',
      params: [{ eth_accounts: {} }]
    });

    // Clear the selected account
    await window.ethereum.request({
      method: 'eth_accounts'
    });

    console.log('Successfully disconnected wallet');
    logger.log('info', 'Wallet disconnected');
    return { error: null };
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    const errorMessage = getWalletError(error as WalletError);
    logger.log('error', 'Error disconnecting wallet', error);
    return { error: errorMessage };
  }
};