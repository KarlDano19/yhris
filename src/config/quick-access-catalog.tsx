import React from 'react';

import CreateJobLogo from '@/svg/CreateJob';
import JobPostingHistory from '@/svg/JobPostingHistory';
import EnvelopeIcon from '@/svg/EnvelopeIcon';
import AddressEmployeeIssueLogo from '@/svg/AddressEmployeeIssueLogo';
import CreateMemoLogo from '@/svg/CreateMemoLogo';
import BenefitsLogo from '@/svg/BenefitsLogo';
import EmployeeLogo from '@/svg/EmployeeLogo';
import EmployeeMovementLogo from '@/svg/EmployeeMovementLogo';
import DocumentGeneratorLogo from '@/svg/DocumentGeneratorLogo';
import Employee201RecordsLogo from '@/svg/Employee201RecordsLogo';
import OrgStructureLogo from '@/svg/OrgStructureLogo';
import EvaluationTemplateLogo from '@/svg/EvaluationTemplateLogo';
import EvaluationScheduler from '@/svg/EvaluationSchedulerLogo';
import EvaluationHistory from '@/svg/EvalHistoryLogo';
import EmployeeCompensitionLogbookLogo from '@/svg/EmployeeCompensitionLogbookLogo';
import WorkAccidentIllnessReportLogo from '@/svg/WorkAccidentIllnessReportLogo';
import WemLogo from '@/svg/WemLogo';
import AnnualWAIR from '@/svg/AnnualWAIR';
import HealthAndSafetyReportLogo from '@/svg/HealthAndSafetyReportLogo';
import ShcMeetingOfMinutesLogo from '@/svg/ShcMeetingOfMinutesLogo';
import AnnualMedicalReportLogo from '@/svg/AnnualMedicalReportLogo';
import OSHProgramLogo from '@/svg/OSHProgramLogo';
import GeneralSettingsLogo from '@/svg/GeneralSettingIcon';
import UserLogo from '@/svg/UserIcon';
import EmployeeIdLogo from '@/svg/EmployeeIdLogo';
import ThirdPartyPlaformLogo from '@/svg/ThirdPartyPlaformLogo';
import EmployeeMovementIcon from '@/svg/EmployeeMovementIcon';
import AccountsIcon from '@/svg/AccountsIcon';

export type QuickAccessCatalogItem = {
  id: string;
  label: string;
  url: string;
  parentModule: string;
  permissionId: string;
  iconComponent: React.ComponentType;
};

