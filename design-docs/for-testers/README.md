# Tester Documentation

Documentation for QA engineers and alpha testers.

## Getting Started

1. **Alpha testers:** Start with [alpha-tester-guide.md](alpha-tester-guide.md)
2. **QA engineers:** Review [uat-methodology.md](uat-methodology.md)

## Contents

| Document | Description |
|----------|-------------|
| [alpha-tester-guide.md](alpha-tester-guide.md) | Alpha testing onboarding and procedures |
| [uat-methodology.md](uat-methodology.md) | Core mechanics testing scripts |
| [testing-procedures.md](testing-procedures.md) | Detailed testing procedures |

## Test Access

**Live Game:** https://overlord-game.vercel.app (when deployed)

**Local Testing:**
```bash
cd Overlord.Phaser
npm install
npm start
# Open http://localhost:8080
```

## Bug Reporting

When reporting bugs, include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshot or recording if possible

Report issues at: https://github.com/ArchitectVS7/overlord/issues

## Test Coverage Areas

| Area | Priority | Status |
|------|----------|--------|
| Core gameplay loop | High | Tested |
| Flash Conflicts | High | Tested |
| Planet management | High | Tested |
| Combat system | High | Tested |
| AI opponent | Medium | Tested |
| Save/Load | Medium | Blocked (Supabase) |
| Audio | Low | Blocked (assets) |
