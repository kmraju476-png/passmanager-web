import { VaultCategory } from './vault';

export type SecurityIssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type SecurityIssueType = 'weak' | 'reused' | 'compromised' | 'old';

export interface SecurityIssue {
  id: string;
  vaultItemId: string;
  title: string;
  username: string;
  category: VaultCategory;
  type: SecurityIssueType;
  severity: SecurityIssueSeverity;
  description: string;
  recommendation: string;
}

export interface SecurityScoreSummary {
  overallScore: number; // 0 - 100
  totalAnalyzed: number;
  weakCount: number;
  reusedCount: number;
  compromisedCount: number;
  strongCount: number;
  lastCheckedDate: string;
  isDemo: boolean;
}
