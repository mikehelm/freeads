import axios, { AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { WalletData, ApiResponse, ApiError } from './types';
import { rateLimitHandler } from './rateLimit';

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error: ApiError }>;
    if (axiosError.response?.data?.error) {
      throw axiosError.response.data.error;
    }
    throw {
      type: 'NETWORK_ERROR',
      message: error.message
    } as ApiError;
  }
  throw {
    type: 'NETWORK_ERROR',
    message: 'An unexpected error occurred'
  } as ApiError;
};

export const walletService = {
  async getWallet(address: string): Promise<ApiResponse<WalletData>> {
    try {
      if (!rateLimitHandler.canMakeRequest()) {
        throw {
          type: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Reset at ${rateLimitHandler.getResetTime()}`
        } as ApiError;
      }

      const response = await axios.get<ApiResponse<WalletData>>(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.wallet.get(address)}`
      );

      rateLimitHandler.updateFromHeaders(response.headers);
      return response.data;
    } catch (error) {
      return { error: handleApiError(error) };
    }
  },

  async updateWallet(address: string, data: Partial<WalletData>): Promise<ApiResponse<WalletData>> {
    try {
      if (!rateLimitHandler.canMakeRequest()) {
        throw {
          type: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Reset at ${rateLimitHandler.getResetTime()}`
        } as ApiError;
      }

      const response = await axios.patch<ApiResponse<WalletData>>(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.wallet.update(address)}`,
        data
      );

      rateLimitHandler.updateFromHeaders(response.headers);
      return response.data;
    } catch (error) {
      return { error: handleApiError(error) };
    }
  }
};
