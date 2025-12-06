# Critical Path Analysis

**Version:** 1.0
**Last Updated:** December 6, 2025
**Status:** Draft
**Project:** Overlord v1.0
**Project Duration:** 41 weeks (21 sprints × 2 weeks)
**Critical Path Length:** 41 weeks

---

## Overview

This document provides a Program Evaluation and Review Technique (PERT) / Critical Path Method (CPM) analysis for the Overlord v1.0 project. The critical path identifies the sequence of tasks that determines the minimum project duration.

**Key Findings:**
- **Critical Path Length:** 41 weeks (longest path through the network)
- **Total Float/Slack:** Limited (most sprints on critical path)
- **Risk Areas:** Phases 1-6 are sequential dependencies (no parallelization possible with single developer)

---

## Critical Path Identification

### Critical Path (Zero Slack)

The following sprints form the critical path and CANNOT be delayed without extending the project:

```
Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 5 → Sprint 6 → Sprint 7 →
Sprint 8 → Sprint 9 → Sprint 10 → Sprint 11 → Sprint 12 → Sprint 13 →
Sprint 19 → Sprint 20 → Sprint 21
```

**Critical Path Tasks:**
1. **Sprint 1** (Weeks 1-2): Foundation - Unity 6000 LTS, dual-library architecture
2. **Sprint 2** (Weeks 3-4): Turn system, save/load
3. **Sprint 3** (Weeks 5-5): Settings, input, galaxy view
4. **Sprint 4** (Weeks 6-7): Galaxy generation, planets
5. **Sprint 5** (Weeks 8-9): Resource economy
6. **Sprint 6** (Weeks 10-11): Entity management, craft
7. **Sprint 7** (Weeks 12-13): Platoons, buildings
8. **Sprint 8** (Weeks 14-15): Combat resolution
9. **Sprint 9** (Weeks 16-17): Bombardment, invasion
10. **Sprint 10** (Weeks 18-19): AI decision-making
11. **Sprint 11** (Weeks 20-21): UI state machine, HUD
12. **Sprint 12** (Weeks 22-23): Planet management UI, notifications
13. **Sprint 13** (Weeks 24-25): Tutorial system
14. **Sprint 19** (Weeks 36-37): Comprehensive testing
15. **Sprint 20** (Weeks 38-39): Balance tuning, playtesting
16. **Sprint 21** (Weeks 40-41): Release preparation

**Total Critical Path Duration:** 32 weeks (16 sprints × 2 weeks)

### Non-Critical Path (Slack Available)

The following sprints have **slack** and can be reordered or delayed without affecting project completion:

| Sprint | Weeks | Description | Total Float | Free Float |
|--------|-------|-------------|-------------|------------|
| Sprint 14 | 26-27 | Audio system | 10 weeks | 2 weeks |
| Sprint 15 | 28-29 | Visual effects | 8 weeks | 2 weeks |
| Sprint 16 | 30-31 | PC platform | 6 weeks | 2 weeks |
| Sprint 17 | 32-33 | Mobile platform | 4 weeks | 2 weeks |
| Sprint 18 | 34-35 | Steam integration | 2 weeks | 2 weeks |

**Explanation:**
- **Total Float:** Maximum delay without affecting project end date
- **Free Float:** Maximum delay without affecting successor tasks

**Note:** While Sprints 14-18 have slack, they should still be completed before Sprint 19 (testing) for best quality.

---

## PERT/CPM Network Diagram

