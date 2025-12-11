---
name: sprint
description: Execute multi-agent orchestration workflow autonomously. Processes all epics and stories using three-agent workflow pattern.
---

# Sprint Auto-Run Command

This command initiates autonomous execution of the sprint implementation workflow, using the @sprint-orchestrator to coordinate @sprint-tech-writer, @sprint-game-dev, and @sprint-code-reviewer agents.

## Usage

```bash
/sprint [start|resume|status]
```

**Commands**:
- `start`: Begin from first backlog story, create epic branch, execute all epics
- `resume`: Continue from current state (read sprint-status.yaml)
- `status`: Show current progress without executing

**Default**: If no subcommand provided, defaults to `resume`

## What This Does

When you run `/sprint start` or `/sprint resume`, the orchestrator will:

1. **Initialize**: Read sprint-status.yaml, parse epic structure, check current state, verify git branch, determine starting point

2. **Execute Epic Sequence** (autonomously): Process epics in the order specified by `epic_order` field. For each epic, process all stories in numeric order. Create git branches per epic, tag each completed epic.

3. **Per Story Cycle**: @sprint-tech-writer creates story plan → @sprint-game-dev implements with TDD → @sprint-code-reviewer validates → repeat until approved

4. **Per Epic Completion**: Merge to main, create version tag, delete epic branch, continue to next epic

5. **Final Validation**: Run full test suite, verify coverage, build project, confirm all stories done

## Expected Behavior

**This command runs autonomously.** It will process all epics without stopping for permission, log progress for each story and epic, handle test failures and review rejections automatically, and only stop for critical blockers requiring human input.

**You will NOT see**: "Would you like me to continue?" prompts, requests for permission between epics, unnecessary status updates

**You WILL see**: Brief progress logs, epic completion confirmations, final validation results with epic/story counts

## Prerequisites

Before running this command:
- Ensure you're in project root directory
- Verify sprint-status.yaml exists at design-docs/artifacts/sprint-artifacts/sprint-status.yaml
- Verify epics.md exists at design-docs/artifacts/epics.md
- Ensure git is on main branch with clean working tree
- Run npm install if not already done
- Verify tests work: npm test should run existing tests

## Progress Tracking

Check progress anytime with:
```bash
/sprint status
```

This will read sprint-status.yaml and show stories completed, current epic, current story with status, and next epic.

## Recovery from Interruption

If the process is interrupted (error, usage limit, system restart):

```bash
/sprint resume
```

The orchestrator will read sprint-status.yaml to determine state, verify filesystem matches status, reconcile any inconsistencies, resume from correct point, and continue autonomously to completion.

**The orchestrator is stateless** - it doesn't rely on conversation history to know where it left off.

## Error Scenarios

**Test Failures**: Orchestrator will retry implementation up to 3 times before escalating.

**Review Rejections**: Developer agent will fix issues and resubmit (max 2 cycles).

**Build Failures**: Orchestrator will investigate errors and attempt fixes.

**Critical Blockers**: Orchestrator will pause and report the issue, required action, and how to resume.

## Time Estimates

Based on typical agent performance:
- Planning (per story): ~2-3 minutes
- Implementation (per story): ~5-15 minutes depending on complexity
- Review (per story): ~3-5 minutes
- Total per story: ~10-23 minutes average

**Total sprint estimate varies by story count**: Small sprint (5-10 stories): ~1-3 hours, Medium sprint (10-20 stories): ~3-6 hours, Large sprint (20-30 stories): ~6-10 hours

**Note**: Usage limits may require multiple sessions. Use `/sprint resume` to continue.

## Success Criteria

Sprint is complete when all stories marked 'done', all epics merged to main with version tags, full test suite passes, coverage meets threshold, build succeeds, and main branch contains all changes with clean working tree.

## Troubleshooting

**Orchestrator not found**: Ensure agents are installed in `.claude/agents/`

**Status file not found**: Verify sprint-status.yaml exists at correct path

**Git errors**: Ensure working tree is clean and on main branch

**Test failures**: Review test output, fix issues, resume with `/sprint resume`

**Usage limits**: Wait for limit reset, then run `/sprint resume` to continue

## Remember

This command runs autonomously - let it work. Check progress with `/sprint status` anytime. Resume after interruptions with `/sprint resume`. The orchestrator is stateless - it reads files, not conversation history. Trust the process - it will complete all stories across all epics.

Let the agents do the work. Your job is to kick it off and let it run.
