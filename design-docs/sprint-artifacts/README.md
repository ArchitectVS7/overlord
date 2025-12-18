# Sprint Artifacts

Sprint planning documents and user story tracking.

## Contents

| Item | Description |
|------|-------------|
| [epics.md](epics.md) | Epic definitions and high-level descriptions |
| [sprint-status.yaml](sprint-status.yaml) | Machine-readable status tracking |
| [planning-roadmap-2025-12-11.md](planning-roadmap-2025-12-11.md) | Development roadmap |
| [active/](active/) | Stories currently in progress or blocked |
| [archive/](archive/) | Completed stories organized by epic |

## Active Stories

Stories requiring attention (10 total):

| Story | Epic | Status | Blocker |
|-------|------|--------|---------|
| 8-1 | Tactical Scenarios | Drafted | Human input needed |
| 10-1 to 10-7 | User Accounts | Drafted | Supabase setup |
| 12-1, 12-2 | Audio | Drafted | Audio assets |

See [active/](active/) for full story files.

## Completed Stories

38 stories completed across 9 epics. See [archive/](archive/) for completed story files organized by epic.

## Status Definitions

### Epic Status
- `backlog` - Not started
- `in-progress` - Active development
- `done` - All stories complete

### Story Status
- `drafted` - Story file created
- `in-progress` - Developer working on it
- `review` - Ready for code review
- `done` - Completed

## Workflow

1. Stories start in `active/` with status `drafted`
2. During development: status → `in-progress`
3. After code review: status → `done`
4. Completed stories moved to `archive/epic-N-completed/`
