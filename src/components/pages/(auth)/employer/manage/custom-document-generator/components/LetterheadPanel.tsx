'use client';

import { useState } from 'react';

import { DEFAULT_MARGIN_MM, MAX_MARGIN_MM, detectLetterheadMargins } from '../functions/detectLetterheadMargins';

import { LETTERHEAD_ACCEPTED_TYPES, validateLetterhead } from '@/helpers/letterhead';

export type T_LetterheadState = {
  file: File | null; // a newly picked image, not saved yet
  url: string | null; // what to show: the new image's object URL or the saved image's URL
  removed: boolean;
  firstPageOnly: boolean;
  topMm: number;
  bottomMm: number;
};

type LetterheadPanelProps = {
  letterhead: T_LetterheadState;
  onChange: (letterhead: T_LetterheadState) => void;
};

const LetterheadPanel = ({ letterhead, onChange }: LetterheadPanelProps) => {
  const [error, setError] = useState('');

  // A4 portrait check as for memo/policy letterheads, then margins read off the artwork
  const handleFile = async (file?: File) => {
    setError('');
    if (!file) return;
    const result = await validateLetterhead(file);
    if (!result.ok) {
      setError(result.message || 'This image cannot be used as a letterhead.');
      return;
    }
    const url = URL.createObjectURL(file);
    const margins = await detectLetterheadMargins(url);
    onChange({ ...letterhead, file, url, removed: false, ...margins });
  };

  const setMargin = (key: 'topMm' | 'bottomMm', value: string) => {
    onChange({ ...letterhead, [key]: Math.min(MAX_MARGIN_MM, Math.max(0, Math.round(Number(value) || 0))) });
  };

  return (
    <div className='space-y-3'>
      <div>
        <h3 className='text-sm font-semibold text-gray-900'>Letterhead</h3>
        <p className='text-xs text-gray-500'>
          Optional A4 portrait image printed behind the document. The margins are set from the artwork; adjust them if
          the text sits too close.
        </p>
      </div>

      {letterhead.url && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={letterhead.url} alt='Letterhead' className='max-h-48 border border-gray-200' />
          <label className='flex items-center gap-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              checked={letterhead.firstPageOnly}
              onChange={(event) => onChange({ ...letterhead, firstPageOnly: event.target.checked })}
            />
            Show on the first page only
          </label>
          <button
            type='button'
            className='text-sm text-red-600 hover:underline'
            onClick={() =>
              onChange({ ...letterhead, file: null, url: null, removed: true, topMm: DEFAULT_MARGIN_MM, bottomMm: DEFAULT_MARGIN_MM })
            }
          >
            Remove letterhead
          </button>
        </>
      )}

      <div className='grid grid-cols-2 gap-2'>
        <label className='text-xs text-gray-600'>
          Top margin (mm)
          <input
            type='number'
            min={0}
            max={MAX_MARGIN_MM}
            className='mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
            value={letterhead.topMm}
            onChange={(event) => setMargin('topMm', event.target.value)}
          />
        </label>
        <label className='text-xs text-gray-600'>
          Bottom margin (mm)
          <input
            type='number'
            min={0}
            max={MAX_MARGIN_MM}
            className='mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
            value={letterhead.bottomMm}
            onChange={(event) => setMargin('bottomMm', event.target.value)}
          />
        </label>
      </div>

      <input
        type='file'
        accept={LETTERHEAD_ACCEPTED_TYPES.join(',')}
        aria-label='Letterhead image'
        className='block w-full text-sm'
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
};

export default LetterheadPanel;
