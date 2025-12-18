import Phaser from 'phaser';
import { GameState } from '@core/GameState';
import { ResourceDelta, ResourceLevel } from '@core/models/ResourceModels';
import { PhaseProcessor } from '@core/PhaseProcessor';
import { FactionType } from '@core/models/Enums';

/**
 * Configuration options for ResourceHUD
 */
export interface ResourceHUDConfig {
  /** Duration in ms for change animations (default: 1000) */
  animationDurationMs?: number;
  /** Warning threshold - show yellow when below this (default: 500) */
  warningThreshold?: number;
  /** Critical threshold - show red when below this (default: 100) */
  criticalThreshold?: number;
}

/**
 * Resource HUD Component
 * Story 4-1: Displays all five resources with totals and per-turn income.
 *
 * Shows: Credits, Minerals, Fuel, Food, Energy
 * Features:
 * - Current total and per-turn income display
 * - Color-coded resource status (normal, warning, critical)
 * - Update animations for changes
 * - Formatted numbers with thousand separators
 */
export class ResourceHUD extends Phaser.GameObjects.Container {
  private gameState: GameState;
  private phaseProcessor: PhaseProcessor;
  private background: Phaser.GameObjects.Rectangle;

  // Resource display elements
  private creditsText!: Phaser.GameObjects.Text;
  private mineralsText!: Phaser.GameObjects.Text;
  private fuelText!: Phaser.GameObjects.Text;
  private foodText!: Phaser.GameObjects.Text;
  private energyText!: Phaser.GameObjects.Text;

  // Income display elements
  private creditsIncomeText!: Phaser.GameObjects.Text;
  private mineralsIncomeText!: Phaser.GameObjects.Text;
  private fuelIncomeText!: Phaser.GameObjects.Text;
  private foodIncomeText!: Phaser.GameObjects.Text;
  private energyIncomeText!: Phaser.GameObjects.Text;

  // Change animation texts
  private changeAnimations: Map<string, Phaser.GameObjects.Text> = new Map();

  // Previous values for detecting changes
  private previousValues: Map<string, number> = new Map();

  // Last calculated income
  private lastIncome: ResourceDelta = new ResourceDelta();

  // Original callbacks for cleanup
  private originalOnIncomeProcessed?: (playerIncome: ResourceDelta, aiIncome: ResourceDelta) => void;

  // Configuration
  private readonly animationDurationMs: number;
  private readonly warningThreshold: number;
  private readonly criticalThreshold: number;

