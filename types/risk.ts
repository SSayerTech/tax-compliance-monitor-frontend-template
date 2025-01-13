import type { TaxType, ComplianceStatus } from './tax';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskTrend = 'up' | 'down' | 'stable';
export type RiskEventType = 'LATE_FILING' | 'MISSING_DECLARATION' | 'RISK_INCREASE';

export interface RiskScore {
  score: number;
  previousScore?: number;
  trend: RiskTrend;
  exposure: number;
}

export interface TaxTypeRisk {
  score: number;
  exposure: number;
  lastFiled: string;
  nextDue: string;
  status: ComplianceStatus;
}

export interface RiskProfile {
  overall: RiskScore;
  components: {
    vat: TaxTypeRisk;
    incomeTax: TaxTypeRisk;
  };
}

export interface TaxpayerInfo {
  id: string;
  name: string;
  taxTypes: TaxType[];
}

export interface TaxpayerRiskData {
  taxpayer: TaxpayerInfo;
  riskProfile: RiskProfile;
  history: HistoricalRiskData[];
}

export interface RiskEvent {
  type: RiskEventType;
  description: string;
  exposure: number;
}

export interface HistoricalRiskData {
  period: string;
  overallScore: number;
  vatScore: number;
  incomeTaxScore: number;
  totalExposure: number;
  events?: RiskEvent[];
}

export interface RiskCardData {
  type: 'OVERALL' | TaxType;
  score: number;
  previousScore?: number;
  exposure: number;
  lastFiled?: string;
  nextDue?: string;
  status?: ComplianceStatus;
}