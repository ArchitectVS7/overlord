import Phaser from 'phaser';
import { GalaxyGenerator, Galaxy } from '@core/GalaxyGenerator';
import { GameState } from '@core/GameState';
import { InputSystem } from '@core/InputSystem';
import { TurnSystem } from '@core/TurnSystem';
import { PhaseProcessor } from '@core/PhaseProcessor';
import { Difficulty, FactionType, VictoryResult } from '@core/models/Enums';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { InputManager } from './InputManager';
import { CameraController } from './controllers/CameraController';
import { PlanetRenderer } from './renderers/PlanetRenderer';
import { StarFieldRenderer } from './renderers/StarFieldRenderer';
import { PlanetInfoPanel } from './ui/PlanetInfoPanel';
import { TurnHUD } from './ui/TurnHUD';
import { ResourceHUD } from './ui/ResourceHUD';
import { BuildingMenuPanel } from './ui/BuildingMenuPanel';
import { PlatoonCommissionPanel } from './ui/PlatoonCommissionPanel';
import { PlatoonDetailsPanel } from './ui/PlatoonDetailsPanel';
import { SpacecraftPurchasePanel } from './ui/SpacecraftPurchasePanel';
import { PlatoonLoadingPanel } from './ui/PlatoonLoadingPanel';
import { SpacecraftNavigationPanel } from './ui/SpacecraftNavigationPanel';
import { InvasionPanel } from './ui/InvasionPanel';
import { BattleResultsPanel } from './ui/BattleResultsPanel';
import { NotificationManager } from './ui/NotificationToast';
import { OpponentInfoPanel } from './ui/OpponentInfoPanel';
import { PlatoonSystem } from '@core/PlatoonSystem';
import { CraftSystem } from '@core/CraftSystem';
import { EntitySystem } from '@core/EntitySystem';
import { NavigationSystem } from '@core/NavigationSystem';
import { CombatSystem } from '@core/CombatSystem';
import { AIDecisionSystem } from '@core/AIDecisionSystem';
import { AudioManager } from '@core/AudioManager';
import { SaveSystem } from '@core/SaveSystem';
import { VolumeControlPanel } from './ui/VolumeControlPanel';
import { SaveGamePanel } from './ui/SaveGamePanel';
import { AdminEditModeIndicator } from './ui/AdminEditModeIndicator';
import { AdminUIEditorController } from '@services/AdminUIEditorController';
import { getAdminModeService } from '@services/AdminModeService';
import { getUIPanelPositionService } from '@services/UIPanelPositionService';
import { getSaveService } from '@services/SaveService';
import { TopMenuBar } from './ui/TopMenuBar';

