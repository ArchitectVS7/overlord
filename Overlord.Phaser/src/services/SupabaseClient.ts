/**
 * Supabase Client Singleton
 *
 * Provides a single instance of the Supabase client for the entire application.
 * Environment variables are injected by Webpack's DefinePlugin.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Database schema types for Supabase
 */
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          user_id: string;
          username: string;
          ui_scale: number;
          high_contrast_mode: boolean;
          audio_enabled: boolean;
          music_volume: number;
          sfx_volume: number;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          username: string;
          ui_scale?: number;
          high_contrast_mode?: boolean;
          audio_enabled?: boolean;
          music_volume?: number;
          sfx_volume?: number;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          username?: string;
          ui_scale?: number;
          high_contrast_mode?: boolean;
          audio_enabled?: boolean;
          music_volume?: number;
          sfx_volume?: number;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ui_panel_positions: {
        Row: {
          id: string;
          scene_name: string;
          panel_id: string;
          x: number;
          y: number;
          default_x: number | null;
          default_y: number | null;
          modified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scene_name: string;
          panel_id: string;
          x: number;
          y: number;
          default_x?: number | null;
          default_y?: number | null;
          modified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          scene_name?: string;
          panel_id?: string;
          x?: number;
          y?: number;
          default_x?: number | null;
          default_y?: number | null;
          modified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saves: {
        Row: {
          id: string;
          user_id: string;
          slot_name: string;
          save_name: string | null;
          campaign_name: string | null;
          data: Uint8Array;
          checksum: string | null;
          turn_number: number;
          playtime: number;
          version: string;
          victory_status: string;
          thumbnail: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          slot_name: string;
          save_name?: string | null;
          campaign_name?: string | null;
          data: Uint8Array;
          checksum?: string | null;
          turn_number: number;
          playtime: number;
          version: string;
          victory_status: string;
          thumbnail?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          slot_name?: string;
          save_name?: string | null;
          campaign_name?: string | null;
          data?: Uint8Array;
          checksum?: string | null;
          turn_number?: number;
          playtime?: number;
          version?: string;
          victory_status?: string;
          thumbnail?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      scenario_completions: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          scenario_pack_id: string | null;
          completed: boolean;
          attempts: number;
          best_time_seconds: number | null;
          last_completion_time_seconds: number | null;
          stars_earned: number;
          first_attempted_at: string;
          last_attempted_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id: string;
          scenario_pack_id?: string | null;
          completed?: boolean;
          attempts?: number;
          best_time_seconds?: number | null;
          last_completion_time_seconds?: number | null;
          stars_earned?: number;
          first_attempted_at?: string;
          last_attempted_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_id?: string;
          scenario_pack_id?: string | null;
          completed?: boolean;
          attempts?: number;
          best_time_seconds?: number | null;
          last_completion_time_seconds?: number | null;
          stars_earned?: number;
          first_attempted_at?: string;
          last_attempted_at?: string;
          completed_at?: string | null;
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
      'Missing Supabase environment variables. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.',
    );
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'overlord-auth',
      storage: window.localStorage,
    },
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
      .select('user_id')
      .limit(1);

    if (error) {
      return {
        success: false,
        message: `Database query failed: ${error.message}`,
        error: error,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase database!',
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`,
      error: error,
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
    missing: missing,
  };
}
