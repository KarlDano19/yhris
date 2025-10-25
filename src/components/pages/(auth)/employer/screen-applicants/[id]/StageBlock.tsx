import { useContext, useMemo } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import StateContext from '../contexts/StateContext';
import Person from './Person';

import { ContextTypes, StageBlockTypes as PropTypes, ApplicantType } from '../types';
import actionTypes from '../lib/actionTypes';

import { PlusIcon } from '@heroicons/react/24/outline';

interface EnhancedStageBlockProps extends PropTypes {
  permissions?: {
    can_view: boolean;
    can_move: boolean;
    can_update: boolean;
    is_visible: boolean;
  };
  isDisabled?: boolean;
}

export default function StageBlock({ 
  stage, 
  index, 
  openMenuId, 
  setOpenMenuId, 
  filters,
  permissions = { can_view: true, can_move: true, can_update: true, is_visible: true },
  isDisabled = false 
}: EnhancedStageBlockProps) {
  const { state, dispatch }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { applicants, orderBy } = stage;
  
  // Only apply "Not Fit" filtering on the first stage (orderBy = 0)
  const isFirstStage = orderBy === 0;
  
  // Apply filters to applicants
  const filteredApplicants = useMemo(() => {
    if (!filters) {
      return applicants;
    }

    return applicants.filter((applicant: ApplicantType) => {
      let isGoodFit: boolean;
      let isNotFit: boolean;
      
      if (isFirstStage) {
        // For first stage, use screening fit for both good and not fit
        if (applicant.screeningFit) {
          isGoodFit = applicant.screeningFit === 'good';
          isNotFit = applicant.screeningFit === 'bad';
        } else {
          isGoodFit = applicant.status === 'passed' || applicant.status === 'ongoing' || applicant.status === 'hired';
          isNotFit = applicant.status === 'rejected' || applicant.status === 'withdrawn';
        }
      } else {
        // For non-first stages, all applicants are considered "Good Fit" since they've progressed
        // Hired applicants are always "Good Fit" regardless of original screening
        isGoodFit = true; // All applicants in non-first stages are considered good fit
        isNotFit = false; // No "Not Fit" applicants in non-first stages
      }
      
      let matchesRating = false;
      if (filters.rating.includes('Good Fit') && isGoodFit) {
        matchesRating = true;
      }
      // Only apply "Not Fit" filtering on the first stage
      if (isFirstStage && filters.rating.includes('Not Fit') && isNotFit) {
        matchesRating = true;
      }
      
      const matchesStatus = filters.status.some(status => 
        applicant.status && status.toLowerCase() === applicant.status.toLowerCase()
      );
      
      return matchesRating && matchesStatus;
    });
  }, [applicants, filters, isFirstStage]);
  
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

  // Show restricted access message if stage is disabled
  if (isDisabled && (!permissions.can_view || filteredApplicants.length === 0)) {
    return (
      <div className={`rounded-2xl px-7 py-2 h-[500px] relative overflow-y-auto ${
        isDisabled ? 'bg-gray-100' : 'bg-[#EBF3FF]'
      }`}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">
            🔒 Restricted Access
          </div>
          <div className="text-gray-400 text-xs">
            You cannot view or manage<br/>applicants in this stage
          </div>
          {stage.applicants?.length > 0 && (
            <div className="text-gray-400 text-xs mt-2">
              {stage.applicants.length} applicant(s) in this stage
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show limited view for users without view permission but can see count
  if (!permissions.can_view && !isDisabled) {
    return (
      <div className='bg-gray-100 rounded-2xl px-7 py-2 h-[500px] relative overflow-y-auto'>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-gray-500 text-sm font-medium mb-2">
            👁️ View Restricted
          </div>
          <div className="text-gray-400 text-xs">
            {stage.applicants?.length || 0} applicant(s) in this stage<br/>
            Contact admin for viewing access
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-2xl px-7 py-2 h-[500px] relative overflow-y-auto ${
        isDisabled ? 'bg-gray-100 opacity-60' : 'bg-[#EBF3FF]'
      }`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#2d3e58 #f1f1f1'
      }}
    >
      {filteredApplicants.length ? (
        filteredApplicants.map((applicant) => {
          return (
            <Person
              key={applicant.id}
              applicant={applicant}
              isOpenMenu={openMenuId === applicant.id}
              setOpenMenuId={setOpenMenuId}
              stage={stage}
              permissions={permissions}
              isStageDisabled={isDisabled}
            />
          );
        })
      ) : (
        <button
          onClick={handleAddStage}
          type='button'
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex rounded-2xl transition-all ${
            isDisabled || !permissions.can_update 
              ? 'cursor-not-allowed opacity-30' 
              : 'hover:bg-savoy-blue/[.025] cursor-pointer'
          }`}
          disabled={isDisabled || !permissions.can_update}
        >
          <PlusIcon className='text-[#CCE0FF] w-12 h-12 m-auto' />
        </button>
      )}
    </div>
  );
}
