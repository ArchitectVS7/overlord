import Phaser from 'phaser';
import { CampaignInitializer } from '@core/CampaignInitializer';
import { Difficulty, AIPersonality } from '@core/models/Enums';
import {
  DIFFICULTY_DESCRIPTIONS,
  AI_PERSONALITY_DESCRIPTIONS,
} from '@core/models/CampaignConfig';
import { TopMenuBar } from './ui/TopMenuBar';

/**
 * Campaign Configuration Scene
 * AC-2: Difficulty selection (Easy/Normal/Hard) with tooltips
 * AC-3: AI personality selection with descriptions
 * AC-4: Start campaign within 3 seconds
 * AC-6: Default values (Normal, Balanced)
 */
/**
 * Data passed to CampaignConfigScene (C2.5-1: retry with same settings)
 */
interface CampaignConfigSceneData {
  previousDifficulty?: Difficulty;
  previousPersonality?: AIPersonality;
}

export class CampaignConfigScene extends Phaser.Scene {
  private selectedDifficulty: Difficulty = Difficulty.Normal; // AC-6: Default
  private selectedPersonality: AIPersonality = AIPersonality.Balanced; // AC-6: Default
  private difficultyButtons: Map<Difficulty, Phaser.GameObjects.Text> = new Map();
  private personalityButtons: Map<AIPersonality, Phaser.GameObjects.Text> = new Map();
  private tooltipText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'CampaignConfigScene' });
  }

  /**
   * Receives scene data for retry with same settings (C2.5-1)
   */
  public init(data: CampaignConfigSceneData): void {
    // Apply previous settings if passed (from DefeatScene retry)
    if (data.previousDifficulty !== undefined) {
      this.selectedDifficulty = data.previousDifficulty;
    } else {
      this.selectedDifficulty = Difficulty.Normal; // AC-6: Default
    }

    if (data.previousPersonality !== undefined) {
      this.selectedPersonality = data.previousPersonality;
    } else {
      this.selectedPersonality = AIPersonality.Balanced; // AC-6: Default
    }
  }

  public create(): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;

    // Create top menu bar
    new TopMenuBar(this);

    // Title (positioned below menu bar)
    this.add
      .text(centerX, TopMenuBar.getHeight() + 10, 'CAMPAIGN CONFIGURATION', {
        fontSize: '36px',
        color: '#00bfff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Difficulty section (AC-2)
    this.add
      .text(centerX, 110, 'SELECT DIFFICULTY', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.createDifficultyButtons(centerX, 160);

    // AI Personality section (AC-3)
    this.add
      .text(centerX, 280, 'SELECT AI PERSONALITY', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.createPersonalityButtons(centerX, 330);

    // Tooltip area (AC-2, AC-3)
    this.tooltipText = this.add
      .text(centerX, height - 180, '', {
        fontSize: '16px',
        color: '#ffff00',
        fontFamily: 'monospace',
        align: 'center',
        wordWrap: { width: width - 100 },
      })
      .setOrigin(0.5);

    // Start Campaign button (AC-4)
    const startButton = this.add
      .text(centerX, height - 100, 'START CAMPAIGN', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        backgroundColor: '#002255',
        padding: { x: 30, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#003366' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#002255' });
    });

    startButton.on('pointerdown', () => {
      this.startCampaign();
    });
  }

  private createDifficultyButtons(centerX: number, y: number): void {
    const difficulties: Difficulty[] = [Difficulty.Easy, Difficulty.Normal, Difficulty.Hard];
    const spacing = 180;
    const startX = centerX - spacing;

    for (let i = 0; i < difficulties.length; i++) {
      const difficulty = difficulties[i];
      const x = startX + i * spacing;
      const isSelected = difficulty === this.selectedDifficulty;

      const button = this.add
        .text(x, y, this.getDifficultyLabel(difficulty), {
          fontSize: '22px',
          color: isSelected ? '#00bfff' : '#ffffff',
          fontFamily: 'monospace',
          backgroundColor: isSelected ? '#002255' : '#222222',
          padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      this.difficultyButtons.set(difficulty, button);

      // Tooltip on hover (AC-2)
      button.on('pointerover', () => {
        this.showTooltip(DIFFICULTY_DESCRIPTIONS[difficulty]);
        if (difficulty !== this.selectedDifficulty) {
          button.setStyle({ backgroundColor: '#333333' });
        }
      });

      button.on('pointerout', () => {
        this.hideTooltip();
        if (difficulty !== this.selectedDifficulty) {
          button.setStyle({ backgroundColor: '#222222' });
        }
      });

      button.on('pointerdown', () => {
        this.selectDifficulty(difficulty);
      });
    }
  }

  private createPersonalityButtons(centerX: number, y: number): void {
    const personalities: AIPersonality[] = [
      AIPersonality.Aggressive,
      AIPersonality.Defensive,
      AIPersonality.Economic,
      AIPersonality.Balanced,
    ];
    const spacing = 160;
    const startX = centerX - spacing * 1.5;

    for (let i = 0; i < personalities.length; i++) {
      const personality = personalities[i];
      const x = startX + i * spacing;
      const isSelected = personality === this.selectedPersonality;

      const button = this.add
        .text(x, y, this.getPersonalityLabel(personality), {
          fontSize: '18px',
          color: isSelected ? '#00bfff' : '#ffffff',
          fontFamily: 'monospace',
          backgroundColor: isSelected ? '#002255' : '#222222',
          padding: { x: 15, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      this.personalityButtons.set(personality, button);

      // Description on hover (AC-3)
      button.on('pointerover', () => {
        this.showTooltip(AI_PERSONALITY_DESCRIPTIONS[personality]);
        if (personality !== this.selectedPersonality) {
          button.setStyle({ backgroundColor: '#333333' });
        }
      });

      button.on('pointerout', () => {
        this.hideTooltip();
        if (personality !== this.selectedPersonality) {
          button.setStyle({ backgroundColor: '#222222' });
        }
      });

      button.on('pointerdown', () => {
        this.selectPersonality(personality);
      });
    }
  }

  private selectDifficulty(difficulty: Difficulty): void {
    // Deselect previous
    const prevButton = this.difficultyButtons.get(this.selectedDifficulty);
    if (prevButton) {
      prevButton.setStyle({ color: '#ffffff', backgroundColor: '#222222' });
    }

    // Select new
    this.selectedDifficulty = difficulty;
    const newButton = this.difficultyButtons.get(difficulty);
    if (newButton) {
      newButton.setStyle({ color: '#00bfff', backgroundColor: '#002255' });
    }
  }

  private selectPersonality(personality: AIPersonality): void {
    // Deselect previous
    const prevButton = this.personalityButtons.get(this.selectedPersonality);
    if (prevButton) {
      prevButton.setStyle({ color: '#ffffff', backgroundColor: '#222222' });
    }

    // Select new
    this.selectedPersonality = personality;
    const newButton = this.personalityButtons.get(personality);
    if (newButton) {
      newButton.setStyle({ color: '#00bfff', backgroundColor: '#002255' });
    }
  }

  private showTooltip(text: string): void {
    if (this.tooltipText) {
      this.tooltipText.setText(text);
    }
  }

  private hideTooltip(): void {
    if (this.tooltipText) {
      this.tooltipText.setText('');
    }
  }

  private getDifficultyLabel(difficulty: Difficulty): string {
    return difficulty.toUpperCase();
  }

  private getPersonalityLabel(personality: AIPersonality): string {
    return personality.toUpperCase();
  }

  private startCampaign(): void {
    // Initialize campaign (AC-4: within 3 seconds)
    const initializer = new CampaignInitializer();
    const result = initializer.initializeCampaign({
      difficulty: this.selectedDifficulty,
      aiPersonality: this.selectedPersonality,
    });

    if (result.success) {
      // Store in Phaser registry for scene access
      this.registry.set('gameState', result.gameState);
      this.registry.set('galaxy', result.galaxy);
      this.registry.set('turnSystem', result.turnSystem);
      this.registry.set('phaseProcessor', result.phaseProcessor);

      // Log performance (AC-4)
      console.log(`Campaign initialized in ${result.initializationTimeMs.toFixed(2)}ms`);

      // Start galaxy map scene (AC-5: Turn 1 Income phase)
      this.scene.start('GalaxyMapScene');
    } else {
      // Show error (should not happen in normal operation)
      console.error('Campaign initialization failed:', result.error);
      this.tooltipText?.setText(`Error: ${result.error}`);
    }
  }
}
