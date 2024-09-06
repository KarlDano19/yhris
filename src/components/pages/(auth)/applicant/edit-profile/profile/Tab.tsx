'use client';
import Image from 'next/image';
import DateCalendar from '@/svg/DateCalendar';
import DropDownArrow from '@/svg/DropDownArrow';
import { useRef, useState } from 'react';
import Link from 'next/link';
import useGetProfile from '../hooks/useGetProfile';
import usePatchProfile from '../hooks/usePatchProfile';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

interface T_UserProfile {
  id: number;
  userId: number;
  name: string;
  about: string;
  profilePicture: string;
  birthDay: string;
  age: number;
  gender: string;
  religion: string;
  nationality: string;
  civilStatus: string;
  houseNo: string;
  street: string;
  townBrgy: string;
  city: string;
  zipCode: string;
  country: string;
}

const Tab = () => {
  const router = useRouter();
  const { data, isLoading } = useGetProfile(93);
  const dateInputRef = useRef(null);
  const { register, handleSubmit, reset } = useForm<T_UserProfile>();

  const { mutate: mutateProfile, isLoading: mutateIsLoading } =
    usePatchProfile(93);
  const onSubmit = (data: T_UserProfile) => {
    const callBackReq = {
      onSuccess: (data: any) => {
        if (!data.error) {
          toast.success('Profile Successfully Updated');
          router.push('/apply-for-a-job');
        }
      },
      onError: (err: any) => {
        //toast.error(String(err)) //uncooment this if backend is ready
        toast.success('Profile Successfully Updated'); //remove this when backend is ready
        router.push('/apply-for-a-job'); //remove this when backend is ready
      },
    };

    mutateProfile(data, callBackReq);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 mt-10 md:gap-x-10 lg:gap-x-14'>
          <div className='col-1 md:col-span-2 lg:col-span-4 flex'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 lg:gap-x-5 md:w-full lg:w-auto'>
              <div className='overflow-hidden h-[155px] w-36 md:w-auto md:max-w-[150px] mx-auto md:mx-0 md:cols-span-1 lg:col-span-3 bg-gray-300 rounded-md'>
                <Image
                  className='hidden'
                  src=''
                  width={0}
                  height={0}
                  alt='Profile image'
                />
              </div>
              <div className='md:col-span-2 lg:col-span-5 mt-5 md:mt-0'>
                <div className='grid-item'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Name<span className='text-red-500'>*</span>
                  </label>
                  <div className='mt-2'>
                    <input
                      type='text'
                      {...register('name')}
                      id='name'
                      disabled={isLoading}
                      defaultValue={isLoading ? 'Loading...' : data?.name}
                      autoComplete='given-name'
                      className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
                <div className='grid-item mt-5'>
                  <h6 className='block text-sm font-medium leading-6 text-gray-900'>
                    Profile Picture<span className='text-red-500'>*</span>
                  </h6>
                  <div className='mt-2'>
                    <input
                      type='file'
                      {...register('profilePicture')}
                      id='profile-picture'
                      className='rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4'
                    />
                    <h6 className='text-xs mt-3'>
                      Maximum file size: 5 MB
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-2 md:col-span-2 lg:col-span-5 grid-item mt-5 md:mt-3 lg:mt-0'>
            <label
              htmlFor='about-you'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              About you
            </label>
            <div className='mt-2'>
              <textarea
                rows={4}
                {...register('about')}
                id='about-you'
                disabled={isLoading}
                className='block w-full rounded-md border-0 p-[13.5px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                placeholder='Tell us about you...'
                value={!isLoading ? data?.about : 'Loading...'}
              />
              <h6 className='text-xs mt-3'>
                Maximum words: 500
              </h6>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:gap-x-11 gap-y-5'>
          <div className='grid-item'>
            <label
              htmlFor='bday'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Birthday<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <input
                type='date'
                {...register('birthDay')}
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.birthDay}
                id='bday'
                className='appearance-none block w-full rounded-md py-[5.1px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                ref={dateInputRef}
                // @ts-expect-error
                onClick={() => dateInputRef.current.showPicker()}
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                <DateCalendar />
              </div>
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='age'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Age<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='number'
                {...register('age')}
                id='age'
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.age}
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='gender'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Gender<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='gender'
                {...register('gender')}
                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                defaultValue='Male'
              >
                <option
                  value=''
                  selected={!isLoading && data?.gender === 'Male'}
                >
                  Male
                </option>
                <option
                  value=''
                  selected={!isLoading && data?.gender === 'Female'}
                >
                  Female
                </option>
              </select>
              <div className='absolute right-3 top-[14px]'>
                <DropDownArrow />
              </div>
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='religion'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Religion<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('religion')}
                id='religion'
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.religion}
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='nationality'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Nationality<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('nationality')}
                id='nationality'
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.nationality}
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='civil-status'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Civil Status<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='civil-status'
                {...register('civilStatus')}
                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                defaultValue='Single'
              >
                <option
                  value='Single'
                  selected={!isLoading && data?.civilStatus === 'Single'}
                >
                  Single
                </option>
                <option
                  value='Married'
                  selected={!isLoading && data?.civilStatus === 'Married'}
                >
                  Married
                </option>
                <option
                  value='Divorced'
                  selected={!isLoading && data?.civilStatus === 'Divorced'}
                >
                  Divorced
                </option>
                <option
                  value='Widowed'
                  selected={!isLoading && data?.civilStatus === 'Widowed'}
                >
                  Widowed
                </option>
              </select>
              <div className='absolute right-3 top-[14px]'>
                <DropDownArrow />
              </div>
            </div>
          </div>
        </div>
        <h6 className='text-sm font-semibold mt-6'>Address</h6>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:gap-x-11 gap-y-5'>
          <div className='grid-item'>
            <label
              htmlFor='house-no'
              className='block whitespace-nowrap truncate text-sm font-medium leading-6 text-gray-900'
            >
              House No./Bldg./Apartment/Suite, etc.{' '}
             <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('houseNo')}
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.houseNo}
                id='house-no'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='street'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Street<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('street')}
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.street}
                id='street'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='town'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Town/Brgy.<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('townBrgy')}
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.townBrgy}
                id='town'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='city'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              City<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('city')}
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.city}
                id='city'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='zip'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Zip Code<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='number'
                {...register('zipCode')}
                disabled={isLoading}
                defaultValue={isLoading ? 'Loading...' : data?.zipCode}
                id='zip'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label
              htmlFor='country'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Country<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='country'
                {...register('country')}
                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                defaultValue='Philippines'
              >
                <option
                  value='Philippines'
                  selected={!isLoading && data?.country === 'Philippines'}
                >
                  Philippines
                </option>
                <option
                  value='Singapore'
                  selected={!isLoading && data?.country === 'Singapore'}
                >
                  Singapore
                </option>
              </select>
              <div className='absolute right-3 top-[14px]'>
                <DropDownArrow />
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            type='submit'
            className='mt-10 md:mt-12 w-full md:w-auto text-center float-right mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            {mutateIsLoading ? (
              <div
                className='animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2'
                role='status'
                aria-label='loading'
              >
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              'SAVE'
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Tab;
