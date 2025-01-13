export type TaxType = 'VAT' | 'INCOME_TAX';

export const TAX_TYPE_LABELS: Record<TaxType, string> = {
  'VAT': 'Value Added Tax',
  'INCOME_TAX': 'Income Tax'
};

export type ComplianceStatus = 'COMPLIANT' | 'LATE' | 'MISSING';

export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  'COMPLIANT': 'Compliant',
  'LATE': 'Late Filing',
  'MISSING': 'Missing Declaration'
};