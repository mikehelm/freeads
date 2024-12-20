export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  selectedAddress: string | null;
}

export interface WalletError {
  code?: number;
  message?: string;
  type?: string;
}

export interface WalletProvider {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: any[] }) => Promise<any>;
}

export interface Window {
  ethereum?: WalletProvider;
}

export interface WalletResponse {
  address: string | null;
  error: string | null;
}

export interface WalletData {
  id: string;
  address: string;
  nodes: number;
  email: string;
  level: number;
  flipit?: {
    nodes: number;
    email: string;
  };
}

export interface WalletDataResponse {
  data?: WalletData;
  error?: string;
}

declare global {
  interface Window {
    ethereum?: WalletProvider;
  }
}