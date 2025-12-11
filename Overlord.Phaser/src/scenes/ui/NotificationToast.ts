/**
 * NotificationToast - Simple toast notification system
 * Story 7-1: AI Strategic Decision-Making (Notifications)
 */

import Phaser from 'phaser';

export class NotificationToast extends Phaser.GameObjects.Container {
  private static readonly TOAST_WIDTH = 320;
  private static readonly TOAST_HEIGHT = 60;
  private static readonly PADDING = 12;
  private static readonly DURATION = 4000; // 4 seconds

  private background!: Phaser.GameObjects.Graphics;
  private messageText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, message: string, style: 'info' | 'warning' | 'danger' = 'info') {
    super(scene, x, y);
    scene.add.existing(this);

    // Background with style color
    this.background = scene.add.graphics();
    const bgColor = style === 'danger' ? 0x884444 : style === 'warning' ? 0x886644 : 0x444488;
    this.background.fillStyle(bgColor, 0.9);
    this.background.fillRoundedRect(0, 0, NotificationToast.TOAST_WIDTH, NotificationToast.TOAST_HEIGHT, 8);
    this.background.lineStyle(2, 0xffffff, 0.3);
    this.background.strokeRoundedRect(0, 0, NotificationToast.TOAST_WIDTH, NotificationToast.TOAST_HEIGHT, 8);
    this.add(this.background);

    // Message text
    this.messageText = scene.add.text(
      NotificationToast.PADDING,
      NotificationToast.TOAST_HEIGHT / 2,
      message,
      {
        fontSize: '13px',
        fontFamily: 'Arial',
        color: '#ffffff',
        wordWrap: { width: NotificationToast.TOAST_WIDTH - NotificationToast.PADDING * 2 }
      }
    );
    this.messageText.setOrigin(0, 0.5);
    this.add(this.messageText);

    // Fade in
    this.setAlpha(0);
    scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 200,
      ease: 'Power2'
    });

    // Auto-dismiss
    scene.time.delayedCall(NotificationToast.DURATION, () => this.dismiss());

    this.setDepth(2000);
    this.setScrollFactor(0);
  }

  public dismiss(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => this.destroy()
    });
  }
}

export class NotificationManager {
  private scene: Phaser.Scene;
  private toasts: NotificationToast[] = [];
  private readonly spacing = 70;
  private readonly startY = 80;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public showNotification(message: string, style: 'info' | 'warning' | 'danger' = 'info'): void {
    const camera = this.scene.cameras.main;
    const x = camera.width - 340;
    const y = this.startY + (this.toasts.length * this.spacing);

    const toast = new NotificationToast(this.scene, x, y, message, style);
    this.toasts.push(toast);

    // Remove from tracking when destroyed
    toast.once('destroy', () => {
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
        this.repositionToasts();
      }
    });
  }

  private repositionToasts(): void {
    this.toasts.forEach((toast, index) => {
      const targetY = this.startY + (index * this.spacing);
      this.scene.tweens.add({
        targets: toast,
        y: targetY,
        duration: 200,
        ease: 'Power2'
      });
    });
  }

  public clear(): void {
    this.toasts.forEach(toast => toast.dismiss());
    this.toasts = [];
  }
}
