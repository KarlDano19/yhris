import classNames from '@/helpers/classNames';

export default function EnrollToPayroll({
  id,
  isEnrolled,
  setEnrolled,
}: {
  id: string;
  isEnrolled: boolean;
  setEnrolled: any;
}) {
  return (
    <>
      <div className='flex gap-2 mt-2 justify-center'>
        <div>
          <button
            className={classNames(
              isEnrolled
                ? 'bg-red-500 border-[1px] border-red-500 text-white'
                : 'border-[1px] border-red-500 text-red-500',
              'relative rounded-md px-5 py-2 focus:z-10 w-[7rem] disabled:opacity-80'
            )}
            onClick={() => {
              setEnrolled();
            }}
            disabled={isEnrolled ? true : false}
          >
            {!isEnrolled ? 'Enroll' : 'Enrolled'}
          </button>
        </div>
      </div>
    </>
  );
}
