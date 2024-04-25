import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ApplicantType, ContextTypes, ScheduleInterviewPropTypes as PropTypes } from '../types';
import { initialActionState } from '../lib/initialActionState';
import CustomToast from '@/components/CustomToast';
import ModalFooterLayout from '../layouts/ModalFooterLayout';
import useTagInput from '../hooks/useTagInput';
import StateContext from '../contexts/StateContext';
import ModalLayout from './ModalLayout';
import classNames from '@/helpers/classNames';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { LocationIcon, WhiteLocationIcon } from '@/svg/LocationIcon';
import { PhoneIcon, WhitePhoneIcon } from '@/svg/PhoneIcon';
import { VideoIcon, WhiteVideoIcon } from '@/svg/VideoIcon';
import SelectChevronDown from '@/svg/SelectChevronDownDummy';
import CalendarIcon from '@/svg/CalendarIcon';

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
const platforms = [
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
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['profileCache']);
  const broadcastChannel = new BroadcastChannel('integration-channel');
  const [integration, setIntegration] = useState<any>([]);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDTAy1T3Yz-3gk_O8dQH7rwvbp8OaLa65A',
  });
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const { state, actionState, setActionState }: ContextTypes = useContext(StateContext) as ContextTypes;
  let applicant: ApplicantType | undefined
  state.forEach(stage => {
    if (stage.id === actionState.stageId) {
      applicant = stage.applicants.find(applicant => applicant.id === actionState.applicantId)
    }
  })
  const { register, setValue, getValues, handleSubmit } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [selectionId, setSelectionId] = useState('video');
  const [input, setInput] = useState('');
  const [noTags, setNoTags] = useState(false);
  const { tags, handleKeyDown, handleRemoveTag } = useTagInput(input, setInput);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState(null);

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
    if (cachedProfile?.state?.data) {
      const jsonStringify = JSON.stringify(cachedProfile?.state?.data);
      const jsonParsed = JSON.parse(jsonStringify);
      setIntegration(jsonParsed.integrated);
    }
  }, []);

  useEffect(() => {
    broadcastChannel.onmessage = (event) => {
      if (event.data.isGranted) {
        setIntegration([...integration, event.data.provider]);
        queryClient.refetchQueries({ queryKey: ["profileCache"] });
      }
    };
    return () => {
      broadcastChannel.close();
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActionState(initialActionState), 400);
  };

  const onSubmit = (data: any) => {
    if (tags.length !== 0) {
      if (selectionId === 'video' && !data.platform) {
        toast.custom(
          () => (
            <CustomToast message={'You need to connect or select for video format before proceeding.'} type='error' />
          ),
          {
            duration: 4000,
          }
        );
        return;
      }
      data.applicantId = applicant?.id;
      data.emails = tags;
      data.selectionId = selectionId;
      data.coordinates = coordinates;
      handleFormSubmit(data, setIsOpen);
    } else {
      setNoTags(true);
    }
  };

  const ssoLogin = (url: string) => {
    const left = (window.innerWidth - 600) / 2;
    const top = (window.innerHeight - 400) / 2;
    const popup = window.open(url, 'popup', `width=600, height=400, left=${left}, top=${top}`);
    const checkOAuthStatus = setInterval(function () {
      if (popup?.closed) {
        clearInterval(checkOAuthStatus);
      }
    }, 1000);
  };

  return (
    <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <div className='p-4'>
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
                >
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
              {platforms.map((item, index) => {
                return (
                  <div key={index}>
                    {integration.includes(item.value) && (
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
                    {!integration.includes(item.value) && (
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

          <div className='mb-6'>
            <label htmlFor='message' className='text-[15px] mb-2'>
              Message
            </label>
            <p className='mb-1 text-[#6F829B]'>
              You may include information about agenda, dresscord, and any additional information.
            </p>
            <textarea
              {...register('message')}
              id='message'
              rows={4}
              placeholder='Enter message...'
              className='border border-[#ACB9CB] rounded-md py-2 px-6 w-full focus:outline focus:outline-1 focus:outline-[#355FD0]'
              required
            ></textarea>
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
  );
}
