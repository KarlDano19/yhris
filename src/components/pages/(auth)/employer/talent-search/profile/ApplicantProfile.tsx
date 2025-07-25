'use client';

import Image from 'next/image';
import { useState } from 'react';
import EmailProfileModal from '../modal/EmailProfile';

type T_ModalData = {
  id: number;
  open: boolean;
};

function ApplicantProfile({ applicant }: { applicant: any }) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<T_ModalData | null>(null);
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
              <h1 className='text-sm mb-1'>
                {applicant.work_experience && applicant.work_experience.length > 0
                  ? applicant.work_experience[0].position
                  : 'No experience'}
              </h1>
              {applicant.work_experience && applicant.work_experience.length > 0 && (
                <h1 className='text-sm mb-1'>
                  {new Date(applicant.work_experience[0].dateFrom).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(applicant.work_experience[0].dateTo).toLocaleDateString('en-US', {
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
        />
      )}
    </>
  );
}

export default ApplicantProfile;