```
                                          CRITICAL PATH
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [S1]──→[S2]──→[S3]──→[S4]──→[S5]──→[S6]──→[S7]──→[S8]──→[S9]──→[S10]      │
│  2wk    2wk    2wk    2wk    2wk    2wk    2wk    2wk    2wk    2wk        │
│                                                                              │
│  [S10]──→[S11]──→[S12]──→[S13]──────────────→[S19]──→[S20]──→[S21]         │
│  2wk     2wk     2wk     2wk       10 weeks   2wk     2wk     2wk          │
│                                    (gap for                                  │
│                                   non-critical                               │
│                                    sprints)                                  │
└──────────────────────────────────────────────────────────────────────────────┘

                               NON-CRITICAL PATH (WITH SLACK)
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                [S13]──→[S14]──→[S15]──→[S16]──→[S17]──→[S18]──→[S19]        │
│                 │      2wk     2wk     2wk     2wk     2wk      │           │
│                 │     (Audio) (VFX)   (PC)  (Mobile) (Steam)   │           │
│                 │                                                │           │
│                 └────────────────────(10 weeks slack)───────────┘           │
│                                                                              │
│  Float: S14 can start anytime between Week 14 and Week 26 without delay     │
│         S15 can start anytime between Week 16 and Week 28 without delay     │
│         S16 can start anytime between Week 18 and Week 30 without delay     │
│         S17 can start anytime between Week 20 and Week 32 without delay     │
│         S18 can start anytime between Week 22 and Week 34 without delay     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Gantt Chart (ASCII)

```
Sprint    1   5   10  15  20  25  30  35  40  41
          |   |   |   |   |   |   |   |   |   |
S1        [██]                                     (Foundation)
S2            [██]                                 (Turn, Save)
S3                [█]                              (Settings, Input, Galaxy)
S4                  [██]                           (Galaxy Gen, Planets)
S5                      [██]                       (Economy)
S6                          [██]                   (Entity, Craft)
S7                              [██]               (Platoons, Buildings)
S8                                  [██]           (Combat)
S9                                      [██]       (Bombardment, Invasion)
S10                                         [██]   (AI)
S11                                             [██] (UI State, HUD)
S12                                                 [██] (Planet UI, Notif)
S13                                                     [██] (Tutorial)
S14                             [??].......[██]          (Audio) - FLOAT
S15                                 [??].......[██]      (VFX) - FLOAT
S16                                     [??].......[██]  (PC Platform) - FLOAT
S17                                         [??].......[██] (Mobile) - FLOAT
S18                                             [??].......[██] (Steam) - FLOAT
S19                                                             [██] (Testing)
S20                                                                 [██] (Balance)
S21                                                                     [██] (Release)

