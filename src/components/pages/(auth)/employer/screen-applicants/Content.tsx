'use client';
import React, { useState, useEffect } from 'react';
import Wrapper from '@/components/pages/(auth)/employer/screen-applicants/Wrapper';
import PostJobCard from './PostJobCard';
import Link from 'next/link';
import useGetJobPostItems from './hooks/useGetJobPostItems';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [jobPostHistoryItems, setJobPostHistoryItems] = useState<any>([]);
  const { data: dataJobPost, isLoading: isGetJobPostLoading } = useGetJobPostItems();

  useEffect(() => {
    if (dataJobPost) {
      dataJobPost.map((jobPost: any) => {
        jobPost['jobTitle'] = jobPost['job_title'];
        jobPost['jobType'] = jobPost['job_type'];
        jobPost['jobDescription'] = jobPost['job_description'];
        jobPost['applicantApplied'] = jobPost['applicant_applied_no'];
        jobPost['placeAdvertise'] = jobPost['advertise_to'];
        jobPost['schedule'] = jobPost['job_schedule'];
        jobPost['hireCount'] = jobPost['required_slot'];
        jobPost['postIn'] = jobPost['shared_to'].split(',');
      });
      setJobPostHistoryItems(dataJobPost);
    }
  }, [dataJobPost]);

  return (
    <Wrapper title='Screen Applicants' backLink='/dashboard' backText='Dashboard'>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
        {jobPostHistoryItems.map((item: any) => {
          return (
            <div key={item.id} className='rounded-lg px-8 py-14 shadow text-indigo-dye text-center bg-white'>
              <h2 className='font-semibold text-xl'>{item.jobTitle}</h2>
              <p className='text-[15px] mb-12'>{item.placeAdvertise}</p>
              <Link
                href={`screen-applicants/${item.id}`}
                className='bg-[#EAC645] text-[#2C3F58] font-semibold px-10 py-4 rounded-md hover:bg-opacity-90'
              >
                {item.applicantApplied} New Applicant/s
              </Link>
            </div>
          );
        })}
        {/* ensuring cards displayed are always six */}
        {jobPostHistoryItems.length <= 6 &&
          Array.from({ length: 6 - jobPostHistoryItems.length }).map((_, index) => {
            return <PostJobCard key={index} hasActiveSubscription={hasActiveSubscription} />;
          })}
        {jobPostHistoryItems.length > 6 &&
          Array.from({ length: 1 }).map((_, index) => {
            return <PostJobCard key={index} hasActiveSubscription={hasActiveSubscription} />;
          })}
      </div>
    </Wrapper>
  );
};

export default Content;
