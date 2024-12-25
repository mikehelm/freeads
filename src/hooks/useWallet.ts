import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return Boolean(window.ethereum && window.ethereum.isMetaMask);
  };

  const checkConnection = async () => {
    if (!isMetaMaskInstalled()) {
      logger.error('MetaMask is not installed');
      setError('Please install MetaMask to connect your wallet');
      return;
    }

    try {
      // Request accounts without connecting
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts',
        params: [] 
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0].toLowerCase());
      } else {
        setAddress(null);
      }
    } catch (err) {
      logger.error('Error checking connection:', err);
      setAddress(null);
    }
    setIsInitialized(true);
  };

  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      setError('Please install MetaMask to connect your wallet');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: []
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0].toLowerCase());
      }
    } catch (err: any) {
      logger.error('Error connecting wallet:', err);
      if (err.code === 4001) {
        setError('Please connect to MetaMask.');
      } else {
        setError('Error connecting to MetaMask');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0].toLowerCase());
        } else {
          setAddress(null);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return {
    address,
    isConnecting,
    error,
    isInitialized,
    connect
  };
};