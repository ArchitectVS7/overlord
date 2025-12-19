/**
 * HowToPlayScene
 * Full-screen help/tutorial scene accessible from main menu.
 */

import Phaser from 'phaser';
import { HELP_CHAPTERS, HelpChapter } from '../data/HelpContent';
import { TopMenuBar } from './ui/TopMenuBar';

const SIDEBAR_WIDTH = 220;
const HEADER_HEIGHT = 80;
const PADDING = 20;
const CHAPTER_BUTTON_HEIGHT = 40;

const COLORS = {
  BACKGROUND: 0x0a0a1a,
  SIDEBAR_BG: 0x151525,
  CONTENT_BG: 0x1a1a2e,
  BORDER: 0x4a9eff,
  TEXT: '#ffffff',
  TEXT_MUTED: '#888899',
  TEXT_ACTIVE: '#00bfff',
  CHAPTER_HOVER: 0x2a2a4e,
  CHAPTER_ACTIVE: 0x3a3a6e,
  SCROLL_TRACK: 0x252545,
  SCROLL_THUMB: 0x4a4a6a,
};

export class HowToPlayScene extends Phaser.Scene {
  private chapterButtons: { bg: Phaser.GameObjects.Rectangle; text: Phaser.GameObjects.Text; chapterId: string }[] = [];
  private contentText!: Phaser.GameObjects.Text;
  private contentContainer!: Phaser.GameObjects.Container;
  private contentMask!: Phaser.GameObjects.Graphics;
  // scrollTrack is created for visual purposes but not referenced after creation
  private scrollThumb!: Phaser.GameObjects.Rectangle;

  private currentChapterId: string = 'quickstart';
  private scrollY: number = 0;
  private maxScrollY: number = 0;
  private isDraggingScroll: boolean = false;
  private dragStartY: number = 0;
  private dragStartScrollY: number = 0;

  private contentX: number = 0;
  private contentY: number = 0;
  private contentWidth: number = 0;
  private contentHeight: number = 0;

  constructor() {
    super({ key: 'HowToPlayScene' });
  }

