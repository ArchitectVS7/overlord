/**
 * OpponentInfoPanel - Displays AI opponent information
 * Story 7-2: AI Personality and Difficulty Adaptation (Display)
 */

import Phaser from 'phaser';

export class OpponentInfoPanel extends Phaser.GameObjects.Container {
  private static readonly PANEL_WIDTH = 240;
  private static readonly PANEL_HEIGHT = 120;
  private static readonly PADDING = 12;

  private background!: Phaser.GameObjects.Graphics;
  private commanderText!: Phaser.GameObjects.Text;
  private personalityText!: Phaser.GameObjects.Text;
  private difficultyText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    // Background
    this.background = scene.add.graphics();
    this.background.fillStyle(0x2a1a1a, 0.9);
    this.background.fillRoundedRect(0, 0, OpponentInfoPanel.PANEL_WIDTH, OpponentInfoPanel.PANEL_HEIGHT, 8);
    this.background.lineStyle(2, 0x8a4444, 1);
    this.background.strokeRoundedRect(0, 0, OpponentInfoPanel.PANEL_WIDTH, OpponentInfoPanel.PANEL_HEIGHT, 8);
    this.add(this.background);

    // Title
    const title = scene.add.text(
      OpponentInfoPanel.PANEL_WIDTH / 2,
      OpponentInfoPanel.PADDING,
      '🛡️ OPPONENT',
      {
        fontSize: '12px',
        fontFamily: 'Arial',
        color: '#cc6666',
        fontStyle: 'bold',
      },
    );
    title.setOrigin(0.5, 0);
    this.add(title);

    // Commander name
    this.commanderText = scene.add.text(
      OpponentInfoPanel.PADDING,
      OpponentInfoPanel.PADDING + 24,
      'AI Commander',
      {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold',
      },
    );
    this.add(this.commanderText);

    // Personality
    this.personalityText = scene.add.text(
      OpponentInfoPanel.PADDING,
      OpponentInfoPanel.PADDING + 46,
      'Personality: Balanced',
      {
        fontSize: '11px',
        fontFamily: 'Arial',
        color: '#aaaaaa',
      },
    );
    this.add(this.personalityText);

    // Difficulty
    this.difficultyText = scene.add.text(
      OpponentInfoPanel.PADDING,
      OpponentInfoPanel.PADDING + 64,
      'Difficulty: Normal',
      {
        fontSize: '11px',
        fontFamily: 'Arial',
        color: '#aaaaaa',
      },
    );
    this.add(this.difficultyText);

    this.setDepth(1000);
    this.setScrollFactor(0);
  }

  public setOpponentInfo(
    commanderName: string,
    personality: string,
    difficulty: string,
  ): void {
    this.commanderText.setText(commanderName);
    this.personalityText.setText(`Personality: ${personality}`);
    this.difficultyText.setText(`Difficulty: ${difficulty}`);

    // Color code difficulty
    if (difficulty === 'Easy') {
      this.difficultyText.setColor('#66cc66');
    } else if (difficulty === 'Hard') {
      this.difficultyText.setColor('#cc6666');
    } else {
      this.difficultyText.setColor('#cccc66');
    }
  }

  public getCommanderName(): string {
    return this.commanderText.text;
  }

  public getPersonality(): string {
    return this.personalityText.text.replace('Personality: ', '');
  }

  public getDifficulty(): string {
    return this.difficultyText.text.replace('Difficulty: ', '');
  }
}
