import Phaser from 'phaser';
import { PhaserConfig } from '@config/PhaserConfig';

// Create Phaser game instance
const game = new Phaser.Game(PhaserConfig);

// Global access for debugging
(window as any).game = game;
