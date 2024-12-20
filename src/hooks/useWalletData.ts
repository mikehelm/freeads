import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { config } from '../config';

interface WalletData {
  id: string;
  address: string;
  nodes: number;
  email: string;
  level: number;
  flipit?: {
    nodes: number;
    email: string;
  };
  parent?: {
    address: string;
    nodes: number;
    email: string;
    flipit?: {
      nodes: number;
      email: string;
    };
  };
  children: Array<{
    address: string;
    nodes: number;
    email: string | null;
    flipit?: {
      nodes: number;
      email: string;
    } | null;
  }>;
}

interface UseWalletDataResult {
  data: WalletData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
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
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch wallet data');
      }

      if (!result.data) {
        throw new Error('No data received from API');
      }

      // Validate required fields
      const requiredFields = ['id', 'address', 'nodes', 'email', 'level'];
      for (const field of requiredFields) {
        if (!(field in result.data)) {
          throw new Error(`Missing required field: ${field}`);
        }
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

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
