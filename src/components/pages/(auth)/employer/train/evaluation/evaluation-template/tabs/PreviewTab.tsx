import { useEffect, useState } from 'react';

import CustomDatePicker from '@/components/CustomDatePicker';

import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';

function PreviewTab({ setIsPreview, getValues }: { setIsPreview: any; getValues: any }) {
  const evaluationDetails = getValues();
  const [currentTab, setSelectedTab] = useState(0);
  const [evaluationCriterionIndex, setEvaluationCriterionIndex] = useState(0);
  const [criterionSelected, setCriterionSelected] = useState<any>({});

  useEffect(() => {
    setCriterionSelected(evaluationDetails.evaluation_criterion[evaluationCriterionIndex]);
  }, [evaluationCriterionIndex]);

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

  return (
    <>
      <div className='w-full text-right px-4 pt-4'>
        <button
          className='bg-[#f3f4f6] border border-[#65C979] rounded-md py-2 px-8 text-[#65C979] text-sm font-semibold hover:shadow-md focus:shadow-none focus:opacity-80'
          onClick={() => setIsPreview(false)}
        >
          Back to editing
        </button>
      </div>
      {currentTab === 0 && (
        <>
          <div className='border-2 rounded-lg mx-4 mt-4 mb-12'>
            <div className='p-6 border-b-2'>
              <p className='text-[1.2rem] font-semibold'>{evaluationDetails.name}</p>
              <p>{evaluationDetails.description}</p>
            </div>
            <div className='px-6 py-8 mb-8'>
              <div className='w-full mb-8'>
                <label htmlFor='employeeName' className='block'>
                  1. Employee Name
                </label>
                <input
                  type='text'
                  id='employeeName'
                  placeholder='Enter Employee Name...'
                  className='block w-full border-0 py-1.5 px-6 text-gray-900 border-b-2 bg-transparent'
                  disabled
                />
              </div>
              <div className='w-full'>
                <label htmlFor='employeeName'>2. Date of Evaluation</label>
                <CustomDatePicker
                  name={'date_of_evaluation'}
                  selected={''}
                  pickerOnChange={''}
                  className={'block w-full border-0 py-1.5 px-6 text-gray-900 border-b-2 bg-transparent'}
                  objectFilter={''}
                  inputOnChange={''}
                  placeholder={'mm/dd/yyyy'}
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className='py-4 px-4 text-right'>
            <button
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
            {criterionSelected.section_title && (
              <div className='p-6 border-b-2'>
                <p className='text-[1.2rem] font-semibold'>
                  {convertToRoman(evaluationCriterionIndex + 1)}. {criterionSelected.section_title}
                </p>
                <p>{criterionSelected.section_description}</p>
              </div>
            )}
            {criterionSelected.criterion.map((item: any, index: number) => {
              return (
                <div key={index} className='px-[1.55rem] py-6'>
                  <div className='flex justify-between mb-8'>
                    <div>
                      {index + 1}. {item.title}
                    </div>
                    {evaluationDetails.criteria_rating_view_type === 'default' && (
                      <div className='flex gap-4 items-center text-center whitespace-nowrap'>
                        <div className='p-2'>
                          <MinusIcon />
                        </div>
                        <div className='border px-8 py-2 rounded-md'>0 | {item.max_score}</div>
                        <div className='p-2'>
                          <PlusIcon />
                        </div>
                      </div>
                    )}
                    {evaluationDetails.criteria_rating_view_type === 'dropdown' && (
                      <div className='flex gap-4 items-center text-center whitespace-nowrap'>
                        <select className='border px-8 py-2 rounded-md'>
                          {Array.from({ length: parseInt(item.max_score) + 1 }, (_, i) => (
                            <option key={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {evaluationDetails.criteria_rating_view_type === 'slider' && (
                      <div className='text-center whitespace-nowrap'>
                        <input type='range' min='0' max={item.max_score} defaultValue='0' className='w-full' />
                        <div className='flex justify-between'>
                          <div>0</div>
                          <div>{item.max_score}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {!item.is_disable_comment && (
                    <div className='border rounded px-5 pt-4 pb-12 text-gray-400'>Enter comment...</div>
                  )}
                  {index + 1 !== criterionSelected.criterion.length && (
                    <div className='mt-12 border-dashed border-b-2'></div>
                  )}
                </div>
              );
            })}
          </div>
          <hr />
          <div className='py-4 px-4 flex justify-between'>
            {evaluationCriterionIndex == 0 && (
              <button
                className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                onClick={() => setSelectedTab(0)}
              >
                Back
              </button>
            )}
            {evaluationCriterionIndex != 0 && (
              <button
                className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                onClick={() => setEvaluationCriterionIndex(evaluationCriterionIndex - 1)}
              >
                Back
              </button>
            )}
            {evaluationCriterionIndex + 1 !== evaluationDetails.evaluation_criterion.length && (
              <button
                className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                onClick={() => setEvaluationCriterionIndex(evaluationCriterionIndex + 1)}
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default PreviewTab;
