'use client';

import { useMemo } from 'react';
import { ApplicantType, StageType } from '../types';
import { FilterOptions } from './Filter';

interface StageTabsProps {
  stage: StageType;
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  filters?: FilterOptions;
  isDisabled?: boolean;
}

export default function StageTabs({ stage, activeTab, setActiveTab, filters, isDisabled = false }: StageTabsProps) {
  const { applicants } = stage;
  
  // Count good fit and not fit applicants based on screening answers
  const counts = useMemo(() => {
    const goodFitCount = applicants.filter((applicant: ApplicantType) => {
      if (applicant.screeningFit) {
        return applicant.screeningFit === 'good';
      }
      return applicant.status === 'passed' || applicant.status === 'ongoing';
    }).length;
    
    const notFitCount = applicants.filter((applicant: ApplicantType) => {
      if (applicant.screeningFit) {
        return applicant.screeningFit === 'bad';
      }
      return applicant.status === 'rejected' || applicant.status === 'withdrawn';
    }).length;
    
    const hiredCount = applicants.filter((applicant: ApplicantType) => {
      return applicant.status === 'hired';
    }).length;
    
    return { goodFitCount, notFitCount, hiredCount };
  }, [applicants]);

  // Check if tab should be visible based on filters
  const showGoodFitTab = !filters || filters.rating.includes('Good Fit');
  const showNotFitTab = !filters || filters.rating.includes('Not Fit');
  
  // If the active tab is hidden, switch to a visible tab
  if ((activeTab === 'Good Fit' && !showGoodFitTab) || 
      (activeTab === 'Not Fit' && !showNotFitTab)) {
    if (showGoodFitTab) {
      setActiveTab('Good Fit');
    } else if (showNotFitTab) {
      setActiveTab('Not Fit');
    }
  }
  
  return (
    <div className={`flex w-full border-b border-gray-200 ${isDisabled ? 'opacity-60' : ''}`}>
      {showGoodFitTab && (
        <button
          onClick={() => !isDisabled && setActiveTab('Good Fit')}
          disabled={isDisabled}
          className={`flex-1 py-1.5 text-center text-sm ${
            activeTab === 'Good Fit' 
              ? 'font-medium' 
              : 'text-gray-500 hover:text-gray-700'
          } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={activeTab === 'Good Fit' ? 'text-green-500' : 'text-gray-500'}>
            Good Fit
          </span>{' '}
          <span className={`${activeTab === 'Good Fit' ? 'text-green-500' : 'text-gray-500'}`}>
            ({counts.goodFitCount})
          </span>
        </button>
      )}
      {showNotFitTab && (
        <button
          onClick={() => !isDisabled && setActiveTab('Not Fit')}
          disabled={isDisabled}
          className={`flex-1 py-1.5 text-center text-sm ${
            activeTab === 'Not Fit' 
              ? 'text-indigo-dye font-medium' 
              : 'text-gray-500 hover:text-gray-700'
          } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={activeTab === 'Not Fit' ? 'text-red-500' : 'text-gray-500'}>
            Not Fit
          </span>{' '}
          <span className={`${activeTab === 'Not Fit' ? 'text-red-500' : 'text-gray-500'}`}>
            ({counts.notFitCount})
          </span>
        </button>
      )}
    </div>
  );
} 