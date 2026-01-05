'use client';

import { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  headerContent,
  footerContent,
}: ModalProps) => {
  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div
          className={`relative bg-white rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden shadow-2xl flex flex-col`}
        >
        {/* Header */}
        {(title || showCloseButton || headerContent) && (
          <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3 flex-1">
              {headerContent}
              {title && (
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>

        {/* Footer */}
        {footerContent && (
          <div className="flex-shrink-0 border-t border-gray-100 p-5">
            {footerContent}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

