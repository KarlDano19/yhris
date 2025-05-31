import classNames from '@/helpers/classNames';
import useEnrollEmployeeToYP from '@/components/hooks/useEnrollEmployeeToYP';

export default function EnrollToPayroll({
  id,
  isEnrolled,
  setEnrolled,
  isLoading,
}: {
  id: string;
  isEnrolled: boolean;
  setEnrolled: any;
  isLoading: boolean;
}) {
  const { mutate: enrollEmployeeToYP, isLoading: isEnrolling } = useEnrollEmployeeToYP();
  
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
            onClick={() => setEnrolled(id)}
            disabled={isEnrolled || isLoading}
          >
            {isEnrolled ? 'Enrolled' : 'Enroll'}
          </button>
        </div>
      </div>
    </>
  );
}
