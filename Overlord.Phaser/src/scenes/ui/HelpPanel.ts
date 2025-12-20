/**
 * HelpPanel
 * In-game help system with chapter navigation and scrollable content.
 * Fixed to screen, unaffected by camera movement.
 */

import Phaser from 'phaser';
import { HELP_CHAPTERS, HelpChapter } from '../../data/HelpContent';
import { COLORS as THEME_COLORS, TEXT_COLORS, PANEL } from '@config/UITheme';

const PANEL_WIDTH = 800;
const PANEL_HEIGHT = 550;
const SIDEBAR_WIDTH = 180;
const PADDING = PANEL.PADDING;
const HEADER_HEIGHT = 50;
const CHAPTER_BUTTON_HEIGHT = 32;
const PANEL_DEPTH = PANEL.DEPTH_MODAL;

const COLORS = {
  BACKGROUND: THEME_COLORS.PANEL_BG,
  BORDER: THEME_COLORS.BORDER_HIGHLIGHT,
  SIDEBAR_BG: THEME_COLORS.SIDEBAR_BG,
  CONTENT_BG: THEME_COLORS.CONTENT_BG,
  TEXT: TEXT_COLORS.PRIMARY,
  TEXT_MUTED: TEXT_COLORS.SECONDARY,
  TEXT_ACTIVE: TEXT_COLORS.ACCENT,
  CHAPTER_HOVER: THEME_COLORS.BUTTON_SECONDARY,
  CHAPTER_ACTIVE: THEME_COLORS.BUTTON_SECONDARY_HOVER,
  CLOSE_BUTTON: THEME_COLORS.BUTTON_DANGER,
  CLOSE_HOVER: THEME_COLORS.BUTTON_DANGER_HOVER,
  SCROLL_TRACK: THEME_COLORS.PANEL_BG_LIGHT,
  SCROLL_THUMB: THEME_COLORS.BUTTON_SECONDARY,
};

/**
 * HelpPanel - Modal overlay with chapter navigation and content display
 * Uses individual elements with scrollFactor(0) for proper fixed positioning.
 */
export class HelpPanel {
  private scene: Phaser.Scene;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private visible: boolean = false;

  // UI Elements
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panelBackground!: Phaser.GameObjects.Graphics;
  private panelHitArea!: Phaser.GameObjects.Rectangle;
  private titleText!: Phaser.GameObjects.Text;
  private closeButton!: Phaser.GameObjects.Rectangle;
  private closeButtonText!: Phaser.GameObjects.Text;

  // Sidebar
  private sidebarBg!: Phaser.GameObjects.Rectangle;
  private chapterButtons: { container: Phaser.GameObjects.Container; bg: Phaser.GameObjects.Rectangle; text: Phaser.GameObjects.Text; chapterId: string }[] = [];

  // Content area
  private contentBg!: Phaser.GameObjects.Rectangle;
  private contentMask!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private contentText!: Phaser.GameObjects.Text;
  private scrollY: number = 0;
  private maxScrollY: number = 0;

  // Scrollbar
  private scrollTrack!: Phaser.GameObjects.Rectangle;
  private scrollThumb!: Phaser.GameObjects.Rectangle;
  private isDraggingScroll: boolean = false;
  private dragStartY: number = 0;
  private dragStartScrollY: number = 0;

  // State
  private currentChapterId: string = 'quickstart';

  // Callbacks
  public onClose: (() => void) | null = null;

