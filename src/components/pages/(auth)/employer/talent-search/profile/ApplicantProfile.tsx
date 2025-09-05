'use client';
import { useState } from 'react';

import Image from 'next/image';

import EmailProfileModal from '../modal/EmailProfile';

type T_ModalData = {
  id: number;
  open: boolean;
};

function ApplicantProfile({ applicant }: { applicant: any }) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<T_ModalData | null>(null);

  // Helper function to get the most recent work experience
  const getMostRecentWorkExperience = (workExperiences: any[]) => {
    if (!workExperiences || workExperiences.length === 0) {
      return null;
    }

    return workExperiences.reduce((mostRecent, current) => {
      // Check if current experience is ongoing (Present)
      const currentIsPresent =
        current.dateTo === 'Present' || current.dateTo === 'present' || current.dateTo === '' || !current.dateTo;

      const mostRecentIsPresent =
        mostRecent.dateTo === 'Present' ||
        mostRecent.dateTo === 'present' ||
        mostRecent.dateTo === '' ||
        !mostRecent.dateTo;

      // If current is present and mostRecent is not, current is more recent
      if (currentIsPresent && !mostRecentIsPresent) {
        return current;
      }

      // If mostRecent is present and current is not, mostRecent is more recent
      if (mostRecentIsPresent && !currentIsPresent) {
        return mostRecent;
      }

      // If both are present, compare start dates (more recent start date wins)
      if (currentIsPresent && mostRecentIsPresent) {
        const currentStartDate = new Date(current.dateFrom);
        const mostRecentStartDate = new Date(mostRecent.dateFrom);
        return currentStartDate > mostRecentStartDate ? current : mostRecent;
      }

      // If neither is present, compare end dates
      const currentEndDate = new Date(current.dateTo);
      const mostRecentEndDate = new Date(mostRecent.dateTo);

      return currentEndDate > mostRecentEndDate ? current : mostRecent;
    });
  };

  // Add null check for applicant
  if (!applicant) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex-1'>
          <div className='text-center text-gray-500'>Loading profile/s...</div>
        </div>
      </div>
    );
  }

  // Get the most recent work experience
  const mostRecentExperience = getMostRecentWorkExperience(applicant.work_experience);

  return (
    <>
      <div className='flex flex-col h-full gap-4 border-r border-gray-200 pr-4'>
        <div className='flex-1'>
          <div className='flex justify-between'>
            <Image
              src={applicant.photo || '/assets/no-photo.png'}
              alt={applicant.firstname || 'Applicant'}
              width={150}
              height={150}
            />
            <div className='flex flex-col'>
              <h4 className='font-semibold text-lg mb-1'>
                {applicant.firstname} {applicant.lastname}
              </h4>
              <h1 className='text-sm text-gray-500 mb-1'>{applicant.gender}</h1>
              <h1 className='text-sm mb-1'>{mostRecentExperience ? mostRecentExperience.position : 'No experience'}</h1>
              {mostRecentExperience && (
                <h1 className='text-sm mb-1'>
                  {new Date(mostRecentExperience.dateFrom).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {mostRecentExperience.dateTo === 'Present' ||
                  mostRecentExperience.dateTo === 'present' ||
                  mostRecentExperience.dateTo === '' ||
                  !mostRecentExperience.dateTo
                    ? 'Present'
                    : new Date(mostRecentExperience.dateTo).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                </h1>
              )}
            </div>
          </div>
          <div className='flex justify-between gap-4 mt-4'>
            <div className='flex flex-col gap-4 flex-1'>
              <div className='flex flex-col mb-4'>
                <div className='font-bold '>Location</div>
                <div className='break-words'>{applicant.location || 'Not specified'}</div>
              </div>
              <div className='flex flex-col mb-4'>
                <div className='font-bold '>Contact Number</div>
                <div className='break-words'>{applicant.contact_number || applicant.mobile || 'Not specified'}</div>
              </div>
            </div>
            <div className='flex flex-col gap-4 flex-1'>
              <div className='flex flex-col mb-4'>
                <div className='font-bold '>Nationality</div>
                <div className='break-words'>{applicant.nationality}</div>
              </div>
              <div className='flex flex-col mb-4'>
                <div className='font-bold'>Email</div>
                <div className='break-words text-sm'>{applicant.email}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='border-t border-gray-200 pt-4'>
          <div>
            <div className='font-bold '>Education</div>
            <div>{applicant.education}</div>
            <div className='text-gray-500'>{applicant.college}</div>
          </div>
          <div>
            {applicant.skills && (
              <div className='mb-1 mt-4'>
                <div className='font-bold '>Skills</div>
                <div>{Array.isArray(applicant.skills) ? applicant.skills.join(', ') : applicant.skills}</div>
              </div>
            )}
          </div>
          <div className='mt-4'>
            <div className='font-bold '>Expected Salary</div>
            <div>{applicant.expected_salary}</div>
          </div>
        </div>
        <div className='mt-4'>
          <button
            onClick={() => setIsEmailModalOpen({ id: applicant.id, open: true })}
            className='w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors'
          >
            Send Email
          </button>
        </div>
      </div>

      {/* Email Profile Modal */}
      {isEmailModalOpen && (
        <EmailProfileModal
          isOpen={isEmailModalOpen}
          setIsOpen={setIsEmailModalOpen}
          refetch={() => {}}
          applicantEmail={applicant.email}
          applicantId={applicant.id}
        />
      )}
    </>
  );
}

export default ApplicantProfile;
