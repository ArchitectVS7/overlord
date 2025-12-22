/**
 * UAT Task definition with tutorial-style numbering
 */
export interface UATTask {
  id: string;
  number: string;      // e.g., "1.1", "1.2", "2.1"
  prompt: string;      // What to show the user: "Navigate to Galaxy Map"
  successMsg: string;  // What to show on completion
  completed: boolean;
}

/**
 * UATTaskTracker - Tracks tutorial/testing tasks
 * Shows prompts for next action, notifies on completion
 */
export class UATTaskTracker {
  private tasks: UATTask[] = [];

  // Callbacks
  public onTaskComplete?: (task: UATTask) => void;
  public onAllComplete?: () => void;

  constructor() {
    this.initializeTasks();
  }

  private initializeTasks(): void {
    this.tasks = [
      // UAT 1: Core Navigation
      {
        id: 'nav_galaxy',
        number: '1.1',
        prompt: 'Press [G] to open the Galaxy Map',
        successMsg: 'Galaxy Map opened - UAT 1.1 complete',
        completed: false,
      },
      {
        id: 'nav_back',
        number: '1.2',
        prompt: 'Press [ESC] to return to the main menu',
        successMsg: 'Navigation working - UAT 1.2 complete',
        completed: false,
      },
      {
        id: 'nav_help',
        number: '1.3',
        prompt: 'Press [H] to view Help',
        successMsg: 'Help screen accessed - UAT 1.3 complete',
        completed: false,
      },

      // UAT 2: Display Screens
      {
        id: 'view_planet',
        number: '2.1',
        prompt: 'Press [G] then select a planet [1-9] to view details',
        successMsg: 'Planet details displayed - UAT 2.1 complete',
        completed: false,
      },
      {
        id: 'view_player_planet',
        number: '2.2',
        prompt: 'View your homeworld Starbase (Planet 1)',
        successMsg: 'Homeworld viewed - UAT 2.2 complete',
        completed: false,
      },

      // UAT 3: Economy
      {
        id: 'build_structure',
        number: '3.1',
        prompt: 'Press [B] to build a structure on Starbase',
        successMsg: 'Structure built - UAT 3.1 complete',
        completed: false,
      },
      {
        id: 'buy_craft',
        number: '3.2',
        prompt: 'Press [S] to open Shipyard and buy a craft',
        successMsg: 'Craft purchased - UAT 3.2 complete',
        completed: false,
      },
      {
        id: 'commission_platoon',
        number: '3.3',
        prompt: 'Press [C] to commission a platoon',
        successMsg: 'Platoon commissioned - UAT 3.3 complete',
        completed: false,
      },
      {
        id: 'end_turn',
        number: '3.4',
        prompt: 'Press [E] to end your turn',
        successMsg: 'Turn ended - UAT 3.4 complete',
        completed: false,
      },

      // UAT 4: Combat
      {
        id: 'move_craft',
        number: '4.1',
        prompt: 'Press [M] to move a craft to another planet',
        successMsg: 'Craft moved - UAT 4.1 complete',
        completed: false,
      },
      {
        id: 'attack_planet',
        number: '4.2',
        prompt: 'Press [A] to attack an enemy planet',
        successMsg: 'Attack initiated - UAT 4.2 complete',
        completed: false,
      },

      // UAT 5: AI & Turns
      {
        id: 'observe_ai',
        number: '5.1',
        prompt: 'End turn and observe AI actions in messages',
        successMsg: 'AI actions observed - UAT 5.1 complete',
        completed: false,
      },
      {
        id: 'reach_turn_5',
        number: '5.2',
        prompt: 'Continue playing until Turn 5',
        successMsg: 'Turn 5 reached - UAT 5.2 complete',
        completed: false,
      },
    ];
  }

  /**
   * Get the current task prompt to display
   */
  public getCurrentPrompt(): string | null {
    const task = this.getNextIncompleteTask();
    return task ? `[${task.number}] ${task.prompt}` : null;
  }

  /**
   * Get the next incomplete task
   */
  public getNextIncompleteTask(): UATTask | null {
    return this.tasks.find(t => !t.completed) || null;
  }

  /**
   * Complete a task by ID
   */
  public completeTask(taskId: string): UATTask | null {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || task.completed) return null;

    task.completed = true;
    this.onTaskComplete?.(task);

    // Check if all complete
    if (this.tasks.every(t => t.completed)) {
      this.onAllComplete?.();
    }

    return task;
  }

  /**
   * Check if a task is complete
   */
  public isTaskComplete(taskId: string): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    return task?.completed ?? false;
  }

  /**
   * Get completion stats
   */
  public getStats(): { completed: number; total: number; percent: number } {
    const completed = this.tasks.filter(t => t.completed).length;
    const total = this.tasks.length;
    return {
      completed,
      total,
      percent: Math.round((completed / total) * 100),
    };
  }

  /**
   * Get all tasks grouped by UAT number
   */
  public getTasksByGroup(): Map<string, UATTask[]> {
    const groups = new Map<string, UATTask[]>();
    for (const task of this.tasks) {
      const group = task.number.split('.')[0];
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(task);
    }
    return groups;
  }

  /**
   * Get summary for display
   */
  public getSummary(): string[] {
    const lines: string[] = [];
    const groups = this.getTasksByGroup();

    const groupNames: Record<string, string> = {
      '1': 'Navigation',
      '2': 'Display',
      '3': 'Economy',
      '4': 'Combat',
      '5': 'AI & Turns',
    };

    for (const [group, tasks] of groups) {
      const done = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      const check = done === total ? '[x]' : `[${done}/${total}]`;
      lines.push(`UAT ${group}: ${groupNames[group] || ''} ${check}`);
    }

    return lines;
  }

  /**
   * Reset all tasks
   */
  public reset(): void {
    this.tasks.forEach(t => t.completed = false);
  }
}
