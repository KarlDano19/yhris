'use client';

import Image from 'next/image';

import toast from 'react-hot-toast';

import NoUserPicture from '@/assets/no_user.png';

function Details ({
  register,
  onSubmit,
  setValue,
  watch,
  isLoading,
}: {
  register: any;
  onSubmit: any;
  setValue: any;
  watch: any;
  isLoading: any;
}) {
  const uploadImgOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = () => {
          setValue('companyLogo', file);
          setValue('imagePath', reader.result);
        };
      }
    } else {
      toast.error('Maximum file size is 5mb.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='flex flex-row my-10'>
        <div className='basis-44 mr-10'>
          <Image
            src={watch('imagePath') || NoUserPicture}
            width={143}
            height={164}
            priority={true}
            alt='employer logo'
            className='rounded object-cover h-auto w-auto'
          />
        </div>
        <div className='basis-1/3 mr-10'>
          <div>
            <label htmlFor='companyName' className='block mb-2 text-sm font-medium text-gray-900'>
              Company Name<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='companyName'
              {...register('companyName', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='mt-5'>
            <label htmlFor='companyLogo' className='block mb-2 text-sm font-medium text-gray-900'>
              Company Logo
            </label>
            <input
              type='file'
              id='companyLogo'
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              onChange={uploadImgOnChange}
            />
          </div>
        </div>
        <div className='basis-2/3'>
          <label
            htmlFor='companyDescription'
            className='block mb-2 text-sm font-medium text-gray-900'
            placeholder='Tell us about you...'
          >
            About the Company
          </label>
          <textarea
            id='companyDescription'
            {...register('companyDescription', { required: false })}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 h-5/6'
          />
          <label className='text-sm text-gray-500 mt-5 ml-2'>Maximum words: 500</label>
        </div>
      </div>
      <div className='flex flex-row my-10'>
        <div className='basis-1/3 mr-10'>
          <label htmlFor='typeOfIndustry' className='block mb-2 text-sm font-medium text-gray-900'>
            Type of Industry<span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='typeOfIndustry'
            {...register('typeOfIndustry', { required: true })}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
          />
        </div>
        <div className='basis-1/3'>
          <label htmlFor='workSetUp' className='block mb-2 text-sm font-medium text-gray-900'>
            Work Set-up
          </label>
          <input
            type='text'
            id='workSetUp'
            {...register('workSetUp', { required: false })}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
          />
        </div>
      </div>
      <div className='my-10'>
        <label>
          <strong>Contact Details</strong>
        </label>
        <div className='flex flex-row mt-2'>
          <div className='basis-1/3 mr-10'>
            <label htmlFor='mobileNumber' className='block mb-2 text-sm font-medium text-gray-900'>
              Mobile No.<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='mobileNumber'
              {...register('mobileNumber', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='basis-1/3 mr-10'>
            <label htmlFor='landlineNumber' className='block mb-2 text-sm font-medium text-gray-900'>
              Landline No.
            </label>
            <input
              type='text'
              id='landlineNumber'
              {...register('landlineNumber', { required: false })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='basis-1/3'></div>
        </div>
      </div>
      <div className='my-10'>
        <label>
          <strong>Address</strong>
        </label>
        <div className='flex flex-row mt-2 mb-5'>
          <div className='basis-1/3 mr-10'>
            <label htmlFor='building' className='block mb-2 text-sm font-medium text-gray-900'>
              House No./Bldg./Apartment/Suite, etc.
            </label>
            <input
              type='text'
              id='building'
              {...register('building', { required: false })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='basis-1/3 mr-10'>
            <label htmlFor='street' className='block mb-2 text-sm font-medium text-gray-900'>
              Street<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='street'
              {...register('street', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='basis-1/3'>
            <label htmlFor='locality' className='block mb-2 text-sm font-medium text-gray-900'>
              Town/Brgy<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='locality'
              {...register('locality', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
        </div>
        <div className='flex flex-row'>
          <div className='basis-1/3 mr-10'>
            <label htmlFor='city' className='block mb-2 text-sm font-medium text-gray-900'>
              City<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='city'
              {...register('city', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='basis-1/3 mr-10'>
            <label htmlFor='zipCode' className='block mb-2 text-sm font-medium text-gray-900'>
              Zip Code<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='zipCode'
              {...register('zipCode', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='basis-1/3'>
            <label htmlFor='country' className='block mb-2 text-sm font-medium text-gray-900'>
              Country<span className='text-red-500'>*</span>
            </label>
            <select
              id='country'
              {...register('country', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            >
              <option value='Philippines'>Philippines</option>
            </select>
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='w-52 float-right uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
          disabled={isLoading}
        >
          {isLoading && (
            <div role='status'>
              <svg
                aria-hidden='true'
                className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          )}
          {!isLoading && 'Save'}
        </button>
      </div>
    </form>
  );
};

export default Details;
