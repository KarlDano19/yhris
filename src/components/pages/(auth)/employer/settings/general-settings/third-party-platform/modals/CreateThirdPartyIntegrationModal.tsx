import { Dispatch, Fragment, useState, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import classNames from '@/helpers/classNames';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function CreateThirdPartyIntegrationModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
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
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [manualInputFocus, setManualInputFocus] = useState<boolean>(false);

  const ssoLogin = (event: any) => {
    event.preventDefault();
    if (!selectedPlatformId) {
      setManualInputFocus(true);
      return;
    }
    const platformDetail = platforms.find((platform) => platform.id === selectedPlatformId);
    const url = platformDetail?.redirect_url;
    const left = (window.innerWidth - 900) / 2;
    const top = (window.innerHeight - 700) / 2;
    const popup = window.open(url, 'popup', `width=900, height=900, left=${left}, top=${top}`);
    setIsOpen(false);
    const checkOAuthStatus = setInterval(function () {
      if (popup?.closed) {
        clearInterval(checkOAuthStatus);
      }
    }, 1000);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className='relative mx-4 w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg'>
                <div className='flex items-center gap-3 bg-savoy-blue px-4 py-3'>
                  <h3 className='flex-1 text-base font-semibold text-white'>Create Third Party Integration</h3>
                  <XCircleIcon
                    className='h-6 w-6 cursor-pointer text-white'
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <form onSubmit={ssoLogin}>
                  <div className='px-6 py-6'>
                    <p className='text-center text-lg font-semibold text-gray-900'>Select a platform to integrate</p>
                    <div
                      className={classNames(
                        'mt-6 flex flex-col space-y-4 rounded-xl border border-gray-200 p-4',
                        manualInputFocus ? 'ring-2 ring-red-500' : ''
                      )}
                    >
                      {platforms.map((platform: any) => (
                        <label key={platform.id} className='flex items-center gap-3 text-sm text-gray-800'>
                          <input
                            id={platform.id}
                            type='radio'
                            name='platform'
                            value={platform.value}
                            onChange={() => setSelectedPlatformId(platform.id)}
                            checked={selectedPlatformId === platform.id}
                            className='h-4 w-4 text-savoy-blue focus:ring-savoy-blue'
                            disabled={platform.disabled}
                            required
                          />
                          <span className={classNames(platform.disabled ? 'text-gray-400' : 'text-gray-800')}>
                            {platform.title}
                            {platform.disabled && <span className='ml-1 text-xs'>(Coming soon)</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className='flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end'>
                    <button
                      type='button'
                      className='inline-flex w-full justify-center rounded-md border border-savoy-blue px-4 py-2 text-sm font-semibold text-savoy-blue shadow-sm hover:bg-gray-50 sm:w-auto'
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 sm:w-auto'
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
