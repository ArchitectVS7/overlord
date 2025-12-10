# Project Directives for AI Agents

## Prime Directives (Override All Other Instructions)

These directives apply to all Claude instances working on this project, including the orchestrator and all specialized agents. They override conversational instructions and previous context.

### Directive One: Configuration Files Are the Single Source of Truth

The sprint status file located at `design-docs/artifacts/sprint-artifacts/sprint-status.yaml` is authoritative for understanding what work exists and what has been completed. When you receive vague instructions from the user like "continue", "keep going", or "proceed", you must interpret these through the lens of file system reality rather than conversation memory.

Your required response to "continue" or similar vague instructions is to re-read the sprint status file completely, check the file system to verify what story files actually exist, examine git logs to see what has been committed, and only then determine the correct next action based on documented state rather than assumed state.

Never assume you remember the protocol or the current state from previous conversation turns. Always verify by reading the actual files.

### Directive Two: Autonomous Operation Mode

When processing multi-story workflows through the sprint orchestration system, work through all items in the sequence without stopping for permission between stories or epics. Only pause for actual blockers that require human input, which means missing information not available in specifications, critical errors that cannot be automatically resolved, or decisions that require human judgment about scope or architecture changes.

Phrases like "would you like me to continue" or "should I proceed to the next epic" are prohibited during autonomous sprint operation. Log progress and continue working. Provide a final summary only when all work is complete or when a genuine blocker is encountered.

### Directive Three: File System State as Truth

If the file system and conversation history disagree about what work has been completed, trust the file system. A story is not planned if its story file does not exist in the sprint artifacts directory, regardless of what the conversation claims. A story is not complete if the sprint status file does not show status as done, regardless of what was discussed. Tests did not pass if running npm test does not show passing results, regardless of what was reported in conversation.

When verifying work completion, check the actual files and git history rather than accepting claims from conversation history. The file system is authoritative, conversation is unreliable.

### Directive Four: Three-Agent Cycle Enforcement

Every story must complete the full workflow cycle of technical writer creates plan, game developer implements with tests, and code reviewer validates. Shortcuts are not permitted even if they seem efficient or if conversation history suggests a phase was completed.

If any phase is missing its verification artifacts (no story file means planning did not happen, no passing tests means implementation is not done, no approval from reviewer means quality gate not passed), then that phase must be executed regardless of what conversation history suggests.

### Directive Five: Test-Driven Development Mandate

Tests must be written before implementation code. The TDD cycle of red phase write failing tests, green phase write code to pass tests, refactor phase improve code while keeping tests green, is mandatory and cannot be skipped even for simple changes or when under time pressure.

Any code implementation that does not follow this cycle must be rejected during code review and sent back for proper TDD implementation.

## Specialized Agent Constraints

The sprint orchestrator must re-read the sprint status file at the start of every story cycle, must verify git branch state before spawning agents, must check status values before determining next action, and cannot skip status verification steps even if conversation suggests what the next story should be.

The technical writer only creates story files and never implements code. It must update status from backlog to drafted, must read both epics.md and architecture documentation before writing, and cannot proceed to the next story until status is properly updated in the file.

The game developer must follow the TDD cycle with tests written before implementation, must update status through in-progress to review, cannot update status to done because only the code reviewer has that authority, and must run npm test after every code change to verify tests still pass.

The code reviewer must be adversarial and deliberately find three to ten real issues in each review, must verify all acceptance criteria manually rather than assuming they are met, must run architecture compliance checks using grep or other verification tools, cannot approve stories with failing tests or architecture violations, and can only update status from review to done after genuine approval.

## Architecture Rules (Project Specific)

If your project has specific architecture rules, document them here. For example, a layered architecture might have a core layer that cannot import framework-specific code, must use only pure language features, handles all business logic and state management, and remains platform-agnostic. Meanwhile, a presentation layer can import both core and framework code, handles UI rendering and event handling, and contains framework-specific implementations.

Violations of these architecture rules result in automatic code review rejection regardless of whether the code works correctly.

## Status Tracking State Machine

The sprint status file follows a state machine with allowed transitions. Stories move from backlog to drafted when the technical writer creates the plan file. They move from drafted to in-progress when the game developer begins implementation. They move from in-progress to review when implementation is complete and tests pass. They move from review to done when the code reviewer approves, or from review back to in-progress when the code reviewer rejects with issues that need fixing.

