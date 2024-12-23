import { useState, useEffect } from 'react';
import { ApiResponse, WalletData, ApiError } from '../types/api';
import { fetchWalletData } from '../api/wallet';

// In development, we use the proxy set up in vite.config.ts
const API_BASE_URL = '/.netlify/functions/api';

interface WalletDataState {
  data: WalletData | null;
  error: ApiError | null;
  isLoading: boolean;
}

export const useWalletData = (address: string | null) => {
  const [state, setState] = useState<WalletDataState>({
    data: null,
    error: null,
    isLoading: false
  });

  useEffect(() => {
    if (!address) {
      setState({
        data: null,
        error: null,
        isLoading: false
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    fetchWalletData(address)
      .then(data => {
        setState({
          data,
          error: null,
          isLoading: false
        });
      })
      .catch(error => {
        setState({
          data: null,
          error: {
            type: 'API_ERROR',
            message: error.message || 'Failed to fetch wallet data'
          },
          isLoading: false
        });
      });
  }, [address]);

  return state;
};
