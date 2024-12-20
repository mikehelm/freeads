import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useWalletData } from '../hooks/useWalletData';
import { formatAddress } from '../utils/wallet';

interface DebugMessage {
  timestamp: string;
  type: 'info' | 'error' | 'success';
  message: string;
  data?: any;
}

export const DebugWindow: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const { address, error: walletError, connect } = useWallet();
  const { data: walletData, error: dataError } = useWalletData(address);

  const addMessage = (type: DebugMessage['type'], message: string, data?: any) => {
    setMessages(prev => [
      {
        timestamp: new Date().toISOString(),
        type,
        message,
        data
      },
      ...prev
    ]);
  };

  // Check MetaMask availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.ethereum) {
        if (window.ethereum.isMetaMask) {
          addMessage('info', 'MetaMask is installed and available');
        } else {
          addMessage('error', 'Found Ethereum provider but it is not MetaMask');
        }
      } else {
        addMessage('error', 'MetaMask is not installed');
      }
    }
  }, []);

  // Monitor wallet connection
  useEffect(() => {
    if (address) {
      addMessage('success', 'Wallet connected', { address });
    } else if (walletError) {
      addMessage('error', 'Wallet connection error', { error: walletError });
    }
  }, [address, walletError]);

  // Monitor wallet data
  useEffect(() => {
    if (walletData) {
      addMessage('success', 'Wallet data retrieved', {
        ownedNodes: walletData.nodes,
        soldNodes: walletData.flipit?.nodes,
        email: walletData.email
      });
    } else if (dataError) {
      addMessage('error', 'Error fetching wallet data', { error: dataError.message });
    }
  }, [walletData, dataError]);

  const copyToClipboard = () => {
    const text = messages
      .map(m => `[${m.timestamp}] ${m.type.toUpperCase()}: ${m.message}${m.data ? '\nData: ' + JSON.stringify(m.data, null, 2) : ''}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    addMessage('info', 'Debug log copied to clipboard');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 font-mono text-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Debug Window</h3>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Copy Log
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.type === 'error' ? 'bg-red-900/50' :
              msg.type === 'success' ? 'bg-green-900/50' :
              'bg-gray-800/50'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-gray-400">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
              <span className={
                msg.type === 'error' ? 'text-red-400' :
                msg.type === 'success' ? 'text-green-400' :
                'text-blue-400'
              }>
                {msg.type.toUpperCase()}:
              </span>
              <span>{msg.message}</span>
            </div>
            {msg.data && (
              <pre className="mt-1 ml-4 text-gray-400 text-xs">
                {JSON.stringify(msg.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
