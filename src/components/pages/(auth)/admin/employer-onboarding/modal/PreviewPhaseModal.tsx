'use client';

import { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';

import { T_ChecklistItem } from './PhaseModal';

function getEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {
    // not a valid URL — return as-is and let the browser handle it
  }
  return url;
}

type PreviewPhaseModalProps = {
  previewItem: T_ChecklistItem | null;
  onClose: () => void;
};

const PreviewPhaseModal = ({ previewItem, onClose }: PreviewPhaseModalProps) => {
  return (
    <Transition.Root show={previewItem !== null} as={Fragment}>
      <Dialog as='div' className='relative z-40' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-150'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/50' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-150'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='relative w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden'>
                {/* Header */}
                <div className='flex items-center gap-4 bg-savoy-blue p-3'>
                  <h3 className='flex-1 text-white font-semibold ml-2 truncate'>
                    {previewItem?.name || 'Checklist Item'}
                  </h3>
                  <XCircleIcon
                    className='w-8 h-8 text-white cursor-pointer flex-shrink-0'
                    onClick={onClose}
                  />
                </div>

                {/* Body */}
                <div className='p-5 space-y-4'>
                  {previewItem?.description && (
                    <p className='text-sm text-gray-700'>{previewItem.description}</p>
                  )}

                  {previewItem?.video_url ? (
                    <div className='aspect-video w-full rounded-lg overflow-hidden bg-black'>
                      <iframe
                        src={getEmbedUrl(previewItem.video_url)}
                        className='w-full h-full'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        title={previewItem.name}
                      />
                    </div>
                  ) : (
                    <p className='text-xs text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-lg'>
                      No video attached to this item.
                    </p>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PreviewPhaseModal;
