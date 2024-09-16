import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';

const CardProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const { data: applicantDetails, isLoading } = useGetApplicantProfile();

  useEffect(() => {
    if (applicantDetails) {
      setProfile(applicantDetails);
    }
  }, [applicantDetails]);

  return (
    <>
      {!isLoading && profile && (
        <div className='card card-user-info bg-white border border-gray-300 w-full h-auto shadow rounded-md overflow-hidden relative'>
          <div className='h-32 bg-[#FCCA34] border-b border-gray-300'></div>
          <div className='flex justify-center'>
            <div className='w-32 h-36 bg-gray-50 border border-gray-300 rounded-md overflow-hidden absolute top-11'>
              <Image src={profile.photo} fill alt='Profile image' />
            </div>
          </div>
          <h4 className='applicant-name text-center mt-[74px] text-xl text-indigo-dye font-semibold'>{profile.name}</h4>
          <div className='flex justify-center mt-3 border-b pb-5 border-gray-300'>
            <Link
              href='/edit-profile'
              className='rounded-md bg-white px-11 py-2.5 text-base font-bold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50'
            >
              Edit Profile
            </Link>
          </div>
          <div className='contact-address py-5 text-indigo-dye'>
            <div className='email flex w-[75%] mx-auto items-center space-x-3 truncate'>
              <EnvelopeIcon className='h-6' />
              <h6 className='w-10'>{profile.email}</h6>
            </div>
            <div className='email mt-2 flex w-[75%] mx-auto items-center space-x-3'>
              <PhoneIcon className='h-6' />
              <h6>{profile.mobile}</h6>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardProfile;
