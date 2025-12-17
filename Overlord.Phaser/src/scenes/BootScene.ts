import Phaser from 'phaser';
import { checkEnvironmentVariables, testDatabaseConnection } from '@services/SupabaseClient';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // Future: load assets (sprites, fonts, etc.)
  }

  public async create(): Promise<void> {
    console.log('='.repeat(80));
    console.log('OVERLORD - Database Connection Test');
    console.log('='.repeat(80));

    // Check environment variables
    const envCheck = checkEnvironmentVariables();
    if (!envCheck.configured) {
      console.warn('❌ Missing environment variables:', envCheck.missing);
      console.warn('   Supabase features will not work until these are configured.');
      console.warn('   See DEPLOYMENT_PLAN.md for setup instructions.');
    } else {
      console.log('✅ Environment variables configured');

      // Test database connection
      console.log('🔄 Testing database connection...');
      const testResult = await testDatabaseConnection();

      if (testResult.success) {
        console.log('✅ ' + testResult.message);
        console.log('   Database is ready for use!');
      } else {
        console.error('❌ ' + testResult.message);
        if (testResult.error) {
          console.error('   Error details:', testResult.error);
        }
        console.warn('   Game will continue with local storage only.');
      }
    }

    console.log('='.repeat(80));

    // Start at main menu (AC-1)
    // Use setTimeout to ensure console logs are visible before scene transition
    setTimeout(() => {
      this.scene.start('MainMenuScene');
    }, 100);
  }
}
