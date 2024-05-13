"use client";
import { useState } from "react";

import SelectChevronDown from '@/svg/SelectChevronDown';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';
import { useFormContext } from "react-hook-form";
import classNames from "@/helpers/classNames";
import { Tooltip } from "react-tooltip";
const Tab = () => {
  const [totalScore, setTotalScoreGoal] = useState(0);
  const [totalPassingScore, setTotalPassingScore] = useState(0)
  const [remarks, setRemarks] = useState('')
  const [commentCriteria, setCommentCriteria] = useState('')
  const{register, setValue} = useFormContext()
  
  const handleMinusTotalScoreClick = () => {
    if (totalScore > 0) {
      setTotalScoreGoal(totalScore - 1);
      setValue('totalScore', totalScore - 1);
    }
  };

  const handlePlusTotalScoreClick = () => {
    setTotalScoreGoal(totalScore + 1);
    setValue('totalScore', totalScore + 1);
  };

  const handleMinusPassingScoreClick = () => {
    if (totalPassingScore > 0) {
      setTotalPassingScore(totalPassingScore - 1);
      setValue('totalPassingScore', totalPassingScore - 1); 
    }
  };

  const handlePlusPassingScoreClick = () => {
    setTotalPassingScore(totalPassingScore + 1);
    setValue('totalPassingScore', totalPassingScore + 1); 
  };

  const handleClickRemarks = (value: any) => {
  if (value === 'yes' || value === 'no') {
    setRemarks(value);
    setValue('remarks', value); // Update the value in the form context
  } else {
    // Handle invalid input, e.g., display an error message or log a warning
    console.error('Invalid input for remarks. Expected "yes" or "no".');
  }
};

const handleClickCommentCriteria = (value: any) => {
  if (value === 'yes' || value === 'no') {
    setCommentCriteria(value);
    setValue('commentCriteria', value); // Update the value in the form context
  } else {
    // Handle invalid input, e.g., display an error message or log a warning
    console.error('Invalid input for comment criteria. Expected "yes" or "no".');
  }
};


  return (
    <>
        <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
            <div className='px-2 md:px-8 lg:px-4'>
            <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='min-w-full py-2 sm:px-6 lg:px-8 space-y-6'>
                    <div 
                        className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'
                        data-tooltip-id='description-tooltip'
                        data-tooltip-content='A description or instructions for the evaluation template, explaining its purpose and how it should be used.'
                        data-tooltip-place='left'
                    >
                        <label htmlFor='description' className='block text-sm font-medium leading-6 text-gray-900'>
                            Description<span className='text-red-600'>*</span>
                        </label>
                            <input
                            id='description'
                            type='text'
                            {...register('description', {required: true})}
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 border-b-2 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                        />
                        <Tooltip id='description-tooltip' style={{ fontSize: '10px'}}/>
                    </div>
                    <div 
                        className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'
                        data-tooltip-id='scoring-tooltip'
                        data-tooltip-content='This field will not be shown on the employee’s end during the evaluation. The selected scoring/rating will be applied to ALL once this is selected.'
                        data-tooltip-place='left'
                    >
                        <label htmlFor='scoring_rating' className='block text-sm font-medium leading-6 text-gray-900'>
                            Scoring/Rating<span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                            <select
                            id='scoring_rating'
                            defaultValue=''
                            {...register('scoring_rating', {required:true})}
                            className='appearance-none block w-full py-2 pl-3 text-gray-900 border-b-2 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                            >
                            <option value=''>Select...</option>
                            <option value='individual'>Individual</option>
                            <option value='team'>Team</option>
                            <option value='manager'>Manager</option>
                            <option value='custom'>Custom</option>
                            </select>
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                <SelectChevronDown />
                            </div>
                             <Tooltip id='scoring-tooltip' style={{ fontSize: '10px'}}/>
                        </div>
                    </div>
                    <div className='flex flex-row space-x-6'>
                        <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                        <div className="flex flex-col px-5">
                            <label className="text-slate-700 mt-2 text-sm">How much is the total score?</label>
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
                        </div>
                        <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                            <div className="flex flex-col px-5">
                                <label className="text-slate-700 mt-2 text-sm">How much is the Passing score?</label>
                                <div className="flex gap-4 items-center mt-4 text-center whitespace-nowrap text-slate-500">
                                    <div className='hover:cursor-pointer' onClick={handleMinusPassingScoreClick}>
                                        <MinusIcon />
                                    </div>
                                    <div className="justify-center items-start self-stretch px-11 py-1 bg-white rounded-md border border-solid border-slate-400 max-md:px-5">
                                        {totalPassingScore}
                                    </div>
                                    <div className='hover:cursor-pointer' onClick={handlePlusPassingScoreClick}>
                                        <PlusIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row space-x-6'>
                        <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                            <label htmlFor='remarks' className='block text-sm font-medium leading-6 text-gray-900'>
                                Do you want a remarks field?
                            </label>
                            <div className='flex space-x-9 pt-4'>
                                <button
                                type='button'
                                className={classNames('mt-3 inline-flex w-full justify-center rounded-md px-10 py-2 text-sm', remarks === 'no' ? 'text-white bg-blue-600 shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ' : 'text-[#6F829B] shadow-sm ring-1 ring-inset ring-[#ACB9CB]  hover:bg-gray-50 sm:mt-0 sm:w-auto')}
                                onClick={() => handleClickRemarks('no')}
                                >
                                No
                                </button>
                                <button
                                type='button'
                                className={classNames('mt-3 inline-flex w-full justify-center rounded-md px-10 py-2 text-sm', remarks === 'yes' ? 'text-white bg-blue-600 shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ' : 'text-[#6F829B] shadow-sm ring-1 ring-inset ring-[#ACB9CB]  hover:bg-gray-50 sm:mt-0 sm:w-auto')}
                                onClick={() => handleClickRemarks('yes')}
                                >
                                Yes
                                </button>
                            </div>
                        </div>
                        <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                            <label htmlFor='criteria' className='block text-sm font-medium leading-6 text-gray-900'>
                                Do you want to add a comment field in criteria?
                            </label>
                            <div className='flex space-x-9 pt-4'>
                            <button
                                type='button'
                                className={classNames('mt-3 inline-flex w-full justify-center rounded-md px-10 py-2 text-sm', commentCriteria === 'no' ? 'text-white bg-blue-600 shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ' : 'text-[#6F829B] shadow-sm ring-1 ring-inset ring-[#ACB9CB]  hover:bg-gray-50 sm:mt-0 sm:w-auto')}
                                onClick={() => handleClickCommentCriteria('no')}
                            >
                                No
                            </button>
                            <button
                                type='button'
                                className={classNames('mt-3 inline-flex w-full justify-center rounded-md px-10 py-2 text-sm', commentCriteria === 'yes' ? 'text-white bg-blue-600 shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ' : 'text-[#6F829B] shadow-sm ring-1 ring-inset ring-[#ACB9CB]  hover:bg-gray-50 sm:mt-0 sm:w-auto')}
                                onClick={() => handleClickCommentCriteria('yes')}
                            >
                                Yes
                            </button>
                            </div>
                        </div>
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