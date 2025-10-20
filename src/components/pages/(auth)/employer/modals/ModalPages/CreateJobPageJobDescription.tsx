import { Dispatch, useState, useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';

import { QUILL_FORMATS, QUILL_MODULES, CREATEJOB_TEMPLATE } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';

export default function CreateJobPageJobDescription({
  setValue,
  getValues,
  register,
  setPageNumber,
  onSubmit,
  setFileProps,
  hasSalaryRange,
  combinedFormData,
  positionData,
  firstForm,
}: {
  register: any;
  setValue: any;
  getValues: any;
  setPageNumber: Dispatch<number>;
  onSubmit: () => void;
  setFileProps: (fileProps: { fileName?: string; fileSize?: number; file?: File }) => void; // Update type definition
  hasSalaryRange?: boolean;
  combinedFormData?: any;
  positionData?: any[];
  firstForm?: any;
}) {
  const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
  const [manualInputFocus, setManualInputFocus] = useState({
    jobDescriptionFile: false,
    jobDescription: false,
    qualifications: false,
    notesRemarks: false,
  });
  const [filePropsLocal, setFilePropsLocal] = useState<{
    fileName?: string;
    fileSize?: number;
    file?: File;
  }>({});
  
  // Track the last position to detect changes
  const lastPositionRef = useRef<string | null>(null);

  // Helper function to get the appropriate description for a position
  const getPositionDescription = (positionId: string) => {
    if (!positionData) return CREATEJOB_TEMPLATE[0];
    
    const selectedPosition = positionData.find((pos: any) => pos.id === positionId);
    return selectedPosition?.description || CREATEJOB_TEMPLATE[0];
  };

  // Helper function to check if field should be populated (empty or contains default content)
  const shouldPopulateField = (currentContent: string) => {
    return !currentContent || 
      currentContent === '<ul><li><br></li></ul>' || 
      currentContent === '<p><br></p>' ||
      currentContent === CREATEJOB_TEMPLATE[0] ||
      currentContent.includes('Ensuring the accounts of the company are accurate and free of error');
  };

  // Effect to populate role field with selected position description
  useEffect(() => {
    const currentJobDescription = getValues('jobDescription');
    const currentPosition = firstForm?.getValues('position');
    
    // Check if position has changed - ALWAYS update when position changes
    if (currentPosition && currentPosition !== lastPositionRef.current) {
      lastPositionRef.current = currentPosition;
      const newDescription = getPositionDescription(currentPosition);
      setValue('jobDescription', newDescription);
      return;
    }
    
    // Initial population logic - only run if field is empty or contains default content
    if (shouldPopulateField(currentJobDescription)) {
      // Priority order: combinedFormData.positionDescription > currentPosition > combinedFormData.position
      let descriptionToUse = CREATEJOB_TEMPLATE[0]; // default fallback
      
      if (combinedFormData?.positionDescription) {
        descriptionToUse = combinedFormData.positionDescription;
      } else if (currentPosition) {
        descriptionToUse = getPositionDescription(currentPosition);
      } else if (combinedFormData?.position) {
        descriptionToUse = getPositionDescription(combinedFormData.position);
      }
      
      setValue('jobDescription', descriptionToUse);
    }
  }, [setValue, getValues, combinedFormData, positionData, firstForm]);

  return (
    <>
      <div className='px-4 pb-6'>
        <div className={`sm:col-span-4 mt-4 ${manualInputFocus.jobDescriptionFile ? 'border-2 border-blue-700' : ''}`}>
          <div>
            <label htmlFor='jobDescriptionFile' className='block text-sm font-medium leading-6 text-gray-900'>
              Job Description
              <span className='text-red-600'>*</span>
            </label>
            <p className='block text-sm leading-6 text-gray-400'>
              Describe the responsibilities of this job, required work experience, skills, or education.
            </p>
            <div className='flex items-center'>
              <label
                htmlFor='jobDescriptionFile'
                className='block mr-1 text-sm font-semibold leading-6 text-savoy-blue underline cursor-pointer'
              >
                Upload a PDF or DOCX
              </label>
              <label className='block text-sm font-medium leading-6 text-savoy-blue'>or fill in the box below.</label>
            </div>
            {filePropsLocal.fileName && (
              <>
                <p className='block text-sm font-medium leading-6 text-gray-900'>
                  <span>{filePropsLocal.fileName}</span> /
                  <span className='ml-1'>{`${(filePropsLocal?.fileSize
                    ? filePropsLocal.fileSize / 1024 / 1024
                    : 0
                  ).toFixed(2)} MB`}</span>
                </p>
                <button
                  id='fileJobDescriptionBtn'
                  type='button'
                  className='underline text-savoy-blue text-sm'
                  onClick={() => {
                    setValue('jobDescriptionFile', null);
                    setFilePropsLocal({});
                    setFileProps({});
                  }}
                >
                  Remove File
                </button>
              </>
            )}
            <div className='mt-2'>
              <input
                id='jobDescriptionFile'
                {...register('jobDescriptionFile', {
                  required: true,
                })}
                type='file'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileName = file.name;
                    const fileSize = file.size;

                    setFilePropsLocal({
                      fileName: fileName,
                      fileSize: fileSize,
                      file: file,
                    });
                    setValue('jobDescriptionFile', file);
                    setFileProps({
                      fileName: fileName,
                      fileSize: fileSize,
                      file: file,
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className={`sm:col-span-4 mt-4 ${manualInputFocus.jobDescription ? 'border-2 border-blue-700' : ''}`}>
          <label htmlFor='jobDescription' className='block text-sm font-medium leading-6 text-gray-900'>
            Role:
          </label>
          <div className='mt-2 h-72 mb-12'>
            <ReactQuill
              onChange={(value) => setValue('jobDescription', value)}
              formats={QUILL_FORMATS}
              modules={QUILL_MODULES}
              style={{ height: '100%', padding: '5px 8px !important' }}
              value={getValues('jobDescription')}
            />
          </div>
        </div>
        <div className='relative mt-2 flex gap-2'>
          <input 
            type='checkbox' 
            {...register('is_show_roles')} 
            id='is_show_roles' 
            onChange={(e) => setValue('is_show_roles', e.target.checked)} 
          />
          <label htmlFor='is_show_roles' className='ml-2'>
            Show Roles
          </label>
        </div>
        <div className={`sm:col-span-4 mt-4 ${manualInputFocus.qualifications ? 'border-2 border-blue-700' : ''}`}>
          <div className='flex items-center gap-2 mb-2'>
            <label htmlFor='qualifications' className='block text-sm font-medium leading-6 text-gray-900'>
              Qualifications
            </label>
            <div className='inline-flex items-center px-2 py-1 rounded-md bg-blue-50 border border-blue-200'>
              <svg className='w-3 h-3 text-blue-600 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
              <span className='text-xs font-medium text-blue-600'>Affects Search</span>
            </div>
          </div>
          <p className='text-sm text-gray-600 mb-2'>
          Applicants search using qualifications like these. Setting them here boosts your listing visibility to the right candidates.
          </p>
          <div className='mt-2 h-72 mb-12'>
            <ReactQuill
              onChange={(value) => setValue('qualifications', value)}
              formats={QUILL_FORMATS}
              modules={QUILL_MODULES}
              style={{ height: '100%', padding: '5px 8px !important' }}
              value={getValues('qualifications')}
            />
          </div>
        </div>
        <div className={`sm:col-span-4 mt-4 ${manualInputFocus.notesRemarks ? 'border-2 border-blue-700' : ''}`}>
          <label htmlFor='notesRemarks' className='block text-sm font-medium leading-6 text-gray-900'>
            Notes/Remarks (optional):
          </label>
          <div className='mt-2 h-32 mb-12'>
            <ReactQuill
              onChange={(value) => setValue('notesRemarks', value)}
              formats={QUILL_FORMATS}
              modules={QUILL_MODULES}
              style={{ height: '100%', padding: '5px 8px !important' }}
              value={getValues('notesRemarks')}
            />
          </div>
        </div>
        <div className='relative mt-2 flex gap-2'>
          <input
            type='checkbox'
            {...register('is_show_remarks')}
            id='is_show_remarks'
            onChange={(e) => setValue('is_show_remarks', e.target.checked)}
          />
          <label htmlFor='is_show_remarks' className='ml-2'>
            Show Notes/Remarks
          </label>
        </div>
      </div>
      <hr />
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4'>
        <button
          id='pageJobDescriptionNextBtn'
          type='button'
          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
          onClick={async () => {
            const jobDescriptionFile = getValues('jobDescriptionFile');
            const jobDescription = getValues('jobDescription');
            const qualifications = getValues('qualifications');
            const notesRemarks = getValues('notesRemarks');
            const results = [
              filePropsLocal.fileName,
              jobDescription !== '<ul><li><br></li></ul>' && jobDescription !== '<p><br></p>' && jobDescription,
              qualifications !== '<ul><li><br></li></ul>' && qualifications !== '<p><br></p>' && qualifications,
              notesRemarks !== '<ul><li><br></li></ul>' && notesRemarks !== '<p><br></p>' && notesRemarks,
            ];
            const incomplete = results.every((item: boolean) => !item);
            if (!incomplete) {
              onSubmit();
            } else {
              setManualInputFocus({
                jobDescriptionFile: !!!jobDescriptionFile,
                jobDescription: !!!jobDescription,
                qualifications: !!!qualifications,
                notesRemarks: !!!notesRemarks,
              });
            }
          }}
        >
          Next
        </button>
        <button
          id='pageJobDescriptionBackBtn'
          type='button'
          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => {
            if (hasSalaryRange) {
              setPageNumber(3);
            } else {
              setPageNumber(2);
            }
          }}
        >
          Back
        </button>
      </div>
    </>
  );
}
