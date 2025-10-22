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
  
  // Count all applicants
  const applicantCount = useMemo(() => {
    return applicants.length;
  }, [applicants]);
  
  return (
    <div className={`flex w-full border-b border-gray-200 ${isDisabled ? 'opacity-60' : ''}`}>
      <button
        disabled={isDisabled}
        className={`flex-1 py-1.5 text-center text-sm font-medium text-gray-700 ${isDisabled ? 'cursor-not-allowed' : ''}`}
      >
        <span>Applicants ({applicantCount})</span>
      </button>
    </div>
  );
} 