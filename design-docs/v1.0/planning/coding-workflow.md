# Overlord v1.0 Coding Workflow

**Version:** 1.0
**Last Updated:** December 6, 2025
**Status:** Active
**Project:** Overlord v1.0

---

## Overview

This document defines the systematic coding workflow for the Overlord v1.0 project, ensuring quality, traceability, and safety through a three-tier cyclical process.

**Workflow Tiers:**
- **Micro-Cycle** (per task): Write → Integrate → Test → Document
- **Meso-Cycle** (every ~5 tasks): Test suite → Commit → Push
- **Macro-Cycle** (sprint complete): Full validation → Documentation → Next steps

---

## Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  MACRO-CYCLE (Sprint/Milestone)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               MESO-CYCLE (~5 Tasks)                      │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │          MICRO-CYCLE (Per Task)                    │  │   │
│  │  │                                                     │  │   │
│  │  │  1. Select Task (dependency check)                 │  │   │
│  │  │  2. Write Code (AFS adherence)                     │  │   │
│  │  │  3. Integration Check (connectors/interfaces)      │  │   │
│  │  │  4. Write Tests (if applicable)                    │  │   │
│  │  │  5. Update Task Documentation                      │  │   │
│  │  │  6. Mark Task Complete                             │  │   │
│  │  │                                                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  │  After 5 Tasks:                                          │   │
│  │  7. Run Moderate Test Suite                             │   │
│  │  8. Commit with Conventional Commits                    │   │
│  │  9. Push to Remote Branch                               │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  After Sprint Complete:                                         │
│  10. Run Full Test Suite                                        │
│  11. Verify AFS Realization (≥95%)                              │
│  12. Check Feature Creep                                        │
│  13. Update All Documentation                                   │
│  14. Generate Next Steps Document                               │
│  15. Final Commit & Push                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## MICRO-CYCLE: Per-Task Workflow

### 1. Task Selection

**Algorithm:**
1. Load current sprint from `sprint-plan.md`
2. Filter tasks with status = "pending"
3. Check `dependency-matrix.md` for prerequisites
4. Verify all dependencies completed
5. Select by: Priority (P0 > P1 > P2) → Blocking factor → Size

**Checklist:**
- [ ] Current sprint identified
- [ ] Dependencies verified (dependency-matrix.md)
- [ ] Task priority confirmed
- [ ] AFS document reviewed
- [ ] Task marked "in_progress"
- [ ] Feature branch created: `feature/WBS-X.X.X-description`

### 2. Code Implementation

**Pre-Implementation:**
- [ ] Read full AFS document
- [ ] Review PRD requirements
- [ ] Identify integration points
- [ ] Review existing patterns

**Implementation:**
- [ ] Write code in `Overlord.Core` (business logic)
- [ ] Write Unity wrapper if needed
- [ ] Add XML documentation (`///`)
- [ ] Add error handling
- [ ] No hardcoded values
- [ ] Code compiles without errors/warnings

### 3. Integration Verification

**Critical Checks:**
- [ ] All AFS interfaces implemented
- [ ] Dependencies accessible
- [ ] Events wired correctly
- [ ] GameState updated properly
- [ ] No memory leaks
- [ ] Input/output validation
- [ ] Edge cases handled

### 4. Test Writing

**Requirements:**

| System | Test Type | Coverage |
|--------|-----------|----------|
| Overlord.Core | xUnit (MANDATORY) | 70%+ |
| Overlord.Unity | Unity TF (Optional) | 40%+ |
| UI | Manual (Optional) | N/A |

**Test Checklist:**
- [ ] Happy path tested
- [ ] Edge cases tested
- [ ] Error conditions tested
- [ ] All tests pass
- [ ] Coverage measured: `dotnet test --collect:"XPlat Code Coverage"`
- [ ] 70% target met

### 5. Documentation Update

- [ ] XML comments for public APIs
- [ ] Inline comments for complex logic
- [ ] Update `sprint-plan.md` (mark completed)

