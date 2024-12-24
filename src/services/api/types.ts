export interface ApiError {
  error: {
    type: string;
    message: string;
    details?: Record<string, any>;
  }
}

export interface RateLimitError extends ApiError {
  error: {
    type: 'RATE_LIMIT_EXCEEDED';
    message: string;
    details: {
      retryAfter: number;
      limit: number;
      remaining: number;
      resetAt: string;
    }
  }
}

export interface ApiResponse<T> {
  data: T;
}

export interface WalletData {
  address: string;
  email?: string;
  nodes: number;
}

// Validation patterns from backend
export const VALIDATION = {
  ADDRESS_PATTERN: /^0x[a-fA-F0-9]{40}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  validateAddress: (address: string) => VALIDATION.ADDRESS_PATTERN.test(address),
  validateEmail: (email: string) => VALIDATION.EMAIL_PATTERN.test(email),
  validateNodes: (nodes: number) => Number.isInteger(nodes) && nodes >= 0
};
