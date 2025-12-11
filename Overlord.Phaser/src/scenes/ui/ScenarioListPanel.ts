/**
 * ScenarioListPanel - UI panel for browsing available Flash Conflict scenarios
 *
 * Story 1-2: Scenario Selection Interface
 *
 * Features:
 * - Displays scenarios in scrollable grid/list
 * - Shows name, type badge, difficulty, duration for each scenario
 * - Emits 'scenarioSelected' event when scenario is clicked
 * - Supports scrolling for many scenarios
 */

import Phaser from 'phaser';
import { Scenario } from '@core/models/ScenarioModels';

// Panel dimensions and styling
const PANEL_WIDTH = 600;
const PANEL_HEIGHT = 500;
const PADDING = 20;
const CARD_HEIGHT = 80;
const CARD_SPACING = 10;
const MAX_VISIBLE_CARDS = 5;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x4488ff;
const CARD_BG_COLOR = 0x2a2a3e;
const CARD_HOVER_COLOR = 0x3a3a4e;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const TUTORIAL_BADGE_COLOR = 0x44aa44;
const TACTICAL_BADGE_COLOR = 0xaa4444;
const COMPLETED_BADGE_COLOR = 0x44aaff;
const STAR_COLOR_FILLED = '#ffcc00';
const STAR_COLOR_EMPTY = '#444444';

interface CompletionData {
  completed: boolean;
  starRating: number;
}

interface ScenarioCard {
  scenario: Scenario;
  container: Phaser.GameObjects.Container;
  type: 'tutorial' | 'tactical';
}

