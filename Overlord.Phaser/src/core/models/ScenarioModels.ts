import { AIPersonality, AIDifficulty } from './Enums';
import { TutorialStep } from './TutorialModels';

// Re-export TutorialStep for backward compatibility
export type { TutorialStep } from './TutorialModels';

/**
 * Core scenario structure for Flash Conflicts
 */
export interface Scenario {
  id: string;
  name: string;
  type: 'tutorial' | 'tactical';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  description: string;
  prerequisites: string[];
  victoryConditions: VictoryCondition[];
  defeatConditions?: DefeatCondition[];
  initialState: ScenarioInitialState;
  tutorialSteps?: TutorialStep[];
}

/**
 * Victory condition types for scenario completion
 */
export interface VictoryCondition {
  type: 'build_structure' | 'capture_planet' | 'defeat_enemy' | 'survive_turns';
  target?: string;
  count?: number;
  turns?: number;
}

/**
 * Defeat condition types for scenario failure
 */
export interface DefeatCondition {
  type: 'lose_planet' | 'run_out_of_resources' | 'timeout';
  target?: string;
  turns?: number;
}

/**
 * Initial game state for scenario
 */
export interface ScenarioInitialState {
  playerPlanets: string[];
  playerResources: ResourceState;
  aiPlanets: string[];
  aiEnabled: boolean;
  aiPersonality?: AIPersonality;
  aiDifficulty?: AIDifficulty;
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
