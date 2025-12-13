/**
 * VolumeControlPanel
 * Story 12-3: Independent Volume Controls
 *
 * UI panel for audio settings with volume sliders and mute toggle.
 */

import Phaser from 'phaser';
import { AudioManager, VolumeType } from '../../core/AudioManager';

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 350;
const SLIDER_WIDTH = 280;
const SLIDER_HEIGHT = 20;
const SLIDER_PADDING = 50;
const TITLE_HEIGHT = 40;

const COLORS = {
  BACKGROUND: 0x1a1a2e,
  BORDER: 0x4a4a6a,
  SLIDER_TRACK: 0x3a3a5a,
  SLIDER_FILL: 0x4488ff,
  SLIDER_FILL_MUTED: 0x555555,
  TEXT: '#ffffff',
  TEXT_LABEL: '#aaaacc',
  MUTE_ACTIVE: 0xff4444,
  MUTE_INACTIVE: 0x444466
};

/**
 * VolumeControlPanel - UI component for audio volume controls
 */
export class VolumeControlPanel extends Phaser.GameObjects.Container {
  private audioManager: AudioManager;

  // UI Elements
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;

  // Volume sliders (track rectangles for visual representation)
  private masterTrack!: Phaser.GameObjects.Rectangle;
  private masterFill!: Phaser.GameObjects.Rectangle;
  private masterLabel!: Phaser.GameObjects.Text;
  private masterValueLabel!: Phaser.GameObjects.Text;

  private sfxTrack!: Phaser.GameObjects.Rectangle;
  private sfxFill!: Phaser.GameObjects.Rectangle;
  private sfxLabel!: Phaser.GameObjects.Text;
  private sfxValueLabel!: Phaser.GameObjects.Text;

  private musicTrack!: Phaser.GameObjects.Rectangle;
  private musicFill!: Phaser.GameObjects.Rectangle;
  private musicLabel!: Phaser.GameObjects.Text;
  private musicValueLabel!: Phaser.GameObjects.Text;

  // Mute toggle
  private muteButton!: Phaser.GameObjects.Rectangle;
  private muteLabel!: Phaser.GameObjects.Text;
  private muteIndicator!: Phaser.GameObjects.Text;

