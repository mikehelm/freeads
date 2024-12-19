import React from 'react';
import { Coins } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

interface WalletSummaryProps {
  salesData: any[];
}

export function WalletSummary({ salesData }: WalletSummaryProps) {
  const { address } = useWallet();
  
  if (!address) return null;

  return (
    <div className="bg-background/50 p-6 rounded-lg mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Coins className="w-6 h-6 text-accent-orange" />
        <h3 className="text-lg font-semibold">Your Node Activity</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background-secondary/50 p-4 rounded-lg">
          <h4 className="text-sm text-text-muted mb-2">Node Count</h4>
          <p className="text-2xl font-bold">
            0 Nodes
          </p>
        </div>

        <div className="bg-background-secondary/50 p-4 rounded-lg">
          <h4 className="text-sm text-text-muted mb-2">Total Value</h4>
          <p className="text-2xl font-bold">
            $0
          </p>
          <p className="text-sm text-text-muted mt-2">
            Based on current price
          </p>
        </div>
      </div>
    </div>
  );
}