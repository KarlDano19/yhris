import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { FilterOptions } from './[id]/Filter';

export type StateType = StageType[];

export type BlockPropTypes = {
  stage: StageType;
  index: number;
  provided: any;
  snapshot: any;
  jobPostDetailsRefetch: any;
  appliedApplicantRefetch: any;
  filters?: FilterOptions;
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

export type ApplicantType = {
  id: number;
  email: string | null;
  applicationId: number;
  photo_url: string;
  name: string;
  checklists: string[];
  status: 'ongoing' | 'withdrawn' | 'rejected' | 'passed' | 'hired' | null | undefined;
  stagePosition: number;
  stage_notes?: StageNoteType[];
  job_stages_title?: string;
  screeningFit?: 'good' | 'bad';
  screeningAnswers?: Array<{
    question: string;
    answer: string;
    idealAnswer?: string;
    mustHave?: boolean;
    isMatch?: boolean;
  }>;
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
  filters?: FilterOptions;
};
