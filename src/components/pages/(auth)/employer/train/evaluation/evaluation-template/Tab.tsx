"use client";
import { useState } from "react";

import IOSToggleButton from '@/components/buttons/IosToggleButton';
import DeleteIconNoBorder from '@/svg/DeleteIconNoBorder';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';
import DuplicateIcon from "@/svg/DuplicateIcon";
import AddCircleIcon from "@/svg/AddCircleIcon";
import FontSizeIcon from "@/svg/FontSizeIcon";
import CategoryIcon from "@/svg/CategoryIcon";
import MoveIcon from "@/svg/MoveIcon";

const Tab = () => {
  const [totalScore, setTotalScoreGoal] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const handleMinusTotalScoreClick = () => {
    if (totalScore > 0) {
      setTotalScoreGoal(totalScore - 1);
    }
  };

  const handlePlusTotalScoreClick = () => {
    setTotalScoreGoal(totalScore + 1);
  };

  const handleToggleChange = () => {
    setIsChecked(!isChecked);
  };


  return (
    <>
        <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
          <div className='px-2 md:px-8 lg:px-4'>
            <div className='mt-8 flow-root'>
              <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='min-w-full flex py-2 sm:px-6 lg:px-8 space-y-6 space-x-4'>
                    <div className="pt-6">
                    <MoveIcon />
                    </div>
                  <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                    <input
                      id='position'
                      type='text'
                      placeholder='Enter criteria...'
                      className='block w-full border-0 py-1.5 px-3 text-gray-900 border-b-2 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                    />
                    <div className="flex flex-row px-2 py-4 space-x-8">
                      <label className="text-slate-700 mt-5 text-sm">How many points is this criteria?</label>
                      <div className="flex gap-4 items-center mt-4 text-center whitespace-nowrap text-slate-500">
                          <div className='hover:cursor-pointer' onClick={handleMinusTotalScoreClick}>
                              <MinusIcon />
                          </div>
                          <div className="justify-center items-start self-stretch px-11 py-1 bg-white rounded-md border border-solid border-slate-400 max-md:px-5">
                              {totalScore}
                          </div>
                          <div className='hover:cursor-pointer' onClick={handlePlusTotalScoreClick}>
                              <PlusIcon />
                          </div>
                      </div>
                    </div>
                    <hr />
                    <div className='flex pt-4 justify-between'>
                      <div className='flex space-x-4'>
                        <IOSToggleButton checked={isChecked} onChange={handleToggleChange} />
                        <label className="text-slate-700 text-sm">How many points is this criteria?</label>
                      </div>
                      <div className='flex space-x-4'>
                        <DuplicateIcon />
                        <DeleteIconNoBorder/>
                      </div>
                    </div>
                  </div>
                    <div className="flex flex-col h-fit border rounded-xl border-[#ACB9CB] py-4 px-2 space-y-2">
                        <AddCircleIcon />
                        <FontSizeIcon />
                        <CategoryIcon />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default Tab;