'use client';
import Image from 'next/image';
import NoUserPicture from '@/assets/no_user.png';
import { T_EmployerProfile } from '@/types/globals';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Details = ({
  form,
  isDetails,
  setIsDetails,
  setProgressBar,
  setForm,
}: {
  form: any;
  isDetails: boolean;
  setIsDetails: any;
  setProgressBar: any;
  setForm: any;
}) => {
  const { register, handleSubmit } = useForm<T_EmployerProfile>();
  const onSubmit = handleSubmit((data) => {
    setIsDetails(false);
    setProgressBar(100);
    setForm({...data});
  });

  const uploadImgOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = (input) => {
          setForm({ ...form, companyLogo: file, imagePath: reader.result });
        };
      }
    } else {
      toast.error('Maximum file size is 5mb.');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} style={{ display: isDetails ? 'block' : 'none' }}>
        <div className='flex flex-row my-10'>
          <div className='basis-44 mr-10'>
            <Image
              src={form.imagePath || NoUserPicture}
              width={143}
              height={164}
              style={{ objectFit: 'cover', height: '100%', maxHeight: '164px' }}
              priority={true}
              alt='Picture of new user'
              className='rounded'
            />
          </div>
          <div className='basis-1/3 mr-10'>
            <div>
              <label
                htmlFor='companyName'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Company Name<span>*</span>
              </label>
              <input
                type='text'
                id='companyName'
                {...register('companyName', { required: true })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
            </div>
            <div className='mt-5'>
              <label
                htmlFor='companyLogo'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
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
            <label className='text-sm text-gray-500 mt-5 ml-2'>
              Maximum words: 500
            </label>
          </div>
        </div>
        <div className='flex flex-row my-10'>
          <div className='basis-1/3 mr-10'>
            <label
              htmlFor='typeOfIndustry'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              Type of Industry<span>*</span>
            </label>
            <input
              type='text'
              id='typeOfIndustry'
              {...register('typeOfIndustry', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='basis-1/3 mr-10'>
            <label
              htmlFor='noOfEmployees'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              No. of Employees<span>*</span>
            </label>
            <input
              type='text'
              id='noOfEmployees'
              {...register('noOfEmployees', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='basis-1/3'>
            <label
              htmlFor='workSetUp'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
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
              <label
                htmlFor='email'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Email<span>*</span>
              </label>
              <input
                type='text'
                id='email'
                {...register('email', { required: true })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
            </div>
            <div className='basis-1/3 mr-10'>
              <label
                htmlFor='mobileNumber'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Mobile No.<span>*</span>
              </label>
              <input
                type='text'
                id='mobileNumber'
                {...register('mobileNumber', { required: true })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
            </div>
            <div className='basis-1/3'>
              <label
                htmlFor='landlineNumber'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Landline No.
              </label>
              <input
                type='text'
                id='landlineNumber'
                {...register('landlineNumber', { required: false })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
            </div>
          </div>
        </div>
        <div className='my-10'>
          <label>
            <strong>Address</strong>
          </label>
          <div className='flex flex-row mt-2 mb-5'>
            <div className='basis-1/3 mr-10'>
              <label
                htmlFor='building'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
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
              <label
                htmlFor='street'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Street<span>*</span>
              </label>
              <input
                type='text'
                id='street'
                {...register('street', { required: true })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
            </div>
            <div className='basis-1/3'>
              <label
                htmlFor='locality'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Town/Brgy<span>*</span>
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
              <label
                htmlFor='city'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                City<span>*</span>
              </label>
              <input
                type='text'
                id='city'
                {...register('city', { required: true })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
            </div>
            <div className='basis-1/3 mr-10'>
              <label
                htmlFor='zipCode'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Zip Code<span>*</span>
              </label>
              <input
                type='text'
                id='zipCode'
                {...register('zipCode', { required: true })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
            </div>
            <div className='basis-1/3'>
              <label
                htmlFor='country'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Country<span>*</span>
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
        <button
          type='submit'
          className='w-52 float-right uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
        >
          Next
        </button>
      </form>
    </>
  );
};

export default Details;
