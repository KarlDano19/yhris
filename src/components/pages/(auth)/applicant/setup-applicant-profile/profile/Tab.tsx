'use client';

import Image from 'next/image';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';

import { UserIcon } from '@heroicons/react/24/solid';
import DateCalendar from '@/svg/DateCalendar';
import DropDownArrow from '@/svg/DropDownArrow';

function ProfileTab({
  register,
  watch,
  setValue,
  handleSubmit,
  setCurrentTab,
  control,
  Controller,
}: {
  register: any;
  watch: any;
  setValue: any;
  handleSubmit: any;
  setCurrentTab: any;
  control: any;
  Controller: any;
}) {
  const onSubmit = handleSubmit(() => {
    setCurrentTab(2);
  });

  const uploadImgOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = () => {
          setValue('imagePath', reader.result);
        };
      }
    } else {
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 2000,
      });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 mt-10 md:gap-x-10 lg:gap-x-14'>
        <div className='col-1 md:col-span-2 lg:col-span-4 flex'>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 lg:gap-x-5 md:w-full lg:w-auto'>
            <div className='overflow-hidden h-[155px] md:w-auto mx-auto md:mx-0 md:cols-span-1 lg:col-span-3 flex items-center justify-center'>
              <Image
                src={watch('imagePath') || '/assets/no-user.png'}
                width={143}
                height={155}
                priority={true}
                alt='profile-logo'
                className='rounded object-cover max-w-[143px] h-[155px]'
              />
            </div>
            <div className='md:col-span-2 lg:col-span-5 mt-5 md:mt-0'>
              <div className='grid-item'>
                <h6 className='block text-sm font-medium leading-6 text-gray-900'>Photo (2x2 photo is recommended)</h6>
                <div className='mt-2'>
                  <input
                    type='file'
                    {...register('profilePicture')}
                    id='profile-picture'
                    className='rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4'
                    onChange={uploadImgOnChange}
                    accept='image/png, image/jpeg, image/jpg'
                    tabIndex={1}
                  />
                  <h6 className='text-xs text-indigo-dye mt-3'>Maximum file size: 5 MB</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-2 md:col-span-2 lg:col-span-5 grid-item mt-5 md:mt-3 lg:mt-0'>
          <label htmlFor='about-you' className='block text-sm font-medium leading-6 text-gray-900'>
            About you
          </label>
          <div className='mt-2'>
            <textarea
              rows={4}
              {...register('about')}
              id='about-you'
              className='block w-full rounded-md border-0 p-[13.5px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
              defaultValue={''}
              placeholder='Tell us about you...'
              tabIndex={2}
            />
            <h6 className='text-xs text-indigo-dye mt-3'>Maximum words: 500</h6>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:gap-x-11 gap-y-5'>
        <div className='grid-item'>
          <label htmlFor='firstname' className='block text-sm font-medium leading-6 text-gray-900'>
            First Name<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('firstname', { required: true })}
              id='firstname'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={3}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='middlename' className='block text-sm font-medium leading-6 text-gray-900'>
            Middle Name
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('middlename')}
              id='middlename'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={4}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='lastname' className='block text-sm font-medium leading-6 text-gray-900'>
            Last Name<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('lastname', { required: true })}
              id='lastname'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={5}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='bday' className='block text-sm font-medium leading-6 text-gray-900'>
            Birthday
          </label>
          <div className='relative mt-2'>
            <Controller
              control={control}
              name='birthDay'
              render={({ field }: { field: any }) => (
                <CustomDatePicker
                  id='create-separation-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none'
                  }
                  selected={field.value}
                  pickerOnChange={(date: any) => field.onChange(date)}
                  inputOnChange={(value: any) => field.onChange(value)}
                  tabIndex={6}
                />
              )}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='gender' className='block text-sm font-medium leading-6 text-gray-900'>
            Gender<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='gender'
              {...register('gender', { required: true })}
              className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              defaultValue='Male'
              tabIndex={8}
            >
              <option value={'Male'}>Male</option>
              <option value={'Female'}>Female</option>
            </select>
            <div className='absolute right-3 top-[14px]'>
              <DropDownArrow />
            </div>
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='religion' className='block text-sm font-medium leading-6 text-gray-900'>
            Religion<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('religion', { required: true })}
              id='religion'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={9}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='nationality' className='block text-sm font-medium leading-6 text-gray-900'>
            Nationality<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('nationality', { required: true })}
              id='nationality'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={10}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='civil-status' className='block text-sm font-medium leading-6 text-gray-900'>
            Civil Status<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='civil-status'
              {...register('civilStatus', { required: true })}
              className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              defaultValue='Single'
              tabIndex={11}
            >
              <option value={'Single'}>Single</option>
              <option value={'Married'}>Married</option>
              <option value={'Divorced'}>Divorced</option>
              <option value={'Widowed'}>Widowed</option>
            </select>
            <div className='absolute right-3 top-[14px]'>
              <DropDownArrow />
            </div>
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='street' className='block text-sm font-medium leading-6 text-gray-900'>
            Address<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('address', { required: true })}
              id='street'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={13}
            />
          </div>
        </div>
      </div>
      {/* <h6 className='text-indigo-dye text-sm font-semibold mt-6'>Address</h6> */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:gap-x-11 gap-y-5'>
        {/* <div className='grid-item'>
          <label
            htmlFor='house-no'
            className='block whitespace-nowrap truncate text-sm font-medium leading-6 text-gray-900'
          >
            House No./Bldg./Apartment/Suite, etc.
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('houseNo')}
              id='house-no'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={12}
            />
          </div>
        </div> */}
        {/* <div className='grid-item'>
          <label htmlFor='town' className='block text-sm font-medium leading-6 text-gray-900'>
            Town/Brgy.<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('town', { required: true })}
              id='town'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={14}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='city' className='block text-sm font-medium leading-6 text-gray-900'>
            City<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('city', { required: true })}
              id='city'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={15}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='zip' className='block text-sm font-medium leading-6 text-gray-900'>
            Zip Code<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='number'
              {...register('zipCode', { required: true })}
              id='zip'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={16}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='country' className='block text-sm font-medium leading-6 text-gray-900'>
            Country<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='country'
              {...register('country', { required: true })}
              className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              defaultValue='Philippines'
              tabIndex={17}
            >
              <option value={'Philippines'}>Philippines</option>
              <option value={'Singapore'}>Singapore</option>
            </select>
            <div className='absolute right-3 top-[14px]'>
              <DropDownArrow />
            </div>
          </div>
        </div> */}
      </div>
      <div className='flex justify-end py-10'>
        <button
          type='submit'
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          tabIndex={18}
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default ProfileTab;
