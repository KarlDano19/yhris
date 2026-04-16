import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { FilterValues } from '@/components/common/Filter';

export type StateType = StageType[];

export type BlockPropTypes = {
  stage: StageType;
  index: number;
  provided: any;
  snapshot: any;
  jobPostDetailsRefetch: any;
  appliedApplicantRefetch: any;
  filters?: FilterValues;
};

export type WrapperPropTypes = {
  children: React.ReactNode;
  maxWidth?: string;
  title: string;
  backText?: string;
  backLink?: string;
};

export type PersonPropTypes = {
  applicant: ApplicantType;
  isOpenMenu: boolean;
  setOpenMenuId: any;
  stage: StageType;
};

export type ModalLayoutTypes = {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  handleClose: any;
  nestedModals?: React.ReactNode;
  maxWidth?: string;
};

export type StageRequirementsTypes = {
  title: string;
  requirements: string[];
  handleFormSubmit: any;
};

export type ScheduleInterviewPropTypes = {
  title: string;
  handleFormSubmit: any;
  isSendInterviewScheduleLoading: any;
};

export type SendEmailPropTypes = {
  title: string;
  handleFormSubmit: any;
};

export type SuccessPropTypes = {
  title: string;
};

export type ChecklistPropTypes = {
  title: string;
  requirements: string[];
  handleFormSubmit: any;
};

export interface StageNoteType {
  id?: number;
  job_stage: number;
  stage_title: string;
  stage_order: number;
  notes: string;
  created_at?: string;
}

export interface StageApprovalType {
  id: number;
  job_stage: number;
  stage_title: string;
  stage_order: number;
  is_approved: boolean;
  is_skipped: boolean;
  approved_by_name: string | null;
  approved_by_photo: string | null;
  approval_remarks: string | null;
  approval_date: string | null;
  signature: string | null;
  created_at: string;
}

export type T_ApproveStagePayload = {
  stage_id: number;
  signature: string | null;
  approval_remarks: string | null;
  approval_date: string | null;
  is_skipped: boolean;
};

export type T_EAFData = {
  id: number;
  document_number: string;
  applied_job: number;
  created_by_name: string | null;
  pdf_url: string | null;
  finalized_at: string | null;
  stage_approvals: StageApprovalType[];
  created_at: string;
};

export type ApplicantType = {
  id: number;
  email: string | null;
  applicationId: number;
  photo_url: string;
  image?: string | null;
  name: string;
  checklists: string[];
  status: 'ongoing' | 'withdrawn' | 'rejected' | 'passed' | 'hired' | 'pooling' | null | undefined;
  stagePosition: number;
  stage_notes?: StageNoteType[];
  stage_approvals?: StageApprovalType[];
  job_stages_title?: string;
  screeningFit?: 'good' | 'bad';
  screeningAnswers?: Array<{
    question: string;
    answer: string;
    idealAnswer?: string;
    mustHave?: boolean;
    isMatch?: boolean;
  }>;
  is_archived?: boolean;
  has_account?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ApplicantsType = [] | ApplicantType[];

export type StageType = {
  id: number;
  title: string;
  isNewStage: boolean;
  requirements: string[];
  applicants: ApplicantsType;
  orderBy: number;
  addType: string;
  is_final_stage?: boolean;
  permissions?: {
    can_view: boolean;
    can_move: boolean;
    can_update: boolean;
    is_visible: boolean;
  };
};

export type ActionStateType = {
  modal: {
    whichModal: null | string;
    isOpen: boolean;
    title: string;
  };
  isNewStage?: boolean;
  stageId: number | null;
  applicantId: number | null;
  isFinalStage: boolean;
  email: string | null;
};

export type StagePropTypes = {
  stage: StageType;
  stageDropdownId: number | null;
  setStageDropdownId: any;
  setActionState: any;
  dispatch: any;
};

export type ContextTypes = {
  state: StateType;
  dispatch: any;
  actionState: any;
  setActionState: any;
};

export type ModalTypes = {
  [key: string]: {
    component: ReactNode;
    dispatch?: {
      type: string;
      payload?: any;
    };
  };
};

export type StageHeaderTypes = {
  index: number;
  stage: StageType;
  stageDropdownId: number | null;
  setStageDropdownId: any;
  jobPostDetailsRefetch: any;
  appliedApplicantRefetch: any;
};

export type StageBlockTypes = {
  stage: StageType;
  index: number;
  openMenuId: number | null;
  setOpenMenuId: any;
  filters?: FilterValues;
};