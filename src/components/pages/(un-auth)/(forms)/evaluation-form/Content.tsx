'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import useGetEvaluationTemplateDetails from './hooks/useGetEvaluationTemplateDetails';
import useGetEvaluationEmployeeFormDetails from './hooks/useGetEvaluationEmployeeFormDetails';
import useUpdateEvaluationForm from './hooks/useUpdateEvaluationEmployeeForm';

import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';

function Content() {
  const params = useParams<{ evaluation_template_id: string; form_uuid: string }>();
  const [hasTemplate, setHasTemplate] = useState(false);
  const [hasForm, setHasForm] = useState(false);
  const [currentTab, setSelectedTab] = useState(0);
  const [evaluationTemplateDetails, setEvaluationTemplateDetails] = useState<any>({});
  const [evaluationEmployeeFormDetails, setEvaluationEmployeeFormDetails] = useState<any>({});
  const [evaluationForm, setEvaluationForm] = useState<any>({});
  const [evaluationCriterionIndex, setEvaluationCriterionIndex] = useState(0);
  const { data: dataEvaluationTemplateDetails, isLoading: evaluationTemplateDetailsLoading } =
    useGetEvaluationTemplateDetails(Number(params.evaluation_template_id) || null);
  const { data: dateEvaluationEmployeeFormDetails, isLoading: evaluationEmployeeFormDetailsLoading } =
    useGetEvaluationEmployeeFormDetails(params.form_uuid || null);
  const { mutate, isLoading } = useUpdateEvaluationForm();

  useEffect(() => {
    if (
      dataEvaluationTemplateDetails &&
      Object.keys(dataEvaluationTemplateDetails).length !== 0 &&
      !evaluationTemplateDetailsLoading
    ) {
      setHasTemplate(true);
      setEvaluationTemplateDetails(dataEvaluationTemplateDetails);
      setEvaluationForm(dataEvaluationTemplateDetails.evaluation_criterion);
    }
    if (
      dateEvaluationEmployeeFormDetails &&
      Object.keys(dateEvaluationEmployeeFormDetails).length !== 0 &&
      !evaluationEmployeeFormDetailsLoading
    ) {
      setHasForm(true);
      dateEvaluationEmployeeFormDetails['date_of_evaluation'] = new Date();
      setEvaluationEmployeeFormDetails(dateEvaluationEmployeeFormDetails);
    }
  }, [dataEvaluationTemplateDetails, dateEvaluationEmployeeFormDetails]);

  const convertToRoman = (num: number): string => {
    // Define Roman numerals and their corresponding values
    const romanNumerals: { [key: string]: number } = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };

    let romanNumber = '';

    // Iterate through numerals in descending order
    for (const key in romanNumerals) {
      while (num >= romanNumerals[key]) {
        romanNumber += key;
        num -= romanNumerals[key];
      }
    }

    return romanNumber;
  };

  const submitForm = () => {
    let hasError = false;
    evaluationForm.map((item: any, index: number) => {
      for (const [criteriaIndex, criteriaItem] of item.criterion.entries()) {
        if (!Object.hasOwn(criteriaItem, 'score')) {
          let errorMessage: string = '';
          if (!item.section_title) {
            errorMessage = `Section ${convertToRoman(index + 1)} `;
          }
          errorMessage += `Question ${criteriaIndex + 1}, Score is required`;
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 4000 });
          hasError = true;
        }
        if (!criteriaItem.is_disable_comment && !Object.hasOwn(criteriaItem, 'comment')) {
          let errorMessage: string = '';
          if (!item.section_title) {
            errorMessage = `Section ${convertToRoman(index + 1)} `;
          }
          errorMessage += `Question ${criteriaIndex + 1}, Comment is required`;
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 4000 });
          hasError = true;
        }
      }
    });
    if (hasError) return;
    const data = {
      form_data: evaluationForm,
    };
    const form_uuid = params.form_uuid;
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate({ form_uuid, data }, callbackReq);
  };

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      {currentTab === 0 && (
        <>
          <div className='border-2 rounded-lg mx-4 mt-4 mb-12'>
            <div className='p-6 border-b-2'>
              <p className='text-[1.2rem] font-semibold'>{evaluationTemplateDetails.name}</p>
              <p>{evaluationTemplateDetails.description}</p>
            </div>
            <div className='px-6 py-8 mb-8'>
              <div className='w-full mb-8'>
                <label htmlFor='employeeName' className='block'>
                  1. Employee Name
                </label>
                <input
                  type='text'
                  id='employeeName'
                  className='block w-full border-0 py-1.5 px-6 text-gray-900 border-b-2 bg-transparent'
                  defaultValue={evaluationEmployeeFormDetails.employee_name}
                  disabled={true}
                />
              </div>
              <div className='w-full'>
                <label htmlFor='employeeName'>2. Date of Evaluation</label>
                <CustomDatePicker
                  name={'date_of_evaluation'}
                  selected={evaluationEmployeeFormDetails.date_of_evaluation}
                  pickerOnChange={setEvaluationEmployeeFormDetails}
                  className={'block w-full border-0 py-1.5 px-6 text-gray-900 border-b-2 bg-transparent'}
                  objectFilter={evaluationEmployeeFormDetails}
                  inputOnChange={setEvaluationEmployeeFormDetails}
                  placeholder={'mm/dd/yyyy'}
                />
              </div>
            </div>
          </div>
          <div className='py-4 px-4 text-right'>
            <button
              type='button'
              className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={() => setSelectedTab(1)}
            >
              Next
            </button>
          </div>
        </>
      )}
      {currentTab === 1 && (
        <>
          <div className='border-2 rounded-lg mx-4 mt-4 mb-12'>
            {evaluationForm[evaluationCriterionIndex].section_title && (
              <div className='p-6 border-b-2'>
                <p className='text-[1.2rem] font-semibold'>
                  {convertToRoman(evaluationCriterionIndex + 1)}.{' '}
                  {evaluationForm[evaluationCriterionIndex].section_title}
                </p>
                <p>{evaluationForm[evaluationCriterionIndex].section_description}</p>
              </div>
            )}
            {evaluationForm[evaluationCriterionIndex].criterion.map((item: any, index: number) => {
              return (
                <div key={index} className='px-[1.55rem] py-6'>
                  <div className='flex justify-between mb-8'>
                    <div>
                      {index + 1}. {item.title}
                    </div>
                    {evaluationTemplateDetails.criteria_rating_view_type === 'default' && (
                      <div className='flex gap-4 items-center justify-end whitespace-nowrap'>
                        <div
                          className='p-2 cursor-pointer'
                          onClick={() => {
                            let prevScore = item.score || 0;
                            setEvaluationForm((prevForm: any) => {
                              return prevForm.map((criterionItem: any, criterionIndex: number) => {
                                if (criterionIndex === evaluationCriterionIndex) {
                                  return {
                                    ...criterionItem,
                                    criterion: criterionItem.criterion.map((item: any, itemIndex: number) => {
                                      if (itemIndex === index) {
                                        return { ...item, score: (prevScore -= 1) };
                                      }
                                      return item;
                                    }),
                                  };
                                }
                                return criterionItem;
                              });
                            });
                          }}
                        >
                          <MinusIcon />
                        </div>
                        <input
                          id={`score-${evaluationCriterionIndex}-${index}`}
                          type='number'
                          className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-1/6 border p-2 rounded-md text-center'
                          value={item.score || 0}
                          onChange={(event) => {
                            setEvaluationForm((prevForm: any) => {
                              return prevForm.map((criterionItem: any, criterionIndex: number) => {
                                if (criterionIndex === evaluationCriterionIndex) {
                                  return {
                                    ...criterionItem,
                                    criterion: criterionItem.criterion.map((item: any, itemIndex: number) => {
                                      if (itemIndex === index) {
                                        return { ...item, score: Number(event.target.value) };
                                      }
                                      return item;
                                    }),
                                  };
                                }
                                return criterionItem;
                              });
                            });
                          }}
                        />
                        <div
                          className='p-2 cursor-pointer'
                          onClick={() => {
                            let prevScore = item.score || 0;
                            setEvaluationForm((prevForm: any) => {
                              return prevForm.map((criterionItem: any, criterionIndex: number) => {
                                if (criterionIndex === evaluationCriterionIndex) {
                                  return {
                                    ...criterionItem,
                                    criterion: criterionItem.criterion.map((item: any, itemIndex: number) => {
                                      if (itemIndex === index) {
                                        return { ...item, score: (prevScore += 1) };
                                      }
                                      return item;
                                    }),
                                  };
                                }
                                return criterionItem;
                              });
                            });
                          }}
                        >
                          <PlusIcon />
                        </div>
                      </div>
                    )}
                    {evaluationTemplateDetails.criteria_rating_view_type === 'dropdown' && (
                      <div className='flex gap-4 items-center text-center whitespace-nowrap'>
                        <select
                          id={`dropdown-${evaluationCriterionIndex}-${index}`}
                          className='border px-8 py-2 rounded-md'
                        >
                          {Array.from({ length: parseInt(item.max_score) + 1 }, (_, i) => (
                            <option key={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {evaluationTemplateDetails.criteria_rating_view_type === 'slider' && (
                      <div className='text-center whitespace-nowrap'>
                        <input
                          id={`slider-${evaluationCriterionIndex}-${index}`}
                          type='range'
                          min='0'
                          max={item.max_score}
                          defaultValue='0'
                          className='w-full'
                        />
                        <div className='flex justify-between'>
                          <div>0</div>
                          <div>{item.max_score}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {!item.is_disable_comment && (
                    <textarea
                      id={`comment-${evaluationCriterionIndex}-${index}`}
                      className='border rounded px-5 pt-4 pb-12 text-gray-400'
                      placeholder='Enter comment...'
                    ></textarea>
                  )}
                  {index + 1 !== evaluationForm[evaluationCriterionIndex].criterion.length && (
                    <div className='mt-12 border-dashed border-b-2'></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className='py-4 px-4 flex justify-between'>
            {evaluationCriterionIndex == 0 && (
              <button
                type='button'
                className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                onClick={() => setSelectedTab(0)}
              >
                Back
              </button>
            )}
            {evaluationCriterionIndex != 0 && (
              <button
                type='button'
                className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                onClick={() => setEvaluationCriterionIndex(evaluationCriterionIndex - 1)}
              >
                Back
              </button>
            )}
            {evaluationCriterionIndex + 1 !== evaluationTemplateDetails.evaluation_criterion.length && (
              <button
                type='button'
                className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                onClick={() => setEvaluationCriterionIndex(evaluationCriterionIndex + 1)}
              >
                Next
              </button>
            )}
            {evaluationCriterionIndex + 1 === evaluationTemplateDetails.evaluation_criterion.length && (
              <button
                type='button'
                className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                onClick={() => submitForm()}
              >
                Submit
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
export default Content;
