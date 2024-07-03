import { Dispatch } from 'react';
import classNames from '@/helpers/classNames';
import { DocumentIcon } from '@heroicons/react/24/outline';

export default function SendContract({
  isContractSent,
  isContractReceived,
  contractReceivedDate,
  setIsSendContractModalOpen,
  setReceived,
  isLoading,
}: {
  isContractSent: boolean;
  isContractReceived: boolean;
  contractReceivedDate?: string;
  setIsSendContractModalOpen: Dispatch<boolean>;
  setReceived: any;
  isLoading: boolean;
}) {
  return (
    <>
      <div className='flex gap-2 mt-2 justify-center'>
        <div>
          <button
            className={classNames(
              isContractSent
                ? 'bg-red-500 border-[1px] border-red-500 text-white'
                : 'border-[1px] border-red-500 text-red-500',
              'relative rounded-md px-5 py-2 focus:z-10 w-[7rem] disabled:opacity-80'
            )}
            onClick={() => !isContractSent && setIsSendContractModalOpen(true)}
            disabled={isContractSent}
          >
            {isContractSent ? 'Sent' : 'Send'}
          </button>
        </div>
        <div>
          <div>
            <button
              className={classNames(
                !isContractSent ? 'bg-blue-200 text-gray-900' : isContractReceived ? 'bg-green-500 border-green-500 text-white' : 'bg-blue-200 text-gray-900 cursor-pointer',
                'relative rounded-md px-5 py-2 focus:z-10 w-[7rem] disabled:opacity-80'
              )}
              onClick={() => setReceived()}
              disabled={!isContractSent ? true : isContractReceived ? true : isLoading}
            >
              {isContractSent && isContractReceived ? 'Received' : 'Receive'}
            </button>
          </div>
          {isContractReceived ? (
            <div className='flex gap-1 items-center mt-2'>
              <DocumentIcon className='text-green-500 w-4 h-4' />
              <p className='text-xs'>{contractReceivedDate}</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
