/**
 * PlanetRenderer - Handles rendering of planet sprites in Phaser scenes
 */

import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType } from '@core/models/Enums';
import { PLANET_VISUALS, OWNER_COLORS, VISUAL_CONSTANTS } from '../../config/VisualConfig';

// Map PlanetType enum to visual config keys
const PLANET_TYPE_MAP: Record<PlanetType, string> = {
  [PlanetType.Desert]: 'Desert',
  [PlanetType.Volcanic]: 'Volcanic',
  [PlanetType.Tropical]: 'Terran',     // Use Terran visuals for Tropical
  [PlanetType.Metropolis]: 'GasGiant'  // Use GasGiant visuals for Metropolis (largest, developed)
};

// Map FactionType to owner color keys
const FACTION_MAP: Record<FactionType, string> = {
  [FactionType.Player]: 'Player',
  [FactionType.AI]: 'AI',
  [FactionType.Neutral]: 'Neutral'
};

export class PlanetRenderer {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Renders a planet as a Phaser container with body, owner ring, highlight, and label
   */
  public renderPlanet(planet: PlanetEntity): Phaser.GameObjects.Container {
    const container = this.scene.add.container(planet.position.x, planet.position.z);

    // Get visual config for planet type
    const typeKey = PLANET_TYPE_MAP[planet.type] || 'Terran';
    const visualConfig = PLANET_VISUALS[typeKey] || PLANET_VISUALS.Terran;
    const size = visualConfig.size;
    const radius = size / 2;

    // Add planet body as filled circle
    const planetBody = this.scene.add.graphics();
    planetBody.fillStyle(visualConfig.color, 1.0);
    planetBody.fillCircle(0, 0, radius);
    container.add(planetBody);

    // Add 3D highlight effect (small lighter area offset)
    const highlight = this.scene.add.graphics();
    highlight.fillStyle(0xffffff, VISUAL_CONSTANTS.HIGHLIGHT_ALPHA);
    highlight.fillCircle(
      -VISUAL_CONSTANTS.HIGHLIGHT_OFFSET,
      -VISUAL_CONSTANTS.HIGHLIGHT_OFFSET,
      radius * VISUAL_CONSTANTS.HIGHLIGHT_SIZE_MULTIPLIER
    );
    container.add(highlight);

    // Add owner ring (3px stroke around planet)
    const ownerKey = FACTION_MAP[planet.owner] || 'Neutral';
    const ownerColor = OWNER_COLORS[ownerKey] || OWNER_COLORS.Neutral;
    const ownerRing = this.scene.add.graphics();
    ownerRing.lineStyle(VISUAL_CONSTANTS.OWNER_RING_WIDTH, ownerColor, 1.0);
    ownerRing.strokeCircle(0, 0, radius + 2);
    container.add(ownerRing);

    // Add name label below planet
    const labelY = radius + VISUAL_CONSTANTS.TEXT_OFFSET_Y + VISUAL_CONSTANTS.TEXT_FONT_SIZE;
    const nameLabel = this.scene.add.text(0, labelY, planet.name, {
      fontSize: `${VISUAL_CONSTANTS.TEXT_FONT_SIZE}px`,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: VISUAL_CONSTANTS.TEXT_STROKE_WIDTH,
      fontFamily: 'Arial'
    });
    nameLabel.setOrigin(0.5, 0.5);
    container.add(nameLabel);

    // Store planet data for later reference
    container.setData('planetId', planet.id);
    container.setData('planet', planet);

    return container;
  }

  /**
   * Gets the interactive hit area size for a planet
   */
  public getHitAreaSize(planetType: PlanetType): number {
    const typeKey = PLANET_TYPE_MAP[planetType] || 'Terran';
    const visualConfig = PLANET_VISUALS[typeKey] || PLANET_VISUALS.Terran;
    return visualConfig.size + 10; // Add padding for easier clicking
  }
}
