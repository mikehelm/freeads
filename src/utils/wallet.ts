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

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const address = accounts[0];
    
    // Log successful connection
    logger.log('info', 'Wallet Connected Successfully', {
      address,
      chainId: await window.ethereum.request({ method: 'eth_chainId' })
    });

    return { address, error: null };
  } catch (error) {
    logger.log('error', 'Wallet Connection Error', { error });
    return {
      address: null,
      error: getWalletError(error as WalletError)
    };
  }
};

export const disconnectWallet = async () => {
  // MetaMask doesn't actually have a disconnect method
  // We just clear our local state
  return { address: null, error: null };
};