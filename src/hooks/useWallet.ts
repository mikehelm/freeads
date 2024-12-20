import { useState, useEffect, useCallback } from 'react';
import { connectWallet, disconnectWallet } from '../utils/wallet';
import { fetchWalletData } from '../api/wallet';
import { logger } from '../utils/logger';

interface UseWalletResult {
  address: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
}

export function useWallet(): UseWalletResult {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check for existing connection
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      logger.log('error', 'MetaMask not available');
      return;
    }

    // Log MetaMask details
    logger.log('info', 'MetaMask details', {
      version: window.ethereum.version,
      chainId: window.ethereum.chainId,
      isMetaMask: window.ethereum.isMetaMask,
      isConnected: window.ethereum.isConnected?.()
    });

    // Check if already connected
    window.ethereum.request({ method: 'eth_accounts' })
      .then(async accounts => {
        if (accounts && accounts.length > 0) {
          const addr = accounts[0].toLowerCase();
          setAddress(addr);
          logger.log('info', 'Found existing connection', { address: addr });
          
          // Fetch wallet data for existing connection
          try {
            await fetchWalletData(addr);
          } catch (err) {
            logger.log('error', 'Error fetching wallet data for existing connection', err);
          }
        }
      })
      .catch(err => {
        logger.log('error', 'Error checking existing connection', err);
      });

    // Listen for account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      logger.log('info', 'Accounts changed', { accounts });
      if (accounts.length === 0) {
        setAddress(null);
        setError('Wallet disconnected');
      } else {
        const addr = accounts[0].toLowerCase();
        setAddress(addr);
        setError(null);
        
        // Fetch wallet data when account changes
        try {
          await fetchWalletData(addr);
        } catch (err) {
          logger.log('error', 'Error fetching wallet data after account change', err);
        }
      }
    };

    // Listen for chain changes
    const handleChainChanged = (chainId: string) => {
      logger.log('info', 'Chain changed', { chainId });
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      logger.log('info', 'Attempting to connect wallet');
      const result = await connectWallet();

      if (result.error) {
        setError(result.error);
        logger.log('error', 'Connection error', { error: result.error });
      } else if (result.address) {
        setAddress(result.address);
        logger.log('success', 'Wallet connected', { address: result.address });
        
        // Fetch wallet data after successful connection
        try {
          await fetchWalletData(result.address);
        } catch (err) {
          logger.log('error', 'Error fetching wallet data after connection', err);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error connecting wallet';
      setError(errorMessage);
      logger.log('error', 'Unexpected error connecting wallet', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      logger.log('info', 'Attempting to disconnect wallet');
      await disconnectWallet();
      setAddress(null);
      setError(null);
      logger.log('success', 'Wallet disconnected');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error disconnecting wallet';
      setError(errorMessage);
      logger.log('error', 'Error disconnecting wallet', err);
    }
  }, []);

  return {
    address,
    error,
    connect,
    disconnect,
    isConnecting,
  };
}