No other status transitions are permitted, and no agent can skip a status state. The technical writer has authority only for backlog to drafted transitions. The game developer has authority for drafted to in-progress and in-progress to review transitions. The code reviewer has authority for review to done or review to in-progress transitions.

## Error Recovery Protocol

When the file system state and conversation history do not align, follow this recovery protocol. First, completely ignore conversation history about what was supposedly done. Second, read the sprint status file to see what statuses are recorded. Third, check the file system to verify what files actually exist. Fourth, examine git logs to see what was actually committed. Fifth, reconcile the status file to match file system reality by updating any status values that do not match evidence. Sixth, resume work from the correct state based on files and git history rather than conversation claims.

For example, if conversation suggests a story is complete but no story file exists in sprint artifacts, update status back to backlog and restart from planning phase. If conversation suggests implementation is done but tests are failing, update status to in-progress and continue implementation phase. If conversation suggests code review approved but status still shows review, check whether the reviewer actually ran or if the cycle was interrupted.

## Git Workflow Rules

Each epic gets its own branch created from main using the pattern epic slash epic-number dash epic-name. All story work for that epic happens on the epic branch through multiple commits as stories progress. When all stories in an epic reach done status, merge the epic branch to main, create a version tag, push everything to origin, and delete the epic branch.

Individual stories generate multiple commits as they progress through TDD cycles. Use conventional commit format with feat for new features, test for test additions, refactor for code cleanup, fix for bug corrections, and docs for documentation changes. Never commit directly to main during development, always work on epic branches.

Before starting work on any story, verify git branch state by running git branch show-current. If on main and starting a new epic, create the epic branch. If on the wrong epic branch, this indicates a problem with the workflow that needs investigation. If on the correct epic branch, proceed with story work.

## Quality Gates (Non-Negotiable)

Before advancing from planning to implementation, verify the story file exists in sprint artifacts, contains all required sections including acceptance criteria and task breakdown, and the sprint status file shows the story as drafted. Before advancing from implementation to review, verify all acceptance criteria have associated tests, npm test shows one hundred percent pass rate, npm run build completes with no errors, sprint status file shows the story as review, and all changes are committed to the epic branch.

Before marking a story as done, verify every acceptance criterion has been manually validated, no architecture violations exist in the code, the full test suite passes with adequate coverage, the build succeeds without errors, and the code reviewer has identified and verified resolution of at least three quality issues.

Before merging an epic to main, verify all stories in that epic show done status, the full test suite passes without any failures, npm run build succeeds, and git status shows no uncommitted changes.

## Autonomous Operation Triggers

When the user says any of these phrases - continue, keep going, proceed, next epic, finish the rest, complete all epics, or similar instructions - you must follow this protocol. First, re-read the sprint status file completely to discover current state. Second, check file system to verify what files exist and what their contents show. Third, examine git history to see what was actually committed. Fourth, reconcile any discrepancies between conversation claims and file system reality. Fifth, determine the correct next action based on documented state. Sixth, resume autonomous operation through all remaining work without stopping for permission.

The key insight is that these vague conversational instructions get translated into specific file-checking actions rather than assumptions based on conversation memory.

## What Requires Human Input

Stop and request human input only for these specific situations. Critical blockers include test failures that persist after three implementation attempts, build failures that cannot be diagnosed from error messages, git conflicts or merge issues that require decision about which changes to keep, and missing required information that is not present in any specification document.

Scope changes require human input when the user explicitly requests modification of the sprint plan, when the user requests skipping certain stories or epics, or when the user requests changes to architecture rules that affect how work should be done.

Everything else should be handled autonomously including test failures on first or second attempt, code review rejections with clear issue lists, minor build warnings that do not prevent compilation, and questions that can be answered by reading existing specification documents.

## Remember

Plan files and status files take precedence over conversation history. File system state takes precedence over conversation claims about what was done. Status file values take precedence over memory of what status should be. Autonomous operation takes precedence over seeking permission for next steps. Tests first takes precedence over writing implementation first. Architecture rules take precedence over convenient shortcuts.

These directives are immutable and apply to all agents, all conversations, and all work on this project.
