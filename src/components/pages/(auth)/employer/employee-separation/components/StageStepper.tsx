'use client';

import React from 'react';

import { CheckIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'react-tooltip';

import { SeparationPhase } from '../functions/separationPhase';
import classNames from '@/helpers/classNames';

const STAGES: SeparationPhase[] = ['Initiation', 'Rendering', 'Clearance', 'Final Pay', 'Legal Docs', 'Exit Interview', 'Final Settlement'];

type Props = {
  currentPhase: SeparationPhase;
  onStageClick: (phase: SeparationPhase) => void;
  freeNavigation?: boolean;
};

const StageStepper = ({ currentPhase, onStageClick, freeNavigation = false }: Props) => {
  const currentIndex = STAGES.indexOf(currentPhase);

  return (
    <>
    <div className='flex items-center w-full overflow-x-auto overflow-y-visible py-2'>
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isPending = index > currentIndex;
        const isClickable = freeNavigation || !isPending;

        return (
          <React.Fragment key={stage}>
            <div className='flex flex-col items-center flex-shrink-0'>
              <button
                onClick={() => isClickable && onStageClick(stage)}
                disabled={!isClickable}
                className={classNames(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  isCompleted && 'bg-green-600 text-white hover:bg-green-700',
                  isActive && 'bg-green-600 text-white ring-4 ring-green-200 border-2 border-green-600',
                  isPending && isClickable && 'bg-gray-100 text-gray-400 border-2 border-gray-200 hover:bg-gray-200',
                  isPending && !isClickable && 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50'
                )}
                data-tooltip-id={isPending ? 'stage-tooltip' : undefined}
                data-tooltip-content={isPending && !isClickable ? 'Complete previous stages first' : isPending ? stage : undefined}
                data-tooltip-place='bottom'
                data-tooltip-delay-show={300}
              >
                {isCompleted ? <CheckIcon className='h-5 w-5' /> : index + 1}
              </button>
              <span className={classNames(
                'text-xs mt-1.5 font-medium text-center whitespace-nowrap',
                isCompleted && 'text-green-600',
                isActive && 'text-green-700 font-bold',
                isPending && 'text-gray-400'
              )}>
                {stage}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <div className={classNames(
                'flex-1 h-1 mx-2 mt-[-16px]',
                index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
    <Tooltip id='stage-tooltip' />
    </>
  );
};

export default StageStepper;
