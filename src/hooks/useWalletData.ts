import { useState, useEffect } from 'react';
import { ApiResponse, WalletData, ApiError } from '../services/api/types';
import { walletService } from '../services/api/wallet';

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
    
    walletService.getWallet(address)
      .then((response) => {
        if (response.error) {
          setState({
            data: null,
            error: response.error,
            isLoading: false
          });
          return;
        }
        
        setState({
          data: response.data || null,
          error: null,
          isLoading: false
        });
      })
      .catch((error: ApiError) => {
        setState({
          data: null,
          error,
          isLoading: false
        });
      });
  }, [address]);

  return {
    data: state.data,
    error: state.error,
    loading: state.isLoading
  };
};
