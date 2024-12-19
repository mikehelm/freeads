import { logger } from '../logger';

export interface StorageData {
  [key: string]: any;
}

class Storage {
  private data: StorageData = {};

  async get(key: string): Promise<any> {
    return this.data[key];
  }

  async set(key: string, value: any): Promise<void> {
    this.data[key] = value;
    logger.log('info', 'Storage updated', { key });
  }

  async remove(key: string): Promise<void> {
    delete this.data[key];
    logger.log('info', 'Storage item removed', { key });
  }

  async clear(): Promise<void> {
    this.data = {};
    logger.log('info', 'Storage cleared');
  }
}

export const storage = new Storage();