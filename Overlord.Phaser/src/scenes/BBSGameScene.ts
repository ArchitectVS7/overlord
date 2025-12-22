import Phaser from 'phaser';
import { BBSRenderer } from './bbs/BBSRenderer';
import { BBSMenuState, MenuScreen, MenuContext, MenuTransition } from './bbs/BBSMenuState';
import { BBSGameController } from './bbs/BBSGameController';
import { BBSColors } from './bbs/BBSColors';
import { UATTaskTracker, UATTask } from './bbs/UATTaskTracker';
import { ActivityLogger } from './bbs/ActivityLogger';
import { TurnPhase, VictoryResult, FactionType, BuildingType, CraftType, EquipmentLevel, WeaponLevel } from '@core/models/Enums';
import { BuildingCosts } from '@core/models/BuildingModels';

/**
 * BBSGameScene - Main BBS-style text interface scene
 * Amber terminal aesthetic with keyboard-driven menus
 */
export class BBSGameScene extends Phaser.Scene {
  private bbsRenderer!: BBSRenderer;
  private menuState!: BBSMenuState;
  private controller!: BBSGameController;
  private uatTracker!: UATTaskTracker;
  private logger!: ActivityLogger;

  // Message log (visible to user)
  private messages: string[] = [];
  private maxMessages = 4;

  // Success notification (flashes briefly)
  private successMessage: string | null = null;

  constructor() {
    super({ key: 'BBSGameScene' });
  }

  create(): void {
    // Set background color
    this.cameras.main.setBackgroundColor(BBSColors.background);

    // Initialize components
    this.bbsRenderer = new BBSRenderer(this);
    this.menuState = new BBSMenuState();
    this.controller = new BBSGameController();
    this.uatTracker = new UATTaskTracker();
    this.logger = new ActivityLogger();

    // Wire UAT task completion
    this.uatTracker.onTaskComplete = (task: UATTask) => {
      this.showSuccess(task.successMsg);
      this.logger.log('SYSTEM', 'UAT_COMPLETE', `${task.number}: ${task.successMsg}`);
    };

    this.uatTracker.onAllComplete = () => {
      this.showSuccess('ALL UAT TASKS COMPLETE! Testing phase finished.');
      this.logger.log('SYSTEM', 'UAT_ALL_COMPLETE', 'All testing tasks completed');
    };

    // Register screen handlers
    this.registerScreens();

    // Wire controller events
    this.controller.onMessage = (msg: string) => {
      this.addMessage(msg);
      this.logger.logGame('MESSAGE', msg);
    };

    this.controller.onGameOver = (result: VictoryResult) => {
      this.logger.logGame('GAME_OVER', VictoryResult[result]);
      if (result === VictoryResult.PlayerVictory) {
        this.menuState.goToScreen(MenuScreen.Victory);
      } else {
        this.menuState.goToScreen(MenuScreen.Defeat);
      }
    };

    this.controller.onAIAction = (action: string, details: string) => {
      this.logger.logAI(action, details);
    };

    // Wire menu state events
    this.menuState.onScreenChange = () => {
      this.logger.setScreen(this.menuState.getCurrentScreen());
      this.renderScreen();
    };

    this.menuState.onEscapeBack = () => {
      this.logger.logUser('KEY_ESC', 'Navigated back');
      this.uatTracker.completeTask('nav_back');
    };

    // Set up keyboard input
    this.setupKeyboardInput();

    // Initial render
    this.renderScreen();
  }

