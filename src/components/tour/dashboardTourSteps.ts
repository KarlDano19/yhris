import { TourSegmentKey, TourStep } from './types';

// ── Segment: header ───────────────────────────────────────────────────────────

const HEADER_STEP: TourStep = {
  id: 'tour-company-profile',
  targetId: 'tour-company-profile',
  title: 'Your Company Profile',
  description:
    'Click <strong>"Proceed"</strong> to go to your company profile and complete your details.',
  link: '/employer-profile',
  actionLabel: 'Proceed',
  continuesOnNextPage: true,
  homePath: '/dashboard',
};

const PROFILE_DETAILS_STEP: TourStep = {
  id: 'tour-profile-next',
  targetId: 'tour-profile-next',
  title: 'Fill in Your Details',
  description:
    'Complete your company information. When all required fields are filled, click <strong>"Next"</strong> to continue to Account Settings.',
  hideActionButton: true,
  completeTrigger: 'profile-form-next',
  nonBlocking: true,
};

export const PROFILE_SAVE_STEP: TourStep = {
  id: 'tour-profile-save',
  targetId: 'tour-profile-save',
  title: 'Save Your Profile',
  description:
    'Review your account settings, then click <strong>"Save"</strong> to complete your company profile. You\'ll be redirected back to the dashboard afterward.',
  completeTrigger: 'profile-saved',
  hideActionButton: true,
  nonBlocking: true,
};

// ── Segment: sync ─────────────────────────────────────────────────────────────
// Only shown for YP (yahshua-payroll / yg-payroll) accounts.

const SYNC_STEP: TourStep = {
  id: 'tour-sync-button',
  targetId: 'tour-sync-button',
  title: 'Payroll Sync',
  description:
    'Click <strong>"Proceed"</strong> to sync all your employee records from YAHSHUA Payroll such as names, department, position, location, and more.',
  actionLabel: 'Proceed',
  actionEvent: 'tour-open-sync-modal',
  completeTrigger: 'sync-all-done',
  nonBlocking: true,
};

// ── Segment: manage ───────────────────────────────────────────────────────────

// Standard flow — guide users through creating or importing employees.
const MANAGE_STEP: TourStep = {
  id: 'tour-manage',
  targetId: 'tour-manage',
  title: 'Manage Employees',
  description:
    'Click <strong>"Proceed"</strong> to go to the Manage module where you can manage your employee directory.',
  link: '/manage',
  actionLabel: 'Proceed',
  continuesOnNextPage: true,
  homePath: '/dashboard',
};

const EMPLOYEE_LIST_STEP: TourStep = {
  id: 'tour-manage-employees',
  targetId: 'tour-manage-employees',
  title: 'Employee List',
  description:
    'Click <strong>"Proceed"</strong> to go to the Employee List where you can import or create your employees.',
  link: '/manage/employees',
  actionLabel: 'Proceed',
  continuesOnNextPage: true,
  homePath: '/manage',
};

const EMPLOYEE_GUIDE_STEP: TourStep = {
  id: 'tour-employee-guide',
  targetId: 'tour-employee-guide',
  title: 'Add Your Employees',
  description:
    'Import your employees by clicking the <strong>"dropdown arrow"</strong> and downloading the <strong>"template"</strong>, or add them one by one. The tour will continue automatically once an employee is added.',
  hideActionButton: true,
  completeTrigger: 'employee-data-added',
  nonBlocking: true,
  hideOnSkip: true,
  visibleOnPath: '/manage/employees',
};

const EMPLOYEE_DONE_STEP: TourStep = {
  id: 'tour-employee-done',
  targetId: 'tour-employee-guide',
  title: 'Employee Added!',
  description:
    'Great job! Your employee has been added. Click <strong>"Proceed"</strong> and you\'ll be redirected to the dashboard to continue the tour.',
  actionLabel: 'Proceed',
  link: '/dashboard',
};

// YP-synced variant — employees are already synced, skip create/import steps.
const MANAGE_NAVIGATE_SYNCED_STEP: TourStep = {
  id: 'tour-manage',
  targetId: 'tour-manage',
  title: 'Manage Employees',
  description:
    'Click <strong>"Proceed"</strong> to view your employee directory — your employees from YAHSHUA Payroll are already synced there.',
  link: '/manage/employees',
  actionLabel: 'Proceed',
  continuesOnNextPage: true,
  homePath: '/dashboard',
};

