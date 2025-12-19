# Chapter 2: Alpha Testing Procedures

This chapter establishes the procedures, workflows, and standards for closed alpha testing of Overlord. It covers tester onboarding, bug reporting, feedback collection, and the criteria for progressing from alpha to beta.

## Table of Contents

1. [Alpha Testing Overview](#alpha-testing-overview)
2. [Tester Onboarding](#tester-onboarding)
3. [Bug Severity Definitions](#bug-severity-definitions)
4. [Bug Reporting Workflow](#bug-reporting-workflow)
5. [Feedback Collection](#feedback-collection)
6. [Alpha Release Criteria](#alpha-release-criteria)
7. [Communication Channels](#communication-channels)

---

## Alpha Testing Overview

### What is Closed Alpha?

Closed alpha testing is a focused testing phase where a limited number of invited testers evaluate the game's core functionality. The goal is to identify bugs, validate game mechanics, and gather early feedback before broader testing.

During closed alpha, testers should expect:
- Incomplete features and placeholder content
- Missing art assets and sound effects
- Rough edges in user interface
- Potential crashes or data loss

### Alpha Testing Goals

The closed alpha phase has specific objectives that guide testing priorities:

1. **Validate Core Mechanics**: Ensure resource systems, combat, and AI function correctly
2. **Identify Critical Bugs**: Find game-breaking issues before wider release
3. **Assess Game Balance**: Determine if default values create engaging gameplay
4. **Evaluate User Experience**: Identify confusion points in interface and flow
5. **Stress Test Infrastructure**: Verify save/load, authentication, and cloud sync

### Testing Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Week 1-2 | Core Systems | Resource, Combat, AI validation |
| Week 3-4 | Integration | Full game flow, save/load |
| Week 5-6 | Polish Feedback | Balance, UX, quality of life |

---

## Tester Onboarding

### Tester Requirements

Alpha testers should have:
- Modern web browser (Chrome 90+ or Firefox 88+)
- Screen resolution of 1920×1080 or higher
- Reliable internet connection for cloud features
- Familiarity with strategy games (helpful but not required)
- Willingness to document issues thoroughly

### Getting Started

**Step 1: Account Setup**

1. Visit the alpha testing URL provided in your invitation
2. Create an account using your email address
3. Verify your email through the confirmation link
4. Sign in to begin testing

**Step 2: Review Documentation**

Before testing, read these documents:
- How to Play: basics.json content (in-game or documentation)
- UAT Methodology (Chapter 1) for structured test procedures
- This document for reporting procedures

**Step 3: Initial Playthrough**

Complete one full game (victory or defeat) before filing detailed bug reports. This gives you context for how systems should work together.

### Test Account Guidelines

- Use your assigned test account for all testing
- Do not share account credentials
- Create multiple saves to preserve interesting game states
- Clear local storage between test sessions if requested

---

## Bug Severity Definitions

Bugs are classified by their impact on the player experience. Use these definitions when filing reports:

### Critical

**Definition:** Game-breaking issues that prevent play or cause data loss.

**Examples:**
- Game crashes and won't restart
- Save file corruption that loses progress
- Authentication fails, cannot sign in
- Infinite loop freezes browser
- Cannot complete core gameplay loop (start → play → end)

**Response:** Development stops other work to fix immediately.

### Major

**Definition:** Significant features broken or behaving incorrectly.

**Examples:**
- Combat calculations produce wrong results
- AI opponent never takes actions
- Resource income not applied to stockpile
- Buildings don't complete construction
- Platoons can't be loaded onto spacecraft

**Response:** Prioritized for fix in current sprint.

### Minor

**Definition:** Noticeable issues that don't prevent gameplay.

**Examples:**
- UI element positioned incorrectly
- Text truncated or overlapping
- Sound effect missing or wrong
- Tooltip shows incorrect information
- Animation glitches

**Response:** Tracked for fix in upcoming sprint.

### Cosmetic

**Definition:** Visual or polish issues with no gameplay impact.

**Examples:**
- Color slightly off from design
- Font inconsistent in one area
- Spacing uneven between elements
- Placeholder text visible

**Response:** Added to backlog, fixed as time permits.

---

## Bug Reporting Workflow

### Where to Report

All bug reports should be submitted through GitHub Issues:
- Repository: `[Your GitHub repo URL]`
- Label: Apply `bug` and severity label

### Bug Report Template

Use this template for all bug reports:

```markdown
## Bug Summary
[One sentence describing the issue]

## Severity
- [ ] Critical
- [ ] Major
- [ ] Minor
- [ ] Cosmetic

## Environment
- Browser: [e.g., Chrome 120.0.6099.109]
- OS: [e.g., Windows 11]
- Screen Resolution: [e.g., 1920×1080]
- Game Version: [commit hash or build number]
- Account: [test account email]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [Bug occurs]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Frequency
- [ ] Always (100%)
- [ ] Often (50-99%)
- [ ] Sometimes (10-49%)
- [ ] Rarely (<10%)

## Screenshots/Video
[Attach screenshots or video link]

## Console Errors
[Open browser developer tools (F12), check Console tab, paste any red errors]

## Additional Context
[Any other relevant information]
```

### Reporting Best Practices

**Do:**
- Include specific steps to reproduce
- Attach screenshots whenever possible
- Check if issue already reported before filing
- Use descriptive titles ("Combat casualties not calculated correctly" not "Combat broken")
- Test on latest version before reporting

**Don't:**
- Combine multiple bugs in one report
- Report intended behavior as bugs (check documentation first)
- Include personal information beyond test account
- File reports for features not yet implemented

### Bug Lifecycle

1. **New**: Tester files report
2. **Triaged**: Team reviews, assigns severity and priority
3. **In Progress**: Developer working on fix
4. **Fixed**: Fix merged to main branch
5. **Verified**: Tester confirms fix works
6. **Closed**: Issue resolved

---

## Feedback Collection

Beyond bug reports, testers provide valuable feedback on game design, balance, and experience.

### Types of Feedback

**Balance Feedback:**
- "Mining Stations feel too expensive for their output"
- "AI on Easy difficulty is still too aggressive"
- "Platoon training takes too long, military response is slow"

**UX Feedback:**
- "I couldn't figure out how to load platoons onto ships"
- "The resource display is hard to read"
- "I didn't know my turn had ended"

**Feature Requests:**
- "It would be helpful to see enemy fleet strength"
- "I wish I could set waypoints for spacecraft"
- "An undo button would help when I misclick"

### Feedback Submission

Submit feedback through GitHub Issues with label `feedback`:

```markdown
## Feedback Type
- [ ] Balance
- [ ] User Experience
- [ ] Feature Request
- [ ] General

## Description
[Detailed description of your feedback]

## Context
[What were you doing when this feedback occurred to you?]

## Suggestion
[If you have ideas for improvement, share them]
```

### Feedback vs Bugs

| Submit As Bug If... | Submit As Feedback If... |
|---------------------|--------------------------|
| Something doesn't work | Something works but feels wrong |
| Behavior contradicts documentation | You disagree with documented behavior |
| Game crashes or errors | Game runs but isn't fun |
| Data is lost or corrupted | You wish data was presented differently |

---

## Alpha Release Criteria

### Entry Criteria (Start Alpha)

Before opening alpha testing:

- [ ] Core gameplay loop functional (start → play → victory/defeat)
- [ ] All 18 core systems implemented and tested
- [ ] Save/Load system operational
- [ ] Authentication functional
- [ ] Basic UI for all game actions
- [ ] At least one complete scenario playable
- [ ] Automated tests passing (70%+ coverage)

### Exit Criteria (End Alpha)

Alpha testing concludes when:

- [ ] All Critical bugs resolved
- [ ] 90%+ of Major bugs resolved
- [ ] UAT test suite passes completely
- [ ] AI opponents functional on all difficulty levels
- [ ] Cloud save sync reliable
- [ ] Performance meets targets (60 FPS, <5s load)
- [ ] Balance feedback incorporated (first pass)

### Alpha Milestone Checklist

**Week 2 Checkpoint:**
- [ ] All testers successfully onboarded
- [ ] UAT-RESOURCE tests complete
- [ ] No Critical bugs outstanding

**Week 4 Checkpoint:**
- [ ] UAT-COMBAT tests complete
- [ ] UAT-AI tests complete
- [ ] No Critical bugs outstanding
- [ ] Major bugs reduced by 50%

**Week 6 Checkpoint:**
- [ ] UAT-SAVE tests complete
- [ ] Full game playthrough validated
- [ ] Balance feedback documented
- [ ] Ready for beta assessment

---

## Communication Channels

### Primary Channel: GitHub

All official bug reports and feedback go through GitHub Issues. This creates a permanent, searchable record of all testing activity.

### Discussion: Discord (if available)

For real-time discussion among testers:
- `#alpha-general`: General testing discussion
- `#alpha-bugs`: Quick bug discussion before filing
- `#alpha-feedback`: Casual feedback sharing
- `#alpha-help`: Questions about testing process

### Updates: Email or Announcements

Development team communicates:
- New builds available for testing
- Known issues and workarounds
- Testing focus for current week
- Alpha milestone progress

### Response Expectations

| Channel | Expected Response Time |
|---------|------------------------|
| Critical Bug Report | Within 24 hours |
| Major Bug Report | Within 3 days |
| Minor Bug Report | Within 1 week |
| Feedback | Acknowledged within 1 week |
| Discord Question | Best effort, not guaranteed |

---

## Quick Reference

### Severity Guide

| Severity | Can't Play? | Workaround? | Priority |
|----------|-------------|-------------|----------|
| Critical | Yes | No | Immediate |
| Major | Partial | Maybe | This sprint |
| Minor | No | Yes | Next sprint |
| Cosmetic | No | N/A | Backlog |

### Report Checklist

Before submitting:
- [ ] Reproduced on latest version
- [ ] Checked for existing report
- [ ] Included steps to reproduce
- [ ] Attached screenshot/video
- [ ] Applied correct labels

### Tester Responsibilities

1. Complete UAT test scripts
2. Report all bugs found
3. Provide balance/UX feedback
4. Test new builds promptly
5. Verify bug fixes when requested

---

*Last updated: December 2024*
*Applies to: Overlord Closed Alpha*
