import { useContext, useEffect, useState } from 'react';

import { Tooltip } from 'react-tooltip';

import { initialActionState } from '../lib/initialActionState';
import ModalLayout from '../../../../../ModalLayout';
import ModalFooterLayout from '../layouts/ModalFooterLayout';
import useTagInput from '../hooks/useTagInput';
import StateContext from '../contexts/StateContext';

import { XMarkIcon } from '@heroicons/react/24/outline';

import { ContextTypes, StageRequirementsTypes as PropTypes } from '../types';
import InfoIcon from '@/svg/InfoIcon';

export default function StageRequirements({ title, requirements, handleFormSubmit }: PropTypes) {
  const { setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { tags, handleKeyDown, onClickAdd, handleRemoveTag } = useTagInput(input, setInput, requirements);

  useEffect(() => {
    setIsOpen(true);
  }, []);
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };
  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => handleFormSubmit(tags), 400);
  };

  return (
    <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleOnSubmit}>
        <div className='p-4'>
          <div className='flex items-center gap-2'>
            <label htmlFor='requirements' className='text-[15px] block mb-2'>
              Requirements
            </label>
            <div className='cursor-pointer mb-2' data-tooltip-id='stage-tooltip' data-tooltip-place='bottom'>
              <InfoIcon />
            </div>
            <Tooltip
              id='stage-tooltip'
              opacity={1}
              style={{ fontSize: '10px'}}
            >
              <div>
                <h2 className='text-[12px] font-medium'>
                  Press enter key or click add button to insert
                </h2>
              </div>
            </Tooltip>
          </div>
          <div className='border border-[#ACB9CB] p-2 rounded-md flex items-center gap-3 flex-wrap'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              type='text'
              id='requirements'
              name='requirements'
              placeholder='Enter requirement...'
              className='focus:none outline-none py-2 px-4 grow'
              data-tooltip-id='stage-input-tooltip'
              data-tooltip-content='Press enter key or click add button to insert'
              data-tooltip-place='bottom'
            />
            <Tooltip id='stage-input-tooltip' style={{ fontSize: '10px' }} />
            <button
              type='button'
              onClick={onClickAdd}
              className='rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]'
            >
              ADD
            </button>
          </div>
          <div className='py-2 pr-2 rounded-md flex items-center gap-3 flex-wrap'>
            {tags.map((tag: string) => (
              <div
                key={tag}
                className='bg-[#ACB9CB] rounded-md flex items-center gap-2 py-2 px-4 text-left justify-start'
              >
                <button type='button' onClick={() => handleRemoveTag(tag)}>
                  <XMarkIcon className='w-4 h-4' />
                </button>
                <p>{tag}</p>
              </div>
            ))}
          </div>
        </div>
        <hr />
        <ModalFooterLayout>
          <button
            onClick={handleClose}
            type='button'
            className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
          >
            Close
          </button>
          <button
            type='submit'
            onClick={onClickAdd}
            className='rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]'
          >
            Save
          </button>
        </ModalFooterLayout>
      </form>
    </ModalLayout>
  );
}
