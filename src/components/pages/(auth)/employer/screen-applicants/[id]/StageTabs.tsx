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
  const { applicants, orderBy } = stage;
  
  // Only show "Not Fit" tab on the first stage (orderBy = 0) since it's based on screening answers
  const isFirstStage = orderBy === 0;
  
  // Count good fit and not fit applicants based on stage position
  const counts = useMemo(() => {
    if (isFirstStage) {
      // For first stage, use screening fit for both good and not fit
      const goodFitCount = applicants.filter((applicant: ApplicantType) => {
        if (applicant.screeningFit) {
          return applicant.screeningFit === 'good';
        }
        return applicant.status === 'passed' || applicant.status === 'ongoing' || applicant.status === 'hired';
      }).length;
      
      const notFitCount = applicants.filter((applicant: ApplicantType) => {
        if (applicant.screeningFit) {
          return applicant.screeningFit === 'bad';
        }
        return applicant.status === 'rejected' || applicant.status === 'withdrawn';
      }).length;
      
      return { goodFitCount, notFitCount, hiredCount: 0 };
    } else {
      // For non-first stages, all applicants are considered "Good Fit" since they've progressed
      const goodFitCount = applicants.length; // All applicants in non-first stages are good fit
      const notFitCount = 0; // No "Not Fit" applicants in non-first stages
      
      return { goodFitCount, notFitCount, hiredCount: 0 };
    }
  }, [applicants, isFirstStage]);

  // Check if tab should be visible based on filters and stage position
  const showGoodFitTab = !filters || filters.rating.includes('Good Fit');
  const showNotFitTab = isFirstStage && (!filters || filters.rating.includes('Not Fit'));
  
  // If the active tab is hidden, switch to a visible tab
  if ((activeTab === 'Good Fit' && !showGoodFitTab) || 
      (activeTab === 'Not Fit' && !showNotFitTab)) {
    if (showGoodFitTab) {
      setActiveTab('Good Fit');
    } else if (showNotFitTab) {
      setActiveTab('Not Fit');
    }
  }
  
  // For non-first stages, ensure we're not on "Not Fit" tab since it's not available
  if (!isFirstStage && activeTab === 'Not Fit') {
    setActiveTab('Good Fit');
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
          {isFirstStage ? (
            <>
              <span className={activeTab === 'Good Fit' ? 'text-green-500' : 'text-gray-500'}>
                Good Fit
              </span>{' '}
              <span className={`${activeTab === 'Good Fit' ? 'text-green-500' : 'text-gray-500'}`}>
                ({counts.goodFitCount})
              </span>
            </>
          ) : (
            // For non-first stages, only show the count without the "Good Fit" label
            <span className={`${activeTab === 'Good Fit' ? 'text-gray-700' : 'text-gray-500'}`}>
              Applicants ({counts.goodFitCount})
            </span>
          )}
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