# Volume II: Development Guide & Open Items

**Purpose:** Specifications and implementation guides for remaining development work
**Last Updated:** December 11, 2025

---

## Table of Contents

### Open Items Overview
- [01: Open Items Overview](01-open-items-overview.md) - Remaining work breakdown
- [02: Task Backlog](02-task-backlog.md) - Prioritized task list with estimates

### Content Creation
- [03: Scenario Authoring](03-scenario-authoring.md) - JSON scenario creation guide
- [04: Scenario Pack Creation](04-scenario-pack-creation.md) - AI configuration packs
- [05: Content Creation Guide](05-content-creation-guide.md) - General content workflows
- [06: Audio Assets](06-audio-assets.md) - Sound effects and music guide

### Infrastructure & Configuration
- [07: Supabase Integration](07-supabase-integration.md) - Cloud persistence setup
- [08: Contributing Guide](08-contributing-guide.md) - How to contribute code

### Best Practices
- [09: Coding Patterns](09-coding-patterns.md) - Reusable patterns and examples
- [10: Free Tools & Resources](10-free-tools-resources.md) - No-cost asset sources

---

## What This Volume Covers

### Remaining Work (5 Epics)

**Epic 1: Player Onboarding & Tutorials (5 stories)**
- Story 1-2: Scenario selection interface (requires JSON schema)
- Story 1-3: Scenario initialization (requires scenario configs)
- Story 1-4: Tutorial step guidance (requires tutorial content)
- Story 1-5: Scenario completion display
- Story 1-6: Completion history tracking

**Epic 8: Quick-Play Tactical Scenarios (1 story)**
- Story 8-1: Tactical scenario content (requires scenario files)

**Epic 9: Scenario Pack System (3 stories)**
- Story 9-1: Pack browsing and selection (requires pack JSON files)
- Story 9-2: Pack switching runtime
- Story 9-3: Pack metadata display

**Epic 10: User Accounts & Cloud Saves (7 stories)**
- Story 10-1: User account creation (requires Supabase setup)
- Story 10-2: Login and authentication
- Story 10-3: Save game to cloud
- Story 10-4: Load game from cloud
- Story 10-5: Cross-device sync
- Story 10-6: User settings persistence
- Story 10-7: Statistics tracking

**Epic 12: Audio & Atmospheric Immersion (5 stories)**
- Story 12-1: Sound effects (requires audio files)
- Story 12-2: Background music (requires music tracks)
- Story 12-3: Volume controls
- Story 12-4: Mute functionality
- Story 12-5: Browser audio activation

**Total:** 21 stories remaining (5 epics)

---

## Human Tasks Required

### Critical Path (Required for MVP)

**Epic 1 - Tutorial Content (HIGH PRIORITY)**
- **Time Estimate:** 3-4 hours
- **Deliverables:**
  - Scenario JSON schema definition
  - 2-3 tutorial scenario files
  - Tutorial step-by-step content
  - Victory condition configurations

**Epic 8 - Tactical Scenarios (MEDIUM PRIORITY)**
- **Time Estimate:** 2-3 hours
- **Deliverables:**
  - 4-6 tactical scenario JSON files
  - Balanced difficulty settings
  - Scenario descriptions

**Epic 9 - Scenario Packs (MEDIUM PRIORITY)**
- **Time Estimate:** 1-2 hours
- **Deliverables:**
  - 2-3 scenario pack JSON files
  - AI configuration matrices
  - Galaxy templates

**Epic 10 - Supabase Setup (LOW PRIORITY)**
- **Time Estimate:** 30 minutes setup + 1 hour integration
- **Deliverables:**
  - Supabase project created
  - Database schema deployed
  - API keys configured
  - Environment variables set

**Epic 12 - Audio Assets (LOW PRIORITY)**
- **Time Estimate:** 3-5 hours (finding + organizing)
- **Deliverables:**
  - 8+ sound effect files (MP3/OGG)
  - 3+ background music tracks
  - Audio manifest JSON

**Total Human Time:** 10-15 hours (or 6-9 hours if parallelized)

---

## How to Use This Volume

### For Contributors Picking Up Tasks

1. **Review Open Items:**
   - Read [01: Open Items Overview](01-open-items-overview.md)
   - Check [02: Task Backlog](02-task-backlog.md) for available tasks
   - Pick task matching your skills

2. **Content Creation:**
   - Follow [03: Scenario Authoring](03-scenario-authoring.md) for scenarios
   - Use [04: Scenario Pack Creation](04-scenario-pack-creation.md) for packs
   - Reference [06: Audio Assets](06-audio-assets.md) for sound/music

3. **Infrastructure Setup:**
   - See [07: Supabase Integration](07-supabase-integration.md) for cloud setup
   - Follow [08: Contributing Guide](08-contributing-guide.md) for workflow

4. **Implementation:**
   - Review [09: Coding Patterns](09-coding-patterns.md) for examples
   - Use [10: Free Tools & Resources](10-free-tools-resources.md) for assets

### For Project Managers

1. **Track Progress:**
   - Monitor `design-docs/artifacts/sprint-artifacts/sprint-status.yaml`
   - Check story files in `design-docs/artifacts/sprint-artifacts/story-*.md`
   - Review test coverage reports

2. **Assign Tasks:**
   - Use [02: Task Backlog](02-task-backlog.md) as assignment source
   - Match tasks to contributor skills
   - Set realistic deadlines based on estimates

3. **Review Deliverables:**
   - Validate JSON files against schemas
   - Test scenario playability
   - Verify audio file formats and quality

