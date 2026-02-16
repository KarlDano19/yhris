import { Dispatch, useEffect, useState } from 'react';
import { LinkedIn, Facebook } from '@/svg/SocialMedia';

export default function CreateJobPagePlatform({
  isLoading,
  setValue,
  getValues,
  setPageNumber,
  register,
  onSubmit,
  pageNumber,
  isEdit,
}: {
  isLoading: any;
  setValue: any;
  getValues?: any;
  setPageNumber: Dispatch<number>;
  register: any;
  onSubmit: any;
  pageNumber?: number;
  isEdit?: boolean;
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [manualInputFocus, setManualInputFocus] = useState(false);
  const [originalPlatforms, setOriginalPlatforms] = useState<string[]>([]);

  const handleRadioChange = (value: string) => {
    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(value)) {
        return prevOptions.filter((option) => option !== value); // Deselect the option by removing it from the array
      } else {
        return [...prevOptions.filter((option) => option !== value), value]; // Select the option by adding it to the array
      }
    });
  };

  useEffect(() => {
    if (selectedOptions.length > 0) {
      setValue('postIn', selectedOptions);
    }
  }, [selectedOptions, setValue]);

  useEffect(() => {
    if (getValues) {
      // Check for shared_to first (from API data)
      const sharedTo = getValues('shared_to');
      if (sharedTo && isEdit) {
        let platforms: string[] = [];
        if (typeof sharedTo === 'string') {
          // Filter out empty strings after splitting and trimming
          platforms = sharedTo.split(',').map(item => item.trim()).filter(item => item !== '');
        } else if (Array.isArray(sharedTo)) {
          // Filter out empty strings from array
          platforms = sharedTo.filter(item => item && item.trim() !== '');
        }

        // Set original platforms ONCE when component loads in edit mode
        if (originalPlatforms.length === 0 && platforms.length > 0) {
          setOriginalPlatforms(platforms);
        }

        // Set current selected options
        setSelectedOptions(platforms);
      } else if (getValues('postIn')) {
        const postIn = getValues('postIn');
        if (Array.isArray(postIn)) {
          const filteredPostIn = postIn.filter(item => item && item.trim() !== '');
          setSelectedOptions(filteredPostIn);
        } else if (typeof postIn === 'string') {
          const filteredPostIn = postIn.split(',').map(item => item.trim()).filter(item => item !== '');
          setSelectedOptions(filteredPostIn);
        } else {
          setSelectedOptions([]);
        }
      }
    }
  }, [pageNumber, getValues, getValues && getValues('shared_to'), isEdit, originalPlatforms.length]);

  return (
    <>
      <div className='px-4 pb-6'>
        {/* start */}
        <div className='sm:col-span-4 mt-4'>
          <label className='block text-sm font-medium leading-6 text-gray-900'>
            Post in (you may select multiple platforms):
          </label>
          {isEdit && originalPlatforms.length > 0 && (
            <p className='text-sm text-gray-500 mt-1'>
              You can add new platforms, but cannot remove previously selected platforms.
            </p>
          )}
          <div className={`flex flex-col space-y-2 ml-2 mt-2 ${manualInputFocus ? 'border-2 border-blue-700' : ''}`}>
            <label className={`inline-flex items-center mr-4 ${isEdit && originalPlatforms.includes('LinkedIn') ? 'opacity-60' : ''}`}>
              <input
                id='linkedinCheckbox'
                type='checkbox'
                className='form-checkbox h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
                name='socialLinkedin'
                onChange={() => {
                  handleRadioChange('LinkedIn');
                  setManualInputFocus(false);
                }}
                checked={selectedOptions.includes('LinkedIn')}
                disabled={isEdit && originalPlatforms.includes('LinkedIn')}
              />
              <span className='flex items-center ml-2 text-sm font-medium leading-6 text-gray-900'>
                <LinkedIn /> <span className='ml-2'>LinkedIn</span>
              </span>
            </label>
            <label className={`inline-flex items-start mr-4 ${isEdit && originalPlatforms.includes('Facebook') ? 'opacity-60' : ''}`}>
              <input
                id='facebookRadioBtn'
                type='checkbox'
                className='form-checkbox h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
                name='socialFacebook'
                onChange={() => {
                  handleRadioChange('Facebook');
                  setManualInputFocus(false);
                }}
                checked={selectedOptions.includes('Facebook')}
                disabled={isEdit && originalPlatforms.includes('Facebook')}
              />
              <span className='flex items-center ml-2 text-sm font-medium leading-6 text-gray-900'>
                <Facebook />
                <span className='ml-2'>Facebook</span>
              </span>
            </label>
          </div>
          <div className='mt-3'>
            <label htmlFor='jobUrl' className='block text-sm font-medium leading-6 text-gray-900'>
              Add a link to your job post
            </label>
            <div className='mt-1'>
              <input
                id='jobUrl'
                placeholder='https://example.com/careers/job-posting'
                {...register('jobUrl', { required: false })}
                type='text'
                className='block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4'>
        <button
          id='pagePlatformNextBtn'
          type='button'
          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
          onClick={() => {
            if (selectedOptions.length > 0) {
              onSubmit();
            } else {
              setManualInputFocus(true);
            }
          }}
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
          {!isLoading && !isEdit && 'Share'}
          {!isLoading && isEdit && 'Save'}
        </button>
        <button
          id='pagePlatformBackBtn'
          type='button'
          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => setPageNumber(7)}
        >
          Back
        </button>
      </div>
    </>
  );
}
