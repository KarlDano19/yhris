import { useContext, useEffect, useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import StateContext from '../contexts/StateContext';
import CustomToast from '@/components/CustomToast';
import useAddStage from '../hooks/useAddStage';
import useUpdateStage from '../hooks/useUpdateStage';

import { PencilIcon } from '@heroicons/react/24/outline';
import SelectChevronDown from '@/svg/SelectChevronDown';

import { initialActionState } from '../lib/initialActionState';
import { ContextTypes, StageHeaderTypes as PropTypes } from '../types';
import actionTypes from '../lib/actionTypes';

export default function StageHeader({
  index,
  stage,
  stageDropdownId,
  setStageDropdownId,
  jobPostDetailsRefetch,
  appliedApplicantRefetch,
}: PropTypes) {
  const params = useParams();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(stage.title);
  const [isEditing, setIsEditing] = useState(false);
  const { dispatch, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { mutate: addMutate } = useAddStage();
  const { mutate: updateMutate } = useUpdateStage();

  const handleSave = () => {
    let stageTitle;
    if (title.trim() === '') {
      if (inputRef.current) inputRef.current.select();
      toast.custom(() => <CustomToast message='Stage title cannot be empty' type='error' />, {
        duration: 7000,
      });
      return;
    } else {
      stageTitle = title.split('\n').join('');
    }
    if (stage.isNewStage) {
      saveStage(stageTitle);
    } else {
      updateStageTitle(stageTitle);
      dispatch({
        type: actionTypes.SET_TITLE,
        payload: { title: stageTitle, stageId: stage.id },
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
    if (stageDropdownId) {
      setStageDropdownId(null);
      return;
    }
    setStageDropdownId(stage.id);
  };

  return (
    <div className='flex items-center justify-between gap-2 rounded-md border border-[#ACB9CB] relative'>
      <button type='button' className='p-4' onClick={() => setIsEditing((prev) => !prev)}>
        <PencilIcon className='w-5' />
      </button>
      <textarea
        rows={title.length <= 21 ? 1 : 2}
        maxLength={42}
        value={title}
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          }
        }}
        onChange={(e) => setTitle(e.target.value)}
        className={`${
          isEditing ? 'pointer-events-auto border-b border-black' : 'pointer-events-none'
        } outline-none bg-transparent hidden-scrollbar text-center font-semibold text-[15px] text-indigo-dye`}
        data-tooltip-id='stage-header-tooltip'
        data-tooltip-content='Press enter to save'
        data-tooltip-place='bottom'
      >
        <Tooltip id='stage-header-tooltip' style={{ fontSize: '10px' }} />
        {stage.title}
      </textarea>
      <button
        onClick={handleOpenDropdown}
        type='button'
        className='border border-[#ACB9CB] px-3 py-6 rounded-md disabled:opacity-50'
        disabled={stage.isNewStage}
      >
        <SelectChevronDown />
      </button>

      {/* dropdown */}
      {stageDropdownId === stage.id && (
        <div className='grid absolute left-0 right-0 bg-white text-indigo-dye border border-[#ACB9CB] top-full z-20 p-4 gap-3 shadow-md'>
          <button
            onClick={() =>
              setActionState({
                ...initialActionState,
                stageId: stage.id,
                modal: {
                  title: `Set-up Stage Requirements: ${stage.title}`,
                  whichModal: 'STAGE_REQUIREMENTS',
                  isOpen: true,
                },
              })
            }
            type='button'
            className='text-left'
          >
            Set-up Stage Requirements
          </button>
          <button
            onClick={() =>
              setActionState({
                ...initialActionState,
                stageId: stage.id,
                modal: {
                  title: `Are you sure you want to remove stage ${title}?`,
                  whichModal: 'CONFIRMATION',
                  isOpen: true,
                },
              })
            }
            type='button'
            className='text-left'
          >
            Remove Stage
          </button>
        </div>
      )}
    </div>
  );
}
