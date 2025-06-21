'use client';

import { useEffect } from 'react';

// Sample logo images
const SAMPLE_LOGOS = [
  { path: '/assets/images/logo/yahshua.png' },
];

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  onUpload: (file: File) => void;
  selectedPath?: string;
}

export default function LogoModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  onUpload,
  selectedPath 
}: LogoModalProps) {
  
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
        <h2 className="text-xl font-bold mb-4 text-black">Choose Logo</h2>
        
        {/* Sample logos grid */}
        <div className="overflow-x-auto pb-4 mb-6">
          <div className="flex gap-4 min-w-min">
            {SAMPLE_LOGOS.map((logo) => (
              <div 
                key={logo.path}
                onClick={() => onSelect(logo.path)}
                className={`border-2 rounded-md p-3 cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-[150px] ${
                  selectedPath === logo.path ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-100 rounded flex items-center justify-center">
                  <img 
                    src={logo.path} 
                    alt="Logo template"
                    className="w-full h-full object-contain"
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
                
                // Check file size (2MB limit)
                if (file.size > 2 * 1024 * 1024) {
                  alert('File size exceeds 2MB limit.');
                  return;
                }
                
                onUpload(file);
                onClose();
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
            Upload your own logo image
          </p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</p>
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
            Select Logo
          </button>
        </div>
      </div>
    </div>
  );
} 