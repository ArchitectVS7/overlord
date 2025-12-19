import Phaser from 'phaser';
import { GameState } from '@core/GameState';
import { FactionType, VictoryResult } from '@core/models/Enums';
import { SaveSystem, SaveData } from '@core/SaveSystem';
import { getSaveService } from '@services/SaveService';
import { getUserStatisticsService } from '@services/UserStatisticsService';

/**
 * Defeat campaign statistics for display
 */
export interface DefeatStatistics {
  turnsPlayed: number;
  planetsLost: number;
  totalPlanets: number;
  finalCredits: number;
  finalMinerals: number;
  finalFuel: number;
  finalFood: number;
  finalEnergy: number;
  totalPlatoons: number;
  totalCraft: number;
}

/**
 * Defeat Scene
 * Story 2-5: Displays defeat screen when player loses all planets.
 *
 * AC-1: Defeat detected within 1 second when last player planet lost
 * AC-2: Defeat screen shows "Defeat" message and campaign statistics
 * AC-3: "Try Again" button returns to campaign config to start new game
 * AC-4: "Main Menu" button returns to main menu
 * AC-5: "Save Campaign" button preserves final state for analysis
 */
export class DefeatScene extends Phaser.Scene {
  private gameState?: GameState;
  private statistics?: DefeatStatistics;

  constructor() {
    super({ key: 'DefeatScene' });
  }

