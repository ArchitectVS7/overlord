import Phaser from 'phaser';
import { GameState } from '@core/GameState';
import { FactionType, VictoryResult } from '@core/models/Enums';
import { SaveSystem, SaveData } from '@core/SaveSystem';
import { getSaveService } from '@services/SaveService';
import { getUserStatisticsService } from '@services/UserStatisticsService';

/**
 * Victory campaign statistics for display
 */
export interface VictoryStatistics {
  turnsPlayed: number;
  planetsConquered: number;
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
 * Victory Scene
 * Story 2-4: Displays victory screen when player conquers all AI planets.
 *
 * AC-1: Victory detected within 1 second when last AI planet captured
 * AC-2: Victory screen shows "Victory!" message and campaign statistics
 * AC-3: "Continue" button returns to main menu
 * AC-4: "Save Campaign" button preserves final state
 */
export class VictoryScene extends Phaser.Scene {
  private gameState?: GameState;
  private statistics?: VictoryStatistics;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  public create(): void {
    // Get game state from registry (passed from GalaxyMapScene)
    this.gameState = this.registry.get('gameState') as GameState | undefined;

    // Calculate statistics
    this.statistics = this.calculateStatistics();

    // Story 10-7: Record victory in user statistics
    this.recordVictoryStats();

    const { width, height } = this.cameras.main;
    const centerX = width / 2;

    // Victory title with celebratory styling
    this.add
      .text(centerX, 60, 'VICTORY!', {
        fontSize: '72px',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(centerX, 120, 'The galaxy is yours!', {
        fontSize: '24px',
        color: '#ffff00',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    // Campaign Statistics Header
    this.add
      .text(centerX, 180, '=== CAMPAIGN STATISTICS ===', {
        fontSize: '20px',
        color: '#00ff00',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    // Statistics display
    this.createStatisticsDisplay(centerX, 230);

    // Continue button (AC-3)
    const continueButton = this.add
      .text(centerX - 100, height - 100, 'CONTINUE', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'monospace',
        backgroundColor: '#004400',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    continueButton.on('pointerover', () => {
      continueButton.setStyle({ backgroundColor: '#006600' });
    });

    continueButton.on('pointerout', () => {
      continueButton.setStyle({ backgroundColor: '#004400' });
    });

    continueButton.on('pointerdown', () => {
      this.returnToMainMenu();
    });

    // Save Campaign button (AC-4)
    const saveButton = this.add
      .text(centerX + 100, height - 100, 'SAVE CAMPAIGN', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'monospace',
        backgroundColor: '#003344',
        padding: { x: 20, y: 10 },
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

    // Add celebratory particle effect
    this.createCelebrationEffect();
  }

  /**
   * Calculates victory statistics from game state.
   */
  private calculateStatistics(): VictoryStatistics {
    if (!this.gameState) {
      return this.getDefaultStatistics();
    }

    const playerPlanets = this.gameState.planets.filter(
      p => p.owner === FactionType.Player,
    );

    return {
      turnsPlayed: this.gameState.currentTurn,
      planetsConquered: playerPlanets.length,
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
  private getDefaultStatistics(): VictoryStatistics {
    return {
      turnsPlayed: 0,
      planetsConquered: 0,
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
    this.createStatLine(centerX, y, 'Turns Played:', stats.turnsPlayed.toString());
    y += lineHeight;

    this.createStatLine(
      centerX,
      y,
      'Planets Controlled:',
      `${stats.planetsConquered} / ${stats.totalPlanets}`,
    );
    y += lineHeight;

    // Military stats
    this.createStatLine(centerX, y, 'Platoons:', stats.totalPlatoons.toString());
    y += lineHeight;

    this.createStatLine(centerX, y, 'Spacecraft:', stats.totalCraft.toString());
    y += lineHeight * 1.5;

    // Final Resources header
    this.add
      .text(centerX, y, '--- Final Resources ---', {
        fontSize: '16px',
        color: '#00aaaa',
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
      .text(centerX - 100, y, label, {
        fontSize: '18px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(1, 0.5);

    // Value on right
    this.add
      .text(centerX + 100, y, value, {
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
      const slotName = `victory-${timestamp}`;

      // Create save data
      const saveData: SaveData = saveSystem.createSaveData(
        '0.4.0-supabase',
        0,
        `Victory - Turn ${this.gameState.currentTurn}`,
      );
      saveData.victoryStatus = VictoryResult.PlayerVictory;

      // Save using SaveService (cloud-first with local fallback)
      const saveService = getSaveService();
      const result = await saveService.saveGame(saveData, slotName, 'Campaign');

      if (result.success) {
        if (statusText) {
          const locationText = result.savedTo === 'cloud' ? '(Cloud)' : '(Local)';
          statusText.setText(`Campaign saved ${locationText}: ${slotName}`);
          statusText.setStyle({ color: '#00ff00' });
        }
        console.log(`Victory campaign saved to ${result.savedTo}: ${slotName}`);
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
   * Creates celebratory visual effect.
   */
  private createCelebrationEffect(): void {
    // Create simple star burst effect using graphics
    const graphics = this.add.graphics();
    const centerX = this.cameras.main.width / 2;
    const centerY = 60;

    // Draw radiating lines
    const numRays = 12;
    const innerRadius = 100;
    const outerRadius = 150;

    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * Math.PI * 2;
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;

      graphics.lineStyle(2, 0xffff00, 0.3);
      graphics.lineBetween(x1, y1, x2, y2);
    }

    // Animate the rays with a pulse effect
    this.tweens.add({
      targets: graphics,
      alpha: { from: 0.3, to: 0.8 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Story 10-7: Record victory statistics
   */
  private async recordVictoryStats(): Promise<void> {
    const statsService = getUserStatisticsService();

    try {
      // Record campaign won
      await statsService.recordCampaignWon();

      // Record planets conquered from this campaign
      if (this.statistics) {
        for (let i = 0; i < this.statistics.planetsConquered; i++) {
          await statsService.recordPlanetConquered();
        }
      }

      // Stop playtime tracking (started in GalaxyMapScene)
      await statsService.stopPlaytimeTracking();

      console.log('Victory statistics recorded');
    } catch (error) {
      console.warn('Failed to record victory statistics:', error);
    }
  }
}
