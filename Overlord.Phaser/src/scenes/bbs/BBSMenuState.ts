import { BBSRenderer } from './BBSRenderer';
import { BBSColors } from './BBSColors';

/**
 * Available menu screens
 */
export enum MenuScreen {
  StartMenu = 'START_MENU',
  InGame = 'IN_GAME',
  Galaxy = 'GALAXY',
  Planet = 'PLANET',
  Build = 'BUILD',
  Shipyard = 'SHIPYARD',
  Commission = 'COMMISSION',
  MoveFleet = 'MOVE_FLEET',
  Attack = 'ATTACK',
  TaxRate = 'TAX_RATE',
  Research = 'RESEARCH',
  GameLog = 'GAME_LOG',
  Help = 'HELP',
  HowToPlay = 'HOW_TO_PLAY',
  Victory = 'VICTORY',
  Defeat = 'DEFEAT',
}

/**
 * UAT test modes available from start menu
 */
export enum UATMode {
  None = 0,
  UAT1_CoreMenus = 1,
  UAT2_DisplayScreens = 2,
  UAT3_PlayerEconomy = 3,
  UAT4_CombatVictory = 4,
  UAT5_AIOpponent = 5,
  UAT6_DebugLogging = 6,
}

/**
 * Menu state data passed between screens
 */
export interface MenuContext {
  selectedPlanetId?: number;
  selectedCraftId?: number;
  selectedPlatoonId?: number;
  listIndex?: number;
  uatMode?: UATMode;
  howToPlayChapter?: number;
  howToPlayScroll?: number;
}

/**
 * Base interface for menu screens
 */
export interface IMenuScreen {
  render(renderer: BBSRenderer, context: MenuContext): void;
  handleInput(key: string, context: MenuContext): MenuTransition | null;
}

/**
 * Transition to a new menu screen
 */
export interface MenuTransition {
  screen: MenuScreen;
  context?: Partial<MenuContext>;
}

/**
 * BBSMenuState - Menu state machine for BBS interface
 * Manages screen stack and transitions
 */
export class BBSMenuState {
  private screenStack: MenuScreen[] = [];
  private context: MenuContext = {};
  private screens: Map<MenuScreen, IMenuScreen> = new Map();

  // Callbacks
  public onScreenChange?: (screen: MenuScreen) => void;
  public onAction?: (action: string, data?: any) => void;
  public onEscapeBack?: () => void;

  constructor() {
    // Start at the start menu
    this.screenStack = [MenuScreen.StartMenu];
  }

  /**
   * Register a screen handler
   */
  public registerScreen(screen: MenuScreen, handler: IMenuScreen): void {
    this.screens.set(screen, handler);
  }

  /**
   * Get current screen
   */
  public getCurrentScreen(): MenuScreen {
    return this.screenStack[this.screenStack.length - 1] || MenuScreen.StartMenu;
  }

  /**
   * Get current context
   */
  public getContext(): MenuContext {
    return { ...this.context };
  }

  /**
   * Update context
   */
  public updateContext(updates: Partial<MenuContext>): void {
    this.context = { ...this.context, ...updates };
  }

  /**
   * Push a new screen onto the stack
   */
  public pushScreen(screen: MenuScreen, contextUpdates?: Partial<MenuContext>): void {
    if (contextUpdates) {
      this.context = { ...this.context, ...contextUpdates };
    }
    this.screenStack.push(screen);
    this.onScreenChange?.(screen);
  }

  /**
   * Pop current screen and return to previous
   */
  public popScreen(): MenuScreen {
    if (this.screenStack.length > 1) {
      this.screenStack.pop();
    }
    const current = this.getCurrentScreen();
    this.onScreenChange?.(current);
    return current;
  }

  /**
   * Replace current screen (no stack change)
   */
  public replaceScreen(screen: MenuScreen, contextUpdates?: Partial<MenuContext>): void {
    if (contextUpdates) {
      this.context = { ...this.context, ...contextUpdates };
    }
    this.screenStack[this.screenStack.length - 1] = screen;
    this.onScreenChange?.(screen);
  }

  /**
   * Clear stack and go to specific screen
   */
  public goToScreen(screen: MenuScreen, contextUpdates?: Partial<MenuContext>): void {
    this.context = contextUpdates || {};
    this.screenStack = [screen];
    this.onScreenChange?.(screen);
  }

  /**
   * Render current screen
   */
  public render(renderer: BBSRenderer): void {
    const currentScreen = this.getCurrentScreen();
    const handler = this.screens.get(currentScreen);

    if (handler) {
      handler.render(renderer, this.context);
    } else {
      // Default fallback - show error
      renderer.putCentered(15, `Screen not implemented: ${currentScreen}`, BBSColors.error);
    }
  }

  /**
   * Handle keyboard input for current screen
   */
  public handleInput(key: string): void {
    const currentScreen = this.getCurrentScreen();
    const handler = this.screens.get(currentScreen);

    // Global keys
    if (key === 'Escape') {
      if (this.screenStack.length > 1) {
        this.popScreen();
        this.onEscapeBack?.();
        return;
      }
    }

    if (handler) {
      const transition = handler.handleInput(key, this.context);
      if (transition) {
        this.applyTransition(transition);
      }
    }
  }

  /**
   * Apply a menu transition
   */
  private applyTransition(transition: MenuTransition): void {
    if (transition.context) {
      this.context = { ...this.context, ...transition.context };
    }
    this.pushScreen(transition.screen);
  }

  /**
   * Check if we can go back
   */
  public canGoBack(): boolean {
    return this.screenStack.length > 1;
  }

  /**
   * Get screen stack depth
   */
  public getStackDepth(): number {
    return this.screenStack.length;
  }

  /**
   * Check if a specific UAT mode is active
   */
  public isUATModeActive(mode: UATMode): boolean {
    return this.context.uatMode === mode || (this.context.uatMode ?? 0) >= mode;
  }

  /**
   * Reset to start menu
   */
  public reset(): void {
    this.context = {};
    this.screenStack = [MenuScreen.StartMenu];
    this.onScreenChange?.(MenuScreen.StartMenu);
  }
}
