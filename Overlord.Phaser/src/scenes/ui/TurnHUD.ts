import Phaser from 'phaser';
import { GameState } from '@core/GameState';
import { TurnSystem } from '@core/TurnSystem';
import { TurnPhase } from '@core/models/Enums';

/**
 * Configuration options for TurnHUD
 */
export interface TurnHUDConfig {
  /** Delay in ms before auto-advancing Combat/End phases (default: 1500) */
  autoAdvanceDelayMs?: number;
  /** Duration in ms for notification visibility (default: 500) */
  notificationDurationMs?: number;
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
  private notificationTween?: Phaser.Tweens.Tween;

  // Keyboard handler references for cleanup (CRITICAL-1 fix)
  private tKeyHandler?: () => void;

  // Original callbacks for chaining (CRITICAL-2 fix)
  private originalOnPhaseChanged?: (phase: TurnPhase) => void;
  private originalOnTurnStarted?: (turn: number) => void;
  private originalOnTurnEnded?: (turn: number) => void;

  // Configurable timing (MAJOR-4 fix)
  private readonly autoAdvanceDelayMs: number;
  private readonly notificationDurationMs: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameState: GameState,
    turnSystem: TurnSystem,
    config?: TurnHUDConfig
  ) {
    super(scene, x, y);
    this.gameState = gameState;
    this.turnSystem = turnSystem;
    this.autoAdvanceDelayMs = config?.autoAdvanceDelayMs ?? 1500;
    this.notificationDurationMs = config?.notificationDurationMs ?? 500;

    // Background panel
    this.background = scene.add.rectangle(0, 0, 280, 100, 0x000000, 0.7);
    this.background.setStrokeStyle(2, 0x00ff00);
    this.add(this.background);

    // Turn number text (top of HUD)
    this.turnText = scene.add.text(0, -35, '', {
      fontSize: '24px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.turnText);

    // Phase text
    this.phaseText = scene.add.text(0, -5, '', {
      fontSize: '18px',
      color: '#ffff00',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
    this.add(this.phaseText);

    // End Turn button (only visible in Action phase)
    this.endTurnButton = scene.add.text(0, 30, 'END TURN [T]', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'monospace',
      backgroundColor: '#004400',
      padding: { x: 15, y: 6 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.endTurnButton.on('pointerover', () => {
      this.endTurnButton.setStyle({ backgroundColor: '#006600' });
    });

    this.endTurnButton.on('pointerout', () => {
      this.endTurnButton.setStyle({ backgroundColor: '#004400' });
    });

    this.endTurnButton.on('pointerdown', () => {
      this.onEndTurnClicked();
    });

    this.add(this.endTurnButton);

    // Phase notification text (centered on screen, initially hidden)
    this.notificationText = scene.add.text(scene.cameras.main.width / 2, scene.cameras.main.height / 2, '', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: { x: 30, y: 15 },
    })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(1000); // Above other elements

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
    // T key to end turn (only in Action phase)
    // Using T instead of Space/Enter to avoid conflicts with planet selection (MAJOR-2 fix)
    this.tKeyHandler = () => {
      if (this.gameState.currentPhase === TurnPhase.Action) {
        this.onEndTurnClicked();
      }
    };

    this.scene.input.keyboard?.on('keydown-T', this.tKeyHandler);
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

    // Auto-advance Combat and End phases after configurable delay
    // Note: Income auto-advances within TurnSystem
    if (newPhase === TurnPhase.Combat || newPhase === TurnPhase.End) {
      this.scene.time.delayedCall(this.autoAdvanceDelayMs, () => {
        this.turnSystem.advancePhase();
      });
    }
  }

  private showNotification(message: string): void {
    // Cancel any existing notification tween
    if (this.notificationTween) {
      this.notificationTween.stop();
      this.notificationTween.remove();
    }

    // Show notification immediately (NFR-P3: feedback within 100ms)
    this.notificationText.setText(message);
    this.notificationText.setAlpha(1);

    // Fade out after configured duration (MAJOR-1 fix: configurable timing)
    this.notificationTween = this.scene.tweens.add({
      targets: this.notificationText,
      alpha: 0,
      duration: 100, // 100ms fade animation
      delay: this.notificationDurationMs, // Configurable visibility duration
      ease: 'Power2',
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
    if (this.tKeyHandler) {
      this.scene.input.keyboard?.off('keydown-T', this.tKeyHandler);
    }

    // Restore original callbacks (CRITICAL-2 fix)
    if (this.originalOnPhaseChanged !== undefined) {
      this.turnSystem.onPhaseChanged = this.originalOnPhaseChanged;
    }
    if (this.originalOnTurnStarted !== undefined) {
      this.turnSystem.onTurnStarted = this.originalOnTurnStarted;
    }
    if (this.originalOnTurnEnded !== undefined) {
      this.turnSystem.onTurnEnded = this.originalOnTurnEnded;
    }

    // Clean up notification tween
    if (this.notificationTween) {
      this.notificationTween.stop();
      this.notificationTween.remove();
    }

    // Remove notificationText from scene before destroying (MAJOR-3 fix)
    if (this.notificationText.scene) {
      this.notificationText.scene.children.remove(this.notificationText);
    }
    this.notificationText.destroy();

    super.destroy();
  }
}
