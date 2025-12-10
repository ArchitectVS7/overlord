---
name: three-agent-story-cycle
description: Codifies the sprint-tech-writer → sprint-game-dev → sprint-code-reviewer workflow pattern for story implementation with quality gates and error handling.
---

# Three-Agent Story Cycle Workflow

This skill defines the structured workflow pattern for implementing stories using three specialized agents with built-in quality gates and error recovery mechanisms.

## Workflow Overview

Every story follows this exact sequence where each phase has verification requirements that must be met before progression to the next phase.

The workflow starts with a story input from epics.md. First comes the planning phase where the sprint tech writer agent receives a story ID and creates a detailed task plan file. The quality gate here verifies the story file exists before allowing progression. Next comes the implementation phase where the sprint game dev agent receives the story file and implements using Test-Driven Development with tests written before code. The quality gate here requires all tests passing before allowing progression. Finally comes the review phase where the code reviewer agent validates acceptance criteria and performs adversarial quality checks. The quality gate here requires genuine approval with three to ten issues identified and resolved before marking the story as complete.

## Phase One: Planning (sprint tech writer)

The objective of this phase is to transform a story slug into an actionable implementation plan. The sprint tech writer agent receives a story ID like eleven dash one and a story key like the full eleven-dash-one-dash-mouse-and-keyboard-input-support string. The agent reads the story from epics.md, reads relevant architecture context, creates a detailed task breakdown, identifies files to create or modify, specifies test requirements, and documents acceptance criteria with verification steps.

The output is a story file created at sprint-artifacts/story-{id}.md and a status update changing the story from backlog to drafted state. The quality gate verifies several things before allowing the story to proceed. The story file must exist in the sprint artifacts directory. The file must contain all required sections including acceptance criteria, task breakdown, and definition of done. The task breakdown must be actionable with specific files and clear steps identified. Test requirements must be specified for each task. The sprint status file must be correctly updated showing the story in drafted state.

If the story is not found in epics.md, the agent must escalate to the orchestrator. If the architecture context is unclear, the agent must request clarification. If file creation fails, the agent retries once and then escalates if it fails again.

## Phase Two: Implementation (sprint game dev)

The objective of this phase is to implement the story using Test-Driven Development methodology. The sprint game dev agent receives the story file path, the story key for status updates, and optionally a list of issues to fix if this is a revision after code review rejection. The agent reads the story file completely, updates status from drafted to in-progress, and then for each task in the story follows the TDD cycle.

The TDD cycle has three mandatory phases that cannot be skipped. The RED phase requires writing failing tests first. The agent creates test files, writes unit tests for all acceptance criteria, runs npm test to verify the tests fail showing red status, and commits these failing tests. The agent does not write any implementation code during the RED phase.

The GREEN phase requires writing minimal implementation to pass tests. The agent writes just enough code to make the tests pass, focuses on correctness rather than elegance, runs npm test to verify tests now pass showing green status, and commits the working implementation. The agent does not refactor during the GREEN phase.

The REFACTOR phase requires improving code quality while keeping tests passing. The agent cleans up the implementation, removes duplication, improves naming, adds comments for complex logic, runs npm test after each change to ensure tests stay green, and commits the refactored code. The agent continues refactoring until the code is production-ready.

After completing all tasks, the agent verifies all acceptance criteria have associated tests, updates the status from in-progress to review, and commits all changes to the epic branch. The quality gate before allowing progression requires all tasks in the story file to be completed, all acceptance criteria to have tests written, npm test to show one hundred percent pass rate with no failures, npm run build to succeed with no TypeScript or compilation errors, no architecture violations to exist in the code, all changes to be committed to the git epic branch, and the sprint status file to correctly show review status.

If tests fail after three implementation attempts, the story returns to planning phase because the task breakdown may need revision. If architecture violations are detected, the agent must redesign the approach and retry. If build failures occur, the agent investigates TypeScript errors, fixes them, and retries. The maximum number of full implementation attempts before escalation is three.

## Phase Three: Review (Code Reviewer)

The objective of this phase is adversarial quality validation to ensure the story meets all standards. The code reviewer agent receives the story file path and the story key for status updates. The agent reads the story file to understand acceptance criteria, reviews all code changes for this story, runs the full test suite, checks architecture compliance, performs an adversarial code review deliberately looking for three to ten real issues, and makes an approval decision.

The review process has five mandatory steps. First comes acceptance criteria verification where the reviewer reads each criterion, identifies code that should fulfill it, tests manually or verifies automated tests exist, and marks each as verified or failed. If any criterion fails, the story is automatically rejected.

Second comes architecture compliance checking where the reviewer verifies project-specific architecture rules are followed. For example, checking that core layers do not import framework code, business logic resides in the correct layer, proper separation of concerns is maintained, and error handling follows project patterns. Any architecture violation results in automatic rejection.

Third comes test quality assessment where the reviewer runs npm test to verify all tests pass, checks coverage if available to ensure it meets the threshold, verifies new tests exist for new code, and confirms no tests are skipped. The reviewer examines tests to ensure they actually assert meaningful conditions rather than being empty placeholders.

Fourth comes adversarial code review where the reviewer deliberately looks for three to ten real issues. The reviewer is not trying to be supportive or encouraging. The goal is to find genuine problems before they become technical debt. The reviewer looks for type safety issues like use of any type or missing null checks, logic issues like unhandled edge cases or magic numbers, architecture violations like business logic in presentation layers, test issues like tests that do not assert anything, code style issues like inconsistent naming or missing comments, and performance issues like expensive operations in loops or memory leaks.

