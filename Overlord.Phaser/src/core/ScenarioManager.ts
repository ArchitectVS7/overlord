import { Scenario, ScenarioCompletion } from './models/ScenarioModels';

/**
 * Manages scenario loading, validation, and completion tracking
 * for Flash Conflicts tutorial and tactical scenarios.
 */
export class ScenarioManager {
  private scenarios: Map<string, Scenario> = new Map();
  private completions: Map<string, ScenarioCompletion> = new Map();
  private readonly STORAGE_KEY = 'overlord_scenario_completions';

  constructor() {
    this.loadCompletionsFromStorage();
  }

  /**
   * Load a scenario into the manager
   */
  async loadScenario(scenario: Scenario): Promise<void> {
    this.validateScenario(scenario);
    this.scenarios.set(scenario.id, scenario);
  }

  /**
   * Validate a scenario has all required fields
   * @throws Error if validation fails
   */
  validateScenario(scenario: Scenario): void {
    if (!scenario) {
      throw new Error('Scenario cannot be null or undefined');
    }

    if (!scenario.id || typeof scenario.id !== 'string') {
      throw new Error('Scenario must have a valid id');
    }

    if (!scenario.name || typeof scenario.name !== 'string') {
      throw new Error('Scenario must have a valid name');
    }

    if (scenario.type !== 'tutorial' && scenario.type !== 'tactical') {
      throw new Error('Scenario type must be "tutorial" or "tactical"');
    }

    if (!['easy', 'medium', 'hard', 'expert'].includes(scenario.difficulty)) {
      throw new Error('Scenario difficulty must be "easy", "medium", "hard", or "expert"');
    }

    if (!scenario.description || typeof scenario.description !== 'string') {
      throw new Error('Scenario must have a description');
    }

    if (!Array.isArray(scenario.prerequisites)) {
      throw new Error('Scenario prerequisites must be an array');
    }

    if (!Array.isArray(scenario.victoryConditions) || scenario.victoryConditions.length === 0) {
      throw new Error('Scenario must have at least one victory condition');
    }

    if (!scenario.initialState) {
      throw new Error('Scenario must have an initialState');
    }

    if (!Array.isArray(scenario.initialState.playerPlanets)) {
      throw new Error('Scenario initialState must have playerPlanets array');
    }

    if (!scenario.initialState.playerResources) {
      throw new Error('Scenario initialState must have playerResources');
    }
  }

  /**
   * Get all scenarios sorted with tutorials first
   */
  getScenarios(): Scenario[] {
    return Array.from(this.scenarios.values()).sort((a, b) => {
      return this.sortPriority(a) - this.sortPriority(b);
    });
  }

  /**
   * Get scenario by ID
   */
  getScenarioById(id: string): Scenario | undefined {
    return this.scenarios.get(id);
  }

  /**
   * Check if scenario prerequisites are met
   */
  checkPrerequisites(scenarioId: string): boolean {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      return false;
    }

    if (scenario.prerequisites.length === 0) {
      return true;
    }

    // Check if all prerequisite scenarios are completed
    return scenario.prerequisites.every(prereqId => {
      const completion = this.completions.get(prereqId);
      return completion?.completed === true;
    });
  }

  /**
   * Mark a scenario as complete
   */
  markScenarioComplete(scenarioId: string): void {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    const completion: ScenarioCompletion = {
      scenarioId,
      completed: true,
      completedDate: new Date(),
      attempts: (this.completions.get(scenarioId)?.attempts || 0) + 1
    };

    this.completions.set(scenarioId, completion);
    this.saveCompletionsToStorage();
  }

  /**
   * Get completion status for a scenario
   */
  getCompletion(scenarioId: string): ScenarioCompletion | undefined {
    return this.completions.get(scenarioId);
  }

  /**
   * Calculate sort priority (lower = earlier)
   */
  private sortPriority(scenario: Scenario): number {
    // Tutorials first
    if (scenario.type === 'tutorial') {
      // Sort tutorials by difficulty
      const difficultyPriority: Record<string, number> = {
        'easy': 0,
        'medium': 100,
        'hard': 200,
        'expert': 250
      };
      return difficultyPriority[scenario.difficulty];
    }

    // Tactical scenarios second
    const difficultyPriority: Record<string, number> = {
      'easy': 300,
      'medium': 400,
      'hard': 500,
      'expert': 600
    };
    return difficultyPriority[scenario.difficulty];
  }

  /**
   * Load completions from localStorage
   */
  private loadCompletionsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([id, completion]) => {
          this.completions.set(id, completion as ScenarioCompletion);
        });
      }
    } catch (error) {
      console.warn('Failed to load scenario completions from storage:', error);
    }
  }

  /**
   * Save completions to localStorage
   */
  private saveCompletionsToStorage(): void {
    try {
      const data: Record<string, ScenarioCompletion> = {};
      this.completions.forEach((completion, id) => {
        data[id] = completion;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save scenario completions to storage:', error);
    }
  }
}
