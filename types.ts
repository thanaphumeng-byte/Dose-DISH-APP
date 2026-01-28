export interface UserProfile {
  name: string;
  age: number;
  conditions: string;
  medications: string;
  allergies: string;
}

export enum ScanMode {
  MEDICATION = 'MEDICATION',
  MEAL = 'MEAL',
  LAB_RESULT = 'LAB_RESULT',
}

export type InputMethod = 'CAMERA' | 'TEXT';
export type Language = 'en' | 'th' | 'cn';

export interface AnalysisResult {
  text: string; // The markdown response from Gemini
  riskLevel: 'SAFE' | 'CAUTION' | 'DANGER' | 'INFO';
  timestamp: number;
  mode: ScanMode | 'FDI_CHECK';
}

export interface LabDataPoint {
  date: string;
  value: number;
  metric: string;
}

// Mock data for initial chart visualization
export const MOCK_LAB_DATA: LabDataPoint[] = [
  { date: '2023-10-01', value: 180, metric: 'LDL Cholesterol' },
  { date: '2023-11-15', value: 165, metric: 'LDL Cholesterol' },
  { date: '2023-12-20', value: 155, metric: 'LDL Cholesterol' },
  { date: '2024-01-10', value: 148, metric: 'LDL Cholesterol' },
];