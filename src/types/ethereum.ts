export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  selectedAddress: string | null;
}

export interface WalletError extends Error {
  code?: number;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}