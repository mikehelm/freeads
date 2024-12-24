export type ApiErrorType = 
  | 'NOT_FOUND'
  | 'INVALID_ADDRESS'
  | 'DATABASE_ERROR'
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_ENTRY'
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMIT_EXCEEDED';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  details?: unknown;
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

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
