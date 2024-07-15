import { Dispatch, Fragment, useState, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import classNames from '@/helpers/classNames';

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

  const ssoLogin = () => {
    if (!selectedPlatformId) {
      setManualInputFocus(true);
      return;
    }
    const platformDetail = platforms.find((platform) => platform.id === selectedPlatformId);
    const url = platformDetail?.redirect_url;
    const left = (window.innerWidth - 600) / 2;
    const top = (window.innerHeight - 400) / 2;
    const popup = window.open(url, 'popup', `width=600, height=400, left=${left}, top=${top}`);
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                <form onSubmit={ssoLogin}>
                  <div className='text-xl px-20 text-center'>
                    <div className='flex justify-center py-8 px-2'>Select a platform to integrate</div>
                    <div className={classNames('flex flex-col space-y-4 p-2', manualInputFocus ? 'ring-2 ring-red-500 rounded-md' : '')}>
                      {platforms.map((platform: any) => (
                        <div key={platform.id} className='flex items-center'>
                          <input
                            type='radio'
                            name='platform'
                            value={platform.value}
                            onChange={() => setSelectedPlatformId(platform.id)}
                            checked={selectedPlatformId === platform.id}
                            className='form-radio h-4 w-4 text-blue-600 focus:ring-blue-600'
                            disabled={platform.disabled}
                            required
                          />
                          <label className='ml-2 text-sm text-gray-700'>{platform.title}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='flex justify-center w-full px-4 space-x-8 pt-10 pb-7'>
                    <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                      <button
                        type='button'
                        className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-20 py-2 bg-white text-base leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </button>
                    </span>
                    <span className='flex w-full rounded-md shadow-sm sm:w-auto'>
                      <button
                        type='submit'
                        className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-transparent px-20 py-2 bg-blue-600 text-base leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                        onClick={() => ssoLogin()}
                      >
                        Continue
                      </button>
                    </span>
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
