import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { useWalletData } from '../hooks/useWalletData';
import { Button } from './Button';
import { truncateAddress } from '../utils/address';

interface WalletDisplayProps {
}

export function WalletDisplay({ }: WalletDisplayProps) {
  const { address, isConnected, isConnecting, isInitialized, connect, disconnect } = useWallet();
  const { data: walletData, error: walletError } = useWalletData(address);

  // Don't render anything until we've checked the initial connection state
  if (!isInitialized) {
    return null;
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">
          {walletData?.nodes || 0} nodes
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
        >
          {truncateAddress(address)}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={connect}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}