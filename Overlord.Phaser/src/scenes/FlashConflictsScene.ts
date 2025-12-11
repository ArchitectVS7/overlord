/**
 * FlashConflictsScene - Tutorial and scenario selection menu
 * Story 1-1: Flash Conflicts Menu Access
 *
 * Features:
 * - Flash Conflicts title and menu
 * - Placeholder scenario list with tutorial badges
 * - Beginner recommendation indicator
 * - Back button to main menu
 */

import Phaser from 'phaser';

interface ScenarioPreview {
  id: string;
  name: string;
  type: 'tutorial' | 'tactical';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  completed: boolean;
  bestTime?: number;
}

export class FlashConflictsScene extends Phaser.Scene {
  private isFirstVisit: boolean = false;
  private scenarios: ScenarioPreview[] = [];

  constructor() {
    super({ key: 'FlashConflictsScene' });
  }

  public preload(): void {
    // Minimal asset loading for fast scene transition
  }

  public create(): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;

    // Check if first-time visitor
    this.isFirstVisit = !localStorage.getItem('flashConflicts_visited');
    if (this.isFirstVisit) {
      localStorage.setItem('flashConflicts_visited', 'true');
    }

    // Title
    const title = this.add.text(centerX, 60, 'FLASH CONFLICTS', {
      fontSize: '48px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(centerX, 120, 'Tutorial Scenarios & Quick Combat', {
      fontSize: '18px',
      color: '#00aa00',
      fontFamily: 'monospace'
    });
    subtitle.setOrigin(0.5);

    // Beginner recommendation (if first visit)
    if (this.isFirstVisit) {
      const beginnerBadge = this.add.text(centerX, 170, '⭐ RECOMMENDED FOR BEGINNERS ⭐', {
        fontSize: '16px',
        color: '#ffaa00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        backgroundColor: '#332200',
        padding: { x: 15, y: 8 }
      });
      beginnerBadge.setOrigin(0.5);
    }

    // Placeholder scenario list
    this.createPlaceholderScenarios();
    this.renderScenarioList(centerX, this.isFirstVisit ? 230 : 190);

    // Back button
    this.createBackButton(centerX, height - 80);
  }

  private createPlaceholderScenarios(): void {
    // Placeholder data until Story 1-2 creates ScenarioSystem
    this.scenarios = [
      {
        id: 'tutorial-01',
        name: 'Basic Combat Tutorial',
        type: 'tutorial',
        difficulty: 'easy',
        duration: '5-10 min',
        completed: false
      },
      {
        id: 'tutorial-02',
        name: 'Planetary Management',
        type: 'tutorial',
        difficulty: 'easy',
        duration: '10-15 min',
        completed: false
      },
      {
        id: 'tutorial-03',
        name: 'Fleet Operations',
        type: 'tutorial',
        difficulty: 'medium',
        duration: '15-20 min',
        completed: false
      },
      {
        id: 'scenario-01',
        name: 'Defend the Colony',
        type: 'tactical',
        difficulty: 'medium',
        duration: '20-30 min',
        completed: false
      }
    ];
  }

  private renderScenarioList(centerX: number, startY: number): void {
    const cardWidth = 500;
    const cardHeight = 80;
    const cardSpacing = 20;

    this.scenarios.forEach((scenario, index) => {
      const cardY = startY + (index * (cardHeight + cardSpacing));

      // Card background
      const bg = this.add.graphics();
      const bgColor = scenario.type === 'tutorial' ? 0x1a2a3a : 0x2a1a2a;
      bg.fillStyle(bgColor, 0.9);
      bg.fillRoundedRect(centerX - cardWidth / 2, cardY, cardWidth, cardHeight, 8);
      bg.lineStyle(2, scenario.type === 'tutorial' ? 0x4466aa : 0xaa4466, 1);
      bg.strokeRoundedRect(centerX - cardWidth / 2, cardY, cardWidth, cardHeight, 8);

      // Scenario name
      this.add.text(centerX - cardWidth / 2 + 20, cardY + 20, scenario.name, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      });

      // Type badge
      const badgeText = scenario.type === 'tutorial' ? '📚 TUTORIAL' : '⚔️ TACTICAL';
      this.add.text(centerX - cardWidth / 2 + 20, cardY + 45, badgeText, {
        fontSize: '12px',
        color: scenario.type === 'tutorial' ? '#88aaff' : '#ffaa88',
        fontFamily: 'Arial'
      });

      // Duration
      const duration = this.add.text(centerX + cardWidth / 2 - 20, cardY + 45, scenario.duration, {
        fontSize: '12px',
        color: '#aaaaaa',
        fontFamily: 'Arial'
      });
      duration.setOrigin(1, 0);

      // Difficulty
      const difficultyColor = scenario.difficulty === 'easy' ? '#66cc66' :
                              scenario.difficulty === 'medium' ? '#cccc66' : '#cc6666';
      const difficultyText = this.add.text(centerX + cardWidth / 2 - 20, cardY + 20,
        scenario.difficulty.toUpperCase(), {
        fontSize: '14px',
        color: difficultyColor,
        fontFamily: 'Arial',
        fontStyle: 'bold'
      });
      difficultyText.setOrigin(1, 0);

      // Make card interactive (placeholder for Story 1-2)
      const zone = this.add.zone(centerX, cardY + cardHeight / 2, cardWidth, cardHeight);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(scenario.type === 'tutorial' ? 0x253545 : 0x3a2535, 0.9);
        bg.fillRoundedRect(centerX - cardWidth / 2, cardY, cardWidth, cardHeight, 8);
        bg.lineStyle(2, scenario.type === 'tutorial' ? 0x5577cc : 0xcc5577, 1);
        bg.strokeRoundedRect(centerX - cardWidth / 2, cardY, cardWidth, cardHeight, 8);
      });
      zone.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(bgColor, 0.9);
        bg.fillRoundedRect(centerX - cardWidth / 2, cardY, cardWidth, cardHeight, 8);
        bg.lineStyle(2, scenario.type === 'tutorial' ? 0x4466aa : 0xaa4466, 1);
        bg.strokeRoundedRect(centerX - cardWidth / 2, cardY, cardWidth, cardHeight, 8);
      });
      zone.on('pointerdown', () => {
        // Placeholder: will be implemented in Story 1-2 (scenario selection)
        console.log(`Selected scenario: ${scenario.name}`);
      });
    });
  }

  private createBackButton(centerX: number, y: number): void {
    const button = this.add.text(centerX, y, 'BACK TO MAIN MENU', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'monospace',
      backgroundColor: '#330000',
      padding: { x: 20, y: 10 }
    });
    button.setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });

    button.on('pointerover', () => {
      button.setStyle({ backgroundColor: '#550000' });
    });

    button.on('pointerout', () => {
      button.setStyle({ backgroundColor: '#330000' });
    });

    button.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }

  public update(): void {
    // No continuous updates needed for menu scene
  }
}
