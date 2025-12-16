# Design Documents Review - 2025-12-16

## Executive Summary

After reviewing all design documents in `design-docs/` against the current codebase state (1,272 passing tests), several inconsistencies exist between documentation and actual implementation progress. **The sprint-status.yaml is the single source of truth** and shows 9 of 12 epics complete, while the roadmaps still describe early phases as "to do."

### Quick Status
| Document | Recommendation |
|----------|---------------|
| PROJECT-ROADMAP.md | **ARCHIVE** - Outdated, superseded |
| PROJECT-ROADMAP-V2.md | **ARCHIVE** - Outdated, superseded |
| bmm-workflow-status.yaml | **ARCHIVE** - Old process tracking |
| prd.md | **KEEP** - Requirements still valid |
| game-architecture.md | **UPDATE** - Test count outdated |
| epics.md | **UPDATE** - Need completion status |
| scenario-pack-schema.md | **UPDATE** - Mark as implemented |
| sprint-status.yaml | **KEEP** - Source of truth |
| Asset docs | **KEEP** - Still relevant |
| Brainstorming session | **KEEP** - Historical record |

---

## Detailed Analysis

### 1. Documents to ARCHIVE (Move to `design-docs/archived/`)

#### PROJECT-ROADMAP.md
**Issue:** Describes Phase 1 (Combat - Stories 6-2, 6-3) as "CRITICAL - to do" but Epic 6 is actually DONE.

The roadmap shows:
- "Phase 1: Complete Combat Epic (CRITICAL)" - **Actually Done**
- "Phase 2: AI Visibility (HIGH)" - **Actually Done (Epic 7)**
- "Phase 3: Flash Conflicts & Tutorials" - **Actually Done (Epic 1)**
- Status shows "5/12 Epics Complete" - **Actually 9/12 Complete**

**Reason to Archive:** Completely superseded by actual implementation. Keeping this document causes confusion about project status.

#### PROJECT-ROADMAP-V2.md
**Issue:** Same content as V1 but with sprint-level detail for work that's already done.

Shows Sprint 1-6 breakdown for Epics 6, 7, 1, 8, 9 - but Epics 6, 7, 1, 9 are already DONE per sprint-status.yaml.

**Reason to Archive:** The detailed sprint planning is historical - useful to understand how work was planned but misleading about current state.

#### bmm-workflow-status.yaml
**Issue:** Shows `implementation-readiness` as "next_workflow" when implementation is 75% complete.

```yaml
next_workflow:
  id: "implementation-readiness"  # This was completed long ago
```

**Reason to Archive:** Process workflow tracking from early project phases, no longer relevant.

---

### 2. Documents to UPDATE

#### game-architecture.md (Line ~145-146, ~203-206)
**Issue:** References 304 tests with 93.78% coverage. Current state is 1,272 tests.

Update sections mentioning:
- "304 passing tests" → "1,272 passing tests"
- Coverage percentage may need verification

#### epics.md
**Issue:** No completion status indicators. All stories appear as "to do" when most are done.

**Recommendation:** Add a status header or integrate with sprint-status.yaml format:
```markdown
### Epic 1: Player Onboarding & Tutorials ✅ DONE
### Epic 6: Combat & Planetary Invasion ✅ DONE
```

#### scenario-pack-schema.md (Bottom section)
**Issue:** Status shows "Draft - Awaiting Review" with "Next Actions" listing implementation tasks.

Epic 9 (Scenario Packs) is DONE with 52+ tests. Update status section:
- Change "Draft - Awaiting Review" → "Implemented - v0.9.0"
- Mark implementation tasks as complete
- Remove "Questions for Discussion" or note they were resolved

---

### 3. Documents in GOOD SHAPE (Keep as-is)

#### sprint-status.yaml ✅
The authoritative source of truth. Shows accurate epic/story completion:
- Done: Epics 11, 3, 2, 4, 5, 6, 7, 1, 9
- Backlog: Epics 8, 10
- In-Progress: Epic 12

#### prd.md ✅
Requirements document remains valid. FRs and NFRs haven't changed - they just have different completion states now.

