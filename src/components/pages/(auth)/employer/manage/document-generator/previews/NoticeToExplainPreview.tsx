'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';

import { formatDate } from '@/helpers/date';

import { NoticeToExplainFormData } from '@/types/document-generator/documents';


interface NoticeToExplainPreviewProps {
  data: NoticeToExplainFormData;
}

// Define content types
type ContentType = 'header' | 'headerContinued' | 'explanation' | 'hearing' | 'decision' | 'signatures';

// Define content for each page
interface PageContent {
  type: ContentType;
  content: string;
  title?: string;
  isPartial?: boolean;
  partIndex?: number;
}

// Define a page structure
interface Page {
  contents: PageContent[];
}

// Characters per page (approximate)
const CHARS_PER_PAGE = 1900;
const HEADER_CHARS = 800;
const EXPLANATION_CHARS = 150;
const HEARING_CHARS = 150;
const DECISION_CHARS = 150;
const SIGNATURES_CHARS = 150;

export default function NoticeToExplainPreview({ data }: NoticeToExplainPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<Page[]>([]);
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

  // Split text into chunks that fit on a page
  const splitTextIntoChunks = (text: string, maxCharsPerChunk: number): string[] => {
    if (!text) return [''];
    
    const chunks: string[] = [];
    let remainingText = text;
    
    while (remainingText.length > 0) {
      if (remainingText.length <= maxCharsPerChunk) {
        chunks.push(remainingText);
        break;
      }
      
      // Find a good breaking point (preferably at a paragraph or sentence)
      let breakPoint = maxCharsPerChunk;
      
      // Try to find paragraph break
      const paragraphBreak = remainingText.lastIndexOf('\n\n', maxCharsPerChunk);
      if (paragraphBreak > maxCharsPerChunk / 2) {
        breakPoint = paragraphBreak + 2;
      } else {
        // Try to find sentence break
        const sentenceBreak = remainingText.lastIndexOf('. ', maxCharsPerChunk);
        if (sentenceBreak > maxCharsPerChunk / 2) {
          breakPoint = sentenceBreak + 2;
        } else {
          // Try to find line break
          const lineBreak = remainingText.lastIndexOf('\n', maxCharsPerChunk);
          if (lineBreak > maxCharsPerChunk / 2) {
            breakPoint = lineBreak + 1;
          } else {
            // Fall back to word break
            const wordBreak = remainingText.lastIndexOf(' ', maxCharsPerChunk);
            if (wordBreak > maxCharsPerChunk / 2) {
              breakPoint = wordBreak + 1;
            }
          }
        }
      }
      
      chunks.push(remainingText.substring(0, breakPoint));
      remainingText = remainingText.substring(breakPoint);
    }
    
    return chunks;
  };

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

    // Organize content into pages
    const newPages: Page[] = [];
    
    // Split brief background text into chunks
    const backgroundText = data.briefBackground || '';
    let backgroundChunks: string[] = [];
    
    // Check if we need to split background text or if it's short enough to fit on the first page
    const totalSectionChars = EXPLANATION_CHARS + HEARING_CHARS + DECISION_CHARS + SIGNATURES_CHARS;
    const availableCharsForBackground = CHARS_PER_PAGE - HEADER_CHARS - totalSectionChars;
    
    if (backgroundText.length <= availableCharsForBackground) {
      // Background is short enough to fit with all sections on the first page
      backgroundChunks = [backgroundText];
      
      // Create the single page with all content
      const page: Page = {
        contents: [
          { type: 'header', content: backgroundChunks[0] || '' },
          { type: 'explanation', content: data.employeeExplanation || '' },
          { type: 'hearing', content: data.hearingNotes || '' },
          { type: 'decision', content: data.managementDecision || '' },
          { type: 'signatures', content: '' }
        ]
      };
      
      newPages.push(page);
    } else {
      // Background is too long, need to distribute content across pages
      backgroundChunks = splitTextIntoChunks(backgroundText, CHARS_PER_PAGE);
      
      // First page has header with first part of background
    let currentPage: Page = {
      contents: [
          { type: 'header', content: backgroundChunks[0] || '', isPartial: backgroundChunks.length > 1 }
      ]
    };
    
    // Calculate remaining space on first page
      let remainingChars = CHARS_PER_PAGE - HEADER_CHARS - backgroundChunks[0].length;
      
      // Try to fit explanation box
      if (remainingChars >= EXPLANATION_CHARS) {
        currentPage.contents.push({ type: 'explanation', content: data.employeeExplanation || '' });
        remainingChars -= EXPLANATION_CHARS;
        
        // Try to fit hearing box
        if (remainingChars >= HEARING_CHARS) {
          currentPage.contents.push({ type: 'hearing', content: data.hearingNotes || '' });
          remainingChars -= HEARING_CHARS;
          
          // Try to fit decision box
          if (remainingChars >= DECISION_CHARS) {
            currentPage.contents.push({ type: 'decision', content: data.managementDecision || '' });
            remainingChars -= DECISION_CHARS;
            
            // Try to fit signatures
            if (remainingChars >= SIGNATURES_CHARS) {
              currentPage.contents.push({ type: 'signatures', content: '' });
            }
          }
        }
      }
      
      // Add first page
      newPages.push(currentPage);
      
      // Process remaining background chunks if any
      for (let i = 1; i < backgroundChunks.length; i++) {
        currentPage = {
          contents: [
            { 
              type: 'headerContinued', 
              content: backgroundChunks[i], 
              title: 'Brief background (Continued)',
              isPartial: i < backgroundChunks.length - 1
            }
          ]
        };
        
        // Calculate remaining space on this continuation page
        remainingChars = CHARS_PER_PAGE - 200 - backgroundChunks[i].length; // 200 for continued header
        
        // If this is the last background chunk, try to fit remaining sections
        if (i === backgroundChunks.length - 1) {
          const remainingSections: PageContent[] = [];
          
          // Check which sections haven't been added yet
          const hasExplanation = newPages.some(page => 
            page.contents.some(content => content.type === 'explanation'));
          const hasHearing = newPages.some(page => 
            page.contents.some(content => content.type === 'hearing'));
          const hasDecision = newPages.some(page => 
            page.contents.some(content => content.type === 'decision'));
          const hasSignatures = newPages.some(page => 
            page.contents.some(content => content.type === 'signatures'));
          
          // Add missing sections in order if they fit
          if (!hasExplanation && remainingChars >= EXPLANATION_CHARS) {
            currentPage.contents.push({ type: 'explanation', content: data.employeeExplanation || '' });
            remainingChars -= EXPLANATION_CHARS;
          } else if (!hasExplanation) {
            remainingSections.push({ type: 'explanation' as ContentType, content: data.employeeExplanation || '' });
          }
          
          if (!hasHearing && remainingChars >= HEARING_CHARS) {
            currentPage.contents.push({ type: 'hearing', content: data.hearingNotes || '' });
            remainingChars -= HEARING_CHARS;
          } else if (!hasHearing) {
            remainingSections.push({ type: 'hearing' as ContentType, content: data.hearingNotes || '' });
          }
          
          if (!hasDecision && remainingChars >= DECISION_CHARS) {
            currentPage.contents.push({ type: 'decision', content: data.managementDecision || '' });
            remainingChars -= DECISION_CHARS;
          } else if (!hasDecision) {
            remainingSections.push({ type: 'decision' as ContentType, content: data.managementDecision || '' });
          }
          
          if (!hasSignatures && remainingChars >= SIGNATURES_CHARS) {
            currentPage.contents.push({ type: 'signatures', content: '' });
          } else if (!hasSignatures) {
            remainingSections.push({ type: 'signatures' as ContentType, content: '' });
          }
          
          // Add this page
          newPages.push(currentPage);
          
          // Create additional pages for remaining sections
          if (remainingSections.length > 0) {
            let sectionsPage: Page = { contents: [] };
            let spaceLeft = CHARS_PER_PAGE - 200; // Space for continued header
            
            for (const section of remainingSections) {
              const sectionSize = 
                section.type === 'explanation' ? EXPLANATION_CHARS :
                section.type === 'hearing' ? HEARING_CHARS :
                section.type === 'decision' ? DECISION_CHARS :
                SIGNATURES_CHARS;
              
              if (sectionsPage.contents.length === 0 || spaceLeft >= sectionSize) {
                // First section on page or section fits
                if (sectionsPage.contents.length === 0) {
                  // Add continued header for the first section
                  sectionsPage = { contents: [section] };
                } else {
                  sectionsPage.contents.push(section);
                }
                spaceLeft -= sectionSize;
              } else {
                // Section doesn't fit, create a new page
                newPages.push(sectionsPage);
                sectionsPage = { contents: [section] };
                spaceLeft = CHARS_PER_PAGE - 200 - sectionSize;
              }
            }
            
            // Add the last sections page if it has content
            if (sectionsPage.contents.length > 0) {
              newPages.push(sectionsPage);
            }
      }
    } else {
          // Not the last chunk, just add the page
          newPages.push(currentPage);
        }
      }
      
      // Check if we need to add any missing sections
      const hasExplanation = newPages.some(page => 
        page.contents.some(content => content.type === 'explanation'));
      const hasHearing = newPages.some(page => 
        page.contents.some(content => content.type === 'hearing'));
      const hasDecision = newPages.some(page => 
        page.contents.some(content => content.type === 'decision'));
      const hasSignatures = newPages.some(page => 
        page.contents.some(content => content.type === 'signatures'));
      
      // Create a new page with any missing sections
      const missingSections: PageContent[] = [];
      if (!hasExplanation) missingSections.push({ type: 'explanation', content: data.employeeExplanation || '' });
      if (!hasHearing) missingSections.push({ type: 'hearing', content: data.hearingNotes || '' });
      if (!hasDecision) missingSections.push({ type: 'decision', content: data.managementDecision || '' });
      if (!hasSignatures) missingSections.push({ type: 'signatures', content: '' });
      
      if (missingSections.length > 0) {
        currentPage = { contents: missingSections };
        newPages.push(currentPage);
      }
    }
    
    setPages(newPages);
    setTotalPages(newPages.length);
    setCurrentPage(1);
  }, [data]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

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
      <div className="border border-gray-300 p-2 min-h-[80px] text-xs" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
        {data.employeeExplanation || ''}
      </div>
    </div>
  );

  const renderHearing = () => (
    <div className="mb-3 text-black">
      <div className="font-bold mb-1 text-xs">II. Hearing</div>
      <div className="border border-gray-300 p-2 min-h-[80px] text-xs" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
        {data.hearingNotes || ''}
      </div>
    </div>
  );

  const renderDecision = () => (
    <div className="mb-6 text-black">
      <div className="font-bold mb-1 text-xs">III. Management Decision</div>
      <div className="border border-gray-300 p-2 min-h-[80px] text-xs" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
        {data.managementDecision || ''}
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

  const renderPageContent = () => {
    if (currentPage > totalPages || currentPage < 1 || pages.length === 0) {
      return null;
    }

    const pageIndex = currentPage - 1;
    const page = pages[pageIndex];
    
    return (
      <>
        {/* Render contents for this page */}
        {page.contents.map((content, index) => {
          // Add continued header at the top of pages after the first one
          const needsContinuedHeader = currentPage > 1 && index === 0 && 
            content.type !== 'headerContinued'; // headerContinued already includes the continued header
          return (
            <div key={`content-${content.type}-${index}`}>
              {needsContinuedHeader && renderContinuedHeader()}
              {content.type === 'header' && renderHeaderWithContent(content.content)}
              {content.type === 'headerContinued' && renderContinuedHeader()}
              {content.type === 'explanation' && renderExplanation()}
              {content.type === 'hearing' && renderHearing()}
              {content.type === 'decision' && renderDecision()}
              {content.type === 'signatures' && renderSignatures()}
            </div>
          );
        })}
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
              {renderPageContent()}
            </div>
          </div>
        </div>
        
        {/* Pagination controls - only show if we have multiple pages */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-2 print-hide max-w-3xl mx-auto w-full" style={{ padding: '10px 20px', borderRadius: '8px' }}>
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Previous
            </button>
            
            <div className="text-center">
              <span className="font-medium text-black">Page {currentPage} of {totalPages}</span>
            </div>
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 