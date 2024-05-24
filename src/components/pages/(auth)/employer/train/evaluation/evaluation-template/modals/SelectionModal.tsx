import { Dispatch, Fragment, useCallback, useEffect, useRef, useState } from 'react';

import CreateEvaluationModal from './CreateEvaluationModal';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import DescriptionLogo from '@/svg/DescriptionLogo';
import EditIconLarge from '@/svg/EditLogoLarge';

export default function SelectionModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const [isCreateEvaluationTemplateOpen, setIsCreateEvaluationTemplateOpen] = useState(false);

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
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

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
                  <div className='flex bg-white p-2 items-center pr-4'>
                    <h3 className='flex-1 text-white ml-2 font-semibold py-9'></h3>
                    <XCircleIcon className='w-8 h-8 text-[#ACB9CB] cursor-pointer' onClick={() => setIsOpen(false)} />
                  </div>
                  <div>
                    <h3 className='flex-1 ml-2 font-bold text-2xl text-center pb-6'>What do you want to do?</h3>
                    <div className='flex flex-row justify-center space-x-10 px-10 pb-6'>
                      <div
                        className='py-8 px-10 border-[#ACB9CB] border-2 rounded-2xl shadow-sm hover:border-[#355FD0] hover:cursor-pointer'
                        onClick={() => setIsCreateEvaluationTemplateOpen(true)}
                      >
                        <div className='flex justify-center'>
                          <EditIconLarge />
                        </div>
                        <h1 className='py-2 text-center font-bold mt-2'>Start from scratch</h1>
                        <h1 className='py-2 text-center'>
                          Begin with a blank page, or copy and paste a template you’ve written.
                        </h1>
                      </div>
                      <div className='py-8 px-10 border-[#ACB9CB] border-2 rounded-2xl shadow-sm hover:border-[#355FD0] hover:cursor-pointer'>
                        <div className='flex justify-center'>
                          <DescriptionLogo />
                        </div>
                        <h1 className='py-2 text-center font-bold mt-2'>Start with a template</h1>
                        <h1 className='py-2 text-center'>
                          Begin with a blank page, or copy and paste a template you’ve written.
                        </h1>
                      </div>
                    </div>
                  </div>
                  <CreateEvaluationModal
                    refetch={refetch}
                    isOpen={isCreateEvaluationTemplateOpen}
                    setIsOpen={setIsCreateEvaluationTemplateOpen}
                    mainSetIsOpen={setIsOpen}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