Legend:
[██] = Scheduled sprint (critical path)
[??] = Earliest possible start (with float)
.... = Float/slack period
```

---

## Early Start / Early Finish Times

| Sprint | Task | Duration | Early Start | Early Finish | Predecessors |
|--------|------|----------|-------------|--------------|--------------|
| S1 | Foundation | 2 weeks | Week 1 | Week 2 | None |
| S2 | Turn, Save | 2 weeks | Week 3 | Week 4 | S1 |
| S3 | Settings, Input, Galaxy | 1 week | Week 5 | Week 5 | S2 |
| S4 | Galaxy Gen, Planets | 2 weeks | Week 6 | Week 7 | S3 |
| S5 | Economy | 2 weeks | Week 8 | Week 9 | S4 |
| S6 | Entity, Craft | 2 weeks | Week 10 | Week 11 | S5 |
| S7 | Platoons, Buildings | 2 weeks | Week 12 | Week 13 | S6 |
| S8 | Combat Resolution | 2 weeks | Week 14 | Week 15 | S7 |
| S9 | Bombardment, Invasion | 2 weeks | Week 16 | Week 17 | S8 |
| S10 | AI | 2 weeks | Week 18 | Week 19 | S9 |
| S11 | UI State, HUD | 2 weeks | Week 20 | Week 21 | S10 |
| S12 | Planet UI, Notifications | 2 weeks | Week 22 | Week 23 | S11 |
| S13 | Tutorial | 2 weeks | Week 24 | Week 25 | S12 |
| **S14** | **Audio (FLOAT)** | 2 weeks | **Week 14** | **Week 15** | S7 (earliest) |
| **S15** | **VFX (FLOAT)** | 2 weeks | **Week 16** | **Week 17** | S8 (earliest) |
| **S16** | **PC Platform (FLOAT)** | 2 weeks | **Week 18** | **Week 19** | S9 (earliest) |
| **S17** | **Mobile (FLOAT)** | 2 weeks | **Week 20** | **Week 21** | S10 (earliest) |
| **S18** | **Steam (FLOAT)** | 2 weeks | **Week 22** | **Week 23** | S11 (earliest) |
| S19 | Testing | 2 weeks | Week 36 | Week 37 | S13, S14-S18 |
| S20 | Balance, Playtest | 2 weeks | Week 38 | Week 39 | S19 |
| S21 | Release Prep | 2 weeks | Week 40 | Week 41 | S20 |

---

## Late Start / Late Finish Times

| Sprint | Task | Late Start | Late Finish | Total Float |
|--------|------|------------|-------------|-------------|
| S1 | Foundation | Week 1 | Week 2 | **0 weeks** |
| S2 | Turn, Save | Week 3 | Week 4 | **0 weeks** |
| S3 | Settings, Input, Galaxy | Week 5 | Week 5 | **0 weeks** |
| S4 | Galaxy Gen, Planets | Week 6 | Week 7 | **0 weeks** |
| S5 | Economy | Week 8 | Week 9 | **0 weeks** |
| S6 | Entity, Craft | Week 10 | Week 11 | **0 weeks** |
| S7 | Platoons, Buildings | Week 12 | Week 13 | **0 weeks** |
| S8 | Combat Resolution | Week 14 | Week 15 | **0 weeks** |
| S9 | Bombardment, Invasion | Week 16 | Week 17 | **0 weeks** |
| S10 | AI | Week 18 | Week 19 | **0 weeks** |
| S11 | UI State, HUD | Week 20 | Week 21 | **0 weeks** |
| S12 | Planet UI, Notifications | Week 22 | Week 23 | **0 weeks** |
| S13 | Tutorial | Week 24 | Week 25 | **0 weeks** |
| **S14** | **Audio (FLOAT)** | **Week 26** | **Week 27** | **10 weeks** |
| **S15** | **VFX (FLOAT)** | **Week 28** | **Week 29** | **8 weeks** |
| **S16** | **PC Platform (FLOAT)** | **Week 30** | **Week 31** | **6 weeks** |
| **S17** | **Mobile (FLOAT)** | **Week 32** | **Week 33** | **4 weeks** |
| **S18** | **Steam (FLOAT)** | **Week 34** | **Week 35** | **2 weeks** |
| S19 | Testing | Week 36 | Week 37 | **0 weeks** |
| S20 | Balance, Playtest | Week 38 | Week 39 | **0 weeks** |
| S21 | Release Prep | Week 40 | Week 41 | **0 weeks** |

**Total Float Formula:** `Late Start - Early Start` OR `Late Finish - Early Finish`

---

## Critical Path Analysis Summary

### Critical Sprints (Zero Slack)
- **Count:** 16 sprints (76% of project)
- **Duration:** 32 weeks (78% of timeline)
- **Risk:** HIGH - Any delay to critical path sprints extends project completion

**Critical Sprints List:**
1. Sprint 1-13 (all core gameplay and UI features)
2. Sprint 19-21 (testing, balance, release)

### Non-Critical Sprints (Slack Available)
- **Count:** 5 sprints (24% of project)
- **Duration:** 10 weeks (22% of timeline)
- **Risk:** LOW - Can be delayed up to total float without affecting project end

**Non-Critical Sprints List:**
1. Sprint 14: Audio (10 weeks float)
2. Sprint 15: VFX (8 weeks float)
3. Sprint 16: PC Platform (6 weeks float)
4. Sprint 17: Mobile (4 weeks float)
5. Sprint 18: Steam (2 weeks float)

---

## Risk Analysis

### High-Risk Areas (Critical Path)

1. **Phase 1 (Sprints 1-3): Foundation**
   - **Risk:** Unity 6000 LTS migration issues, URP learning curve
   - **Impact:** Delays entire project
   - **Mitigation:** Allocate buffer time in Sprint 1, seek Unity support early

2. **Phase 3 (Sprints 6-7): Entities & Buildings**
   - **Risk:** Complex entity management, building construction timers
   - **Impact:** Delays combat and AI development
   - **Mitigation:** Simplify MVP scope, defer advanced features

3. **Phase 5 (Sprint 10): AI Decision-Making**
   - **Risk:** AI too weak/strong, requires extensive tuning
   - **Impact:** Delays UI development
   - **Mitigation:** Use simple heuristics first, refine in Sprint 20 (balance)

4. **Phase 9 (Sprints 19-20): Testing & Balance**
   - **Risk:** Too many bugs discovered, balance requires multiple iterations
   - **Impact:** Delays release
   - **Mitigation:** Continuous testing throughout development, alpha testing in Sprint 18

### Low-Risk Areas (Float Available)

1. **Phase 7 (Sprints 14-15): Audio & VFX**
   - **Risk:** Asset creation time, licensing delays
   - **Impact:** None (10 weeks float)
   - **Mitigation:** Start early if critical path ahead of schedule

2. **Phase 8 (Sprints 16-18): Platform Support**
   - **Risk:** Platform certification delays, build errors
   - **Impact:** Minimal (2-6 weeks float)
   - **Mitigation:** Submit early, use float to address issues

---

## Optimization Recommendations

### Parallel Work (If Team Expands)

If the team grows to **2 developers**, the following work can be parallelized:

**Scenario: Add UI/UX Developer**
- **Developer 1:** Focus on critical path (Sprints 1-13)
- **Developer 2:** Focus on non-critical path (Sprints 14-18 done earlier)

**Effect:**
- Sprints 14-18 complete by Week 25 (instead of Week 35)
- 10 weeks saved (project completes in 31 weeks instead of 41)

### Fast-Tracking (Overlap Sprints)

If certain sprints can overlap with acceptable risk:

**Example:**
- Start Sprint 14 (Audio) during Sprint 8 (Combat)
  - Requires: Audio designer (separate resource)
  - Risk: Low (audio independent of gameplay)
  - Gain: 10 weeks (project completes in 31 weeks)

### Crashing (Add Resources)

To shorten critical path sprints:

**High-Impact Targets:**
- Sprint 10 (AI): 40 hours → Add AI specialist to reduce to 20 hours (1 week saved)
- Sprint 6-7 (Entities & Buildings): 160 hours → Add gameplay engineer (2 weeks saved)

**Cost-Benefit:**
- 3 weeks saved (project completes in 38 weeks)
- Cost: 2 additional developers for specific sprints

---

## Monitoring & Control

### Critical Path Tracking

**Weekly Checkpoints:**
- Compare actual progress vs planned schedule
- Identify variances (ahead/behind schedule)
- Update critical path if dependencies change

**Early Warning Indicators:**
- Sprint velocity below 80 hours/sprint
- Critical bugs accumulating (>10 open critical bugs)
- AFS acceptance criteria not met at sprint end

### Float Consumption

**Track Float Usage:**
- Monitor non-critical sprint starts (should not consume more than total float)
- Alert if float drops below 2 weeks (risk of becoming critical)

**Example:**
- Sprint 14 (Audio) starts Week 20 instead of Week 14
  - Float consumed: 6 weeks
  - Remaining float: 4 weeks (still safe)

---

## Conclusion

The Overlord v1.0 project has a **41-week critical path** with **16 out of 21 sprints on the critical path**. This leaves **limited slack** for most of the project, but Sprints 14-18 (audio, VFX, platform support) have significant float (2-10 weeks) that can absorb delays.

**Key Takeaways:**
1. **Phases 1-6 are sequential** - No parallelization possible with single developer
2. **Phase 7-8 have float** - Can be delayed or reordered without affecting project end
3. **Testing phase (Sprint 19) is the convergence point** - All work must complete before testing
4. **Crashing or fast-tracking can reduce project duration** - If budget allows for additional resources

**Recommendation:** Maintain strict schedule adherence for Sprints 1-13 and Sprint 19-21. Use float in Sprints 14-18 as buffer for unexpected delays elsewhere.

---

**Document Owner:** Lead Developer / Project Manager
**Review Status:** Draft
