export enum PageState {
  HOME,
  LOGIN,
  INFO,
  INSTRUCTION,
  QUIZ,
  RESULT
}

export enum AssessmentType {
  ADHD = 'ADHD',
  SENSORY = 'SENSORY'
}

export enum SeverityLevel {
  NORMAL = '正常',
  MILD = '轻度失调',
  MODERATE = '中度失调',
  SEVERE = '重度失调'
}

export interface Option {
  label: string;
  score: number;
}

export interface Question {
  id: number;
  text: string;
  dimension: string;
  section?: string; // Added for Sensory sections
}

export interface AssessmentConfig {
  type: AssessmentType;
  title: string;
  description: string;
  questions: Question[];
  options: Option[];
}

export interface ScoreResult {
  dimensionScores: Record<string, number>; // Standardized Score (Mean for ADHD, T-Score for Sensory)
  dimensionRawScores?: Record<string, number>; // Raw Sum (Mainly for Sensory reference)
  totalScore: number;
  dimensionLevels: Record<string, SeverityLevel>;
  totalLevel: SeverityLevel;
}