export const QUICK_ACCESS_CATALOG: QuickAccessCatalogItem[] = [
  // Post a Job
  { id: 'post-job-create', label: 'Create a Job', url: '/post-job?create=true', parentModule: 'Post a Job', permissionId: 'post-job-page', iconComponent: CreateJobLogo },
  { id: 'post-job-history', label: 'Job Posting History', url: '/post-job/job-posting-history', parentModule: 'Post a Job', permissionId: 'post-job-page', iconComponent: JobPostingHistory },

  // Talent Search
  { id: 'talent-search-email-history', label: 'Email History', url: '/talent-search/email-history', parentModule: 'Talent Search', permissionId: 'talent-search-page', iconComponent: EnvelopeIcon },

  // Manage — ordered to match the Manage page
  { id: 'manage-address-issue', label: 'Address Employee Issue', url: '/manage/address-employee-issue', parentModule: 'Manage', permissionId: 'manage-page', iconComponent: AddressEmployeeIssueLogo },
  { id: 'manage-memo-policy', label: 'Create Memo/Policy', url: '/manage/create-memo-policy', parentModule: 'Manage', permissionId: 'manage-page', iconComponent: CreateMemoLogo },
  { id: 'manage-design-benefits', label: 'Design Benefits', url: '/manage/design-benefits', parentModule: 'Manage', permissionId: 'manage-page', iconComponent: BenefitsLogo },
  { id: 'manage-employees', label: 'Employee List', url: '/manage/employees', parentModule: 'Manage', permissionId: 'manage-page', iconComponent: EmployeeLogo },
  { id: 'manage-movement', label: 'Employee Movement', url: '/manage/employee-movement', parentModule: 'Manage', permissionId: 'manage-page', iconComponent: EmployeeMovementLogo },
  { id: 'manage-document-generator', label: 'Document Generator', url: '/manage/document-generator', parentModule: 'Manage', permissionId: 'manage-page', iconComponent: DocumentGeneratorLogo },
  { id: 'manage-201-records', label: 'Employee 201 Records', url: '/manage/employee-201-records', parentModule: 'Manage', permissionId: 'manage-page', iconComponent: Employee201RecordsLogo },
  { id: 'manage-org-structure', label: 'Org Structure', url: '/manage/org-structure', parentModule: 'Manage', permissionId: 'manage-page', iconComponent: OrgStructureLogo },

  // Evaluation
  { id: 'evaluation-template', label: 'Evaluation Template', url: '/evaluation/evaluation-template', parentModule: 'Evaluation', permissionId: 'evaluation-page', iconComponent: EvaluationTemplateLogo },
  { id: 'evaluation-scheduler', label: 'Evaluation Scheduler', url: '/evaluation/evaluation-scheduler', parentModule: 'Evaluation', permissionId: 'evaluation-page', iconComponent: EvaluationScheduler },
  { id: 'evaluation-history', label: 'Evaluation History', url: '/evaluation/evaluation-history', parentModule: 'Evaluation', permissionId: 'evaluation-page', iconComponent: EvaluationHistory },

  // DOLE — ordered to match the DOLE page
  { id: 'dole-ec-logbook', label: 'Employee Compensation Logbook', url: '/dole/employee-compensation-logbook', parentModule: 'DOLE', permissionId: 'dole-page', iconComponent: EmployeeCompensitionLogbookLogo },
  { id: 'dole-wair', label: 'Work Accident/Illness Report', url: '/dole/work-accident-illness-report', parentModule: 'DOLE', permissionId: 'dole-page', iconComponent: WorkAccidentIllnessReportLogo },
  { id: 'dole-work-environment', label: 'Work Environment Measurement', url: '/dole/work-environment-measurement-request', parentModule: 'DOLE', permissionId: 'dole-page', iconComponent: WemLogo },
  { id: 'dole-awair', label: 'Annual WAIR Data Report', url: '/dole/annual-work-accident-illness-exposure-data-report', parentModule: 'DOLE', permissionId: 'dole-page', iconComponent: AnnualWAIR },
  { id: 'dole-hso-report', label: 'Health & Safety Org Report', url: '/dole/health-and-safety-organization-report', parentModule: 'DOLE', permissionId: 'dole-page', iconComponent: HealthAndSafetyReportLogo },
  { id: 'dole-shc-minutes', label: 'SHC Minutes of Meetings', url: '/dole/shc-minutes-of-meetings', parentModule: 'DOLE', permissionId: 'dole-page', iconComponent: ShcMeetingOfMinutesLogo },
  { id: 'dole-annual-medical', label: 'Annual Medical Report', url: '/dole/annual-medical-report', parentModule: 'DOLE', permissionId: 'dole-page', iconComponent: AnnualMedicalReportLogo },
  { id: 'dole-osh-program', label: 'OSH Program', url: '/dole/osh-program', parentModule: 'DOLE', permissionId: 'dole-page', iconComponent: OSHProgramLogo },

  // Settings — top-level sub-pages
  { id: 'settings-general', label: 'General Settings', url: '/settings/general-settings', parentModule: 'Settings', permissionId: 'settings-page', iconComponent: GeneralSettingsLogo },
  { id: 'settings-users', label: 'Users', url: '/settings/users', parentModule: 'Settings', permissionId: 'settings-page', iconComponent: UserLogo },
  { id: 'settings-org-structure', label: 'Org Structure Settings', url: '/settings/org-structure', parentModule: 'Settings', permissionId: 'settings-page', iconComponent: OrgStructureLogo },

  // Settings > General Settings sub-pages (Hiring skipped — disabled)
  { id: 'settings-general-employees', label: 'Employees', url: '/settings/general-settings/employees', parentModule: 'Settings › General Settings', permissionId: 'settings-page', iconComponent: EmployeeIdLogo },
  { id: 'settings-general-email-template', label: 'Email Template', url: '/settings/general-settings/email-template', parentModule: 'Settings › General Settings', permissionId: 'settings-page', iconComponent: EnvelopeIcon },
  { id: 'settings-general-third-party', label: 'Third Party Platform', url: '/settings/general-settings/third-party-platform', parentModule: 'Settings › General Settings', permissionId: 'settings-page', iconComponent: ThirdPartyPlaformLogo },
  { id: 'settings-general-movement', label: 'Employee Movement Settings', url: '/settings/general-settings/employee-movement', parentModule: 'Settings › General Settings', permissionId: 'settings-page', iconComponent: EmployeeMovementIcon },

  // Settings > Users sub-pages
  { id: 'settings-users-accounts', label: 'Accounts', url: '/settings/users/accounts', parentModule: 'Settings › Users', permissionId: 'settings-page', iconComponent: AccountsIcon },
  { id: 'settings-users-roles', label: 'Roles', url: '/settings/users/roles', parentModule: 'Settings › Users', permissionId: 'settings-page', iconComponent: UserLogo },
];

export const MAX_QUICK_ACCESS_ITEMS = 12;

export function getCatalogItemById(id: string): QuickAccessCatalogItem | undefined {
  return QUICK_ACCESS_CATALOG.find((item) => item.id === id);
}
