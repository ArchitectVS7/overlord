# Project Audit Report

## Executive Summary
- Overlord is implemented primarily as a .NET/C# gameplay core with a console harness; Unity assets exist but the playable build is limited to text-based testing rather than the PRD’s PC/mobile Unity vision.
- Core turn, economy, combat, and save/load systems are implemented with strong modular boundaries and unit tests, indicating disciplined backend progress.
- Major PRD items—Unity UI, cross-platform input, AI opponent, and visual galaxy map—are absent, keeping the project at an early prototype stage.

## Project Maturity Assessment
- **Stage:** Prototype-to-early-MVP for backend logic; front-end and platform targets are unstarted.
- **Evidence:** Comprehensive C# systems and tests exist for game state, turn processing, saving, and combat, but only a console entry point is wired for interaction and no Unity gameplay loop is present.

## Design Document Compliance
- **Specified but missing:**
  - Unity-based PC/mobile delivery with modern UI and multi-input support has no implementation; only a console shell exists.【F:design-docs/v1.0/prd/PRD-overlord.md†L13-L20】【F:Overlord.Console/Overlord.Console/Program.cs†L6-L29】
  - AI opponent campaign and galaxy UI called out in the PRD are not implemented; console flow notes “AI turn would go here” and lacks map visualization.【F:design-docs/v1.0/prd/PRD-overlord.md†L22-L27】【F:design-docs/v1.0/prd/PRD-overlord.md†L190-L212】【F:Overlord.Console/Overlord.Console/GameController.cs†L647-L660】
  - Cross-platform input abstraction (mouse/touch/gamepad) is not present; console commands are text-only.【F:design-docs/v1.0/prd/PRD-overlord.md†L181-L186】【F:Overlord.Console/Overlord.Console/GameController.cs†L449-L606】
- **Implemented without explicit spec:** Console playtest CLI, ASCII art banner, and command grammar are not covered in PRD but exist for backend exercising.【F:Overlord.Console/Overlord.Console/Program.cs†L14-L29】【F:Overlord.Console/Overlord.Console/GameController.cs†L449-L606】
- **Partial implementations:** Save system, turn/economy, combat, and invasion systems align with PRD mechanics but lack UI/UX integration or AI hooks.【F:Overlord.Core/Overlord.Core/SaveSystem.cs†L21-L199】【F:Overlord.Core/Overlord.Core/GameState.cs†L9-L190】【F:Overlord.Console/Overlord.Console/GameController.cs†L45-L129】

## Codebase Health & Consistency
- Modular system classes (TurnSystem, ResourceSystem, CombatSystem, etc.) are orchestrated centrally in `GameController`, reflecting a clear domain separation.【F:Overlord.Console/Overlord.Console/GameController.cs†L45-L133】
- Domain models are strongly typed with validation and lookup helpers, improving consistency and safety in state handling.【F:Overlord.Core/Overlord.Core/GameState.cs†L9-L100】
- Coding style is consistent C# with XML docs and event-driven patterns; namespaces follow project structure. No AGENTS constraints found.
- Minor duplication in random number generator instantiation across combat-related systems could lead to uniform seeds in rapid succession; consolidation would improve determinism.【F:Overlord.Console/Overlord.Console/GameController.cs†L49-L63】

## Errors & Vulnerabilities
- Save checksums use unsalted MD5, which is collision-prone and unsuitable for tamper detection; stronger hashing (SHA-256) or signing is needed.【F:Overlord.Core/Overlord.Core/SaveSystem.cs†L175-L199】
- File save paths from console input are not sanitized, enabling overwrite of arbitrary files if run with sufficient permissions.【F:Overlord.Console/Overlord.Console/GameController.cs†L668-L681】
- Multiple `new Random()` instances constructed per controller increase risk of predictable combat outcomes if instantiated in quick succession; a shared RNG or cryptographic RNG would reduce predictability.【F:Overlord.Console/Overlord.Console/GameController.cs†L49-L63】

## Test Coverage Assessment
- Extensive xUnit unit tests cover core systems including turn processing, save/load, combat, invasion, and systems interactions.【F:Overlord.Core.Tests/Overlord.Core.Tests/TurnSystemTests.cs†L8-L187】【F:Overlord.Core.Tests/Overlord.Core.Tests/SaveSystemTests.cs†L6-L115】
- No tests exist for the console command surface or Unity integration, leaving input parsing, rendering, and end-to-end flows unvalidated.
- Automated test execution could not be verified in this environment because `dotnet` tooling is unavailable.【0683f0†L1-L3】

## MVP Readiness
- **Current blockers:** Lack of Unity client/UI, missing AI turn logic, and absent multi-platform input handling prevent meeting PRD MVP criteria.【F:design-docs/v1.0/prd/PRD-overlord.md†L13-L20】【F:Overlord.Console/Overlord.Console/GameController.cs†L647-L660】
- **Supporting assets:** Backend systems and data models are in place and test-backed, providing a solid foundation once presentation and AI layers are added.【F:Overlord.Core/Overlord.Core/GameState.cs†L9-L190】【F:Overlord.Core.Tests/Overlord.Core.Tests/TurnSystemTests.cs†L8-L187】
- **Feasibility:** MVP achievable by wiring existing systems into Unity UI, implementing AI turn execution, and stabilizing save/security concerns.

## Four Next Steps to Reach MVP
1. **Implement Unity gameplay loop and galaxy map UI** — Integrate existing core systems into Unity scenes with planet selection, resource views, and command buttons; replaces console harness. *Impact:* High; *Risk:* Medium (integration complexity); *Effort:* L.
2. **Add AI turn executor** — Build AI decision logic that consumes the `GameState` and existing systems to perform turns as required by the PRD campaign goal. *Impact:* High; *Risk:* Medium; *Effort:* M.
3. **Introduce secure save mechanism** — Replace MD5 with SHA-256 or signed checksums and add path validation for save/load commands. *Impact:* Medium; *Risk:* Low; *Effort:* S.
4. **Create integration and UI tests** — Add automated tests for input parsing and Unity UI flows to protect the game loop and reduce regressions. *Impact:* Medium; *Risk:* Medium; *Effort:* M.

## Red Flags & Warnings
- Security weakness from MD5 checksums leaves save files susceptible to manipulation.【F:Overlord.Core/Overlord.Core/SaveSystem.cs†L175-L199】
- Platform/tooling gap: the Unity client is a stub while PRD mandates rich UI and multi-input support.【F:design-docs/v1.0/prd/PRD-overlord.md†L181-L186】【F:Overlord.Console/Overlord.Console/Program.cs†L6-L29】
- Process risk: console-specific workflows may diverge from intended UX, causing rework when migrating to Unity.
- Testing blind spots around input and presentation layers increase risk of regressions during integration.

## Final Verdict
The backend core shows disciplined engineering and unit coverage, but the project remains a prototype lacking the PRD’s Unity-driven UI, AI opponent, and cross-platform delivery. Addressing UI integration, AI turns, and save security are prerequisite steps before an MVP can be credibly declared.
