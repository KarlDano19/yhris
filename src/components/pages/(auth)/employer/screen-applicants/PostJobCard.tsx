import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PostJobCard({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  return (
    <>
      {hasActiveSubscription && <Link href='/post-job' className='rounded-lg px-8 py-24 shadow text-[#CCE0FF] bg-[#EBF3FF] flex'>
        <div className='m-auto flex items-center gap-2'>
          <PlusIcon className='h-8 w-8 font-bold' />
          <p className='font-bold text-xl'>Post a Job</p>
        </div>
      </Link>}
      {!hasActiveSubscription && <div className='rounded-lg px-8 py-24 shadow text-[#CCE0FF] bg-[#EBF3FF] flex opacity-50'>
        <div className='m-auto flex items-center gap-2'>
          <PlusIcon className='h-8 w-8 font-bold' />
          <p className='font-bold text-xl'>Post a Job</p>
        </div>
      </div>}
    </>
  );
}
