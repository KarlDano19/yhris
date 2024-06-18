import { useEffect, useState, useContext, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import useGetApplicantDetails from '../hooks/useGetApplicantDetails';
import StateContext from '../contexts/StateContext';
import classNames from '@/helpers/classNames';

import { EnvelopeIcon, PhoneIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { initialActionState } from '../lib/initialActionState';
import { ContextTypes } from '../types';

type PropTypes = {
  title: string;
};
export default function ApplicantForm({ title }: PropTypes) {
  const cancelButtonRef = useRef(null);
  const { actionState, setActionState, dispatch }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { data, isLoading } = useGetApplicantDetails(actionState.applicantId);
  const [selectedTab, setSelectedTab] = useState<string>('profile');
  const [viewCV, setViewCV] = useState<boolean>(false);
  const [applicantProfile, setApplicantProfile] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (data && !isLoading) {
      setApplicantProfile(data);
    }
  }, [data]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };

  const renderProfileTab = () => {
    return (
      <>
        <div className='flex mt-8'>
          <div className='mr-8'>
            <div
              className='bg-gray-300 h-48 w-36 rounded-md mx-auto lg:mx-0 flex items-center justify-center'
              style={{
                backgroundImage: `url(${applicantProfile.photo})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          </div>
          <div className=''>
            <p className='text-[1.5rem]'>{applicantProfile.name}</p>
            <div className='my-3 flex'>
              <EnvelopeIcon className='h-6 w-6 text-blue-700 mr-3' />
              <span className='text-[1rem]'>{applicantProfile.email}</span>
            </div>
            <div className='my-3 flex'>
              <PhoneIcon className='h-6 w-6 text-blue-700 mr-3' />
              <span className='text-[1rem]'>{applicantProfile.mobile}</span>
            </div>
            <div className='my-3 flex'>
              <MapPinIcon className='h-6 w-6 text-blue-700 mr-3' />
              <span className='text-[1rem]'>{applicantProfile.address}</span>
            </div>
          </div>
        </div>
        <div className='flex mt-8 mb-12'>
          <div className='flex-1'>
            <div className='font-semibold'>Nationality</div>
            <div>{applicantProfile.nationality}</div>
          </div>
          <div className='flex-1'>
            <div className='font-semibold'>Gender</div>
            <div>{applicantProfile.gender}</div>
          </div>
          <div className='flex-1'>
            <div className='font-semibold'>Religion</div>
            <div>{applicantProfile.religion}</div>
          </div>
        </div>
        <div>
          <button
            type='button'
            className='px-4 py-2 rounded-md text-[#355FD0] border-[1px] border-[#355FD0]'
            onClick={() => setViewCV(true)}
          >
            View Attached CV/Resume
          </button>
        </div>
      </>
    );
  };

  const renderJobExpTab = () => {
    return (
      <>
        {applicantProfile.work_experience.map((exp: any) => {
          return (
            <div key={exp.id}>
              <div className='flex mt-8 overflow-y-auto'>
                <div className='mr-3'>
                  <StarIcon className='h-6 w-6 text-blue-700' />
                </div>
                <div>
                  <p className='font-semibold'>{exp.position}</p>
                  <p>
                    {exp.dateFrom} - {exp.dateTo}
                  </p>
                  <p>{exp.companyOrg}</p>
                  <p className='font-semibold mt-4'>Major Roles:</p>
                  <div className='pl-7'>
                    <ul className='list-disc'>
                      <li>{exp.majorRole}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const renderResumeView = () => {
    return (
      <>
        <iframe
          className='w-full h-[43rem]'
          src={`${applicantProfile.cv}#toolbar=0`}
        ></iframe>
      </>
    );
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-30' initialFocus={cancelButtonRef} onClose={handleClose}>
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
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel
                className={classNames(
                  'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full',
                  viewCV ? 'max-w-4xl' : 'max-w-xl'
                )}
              >
                <div className='flex bg-savoy-blue p-2 items-center gap-4'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>{title}</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer self-start' onClick={handleClose} />
                </div>
                <div className={classNames('m-7', viewCV ? 'h-[43rem]' : 'h-auto')}>
                  {!viewCV && (
                    <div className='w-full grid grid-cols-2'>
                      <div className='mr-5'>
                        <button
                          className={classNames(
                            'px-4 py-2 font-bold rounded-md w-full',
                            selectedTab == 'profile' ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                          )}
                          onClick={() => setSelectedTab('profile')}
                        >
                          Applicant Profile
                        </button>
                      </div>
                      <div className='ml-5'>
                        <button
                          className={classNames(
                            'px-4 py-2 font-bold rounded-md w-full',
                            selectedTab == 'work' ? 'bg-[#355FD0] hover:bg-blue-700 text-white' : 'text-gray-400'
                          )}
                          onClick={() => setSelectedTab('work')}
                        >
                          Job Experience
                        </button>
                      </div>
                    </div>
                  )}
                  {!viewCV && selectedTab == 'profile' && renderProfileTab()}
                  {!viewCV && selectedTab == 'work' && renderJobExpTab()}
                  {viewCV && renderResumeView()}
                </div>
                {!viewCV && (
                  <div className='flex items-center gap-4 text-[15px] font-bold justify-end flex-wrap p-4 border-t-[1px] border-[#355FD0]'>
                    <button
                      onClick={handleClose}
                      type='button'
                      className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
                    >
                      Close
                    </button>
                  </div>
                )}
                {viewCV && (
                  <div className='flex items-center gap-4 text-[15px] font-bold justify-start flex-wrap p-4 border-t-[1px] border-[#355FD0]'>
                    <button
                      onClick={() => setViewCV(false)}
                      type='button'
                      className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
                    >
                      Go Back to Applicant Information
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