  public create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, COLORS.BACKGROUND);

    // Top menu bar
    new TopMenuBar(this, { showHome: true });

    // Title
    this.add.text(width / 2, HEADER_HEIGHT / 2 + TopMenuBar.getHeight(), 'HOW TO PLAY', {
      fontSize: '36px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: COLORS.TEXT_ACTIVE,
    }).setOrigin(0.5);

    // Create sidebar
    this.createSidebar(width, height);

    // Create content area
    this.createContentArea(width, height);

    // Setup scrolling
    this.setupScrolling();

    // Load initial chapter
    this.selectChapter('quickstart');
  }

  private createSidebar(_width: number, height: number): void {
    const sidebarX = PADDING;
    const sidebarY = HEADER_HEIGHT + TopMenuBar.getHeight() + PADDING;
    const sidebarHeight = height - sidebarY - PADDING;

    // Sidebar background
    this.add.rectangle(
      sidebarX + SIDEBAR_WIDTH / 2,
      sidebarY + sidebarHeight / 2,
      SIDEBAR_WIDTH,
      sidebarHeight,
      COLORS.SIDEBAR_BG
    ).setStrokeStyle(1, COLORS.BORDER);

    // Chapter buttons
    let buttonY = sidebarY + 15;

    HELP_CHAPTERS.forEach((chapter) => {
      this.createChapterButton(sidebarX + 10, buttonY, chapter.id, chapter.title);
      buttonY += CHAPTER_BUTTON_HEIGHT + 8;
    });
  }

  private createChapterButton(x: number, y: number, chapterId: string, title: string): void {
    const buttonWidth = SIDEBAR_WIDTH - 20;

    const bg = this.add.rectangle(
      x + buttonWidth / 2,
      y + CHAPTER_BUTTON_HEIGHT / 2,
      buttonWidth,
      CHAPTER_BUTTON_HEIGHT,
      0x000000,
      0
    );
    bg.setInteractive({ useHandCursor: true });

    const text = this.add.text(x + 15, y + CHAPTER_BUTTON_HEIGHT / 2, title, {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: COLORS.TEXT_MUTED,
    });
    text.setOrigin(0, 0.5);

    this.chapterButtons.push({ bg, text, chapterId });

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

  private createContentArea(width: number, height: number): void {
    this.contentX = SIDEBAR_WIDTH + PADDING * 2 + 10;
    this.contentY = HEADER_HEIGHT + TopMenuBar.getHeight() + PADDING;
    this.contentWidth = width - this.contentX - PADDING - 20;
    this.contentHeight = height - this.contentY - PADDING;

    // Content background
    this.add.rectangle(
      this.contentX + this.contentWidth / 2,
      this.contentY + this.contentHeight / 2,
      this.contentWidth,
      this.contentHeight,
      COLORS.CONTENT_BG
    ).setStrokeStyle(1, COLORS.BORDER);

    // Create mask for content scrolling
    this.contentMask = this.add.graphics();
    this.contentMask.setVisible(false);
    this.contentMask.fillStyle(0xffffff);
    this.contentMask.fillRect(
      this.contentX + 10,
      this.contentY + 10,
      this.contentWidth - 40,
      this.contentHeight - 20
    );

    // Content container (for scrolling)
    this.contentContainer = this.add.container(this.contentX + 20, this.contentY + 20);
    this.contentContainer.setMask(
      new Phaser.Display.Masks.GeometryMask(this, this.contentMask)
    );

    // Content text
    this.contentText = this.add.text(0, 0, '', {
      fontSize: '15px',
      fontFamily: 'monospace',
      color: COLORS.TEXT,
      lineSpacing: 8,
      wordWrap: { width: this.contentWidth - 60 },
    });
    this.contentContainer.add(this.contentText);

    // Scrollbar track (visual only, not stored)
    const scrollX = this.contentX + this.contentWidth - 18;
    this.add.rectangle(
      scrollX,
      this.contentY + this.contentHeight / 2,
      10,
      this.contentHeight - 20,
      COLORS.SCROLL_TRACK
    );

    // Scrollbar thumb
    this.scrollThumb = this.add.rectangle(
      scrollX,
      this.contentY + 40,
      10,
      80,
      COLORS.SCROLL_THUMB
    );
    this.scrollThumb.setInteractive({ useHandCursor: true, draggable: true });
  }

  private setupScrolling(): void {
    // Mouse wheel scrolling
    this.input.on('wheel', (
      _pointer: Phaser.Input.Pointer,
      _gameObjects: Phaser.GameObjects.GameObject[],
      _deltaX: number,
      deltaY: number
    ) => {
      this.scroll(deltaY * 0.5);
    });

    // Scrollbar dragging
    this.scrollThumb.on('dragstart', (pointer: Phaser.Input.Pointer) => {
      this.isDraggingScroll = true;
      this.dragStartY = pointer.y;
      this.dragStartScrollY = this.scrollY;
    });

    this.scrollThumb.on('drag', (pointer: Phaser.Input.Pointer) => {
      if (this.isDraggingScroll) {
        const deltaY = pointer.y - this.dragStartY;
        const scrollRatio = deltaY / (this.contentHeight - 100);
        const newScrollY = this.dragStartScrollY + scrollRatio * this.maxScrollY;
        this.setScrollY(newScrollY);
      }
    });

    this.scrollThumb.on('dragend', () => {
      this.isDraggingScroll = false;
    });
  }

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
    this.contentContainer.setY(this.contentY + 20);

    // Calculate max scroll
    const textHeight = this.contentText.height;
    this.maxScrollY = Math.max(0, textHeight - this.contentHeight + 60);
    this.updateScrollbar();
  }

  private scroll(delta: number): void {
    this.setScrollY(this.scrollY + delta);
  }

  private setScrollY(value: number): void {
    this.scrollY = Math.max(0, Math.min(this.maxScrollY, value));
    this.contentContainer.setY(this.contentY + 20 - this.scrollY);
    this.updateScrollbar();
  }

  private updateScrollbar(): void {
    if (this.maxScrollY <= 0) {
      this.scrollThumb.setVisible(false);
      return;
    }

    this.scrollThumb.setVisible(true);

    // Calculate thumb position
    const scrollRatio = this.scrollY / this.maxScrollY;
    const thumbTravel = this.contentHeight - 120;
    const thumbY = this.contentY + 40 + scrollRatio * thumbTravel;

    this.scrollThumb.setY(thumbY);
  }
}
