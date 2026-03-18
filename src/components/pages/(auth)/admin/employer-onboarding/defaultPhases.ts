import { T_ChecklistPhase } from './add-checklist/PhaseModal';

export const DEFAULT_CHECKLIST_PHASES: T_ChecklistPhase[] = [
  {
    id: 1,
    name: 'Registration',
    description: '',
    order_position: 0,
    items: [
      { id: 1, title: 'Register for an account or authorize for existing YP user', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 2, title: 'Acknowledge Privacy notice', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 3, title: 'Acknowledge system Terms of service', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
    ],
  },
  {
    id: 2,
    name: 'Company Setup',
    description: '',
    order_position: 1,
    items: [
      { id: 4, title: 'Company profile completed', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 5, title: 'Create admin user accounts', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 6, title: 'Import employees or Sync employees for existing YP user', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 7, title: 'Setup company general settings', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
    ],
  },
  {
    id: 3,
    name: 'System Training: Hiring',
    description: '',
    order_position: 2,
    items: [
      { id: 8, title: 'How to post a Job', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 9, title: 'How to use the job posting history', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 10, title: 'How to screen applicants', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 11, title: 'How to Onboard a new hire', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
    ],
  },
  {
    id: 4,
    name: 'System Training: Management',
    description: '',
    order_position: 3,
    items: [
      { id: 12, title: 'How to use the Evaluation module', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 13, title: 'How to address employee issues', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 14, title: 'How to create Memo and Policy', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 15, title: 'How to create employee benefits', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 16, title: 'How to view and update employee list', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 17, title: 'How to use employee movement module', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 18, title: 'How to use the document generator', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 19, title: 'How to view and update employee 201 records', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 20, title: 'How to view the organizational chart', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
    ],
  },
  {
    id: 5,
    name: 'System Training: Offboarding',
    description: '',
    order_position: 4,
    items: [
      { id: 21, title: 'How to use the Employee Separation module', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
    ],
  },
  {
    id: 6,
    name: 'System Training: Compliance',
    description: '',
    order_position: 5,
    items: [
      { id: 22, title: 'How to use the DOLE module', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
    ],
  },
  {
    id: 7,
    name: 'System Training: Other Settings',
    description: '',
    order_position: 6,
    items: [
      { id: 23, title: 'How to use the analytics module', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 24, title: 'How to use the audit logs module', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 25, title: 'How to use the Organizational Structure module', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
    ],
  },
  {
    id: 8,
    name: 'Go-Live & Acceptance Orientation',
    description: '',
    order_position: 7,
    items: [
      { id: 26, title: 'How to operate the HRIS after onboarding', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
      { id: 27, title: 'How to access support or help resources', description: '', tutorial_url: '', estimated_minutes: 15, is_required: true } as any,
    ],
  },
];

export const DEFAULT_PHASE_GROUPS = DEFAULT_CHECKLIST_PHASES.map((phase) => ({
  id: phase.id,
  name: phase.name,
  description: phase.description,
  order_position: phase.order_position,
  items: phase.items.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    estimated_minutes: item.estimated_minutes,
    tutorial_url: item.tutorial_url,
  })),
}));