### 6. Quality Gate

**Must Pass:**
- [ ] Code compiles (no errors/warnings)
- [ ] Integration checks pass
- [ ] Tests pass (if applicable)
- [ ] Coverage ≥70%
- [ ] Documentation updated
- [ ] Feature branch committed locally

**⚠️ If fails: DO NOT proceed. Fix immediately.**

---

## MESO-CYCLE: Every 5 Tasks

### 1. Moderate Test Suite

Run tests for affected systems only:
- [ ] `dotnet test Overlord.Core.Tests`
- [ ] All tests pass (0 failures)
- [ ] Coverage ≥70% verified
- [ ] Unity Test Runner (if applicable)

**Duration:** <30 seconds

### 2. Commit Strategy

**Conventional Commit Format:**
```
<type>(<scope>): <subject>

<body>

<footer>

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Example:**
```bash
git commit -m "feat(core): implement GameState and TurnSystem

- Add GameState model with serialization (WBS-1.1.6)
- Implement TurnSystem with events (WBS-1.2.1)
- Add unit tests achieving 75% coverage

Resolves: WBS-1.1.6, WBS-1.2.1
AFS: AFS-001, AFS-002

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3. Push to Remote

**Branch Strategy:**
```
main → develop → feature/WBS-X.X.X
```

**Checklist:**
- [ ] 5 tasks completed (or natural breakpoint)
- [ ] Moderate test suite passes
- [ ] Commit follows convention
- [ ] Push: `git push origin feature/WBS-X.X.X`

---

## MACRO-CYCLE: Sprint Complete

### 1. Full Test Suite

**Execute:**
1. Unit Tests (<2 min)
2. Integration Tests (<5 min)
3. Unity Play Mode (<10 min)
4. Smoke Tests (<5 min)
5. Performance Tests (<15 min, if applicable)

**All must pass before proceeding.**

### 2. AFS Realization Verification

For each AFS in sprint:
1. Open AFS document
2. Review acceptance criteria
3. Locate implementing code
4. Verify functionality
5. Run validating tests
6. Calculate: (Verified / Total) × 100%

**Threshold:**
- ✅ PASS: ≥95%
- ⚠️ WARN: 90-94%
- ❌ FAIL: <90%

### 3. Feature Creep Detection

**Process:**
1. `git diff develop main --name-only`
2. For each file:
   - Locate AFS document
   - Verify all public methods in AFS
   - Flag extras not in AFS

**Indicators:**
- ⚠️ Methods not in AFS
- ⚠️ Systems not in WBS
- ⚠️ "Nice to have" features
- ⚠️ Premature optimization

**Action:** Remove, document as tech debt, or backlog

### 4. Documentation Update

Complete update of:
1. `sprint-plan.md` (mark sprint completed)
2. `wbs.md` (mark tasks completed)
3. `traceability-matrix.md` (mark AFS implemented)
4. `README.md` (update status, version)
5. `CHANGELOG.md` (add sprint entry)
6. Architecture diagrams (if changed)
7. API documentation (regenerate)
8. Tech debt log

### 5. Next Steps Document

**Location:** `design-docs/v1.0/planning/next-steps/sprint-XX-complete.md`

**Template sections:**
- Sprint Summary
- Completed Tasks
- AFS Realized
- Test Results
- Deviations
- Next Sprint Goal
- Next 5 Tasks
- Blockers/Risks
- Open Items

### 6. Terminal Output

Clear, structured communication showing:
- Sprint completion status
- Test results
- Coverage metrics
- AFS realization
- Next sprint details
- Next 5 tasks with dependencies
- Progress tracking

### 7. Final Commit & Push

