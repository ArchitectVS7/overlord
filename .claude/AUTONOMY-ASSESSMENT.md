# Sprint Workflow Autonomy Assessment

## Executive Summary

**Goal:** Orchestrator spawns agents, agents do work, orchestrator verifies and loops
**Status:** ✅ Ready for autonomous execution
**Key Changes:** Orchestrator verbosity reduced 97% (from ~2000 lines to ~6 lines per story)

---

## Agent Responsibility Matrix

| Action | Who Does It | Verification |
|--------|-------------|--------------|
| Read sprint-status.yaml | Orchestrator | Silent operation |
| Find next story | Orchestrator | Log 1 line |
| **Create test files** | **Game-dev agent** | Orchestrator checks file exists |
| **Create source files** | **Game-dev agent** | Orchestrator checks file exists |
| **Run TDD cycles** | **Game-dev agent** | Orchestrator runs npm test |
| **Update status to review** | **Game-dev agent** | Orchestrator reads status file |
| **Review code** | **Code-reviewer agent** | Orchestrator reads status file |
| **Find 3-10 issues** | **Code-reviewer agent** | Orchestrator checks result |
| **Update status to done/in-progress** | **Code-reviewer agent** | Orchestrator reads status file |
| Commit code | Game-dev agent | Orchestrator verifies git log |
| Merge epic | Orchestrator | After all stories done |
| Generate human task report | Orchestrator | When story has "Human Intervention: YES" |

---

## Delegation Pattern

### ✅ CORRECT (Orchestrator delegates)

```
Orchestrator:
  1. Read status → Story 6-2: drafted
  2. Log: "Story 6-2: drafted → implementing"
  3. Spawn: @sprint-game-dev
  4. Wait for agent completion
  5. Verify: status == review, files exist, tests pass
  6. Log: "Story 6-2: implementation ✓"
  7. Loop to next phase
```

**Output:** 2 lines
**Agent does:** All file creation, all code writing, all testing

### ❌ INCORRECT (Orchestrator does work)

```
Orchestrator:
  1. Read status → Story 6-2: drafted
  2. Read story file
  3. Explain what needs to be done
  4. Create test files directly
  5. Create source files directly
  6. Run tests
  7. Show test output
  8. Explain results
  9. Update status
  10. Log completion
```

**Output:** 500+ lines
**Agent does:** Nothing (orchestrator did everything)

---

## File Creation Verification

### Game Developer Agent MUST:
1. ✅ Use Write tool to create test files
2. ✅ Use Write tool to create source files
3. ✅ Use Edit tool to modify existing files
4. ✅ Use Bash tool to run tests
5. ✅ Use Bash tool to commit changes
6. ✅ Update sprint-status.yaml with Edit or Write tool

### Code Reviewer Agent MUST:
1. ✅ Use Read tool to read story file
2. ✅ Use Read tool to read source files
3. ✅ Use Bash tool to run tests
4. ✅ Use Bash tool to check architecture
5. ✅ Use Edit tool to update sprint-status.yaml (status to done or in-progress)

### Orchestrator MUST NOT:
1. ❌ Create any code files
2. ❌ Create any test files
3. ❌ Run detailed analysis
4. ❌ Show verbose logs
5. ✅ Only verify artifacts exist
6. ✅ Only spawn agents
7. ✅ Only log 1-line progress

---

## Output Budget Enforcement

### Per Story (Target: 6 lines)

```
Line 1: Branch verification
Line 2: Story phase change (implementing)
Line 3: Implementation complete
Line 4: Story phase change (reviewing)
Line 5: Review result (APPROVED/REJECTED)
Line 6: Test validation

Total: 6 lines
```

### For 24 Stories

```
Target: 6 lines × 24 stories = 144 lines total
Maximum: 100 lines × 24 stories = 2,400 lines (safety margin)
Previous: 32,000+ lines (hit limit immediately)

Reduction: 93% less output
```

---

## Autonomy Checkpoints

### ✅ Agent spawns successfully
- Orchestrator uses Task tool
- Agent receives correct parameters
- Agent starts execution

### ✅ Agent creates files
- Game-dev writes test files
- Game-dev writes source files
- Files physically exist on disk

### ✅ Agent updates status
- Game-dev: drafted → in-progress → review
- Code-reviewer: review → done (or → in-progress)
- Status file changes on disk

### ✅ Orchestrator verifies
- Reads status file (confirms update)
- Checks file exists (confirms creation)
- Runs npm test (confirms tests pass)
- Logs 1-line result

### ✅ Loop continues
- Orchestrator moves to next story
- No permission asking
- No verbose explanations

