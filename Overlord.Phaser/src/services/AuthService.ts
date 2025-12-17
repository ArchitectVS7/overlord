/**
 * AuthService - Supabase Authentication Wrapper
 *
 * Provides authentication functionality with automatic user profile creation.
 * Singleton pattern for consistent auth state across the application.
 */

import { User, AuthError } from '@supabase/supabase-js';
import { getSupabaseClient } from './SupabaseClient';

/**
 * Result of authentication operations
 */
export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

/**
 * Data required for user registration
 */
export interface SignUpData {
  email: string;
  password: string;
  username: string;
}

/**
 * AuthService singleton class
 * Handles all authentication operations with Supabase
 */
class AuthService {
  private static instance: AuthService | null = null;
  private currentUser: User | null = null;
  private initialized = false;

  /**
   * Callback fired when auth state changes
   */
  public onAuthStateChanged?: (user: User | null) => void;

  /**
   * Callback fired on sign out
   */
  public onSignOut?: () => void;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize the auth service and subscribe to auth changes
   * Should be called once at app startup
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const supabase = getSupabaseClient();

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    this.currentUser = session?.user ?? null;

    // Subscribe to auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      const previousUser = this.currentUser;
      this.currentUser = session?.user ?? null;

      if (event === 'SIGNED_OUT') {
        this.onSignOut?.();
      }

      if (previousUser?.id !== this.currentUser?.id) {
        this.onAuthStateChanged?.(this.currentUser);
      }
    });

    this.initialized = true;
  }

  /**
   * Register a new user account
   * @param data - Email, password, and username for registration
   * @returns AuthResult with success status and user or error
   */
  public async signUp(data: SignUpData): Promise<AuthResult> {
    const supabase = getSupabaseClient();

    try {
      // Validate username format
      const usernameError = this.validateUsername(data.username);
      if (usernameError) {
        return { success: false, error: usernameError };
      }

      // Check username availability
      const isAvailable = await this.isUsernameAvailable(data.username);
      if (!isAvailable) {
        return { success: false, error: 'Username is already taken' };
      }

      // Sign up with username in metadata (triggers DB function to create profile)
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      });

      if (error) {
        return { success: false, error: this.formatAuthError(error) };
      }

      if (!authData.user) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      this.currentUser = authData.user;
      return { success: true, user: authData.user };
    } catch (error) {
      console.error('SignUp error:', error);
      return { success: false, error: 'An unexpected error occurred during registration.' };
    }
  }

  /**
   * Sign in with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns AuthResult with success status and user or error
   */
  public async signIn(email: string, password: string): Promise<AuthResult> {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: this.formatAuthError(error) };
      }

      if (!data.user) {
        return { success: false, error: 'Sign in failed. Please try again.' };
      }

      this.currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('SignIn error:', error);
      return { success: false, error: 'An unexpected error occurred during sign in.' };
    }
  }

  /**
   * Sign out the current user
   * @returns AuthResult with success status
   */
  public async signOut(): Promise<AuthResult> {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: this.formatAuthError(error) };
      }

      this.currentUser = null;
      return { success: true };
    } catch (error) {
      console.error('SignOut error:', error);
      return { success: false, error: 'An unexpected error occurred during sign out.' };
    }
  }

  /**
   * Get the currently authenticated user
   * @returns The current User or null if not authenticated
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if a user is currently authenticated
   * @returns true if authenticated, false otherwise
   */
  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Get the current user's ID
   * @returns User ID string or null if not authenticated
   */
  public getUserId(): string | null {
    return this.currentUser?.id ?? null;
  }

  /**
   * Refresh the current session
   * Call this periodically to keep the session active
   */
  public async refreshSession(): Promise<void> {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn('Session refresh failed:', error.message);
      } else if (data.session) {
        this.currentUser = data.session.user;
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }

  /**
   * Check if a username is available
   * @param username - The username to check
   * @returns true if available, false if taken
   */
  public async isUsernameAvailable(username: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Username check error:', error);
        return false; // Assume taken on error for safety
      }

      return data === null;
    } catch (error) {
      console.error('Username availability check failed:', error);
      return false;
    }
  }

  /**
   * Validate username format
   * @param username - The username to validate
   * @returns Error message or null if valid
   */
  private validateUsername(username: string): string | null {
    if (!username || username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (username.length > 20) {
      return 'Username must be 20 characters or less';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return null;
  }

  /**
   * Format auth errors for user display
   * @param error - Supabase AuthError
   * @returns User-friendly error message
   */
  private formatAuthError(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password';
      case 'User already registered':
        return 'An account with this email already exists';
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters';
      case 'Unable to validate email address: invalid format':
        return 'Please enter a valid email address';
      default:
        return error.message || 'An authentication error occurred';
    }
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    AuthService.instance = null;
  }
}

/**
 * Get the AuthService singleton instance
 * Convenience function for cleaner imports
 */
export function getAuthService(): AuthService {
  return AuthService.getInstance();
}

export { AuthService };
