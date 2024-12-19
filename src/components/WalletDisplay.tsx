import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { formatAddress } from '../utils/wallet';
import { Loader2 } from 'lucide-react';

interface WalletDisplayProps {
  className?: string;
}

export function WalletDisplay({ className = '' }: WalletDisplayProps) {
  const { address, disconnectWallet } = useWallet();
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  if (!address) return null;

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectWallet();
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <button
      onClick={handleDisconnect}
      disabled={isDisconnecting}
      className={`flex items-center gap-2 transition-colors hover:bg-white/5 ${className}`}
    >
      <div className="h-2 w-2 rounded-full bg-green-400" />
      {isDisconnecting ? (
        <span className="text-sm text-white/60 flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          Disconnecting...
        </span>
      ) : (
        <span className="text-sm text-white/60">Connected: {formatAddress(address)}</span>
      )}
    </button>
  );
}