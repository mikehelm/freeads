import Papa from 'papaparse';
import { logger } from '../utils/logger';

export interface UserDetails {
  wallet: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  nick_name?: string;
  country?: string;
  nodes?: number;
  flipit?: {
    nodes: number;
    email: string;
  };
}

class UserService {
  private readonly API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:4000' 
    : 'https://api.getfreeads.co';

  private async readCSV(filePath: string): Promise<any[]> {
    try {
      const response = await fetch(`/data/users/${filePath}`);
      const csvText = await response.text();
      logger.log('info', 'CSV content received', { csvText });
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      logger.log('error', 'Failed to read CSV', error);
      throw error;
    }
  }

  async getUserDetails(wallet: string): Promise<UserDetails | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/wallet/${wallet}`);
      
      if (!response.ok) {
        const error = await response.json();
        logger.log('error', 'API error', error);
        return null;
      }

      const data = await response.json();
      return {
        wallet: data.address,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        nick_name: data.nickName,
        country: data.country,
        nodes: data.nodes,
        flipit: data.flipit
      };
    } catch (error) {
      logger.log('error', 'Failed to get user details', error);
      return null;
    }
  }

  async updateUserDetails(details: UserDetails): Promise<void> {
    try {
      logger.log('info', 'Starting updateUserDetails', { 
        wallet: details.wallet,
        email: details.email 
      });
      
      const response = await fetch(`${this.API_BASE_URL}/api/wallet/${details.wallet}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: details.first_name,
          lastName: details.last_name,
          email: details.email,
          nickName: details.nick_name,
          country: details.country
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user details');
      }
    } catch (error) {
      logger.log('error', 'Failed to update user details', error);
      throw error;
    }
  }

  async logChange(wallet: string, field: string, oldValue: any, newValue: any): Promise<void> {
    try {
      const data = await this.readCSV('changes_log.csv');
      const logEntry = {
        wallet,
        field,
        old_value: oldValue,
        new_value: newValue,
      };
      data.push(logEntry);
      const csvText = Papa.unparse(data);
      const response = await fetch(`/data/users/changes_log.csv`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: csvText,
      });
      if (!response.ok) {
        throw new Error('Failed to log change');
      }
    } catch (error) {
      logger.log('error', 'Failed to log change', error);
      throw error;
    }
  }
}

export const userService = new UserService();
