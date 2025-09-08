import { useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';

import dynamic from 'next/dynamic';

import { Marker } from '@react-google-maps/api';
import { useForm } from 'react-hook-form';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import { ApplicantType, ContextTypes, ScheduleInterviewPropTypes as PropTypes } from '../types';
import { initialActionState } from '../lib/initialActionState';
import classNames from '@/helpers/classNames';
import useGetThirdPartyIntegrationItems from '@/components/hooks/useGetThirdPartyIntegrationItems';
import ModalFooterLayout from '../layouts/ModalFooterLayout';
import useTagInput from '../hooks/useTagInput';
import StateContext from '../contexts/StateContext';
import ModalLayout from './ModalLayout';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { LocationIcon, WhiteLocationIcon } from '@/svg/LocationIcon';
import { PhoneIcon, WhitePhoneIcon } from '@/svg/PhoneIcon';
import { VideoIcon, WhiteVideoIcon } from '@/svg/VideoIcon';
import SelectChevronDown from '@/svg/SelectChevronDownDummy';
import CalendarIcon from '@/svg/CalendarIcon';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;
  const trimmed = html.trim();
  return trimmed === '' || trimmed === '<p><br></p>' || trimmed === '<p></p>';
};

const containerStyle = {
  width: 'auto',
  height: '400px',
};
const formatTypes = [
  {
    title: 'Video',
    name: 'type',
    id: 'video',
    icon: <VideoIcon />,
    whiteIcon: <WhiteVideoIcon />,
    borderStyle: 'rounded-tl-md rounded-bl-md',
    disabled: false,
  },
  {
    title: 'Phone',
    name: 'type',
    id: 'phone',
    icon: <PhoneIcon />,
    whiteIcon: <WhitePhoneIcon />,
    borderStyle: '',
    disabled: true,
  },
  {
    title: 'In-person',
    name: 'type',
    id: 'inPerson',
    icon: <LocationIcon />,
    whiteIcon: <WhiteLocationIcon />,
    borderStyle: 'rounded-tr-md rounded-br-md',
    disabled: true,
  },
];
const platformsOptions = [
  {
    title: 'Zoom',
    name: 'platform',
    id: 'zoom',
    value: 'zoom',
    redirect_url: `${process.env.NEXT_PUBLIC_API_URL}/api/sso/login/zoom-oauth/`,
    disabled: true,
  },
  {
    title: 'Google Meet',
    name: 'platform',
    id: 'googleMeet',
    value: 'google',
    redirect_url: `${process.env.NEXT_PUBLIC_API_URL}/api/sso/login/google-oauth/`,
    disabled: false,
  },
  {
    title: 'Microsoft Teams',
    name: 'platform',
    id: 'microsoftTeams',
    value: 'microsoft teams',
    redirect_url: ``,
    disabled: true,
  },
];

