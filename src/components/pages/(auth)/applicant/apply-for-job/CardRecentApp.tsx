import { useState, useEffect } from 'react';

import Image from 'next/image';

import useGetApplicantRecentApplication from './hooks/useGetApplicantRecentApplication';
import { formatDateTimeToLocal } from '@/helpers/date';

import profileImage from '@/assets/Ellipse 8.png';

const CardRecentApp = () => {
  const [recentApplication, setRecentApplication] = useState<any>({});
  const { data, isLoading } = useGetApplicantRecentApplication();

  useEffect(() => {
    if (data) {
      setRecentApplication(data);
    }
  }, [data]);

  return (
    <div className='card card-recent-app h-auto bg-white border border-gray-300 shadow rounded-md mt-8 md:mt-9'>
      <h6 className='font-semibold text-indigo-dye my-4 mx-6'>Recent Applications</h6>
      <div className='mx-3 border-t border-gray-300 divider'></div>
      {!isLoading && Object.keys(recentApplication).length > 0 ? (
        <div className='grid grid-cols-6 mx-7 mt-6 gap-x-4'>
          <div className='col-span-2'>
            <Image
              className='h-[5rem] w-full rounded-md'
              src={recentApplication.logo}
              width={100}
              height={100}
              alt='employer-logo'
            />
          </div>
          <div className='col-span-4'>
            <h6 className='font-semibold text-indigo-dye'>{recentApplication.job_title}</h6>
            <h6 className='text-sm text-indigo-dye leading-4'>{recentApplication.employer_name}</h6>
            <button
              type='button'
              className='rounded-md bg-[#6F829B] w-full px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-[#637b9b] mt-[18px]'
            >
              Status: {recentApplication.job_stages_title}
            </button>
            <p className='text-[#ACB9CB] text-[11px] text-center mt-1 mb-5'>
              Status as of {formatDateTimeToLocal(recentApplication.updated_at, true)}
            </p>
          </div>
        </div>
      ) : (
        <p className='text-center mx-auto text-[#CCD8EA] font-semibold w-40 h-32 mt-7'>
          No application yet. Apply Now!
        </p>
      )}
    </div>
  );
};

export default CardRecentApp;
