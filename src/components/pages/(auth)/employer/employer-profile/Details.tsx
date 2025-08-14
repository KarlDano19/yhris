'use client';

import Image from 'next/image';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import regions from '@/utils/regions';

import SelectChevronDown from '@/svg/SelectChevronDown';

const Details = ({
  register,
  handleSubmit,
  setValue,
  watch,
  setProgressBar,
}: {
  register: any;
  handleSubmit: any;
  setValue: any;
  watch: any;
  setProgressBar: any;
}) => {
  const onSubmit = handleSubmit(() => {
    setProgressBar(1);
  });

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
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 2000,
      });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='flex flex-row my-10'>
        <div className='basis-44 mr-10'>
          <Image
            src={watch('imagePath') || '/assets/no-user.png'}
            width={143}
            height={164}
            priority={true}
            alt='employer-logo'
            className='rounded object-cover max-w-[143px] h-[164px]'
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
              accept='image/png, image/jpeg, image/jpg'
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
          <div className='relative mb-2'>
            <select
              id='industryType'
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              value={(() => {
                const currentValue = watch('typeOfIndustry');
                if (currentValue?.startsWith('Manufacturing of:')) return 'manufacturing';
                if (currentValue?.startsWith('Service/s:')) return 'service';
                if (currentValue?.startsWith('Others:')) return 'others';
                return '';
              })()}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'manufacturing') {
                  setValue('typeOfIndustry', 'Manufacturing of: ');
                } else if (value === 'service') {
                  setValue('typeOfIndustry', 'Service/s: ');
                } else if (value === 'others') {
                  setValue('typeOfIndustry', 'Others: ');
                } else {
                  setValue('typeOfIndustry', '');
                }
              }}
            >
              <option value=''>Select Industry Type</option>
              <option value='manufacturing'>Manufacturing of: </option>
              <option value='service'>Service/s: </option>
              <option value='others'>Others: </option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
          {watch('typeOfIndustry') && (
            <div className='relative'>
              <input
                type='text'
                id='typeOfIndustry'
                {...register('typeOfIndustry', { required: true })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                placeholder='Complete the industry description'
                onKeyDown={(e) => {
                  const input = e.target as HTMLInputElement;
                  const cursorPosition = input.selectionStart || 0;
                  const value = input.value;
                  
                  // Find the position of the colon
                  const colonIndex = value.indexOf(':');
                  
                  // Prevent deletion before the colon
                  if (e.key === 'Backspace' && cursorPosition <= colonIndex + 1) {
                    e.preventDefault();
                  }
                  
                  // Prevent deletion with Delete key before the colon
                  if (e.key === 'Delete' && cursorPosition <= colonIndex) {
                    e.preventDefault();
                  }
                  
                  // Prevent cursor movement before the colon
                  if (e.key === 'ArrowLeft' && cursorPosition <= colonIndex) {
                    e.preventDefault();
                  }
                }}
                onMouseUp={(e) => {
                  const input = e.target as HTMLInputElement;
                  const cursorPosition = input.selectionStart || 0;
                  const value = input.value;
                  const colonIndex = value.indexOf(':');
                  
                  // Prevent selection before the colon
                  if (cursorPosition <= colonIndex) {
                    input.setSelectionRange(colonIndex + 1, colonIndex + 1);
                  }
                }}
                onSelect={(e) => {
                  const input = e.target as HTMLInputElement;
                  const start = input.selectionStart || 0;
                  const end = input.selectionEnd || 0;
                  const value = input.value;
                  const colonIndex = value.indexOf(':');
                  
                  // If selection includes text before the colon, adjust it
                  if (start <= colonIndex) {
                    input.setSelectionRange(colonIndex + 1, end);
                  }
                }}
              />
            </div>
          )}
        </div>
        <div className='basis-1/3 mr-10'>
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
        <div className='basis-1/3'></div>
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
              type='tel'
              id='mobileNumber'
              {...register('mobileNumber', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              pattern='[0-9]{11}'
              inputMode='numeric'
            />
          </div>
          <div className='basis-1/3 mr-10'>
            <label htmlFor='landlineNumber' className='block mb-2 text-sm font-medium text-gray-900'>
              Landline No.
            </label>
            <input
              type='tel'
              id='landlineNumber'
              {...register('landlineNumber', { required: false })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              pattern='[0-9]'
              inputMode='numeric'
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
            <label htmlFor='region' className='block mb-2 text-sm font-medium text-gray-900'>
              Region<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='region'
                {...register('region', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option value=''>Select Region</option>
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div className='basis-1/3'>
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
        </div>
        <div className='flex flex-row mt-5'>
          <div className='basis-1/3'>
            <label htmlFor='country' className='block mb-2 text-sm font-medium text-gray-900'>
              Country<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='country'
                {...register('country', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option value='Philippines'>Philippines</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div className='basis-1/3 mr-10'></div>
          <div className='basis-1/3 mr-10'></div>
        </div>
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='w-52 uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Details;