export default function ScheduleInterview({ title, handleFormSubmit, isSendInterviewScheduleLoading }: PropTypes) {
  const broadcastChannel = new BroadcastChannel('integration-channel');
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDTAy1T3Yz-3gk_O8dQH7rwvbp8OaLa65A',
  });
  const [platforms, setPlatforms] = useState<any>([]);
  const [integrationItems, setIntegrationItems] = useState<any>([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  const { register, setValue, watch, handleSubmit, getValues } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [selectionId, setSelectionId] = useState('video');
  const [input, setInput] = useState('');
  const [noTags, setNoTags] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);
  const { tags, handleKeyDown, handleRemoveTag } = useTagInput(input, setInput);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState(null);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  const applicant: ApplicantType | undefined = useMemo(() => {
    return state
      .find((stage) => stage.id === actionState.stageId)
      ?.applicants.find((applicant) => applicant.id === actionState.applicantId);
  }, [state, actionState]);
  const { data: dataIntegrationItems, refetch: refetchIntegrationItems } = useGetThirdPartyIntegrationItems();

  // Function to check if there are unsaved changes
  const hasUnsavedChanges = () => {
    const formData = watch();
    return (
      (formData.date && formData.date !== '') ||
      (formData.startTime && formData.startTime !== '') ||
      (formData.duration && formData.duration !== '') ||
      (formData.platform && formData.platform !== '') ||
      (formData.phoneNumber && formData.phoneNumber.trim() !== '') ||
      (formData.integrated_id && formData.integrated_id !== '') ||
      (formData.message && !isHtmlEmpty(formData.message)) ||
      (tags.length > 0)
    );
  };

  // Function to handle confirmation modal close (cancel)
  const handleUnsavedChangesCancel = () => {
    setIsUnsavedChangesModalOpen(false);
    setPendingCloseAction(null);
  };

  // Function to handle confirmation modal confirm (proceed with close)
  const handleUnsavedChangesConfirm = () => {
    setIsUnsavedChangesModalOpen(false);
    const action = pendingCloseAction;
    setPendingCloseAction(null);
    
    // Execute the pending close action
    if (action) {
      action();
    }
  };

  // Function to reset all form data
  const resetFormData = () => {
    setValue('date', '');
    setValue('startTime', '');
    setValue('duration', '');
    setValue('platform', '');
    setValue('phoneNumber', '');
    setValue('integrated_id', '');
    setValue('message', '');
    // Reset tags by clearing input and removing all existing tags
    setInput('');
    tags.forEach(tag => handleRemoveTag(tag));
    setNoTags(false);
    setSelectionId('video');
    setCoordinates({ lat: 0, lng: 0 });
  };

  // Function to handle modal close with unsaved changes check
  const handleModalClose = (closeAction: () => void) => {
    if (hasUnsavedChanges()) {
      setPendingCloseAction(() => closeAction);
      setIsUnsavedChangesModalOpen(true);
    } else {
      closeAction();
    }
  };

  const onLoad = useCallback(function callback(map: any) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        const bounds = new window.google.maps.LatLngBounds({ lat: latitude, lng: longitude });
        map.fitBounds(bounds);
        setMap(map);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  useEffect(() => {
    setIsOpen(true);
    refetchIntegrationItems();
  }, []);

  useEffect(() => {
    if (dataIntegrationItems && Array.isArray(dataIntegrationItems)) {
      setPlatforms(dataIntegrationItems.map((item: any) => item.provider));
    }
  }, [dataIntegrationItems]);

  useEffect(() => {
    if (watch('platform') && dataIntegrationItems && Array.isArray(dataIntegrationItems)) {
      setIntegrationItems(dataIntegrationItems.filter((item: any) => item.provider === watch('platform')));
    }
  }, [watch('platform'), dataIntegrationItems]);

  useEffect(() => {
    broadcastChannel.onmessage = (event) => {
      if (event.data.isGranted) {
        refetchIntegrationItems();
      }
    };
    return () => {
      broadcastChannel.close();
    };
  }, []);

  const handleClose = () => {
    handleModalClose(() => {
      resetFormData();
      setIsOpen(false);
      setTimeout(() => setActionState(initialActionState), 400);
    });
  };

  const onSubmit = (data: any) => {
    if (tags.length !== 0) {
      data.applicantId = applicant?.id;
      data.emails = tags;
      data.selectionId = selectionId;
      data.coordinates = coordinates;
      handleFormSubmit(data, () => {
        // Reset form data before closing modal to prevent unsaved changes detection
        resetFormData();
        setIsOpen(false);
      });
    } else {
      setNoTags(true);
    }
  };

  const ssoLogin = (url: string) => {
    const left = (window.innerWidth - 900) / 2;
    const top = (window.innerHeight - 700) / 2;
    const popup = window.open(url, 'popup', `width=900, height=900, left=${left}, top=${top}`);
    const checkOAuthStatus = setInterval(function () {
      if (popup?.closed) {
        clearInterval(checkOAuthStatus);
      }
    }, 1000);
  };

  return (
    <>
      <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <div className='p-4'>
          {/* <div className='flex items-center gap-3 flex-wrap mb-8'>
              <div className='text-indigo-dye flex-grow'>
                <label htmlFor='date' className='block mb-2'>
                  Dates<span className='text-[#D65846]'>*</span>
                </label>
                <div className='border border-[#ACB9CB] focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0] rounded-md flex items-center justify-between py-2 px-4 relative'>
                  <input
                    onClick={() => dateRef.current?.showPicker()}
                    ref={dateRef}
                    type='date'
                    name='date'
                    onChange={(e) => setValue('date', e.target.value)}
                    className='w-full focus:none outline-none'
                    required
                  />
                  <CalendarIcon className='w-6 h-6 absolute right-4 pointer-events-none' />
                </div>
              </div>
              <div className='text-indigo-dye flex-grow'>
                <label htmlFor='startTime' className='block mb-2'>
                  Start Time<span className='text-[#D65846]'>*</span>
                </label>

                <div className='border border-[#ACB9CB] rounded-md flex items-center justify-between py-2 px-4 focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]'>
                  <input
                    onClick={() => timeRef.current?.showPicker()}
                    ref={timeRef}
                    type='time'
                    id='startTime'
                    onChange={(e) => setValue('startTime', e.target.value)}
                    className='focus:none outline-none'
                    required
                  />
                </div>
              </div>
              <div className='text-indigo-dye flex-grow'>
                <label htmlFor='duration' className='block mb-2'>
                  Duration<span className='text-[#D65846]'>*</span>
                </label>

                <div className='border border-[#ACB9CB] rounded-md flex items-center justify-between relative focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]'>
                  <select
                    {...register('duration')}
                    id='duration'
                    className='w-full py-2 px-4 focus:none outline-none rounded-full'
                    defaultValue=''
                  >
                    <option value='' disabled>Select...</option>
                    <option value='30'>30 min</option>
                    <option value='60'>1 hr</option>
                    <option value='120'>2 hr</option>
                  </select>
                  <div className='absolute right-4 pointer-events-none'>
                    <SelectChevronDown />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3 flex-wrap mb-8'>
              <div className='text-indigo-dye flex-grow'>
                <label htmlFor='date' className='block mb-2'>
                  Dates<span className='text-[#D65846]'>*</span>
                </label>
                <div className='border border-[#ACB9CB] focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0] rounded-md flex items-center justify-between py-2 px-4 relative'>
                  <input
                    onClick={() => dateRef.current?.showPicker()}
                    ref={dateRef}
                    type='date'
                    name='date'
                    onChange={(e) => setValue('date', e.target.value)}
                    className='w-full focus:none outline-none'
                    required
                  />
                  <CalendarIcon className='w-6 h-6 absolute right-4 pointer-events-none' />
                </div>
              </div>
              <div className='text-indigo-dye flex-grow'>
                <label htmlFor='startTime' className='block mb-2'>
                  Start Time<span className='text-[#D65846]'>*</span>
                </label>

                <div className='border border-[#ACB9CB] rounded-md flex items-center justify-between py-2 px-4 focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]'>
                  <input
                    onClick={() => timeRef.current?.showPicker()}
                    ref={timeRef}
                    type='time'
                    id='startTime'
                    onChange={(e) => setValue('startTime', e.target.value)}
                    className='focus:none outline-none'
                    required
                  />
                </div>
              </div>
              <div className='text-indigo-dye flex-grow'>
                <label htmlFor='duration' className='block mb-2'>
                  Duration<span className='text-[#D65846]'>*</span>
                </label>

                <div className='border border-[#ACB9CB] rounded-md flex items-center justify-between relative focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]'>
                  <select
                    {...register('duration')}
                    id='duration'
                    className='w-full py-2 px-4 focus:none outline-none rounded-full'
                    defaultValue=''
                  >
                    <option value='' disabled>Select...</option>
                    <option value='30'>30 min</option>
                    <option value='60'>1 hr</option>
                    <option value='120'>2 hr</option>
                  </select>
                  <div className='absolute right-4 pointer-events-none'>
                    <SelectChevronDown />
                  </div>
                </div>
              </div>
            </div> */}

          <div className='flex items-center gap-3 flex-wrap mb-8'>
            <div className='text-indigo-dye flex-grow'>
              <label htmlFor='date' className='block mb-2'>
                Dates<span className='text-[#D65846]'>*</span>
              </label>
              <div className='border border-[#ACB9CB] focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0] rounded-md flex items-center justify-between py-2 px-4 relative'>
                <input
                  onClick={() => dateRef.current?.showPicker()}
                  ref={dateRef}
                  type='date'
                  name='date'
                  onChange={(e) => setValue('date', e.target.value)}
                  className='w-full focus:none outline-none'
                  required
                />
                <CalendarIcon className='w-6 h-6 absolute right-4 pointer-events-none' />
              </div>
            </div>
            <div className='text-indigo-dye flex-grow'>
              <label htmlFor='startTime' className='block mb-2'>
                Start Time<span className='text-[#D65846]'>*</span>
              </label>

              <div className='border border-[#ACB9CB] rounded-md flex items-center justify-between py-2 px-4 focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]'>
                <input
                  onClick={() => timeRef.current?.showPicker()}
                  ref={timeRef}
                  type='time'
                  id='startTime'
                  onChange={(e) => setValue('startTime', e.target.value)}
                  className='focus:none outline-none'
                  required
                />
              </div>
            </div>
            <div className='text-indigo-dye flex-grow'>
              <label htmlFor='duration' className='block mb-2'>
                Duration<span className='text-[#D65846]'>*</span>
              </label>

              <div className='border border-[#ACB9CB] rounded-md flex items-center justify-between relative focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]'>
                <select
                  {...register('duration')}
                  id='duration'
                  className='w-full py-2 px-4 focus:none outline-none rounded-md'
                  defaultValue=''
                >
                  <option value='' disabled>Select...</option>
                  <option value='30'>30 min</option>
                  <option value='60'>1 hr</option>
                  <option value='120'>2 hr</option>
                </select>
                <div className='absolute right-4 pointer-events-none'>
                  <SelectChevronDown />
                </div>
              </div>
            </div>
          </div>

          {/* format type */}
          <label htmlFor='type' className='block mb-2'>
            Format<span className='text-[#D65846]'>*</span>
          </label>

          <div className='flex items-center mb-8'>
            {formatTypes.map((item, index) => {
              const hasSelected = item.id === selectionId;
              return (
                <div
                  key={index}
                  className={classNames(
                    `${item.borderStyle} flex items-center gap-2 border grow px-4 focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]`,
                    hasSelected ? 'bg-[#355FD0] text-white border-[#355FD0]' : 'border-[#ACB9CB]',
                    item.disabled ? 'opacity-50' : ''
                  )}
                >
                  <div>{hasSelected ? item.whiteIcon : item.icon}</div>
                  <label htmlFor={item.id} className='grow py-3'>
                    {item.title}
                  </label>
                  <input
                    type='radio'
                    id={item.id}
                    className='py-3 opacity-0'
                    onChange={(e) => setSelectionId(e.target.id)}
                    checked={hasSelected}
                    disabled={item.disabled}
                  />
                </div>
              );
            })}
          </div>
          {selectionId === 'video' && (
            <div className='flex items-center justify-between px-12 mb-8 text-indigo-dye text-[15px]'>
              {platformsOptions.map((item, index) => {
                return (
                  <div key={index}>
                    {platforms.includes(item.value) && (
                      <div className='flex items-center gap-2'>
                        <input
                          className='w-5 h-5'
                          type='radio'
                          id={item.id}
                          name={item.name}
                          defaultValue={item.value}
                          onChange={(e) => setValue('platform', e.target.value)}
                          disabled={item.disabled}
                        />
                        <label htmlFor={item.id}>{item.title}</label>
                      </div>
                    )}
                    {!platforms.includes(item.value) && (
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className={classNames(
                            'bg-blue-500 text-white font-bold py-2 px-4 rounded-full',
                            item.disabled ? 'opacity-50' : 'hover:bg-blue-700'
                          )}
                          onClick={() => ssoLogin(item.redirect_url)}
                          disabled={item.disabled}
                        >
                          Connect with {item.title}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {selectionId === 'phone' && (
            <div className='mb-8 text-indigo-dye text-[15px]'>
              <label htmlFor='phoneNumber' className='block mb-2'>
                Phone Number
              </label>
              <input
                type='tel'
                id='phoneNumber'
                {...register('phoneNumber')}
                className='border border-[#ACB9CB] rounded-md grow px-6 py-2 w-full focus:outline focus:outline-1 focus:outline-[#355FD0]'
              />
            </div>
          )}

          {selectionId === 'inPerson' && (
            <div className='mb-8'>
              {/* <div className='text-indigo-dye text-[15px] mb-4'>
                <label htmlFor='address' className='block mb-2'>
                  Address
                </label>
                <input
                  type='text'
                  id='address'
                  {...register('address')}
                  className='border border-[#ACB9CB] rounded-md grow px-6 py-2 w-full focus:outline focus:outline-1 focus:outline-[#355FD0]'
                />
              </div> */}
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={coordinates}
                  zoom={13}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                >
                  <Marker
                    draggable
                    position={coordinates}
                    onDragEnd={(e) => {
                      setCoordinates({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
                    }}
                  />
                </GoogleMap>
              )}
            </div>
          )}
          {selectionId === 'video' && platforms.length > 0 && watch('platform') && (
            <div className='text-indigo-dye flex-grow mb-2'>
              <label htmlFor='integrated_accounts' className='block mb-2'>
                Integrated Account
              </label>

              <div className='border border-[#ACB9CB] rounded-md flex items-center justify-between relative focus-within:outline focus-within:outline-1 focus-within:outline-[#355FD0]'>
                <select
                  {...register('integrated_id')}
                  id='integrated_accounts'
                  className='w-full py-2 px-4 focus:none outline-none rounded-full'
                  defaultValue=''
                  required
                >
                  <option value='' disabled>Select...</option>
                  {integrationItems.map((item: any) => (
                    <option key={item.id} value={item.id}>{item.email}</option>
                  ))}
                </select>
                <div className='absolute right-4 pointer-events-none'>
                  <SelectChevronDown />
                </div>
              </div>
            </div>
          )}
          <div className='mb-6'>
            <label htmlFor='message' className='text-[15px] mb-2'>
              Message
            </label>
            <p className='mb-1 text-[#6F829B]'>
              You may include information about agenda, dresscord, and any additional information.
            </p>
            <div className='mt-2 h-72 mb-12'>
              <textarea rows={4} {...register('message', { required: true })} id='message' hidden />
              <ReactQuill
                onChange={(value) => setValue('message', value)}
                formats={QUILL_FORMATS}
                modules={QUILL_MODULES}
                style={{ height: '100%', padding: '5px 8px !important' }}
                defaultValue={getValues('message')}
              />
            </div>
          </div>

          <div className='mb-6'>
            <label htmlFor='email' className='text-[15px] mb-2'>
              Add hiring team members<span className='text-[#D65846]'>*</span>
            </label>
            <p className='mb-1 text-[#6F829B]'>Enter emails separated by comma.</p>

            <div
              className={classNames(
                'border border-[#ACB9CB] p-2 rounded-md flex items-center gap-3 flex-wrap',
                noTags ? 'border-2 border-blue-700' : ''
              )}
            >
              {tags.map((tag: string) => (
                <div
                  key={tag}
                  className={classNames(
                    'bg-[#ACB9CB] rounded-md flex items-center gap-2 py-1 px-4 text-left justify-start'
                  )}
                >
                  <button type='button' onClick={() => handleRemoveTag(tag)}>
                    <XMarkIcon className='w-4 h-4' />
                  </button>
                  <p>{tag}</p>
                </div>
              ))}
              <input
                id='email'
                type='text'
                className={classNames('focus:none outline-none py-1 px-2 grow')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        <hr />
        <ModalFooterLayout>
          <button
            onClick={handleClose}
            type='button'
            className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]'
            disabled={isSendInterviewScheduleLoading}
          >
            {isSendInterviewScheduleLoading ? (
              <div
                className='animate-spin inline-block w-[20px] h-[20px] border-[2px] border-current border-t-transparent text-white rounded-full'
                role='status'
                aria-label='loading'
              >
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              'Send Interview Request'
            )}
          </button>
        </ModalFooterLayout>
        </form>
      </ModalLayout>
      
      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={handleUnsavedChangesCancel}
        onConfirm={handleUnsavedChangesConfirm}
        isLoading={false}
        isSwitchingEmployee={false}
        contentType="schedule interview"
      />
    </>
  );
}