Fifth comes build verification where the reviewer runs npm run build and confirms it succeeds with zero errors. Warnings are acceptable but should be noted in the review report.

The review decision matrix determines what happens next based on what was found. If any acceptance criteria failed, the story is rejected and returned to in-progress status. If any architecture violations were found, the story is rejected. If tests are failing, the story is rejected. If the build is failing, the story is rejected. If fewer than three issues were found, the review is considered not thorough enough and the story is rejected because the reviewer needs to look harder. If three to ten issues were found and they are all minor issues that have been addressed, the story can be approved. If more than ten critical issues were found, the story is rejected. If the story is perfect which is rare, it can be approved.

The output is either a rejection with a detailed issue list organized into critical issues that must be fixed, major issues that must be fixed, and minor issues that should be fixed or justified, or an approval with status updated from review to done.

The quality gate for approval requires all acceptance criteria to be verified with checkmarks, no architecture violations to exist, all tests to be passing at one hundred percent, coverage to meet the project threshold, the build to succeed, and three to ten quality issues to have been identified and verified as resolved.

If this is the first review, the reviewer finds issues, provides detailed feedback, and returns the story to the developer. If this is the second review, the reviewer verifies the fixes and may find additional issues but should approve if all critical items are addressed. If this is the third review and critical issues still exist, the reviewer escalates to the orchestrator for human review. The maximum number of rejection cycles per story is two.

## Workflow Orchestration

The orchestrator coordinates these three phases by first verifying prerequisites such as the epic branch existing and the status file being current, then calling the three-agent workflow for each story, waiting for completion or escalation, verifying post-conditions such as status being done and tests passing, and either continuing to the next story or completing the epic.

The pseudo-code representation of this orchestration shows the story ID being received, the sprint tech writer being spawned with story ID and story key passed as variables, quality gate one being verified, the sprint game dev being spawned with story file and story key passed as variables with a maximum of three attempts allowed, quality gate two being verified after each attempt with a break if successful or escalation if all attempts fail, the code reviewer being spawned with story file and story key passed as variables with a maximum of two review cycles allowed, a check whether the result is approved leading to success or rejected leading to re-spawning the sprint game dev with the issues list, and either success being returned or escalation happening if maximum cycles are exceeded.

## Error Recovery

The system has defined recovery protocols for common error scenarios. When a story file is missing after the planning phase, the system detects this in the implementation phase, verifies the sprint status incorrectly shows drafted, fixes the status back to backlog, and re-runs the planning phase. When tests are failing in the implementation phase, the developer agent analyzes the failures, attempts to fix the code, and re-runs tests with a maximum of three attempts before escalating.

When an architecture violation is found in the review phase, automatic rejection occurs, the story returns to the implementation phase, and the developer redesigns the approach. When a review rejection happens after two cycles, detailed issue reports are logged and escalation to the orchestrator for human review occurs.

When the status file is out of sync with reality such as status saying done but tests are failing, the system reads the filesystem and git logs as the source of truth, resets status to match reality, and resumes from the correct phase.

## Integration with Orchestrator

When the orchestrator calls this workflow, it provides a story ID as input, executes the three-agent cycle as the process, and expects the story to be marked done in sprint status as the output. Side effects include the story file being created in sprint artifacts, code being implemented in the source directory, tests being added in the tests directory, and commits being made on the epic branch.

The orchestrator should verify prerequisites before calling this workflow, call the workflow for the story, wait for completion which could be success or escalation, verify post-conditions such as status being done and tests passing, and then continue to the next story or complete the epic.

## Success Metrics

A story successfully completes the cycle when the story file exists and is complete with all sections, all acceptance criteria are verified with evidence, all tests are passing with no failures, code is committed to git with proper commit messages, status is marked done in the sprint status file, no architectural violations exist in the implementation, and quality standards are met with code review approval documented.

## Failure Metrics

A story requires escalation when implementation fails three times with persistent test failures, review rejects two times with unresolved critical issues, a critical blocker prevents progress such as missing specification information, an architecture violation cannot be resolved within the constraints, or test failures persist after multiple fix attempts.

## Usage Example

Consider story eleven dash one in backlog status. The orchestrator detects this and calls the workflow with story ID eleven-one. The workflow spawns the sprint tech writer agent which creates sprint-artifacts/story-11-1.md and updates status from backlog to drafted. Quality gate one passes because the file exists. The workflow spawns the sprint game dev agent which implements InputSystem with TDD including tests first then code, updates status from in-progress to review, and commits everything. Quality gate two passes because tests pass and build succeeds.

The workflow spawns the code reviewer agent which finds five issues including naming problems, null checks missing, and test coverage gaps. The reviewer rejects with the issue list and status updates from review to in-progress. The workflow re-spawns the sprint game dev agent which addresses all five issues, re-runs tests to verify all pass, and updates status from in-progress to review. The workflow re-spawns the code reviewer agent which verifies all issues are fixed, checks acceptance criteria with all verified, and approves. Status updates from review to done.

The story is complete and the orchestrator moves to the next story in the epic.

## Key Principles

The workflow operates on several fundamental principles. It is stateless, meaning each phase starts by reading current state from files rather than remembering previous conversations. Quality gates are enforced, meaning no phase proceeds without passing its verification requirements. Error recovery is built in with retry logic and escalation paths defined. Separation of concerns is maintained with each agent having exactly one responsibility. Verification is prioritized by trusting files and tests over conversation history. The workflow is autonomous, running without human intervention unless genuinely blocked.

This workflow pattern ensures consistent high-quality story implementation while maintaining the architectural integrity of the codebase.
