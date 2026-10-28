'use client';

import { useEffect, useState } from 'react';

import { Tooltip } from 'react-tooltip';

import {
  LETTERHEAD_MIN_HEIGHT,
  LETTERHEAD_MIN_WIDTH,
  validateLetterhead,
} from '@/helpers/letterhead';

import { XMarkIcon } from '@heroicons/react/24/outline';

interface LetterheadFieldProps {
  // The letterhead already stored on this memo/policy, as a URL. Only present when editing.
  existingUrl?: string | null;
  // Fires with the picked file, or null when the letterhead is cleared.
  onChange: (file: File | null) => void;
  // Fires when the user removes a letterhead that was already saved on the document.
  onRemoveExisting?: () => void;
}

/**
 * Uploads the A4 letterhead a memo/policy is printed on.
 *
 * The image is validated here rather than on submit because both ways it goes wrong — a
 * landscape scan and a low-resolution screenshot — look perfectly fine in the form and only
 * reveal themselves in the printed PDF, by which point the memo has already been sent.
 */
const LetterheadField = ({ existingUrl, onChange, onRemoveExisting }: LetterheadFieldProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl || null);
  const [isObjectUrl, setIsObjectUrl] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setPreviewUrl(existingUrl || null);
    setIsObjectUrl(false);
  }, [existingUrl]);

  // An object URL leaks until it is revoked, and this component can be remounted for every
  // memo the user opens.
  useEffect(() => {
    return () => {
      if (isObjectUrl && previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [isObjectUrl, previewUrl]);

  const clearPreview = () => {
    if (isObjectUrl && previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsObjectUrl(false);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');

    if (!file) {
      clearPreview();
      onChange(null);
      return;
    }

    const result = await validateLetterhead(file);
    if (!result.ok) {
      setError(result.message || 'That letterhead cannot be used.');
      event.target.value = '';
      clearPreview();
      onChange(null);
      return;
    }

    clearPreview();
    setPreviewUrl(URL.createObjectURL(file));
    setIsObjectUrl(true);
    onChange(file);
  };

  const handleRemove = () => {
    const input = document.getElementById('letterhead') as HTMLInputElement | null;
    if (input) input.value = '';

    clearPreview();
    setError('');
    onChange(null);
    if (existingUrl && onRemoveExisting) onRemoveExisting();
  };

  return (
    <div className='mt-4'>
      <div className='flex items-center gap-2'>
        <p className='block text-sm font-medium leading-6 text-gray-900'>Letterhead</p>
        <span className='text-xs text-gray-500'>(optional, A4 portrait)</span>
        <span
          data-tooltip-id='letterhead-tooltip'
          data-tooltip-content={`The whole document prints on top of this image, on every page. The text starts below wherever your header ends and stops above your footer, so there is no need to leave blank space in the image. Minimum ${LETTERHEAD_MIN_WIDTH} x ${LETTERHEAD_MIN_HEIGHT} pixels.`}
          data-tooltip-place='bottom'
          className='flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600'
        >
          ?
        </span>
      </div>

      <div className='mt-2 flex flex-col items-start gap-4 md:flex-row'>
        <div className='flex-1'>
          <input
            id='letterhead'
            type='file'
            accept='image/png,image/jpeg'
            onChange={handleFile}
            className='block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-savoy-blue hover:file:bg-violet-100 sm:text-sm sm:leading-6'
          />
          {error ? (
            <span className='mt-1 block text-sm text-red-500'>{error}</span>
          ) : (
            <span className='mt-1 block text-xs text-gray-500'>
              Leave this empty to print on a plain page.
            </span>
          )}
        </div>

        {previewUrl && (
          <div className='relative'>
            {/* A4 proportions, so the thumbnail shows the same framing the PDF will. */}
            <img
              src={previewUrl}
              alt='Letterhead preview'
              className='h-40 w-[99px] rounded border border-gray-300 object-cover'
            />
            <button
              type='button'
              onClick={handleRemove}
              data-tooltip-id='letterhead-tooltip'
              data-tooltip-content='Remove letterhead'
              data-tooltip-place='bottom'
              className='absolute -right-2 -top-2 rounded-full bg-white p-0.5 shadow ring-1 ring-gray-300 hover:bg-gray-50'
            >
              <XMarkIcon className='h-4 w-4 text-gray-600' />
            </button>
          </div>
        )}
      </div>

      <Tooltip id='letterhead-tooltip' />
    </div>
  );
};

export default LetterheadField;
