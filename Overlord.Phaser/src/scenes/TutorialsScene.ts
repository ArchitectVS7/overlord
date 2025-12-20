/**
 * TutorialsScene - Entry point for tutorial scenarios
 *
 * Displays the list of available tutorials for players to learn game mechanics.
 * This scene is identical in function to FlashConflictsScene but shows only
 * tutorial-type scenarios.
 */

import Phaser from 'phaser';
import { ScenarioManager } from '@core/ScenarioManager';
import { loadTutorialScenarios } from '@core/ScenarioLoader';
import { getCompletionService } from '@core/ScenarioCompletionService';
import { ScenarioListPanel } from './ui/ScenarioListPanel';
import { ScenarioDetailPanel } from './ui/ScenarioDetailPanel';
import { Scenario } from '@core/models/ScenarioModels';
import { TopMenuBar } from './ui/TopMenuBar';

export class TutorialsScene extends Phaser.Scene {
  private scenarioManager!: ScenarioManager;
  private listPanel!: ScenarioListPanel;
  private detailPanel!: ScenarioDetailPanel;
  private titleText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'TutorialsScene' });
  }

  create(): void {
    // Initialize scenario manager
    this.scenarioManager = new ScenarioManager();

    // Create background
    this.cameras.main.setBackgroundColor('#0a0a1a');

    // Create top menu bar
    new TopMenuBar(this);

    // Create title (positioned below menu bar)
    this.titleText = this.add.text(
      this.cameras.main.centerX,
      TopMenuBar.getHeight() + 20,
      'Tutorials',
      {
        fontSize: '48px',
        color: '#00bfff',
        fontStyle: 'bold',
      },
    );
    this.titleText.setOrigin(0.5, 0);
    this.titleText.setScrollFactor(0);

    // Create scenario list panel
    this.listPanel = new ScenarioListPanel(this, 'Select Tutorial');
    this.listPanel.onScenarioSelected = (scenario: Scenario) => {
      this.showScenarioDetail(scenario);
    };
    this.listPanel.onClose = () => {
      // Return to main menu
      this.scene.start('MainMenuScene');
    };

    // Create scenario detail panel
    this.detailPanel = new ScenarioDetailPanel(this, this.scenarioManager);
    this.detailPanel.onStartScenario = (scenario: Scenario) => {
      this.startScenario(scenario);
    };
    this.detailPanel.onBack = () => {
      this.detailPanel.hide();
      this.listPanel.show();
    };

    // Load scenarios and show list
    this.loadScenarios();
  }

  /**
   * Load tutorial scenarios from JSON files
   */
  private async loadScenarios(): Promise<void> {
    // Load only tutorial scenarios
    await loadTutorialScenarios(this.scenarioManager);

    // Get all scenarios and show list
    const scenarios = this.scenarioManager.getScenarios();
    this.listPanel.setScenarios(scenarios);

    // Load completion data
    this.loadCompletionData(scenarios);

    this.listPanel.show();
  }

  /**
   * Load completion data for scenarios
   */
  private loadCompletionData(scenarios: Scenario[]): void {
    const completionService = getCompletionService();
    const completionData = new Map<string, { completed: boolean; starRating: number }>();

    for (const scenario of scenarios) {
      const completion = completionService.getCompletion(scenario.id);
      if (completion) {
        completionData.set(scenario.id, {
          completed: completion.completed,
          starRating: completion.starRating,
        });
      }
    }

    this.listPanel.setCompletionData(completionData);
  }

  /**
   * Show scenario detail panel
   */
  private showScenarioDetail(scenario: Scenario): void {
    this.listPanel.hide();
    this.detailPanel.setScenario(scenario);
    this.detailPanel.show();
  }

  /**
   * Start a scenario
   */
  private startScenario(scenario: Scenario): void {
    console.log(`Starting tutorial: ${scenario.id}`);
    // TODO: Implement scenario initialization
    this.detailPanel.hide();
  }
}
