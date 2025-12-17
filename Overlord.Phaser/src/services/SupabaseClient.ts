/**
 * Supabase Client Singleton
 *
 * Provides a single instance of the Supabase client for the entire application.
 * Environment variables are injected by Webpack's DefinePlugin.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Database schema types (will be expanded as we implement features)
 */
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          created_at: string;
          updated_at: string;
        };
      };
      saves: {
        Row: {
          id: string;
          user_id: string;
          save_name: string;
          save_data: string;
          created_at: string;
          updated_at: string;
        };
      };
      scenario_completions: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          completed_at: string;
          score: number;
        };
      };
    };
  };
}

/**
 * Supabase client instance
 */
let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Get or create the Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.'
    );
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'overlord-auth',
      storage: window.localStorage
    }
  });

  return supabaseInstance;
}

/**
 * Test the database connection
 * @returns Promise<{success: boolean, message: string, data?: any}>
 */
export async function testDatabaseConnection(): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> {
  try {
    const client = getSupabaseClient();

    // Simple health check - query the user_profiles table (should be empty initially)
    const { data, error } = await client
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (error) {
      return {
        success: false,
        message: `Database query failed: ${error.message}`,
        error: error
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase database!',
      data: data
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`,
      error: error
    };
  }
}

/**
 * Check if environment variables are configured
 */
export function checkEnvironmentVariables(): {
  configured: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  if (!process.env.SUPABASE_URL) {
    missing.push('SUPABASE_URL');
  }

  if (!process.env.SUPABASE_ANON_KEY) {
    missing.push('SUPABASE_ANON_KEY');
  }

  return {
    configured: missing.length === 0,
    missing: missing
  };
}
