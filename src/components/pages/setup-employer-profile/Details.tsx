'use client';
import Image from 'next/image';
import NoUserPicture from '@/assets/no_user.png';
import { T_EmployerDetails } from '@/types/globals';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
  const { register, handleSubmit } = useForm<T_EmployerDetails>();
  const onSubmit = handleSubmit((data) => {
    setIsDetails(false);
    setProgressBar(100);
    setForm({...form, ...data});
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
      <form onSubmit={onSubmit}>
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
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Company Name<span>*</span>
              </label>
              <input
                type='text'
                id='companyName'
                {...register('companyName', { required: true })}
                value={form.companyName}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div className='mt-5'>
              <label
                htmlFor='companyLogo'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Company Logo
              </label>
              <input
                type='file'
                id='companyLogo'
                {...register('companyLogo', { required: false })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                onChange={uploadImgOnChange}
              />
            </div>
          </div>
          <div className='basis-2/3'>
            <label
              htmlFor='companyDescription'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              placeholder='Tell us about you...'
            >
              About the Company
            </label>
            <textarea
              id='companyDescription'
              {...register('companyDescription', { required: false })}
              value={form.companyDescription}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-5/6'
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
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Type of Industry<span>*</span>
            </label>
            <input
              type='text'
              id='typeOfIndustry'
              {...register('typeOfIndustry', { required: true })}
              value={form.typeOfIndustry}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          <div className='basis-1/3 mr-10'>
            <label
              htmlFor='noOfEmployees'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              No. of Employees<span>*</span>
            </label>
            <input
              type='text'
              id='noOfEmployees'
              {...register('noOfEmployees', { required: true })}
              value={form.noOfEmployees}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
          <div className='basis-1/3'>
            <label
              htmlFor='workSetUp'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Work Set-up
            </label>
            <input
              type='text'
              id='workSetUp'
              {...register('workSetUp', { required: false })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Email<span>*</span>
              </label>
              <input
                type='text'
                id='email'
                {...register('email', { required: true })}
                value={form.email}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div className='basis-1/3 mr-10'>
              <label
                htmlFor='mobileNumber'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Mobile No.<span>*</span>
              </label>
              <input
                type='text'
                id='mobileNumber'
                {...register('mobileNumber', { required: true })}
                value={form.mobileNumber}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div className='basis-1/3'>
              <label
                htmlFor='landlineNumber'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Landline No.
              </label>
              <input
                type='text'
                id='landlineNumber'
                {...register('landlineNumber', { required: false })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                House No./Bldg./Apartment/Suite, etc.
              </label>
              <input
                type='text'
                id='building'
                {...register('building', { required: false })}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div className='basis-1/3 mr-10'>
              <label
                htmlFor='street'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Street<span>*</span>
              </label>
              <input
                type='text'
                id='street'
                {...register('street', { required: true })}
                value={form.street}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div className='basis-1/3'>
              <label
                htmlFor='locality'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Town/Brgy<span>*</span>
              </label>
              <input
                type='text'
                id='locality'
                {...register('locality', { required: true })}
                value={form.locality}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
          </div>
          <div className='flex flex-row'>
            <div className='basis-1/3 mr-10'>
              <label
                htmlFor='city'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                City<span>*</span>
              </label>
              <input
                type='text'
                id='city'
                {...register('city', { required: true })}
                value={form.city}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div className='basis-1/3 mr-10'>
              <label
                htmlFor='zipCode'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Zip Code<span>*</span>
              </label>
              <input
                type='text'
                id='zipCode'
                {...register('zipCode', { required: true })}
                value={form.zipCode}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              />
            </div>
            <div className='basis-1/3'>
              <label
                htmlFor='country'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Country<span>*</span>
              </label>
              <select
                id='country'
                {...register('country', { required: true })}
                value={form.country}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              >
                <option value='Philippines'>Philippines</option>
              </select>
            </div>
          </div>
        </div>
        <button
          type='submit'
          className='w-52 float-right uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Next
        </button>
      </form>
    </>
  );
};

export default Details;
