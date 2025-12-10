import Phaser from 'phaser';
import { GalaxyGenerator, Galaxy } from '@core/GalaxyGenerator';
import { GameState } from '@core/GameState';
import { InputSystem } from '@core/InputSystem';
import { Difficulty, FactionType } from '@core/models/Enums';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { InputManager } from './InputManager';
import { CameraController } from './controllers/CameraController';
import { PlanetRenderer } from './renderers/PlanetRenderer';
import { StarFieldRenderer } from './renderers/StarFieldRenderer';

export class GalaxyMapScene extends Phaser.Scene {
  private galaxy!: Galaxy;
  private gameState!: GameState;
  private inputSystem!: InputSystem;
  private inputManager!: InputManager;
  private cameraController!: CameraController;
  private planetRenderer!: PlanetRenderer;
  private starFieldRenderer!: StarFieldRenderer;
  private planetContainers: Map<string, Phaser.GameObjects.Container> = new Map();
  private planetZones: Map<string, Phaser.GameObjects.Zone> = new Map();
  private selectedPlanetId: string | null = null;
  private selectionGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GalaxyMapScene' });
  }

  public create(): void {
    // Initialize game state
    this.gameState = new GameState();

    // Initialize input system (platform-agnostic)
    this.inputSystem = new InputSystem({
      enableKeyboard: true,
      enableMouse: true,
      enableFocusWrap: true
    });

    // Initialize input manager (Phaser integration)
    this.inputManager = new InputManager(this, this.inputSystem, {
      hoverTint: 0xaaaaaa,
      focusBorderColor: 0xffff00,
      focusBorderWidth: 3,
      hoverCursor: 'pointer'
    });

    // Generate galaxy with fixed seed for testing (42)
    const generator = new GalaxyGenerator();
    this.galaxy = generator.generateGalaxy(42, Difficulty.Normal);
    this.gameState.planets = this.galaxy.planets;

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

    // Initialize renderers
    this.planetRenderer = new PlanetRenderer(this);
    this.starFieldRenderer = new StarFieldRenderer(this);

    // Create star field background (based on galaxy bounds)
    const starFieldWidth = galaxyBounds.maxX - galaxyBounds.minX + 400;
    const starFieldHeight = galaxyBounds.maxY - galaxyBounds.minY + 400;
    this.starFieldRenderer.createStarField(starFieldWidth, starFieldHeight);

    // Create selection graphics (on top of planets)
    this.selectionGraphics = this.add.graphics();
    this.selectionGraphics.setDepth(100);

    // Render all planets
    this.renderPlanets();

    // Setup keyboard shortcuts
    this.registerKeyboardShortcuts();

    // Setup input callbacks
    this.setupInputCallbacks();

    // Setup arrow key navigation
    this.setupArrowKeyNavigation();

    // Add Reset View button
    this.addResetViewButton();

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
      maxY: maxY + padding
    };
  }

  private registerKeyboardShortcuts(): void {
    // Escape - Pause Menu
    this.inputManager.registerShortcut({
      key: 'Escape',
      action: 'pause'
    });

    // H - Help
    this.inputManager.registerShortcut({
      key: 'h',
      action: 'help'
    });

    // O - Objectives
    this.inputManager.registerShortcut({
      key: 'o',
      action: 'objectives'
    });

    // M - Main Menu
    this.inputManager.registerShortcut({
      key: 'm',
      action: 'mainMenu'
    });

    // Ctrl+S - Save
    this.inputManager.registerShortcut({
      key: 's',
      ctrl: true,
      action: 'save'
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
      }
    });
  }

  private handleShortcut(action: string): void {
    switch (action) {
      case 'pause':
        console.log('Pause menu (Esc pressed)');
        // TODO: Show pause menu
        break;
      case 'help':
        console.log('Help overlay (H pressed)');
        // TODO: Show help
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
        // TODO: Save game
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

      // TODO: Show planet details panel
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
    const debugText = this.add.text(10, 10, '', {
      fontSize: '12px',
      color: '#00ff00',
      fontFamily: 'monospace',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 }
    });
    debugText.setScrollFactor(0);

    const updateDebug = () => {
      const focusedId = this.inputSystem.getFocusedElementId();
      const focusedPlanet = focusedId
        ? this.galaxy.planets.find(p => String(p.id) === focusedId)
        : null;

      debugText.setText([
        `Galaxy: ${this.galaxy.name}`,
        `Seed: ${this.galaxy.seed}`,
        `Planets: ${this.galaxy.planets.length}`,
        `Turn: ${this.gameState.currentTurn}`,
        '',
        `Focused: ${focusedPlanet?.name || 'None'}`,
        `Selected: ${this.selectedPlanetId || 'None'}`,
        '',
        'Planet List:',
        ...this.galaxy.planets.map(p =>
          `- ${p.name} (${p.owner}) at ${p.position.toString()}`
        )
      ]);
    };

    // Update debug info periodically
    this.time.addEvent({
      delay: 100,
      callback: updateDebug,
      loop: true
    });

    updateDebug();
  }

  private addControlsHelp(): void {
    const controlsText = this.add.text(
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
        'Esc: Pause menu',
        'H: Help overlay',
        'O: Objectives',
        'M: Main menu',
        'Ctrl+S: Save game'
      ].join('\n'),
      {
        fontSize: '12px',
        color: '#cccccc',
        fontFamily: 'monospace',
        backgroundColor: '#000000',
        padding: { x: 5, y: 5 },
        align: 'right'
      }
    );
    controlsText.setOrigin(1, 0);
    controlsText.setScrollFactor(0);
  }

  private addResetViewButton(): void {
    const buttonX = this.cameras.main.width - 120;
    const buttonY = this.cameras.main.height - 50;

    // Create button background
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x333333, 0.9);
    buttonBg.fillRoundedRect(buttonX, buttonY, 100, 35, 5);
    buttonBg.setScrollFactor(0);

    // Create button text
    const buttonText = this.add.text(
      buttonX + 50,
      buttonY + 17,
      'Reset View',
      {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }
    );
    buttonText.setOrigin(0.5);
    buttonText.setScrollFactor(0);

    // Create invisible interactive zone
    const hitZone = this.add.zone(buttonX + 50, buttonY + 17, 100, 35);
    hitZone.setScrollFactor(0);
    hitZone.setInteractive({ useHandCursor: true });

    // Hover effects
    hitZone.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x555555, 0.9);
      buttonBg.fillRoundedRect(buttonX, buttonY, 100, 35, 5);
      buttonText.setStyle({ color: '#00ff00' });
    });

    hitZone.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x333333, 0.9);
      buttonBg.fillRoundedRect(buttonX, buttonY, 100, 35, 5);
      buttonText.setStyle({ color: '#ffffff' });
    });

    // Click handler
    hitZone.on('pointerdown', () => {
      if (!this.cameraController.getIsDragging()) {
        this.cameraController.resetView(true);
      }
    });
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
    if (!currentPlanet) return;

    const cx = currentPlanet.position.x;
    const cy = currentPlanet.position.z;

    let bestPlanet: PlanetEntity | null = null;
    let bestDistance = Infinity;

    for (const planet of this.galaxy.planets) {
      if (planet.id === currentPlanetId) continue;

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

  public shutdown(): void {
    if (this.cameraController) {
      this.cameraController.destroy();
    }
    if (this.inputManager) {
      this.inputManager.destroy();
    }
    if (this.starFieldRenderer) {
      this.starFieldRenderer.destroy();
    }
    this.planetContainers.clear();
    this.planetZones.clear();
  }
}
