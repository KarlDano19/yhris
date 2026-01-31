import { Dispatch, Fragment, useRef, useState, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useUpdateAccount from '../hooks/useUpdateAccount';
import useGetAccountDetails from '../hooks/useGetAccountDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { EyeIcon } from '@heroicons/react/24/solid';
import { EyeSlashIcon } from '@heroicons/react/24/outline';

type T_ModalData = {
  id: number;
  open: boolean;
};

const getPasswordRequirements = (pass: string) => ({
  length: pass.length >= 12,
  lowercase: /[a-z]/.test(pass),
  uppercase: /[A-Z]/.test(pass),
  digit: /[0-9]/.test(pass),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
  noSpaces: !/\s/.test(pass),
});

export default function ResetPasswordModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [backendPasswordError, setBackendPasswordError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState(getPasswordRequirements(''));

  const { register, handleSubmit, reset, control, setValue } = useForm();
  const {
    data: accountDetailsData,
    refetch: refetchAccountDetails,
    remove: removeAccount,
  } = useGetAccountDetails(isOpen.id);
  const { mutate: updateAccount, isLoading: isLoadingUpdateAccount } = useUpdateAccount();

  useEffect(() => {
    if (isOpen) {
      refetchAccountDetails();
    }
  }, [isOpen]);

  useEffect(() => {
    if (accountDetailsData) {
      setValue('name', accountDetailsData.name);
      setValue('email', accountDetailsData.email);
    }
  }, [accountDetailsData]);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
        customCloseModal();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    updateAccount({ account_id: isOpen.id, data: data }, callbackReq);
  });

  const customCloseModal = () => {
    reset();
    removeAccount();
    setIsOpen(null);
  };

  const generateStrongPassword = () => {
    const length = 12;
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+';
    
    // Ensure at least one character from each required category
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest with random characters from all categories
    const allChars = lowercase + uppercase + digits + special;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password to avoid predictable patterns (first char always lowercase, etc.)
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(password);
    setConfirmPassword(password);
    setPasswordRequirements(getPasswordRequirements(password));
    setBackendPasswordError('');
  };

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:mx-8 sm:w-full sm:max-w-7xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Reset Password</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <div className='md:mx-6 my-4'>
                    <form onSubmit={onSubmit}>
                      <div className='px-4 pt-4 pb-6'>
                        <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
                          <div className='flex'>
                            <div className='flex-shrink-0'>
                              <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
                            </div>
                            <div className='ml-3'>
                              <h3 className='text-sm font-medium text-red-800'>
                                You cannot proceed due to incomplete fields. Please review.
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='grid lg:grid-cols-6 gap-x-8 mt-7'>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5'>
                            <div className='grid-item'>
                              <div className='mb-2'>
                                <label htmlFor='password' className='text-sm leading-6 text-gray-900'>
                                  Password
                                  <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    {...register('password', { required: true })}
                                    className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.currentTarget.value);
                                      setPasswordRequirements(getPasswordRequirements(e.currentTarget.value));
                                      setBackendPasswordError('');
                                    }}
                                  />
                                  <button
                                    type='button'
                                    className='absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center px-2 text-blue-400'
                                    onClick={() => {
                                      setShowPassword(!showPassword);
                                    }}
                                  >
                                    {showPassword ? (
                                      <EyeIcon className='h-5 w-5 text-savoy-blue' />
                                    ) : (
                                      <EyeSlashIcon className='h-5 w-5 text-savoy-blue' />
                                    )}
                                  </button>
                                </div>
                                {backendPasswordError && (
                                  <p className='text-red-600 text-xs mt-1'>{backendPasswordError}</p>
                                )}
                                {password && (
                                  <div className='mt-2 text-sm text-red-600'>
                                    <ul className='space-y-1'>
                                      {!passwordRequirements.length && <li>• At least 12 characters</li>}
                                      {!passwordRequirements.lowercase && <li>• At least 1 lowercase letter (a-z)</li>}
                                      {!passwordRequirements.uppercase && <li>• At least 1 uppercase letter (A-Z)</li>}
                                      {!passwordRequirements.digit && <li>• At least 1 number (0-9)</li>}
                                      {!passwordRequirements.special && (
                                        <li>• At least 1 special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                                      )}
                                      {!passwordRequirements.noSpaces && <li>• Spaces are not allowed</li>}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className='mt-3'>
                                <button
                                  type='button'
                                  className='inline-flex justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:shadow-md focus:shadow-none disabled:opacity-50'
                                  onClick={generateStrongPassword}
                                >
                                  GENERATE STRONG PASSWORD
                                </button>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <div className='mb-4'>
                                <label htmlFor='confirm-password' className='text-sm leading-6 text-gray-900'>
                                  Confirm Password
                                  <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id='confirm-password'
                                    className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                                    value={confirmPassword}
                                    {...register('confirmPassword', { required: true })}
                                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                                  />
                                  <button
                                    type='button'
                                    className='absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center px-2 text-blue-400'
                                    onClick={() => {
                                      setShowConfirmPassword(!showConfirmPassword);
                                    }}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeIcon className='h-5 w-5 text-savoy-blue' />
                                    ) : (
                                      <EyeSlashIcon className='h-5 w-5 text-savoy-blue' />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                        <button
                          type='submit'
                          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                          disabled={isLoadingUpdateAccount}
                        >
                          {isLoadingUpdateAccount && (
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
                          {!isLoadingUpdateAccount && 'Save'}
                        </button>
                        <button
                          type='button'
                          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          onClick={() => customCloseModal()}
                          ref={cancelButtonRef}
                        >
                          Close
                        </button>
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