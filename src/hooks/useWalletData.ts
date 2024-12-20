import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { config } from '../config';
import { WalletData, WalletDataResponse } from '../types/ethereum';

interface UseWalletDataResult {
  data: WalletData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  ownedNodes: number;
  soldNodes: number;
}

export function useWalletData(address: string | null): UseWalletDataResult {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!address) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.apiBaseUrl}/functions/wallet-data/${address}`);
      const result = await response.json() as WalletDataResponse;

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch wallet data');
      }

      if (!result.data) {
        throw new Error('No data received from API');
      }

      // Type guard for required fields
      const requiredFields: Array<keyof WalletData> = ['id', 'address', 'nodes', 'email', 'level'];
      for (const field of requiredFields) {
        if (!(field in result.data)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Additional type checking for nested flipit data
      if (result.data.flipit && typeof result.data.flipit.nodes !== 'number') {
        throw new Error('Invalid flipit nodes data');
      }

      setData(result.data);
    } catch (err) {
      logger.log('error', 'Error fetching wallet data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [address]);

  // Safe access to node counts with type checking
  const ownedNodes = data?.nodes ?? 0;
  const soldNodes = data?.flipit?.nodes ?? 0;

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    ownedNodes,
    soldNodes
  };
}
