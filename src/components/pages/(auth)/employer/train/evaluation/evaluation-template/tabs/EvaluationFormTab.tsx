'use client';

import { useState } from 'react';

import { Tooltip } from 'react-tooltip';
import classNames from '@/helpers/classNames';

import SelectChevronDown from '@/svg/SelectChevronDown';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';

function EvaluationFormTab({
  register,
  watch,
  setValue,
  handleSubmit,
  setSelectedTab,
}: {
  register: any;
  watch: any;
  setValue: any;
  handleSubmit: any;
  setSelectedTab: any;
}) {
  const [remarks, setRemarks] = useState<boolean | null>(watch('is_show_remarks'));
  const [commentCriteria, setCommentCriteria] = useState<boolean | null>(watch('is_show_criteria_comment'));

  const onSubmit = handleSubmit(() => {
    setSelectedTab(3);
  });

  const handleClickRemarks = (value: any) => {
    setRemarks(value);
    setValue('is_show_remarks', value);
  };

  const handleClickCommentCriteria = (value: any) => {
    setCommentCriteria(value);
    setValue('is_show_criteria_comment', value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-6'>
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
                      {...register('description', { required: true })}
                      className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 border-b-2 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                    />
                    <Tooltip id='description-tooltip' style={{ fontSize: '10px' }} />
                  </div>
                  {/* <div
                    className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'
                    data-tooltip-id='scoring-tooltip'
                    data-tooltip-content='This field will not be shown on the employee’s end during the evaluation. The selected scoring/rating will be applied to ALL once this is selected.'
                    data-tooltip-place='left'
                  >
                    <label htmlFor='rating_type' className='block text-sm font-medium leading-6 text-gray-900'>
                      Scoring/Rating<span className='text-red-600'>*</span>
                    </label>
                    <div className='relative mt-2'>
                      <select
                        id='rating_type'
                        defaultValue=''
                        {...register('rating_type', { required: true })}
                        className='appearance-none block w-full py-2 pl-3 text-gray-900 border-b-2 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                      >
                        <option value=''>Select...</option>
                        <option value='individual'>Individual</option>
                        <option value='team'>Team</option>
                        <option value='manager'>Manager</option>
                      </select>
                      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                        <SelectChevronDown />
                      </div>
                      <Tooltip id='scoring-tooltip' style={{ fontSize: '10px' }} />
                    </div>
                  </div> */}
                  <div className='flex flex-row space-x-6'>
                    <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                      <div className='flex flex-col px-5'>
                        <label className='text-slate-700 mt-2 text-sm'>How much is the total score?</label>
                        <div className='flex gap-4 items-center mt-4 text-center whitespace-nowrap text-slate-500'>
                          <div
                            className='hover:cursor-pointer p-2'
                            onClick={() => {
                              const currentTotalScore = watch('total_score');
                              if (currentTotalScore > 1) {
                                setValue('total_score', currentTotalScore - 1);
                              }
                            }}
                          >
                            <MinusIcon />
                          </div>
                          <input
                            id='max-score'
                            type='number'
                            className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none justify-center items-start self-stretch p-2 bg-white rounded-md border border-solid border-slate-400 w-[4rem] text-center'
                            defaultValue={1}
                            {...register('total_score', {
                              validate: (value: any) => parseInt(value) >= 0 || "Score cannot be negative"
                            })}
                            onChange={e => {
                              const value = parseInt(e.target.value);
                              if (value < 0) {
                                setValue('total_score', 0);
                              } else {
                                setValue('total_score', value);
                              }
                            }}
                          />
                          <div
                            className='hover:cursor-pointer p-2'
                            onClick={() => {
                              const currentTotalScore = watch('total_score');
                              setValue(`total_score`, parseInt(currentTotalScore) + 1);
                            }}
                          >
                            <PlusIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                      <div className='flex flex-col px-5'>
                        <label className='text-slate-700 mt-2 text-sm'>How much is the Passing score?</label>
                        <div className='flex gap-4 items-center mt-4 text-center whitespace-nowrap text-slate-500'>
                          <div
                            className='hover:cursor-pointer p-2'
                            onClick={() => {
                              const currentPassingScore = parseInt(watch('passing_score'));
                              if (currentPassingScore > 1) {
                                setValue('passing_score', currentPassingScore - 1);
                              }
                            }}
                          >
                            <MinusIcon />
                          </div>
                          <input
                            id='max-score'
                            type='number'
                            min="0"
                            className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none justify-center items-start self-stretch p-2 bg-white rounded-md border border-solid border-slate-400 w-[4rem] text-center'
                            defaultValue={1}
                            {...register('passing_score', {
                              validate: (value: any) => parseInt(value) >= 0 || "Score cannot be negative"
                            })}
                            onChange={e => {
                              const value = parseInt(e.target.value);
                              if (value < 0) {
                                setValue('passing_score', 0);
                              } else {
                                setValue('passing_score', value);
                              }
                            }}
                          />
                          <div
                            className='hover:cursor-pointer p-2'
                            onClick={() => {
                              const currentPassingScore = parseInt(watch('passing_score'));
                              setValue('passing_score', currentPassingScore + 1);
                            }}
                          >
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
                          className={classNames(
                            'mt-3 inline-flex w-full justify-center rounded-md px-10 py-2 text-sm',
                            remarks === false
                              ? 'text-white bg-blue-600 shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto '
                              : 'text-[#6F829B] shadow-sm ring-1 ring-inset ring-[#ACB9CB]  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          )}
                          onClick={() => handleClickRemarks(false)}
                        >
                          No
                        </button>
                        <button
                          type='button'
                          className={classNames(
                            'mt-3 inline-flex w-full justify-center rounded-md px-10 py-2 text-sm',
                            remarks === true
                              ? 'text-white bg-blue-600 shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto '
                              : 'text-[#6F829B] shadow-sm ring-1 ring-inset ring-[#ACB9CB]  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          )}
                          onClick={() => handleClickRemarks(true)}
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
                          className={classNames(
                            'mt-3 inline-flex w-full justify-center rounded-md px-10 py-2 text-sm',
                            commentCriteria === false
                              ? 'text-white bg-blue-600 shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto '
                              : 'text-[#6F829B] shadow-sm ring-1 ring-inset ring-[#ACB9CB]  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          )}
                          onClick={() => handleClickCommentCriteria(false)}
                        >
                          No
                        </button>
                        <button
                          type='button'
                          className={classNames(
                            'mt-3 inline-flex w-full justify-center rounded-md px-10 py-2 text-sm',
                            commentCriteria === true
                              ? 'text-white bg-blue-600 shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto '
                              : 'text-[#6F829B] shadow-sm ring-1 ring-inset ring-[#ACB9CB]  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          )}
                          onClick={() => handleClickCommentCriteria(true)}
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
        <hr />
        <div className='flex justify-between py-4 px-4'>
          <button
            type='button'
            className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            onClick={() => setSelectedTab(1)}
          >
            Back
          </button>
          <button
            type='submit'
            className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
}

export default EvaluationFormTab;
