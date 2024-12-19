import Papa from 'papaparse';
import { logger } from '../utils/logger';

export interface UserDetails {
  wallet: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  nick_name?: string;
}

class UserService {
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
      const data = await this.readCSV('user_details.csv');
      return data.find((row: UserDetails) => 
        row.wallet?.toLowerCase() === wallet?.toLowerCase()
      ) || null;
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
      
      const requestBody = JSON.stringify(details);
      logger.log('info', 'Request body', { requestBody });
      
      const response = await fetch('/api/update-user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      logger.log('info', 'Response status', { 
        status: response.status,
        ok: response.ok 
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.log('error', 'Server returned error', errorData);
        throw new Error(errorData.error || 'Failed to update user details');
      }

      const data = await response.json();
      logger.log('info', 'Server response', data);

      if (!data.success) {
        throw new Error('Failed to update user details');
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
