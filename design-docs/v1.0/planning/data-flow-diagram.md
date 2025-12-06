# Data Flow Diagram

**Version:** 1.0
**Last Updated:** December 6, 2025
**Status:** Complete

---

## Overview

This document illustrates how data flows through the Overlord game systems during key operations: Turn Execution, Combat Resolution, Save/Load, and UI Updates.

---

## 1. Turn Execution Flow

```
[Player clicks "End Turn"] (Unity UI)
         │
         ▼
[UIManager validates action] (Unity)
         │
         ▼
[TurnSystem.EndPlayerTurn()] (Overlord.Core)
         │
         ├─→ [Process Player End Phase]
         │   └─→ Update resources consumed
         │
         ├─→ [Execute AI Turn] (AFS-051)
         │   ├─→ AI Income Phase
         │   ├─→ AI Action Phase (build, attack, etc.)
         │   └─→ AI Combat Phase
         │
         ├─→ [Resolve All Combat] (AFS-041)
         │   └─→ CombatSystem.ResolveBattles()
         │
         ├─→ [Update Game State]
         │   ├─→ Increment turn counter
         │   ├─→ Update building construction progress
         │   ├─→ Update resource production
         │   └─→ Check victory conditions
         │
         ├─→ [Auto-Save] (AFS-003)
         │   └─→ SaveSystem.AutoSave()
         │
         └─→ [Fire OnTurnEnded event]
                 │
                 ▼
         [Unity UI updates] (AFS-072)
         ├─→ Refresh HUD (resources, turn number)
         ├─→ Update planet displays
         ├─→ Show notifications
         └─→ Render galaxy map changes
```

---

## 2. Combat Resolution Flow

```
[Player initiates attack] (Unity UI)
         │
         ▼
[CombatSystem.InitiateBattle()] (Overlord.Core)
         │
         ├─→ [Validate Combat Legality]
         │   ├─→ Check craft availability
         │   ├─→ Check target validity
         │   └─→ Verify no diplomatic immunity
         │
         ├─→ [Calculate Combat Strength]
         │   ├─→ Attacker strength = Σ(craft × weaponModifier)
         │   └─→ Defender strength = Σ(craft × weaponModifier) × orbitalDefenseBonus
         │
         ├─→ [Resolve Battle]
         │   ├─→ Strength ratio determines casualties
         │   ├─→ Destroy losing craft
         │   └─→ Calculate experience gained
         │
         ├─→ [Create Battle Result]
         │   └─→ {winner, casualties, survivors, loot}
         │
         ├─→ [Update Game State]
         │   ├─→ Remove destroyed craft
         │   ├─→ Update faction resources
         │   └─→ Check planet ownership transfer
         │
         └─→ [Fire OnCombatResolved event]
                 │
                 ▼
         [Unity displays battle] (AFS-082)
         ├─→ Show 3D battle scene (VFX)
         ├─→ Play combat audio
         ├─→ Display battle report UI
         └─→ Update galaxy map
```

---

## 3. Save/Load Flow

### Save Flow

```
[Player clicks "Save Game"] (Unity UI)
         │
         ▼
[SaveSystem.SaveGame(slotIndex)] (Overlord.Core)
         │
         ├─→ [Collect Game State]
         │   ├─→ GameStateManager.GetState()
         │   ├─→ Capture metadata (turn, timestamp, playtime)
         │   └─→ Generate thumbnail (Unity IRenderer)
         │
         ├─→ [Serialize to JSON]
         │   ├─→ Use System.Text.Json
         │   ├─→ Apply camelCase naming
         │   └─→ Calculate checksum (MD5)
         │
         ├─→ [Compress Data]
         │   └─→ GZip compression
         │
         ├─→ [Write to Disk]
         │   └─→ File.WriteAllBytes(path, compressed)
         │
         └─→ [Upload to Cloud] (if enabled)
             ├─→ Steam Cloud (PC)
             ├─→ iCloud (iOS)
             └─→ Google Play Games (Android)
```

### Load Flow

```
[Player selects save slot] (Unity UI)
         │
         ▼
[SaveSystem.LoadGame(slotIndex)] (Overlord.Core)
         │
         ├─→ [Read from Disk/Cloud]
         │   └─→ File.ReadAllBytes(path)
         │
         ├─→ [Decompress Data]
         │   └─→ GZip decompression
         │
         ├─→ [Deserialize JSON]
         │   └─→ System.Text.Json.Deserialize<SaveData>()
         │
         ├─→ [Validate Checksum]
         │   ├─→ Recalculate MD5 hash
         │   └─→ Compare with stored checksum
         │       ├─→ Match: Continue
         │       └─→ Mismatch: Error (corrupt save)
         │
         ├─→ [Restore Game State]
         │   ├─→ GameStateManager.LoadState(saveData)
         │   ├─→ Restore planets, craft, buildings
         │   └─→ Restore AI state and turn number
         │
         └─→ [Fire OnGameLoaded event]
                 │
                 ▼
         [Unity rebuilds scene] (Unity)
         ├─→ Regenerate galaxy view 3D objects
         ├─→ Update all UI panels
         ├─→ Restore camera position
         └─→ Resume gameplay
```

---

## 4. Building Construction Flow

