import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0].toLowerCase());
        } else {
          setAddress(null);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
        setAddress(null);
      }
    }
    setIsInitialized(true);
  };

  useEffect(() => {
    checkConnection();
    
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0].toLowerCase());
        } else {
          setAddress(null);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        console.log('Account connected:', accounts[0]);
        setAddress(accounts[0].toLowerCase());
      } else {
        throw new Error('No accounts returned');
      }
    } catch (err) {
      console.error('Error connecting:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  return {
    address,
    isConnected: !!address,
    isConnecting,
    isInitialized,
    error,
    connect,
    disconnect
  };
};