const MANAGE_SYNCED_DONE_STEP: TourStep = {
  id: 'tour-manage-employees',
  targetId: 'tour-manage-employees',
  title: 'Your Employee Directory',
  description:
    'Your employees from YAHSHUA Payroll are already synced here. Click <strong>"Got it!"</strong> to continue the tour.',
  actionLabel: 'Got it!',
  link: '/dashboard',
};

const MANAGE_STEPS_WITH_EMPLOYEE_CREATION = [MANAGE_STEP, EMPLOYEE_LIST_STEP, EMPLOYEE_GUIDE_STEP, EMPLOYEE_DONE_STEP];
export const MANAGE_STEPS_SYNCED                = [MANAGE_NAVIGATE_SYNCED_STEP, MANAGE_SYNCED_DONE_STEP];

// ── Segment: settings ─────────────────────────────────────────────────────────

const SETTINGS_STEP: TourStep = {
  id: 'tour-settings',
  targetId: 'tour-settings',
  title: 'Settings',
  description:
    'Click <strong>"Proceed"</strong> to go to Settings and configure your General Settings and user accounts.',
  link: '/settings',
  actionLabel: 'Proceed',
  continuesOnNextPage: true,
  homePath: '/dashboard',
};

const GENERAL_SETTINGS_NAVIGATE_STEP: TourStep = {
  id: 'tour-settings-general',
  targetId: 'tour-settings-general',
  title: 'General Settings',
  description:
    'Click <strong>"Proceed"</strong> to go to General Settings and configure your departments, positions, employee IDs, and more.',
  link: '/settings/general-settings',
  actionLabel: 'Proceed',
  continuesOnNextPage: true,
  homePath: '/settings',
};

const GENERAL_SETTINGS_GUIDE_STEP: TourStep = {
  id: 'tour-general-settings-header',
  targetId: 'tour-general-settings-header',
  title: 'Set Up General Settings',
  description:
    'Take your time to set up your general settings. Click <strong>"Done"</strong> when you\'re ready to continue to User Settings.',
  link: '/settings/users',
  actionLabel: 'Done',
  continuesOnNextPage: true,
  noOverlay: true,
  visibleOnPath: '/settings/general-settings',
};

const USER_SETTINGS_GUIDE_STEP: TourStep = {
  id: 'tour-users-header',
  targetId: 'tour-users-header',
  title: 'User Settings',
  description:
    'Set up your admin accounts and user roles here. Click <strong>"Done"</strong> when you\'re finished — we\'ll take you back to the dashboard!',
  link: '/dashboard',
  actionLabel: 'Done',
  noOverlay: true,
  visibleOnPath: '/settings/users',
};

// ── Segment registry ──────────────────────────────────────────────────────────

export interface TourSegmentConfig {
  key: TourSegmentKey;
  steps: TourStep[];
  /** Only show for payroll-integrated accounts */
  requiresPayroll?: boolean;
  /** True when segment spans a page navigation */
  crossPage?: boolean;
}

export const TOUR_SEGMENTS: TourSegmentConfig[] = [
  { key: 'header',   steps: [HEADER_STEP, PROFILE_DETAILS_STEP, PROFILE_SAVE_STEP],                                                          crossPage: true },
  { key: 'sync',     steps: [SYNC_STEP],                                                                                                       requiresPayroll: true },
  { key: 'manage',   steps: MANAGE_STEPS_WITH_EMPLOYEE_CREATION,                                                                              crossPage: true },
  { key: 'settings', steps: [SETTINGS_STEP, GENERAL_SETTINGS_NAVIGATE_STEP, GENERAL_SETTINGS_GUIDE_STEP, USER_SETTINGS_GUIDE_STEP],           crossPage: true },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns the correct manage segment steps based on whether the YP sync is done.
 * is_sync_tour_done is only ever true for YP accounts — if it's done, employees
 * are already synced so skip the creation/import steps entirely.
 */
export function getManageSteps(isSyncTourDone: boolean): TourStep[] {
  return isSyncTourDone ? MANAGE_STEPS_SYNCED : MANAGE_STEPS_WITH_EMPLOYEE_CREATION;
}

const PAYROLL_LOGIN_TYPES = ['yahshua-payroll', 'yg-payroll'];

/**
 * Returns all steps for a given loginType in a flat array.
 * Used by the "restart entire tour" button to replay everything at once.
 */
export function getDashboardTourSteps(loginType: string): TourStep[] {
  const isPayroll = PAYROLL_LOGIN_TYPES.includes(loginType);
  return TOUR_SEGMENTS
    .filter(s => !s.requiresPayroll || isPayroll)
    .flatMap(s => s.steps);
}
