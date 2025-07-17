'use client';

import { useMemo } from 'react';
import { ApplicantType, StageType } from '../types';
import { FilterOptions } from './Filter';

interface StageTabsProps {
  stage: StageType;
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  filters?: FilterOptions;
}

export default function StageTabs({ stage, activeTab, setActiveTab, filters }: StageTabsProps) {
  const { applicants } = stage;
  
  // Count good fit and not fit applicants based on screening answers
  const counts = useMemo(() => {
    // Count applicants by their screeningFit property if available
    const goodFitCount = applicants.filter((applicant: ApplicantType) => {
      if (applicant.screeningFit) {
        return applicant.screeningFit === 'good';
      }
      // Fall back to status-based determination if screeningFit is not available
      return applicant.status === 'passed' || applicant.status === 'ongoing' || applicant.status === 'hired';
    }).length;
    
    const notFitCount = applicants.filter((applicant: ApplicantType) => {
      if (applicant.screeningFit) {
        return applicant.screeningFit === 'bad';
      }
      // Fall back to status-based determination if screeningFit is not available
      return applicant.status === 'rejected' || applicant.status === 'withdrawn';
    }).length;
    
    return { goodFitCount, notFitCount };
  }, [applicants]);
  
  return (
    <div className="flex w-full border-b border-gray-200">
      <button
        onClick={() => setActiveTab('Good Fit')}
        className={`flex-1 py-1.5 text-center text-sm ${
          activeTab === 'Good Fit' 
            ? 'font-medium' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <span className={activeTab === 'Good Fit' ? 'text-green-500' : 'text-gray-500'}>
          Good Fit
        </span>{' '}
        <span className={`${activeTab === 'Good Fit' ? 'text-green-500' : 'text-gray-500'}`}>
          ({counts.goodFitCount})
        </span>
      </button>
      <button
        onClick={() => setActiveTab('Not Fit')}
        className={`flex-1 py-1.5 text-center text-sm ${
          activeTab === 'Not Fit' 
            ? 'text-indigo-dye font-medium' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <span className={activeTab === 'Not Fit' ? 'text-red-500' : 'text-gray-500'}>
          Not Fit
        </span>{' '}
        <span className={`${activeTab === 'Not Fit' ? 'text-red-500' : 'text-gray-500'}`}>
          ({counts.notFitCount})
        </span>
      </button>
    </div>
  );
} 