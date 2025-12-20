import Phaser from 'phaser';
import { PhaserConfig } from '@config/PhaserConfig';
import { getAuthService } from '@services/AuthService';
import { getGuestModeService } from '@services/GuestModeService';

// Create Phaser game instance
const game = new Phaser.Game(PhaserConfig);

// Global access for debugging and E2E testing
(window as any).game = game;
(window as any).getAuthService = getAuthService;
(window as any).getGuestModeService = getGuestModeService;
