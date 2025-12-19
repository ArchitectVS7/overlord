# Chapter 8: Git, Pull Requests, and Issues Guide

This guide establishes workflows for version control, pull requests, and issue management in the Overlord project. Following these practices ensures consistent code quality, clear communication, and smooth collaboration whether working solo or as part of a team.

## Table of Contents

1. [Git Workflow](#1-git-workflow)
2. [Commit Standards](#2-commit-standards)
3. [Pull Request Process](#3-pull-request-process)
4. [Issue Management](#4-issue-management)
5. [AI-Assisted Development](#5-ai-assisted-development)

---

## 1. Git Workflow

### 1.1 Branch Naming Convention

Branch names should be descriptive, lowercase, and use hyphens to separate words. The prefix indicates the type of work:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/epic-3-story-2-planetary-invasion` |
| `fix/` | Bug repairs | `fix/issue-42-save-corruption` |
| `docs/` | Documentation updates | `docs/how-to-play-economy-section` |
| `refactor/` | Code restructuring | `refactor/combat-system-modular` |
| `test/` | Test additions or fixes | `test/uat-resource-system` |
| `chore/` | Build, config, tooling | `chore/update-playwright-config` |

**Full Pattern:** `<prefix>/<context>-<description>`

The context element helps locate related work. For feature branches, reference the epic and story number when applicable. For bug fixes, include the issue number.

**Examples:**
```
feature/epic-5-story-3-ai-defensive-personality
fix/issue-127-auth-session-timeout
docs/volume-3-uat-methodology
refactor/income-system-crew-allocation
test/e2e-admin-panel-drag
chore/ci-coverage-threshold
```

### 1.2 Branch Lifecycle

A typical branch lifecycle follows this pattern:

1. **Create branch** from `main` with appropriate prefix and name
2. **Develop** with incremental commits following the commit standards
3. **Push** to remote with tracking (`git push -u origin branch-name`)
4. **Open PR** when work is complete or ready for review
5. **Address feedback** through additional commits
6. **Squash merge** into `main` after approval
7. **Delete branch** after merge (GitHub does this automatically if configured)

### 1.3 Main Branch Protection

The `main` branch represents the stable, deployable state of the project. Direct commits to `main` should be avoided except for emergency hotfixes. All changes should flow through pull requests.

**Protected branch rules to consider:**
- Require pull request before merging
- Require at least one approval (when working with team)
- Require status checks to pass (tests, lint)
- Dismiss stale reviews when new commits pushed

---

## 2. Commit Standards

### 2.1 Commit Message Format

Overlord follows Conventional Commits specification. Each commit message has a structured format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Type** indicates the category of change:

| Type | When to Use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug repair |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |
| `refactor` | Code change that neither fixes bug nor adds feature |
| `style` | Formatting, semicolons, etc. (no code change) |
| `perf` | Performance improvement |
| `chore` | Build process, dependencies, tooling |

**Scope** identifies the affected system or component:

| Scope | Coverage |
|-------|----------|
| `combat` | CombatSystem, SpaceCombatSystem |
| `income` | IncomeSystem, ResourceSystem |
| `ai` | AIDecisionSystem, AI personalities |
| `craft` | CraftSystem, spacecraft |
| `platoon` | PlatoonSystem, military units |
| `building` | BuildingSystem, structures |
| `save` | SaveService, game persistence |
| `auth` | AuthService, authentication |
| `admin` | AdminModeService, UI editing |
| `ui` | Scenes, panels, HUD components |
| `tutorial` | TutorialManager, Flash Conflicts |
| `scenario` | ScenarioManager, scenario packs |

**Description** is a concise summary in imperative mood:
- Use present tense: "add" not "added"
- Don't capitalize first letter
- No period at the end
- Maximum 72 characters

**Examples:**
```
feat(combat): add aggression slider to invasion panel

fix(save): handle corrupted checksum gracefully

docs(tutorial): add economy system how-to-play content

test(ai): add personality behavior validation tests

refactor(income): extract crew allocation to separate method

chore(deps): update Phaser to 3.70.0
```

### 2.2 Commit Body

For complex changes, include a body that explains the motivation and approach:

```
feat(ai): implement defensive personality retreat logic

Defensive AI personality now retreats when threatened rather than
fighting to destruction. This makes Overseer Aegis behave more
consistently with their "patience is the strongest fortress" philosophy.

- Add threat assessment to determine when to retreat
- Implement retreat destination selection (nearest safe planet)
- Fire onAIRetreating event for UI feedback
```

### 2.3 Breaking Changes

If a commit introduces breaking changes, indicate this in the footer:

```
refactor(save): change save format to support versioning

BREAKING CHANGE: Save files from v0.1.x are incompatible with this
version. Players must start new games or use the migration tool.
```

### 2.4 Pre-Commit Checklist

Before committing, verify:

1. **Tests pass:** `npm test` completes without failures
2. **Lint clean:** `npm run lint` reports no errors
3. **Build succeeds:** `npm run build` compiles without errors
4. **Self-review:** Check diff for:
   - Debug code (console.log, debugger statements)
   - Commented-out code blocks
   - TODO comments that should be issues
   - Sensitive data (API keys, passwords)

---

## 3. Pull Request Process

### 3.1 PR Template

When opening a pull request, use this structure:

```markdown
## Summary

[Brief description of what this PR accomplishes. 2-3 sentences maximum.]

## Changes

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

## Test Plan

- [ ] Unit tests added/updated for new functionality
- [ ] Manual testing performed (describe scenarios)
- [ ] E2E tests pass (`npm run test:e2e`)

## Screenshots

[If UI changes, include before/after screenshots]

## Related Issues

Closes #123
Related to #456
```

### 3.2 PR Title Convention

PR titles should follow the same format as commit messages since they become the squash commit message:

```
feat(combat): implement bombardment system with structure damage
```

### 3.3 Review Criteria

When reviewing PRs (or self-reviewing), verify:

**Code Quality:**
- TypeScript types are explicit (no implicit `any`)
- Functions have single responsibility
- Error handling follows project patterns
- No unused imports or variables

**Architecture:**
- Core systems have zero Phaser imports
- Scene code only handles presentation
- State changes flow through appropriate systems
- Events used for cross-system communication

**Testing:**
- New functionality has corresponding tests
- Coverage threshold maintained (70% minimum)
- Edge cases considered

**Documentation:**
- Public APIs have JSDoc comments
- Complex logic has inline explanations
- README or docs updated if API changed

### 3.4 Merge Requirements

Before merging, ensure:

1. **Approval:** At least one approving review (if working with others)
2. **CI Passing:** All automated checks green
3. **No Conflicts:** Branch is up-to-date with main
4. **Squash Merge:** Use "Squash and merge" for clean history

### 3.5 Handling Review Feedback

When addressing review comments:

1. **Respond to each comment** - even if just "Done" or "Good point, fixed"
2. **Push fixes as new commits** during review (easier to see changes)
3. **Request re-review** after addressing all feedback
4. **Don't force push** during review unless absolutely necessary

---

## 4. Issue Management

### 4.1 Issue Labels

Apply labels to categorize and prioritize issues:

**Type Labels:**

| Label | Color | Purpose |
|-------|-------|---------|
| `bug` | Red | Something isn't working correctly |
| `feature` | Green | New functionality request |
| `enhancement` | Blue | Improvement to existing feature |
| `documentation` | Purple | Documentation improvements |
| `question` | Yellow | Needs clarification |

**Priority Labels:**

| Label | Color | Meaning |
|-------|-------|---------|
| `alpha-blocker` | Red | Must fix before closed alpha |
| `high-priority` | Orange | Should address soon |
| `low-priority` | Gray | Nice to have, not urgent |

**Domain Labels:**

| Label | Purpose |
|-------|---------|
| `combat` | Combat system issues |
| `economy` | Resource/income issues |
| `ai` | AI behavior issues |
| `ui` | User interface issues |
| `performance` | Performance problems |
| `balance` | Gameplay balance tuning |

### 4.2 Bug Report Template

When filing a bug report, include:

```markdown
## Bug Description

[Clear description of what's wrong]

## Steps to Reproduce

1. [First step]
2. [Second step]
3. [Third step]

## Expected Behavior

[What should happen]

## Actual Behavior

[What actually happens]

## Environment

- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Game Version: [e.g., commit hash or release]

## Screenshots/Logs

[Attach relevant screenshots or console output]

## Severity

- [ ] Critical (game-breaking, data loss)
- [ ] Major (significant feature broken)
- [ ] Minor (cosmetic, workaround exists)
```

### 4.3 Feature Request Template

When requesting a feature:

```markdown
## Feature Description

[What capability should be added]

## Use Case

[Why is this feature valuable? What problem does it solve?]

## Proposed Solution

[How might this be implemented? Optional but helpful]

## Alternatives Considered

[Other approaches that might work]

## Additional Context

[Mockups, examples from other games, etc.]
```

### 4.4 Issue Triage Process

For incoming issues:

1. **Validate:** Can the issue be reproduced? Is it clear?
2. **Label:** Apply type, priority, and domain labels
3. **Assign:** If someone should own it, assign them
4. **Milestone:** Add to appropriate milestone if planned
5. **Link:** Connect related issues and PRs

---

## 5. AI-Assisted Development

When using Claude Code or other AI assistants with this codebase, follow these practices for effective collaboration.

### 5.1 Providing Context

AI assistants work best with clear context. When starting a task:

**Good prompt:**
```
I need to add a new AI personality called "Trader" that prioritizes
resource accumulation and trade routes. Look at the existing
AIPersonalityConfig in src/core/models/AIModels.ts and AIDecisionSystem.ts
for the pattern to follow. The Trader personality should have:
- High economic modifier (+0.6)
- Low aggression modifier (-0.4)
- No defense modifier
- Quote: "Every planet is a market waiting to be exploited."
```

**Less effective prompt:**
```
Add a new AI personality
```

### 5.2 Referencing Existing Patterns

This codebase has established patterns. Point the AI to examples:

```
Follow the same event pattern used in CombatSystem.ts
(onBattleStarted, onBattleCompleted) when adding events to the
new TradeSystem.
```

### 5.3 Scope Boundaries

Be explicit about what should and shouldn't be modified:

```
Only modify files in src/core/. Do not change any scene files or
UI components. The new system should emit events that scenes can
subscribe to separately.
```

### 5.4 Documentation in PRs

When AI assists with changes, document the approach in the PR:

```markdown
## AI Assistance Note

This PR was developed with Claude Code assistance. The approach
discussed:
- Modular trade route system following existing CraftSystem patterns
- Event-driven updates to avoid Phaser coupling in core
- Unit tests covering route calculation edge cases

Human review focused on: balance implications, integration points,
edge cases not covered by initial tests.
```

### 5.5 Verifying AI-Generated Code

Always verify AI-generated code before committing:

1. **Read the code:** Understand what it does, don't just trust it
2. **Run tests:** Ensure existing tests still pass
3. **Manual testing:** Verify the feature works as expected
4. **Check patterns:** Confirm it follows project conventions
5. **Review imports:** Ensure Core systems don't import Phaser

### 5.6 Iterative Development

For complex features, break work into smaller pieces:

```
First, let's just add the TradeRoute model class without any
logic. Show me that, and after I approve we'll add the
TradeRouteSystem.
```

This approach:
- Makes review easier
- Catches misunderstandings early
- Creates natural checkpoint commits

---

## Quick Reference

### Git Commands

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/epic-3-story-1-feature-name

# Commit with conventional format
git add .
git commit -m "feat(scope): description"

# Push branch
git push -u origin feature/epic-3-story-1-feature-name

# Update from main
git fetch origin
git rebase origin/main

# Interactive rebase to clean up commits (before PR)
git rebase -i origin/main
```

### Commit Prefixes

| Prefix | Use |
|--------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `test` | Tests |
| `refactor` | Restructure |
| `style` | Formatting |
| `perf` | Performance |
| `chore` | Tooling/deps |

### Review Checklist

- [ ] Tests pass
- [ ] Lint clean
- [ ] Types explicit (no `any`)
- [ ] Core has no Phaser imports
- [ ] Error handling present
- [ ] Coverage maintained

---

*Last updated: December 2024*
*Applies to: Overlord development workflow*
