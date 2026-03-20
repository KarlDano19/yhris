import { T_ChecklistPhase } from './add-checklist/PhaseModal';

export const DEFAULT_CHECKLIST_PHASES: T_ChecklistPhase[] = [
  {
    id: 1,
    name: 'Registration',
    description: '',
    checklists: [
      { id: 1, name: 'Register for an account or authorize for existing YP user', description: '', video_url: '' },
      { id: 2, name: 'Acknowledge Privacy notice', description: '', video_url: '' },
      { id: 3, name: 'Acknowledge system Terms of service', description: '', video_url: '' },
    ],
  },
  {
    id: 2,
    name: 'Company Setup',
    description: '',
    checklists: [
      { id: 4, name: 'Company profile completed', description: '', video_url: '' },
      { id: 5, name: 'Create admin user accounts', description: '', video_url: '' },
      { id: 6, name: 'Import employees or Sync employees for existing YP user', description: '', video_url: '' },
      { id: 7, name: 'Setup company general settings', description: '', video_url: '' },
    ],
  },
  {
    id: 3,
    name: 'System Training: Hiring',
    description: '',
    checklists: [
      { id: 8, name: 'How to post a Job', description: '', video_url: '' },
      { id: 9, name: 'How to use the job posting history', description: '', video_url: '' },
      { id: 10, name: 'How to screen applicants', description: '', video_url: '' },
      { id: 11, name: 'How to Onboard a new hire', description: '', video_url: '' },
    ],
  },
  {
    id: 4,
    name: 'System Training: Management',
    description: '',
    checklists: [
      { id: 12, name: 'How to use the Evaluation module', description: '', video_url: '' },
      { id: 13, name: 'How to address employee issues', description: '', video_url: '' },
      { id: 14, name: 'How to create Memo and Policy', description: '', video_url: '' },
      { id: 15, name: 'How to create employee benefits', description: '', video_url: '' },
      { id: 16, name: 'How to view and update employee list', description: '', video_url: '' },
      { id: 17, name: 'How to use employee movement module', description: '', video_url: '' },
      { id: 18, name: 'How to use the document generator', description: '', video_url: '' },
      { id: 19, name: 'How to view and update employee 201 records', description: '', video_url: '' },
      { id: 20, name: 'How to view the organizational chart', description: '', video_url: '' },
    ],
  },
  {
    id: 5,
    name: 'System Training: Offboarding',
    description: '',
    checklists: [
      { id: 21, name: 'How to use the Employee Separation module', description: '', video_url: '' },
    ],
  },
  {
    id: 6,
    name: 'System Training: Compliance',
    description: '',
    checklists: [
      { id: 22, name: 'How to use the DOLE module', description: '', video_url: '' },
    ],
  },
  {
    id: 7,
    name: 'System Training: Other Settings',
    description: '',
    checklists: [
      { id: 23, name: 'How to use the analytics module', description: '', video_url: '' },
      { id: 24, name: 'How to use the audit logs module', description: '', video_url: '' },
      { id: 25, name: 'How to use the Organizational Structure module', description: '', video_url: '' },
    ],
  },
  {
    id: 8,
    name: 'Go-Live & Acceptance Orientation',
    description: '',
    checklists: [
      { id: 26, name: 'How to operate the HRIS after onboarding', description: '', video_url: '' },
      { id: 27, name: 'How to access support or help resources', description: '', video_url: '' },
    ],
  },
];
