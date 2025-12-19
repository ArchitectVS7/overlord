import Phaser from 'phaser';
import { checkEnvironmentVariables, testDatabaseConnection } from '@services/SupabaseClient';
import { getAuthService } from '@services/AuthService';
import { getAdminModeService } from '@services/AdminModeService';
import { getUIPanelPositionService } from '@services/UIPanelPositionService';
import { getUserProfileService } from '@services/UserProfileService';
import { getGuestModeService } from '@services/GuestModeService';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // Future: load assets (sprites, fonts, etc.)
  }

  public async create(): Promise<void> {
    console.log('='.repeat(80));
    console.log('OVERLORD - Startup');
    console.log('='.repeat(80));

    // Check environment variables
    const envCheck = checkEnvironmentVariables();
    let supabaseReady = false;

    if (!envCheck.configured) {
      console.warn('Missing environment variables:', envCheck.missing);
      console.warn('   Supabase features will not work until these are configured.');
      console.warn('   See DEPLOYMENT_PLAN.md for setup instructions.');
    } else {
      console.log('Environment variables configured');

      // Test database connection
      console.log('Testing database connection...');
      const testResult = await testDatabaseConnection();

      if (testResult.success) {
        console.log('Database connected successfully');
        supabaseReady = true;
      } else {
        console.error('Database connection failed:', testResult.message);
        console.warn('   Game will continue with local storage only.');
      }
    }

    console.log('='.repeat(80));

    // Determine next scene based on Supabase availability and auth status
    setTimeout(async () => {
      // Initialize guest mode service (restores existing guest session)
      const guestService = getGuestModeService();
      guestService.initialize();

      // Initialize user profile service
      const profileService = getUserProfileService();

      if (supabaseReady) {
        // Initialize auth service and check if already authenticated
        const authService = getAuthService();
        await authService.initialize();

        // Initialize admin services (depends on auth being ready)
        const adminService = getAdminModeService();
        await adminService.initialize();

        // Pre-fetch UI panel positions for faster scene loads
        const positionService = getUIPanelPositionService();
        await positionService.refreshCache();

        // Apply user settings (audio, UI preferences)
        // Story 10-6: Settings are loaded from cloud for auth users, localStorage for guests
        await profileService.applyAllSettings();
        console.log('User settings applied');

        if (authService.isAuthenticated()) {
          // Already logged in - go to main menu
          console.log('User authenticated, proceeding to main menu');
          if (adminService.isAdmin()) {
            console.log('  User has admin privileges');
          }
          this.scene.start('MainMenuScene');
        } else if (guestService.isGuestMode()) {
          // Existing guest session - go to main menu
          console.log('Guest session restored, proceeding to main menu');
          this.scene.start('MainMenuScene');
        } else {
          // Not logged in - go to auth scene
          console.log('User not authenticated, showing auth screen');
          this.scene.start('AuthScene');
        }
      } else {
        // Supabase not available - skip auth, go directly to main menu
        // (will work with localStorage only)
        console.log('Supabase unavailable, proceeding without authentication');

        // Still apply local settings for offline mode
        await profileService.applyAllSettings();
        console.log('Local settings applied');

        this.scene.start('MainMenuScene');
      }
    }, 100);
  }
}
