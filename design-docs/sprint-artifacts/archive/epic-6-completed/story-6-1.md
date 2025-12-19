# Story 6-1: Initiate Planetary Invasion

**Epic:** 6 - Combat & Planetary Invasion
**Status:** DONE

## Description

As a player, I want to initiate a planetary invasion against enemy planets, so that I can expand my territory and defeat the AI opponent.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | "Invade" button visible on enemy planets | PlanetInfoPanel shows Invade button for AI-owned planets | DONE |
| AC2 | Invasion panel shows target planet info | Name, owner, population display | DONE |
| AC3 | Display available invasion force | Platoon count from cruisers at planet | DONE |
| AC4 | Aggression slider (0-100) | 4 presets: Cautious/Balanced/Aggressive/All-Out | DONE |
| AC5 | Casualty estimate based on aggression | Higher aggression = higher casualties | DONE |
| AC6 | Launch invasion fires callback | onInvade(planet, aggression) callback | DONE |
| AC7 | Disabled when no platoons available | isInvadeEnabled() checks platoon count | DONE |
| AC8 | Panel closes after invasion confirmed | confirmInvasion() calls hide() | DONE |

## Technical Design

### Implementation Files
- `src/scenes/ui/InvasionPanel.ts` - Main panel implementation (495 lines)
- `tests/unit/InvasionPanel.test.ts` - 24 tests

### Key Methods
- `show(planet, cruisers, platoons, onClose)` - Opens with target data
- `hide()` - Closes panel
- `setAggression(value)` - Sets combat aggression level
- `confirmInvasion()` - Validates and fires onInvade callback
- `getTotalPlatoonCount()` - Counts platoons on cruisers
- `getEstimatedCasualties()` - Calculates casualty estimate

### Integration
- Accessible from PlanetInfoPanel "Invade" button on AI-owned planets
- Uses CraftEntity.carriedPlatoonIDs for invasion force calculation
- Aggression passed to InvasionSystem for combat resolution (Story 6-3)

## Test File
`tests/unit/InvasionPanel.test.ts` - 24 tests passing

## Definition of Done
- [x] All acceptance criteria have passing tests
- [x] InvasionPanel.ts implements full functionality
- [x] Panel accessible from planet info panel
- [x] Code review approved
- [x] npm test passes
- [x] npm run build succeeds
