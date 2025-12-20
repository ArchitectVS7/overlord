import Phaser from 'phaser';
import { GameState } from '@core/GameState';
import { TurnSystem } from '@core/TurnSystem';
import { PhaseProcessor } from '@core/PhaseProcessor';
import { SaveSystem } from '@core/SaveSystem';
import { TurnPhase } from '@core/models/Enums';
import { ResourceDelta } from '@core/models/ResourceModels';
import { COLORS, TEXT_COLORS, FONTS, HUD, PANEL, BUTTON } from '@config/UITheme';

/**
 * Configuration options for TurnHUD
 */
export interface TurnHUDConfig {
  /** Delay in ms before auto-advancing Combat/End phases (default: 1500) */
  autoAdvanceDelayMs?: number;
  /** Duration in ms for notification visibility (default: 1000 per design spec) */
  notificationDurationMs?: number;
  /** Minimum population growth to show notification (default: 10) */
  populationGrowthThreshold?: number;
}

/**
 * Turn HUD Component
 * Displays current turn number, game phase, and End Turn button.
 * Story 2-2: Turn System and Phase Management
 */
export class TurnHUD extends Phaser.GameObjects.Container {
  private turnText: Phaser.GameObjects.Text;
  private phaseText: Phaser.GameObjects.Text;
  private endTurnButton: Phaser.GameObjects.Text;
  private notificationText: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Rectangle;
  private gameState: GameState;
  private turnSystem: TurnSystem;
  private phaseProcessor: PhaseProcessor;
  private notificationTween?: Phaser.Tweens.Tween;

  // Stacked notification support (C4.3-1: design spec requires stacked notifications)
  private notificationStack: Phaser.GameObjects.Text[] = [];
  private readonly maxStackedNotifications = 5;
  private readonly notificationStackSpacing = 60;

  // Keyboard handler references for cleanup (CRITICAL-1 fix)
  private spaceKeyHandler?: () => void;
  private enterKeyHandler?: () => void;

  // Original TurnSystem callbacks for chaining (CRITICAL-2 fix)
  private originalOnPhaseChanged?: (phase: TurnPhase) => void;
  private originalOnTurnStarted?: (turn: number) => void;
  private originalOnTurnEnded?: (turn: number) => void;

  // Original PhaseProcessor callbacks for cleanup (CRITICAL-3 fix)
  private originalOnIncomeProcessed?: (playerIncome: ResourceDelta, aiIncome: ResourceDelta) => void;
  private originalOnBuildingCompleted?: (planetId: number, buildingType: string) => void;
  private originalOnPopulationGrowth?: (planetId: number, growth: number) => void;
  private originalOnPhaseProcessingError?: (phase: TurnPhase, error: string) => void;