  /**
   * Register all menu screen handlers
   */
  private registerScreens(): void {
    this.menuState.registerScreen(MenuScreen.StartMenu, {
      render: (r, ctx) => this.renderStartMenu(r, ctx),
      handleInput: (key, ctx) => this.handleStartMenuInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.InGame, {
      render: (r, ctx) => this.renderInGameMenu(r, ctx),
      handleInput: (key, ctx) => this.handleInGameMenuInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Galaxy, {
      render: (r, ctx) => this.renderGalaxyScreen(r, ctx),
      handleInput: (key, ctx) => this.handleGalaxyInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Planet, {
      render: (r, ctx) => this.renderPlanetScreen(r, ctx),
      handleInput: (key, ctx) => this.handlePlanetInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Help, {
      render: (r, ctx) => this.renderHelpScreen(r, ctx),
      handleInput: (key, ctx) => this.handleHelpInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.HowToPlay, {
      render: (r, ctx) => this.renderHowToPlayScreen(r, ctx),
      handleInput: (key, ctx) => this.handleHowToPlayInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Build, {
      render: (r, ctx) => this.renderBuildScreen(r, ctx),
      handleInput: (key, ctx) => this.handleBuildInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Shipyard, {
      render: (r, ctx) => this.renderShipyardScreen(r, ctx),
      handleInput: (key, ctx) => this.handleShipyardInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Commission, {
      render: (r, ctx) => this.renderCommissionScreen(r, ctx),
      handleInput: (key, ctx) => this.handleCommissionInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.MoveFleet, {
      render: (r, ctx) => this.renderMoveFleetScreen(r, ctx),
      handleInput: (key, ctx) => this.handleMoveFleetInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Attack, {
      render: (r, ctx) => this.renderAttackScreen(r, ctx),
      handleInput: (key, ctx) => this.handleAttackInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.TaxRate, {
      render: (r, ctx) => this.renderTaxRateScreen(r, ctx),
      handleInput: (key, ctx) => this.handleTaxRateInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Research, {
      render: (r, ctx) => this.renderResearchScreen(r, ctx),
      handleInput: (key, ctx) => this.handleResearchInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Victory, {
      render: (r, ctx) => this.renderVictoryScreen(r, ctx),
      handleInput: (key, ctx) => this.handleVictoryInput(key, ctx),
    });

    this.menuState.registerScreen(MenuScreen.Defeat, {
      render: (r, ctx) => this.renderDefeatScreen(r, ctx),
      handleInput: (key, ctx) => this.handleDefeatInput(key, ctx),
    });
  }

  private setupKeyboardInput(): void {
    // Use window event listener for more reliable keyboard capture
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      try {
        // Prevent default browser behavior for navigation keys
        if (event.key.startsWith('Arrow') || event.key === 'PageUp' || event.key === 'PageDown' || event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
        }
        const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
        this.logger.logUser('KEY_PRESS', key);
        this.menuState.handleInput(key);
        this.renderScreen();
      } catch (err) {
        console.error('Keyboard input error:', err);
      }
    });
  }

  private addMessage(msg: string): void {
    this.messages.unshift(msg);
    if (this.messages.length > this.maxMessages) {
      this.messages.pop();
    }
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.addMessage(msg);
    // Clear after 3 seconds
    this.time.delayedCall(3000, () => {
      if (this.successMessage === msg) {
        this.successMessage = null;
        this.renderScreen();
      }
    });
  }

  private renderScreen(): void {
    this.bbsRenderer.clear();
    this.menuState.render(this.bbsRenderer);
  }

  // ============ Start Menu Screen ============

  private renderStartMenu(r: BBSRenderer, _ctx: MenuContext): void {
    r.drawBox(0, 0, 64, 28);

    // Title
    r.putCentered(2, 'O V E R L O R D', BBSColors.textBright);
    r.putCentered(3, 'BBS Edition v1.0', BBSColors.textDim);

    r.drawHorizontalLine(0, 5, 64);

    // Main options
    const hasActiveGame = this.controller.isGameStarted() && !this.controller.isGameOver();

    if (hasActiveGame) {
      r.putMenuItem(4, 7, 'C', 'Continue Campaign');
      r.putMenuItem(4, 8, 'N', 'New Campaign (resets progress)');
    } else {
      r.putMenuItem(4, 7, 'N', 'New Campaign');
    }

    r.putMenuItem(4, 9, 'L', 'Load Campaign (Coming Soon)', false);  // Disabled

    r.drawHorizontalLine(0, 11, 64);

    // Help & Info
    r.putMenuItem(4, 13, 'H', 'How to Play');

    r.drawHorizontalLine(0, 15, 64);

    // Game modes (coming soon)
    r.putMenuItem(4, 17, 'F', 'Flash Conflicts (Coming Soon)', false);
    r.putMenuItem(4, 18, 'S', 'Statistics (Coming Soon)', false);

    r.drawHorizontalLine(0, 20, 64);

    // Debug options
    r.putMenuItem(4, 22, 'D', 'Download Debug Log');

    r.drawHorizontalLine(0, 24, 64);

    r.putString(2, 26, 'Conquer the galaxy. Build your empire.', BBSColors.textDim);
  }

  private handleStartMenuInput(key: string, _ctx: MenuContext): MenuTransition | null {
    switch (key) {
      case 'C':
        // Continue existing campaign if available
        if (this.controller.isGameStarted() && !this.controller.isGameOver()) {
          this.logger.log('SYSTEM', 'CONTINUE_CAMPAIGN', 'Resuming campaign');
          return { screen: MenuScreen.InGame };
        }
        return null;
      case 'N':
        this.logger.log('SYSTEM', 'NEW_CAMPAIGN', 'Starting new campaign');
        this.controller.startNewCampaign();
        this.logger.setTurn(1);
        this.uatTracker.reset();
        return { screen: MenuScreen.InGame };
      case 'H':
        this.logger.logUser('OPEN_HOW_TO_PLAY', 'Opening How to Play');
        return { screen: MenuScreen.HowToPlay, context: { howToPlayChapter: 0, howToPlayScroll: 0 } };
      case 'D':
        this.logger.downloadLog('json');
        this.addMessage('Debug log downloaded');
        return null;
      default:
        return null;
    }
  }

  // ============ In-Game Menu Screen ============

  private renderInGameMenu(r: BBSRenderer, _ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    r.drawBox(0, 0, 64, 32);

    // Title bar
    r.putCentered(1, 'O V E R L O R D', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    // Status bar
    const phase = this.controller.getCurrentPhase();
    const phaseColors: Record<TurnPhase, number> = {
      [TurnPhase.Income]: BBSColors.phaseIncome,
      [TurnPhase.Action]: BBSColors.phaseAction,
      [TurnPhase.Combat]: BBSColors.phaseCombat,
      [TurnPhase.End]: BBSColors.phaseEnd,
    };

    r.putStatus(2, 3, 'Turn', String(this.controller.getCurrentTurn()));
    r.putStatus(15, 3, 'Phase', TurnPhase[phase], phaseColors[phase]);
    r.putStatus(35, 3, 'Credits', r.formatNumber(gs.playerFaction.resources.credits));

    const planets = gs.planets.filter(p => p.owner === FactionType.Player).length;
    const craft = gs.craft.filter(c => c.owner === FactionType.Player).length;
    const platoons = gs.platoons.filter(p => p.owner === FactionType.Player).length;

    r.putStatus(2, 4, 'Planets', `${planets}/${gs.planets.length}`);
    r.putStatus(18, 4, 'Craft', `${craft}`);
    r.putStatus(30, 4, 'Platoons', `${platoons}`);

    r.drawHorizontalLine(0, 5, 64);

    // Gameplay hint
    const hint = this.getGameplayHint();
    r.putString(2, 6, hint, BBSColors.textBright);

    r.drawHorizontalLine(0, 7, 64);

    // Menu items
    r.putMenuItem(4, 9, 'G', 'Galaxy Map');
    r.putMenuItem(34, 9, 'P', 'Planet Details');

    r.putMenuItem(4, 11, 'B', 'Build Structure');
    r.putMenuItem(34, 11, 'C', 'Commission Platoon');

    r.putMenuItem(4, 13, 'S', 'Shipyard');
    r.putMenuItem(34, 13, 'M', 'Move Fleet');

    r.putMenuItem(4, 15, 'A', 'Attack');
    r.putMenuItem(34, 15, 'T', 'Tax Rate');

    r.putMenuItem(4, 17, 'R', 'Research');
    r.putMenuItem(34, 17, 'E', 'End Turn');

    r.putMenuItem(4, 19, 'H', 'Help');
    r.putMenuItem(34, 19, 'Q', 'Quit to Menu');

    r.drawHorizontalLine(0, 21, 64);

    // Success notification (if active)
    if (this.successMessage) {
      r.putCentered(22, this.successMessage, BBSColors.success);
    } else {
      r.putString(2, 22, 'Messages:', BBSColors.textDim);
    }

    // Message log
    for (let i = 0; i < Math.min(this.messages.length, 3); i++) {
      r.putString(2, 23 + i, r.truncate(this.messages[i], 60), BBSColors.text);
    }

    r.drawHorizontalLine(0, 27, 64);
    r.putString(2, 28, '[D] Download debug log    [L] View game log', BBSColors.textDim);
    r.putString(2, 30, '> ', BBSColors.text);
  }

  private handleInGameMenuInput(key: string, _ctx: MenuContext): MenuTransition | null {
    switch (key) {
      case 'G':
        this.logger.logUser('OPEN_GALAXY', 'Opening galaxy map');
        this.uatTracker.completeTask('nav_galaxy');
        return { screen: MenuScreen.Galaxy };

      case 'P':
        this.logger.logUser('OPEN_PLANET', 'Opening planet details');
        return { screen: MenuScreen.Planet };

      case 'H':
        this.logger.logUser('OPEN_HELP', 'Opening help');
        this.uatTracker.completeTask('nav_help');
        return { screen: MenuScreen.Help };

      case 'E':
        this.logger.logUser('END_TURN', `Ending turn ${this.controller.getCurrentTurn()}`);
        this.controller.endTurn();
        this.logger.setTurn(this.controller.getCurrentTurn());
        this.uatTracker.completeTask('end_turn');

        // Check turn milestones
        if (this.controller.getCurrentTurn() >= 5) {
          this.uatTracker.completeTask('reach_turn_5');
        }
        return null;

      case 'B':
        this.logger.logUser('OPEN_BUILD', 'Opening build menu');
        return { screen: MenuScreen.Build, context: { selectedPlanetId: undefined } };

      case 'S':
        this.logger.logUser('OPEN_SHIPYARD', 'Opening shipyard');
        return { screen: MenuScreen.Shipyard };

      case 'C':
        this.logger.logUser('OPEN_COMMISSION', 'Opening commission');
        return { screen: MenuScreen.Commission };

      case 'M':
        this.logger.logUser('OPEN_MOVE', 'Opening move fleet');
        return { screen: MenuScreen.MoveFleet };

      case 'A':
        this.logger.logUser('OPEN_ATTACK', 'Opening attack');
        return { screen: MenuScreen.Attack };

      case 'T':
        this.logger.logUser('OPEN_TAX', 'Opening tax rate');
        return { screen: MenuScreen.TaxRate };

      case 'R':
        this.logger.logUser('OPEN_RESEARCH', 'Opening research');
        return { screen: MenuScreen.Research };

      case 'D':
        this.logger.downloadLog('json');
        this.addMessage('Debug log downloaded');
        return null;

      case 'Q':
        this.logger.logUser('QUIT', 'Returning to main menu');
        this.menuState.goToScreen(MenuScreen.StartMenu);
        return null;
    }
    return null;
  }

  // ============ Galaxy Screen ============

  private renderGalaxyScreen(r: BBSRenderer, ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'GALAXY MAP', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    r.putString(2, 3, '#  NAME          OWNER    TYPE        POP    CRAFT', BBSColors.textDim);
    r.drawHorizontalLine(0, 4, 64);

    const planets = gs.planets;
    for (let i = 0; i < planets.length && i < 20; i++) {
      const p = planets[i];
      const row = 5 + i;
      const selected = ctx.listIndex === i;
      const ownerColor = p.owner === FactionType.Player ? BBSColors.player :
                         p.owner === FactionType.AI ? BBSColors.ai : BBSColors.neutral;

      const craftCount = gs.craft.filter(c => c.planetID === p.id).length;

      r.putListItem(2, row, i + 1, '', selected);
      r.putString(5, row, r.padRight(p.name, 14), selected ? BBSColors.highlight : BBSColors.text);
      r.putString(19, row, r.padRight(FactionType[p.owner], 9), ownerColor);
      r.putString(28, row, r.padRight(String(p.type), 12), BBSColors.textDim);
      r.putString(40, row, r.padLeft(String(p.population), 6), BBSColors.text);
      r.putString(48, row, r.padLeft(String(craftCount), 5), BBSColors.text);
    }

    r.drawHorizontalLine(0, 26, 64);
    r.putString(2, 27, '[1-9] Select Planet    [ESC] Back', BBSColors.textDim);
  }

  private handleGalaxyInput(key: string, _ctx: MenuContext): MenuTransition | null {
    const gs = this.controller.gameState;
    if (!gs) return null;

    const num = parseInt(key);
    if (num >= 1 && num <= gs.planets.length) {
      const planet = gs.planets[num - 1];
      this.logger.logUser('SELECT_PLANET', `Selected planet ${num}: ${planet.name}`);
      this.uatTracker.completeTask('view_planet');

      // Check if viewing player's homeworld
      if (planet.owner === FactionType.Player && planet.name === 'Starbase') {
        this.uatTracker.completeTask('view_player_planet');
      }

      return { screen: MenuScreen.Planet, context: { selectedPlanetId: planet.id } };
    }

    return null;
  }

  // ============ Planet Screen ============

  private renderPlanetScreen(r: BBSRenderer, ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    const planet = ctx.selectedPlanetId !== undefined
      ? gs.planetLookup.get(ctx.selectedPlanetId)
      : gs.planets.find(p => p.owner === FactionType.Player);

    if (!planet) {
      r.putCentered(15, 'No planet selected', BBSColors.error);
      return;
    }

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, `PLANET: ${planet.name.toUpperCase()}`, BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    const ownerColor = planet.owner === FactionType.Player ? BBSColors.player :
                       planet.owner === FactionType.AI ? BBSColors.ai : BBSColors.neutral;

    r.putString(2, 3, 'BASIC INFO', BBSColors.textDim);
    r.putStatus(4, 4, 'Owner', FactionType[planet.owner], ownerColor);
    r.putStatus(25, 4, 'Type', String(planet.type));
    r.putStatus(4, 5, 'Population', String(planet.population));
    r.putStatus(25, 5, 'Morale', `${planet.morale}%`);
    r.putStatus(4, 6, 'Tax Rate', `${planet.taxRate}%`);

    r.drawHorizontalLine(0, 7, 64);
    r.putString(2, 8, 'RESOURCES', BBSColors.textDim);
    r.putStatus(4, 9, 'Credits', r.formatNumber(planet.resources.credits));
    r.putStatus(25, 9, 'Minerals', r.formatNumber(planet.resources.minerals));
    r.putStatus(4, 10, 'Fuel', r.formatNumber(planet.resources.fuel));
    r.putStatus(25, 10, 'Food', r.formatNumber(planet.resources.food));

    r.drawHorizontalLine(0, 11, 64);
    r.putString(2, 12, 'STRUCTURES', BBSColors.textDim);
    const structures = planet.structures;
    for (let i = 0; i < Math.min(structures.length, 6); i++) {
      const s = structures[i];
      r.putString(4, 13 + i, `- ${s.type} (${s.status})`, BBSColors.text);
    }
    if (structures.length === 0) {
      r.putString(4, 13, 'No structures', BBSColors.textDim);
    }

    r.drawHorizontalLine(0, 20, 64);
    r.putString(2, 21, 'CRAFT IN ORBIT', BBSColors.textDim);
    const craftHere = gs.craft.filter(c => c.planetID === planet.id);
    for (let i = 0; i < Math.min(craftHere.length, 4); i++) {
      const c = craftHere[i];
      const cOwnerColor = c.owner === FactionType.Player ? BBSColors.player : BBSColors.ai;
      r.putString(4, 22 + i, `- [${c.id}] ${c.type}`, cOwnerColor);
    }
    if (craftHere.length === 0) {
      r.putString(4, 22, 'No craft', BBSColors.textDim);
    }

    r.drawHorizontalLine(0, 27, 64);
    r.putString(2, 28, '[ESC] Back', BBSColors.textDim);
  }

  private handlePlanetInput(_key: string, _ctx: MenuContext): MenuTransition | null {
    return null;
  }

  // ============ Help Screen ============

  private renderHelpScreen(r: BBSRenderer, _ctx: MenuContext): void {
    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'HELP - KEYBOARD COMMANDS', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    r.putString(2, 4, 'NAVIGATION', BBSColors.textDim);
    r.putString(4, 5, '[G] Galaxy Map          [P] Planet Details', BBSColors.text);
    r.putString(4, 6, '[ESC] Go Back           [Q] Quit to Menu', BBSColors.text);

    r.putString(2, 8, 'ECONOMY', BBSColors.textDim);
    r.putString(4, 9, '[B] Build Structure     [S] Shipyard', BBSColors.text);
    r.putString(4, 10, '[C] Commission Platoon  [T] Tax Rate', BBSColors.text);
    r.putString(4, 11, '[R] Research Upgrades', BBSColors.text);

    r.putString(2, 13, 'MILITARY', BBSColors.textDim);
    r.putString(4, 14, '[M] Move Fleet          [A] Attack', BBSColors.text);

    r.putString(2, 16, 'TURN', BBSColors.textDim);
    r.putString(4, 17, '[E] End Turn', BBSColors.text);

    r.putString(2, 19, 'DEBUG', BBSColors.textDim);
    r.putString(4, 20, '[D] Download Debug Log', BBSColors.text);

    r.putString(2, 22, 'SELECTION', BBSColors.textDim);
    r.putString(4, 23, '[1-9] Select numbered item', BBSColors.text);

    r.drawHorizontalLine(0, 27, 64);
    r.putString(2, 28, '[ESC] Back', BBSColors.textDim);
  }

  private handleHelpInput(_key: string, _ctx: MenuContext): MenuTransition | null {
    return null;
  }

  // ============ How to Play Screen ============

  // BBS-adapted help chapters (content adapted from HelpContent.ts for keyboard controls)
  private readonly howToPlayChapters = [
    {
      title: 'Quick Start',
      lines: [
        'HOW TO PLAY OVERLORD (BBS Edition)',
        '====================================',
        '',
        'GOAL: Capture all enemy planets to win!',
        '',
        'GETTING STARTED',
        '---------------',
        '1. Press [N] from the main menu',
        '2. You start with one planet (Starbase)',
        '3. Build structures, train troops, buy ships',
        '4. Conquer the galaxy!',
        '',
        'THE TURN CYCLE',
        '--------------',
        '1. INCOME - Resources auto-generate',
        '2. ACTION - Your turn! Build/move/train',
        '3. COMBAT - Battles resolve automatically',
        '4. END    - Victory check, next turn',
        '',
        'YOUR FIRST TURN',
        '---------------',
        '1. Press [G] to view Galaxy Map',
        '2. Press [1] to select your planet',
        '3. Press [ESC] then [B] to build',
        '4. Build a Mining Station first!',
        '5. Press [E] to end your turn',
        '',
        'RECOMMENDED BUILD ORDER',
        '-----------------------',
        'Turn 1-3:  Mining Station',
        'Turn 3-5:  Horticultural Station',
        'Turn 5-7:  Docking Bay (for ships)',
        'Turn 7+:   Commission platoons',
        'Turn 10+:  Battle Cruisers & attack!',
      ],
    },
    {
      title: 'Keyboard Controls',
      lines: [
        'KEYBOARD CONTROLS',
        '=================',
        '',
        'MAIN MENU',
        '---------',
        '[N] New Campaign     [L] Load (disabled)',
        '[H] How to Play      [D] Download Log',
        '',
        'IN-GAME NAVIGATION',
        '------------------',
        '[G] Galaxy Map       [P] Planet Details',
        '[ESC] Go Back        [Q] Quit to Menu',
        '',
        'ECONOMY & PRODUCTION',
        '--------------------',
        '[B] Build Structure  [S] Shipyard',
        '[C] Commission Troops [T] Tax Rate',
        '[R] Research Weapons',
        '',
        'MILITARY ACTIONS',
        '----------------',
        '[M] Move Fleet       [A] Attack Planet',
        '',
        'TURN CONTROL',
        '------------',
        '[E] End Turn',
        '',
        'SELECTION',
        '---------',
        '[1-9] Select numbered item in lists',
        '[ESC] Cancel current action',
        '',
        'DEBUG',
        '-----',
        '[D] Download debug log (JSON)',
      ],
    },
    {
      title: 'Buildings',
      lines: [
        'BUILDINGS',
        '=========',
        '',
        'HOW TO BUILD',
        '------------',
        '1. Press [B] from the main game screen',
        '2. Select a planet with [1-9]',
        '3. Select a building type with [1-5]',
        '',
        'BUILDING TYPES',
        '--------------',
        '',
        'MINING STATION',
        '  Cost: 8,000 Cr / 2,000 Min / 1,000 Fuel',
        '  Time: 3 turns',
        '  Effect: +50 Minerals, +30 Fuel per turn',
        '  TIP: Build on Volcanic planets (5x bonus!)',
        '',
        'HORTICULTURAL STATION',
        '  Cost: 6,000 Cr / 1,500 Min / 800 Fuel',
        '  Time: 2 turns',
        '  Effect: +100 Food per turn',
        '  TIP: Build on Tropical planets (2x bonus!)',
        '',
        'DOCKING BAY',
        '  Cost: 5,000 Cr / 1,000 Min / 500 Fuel',
        '  Time: 2 turns',
        '  Effect: Allows spacecraft construction',
        '  NOTE: Required before buying ships!',
        '',
        'ORBITAL DEFENSE',
        '  Cost: 12,000 Cr / 3,000 Min / 2,000 Fuel',
        '  Time: 3 turns',
        '  Effect: +20% defense bonus per platform',
      ],
    },
    {
      title: 'Spacecraft',
      lines: [
        'SPACECRAFT',
        '==========',
        '',
        'HOW TO BUY SHIPS',
        '----------------',
        '1. Build a Docking Bay first!',
        '2. Press [S] to open Shipyard',
        '3. Select a planet with [1-9]',
        '4. Select ship type with [1-4]',
        '',
        'SHIP TYPES',
        '----------',
        '',
        'BATTLE CRUISER - 15,000 Cr',
        '  Speed: Fast',
        '  Capacity: 4 platoons',
        '  Purpose: Combat + troop transport',
        '  NOTE: Your main attack vessel!',
        '',
        'CARGO CRUISER - 8,000 Cr',
        '  Speed: Moderate',
        '  Capacity: Resources',
        '  Purpose: Transport between planets',
        '',
        'ATMOSPHERE PROCESSOR - 20,000 Cr',
        '  Speed: Moderate',
        '  Purpose: Colonize neutral planets',
        '  NOTE: Consumed when deployed!',
        '',
        'SOLAR SATELLITE - 5,000 Cr',
        '  Speed: Stationary',
        '  Effect: +80 Energy per turn',
        '  TIP: Deploy on Desert planets (2x bonus!)',
      ],
    },
    {
      title: 'Military',
      lines: [
        'MILITARY GUIDE',
        '==============',
        '',
        'COMMISSIONING PLATOONS',
        '----------------------',
        '1. Press [C] to commission',
        '2. Select a planet with [1-9]',
        '3. Choose platoon configuration',
        '',
        'PLATOON OPTIONS',
        '---------------',
        '[1] Basic Infantry (50 troops) - 2,000 Cr',
        '[2] Advanced Infantry (50) - 5,000 Cr',
        '[3] Large Basic (100 troops) - 4,000 Cr',
        '[4] Large Advanced (100) - 10,000 Cr',
        '',
        'TRAINING',
        '--------',
        'New platoons start at 0% training!',
        '  - Gain +10% per turn',
        '  - 10 turns to reach 100%',
        '  - Training = combat effectiveness',
        '  - 50% trained = 50% strength!',
        '',
        'NEVER attack with untrained troops!',
        '',
        'MOVING SHIPS',
        '------------',
        '1. Press [M] to move fleet',
        '2. Select a ship with [1-9]',
        '3. Select destination planet',
        '',
        'Ships travel 1-3 turns depending on distance.',
      ],
    },
    {
      title: 'Combat',
      lines: [
        'HOW COMBAT WORKS',
        '================',
        '',
        'ATTACKING A PLANET',
        '------------------',
        '1. Move your ships to the enemy planet',
        '2. Press [A] to open Attack menu',
        '3. Select the target planet',
        '4. Choose attack type:',
        '   [1] Orbital Bombardment',
        '   [2] Ground Invasion',
        '',
        'ORBITAL BOMBARDMENT',
        '-------------------',
        'Destroys structures from orbit',
        'Requires: Battle Cruiser at planet',
        'Does NOT capture the planet!',
        '',
        'GROUND INVASION',
        '---------------',
        'Land troops to capture the planet',
        'Requirements:',
        '  - Ships at enemy planet',
        '  - Platoons loaded on cruisers',
        '  - Win space combat first (auto)',
        '  - Win ground combat',
        '',
        'COMBAT STRENGTH',
        '---------------',
        'Strength = Troops x Equipment x Training%',
        '',
        'Example: 100 troops x Advanced (2.0)',
        '         x 80% trained = 160 strength',
        '',
        'Capture enemy planets to win the game!',
      ],
    },
    {
      title: 'Economy',
      lines: [
        'ECONOMY & RESOURCES',
        '===================',
        '',
        'THE FIVE RESOURCES',
        '------------------',
        '',
        'CREDITS - From taxes on population',
        '  Higher pop = more income',
        '  Metropolis planets give 2x',
        '',
        'MINERALS - From Mining Stations',
        '  Used for buildings and ships',
        '  Volcanic planets give 5x bonus!',
        '',
        'FUEL - From Mining Stations',
        '  Used for ships and travel',
        '  Volcanic planets give 3x bonus!',
        '',
        'FOOD - From Horticultural Stations',
        '  Pop consumes 0.5 per person/turn',
        '  No food = STARVATION!',
        '  Tropical planets give 2x bonus!',
        '',
        'ENERGY - From Solar Satellites',
        '  Desert planets give 2x bonus!',
        '',
        'TAX RATE',
        '--------',
        'Press [T] to adjust tax rates',
        '',
        '40-60%: Balanced (recommended)',
        '<40%:   Happy pop, low income',
        '>75%:   High income, morale penalty!',
      ],
    },
    {
      title: 'Strategy Tips',
      lines: [
        'WINNING STRATEGIES',
        '==================',
        '',
        'EARLY GAME (Turns 1-10)',
        '-----------------------',
        'Focus 80% on economy!',
        '',
        'DO:',
        '  T1: Mining Station',
        '  T3: Horticultural Station',
        '  T5: Docking Bay',
        '  T6: Commission platoons (10 turns!)',
        '  T7: Atmosphere Processor -> colonize',
        '',
        'DON\'T:',
        '  - Build military turn 1',
        '  - Ignore food production',
        '  - Tax above 60%',
        '',
        'MID GAME (Turns 11-20)',
        '----------------------',
        '  - Colonize 1-2 neutral planets',
        '  - Build Mining/Hort on colonies',
        '  - Buy 2-3 Battle Cruisers',
        '  - Wait for 100% trained troops',
        '',
        'LATE GAME (Turns 20+)',
        '---------------------',
        '  - Mass your fleet together',
        '  - Load trained platoons',
        '  - Attack weakest enemy first',
        '  - Capture and fortify',
        '',
        'VICTORY: Control ALL planets!',
      ],
    },
  ];

  private renderHowToPlayScreen(r: BBSRenderer, ctx: MenuContext): void {
    const chapterIdx = Math.min(Math.max(0, ctx.howToPlayChapter ?? 0), this.howToPlayChapters.length - 1);
    const chapter = this.howToPlayChapters[chapterIdx];
    if (!chapter) return;

    const scrollPos = Math.max(0, ctx.howToPlayScroll ?? 0);

    r.drawBox(0, 0, 64, 32);
    r.putCentered(1, 'HOW TO PLAY', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    // Chapter selector
    r.putString(2, 3, 'Chapter:', BBSColors.textDim);
    for (let i = 0; i < this.howToPlayChapters.length; i++) {
      const selected = i === chapterIdx;
      const x = 11 + i * 2;
      if (x < 60) {
        r.putString(x, 3, `${i + 1}`, selected ? BBSColors.highlight : BBSColors.textDim);
      }
    }

    r.putString(28, 3, chapter.title, BBSColors.text);

    r.drawHorizontalLine(0, 4, 64);

    // Content area (22 lines available)
    const maxLines = 22;
    const totalLines = chapter.lines.length;
    const clampedScroll = Math.min(scrollPos, Math.max(0, totalLines - maxLines));
    const visibleLines = chapter.lines.slice(clampedScroll, clampedScroll + maxLines);

    for (let i = 0; i < visibleLines.length; i++) {
      const line = visibleLines[i];
      // Check if it's a header line (ALL CAPS or ends with =)
      const isHeader = line.length > 0 && (line === line.toUpperCase() || line.endsWith('='));
      const color = isHeader ? BBSColors.textBright : BBSColors.text;
      r.putString(2, 5 + i, r.truncate(line, 60), color);
    }

    // Scroll indicator
    if (totalLines > maxLines) {
      const maxScroll = totalLines - maxLines;
      const scrollPercent = maxScroll > 0 ? Math.round((clampedScroll / maxScroll) * 100) : 0;
      r.putString(55, 27, `${scrollPercent}%`, BBSColors.textDim);
    }

    r.drawHorizontalLine(0, 28, 64);

    // Navigation help
    r.putString(2, 29, '[Left/Right] Chapter  [Up/Down] Scroll  [ESC] Back', BBSColors.textDim);
    r.putString(2, 30, '[1-8] Jump to chapter  [PgUp/PgDn] Scroll page', BBSColors.textDim);
  }

  private handleHowToPlayInput(key: string, ctx: MenuContext): MenuTransition | null {
    const chapterIdx = Math.min(Math.max(0, ctx.howToPlayChapter ?? 0), this.howToPlayChapters.length - 1);
    const chapter = this.howToPlayChapters[chapterIdx];
    if (!chapter) return null;

    const scrollPos = Math.max(0, ctx.howToPlayScroll ?? 0);
    const maxScroll = Math.max(0, chapter.lines.length - 22);

    // Chapter selection (1-8)
    const num = parseInt(key, 10);
    if (!isNaN(num) && num >= 1 && num <= this.howToPlayChapters.length) {
      this.menuState.updateContext({ howToPlayChapter: num - 1, howToPlayScroll: 0 });
      return null;
    }

    // Left/Right arrows for chapter navigation
    if (key === 'ArrowLeft' && chapterIdx > 0) {
      this.menuState.updateContext({ howToPlayChapter: chapterIdx - 1, howToPlayScroll: 0 });
      return null;
    } else if (key === 'ArrowRight' && chapterIdx < this.howToPlayChapters.length - 1) {
      this.menuState.updateContext({ howToPlayChapter: chapterIdx + 1, howToPlayScroll: 0 });
      return null;
    }

    // Up/Down arrows for scrolling within chapter
    if (key === 'ArrowUp' && scrollPos > 0) {
      this.menuState.updateContext({ howToPlayScroll: scrollPos - 1 });
    } else if (key === 'ArrowDown' && scrollPos < maxScroll) {
      this.menuState.updateContext({ howToPlayScroll: scrollPos + 1 });
    } else if (key === 'PageUp') {
      this.menuState.updateContext({ howToPlayScroll: Math.max(0, scrollPos - 10) });
    } else if (key === 'PageDown') {
      this.menuState.updateContext({ howToPlayScroll: Math.min(maxScroll, scrollPos + 10) });
    }

    return null;
  }

  // ============ Victory Screen ============

  private renderVictoryScreen(r: BBSRenderer, _ctx: MenuContext): void {
    r.drawBox(0, 0, 64, 30);

    r.putCentered(8, '* * * * * * * * * *', BBSColors.success);
    r.putCentered(10, 'V I C T O R Y !', BBSColors.success);
    r.putCentered(12, '* * * * * * * * * *', BBSColors.success);

    r.putCentered(15, 'You have conquered the galaxy!', BBSColors.text);
    r.putCentered(16, 'The enemy has been defeated.', BBSColors.text);

    r.putCentered(20, `Final Turn: ${this.controller.getCurrentTurn()}`, BBSColors.textDim);

    r.drawHorizontalLine(0, 25, 64);
    r.putCentered(27, '[N] New Game    [Q] Quit', BBSColors.text);
  }

  private handleVictoryInput(key: string, _ctx: MenuContext): MenuTransition | null {
    if (key === 'N' || key === 'Q') {
      return { screen: MenuScreen.StartMenu };
    }
    return null;
  }

  // ============ Defeat Screen ============

  private renderDefeatScreen(r: BBSRenderer, _ctx: MenuContext): void {
    r.drawBox(0, 0, 64, 30);

    r.putCentered(8, '- - - - - - - - - -', BBSColors.error);
    r.putCentered(10, 'D E F E A T', BBSColors.error);
    r.putCentered(12, '- - - - - - - - - -', BBSColors.error);

    r.putCentered(15, 'Your empire has fallen.', BBSColors.text);
    r.putCentered(16, 'The enemy has conquered all.', BBSColors.text);

    r.putCentered(20, `Final Turn: ${this.controller.getCurrentTurn()}`, BBSColors.textDim);

    r.drawHorizontalLine(0, 25, 64);
    r.putCentered(27, '[N] New Game    [Q] Quit', BBSColors.text);
  }

  private handleDefeatInput(key: string, _ctx: MenuContext): MenuTransition | null {
    if (key === 'N' || key === 'Q') {
      return { screen: MenuScreen.StartMenu };
    }
    return null;
  }

  // ============ Build Screen ============

  private renderBuildScreen(r: BBSRenderer, ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    // Get player planets
    const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'BUILD STRUCTURE', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    // If no planet selected, show planet list
    if (ctx.selectedPlanetId === undefined) {
      r.putString(2, 3, 'Select a planet to build on:', BBSColors.textDim);
      r.drawHorizontalLine(0, 4, 64);

      for (let i = 0; i < playerPlanets.length && i < 9; i++) {
        const p = playerPlanets[i];
        const row = 5 + i;
        const surfaceCount = p.structures.filter(s =>
          s.type === BuildingType.MiningStation ||
          s.type === BuildingType.HorticulturalStation ||
          s.type === BuildingType.SurfacePlatform
        ).length;
        const orbitalCount = p.structures.filter(s =>
          s.type === BuildingType.DockingBay ||
          s.type === BuildingType.OrbitalDefense
        ).length;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(p.name, 15), BBSColors.text);
        r.putString(21, row, `Surface: ${surfaceCount}/6  Orbital: ${orbitalCount}/3`, BBSColors.textDim);
      }

      if (playerPlanets.length === 0) {
        r.putString(4, 5, 'No planets owned!', BBSColors.error);
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-9] Select Planet    [ESC] Cancel', BBSColors.textDim);
    } else {
      // Planet selected - show building options
      const planet = gs.planetLookup.get(ctx.selectedPlanetId);
      if (!planet) return;

      const resources = this.controller.getPlayerResources();

      r.putString(2, 3, `Planet: ${planet.name}`, BBSColors.text);
      r.putString(2, 4, `Credits: ${r.formatNumber(resources.credits)}`, BBSColors.textDim);
      r.drawHorizontalLine(0, 5, 64);

      r.putString(2, 6, '#  BUILDING             COST       TURNS  STATUS', BBSColors.textDim);
      r.drawHorizontalLine(0, 7, 64);

      const buildings: BuildingType[] = [
        BuildingType.MiningStation,
        BuildingType.HorticulturalStation,
        BuildingType.SurfacePlatform,
        BuildingType.DockingBay,
        BuildingType.OrbitalDefense,
      ];

      for (let i = 0; i < buildings.length; i++) {
        const bType = buildings[i];
        const cost = BuildingCosts.getCost(bType);
        const turns = BuildingCosts.getConstructionTime(bType);
        const canBuild = this.controller.getBuildingSystem().canBuild(ctx.selectedPlanetId!, bType);
        const canAfford = resources.canAfford(cost);

        const row = 8 + i;
        const statusColor = canBuild && canAfford ? BBSColors.success : BBSColors.error;
        const status = !canBuild ? 'NO SLOT' : (!canAfford ? 'NO FUNDS' : 'READY');

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(BuildingType[bType], 20), canBuild && canAfford ? BBSColors.text : BBSColors.textDim);
        r.putString(26, row, r.padLeft(r.formatNumber(cost.credits), 8), BBSColors.textDim);
        r.putString(35, row, r.padLeft(String(turns), 5), BBSColors.textDim);
        r.putString(42, row, status, statusColor);
      }

      r.drawHorizontalLine(0, 20, 64);
      r.putString(2, 21, 'Resource Costs:', BBSColors.textDim);
      r.putString(4, 22, '(Cost shown is Credits only. Also requires Minerals + Fuel)', BBSColors.textDim);

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-5] Build    [ESC] Cancel', BBSColors.textDim);
    }
  }

  private handleBuildInput(key: string, ctx: MenuContext): MenuTransition | null {
    const gs = this.controller.gameState;
    if (!gs) return null;

    // If no planet selected, handle planet selection
    if (ctx.selectedPlanetId === undefined) {
      const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);
      const num = parseInt(key);
      if (num >= 1 && num <= playerPlanets.length) {
        this.menuState.updateContext({ selectedPlanetId: playerPlanets[num - 1].id });
        this.renderScreen();
      }
      return null;
    }

    // Planet selected - handle building selection
    const buildings: BuildingType[] = [
      BuildingType.MiningStation,
      BuildingType.HorticulturalStation,
      BuildingType.SurfacePlatform,
      BuildingType.DockingBay,
      BuildingType.OrbitalDefense,
    ];

    const num = parseInt(key);
    if (num >= 1 && num <= buildings.length) {
      const buildingType = buildings[num - 1];
      const result = this.controller.buildStructure(ctx.selectedPlanetId!, buildingType);
      if (result) {
        this.uatTracker.completeTask('build_structure');
        this.logger.logUser('BUILD', `Built ${BuildingType[buildingType]} on planet ${ctx.selectedPlanetId}`);
        this.menuState.popScreen();
      } else {
        this.addMessage('Cannot build - check resources and capacity');
      }
      this.renderScreen();
    }

    return null;
  }

  // ============ Shipyard Screen ============

  private renderShipyardScreen(r: BBSRenderer, ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);
    const resources = this.controller.getPlayerResources();

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'SHIPYARD', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    // If no planet selected, show planet list
    if (ctx.selectedPlanetId === undefined) {
      r.putString(2, 3, 'Select a planet to build craft at:', BBSColors.textDim);
      r.drawHorizontalLine(0, 4, 64);

      for (let i = 0; i < playerPlanets.length && i < 9; i++) {
        const p = playerPlanets[i];
        const row = 5 + i;
        const docks = p.structures.filter(s => s.type === BuildingType.DockingBay).length;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(p.name, 15), BBSColors.text);
        r.putString(21, row, `Docking Bays: ${docks}`, BBSColors.textDim);
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-9] Select Planet    [ESC] Cancel', BBSColors.textDim);
    } else {
      const planet = gs.planetLookup.get(ctx.selectedPlanetId);
      if (!planet) return;

      r.putString(2, 3, `Planet: ${planet.name}`, BBSColors.text);
      r.putString(2, 4, `Credits: ${r.formatNumber(resources.credits)}`, BBSColors.textDim);
      r.drawHorizontalLine(0, 5, 64);

      r.putString(2, 6, '#  CRAFT TYPE           COST', BBSColors.textDim);
      r.drawHorizontalLine(0, 7, 64);

      const craftTypes: { type: CraftType; cost: number }[] = [
        { type: CraftType.BattleCruiser, cost: 15000 },
        { type: CraftType.CargoCruiser, cost: 8000 },
        { type: CraftType.SolarSatellite, cost: 5000 },
        { type: CraftType.AtmosphereProcessor, cost: 20000 },
      ];

      for (let i = 0; i < craftTypes.length; i++) {
        const { type, cost } = craftTypes[i];
        const canAfford = resources.credits >= cost;
        const row = 8 + i;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(CraftType[type], 20), canAfford ? BBSColors.text : BBSColors.textDim);
        r.putString(26, row, r.padLeft(r.formatNumber(cost), 8), canAfford ? BBSColors.text : BBSColors.error);
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-4] Purchase    [ESC] Cancel', BBSColors.textDim);
    }
  }

  private handleShipyardInput(key: string, ctx: MenuContext): MenuTransition | null {
    const gs = this.controller.gameState;
    if (!gs) return null;

    // If no planet selected, handle planet selection
    if (ctx.selectedPlanetId === undefined) {
      const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);
      const num = parseInt(key);
      if (num >= 1 && num <= playerPlanets.length) {
        this.menuState.updateContext({ selectedPlanetId: playerPlanets[num - 1].id });
        this.renderScreen();
      }
      return null;
    }

    // Planet selected - handle craft purchase
    const craftTypes: CraftType[] = [
      CraftType.BattleCruiser,
      CraftType.CargoCruiser,
      CraftType.SolarSatellite,
      CraftType.AtmosphereProcessor,
    ];

    const num = parseInt(key);
    if (num >= 1 && num <= craftTypes.length) {
      const craftType = craftTypes[num - 1];
      const craftId = this.controller.purchaseCraft(craftType, ctx.selectedPlanetId!);
      if (craftId >= 0) {
        this.uatTracker.completeTask('buy_craft');
        this.logger.logUser('PURCHASE_CRAFT', `Purchased ${CraftType[craftType]} at planet ${ctx.selectedPlanetId}`);
        this.menuState.popScreen();
      } else {
        this.addMessage('Cannot purchase - check resources');
      }
      this.renderScreen();
    }

    return null;
  }

  // ============ Commission Screen ============

  private renderCommissionScreen(r: BBSRenderer, ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);
    const resources = this.controller.getPlayerResources();

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'COMMISSION PLATOON', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    // If no planet selected, show planet list
    if (ctx.selectedPlanetId === undefined) {
      r.putString(2, 3, 'Select a planet to recruit troops:', BBSColors.textDim);
      r.drawHorizontalLine(0, 4, 64);

      for (let i = 0; i < playerPlanets.length && i < 9; i++) {
        const p = playerPlanets[i];
        const row = 5 + i;
        const platoons = gs.platoons.filter(pl => pl.planetID === p.id && pl.owner === FactionType.Player).length;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(p.name, 15), BBSColors.text);
        r.putString(21, row, `Pop: ${p.population}  Platoons: ${platoons}`, BBSColors.textDim);
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-9] Select Planet    [ESC] Cancel', BBSColors.textDim);
    } else {
      const planet = gs.planetLookup.get(ctx.selectedPlanetId);
      if (!planet) return;

      r.putString(2, 3, `Planet: ${planet.name}  Pop: ${planet.population}`, BBSColors.text);
      r.putString(2, 4, `Credits: ${r.formatNumber(resources.credits)}`, BBSColors.textDim);
      r.drawHorizontalLine(0, 5, 64);

      r.putString(2, 6, 'Platoon Options:', BBSColors.textDim);
      r.drawHorizontalLine(0, 7, 64);

      const options = [
        { troops: 50, equip: EquipmentLevel.Basic, weapon: WeaponLevel.Pistol, cost: 2000, label: 'Basic Infantry (50 troops)' },
        { troops: 50, equip: EquipmentLevel.Advanced, weapon: WeaponLevel.Rifle, cost: 5000, label: 'Advanced Infantry (50 troops)' },
        { troops: 100, equip: EquipmentLevel.Basic, weapon: WeaponLevel.Pistol, cost: 4000, label: 'Large Basic (100 troops)' },
        { troops: 100, equip: EquipmentLevel.Advanced, weapon: WeaponLevel.Rifle, cost: 10000, label: 'Large Advanced (100 troops)' },
      ];

      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        const canAfford = resources.credits >= opt.cost;
        const hasPopulation = planet.population >= opt.troops;
        const row = 8 + i * 2;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, opt.label, canAfford && hasPopulation ? BBSColors.text : BBSColors.textDim);
        r.putString(5, row + 1, `Cost: ${r.formatNumber(opt.cost)} cr`, canAfford ? BBSColors.textDim : BBSColors.error);
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-4] Commission    [ESC] Cancel', BBSColors.textDim);
    }
  }

  private handleCommissionInput(key: string, ctx: MenuContext): MenuTransition | null {
    const gs = this.controller.gameState;
    if (!gs) return null;

    // If no planet selected, handle planet selection
    if (ctx.selectedPlanetId === undefined) {
      const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);
      const num = parseInt(key);
      if (num >= 1 && num <= playerPlanets.length) {
        this.menuState.updateContext({ selectedPlanetId: playerPlanets[num - 1].id });
        this.renderScreen();
      }
      return null;
    }

    // Planet selected - handle platoon commission
    const options = [
      { troops: 50, equip: EquipmentLevel.Basic, weapon: WeaponLevel.Pistol },
      { troops: 50, equip: EquipmentLevel.Advanced, weapon: WeaponLevel.Rifle },
      { troops: 100, equip: EquipmentLevel.Basic, weapon: WeaponLevel.Pistol },
      { troops: 100, equip: EquipmentLevel.Advanced, weapon: WeaponLevel.Rifle },
    ];

    const num = parseInt(key);
    if (num >= 1 && num <= options.length) {
      const opt = options[num - 1];
      const platoonId = this.controller.commissionPlatoon(
        ctx.selectedPlanetId!,
        opt.troops,
        opt.equip,
        opt.weapon
      );
      if (platoonId >= 0) {
        this.uatTracker.completeTask('commission_platoon');
        this.logger.logUser('COMMISSION', `Commissioned platoon at planet ${ctx.selectedPlanetId}`);
        this.menuState.popScreen();
      } else {
        this.addMessage('Cannot commission - check resources and population');
      }
      this.renderScreen();
    }

    return null;
  }

