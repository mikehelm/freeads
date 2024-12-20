import React from 'react';
import { Loader2, Wallet } from 'lucide-react';
import { Button } from '../Button';
import { WalletDisplay } from '../WalletDisplay';
import { useWallet } from '../../hooks/useWallet';

interface WalletStepProps {
  address: string;
}

export function WalletStep({ address }: WalletStepProps) {
  const { connect, isConnecting } = useWallet();

  const handleConnect = async () => {
    console.log('Initiating MetaMask connection...');
    await connect();
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
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <WalletDisplay address={address} />
    </div>
  );
}
