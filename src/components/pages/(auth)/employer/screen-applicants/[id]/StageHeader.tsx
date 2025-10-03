import React, { useContext, useEffect, useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import StateContext from '../contexts/StateContext';
import CustomToast from '@/components/CustomToast';
import useAddStage from '../hooks/useAddStage';
import useUpdateStage from '../hooks/useUpdateStage';

import { PencilIcon } from '@heroicons/react/24/outline';
import SelectChevronDown from '@/svg/SelectChevronDown';

import { initialActionState } from '../lib/initialActionState';
import { ContextTypes, StageHeaderTypes as PropTypes } from '../types';
import actionTypes from '../lib/actionTypes';

interface EnhancedStageHeaderProps extends PropTypes {
  permissions?: {
    can_view: boolean;
    can_move: boolean;
    can_update: boolean;
    is_visible: boolean;
  };
  isDisabled?: boolean;
}

export default function StageHeader({
  index,
  stage,
  stageDropdownId,
  setStageDropdownId,
  jobPostDetailsRefetch,
  appliedApplicantRefetch,
  permissions = { can_view: true, can_move: true, can_update: true, is_visible: true },
  isDisabled = false,
}: EnhancedStageHeaderProps) {
  const params = useParams();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [stageTitle, setStageTitle] = useState(stage.title);
  const [isEditing, setIsEditing] = useState(false);
  const { dispatch, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: addMutate } = useAddStage();
  const { mutate: updateMutate } = useUpdateStage();

  // Check if user can edit this stage
  const canEdit = permissions.can_update || permissions.can_move;
  const canManageStage = !stage.isNewStage && (permissions.can_update || permissions.can_move);

  const handleSave = () => {
    if (!canEdit) {
      toast.custom(() => <CustomToast message='You do not have permission to edit this stage' type='error' />, {
        duration: 7000,
      });
      return;
    }

    let finalTitle;
    if (stageTitle.trim() === '') {
      if (inputRef.current) inputRef.current.select();
      toast.custom(() => <CustomToast message='Stage title cannot be empty' type='error' />, {
        duration: 7000,
      });
      return;
    } else {
      finalTitle = stageTitle.split('\n').join('');
    }
    
    if (stage.isNewStage) {
      saveStage(finalTitle);
    } else {
      updateStageTitle(finalTitle);
      dispatch({
        type: actionTypes.SET_TITLE,
        payload: { title: finalTitle, stageId: stage.id },
      });
    }
    setIsEditing(false);
  };

  const saveStage = (stageTitle: string) => {
    const callbackReq = {
      onSuccess: () => {
        jobPostDetailsRefetch();
        appliedApplicantRefetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    const data: any = {
      title: stageTitle,
      job_posting: params.id,
      order_by: index,
      add_type: stage.addType,
    };
    addMutate(data, callbackReq);
  };

  const updateStageTitle = (stageTitle: any) => {
    const callbackReq = {
      onSuccess: () => {
        jobPostDetailsRefetch();
        appliedApplicantRefetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    let postData = {
      stage_id: stage.id,
      title: stageTitle,
    };
    updateMutate(postData, callbackReq);
  };

  useEffect(() => {
    if (!inputRef.current) return;
    if (isEditing) {
      inputRef.current.select();
    } else {
      inputRef.current.blur();
    }
  }, [isEditing]);

  useEffect(() => {
    if (stage.isNewStage) setIsEditing(true);
  }, [stage.isNewStage]);

  const handleOpenDropdown = () => {
    if (!canManageStage) {
      toast.custom(() => <CustomToast message='You do not have permission to manage this stage' type='error' />, {
        duration: 4000,
      });
      return;
    }
    
    if (stageDropdownId) {
      setStageDropdownId(null);
      return;
    }
    setStageDropdownId(stage.id);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setStageDropdownId(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setStageDropdownId]);

  const handleDropdownToggle = () => {
    if (!canManageStage) return;
    setStageDropdownId(stageDropdownId === stage.id ? null : stage.id);
  };

  return (
    <div className={`flex items-center justify-between gap-2 rounded-md border border-[#ACB9CB] relative ${
      isDisabled ? 'opacity-60' : ''
    }`}>
      <SmartButton 
        id="edit-job-stage-btn"
        type='button' 
        className={`p-4 ${!canEdit || stage.isNewStage ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'}`}
        onClick={() => canEdit && setIsEditing((prev) => !prev)} 
        disabled={stage.isNewStage || !canEdit}
        title={!canEdit ? 'No permission to edit' : 'Edit stage title'}
      >
        <PencilIcon className='w-5' />
      </SmartButton>
      
      <textarea
        rows={stageTitle.length <= 21 ? 1 : 2}
        maxLength={42}
        value={stageTitle}
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          }
        }}
        onChange={(e) => canEdit && setStageTitle(e.target.value)}
        className={`${
          isEditing && canEdit ? 'pointer-events-auto border-b border-black' : 'pointer-events-none'
        } outline-none bg-transparent hidden-scrollbar text-center font-semibold text-[15px] text-indigo-dye ${
          !canEdit ? 'opacity-60' : ''
        }`}
        data-tooltip-id='stage-header-tooltip'
        data-tooltip-content={canEdit ? 'Press enter to save' : 'No permission to edit'}
        data-tooltip-place='bottom'
        disabled={!canEdit}
      />
      
      <button
        onClick={handleDropdownToggle}
        type='button'
        className={`border border-[#ACB9CB] px-3 py-6 rounded-md ${
          !canManageStage ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
        disabled={!canManageStage}
        title={!canManageStage ? 'No permission to manage stage' : 'Stage options'}
      >
        <SelectChevronDown />
      </button>

      {/* Dropdown - only show if user has permissions */}
      {stageDropdownId === stage.id && canManageStage && (
        <div className='grid absolute left-0 right-0 bg-white text-indigo-dye border border-[#ACB9CB] top-full z-20 p-4 gap-3 shadow-md' ref={dropdownRef}>
          <button
            onClick={() => {
              setStageDropdownId(null);
              setActionState({
                ...initialActionState,
                stageId: stage.id,
                modal: {
                  title: `Set-up Stage Requirements: ${stage.title}`,
                  whichModal: 'STAGE_REQUIREMENTS',
                  isOpen: true,
                },
              });
            }}
            type='button'
            className='text-left disabled:opacity-50'
            disabled={stage.isNewStage || !permissions.can_update}
          >
            Set-up Stage Requirements
          </button>
          
          {/* NEW: Assign Users option */}
          <SmartButton
            id="assign-job-stage-btn"
            onClick={() => {
              setStageDropdownId(null);
              setActionState({
                ...initialActionState,
                stageId: stage.id,
                modal: {
                  title: `Assign Users to Stage: ${stage.title}`,
                  whichModal: 'STAGE_ASSIGNMENT',
                  isOpen: true,
                },
              });
            }}
            type='button'
            className='text-left disabled:opacity-50'
            disabled={stage.isNewStage || !permissions.can_update}
          >
            Assign Users
          </SmartButton>
          
          <SmartButton
            id="delete-job-stage-btn"
            onClick={() => {
              setStageDropdownId(null);
              setActionState({
                ...initialActionState,
                stageId: stage.id,
                isNewStage: stage.isNewStage,
                modal: {
                  title: `Are you sure you want to remove stage ${stage.title}?`,
                  whichModal: 'CONFIRMATION',
                  isOpen: true,
                },
              });
            }}
            type='button'
            className='text-left'
            disabled={!permissions.can_update}
          >
            Remove Stage
          </SmartButton>
        </div>
      )}

      <Tooltip id='stage-header-tooltip' style={{ fontSize: '10px' }} />
    </div>
  );
}
