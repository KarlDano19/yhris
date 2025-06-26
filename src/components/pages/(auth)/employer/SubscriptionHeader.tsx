'use client';

const SubscriptionHeader = () => {
  return (
    <>
      <div className='max-w bg-yellow-500'>
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-left items-center gap-4'>
          <h1 className='text-sm font-normal'>You’ve seen how easy it can be. Don’t stop now— <span className='font-bold'>stay with HRIS!</span></h1>
          <button
            className='bg-white text-blue-500 px-4 py-3 rounded-full text-sm font-semibold border border-[#A8B5C7]'
            onClick={() => {
              window.open('/manage-subscriptions#active-plans', '_blank');
            }}
          >
            Subscribe to Keep Going!
          </button>
        </div>
      </div>
    </>
  );
};

export default SubscriptionHeader;
