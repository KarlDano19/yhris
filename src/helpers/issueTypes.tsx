import React from 'react';

export const issueTypeOptions = [
  {
    label: <strong>- ATTENDANCE-RELATED -</strong>,
    value: null,
    isDisabled: true,
  },
  {
    value: 'Absenteeism / AWOL',
    label: 'Absenteeism / AWOL',
  },
  {
    value: 'Tardiness / Undertime',
    label: 'Tardiness / Undertime',
  },
  {
    value: 'Job Abandonment',
    label: 'Job Abandonment',
  },
  {
    label: <strong>- PERFORMANCE-RELATED -</strong>,
    value: null,
    isDisabled: true,
  },
  {
    value: 'Negligence of Duty',
    label: 'Negligence of Duty',
  },
  {
    value: 'Poor Work Performance',
    label: 'Poor Work Performance',
  },
  {
    value: 'Gross & Habitual Neglect',
    label: 'Gross & Habitual Neglect',
  },
  {
    label: <strong>- BEHAVIORAL / MISCONDUCT -</strong>,
    value: null,
    isDisabled: true,
  },
  {
    value: 'Insubordination / Willful Disobedience',
    label: 'Insubordination / Willful Disobedience',
  },
  {
    value: 'Serious Misconduct',
    label: 'Serious Misconduct (e.g., fighting, harassment, violence)',
  },
  {
    value: 'Minor Misconduct',
    label: 'Minor Misconduct (e.g., dress code, rude behavior)',
  },
  {
    value: 'Disorderly Conduct',
    label: 'Disorderly Conduct',
  },
  {
    label: <strong>- INTEGRITY / TRUST VIOLATIONS -</strong>,
    value: null,
    isDisabled: true,
  },
  {
    value: 'Theft / Dishonesty',
    label: 'Theft / Dishonesty',
  },
  {
    value: 'Fraud / Falsification of Records',
    label: 'Fraud / Falsification of Records',
  },
  {
    value: 'Breach of Trust / Loss of Confidence',
    label: 'Breach of Trust / Loss of Confidence',
  },
  {
    value: 'Conflict of Interest',
    label: 'Conflict of Interest',
  },
  {
    label: <strong>- POLICY & LEGAL VIOLATIONS -</strong>,
    value: null,
    isDisabled: true,
  },
  {
    value: 'Violation of Company Policy / Code of Conduct',
    label: 'Violation of Company Policy / Code of Conduct',
  },
  {
    value: 'Sexual Harassment / Workplace Harassment',
    label: 'Sexual Harassment / Workplace Harassment',
  },
  {
    value: 'Substance Abuse',
    label: 'Substance Abuse (Drugs / Alcohol at Work)',
  },
  {
    value: 'Violation of Safety / OSH Rules',
    label: 'Violation of Safety / OSH Rules',
  },
  {
    label: <strong>- OTHERS -</strong>,
    value: null,
    isDisabled: true,
  },
  {
    value: 'Others: (Please specify)',
    label: 'Others: (Please specify)',
    isCustom: true,
  },
];