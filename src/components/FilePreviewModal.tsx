'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';

import ModalLayout from '@/components/ModalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl?: string;
  imageUrl?: string; // backward compat — treated as an image
  fileName?: string;
  title?: string;
  isLoadingUrl?: boolean; // parent is still resolving the URL
  onDownload?: () => void;
}

type FileKind = 'image' | 'pdf' | 'other';

function detectKind(url: string, fileName = '', isImageUrl = false): FileKind {
  if (isImageUrl) return 'image';
  // Blob URLs have no extension — fall back to the original file name
  const source = url.startsWith('blob:') ? fileName : url;
  const clean = source.split('?')[0].toLowerCase();
  if (/\.(jpeg|jpg|png|gif|webp|bmp|svg)$/i.test(clean)) return 'image';
  if (/\.pdf$/i.test(clean) || clean.includes('/pdf/')) return 'pdf';
  if (clean.includes('image') || clean.includes('photo') || clean.includes('picture') ||
      clean.includes('signature') || clean.includes('qr_code')) return 'image';
  if (clean.includes('pdf') || clean.includes('document')) return 'pdf';
  return 'other';
}

const FilePreviewModal = ({
  isOpen,
  onClose,
  fileUrl = '',
  imageUrl = '',
  fileName = '',
  title,
  isLoadingUrl = false,
  onDownload,
}: FilePreviewModalProps) => {
  const effectiveUrl = fileUrl || imageUrl;
  const isImageUrl = !fileUrl && !!imageUrl;

  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [fileKind, setFileKind] = useState<FileKind>('other');
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!effectiveUrl) return;
    setFileKind(detectKind(effectiveUrl, fileName, isImageUrl));
    setImgError(false);
  }, [effectiveUrl, isImageUrl]);

  // Preload images to detect load/error
  useEffect(() => {
    if (!isOpen || !effectiveUrl || fileKind !== 'image') return;
    setImgLoading(true);
    const img = new Image();
    img.onload = () => setImgLoading(false);
    img.onerror = () => { setImgLoading(false); setImgError(true); };
    img.src = effectiveUrl;
  }, [isOpen, effectiveUrl, fileKind]);

  const displayTitle = (() => {
    const base = title ?? (fileKind === 'image' ? 'Image Preview' : 'File Preview');
    return fileName ? `${base} - ${fileName}` : base;
  })();

  const isLoading = isLoadingUrl || imgLoading;

  const renderContent = () => {
    if (!effectiveUrl && !isLoadingUrl) {
      if (!isOpen) return null;
      return <div className="text-gray-500">No file available</div>;
    }

    if (isLoading) {
      return (
        <LoadingSpinner
          size="lg"
          color="yellow"
          showText
          text={`Loading ${fileKind === 'image' ? 'image' : 'file'}…`}
        />
      );
    }

    if (imgError) {
      return (
        <div className="flex flex-col items-center text-red-500">
          <DocumentIcon className="h-12 w-12 text-red-400" />
          <p className="mt-2">Failed to load {fileKind === 'image' ? 'image' : 'file'}</p>
        </div>
      );
    }

    if (!effectiveUrl) return null;

    if (fileKind === 'image') {
      return (
        <img
          key={effectiveUrl}
          src={effectiveUrl}
          alt={fileName || title || 'Preview'}
          className="max-h-[60vh] w-full max-w-[95vw] object-contain"
        />
      );
    }

    if (fileKind === 'pdf') {
      return (
        <div className="w-full h-[60vh] flex flex-col">
          <iframe
            src={`${effectiveUrl}#toolbar=1&view=FitH`}
            className="w-full h-full border-0 max-w-[95vw]"
            title={fileName || 'PDF Preview'}
            allowFullScreen
          />
          {!effectiveUrl.startsWith('blob:') && (
            <div className="mt-2 text-center">
              <a
                href={effectiveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-savoy-blue hover:underline text-sm"
              >
                Open PDF in new tab
              </a>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="bg-gray-100 p-8 rounded-md">
          <DocumentIcon className="h-16 w-16 text-gray-400" />
        </div>
        <p className="text-gray-600">This file type cannot be previewed.</p>
        {!effectiveUrl.startsWith('blob:') && (
          <a
            href={effectiveUrl}
            target="_blank"
            rel="noreferrer"
            className="text-savoy-blue hover:underline text-sm"
          >
            Download or open file
          </a>
        )}
      </div>
    );
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      handleClose={onClose}
      title={displayTitle}
      maxWidth="max-w-4xl"
    >
      <div className="p-4 flex justify-center min-h-[400px] items-center">
        {renderContent()}
      </div>

      <div className="border-t border-gray-200 mt-3 flex justify-end gap-3 px-4 py-4">
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </button>
        )}
        <button
          type="button"
          ref={cancelButtonRef}
          onClick={onClose}
          className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </ModalLayout>
  );
};

export default FilePreviewModal;
