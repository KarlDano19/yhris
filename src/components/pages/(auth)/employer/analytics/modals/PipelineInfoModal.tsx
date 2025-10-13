import React, { Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface PipelineInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  pipelineInfo: string;
  numberOfApplicants: number;
  pipelineData?: { [stageTitle: string]: number };
}

const PipelineInfoModal: React.FC<PipelineInfoModalProps> = ({
  isOpen,
  onClose,
  role,
  pipelineInfo,
  numberOfApplicants,
  pipelineData
}) => {
  const cancelButtonRef = useRef(null);


  // Parse the pipeline information into stages
  const parsePipelineStages = (pipelineInfo: string, pipelineData?: { [stageTitle: string]: number }) => {
    if (numberOfApplicants === 0) {
      return [{ stage: 'No applicants yet', count: 0 }];
    }

    if (pipelineData) {
      return Object.entries(pipelineData).map(([stage, count]) => ({
        stage,
        count
      }));
    }

    // Fallback: parse from the pipelineInfo string
    if (pipelineInfo.includes(':')) {
      return pipelineInfo.split(', ').map(item => {
        const [stage, count] = item.split(': ');
        return {
          stage: stage.trim(),
          count: parseInt(count.trim()) || 0
        };
      });
    }

    return [{ stage: pipelineInfo, count: numberOfApplicants }];
  };

  const stages = parsePipelineStages(pipelineInfo, pipelineData);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 text-center md:p-0">
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 md:translate-y-0 md:scale-95'
              enterTo='opacity-100 translate-y-0 md:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 md:scale-100'
              leaveTo='opacity-0 translate-y-4 md:translate-y-0 md:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all w-full max-w-full mx-2 md:my-8 md:w-full md:max-w-2xl'>
        {/* Header */}
        <div className='flex bg-savoy-blue p-2 items-center'>
                  <div className='flex-1 ml-2'>
                    <h3 className='text-white font-semibold'>Pipeline Details - {role}</h3>
          </div>
          <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={onClose} />
        </div>

        {/* Content */}
        <div className='px-2 pt-4 pb-6 md:px-8 overflow-y-auto max-h-[calc(90vh-180px)]'>
          {numberOfApplicants === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">No applicants yet</div>
              <p className="text-gray-400 text-sm mt-2">This job posting hasn't received any applications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium">Total Applicants</span>
                  <span className="text-blue-900 font-bold text-lg">{numberOfApplicants}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Pipeline Stages</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {stages.map((stage, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                        <span className="text-gray-600 font-semibold">{stage.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Total in Pipeline</span>
                  <span className="text-green-900 font-bold">
                    {stages.reduce((sum, stage) => sum + stage.count, 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <hr />
          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
          <button
          type='button'
            className='mt-3 inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:mt-0 sm:w-auto'
              onClick={onClose}
            ref={cancelButtonRef}
            >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Transition.Child>
  </div>
</div>
</Dialog>
</Transition.Root>
);
};

export default PipelineInfoModal;