export class GalaxyMapScene extends Phaser.Scene {
  private galaxy!: Galaxy;
  private gameState!: GameState;
  private turnSystem!: TurnSystem;
  private phaseProcessor!: PhaseProcessor;
  private inputSystem!: InputSystem;
  private inputManager!: InputManager;
  private cameraController!: CameraController;
  private planetRenderer!: PlanetRenderer;
  private starFieldRenderer!: StarFieldRenderer;
  private planetInfoPanel!: PlanetInfoPanel;
  private turnHUD!: TurnHUD;
  private resourceHUD!: ResourceHUD;
  private buildingMenuPanel!: BuildingMenuPanel;
  private platoonCommissionPanel!: PlatoonCommissionPanel;
  private platoonDetailsPanel!: PlatoonDetailsPanel;
  private spacecraftPurchasePanel!: SpacecraftPurchasePanel;
  private platoonLoadingPanel!: PlatoonLoadingPanel;
  private spacecraftNavigationPanel!: SpacecraftNavigationPanel;
  private invasionPanel!: InvasionPanel;
  private battleResultsPanel!: BattleResultsPanel;
  private notificationManager!: NotificationManager;
  private opponentInfoPanel!: OpponentInfoPanel;
  private platoonSystem!: PlatoonSystem;
  private craftSystem!: CraftSystem;
  private entitySystem!: EntitySystem;
  private navigationSystem!: NavigationSystem;
  private combatSystem!: CombatSystem;
  private aiDecisionSystem!: AIDecisionSystem;
  private volumeControlPanel!: VolumeControlPanel;
  private saveGamePanel!: SaveGamePanel;
  private adminEditIndicator!: AdminEditModeIndicator;
  private adminUIEditor!: AdminUIEditorController;
  private topMenuBar!: TopMenuBar;
  private planetContainers: Map<string, Phaser.GameObjects.Container> = new Map();
  private planetZones: Map<string, Phaser.GameObjects.Zone> = new Map();
  private selectedPlanetId: string | null = null;
  private selectionGraphics!: Phaser.GameObjects.Graphics;
  private controlsText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GalaxyMapScene' });
  }

  public create(): void {
    // Try to get campaign-initialized state from registry (set by CampaignConfigScene)
    const registryGameState = this.registry.get('gameState') as GameState | undefined;
    const registryGalaxy = this.registry.get('galaxy') as Galaxy | undefined;

    // Try to get turnSystem and phaseProcessor from registry
    const registryTurnSystem = this.registry.get('turnSystem') as TurnSystem | undefined;
    const registryPhaseProcessor = this.registry.get('phaseProcessor') as PhaseProcessor | undefined;

    if (registryGameState && registryGalaxy) {
      // Use campaign-initialized state
      this.gameState = registryGameState;
      this.galaxy = registryGalaxy;
      this.turnSystem = registryTurnSystem || new TurnSystem(this.gameState);
      this.phaseProcessor = registryPhaseProcessor || new PhaseProcessor(this.gameState);
      console.log(`Using campaign state: Difficulty=${registryGameState.campaignConfig?.difficulty}, AI=${registryGameState.campaignConfig?.aiPersonality}`);
    } else {
      // Fallback for direct scene access (testing/development)
      console.warn('No campaign state in registry - creating default state');
      this.gameState = new GameState();
      const generator = new GalaxyGenerator();
      this.galaxy = generator.generateGalaxy(42, Difficulty.Normal);
      this.gameState.planets = this.galaxy.planets;
      this.gameState.rebuildLookups();
      this.turnSystem = new TurnSystem(this.gameState);
      this.phaseProcessor = new PhaseProcessor(this.gameState);
    }

    // Initialize input system (platform-agnostic)
    this.inputSystem = new InputSystem({
      enableKeyboard: true,
      enableMouse: true,
      enableFocusWrap: true,
    });

    // Initialize input manager (Phaser integration)
    this.inputManager = new InputManager(this, this.inputSystem, {
      hoverTint: 0xaaaaaa,
      focusBorderColor: 0xffff00,
      focusBorderWidth: 3,
      hoverCursor: 'pointer',
    });

    // Validate state
    if (!this.gameState.validate()) {
      console.error('Invalid game state!');
      return;
    }

    console.log(`Galaxy generated: ${this.galaxy.name}`);
    console.log(`Planets: ${this.galaxy.planets.length}`);

    // Calculate galaxy bounds for camera
    const galaxyBounds = this.calculateGalaxyBounds();

    // Initialize camera controller
    this.cameraController = new CameraController(this, galaxyBounds);

    // Find home planet (first player-owned or first planet) for camera home
    const homePlanet = this.galaxy.planets.find(p => p.owner === FactionType.Player) || this.galaxy.planets[0];
    if (homePlanet) {
      this.cameraController.setHomePosition(homePlanet.position.x, homePlanet.position.z, 1.0);
      this.cameraController.centerOn(homePlanet.position.x, homePlanet.position.z, false);
    }

    // Enable camera controls
    this.cameraController.enableDragPan();
    this.cameraController.enableWheelZoom();

    // Create top menu bar with help and reset camera
    this.topMenuBar = new TopMenuBar(this, {
      showHome: true,
      showHelp: true,
      showResetCamera: true,
      onResetCamera: () => {
        if (!this.cameraController.getIsDragging()) {
          this.cameraController.resetView(true);
        }
      },
    });
    this.topMenuBar.setScrollFactor(0);

    // Initialize renderers
    this.planetRenderer = new PlanetRenderer(this);
    this.starFieldRenderer = new StarFieldRenderer(this);

    // Create star field background (based on galaxy bounds, positioned at bounds origin)
    const starFieldWidth = galaxyBounds.maxX - galaxyBounds.minX + 400;
    const starFieldHeight = galaxyBounds.maxY - galaxyBounds.minY + 400;
    this.starFieldRenderer.createStarField(
      starFieldWidth,
      starFieldHeight,
      galaxyBounds.minX - 200,
      galaxyBounds.minY - 200,
    );

    // Create selection graphics (on top of planets)
    this.selectionGraphics = this.add.graphics();
    this.selectionGraphics.setDepth(100);

    // Create planet info panel (fixed to camera, above everything)
    // Pass BuildingSystem for construction progress tracking (Story 4-3)
    this.planetInfoPanel = new PlanetInfoPanel(this, this.phaseProcessor.getBuildingSystem());

    // Create Turn HUD (top-left corner, fixed to camera)
    this.turnHUD = new TurnHUD(this, 150, 60, this.gameState, this.turnSystem, this.phaseProcessor);
    this.turnHUD.setScrollFactor(0);
    this.turnHUD.setDepth(500);

    // Create Resource HUD (top-right corner, fixed to camera) - Story 4-1
    this.resourceHUD = new ResourceHUD(
      this,
      this.cameras.main.width - 120,
      95,
      this.gameState,
      this.phaseProcessor,
    );
    this.resourceHUD.setScrollFactor(0);
    this.resourceHUD.setDepth(500);

    // Create Building Menu Panel - Story 4-2
    this.buildingMenuPanel = new BuildingMenuPanel(
      this,
      this.gameState,
      this.phaseProcessor.getBuildingSystem(),
    );

    // Wire up PlanetInfoPanel Build button to BuildingMenuPanel
    this.planetInfoPanel.onBuildClick = (planet) => {
      this.planetInfoPanel.hide();
      this.buildingMenuPanel.show(planet);
    };

    // Wire up building completion to refresh ResourceHUD
    this.buildingMenuPanel.onBuildingSelected = () => {
      this.resourceHUD.updateDisplay();
    };

    // Create PlatoonSystem and EntitySystem for military features (Story 5-1)
    this.entitySystem = new EntitySystem(this.gameState);
    this.platoonSystem = new PlatoonSystem(this.gameState, this.entitySystem);

    // Create Platoon Commission Panel - Story 5-1
    this.platoonCommissionPanel = new PlatoonCommissionPanel(this, this.platoonSystem);

    // Wire up PlanetInfoPanel Commission button to PlatoonCommissionPanel
    this.planetInfoPanel.onCommissionClick = (planet) => {
      this.planetInfoPanel.hide();
      const platoonCount = this.entitySystem.getPlatoonsAtPlanet(planet.id).length;
      this.platoonCommissionPanel.show(planet, () => {
        // Refresh UI after panel closes
        this.resourceHUD.updateDisplay();
      }, platoonCount);
    };

    // Create Platoon Details Panel - Story 5-2
    this.platoonDetailsPanel = new PlatoonDetailsPanel(this, this.platoonSystem);

    // Wire up PlanetInfoPanel Platoons button to PlatoonDetailsPanel
    this.planetInfoPanel.onPlatoonsClick = (planet) => {
      this.planetInfoPanel.hide();
      const platoons = this.entitySystem.getPlatoonsAtPlanet(planet.id);
      this.platoonDetailsPanel.show(planet, platoons, () => {
        // Refresh UI after panel closes
        this.resourceHUD.updateDisplay();
      });
    };

    // Wire up disband callback to refresh UI
    this.platoonDetailsPanel.onDisband = () => {
      this.resourceHUD.updateDisplay();
    };

    // Create CraftSystem and SpacecraftPurchasePanel - Story 5-3
    this.craftSystem = new CraftSystem(this.gameState, this.entitySystem);
    this.spacecraftPurchasePanel = new SpacecraftPurchasePanel(this, this.craftSystem);

    // Wire up PlanetInfoPanel Spacecraft button to SpacecraftPurchasePanel
    this.planetInfoPanel.onSpacecraftClick = (planet) => {
      this.planetInfoPanel.hide();
      const fleetCount = this.entitySystem.getCraftAtPlanet(planet.id).length;
      this.spacecraftPurchasePanel.show(planet, () => {
        // Refresh UI after panel closes
        this.resourceHUD.updateDisplay();
      }, fleetCount);
    };

    // Wire up purchase callback to refresh UI
    this.spacecraftPurchasePanel.onPurchase = () => {
      this.resourceHUD.updateDisplay();
    };

    // Create PlatoonLoadingPanel - Story 5-4
    this.platoonLoadingPanel = new PlatoonLoadingPanel(this, this.craftSystem);

    // Wire up PlatoonDetailsPanel Load onto Cruiser button to PlatoonLoadingPanel
    this.platoonDetailsPanel.onLoadRequest = (platoonID) => {
      // Get the planet where this platoon is located
      const platoon = this.gameState.platoonLookup.get(platoonID);
      if (!platoon || platoon.planetID < 0) { return; }

      const planet = this.gameState.planetLookup.get(platoon.planetID);
      if (!planet) { return; }

      // Find Battle Cruisers at this planet
      const cruisers = this.entitySystem.getCraftAtPlanet(planet.id).filter(c => c.type === 'BattleCruiser');
      if (cruisers.length === 0) {
        // No cruisers available - could show notification
        return;
      }

      // Use the first available cruiser for simplicity
      const cruiser = cruisers[0];
      const platoons = this.entitySystem.getPlatoonsAtPlanet(planet.id);

      this.platoonDetailsPanel.hide();
      this.platoonLoadingPanel.show(cruiser, planet, platoons, () => {
        this.resourceHUD.updateDisplay();
      });
    };

    // Wire up load/unload callbacks to refresh UI
    this.platoonLoadingPanel.onLoad = () => {
      this.resourceHUD.updateDisplay();
    };
    this.platoonLoadingPanel.onUnload = () => {
      this.resourceHUD.updateDisplay();
    };

    // Create CombatSystem and NavigationSystem for Story 5-5
    this.combatSystem = new CombatSystem(this.gameState, this.platoonSystem);
    const resourceSystem = this.phaseProcessor.getResourceSystem();
    this.navigationSystem = new NavigationSystem(this.gameState, resourceSystem, this.combatSystem);
    this.spacecraftNavigationPanel = new SpacecraftNavigationPanel(this, this.navigationSystem);

    // Wire up PlanetInfoPanel Navigate button to SpacecraftNavigationPanel
    this.planetInfoPanel.onNavigateClick = (planet) => {
      // Get spacecraft at this planet
      const craft = this.entitySystem.getCraftAtPlanet(planet.id);
      if (craft.length === 0) { return; }

      // For prototype, navigate first available craft
      const firstCraft = craft[0];
      if (firstCraft.inTransit) { return; }

      this.planetInfoPanel.hide();
      this.spacecraftNavigationPanel.show(firstCraft, this.galaxy.planets, () => {
        this.resourceHUD.updateDisplay();
      });
    };

    // Wire up navigation callback to refresh UI
    this.spacecraftNavigationPanel.onNavigate = () => {
      this.resourceHUD.updateDisplay();
    };

    // Create InvasionPanel - Story 6-1
    this.invasionPanel = new InvasionPanel(this);

    // Create BattleResultsPanel - Story 6-3
    this.battleResultsPanel = new BattleResultsPanel(this);

    // Create NotificationManager - Story 7-1
    this.notificationManager = new NotificationManager(this);

    // Create OpponentInfoPanel - Story 7-2
    this.opponentInfoPanel = new OpponentInfoPanel(this, 20, 140);

    // Create AIDecisionSystem - Story 7-1
    const aiIncomeSystem = this.phaseProcessor.getIncomeSystem();
    const aiBuildingSystem = this.phaseProcessor.getBuildingSystem();
    const aiResourceSystem = this.phaseProcessor.getResourceSystem();
    this.aiDecisionSystem = new AIDecisionSystem(
      this.gameState,
      aiIncomeSystem,
      aiResourceSystem,
      aiBuildingSystem,
      this.craftSystem,
      this.platoonSystem,
    );

    // Set opponent info panel - Story 7-2
    const personalityName = this.aiDecisionSystem.getPersonalityName();
    const difficultyName = this.aiDecisionSystem.getDifficulty(); // Already a string enum value
    this.opponentInfoPanel.setOpponentInfo('AI Commander', personalityName, difficultyName);

    // Wire up AI event notifications - Story 7-1
    this.aiDecisionSystem.onAITurnStarted = () => {
      this.notificationManager.showNotification('AI opponent is taking their turn...', 'info');
    };

    this.aiDecisionSystem.onAITurnCompleted = () => {
      this.notificationManager.showNotification('AI turn completed', 'info');
    };

    this.aiDecisionSystem.onAIBuilding = (planetID, buildingType) => {
      const planet = this.gameState.planetLookup.get(planetID);
      if (planet) {
        this.notificationManager.showNotification(
          `AI constructed ${buildingType} on ${planet.name}`,
          'warning',
        );
      }
    };

    this.aiDecisionSystem.onAIAttacking = (targetPlanetID) => {
      const planet = this.gameState.planetLookup.get(targetPlanetID);
      if (planet) {
        this.notificationManager.showNotification(
          `Enemy fleet detected near ${planet.name}!`,
          'danger',
        );
      }
    };

    // Wire up PlanetInfoPanel Invade button to InvasionPanel
    this.planetInfoPanel.onInvadeClick = (planet) => {
      // Only allow invading AI-owned planets
      if (planet.owner !== FactionType.AI) { return; }

      // Get player cruisers with loaded platoons at this planet (nearby for invasion)
      const playerCraft = Array.from(this.gameState.craftLookup.values())
        .filter(c => c.owner === FactionType.Player && c.carriedPlatoonIDs.length > 0);

      // Get all player platoons for lookup
      const allPlatoons = Array.from(this.gameState.platoonLookup.values());

      this.planetInfoPanel.hide();
      this.invasionPanel.show(planet, playerCraft, allPlatoons, () => {
        this.resourceHUD.updateDisplay();
      });
    };

    // Wire up invasion callback to trigger combat - Story 6-3
    this.invasionPanel.onInvade = (planet, aggression) => {
      // Simulate battle outcome (full combat integration in future story)
      const attackerStrength = this.invasionPanel.getTotalStrength();
      const defenderStrength = planet.population * 10; // Rough defender strength

      // Higher aggression = more risk but higher damage
      const aggressionBonus = (aggression - 50) / 100; // -0.5 to +0.5
      const attackerEffective = attackerStrength * (1 + aggressionBonus);

      const victory = attackerEffective > defenderStrength;

      // Calculate casualties based on aggression and outcome
      const baseCasualties = this.invasionPanel.getTotalTroopCount();
      const attackerLossRate = victory ? (aggression / 200) : (aggression / 100); // 0-50% or 0-100%
      const defenderLossRate = victory ? 0.8 : 0.3;

      const attackerCasualties = Math.floor(baseCasualties * attackerLossRate);
      const defenderCasualties = Math.floor(planet.population * defenderLossRate);

      // Show battle results
      this.battleResultsPanel.show({
        victory,
        planetName: planet.name,
        attackerCasualties,
        defenderCasualties,
        resourcesCaptured: victory ? {
          credits: Math.floor(planet.population * 10),
          minerals: Math.floor(planet.population * 5),
          fuel: Math.floor(planet.population * 2),
        } : undefined,
        defeatReason: victory ? undefined : 'Superior enemy defenses overwhelmed your forces',
      }, () => {
        // On close callback
        if (victory) {
          // Transfer planet ownership
          planet.owner = FactionType.Player;
          // Planet display will update automatically on next render
        }
        this.resourceHUD.updateDisplay();
      });
    };

    // Wire up building completion notifications (Story 4-3: AC3)
    this.phaseProcessor.onBuildingCompleted = (planetId, buildingType) => {
      const planet = this.gameState.planetLookup.get(planetId);
      const planetName = planet?.name || `Planet ${planetId}`;
      const buildingName = this.getBuildingDisplayName(buildingType);

      // Show completion notification (AC3: notification with benefit description)
      this.showBuildingCompletedNotification(buildingName, planetName, buildingType);

      // Refresh UI if the planet info panel is showing this planet
      if (this.selectedPlanetId && parseInt(this.selectedPlanetId) === planetId) {
        const selectedPlanet = this.gameState.planetLookup.get(planetId);
        if (selectedPlanet) {
          this.planetInfoPanel.setPlanet(selectedPlanet);
        }
      }
    };

    // Wire up income system notifications (Story 4-4: AC3, AC4)
    const incomeSystem = this.phaseProcessor.getIncomeSystem();

    // Story 4-4 AC3: Low morale income penalty warning
    incomeSystem.onLowMoraleIncomePenalty = (_planetID, planetName, penaltyPercent) => {
      this.showIncomeWarningNotification(
        `⚠️ Low morale on ${planetName} reducing income by ${penaltyPercent}%`,
        'warning',
      );
    };

    // Story 4-4 AC4: No planets owned warning
    incomeSystem.onNoPlanetsOwned = (faction) => {
      if (faction === FactionType.Player) {
        this.showIncomeWarningNotification(
          '⚠️ No planets owned - no income generated!',
          'critical',
        );
      }
    };

    // Wire up victory/defeat detection (Story 2-4, 2-5)
    this.setupVictoryDetection();

    // Create Volume Control Panel - Story 12-3
    this.volumeControlPanel = new VolumeControlPanel(this);
    this.volumeControlPanel.setPosition(
      this.cameras.main.width / 2 - 200,
      this.cameras.main.height / 2 - 175,
    );
    this.volumeControlPanel.setScrollFactor(0);
    this.volumeControlPanel.setDepth(1500);

    // Create Save Game Panel - Story 10-3
    this.saveGamePanel = new SaveGamePanel(this);
    this.saveGamePanel.setPosition(
      this.cameras.main.width / 2 - 250,
      this.cameras.main.height / 2 - 225,
    );
    this.saveGamePanel.setScrollFactor(0);
    this.saveGamePanel.setDepth(1500);
    this.wireUpSavePanel();

    // Initialize Admin UI Editor
    this.setupAdminUIEditor();

    // Render all planets
    this.renderPlanets();

    // Setup keyboard shortcuts
    this.registerKeyboardShortcuts();

    // Setup input callbacks
    this.setupInputCallbacks();

    // Setup arrow key navigation
    this.setupArrowKeyNavigation();

    // Add debug info and controls help
    this.addDebugInfo();
    this.addControlsHelp();

    // Auto-select player's home planet (AC5: Default Selection)
    this.autoSelectHomePlanet();
  }

  private calculateGalaxyBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    this.galaxy.planets.forEach(planet => {
      minX = Math.min(minX, planet.position.x);
      maxX = Math.max(maxX, planet.position.x);
      minY = Math.min(minY, planet.position.z);
      maxY = Math.max(maxY, planet.position.z);
    });

    // Add padding
    const padding = 200;
    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
    };
  }

  private registerKeyboardShortcuts(): void {
    // Escape - Pause Menu
    this.inputManager.registerShortcut({
      key: 'Escape',
      action: 'pause',
    });

    // H - Help
    this.inputManager.registerShortcut({
      key: 'h',
      action: 'help',
    });

    // O - Objectives
    this.inputManager.registerShortcut({
      key: 'o',
      action: 'objectives',
    });

    // M - Main Menu
    this.inputManager.registerShortcut({
      key: 'm',
      action: 'mainMenu',
    });

    // Ctrl+S - Save
    this.inputManager.registerShortcut({
      key: 's',
      ctrl: true,
      action: 'save',
    });

    // Ctrl+M - Mute Toggle
    this.inputManager.registerShortcut({
      key: 'm',
      ctrl: true,
      action: 'mute',
    });

    // Ctrl+, - Audio Settings (Story 12-3)
    this.inputManager.registerShortcut({
      key: ',',
      ctrl: true,
      action: 'audioSettings',
    });
  }

  private setupInputCallbacks(): void {
    this.inputSystem.setCallbacks({
      onShortcutTriggered: (action, _timestamp) => {
        this.handleShortcut(action);
      },
      onFocusChanged: (elementId) => {
        this.updateSelectionVisuals();
        if (elementId) {
          console.log(`Focus changed to: ${elementId}`);
        }
      },
      onElementActivated: (elementId, method) => {
        this.selectPlanet(elementId);
        console.log(`Planet ${elementId} activated via ${method}`);
      },
      onHoverChanged: (_elementId) => {
        // Hover visuals handled by InputManager
      },
    });
  }

  private handleShortcut(action: string): void {
    switch (action) {
      case 'pause':
        // Close planet info panel if open, otherwise show pause menu
        if (this.planetInfoPanel && this.planetInfoPanel.getIsVisible()) {
          this.planetInfoPanel.hide();
        } else {
          console.log('Pause menu (Esc pressed)');
          // TODO: Show pause menu
        }
        break;
      case 'help':
        console.log('Help overlay (H pressed)');
        if (this.controlsText) {
          this.controlsText.setVisible(!this.controlsText.visible);
        }
        break;
      case 'objectives':
        console.log('Objectives panel (O pressed)');
        // TODO: Show objectives
        break;
      case 'mainMenu':
        console.log('Main menu (M pressed)');
        // TODO: Return to main menu
        break;
      case 'save':
        console.log('Save game (Ctrl+S pressed)');
        this.saveGamePanel.show();
        break;
      case 'mute': {
        const audioManager = AudioManager.getInstance();
        audioManager.toggleMute();
        const muteState = audioManager.isMuted() ? 'muted' : 'unmuted';
        console.log(`Audio ${muteState} (Ctrl+M pressed)`);
        // Show notification
        if (this.notificationManager) {
          this.notificationManager.showNotification(`Audio ${muteState}`, 'info');
        }
        break;
      }
      case 'audioSettings':
        // Toggle audio settings panel
        if (this.volumeControlPanel.visible) {
          this.volumeControlPanel.hide();
          this.volumeControlPanel.saveSettings();
          console.log('Audio settings closed (Ctrl+, pressed)');
        } else {
          this.volumeControlPanel.show();
          console.log('Audio settings opened (Ctrl+, pressed)');
        }
        break;
      case 'endTurn':
        console.log('End turn (Space pressed in action phase)');
        // TODO: End turn
        break;
    }
  }

  private renderPlanets(): void {
    // Sort planets for consistent focus order (top-left to bottom-right by screen distance)
    // Using screen coordinates: X for horizontal, Z for vertical (2D projection)
    const sortedPlanets = [...this.galaxy.planets].sort((a, b) => {
      // Calculate distance from top-left (0,0) using Manhattan distance for predictable order
      // Prioritize vertical position (row), then horizontal (column)
      const aRow = Math.round(a.position.z / 50); // Group into rows
      const bRow = Math.round(b.position.z / 50);
      if (aRow !== bRow) {
        return aRow - bRow; // Sort by row first
      }
      return a.position.x - b.position.x; // Then by x within row
    });

    sortedPlanets.forEach((planet, index) => {
      this.renderPlanet(planet, index);
    });
  }

  private renderPlanet(planet: PlanetEntity, focusOrder: number): void {
    // Use PlanetRenderer to create the planet visual
    const container = this.planetRenderer.renderPlanet(planet);
    container.setDepth(10); // Above star field, below selection

    // Store container reference
    const planetIdStr = String(planet.id);
    this.planetContainers.set(planetIdStr, container);

    // Get hit area size for this planet type
    const hitSize = this.planetRenderer.getHitAreaSize(planet.type);

    // Create interactive zone for this planet
    const zone = this.add.zone(planet.position.x, planet.position.z, hitSize, hitSize);
    zone.setRectangleDropZone(hitSize, hitSize);
    this.planetZones.set(planetIdStr, zone);

    // Register with InputManager
    this.inputManager.registerInteractive(planetIdStr, zone, focusOrder);
  }

  private selectPlanet(planetId: string): void {
    // Don't select if we're dragging the camera
    if (this.cameraController && this.cameraController.getIsDragging()) {
      return;
    }

    this.selectedPlanetId = planetId;
    this.updateSelectionVisuals();

    const planetIdNum = parseInt(planetId, 10);
    const planet = this.galaxy.planets.find(p => p.id === planetIdNum);
    if (planet) {
      console.log(`Selected planet: ${planet.name} (Owner: ${planet.owner})`);

      // Auto-pan to planet if not visible
      this.cameraController.panToIfNotVisible(planet.position.x, planet.position.z, 100);

      // Show planet info panel
      this.planetInfoPanel.setPlanet(planet);
      this.planetInfoPanel.show();
    }
  }

  private updateSelectionVisuals(): void {
    this.selectionGraphics.clear();

    // Draw selection indicator (cyan solid ring) for selected planet
    if (this.selectedPlanetId) {
      const selectedContainer = this.planetContainers.get(this.selectedPlanetId);
      if (selectedContainer) {
        const selectedPlanet = selectedContainer.getData('planet') as PlanetEntity | null;
        const selectedHitSize = selectedPlanet
          ? this.planetRenderer.getHitAreaSize(selectedPlanet.type)
          : 44;
        const selectedRadius = selectedHitSize / 2 + 8;

        // Cyan selection ring (3px thick, per WCAG)
        this.selectionGraphics.lineStyle(3, 0x00ffff, 1);
        this.selectionGraphics.strokeCircle(selectedContainer.x, selectedContainer.y, selectedRadius);
      }
    }

    // Draw focus indicator (yellow dashed ring) for focused planet
    const focusedId = this.inputSystem.getFocusedElementId();
    if (focusedId && focusedId !== this.selectedPlanetId) {
      const container = this.planetContainers.get(focusedId);
      if (container) {
        const planet = container.getData('planet') as PlanetEntity | null;
        const hitSize = planet ? this.planetRenderer.getHitAreaSize(planet.type) : 44;
        const radius = hitSize / 2 + 5;

        // Yellow focus ring (3px thick, per WCAG)
        this.selectionGraphics.lineStyle(3, 0xffff00, 1);
        this.selectionGraphics.strokeCircle(container.x, container.y, radius);
      }
    }
  }

  private addDebugInfo(): void {
    // Position in bottom-left corner, clear of other UI elements
    const debugX = 10;
    const debugY = this.cameras.main.height - 140;

    const debugText = this.add.text(debugX, debugY, '', {
      fontSize: '12px',
      color: '#ffaa00',
      fontFamily: 'monospace',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: { x: 8, y: 6 },
    });
    debugText.setScrollFactor(0);
    debugText.setDepth(100);

    const updateDebug = () => {
      const focusedId = this.inputSystem.getFocusedElementId();
      const focusedPlanet = focusedId
        ? this.galaxy.planets.find(p => String(p.id) === focusedId)
        : null;

      debugText.setText([
        '── DEBUG PANEL ──',
        `Galaxy: ${this.galaxy.name}`,
        `Seed: ${this.galaxy.seed}`,
        `Planets: ${this.galaxy.planets.length}`,
        `Turn: ${this.gameState.currentTurn}`,
        `Focused: ${focusedPlanet?.name || 'None'}`,
        `Selected: ${this.selectedPlanetId || 'None'}`,
      ]);
    };

    // Update debug info periodically
    this.time.addEvent({
      delay: 100,
      callback: updateDebug,
      loop: true,
    });

    updateDebug();
  }

  private addControlsHelp(): void {
    this.controlsText = this.add.text(
      this.cameras.main.width - 10,
      10,
      [
        'Controls:',
        '',
        'Mouse: Click to select',
        'Mouse Drag: Pan map',
        'Mouse Wheel: Zoom',
        'Tab: Cycle focus',
        'Shift+Tab: Cycle back',
        'Arrows: Navigate planets',
        'Enter/Space: Select focused',
        '',
        'Shortcuts:',
        'T: End Turn (Action phase)',
        'Esc: Pause menu',
        'H: Help overlay',
        'O: Objectives',
        'M: Main menu',
        'Ctrl+S: Save game',
      ].join('\n'),
      {
        fontSize: '12px',
        color: '#cccccc',
        fontFamily: 'monospace',
        backgroundColor: '#000000',
        padding: { x: 5, y: 5 },
        align: 'right',
      },
    );
    this.controlsText.setOrigin(1, 0);
    this.controlsText.setScrollFactor(0);
    this.controlsText.setVisible(false); // Hidden by default
  }

  /**
   * Sets up arrow key navigation for planet selection.
   * Arrow keys move focus to the nearest planet in that direction.
   */
  private setupArrowKeyNavigation(): void {
    this.input.keyboard?.on('keydown-UP', () => this.navigateToNearest('up'));
    this.input.keyboard?.on('keydown-DOWN', () => this.navigateToNearest('down'));
    this.input.keyboard?.on('keydown-LEFT', () => this.navigateToNearest('left'));
    this.input.keyboard?.on('keydown-RIGHT', () => this.navigateToNearest('right'));
  }

  /**
   * Navigates to the nearest planet in the specified direction from the current focus.
   */
  private navigateToNearest(direction: 'up' | 'down' | 'left' | 'right'): void {
    const currentId = this.inputSystem.getFocusedElementId();
    if (!currentId) {
      // If no focus, focus first planet
      if (this.galaxy.planets.length > 0) {
        this.inputSystem.setFocus(String(this.galaxy.planets[0].id));
      }
      return;
    }

    const currentPlanetId = parseInt(currentId, 10);
    const currentPlanet = this.galaxy.planets.find(p => p.id === currentPlanetId);
    if (!currentPlanet) { return; }

    const cx = currentPlanet.position.x;
    const cy = currentPlanet.position.z;

    let bestPlanet: PlanetEntity | null = null;
    let bestDistance = Infinity;

    for (const planet of this.galaxy.planets) {
      if (planet.id === currentPlanetId) { continue; }

      const px = planet.position.x;
      const py = planet.position.z;
      const dx = px - cx;
      const dy = py - cy;

      // Check if planet is in the correct direction
      let isInDirection = false;
      switch (direction) {
        case 'up': isInDirection = dy < -10; break;
        case 'down': isInDirection = dy > 10; break;
        case 'left': isInDirection = dx < -10; break;
        case 'right': isInDirection = dx > 10; break;
      }

      if (isInDirection) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPlanet = planet;
        }
      }
    }

    if (bestPlanet) {
      this.inputSystem.setFocus(String(bestPlanet.id));
      this.updateSelectionVisuals();
    }
  }

  /**
   * Auto-selects the player's home planet on scene load.
   * Implements AC5: Default Selection requirement.
   */
  private autoSelectHomePlanet(): void {
    const homePlanet = this.galaxy.planets.find(p => p.owner === FactionType.Player);
    if (homePlanet) {
      const planetId = String(homePlanet.id);
      // Set both focus and selection
      this.inputSystem.setFocus(planetId);
      this.selectedPlanetId = planetId;
      this.updateSelectionVisuals();
      console.log(`Auto-selected home planet: ${homePlanet.name}`);
    }
  }

  /**
   * Sets up victory/defeat detection callbacks.
   * Story 2-4: Victory detection when all AI planets captured
   * Story 2-5: Defeat detection when all player planets lost
   */
  private setupVictoryDetection(): void {
    // Store original callback for cleanup
    const originalOnVictoryAchieved = this.turnSystem.onVictoryAchieved;

    this.turnSystem.onVictoryAchieved = (result: VictoryResult) => {
      // Chain with original callback
      originalOnVictoryAchieved?.(result);

      // Measure detection time for AC-1 compliance (< 1 second)
      const startTime = performance.now();

      if (result === VictoryResult.PlayerVictory) {
        console.log('Victory achieved! Transitioning to Victory Scene...');
        this.scene.start('VictoryScene');
      } else if (result === VictoryResult.AIVictory) {
        console.log('Defeat! Transitioning to Defeat Scene...');
        this.scene.start('DefeatScene');
      }

      const detectionTime = performance.now() - startTime;
      console.log(`Victory/defeat detection completed in ${detectionTime.toFixed(2)}ms`);
    };
  }

  /**
   * Wire up Save Game Panel callbacks - Story 10-3
   */
  private wireUpSavePanel(): void {
    this.saveGamePanel.onSaveRequested = async (slotName: string, saveName: string) => {
      this.saveGamePanel.setLoading(true);

      try {
        // Create SaveData from GameState
        const saveSystem = new SaveSystem(this.gameState);
        // TODO: Implement proper playtime tracking
        const playtime = 0;
        const saveData = saveSystem.createSaveData('0.1.0', playtime, saveName);

        const saveService = getSaveService();
        await saveService.saveGame(saveData, slotName, saveName);

        this.saveGamePanel.showSuccess('Game saved successfully!');
        this.notificationManager.showNotification('Game saved', 'info');

        // Auto-close after delay
        this.time.delayedCall(1500, () => {
          this.saveGamePanel.hide();
        });
      } catch (error) {
        console.error('Save failed:', error);
        const message = error instanceof Error ? error.message : 'Save failed';
        this.saveGamePanel.showError(message);
        this.notificationManager.showNotification('Save failed', 'danger');
      } finally {
        this.saveGamePanel.setLoading(false);
      }
    };

    this.saveGamePanel.onClose = () => {
      // No special cleanup needed
    };

    // Setup auto-save on turn end
    this.setupAutoSave();
  }

  /**
   * Setup auto-save functionality - Story 10-3
   * Saves to 'autosave' slot at the end of each turn
   */
  private setupAutoSave(): void {
    const originalOnTurnEnded = this.turnSystem.onTurnEnded;

    this.turnSystem.onTurnEnded = async (turn: number) => {
      // Chain with original callback
      originalOnTurnEnded?.(turn);

      // Auto-save to autosave slot
      try {
        const saveSystem = new SaveSystem(this.gameState);
        const saveData = saveSystem.createSaveData('0.1.0', 0, `Auto-save Turn ${turn}`);

        const saveService = getSaveService();
        await saveService.saveGame(saveData, 'autosave', `Auto-save Turn ${turn}`);

        console.log(`Auto-saved at turn ${turn}`);
        this.notificationManager.showNotification('Auto-saved', 'info');
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Don't interrupt gameplay for auto-save failures
      }
    };
  }

  /**
   * Gets display name for a building type (Story 4-3)
   */
  private getBuildingDisplayName(buildingType: string): string {
    switch (buildingType) {
      case 'MiningStation': return 'Mining Station';
      case 'HorticulturalStation': return 'Horticultural Station';
      case 'DockingBay': return 'Docking Bay';
      case 'OrbitalDefense': return 'Orbital Defense';
      case 'SurfacePlatform': return 'Surface Platform';
      default: return buildingType;
    }
  }

  /**
   * Gets benefit description for a building type (Story 4-3)
   */
  private getBuildingBenefitDescription(buildingType: string): string {
    switch (buildingType) {
      case 'MiningStation': return '+50 Minerals/turn, +30 Fuel/turn';
      case 'HorticulturalStation': return '+100 Food/turn';
      case 'DockingBay': return '+1 Orbital Slot';
      case 'OrbitalDefense': return '+20% Defense Bonus';
      case 'SurfacePlatform': return '+1 Surface Slot';
      default: return '';
    }
  }

  /**
   * Shows building completion notification (Story 4-3: AC3)
   * "[Building Name] completed on [Planet Name]! +[benefit description]"
   */
  private showBuildingCompletedNotification(
    buildingName: string,
    planetName: string,
    buildingType: string,
  ): void {
    const benefit = this.getBuildingBenefitDescription(buildingType);
    const message = benefit
      ? `${buildingName} completed on ${planetName}! ${benefit}`
      : `${buildingName} completed on ${planetName}!`;

    // Create notification at bottom center
    const notification = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 100,
      message,
      {
        fontSize: '16px',
        color: '#00bfff',
        fontFamily: 'monospace',
        backgroundColor: 'rgba(0, 34, 68, 0.9)',
        padding: { x: 15, y: 10 },
      },
    );
    notification.setOrigin(0.5);
    notification.setScrollFactor(0);
    notification.setDepth(1200);

    // Fade out after 3 seconds (AC4: can dismiss)
    this.tweens.add({
      targets: notification,
      alpha: 0,
      duration: 500,
      delay: 3000,
      onComplete: () => notification.destroy(),
    });

    // Make notification dismissible by click
    notification.setInteractive({ useHandCursor: true });
    notification.on('pointerdown', () => {
      this.tweens.killTweensOf(notification);
      notification.destroy();
    });
  }

  /**
   * Shows income warning notification (Story 4-4: AC3, AC4)
   * @param message Warning message to display
   * @param severity 'warning' for yellow, 'critical' for red
   */
  private showIncomeWarningNotification(
    message: string,
    severity: 'warning' | 'critical',
  ): void {
    const color = severity === 'critical' ? '#ff4444' : '#ffcc00';
    const bgColor = severity === 'critical' ? 'rgba(80, 0, 0, 0.9)' : 'rgba(80, 60, 0, 0.9)';

    // Create notification at bottom center (stacked above building notifications)
    const notification = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 140,
      message,
      {
        fontSize: '14px',
        color: color,
        fontFamily: 'monospace',
        backgroundColor: bgColor,
        padding: { x: 15, y: 8 },
      },
    );
    notification.setOrigin(0.5);
    notification.setScrollFactor(0);
    notification.setDepth(1200);

    // Fade out after 4 seconds (longer for warnings)
    this.tweens.add({
      targets: notification,
      alpha: 0,
      duration: 500,
      delay: 4000,
      onComplete: () => notification.destroy(),
    });

    // Make notification dismissible by click
    notification.setInteractive({ useHandCursor: true });
    notification.on('pointerdown', () => {
      this.tweens.killTweensOf(notification);
      notification.destroy();
    });
  }

  /**
   * Sets up the Admin UI Editor for repositioning UI panels.
   * Only active for admin users.
   */
  private async setupAdminUIEditor(): Promise<void> {
    const adminService = getAdminModeService();
    const positionService = getUIPanelPositionService();

    // Create the UI editor controller
    this.adminUIEditor = new AdminUIEditorController(this, 'GalaxyMapScene');

    // Create the edit mode indicator with callbacks
    this.adminEditIndicator = new AdminEditModeIndicator(this, {
      onSaveAll: async () => {
        const positions = this.adminUIEditor.getPendingChanges();
        if (positions.length > 0) {
          const result = await positionService.saveAllPositions(positions);
          if (result.success) {
            this.adminUIEditor.clearPendingChanges();
            console.log('Saved all panel positions');
          } else {
            console.error('Failed to save positions:', result.error);
          }
        }
      },
      onResetAll: () => {
        this.adminUIEditor.resetAllPositions();
      },
      onDiscard: () => {
        this.adminUIEditor.resetAllPositions();
        this.adminUIEditor.clearPendingChanges();
      },
      onExit: () => {
        adminService.exitEditMode();
      },
    });

    // Register panels with the editor
    // TurnHUD - positioned at top-left
    this.adminUIEditor.registerPanel(this.turnHUD, 'TurnHUD', 150, 60, 220, 120);

    // ResourceHUD - positioned at top-right
    this.adminUIEditor.registerPanel(
      this.resourceHUD,
      'ResourceHUD',
      this.cameras.main.width - 220, // Moved left to avoid cutting off
      95,
      220,
      160,
    );

    // OpponentInfoPanel - positioned at top-left below TurnHUD
    // Uses top-left aligned graphics (not centered)
    // Moved down y:140 -> y:200 to avoid overlap
    this.adminUIEditor.registerPanel(this.opponentInfoPanel, 'OpponentInfoPanel', 20, 200, 240, 120, false);

    // Apply stored positions from database
    await this.applyStoredPanelPositions();

    // Wire up edit mode toggle
    adminService.onEditModeChanged = (active) => {
      if (active) {
        this.adminUIEditor.enableEditMode();
        this.adminEditIndicator.show();
      } else {
        this.adminUIEditor.disableEditMode();
        this.adminEditIndicator.hide();
      }
    };

    // Register keyboard shortcut (Ctrl+Shift+E)
    adminService.registerKeyboardShortcut(this);

    // Update indicator when pending changes change
    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (adminService.isEditModeActive()) {
          this.adminEditIndicator.updateChangesCount(
            this.adminUIEditor.getPendingChangesCount(),
          );
        }
      },
      loop: true,
    });
  }

  /**
   * Applies stored panel positions from the database.
   */
  private async applyStoredPanelPositions(): Promise<void> {
    const positionService = getUIPanelPositionService();
    const positions = await positionService.getPositionsForScene('GalaxyMapScene');

    for (const [panelId, position] of positions) {
      this.adminUIEditor.applyPosition(panelId, position.x, position.y);
    }

    if (positions.size > 0) {
      console.log(`Applied ${positions.size} stored panel positions for GalaxyMapScene`);
    }
  }

  public shutdown(): void {
    // Clean up admin UI editor
    if (this.adminUIEditor) {
      this.adminUIEditor.destroy();
    }
    if (this.adminEditIndicator) {
      this.adminEditIndicator.destroy();
    }
    if (this.topMenuBar) {
      this.topMenuBar.destroy();
    }
    if (this.cameraController) {
      this.cameraController.destroy();
    }
    if (this.inputManager) {
      this.inputManager.destroy();
    }
    if (this.starFieldRenderer) {
      this.starFieldRenderer.destroy();
    }
    if (this.planetInfoPanel) {
      this.planetInfoPanel.destroy();
    }
    if (this.turnHUD) {
      this.turnHUD.destroy();
    }
    if (this.resourceHUD) {
      this.resourceHUD.destroy();
    }
    if (this.buildingMenuPanel) {
      this.buildingMenuPanel.destroy();
    }
    if (this.platoonCommissionPanel) {
      this.platoonCommissionPanel.destroy();
    }
    if (this.platoonDetailsPanel) {
      this.platoonDetailsPanel.destroy();
    }
    if (this.spacecraftPurchasePanel) {
      this.spacecraftPurchasePanel.destroy();
    }
    if (this.platoonLoadingPanel) {
      this.platoonLoadingPanel.destroy();
    }
    if (this.spacecraftNavigationPanel) {
      this.spacecraftNavigationPanel.destroy();
    }
    if (this.invasionPanel) {
      this.invasionPanel.destroy();
    }
    this.planetContainers.clear();
    this.planetZones.clear();
  }
}
