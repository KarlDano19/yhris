'use client';
import { T_EmployerProfile } from '@/types/globals';
import { useForm } from 'react-hook-form';
import useSavedProfile from './hooks/useSavedProfile';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast'

const Settings = ({
  form,
  isDetails,
  setIsDetails,
  setProgressBar,
}: {
  form: any;
  isDetails: boolean;
  setIsDetails: any;
  setProgressBar: any;
}) => {
  const { mutate, isLoading } = useSavedProfile();
  const { register, handleSubmit } = useForm<T_EmployerProfile>();
  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type="success" />, { duration: 4000 });
        location.href = '/';
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type="error" />, { duration: 4000 });
      },
    };
    mutate({ ...form, ...data }, callbackReq);
  });
  return (
    <>
      <form onSubmit={onSubmit} style={{ display: !isDetails ? 'block' : 'none' }}>
        <div className='mt-10 mb-5'>
          <label
            htmlFor='language'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Language
          </label>
          <select
            id='language'
            {...register('language', { required: true })}
            value={form.language}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-94 p-2.5'
          >
            <option value='English'>English</option>
          </select>
        </div>
        <div className='mt-5 mb-10'>
          <label
            htmlFor='currency'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Currency
          </label>
          <select
            id='currency'
            {...register('currency', { required: true })}
            value={form.currency}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-94 p-2.5'
          >
            <option value='PHP'>PHP</option>
          </select>
        </div>
        <button
          type='button'
          className='w-52 float-left uppercase text-blue-600 hover:text-blue-700 border-2 border-blue-600 hover:border-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
          onClick={() => {
            setIsDetails(true);
            setProgressBar(0);
          }}
        >
          Back
        </button>
        <button
          type='submit'
          className='w-52 float-right uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Settings;
