import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a mock client for development
const mockClient = {
  from: (table: string) => ({
    insert: async (data: any) => {
      logger.log('info', 'Mock Supabase: Insert operation', {
        table,
        rowCount: Array.isArray(data) ? data.length : 1
      });
      return { data: null, error: null };
    },
    select: async () => {
      logger.log('info', 'Mock Supabase: Select operation', { table });
      return { data: [], error: null };
    },
    upsert: async (data: any) => {
      logger.log('info', 'Mock Supabase: Upsert operation', {
        table,
        rowCount: Array.isArray(data) ? data.length : 1
      });
      return { data: null, error: null };
    }
  })
};

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    logger.log('warning', 'Supabase credentials not configured, using mock client');
    return mockClient;
  }

  if (!isValidUrl(supabaseUrl)) {
    logger.log('warning', 'Invalid Supabase URL, using mock client');
    return mockClient;
  }

  try {
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    logger.log('error', 'Failed to create Supabase client', error);
    return mockClient;
  }
}

export const supabase = createSupabaseClient();
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  isValidUrl(supabaseUrl)
);