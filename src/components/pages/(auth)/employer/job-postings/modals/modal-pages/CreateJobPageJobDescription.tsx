import React, { Dispatch, useState, useEffect, useRef, useMemo } from 'react';

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
  isEdit,
  onSave,
  isLoading,
  uploadedJobDescriptionUrl,
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
  isEdit?: boolean;
  onSave?: () => void;
  isLoading?: boolean;
  uploadedJobDescriptionUrl?: string | null;
}) {
  // SSR-safe ReactQuill - memoized to prevent re-creation on every render
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
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
  
  // Skills state management
  const [skillsInput, setSkillsInput] = useState('');
  const [tagsSkill, setTagsSkill] = useState<string[]>([]);
  
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
      currentContent === CREATEJOB_TEMPLATE[0];
  };

  // Sync skills from form to UI
  useEffect(() => {
    const currentSkills = getValues('skills');
    
    let skillsArray: string[] = [];
    if (Array.isArray(currentSkills)) {
      skillsArray = currentSkills;
    } else if (typeof currentSkills === 'string' && currentSkills.trim()) {
      skillsArray = currentSkills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }
    
    setTagsSkill(skillsArray);
  }, [getValues, combinedFormData]);

  // Handle skills input key down
  const handleKeyDownSkill = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === ',') {
      event.preventDefault();
      const newTag = skillsInput.trim();
      if (newTag !== '' && !tagsSkill.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
        const newTags = [...tagsSkill, newTag];
        setTagsSkill(newTags);
        setValue('skills', newTags);
        setSkillsInput('');
      }
    }
  };

  const handleRemoveTagSkill = (tag: string) => {
    const newTags = tagsSkill.filter((t) => t !== tag);
    setTagsSkill(newTags);
    setValue('skills', newTags);
  };

  // Effect to populate role field with selected position description
  useEffect(() => {
    const currentJobDescription = getValues('jobDescription');
    const currentPosition = firstForm?.getValues('position');
    
    // Check if position has changed - only update if current content is still template/empty
    if (currentPosition && currentPosition !== lastPositionRef.current) {
      lastPositionRef.current = currentPosition;
      if (shouldPopulateField(currentJobDescription)) {
        const newDescription = getPositionDescription(currentPosition);
        setValue('jobDescription', newDescription);
      }
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
            {uploadedJobDescriptionUrl && !filePropsLocal.fileName && (
              <div className='block ml-0 text-sm font-medium leading-6 text-gray-900'>
                Current Uploaded File:{' '}
                <a
                  href={uploadedJobDescriptionUrl}
                  className='text-savoy-blue underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Uploaded Job Description
                </a>
              </div>
            )}
            <div className='mt-2'>
              <input
                id='jobDescriptionFile'
                {...register('jobDescriptionFile')}
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
            {...register('isShowRoles')}
            id='isShowRoles'
            onChange={(e) => setValue('isShowRoles', e.target.checked)}
          />
          <label htmlFor='isShowRoles' className='ml-2'>
            Show Roles
          </label>
        </div>
        <div className='sm:col-span-4 mt-4'>
          <div className='flex items-center gap-2 mb-2'>
            <label htmlFor='skills' className='block text-sm font-medium leading-6 text-gray-900'>
              Skills
            </label>
            <div className='inline-flex items-center px-2 py-1 rounded-md bg-blue-50 border border-blue-200'>
              <svg className='w-3 h-3 text-blue-600 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
              <span className='text-xs font-medium text-blue-600'>Affects Search</span>
            </div>
          </div>
          <p className='text-sm text-gray-600 mb-2'>
            Add relevant skills for this position. Applicants can search by these skills to find your job posting.
          </p>
          <div className='mt-2'>
            {/* Hidden input to register skills field with react-hook-form */}
            <input
              type='hidden'
              {...register('skills')}
            />
            <div className='relative flex items-center'>
              <input
                type='text'
                id='skills'
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                placeholder='Enter skills and press Enter, Tab, or comma to add...'
              />
            </div>
            {/* Skills Tags Display */}
            {tagsSkill.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {tagsSkill.map((tagSkill: string) => (
                  <div
                    key={tagSkill}
                    className='flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
                  >
                    <span>{tagSkill}</span>
                    <button
                      type='button'
                      onClick={() => handleRemoveTagSkill(tagSkill)}
                      className='text-blue-600 hover:text-blue-800 font-bold text-lg leading-none'
                      title='Remove skill'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              value={getValues('notesRemarks') || ''}
            />
          </div>
        </div>
        <div className='relative mt-2 flex gap-2'>
          <input
            type='checkbox'
            {...register('isShowRemarks')}
            id='isShowRemarks'
            onChange={(e) => setValue('isShowRemarks', e.target.checked)}
          />
          <label htmlFor='isShowRemarks' className='ml-2'>
            Show Notes/Remarks
          </label>
        </div>
      </div>
      <hr />
      <div className='mt-5 flex flex-col gap-3 px-4 sm:mt-4 sm:flex-row sm:justify-between'>
        <button
          id='pageJobDescriptionBackBtn'
          type='button'
          className='inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => {
            // Check if salary fields are actually filled
            const hasSalaryData = combinedFormData?.salary?.salaryType &&
                                  combinedFormData?.rate &&
                                  combinedFormData?.benefits &&
                                  combinedFormData?.benefits.length > 0;

            if (hasSalaryData || hasSalaryRange) {
              setPageNumber(3);
            } else {
              setPageNumber(2);
            }
          }}
        >
          Back
        </button>
        <div className='flex gap-3 flex-row-reverse'>
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