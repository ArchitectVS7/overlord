/**
 * TypeScript interfaces for the How to Play JSON content system.
 * These interfaces define the structure of game-ready tutorial content
 * that can be loaded from public/assets/data/how-to-play/*.json
 */

/**
 * Manifest file structure (how-to-play-manifest.json)
 * Defines available categories and their metadata
 */
export interface HowToPlayManifest {
  version: string;
  title: string;
  description: string;
  categories: HowToPlayCategory[];
}

/**
 * Category entry in the manifest
 */
export interface HowToPlayCategory {
  id: string;
  name: string;
  icon: string;
  file: string;
  order: number;
  description: string;
}

/**
 * Content file structure (basics.json, economy.json, etc.)
 */
export interface HowToPlayContent {
  categoryId: string;
  categoryName: string;
  sections: HowToPlaySection[];
}

/**
 * Major section within a content file
 */
export interface HowToPlaySection {
  sectionId: string;
  title: string;
  content: string;
  subsections?: HowToPlaySubsection[];
  formula?: FormulaDefinition;
  thresholds?: ThresholdDefinition[];
  phases?: PhaseDefinition[];
  planetTypes?: PlanetTypeDefinition[];
  steps?: ProcessStep[];
  warning?: string;
}

/**
 * Subsection within a section
 */
export interface HowToPlaySubsection {
  subsectionId: string;
  title: string;
  content: string;
  keyPoints?: string[];
  relatedSystems?: string[];
  tip?: string;
  warning?: string;
  formula?: FormulaDefinition;
  thresholds?: ThresholdDefinition[];
  phases?: PhaseDefinition[];
  planetTypes?: PlanetTypeDefinition[];
  buildingTable?: BuildingTableEntry[];
  equipmentTable?: EquipmentTableEntry[];
  weaponTable?: WeaponTableEntry[];
  costTable?: CostTableEntry[];
  order?: BuildOrderEntry[];
  specs?: CraftSpecs;
  capabilities?: string[];
  process?: string[];
  aggressionEffects?: AggressionEffect[];
  casualtyRates?: CasualtyRate[];
  effects?: string[];
  defenseSpecs?: DefenseSpecs;
  planetBonuses?: PlanetBonus[];
  factors?: MoraleFactor[];
  crewRequirements?: CrewRequirement[];
  quote?: string;
  strategy?: AIStrategy;
  difficultyTable?: DifficultyEntry[];
  analysis?: BuildingAnalysis[];
  specializations?: PlanetSpecialization[];
  comparison?: ForceComparison[];
  tactics?: AggressionTactic[];
  considerations?: TimingConsideration[];
  mistakes?: MistakeEntry[];
  execution?: string[];
  bestAgainst?: string;
  weakAgainst?: string;
}

/**
 * Formula definition for mathematical relationships
 */
export interface FormulaDefinition {
  description: string;
  expression: string;
  variables?: FormulaVariable[];
  example?: string;
  duration?: string;
}

/**
 * Variable in a formula
 */
export interface FormulaVariable {
  name: string;
  description: string;
}

/**
 * Resource threshold definition
 */
export interface ThresholdDefinition {
  level: string;
  threshold: string;
  color: string;
  description?: string;
  meaning?: string;
}

/**
 * Turn phase definition
 */
export interface PhaseDefinition {
  name: string;
  description: string;
}

/**
 * Planet type information
 */
export interface PlanetTypeDefinition {
  type: string;
  description: string;
}

/**
 * Step in a multi-step process
 */
export interface ProcessStep {
  step?: number;
  stepNumber?: number;
  title: string;
  description: string;
}

/**
 * Building table entry for cost/production display
 */
export interface BuildingTableEntry {
  building: string;
  produces?: string;
  crewRequired?: number;
  cost?: string;
  credits?: number;
  minerals?: number;
  fuel?: number;
  turns?: number;
}

/**
 * Equipment table entry
 */
export interface EquipmentTableEntry {
  level: string;
  cost: number;
  multiplier: string;
  description: string;
}

/**
 * Weapon table entry
 */
export interface WeaponTableEntry {
  level: string;
  cost: number;
  multiplier: string;
  description?: string;
}

/**
 * Generic cost table entry
 */
export interface CostTableEntry {
  building: string;
  credits: number;
  minerals: number;
  fuel: number;
  turns: number;
}

