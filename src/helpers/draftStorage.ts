import { T_JobPostingDraftData } from '@/types/job_posting_draft';

const DRAFT_STORAGE_KEY = 'job_posting_draft';
const DRAFT_TIMESTAMP_KEY = 'job_posting_draft_timestamp';
const DRAFT_STEP_KEY = 'job_posting_draft_step';

interface DraftStorage {
  data: T_JobPostingDraftData;
  step: number;
  timestamp: number;
}

export const draftStorage = {
  /**
   * Save draft data to localStorage
   */
  save: (data: T_JobPostingDraftData, currentStep: number): void => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(DRAFT_STEP_KEY, currentStep.toString());
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      // console.error('Failed to save draft to localStorage:', error);
    }
  },

  /**
   * Load draft data from localStorage
   */
  load: (): DraftStorage | null => {
    try {
      const dataStr = localStorage.getItem(DRAFT_STORAGE_KEY);
      const stepStr = localStorage.getItem(DRAFT_STEP_KEY);
      const timestampStr = localStorage.getItem(DRAFT_TIMESTAMP_KEY);

      if (!dataStr || !stepStr || !timestampStr) {
        return null;
      }

      return {
        data: JSON.parse(dataStr),
        step: parseInt(stepStr, 10),
        timestamp: parseInt(timestampStr, 10),
      };
    } catch (error) {
      // console.error('Failed to load draft from localStorage:', error);
      return null;
    }
  },

  /**
   * Clear draft data from localStorage
   */
  clear: (): void => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_STEP_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
    } catch (error) {
      // console.error('Failed to clear draft from localStorage:', error);
    }
  },

  /**
   * Check if draft exists in localStorage
   */
  exists: (): boolean => {
    return localStorage.getItem(DRAFT_STORAGE_KEY) !== null;
  },

  /**
   * Get the age of the draft in milliseconds
   */
  getAge: (): number | null => {
    try {
      const timestampStr = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
      if (!timestampStr) {
        return null;
      }
      const timestamp = parseInt(timestampStr, 10);
      return Date.now() - timestamp;
    } catch (error) {
      // console.error('Failed to get draft age:', error);
      return null;
    }
  },
};
