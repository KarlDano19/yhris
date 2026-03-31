import { T_JobPostingDraftData } from '@/types/job_posting';

const DRAFT_STORAGE_KEY = 'job_posting_draft';
const DRAFT_TIMESTAMP_KEY = 'job_posting_draft_timestamp';

interface DraftStorage {
  data: T_JobPostingDraftData;
  timestamp: number;
}

export const draftStorage = {
  /**
   * Save draft data to localStorage
   */
  save: (data: T_JobPostingDraftData): void => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
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
      const timestampStr = localStorage.getItem(DRAFT_TIMESTAMP_KEY);

      if (!dataStr || !timestampStr) {
        return null;
      }

      return {
        data: JSON.parse(dataStr),
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
