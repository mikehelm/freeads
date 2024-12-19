import React, { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';
import { Button } from '../Button';
import { WalletAddress } from '../WalletAddress';
import Papa from 'papaparse';
import { Search } from 'lucide-react';

interface NodeData {
  nick_name: string;
  wallet: string;
  purchased: string;
  first_name: string;
  last_name: string;
  email: string;
  affiliate: string;
  sold: string;
}

interface Props {
  data: any[];
}

export function SalesDataTable({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [walletData, setWalletData] = useState<NodeData | null>(null);
  const [affiliateNodes, setAffiliateNodes] = useState<NodeData[]>([]);
  const [allNodes, setAllNodes] = useState<NodeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof NodeData;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    fetchAllNodes();
  }, []);

  const fetchAllNodes = async () => {
    try {
      const response = await fetch('/data/nodes/nodes.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          setAllNodes(results.data as NodeData[]);
        },
        error: (error) => {
          logger.log('error', 'Failed to parse CSV', error);
        }
      });
    } catch (error) {
      logger.log('error', 'Failed to fetch node data', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    logger.log('info', 'Search term updated', { term: event.target.value });
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setIsLoading(true);
    try {
      // Find the wallet data
      const walletInfo = allNodes.find(row => 
        row.wallet?.toLowerCase() === searchTerm?.toLowerCase()
      );
      
      if (walletInfo) {
        setWalletData(walletInfo);
        
        // Find all nodes that used this wallet as their affiliate
        const affiliates = allNodes.filter(row => 
          row.affiliate?.toLowerCase() === searchTerm?.toLowerCase() &&
          parseInt(row.purchased) > 0
        );
        
        setAffiliateNodes(affiliates);
      } else {
        setWalletData(null);
        setAffiliateNodes([]);
      }
    } catch (error) {
      logger.log('error', 'Failed to search', error);
      setWalletData(null);
      setAffiliateNodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: keyof NodeData) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedNodes = [...allNodes].sort((a, b) => {
      if (key === 'purchased' || key === 'sold') {
        return direction === 'asc' 
          ? parseInt(a[key] || '0') - parseInt(b[key] || '0')
          : parseInt(b[key] || '0') - parseInt(a[key] || '0');
      }
      
      return direction === 'asc'
        ? (a[key] || '').localeCompare(b[key] || '')
        : (b[key] || '').localeCompare(a[key] || '');
    });
    
    setAllNodes(sortedNodes);
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-background/30 rounded-lg p-6 backdrop-blur-lg border border-white/10">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by wallet address..."
              className="w-full pl-10 pr-4 py-3 bg-background/30 border border-accent-blue/20 rounded-lg focus:outline-none focus:border-accent-orange/50 transition-colors"
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            variant="primary"
            className="min-w-[100px]"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {walletData && (
        <div className="bg-background/30 rounded-lg p-6 backdrop-blur-lg border border-white/10 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Wallet Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-background/20 p-4 rounded-lg">
                <div>
                  <p className="text-text-muted text-sm">Wallet Address</p>
                  <WalletAddress address={walletData.wallet} className="text-sm mt-1" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">Nickname</p>
                  <p className="text-sm mt-1">{walletData.nick_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Affiliate</p>
                  {walletData.affiliate ? (
                    <WalletAddress address={walletData.affiliate} className="text-sm mt-1" />
                  ) : (
                    <p className="text-sm mt-1">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-text-muted text-sm">Full Name</p>
                  <p className="text-sm mt-1">
                    {[walletData.first_name, walletData.last_name].filter(Boolean).join(' ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Email</p>
                  <p className="text-sm mt-1">{walletData.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Nodes Purchased</p>
                  <p className="text-sm mt-1">{walletData.purchased || '0'}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Nodes Sold</p>
                  <p className="text-sm mt-1">{walletData.sold || '0'}</p>
                </div>
              </div>
            </div>

            {/* Affiliate Info */}
            {affiliateNodes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Affiliate Sales</h3>
                <div className="bg-background/20 p-4 rounded-lg">
                  <div className="space-y-3">
                    {affiliateNodes.map((node) => (
                      <div key={node.wallet} className="flex justify-between items-center p-2 hover:bg-background/20 rounded transition-colors">
                        <div className="flex-1">
                          <WalletAddress address={node.wallet} className="text-sm" />
                          <p className="text-text-muted text-sm mt-1">
                            {[node.first_name, node.last_name].filter(Boolean).join(' ') || node.nick_name || 'Anonymous'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{node.purchased} nodes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <p className="text-text-muted">Total Sales</p>
                      <p className="font-semibold">
                        {affiliateNodes.reduce((sum, node) => sum + (parseInt(node.purchased) || 0), 0)} nodes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spreadsheet View */}
      <div className="bg-background/30 rounded-lg backdrop-blur-lg border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background/40 border-b border-white/10">
                {Object.keys(allNodes[0] || {}).map((key) => (
                  <th 
                    key={key}
                    onClick={() => handleSort(key as keyof NodeData)}
                    className="px-4 py-3 text-left text-sm font-medium text-text-muted cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {key.replace(/_/g, ' ').toUpperCase()}
                      {sortConfig?.key === key && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allNodes.map((node, index) => (
                <tr 
                  key={node.wallet + index} 
                  className="border-b border-white/5 hover:bg-background/20 transition-colors"
                >
                  {Object.values(node).map((value, valueIndex) => (
                    <td 
                      key={valueIndex} 
                      className={`px-4 py-3 text-sm`}
                    >
                      {Object.keys(node)[valueIndex] === 'wallet' || Object.keys(node)[valueIndex] === 'affiliate' ? (
                        value ? <WalletAddress address={value} /> : '-'
                      ) : (
                        value || '-'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
