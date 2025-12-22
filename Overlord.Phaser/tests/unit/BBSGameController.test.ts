import { BBSGameController } from '@scenes/bbs/BBSGameController';
import { TurnPhase } from '@core/models/Enums';

describe('BBSGameController', () => {
  test('auto phases advance in order and increment turn once', () => {
    const controller = new BBSGameController();
    const phases: TurnPhase[] = [];

    controller.onPhaseChanged = (phase) => {
      phases.push(phase);
    };

    controller.startNewCampaign();
    phases.length = 0;

    expect(controller.getCurrentPhase()).toBe(TurnPhase.Action);
    expect(controller.getCurrentTurn()).toBe(1);

    controller.endTurn();

    expect(phases).toEqual([
      TurnPhase.Combat,
      TurnPhase.End,
      TurnPhase.Income,
      TurnPhase.Action,
    ]);
    expect(controller.getCurrentPhase()).toBe(TurnPhase.Action);
    expect(controller.getCurrentTurn()).toBe(2);
  });
});
