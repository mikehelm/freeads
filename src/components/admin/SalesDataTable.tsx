import React, { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';
import { Button } from '../Button';
import { WalletAddress } from '../WalletAddress';
import Papa from 'papaparse';
import { Search, ArrowLeft, Save } from 'lucide-react';
import { Input } from '../Input';
import { config } from '../../config';

interface NodeData {
  nick_name: string;
  wallet: string;
  purchased: string;
  first_name: string;
  last_name: string;
  email: string;
  affiliate: string;
  sold: string;
  date: string;
}

interface Props {
  data: NodeData[];
  initialSearchTerm?: string;
}

export function SalesDataTable({ data, initialSearchTerm = '' }: Props) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [previousWallet, setPreviousWallet] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<NodeData | null>(null);
  const [affiliateNodes, setAffiliateNodes] = useState<NodeData[]>([]);
  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [userDetails, setUserDetails] = useState<Record<string, NodeData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof NodeData;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    nick_name: ''
  });

  // Track which fields have been modified
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

  const [apiResponse, setApiResponse] = useState<any>(null);
  const [nodeStats, setNodeStats] = useState<{ owned: number; sold: number }>({ owned: 0, sold: 0 });

  useEffect(() => {
    fetchAllData().then(() => {
      if (initialSearchTerm) {
        setSearchTerm(initialSearchTerm);
        handleSearch(initialSearchTerm);
      }
    });
  }, []);

  useEffect(() => {
    if (initialSearchTerm && allNodes.length > 0) {
      setSearchTerm(initialSearchTerm);
      handleSearch(initialSearchTerm);
    }
  }, [initialSearchTerm, allNodes]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Temporary placeholder for API data
      setAllNodes([]);
      setUserDetails({});
      logger.log('info', 'Data fetch prepared for API integration');
    } catch (error) {
      logger.log('error', 'Failed to fetch data', error);
      setAllNodes([]);
      setUserDetails({});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWalletData = async (wallet: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/wallet/${wallet}/data`);
      const result = await response.json();
      
      if (result.code === 200) {
        setApiResponse(result.data);
        
        // Calculate owned and sold nodes
        const owned = result.data.flipit?.nodes || 0;
        const sold = result.data.children?.reduce((total: number, child: any) => {
          return total + (child.flipit?.nodes || 0);
        }, 0) || 0;
        
        setNodeStats({ owned, sold });
      }
    } catch (error) {
      logger.error('Failed to fetch wallet data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (searchTerm) {
      fetchWalletData(searchTerm);
    }
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    logger.log('info', 'Search term updated', { term: event.target.value });
  };

  const handleSearchClick = () => {
    handleSearch(searchTerm);
  };

  const handleSearch = async (term: string) => {
    if (!term) {
      setWalletData(null);
      setAffiliateNodes([]);
      return;
    }

    const searchTermLower = term.toLowerCase();
    setSearchHistory(prev => [...prev, term]);

    // Find matching wallet data
    const matchingWallet = allNodes.find(node => 
      node.wallet?.toLowerCase() === searchTermLower
    );

    if (matchingWallet) {
      setWalletData(matchingWallet);
      setPreviousWallet(matchingWallet.wallet);

      // Find affiliate nodes
      const affiliateMatches = allNodes.filter(node =>
        node.affiliate?.toLowerCase() === searchTermLower
      );
      setAffiliateNodes(affiliateMatches);

      // Set form data
      setFormData({
        first_name: matchingWallet.first_name || '',
        last_name: matchingWallet.last_name || '',
        email: matchingWallet.email || '',
        nick_name: matchingWallet.nick_name || ''
      });
    } else {
      setWalletData(null);
      setAffiliateNodes([]);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        nick_name: ''
      });
    }
  };

  const handleAffiliateClick = (wallet: string) => {
    setSearchHistory(prev => [...prev, searchTerm]);
    setSearchTerm(wallet);
    handleSearch(wallet);
  };

  const handleBack = () => {
    if (searchHistory.length > 0) {
      const newHistory = [...searchHistory];
      const previousWallet = newHistory.pop();
      setSearchHistory(newHistory);
      if (previousWallet) {
        setSearchTerm(previousWallet);
        handleSearch(previousWallet);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setModifiedFields(prev => new Set(prev).add(field));
  };

  const handleSave = async () => {
    if (modifiedFields.size === 0) return;
    
    setIsSaving(true);
    try {
      // Send all fields to admin endpoint
      const updates = {
        wallet: searchTerm.toLowerCase(),
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        nick_name: formData.nick_name
      };

      console.log('Sending admin updates:', updates);

      const response = await fetch(`${config.apiBaseUrl}/api/admin/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Admin update failed:', error);
        throw new Error(error.error || 'Failed to save');
      }
      
      // Clear modified fields after successful save
      setModifiedFields(new Set());
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // When search results come in, populate form
  useEffect(() => {
    if (walletData) {
      setFormData({
        first_name: walletData.first_name || '',
        last_name: walletData.last_name || '',
        email: walletData.email || '',
        nick_name: walletData.nick_name || ''
      });
      // Reset modified fields when loading new data
      setModifiedFields(new Set());
    }
  }, [walletData]);

  return (
    <div className="space-y-8">
      <div className="bg-background/30 rounded-lg p-6 backdrop-blur-lg border border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by wallet address..."
              className="w-full"
            />
          </div>
          <Button
            onClick={() => handleSearch()}
            variant="primary"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </Button>
          {previousWallet && (
            <Button
              onClick={() => handleBack()}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>

        {/* Node Stats Display */}
        {nodeStats.owned > 0 || nodeStats.sold > 0 ? (
          <div className="bg-background-dark rounded-lg shadow p-4 mb-4">
            <h2 className="text-xl font-bold mb-2 text-text-primary">Wallet Node Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <div className="text-lg font-semibold text-text-primary">Owned Nodes</div>
                <div className="text-3xl font-bold text-text-primary">{nodeStats.owned}</div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-lg font-semibold text-text-primary">Sold Nodes</div>
                <div className="text-3xl font-bold text-text-primary">{nodeStats.sold}</div>
              </div>
            </div>
          </div>
        ) : null}

        {/* API Response Display */}
        {apiResponse && (
          <div className="bg-background-dark rounded-lg shadow p-4 mb-4">
            <h2 className="text-xl font-bold mb-2 text-text-primary">Raw API Response</h2>
            <pre className="bg-background p-4 rounded-lg overflow-auto max-h-96 text-text-primary">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        {walletData && (
          <div className="mt-6 space-y-6">
            {searchHistory.length > 0 && (
              <Button
                onClick={handleBack}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Previous Wallet
              </Button>
            )}
            <div className="bg-background/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Wallet Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-muted">Wallet Address:</p>
                  <p className="font-mono">{walletData.wallet}</p>
                </div>
                <div>
                  <p className="text-text-muted">Email:</p>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <p className="text-text-muted">First Name:</p>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <p className="text-text-muted">Last Name:</p>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <p className="text-text-muted">Nickname:</p>
                  <Input
                    value={formData.nick_name}
                    onChange={(e) => handleInputChange('nick_name', e.target.value)}
                    placeholder="Enter nickname"
                  />
                </div>
                <div>
                  <p className="text-text-muted">Nodes:</p>
                  <p>{walletData.purchased || '0'} purchased, {walletData.sold || '0'} sold</p>
                </div>
              </div>
              
              {modifiedFields.size > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleSave}
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {affiliateNodes.length > 0 && (
              <div className="bg-background/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Affiliate Sales</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-background/30 border-b border-white/10">
                        <th className="text-left p-2">Buyer Wallet</th>
                        <th className="text-left p-2">Nodes Purchased</th>
                      </tr>
                    </thead>
                    <tbody>
                      {affiliateNodes.map((node, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-background/30">
                          <td className="p-2">
                            <button
                              onClick={() => handleAffiliateClick(node.wallet)}
                              className="text-accent-orange hover:text-accent-orange/80 transition-colors font-mono text-sm"
                            >
                              {node.wallet}
                            </button>
                          </td>
                          <td className="p-2">{node.purchased}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}