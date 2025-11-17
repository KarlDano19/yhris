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
  const { applicants } = stage;
  
  // Apply status filters to applicants and sort by newest to oldest
  const filteredApplicants = useMemo(() => {
    let filtered = applicants;
    
    if (filters) {
      filtered = applicants.filter((applicant: ApplicantType) => {
        const matchesStatus = filters.status.some(status => 
          applicant.status && status.toLowerCase() === applicant.status.toLowerCase()
        );
        
        return matchesStatus;
      });
    }

    // Sort applicants with priority: New applicants first, then by date
    return filtered.sort((a: ApplicantType, b: ApplicantType) => {
      // Helper function to check if applicant is a new applicant
      const isNewApplicant = (applicant: ApplicantType) => {
        // Check if this is the first stage (orderBy === 0) and no stage notes
        const isFirstStage = stage.orderBy === 0;
        const hasStageNotes = applicant.stage_notes && applicant.stage_notes.length > 0;
        const currentStageNote = applicant.stage_notes?.find(note => note.job_stage === stage.id);
        
        // New applicant: first stage, no stage notes, and no current stage note
        return isFirstStage && !hasStageNotes && !currentStageNote;
      };
      
      const aIsNew = isNewApplicant(a);
      const bIsNew = isNewApplicant(b);
      
      // Prioritize new applicants first
      if (aIsNew && !bIsNew) return -1; // a comes first
      if (!aIsNew && bIsNew) return 1;  // b comes first
      
      // If both are new or both are not new, sort by date (newest first)
      const dateA = new Date(a.updated_at || a.created_at || new Date());
      const dateB = new Date(b.updated_at || b.created_at || new Date());
      
      return dateB.getTime() - dateA.getTime();
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