#### Asset documentation ✅
- `asset-spec-package.md` - Art direction specs
- `asset-coverage-table.md` - Asset tracking
- `midjourney-master-prompts.md` - Generation prompts
- `midjourney-expansion-prompts.md` - Future prompts

These are forward-looking for asset creation and remain relevant.

#### brainstorming-session-2025-12-08.md ✅
Historical document capturing the Unity → Phaser migration decision. Valuable project history, should not be modified.

#### Story files ✅
Individual story files (story-5-3.md, etc.) are implementation artifacts and correctly reflect completed work.

---

## Current Project Status (Source: sprint-status.yaml)

### Completed Epics (9/12)
| Epic | Name | Version |
|------|------|---------|
| 11 | Accessible User Interface | v0.1.0-input |
| 3 | Galaxy Exploration & Planet Discovery | v0.2.0-planets |
| 2 | Campaign Setup & Core Loop | v0.3.0-campaign |
| 4 | Planetary Economy & Infrastructure | v0.4.0-economy |
| 5 | Military Forces & Movement | v0.5.0-military |
| 6 | Combat & Planetary Invasion | v0.6.0-combat |
| 7 | AI Opponent System | v0.7.0-ai |
| 1 | Player Onboarding & Tutorials | v0.8.0-onboarding |
| 9 | Scenario Pack System | v0.9.0-packs |

### Remaining Work
| Epic | Name | Status | Blockers |
|------|------|--------|----------|
| 8 | Quick-Play Tactical Scenarios | Backlog | Human input needed for scenario design |
| 10 | User Accounts & Persistence | Backlog | Supabase setup required |
| 12 | Audio & Atmospheric Immersion | In-Progress | 12-5 in review; 12-1, 12-2 need audio assets |

---

## Recommended Actions

### Immediate (Archive)
1. Create `design-docs/archived/` directory
2. Move these files:
   - `PROJECT-ROADMAP.md` → `archived/PROJECT-ROADMAP-pre-implementation.md`
   - `PROJECT-ROADMAP-V2.md` → `archived/PROJECT-ROADMAP-V2-sprint-planning.md`
   - `artifacts/bmm-workflow-status.yaml` → `archived/bmm-workflow-status.yaml`

### Short-term (Updates)
1. Update `game-architecture.md` test count
2. Add completion indicators to `epics.md`
3. Update `scenario-pack-schema.md` status

### Optional
Consider creating a new `PROJECT-STATUS.md` that:
- References sprint-status.yaml as source of truth
- Summarizes completion percentages
- Lists remaining blockers
- Provides quick overview for anyone new to the project

---

## Document Relationships

```
AUTHORITATIVE (Current State)
└── sprint-status.yaml ← Single source of truth for implementation

REQUIREMENTS (What to build)
├── prd.md ← Functional/non-functional requirements
├── epics.md ← Story breakdowns
└── scenario-pack-schema.md ← Technical schema spec

ARCHITECTURE (How to build)
└── game-architecture.md ← Patterns, decisions, structure

ASSETS (Visual direction)
├── asset-spec-package.md
├── asset-coverage-table.md
├── midjourney-master-prompts.md
└── midjourney-expansion-prompts.md

HISTORICAL (Reference only)
├── brainstorming-session-2025-12-08.md
└── archived/ (after cleanup)
```

---

## Summary

The design documents represent a **coherent vision** for Overlord, but the **roadmap documents are now historical artifacts** that no longer represent the current path forward. The project has progressed significantly beyond what the roadmaps describe.

**The unified story:**
1. PRD defines WHAT to build (still accurate)
2. Architecture defines HOW to build (still accurate, needs minor updates)
3. Epics break down the work (still accurate, need status indicators)
4. sprint-status.yaml tracks CURRENT STATE (authoritative)

**The path forward:**
- Finish Epic 12 (audio - needs assets)
- Epic 8 needs human input for scenario content
- Epic 10 needs external Supabase setup
- Game is 75% feature-complete and playable

Archive the outdated roadmaps and the project documentation will accurately represent one unified story with one clear path forward.
