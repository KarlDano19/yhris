'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';

import { T_OnboardingItem } from '@/components/pages/(auth)/admin/employer-onboarding/onboarding-tracker/modal/dummyData';

type TutorialVideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: T_OnboardingItem | null;
  onMarkComplete: (itemId: number, isCompleted: boolean) => void;
  isLoading?: boolean;
  openedAt: number | null;
};

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?enablejsapi=1`;
    }

    const loomRegex = /loom\.com\/share\/([a-zA-Z0-9]+)/;
    const loomMatch = url.match(loomRegex);
    if (loomMatch && loomMatch[1]) {
      return `https://www.loom.com/embed/${loomMatch[1]}`;
    }

    return null;
  } catch {
    return null;
  }
}

const UNLOCK_MS = 30_000;

const TutorialVideoModal = ({
  isOpen,
  onClose,
  item,
  onMarkComplete,
  isLoading = false,
  openedAt,
}: TutorialVideoModalProps) => {
  const cancelButtonRef = useRef(null);
  const [hasWatched, setHasWatched] = useState(item?.is_completed ?? false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [timerUnlocked, setTimerUnlocked] = useState(false);

  useEffect(() => {
    setHasWatched(item?.is_completed ?? false);
  }, [item?.id]);

  useEffect(() => {
    setTimerUnlocked(false);
    setSecondsLeft(null);
    if (!isOpen || !openedAt || item?.is_completed) return;

    const elapsed = Date.now() - openedAt;
    if (elapsed >= UNLOCK_MS) {
      setTimerUnlocked(true);
      return;
    }

    const remaining = Math.ceil((UNLOCK_MS - elapsed) / 1000);
    setSecondsLeft(remaining);

    const interval = setInterval(() => {
      const newElapsed = Date.now() - openedAt;
      if (newElapsed >= UNLOCK_MS) {
        setTimerUnlocked(true);
        setSecondsLeft(null);
        clearInterval(interval);
      } else {
        setSecondsLeft(Math.ceil((UNLOCK_MS - newElapsed) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, openedAt, item?.id, item?.is_completed]);

  useEffect(() => {
    if (!isOpen) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange' && data.info === 0) {
          setHasWatched(true);
        }
      } catch {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  if (!item) return null;

  const embedUrl = item.tutorial_url ? getVideoEmbedUrl(item.tutorial_url) : null;

  const renderVideoContent = () => {
    if (!item.tutorial_url || !embedUrl) {
      return (
        <div className='mt-6 text-center'>
          <div className='bg-gray-50 rounded-lg p-8 border border-gray-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 text-gray-400 mx-auto mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
              />
            </svg>
            <h4 className='text-gray-600 font-medium mb-2'>No Tutorial Video</h4>
            <p className='text-gray-500 text-sm'>
              {!item.tutorial_url
                ? 'No tutorial video is available for this task yet.'
                : 'Unable to play video. The URL format may not be supported.'}
            </p>
            {item.tutorial_url && !embedUrl && (
              <div className='mt-4'>
                <a
                  href={item.tutorial_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline text-sm'
                >
                  Open tutorial link
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className='mt-4'>
        <div className='bg-gray-900 rounded-lg overflow-hidden'>
          <div className='relative' style={{ paddingTop: '56.25%' }}>
            <iframe
              className='absolute top-0 left-0 w-full h-full'
              src={embedUrl}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              title={item.title}
            />
          </div>
        </div>
        {item.tutorial_url && (
          <div className='mt-2 text-sm text-gray-600'>
            <a
              href={item.tutorial_url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-30'
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-3xl'>
                  {/* Modal Header */}
                  <div className='flex bg-savoy-blue p-3 items-center'>
                    <h3 className='flex-1 text-white font-semibold truncate'>{item.title}</h3>
                    <XCircleIcon
                      className='w-8 h-8 text-white cursor-pointer flex-shrink-0'
                      onClick={onClose}
                    />
                  </div>

                {/* Modal Body */}
                <div className='m-5'>
                  {/* Task meta info */}
                  {item.is_completed && (
                    <div className='mb-2'>
                      <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>
                        Completed
                      </span>
                    </div>
                  )}

                  {item.description && (
                    <p className='text-sm text-gray-500 mb-3'>{item.description}</p>
                  )}

                  {renderVideoContent()}
                </div>

                {/* Modal Footer */}
                <div className='flex items-center justify-end gap-3 p-4 border-t border-[#355FD0]'>
                  {item.is_completed ? (
                    <span className='rounded-lg py-2 px-6 text-sm font-semibold bg-green-100 text-green-700 border border-green-300 cursor-default'>
                      ✓ Completed
                    </span>
                  ) : (
                    <button
                      type='button'
                      onClick={() => onMarkComplete(item.id, true)}
                      disabled={isLoading || (!hasWatched && !timerUnlocked)}
                      title={!hasWatched && !timerUnlocked ? 'Watch the video or wait for the timer to enable this button' : undefined}
                      className='rounded-lg py-2 px-6 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-[#355FD0] text-white hover:bg-blue-700'
                    >
                      {isLoading ? 'Saving...' : secondsLeft !== null ? `Available in ${secondsLeft}s` : 'Mark as Complete'}
                    </button>
                  )}
                  <button
                    ref={cancelButtonRef}
                    type='button'
                    onClick={onClose}
                    className='border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] text-sm font-semibold hover:bg-[#355FD0]/[.15]'
                  >
                    Close
                  </button>
                </div>
                </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TutorialVideoModal;
