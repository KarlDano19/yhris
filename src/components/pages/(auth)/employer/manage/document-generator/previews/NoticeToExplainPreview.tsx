'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';

import { formatDate } from '@/helpers/date';

import { NoticeToExplainFormData } from '@/types/document-generator/documents';


interface NoticeToExplainPreviewProps {
  data: NoticeToExplainFormData;
}


export default function NoticeToExplainPreview({ data }: NoticeToExplainPreviewProps) {
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  // Format dates
  const formattedDate = formatDate(data.dateIssued);
  const formattedIncidentDate = formatDate(data.incidentDate);

  // Get logo image
  let logoSrc = '';
  if (data.logoImage) {
    logoSrc = URL.createObjectURL(data.logoImage);
  } else if (data.sampleLogoPath) {
    logoSrc = data.sampleLogoPath;
  }

  // Border color with fallback to default amber
  const borderColor = data.borderColor || '#FFC107';


  useEffect(() => {
    // Handle signature
    if (data.signature) {
      if (typeof data.signature === 'string') {
        setSignatureUrl(data.signature);
      } else {
        const url = URL.createObjectURL(data.signature);
        setSignatureUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    } else {
      setSignatureUrl(null);
    }
  }, [data]);


  const renderHeaderWithContent = (content: string) => (
    <>
      {/* Logo at the top */}
      <div className="relative w-full h-16 md:h-24">
        {logoSrc && (
          <Image
            src={logoSrc}
            alt="Company Logo"
            fill
            className="object-contain"
            priority
          />
        )}
      </div>
      
      <div className="text-center mb-4">
        <h1 className="text-base font-bold uppercase text-black">NOTICE TO EXPLAIN</h1>
        <p className="text-xs text-gray-600">{data.incidentPlace || '[Place of Incident]'}</p>
      </div>

      {/* Decorative line */}
      <div className="w-full border-b mb-2 sm:mb-4 md:mb-6 certificate-border" style={{ borderColor }}></div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="text-black text-xs" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          <span className="font-bold">Name of Employee :</span> {data.employeeName || '[Employee Name]'}
        </div>
        <div className="text-black text-xs" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          <span className="font-bold">Date Issued:</span> {formattedDate || '[Date Issued]'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
        <div className="text-black text-xs">
          <span className="font-bold">Position :</span> {data.position || '[Position]'}
        </div>
        <div className="text-black text-xs" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          <span className="font-bold">Company Name:</span> {data.companyName || '[Company Name]'}
        </div>
      </div>
      
      <div className="mb-3 text-justify text-black text-xs">
        <p>You are instructed to explain in writing within 5 days upon receipt of this memo why no disciplinary action
        should be taken against you for allegedly violating the company rule(s) described below:</p>
      </div>
      
      <div className="mb-4 italic text-xs text-gray-600">
        <p>(Gitahasan ka nga magsulat sa imong eksplenasyon sulod sa 5 ka adlaw pagkadawat nimo niini nga memo
        kung ngano nga dili ka angay nga patawan ug disciplinary action alang sa imong kuno nga paglapas sa
        mga lagda sa kompanya nga gipahayag sa ubos:)</p>
      </div>
      
      <div className="text-black text-xs">
        <div><span className="font-bold">Date of Incident :</span> {formattedIncidentDate || '[Date of Incident]'}</div>
      </div>
      
      <div className="mb-3 text-black text-xs">
        <div><span className="font-bold">Place of Incident :</span> {data.incidentPlace || '[Place of Incident]'}</div>
      </div>
      
      <div className="mb-4 text-black text-xs">
        <div className="font-bold">Brief background :</div>
        <div className="mt-1" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {content || '[Brief description of the incident...]'}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6 text-black text-xs">
        <div className="text-center relative">
          <div className="font-bold mb-1">Prepared by:</div>
          <div className="mb-1 relative">
            <div className="absolute w-full right-3 -top-5 z-10">
              {signatureUrl && (
                <Image
                  src={signatureUrl}
                  alt="Signature"
                  width={150}
                  height={48}
                  className="object-contain mx-auto"
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </div>
            <div className="relative z-0" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
              {data.preparedBy || '\u00A0'}
            </div>
          </div>
          <div className="border-t font-bold border-black pt-1">HR Representative</div>
        </div>
        
        <div className="text-center">
          <div className="font-bold mb-1">Reviewed by:</div>
          <div className="mb-1" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {data.reviewedBy || '\u00A0'}
          </div>
          <div className="border-t font-bold border-black pt-1">Immediate Supervisor/Manager</div>
        </div>
        
        <div className="text-center">
          <div className="font-bold mb-1">Received by:</div>
          <div className="mb-1" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{data.receivedBy || data.employeeName || '[Name]'}</div>
          <div className="border-t font-bold border-black pt-1">Employee Name</div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="w-full border-b mb-2 sm:mb-4 md:mb-6 certificate-border" style={{ borderColor }}></div>
    </>
  );

  const renderExplanation = () => (
    <div className="mb-3 text-black">
      <div className="font-bold mb-1 text-xs">I. Employee Explanation</div>
      <div className="border border-gray-300 p-2 min-h-[80px] text-xs" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {/* Empty text box - will be filled during backend process */}
      </div>
    </div>
  );

  const renderHearing = () => (
    <div className="mb-3 text-black">
      <div className="font-bold mb-1 text-xs">II. Hearing</div>
      <div className="border border-gray-300 p-2 min-h-[80px] text-xs" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {/* Empty text box - will be filled during backend process */}
      </div>
    </div>
  );

  const renderDecision = () => (
    <div className="mb-6 text-black">
      <div className="font-bold mb-1 text-xs">III. Management Decision</div>
      <div className="border border-gray-300 p-2 min-h-[80px] text-xs" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {/* Empty text box - will be filled during backend process */}
      </div>
    </div>
  );

  const renderSignatures = () => (
    <div className="grid grid-cols-2 gap-6 mt-2 text-black text-xs">
      <div className="text-center">
        <div style={{ height: '30px' }}></div>
        <div className="mb-1" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {data.reviewedBy || '\u00A0'}
        </div>
        <div className="border-t border-black pt-1 mb-1"></div>
        <div className="text-center text-xs font-bold">Immediate Supervisor/Manager Signature</div>
      </div>
      
      <div className="text-center">
        <div style={{ height: '30px' }}></div>
        <div className="text-center mb-1" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{data.employeeName || '[Employee Name]'}</div>
        <div className="border-t border-black pt-1 mb-1"></div>
        <div className="text-center text-xs font-bold">Employee Signature</div>
      </div>
    </div>
  );

  const renderContinuedHeader = () => (
    <>
      {/* Logo at the top */}
      <div className="relative w-full h-16 md:h-20">
        {logoSrc && (
          <Image
            src={logoSrc}
            alt="Company Logo"
            fill
            className="object-contain"
            priority
          />
        )}
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-base font-bold uppercase text-black">NOTICE TO EXPLAIN</h1>
        <p className="text-xs text-gray-600" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{data.incidentPlace || '[Place of Incident]'}</p>
      </div>
    </>
  );

  const renderDocumentContent = () => {
    return (
      <>
        {renderHeaderWithContent(data.briefBackground || '')}
        {renderExplanation()}
        {renderHearing()}
        {renderDecision()}
        {renderSignatures()}
      </>
    );
  };

  return (
    <div className="mt-12 preview-container">
      {/* Title visible in UI but hidden when printing */}
      <h2 className="text-2xl font-bold mb-6 text-black preview-header print-hide">Preview</h2>
      
      <div className="flex flex-col">
        {/* Container with light effect */}
        <div className="relative mb-6">
          {/* Outer glow effects - only visible in preview */}
          <div className="absolute inset-0 -m-6 rounded-3xl opacity-10 blur-xl print-hide" style={{ backgroundColor: borderColor }}></div>
          <div className="absolute inset-0 -m-4 rounded-3xl opacity-20 blur-lg print-hide" style={{ backgroundColor: borderColor }}></div>
          <div className="absolute inset-0 -m-2 rounded-3xl opacity-30 blur-md print-hide" style={{ backgroundColor: borderColor }}></div>
          
          {/* Content with inner glow */}
          <div className="bg-white pt-0 pb-8 px-8 rounded-2xl shadow-md max-w-3xl mx-auto relative transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.01]">
            {/* Inner light effect - hidden when printing */}
            <div className="absolute inset-0 rounded-lg from-white to-amber-50 agreement-glow print-hide"></div>
            
            <div className="relative preview-content text-black" style={{ minHeight: '883px', maxHeight: 'auto' }}>
              {renderDocumentContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 