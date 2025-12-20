/**
 * ScenarioLoader - Loads all scenario JSON files for Flash Conflicts
 *
 * Imports tutorial and tactical scenario JSON files and provides
 * them to ScenarioManager for registration.
 */

import { Scenario } from './models/ScenarioModels';
import { ScenarioManager } from './ScenarioManager';

// Import tutorial scenarios
import tutorial003 from '../data/scenarios/tutorial-003-planet-selection.json';
import tutorial005 from '../data/scenarios/tutorial-005-turn-advancement.json';
import tutorial006 from '../data/scenarios/tutorial-006-building-structure.json';
import tutorial019 from '../data/scenarios/tutorial-019-commissioning-platoons.json';
import tutorial024 from '../data/scenarios/tutorial-024-fleet-navigation.json';
import tutorial025 from '../data/scenarios/tutorial-025-colonization.json';
import tutorial030 from '../data/scenarios/tutorial-030-ground-invasion.json';

// Import tactical scenarios
import tactical001 from '../data/scenarios/tactical-001-conquest.json';
import tactical002 from '../data/scenarios/tactical-002-defense.json';
import tactical003 from '../data/scenarios/tactical-003-resource-race.json';
import tactical004 from '../data/scenarios/tactical-004-fleet-battle.json';
import tactical005 from '../data/scenarios/tactical-005-blitz.json';
import tactical006 from '../data/scenarios/tactical-006-last-stand.json';

/**
 * All available scenarios
 */
const ALL_SCENARIOS: Scenario[] = [
  // Tutorials (ordered by number)
  tutorial003 as Scenario,
  tutorial005 as Scenario,
  tutorial006 as Scenario,
  tutorial019 as Scenario,
  tutorial024 as Scenario,
  tutorial025 as Scenario,
  tutorial030 as Scenario,
  // Tactical scenarios
  tactical001 as Scenario,
  tactical002 as Scenario,
  tactical003 as Scenario,
  tactical004 as Scenario,
  tactical005 as Scenario,
  tactical006 as Scenario,
];

/**
 * Load all scenarios into the ScenarioManager
 */
export async function loadAllScenarios(manager: ScenarioManager): Promise<void> {
  for (const scenario of ALL_SCENARIOS) {
    await manager.loadScenario(scenario);
  }
  console.log(`Loaded ${ALL_SCENARIOS.length} scenarios into ScenarioManager`);
}

/**
 * Get all tutorial scenarios (without loading into manager)
 */
export function getTutorialScenarios(): Scenario[] {
  return ALL_SCENARIOS.filter(s => s.type === 'tutorial');
}

/**
 * Get all tactical scenarios (without loading into manager)
 */
export function getTacticalScenarios(): Scenario[] {
  return ALL_SCENARIOS.filter(s => s.type === 'tactical');
}

/**
 * Get total scenario count
 */
export function getScenarioCount(): number {
  return ALL_SCENARIOS.length;
}
