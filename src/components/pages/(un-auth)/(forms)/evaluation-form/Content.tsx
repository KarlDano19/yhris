'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import toast from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import ConfirmSubmitModal from './modals/ConfirmSubmitModal';
import useGetEvaluationTemplateDetails from './hooks/useGetEvaluationTemplateDetails';
import useGetEvaluationEmployeeFormDetails from './hooks/useGetEvaluationEmployeeFormDetails';
import useUpdateEvaluationForm from './hooks/useUpdateEvaluationEmployeeForm';

import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';
import ConfettiLogo from '@/svg/Confetti';

function Content() {
  const { width, height } = useWindowSize();
  const params = useParams<{ evaluation_template_id: string; form_uuid: string }>();
  const [hasTemplate, setHasTemplate] = useState(false);
  const [hasForm, setHasForm] = useState(false);
  const [isConfirmSubmitModalOpen, setIsConfirmSubmitModalOpen] = useState(false);
  const [currentTab, setSelectedTab] = useState(0);
  const [evaluationTemplateDetails, setEvaluationTemplateDetails] = useState<any>({});
  const [evaluationEmployeeFormDetails, setEvaluationEmployeeFormDetails] = useState<any>({});
  const [evaluationForm, setEvaluationForm] = useState<any>({});
  const [evaluationCriterionIndex, setEvaluationCriterionIndex] = useState(0);
  const { data: dataEvaluationTemplateDetails, isLoading: evaluationTemplateDetailsLoading } =
    useGetEvaluationTemplateDetails(params.evaluation_template_id || null);
  const {
    data: dateEvaluationEmployeeFormDetails,
    isLoading: evaluationEmployeeFormDetailsLoading,
    refetch: refetchEvaluationEmployeeFormDetails,
  } = useGetEvaluationEmployeeFormDetails(params.form_uuid || null);
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
    let totalScore = 0;
    let scoreErrorShown = false; // Track if score error has been shown
    let commentErrorShown = false; // Track if comment error has been shown

    evaluationForm.map((item: any, index: number) => {
      for (const [criteriaIndex, criteriaItem] of item.criterion.entries()) {
        if (!Object.hasOwn(criteriaItem, 'score') && !scoreErrorShown) {
          let errorMessage: string = '';
          if (!item.section_title) {
            errorMessage = `Section ${convertToRoman(index + 1)} `;
          }
          errorMessage += `You missed to score a question`;
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 4000 });
          hasError = true;
          scoreErrorShown = true; // Set to true after showing the error
        } else {
          totalScore += criteriaItem.score;
        }
        if (!criteriaItem.is_disable_comment && !Object.hasOwn(criteriaItem, 'comment') && !commentErrorShown) {
          let errorMessage: string = '';
          if (!item.section_title) {
            errorMessage = `Section ${convertToRoman(index + 1)} `;
          }
          errorMessage += `You missed to comment a question`;
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 4000 });
          hasError = true;
          commentErrorShown = true; // Set to true after showing the error
        }
      }
    });
    if (hasError) return;
    const data = {
      date_of_evaluation: evaluationEmployeeFormDetails.date_of_evaluation,
      form_data: evaluationForm,
      total_score: totalScore,
    };
    const form_uuid = params.form_uuid;
    const callbackReq = {
      onSuccess: (data: any) => {
        refetchEvaluationEmployeeFormDetails();
        setIsConfirmSubmitModalOpen(false);
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate({ form_uuid, data }, callbackReq);
  };

  return (
    <>
      {hasTemplate ? (
        hasForm ? (
          evaluationEmployeeFormDetails.is_completed ? (
            <>
              <div className='w-screen h-screen flex justify-center items-center'>
                <div className='fixed z-20 inset-0 overflow-y-auto'>
                  <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
                    <div className='fixed inset-0 transition-opacity'>
                      <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                    </div>
                    <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
                    <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6 py-4 px-8'>
                      <div className='text-center sm:text-left'>
                        <div className='my-4 flex justify-center'>
                          <ConfettiLogo />
                        </div>
                        <h1 className='text-center text-[#46d663] text-[32px] font-bold'>
                          Congratulations on completing your evaluation!
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Confetti width={width} height={height} />
            </>
          ) : (
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
                          id='evalatuion-form-datepicker'
                          placeholder={'mm/dd/yyyy'}
                          className={'block w-full border-0 py-1.5 px-6 text-gray-900 border-b-2 bg-transparent'}
                          selected={evaluationEmployeeFormDetails.date_of_evaluation}
                          pickerOnChange={(date: any) => {
                            if (evaluationEmployeeFormDetails)
                              setEvaluationEmployeeFormDetails({ ...evaluationEmployeeFormDetails, from: date });
                          }}
                          inputOnChange={(value: any) => {
                            setEvaluationEmployeeFormDetails({
                              ...evaluationEmployeeFormDetails,
                              from: value,
                            });
                          }}
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
                                      const updatedForm = prevForm.map((criterionItem: any, criterionIndex: number) => {
                                        if (criterionIndex === evaluationCriterionIndex) {
                                          return {
                                            ...criterionItem,
                                            criterion: criterionItem.criterion.map((item: any, itemIndex: number) => {
                                              if (itemIndex === index) {
                                                return { ...item, score: Math.max(prevScore - 1, 0) };
                                              }
                                              return item;
                                            }),
                                          };
                                        }
                                        return criterionItem;
                                      });
                                      return updatedForm;
                                    });
                                  }}
                                >
                                  <MinusIcon />
                                </div>
                                <div className='border p-2 rounded-md text-center w-1/3'>
                                  <input
                                    id={`score-${evaluationCriterionIndex}-${index}`}
                                    type='number'
                                    className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-1/4 focus:outline-none'
                                    value={item.score || 0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                        e.preventDefault();
                                      }
                                    }}
                                    onChange={(event) => {
                                      const newScore = Number(event.target.value);
                                      setEvaluationForm((prevForm: any) => {
                                        const updatedForm = prevForm.map(
                                          (criterionItem: any, criterionIndex: number) => {
                                            if (criterionIndex === evaluationCriterionIndex) {
                                              return {
                                                ...criterionItem,
                                                criterion: criterionItem.criterion.map(
                                                  (item: any, itemIndex: number) => {
                                                    if (itemIndex === index) {
                                                      return { ...item, score: newScore };
                                                    }
                                                    return item;
                                                  }
                                                ),
                                              };
                                            }
                                            return criterionItem;
                                          }
                                        );
                                        return updatedForm;
                                      });
                                    }}
                                  />
                                  <span className='text-base'>/ {item.max_score}</span>
                                </div>
                                <div
                                  className='p-2 cursor-pointer'
                                  onClick={() => {
                                    let prevScore = item.score || 0;
                                    setEvaluationForm((prevForm: any) => {
                                      const updatedForm = prevForm.map((criterionItem: any, criterionIndex: number) => {
                                        if (criterionIndex === evaluationCriterionIndex) {
                                          return {
                                            ...criterionItem,
                                            criterion: criterionItem.criterion.map((item: any, itemIndex: number) => {
                                              if (itemIndex === index) {
                                                const newScore = Math.min(prevScore + 1, item.max_score);
                                                return { ...item, score: newScore };
                                              }
                                              return item;
                                            }),
                                          };
                                        }
                                        return criterionItem;
                                      });
                                      return updatedForm;
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
                                  value={item.score || 0}
                                  onChange={(event) => {
                                    const newScore = Number(event.target.value);
                                    setEvaluationForm((prevForm: any) => {
                                      const updatedForm = prevForm.map(
                                        (criterionItem: any, criterionIndex: number) => {
                                          if (criterionIndex === evaluationCriterionIndex) {
                                            return {
                                              ...criterionItem,
                                              criterion: criterionItem.criterion.map(
                                                (item: any, itemIndex: number) => {
                                                  if (itemIndex === index) {
                                                    return { ...item, score: newScore };
                                                  }
                                                  return item;
                                                }
                                              ),
                                            };
                                          }
                                          return criterionItem;
                                        }
                                      );
                                      return updatedForm;
                                    });
                                  }}
                                  className='border px-8 py-2 rounded-md'
                                >
                                  {Array.from({ length: parseInt(item.max_score) + 1 }, (_, i) => (
                                    <option key={i} value={i}>{i}</option>
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
                                  value={item.score || 0}
                                  onChange={(event) => {
                                    const newScore = Number(event.target.value);
                                    setEvaluationForm((prevForm: any) => {
                                      const updatedForm = prevForm.map(
                                        (criterionItem: any, criterionIndex: number) => {
                                          if (criterionIndex === evaluationCriterionIndex) {
                                            return {
                                              ...criterionItem,
                                              criterion: criterionItem.criterion.map(
                                                (item: any, itemIndex: number) => {
                                                  if (itemIndex === index) {
                                                    return { ...item, score: newScore };
                                                  }
                                                  return item;
                                                }
                                              ),
                                            };
                                          }
                                          return criterionItem;
                                        }
                                      );
                                      return updatedForm;
                                    });
                                  }}
                                  className='w-full'
                                />
                                <div className='flex justify-between'>
                                  <div>0</div>
                                  <div>{item.max_score}</div>
                                </div>
                                <div className='text-center mt-2 font-semibold text-blue-600'>
                                  Score: {item.score || 0}
                                </div>
                              </div>
                            )}
                          </div>
                          {!item.is_disable_comment && (
                            <textarea
                              id={`comment-${evaluationCriterionIndex}-${index}`}
                              className='border rounded px-5 pt-4 pb-12 text-gray-400 w-1/2'
                              placeholder='Enter comment...'
                              value={item.comment || ''}
                              onChange={(event) => {
                                const newComment = event.target.value;
                                setEvaluationForm((prevForm: any) => {
                                  return prevForm.map((criterionItem: any, criterionIndex: number) => {
                                    if (criterionIndex === evaluationCriterionIndex) {
                                      return {
                                        ...criterionItem,
                                        criterion: criterionItem.criterion.map((item: any, itemIndex: number) => {
                                          if (itemIndex === index) {
                                            return { ...item, comment: newComment };
                                          }
                                          return item;
                                        }),
                                      };
                                    }
                                    return criterionItem;
                                  });
                                });
                              }}
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
                        onClick={() => {
                          setEvaluationCriterionIndex(evaluationCriterionIndex + 1);
                        }}
                      >
                        Next
                      </button>
                    )}
                    {evaluationCriterionIndex + 1 === evaluationTemplateDetails.evaluation_criterion.length && (
                      <button
                        type='button'
                        className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        onClick={() => setIsConfirmSubmitModalOpen(true)}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <div role='status'>
                            <svg
                              aria-hidden='true'
                              className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
                              viewBox='0 0 100 101'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                fill='currentColor'
                              />
                              <path
                                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                fill='currentFill'
                              />
                            </svg>
                            <span className='sr-only'>Loading...</span>
                          </div>
                        )}
                        {!isLoading && 'Submit'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        ) : (
          <>
            {evaluationEmployeeFormDetailsLoading && (
              <div className='w-screen h-screen flex justify-center items-center'>
                <div className='fixed z-20 inset-0 overflow-y-auto'>
                  <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
                    <div className='fixed inset-0 transition-opacity'>
                      <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                    </div>
                    <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
                    <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6 py-4 px-8'>
                      <div className='text-center sm:text-left'>
                        <div className='my-4 flex justify-center'>
                          <svg className='h-[56px] w-[83] mr-3 animate-spin' viewBox='0 0 24 24'>
                            <circle cx='12' cy='12' r='10' stroke='#2757ED' strokeWidth='4' fill='none' />
                            <path
                              fill='#2757ED'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20.735a8 8 0 008-8h4a12 12 0 01-12 12v-4.265zM20 12a8 8 0 01-8 8v4.265a12 12 0 0012-12h-4zm-8-6.735a8 8 0 018-8v-4.265a12 12 0 00-12 12h4z'
                            />
                          </svg>
                        </div>
                        <h1 className='text-center text-blue-600 text-[32px] font-bold'>Loading...</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!evaluationEmployeeFormDetailsLoading && (
              <div className='w-screen h-screen flex justify-center items-center'>
                <div className='fixed z-20 inset-0 overflow-y-auto'>
                  <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
                    <div className='fixed inset-0 transition-opacity'>
                      <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                    </div>
                    <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
                    <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6 py-4 px-8'>
                      <div className='text-center sm:text-left'>
                        <div className='my-4 flex justify-center'>
                          <svg
                            width='56'
                            height='83'
                            viewBox='0 0 104 104'
                            fill='d65846'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M51.5309 0C23.0704 0 0 23.0704 0 51.5309C0 79.9914 23.0704 103.062 51.5309 103.062C79.9914 103.062 103.062 79.9914 103.062 51.5309C103.062 23.0704 79.9914 0 51.5309 0ZM56.684 77.2964H46.3778V66.9902H56.684V77.2964ZM56.684 56.684H46.3778L43.8013 25.7655H59.2605L56.684 56.684Z'
                              fill='#d65846'
                            />
                          </svg>
                        </div>
                        <h1 className='text-center text-[#d65846] text-[32px] font-bold'>
                          Unable to locate the Employee Evaluation Form!
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      ) : (
        <>
          {evaluationTemplateDetailsLoading && (
            <div className='w-screen h-screen flex justify-center items-center'>
              <div className='fixed z-20 inset-0 overflow-y-auto'>
                <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
                  <div className='fixed inset-0 transition-opacity'>
                    <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                  </div>
                  <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
                  <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6 py-4 px-8'>
                    <div className='text-center sm:text-left'>
                      <div className='my-4 flex justify-center'>
                        <svg className='h-[56px] w-[83] mr-3 animate-spin' viewBox='0 0 24 24'>
                          <circle cx='12' cy='12' r='10' stroke='#2757ED' strokeWidth='4' fill='none' />
                          <path
                            fill='#2757ED'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20.735a8 8 0 008-8h4a12 12 0 01-12 12v-4.265zM20 12a8 8 0 01-8 8v4.265a12 12 0 0012-12h-4zm-8-6.735a8 8 0 018-8v-4.265a12 12 0 00-12 12h4z'
                          />
                        </svg>
                      </div>
                      <h1 className='text-center text-blue-600 text-[32px] font-bold'>Loading...</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!evaluationTemplateDetailsLoading && (
            <div className='w-screen h-screen flex justify-center items-center'>
              <div className='fixed z-20 inset-0 overflow-y-auto'>
                <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
                  <div className='fixed inset-0 transition-opacity'>
                    <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                  </div>
                  <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
                  <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6 py-4 px-8'>
                    <div className='text-center sm:text-left'>
                      <div className='my-4 flex justify-center'>
                        <svg
                          width='56'
                          height='83'
                          viewBox='0 0 104 104'
                          fill='d65846'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M51.5309 0C23.0704 0 0 23.0704 0 51.5309C0 79.9914 23.0704 103.062 51.5309 103.062C79.9914 103.062 103.062 79.9914 103.062 51.5309C103.062 23.0704 79.9914 0 51.5309 0ZM56.684 77.2964H46.3778V66.9902H56.684V77.2964ZM56.684 56.684H46.3778L43.8013 25.7655H59.2605L56.684 56.684Z'
                            fill='#d65846'
                          />
                        </svg>
                      </div>
                      <h1 className='text-center text-[#d65846] text-[32px] font-bold'>
                        Unable to locate the Evaluation Template!
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <ConfirmSubmitModal
        isOpen={isConfirmSubmitModalOpen}
        setIsOpen={setIsConfirmSubmitModalOpen}
        isLoading={isLoading}
        onSubmit={submitForm}
      />
    </>
  );
}
export default Content;
