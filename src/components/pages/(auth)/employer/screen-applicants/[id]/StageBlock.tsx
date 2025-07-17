import { useContext, useMemo } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import StateContext from '../contexts/StateContext';
import Person from './Person';

import { ContextTypes, StageBlockTypes as PropTypes, ApplicantType } from '../types';
import actionTypes from '../lib/actionTypes';

import { PlusIcon } from '@heroicons/react/24/outline';

export default function StageBlock({ stage, index, openMenuId, setOpenMenuId, filters }: PropTypes) {
  const { state, dispatch }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { applicants } = stage;
  
  // Apply filters to applicants
  const filteredApplicants = useMemo(() => {
    if (!filters) {
      return applicants;
    }

    return applicants.filter((applicant: ApplicantType) => {
      // Determine if applicant is a good fit based on screening answers
      // Priority order:
      // 1. Use explicit screeningFit property if available
      // 2. Fall back to status based filtering
      
      let isGoodFit: boolean;
      let isNotFit: boolean;
      
      if (applicant.screeningFit) {
        // Use the screening answers fit evaluation
        isGoodFit = applicant.screeningFit === 'good';
        isNotFit = applicant.screeningFit === 'bad';
      } else {
        // Fall back to status-based logic
        isGoodFit = applicant.status === 'passed' || applicant.status === 'ongoing' || applicant.status === 'hired';
        isNotFit = applicant.status === 'rejected' || applicant.status === 'withdrawn';
      }
      
      // Check if the applicant matches the active tab
      let matchesRating = false;
      if (filters.rating.includes('Good Fit') && isGoodFit) {
        matchesRating = true;
      } else if (filters.rating.includes('Not Fit') && isNotFit) {
        matchesRating = true;
      } else if (filters.rating.length === 0) {
        matchesRating = true;
      }
      
      // Filter by status (ongoing, passed, withdrawn, rejected)
      const matchesStatus = 
        filters.status.some(status => 
          applicant.status && status.toLowerCase() === applicant.status.toLowerCase()
        ) || 
        filters.status.length === 0;
      
      return matchesRating && matchesStatus;
    });
  }, [applicants, filters]);
  
  const handleAddStage = () => {
    const hasPendingStage = state.some((stage: any) => stage.isNewStage);
    if (hasPendingStage) {
      toast.custom(() => <CustomToast message='Cannot add yet, you still have pending stage.' type='error' />, {
        duration: 7000,
      });
    } else {
      dispatch({
        type: actionTypes.ADD_STAGE,
        payload: { id: new Date().getTime(), addType: 'adjacent', index },
      });
    }
  };

  return (
    <div className='bg-[#EBF3FF] rounded-2xl px-7 py-2 h-[500px] relative overflow-y-auto'>
      {filteredApplicants.length ? (
        filteredApplicants.map((applicant) => {
          return (
            <Person
              key={applicant.id}
              applicant={applicant}
              isOpenMenu={openMenuId === applicant.id}
              setOpenMenuId={setOpenMenuId}
              stage={stage}
            />
          );
        })
      ) : (
        <button
          onClick={handleAddStage}
          type='button'
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex hover:bg-savoy-blue/[.025] rounded-2xl transition-all'
        >
          <PlusIcon className='text-[#CCE0FF] w-12 h-12 m-auto' />
        </button>
      )}
    </div>
  );
}
