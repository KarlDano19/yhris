'use client';

import { useRouter } from 'next/navigation';

const SubscriptionHeader = () => {
  const router = useRouter();
  return (
    <>
      <div className='max-w bg-yellow-500'>
        <div className='mx-auto max-w-7xl px-2 py-2 sm:px-4 lg:px-6 flex justify-center items-center gap-4'>
          <h1 className='text-sm font-normal'>You’ve seen how easy it can be. Don’t stop now— <span className='font-bold'>stay with HRIS!</span></h1>
          <button
            className='bg-white text-blue-500 px-4 py-2 rounded-full text-sm font-semibold border border-[#A8B5C7]'
            onClick={() => {
              router.push('/landing-page/pricing');
            }}
          >
            Subscribe Now!
          </button>
        </div>
      </div>
    </>
  );
};

export default SubscriptionHeader;
