import { Dispatch, useState } from 'react';

export default function CreateJobPageSix({
  firstFormGetValues,
  fourthFormGetValues,
  setPageNumber,
  onSubmit,
}: {
  firstFormGetValues: any;
  fourthFormGetValues: any;
  setPageNumber: Dispatch<number>;
  onSubmit: () => void;
}) {
  const markup = { __html: fourthFormGetValues('jobDescription') };
  const markup2 = { __html: fourthFormGetValues('qualifications') };

  return (
    <>
      <div className='px-4 pb-6'>
        {/* start */}
        <div className='sm:col-span-4 mt-4'>
          <label className='block text-sm font-medium leading-6 text-gray-900'>
            Preview
          </label>
          <div className='relative flex flex-col space-y-2 mt-2 text-sm font-medium leading-6 text-gray-900 rounded-md border-2 border-text-gray-400 px-2 py-3'>
            <p className='font-bold'>{firstFormGetValues('jobTitle')}</p>
            <p>
              The ABBA Initiative - <span>{firstFormGetValues('placeAdvertise')}</span>
            </p>
            <span className='top-20 left-0 w-full border' />
            <div className='mt-[8rem]'>
              Role:
              <span dangerouslySetInnerHTML={markup}></span>
            </div>
            <div className='mt-8'>
              <p>Qualifications:</p>
              <p dangerouslySetInnerHTML={markup2}></p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4'>
        <button
          id='pageSixNextBtn'
          type='button'
          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
          onClick={onSubmit}
        >
          Next
        </button>
        <button
          id='pageSixBackBtn'
          type='button'
          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => setPageNumber(5)}
        >
          Back
        </button>
      </div>
    </>
  );
}
