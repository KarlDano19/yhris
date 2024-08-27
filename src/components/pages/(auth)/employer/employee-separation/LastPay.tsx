import React, { Dispatch } from 'react';

import classNames from '@/helpers/classNames';
import { T_LastPayModal } from '@/types/globals';

import ClipIcon from '@/svg/ClipIcon';

const LastPay = ({
  id,
  isLastPayReleased,
  setIsLastPayModalOpen,
  quitclaimReceivedDate,
}: {
  id: number;
  isLastPayReleased: boolean;
  quitclaimReceivedDate?: string;
  setIsLastPayModalOpen: Dispatch<T_LastPayModal>;
}) => {
  return (
    <>
      <button
        className={classNames(
          isLastPayReleased
            ? 'bg-red-500 border-[1px] border-red-500 text-white'
            : 'border-[1px] border-red-500 text-red-500',
          'relative inline-flex items-center rounded-md px-2 py-1 focus:z-10 disabled:opacity-75'
        )}
        disabled={isLastPayReleased}
        onClick={() =>
          !isLastPayReleased &&
          setIsLastPayModalOpen({
            isOpen: true,
            id,
          })
        }
      >
        {isLastPayReleased ? 'Released' : 'Release'}{' '}
      </button>
      {isLastPayReleased ? (
        <div>
          <div className='flex gap-1 items-center justify-center mt-2'>
            <ClipIcon />
            <p className='ml-2 text-xs'>{quitclaimReceivedDate}</p>
          </div>
        </div>
      ): null}
    </>
  );
};

export default LastPay;