  public create(): void {
    // Get game state from registry (passed from GalaxyMapScene)
    this.gameState = this.registry.get('gameState') as GameState | undefined;

    // Calculate statistics
    this.statistics = this.calculateStatistics();

    // Story 10-7: Record defeat in user statistics
    this.recordDefeatStats();

    const { width, height } = this.cameras.main;
    const centerX = width / 2;

    // Defeat title with somber styling
    this.add
      .text(centerX, 60, 'DEFEAT', {
        fontSize: '72px',
        color: '#ff0000',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(centerX, 120, 'The empire has fallen...', {
        fontSize: '24px',
        color: '#ff6600',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    // Campaign Statistics Header
    this.add
      .text(centerX, 180, '=== FINAL CAMPAIGN REPORT ===', {
        fontSize: '20px',
        color: '#ff4444',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    // Statistics display
    this.createStatisticsDisplay(centerX, 230);

    // Button row
    const buttonY = height - 100;
    const buttonSpacing = 160;
    const startX = centerX - buttonSpacing;

    // Try Again button (AC-3)
    const tryAgainButton = this.add
      .text(startX, buttonY, 'TRY AGAIN', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
        backgroundColor: '#440000',
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    tryAgainButton.on('pointerover', () => {
      tryAgainButton.setStyle({ backgroundColor: '#660000' });
    });

    tryAgainButton.on('pointerout', () => {
      tryAgainButton.setStyle({ backgroundColor: '#440000' });
    });

    tryAgainButton.on('pointerdown', () => {
      this.tryAgain();
    });

    // Main Menu button (AC-4)
    const mainMenuButton = this.add
      .text(centerX, buttonY, 'MAIN MENU', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
        backgroundColor: '#333333',
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    mainMenuButton.on('pointerover', () => {
      mainMenuButton.setStyle({ backgroundColor: '#555555' });
    });

    mainMenuButton.on('pointerout', () => {
      mainMenuButton.setStyle({ backgroundColor: '#333333' });
    });

    mainMenuButton.on('pointerdown', () => {
      this.returnToMainMenu();
    });

    // Save Campaign button (AC-5)
    const saveButton = this.add
      .text(startX + buttonSpacing * 2, buttonY, 'SAVE CAMPAIGN', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
        backgroundColor: '#003344',
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    saveButton.on('pointerover', () => {
      saveButton.setStyle({ backgroundColor: '#004466' });
    });

    saveButton.on('pointerout', () => {
      saveButton.setStyle({ backgroundColor: '#003344' });
    });

    saveButton.on('pointerdown', () => {
      this.saveCampaign();
    });

    // Status text for save feedback
    this.add
      .text(centerX, height - 40, '', {
        fontSize: '14px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setName('statusText');

    // Add somber visual effect
    this.createDefeatEffect();
  }

  /**
   * Calculates defeat statistics from game state.
   */
  private calculateStatistics(): DefeatStatistics {
    if (!this.gameState) {
      return this.getDefaultStatistics();
    }

    // Count AI-controlled planets (these were lost by the player)
    const aiPlanets = this.gameState.planets.filter(
      p => p.owner === FactionType.AI,
    );

    return {
      turnsPlayed: this.gameState.currentTurn,
      planetsLost: aiPlanets.length, // AI now controls these
      totalPlanets: this.gameState.planets.length,
      finalCredits: this.gameState.playerFaction.resources.credits,
      finalMinerals: this.gameState.playerFaction.resources.minerals,
      finalFuel: this.gameState.playerFaction.resources.fuel,
      finalFood: this.gameState.playerFaction.resources.food,
      finalEnergy: this.gameState.playerFaction.resources.energy,
      totalPlatoons: this.gameState.platoons.filter(
        p => p.owner === FactionType.Player,
      ).length,
      totalCraft: this.gameState.craft.filter(
        c => c.owner === FactionType.Player,
      ).length,
    };
  }

  /**
   * Returns default statistics when no game state available.
   */
  private getDefaultStatistics(): DefeatStatistics {
    return {
      turnsPlayed: 0,
      planetsLost: 0,
      totalPlanets: 0,
      finalCredits: 0,
      finalMinerals: 0,
      finalFuel: 0,
      finalFood: 0,
      finalEnergy: 0,
      totalPlatoons: 0,
      totalCraft: 0,
    };
  }

  /**
   * Creates the statistics display panel.
   */
  private createStatisticsDisplay(centerX: number, startY: number): void {
    const stats = this.statistics || this.getDefaultStatistics();
    const lineHeight = 28;
    let y = startY;

    // Game progress stats
    this.createStatLine(centerX, y, 'Turns Survived:', stats.turnsPlayed.toString());
    y += lineHeight;

    this.createStatLine(
      centerX,
      y,
      'Planets Lost to AI:',
      `${stats.planetsLost} / ${stats.totalPlanets}`,
    );
    y += lineHeight;

    // Remaining military stats
    this.createStatLine(centerX, y, 'Remaining Platoons:', stats.totalPlatoons.toString());
    y += lineHeight;

    this.createStatLine(centerX, y, 'Remaining Spacecraft:', stats.totalCraft.toString());
    y += lineHeight * 1.5;

    // Final Resources header
    this.add
      .text(centerX, y, '--- Final Resources ---', {
        fontSize: '16px',
        color: '#aa4444',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
    y += lineHeight;

    // Resource stats
    this.createStatLine(centerX, y, 'Credits:', this.formatNumber(stats.finalCredits), '#ffff00');
    y += lineHeight;

    this.createStatLine(centerX, y, 'Minerals:', this.formatNumber(stats.finalMinerals), '#888888');
    y += lineHeight;

    this.createStatLine(centerX, y, 'Fuel:', this.formatNumber(stats.finalFuel), '#ff6600');
    y += lineHeight;

    this.createStatLine(centerX, y, 'Food:', this.formatNumber(stats.finalFood), '#00ff00');
    y += lineHeight;

    this.createStatLine(centerX, y, 'Energy:', this.formatNumber(stats.finalEnergy), '#00ffff');
  }

  /**
   * Creates a single statistic line with label and value.
   */
  private createStatLine(
    centerX: number,
    y: number,
    label: string,
    value: string,
    valueColor: string = '#ffffff',
  ): void {
    // Label on left
    this.add
      .text(centerX - 110, y, label, {
        fontSize: '18px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(1, 0.5);

    // Value on right
    this.add
      .text(centerX + 110, y, value, {
        fontSize: '18px',
        color: valueColor,
        fontFamily: 'monospace',
      })
      .setOrigin(0, 0.5);
  }

  /**
   * Formats a number with thousand separators.
   */
  private formatNumber(num: number): string {
    return num.toLocaleString();
  }

  /**
   * Returns to campaign config to try again (C2.5-1: preserves settings).
   */
  private tryAgain(): void {
    // C2.5-1: Preserve campaign settings for retry
    const previousConfig = this.gameState?.campaignConfig;

    // Clear registry data
    this.registry.remove('gameState');
    this.registry.remove('galaxy');
    this.registry.remove('turnSystem');
    this.registry.remove('phaseProcessor');

    // Pass previous config to CampaignConfigScene for retry with same settings
    this.scene.start('CampaignConfigScene', {
      previousDifficulty: previousConfig?.difficulty,
      previousPersonality: previousConfig?.aiPersonality,
    });
  }

  /**
   * Returns to the main menu.
   */
  private returnToMainMenu(): void {
    // Clear registry data
    this.registry.remove('gameState');
    this.registry.remove('galaxy');
    this.registry.remove('turnSystem');
    this.registry.remove('phaseProcessor');

    this.scene.start('MainMenuScene');
  }

  /**
   * Saves the campaign to cloud or local storage.
   */
  private async saveCampaign(): Promise<void> {
    const statusText = this.children.getByName('statusText') as Phaser.GameObjects.Text | null;

    if (!this.gameState) {
      if (statusText) {
        statusText.setText('Error: No game state to save');
        statusText.setStyle({ color: '#ff0000' });
      }
      return;
    }

    try {
      // Create SaveSystem instance to generate save data
      const saveSystem = new SaveSystem(this.gameState);

      // Generate save name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const slotName = `defeat-${timestamp}`;

      // Create save data
      const saveData: SaveData = saveSystem.createSaveData(
        '0.4.0-supabase',
        0,
        `Defeat - Turn ${this.gameState.currentTurn}`,
      );
      saveData.victoryStatus = VictoryResult.AIVictory;

      // Save using SaveService (cloud-first with local fallback)
      const saveService = getSaveService();
      const result = await saveService.saveGame(saveData, slotName, 'Campaign');

      if (result.success) {
        if (statusText) {
          const locationText = result.savedTo === 'cloud' ? '(Cloud)' : '(Local)';
          statusText.setText(`Campaign saved ${locationText}: ${slotName}`);
          statusText.setStyle({ color: '#00ff00' });
        }
        console.log(`Defeat campaign saved to ${result.savedTo}: ${slotName}`);
      } else {
        if (statusText) {
          statusText.setText(`Save failed: ${result.error}`);
          statusText.setStyle({ color: '#ff0000' });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (statusText) {
        statusText.setText(`Save failed: ${errorMessage}`);
        statusText.setStyle({ color: '#ff0000' });
      }
      console.error('Failed to save campaign:', error);
    }
  }

  /**
   * Creates somber visual effect for defeat.
   */
  private createDefeatEffect(): void {
    const { width, height } = this.cameras.main;

    // Create pulsing red border effect
    const borderGraphics = this.add.graphics();
    borderGraphics.lineStyle(4, 0xff0000, 0.3);
    borderGraphics.strokeRect(10, 10, width - 20, height - 20);

    // Animate the border with a fade effect
    this.tweens.add({
      targets: borderGraphics,
      alpha: { from: 0.3, to: 0.6 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Story 10-7: Record defeat statistics
   */
  private async recordDefeatStats(): Promise<void> {
    const statsService = getUserStatisticsService();

    try {
      // Record campaign lost
      await statsService.recordCampaignLost();

      // Record planets lost from this campaign
      if (this.statistics) {
        for (let i = 0; i < this.statistics.planetsLost; i++) {
          await statsService.recordPlanetLost();
        }
      }

      // Stop playtime tracking (started in GalaxyMapScene)
      await statsService.stopPlaytimeTracking();

      console.log('Defeat statistics recorded');
    } catch (error) {
      console.warn('Failed to record defeat statistics:', error);
    }
  }
}
