import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, CheckIcon } from '@heroicons/react/24/solid';
import DateCalendar from '@/svg/DateCalendar';
import DropDownArrow from '@/svg/DropDownArrow';

export default function EmployeesModal({
  employeeDetailData,
  isOpen,
  setIsOpen,
}: {
  employeeDetailData: any;
  isOpen: boolean | null;
  setIsOpen: Dispatch<boolean | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [cvFileDetail, setCVFileDetail] = useState<any>({
    filename: '',
    file: '',
  });
  const [viewCV, setViewCV] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [currentForm, setCurrentForm] = useState('profile');
  const [profilePhoto, setProfilePhoto] = useState<any>();
  const [isWFH, setCheckWFH] = useState(false);
  const [isWOS, setCheckWOS] = useState(false);
  const { register, setValue, handleSubmit, control, reset } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'exp',
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentForm('profile');
    }
  }, [isOpen]);

  useEffect(() => {
    if (employeeDetailData) {
      const splitCVFile = (employeeDetailData.cv || '').split('/');
      setCVFileDetail({
        filename: splitCVFile[splitCVFile.length - 1],
        file: `${process.env.NEXT_PUBLIC_BACKGROUND_IMG_URL}${employeeDetailData.cv}`,
      });
      if (employeeDetailData.work_experience.length !== 0) {
        for (let exp of employeeDetailData.work_experience) {
          append(exp);
        }
      }
      if ((employeeDetailData?.setup_preference || []).includes('Work From Home')) {
        setCheckWFH(true);
      }
      if ((employeeDetailData?.setup_preference || []).includes('Work on Site')) {
        setCheckWOS(true);
      }
      setValue('firstName', employeeDetailData.firstname);
      setValue('middleName', employeeDetailData.middlename);
      setValue('lastName', employeeDetailData.lastname);
      setValue('email', employeeDetailData.email);
      setValue('mobileNo', employeeDetailData.mobile);
      setValue('address', employeeDetailData.address);
      setValue('nationality', employeeDetailData.nationality);
      setValue('religion', employeeDetailData.religion);
      setValue('portfolio', employeeDetailData.portfolio_url);
    }
  }, [employeeDetailData]);

  const profileSubmit = () => {
    setCurrentForm('experience');
  };

  const renderUploadPhoto = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (input) => {
        setProfilePhoto(input.target?.result);
      };
    }
  };

  const renderExpInputs = () => {
    return fields.map((item, index) => {
      return (
        <div key={index} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-x-5 gap-y-4 mt-7'>
          <div className='grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:col-span-2 lg:col-span-4 gap-x-5 gap-y-4'>
            <div className='grid-item'>
              <label htmlFor='position' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
                Position
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`exp.${index}.position`)}
                  id='position'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                  disabled={isDisable}
                />
              </div>
            </div>
            <div className='grid-item'>
              <label htmlFor='major-roles' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
                Major Roles
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`exp.${index}.majorRole`)}
                  id='major-roles'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                  disabled={isDisable}
                />
              </div>
            </div>
            <div className='grid-item'>
              <label
                htmlFor='company-organization'
                className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
              >
                Company Organization
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`exp.${index}.companyOrg`)}
                  id='company-organization'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                  disabled={isDisable}
                />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 col-span-2 gap-x-5 gap-y-4 mb-4 lg:mb-0'>
            <div className='grid-item'>
              <label htmlFor='date-from' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
                Date From
              </label>
              <div className='relative mt-2'>
                <input
                  type='date'
                  id={`date-from${index}`}
                  {...register(`exp.${index}.dateFrom`)}
                  className='appearance-none block w-full rounded-md py-[3.2px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-7'
                  disabled={isDisable}
                />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                  <DateCalendar key={item.id} />
                </div>
              </div>
            </div>
            <div className='grid-item'>
              <label htmlFor='date-to' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
                Date To
              </label>
              <div className='relative mt-2'>
                <input
                  type='date'
                  id={`date-to${index}`}
                  {...register(`exp.${index}.dateTo`)}
                  className='appearance-none block w-full rounded-md py-[3.2px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-7'
                  disabled={isDisable}
                />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                  <DateCalendar key={item.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(null)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      Employee - {employeeDetailData.firstname} {employeeDetailData.lastname}
                    </h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(null)} />
                  </div>
                  <div className='md:mx-6 mt-4'>
                    <form
                      onSubmit={handleSubmit(profileSubmit)}
                      className={`first-form ${currentForm === 'profile' ? '' : 'hidden'}`}
                    >
                      <>
                        {!viewCV && (
                          <div>
                            <h5 className='text-xl text-indigo-dye font-semibold'>Profile</h5>
                            <div className='grid lg:grid-cols-7 gap-x-8 mt-7'>
                              <div className='lg:col-span-1'>
                                <div
                                  className='image-container bg-gray-300 h-40 w-1/2 md:w-44 lg:w-full rounded-md mx-auto lg:mx-0 flex items-center justify-center'
                                  style={{
                                    backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKGROUND_IMG_URL}${employeeDetailData.photo})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                  }}
                                ></div>
                              </div>
                              <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5'>
                                <div className='grid-item'>
                                  <label
                                    htmlFor='first-name'
                                    className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                  >
                                    First Name <span className='text-red-500'>*</span>
                                  </label>
                                  <div className='mt-2'>
                                    <input
                                      type='text'
                                      {...register('firstName', { required: !isDisable })}
                                      id='first-name'
                                      className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                      disabled={isDisable}
                                    />
                                  </div>
                                </div>
                                <div className='grid-item'>
                                  <label
                                    htmlFor='middle-name'
                                    className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                  >
                                    Middle Name <span className='text-red-500'>*</span>
                                  </label>
                                  <div className='mt-2'>
                                    <input
                                      type='text'
                                      {...register('middleName', { required: !isDisable })}
                                      id='middle-name'
                                      className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                      disabled={isDisable}
                                    />
                                  </div>
                                </div>
                                <div className='grid-item'>
                                  <label
                                    htmlFor='last-name'
                                    className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                  >
                                    Last Name <span className='text-red-500'>*</span>
                                  </label>
                                  <div className='mt-2'>
                                    <input
                                      type='text'
                                      {...register('lastName', { required: !isDisable })}
                                      id='last-name'
                                      className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                      disabled={isDisable}
                                    />
                                  </div>
                                </div>
                                <div className='grid-item'>
                                  <label
                                    htmlFor='email'
                                    className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                  >
                                    Email Address <span className='text-red-500'>*</span>
                                  </label>
                                  <div className='mt-2'>
                                    <input
                                      type='email'
                                      {...register('email', { required: !isDisable })}
                                      id='email'
                                      className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                      disabled={isDisable}
                                    />
                                  </div>
                                </div>
                                <div className='grid-item'>
                                  <label
                                    htmlFor='mobile-no'
                                    className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                  >
                                    Mobile No. <span className='text-red-500'>*</span>
                                  </label>
                                  <div className='mt-2'>
                                    <input
                                      type='tel'
                                      {...register('mobileNo', { required: !isDisable })}
                                      id='mobile-no'
                                      className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                      disabled={isDisable}
                                    />
                                  </div>
                                </div>
                                <div className='grid-item'>
                                  <label
                                    htmlFor='address'
                                    className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                  >
                                    Address <span className='text-red-500'>*</span>
                                  </label>
                                  <div className='mt-2'>
                                    <input
                                      type='text'
                                      {...register('address', { required: !isDisable })}
                                      id='address'
                                      className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                      disabled={isDisable}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 mt-11'>
                              <div className='grid-item'>
                                <label
                                  htmlFor='nationality'
                                  className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                >
                                  Nationality <span className='text-red-500'>*</span>
                                </label>
                                <div className='mt-2'>
                                  <input
                                    type='text'
                                    {...register('nationality', { required: !isDisable })}
                                    id='nationality'
                                    className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                    disabled={isDisable}
                                  />
                                </div>
                              </div>
                              <div className='grid-item'>
                                <label
                                  htmlFor='gender'
                                  className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                >
                                  Gender <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative mt-2'>
                                  <select
                                    id='gender'
                                    {...register('gender', { required: !isDisable })}
                                    className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                                    defaultValue='Male'
                                    disabled={isDisable}
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
                                <label
                                  htmlFor='religion'
                                  className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                >
                                  Religion <span className='text-red-500'>*</span>
                                </label>
                                <div className='mt-2'>
                                  <input
                                    type='text'
                                    {...register('religion', { required: !isDisable })}
                                    id='religion'
                                    className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                    disabled={isDisable}
                                  />
                                </div>
                              </div>
                              {/* <div className='grid-item'>
                                <h6 className='block text-indigo-dye text-sm font-medium leading-6 text-gray-900'>Curriculum Vitae/Resume</h6>
                                <div className='mt-2'>
                                  <div
                                    className={classNames(
                                      'rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6',
                                      isDisable && 'bg-stone-50 cursor-pointer'
                                    )}
                                  >
                                    {cvFileDetail.filename}
                                  </div>
                                </div>
                              </div> */}
                              <div className='grid-item'>
                                <label
                                  htmlFor='portfolio'
                                  className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
                                >
                                  Portfolio (Optional)
                                </label>
                                <div className='mt-2'>
                                  <input
                                    type='text'
                                    {...register('portfolio')}
                                    id='portfolio'
                                    className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                    disabled={isDisable}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='flex justify-between'>
                              <button
                                type='button'
                                className='w-full md:w-auto mt-10 md:mt-12 mb-7 px-4 py-2 rounded-md text-[#355FD0] border-[1px] border-[#355FD0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                onClick={() => setViewCV(true)}
                                tabIndex={-1}
                              >
                                View Attached CV/Resume
                              </button>
                              <button
                                type='submit'
                                className='w-full md:w-auto mt-10 md:mt-12 mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                              >
                                NEXT
                              </button>
                            </div>
                          </div>
                        )}
                        {viewCV && (
                          <div>
                            <iframe className='w-full h-[43rem]' src={`${cvFileDetail.file}#toolbar=0`}></iframe>
                            <div className='flex justify-between'>
                              <button
                                onClick={() => setViewCV(false)}
                                type='button'
                                className='w-full md:w-auto mt-10 md:mt-12 mb-7 border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
                              >
                                Go Back to Applicant Information
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    </form>
                    <form className={`second-form ${currentForm === 'experience' ? '' : 'hidden'}`}>
                      <h5 className='text-xl text-indigo-dye font-semibold'>Experience</h5>
                      <div>{renderExpInputs()}</div>
                      {/* <button
                          type='button'
                          className='lg:mt-5 w-full md:w-auto rounded-md flex justify-center items-center bg-[#65C979] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#90d69e]'
                          onClick={() =>
                            append({
                              position: '',
                              majorRole: '',
                              companyOrg: '',
                              dateFrom: '',
                              dateTo: '',
                            })
                          }
                        >
                          <PlusIcon className='h-5 w-5 mr-3' />
                          Add Experience
                        </button> */}
                      <h6 className='text-sm text-indigo-dye font-semibold mt-16'>Work Set-up Preference</h6>
                      <div className='flex items-center mt-3'>
                        <label
                          className={`h-3.5 w-3.5 flex justify-center items-center cursor-pointer ${
                            isWFH ? 'border-2 border-savoy-blue' : 'border border-gray-400'
                          }`}
                        >
                          {isWFH ? (
                            <div className='h-3.5 w-3.5 bg-savoy-blue'>
                              <CheckIcon className='h-3.5 w-3.5 text-white' />
                            </div>
                          ) : (
                            ''
                          )}
                          <input
                            type='checkbox'
                            id='wfh'
                            className='hidden'
                            checked={isWFH}
                            onChange={() => setCheckWFH((isWFH) => !isWFH)}
                            disabled={isDisable}
                          />
                        </label>
                        <label htmlFor='wfh' className='ml-3 text-sm text-indigo-dye'>
                          Open to Work From Home
                        </label>
                      </div>
                      <div className='flex items-center mt-2.5'>
                        <label
                          className={`h-3.5 w-3.5 flex justify-center items-center cursor-pointer ${
                            isWOS ? 'border-2 border-savoy-blue' : 'border border-gray-400'
                          }`}
                        >
                          {isWOS ? (
                            <div className='h-3.5 w-3.5 bg-savoy-blue'>
                              <CheckIcon className='h-3.5 w-3.5 text-white' />
                            </div>
                          ) : (
                            ''
                          )}
                          <input
                            type='checkbox'
                            id='wos'
                            className='hidden'
                            checked={isWOS}
                            onChange={() => setCheckWOS((isWOS) => !isWOS)}
                            disabled={isDisable}
                          />
                        </label>
                        <label htmlFor='wos' className='ml-3 text-sm text-indigo-dye'>
                          Open to Work on Site
                        </label>
                      </div>
                      <div className='md:flex justify-between mt-10 md:mt-16 lg:mt-28 md:mb-5'>
                        <button
                          type='button'
                          className='rounded-md w-full md:w-auto bg-white px-14 py-2.5 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          onClick={() => setCurrentForm('profile')}
                        >
                          BACK
                        </button>
                        <button
                          type='button'
                          className='rounded-md w-full my-4 md:my-0 md:w-auto bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          onClick={() => setIsOpen(null)}
                        >
                          Close
                        </button>
                        {/* <button
                            type='submit'
                            className='rounded-md w-full my-4 md:my-0 md:w-auto bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
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
                              'SUBMIT'
                            )}
                          </button> */}
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
