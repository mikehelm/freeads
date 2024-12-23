export type ApiErrorType = 
  | 'NOT_FOUND'
  | 'INVALID_ADDRESS'
  | 'CSV_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface WalletData {
  address: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  nickName?: string;
  country?: string;
  nodes: number;
  flipit: {
    nodes: number;
    email: string;
  };
}

export const REQUIRED_CSV_COLUMNS = [
  'address',
  'firstName',
  'lastName',
  'email',
  'nickName',
  'country',
  'nodes'
] as const;
