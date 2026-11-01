import { SecurityIssue, SecurityScoreSummary } from '../types/security';
import { VaultItem } from '../types/vault';

export interface ISecurityService {
  getSummary(items: VaultItem[]): SecurityScoreSummary;
  getIssues(items: VaultItem[]): SecurityIssue[];
  runSecurityAudit(items: VaultItem[]): Promise<SecurityScoreSummary>;
}

class SecurityService implements ISecurityService {
  getSummary(items: VaultItem[]): SecurityScoreSummary {
    const totalAnalyzed = items.length;
    if (totalAnalyzed === 0) {
      return {
        overallScore: 100,
        totalAnalyzed: 0,
        weakCount: 0,
        reusedCount: 0,
        compromisedCount: 0,
        strongCount: 0,
        lastCheckedDate: new Date().toISOString(),
        isDemo: true,
      };
    }

    const weakItems = items.filter((i) => i.strengthScore < 50);

    // Detect reused passwords
    const passwordCounts = new Map<string, number>();
    for (const item of items) {
      const count = passwordCounts.get(item.password) || 0;
      passwordCounts.set(item.password, count + 1);
    }

    let reusedCount = 0;
    for (const [, count] of passwordCounts.entries()) {
      if (count > 1) {
        reusedCount += count;
      }
    }

    const strongItems = items.filter((i) => i.strengthScore >= 75);

    // Compute sample score
    const avgScore = items.reduce((sum, item) => sum + item.strengthScore, 0) / totalAnalyzed;
    const reusePenalty = Math.min(30, (reusedCount / totalAnalyzed) * 40);
    const overallScore = Math.max(10, Math.min(100, Math.round(avgScore - reusePenalty)));

    return {
      overallScore,
      totalAnalyzed,
      weakCount: weakItems.length,
      reusedCount,
      compromisedCount: 1, // Demo simulated breach alert (e.g. haveibeenpwned demo simulation)
      strongCount: strongItems.length,
      lastCheckedDate: '2026-10-31T09:30:00Z',
      isDemo: true,
    };
  }

  getIssues(items: VaultItem[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    // Check reused passwords
    const passwordMap = new Map<string, VaultItem[]>();
    for (const item of items) {
      const list = passwordMap.get(item.password) || [];
      list.push(item);
      passwordMap.set(item.password, list);
    }

    for (const [, grouped] of passwordMap.entries()) {
      if (grouped.length > 1) {
        for (const item of grouped) {
          const others = grouped
            .filter((g) => g.id !== item.id)
            .map((g) => g.title)
            .join(', ');
          issues.push({
            id: `reuse-${item.id}`,
            vaultItemId: item.id,
            title: item.title,
            username: item.username,
            category: item.category,
            type: 'reused',
            severity: 'high',
            description: `Password is also shared with ${others}.`,
            recommendation: 'Generate a unique 18+ character password for each distinct account.',
          });
        }
      }
    }

    // Check weak passwords
    for (const item of items) {
      if (item.strengthScore < 50) {
        issues.push({
          id: `weak-${item.id}`,
          vaultItemId: item.id,
          title: item.title,
          username: item.username,
          category: item.category,
          type: 'weak',
          severity: item.strengthScore < 35 ? 'critical' : 'high',
          description: `Entropy is too low (Strength Score: ${item.strengthScore}/100).`,
          recommendation: 'Use the PassForge Generator to create an alphanumeric password with symbols.',
        });
      }
    }

    // Add demo simulated compromised alert
    const entertainmentItem = items.find((i) => i.category === 'Entertainment');
    if (entertainmentItem) {
      issues.push({
        id: `compromised-${entertainmentItem.id}`,
        vaultItemId: entertainmentItem.id,
        title: entertainmentItem.title,
        username: entertainmentItem.username,
        category: entertainmentItem.category,
        type: 'compromised',
        severity: 'critical',
        description: 'Simulated breach: credential pattern appeared in known credential dumps.',
        recommendation: 'Rotate credentials immediately and enable Multi-Factor Authentication.',
      });
    }

    return issues;
  }

  async runSecurityAudit(items: VaultItem[]): Promise<SecurityScoreSummary> {
    // Simulate brief asynchronous processing
    await new Promise((res) => setTimeout(res, 400));
    return this.getSummary(items);
  }
}

export const securityService = new SecurityService();
