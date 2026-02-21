import { Dispatch, useState, useEffect } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

export default function CreateJobPagePostAs({
  setValue,
  register,
  setPageNumber,
  getValues,
  isRangeBenefitsAdded,
  onSubmit,
  pageNumber,
  isEdit,
  onSave,
  isLoading,
}: {
  setValue: any;
  register: any;
  setPageNumber: Dispatch<number>;
  getValues: any;
  isRangeBenefitsAdded: boolean;
  onSubmit: () => void;
  pageNumber?: number;
  isEdit?: boolean;
  onSave?: () => void;
  isLoading?: boolean;
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
      setShowInput(false);
    } else {
      setShowInput(true);
    }
  };

  useEffect(() => {
    if (getValues('postAs') === 'upload') {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
  }, [pageNumber, getValues]);

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
                value='default'
                name='postAsRadioGroup'
                {...register('postAs', { required: true })}
                onChange={handleSelection}
              />
              <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>Default</span>
            </label>

            <label className='inline-flex items-center'>
              <input
                id='uploadBtn'
                type='radio'
                className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
                value='upload'
                name='postAsRadioGroup'
                {...register('postAs', {
                  required: true,
                })}
                onChange={handleSelection}
              />
              <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>Upload</span>
            </label>

            {getValues('postAs') === 'upload' && getValues('uploadedImage') && !getValues('postAsUpload') && (
              <div className='block ml-7 text-sm font-medium leading-6 text-gray-900'>
                Current Uploaded Image:{' '}
                <a
                  href={getValues('uploadedImage')}
                  className='text-savoy-blue underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Current Uploaded Image
                </a>
              </div>
            )}

            <label
              htmlFor='postAsUpload'
              className={`block ml-7 text-sm font-normal text-gray-400 border w-fit p-2.5 border-gray-400 rounded-md ${
                !showInput ? 'opacity-75' : 'cursor-pointer'
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
                  onChange: (e: any) => {
                    const file = e.target.files?.[0];
                    if (file && file.size > 5 * 1024 * 1024) {
                      toast.custom(() => <CustomToast message='Poster size should not exceed 5 MB' type='error' />, {
                        duration: 7000,
                      });
                      e.target.value = null;
                    } else {
                      const fileName = file?.name;
                      const fileSize = file?.size;
                      setFileProps({
                        fileName: fileName,
                        fileSize: fileSize,
                      });
                      setValue('postAsUpload', file);
                      setManualInputFocus(false);
                    }
                  },
                })}
                type='file'
                className='hidden'
                disabled={!showInput}
                accept='image/png, image/jpeg, image/jpg'
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='mt-5 flex flex-col gap-3 px-4 sm:mt-4 sm:flex-row sm:justify-between'>
        <button
          id='pagePostAsBackBtn'
          type='button'
          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => {
            if (isRangeBenefitsAdded) {
              setPageNumber(4);
            } else {
              setPageNumber(5);
            }
          }}
        >
          Back
        </button>
        <div className='flex gap-3 flex-row-reverse'>
          <button
            id='pagePostAsNextBtn'
            type='button'
            className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
            onClick={() => {
              const postAs = getValues('postAs');
              if ((postAs && postAs !== 'upload') || (postAs === 'upload' && fileProps.fileName)) {
                onSubmit();
              } else {
                if (getValues('uploadedImage')) {
                  onSubmit();
                } else {
                  setManualInputFocus(true);
                }
              }
            }}
          >
            Next
          </button>
          {isEdit && onSave && (
            <button
              type='button'
              className='inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={onSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