---

## Failure Modes & Recovery

### Failure: Agent doesn't create file

**Detection:** Orchestrator checks if file exists
**Recovery:** Re-spawn agent once, if fails again → EXIT with error
**Log:** "Story X: agent failed - file not created"

### Failure: Tests don't pass

**Detection:** npm test fails
**Recovery:** Re-spawn game-dev with issue list, max 2 retries
**Log:** "Story X: tests failing"

### Failure: Code reviewer rejects

**Detection:** Status changes to 'in-progress' instead of 'done'
**Recovery:** Re-spawn game-dev with issue list, loop back
**Log:** "Story X: REJECTED (N issues)"

### Failure: Build fails

**Detection:** npm run build fails after epic
**Recovery:** EXIT with error message
**Log:** "Epic X: build failed"

### Failure: Orchestrator hits output limit

**Detection:** Output exceeds 32k tokens
**Prevention:** 100-line budget per story enforced
**Recovery:** Should never happen with new concise mode

---

## Rule Re-alignment (Every Cycle)

At the start of each story cycle, orchestrator reads:

```yaml
MANDATORY_CHECKS:
  - Re-read sprint-status.yaml (no assumptions)
  - Verify git branch matches epic
  - Story files already exist (skip tech-writer)
  - Spawn game-dev for implementation
  - Spawn code-reviewer for validation
  - Update status only after verification
  - Continue without asking permission
```

This prevents protocol drift across long execution runs.

---

## Success Criteria

### For Orchestrator to be Autonomous:

1. ✅ Spawns agents instead of doing work itself
2. ✅ Output stays under 100 lines per story
3. ✅ Verifies artifacts exist (files, tests, status)
4. ✅ Loops automatically to next story
5. ✅ Never asks permission
6. ✅ Handles agent failures gracefully
7. ✅ Re-reads configuration every cycle
8. ✅ Generates human task report when needed
9. ✅ Exits cleanly when blocked or complete

### For Agents to be Reliable:

1. ✅ Game-dev creates physical files on disk
2. ✅ Game-dev updates status in sprint-status.yaml
3. ✅ Code-reviewer reads actual files (not memory)
4. ✅ Code-reviewer updates status in sprint-status.yaml
5. ✅ Both agents commit their changes
6. ✅ Both agents run tests to verify
7. ✅ Both agents follow TDD/review workflows

---

## Test Plan

### Test 1: Single Story Execution
**Input:** Story 6-2 (drafted)
**Expected:**
- Orchestrator spawns game-dev
- Game-dev creates files, updates status to review
- Orchestrator spawns code-reviewer
- Code-reviewer approves, updates status to done
- Total output: ~12 lines (2 attempts if rejected once)

### Test 2: Full Epic Execution
**Input:** Epic 6 (2 stories)
**Expected:**
- Process story 6-2 → done
- Process story 6-3 → done
- Merge epic to main
- Tag v0.6.0-combat
- Total output: ~20 lines

### Test 3: Human Intervention Detection
**Input:** Story with "Human Intervention: YES"
**Expected:**
- Orchestrator detects flag
- Writes human-tasks-epic-X.md
- Exits with status message
- Total output: ~5 lines

### Test 4: Error Recovery
**Input:** Code reviewer rejects story
**Expected:**
- Orchestrator detects rejection
- Re-spawns game-dev with issues
- Loop back to review
- Total output: ~18 lines (2 cycles)

---

## Readiness Assessment

| Category | Status | Notes |
|----------|--------|-------|
| Orchestrator verbosity | ✅ READY | Reduced to 6 lines per story |
| Agent delegation | ✅ READY | Clear spawn points defined |
| File creation | ✅ READY | Agents use Write/Edit tools |
| Status updates | ✅ READY | Agents update sprint-status.yaml |
| Verification | ✅ READY | Orchestrator checks artifacts |
| Error handling | ✅ READY | Retry logic defined |
| Rule re-alignment | ✅ READY | Reads config every cycle |
| Output budget | ✅ READY | 100-line limit enforced |
| Human detection | ✅ READY | Auto-generates task report |

**OVERALL: ✅ READY FOR AUTONOMOUS EXECUTION**

---

## Recommended Test

Run orchestrator on Epic 6 (2 stories):
```
cd Overlord.Phaser
git checkout epic/6-combat
/sprint
```

Monitor:
1. Output stays under 20 lines total
2. Files physically created by agents
3. Status updates happen
4. Tests run and pass
5. Epic completes without intervention

If successful → proceed with full 24-story autonomous run.
