import { logger } from './logger';
import * as Papa from 'papaparse';

interface StorageData {
  [key: string]: any[];
}

class Storage {
  private data: StorageData = {};

  async initialize(key: string, csvPath: string) {
    try {
      const response = await fetch(csvPath);
      const csvText = await response.text();
      
      const result = await new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          complete: resolve,
          error: reject,
          skipEmptyLines: true
        });
      });

      this.data[key] = (result as any).data;
      logger.log('info', `Storage initialized for ${key}`, {
        records: this.data[key].length
      });
    } catch (error) {
      logger.log('error', `Failed to initialize storage for ${key}`, error);
      throw error;
    }
  }

  async select(key: string) {
    try {
      if (!this.data[key]) {
        // Try to initialize with default data if available
        try {
          await this.initialize(key, `/src/data/${key}/initial-${key}.csv`);
        } catch (initError) {
          logger.log('warning', `No data found for ${key}`);
          return { data: [], error: null };
        }
      }
      return { data: this.data[key], error: null };
    } catch (error) {
      logger.log('error', `Error selecting data for ${key}`, error);
      return { data: null, error };
    }
  }

  async insert(key: string, records: any[]) {
    try {
      if (!this.data[key]) {
        this.data[key] = [];
      }
      this.data[key] = [...this.data[key], ...records];
      logger.log('info', `Inserted ${records.length} records to ${key}`);
      return { error: null };
    } catch (error) {
      logger.log('error', `Error inserting data to ${key}`, error);
      return { error };
    }
  }
}

export const storage = new Storage();