  // Wheel event handler reference for cleanup
  private wheelHandler: ((pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.createBackdrop();
    this.createPanel();
    this.createTitle();
    this.createCloseButton();
    this.createSidebar();
    this.createContentArea();
    this.setupScrolling();

    // Load initial chapter
    this.selectChapter('quickstart');

    // Start hidden
    this.setAllVisible(false);
  }

  // ============================================
  // UI Creation
  // ============================================

  private createBackdrop(): void {
    const { width, height } = this.scene.cameras.main;
    this.backdrop = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(PANEL_DEPTH - 1);
    this.backdrop.setInteractive();
    this.backdrop.on('pointerdown', () => this.hide());
    this.elements.push(this.backdrop);
  }

  private createPanel(): void {
    const { width, height } = this.scene.cameras.main;
    const panelX = (width - PANEL_WIDTH) / 2;
    const panelY = (height - PANEL_HEIGHT) / 2;

    this.panelBackground = this.scene.add.graphics();
    this.panelBackground.setPosition(panelX, panelY);
    this.panelBackground.fillStyle(COLORS.BACKGROUND, 0.98);
    this.panelBackground.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.panelBackground.lineStyle(2, COLORS.BORDER);
    this.panelBackground.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.panelBackground.setScrollFactor(0);
    this.panelBackground.setDepth(PANEL_DEPTH);
    this.elements.push(this.panelBackground);

    // Make panel block backdrop clicks
    this.panelHitArea = this.scene.add.rectangle(
      panelX + PANEL_WIDTH / 2,
      panelY + PANEL_HEIGHT / 2,
      PANEL_WIDTH,
      PANEL_HEIGHT,
      0x000000,
      0
    );
    this.panelHitArea.setScrollFactor(0);
    this.panelHitArea.setDepth(PANEL_DEPTH);
    this.panelHitArea.setInteractive();
    this.elements.push(this.panelHitArea);
  }

  private createTitle(): void {
    const { width, height } = this.scene.cameras.main;
    const panelX = (width - PANEL_WIDTH) / 2;
    const panelY = (height - PANEL_HEIGHT) / 2;

    this.titleText = this.scene.add.text(
      panelX + PADDING,
      panelY + HEADER_HEIGHT / 2,
      'Overlord Help',
      {
        fontSize: '22px',
        fontFamily: 'monospace',
        color: COLORS.TEXT,
      }
    );
    this.titleText.setOrigin(0, 0.5);
    this.titleText.setScrollFactor(0);
    this.titleText.setDepth(PANEL_DEPTH + 1);
    this.elements.push(this.titleText);
  }

  private createCloseButton(): void {
    const { width, height } = this.scene.cameras.main;
    const panelX = (width - PANEL_WIDTH) / 2;
    const panelY = (height - PANEL_HEIGHT) / 2;

    const buttonSize = 32;
    const buttonX = panelX + PANEL_WIDTH - buttonSize - 10;
    const buttonY = panelY + 10;

    this.closeButton = this.scene.add.rectangle(
      buttonX + buttonSize / 2,
      buttonY + buttonSize / 2,
      buttonSize,
      buttonSize,
      COLORS.CLOSE_BUTTON
    );
    this.closeButton.setScrollFactor(0);
    this.closeButton.setDepth(PANEL_DEPTH + 1);
    this.closeButton.setInteractive({ useHandCursor: true });
    this.elements.push(this.closeButton);

    this.closeButtonText = this.scene.add.text(
      buttonX + buttonSize / 2,
      buttonY + buttonSize / 2,
      'X',
      {
        fontSize: '18px',
        fontFamily: 'monospace',
        color: COLORS.TEXT,
      }
    );
    this.closeButtonText.setOrigin(0.5, 0.5);
    this.closeButtonText.setScrollFactor(0);
    this.closeButtonText.setDepth(PANEL_DEPTH + 2);
    this.elements.push(this.closeButtonText);

    this.closeButton.on('pointerover', () => {
      this.closeButton.setFillStyle(COLORS.CLOSE_HOVER);
    });

    this.closeButton.on('pointerout', () => {
      this.closeButton.setFillStyle(COLORS.CLOSE_BUTTON);
    });

    this.closeButton.on('pointerdown', () => {
      this.hide();
    });
  }

  private createSidebar(): void {
    const { width, height } = this.scene.cameras.main;
    const panelX = (width - PANEL_WIDTH) / 2;
    const panelY = (height - PANEL_HEIGHT) / 2;

    // Sidebar background
    this.sidebarBg = this.scene.add.rectangle(
      panelX + SIDEBAR_WIDTH / 2,
      panelY + HEADER_HEIGHT + (PANEL_HEIGHT - HEADER_HEIGHT) / 2,
      SIDEBAR_WIDTH,
      PANEL_HEIGHT - HEADER_HEIGHT,
      COLORS.SIDEBAR_BG
    );
    this.sidebarBg.setScrollFactor(0);
    this.sidebarBg.setDepth(PANEL_DEPTH);
    this.elements.push(this.sidebarBg);

    // Chapter buttons
    let buttonY = panelY + HEADER_HEIGHT + 10;

    HELP_CHAPTERS.forEach((chapter) => {
      this.createChapterButton(
        panelX + 5,
        buttonY,
        chapter.id,
        chapter.title
      );
      buttonY += CHAPTER_BUTTON_HEIGHT + 4;
    });
  }

  private createChapterButton(
    x: number,
    y: number,
    chapterId: string,
    title: string
  ): void {
    const buttonWidth = SIDEBAR_WIDTH - 10;

    const bg = this.scene.add.rectangle(
      x + buttonWidth / 2,
      y + CHAPTER_BUTTON_HEIGHT / 2,
      buttonWidth,
      CHAPTER_BUTTON_HEIGHT,
      0x000000,
      0
    );
    bg.setScrollFactor(0);
    bg.setDepth(PANEL_DEPTH + 1);
    bg.setInteractive({ useHandCursor: true });
    this.elements.push(bg);

    const text = this.scene.add.text(x + 10, y + CHAPTER_BUTTON_HEIGHT / 2, title, {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: COLORS.TEXT_MUTED,
    });
    text.setOrigin(0, 0.5);
    text.setScrollFactor(0);
    text.setDepth(PANEL_DEPTH + 2);
    this.elements.push(text);

    // Store button info
    this.chapterButtons.push({ container: null!, bg, text, chapterId });

    // Hover effects
    bg.on('pointerover', () => {
      if (this.currentChapterId !== chapterId) {
        bg.setFillStyle(COLORS.CHAPTER_HOVER, 1);
      }
    });

    bg.on('pointerout', () => {
      if (this.currentChapterId !== chapterId) {
        bg.setFillStyle(0x000000, 0);
      }
    });

    bg.on('pointerdown', () => {
      this.selectChapter(chapterId);
    });
  }

  private createContentArea(): void {
    const { width, height } = this.scene.cameras.main;
    const panelX = (width - PANEL_WIDTH) / 2;
    const panelY = (height - PANEL_HEIGHT) / 2;

    const contentX = panelX + SIDEBAR_WIDTH + 10;
    const contentY = panelY + HEADER_HEIGHT + 10;
    const contentWidth = PANEL_WIDTH - SIDEBAR_WIDTH - 30;
    const contentHeight = PANEL_HEIGHT - HEADER_HEIGHT - 20;

    // Content background
    this.contentBg = this.scene.add.rectangle(
      contentX + contentWidth / 2,
      contentY + contentHeight / 2,
      contentWidth,
      contentHeight,
      COLORS.CONTENT_BG
    );
    this.contentBg.setScrollFactor(0);
    this.contentBg.setDepth(PANEL_DEPTH);
    this.elements.push(this.contentBg);

    // Create mask for content scrolling
    this.contentMask = this.scene.add.graphics();
    this.contentMask.setVisible(false);
    this.contentMask.fillStyle(0xffffff);
    this.contentMask.fillRect(contentX, contentY, contentWidth - 15, contentHeight);
    this.contentMask.setScrollFactor(0);

    // Content container (for scrolling)
    this.contentContainer = this.scene.add.container(contentX + 10, contentY + 10);
    this.contentContainer.setScrollFactor(0);
    this.contentContainer.setDepth(PANEL_DEPTH + 1);
    this.contentContainer.setMask(
      new Phaser.Display.Masks.GeometryMask(this.scene, this.contentMask)
    );
    this.elements.push(this.contentContainer);

    // Content text
    this.contentText = this.scene.add.text(0, 0, '', {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: COLORS.TEXT,
      lineSpacing: 6,
      wordWrap: { width: contentWidth - 40 },
    });
    this.contentText.setScrollFactor(0);
    this.contentContainer.add(this.contentText);

    // Scrollbar track
    const scrollX = contentX + contentWidth - 12;
    this.scrollTrack = this.scene.add.rectangle(
      scrollX,
      contentY + contentHeight / 2,
      8,
      contentHeight - 10,
      COLORS.SCROLL_TRACK
    );
    this.scrollTrack.setScrollFactor(0);
    this.scrollTrack.setDepth(PANEL_DEPTH + 1);
    this.elements.push(this.scrollTrack);

    // Scrollbar thumb
    this.scrollThumb = this.scene.add.rectangle(
      scrollX,
      contentY + 30,
      8,
      60,
      COLORS.SCROLL_THUMB
    );
    this.scrollThumb.setScrollFactor(0);
    this.scrollThumb.setDepth(PANEL_DEPTH + 2);
    this.scrollThumb.setInteractive({ useHandCursor: true, draggable: true });
    this.elements.push(this.scrollThumb);
  }

  private setupScrolling(): void {
    const contentHeight = PANEL_HEIGHT - HEADER_HEIGHT - 20;

    // Mouse wheel scrolling
    this.wheelHandler = (
      _pointer: Phaser.Input.Pointer,
      _gameObjects: Phaser.GameObjects.GameObject[],
      _deltaX: number,
      deltaY: number
    ) => {
      if (this.visible) {
        this.scroll(deltaY * 0.5);
      }
    };
    this.scene.input.on('wheel', this.wheelHandler);

    // Scrollbar dragging
    this.scrollThumb.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      this.isDraggingScroll = true;
      this.dragStartY = pointer.y;
      this.dragStartScrollY = this.scrollY;
    });

