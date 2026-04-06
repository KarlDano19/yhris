import { useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import Warning from '@/svg/Warning';
import { initialActionState } from '../../lib/initialActionState';
import StateContext from '../../contexts/StateContext';
import { ContextTypes } from '../../types';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import useDeleteStage from '../../hooks/stage/useDeleteStage';

interface ConfirmationProps {
  onStageDeleted?: () => void;
}

export default function Confirmation({ onStageDeleted }: ConfirmationProps) {
  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useDeleteStage();
  const { actionState, setActionState, dispatch }: ContextTypes = useContext(StateContext) as ContextTypes;
  const [isOpen, setIsOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };

  const handleConfirmation = () => {
    setIsOpen(false);
    removeStage();
  };

  const removeStage = () => {
    if (actionState.isNewStage) {
      dispatch({
        type: 'REMOVE_STAGE',
        payload: { stageId: actionState.stageId, setActionState },
      });
    } else {
      const callbackReq = {
        onSuccess: (data: any) => {
          dispatch({
            type: 'REMOVE_STAGE',
            payload: { stageId: actionState.stageId, setActionState },
          });
          // Show success message with archived applicants count
          const message = data?.message || 'Stage deleted successfully.';
          toast.custom(() => <CustomToast message={message} type='success' />, {
            duration: 5000,
          });
          // Refresh applicants data to reflect any archived applicants
          if (onStageDeleted) {
            onStageDeleted();
          }
        },
        onError: (err: any) => {
          setTimeout(() => setActionState(initialActionState), 400);
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      };
      let postData = {
        stage_id: actionState.stageId,
      };
      deleteMutate(postData, callbackReq);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-30' initialFocus={cancelButtonRef} onClose={handleClose}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-[460px] sm:max-w-4xl p-10'>
                <div className='flex justify-center mb-10'>
                  <Warning />
                </div>
                <p className='text-xl font-bold text-gray-900 text-center'>{actionState.modal.title} 🤔</p>
                <p className='text-xl font-bold text-gray-900 text-center mb-10'>This process cannot be undone.</p>
                <div className='mt-5 sm:mt-4 sm:flex sm:justify-between'>
                  <button
                    onClick={handleClose}
                    type='submit'
                    className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue hover:bg-savoy-blue/[.15] py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
                  >
                    NO
                  </button>
                  <button
                    onClick={handleConfirmation}
                    type='button'
                    className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue hover:bg-[#2c54bf] shadow-sm py-3 px-6 rounded-md transition-all'
                  >
                    YES
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