```
[Player clicks "Build Structure"] (Unity UI)
         │
         ▼
[BuildingSystem.StartConstruction()] (Overlord.Core)
         │
         ├─→ [Validate Construction]
         │   ├─→ Check resource availability
         │   ├─→ Check building slot availability
         │   └─→ Verify prerequisites met
         │
         ├─→ [Deduct Resources]
         │   └─→ ResourceSystem.SpendResources(cost)
         │
         ├─→ [Create Building Entity]
         │   ├─→ Status: UnderConstruction
         │   ├─→ TurnsRemaining: based on building type
         │   └─→ Add to planet.Buildings[]
         │
         └─→ [Fire OnConstructionStarted event]
                 │
                 ▼
         [Unity shows construction UI] (AFS-073)
         └─→ Display construction progress bar

[Each turn advances construction]
         │
         ▼
[TurnSystem.UpdateBuildings()] (Overlord.Core)
         │
         ├─→ [Decrement TurnsRemaining]
         │   └─→ building.TurnsRemaining--
         │
         ├─→ [Check if Complete]
         │   └─→ if (TurnsRemaining == 0)
         │       ├─→ Status = Operational
         │       ├─→ Apply production bonuses
         │       └─→ Fire OnConstructionCompleted event
         │
         └─→ [Unity updates UI]
             └─→ Show "Construction Complete" notification
```

---

## 5. Resource Production Flow

```
[Turn System: Income Phase] (Overlord.Core)
         │
         ▼
[IncomeSystem.CalculateIncome(planet)] (AFS-022)
         │
         ├─→ [Base Production]
         │   ├─→ Minerals: planet.MineralProduction × 10
         │   ├─→ Fuel: planet.FuelProduction × 10
         │   ├─→ Food: planet.FoodProduction × 10
         │   └─→ Energy: planet.EnergyProduction × 10
         │
         ├─→ [Apply Building Multipliers]
         │   ├─→ Mining Station: +40% Minerals
         │   ├─→ Horticultural Station: +40% Food
         │   └─→ Solar Satellite: +20 Energy (flat)
         │
         ├─→ [Calculate Tax Income]
         │   ├─→ Credits = population × taxRate
         │   └─→ Morale penalty = -taxRate%
         │
         ├─→ [Update Resources]
         │   └─→ ResourceSystem.AddResources(income)
         │
         └─→ [Fire OnIncomeCalculated event]
                 │
                 ▼
         [Unity updates HUD] (AFS-072)
         └─→ Animate resource counters (count-up effect)
```

---

## 6. AI Decision-Making Flow

```
[AI Turn Phase] (Overlord.Core)
         │
         ▼
[AIDecisionSystem.ExecuteAITurn()] (AFS-051)
         │
         ├─→ [Assess Threats]
         │   ├─→ Calculate player military strength
         │   ├─→ Calculate AI military strength
         │   └─→ ThreatLevel = playerStrength / aiStrength
         │
         ├─→ [Evaluate Priorities]
         │   ├─→ Priority 1: Defend (if under attack)
         │   ├─→ Priority 2: Build military (if threatened)
         │   ├─→ Priority 3: Build economy (if safe)
         │   ├─→ Priority 4: Attack (if advantageous)
         │   └─→ Priority 5: Expand (if resources available)
         │
         ├─→ [Select Actions based on Personality]
         │   ├─→ Aggressive AI: Prefer attack + military
         │   ├─→ Defensive AI: Prefer defense structures
         │   ├─→ Economic AI: Prefer production buildings
         │   └─→ Balanced AI: Mix of all strategies
         │
         ├─→ [Execute Actions]
         │   ├─→ BuildingSystem.StartConstruction()
         │   ├─→ CraftSystem.PurchaseCraft()
         │   ├─→ CombatSystem.InitiateBattle()
         │   └─→ Loop until resources exhausted
         │
         └─→ [Fire OnAITurnCompleted event]
                 │
                 ▼
         [Unity shows AI activity] (AFS-074)
         └─→ Display "AI Turn Complete" notification
```

---

## 7. UI Update Flow

```
[Game State Changes] (Overlord.Core)
         │
         ├─→ [Fire Domain Events]
         │   ├─→ OnResourcesChanged
         │   ├─→ OnTurnAdvanced
         │   ├─→ OnBuildingCompleted
         │   ├─→ OnCraftDestroyed
         │   └─→ OnPlanetCaptured
         │
         ▼
[Unity Event Listeners] (MonoBehaviours)
         │
         ├─→ [HUDSystem] (AFS-072)
         │   ├─→ Update resource displays
         │   ├─→ Update turn counter
         │   └─→ Update warning indicators
         │
         ├─→ [GalaxyView] (AFS-013)
         │   ├─→ Update planet models
         │   ├─→ Update craft positions
         │   └─→ Update orbital structures
         │
         ├─→ [PlanetManagementUI] (AFS-073)
         │   ├─→ Refresh building list
         │   ├─→ Update construction progress
         │   └─→ Update garrison display
         │
         └─→ [NotificationSystem] (AFS-074)
             └─→ Show toast notifications
```

---

## Event-Driven Communication

### Core → Unity Events

| Event | Data | Unity Listener |
|-------|------|----------------|
| `OnTurnEnded` | {turnNumber} | HUDSystem, GalaxyView |
| `OnResourcesChanged` | {credits, minerals, fuel, food, energy} | HUDSystem |
| `OnCombatResolved` | {battleResult} | VFXSystem, AudioSystem |
| `OnBuildingCompleted` | {building, planet} | PlanetUI, NotificationSystem |
| `OnGameSaved` | {slotIndex, success} | UIManager |
| `OnGameLoaded` | {saveData} | All UI systems |

---

**Document Owner:** Lead Developer
**Review Status:** Approved
