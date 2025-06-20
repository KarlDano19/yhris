'use client';

import { useState, useRef, useEffect } from 'react';

import SignatureCanvas from 'react-signature-canvas';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string | File) => void;
}

export default function SignatureModal({ isOpen, onClose, onSave }: SignatureModalProps) {
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw');
  const [uploadedSignature, setUploadedSignature] = useState<File | null>(null);
  const signatureRef = useRef<SignatureCanvas | null>(null);
  
  // Clear signature canvas when opening modal
  useEffect(() => {
    if (isOpen && signatureRef.current) {
      signatureRef.current.clear();
    }
  }, [isOpen]);
  
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
  
  // Fallback method for getting signature data
  const getSignatureDataFallback = () => {
    try {
      if (!signatureRef.current) return null;
      
      // Try direct access to canvas element
      const canvas = (signatureRef.current as any)._canvas as HTMLCanvasElement;
      if (canvas) {
        return canvas.toDataURL('image/png');
      }
      return null;
    } catch (error) {
      console.error('Fallback signature method failed:', error);
      return null;
    }
  };

  const handleSaveSignature = () => {
    try {
      if (signatureMode === 'draw') {
        if (!signatureRef.current || signatureRef.current.isEmpty()) {
          alert('Please draw your signature before saving.');
          return;
        }
        
        // Try primary method
        try {
          const canvas = signatureRef.current.getCanvas();
          const signatureData = canvas.toDataURL('image/png');
          if (signatureData) {
            onSave(signatureData);
            onClose();
            return;
          }
        } catch (e) {
          console.log('Primary signature method failed, trying fallback');
        }
        
        // Try fallback method
        const fallbackData = getSignatureDataFallback();
        if (fallbackData) {
          onSave(fallbackData);
          onClose();
          return;
        }
        
        alert('Could not capture signature. Please try again or use the upload option.');
      } else if (signatureMode === 'upload' && uploadedSignature) {
        onSave(uploadedSignature);
        onClose();
      } else {
        alert('Please upload a signature file before saving.');
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      alert('There was an error saving your signature. Please try again.');
    }
  };
  
  const handleClearSignature = () => {
    if (signatureMode === 'draw' && signatureRef.current) {
      signatureRef.current.clear();
    } else if (signatureMode === 'upload') {
      setUploadedSignature(null);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 2 * 1024 * 1024) { // Max 2MB
        setUploadedSignature(file);
      } else {
        alert('File size exceeds 2MB limit.');
      }
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl z-10 relative">
        <h2 className="text-xl font-bold mb-4 text-black">Signature</h2>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSignatureMode('draw')}
            className={`px-4 py-2 rounded-md ${
              signatureMode === 'draw' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Draw Signature
          </button>
          <button
            onClick={() => setSignatureMode('upload')}
            className={`px-4 py-2 rounded-md ${
              signatureMode === 'upload' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Upload Signature
          </button>
        </div>
        
        {signatureMode === 'draw' ? (
          <div className="border border-gray-300 rounded-md mb-4">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: 'signature-canvas w-full'
              }}
              backgroundColor="white"
            />
          </div>
        ) : (
          <div className="mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              {uploadedSignature ? (
                <div className="flex flex-col items-center w-full">
                  <img 
                    src={URL.createObjectURL(uploadedSignature)} 
                    alt="Signature Preview" 
                    className="max-h-32 object-contain mb-4"
                  />
                  <div className="flex gap-3 mb-2">
                    <p className="text-sm text-green-600">
                      {uploadedSignature.name}
                    </p>
                    <label 
                      className="text-blue-500 text-sm hover:underline focus:outline-none cursor-pointer"
                    >
                      Change
                      <input 
                        type="file"
                        accept="image/png,image/jpeg,image/gif"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-gray-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <label className="text-blue-500 hover:underline focus:outline-none cursor-pointer">
                    Click to upload signature image
                    <input 
                      type="file"
                      accept="image/png,image/jpeg,image/gif"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</p>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={handleClearSignature}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          >
            Clear
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              onMouseDown={handleSaveSignature}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 