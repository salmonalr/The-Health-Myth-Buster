export type Verdict = 'BUSTED' | 'CONFIRMED' | 'NUANCED' | 'PLAUSIBLE';

export type MythCategory =
  | 'Nutrition'
  | 'Fitness'
  | 'Sleep & Recovery'
  | 'Immunity & Illness'
  | 'Medicine & Drugs';

export type EvidenceGrade =
  | 'Grade A (Systematic Reviews & RCTs)'
  | 'Grade B (Cohort & Observational)'
  | 'Grade C (Preliminary & Animal/In-Vitro)';

export interface HealthMyth {
  id: string;
  title: string;
  claim: string;
  verdict: Verdict;
  category: MythCategory;
  summary: string;
  scientificReality: string;
  biologicalMechanism: string;
  commonOrigin: string;
  evidenceGrade: EvidenceGrade;
  citations: string[];
  readTime: string;
  popularBeliefRate: number; // e.g. 74% believe this
  featured?: boolean;
}

export interface QuizQuestion {
  id: string;
  statement: string;
  isFact: boolean;
  verdict: Verdict;
  category: MythCategory;
  explanation: string;
  misconceptionStat: string;
  citation: string;
}

export interface VerificationResult {
  claim: string;
  verdict: Verdict;
  confidenceScore: number;
  shortVerdictSummary: string;
  keyScientificFinding: string;
  biologicalMechanism: string;
  misconceptionOrigin: string;
  practicalTakeaway: string;
  evidenceGrade: string;
  keyCitations: string[];
}

export interface NotificationPreferences {
  permission: NotificationPermission;
  dailyEnabled: boolean;
  alertTime: string;
  lastDeliveredTip?: string;
}