  // Configurable timing and thresholds (MAJOR-4, MAJOR-6 fixes)
  private readonly autoAdvanceDelayMs: number;
  private readonly notificationDurationMs: number;
  private readonly populationGrowthThreshold: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameState: GameState,
    turnSystem: TurnSystem,
    phaseProcessor: PhaseProcessor,
    config?: TurnHUDConfig,
  ) {
    super(scene, x, y);
    this.gameState = gameState;
    this.turnSystem = turnSystem;
    this.phaseProcessor = phaseProcessor;
    this.autoAdvanceDelayMs = config?.autoAdvanceDelayMs ?? 1500;
    this.notificationDurationMs = config?.notificationDurationMs ?? 1000; // C2.2-2: Changed from 500 to 1000 per design spec
    this.populationGrowthThreshold = config?.populationGrowthThreshold ?? 10;

    // Wire up phase processor events for notifications
    this.setupPhaseProcessorEvents();

    // Background panel
    this.background = scene.add.rectangle(
      0, 0,
      HUD.TURN_HUD.width,
      HUD.TURN_HUD.height,
      COLORS.PANEL_BG,
      HUD.TURN_HUD.bgAlpha,
    );
    this.background.setStrokeStyle(PANEL.BORDER_WIDTH, COLORS.BORDER_PRIMARY);
    this.add(this.background);

    // Turn number text (top of HUD)
    this.turnText = scene.add.text(0, -35, '', {
      fontSize: FONTS.SIZE_TITLE,
      color: TEXT_COLORS.ACCENT,
      fontFamily: FONTS.PRIMARY,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.turnText);

    // Phase text
    this.phaseText = scene.add.text(0, -5, '', {
      fontSize: FONTS.SIZE_HEADER,
      color: TEXT_COLORS.WARNING, // Yellow for phase indicator
      fontFamily: FONTS.PRIMARY,
    }).setOrigin(0.5);
    this.add(this.phaseText);

    // End Turn button (only visible in Action phase)
    this.endTurnButton = scene.add.text(0, 30, 'END TURN [Space]', {
      fontSize: FONTS.SIZE_BODY,
      color: TEXT_COLORS.PRIMARY,
      fontFamily: FONTS.PRIMARY,
      backgroundColor: `#${BUTTON.PRIMARY.bg.toString(16).padStart(6, '0')}`,
      padding: { x: BUTTON.PADDING_X, y: BUTTON.PADDING_Y },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.endTurnButton.on('pointerover', () => {
      this.endTurnButton.setStyle({ backgroundColor: `#${BUTTON.PRIMARY.bgHover.toString(16).padStart(6, '0')}` });
    });

    this.endTurnButton.on('pointerout', () => {
      this.endTurnButton.setStyle({ backgroundColor: `#${BUTTON.PRIMARY.bg.toString(16).padStart(6, '0')}` });
    });

    this.endTurnButton.on('pointerdown', () => {
      this.onEndTurnClicked();
    });

    this.add(this.endTurnButton);

    // Phase notification text (centered on screen, initially hidden)
    this.notificationText = scene.add.text(scene.cameras.main.width / 2, scene.cameras.main.height / 2, '', {
      fontSize: '48px',
      color: TEXT_COLORS.PRIMARY,
      fontFamily: FONTS.PRIMARY,
      fontStyle: 'bold',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: { x: 30, y: 15 },
    })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(PANEL.DEPTH_NOTIFICATION);

    // Don't add notification to container - it's positioned globally
    scene.add.existing(this.notificationText);

    // Set up keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Subscribe to turn system events
    this.setupTurnSystemEvents();

    // Initial update
    this.update();

    // Add to scene
    scene.add.existing(this);
  }

  private setupKeyboardShortcuts(): void {
    // C2.2-1: Space/Enter to end turn (only in Action phase)
    // Design spec: "spacebar as universal and context sensitive select/continue"
    // When End Turn button is visible (Action phase), Space/Enter triggers it
    this.spaceKeyHandler = () => {
      if (this.gameState.currentPhase === TurnPhase.Action && this.endTurnButton.visible) {
        this.onEndTurnClicked();
      }
    };

    this.enterKeyHandler = () => {
      if (this.gameState.currentPhase === TurnPhase.Action && this.endTurnButton.visible) {
        this.onEndTurnClicked();
      }
    };

    this.scene.input.keyboard?.on('keydown-SPACE', this.spaceKeyHandler);
    this.scene.input.keyboard?.on('keydown-ENTER', this.enterKeyHandler);
  }

  private setupTurnSystemEvents(): void {
    // Save original callbacks for chaining (CRITICAL-2 fix)
    this.originalOnPhaseChanged = this.turnSystem.onPhaseChanged;
    this.originalOnTurnStarted = this.turnSystem.onTurnStarted;
    this.originalOnTurnEnded = this.turnSystem.onTurnEnded;

    // Subscribe to phase changes (chain with existing callbacks)
    this.turnSystem.onPhaseChanged = (newPhase: TurnPhase) => {
      this.originalOnPhaseChanged?.(newPhase);
      this.onPhaseChanged(newPhase);
    };

    // Subscribe to turn start (chain with existing callbacks)
    this.turnSystem.onTurnStarted = (newTurn: number) => {
      this.originalOnTurnStarted?.(newTurn);
      this.showNotification(`Turn ${newTurn}`);
      this.update();
    };

    // Subscribe to turn end (chain with existing callbacks)
    this.turnSystem.onTurnEnded = (turn: number) => {
      this.originalOnTurnEnded?.(turn);
      this.showNotification(`Turn ${turn} Complete`);
    };
  }

  private setupPhaseProcessorEvents(): void {
    // Save original callbacks for cleanup (CRITICAL-3 fix)
    this.originalOnIncomeProcessed = this.phaseProcessor.onIncomeProcessed;
    this.originalOnBuildingCompleted = this.phaseProcessor.onBuildingCompleted;
    this.originalOnPopulationGrowth = this.phaseProcessor.onPopulationGrowth;
    this.originalOnPhaseProcessingError = this.phaseProcessor.onPhaseProcessingError;

    // Income processing notifications (Story 2-3: AC-1)
    this.phaseProcessor.onIncomeProcessed = (playerIncome: ResourceDelta, aiIncome: ResourceDelta) => {
      this.originalOnIncomeProcessed?.(playerIncome, aiIncome);
      const summary = this.formatIncomeSummary(playerIncome, 'Income');
      this.showNotification(summary);
    };

    // Building completion notifications (Story 2-3: AC-5)
    this.phaseProcessor.onBuildingCompleted = (planetId: number, buildingType: string) => {
      this.originalOnBuildingCompleted?.(planetId, buildingType);
      const planet = this.gameState.planetLookup.get(planetId);
      if (planet) {
        this.showNotification(`${buildingType} completed on ${planet.name}`);
      }
    };

    // Population growth notifications (Story 2-3: AC-5)
    // Uses configurable threshold (MAJOR-6 fix)
    this.phaseProcessor.onPopulationGrowth = (planetId: number, growth: number) => {
      this.originalOnPopulationGrowth?.(planetId, growth);
      const planet = this.gameState.planetLookup.get(planetId);
      if (planet && growth >= this.populationGrowthThreshold) {
        this.showNotification(`${planet.name}: +${growth} population`);
      }
    };

    // Error handling (Story 2-3: AC-6) with auto-save (C2.3-2)
    this.phaseProcessor.onPhaseProcessingError = (phase: TurnPhase, error: string) => {
      this.originalOnPhaseProcessingError?.(phase, error);
      console.error(`Phase processing error in ${this.getPhaseDisplayName(phase)}:`, error);

      // C2.3-2: Auto-save on phase error before showing notification
      try {
        const saveSystem = new SaveSystem(this.gameState);
        saveSystem.saveToLocalStorage('autosave_error', '0.4.0-economy', 0, `Error Recovery - Turn ${this.gameState.currentTurn}`);
        console.log('Auto-save completed due to phase error');
        this.showNotification(`Error: ${error} (auto-saved)`);
      } catch (saveError) {
        console.error('Auto-save failed:', saveError);
        this.showNotification(`Error: ${error}`);
      }
    };
  }

  private onEndTurnClicked(): void {
    if (this.gameState.currentPhase !== TurnPhase.Action) {
      return; // Can only end turn in Action phase
    }

    // Advance to Combat phase
    this.turnSystem.advancePhase();
  }

  private onPhaseChanged(newPhase: TurnPhase): void {
    // Show phase transition notification (appears immediately per NFR-P3)
    this.showNotification(`${this.getPhaseDisplayName(newPhase)} Phase`);
    this.update();

    // Process the phase using PhaseProcessor (Story 2-3)
    // This handles Income calculations, End phase building/population updates, etc.
    const result = this.phaseProcessor.processPhase(newPhase);
    if (!result.success) {
      console.error(`Phase processing failed: ${result.error}`);
    }

    // Auto-advance Combat and End phases after configurable delay
    // Note: Income auto-advances within TurnSystem
    if (newPhase === TurnPhase.Combat || newPhase === TurnPhase.End) {
      this.scene.time.delayedCall(this.autoAdvanceDelayMs, () => {
        this.turnSystem.advancePhase();
      });
    }
  }

  /**
   * Shows a stacked notification (C4.3-1: design spec requires stacked notifications)
   * Multiple notifications appear in a vertical stack instead of replacing each other.
   */
  private showNotification(message: string): void {
    const startTime = performance.now();
    const { width, height } = this.scene.cameras.main;

    // Calculate position based on current stack size
    const stackIndex = this.notificationStack.length;
    const baseY = height / 2 - (this.maxStackedNotifications * this.notificationStackSpacing) / 2;
    const notificationY = baseY + stackIndex * this.notificationStackSpacing;

    // Create new notification text
    const notification = this.scene.add.text(width / 2, notificationY, message, {
      fontSize: '32px',
      color: TEXT_COLORS.PRIMARY,
      fontFamily: FONTS.PRIMARY,
      fontStyle: 'bold',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: { x: 20, y: 10 },
    })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(PANEL.DEPTH_NOTIFICATION + stackIndex);

    // Add to stack
    this.notificationStack.push(notification);

    // Fade in immediately (NFR-P3: feedback within 100ms)
    this.scene.tweens.add({
      targets: notification,
      alpha: 1,
      duration: 50,
      ease: 'Power2',
    });

    // Verify notification timing (CRITICAL-2 fix: AC-5 instrumentation)
    const displayTime = performance.now() - startTime;
    if (displayTime > 100) {
      console.warn(`Notification exceeded 100ms target: ${displayTime.toFixed(2)}ms`);
    }

    // Fade out and remove after configured duration
    this.scene.tweens.add({
      targets: notification,
      alpha: 0,
      duration: 100,
      delay: this.notificationDurationMs,
      ease: 'Power2',
      onComplete: () => {
        // Remove from stack
        const index = this.notificationStack.indexOf(notification);
        if (index > -1) {
          this.notificationStack.splice(index, 1);
        }
        notification.destroy();

        // Reposition remaining notifications to fill gap
        this.repositionNotificationStack();
      },
    });

    // If stack exceeds max, remove oldest notification early
    if (this.notificationStack.length > this.maxStackedNotifications) {
      const oldest = this.notificationStack.shift();
      if (oldest) {
        this.scene.tweens.killTweensOf(oldest);
        oldest.destroy();
        this.repositionNotificationStack();
      }
    }
  }

  /**
   * Repositions the notification stack after removal (C4.3-1)
   */
  private repositionNotificationStack(): void {
    const { height } = this.scene.cameras.main;
    const baseY = height / 2 - (this.maxStackedNotifications * this.notificationStackSpacing) / 2;

    this.notificationStack.forEach((notification, index) => {
      const targetY = baseY + index * this.notificationStackSpacing;
      this.scene.tweens.add({
        targets: notification,
        y: targetY,
        duration: 150,
        ease: 'Power2',
      });
    });
  }

  private getPhaseDisplayName(phase: TurnPhase): string {
    switch (phase) {
      case TurnPhase.Income:
        return 'Income';
      case TurnPhase.Action:
        return 'Action';
      case TurnPhase.Combat:
        return 'Combat';
      case TurnPhase.End:
        return 'End';
      default:
        return 'Unknown';
    }
  }

  /**
   * Formats an income summary for notification display.
   * UI-layer formatting (moved from Core per architecture requirements).
   */
  private formatIncomeSummary(income: ResourceDelta, label: string): string {
    const parts: string[] = [];

    if (income.credits > 0) {parts.push(`+${income.credits} Credits`);}
    if (income.minerals > 0) {parts.push(`+${income.minerals} Minerals`);}
    if (income.fuel > 0) {parts.push(`+${income.fuel} Fuel`);}
    if (income.food > 0) {parts.push(`+${income.food} Food`);}
    if (income.energy > 0) {parts.push(`+${income.energy} Energy`);}

    if (parts.length === 0) {
      return `${label}: No income`;
    }

    return `${label}: ${parts.join(', ')}`;
  }

  public update(): void {
    // Update turn text
    this.turnText.setText(`Turn ${this.gameState.currentTurn}`);

    // Update phase text
    this.phaseText.setText(`${this.getPhaseDisplayName(this.gameState.currentPhase)} Phase`);

    // Show/hide End Turn button based on phase
    if (this.gameState.currentPhase === TurnPhase.Action) {
      this.endTurnButton.setVisible(true);
      this.endTurnButton.setInteractive({ useHandCursor: true });
    } else {
      this.endTurnButton.setVisible(false);
      this.endTurnButton.disableInteractive();
    }
  }

  public destroy(): void {
    // Clean up keyboard listeners (CRITICAL-1 fix)
    if (this.spaceKeyHandler) {
      this.scene.input.keyboard?.off('keydown-SPACE', this.spaceKeyHandler);
    }
    if (this.enterKeyHandler) {
      this.scene.input.keyboard?.off('keydown-ENTER', this.enterKeyHandler);
    }

    // Restore original TurnSystem callbacks (CRITICAL-2 fix)
    if (this.originalOnPhaseChanged !== undefined) {
      this.turnSystem.onPhaseChanged = this.originalOnPhaseChanged;
    }
    if (this.originalOnTurnStarted !== undefined) {
      this.turnSystem.onTurnStarted = this.originalOnTurnStarted;
    }
    if (this.originalOnTurnEnded !== undefined) {
      this.turnSystem.onTurnEnded = this.originalOnTurnEnded;
    }

    // Restore original PhaseProcessor callbacks (CRITICAL-3 fix)
    if (this.originalOnIncomeProcessed !== undefined) {
      this.phaseProcessor.onIncomeProcessed = this.originalOnIncomeProcessed;
    }
    if (this.originalOnBuildingCompleted !== undefined) {
      this.phaseProcessor.onBuildingCompleted = this.originalOnBuildingCompleted;
    }
    if (this.originalOnPopulationGrowth !== undefined) {
      this.phaseProcessor.onPopulationGrowth = this.originalOnPopulationGrowth;
    }
    if (this.originalOnPhaseProcessingError !== undefined) {
      this.phaseProcessor.onPhaseProcessingError = this.originalOnPhaseProcessingError;
    }

    // Clean up notification tween (legacy)
    if (this.notificationTween) {
      this.notificationTween.stop();
      this.notificationTween.remove();
    }

    // Clean up stacked notifications (C4.3-1)
    for (const notification of this.notificationStack) {
      this.scene.tweens.killTweensOf(notification);
      notification.destroy();
    }
    this.notificationStack = [];

    // Remove notificationText from scene before destroying (MAJOR-3 fix)
    if (this.notificationText.scene) {
      this.notificationText.scene.children.remove(this.notificationText);
    }
    this.notificationText.destroy();

    super.destroy();
  }
}
