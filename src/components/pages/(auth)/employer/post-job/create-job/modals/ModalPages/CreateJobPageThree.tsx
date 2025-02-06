import { Dispatch, ChangeEvent, useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

export default function CreateJobPageThree({
  watch,
  setValue,
  register,
  setPageNumber,
  trigger,
  setFocus,
  getValues,
  onSubmit,
}: {
  watch: any;
  register: any;
  setValue: any;
  setPageNumber: Dispatch<number>;
  trigger: any;
  setFocus: any;
  getValues: any;
  onSubmit: () => void;
}) {
  const [selectedBenefitOptions, setSelectedBenefitOptions] = useState<string[]>([]);
  const [selectedOtherBenefit, setSelectedOtherBenefit] = useState<string[]>([]);
  const [manualInputFocus, setManualInputFocus] = useState({
    benefits: false,
    range: false,
    amount: false,
  });
  const [isOtherBenefitOpen, setIsOtherBenefitOpen] = useState(false);
  const SalarTypeValue = watch('salary.salaryType');

  const ListOfBenefits = [
    'Work from home',
    'Paid training',
    'Salary Raise',
    'Flexible Schedule',
    'Health insurance',
    'Gym Membership',
    'Quarterly Incentives',
    'Fuel Discount',
    'Birthday Leave',
    'Book Allowance',
    '4-day Work Week',
    'Life Insurance',
    'Leasing Program',
    'Company Car',
    'Meal Allowance',
  ];

  //combining the selectedBenefits and otherBenefits
  useEffect(() => {
    // check if the isOtherBenfitOpen is true
    let concatenatedValue;
    if (isOtherBenefitOpen) {
      concatenatedValue = [...selectedBenefitOptions, ...selectedOtherBenefit];
    } else {
      concatenatedValue = selectedBenefitOptions;
    }
    setValue('benefits', concatenatedValue);
  }, [selectedBenefitOptions, selectedOtherBenefit, isOtherBenefitOpen, setValue]);

  // Convert string to array of string in other benefits
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const stringData = event.target.value;
    const arrayData = stringData.split(',');
    setSelectedOtherBenefit(arrayData);
  };

  return (
    <div onClick={() => setManualInputFocus({ benefits: false, range: false, amount: false })}>
      <div className='px-4 pb-6'>
        {/* start */}
        <div className='sm:col-span-4 mt-4'>
          <label htmlFor='salary' className='block text-sm font-medium leading-6 text-gray-900'>
            How do you want to indicate the salary?
            <span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='salary'
              {...register('salary.salaryType', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              onClick={() =>
                setManualInputFocus({
                  benefits: false,
                  range: false,
                  amount: false,
                })
              }
            >
              <option>Range</option>
              <option>Start Amount</option>
              <option>Exact Amount</option>
              <option>Maximum Amount</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
        {/* start */}

        <div className={`flex items-center gap-3 mt-4`}>
          {SalarTypeValue == 'Range' ? (
            <>
              <div className='relative w-3/4'>
                <label htmlFor='minimum' className='block text-sm font-medium leading-6 text-gray-900'>
                  Minimum
                  <span className='text-red-600'>*</span>
                </label>
                <div className='relative mt-2'>
                  <input
                    id='minimum'
                    {...register('salary.salaryRangeMin', {
                      required: true,
                    })}
                    type='number'
                    className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block w-full text-right rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 ${
                      manualInputFocus.range ? 'border-2 border-blue-700' : ''
                    }`}
                    onClick={() =>
                      setManualInputFocus({
                        benefits: false,
                        range: false,
                        amount: false,
                      })
                    }
                  />
                  <div className='pointer-events-none absolute text-sm inset-y-0 left-2 text-gray-900 flex items-center pr-4'>
                    <p>PHP</p>
                  </div>
                </div>
              </div>
              <p className='flex-none text-center mt-7'>to</p>
              <div className='relative w-3/4'>
                <label htmlFor='maximum' className='block text-sm font-medium leading-6 text-gray-900'>
                  Maximum
                  <span className='text-red-600'>*</span>
                </label>
                <div className='relative mt-2'>
                  <input
                    id='maximum'
                    {...register('salary.salaryRangeMax', {
                      required: true,
                    })}
                    type='number'
                    className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block w-full text-right rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                      manualInputFocus.range ? 'border-2 border-blue-700' : ''
                    }`}
                    onClick={() =>
                      setManualInputFocus({
                        benefits: false,
                        range: false,
                        amount: false,
                      })
                    }
                  />
                  <div className='pointer-events-none absolute text-sm inset-y-0 left-2 text-gray-900 flex items-center pr-4'>
                    <p>PHP</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='w-full'>
              <label htmlFor='salaryValue' className='block text-sm font-medium leading-6 text-gray-900'>
                {SalarTypeValue}
                <span className='text-red-600'>*</span>
              </label>
              <div className='relative mt-2'>
                <input
                  id='salaryValue'
                  {...register('salary.salaryValue', {
                    required: true,
                  })}
                  type='number'
                  className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block w-full text-right rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 ${
                    manualInputFocus.amount ? 'border-2 border-blue-700' : ''
                  }`}
                  onClick={() =>
                    setManualInputFocus({
                      benefits: false,
                      range: false,
                      amount: false,
                    })
                  }
                />
                <div className='pointer-events-none absolute text-sm inset-y-0 left-2 text-gray-900 flex items-center pr-4'>
                  <p>PHP</p>
                </div>
              </div>
            </div>
          )}

          {/* Rate */}
          <div className='w-full'>
            <label htmlFor='salary' className='block text-sm font-medium leading-6 text-gray-900'>
              Rate
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='salary'
                {...register('rate', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                onClick={() =>
                  setManualInputFocus({
                    benefits: false,
                    range: false,
                    amount: false,
                  })
                }
              >
                <option>Monthly</option>
                <option>Bi-monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
                <option>Hourly</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
        </div>
        <div className='relative mt-2 flex gap-2'>
          <input type='checkbox' {...register('is_show_salary', { required: true })} id='is_show_salary' value='true' />
          <label htmlFor='is_show_salary' className='ml-2'>
            Show Salary
          </label>
        </div>
        {/* end */}
        <div className='sm:col-span-4 mt-4'>
          <label htmlFor='language' className='block text-sm font-medium leading-6 text-gray-900'>
            Do you offer any of the following benefits?
            <span className='text-red-600'>*</span>
          </label>
          <div className={`flex flex-wrap mt-2 gap-4 ${manualInputFocus.benefits ? 'border-2 border-blue-700' : ''}`}>
            {ListOfBenefits.map((benefit, index) => {
              return (
                <button
                  key={index}
                  id={`benefitBtn${index}`}
                  type='button'
                  value={benefit}
                  className={`text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md ${
                    selectedBenefitOptions.includes(benefit) ? 'bg-slate-400' : ''
                  }`}
                  onClick={() => {
                    setManualInputFocus({
                      benefits: false,
                      range: false,
                      amount: false,
                    });
                    setSelectedBenefitOptions((prevOptions) => {
                      if (prevOptions.includes(benefit)) {
                        // If the benefit is already selected, remove it from the options
                        return prevOptions.filter((option) => option !== benefit);
                      } else {
                        // If the benefit is not selected, add it to the options
                        return [...prevOptions, benefit];
                      }
                    });
                  }}
                >
                  {selectedBenefitOptions.includes(benefit) ? '✓ ' : '+ '}
                  {benefit}
                </button>
              );
            })}
            <button
              id='otherBenefitBtn'
              type='button'
              className={`text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md ${
                isOtherBenefitOpen ? 'bg-slate-400' : ''
              }`}
              onClick={() => {
                setIsOtherBenefitOpen(!isOtherBenefitOpen);
                setManualInputFocus({
                  benefits: false,
                  range: false,
                  amount: false,
                });
              }}
            >
              {isOtherBenefitOpen ? '✓ ' : '+ '} Other
            </button>
          </div>
        </div>

        {isOtherBenefitOpen && (
          <div className='sm:col-span-4 mt-4'>
            <div>
              <label htmlFor='otherBenefits' className='block text-sm font-medium leading-6 text-gray-900'>
                If you selected other, please input the benefit/s. Add comma after the word if it&#39;s more than one.
              </label>
              <div className='mt-2'>
                <input
                  id='otherBenefits'
                  type='text'
                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}
        <div className='relative flex gap-2 mt-4'>
          <input
            type='checkbox'
            {...register('is_show_benefits', { required: true })}
            id='is_show_benefits'
            value='true'
          />
          <label htmlFor='is_show_benefits' className='ml-2'>
            Show Benefits
          </label>
        </div>
      </div>
      <hr />
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4'>
        <button
          id='pageThreeNextBtn'
          type='button'
          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
          onClick={async () => {
            const salaryType = await trigger('salary.salaryType');
            if (!salaryType) {
              setFocus('salaryType');
            }
            const salaryValue = await trigger('salary.salaryValue');
            if (!salaryValue) {
              setFocus('salaryValue');
            }
            const rate = await trigger('rate');
            if (!rate) {
              setFocus('rate');
            }
            const benefits = selectedBenefitOptions.length > 0;
            const salaryTypeValue = getValues('salary.salaryType');
            const salaryRangeMinValue = getValues('salary.salaryRangeMin');
            const salaryRangeMaxValue = getValues('salary.salaryRangeMax');
            const salaryValueValue = getValues('salary.salaryValue');
            setManualInputFocus({
              benefits: !!!benefits && !isOtherBenefitOpen,
              range: salaryTypeValue === 'Range' && !salaryRangeMinValue && !salaryRangeMaxValue ? true : false,
              amount:
                salaryTypeValue !== 'Range' && (salaryValueValue.trim() === '-' || !salaryValueValue) ? true : false,
            });
            if (salaryTypeValue === 'Range') {
              if (parseInt(salaryRangeMinValue) >= parseInt(salaryRangeMaxValue)) {
                toast.custom(
                  () => (
                    <CustomToast
                      message={'Minimum salary cannot be greater than or equal to maximum salary.'}
                      type='error'
                    />
                  ),
                  {
                    duration: 7000,
                  }
                );
                return;
              }
            }
            const results = [salaryType, rate, benefits || isOtherBenefitOpen];
            const incomplete = results.some((item: boolean) => !item);
            if (
              !incomplete &&
              ((salaryTypeValue === 'Range' && salaryRangeMinValue && salaryRangeMaxValue) ||
                (salaryTypeValue !== 'Range' && salaryValueValue.trim() !== '-' && salaryValueValue))
            ) {
              onSubmit();
            }
          }}
        >
          Next
        </button>
        <button
          id='pageThreeBackBtn'
          type='button'
          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => setPageNumber(2)}
        >
          Back
        </button>
      </div>
    </div>
  );
}
