import { Dispatch } from 'react';
import classNames from '@/helpers/classNames';
import { SmartButton } from '@/components/SmartPermissions/SmartButton';

export default function Orient({
  isOriented,
  setIsOrientFirstModalOpen,
}: {
  isOriented: boolean;
  setIsOrientFirstModalOpen: Dispatch<boolean>;
}) {
  return (
    <>
      <div className='flex gap-2 mt-2 justify-center'>
        <div>
          <SmartButton
            id="allow-onboarding-btn"
            className={classNames(
              'relative rounded-md px-5 py-2 focus:z-10 w-[7rem] disabled:opacity-80',
              isOriented
                ? 'bg-red-500 border-[1px] border-red-500 text-white'
                : 'border-[1px] border-red-500 text-red-500'
            )}
            onClick={() => setIsOrientFirstModalOpen(true)}
            disabled={isOriented}
          >
            {isOriented ? 'Oriented' : 'Orient'}
          </SmartButton>
        </div>
      </div>
    </>
  );
}