  // ============ Move Fleet Screen ============

  private renderMoveFleetScreen(r: BBSRenderer, ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    const playerCraft = gs.craft.filter(c => c.owner === FactionType.Player);

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'MOVE FLEET', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    // If no craft selected, show craft list
    if (ctx.selectedCraftId === undefined) {
      r.putString(2, 3, 'Select a craft to move:', BBSColors.textDim);
      r.drawHorizontalLine(0, 4, 64);

      r.putString(2, 5, '#  TYPE            LOCATION', BBSColors.textDim);
      r.drawHorizontalLine(0, 6, 64);

      for (let i = 0; i < playerCraft.length && i < 9; i++) {
        const c = playerCraft[i];
        const row = 7 + i;
        const planet = gs.planetLookup.get(c.planetID);
        const location = planet ? planet.name : 'In Transit';

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(CraftType[c.type], 16), BBSColors.text);
        r.putString(22, row, location, BBSColors.textDim);
      }

      if (playerCraft.length === 0) {
        r.putString(4, 7, 'No craft available!', BBSColors.error);
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-9] Select Craft    [ESC] Cancel', BBSColors.textDim);
    } else {
      // Craft selected - show destination options
      const craft = gs.craft.find(c => c.id === ctx.selectedCraftId);
      if (!craft) return;

      const currentPlanet = gs.planetLookup.get(craft.planetID);

      r.putString(2, 3, `Craft: ${CraftType[craft.type]} (ID: ${craft.id})`, BBSColors.text);
      r.putString(2, 4, `Current: ${currentPlanet?.name || 'In Transit'}`, BBSColors.textDim);
      r.drawHorizontalLine(0, 5, 64);

      r.putString(2, 6, 'Select destination:', BBSColors.textDim);
      r.drawHorizontalLine(0, 7, 64);

      for (let i = 0; i < gs.planets.length && i < 9; i++) {
        const p = gs.planets[i];
        const row = 8 + i;
        const ownerColor = p.owner === FactionType.Player ? BBSColors.player :
                           p.owner === FactionType.AI ? BBSColors.ai : BBSColors.neutral;
        const isCurrent = p.id === craft.planetID;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(p.name, 15), isCurrent ? BBSColors.textDim : BBSColors.text);
        r.putString(21, row, r.padRight(FactionType[p.owner], 8), ownerColor);
        if (isCurrent) {
          r.putString(30, row, '(current)', BBSColors.textDim);
        }
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-9] Move To    [ESC] Cancel', BBSColors.textDim);
    }
  }

  private handleMoveFleetInput(key: string, ctx: MenuContext): MenuTransition | null {
    const gs = this.controller.gameState;
    if (!gs) return null;

    // If no craft selected, handle craft selection
    if (ctx.selectedCraftId === undefined) {
      const playerCraft = gs.craft.filter(c => c.owner === FactionType.Player);
      const num = parseInt(key);
      if (num >= 1 && num <= playerCraft.length) {
        this.menuState.updateContext({ selectedCraftId: playerCraft[num - 1].id });
        this.renderScreen();
      }
      return null;
    }

    // Craft selected - handle destination selection
    const num = parseInt(key);
    if (num >= 1 && num <= gs.planets.length) {
      const destPlanet = gs.planets[num - 1];
      const result = this.controller.moveCraft(ctx.selectedCraftId!, destPlanet.id);
      if (result) {
        this.uatTracker.completeTask('move_craft');
        this.logger.logUser('MOVE', `Moved craft ${ctx.selectedCraftId} to ${destPlanet.name}`);
        this.menuState.popScreen();
      } else {
        this.addMessage('Cannot move - craft may already be at destination');
      }
      this.renderScreen();
    }

    return null;
  }

  // ============ Attack Screen ============

  private renderAttackScreen(r: BBSRenderer, ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    // Get enemy and neutral planets
    const targetPlanets = gs.planets.filter(p => p.owner !== FactionType.Player);

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'ATTACK', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    // If no planet selected, show target list
    if (ctx.selectedPlanetId === undefined) {
      r.putString(2, 3, 'Select target planet:', BBSColors.textDim);
      r.drawHorizontalLine(0, 4, 64);

      r.putString(2, 5, '#  PLANET         OWNER     YOUR CRAFT  ENEMY', BBSColors.textDim);
      r.drawHorizontalLine(0, 6, 64);

      for (let i = 0; i < targetPlanets.length && i < 9; i++) {
        const p = targetPlanets[i];
        const row = 7 + i;
        const ownerColor = p.owner === FactionType.AI ? BBSColors.ai : BBSColors.neutral;

        // Count player craft at this planet
        const playerCraftHere = gs.craft.filter(c => c.planetID === p.id && c.owner === FactionType.Player).length;
        // Count enemy craft/defenses
        const enemyCraft = gs.craft.filter(c => c.planetID === p.id && c.owner === p.owner).length;
        const enemyPlatoons = gs.platoons.filter(pl => pl.planetID === p.id && pl.owner === p.owner).length;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(p.name, 14), BBSColors.text);
        r.putString(19, row, r.padRight(FactionType[p.owner], 10), ownerColor);
        r.putString(29, row, r.padLeft(String(playerCraftHere), 6), playerCraftHere > 0 ? BBSColors.success : BBSColors.textDim);
        r.putString(38, row, `${enemyCraft}c/${enemyPlatoons}p`, BBSColors.error);
      }

      if (targetPlanets.length === 0) {
        r.putString(4, 7, 'No targets available!', BBSColors.success);
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-9] Select Target    [ESC] Cancel', BBSColors.textDim);
    } else {
      // Planet selected - show attack options
      const planet = gs.planetLookup.get(ctx.selectedPlanetId);
      if (!planet) return;

      const playerCraftHere = gs.craft.filter(c => c.planetID === planet.id && c.owner === FactionType.Player);
      const playerPlatoonsHere = gs.platoons.filter(pl =>
        playerCraftHere.some(c => c.carriedPlatoonIDs?.includes(pl.id))
      );

      r.putString(2, 3, `Target: ${planet.name} (${FactionType[planet.owner]})`, BBSColors.text);
      r.putString(2, 4, `Your craft here: ${playerCraftHere.length}`, BBSColors.textDim);
      r.drawHorizontalLine(0, 5, 64);

      r.putString(2, 6, 'Attack Options:', BBSColors.textDim);
      r.drawHorizontalLine(0, 7, 64);

      const canBombard = playerCraftHere.some(c => c.type === CraftType.BattleCruiser);
      const canInvade = playerPlatoonsHere.length > 0 || playerCraftHere.length > 0;

      r.putListItem(2, 9, 1, '', false);
      r.putString(5, 9, 'Orbital Bombardment', canBombard ? BBSColors.text : BBSColors.textDim);
      r.putString(5, 10, 'Destroy structures from orbit', BBSColors.textDim);
      if (!canBombard) {
        r.putString(40, 9, 'NEED BATTLECRUISER', BBSColors.error);
      }

      r.putListItem(2, 12, 2, '', false);
      r.putString(5, 12, 'Ground Invasion', canInvade ? BBSColors.text : BBSColors.textDim);
      r.putString(5, 13, 'Land troops and capture planet', BBSColors.textDim);
      if (!canInvade) {
        r.putString(40, 12, 'NEED CRAFT', BBSColors.error);
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1] Bombard  [2] Invade  [ESC] Cancel', BBSColors.textDim);
    }
  }

  private handleAttackInput(key: string, ctx: MenuContext): MenuTransition | null {
    const gs = this.controller.gameState;
    if (!gs) return null;

    // If no planet selected, handle planet selection
    if (ctx.selectedPlanetId === undefined) {
      const targetPlanets = gs.planets.filter(p => p.owner !== FactionType.Player);
      const num = parseInt(key);
      if (num >= 1 && num <= targetPlanets.length) {
        this.menuState.updateContext({ selectedPlanetId: targetPlanets[num - 1].id });
        this.renderScreen();
      }
      return null;
    }

    // Planet selected - handle attack type
    if (key === '1') {
      // Bombardment
      const result = this.controller.bombardPlanet(ctx.selectedPlanetId!);
      if (result) {
        this.uatTracker.completeTask('attack_planet');
        this.logger.logUser('BOMBARD', `Bombarded planet ${ctx.selectedPlanetId}`);
        this.addMessage(`Bombardment: ${result.structuresDestroyed} structures destroyed, ${result.casualtiesCaused} casualties`);
        this.menuState.popScreen();
      } else {
        this.addMessage('Bombardment failed - need Battle Cruiser at planet');
      }
      this.renderScreen();
    } else if (key === '2') {
      // Ground invasion
      const result = this.controller.invadePlanet(ctx.selectedPlanetId!);
      if (result) {
        this.uatTracker.completeTask('attack_planet');
        this.logger.logUser('INVADE', `Invaded planet ${ctx.selectedPlanetId}`);
        if (result.planetCaptured) {
          this.addMessage('PLANET CAPTURED!');
        } else {
          this.addMessage(`Invasion ${result.attackerWins ? 'successful' : 'repelled'}`);
        }
        this.menuState.popScreen();
      } else {
        this.addMessage('Invasion failed - need troops at planet');
      }
      this.renderScreen();
    }

    return null;
  }

  // ============ Tax Rate Screen ============

  private renderTaxRateScreen(r: BBSRenderer, ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'TAX RATE', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    // If no planet selected, show planet list
    if (ctx.selectedPlanetId === undefined) {
      r.putString(2, 3, 'Select a planet to adjust tax rate:', BBSColors.textDim);
      r.drawHorizontalLine(0, 4, 64);

      r.putString(2, 5, '#  PLANET         TAX%   MORALE  POP', BBSColors.textDim);
      r.drawHorizontalLine(0, 6, 64);

      for (let i = 0; i < playerPlanets.length && i < 9; i++) {
        const p = playerPlanets[i];
        const row = 7 + i;
        const moraleColor = p.morale >= 70 ? BBSColors.success :
                            p.morale >= 40 ? BBSColors.text : BBSColors.error;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, r.padRight(p.name, 14), BBSColors.text);
        r.putString(19, row, r.padLeft(`${p.taxRate}%`, 5), BBSColors.text);
        r.putString(26, row, r.padLeft(`${p.morale}%`, 6), moraleColor);
        r.putString(34, row, r.padLeft(String(p.population), 6), BBSColors.textDim);
      }

      r.drawHorizontalLine(0, 20, 64);
      r.putString(2, 21, 'Note: Higher taxes reduce morale.', BBSColors.textDim);
      r.putString(2, 22, 'Low morale may cause unrest or rebellion.', BBSColors.textDim);

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-9] Select Planet    [ESC] Cancel', BBSColors.textDim);
    } else {
      // Planet selected - show tax rate options
      const planet = gs.planetLookup.get(ctx.selectedPlanetId);
      if (!planet) return;

      r.putString(2, 3, `Planet: ${planet.name}`, BBSColors.text);
      r.putString(2, 4, `Current Tax: ${planet.taxRate}%   Morale: ${planet.morale}%`, BBSColors.textDim);
      r.drawHorizontalLine(0, 5, 64);

      r.putString(2, 6, 'Set new tax rate:', BBSColors.textDim);
      r.drawHorizontalLine(0, 7, 64);

      const taxOptions = [0, 10, 25, 50, 75, 100];
      const labels = ['None (0%)', 'Low (10%)', 'Moderate (25%)', 'Standard (50%)', 'High (75%)', 'Maximum (100%)'];
      const effects = ['Max morale growth', 'Good morale', 'Slight morale penalty', 'Moderate penalty', 'Severe penalty', 'Risk of rebellion'];

      for (let i = 0; i < taxOptions.length; i++) {
        const row = 8 + i * 2;
        const isCurrentRate = planet.taxRate === taxOptions[i];
        const color = isCurrentRate ? BBSColors.success : BBSColors.text;

        r.putListItem(2, row, i + 1, '', false);
        r.putString(5, row, labels[i], color);
        r.putString(5, row + 1, effects[i], BBSColors.textDim);
        if (isCurrentRate) {
          r.putString(40, row, '(current)', BBSColors.success);
        }
      }

      r.drawHorizontalLine(0, 26, 64);
      r.putString(2, 27, '[1-6] Set Rate    [ESC] Cancel', BBSColors.textDim);
    }
  }

  private handleTaxRateInput(key: string, ctx: MenuContext): MenuTransition | null {
    const gs = this.controller.gameState;
    if (!gs) return null;

    // If no planet selected, handle planet selection
    if (ctx.selectedPlanetId === undefined) {
      const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);
      const num = parseInt(key);
      if (num >= 1 && num <= playerPlanets.length) {
        this.menuState.updateContext({ selectedPlanetId: playerPlanets[num - 1].id });
        this.renderScreen();
      }
      return null;
    }

    // Planet selected - handle tax rate selection
    const taxOptions = [0, 10, 25, 50, 75, 100];
    const num = parseInt(key);
    if (num >= 1 && num <= taxOptions.length) {
      const newRate = taxOptions[num - 1];
      this.controller.setTaxRate(ctx.selectedPlanetId!, newRate);
      this.logger.logUser('TAX', `Set tax rate to ${newRate}% on planet ${ctx.selectedPlanetId}`);
      this.menuState.popScreen();
      this.renderScreen();
    }

    return null;
  }

  // ============ Research Screen ============

  private renderResearchScreen(r: BBSRenderer, _ctx: MenuContext): void {
    const gs = this.controller.gameState;
    if (!gs) return;

    const upgradeSystem = this.controller.getUpgradeSystem();

    r.drawBox(0, 0, 64, 30);
    r.putCentered(1, 'RESEARCH', BBSColors.textBright);
    r.drawHorizontalLine(0, 2, 64);

    const currentTier = upgradeSystem.getWeaponTier(FactionType.Player);
    const isResearching = upgradeSystem.isResearching(FactionType.Player);
    const turnsRemaining = upgradeSystem.getResearchTurnsRemaining(FactionType.Player);

    const tierNames: Record<string, string> = {
      'Laser': 'Laser (Tier 1)',
      'Missile': 'Missile (Tier 2)',
      'PhotonTorpedo': 'Photon Torpedo (Tier 3)',
    };

    r.putString(2, 3, 'Current Technology:', BBSColors.textDim);
    r.putString(2, 4, `Weapon: ${tierNames[currentTier] || currentTier}`, BBSColors.text);
    r.drawHorizontalLine(0, 5, 64);

    if (isResearching) {
      const researchingTier = upgradeSystem.getResearchingTier(FactionType.Player);
      r.putString(2, 7, 'Research in Progress:', BBSColors.success);
      r.putString(4, 9, `Upgrading to: ${tierNames[researchingTier!] || researchingTier}`, BBSColors.text);
      r.putString(4, 10, `Turns remaining: ${turnsRemaining}`, BBSColors.textDim);

      // Progress bar
      const barWidth = 40;
      const totalTurns = researchingTier === 'Missile' ? 5 : 8;
      const completed = totalTurns - turnsRemaining;
      const filledWidth = Math.floor((completed / totalTurns) * barWidth);
      const bar = '[' + '='.repeat(filledWidth) + ' '.repeat(barWidth - filledWidth) + ']';
      r.putString(4, 12, bar, BBSColors.success);
    } else {
      r.putString(2, 7, 'Available Research:', BBSColors.textDim);
      r.drawHorizontalLine(0, 8, 64);

      const isMaxTier = currentTier === 'PhotonTorpedo';
      if (!isMaxTier) {
        const nextTier = currentTier === 'Laser' ? 'Missile' : 'PhotonTorpedo';
        const cost = nextTier === 'Missile' ? 500000 : 1000000;
        const turns = nextTier === 'Missile' ? 5 : 8;
        const effect = nextTier === 'Missile' ? '+50% damage' : '+100% damage';
        const canAfford = upgradeSystem.canAffordNextResearch(FactionType.Player);

        r.putListItem(2, 10, 1, '', false);
        r.putString(5, 10, `${tierNames[nextTier]}`, canAfford ? BBSColors.text : BBSColors.textDim);
        r.putString(5, 11, `Cost: ${r.formatNumber(cost)} credits`, canAfford ? BBSColors.textDim : BBSColors.error);
        r.putString(5, 12, `Duration: ${turns} turns`, BBSColors.textDim);
        r.putString(5, 13, `Effect: ${effect}`, BBSColors.textDim);

        if (!canAfford) {
          r.putString(40, 10, 'NO FUNDS', BBSColors.error);
        }
      } else {
        r.putString(4, 10, 'Maximum research level achieved!', BBSColors.success);
        r.putString(4, 11, 'Photon Torpedoes are the ultimate weapon.', BBSColors.textDim);
      }
    }

    r.drawHorizontalLine(0, 20, 64);
    r.putString(2, 21, 'Research improves weapon effectiveness', BBSColors.textDim);
    r.putString(2, 22, 'for all Battle Cruisers in combat.', BBSColors.textDim);

    r.drawHorizontalLine(0, 26, 64);
    const isMaxTier = currentTier === 'PhotonTorpedo';
    if (!isResearching && !isMaxTier) {
      r.putString(2, 27, '[1] Start Research    [ESC] Cancel', BBSColors.textDim);
    } else {
      r.putString(2, 27, '[ESC] Back', BBSColors.textDim);
    }
  }

  private handleResearchInput(key: string, _ctx: MenuContext): MenuTransition | null {
    const gs = this.controller.gameState;
    if (!gs) return null;

    if (key === '1') {
      const result = this.controller.startResearch();
      if (result) {
        this.logger.logUser('RESEARCH', 'Started weapon research');
        this.addMessage('Research started!');
        this.menuState.popScreen();
      } else {
        this.addMessage('Cannot start research - check resources or already researching');
      }
      this.renderScreen();
    }

    return null;
  }

  // ============ Gameplay Hints System ============

  /**
   * Get the current gameplay hint based on game state
   * Returns a contextual tip to guide the player through progression
   */
  private getGameplayHint(): string {
    const gs = this.controller.gameState;
    if (!gs) return 'Start a new campaign to begin';

    const playerPlanets = gs.planets.filter(p => p.owner === FactionType.Player);
    const aiPlanets = gs.planets.filter(p => p.owner === FactionType.AI);
    const playerCraft = gs.craft.filter(c => c.owner === FactionType.Player);
    const playerPlatoons = gs.platoons.filter(p => p.owner === FactionType.Player);

    // Check what structures the player has
    let hasMining = false;
    let hasHorticultural = false;
    let hasDockingBay = false;
    let hasOrbitalDefense = false;
    let structuresUnderConstruction = 0;

    for (const planet of playerPlanets) {
      for (const s of planet.structures) {
        if (s.type === BuildingType.MiningStation) hasMining = true;
        if (s.type === BuildingType.HorticulturalStation) hasHorticultural = true;
        if (s.type === BuildingType.DockingBay) hasDockingBay = true;
        if (s.type === BuildingType.OrbitalDefense) hasOrbitalDefense = true;
        if (s.status === 'UnderConstruction') structuresUnderConstruction++;
      }
    }

    // Priority 1: Build Mining Station for resources
    if (!hasMining && structuresUnderConstruction === 0) {
      return 'TIP: Press [B] to build a Mining Station for resources';
    }

    // Priority 2: Build Horticultural Station for food/population
    if (hasMining && !hasHorticultural && structuresUnderConstruction === 0) {
      return 'TIP: Press [B] to build a Horticultural Station for food';
    }

    // Priority 3: Build Docking Bay for spacecraft
    if (hasMining && hasHorticultural && !hasDockingBay && structuresUnderConstruction === 0) {
      return 'TIP: Press [B] to build a Docking Bay for spacecraft';
    }

    // Priority 4: Purchase Battle Cruiser
    if (hasDockingBay && playerCraft.length === 0) {
      return 'TIP: Press [S] to purchase a Battle Cruiser';
    }

    // Priority 5: Commission Platoons
    if (playerCraft.length > 0 && playerPlatoons.length === 0) {
      return 'TIP: Press [C] to commission a Platoon for invasion';
    }

    // Priority 6: Build Orbital Defense
    if (!hasOrbitalDefense && playerPlatoons.length > 0 && structuresUnderConstruction === 0) {
      return 'TIP: Press [B] to build Orbital Defense for protection';
    }

    // Priority 7: Move fleet to attack
    if (playerCraft.length > 0 && playerPlatoons.length > 0 && aiPlanets.length > 0) {
      // Check if any craft are at enemy planets
      const craftAtEnemyPlanet = playerCraft.some(c => {
        const planet = gs.planetLookup.get(c.planetID);
        return planet && planet.owner === FactionType.AI;
      });

      if (!craftAtEnemyPlanet) {
        return 'TIP: Press [M] to move your fleet toward an enemy planet';
      }

      // Ready to invade
      return 'TIP: Press [A] to attack and invade the enemy planet!';
    }

    // Structures under construction - wait
    if (structuresUnderConstruction > 0) {
      return `${structuresUnderConstruction} structure(s) under construction. Press [E] to End Turn`;
    }

    // Default: end turn to progress
    return 'Press [E] to End Turn and advance the game';
  }
}