```bash
# Merge feature branches
git checkout develop
git merge feature/WBS-X.X.X

# Create release commit
git commit -m "release: Sprint X Complete (vX.X.X)

Sprint X deliverables:
- [List features/AFS]
- Test coverage: XX%

See: design-docs/v1.0/planning/next-steps/sprint-XX-complete.md

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Tag release
git tag -a vX.X.X -m "Sprint X Complete"

# Push
git push origin develop --tags

# Create PR: develop → main
```

---

## Quality Gates

### Micro-Cycle
- ✅ Code compiles (0 errors, 0 warnings)
- ✅ Tests pass
- ✅ Coverage ≥70%
- ✅ Integration verified

**Fail:** Fix immediately

### Meso-Cycle
- ✅ Moderate test suite passes
- ✅ No warnings/errors
- ✅ Commit well-formed

**Fail:** Fix before commit

### Macro-Cycle
- ✅ Full test suite passes
- ✅ AFS ≥95%
- ✅ No feature creep
- ✅ Documentation complete

**Fail:** Continue sprint

---

## Risk Mitigation

### Breaking Changes
- Document in BREAKING_CHANGES.md
- Mark old API [Obsolete]
- Run full test suite
- Bump MAJOR version

### Rework Prevention
**Before:** Read AFS, review PRD, check dependencies
**During:** Follow AFS exactly, no extras, consult if uncertain

### Scope Creep Prevention
**Red Flags:** "While I'm here...", "Nice to have...", "Might need later..."
**Response:** Check AFS → If not listed, don't implement → Document as tech debt

---

## Rollback Procedures

### Task-Level (Micro)
```bash
git checkout -- .
git clean -fd
```
Cost: Lose current task

### Batch-Level (Meso)
```bash
git reset --hard HEAD~1
```
Cost: Lose since last commit

### Sprint-Level (Macro)
```bash
git checkout main
git branch -D develop
git checkout -b develop main
git cherry-pick <good-commit>
```
Cost: Lose bad commits

---

## Quick Reference

### Micro-Cycle Checklist
1. ✅ Select task (dependencies)
2. ✅ Read AFS
3. ✅ Write code
4. ✅ Integration check
5. ✅ Write tests (≥70%)
6. ✅ Update docs
7. ✅ Quality gate
8. ✅ Mark complete

### Meso-Cycle Checklist
1. ✅ Moderate test suite
2. ✅ Verify coverage
3. ✅ Commit (conventional)
4. ✅ Push to branch

### Macro-Cycle Checklist
1. ✅ Full test suite
2. ✅ AFS verification (≥95%)
3. ✅ Feature creep check
4. ✅ Update all docs
5. ✅ Generate Next Steps
6. ✅ Final commit & push
7. ✅ Create PR

---

## Critical Files

**Planning:**
- `sprint-plan.md` - Task tracking
- `dependency-matrix.md` - Prerequisites
- `wbs.md` - Task hierarchy
- `traceability-matrix.md` - AFS coverage

**AFS:**
- `design-docs/v1.0/afs/AFS-*.md` - Specifications

**Documentation:**
- `README.md` - Project overview
- `CHANGELOG.md` - Version history
- `next-steps/` - Sprint reports

**Code:**
- `Overlord.Core/` - Business logic (.NET 8.0)
- `Overlord.Core.Tests/` - xUnit tests
- `Overlord.Unity/` - Unity wrappers

**CI/CD:**
- `.github/workflows/ci-cd.yml` - Automated gates
- `.git/hooks/pre-commit` - Local checks

---

## Success Metrics

**Quality:**
- ✅ Coverage ≥70% (Overlord.Core)
- ✅ Zero warnings (release builds)
- ✅ AFS ≥95% per sprint
- ✅ No feature creep

**Process:**
- ✅ Dependencies met before start
- ✅ Docs updated continuously
- ✅ Conventional commits
- ✅ Next Steps every sprint

**Velocity:**
- ✅ 80 hours/sprint
- ✅ Estimation ±10%
- ✅ Rework <5%

---

**Document Owner:** Lead Developer
**Review Status:** Approved
