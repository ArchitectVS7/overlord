/**
 * PackListPanel - UI panel for displaying and filtering scenario packs
 * Story 9-1: Scenario Pack Browsing and Selection
 *
 * Features:
 * - Displays available scenario packs
 * - Shows pack metadata (name, difficulty, AI personality)
 * - Supports filtering by difficulty and personality
 * - Highlights active and locked packs
 */

import Phaser from 'phaser';
import { PackDisplayData } from '@core/models/ScenarioPackModels';
import { AIPersonality } from '@core/models/Enums';

// Panel dimensions and styling
const PANEL_WIDTH = 350;
const PANEL_HEIGHT = 600;
const CARD_HEIGHT = 80;
const CARD_SPACING = 10;
const PADDING = 15;

// Colors
const BG_COLOR = 0x1a1a2e;
const CARD_BG_COLOR = 0x252540;
const CARD_ACTIVE_COLOR = 0x334466;
const CARD_HOVER_COLOR = 0x2d2d4a;
const CARD_LOCKED_COLOR = 0x1a1a2a;
const BORDER_COLOR = 0x4488ff;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const LOCKED_COLOR = '#666666';
const ACTIVE_BADGE_COLOR = '#44ff44';

export class PackListPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private cardsContainer!: Phaser.GameObjects.Container;

  private packs: PackDisplayData[] = [];
  private selectedPackId: string | null = null;
  private difficultyFilter: 'easy' | 'normal' | 'hard' | null = null;
  private personalityFilter: AIPersonality | null = null;

  // Callbacks
  public onPackSelected?: (pack: PackDisplayData) => void;
  public onClose?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.createPanel();
    this.setVisible(false);
    this.setDepth(1100);
    this.setScrollFactor(0);
  }

  private createPanel(): void {
    const camera = this.scene.cameras.main;
    const x = PADDING;
    const y = (camera.height - PANEL_HEIGHT) / 2;
    this.setPosition(x, y);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.95);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.background.lineStyle(2, BORDER_COLOR, 1);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.background);

    // Content container
    this.contentContainer = this.scene.add.container(PADDING, PADDING);
    this.add(this.contentContainer);

    // Title
    const titleText = this.scene.add.text(0, 0, 'Scenario Packs', {
      fontSize: '24px',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(titleText);

    // Cards container (for scrolling)
    this.cardsContainer = this.scene.add.container(0, 50);
    this.contentContainer.add(this.cardsContainer);
  }

  /**
   * Set the packs to display
   */
  setPacks(packs: PackDisplayData[]): void {
    this.packs = packs;
    this.renderPackCards();
  }

  /**
   * Get the count of loaded packs
   */
  getPackCount(): number {
    return this.packs.length;
  }

  /**
   * Render pack cards
   */
  private renderPackCards(): void {
    this.cardsContainer.removeAll(true);

    const sortedPacks = this.getSortedPacks();
    const filteredPacks = this.applyFilters(sortedPacks);

    filteredPacks.forEach((pack, index) => {
      const card = this.createPackCard(pack, index);
      this.cardsContainer.add(card);
    });
  }

  /**
   * Create a pack card
   */
  private createPackCard(pack: PackDisplayData, index: number): Phaser.GameObjects.Container {
    const y = index * (CARD_HEIGHT + CARD_SPACING);
    const card = this.scene.add.container(0, y);

    // Card background
    const bgColor = pack.isLocked ? CARD_LOCKED_COLOR :
                   pack.isActive ? CARD_ACTIVE_COLOR : CARD_BG_COLOR;
    const cardBg = this.scene.add.graphics();
    cardBg.fillStyle(bgColor, 1);
    cardBg.fillRoundedRect(0, 0, PANEL_WIDTH - PADDING * 2, CARD_HEIGHT, 4);
    card.add(cardBg);

    // Pack name
    const nameColor = pack.isLocked ? LOCKED_COLOR : TEXT_COLOR;
    const nameText = this.scene.add.text(10, 10, pack.name, {
      fontSize: '16px',
      color: nameColor,
      fontStyle: 'bold'
    });
    card.add(nameText);

    // Leader name
    const leaderText = this.scene.add.text(10, 32, pack.factionLeader, {
      fontSize: '12px',
      color: pack.isLocked ? LOCKED_COLOR : LABEL_COLOR
    });
    card.add(leaderText);

    // Difficulty and personality
    const metaText = this.scene.add.text(10, 50, `${pack.difficulty} | ${pack.aiPersonality}`, {
      fontSize: '11px',
      color: pack.isLocked ? LOCKED_COLOR : LABEL_COLOR
    });
    card.add(metaText);

    // Active badge
    if (pack.isActive) {
      const activeBadge = this.scene.add.text(PANEL_WIDTH - PADDING * 2 - 60, 10, 'ACTIVE', {
        fontSize: '10px',
        color: ACTIVE_BADGE_COLOR,
        fontStyle: 'bold'
      });
      card.add(activeBadge);
    }

    // Locked indicator
    if (pack.isLocked) {
      const lockedText = this.scene.add.text(PANEL_WIDTH - PADDING * 2 - 60, 10, 'LOCKED', {
        fontSize: '10px',
        color: LOCKED_COLOR,
        fontStyle: 'bold'
      });
      card.add(lockedText);
    }

    // Interactive area
    if (!pack.isLocked) {
      const hitArea = this.scene.add.rectangle(
        0, 0,
        PANEL_WIDTH - PADDING * 2,
        CARD_HEIGHT,
        0x000000, 0
      );
      hitArea.setOrigin(0, 0);
      hitArea.setInteractive({ useHandCursor: true });

      hitArea.on('pointerover', () => {
        cardBg.clear();
        cardBg.fillStyle(CARD_HOVER_COLOR, 1);
        cardBg.fillRoundedRect(0, 0, PANEL_WIDTH - PADDING * 2, CARD_HEIGHT, 4);
      });

      hitArea.on('pointerout', () => {
        const color = pack.isActive ? CARD_ACTIVE_COLOR : CARD_BG_COLOR;
        cardBg.clear();
        cardBg.fillStyle(color, 1);
        cardBg.fillRoundedRect(0, 0, PANEL_WIDTH - PADDING * 2, CARD_HEIGHT, 4);
      });

      hitArea.on('pointerdown', () => {
        this.selectPack(pack.id);
      });

      card.add(hitArea);
    }

    return card;
  }

  /**
   * Select a pack by ID
   */
  selectPack(packId: string): void {
    const pack = this.packs.find(p => p.id === packId);
    if (!pack || pack.isLocked) {
      return;
    }

    this.selectedPackId = packId;

    if (this.onPackSelected) {
      this.onPackSelected(pack);
    }
  }

  /**
   * Get the currently selected pack ID
   */
  getSelectedPackId(): string | null {
    return this.selectedPackId;
  }

  /**
   * Set difficulty filter
   */
  setDifficultyFilter(difficulty: 'easy' | 'normal' | 'hard' | null): void {
    this.difficultyFilter = difficulty;
    this.renderPackCards();
  }

  /**
   * Set AI personality filter
   */
  setPersonalityFilter(personality: AIPersonality | null): void {
    this.personalityFilter = personality;
    this.renderPackCards();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.difficultyFilter = null;
    this.personalityFilter = null;
    this.renderPackCards();
  }

  /**
   * Get packs after applying filters
   */
  getFilteredPacks(): PackDisplayData[] {
    return this.applyFilters(this.packs);
  }

  /**
   * Apply filters to packs
   */
  private applyFilters(packs: PackDisplayData[]): PackDisplayData[] {
    let filtered = [...packs];

    if (this.difficultyFilter) {
      filtered = filtered.filter(p => p.difficulty === this.difficultyFilter);
    }

    if (this.personalityFilter) {
      filtered = filtered.filter(p => p.aiPersonality === this.personalityFilter);
    }

    return filtered;
  }

  /**
   * Get sorted packs (active first, then featured, then by name)
   */
  getSortedPacks(): PackDisplayData[] {
    return [...this.packs].sort((a, b) => {
      // Active pack first
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;

      // Unlocked before locked
      if (!a.isLocked && b.isLocked) return -1;
      if (a.isLocked && !b.isLocked) return 1;

      // Then by name
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Show the panel
   */
  show(): void {
    this.setVisible(true);
  }

  /**
   * Hide the panel
   */
  hide(): void {
    this.setVisible(false);
  }

  /**
   * Clean up
   */
  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
