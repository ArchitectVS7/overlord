  Phase 2.1: Modal Dialog Framework
  4. ⏳ Test: Dialogs open/close, show correct data from Core
     → RUN: Menu → Overlord → Build Week 2 UI (runs EditorUIBuilder.cs)
     → TEST: Follow UAT-WEEK2.md tests 4.1-4.5

  Phase 2.2: Action Menu Integration (14 hours)
  11. ⏳ Test: All actions deduct resources correctly, validation works
      → TEST: Follow UAT-WEEK2.md tests 11.1-11.7

    Phase 2.4: Unity Editor Testing

  1. In Unity: Menu → Overlord → Build Week 2 UI
     (This script creates all dialogs + ActionMenuPanel + wires references automatically)
  2. Press Play
  3. Follow UAT-WEEK2.md (12 tests total)
  4. Mark tasks 4 & 11 complete when ≥90% pass

  ---
  🔄 Week 3: Combat & Turn Flow (20 hours - NOT STARTED)

  Phase 3.1: Combat Actions (10 hours)
  12. ❌ Create UI/Dialogs/AttackTargetDialog.cs (200 lines) - Combat target selection
  13. ❌ Wire Attack action → CombatSystem.InitiateBattle()
  14. ❌ Wire Bombardment action → BombardmentSystem.BombardPlanet()
  15. ❌ Wire Invasion action → InvasionSystem.InvadePlanet()
  16. ❌ Test: Combat resolves, casualties shown in MessageLogPanel

  Phase 3.2: Turn System Integration (10 hours)
  17. ❌ Add "End Turn" button to ActionMenuPanel
  18. ❌ Wire EndTurn → TurnSystem.AdvancePhase()
  19. ❌ Subscribe ActionMenuPanel to TurnSystem.OnPhaseChanged
  20. ❌ Disable action buttons during Income/Combat/End phases
  21. ❌ Wire AI turn execution (AIDecisionSystem runs during Combat phase)
  22. ❌ Test: Full turn cycle (Income → Action → Combat → End → Income)
  23. ❌ Verify no event subscription memory leaks

  Deliverable: Playable end-to-end game (can win/lose)

  ---
  🔄 Week 4: QA & Testing (16 hours - NOT STARTED)

  Phase 4.1: Automated QA Validator (12 hours)
  24. ❌ Create Editor/MVPValidator.cs (500 lines) - Unity Editor validation window
  25. ❌ Write UI Presence Tests (20 tests) - Panel/dialog existence, TMP_Text assigned
  26. ❌ Write Core Integration Tests (30 tests) - GameManager initialization, event wiring
  27. ❌ Write Gameplay Logic Tests (40 tests) - Resource deduction, validation logic
  28. ❌ Write Turn Flow Tests (10 tests) - Phase transitions, AI execution
  29. ❌ Target: ≥95% pass rate (95/100 tests)

  Phase 4.2: UAT Testing Guide (4 hours)
  30. ❌ Write UAT-Testing-Guide.md (40 manual tests)
  31. ❌ Section 1: Game Initialization (5 tests)
  32. ❌ Section 2: Economy System (8 tests)
  33. ❌ Section 3: Military System (10 tests)
  34. ❌ Section 4: Combat System (6 tests)
  35. ❌ Section 5: Turn Flow (6 tests)
  36. ❌ Section 6: UI Responsiveness (5 tests)
  37. ❌ Run UAT internally, fix critical failures
  38. ❌ Target: ≥90% pass rate (36/40 tests)

  Deliverable: Validated MVP ready for release

  ---
  🔧 Additional Required Modifications

  39. ❌ Modify GameManager.cs - Add public int SelectedPlanetID { get; set; } property
  40. ❌ Modify UIManager.cs - Add panel references, RefreshAllPanels() method

  ---