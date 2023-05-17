'use client';
import { T_EmployerProfile } from '@/types/globals';
import { useForm } from 'react-hook-form';
import useSavedProfile from './hooks/useSavedProfile';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast'
import { useRouter } from 'next/navigation';

const Details = ({
  form,
  setIsDetails,
  setProgressBar,
  setForm,
}: {
  form: any;
  setIsDetails: any;
  setProgressBar: any;
  setForm: any;
}) => {
  const router = useRouter();
  const { mutate, isLoading } = useSavedProfile();
  const { register, handleSubmit } = useForm<T_EmployerProfile>();
  const onSubmit = handleSubmit((data) => {
    setForm({ ...form, ...data });
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type="success" />, { duration: 4000 });
        localStorage.hasProfile = true;
        router.push("/");
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type="error" />, { duration: 4000 });
      },
    };
    mutate(form, callbackReq);
  });
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='mt-10 mb-5'>
          <label
            htmlFor='language'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Language
          </label>
          <select
            id='language'
            {...register('language', { required: true })}
            value={form.language}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-94 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          >
            <option value='English'>English</option>
          </select>
        </div>
        <div className='mt-5 mb-10'>
          <label
            htmlFor='currency'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Currency
          </label>
          <select
            id='currency'
            {...register('currency', { required: true })}
            value={form.currency}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-94 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          >
            <option value='PHP'>PHP</option>
          </select>
        </div>
        <button
          type='submit'
          className='w-52 float-left uppercase text-blue-600 hover:text-blue-700 border-2 border-blue-600 hover:border-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          onClick={() => {
            setIsDetails(true);
            setProgressBar(0);
          }}
        >
          Back
        </button>
        <button
          type='submit'
          className='w-52 float-right uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Details;
