import { TourSegmentKey, TourStep } from './types';

// ── Individual steps ──────────────────────────────────────────────────────────

const HEADER_STEP: TourStep = {
  id: 'tour-company-profile',
  targetId: 'tour-company-profile',
  title: 'Your Company Profile',
  description:
    'Click here to view and update your company profile, subscription, and account settings.',
  actionLabel: 'Got it!',
  variant: 'pointer',
};

const SYNC_STEP: TourStep = {
  id: 'tour-sync-button',
  targetId: 'tour-sync-button',
  title: 'Payroll Sync',
  description:
    'Click this button to sync all data from your Yahshua Payroll system into HRIS — employees, departments, positions, locations, and more.',
  actionLabel: 'Got it!',
  variant: 'pointer',
};

const MANAGE_STEP: TourStep = {
  id: 'tour-manage',
  targetId: 'tour-manage',
  title: 'Manage Employees',
  description:
    'Access your full employee directory, update 201 files, manage leaves and attendance, and handle day-to-day HR operations.',
  link: '/manage',
  actionLabel: 'Go to Manage',
  continuesOnNextPage: true,
};

const EMPLOYEE_LIST_STEP: TourStep = {
  id: 'tour-manage-employees',
  targetId: 'tour-manage-employees',
  title: 'Employee List',
  description:
    'Here you can view and manage all your employees — update their profiles, track their status, and more.',
  actionLabel: 'Got it!',
};

const SETTINGS_STEP: TourStep = {
  id: 'tour-settings',
  targetId: 'tour-settings',
  title: 'Settings',
  description:
    'Configure your company profile, manage user roles & permissions, and customise your HRIS to fit your workflow.',
  link: '/settings',
  actionLabel: 'Go to Settings!',
};

// ── Segment configuration ─────────────────────────────────────────────────────

export interface TourSegmentConfig {
  key: TourSegmentKey;
  steps: TourStep[];
  /** Only show for payroll-integrated accounts */
  requiresPayroll?: boolean;
  /** True when segment spans a page navigation (manage tour: dashboard → /manage) */
  crossPage?: boolean;
}

export const TOUR_SEGMENTS: TourSegmentConfig[] = [
  { key: 'header',   steps: [HEADER_STEP] },
  { key: 'sync',     steps: [SYNC_STEP],                        requiresPayroll: true },
  { key: 'manage',   steps: [MANAGE_STEP, EMPLOYEE_LIST_STEP],  crossPage: true },
  { key: 'settings', steps: [SETTINGS_STEP] },
];

const PAYROLL_LOGIN_TYPES = ['yahshua-payroll', 'yg-payroll'];

/**
 * Convenience shim — returns all steps for `loginType` in a flat array.
 * Used by the "restart entire tour" button to replay everything at once.
 */
export function getDashboardTourSteps(loginType: string): TourStep[] {
  const isPayroll = PAYROLL_LOGIN_TYPES.includes(loginType);
  return TOUR_SEGMENTS
    .filter(s => !s.requiresPayroll || isPayroll)
    .flatMap(s => s.steps);
}
