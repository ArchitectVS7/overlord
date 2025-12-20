import { AIPersonality, AIDifficulty } from './Enums';
import { TutorialStep } from './TutorialModels';

// Re-export TutorialStep for backward compatibility
export type { TutorialStep } from './TutorialModels';

/**
 * Story content for scenarios
 */
export interface ScenarioStory {
  briefing: string;
  objective: string;
  victory: string;
}

/**
 * Click-by-click recipe step for tutorials
 */
export interface RecipeStep {
  stepNumber: number;
  action: string;
  instruction: string;
  expectedResult: string;
}

/**
 * Click-by-click recipe for tutorials
 */
export interface ClickByClickRecipe {
  title: string;
  steps: RecipeStep[];
  notes?: string[];
}

/**
 * Core scenario structure for Flash Conflicts
 */
export interface Scenario {
  id: string;
  name: string;
  type: 'tutorial' | 'tactical';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: string;
  description: string;
  prerequisites: string[];
  story?: ScenarioStory;
  victoryConditions: VictoryCondition[];
  defeatConditions?: DefeatCondition[];
  specialRules?: SpecialRule[];
  initialState: ScenarioInitialState;
  tutorialSteps?: TutorialStep[];
  starTargets?: StarTargets;
  clickByClickRecipe?: ClickByClickRecipe;
}

/**
 * Victory condition types for scenario completion
 * - build_structure: Build specific structures
 * - capture_planet: Capture specific planet or N planets
 * - capture_all_planets: Capture all enemy planets (optionally within turn limit)
 * - defeat_enemy: Defeat all enemies (no AI planets remaining)
 * - survive_turns: Survive for N turns
 * - resource_target: Reach a specific resource amount
 * - destroy_all_ships: Destroy all enemy spacecraft
 * - ui_interaction: Complete a specific UI interaction (for tutorials)
 * - turn_reached: Reach a specific turn number
 * - commission_platoon: Commission a platoon
 * - move_ship: Move a spacecraft to another planet
 * - deploy_atmosphere_processor: Deploy an atmosphere processor
 */
export interface VictoryCondition {
  type: 'build_structure' | 'capture_planet' | 'capture_all_planets' | 'defeat_enemy' | 'survive_turns' | 'resource_target' | 'destroy_all_ships' | 'ui_interaction' | 'turn_reached' | 'commission_platoon' | 'move_ship' | 'deploy_atmosphere_processor';
  target?: string | number;
  count?: number;
  turns?: number;
  turnsLimit?: number;
  resource?: 'credits' | 'minerals' | 'fuel' | 'food' | 'energy';
}

/**
 * Defeat condition types for scenario failure
 * - home_planet_lost: Player loses their home planet
 * - all_planets_lost: Player loses all planets
 * - turn_limit: Turn limit exceeded (for timed scenarios)
 * - ai_resource_target: AI reaches resource target first
 * - all_ships_destroyed: All player spacecraft destroyed
 * - lose_planet: Lose specific planet (legacy)
 * - run_out_of_resources: Run out of a specific resource
 * - timeout: Time-based timeout (legacy)
 */
export interface DefeatCondition {
  type: 'home_planet_lost' | 'all_planets_lost' | 'turn_limit' | 'ai_resource_target' | 'all_ships_destroyed' | 'lose_planet' | 'run_out_of_resources' | 'timeout';
  target?: string;
  turns?: number;
  resource?: 'credits' | 'minerals' | 'fuel' | 'food' | 'energy';
}

/**
 * Special rules that modify scenario gameplay
 */
export interface SpecialRule {
  type: 'no_new_platoons' | 'no_new_craft' | 'limited_income' | 'limited_resources' | 'fog_of_war' | 'time_limit';
  description: string;
  value?: number;
}

/**
 * Star rating targets for scenario completion
 */
export interface StarTargets {
  threeStarTurns?: number;
  twoStarTurns?: number;
  threeStarTime?: number;
  twoStarTime?: number;
}

/**
 * Initial game state for scenario
 */
export interface ScenarioInitialState {
  playerPlanets: string[];
  playerResources: ResourceState;
  playerCraft?: CraftState[];
  playerPlatoons?: PlatoonState[];
  aiPlanets: string[];
  aiCraft?: CraftState[];
  aiEnabled: boolean;
  aiPersonality?: AIPersonality;
  aiDifficulty?: AIDifficulty;
  neutralPlanets?: string[];
  planetPopulation?: Record<string, number>;
  aiDefenders?: Record<string, AIDefender>;
}

/**
 * Initial spacecraft state for scenario
 */
export interface CraftState {
  type: string;
  planet?: string;
  planetId?: string;
  embarkedPlatoons?: number;
}

/**
 * Initial platoon state for scenario
 */
export interface PlatoonState {
  troops?: number;
  troopCount?: number;
  equipment: string;
  weapon: string;
  planet?: string;
  embarkedOnCraft?: boolean;
}

/**
 * AI defender state for a planet
 */
export interface AIDefender {
  population: number;
  platoons: number;
}

/**
 * Resource state for scenario initialization
 */
export interface ResourceState {
  credits?: number;
  minerals?: number;
  fuel?: number;
  food?: number;
  energy?: number;
}

/**
 * Scenario completion status tracking
 */
export interface ScenarioCompletion {
  scenarioId: string;
  completed: boolean;
  completedDate?: Date;
  bestTime?: number;
  attempts: number;
}
