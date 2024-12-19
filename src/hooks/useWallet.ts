import { useState, useEffect, useCallback } from 'react';
import { connectWallet as connectWalletUtil, disconnectWallet as disconnectWalletUtil } from '../utils/wallet';
import { logger } from '../utils/logger';
import { toast } from '../utils/toast';

interface WalletState {
  address: string | null;
  error: string | null;
  isConnecting: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    error: null,
    isConnecting: false
  });

  const connectWallet = useCallback(async () => {
    // Check for window.ethereum before starting
    if (typeof window === 'undefined' || !window.ethereum) {
      const error = 'MetaMask not found. Please install MetaMask to connect your wallet.';
      logger.log('error', 'MetaMask Connection Failed', { error });
      setState(prev => ({
        ...prev,
        error,
        isConnecting: false
      }));
      
      toast({
        title: 'Connection Error',
        description: error,
        type: 'error'
      });
      return;
    }

    logger.log('info', 'Starting MetaMask Connection', {
      provider: window.ethereum,
      isMetaMask: window.ethereum.isMetaMask,
      chainId: await window.ethereum.request({ method: 'eth_chainId' })
    });

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const result = await connectWalletUtil();
      
      if (result.error) {
        logger.log('error', 'Wallet Connection Failed', { error: result.error });
        setState(prev => ({
          ...prev,
          error: result.error,
          isConnecting: false
        }));
        
        toast({
          title: 'Connection Error',
          description: result.error,
          type: 'error'
        });
        return;
      }

      logger.log('info', 'Wallet Connected Successfully', { 
        address: result.address,
        network: await window.ethereum.request({ method: 'eth_chainId' })
      });

      setState(prev => ({
        ...prev,
        address: result.address,
        isConnecting: false,
        error: null
      }));

      // Fetch initial balance
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [result.address, 'latest']
        });
        logger.log('info', 'Wallet Balance Retrieved', {
          address: result.address,
          balance: parseInt(balance, 16) / 1e18 + ' ETH'
        });
      } catch (error) {
        logger.log('warn', 'Failed to fetch balance', { error });
      }

      toast({
        title: 'Connected',
        description: 'Wallet connected successfully',
        type: 'success'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      logger.log('error', 'Wallet Connection Error', { error });
      setState(prev => ({
        ...prev,
        error: message,
        isConnecting: false
      }));
      
      toast({
        title: 'Connection Error',
        description: message,
        type: 'error'
      });
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      logger.log('info', 'Attempting to disconnect wallet', { 
        currentAddress: state.address 
      });

      const result = await disconnectWalletUtil();
      
      if (result.error) {
        logger.log('error', 'Wallet Disconnect Failed', { error: result.error });
        setState(prev => ({ ...prev, error: result.error }));
        toast({
          title: 'Disconnect Error',
          description: result.error,
          type: 'error'
        });
        return;
      }

      logger.log('info', 'Wallet Disconnected Successfully');
      setState({
        address: null,
        error: null,
        isConnecting: false
      });

      toast({
        title: 'Disconnected',
        description: 'Wallet disconnected successfully',
        type: 'success'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      logger.log('error', 'Wallet Disconnect Error', { error });
      setState(prev => ({ ...prev, error: message }));
      
      toast({
        title: 'Disconnect Error',
        description: message,
        type: 'error'
      });
    }
  }, [state.address]);

  // Handle account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      logger.log('info', 'Accounts Changed', { 
        accounts,
        previousAddress: state.address 
      });

      if (accounts.length === 0) {
        await disconnectWallet();
      } else {
        setState(prev => ({
          ...prev,
          address: accounts[0].toLowerCase(),
          error: null
        }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      logger.log('info', 'Network Changed', { 
        chainId,
        address: state.address 
      });
    };

    const handleConnect = (connectInfo: { chainId: string }) => {
      logger.log('info', 'Provider Connected', { 
        connectInfo,
        address: state.address 
      });
    };

    const handleDisconnect = (error: { code: number; message: string }) => {
      logger.log('warn', 'Provider Disconnected', { 
        error,
        address: state.address 
      });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('connect', handleConnect);
    window.ethereum.on('disconnect', handleDisconnect);

    // Check initial connection
    window.ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          logger.log('info', 'Found Existing Connection', { 
            address: accounts[0].toLowerCase() 
          });
          setState(prev => ({
            ...prev,
            address: accounts[0].toLowerCase(),
            error: null
          }));
        }
      })
      .catch(error => {
        logger.log('error', 'Failed to check initial connection', { error });
      });

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('connect', handleConnect);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, [disconnectWallet, state.address]);

  return {
    ...state,
    connectWallet,
    disconnectWallet
  };
}