/**
 * Build order recommendation
 */
export interface BuildOrderEntry {
  priority: number;
  building: string;
  reason: string;
}

/**
 * Spacecraft specifications
 */
export interface CraftSpecs {
  cost: string;
  crew: number;
  capacity?: string;
  speed?: number;
  platoonCapacity?: number;
  fuelEfficiency?: string;
  terraformTime?: string;
  consumable?: string;
}

/**
 * Aggression level effect
 */
export interface AggressionEffect {
  level: string;
  strengthMod: string;
  casualties: string;
  description: string;
}

/**
 * Casualty rate definition
 */
export interface CasualtyRate {
  outcome: string;
  percentage: string;
  description: string;
}

/**
 * Defense platform specifications
 */
export interface DefenseSpecs {
  maxPlatforms: number;
  bonusPerPlatform: string;
  maxBonus: string;
  crew: number;
  cost: string;
}

/**
 * Planet production bonus
 */
export interface PlanetBonus {
  type: string;
  bonus: string;
  strategy: string;
}

/**
 * Morale affecting factor
 */
export interface MoraleFactor {
  factor: string;
  effect: string;
}

/**
 * Crew requirement entry
 */
export interface CrewRequirement {
  item: string;
  crew: number;
}

/**
 * AI strategy information
 */
export interface AIStrategy {
  aiPriorities: string[];
  counterStrategy: string[];
}

/**
 * Difficulty level entry
 */
export interface DifficultyEntry {
  difficulty: string;
  strengthMod: string;
  attackThreshold: string;
  behavior: string;
}

/**
 * Building economic analysis
 */
export interface BuildingAnalysis {
  building: string;
  cost: string;
  output: string;
  payback?: string;
  verdict: string;
}

/**
 * Planet specialization recommendation
 */
export interface PlanetSpecialization {
  planetType: string;
  specialization: string;
  strategy: string;
}

/**
 * Force composition comparison
 */
export interface ForceComparison {
  approach: string;
  pros: string;
  cons: string;
  when: string;
}

/**
 * Aggression slider tactical guidance
 */
export interface AggressionTactic {
  situation: string;
  aggression: string;
  reason: string;
}

/**
 * Attack timing consideration
 */
export interface TimingConsideration {
  factor: string;
  timing: string;
  reason: string;
}

/**
 * Common mistake entry
 */
export interface MistakeEntry {
  mistake: string;
  consequence: string;
  solution: string;
}

/**
 * Loader utility for How to Play content
 */
export class HowToPlayLoader {
  private static basePath = 'assets/data/how-to-play/';
  private static manifestCache: HowToPlayManifest | null = null;
  private static contentCache: Map<string, HowToPlayContent> = new Map();

  /**
   * Loads the manifest file
   */
  public static async loadManifest(): Promise<HowToPlayManifest> {
    if (this.manifestCache) {
      return this.manifestCache;
    }

    const response = await fetch(`${this.basePath}how-to-play-manifest.json`);
    if (!response.ok) {
      throw new Error(`Failed to load How to Play manifest: ${response.status}`);
    }

    this.manifestCache = await response.json();
    return this.manifestCache!;
  }

  /**
   * Loads a specific category's content
   */
  public static async loadCategory(categoryId: string): Promise<HowToPlayContent> {
    if (this.contentCache.has(categoryId)) {
      return this.contentCache.get(categoryId)!;
    }

    const manifest = await this.loadManifest();
    const category = manifest.categories.find(c => c.id === categoryId);

    if (!category) {
      throw new Error(`Category not found: ${categoryId}`);
    }

    const response = await fetch(`${this.basePath}${category.file}`);
    if (!response.ok) {
      throw new Error(`Failed to load category ${categoryId}: ${response.status}`);
    }

    const content = await response.json();
    this.contentCache.set(categoryId, content);
    return content;
  }

  /**
   * Gets a specific section from a category
   */
  public static async getSection(
    categoryId: string,
    sectionId: string,
  ): Promise<HowToPlaySection | null> {
    const content = await this.loadCategory(categoryId);
    return content.sections.find(s => s.sectionId === sectionId) || null;
  }

  /**
   * Clears the cache (useful for hot-reloading during development)
   */
  public static clearCache(): void {
    this.manifestCache = null;
    this.contentCache.clear();
  }
}
