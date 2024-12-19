import React from 'react';
import { useWalletData } from '../hooks/useWalletData';
import { Loader } from 'lucide-react';

interface WalletDataDisplayProps {
  address: string | null;
}

export function WalletDataDisplay({ address }: WalletDataDisplayProps) {
  const { data, loading, error } = useWalletData(address);

  if (!address || !data || loading || error) {
    return null;
  }

  return null;
}