  // Resource colors
  private static readonly COLORS = {
    credits: '#ffff00',    // Yellow/Gold
    minerals: '#888888',   // Gray
    fuel: '#ff6600',       // Orange
    food: '#00ff00',       // Green
    energy: '#00ffff',     // Cyan
    normal: '#ffffff',     // White (for amounts)
    warning: '#ffaa00',    // Orange (warning)
    critical: '#ff0000',   // Red (critical)
    income: '#88ff88',     // Light green (positive income)
    negative: '#ff8888',   // Light red (negative income)
  };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameState: GameState,
    phaseProcessor: PhaseProcessor,
    config?: ResourceHUDConfig,
  ) {
    super(scene, x, y);
    this.gameState = gameState;
    this.phaseProcessor = phaseProcessor;
    this.animationDurationMs = config?.animationDurationMs ?? 1000;
    this.warningThreshold = config?.warningThreshold ?? 500;
    this.criticalThreshold = config?.criticalThreshold ?? 100;

    // Create background panel
    this.background = scene.add.rectangle(0, 0, 220, 160, 0x000000, 0.8);
    this.background.setStrokeStyle(2, 0x00ff00);
    this.add(this.background);

    // Create header
    const header = scene.add.text(0, -65, 'RESOURCES', {
      fontSize: '14px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(header);

    // Create resource displays
    this.createResourceDisplays();

    // Initialize previous values
    this.initializePreviousValues();

    // Wire up income events
    this.setupIncomeEvents();

    // Calculate initial income before first display (Issue #1 fix)
    this.lastIncome = this.calculateCurrentIncome();

    // Initial update
    this.updateDisplay();

    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Creates all resource display text elements.
   */
  private createResourceDisplays(): void {
    const startY = -45;
    const lineHeight = 22;
    const labelX = -95;
    const valueX = 30;
    const incomeX = 85;

    // Credits
    this.createResourceRow('Credits', ResourceHUD.COLORS.credits, startY, labelX, valueX, incomeX);
    this.creditsText = this.getResourceText('Credits');
    this.creditsIncomeText = this.getIncomeText('Credits');

    // Minerals
    this.createResourceRow('Minerals', ResourceHUD.COLORS.minerals, startY + lineHeight, labelX, valueX, incomeX);
    this.mineralsText = this.getResourceText('Minerals');
    this.mineralsIncomeText = this.getIncomeText('Minerals');

    // Fuel
    this.createResourceRow('Fuel', ResourceHUD.COLORS.fuel, startY + lineHeight * 2, labelX, valueX, incomeX);
    this.fuelText = this.getResourceText('Fuel');
    this.fuelIncomeText = this.getIncomeText('Fuel');

    // Food
    this.createResourceRow('Food', ResourceHUD.COLORS.food, startY + lineHeight * 3, labelX, valueX, incomeX);
    this.foodText = this.getResourceText('Food');
    this.foodIncomeText = this.getIncomeText('Food');

    // Energy
    this.createResourceRow('Energy', ResourceHUD.COLORS.energy, startY + lineHeight * 4, labelX, valueX, incomeX);
    this.energyText = this.getResourceText('Energy');
    this.energyIncomeText = this.getIncomeText('Energy');
  }

  /**
   * Creates a single resource row with label, value, and income.
   */
  private createResourceRow(
    name: string,
    color: string,
    y: number,
    labelX: number,
    valueX: number,
    incomeX: number,
  ): void {
    // Label
    const label = this.scene.add.text(labelX, y, name, {
      fontSize: '12px',
      color: color,
      fontFamily: 'monospace',
    }).setOrigin(0, 0.5);
    this.add(label);

    // Value
    const value = this.scene.add.text(valueX, y, '0', {
      fontSize: '12px',
      color: ResourceHUD.COLORS.normal,
      fontFamily: 'monospace',
    }).setOrigin(1, 0.5);
    value.setName(`resource_${name}`);
    this.add(value);

    // Income
    const income = this.scene.add.text(incomeX, y, '+0', {
      fontSize: '11px',
      color: ResourceHUD.COLORS.income,
      fontFamily: 'monospace',
    }).setOrigin(1, 0.5);
    income.setName(`income_${name}`);
    this.add(income);
  }

  /**
   * Gets a resource text element by name.
   */
  private getResourceText(name: string): Phaser.GameObjects.Text {
    return this.getByName(`resource_${name}`) as Phaser.GameObjects.Text;
  }

  /**
   * Gets an income text element by name.
   */
  private getIncomeText(name: string): Phaser.GameObjects.Text {
    return this.getByName(`income_${name}`) as Phaser.GameObjects.Text;
  }

  /**
   * Initializes previous values for change detection.
   */
  private initializePreviousValues(): void {
    const resources = this.gameState.playerFaction.resources;
    this.previousValues.set('credits', resources.credits);
    this.previousValues.set('minerals', resources.minerals);
    this.previousValues.set('fuel', resources.fuel);
    this.previousValues.set('food', resources.food);
    this.previousValues.set('energy', resources.energy);
  }

  /**
   * Sets up income calculation events.
   */
  private setupIncomeEvents(): void {
    // Save original callback for cleanup
    this.originalOnIncomeProcessed = this.phaseProcessor.onIncomeProcessed;

    // Subscribe to income events
    this.phaseProcessor.onIncomeProcessed = (playerIncome: ResourceDelta, _aiIncome: ResourceDelta) => {
      // Chain with original callback
      this.originalOnIncomeProcessed?.(playerIncome, _aiIncome);

      // Store last income for display
      this.lastIncome = playerIncome;

      // Update display with animations
      this.updateDisplayWithAnimations();

      // Show income summary notification (AC6)
      this.showIncomeSummary(playerIncome);

      // Check for depleted resources (AC5)
      this.checkForDepletedResources();
    };
  }

  /**
   * Shows the income summary notification (AC6).
   */
  private showIncomeSummary(income: ResourceDelta): void {
    const parts: string[] = [];
    if (income.credits !== 0) {parts.push(`+${this.formatNumber(income.credits)} Credits`);}
    if (income.minerals !== 0) {parts.push(`+${this.formatNumber(income.minerals)} Minerals`);}
    if (income.fuel !== 0) {parts.push(`+${this.formatNumber(income.fuel)} Fuel`);}
    if (income.food !== 0) {parts.push(`+${this.formatNumber(income.food)} Food`);}
    if (income.energy !== 0) {parts.push(`+${this.formatNumber(income.energy)} Energy`);}

    if (parts.length === 0) {return;}

    const summaryText = `Income: ${parts.join(', ')}`;

    // Create notification text
    const notification = this.scene.add.text(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height - 80,
      summaryText,
      {
        fontSize: '16px',
        color: ResourceHUD.COLORS.income,
        fontFamily: 'monospace',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: { x: 15, y: 8 },
      },
    ).setOrigin(0.5).setDepth(1000);

    // Fade out after 3 seconds
    this.scene.tweens.add({
      targets: notification,
      alpha: 0,
      duration: 500,
      delay: 3000,
      onComplete: () => notification.destroy(),
    });
  }

  /**
   * Checks for depleted resources and shows warnings (AC5).
   */
  private checkForDepletedResources(): void {
    const resources = this.gameState.playerFaction.resources;

    if (resources.credits === 0) {
      this.showResourceWarning('Credits', 'depleted! Income may be affected.');
    }
    if (resources.minerals === 0) {
      this.showResourceWarning('Minerals', 'depleted! Income may be affected.');
    }
    if (resources.fuel === 0) {
      this.showResourceWarning('Fuel', 'depleted! Income may be affected.');
    }
    if (resources.food === 0) {
      this.showResourceWarning('Food', 'depleted! Income may be affected.');
    }
    if (resources.energy === 0) {
      this.showResourceWarning('Energy', 'depleted! Income may be affected.');
    }
  }

  /**
   * Updates the resource display.
   */
  public updateDisplay(): void {
    const resources = this.gameState.playerFaction.resources;

    // Update each resource
    this.updateResourceDisplay('Credits', this.creditsText, this.creditsIncomeText, resources.credits, this.lastIncome.credits);
    this.updateResourceDisplay('Minerals', this.mineralsText, this.mineralsIncomeText, resources.minerals, this.lastIncome.minerals);
    this.updateResourceDisplay('Fuel', this.fuelText, this.fuelIncomeText, resources.fuel, this.lastIncome.fuel);
    this.updateResourceDisplay('Food', this.foodText, this.foodIncomeText, resources.food, this.lastIncome.food);
    this.updateResourceDisplay('Energy', this.energyText, this.energyIncomeText, resources.energy, this.lastIncome.energy);
  }

  /**
   * Updates display with change animations.
   */
  private updateDisplayWithAnimations(): void {
    const resources = this.gameState.playerFaction.resources;

    // Check for changes and animate
    this.animateChange('credits', this.previousValues.get('credits') || 0, resources.credits, this.creditsText);
    this.animateChange('minerals', this.previousValues.get('minerals') || 0, resources.minerals, this.mineralsText);
    this.animateChange('fuel', this.previousValues.get('fuel') || 0, resources.fuel, this.fuelText);
    this.animateChange('food', this.previousValues.get('food') || 0, resources.food, this.foodText);
    this.animateChange('energy', this.previousValues.get('energy') || 0, resources.energy, this.energyText);

    // Update display
    this.updateDisplay();

    // Store new previous values
    this.previousValues.set('credits', resources.credits);
    this.previousValues.set('minerals', resources.minerals);
    this.previousValues.set('fuel', resources.fuel);
    this.previousValues.set('food', resources.food);
    this.previousValues.set('energy', resources.energy);
  }

  /**
   * Updates a single resource display.
   */
  private updateResourceDisplay(
    _name: string,
    valueText: Phaser.GameObjects.Text,
    incomeText: Phaser.GameObjects.Text,
    total: number,
    income: number,
  ): void {
    // Format value with thousand separators
    valueText.setText(this.formatNumber(total));

    // Determine level and set color
    const level = this.getResourceLevel(total);
    valueText.setStyle({ color: this.getLevelColor(level) });

    // Format income
    const incomeStr = income >= 0 ? `+${this.formatNumber(income)}` : this.formatNumber(income);
    incomeText.setText(incomeStr);
    incomeText.setStyle({ color: income >= 0 ? ResourceHUD.COLORS.income : ResourceHUD.COLORS.negative });
  }

  /**
   * Animates a resource change.
   */
  private animateChange(
    resourceKey: string,
    oldValue: number,
    newValue: number,
    targetText: Phaser.GameObjects.Text,
  ): void {
    const change = newValue - oldValue;
    if (change === 0) {return;}

    // Remove existing animation for this resource
    const existingAnim = this.changeAnimations.get(resourceKey);
    if (existingAnim) {
      existingAnim.destroy();
    }

    // Create change text
    const changeStr = change > 0 ? `+${this.formatNumber(change)}` : this.formatNumber(change);
    const color = change > 0 ? ResourceHUD.COLORS.income : ResourceHUD.COLORS.negative;

    const changeText = this.scene.add.text(targetText.x + 15, targetText.y, changeStr, {
      fontSize: '11px',
      color: color,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    this.add(changeText);
    this.changeAnimations.set(resourceKey, changeText);

    // Animate: float up and fade out
    this.scene.tweens.add({
      targets: changeText,
      y: targetText.y - 15,
      alpha: 0,
      duration: this.animationDurationMs,
      ease: 'Power2',
      onComplete: () => {
        changeText.destroy();
        this.changeAnimations.delete(resourceKey);
      },
    });
  }

  /**
   * Gets the resource level based on amount.
   */
  private getResourceLevel(amount: number): ResourceLevel {
    if (amount < this.criticalThreshold) {
      return ResourceLevel.Critical;
    } else if (amount < this.warningThreshold) {
      return ResourceLevel.Warning;
    }
    return ResourceLevel.Normal;
  }

  /**
   * Gets the color for a resource level.
   */
  private getLevelColor(level: ResourceLevel): string {
    switch (level) {
      case ResourceLevel.Critical:
        return ResourceHUD.COLORS.critical;
      case ResourceLevel.Warning:
        return ResourceHUD.COLORS.warning;
      default:
        return ResourceHUD.COLORS.normal;
    }
  }

  /**
   * Formats a number with thousand separators.
   */
  private formatNumber(num: number): string {
    return num.toLocaleString();
  }

  /**
   * Calculates per-turn income for display.
   * Called to get current income projections.
   */
  public calculateCurrentIncome(): ResourceDelta {
    const incomeSystem = this.phaseProcessor.getIncomeSystem();
    return incomeSystem.calculateFactionIncome(FactionType.Player);
  }

  /**
   * Shows a resource warning notification.
   */
  public showResourceWarning(resourceName: string, message: string): void {
    // Create warning text in center of screen
    const warningText = this.scene.add.text(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height / 2 + 50,
      `${resourceName}: ${message}`,
      {
        fontSize: '20px',
        color: ResourceHUD.COLORS.warning,
        fontFamily: 'monospace',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: { x: 15, y: 8 },
      },
    ).setOrigin(0.5).setDepth(1000);

    // Fade out after 2 seconds
    this.scene.tweens.add({
      targets: warningText,
      alpha: 0,
      duration: 500,
      delay: 2000,
      onComplete: () => warningText.destroy(),
    });
  }

  /**
   * Checks if player can afford a cost.
   */
  public canAfford(cost: { credits?: number; minerals?: number; fuel?: number; food?: number; energy?: number }): boolean {
    const resources = this.gameState.playerFaction.resources;
    return (
      resources.credits >= (cost.credits || 0) &&
      resources.minerals >= (cost.minerals || 0) &&
      resources.fuel >= (cost.fuel || 0) &&
      resources.food >= (cost.food || 0) &&
      resources.energy >= (cost.energy || 0)
    );
  }

  /**
   * Gets missing resources for a cost.
   * AC4 format: "Insufficient [Resource]. Need [X] have [Y]"
   */
  public getMissingResources(cost: { credits?: number; minerals?: number; fuel?: number; food?: number; energy?: number }): string[] {
    const resources = this.gameState.playerFaction.resources;
    const missing: string[] = [];

    if ((cost.credits || 0) > resources.credits) {
      missing.push(`Insufficient Credits. Need ${cost.credits} have ${resources.credits}`);
    }
    if ((cost.minerals || 0) > resources.minerals) {
      missing.push(`Insufficient Minerals. Need ${cost.minerals} have ${resources.minerals}`);
    }
    if ((cost.fuel || 0) > resources.fuel) {
      missing.push(`Insufficient Fuel. Need ${cost.fuel} have ${resources.fuel}`);
    }
    if ((cost.food || 0) > resources.food) {
      missing.push(`Insufficient Food. Need ${cost.food} have ${resources.food}`);
    }
    if ((cost.energy || 0) > resources.energy) {
      missing.push(`Insufficient Energy. Need ${cost.energy} have ${resources.energy}`);
    }

    return missing;
  }

  /**
   * Clean up resources.
   */
  public destroy(): void {
    // Restore original callback
    if (this.originalOnIncomeProcessed !== undefined) {
      this.phaseProcessor.onIncomeProcessed = this.originalOnIncomeProcessed;
    }

    // Clean up change animations
    for (const anim of this.changeAnimations.values()) {
      anim.destroy();
    }
    this.changeAnimations.clear();

    super.destroy();
  }
}
