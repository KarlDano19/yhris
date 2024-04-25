import { UseFormRegister } from 'react-hook-form';

import { UserIcon } from '@heroicons/react/24/solid';
import DropDownArrow from '@/svg/DropDownArrow';

interface ProfileTabProps {
  register: UseFormRegister<any>;
  renderUploadPhoto: any;
  profilePhoto: any;
}

const ProfileTab = ({ register, renderUploadPhoto, profilePhoto }: ProfileTabProps) => {
  return (
    <>
      <h5 className='text-xl text-indigo-dye font-semibold'>Profile</h5>
      <div className='grid lg:grid-cols-7 gap-x-8 mt-7'>
        <div className='lg:col-span-1'>
          <div className='image-container bg-gray-300 h-40 w-1/2 md:w-44 lg:w-full rounded-md mx-auto lg:mx-0 flex items-center justify-center' style={{
            backgroundImage: `url(${profilePhoto})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {!profilePhoto && <UserIcon className='w-auto md:p-4 lg:p-0 h-auto text-white' />}
          </div>
        </div>
        <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5'>
          <div className='grid-item'>
            <label htmlFor='first-name' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
              First Name <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('firstName', { required: true })}
                id='first-name'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='middle-name' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
              Middle Name <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('middleName', { required: true })}
                id='middle-name'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='last-name' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
              Last Name <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('lastName', { required: true })}
                id='last-name'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='email' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
              Email Address <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='email'
                {...register('email', { required: true })}
                id='email'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='mobile-no' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
              Mobile No. <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='tel'
                {...register('mobileNo', { required: true })}
                id='mobile-no'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='address' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
              Address <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('address', { required: true })}
                id='address'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 mt-11'>
        <div className='grid-item'>
          <label htmlFor='nationality' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
            Nationality <span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('nationality', { required: true })}
              id='nationality'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='gender' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
            Gender <span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='gender'
              {...register('gender', { required: true })}
              className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              defaultValue='Male'
            >
              <option>Male</option>
              <option>Female</option>
            </select>
            <div className='absolute right-3 top-[14px]'>
              <DropDownArrow />
            </div>
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='religion' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
            Religion <span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('religion', { required: true })}
              id='religion'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
            />
          </div>
        </div>
        <div className='grid-item'>
          <h6 className='block text-indigo-dye text-sm font-medium leading-6 text-gray-900'>
            Photo (2x2 photo is recommended) <span className='text-red-500'>*</span>
          </h6>
          <div className='mt-2'>
            <input
              type='file'
              {...register('profilePicture', { required: true })}
              id='profile-picture'
              className='rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4'
              onChange={(event) => {
                renderUploadPhoto(event);
              }}
              accept='image/png, image/jpeg, image/jpg'
            />
            <h6 className='text-xs text-indigo-dye mt-3'>Maximum file size: 5 MB</h6>
          </div>
        </div>
        <div className='grid-item'>
          <h6 className='block text-indigo-dye text-sm font-medium leading-6 text-gray-900'>
            Curriculum Vitae/Resume (Optional)
          </h6>
          <div className='mt-2'>
            <input
              type='file'
              {...register('resume')}
              id='resume'
              className='rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4'
              accept='application/pdf'
            />
            <h6 className='text-xs text-indigo-dye mt-3'>Maximum file size: 5 MB</h6>
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='portfolio' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
            Portfolio (Optional)
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('portfolio')}
              id='portfolio'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
            />
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='w-full md:w-auto mt-10 md:mt-12 mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          NEXT
        </button>
      </div>
    </>
  );
};

export default ProfileTab;
