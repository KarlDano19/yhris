'use client';

import { useEffect, useState } from 'react';

import ModalLayout from '@/components/ModalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import SignatureZoneEditor from '../components/SignatureZoneEditor';

import {
  DEFAULT_SIGNATURE_PLACEMENT,
  SignaturePlacement,
  parseSignaturePlacement,
  serializeSignaturePlacement,
} from '@/helpers/signaturePlacement';

interface MemoPreviewModalProps {
  isOpen: boolean;
  handleClose: () => void;
  previewUrl: string;
  isLoading: boolean;
  error?: string;
  signatureUrl?: string;
  name?: string;
  position?: string;
  signaturePlacement?: string | null;
  onSignaturePlacementSave?: (placement: string) => void;
}

/**
 * Shows the memo/policy exactly as recipients will receive it.
 *
 * The frame holds the real backend-rendered PDF rather than a React approximation, which is
 * what makes the preview trustworthy — and it is also where the signature gets positioned,
 * since the PDF's fixed page is the only surface where a position means the same thing on a
 * phone and on a desktop.
 */
const MemoPreviewModal = ({
  isOpen,
  handleClose,
  previewUrl,
  isLoading,
  error,
  signatureUrl,
  name,
  position,
  signaturePlacement,
  onSignaturePlacementSave,
}: MemoPreviewModalProps) => {
  const [isPositioning, setIsPositioning] = useState(false);
  const [draft, setDraft] = useState<SignaturePlacement | null>(null);

  const canPosition = Boolean(signatureUrl && onSignaturePlacementSave);

  // Reopening the modal must always start from what is actually saved, never from a draft
  // the user abandoned last time.
  useEffect(() => {
    if (!isOpen) {
      setIsPositioning(false);
      setDraft(null);
    }
  }, [isOpen]);

  const handleStartPositioning = () => {
    setDraft(parseSignaturePlacement(signaturePlacement) ?? DEFAULT_SIGNATURE_PLACEMENT);
    setIsPositioning(true);
  };

  const handleApply = () => {
    if (draft && onSignaturePlacementSave) {
      onSignaturePlacementSave(serializeSignaturePlacement(draft));
    }
    setIsPositioning(false);
  };

  const handleReset = () => {
    // An empty placement is how "put it back in normal flow above the name" is expressed —
    // the same state every memo written before positioning existed is already in.
    onSignaturePlacementSave?.('');
    setIsPositioning(false);
  };

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title='Preview Memo/Policy' maxWidth='max-w-5xl'>
      <div className='p-4'>
        {isPositioning && signatureUrl ? (
          <div>
            <p className='mb-3 text-sm text-gray-600'>
              Position the signature within the signing area at the end of the document. This is
              the same area the PDF uses, so what you set here is what recipients see on any
              device.
            </p>

            <SignatureZoneEditor
              signatureUrl={signatureUrl}
              name={name}
              position={position}
              placement={draft}
              onChange={setDraft}
            />

            <div className='mt-4 flex flex-wrap justify-end gap-2'>
              <button
                type='button'
                onClick={handleReset}
                className='rounded-md px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              >
                Reset to default
              </button>
              <button
                type='button'
                onClick={() => setIsPositioning(false)}
                className='rounded-md px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleApply}
                className='rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90'
              >
                Apply position
              </button>
            </div>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className='flex h-[70vh] items-center justify-center'>
                <LoadingSpinner size='lg' showText text='Generating preview...' />
              </div>
            ) : error ? (
              <div className='flex h-[70vh] items-center justify-center px-6 text-center'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            ) : (
              <iframe
                src={previewUrl}
                title='Memo/Policy preview'
                className='h-[70vh] w-full rounded border border-gray-200'
              />
            )}

            <div className='mt-4 flex flex-wrap items-center justify-between gap-2'>
              {canPosition ? (
                <button
                  type='button'
                  onClick={handleStartPositioning}
                  disabled={isLoading}
                  className='rounded-md px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50'
                >
                  Position signature
                </button>
              ) : (
                <span />
              )}

              <button
                type='button'
                onClick={handleClose}
                className='rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalLayout>
  );
};

export default MemoPreviewModal;
