// This file is deprecated and will be removed.
// All database operations should now go through the external API.

import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

// Use environment variables or fallback to development values
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-development-key';

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
export const isSupabaseConfigured = false;