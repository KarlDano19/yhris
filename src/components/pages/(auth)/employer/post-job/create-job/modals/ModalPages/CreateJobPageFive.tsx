import { Dispatch, useState } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

export default function CreateJobPageFive({
  setValue,
  register,
  setPageNumber,
  getValues,
  isRangeBenefitsAdded,
  onSubmit,
}: {
  setValue: any;
  register: any;
  setPageNumber: Dispatch<number>;
  getValues: any;
  isRangeBenefitsAdded: boolean;
  onSubmit: () => void;
}) {
  const [showInput, setShowInput] = useState(false);
  const [manualInputFocus, setManualInputFocus] = useState(false);
  const [fileProps, setFileProps] = useState<{
    fileName?: string;
    fileSize?: number;
  }>({});

  const handleSelection = (e: any) => {
    const { value } = e.target;
    setManualInputFocus(false);

    if (value !== 'upload') {
      setFileProps({});
      setShowInput(!showInput);
    } else {
      setShowInput(!showInput);
    }
  };

  return (
    <>
      <div className='px-4 pb-6'>
        {/* start */}
        <div className='sm:col-span-4 mt-4'>
          <label htmlFor='country' className='block text-sm font-medium leading-6 text-gray-900'>
            Post as
            <span className='text-red-600'>*</span>
          </label>
          <div className={`flex flex-col space-y-2 ml-2 mt-2 ${manualInputFocus ? 'border-2 border-blue-700' : ''}`}>
            <label className='inline-flex items-center mr-4'>
              <input
                id='textBtn'
                type='radio'
                className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
                value='text'
                name='postAsRadioGroup'
                {...register('postAs', { required: true })}
                onChange={handleSelection}
              />
              <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>Text</span>
            </label>

            {/* <label className='inline-flex items-start'>
              <input
                id='posterBtn'
                type='radio'
                className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
                value='poster'
                name='postAsRadioGroup'
                {...register('postAs', { required: true })}
                onChange={handleSelection}
              />
              <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>
                Poster
                <span className='block mt-0 font-normal text-gray-400'>
                  Please make sure that you have set-up your hiring poster
                  template in the Employee Kit.
                </span>
              </span>
            </label> */}

            <label className='inline-flex items-center'>
              <input
                id='uploadBtn'
                type='radio'
                className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
                value='upload'
                name='postAsRadioGroup'
                {...register('postAs', {
                  required: true,
                  onChange: (e: any) => {
                    const file = e.target.files[0];
                    if (file && file.size > 5 * 1024 * 1024) {
                      toast.custom(
                        () => (
                          <CustomToast message='Curriculum Vitae/Resume size should not exceed 5 MB' type='error' />
                        ),
                        {
                          duration: 7000,
                        }
                      );
                      e.target.value = null;
                    }
                  },
                })}
                onChange={handleSelection}
              />
              <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>Upload</span>
            </label>
            <label
              htmlFor='postAsUpload'
              className={`block ml-7 text-sm font-normal text-gray-400 border w-fit p-2.5 border-gray-400 rounded-md cursor-pointer ${
                !showInput ? 'opacity-75' : ''
              }`}
            >
              Upload Jpeg or PNG...
            </label>
            {fileProps.fileName && (
              <div className='ml-9 mt-2'>
                <p className='block text-sm font-medium leading-6 text-gray-900'>
                  <span>{fileProps.fileName}</span> /
                  <span className='ml-1'>{`${(fileProps?.fileSize ? fileProps.fileSize / 1024 / 1024 : 0).toFixed(
                    2
                  )} MB`}</span>
                </p>
                <button
                  id='postAsUploadBtn'
                  type='button'
                  className='underline text-savoy-blue text-sm'
                  onClick={() => {
                    setValue('postAsUpload', null);
                    setFileProps({});
                  }}
                >
                  Remove File
                </button>
              </div>
            )}
            <div className='mt-2'>
              <input
                id='postAsUpload'
                {...register('postAsUpload', {
                  required: false,
                })}
                type='file'
                className='hidden'
                disabled={!showInput}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileName = e.target.files?.[0].name;
                    const fileSize = e.target.files?.[0].size;
                    setFileProps({
                      fileName: fileName,
                      fileSize: fileSize,
                    });
                    setValue('postAsUpload', file);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4'>
        <button
          id='pageFiveNextBtn'
          type='button'
          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
          onClick={() => {
            const postAs = getValues('postAs');
            if ((postAs && postAs !== 'upload') || (postAs === 'upload' && fileProps.fileName)) {
              onSubmit();
            } else {
              setManualInputFocus(true);
            }
          }}
        >
          Next
        </button>
        <button
          id='pageFiveBackBtn'
          type='button'
          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => {
            if (isRangeBenefitsAdded) {
              setPageNumber(3);
            } else {
              setPageNumber(4);
            }
          }}
        >
          Back
        </button>
      </div>
    </>
  );
}
