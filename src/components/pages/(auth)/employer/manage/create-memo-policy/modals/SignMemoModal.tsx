'use client';

import { Dispatch, useEffect, useRef, useState } from 'react';

import SignatureCanvas from 'react-signature-canvas';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import ModalLayout from '@/components/ModalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import useSignDocument from '../hooks/useSignDocument';

const SignMemoModal = ({
  isOpen,
  setIsOpen,
  signatoryId,
  memoTitle,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  signatoryId: number | null;
  memoTitle?: string;
  refetch?: () => void;
}) => {
  const canvasRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string>('');
  const { mutateAsync: signDocument, isLoading } = useSignDocument();

  // Reset both inputs whenever the modal opens for a fresh signatory.
  useEffect(() => {
    if (isOpen) {
      setUploadedFile(null);
      setUploadedPreview('');
      canvasRef.current?.clear();
    }
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const clearSignature = () => canvasRef.current?.clear();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.custom(() => <CustomToast message='Please choose an image file.' type='error' />, { duration: 4000 });
      return;
    }
    setUploadedFile(file);
    setUploadedPreview(URL.createObjectURL(file));
  };

  const removeUploaded = () => {
    setUploadedFile(null);
    setUploadedPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSign = async () => {
    if (!signatoryId) return;

    // Prefer an uploaded file; otherwise use the drawn canvas.
    let signatureBlob: Blob;
    if (uploadedFile) {
      signatureBlob = uploadedFile;
    } else if (canvasRef.current && !canvasRef.current.isEmpty()) {
      const dataUrl = canvasRef.current.toDataURL();
      signatureBlob = await fetch(dataUrl).then((res) => res.blob());
    } else {
      toast.custom(() => <CustomToast message='Draw or upload your signature first.' type='error' />, {
        duration: 4000,
      });
      return;
    }

    try {
      await signDocument({ signatoryId, signature: signatureBlob });
      toast.custom(() => <CustomToast message='Signed successfully.' type='success' />, { duration: 4000 });
      setIsOpen(false);
      refetch?.();
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to sign.'} type='error' />, {
        duration: 5000,
      });
    }
  };

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title='Sign Memo' maxWidth='max-w-xl'>
      <div className='p-6'>
        {memoTitle && (
          <p className='mb-4 text-sm text-gray-600'>
            You are signing: <span className='font-semibold text-gray-900'>{memoTitle}</span>
          </p>
        )}

        {uploadedFile ? (
          // Uploaded signature — show a preview and let the user remove it to draw instead.
          <div>
            <p className='mb-2 text-sm font-medium text-gray-900'>Uploaded signature</p>
            <div className='flex items-center justify-center rounded-md border border-gray-300 bg-white p-4'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uploadedPreview} alt='Signature preview' className='max-h-40 object-contain' />
            </div>
            <button
              type='button'
              onClick={removeUploaded}
              className='mt-2 text-sm font-semibold text-red-600 hover:text-red-700'
            >
              Remove &amp; draw instead
            </button>
          </div>
        ) : (
          // Draw pad + upload option.
          <div>
            <div className='mb-2 flex items-center justify-between'>
              <p className='text-sm font-medium text-gray-900'>Draw your signature</p>
              <button
                type='button'
                onClick={clearSignature}
                className='text-sm font-semibold text-gray-600 hover:text-gray-900'
              >
                Clear
              </button>
            </div>
            <div className='rounded-md border border-gray-300 bg-white'>
              <SignatureCanvas
                ref={canvasRef}
                penColor='black'
                canvasProps={{ className: 'w-full h-48 rounded-md' }}
              />
            </div>

            <div className='mt-4 flex items-center gap-3'>
              <span className='text-sm text-gray-400'>or</span>
              <label className='cursor-pointer rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-savoy-blue hover:bg-gray-200'>
                Choose File
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='hidden'
                />
              </label>
              <span className='text-xs text-gray-400'>Use a PNG with a transparent background.</span>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4'>
        <button
          type='button'
          onClick={handleClose}
          className='rounded-md border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700'
        >
          Close
        </button>
        <button
          type='button'
          onClick={handleSign}
          disabled={isLoading}
          className='flex items-center gap-2 rounded-md bg-savoy-blue px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50'
        >
          {isLoading && <LoadingSpinner size='xs' color='white' />}
          Sign
        </button>
      </div>
    </ModalLayout>
  );
};

export default SignMemoModal;