    this.scrollThumb.on('drag', (pointer: Phaser.Input.Pointer) => {
      if (this.isDraggingScroll) {
        const deltaY = pointer.y - this.dragStartY;
        const scrollRatio = deltaY / (contentHeight - 60);
        const newScrollY = this.dragStartScrollY + scrollRatio * this.maxScrollY;
        this.setScrollY(newScrollY);
      }
    });

    this.scrollThumb.on('dragend', () => {
      this.isDraggingScroll = false;
    });
  }

  // ============================================
  // Chapter Selection
  // ============================================

  private selectChapter(chapterId: string): void {
    this.currentChapterId = chapterId;

    // Update button states
    this.chapterButtons.forEach((button) => {
      if (button.chapterId === chapterId) {
        button.bg.setFillStyle(COLORS.CHAPTER_ACTIVE, 1);
        button.text.setColor(COLORS.TEXT_ACTIVE);
      } else {
        button.bg.setFillStyle(0x000000, 0);
        button.text.setColor(COLORS.TEXT_MUTED);
      }
    });

    // Load chapter content
    const chapter = HELP_CHAPTERS.find((c) => c.id === chapterId);
    if (chapter) {
      this.displayContent(chapter);
    }
  }

  private displayContent(chapter: HelpChapter): void {
    this.contentText.setText(chapter.content);
    this.scrollY = 0;
    this.contentContainer.setY(this.getContentBaseY());

    // Calculate max scroll
    const contentHeight = PANEL_HEIGHT - HEADER_HEIGHT - 20;
    const textHeight = this.contentText.height;

    this.maxScrollY = Math.max(0, textHeight - contentHeight + 40);
    this.updateScrollbar();
  }

  private getContentBaseY(): number {
    const { height } = this.scene.cameras.main;
    const panelY = (height - PANEL_HEIGHT) / 2;
    return panelY + HEADER_HEIGHT + 20;
  }

  // ============================================
  // Scrolling
  // ============================================

  private scroll(delta: number): void {
    this.setScrollY(this.scrollY + delta);
  }

  private setScrollY(value: number): void {
    this.scrollY = Math.max(0, Math.min(this.maxScrollY, value));
    this.contentContainer.setY(this.getContentBaseY() - this.scrollY);
    this.updateScrollbar();
  }

  private updateScrollbar(): void {
    if (this.maxScrollY <= 0) {
      this.scrollThumb.setVisible(false);
      return;
    }

    this.scrollThumb.setVisible(this.visible);

    const { height } = this.scene.cameras.main;
    const panelY = (height - PANEL_HEIGHT) / 2;
    const contentY = panelY + HEADER_HEIGHT + 10;
    const contentHeight = PANEL_HEIGHT - HEADER_HEIGHT - 20;

    // Calculate thumb position
    const scrollRatio = this.scrollY / this.maxScrollY;
    const thumbTravel = contentHeight - 70;
    const thumbY = contentY + 30 + scrollRatio * thumbTravel;

    this.scrollThumb.setY(thumbY);
  }

  // ============================================
  // Show/Hide
  // ============================================

  private setAllVisible(visible: boolean): void {
    this.visible = visible;
    for (const element of this.elements) {
      if ('setVisible' in element && typeof (element as { setVisible: (v: boolean) => void }).setVisible === 'function') {
        (element as { setVisible: (v: boolean) => void }).setVisible(visible);
      }
    }
    // Handle content container text separately
    if (this.contentText) {
      this.contentText.setVisible(visible);
    }
  }

  public show(): void {
    this.setAllVisible(true);
    this.selectChapter(this.currentChapterId);
  }

  public hide(): void {
    this.setAllVisible(false);
    this.onClose?.();
  }

  public toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  public isVisible(): boolean {
    return this.visible;
  }

  // ============================================
  // Cleanup
  // ============================================

  public destroy(): void {
    // Remove wheel handler
    if (this.wheelHandler) {
      this.scene.input.off('wheel', this.wheelHandler);
      this.wheelHandler = null;
    }

    // Destroy all elements
    for (const element of this.elements) {
      element.destroy();
    }
    this.elements = [];
    this.chapterButtons = [];
    this.contentMask?.destroy();
  }
}
