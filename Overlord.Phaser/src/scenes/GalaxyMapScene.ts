import Phaser from 'phaser';
import { GalaxyGenerator, Galaxy } from '@core/GalaxyGenerator';
import { GameState } from '@core/GameState';
import { Difficulty } from '@core/models/Enums';
import { PlanetEntity, getPlanetColor } from '@core/models/PlanetEntity';

export class GalaxyMapScene extends Phaser.Scene {
  private galaxy!: Galaxy;
  private gameState!: GameState;
  private planetGraphics!: Phaser.GameObjects.Graphics;
  private planetLabels: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: 'GalaxyMapScene' });
  }

  public create(): void {
    // Initialize game state
    this.gameState = new GameState();

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

    // Set up camera (center on origin)
    this.cameras.main.centerOn(0, 0);
    this.cameras.main.setZoom(1.5); // Zoom in for better visibility

    // Create graphics object for drawing planets
    this.planetGraphics = this.add.graphics();

    // Render all planets
    this.renderPlanets();

    // Add debug info
    this.addDebugInfo();
  }

  private renderPlanets(): void {
    this.galaxy.planets.forEach(planet => {
      this.renderPlanet(planet);
    });
  }

  private renderPlanet(planet: PlanetEntity): void {
    // 3D → 2D projection (orthographic: X/Z → screen coordinates)
    const screenX = planet.position.x;
    const screenZ = planet.position.z;

    // Get color based on owner
    const color = getPlanetColor(planet.owner);

    // Draw rectangle (40x30 pixels)
    const rectWidth = 40;
    const rectHeight = 30;
    this.planetGraphics.fillStyle(color, 1.0);
    this.planetGraphics.fillRect(
      screenX - rectWidth / 2,
      screenZ - rectHeight / 2,
      rectWidth,
      rectHeight
    );

    // Add border
    this.planetGraphics.lineStyle(2, 0xffffff, 0.5);
    this.planetGraphics.strokeRect(
      screenX - rectWidth / 2,
      screenZ - rectHeight / 2,
      rectWidth,
      rectHeight
    );

    // Add label below rectangle
    const label = this.add.text(
      screenX,
      screenZ + rectHeight / 2 + 10,
      planet.name,
      {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }
    );
    label.setOrigin(0.5, 0); // Center horizontally
    this.planetLabels.push(label);
  }

  private addDebugInfo(): void {
    const debugText = this.add.text(10, 10, '', {
      fontSize: '12px',
      color: '#00ff00',
      fontFamily: 'monospace',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 }
    });
    debugText.setScrollFactor(0); // Fixed to camera

    const updateDebug = () => {
      debugText.setText([
        `Galaxy: ${this.galaxy.name}`,
        `Seed: ${this.galaxy.seed}`,
        `Planets: ${this.galaxy.planets.length}`,
        `Turn: ${this.gameState.currentTurn}`,
        '',
        'Planet List:',
        ...this.galaxy.planets.map(p =>
          `- ${p.name} (${p.owner}) at ${p.position.toString()}`
        )
      ]);
    };

    updateDebug();
  }
}
