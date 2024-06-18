'use client';
import React, { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import classNames from '@/helpers/classNames';
import CustomDatePicker from '@/components/CustomDatePicker';
import SendContract from './SendContract';
import Orient from './Orient';
import IntroduceToTeam from './IntroduceToTeam';
import EnrollToPayroll from './EnrollToPayroll';
import OrientOptionModal from './modals/OrientOptionModal';
import SendContractModal from './modals/SendContractModal';
import SuccessModal from './modals/SuccessModal';
import NoticeModal from './modals/NoticeModal';
import IntroduceModal from './modals/IntroduceModal';
import useGetApplicantOrient from './hooks/useGetApplicantOrient';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import useUpdateApplicantOrient from './hooks/useUpdateApplicantOrient';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const Content = () => {
  const params = useParams();
  const [orientItems, setOrientItems] = useState<any>([]);
  const [selectedOrientId, setSelectedOrientId] = useState('');
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const {
    data: applicationOrient,
    isLoading: applicationOrientIsLoading,
    refetch,
  } = useGetApplicantOrient(Number(params.position), itemsFilter);
  const { mutate, isLoading } = useUpdateApplicantOrient();
  const [isSendContractModalOpen, setIsSendContractModalOpen] = useState(false);
  const [isOrientOptionModalOpen, setIsOrientOptionModalOpen] = useState(false);
  const [isSuccessSendContractModalOpen, setIsSuccessSendContractModalOpen] = useState(false);
  const [isDoloNewHire, setIsDoloNewHire] = useState(false);
  const [isIntegrateToDolo, setIntegrateToDolo] = useState(false);
  const [isLoggedInDolo, setIsLoggedInDolo] = useState(false);
  const [isLearningMaterials, setIsLearningMaterials] = useState(false);
  const [selectedLearningMaterials, setSelectedLearningMaterials] = useState<string | null>(null);
  const [isSendOrientLink, setIsSendOrientLink] = useState(false);
  const [isOrientLinkEmail, setIsOrientLinkEmail] = useState(false);
  const [orientLinkEmail, setOrientLinkEmail] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newHireOriented, setNewHireOriented] = useState(false);
  const [isIntroducedModalOpen, setIsIntroducedModalOpen] = useState(false);
  const [isSuccessIntroducedModalOpen, setSuccessIsIntroducedModalOpen] = useState(false);
  const [isSignInPayrollModalOpen, setIsSignInPayrollModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  useEffect(() => {
    if (applicationOrient && applicationOrient.length !== 0) {
      applicationOrient.map((item: any) => {
        item['created_at'] = new Intl.DateTimeFormat('en-US').format(new Date(item.created_at));
        item['isContractSent'] = item.is_contract_sent;
        item['isContractReceived'] = item.is_contract_received;
        item['contractReceivedDate'] = new Intl.DateTimeFormat('en-US').format(
          new Date(item.contract_received_date && item.contract_received_date)
        );
        item['isIntroduced'] = item.is_introduction_sent;
        item['isOriented'] = item.is_orientation_completed;
        item['introduceTeam'] = {
          to: '',
          template: '',
          email: '',
          cc: '',
          bcc: '',
        };
        item['sendContract'] = {
          to: '',
          template: '',
          email: '',
          cc: '',
          bcc: '',
        };
        item['isEnrolled'] = item.is_enrolled;
        return item;
      });
      setOrientItems(applicationOrient);
    }
  }, [applicationOrient]);

  const setReceived = (id: string, emailType: string) => {
    const itemIndex = orientItems.findIndex((item: any) => item.id === id);
    const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
    const currentDate = new Date();
    orientItemCopy[itemIndex].id = id;
    orientItemCopy[itemIndex].actionType = 'received';
    orientItemCopy[itemIndex].emailType = emailType;
    orientItemCopy[itemIndex].dateReceived = currentDate;
    if (emailType === 'contract') {
      orientItemCopy[itemIndex].isContractReceived = true;
      orientItemCopy[itemIndex].contractReceivedDate = new Intl.DateTimeFormat('en-US').format(currentDate);
    }
    const callbackReq = {
      onSuccess: (data: any) => {
        setOrientItems([...orientItemCopy]);
        toast.custom(() => <CustomToast message={'Sent contract mark as received.'} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(orientItemCopy[itemIndex], callbackReq);
  };

  const setEnrolled = (id: any) => {
    const itemIndex = orientItems.findIndex((item: any) => item.id === id);
    const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
    orientItemCopy[itemIndex].id = id;
    orientItemCopy[itemIndex].actionType = 'update_status';
    orientItemCopy[itemIndex].emailType = 'enrolled';
    orientItemCopy[itemIndex].isEnrolled = true;
    const callbackReq = {
      onSuccess: (data: any) => {
        setOrientItems([...orientItemCopy]);
        setIsEnrollModalOpen(true);
        toast.custom(() => <CustomToast message={'Applicant successfully enrolled.'} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(orientItemCopy[itemIndex], callbackReq);
  };

  const setOriented = () => {
    const itemIndex = orientItems.findIndex((item: any) => item.id === selectedOrientId);
    const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
    orientItemCopy[itemIndex].actionType = 'update_status';
    orientItemCopy[itemIndex].emailType = 'orient';
    orientItemCopy[itemIndex].isOriented = true;
    const callbackReq = {
      onSuccess: (data: any) => {
        setOrientItems(orientItemCopy);
        toast.custom(() => <CustomToast message={'Applicant successfully orient.'} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(orientItemCopy[itemIndex], callbackReq);
  };

  const checkIfDateIsValid = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);

    if (dateFrom && !dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, {
        duration: 5000,
      });
    }
    if (!dateFrom && dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, {
        duration: 5000,
      });
    }
    if (dateFrom > dateTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        {
          duration: 5000,
        }
      );
    }
    refetch();
  };

  const renderRows = () => {
    if (orientItems && orientItems.length > 0) {
      return orientItems.map((item: any, index: number) => (
        <tr key={index}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center'>{item.created_at}</div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex gap-2 justify-center'>
              <span>{item?.applicant?.firstname + ' ' + item?.applicant?.lastname}</span>{' '}
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <SendContract
              isContractSent={item.isContractSent}
              isContractReceived={item.isContractReceived}
              contractReceivedDate={item.contractReceivedDate}
              setIsSendContractModalOpen={(e) => {
                setSelectedOrientId(item.id);
                setIsSendContractModalOpen(e);
              }}
              setReceived={() => {
                setReceived(item.id, 'contract');
              }}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <Orient
              isOriented={item.isOriented}
              setIsOrientFirstModalOpen={(e) => {
                setSelectedOrientId(item.id);
                setIsOrientOptionModalOpen(e);
              }}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center'>
              <IntroduceToTeam
                isIntroduced={item.isIntroduced}
                setIsIntroducedModalOpen={(e) => {
                  setSelectedOrientId(item.id);
                  setIsIntroducedModalOpen(e);
                }}
              />
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center'>
              <EnrollToPayroll
                id={String(item.id)}
                isEnrolled={item.isEnrolled}
                setEnrolled={() => {
                  setEnrolled(item.id);
                }}
              />
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm'>Please click create to add separtion of employee.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/orient' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Positions</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Orient</h2>
          <div className='mt-6 flex flex-col lg:flex-row items-center gap-16'>
            <div className='flex-none flex flex-col lg:flex-row items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={itemsFilter.from}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter) setItemsFilter({ ...itemsFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      from: new Date(value),
                    });
                  }}
                />
              </div>
              <p>to</p>
              <div className='relative'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={itemsFilter.to}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter) setItemsFilter({ ...itemsFilter, to: date });
                    if (!itemsFilter) setItemsFilter(date);
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      to: new Date(value),
                    });
                  }}
                />
              </div>
              <button
                className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                onClick={checkIfDateIsValid}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
            <div className='flex-none lg:w-1/3'>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                  placeholder='Search...'
                />
                <div className='absolute inset-y-0 right-0 flex py-2 pr-2'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
                </div>
              </div>
            </div>
          </div>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 h-[75vh]'>
                <table
                  className={classNames(
                    'min-w-full divide-y divide-gray-300 text-center',
                    orientItems.length === 0 && 'mb-6'
                  )}
                >
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Send Contract
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Orient
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Introduce to the team
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Enroll to system
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
                <p className='text-xs text-gray-500 mt-2'>Total record/s: {orientItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SendContractModal
        selectedOrientId={selectedOrientId}
        orientItems={orientItems}
        setOrientItems={setOrientItems}
        setIsOpen={setIsSendContractModalOpen}
        isOpen={isSendContractModalOpen}
        setSuccessModal={setIsSuccessSendContractModalOpen}
      />
      <OrientOptionModal
        selectedOrientId={selectedOrientId}
        orientItems={orientItems}
        setOrientItems={setOrientItems}
        setIsOpen={setIsOrientOptionModalOpen}
        isOpen={isOrientOptionModalOpen}
        setIsNewHireOrientedOpen={setNewHireOriented}
      />
      <SuccessModal
        isOpen={isSuccessSendContractModalOpen}
        setIsOpen={setIsSuccessSendContractModalOpen}
        message='You have successfully sent an email.'
      />
      <NoticeModal isOpen={isDoloNewHire} setIsOpen={setIsDoloNewHire}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Do you have an account in YAHSHUA Dolo to orient the New Hire?
        </h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
          <button
            type='button'
            className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
            onClick={() => {
              setIsDoloNewHire(false);
              setIntegrateToDolo(true);
            }}
          >
            YES, I HAVE.
          </button>
          <button
            type='submit'
            className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
            onClick={() => {
              setIsDoloNewHire(false);
            }}
          >
            NO, I DON{"'"}T.
          </button>
        </div>
      </NoticeModal>
      <NoticeModal isOpen={isIntegrateToDolo} setIsOpen={setIntegrateToDolo}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Would you like YAHSHUA HRIS to be integrated with YAHSHUA Dolo?
        </h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
          <button
            type='button'
            className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
            onClick={() => {
              setIntegrateToDolo(false);
              setIsLoggedInDolo(true);
            }}
          >
            YES
          </button>
          <button
            type='submit'
            className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
            onClick={() => {
              setIntegrateToDolo(false);
            }}
          >
            NO
          </button>
        </div>
      </NoticeModal>
      <NoticeModal isOpen={isLoggedInDolo} setIsOpen={setIsLoggedInDolo}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          It appears that you are not logged in to YAHSHUA Dolo.
          <br />
          <br />
          Please log in to YAHSHUA Dolo.
        </h5>
        <button
          type='button'
          className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
          onClick={() => {
            setIsLoggedInDolo(false);
            setIsLearningMaterials(true);
          }}
        >
          LOG IN TO YAHSHUA DOLO
        </button>
      </NoticeModal>
      <NoticeModal isOpen={isLearningMaterials} setIsOpen={setIsLearningMaterials}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Awesome! Please select from the following learning materials to orient the New Hire:
        </h5>
        <div className={`flex flex-col space-y-2 pl-8 pt-4 pb-6`}>
          <label className='inline-flex items-center mr-4'>
            <input
              type='radio'
              className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
              value='text'
              name='radioGroup'
              onClick={() => setSelectedLearningMaterials('New Hire Orientation')}
            />
            <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>New Hire Orientation</span>
          </label>
          <label className='inline-flex items-center mr-4'>
            <input
              type='radio'
              className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
              value='text'
              name='radioGroup'
              onClick={() => setSelectedLearningMaterials('Communication Skills - Email Basics')}
            />
            <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>
              Communication Skills - Email Basics
            </span>
          </label>
          <label className='inline-flex items-center mr-4'>
            <input
              type='radio'
              className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
              value='text'
              name='radioGroup'
              onClick={() => setSelectedLearningMaterials('Remote Work Readiness')}
            />
            <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>Remote Work Readiness</span>
          </label>
        </div>
        <button
          type='button'
          className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
          onClick={() => {
            if (selectedLearningMaterials) {
              setIsLearningMaterials(false);
              setIsSendOrientLink(true);
            }
          }}
        >
          CONTINUE
        </button>
      </NoticeModal>
      <NoticeModal isOpen={isSendOrientLink} setIsOpen={setIsSendOrientLink}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Would you like send the orientation link to the New Hire’s registered email or send to his/her new company
          email?
        </h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
          <button
            type='button'
            className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
            onClick={() => {
              setIsSendOrientLink(false);
              setIsOrientLinkEmail(true);
            }}
          >
            YES
          </button>
          <button
            type='submit'
            className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
            onClick={() => {
              setIsSendOrientLink(false);
            }}
          >
            NO
          </button>
        </div>
      </NoticeModal>
      <NoticeModal isOpen={isOrientLinkEmail} setIsOpen={setIsOrientLinkEmail}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Enter New Hire email to send the orientation link.
        </h5>
        <div className='my-8'>
          <input
            type='email'
            id='email'
            placeholder='Enter email...'
            onChange={(e) => setOrientLinkEmail(e.target.value)}
            className='block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
          />
        </div>
        <button
          type='button'
          className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
          onClick={() => {
            if (orientLinkEmail) {
              setIsOrientLinkEmail(false);
              setIsSuccess(true);
              const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
              orientItemCopy[0].isOrientationSent = true;
              setOrientItems(orientItemCopy);
            }
          }}
        >
          CONTINUE
        </button>
      </NoticeModal>
      <SuccessModal
        isOpen={isSuccess}
        setIsOpen={setIsSuccess}
        message='You have successfully sent orientation link to the New Hire.'
      />
      <NoticeModal isOpen={newHireOriented} setIsOpen={setNewHireOriented}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>Have you already oriented the New Hire?</h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
          <button
            type='button'
            className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
            onClick={() => {
              setNewHireOriented(false);
              setOriented();
            }}
          >
            YES, I HAVE.
          </button>
          <button
            type='submit'
            className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
            onClick={() => {
              setNewHireOriented(false);
            }}
          >
            NO, I DON'T.
          </button>
        </div>
      </NoticeModal>
      <IntroduceModal
        selectedOrientId={selectedOrientId}
        orientItems={orientItems}
        setOrientItems={setOrientItems}
        setIsOpen={setIsIntroducedModalOpen}
        isOpen={isIntroducedModalOpen}
        setSuccessModal={setSuccessIsIntroducedModalOpen}
      />
      <SuccessModal
        isOpen={isSuccessIntroducedModalOpen}
        setIsOpen={setSuccessIsIntroducedModalOpen}
        message='You have successfully sent an email.'
      />
      <NoticeModal isOpen={isSignInPayrollModalOpen} setIsOpen={setIsSignInPayrollModalOpen}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          It appears that you are not signed in to YAHSHUA.
          <br />
          <br />
          Payroll Please sign in to YAHSHUA Payroll.
        </h5>
        <button
          type='button'
          className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
        >
          SIGN IN TO YAHSHUA PAYROLL
        </button>
      </NoticeModal>
      <SuccessModal
        isOpen={isEnrollModalOpen}
        setIsOpen={setIsEnrollModalOpen}
        message='You have successfully enrolled New Hire to YAHSHUA Payroll.'
      />
    </>
  );
};

export default Content;
