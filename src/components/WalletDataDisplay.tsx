import React from 'react';
import { useWalletData } from '../hooks/useWalletData';
import { Loader } from 'lucide-react';
import { WalletData } from '../services/api/types';

interface WalletDataDisplayProps {
  address: string | null;
}

export function WalletDataDisplay({ address }: WalletDataDisplayProps) {
  const { data, loading, error } = useWalletData(address);

  if (!address) {
    return null;
  }

  if (loading) {
    return <div className="flex items-center justify-center p-4"><Loader className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error.message}</div>;
  }

  if (!data) {
    return <div className="text-gray-500 p-4">No wallet data found</div>;
  }

  return (
    <div className="space-y-2 p-4">
      <h3 className="text-lg font-semibold">Wallet Details</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-gray-500">Name:</span>
        <span>{data.firstName} {data.lastName}</span>
        <span className="text-gray-500">Email:</span>
        <span>{data.email}</span>
        <span className="text-gray-500">Nickname:</span>
        <span>{data.nickName}</span>
        <span className="text-gray-500">Country:</span>
        <span>{data.country}</span>
        <span className="text-gray-500">Nodes:</span>
        <span>{data.nodes}</span>
        <span className="text-gray-500">FlipIt Nodes:</span>
        <span>{data.flipit.nodes}</span>
        <span className="text-gray-500">FlipIt Email:</span>
        <span>{data.flipit.email}</span>
      </div>
    </div>
  );
}
