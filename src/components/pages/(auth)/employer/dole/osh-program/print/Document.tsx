import React from 'react';

interface DocumentProps {
  children: React.ReactNode;
  isMultiPage?: boolean;
  pageNumber?: number;
}

const Document: React.FC<DocumentProps> = ({ 
  children, 
  isMultiPage = false, 
  pageNumber = 1 
}) => {
  return (
    <div 
      className="bg-white text-black font-sans text-xs leading-tight w-full h-full flex flex-col" 
      style={{ 
        fontFamily: 'Arial, sans-serif',
        width: '210mm',
        height: '297mm',
        boxSizing: 'border-box',
        padding: '32px 40px 32px 60px'
      }}
    >
      {/* Document Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <div className={isMultiPage ? "relative mt-auto pt-8" : "mt-auto pt-8"}>
        <span className="text-xs text-gray-600">Page | {pageNumber}</span>
      </div>
    </div>
  );
};

export default Document;