---

## Workflow for Autonomous Development

### Three-Agent Sprint System

The project uses an AI-assisted three-agent workflow:

**1. Technical Writer (Planning)**
- Creates story files with acceptance criteria
- Defines task breakdown
- Specifies integration points

**2. Game Developer (Implementation)**
- Implements features with TDD (test-first)
- Writes comprehensive tests
- Integrates with existing systems

**3. Code Reviewer (Quality Gate)**
- Validates all acceptance criteria met
- Checks architecture compliance
- Verifies test coverage (70%+ minimum)
- Approves or rejects with specific issues

### Human-in-the-Loop Points

**Autonomous Development Blocked When:**
- Content files missing (scenarios, audio, configs)
- External service setup required (Supabase project)
- Design decisions need human judgment
- Ambiguous requirements need clarification

**See:** `design-docs/artifacts/sprint-artifacts/HUMAN-TASKS-REQUIRED.md` for current blockers

---

## Resuming After Human Tasks Complete

### Resume Instructions

After completing human content tasks:

1. **Commit Content Files:**
   ```bash
   cd C:\dev\GIT\Overlord
   git add Overlord.Phaser/src/data/**/*.json
   git add Overlord.Phaser/public/assets/audio/**/*.mp3
   git add Overlord.Phaser/src/config/supabase.ts
   git commit -m "content: add human-created scenario, audio, and config files"
   ```

2. **Update Sprint Status:**
   - Edit `design-docs/artifacts/sprint-artifacts/sprint-status.yaml`
   - Remove `[BLOCKED]` tags from completed stories
   - Or ask AI to update automatically

3. **Resume Autonomous Development:**
   - Simply say to Claude: `continue with remaining stories`
   - AI will re-read sprint status and continue

---

## Quality Standards

### JSON Content Files

**Required:**
- Valid JSON syntax (use JSONLint.com to validate)
- All required fields present
- Follows schema definitions
- Includes meaningful descriptions

**Testing:**
- Load JSON file in game
- Verify scenario starts correctly
- Check victory conditions work
- Ensure no runtime errors

### Audio Files

**Required:**
- Format: MP3 (128-192 kbps) or OGG Vorbis
- Max file size: 2MB per track (for web performance)
- Loopable music (seamless loop points)
- Normalized volume levels

**Testing:**
- Play in browser
- Verify loop points (no clicks/pops)
- Check volume balance
- Test mute/unmute functionality

### Code Contributions

**Required:**
- Tests written before implementation (TDD)
- 70%+ code coverage maintained
- All tests passing (npm test)
- TypeScript strict mode compliance (no 'any')
- Documentation comments (JSDoc)

**Review Criteria:**
- Architecture compliance (Core → Phaser separation)
- Event-driven patterns used correctly
- No Phaser imports in src/core/
- Consistent naming conventions

---

## Development Estimates

### Epic Completion Times (After Human Tasks)

| Epic | Human Time | AI Development Time | Total |
|------|-----------|---------------------|-------|
| Epic 1 | 3-4 hours | 6-8 hours | 10-12 hours |
| Epic 8 | 2-3 hours | 2-3 hours | 4-6 hours |
| Epic 9 | 1-2 hours | 4-6 hours | 5-8 hours |
| Epic 10 | 1.5 hours | 8-10 hours | 10-12 hours |
| Epic 12 | 3-5 hours | 6-8 hours | 10-13 hours |
| **Total** | **10-15 hours** | **26-35 hours** | **39-51 hours** |

**Notes:**
- Human time is content creation (scenarios, audio, config)
- AI development time is implementation + testing
- Total assumes sequential development (one epic at a time)
- Parallelization possible for human tasks (reduce to 6-9 hours)

---

## Risk Mitigation

### Common Blockers

**Issue:** Scenario JSON schema evolves during development
- **Mitigation:** Version schema explicitly (`"schema_version": "1.0"`)
- **Fallback:** Migration tool to upgrade old scenarios

**Issue:** Audio files poor quality or licensing unclear
- **Mitigation:** Use only CC0/public domain sources (documented in guide)
- **Fallback:** Game fully playable without audio (optional enhancement)

**Issue:** Supabase free tier limits exceeded
- **Mitigation:** Monitor usage dashboard, implement rate limiting
- **Fallback:** LocalStorage-only saves (no cross-device sync)

**Issue:** Test coverage drops below 70%
- **Mitigation:** CI/CD enforces threshold (blocks merge)
- **Fallback:** Add tests retroactively before merging

---

## Success Criteria

### Volume II Complete When:

- [ ] All 21 remaining stories have implementation plans
- [ ] Human task requirements clearly documented
- [ ] JSON schemas defined and validated
- [ ] Free tool/resource lists comprehensive
- [ ] Step-by-step guides tested by external contributors
- [ ] Supabase integration guide verified on fresh project

---

## Next Steps

After reviewing this overview:
1. Check [01: Open Items Overview](01-open-items-overview.md) for remaining work
2. Pick a task from [02: Task Backlog](02-task-backlog.md)
3. Follow relevant content creation guide (scenarios, audio, packs)
4. Use [08: Contributing Guide](08-contributing-guide.md) for workflow
5. Reference [09: Coding Patterns](09-coding-patterns.md) for examples

---

**Volume II Status:** Complete
**Human Tasks Documented:** 21 stories across 5 epics
**Time Estimates:** 39-51 total hours remaining
**Guides Provided:** 10 comprehensive how-to guides