  // Callbacks
  public onVolumeChanged: ((type: VolumeType, value: number) => void) | null = null;
  public onMuteToggled: ((isMuted: boolean) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.audioManager = AudioManager.getInstance();
    this.setVisible(false);

    this.createBackground();
    this.createTitle();
    this.createVolumeSliders();
    this.createMuteToggle();

    // Subscribe to external mute changes (e.g., Ctrl+M shortcut)
    this.audioManager.onMuteChanged = (_isMuted: boolean) => {
      if (this.visible) {
        this.refresh();
      }
    };

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  // ============================================
  // UI Creation
  // ============================================

  private createBackground(): void {
    this.background = this.scene.add.graphics();
    this.background.fillStyle(COLORS.BACKGROUND, 0.95);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);
    this.background.lineStyle(2, COLORS.BORDER);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);
    this.add(this.background);
  }

  private createTitle(): void {
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, 20, 'Audio Settings', {
      fontSize: '24px',
      color: COLORS.TEXT,
      fontStyle: 'bold'
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.add(this.titleText);
  }

  private createVolumeSliders(): void {
    const startY = TITLE_HEIGHT + 30;

    // Master Volume
    this.createVolumeSlider(
      'Master Volume',
      startY,
      (track, fill, label, valueLabel) => {
        this.masterTrack = track;
        this.masterFill = fill;
        this.masterLabel = label;
        this.masterValueLabel = valueLabel;
      },
      () => this.audioManager.getMasterVolume(),
      (value) => this.setMasterVolume(value)
    );

    // SFX Volume
    this.createVolumeSlider(
      'SFX Volume',
      startY + SLIDER_PADDING + SLIDER_HEIGHT,
      (track, fill, label, valueLabel) => {
        this.sfxTrack = track;
        this.sfxFill = fill;
        this.sfxLabel = label;
        this.sfxValueLabel = valueLabel;
      },
      () => this.audioManager.getSfxVolume(),
      (value) => this.setSfxVolume(value)
    );

    // Music Volume
    this.createVolumeSlider(
      'Music Volume',
      startY + (SLIDER_PADDING + SLIDER_HEIGHT) * 2,
      (track, fill, label, valueLabel) => {
        this.musicTrack = track;
        this.musicFill = fill;
        this.musicLabel = label;
        this.musicValueLabel = valueLabel;
      },
      () => this.audioManager.getMusicVolume(),
      (value) => this.setMusicVolume(value)
    );
  }

  private createVolumeSlider(
    labelText: string,
    y: number,
    assignElements: (
      track: Phaser.GameObjects.Rectangle,
      fill: Phaser.GameObjects.Rectangle,
      label: Phaser.GameObjects.Text,
      valueLabel: Phaser.GameObjects.Text
    ) => void,
    getValue: () => number,
    setValue: (value: number) => void
  ): void {
    const sliderX = (PANEL_WIDTH - SLIDER_WIDTH) / 2;

    // Label
    const label = this.scene.add.text(sliderX, y - 15, labelText, {
      fontSize: '14px',
      color: COLORS.TEXT_LABEL
    });
    this.add(label);

    // Track (background)
    const track = this.scene.add.rectangle(
      sliderX + SLIDER_WIDTH / 2,
      y + SLIDER_HEIGHT / 2,
      SLIDER_WIDTH,
      SLIDER_HEIGHT
    );
    track.setFillStyle(COLORS.SLIDER_TRACK);
    track.setOrigin(0.5, 0.5);
    track.setInteractive({ useHandCursor: true });
    this.add(track);

    // Fill (represents volume level)
    const fillWidth = (getValue() / 100) * SLIDER_WIDTH;
    const fill = this.scene.add.rectangle(
      sliderX,
      y + SLIDER_HEIGHT / 2,
      fillWidth,
      SLIDER_HEIGHT - 4
    );
    fill.setFillStyle(COLORS.SLIDER_FILL);
    fill.setOrigin(0, 0.5);
    this.add(fill);

    // Value label
    const valueLabel = this.scene.add.text(
      sliderX + SLIDER_WIDTH + 10,
      y + SLIDER_HEIGHT / 2,
      `${getValue()}%`,
      {
        fontSize: '14px',
        color: COLORS.TEXT
      }
    );
    valueLabel.setOrigin(0, 0.5);
    this.add(valueLabel);

    // Handle slider click/drag
    track.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const localX = pointer.x - (this.x + sliderX);
      const value = Math.round((localX / SLIDER_WIDTH) * 100);
      setValue(Math.max(0, Math.min(100, value)));
    });

    assignElements(track, fill, label, valueLabel);
  }

  private createMuteToggle(): void {
    const buttonY = PANEL_HEIGHT - 70;
    const buttonX = PANEL_WIDTH / 2;

    // Mute button
    this.muteButton = this.scene.add.rectangle(
      buttonX,
      buttonY,
      120,
      40
    );
    this.muteButton.setFillStyle(
      this.audioManager.isMuted() ? COLORS.MUTE_ACTIVE : COLORS.MUTE_INACTIVE
    );
    this.muteButton.setOrigin(0.5, 0.5);
    this.muteButton.setInteractive({ useHandCursor: true });
    this.add(this.muteButton);

    // Mute label
    this.muteLabel = this.scene.add.text(buttonX, buttonY, 'Mute All', {
      fontSize: '16px',
      color: COLORS.TEXT
    });
    this.muteLabel.setOrigin(0.5, 0.5);
    this.add(this.muteLabel);

    // Mute indicator (shown when muted)
    this.muteIndicator = this.scene.add.text(
      buttonX,
      buttonY + 35,
      this.audioManager.isMuted() ? 'Muted' : '',
      {
        fontSize: '14px',
        color: '#ff4444'
      }
    );
    this.muteIndicator.setOrigin(0.5, 0.5);
    this.add(this.muteIndicator);

    // Handle mute button click
    this.muteButton.on('pointerdown', () => {
      this.toggleMute();
    });
  }

  // ============================================
  // Public Methods
  // ============================================

  /**
   * Get panel title
   */
  public getTitle(): string {
    return 'Audio Settings';
  }

  /**
   * Show the panel
   */
  public show(): void {
    this.setVisible(true);
    this.refresh();
  }

  /**
   * Hide the panel
   */
  public hide(): void {
    this.setVisible(false);
  }

  /**
   * Refresh UI to match AudioManager state
   */
  public refresh(): void {
    this.updateSliderFill(this.masterFill, this.audioManager.getMasterVolume());
    this.updateSliderFill(this.sfxFill, this.audioManager.getSfxVolume());
    this.updateSliderFill(this.musicFill, this.audioManager.getMusicVolume());

    this.masterValueLabel.setText(`${this.audioManager.getMasterVolume()}%`);
    this.sfxValueLabel.setText(`${this.audioManager.getSfxVolume()}%`);
    this.musicValueLabel.setText(`${this.audioManager.getMusicVolume()}%`);

    this.updateMuteVisuals();
  }

  private updateSliderFill(fill: Phaser.GameObjects.Rectangle, value: number): void {
    const fillWidth = (value / 100) * SLIDER_WIDTH;
    fill.width = fillWidth;
    fill.setFillStyle(
      this.audioManager.isMuted() ? COLORS.SLIDER_FILL_MUTED : COLORS.SLIDER_FILL
    );
  }

  private updateMuteVisuals(): void {
    const isMuted = this.audioManager.isMuted();
    this.muteButton.setFillStyle(isMuted ? COLORS.MUTE_ACTIVE : COLORS.MUTE_INACTIVE);
    this.muteLabel.setText(isMuted ? 'Unmute' : 'Mute All');
    this.muteIndicator.setText(isMuted ? 'Audio Muted' : '');
  }

  // ============================================
  // Slider Queries
  // ============================================

  public hasMasterVolumeSlider(): boolean {
    return !!this.masterTrack;
  }

  public hasSfxVolumeSlider(): boolean {
    return !!this.sfxTrack;
  }

  public hasMusicVolumeSlider(): boolean {
    return !!this.musicTrack;
  }

  public hasMuteToggle(): boolean {
    return !!this.muteButton;
  }

  // ============================================
  // Volume Getters
  // ============================================

  public getMasterVolumeValue(): number {
    return this.audioManager.getMasterVolume();
  }

  public getSfxVolumeValue(): number {
    return this.audioManager.getSfxVolume();
  }

  public getMusicVolumeValue(): number {
    return this.audioManager.getMusicVolume();
  }

  public getMasterVolumeLabel(): string {
    return `${this.audioManager.getMasterVolume()}%`;
  }

  public getSfxVolumeLabel(): string {
    return `${this.audioManager.getSfxVolume()}%`;
  }

  public getMusicVolumeLabel(): string {
    return `${this.audioManager.getMusicVolume()}%`;
  }

  // ============================================
  // Volume Setters
  // ============================================

  public setMasterVolume(value: number): void {
    this.audioManager.setMasterVolume(value);
    this.refresh();
    this.onVolumeChanged?.('master', value);
  }

  public setSfxVolume(value: number): void {
    this.audioManager.setSfxVolume(value);
    this.refresh();
    this.onVolumeChanged?.('sfx', value);
  }

  public setMusicVolume(value: number): void {
    this.audioManager.setMusicVolume(value);
    this.refresh();
    this.onVolumeChanged?.('music', value);
  }

  // ============================================
  // Mute
  // ============================================

  public isMuted(): boolean {
    return this.audioManager.isMuted();
  }

  public toggleMute(): void {
    this.audioManager.toggleMute();
    this.refresh();
    this.onMuteToggled?.(this.audioManager.isMuted());
  }

  public getMuteIndicatorText(): string {
    return this.audioManager.isMuted() ? 'Audio Muted' : '';
  }

  // ============================================
  // Settings
  // ============================================

  public saveSettings(): void {
    this.audioManager.saveSettings();
  }

  // ============================================
  // Cleanup
  // ============================================

  public destroy(): void {
    this.background?.destroy();
    this.titleText?.destroy();
    this.masterTrack?.destroy();
    this.masterFill?.destroy();
    this.masterLabel?.destroy();
    this.masterValueLabel?.destroy();
    this.sfxTrack?.destroy();
    this.sfxFill?.destroy();
    this.sfxLabel?.destroy();
    this.sfxValueLabel?.destroy();
    this.musicTrack?.destroy();
    this.musicFill?.destroy();
    this.musicLabel?.destroy();
    this.musicValueLabel?.destroy();
    this.muteButton?.destroy();
    this.muteLabel?.destroy();
    this.muteIndicator?.destroy();
    super.destroy();
  }
}
