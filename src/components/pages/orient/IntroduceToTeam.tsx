import { Dispatch } from 'react';
import classNames from '@/helpers/classNames';

export default function IntroduceToTeam({
  isIntroduced,
  setIsIntroducedModalOpen,
}: {
  isIntroduced: boolean;
  setIsIntroducedModalOpen: Dispatch<boolean>;
}) {
  return (
    <>
      <div className='flex gap-2 mt-2 justify-center'>
        <div>
          <button
            className={classNames(
              isIntroduced
                ? 'bg-red-500 border-[1px] border-red-500 text-white'
                : 'border-[1px] border-red-500 text-red-500',
              'relative rounded-md px-5 py-2 focus:z-10 w-[7rem] disabled:opacity-80'
            )}
            onClick={() => !isIntroduced && setIsIntroducedModalOpen(true)}
            disabled={isIntroduced ? true : false}
          >
            {isIntroduced ? 'Introduced' : 'Introduce'}
          </button>
        </div>
      </div>
    </>
  );
}
