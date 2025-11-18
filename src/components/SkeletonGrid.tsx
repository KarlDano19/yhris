export default function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='rounded-lg px-8 py-14 shadow text-indigo-dye text-center bg-white'>
          <div className='h-7 w-3/4 mx-auto rounded bg-gray-200 animate-pulse mb-3' />
          <div className='h-4 w-1/2 mx-auto  rounded bg-gray-200 animate-pulse mb-12' />
          <div className='h-12 w-56 mx-auto rounded-md bg-gray-200 animate-pulse' />
        </div>
      ))}
    </div>
  );
}

