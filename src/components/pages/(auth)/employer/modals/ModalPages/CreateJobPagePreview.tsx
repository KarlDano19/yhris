import { Dispatch } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircleIcon, BriefcaseIcon, ClockIcon, BanknotesIcon, ClipboardDocumentIcon, HomeIcon } from '@heroicons/react/24/outline';
import BenefitsIcon from '@/svg/BenefitsIcon';
import FileCaseIcon from '@/svg/FileCaseIcon';
import JobDetailsLocation from '@/svg/JobDetailLocation';
import formatPrice from '@/helpers/currencyFormat';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    is_show_roles?: boolean;
    is_show_salary?: boolean;
    is_show_benefits?: boolean;
    is_show_remarks?: boolean;
  }
}

export default function CreateJobPagePreview({
  firstFormGetValues,
  secondFormGetValues,
  thirdFormGetValues,
  fourthFormGetValues,
  setPageNumber,
  onSubmit,
  fileProps,
  isEdit,
  onSave,
  isLoading,
}: {
  firstFormGetValues: any;
  secondFormGetValues: any;
  thirdFormGetValues: any;
  fourthFormGetValues: any;
  setPageNumber: Dispatch<number>;
  onSubmit: () => void;
  fileProps: any;
  isEdit?: boolean;
  onSave?: () => void;
  isLoading?: boolean;
}) {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);

  const cachedData: any = cachedProfile?.state?.data;

  // Combine address fields from cached profile (matching backend serializer format)
  const getEmployerAddress = () => {
    if (!cachedData) return "";
    const addressParts = [
      cachedData.building,
      cachedData.street,
      cachedData.locality,
      cachedData.city,
      cachedData.country,
      cachedData.zip_code
    ].filter(Boolean); // Remove empty/undefined values
    
    const combinedAddress = addressParts.join(', ') || '';
    return combinedAddress || cachedData.locality || "";
  };

  const renderRoleDescription = (jobDescription: any) => {
    const markup = { __html: jobDescription };
    return <span className='ql-editor !p-0' dangerouslySetInnerHTML={markup}></span>;
  };

  const renderQualificationsDescription = (qualifications: any) => {
    const markup = { __html: qualifications };
    return <span className='ql-editor !p-0' dangerouslySetInnerHTML={markup}></span>;
  };
  
  const renderNotesRemarks = (notesRemarks: any) => {
    const markup = { __html: notesRemarks };
    return <span className='ql-editor !p-0' dangerouslySetInnerHTML={markup}></span>;
  };

  return (
    <>
      <div className='px-4 pb-6'>
        {/* Job Header */}
        <div className='grid grid-cols-4 px-4 mt-5'>
          <div className='col-span-3 lg:col-span-2 flex'>
            <span className='mt-1 ml-1'>
              <FileCaseIcon className='h-6 w-6' />
            </span>
            <div className='ml-6'>
              <h5 className='text-xl font-semibold text-indigo-dye'>
                {firstFormGetValues('jobTitle')}
              </h5>
              <h6 className='text-indigo-dye text-sm'> 
                for a {cachedData?.type_of_industry || 'Technology'} Company
              </h6>
              <h6 className='text-indigo-dye text-sm mt-1'> 
                {getEmployerAddress()}
              </h6>
            </div>
          </div>
          <div className='col-span-1 lg:col-span-2 px-1'>
            <div
              className='lg:w-40 lg:mx-auto bg-gray-300 h-[150px] rounded-md hidden lg:block'
              style={{
                backgroundImage: `url(${cachedData?.logo || '/assets/no-photo.png'})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          </div>
        </div>
        
        {/* Job Details */}
        <div className='border-t border-gray-300 my-5 p-4'>
          <h5 className='text-xl font-semibold text-indigo-dye'>Job Details</h5>
          <div className='details mx-5 mt-2'>
            {/* Role section - only show if is_show_roles is true */}
            {window.is_show_roles !== false && fourthFormGetValues('jobDescription') && (
              <>
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                  <ClipboardDocumentIcon className='h-5 w-5 mr-1' />
                  Role
                </h6>
                <div className='text-[13px] text-indigo-dye mt-1 ml-6'>
                  {renderRoleDescription(fourthFormGetValues('jobDescription'))}
                </div>
              </>
            )}
            
            {/* Location */}
            <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
              <JobDetailsLocation className='h-3.5 w-3.5 mb-2 mr-1.5 ml-1' />
              Location
            </h6>
            <p className='text-[13px] text-indigo-dye mt-1 list-disc ml-6 mb-2'>
              {Array.isArray(firstFormGetValues('placeAdvertise')) 
                ? firstFormGetValues('placeAdvertise').join(', ') 
                : firstFormGetValues('placeAdvertise')}
            </p>
            
            {/* Qualifications */}
            <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
              <CheckCircleIcon className='h-5 w-5 mr-1' />
              Qualifications
            </h6>
            <div className='text-[13px] text-indigo-dye mt-1 ml-6'>
              {fourthFormGetValues('qualifications') ? renderQualificationsDescription(fourthFormGetValues('qualifications')) : 'No qualifications specified'}
            </div>
            
            {/* Job Type */}
            <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
              <BriefcaseIcon className='h-5 w-5 mr-1' />
              Job Type
            </h6>
            <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
              {secondFormGetValues('jobType') ? secondFormGetValues('jobType').join(', ') : 'No job type specified'}
            </p>
            
            {/* Work Setup */}
            {secondFormGetValues('workSetup') && secondFormGetValues('workSetup').length > 0 && (
              <>
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                  <HomeIcon className='h-5 w-5 mr-1' />
                  Work Setup
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                  {secondFormGetValues('workSetup').join(', ')}
                </p>
              </>
            )}
            
            {/* Schedule */}
            <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
              <ClockIcon className='h-5 w-5 mr-1' />
              Schedule
            </h6>
            <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
              {secondFormGetValues('schedule') ? secondFormGetValues('schedule').join(', ') : 'No schedule specified'}
            </p>
            
            {/* Salary Range - only show if is_show_salary is true */}
            {window.is_show_salary !== false && (
              <>
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                  <BanknotesIcon className='h-5 w-5 mr-1' />
                  Salary Range
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                  {thirdFormGetValues('salary')?.salaryType === 'Range' ? (
                    <>
                      PHP {formatPrice(thirdFormGetValues('salary')?.salaryRangeMin || 0)} - {formatPrice(thirdFormGetValues('salary')?.salaryRangeMax || 0)}
                    </>
                  ) : (
                    <>PHP {formatPrice(thirdFormGetValues('salary')?.salaryValue || 0)}</>
                  )}
                  &nbsp;/ {thirdFormGetValues('rate') || 'No rate specified'}
                </p>
              </>
            )}
            
            {/* Benefits - only show if is_show_benefits is true */}
            {window.is_show_benefits !== false && thirdFormGetValues('benefits') && thirdFormGetValues('benefits').length > 0 && (
              <>
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-2'>
                  <BenefitsIcon className='h-4 w-4 mt-1 ml-0.5 mr-1.5' />
                  Benefits
                </h6>
                <ul className='text-[13px] text-indigo-dye mt-1 ml-6'>
                  {thirdFormGetValues('benefits').join(', ')}
                </ul>
              </>
            )}
            
            {/* Notes/Remarks - only show if is_show_remarks is true */}
            {window.is_show_remarks !== false && firstFormGetValues('notesRemarks') && (
              <>
                <h6 className='text-[15px] flex items-center text-savoy-blue font-medium mt-4'>
                  <ClipboardDocumentIcon className='h-5 w-5 mr-1' />
                  Notes/Remarks
                </h6>
                <p className='text-[13px] text-indigo-dye mt-1 ml-6'>
                  {renderNotesRemarks(firstFormGetValues('notesRemarks'))}
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Uploaded Job Description File */}
        {fileProps.fileName && (
          <div className='px-4 pb-6'>
            <div className='border-t border-gray-300 my-5 p-4'>
              <h5 className='text-xl font-semibold text-indigo-dye mb-4'>Uploaded Job Description</h5>
              <object data={URL.createObjectURL(fileProps.file)} width='100%' height='500px' />
            </div>
          </div>
        )}
      </div>
      <hr />
      <div className='mt-5 flex flex-col gap-3 px-4 sm:mt-4 sm:flex-row sm:justify-between'>
        <button
          id='pagePreviewBackBtn'
          type='button'
          className='inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
          onClick={() => setPageNumber(6)}
        >
          Back
        </button>
        <div className='flex gap-3 flex-row-reverse'>
          <button
            id='pagePreviewNextBtn'
            type='button'
            className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
            onClick={onSubmit}
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