export class ScenarioListPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private cardsContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private scenarios: Scenario[] = [];
  private scenarioCards: ScenarioCard[] = [];
  private scrollY: number = 0;
  private maxScrollY: number = 0;
  private isVisible: boolean = false;
  private completionData: Map<string, CompletionData> = new Map();

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private scrollMask!: Phaser.GameObjects.Graphics;

  // Callbacks
  public onScenarioSelected?: (scenario: Scenario) => void;
  public onClose?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.createBackdrop();
    this.createPanel();
    this.setVisible(false);
    this.setDepth(1200);
    this.setScrollFactor(0);
  }

  private createBackdrop(): void {
    const camera = this.scene.cameras.main;
    this.backdrop = this.scene.add.rectangle(0, 0, camera.width, camera.height, 0x000000, 0.6);
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setInteractive({ useHandCursor: false });
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(1199);
    this.backdrop.setVisible(false);
    this.backdrop.on('pointerdown', () => this.hide());
  }

  private createPanel(): void {
    const camera = this.scene.cameras.main;
    const x = (camera.width - PANEL_WIDTH) / 2;
    const y = (camera.height - PANEL_HEIGHT) / 2;
    this.setPosition(x, y);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.background);

    // Border
    this.borderGraphics = this.scene.add.graphics();
    this.borderGraphics.lineStyle(2, BORDER_COLOR, 1);
    this.borderGraphics.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.borderGraphics);

    // Content container
    this.contentContainer = this.scene.add.container(PADDING, PADDING);
    this.add(this.contentContainer);

    // Title
    this.titleText = this.scene.add.text(0, 0, 'Select Flash Conflict', {
      fontSize: '24px',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(this.titleText);

    // Close button
    const closeButton = this.scene.add.text(
      PANEL_WIDTH - PADDING * 2,
      0,
      'X',
      {
        fontSize: '24px',
        color: TEXT_COLOR
      }
    );
    closeButton.setInteractive({ useHandCursor: true });
    closeButton.on('pointerdown', () => this.hide());
    this.contentContainer.add(closeButton);

    // Cards container with mask for scrolling
    this.cardsContainer = this.scene.add.container(0, 50);
    this.contentContainer.add(this.cardsContainer);

    // Create scroll mask
    this.scrollMask = this.scene.add.graphics();
    const maskHeight = MAX_VISIBLE_CARDS * (CARD_HEIGHT + CARD_SPACING);
    this.scrollMask.fillStyle(0xffffff);
    this.scrollMask.fillRect(
      x + PADDING,
      y + PADDING + 50,
      PANEL_WIDTH - PADDING * 2,
      maskHeight
    );
    const mask = this.scrollMask.createGeometryMask();
    this.cardsContainer.setMask(mask);

    // Mouse wheel scrolling
    this.scene.input.on('wheel', this.handleScroll, this);
  }

  /**
   * Set scenarios to display
   */
  setScenarios(scenarios: Scenario[]): void {
    this.scenarios = scenarios;
    this.renderScenarioCards();
  }

  /**
   * Set completion data for scenarios
   * @param data Map of scenario ID to completion info
   */
  setCompletionData(data: Map<string, CompletionData>): void {
    this.completionData = data;
    this.renderScenarioCards();
  }

  /**
   * Render scenario cards
   */
  private renderScenarioCards(): void {
    // Clear existing cards
    this.scenarioCards.forEach(card => card.container.destroy());
    this.scenarioCards = [];
    this.scrollY = 0;

    // Create card for each scenario
    this.scenarios.forEach((scenario, index) => {
      const card = this.createScenarioCard(scenario, index);
      this.scenarioCards.push(card);
    });

    // Calculate max scroll
    const totalHeight = this.scenarios.length * (CARD_HEIGHT + CARD_SPACING);
    const visibleHeight = MAX_VISIBLE_CARDS * (CARD_HEIGHT + CARD_SPACING);
    this.maxScrollY = Math.max(0, totalHeight - visibleHeight);
  }

  /**
   * Create a single scenario card
   */
  private createScenarioCard(scenario: Scenario, index: number): ScenarioCard {
    const cardWidth = PANEL_WIDTH - PADDING * 2;
    const yPos = index * (CARD_HEIGHT + CARD_SPACING);

    const container = this.scene.add.container(0, yPos);
    this.cardsContainer.add(container);

    // Card background
    const cardBg = this.scene.add.graphics();
    cardBg.fillStyle(CARD_BG_COLOR, 1);
    cardBg.fillRoundedRect(0, 0, cardWidth, CARD_HEIGHT, 4);
    container.add(cardBg);

    // Make card interactive
    const hitArea = this.scene.add.rectangle(0, 0, cardWidth, CARD_HEIGHT, 0x000000, 0);
    hitArea.setOrigin(0, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.on('pointerover', () => {
      cardBg.clear();
      cardBg.fillStyle(CARD_HOVER_COLOR, 1);
      cardBg.fillRoundedRect(0, 0, cardWidth, CARD_HEIGHT, 4);
    });
    hitArea.on('pointerout', () => {
      cardBg.clear();
      cardBg.fillStyle(CARD_BG_COLOR, 1);
      cardBg.fillRoundedRect(0, 0, cardWidth, CARD_HEIGHT, 4);
    });
    hitArea.on('pointerdown', () => {
      this.selectScenario(scenario.id);
    });
    container.add(hitArea);

    // Type badge
    const badgeColor = scenario.type === 'tutorial' ? TUTORIAL_BADGE_COLOR : TACTICAL_BADGE_COLOR;
    const badge = this.scene.add.graphics();
    badge.fillStyle(badgeColor, 1);
    badge.fillRoundedRect(10, 10, 80, 24, 4);
    container.add(badge);

    const badgeText = this.scene.add.text(50, 22, scenario.type.toUpperCase(), {
      fontSize: '12px',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    badgeText.setOrigin(0.5, 0.5);
    container.add(badgeText);

    // Scenario name
    const nameText = this.scene.add.text(100, 15, scenario.name, {
      fontSize: '18px',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    container.add(nameText);

    // Difficulty and duration
    const infoText = this.scene.add.text(
      100,
      40,
      `${scenario.difficulty} | ${scenario.duration}`,
      {
        fontSize: '14px',
        color: LABEL_COLOR
      }
    );
    container.add(infoText);

    // Completion badge and stars (Story 1-5)
    const completion = this.completionData.get(scenario.id);
    if (completion?.completed) {
      // Completed badge
      const completedBadge = this.scene.add.graphics();
      completedBadge.fillStyle(COMPLETED_BADGE_COLOR, 1);
      completedBadge.fillRoundedRect(cardWidth - 130, 10, 80, 24, 4);
      container.add(completedBadge);

      const completedText = this.scene.add.text(cardWidth - 90, 22, 'DONE', {
        fontSize: '12px',
        color: TEXT_COLOR,
        fontStyle: 'bold'
      });
      completedText.setOrigin(0.5, 0.5);
      container.add(completedText);

      // Star rating
      const starY = 50;
      for (let i = 0; i < 3; i++) {
        const starX = cardWidth - 130 + i * 20;
        const starColor = i < completion.starRating ? STAR_COLOR_FILLED : STAR_COLOR_EMPTY;
        const starText = this.scene.add.text(starX, starY, '★', {
          fontSize: '16px',
          color: starColor
        });
        container.add(starText);
      }
    }

    return {
      scenario,
      container,
      type: scenario.type
    };
  }

  /**
   * Handle scroll wheel
   */
  private handleScroll(_pointer: any, _gameObjects: any[], _deltaX: number, deltaY: number): void {
    if (!this.isVisible) return;

    this.scrollY += deltaY * 0.5;
    this.scrollY = Phaser.Math.Clamp(this.scrollY, 0, this.maxScrollY);

    this.cardsContainer.setY(50 - this.scrollY);
  }

  /**
   * Select a scenario by ID
   */
  selectScenario(scenarioId: string): void {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (scenario && this.onScenarioSelected) {
      this.onScenarioSelected(scenario);
    }
  }

  /**
   * Show the panel
   */
  show(): void {
    this.isVisible = true;
    this.setVisible(true);
    this.backdrop.setVisible(true);
  }

  /**
   * Hide the panel
   */
  hide(): void {
    this.isVisible = false;
    this.setVisible(false);
    this.backdrop.setVisible(false);

    if (this.onClose) {
      this.onClose();
    }
  }

  /**
   * Check if panel is scrollable
   */
  isScrollable(): boolean {
    return this.maxScrollY > 0;
  }

  /**
   * Get scenario cards for testing
   */
  getScenarioCards(): ScenarioCard[] {
    return this.scenarioCards;
  }

  /**
   * Clean up
   */
  destroy(fromScene?: boolean): void {
    this.scene.input.off('wheel', this.handleScroll, this);
    this.backdrop.destroy();
    this.scrollMask.destroy();
    super.destroy(fromScene);
  }
}
