import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { logger } from '../utils/logger';
import { Button } from '../components/Button';
import { SalesDataTable } from '../components/admin/SalesDataTable';
import { CopyButton } from '../components/CopyButton';
import { Link } from '../components/Link';
import { Home } from '../components/icons/Home';

export default function AdminPage() {
  const { address, connectWallet } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // When wallet connects, set it as the search term
    if (address) {
      setSearchTerm(address);
    }
  }, [address]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      logger.log('error', 'Failed to connect wallet', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">
            <Home className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        {!address ? (
          <Button onClick={handleConnect} variant="primary">
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-text-muted">Connected:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono">{address}</span>
              <CopyButton text={address} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <SalesDataTable data={[]} initialSearchTerm={searchTerm} />
      </div>
    </div>
  );
}