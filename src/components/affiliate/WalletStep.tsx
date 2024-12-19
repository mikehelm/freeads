import React from 'react';
import { Loader2, Wallet } from 'lucide-react';
import { Button } from '../Button';
import { WalletDisplay } from '../WalletDisplay';
import { useWallet } from '../../hooks/useWallet';

interface WalletStepProps {
  address: string;
}

export function WalletStep({ address }: WalletStepProps) {
  const { connectWallet, isConnecting } = useWallet();

  const handleConnect = async () => {
    console.log('Initiating MetaMask connection...');
    await connectWallet();
  };

  if (!address) {
    return (
      <div className="w-full">
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/5 border-2 border-white/10 rounded-lg px-6 py-4">
        <WalletDisplay />
      </div>
    </div>
  );
}
