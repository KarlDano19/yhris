'use client';

import { useEffect } from 'react';

// Sample letterhead images
const SAMPLE_LETTERHEADS = [
  { path: '/assets/images/letterhead/generic-letterhead.png' },
  // { path: '/assets/images/letterhead/YOWI.png' },
  // { path: '/assets/images/letterhead/TAI.png' },
  // { path: '/assets/images/letterhead/Shell.jpg' },
];

interface LetterheadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  onUpload: (file: File) => void;
  selectedPath?: string;
  showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function LetterheadModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  onUpload,
  selectedPath,
  showToast
}: LetterheadModalProps) {
  
  // Add body class to prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl z-10 relative">
        <h2 className="text-xl font-bold mb-4 text-black">Choose Letterhead</h2>
        
        {/* Sample letterheads grid */}
        <div className="overflow-x-auto pb-4 mb-6">
          <div className="flex gap-4 min-w-min">
            {SAMPLE_LETTERHEADS.map((letterhead) => (
              <div 
                key={letterhead.path}
                onClick={() => onSelect(letterhead.path)}
                className={`border-2 rounded-md p-3 cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-[250px] ${
                  selectedPath === letterhead.path ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="aspect-[1/1.414] w-full overflow-hidden bg-gray-100 rounded">
                  <img 
                    src={letterhead.path} 
                    alt="Letterhead template"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        
        {/* Upload custom option */}
        <div 
          onClick={() => {
            // Create file input and trigger click
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png,image/jpeg,image/gif';
            
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files[0]) {
                const file = target.files[0];
                
                // Check file size (10MB limit)
                if (file.size > 10 * 1024 * 1024) {
                  if (showToast) showToast('File size exceeds 10MB limit.', 'error');
                  return;
                }

                // Check image dimensions for A4 (aspect ratio ~0.707)
                const img = new window.Image();
                img.onload = () => {
                  const aspectRatio = img.width / img.height;
                  // A4 aspect ratio is 210/297 = 0.707, allow small margin
                  if (aspectRatio < 0.69 || aspectRatio > 0.73) {
                    // Use toast for error
                    if (showToast) showToast('Please upload an image with A4 bond paper size (210x297mm).', 'error');
                    return;
                  }
                  onUpload(file);
                  onClose();
                };
                img.onerror = () => {
                  if (showToast) showToast('Failed to read image. Please try another file.', 'error');
                };
                img.src = URL.createObjectURL(file);
              }
            };
            
            input.click();
          }}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 mb-6"
        >
          <div className="text-gray-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <p className="text-blue-500 hover:underline focus:outline-none">
            Upload your own letterhead image
          </p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB. Only A4 bond paper size (210x297mm) is allowed.</p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedPath) {
                onSelect(selectedPath);
                onClose();
              }
            }}
            disabled={!selectedPath}
            className={`px-4 py-2 ${
              selectedPath 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } rounded-md`}
          >
            Select Letterhead
          </button>
        </div>
      </div>
    </div>
  );
} 