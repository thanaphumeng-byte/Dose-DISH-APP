
export interface HistoryItem {
  id: string;
  type: ScanMode;
  name: string; // "Atorvastatin", "Fried Rice", "LDL Cholesterol"
  value?: string; // For Lab results e.g., "150"
  date: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age: number;
  conditions: string;
  medications: string;
  allergies: string;
  history: HistoryItem[]; // New: Stores scan history
}

export enum ScanMode {
  MEDICATION = 'MEDICATION',
  MEAL = 'MEAL',
  LAB_RESULT = 'LAB_RESULT',
}

export type InputMethod = 'CAMERA' | 'TEXT';
export type Language = 'en' | 'th'; // Removed 'cn'

export type Theme = 'light' | 'dark'; // Added Theme

export interface AnalysisResult {
  text: string; // The markdown response from Gemini
  riskLevel: 'SAFE' | 'CAUTION' | 'DANGER' | 'INFO';
  timestamp: number;
  mode: ScanMode | 'FDI_CHECK';
  extractedData?: { name: string; value?: string }; // Data extracted by AI to save to history
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string of the attached image
  timestamp: number;
}

export interface LabDataPoint {
  date: string;
  value: number;
  metric: string;
}

// Fallback mock data if history is empty
export const MOCK_LAB_DATA: LabDataPoint[] = [
  { date: '2023-10-01', value: 180, metric: 'LDL Cholesterol' },
  { date: '2023-11-15', value: 165, metric: 'LDL Cholesterol' },
  { date: '2023-12-20', value: 155, metric: 'LDL Cholesterol' },
  { date: '2024-01-10', value: 148, metric: 'LDL Cholesterol' },
];
