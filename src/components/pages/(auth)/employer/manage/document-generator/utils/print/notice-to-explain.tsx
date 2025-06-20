import { toast } from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import { saveAs } from 'file-saver';

import { NoticeToExplainFormData } from '@/types/document-generator/documents';
import { formatDate } from '../date';

interface PrintOptions {
  elementId: string;
  title: string;
  fileName?: string;
}

// Characters per page (approximate) - Match the same constants as in preview
const CHARS_PER_PAGE = 1500;
const HEADER_CHARS = 800;
const EXPLANATION_CHARS = 150;
const HEARING_CHARS = 150;
const DECISION_CHARS = 150;
const SIGNATURES_CHARS = 150;

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

/**
 * Print the Notice to Explain document
 */
export const printNoticeToExplain = (data: NoticeToExplainFormData, options: PrintOptions, saveOnly: boolean = false): Promise<Blob | null> => {
  const { title, fileName = 'notice-to-explain' } = options;
  
  // Check required fields
  if (!data.employeeName || !data.date) {
    toast.custom(() => <CustomToast message="Please fill in all required fields marked with *" type="error" />);
    return Promise.resolve(null);
  }
  
  const printToastId = toast.custom(() => <CustomToast message="Preparing notice to explain..." type="info" />);
  
  return new Promise((resolve, reject) => {
    try {
      // Create a hidden iframe for printing or saving
      const frame = document.createElement('iframe');
      frame.style.position = 'fixed';
      frame.style.right = '0';
      frame.style.bottom = '0';
      frame.style.width = '210mm'; // A4 width
      frame.style.height = '297mm'; // A4 height
      frame.style.border = '0';
      frame.style.opacity = '0';
      frame.style.visibility = 'hidden';
      frame.style.overflow = 'hidden';
      
      document.body.appendChild(frame);
      
      // Get the document for the iframe
      const frameDoc = frame.contentWindow?.document;
      if (!frameDoc) {
        document.body.removeChild(frame);
        toast.custom(() => <CustomToast message="Could not create document frame" type="error" />);
        reject(new Error("Could not create document frame"));
        return;
      }
      
      // Generate HTML content with pagination that matches the preview
      const htmlContent = generateNoticeToExplainHTML(data);
      
      // Write HTML content to the iframe
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();
      
      // Wait for the iframe to load
      frame.onload = () => {
        try {
          // Force iframe to be visible temporarily for proper rendering
          frame.style.width = '100%';
          frame.style.height = '100%';
          frame.style.visibility = 'visible';
          frame.style.position = 'fixed';
          frame.style.top = '0';
          frame.style.left = '0';
          frame.style.zIndex = '-1000'; // Behind everything else
          
          setTimeout(() => {
            if (saveOnly) {
              // Create an HTML blob for direct downloading
              try {
                // Create a blob of the HTML content
                const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
                
                // Save the file for automatic download
                saveAs(htmlBlob, `${fileName}.html`);
                
                toast.custom(() => <CustomToast message="Document created successfully" type="success" />, {
                  duration: 3000,
                });
                
                // Resolve with the blob for further processing
                resolve(htmlBlob);
                
                // Clean up
                setTimeout(() => {
                  // Hide the iframe again
                  frame.style.width = '0';
                  frame.style.height = '0';
                  frame.style.visibility = 'hidden';
                  
                  // Revoke any object URLs we created
                  if (data.signature instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(data.signature));
                  }
                  if (data.logoImage instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(data.logoImage));
                  }
                  
                  // Remove the iframe
                  document.body.removeChild(frame);
                  
                  toast.custom(() => <CustomToast message="Your document was saved successfully and is ready for use" type="success" />);
                }, 500);
              } catch (error) {
                console.error('Save error:', error);
                document.body.removeChild(frame);
                toast.custom(() => <CustomToast message="There was an error saving. Please try again" type="error" />);
                reject(error);
              }
            } else {
              toast.custom(() => <CustomToast message="Print dialog opening..." type="info" />);
              
              // Print the document
              frame.contentWindow?.focus();
              frame.contentWindow?.print();
              
              // Clean up
              setTimeout(() => {
                // Hide the iframe again
                frame.style.width = '0';
                frame.style.height = '0';
                frame.style.visibility = 'hidden';
                
                // Revoke any object URLs we created
                if (data.signature instanceof File) {
                  URL.revokeObjectURL(URL.createObjectURL(data.signature));
                }
                if (data.logoImage instanceof File) {
                  URL.revokeObjectURL(URL.createObjectURL(data.logoImage));
                }
                
                // Remove the iframe
                document.body.removeChild(frame);
                
                toast.custom(() => <CustomToast message="Your document was saved successfully and is ready for use" type="success" />);
                resolve(null); // Resolve with null for print-only case
              }, 1000);
            }
          }, 500);
        } catch (error) {
          console.error('Print/save error:', error);
          document.body.removeChild(frame);
          toast.custom(() => <CustomToast message="There was an error processing the document. Please try again" type="error" />);
          reject(error);
        }
      };
    } catch (error) {
      console.error('Print/save setup error:', error);
      toast.custom(() => <CustomToast message="There was an error setting up the document. Please try again" type="error" />);
      reject(error);
    }
  });
};

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

export const generateNoticeToExplainHTML = (data: NoticeToExplainFormData): string => {
  // Format dates
  const formattedDate = formatDate(data.date);
  const formattedIncidentDate = formatDate(data.incidentDate);
  
  // Get logo image
  let logoSrc = '';
  if (data.logoImage) {
    logoSrc = URL.createObjectURL(data.logoImage);
  } else if (data.sampleLogoPath) {
    logoSrc = data.sampleLogoPath;
  }

  // Get signature image
  let signatureSrc = '';
  if (typeof data.signature === 'string') {
    signatureSrc = data.signature;
  } else if (data.signature instanceof File) {
    signatureSrc = URL.createObjectURL(data.signature);
  }

  // Border color with fallback to default amber
  const borderColor = data.borderColor || '#FFC107';

  // Organize content into pages exactly like the preview component
  const pages: Page[] = [];
  
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
    
    pages.push(page);
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
    pages.push(currentPage);
    
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
        const hasExplanation = pages.some(page => 
          page.contents.some(content => content.type === 'explanation'));
        const hasHearing = pages.some(page => 
          page.contents.some(content => content.type === 'hearing'));
        const hasDecision = pages.some(page => 
          page.contents.some(content => content.type === 'decision'));
        const hasSignatures = pages.some(page => 
          page.contents.some(content => content.type === 'signatures'));
        
        // Add missing sections in order if they fit
        if (!hasExplanation && remainingChars >= EXPLANATION_CHARS) {
          currentPage.contents.push({ type: 'explanation', content: data.employeeExplanation || '' });
          remainingChars -= EXPLANATION_CHARS;
        } else if (!hasExplanation) {
          remainingSections.push({ type: 'explanation', content: data.employeeExplanation || '' });
        }
        
        if (!hasHearing && remainingChars >= HEARING_CHARS) {
          currentPage.contents.push({ type: 'hearing', content: data.hearingNotes || '' });
          remainingChars -= HEARING_CHARS;
        } else if (!hasHearing) {
          remainingSections.push({ type: 'hearing', content: data.hearingNotes || '' });
        }
        
        if (!hasDecision && remainingChars >= DECISION_CHARS) {
          currentPage.contents.push({ type: 'decision', content: data.managementDecision || '' });
          remainingChars -= DECISION_CHARS;
        } else if (!hasDecision) {
          remainingSections.push({ type: 'decision', content: data.managementDecision || '' });
        }
        
        if (!hasSignatures && remainingChars >= SIGNATURES_CHARS) {
          currentPage.contents.push({ type: 'signatures', content: '' });
        } else if (!hasSignatures) {
          remainingSections.push({ type: 'signatures', content: '' });
        }
        
        // Add this page
        pages.push(currentPage);
        
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
              pages.push(sectionsPage);
              sectionsPage = { contents: [section] };
              spaceLeft = CHARS_PER_PAGE - 200 - sectionSize;
            }
          }
          
          // Add the last sections page if it has content
          if (sectionsPage.contents.length > 0) {
            pages.push(sectionsPage);
          }
        }
      } else {
        // Not the last chunk, just add the page
        pages.push(currentPage);
      }
    }
    
    // Check if we need to add any missing sections
    const hasExplanation = pages.some(page => 
      page.contents.some(content => content.type === 'explanation'));
    const hasHearing = pages.some(page => 
      page.contents.some(content => content.type === 'hearing'));
    const hasDecision = pages.some(page => 
      page.contents.some(content => content.type === 'decision'));
    const hasSignatures = pages.some(page => 
      page.contents.some(content => content.type === 'signatures'));
    
    // Create a new page with any missing sections
    const missingSections: PageContent[] = [];
    if (!hasExplanation) missingSections.push({ type: 'explanation', content: data.employeeExplanation || '' });
    if (!hasHearing) missingSections.push({ type: 'hearing', content: data.hearingNotes || '' });
    if (!hasDecision) missingSections.push({ type: 'decision', content: data.managementDecision || '' });
    if (!hasSignatures) missingSections.push({ type: 'signatures', content: '' });
    
    if (missingSections.length > 0) {
      currentPage = { contents: missingSections };
      pages.push(currentPage);
    }
  }

  // Generate HTML for all pages
  const pagesHTML = pages
    .filter(page => page.contents.length > 0) // Filter out empty pages
    .map((page, index) => {
      let pageContent = '';
      
      // Render contents for this page
      page.contents.forEach((content, contentIndex) => {
        // Add continued header at the top of pages after the first one
        const needsContinuedHeader = index > 0 && contentIndex === 0 && 
          content.type !== 'headerContinued'; // headerContinued already includes the continued header
        
        if (needsContinuedHeader) {
          pageContent += renderContinuedHeader(data, logoSrc, borderColor);
        }
        
        if (content.type === 'header') {
          pageContent += renderHeaderWithContent(data, formattedDate, formattedIncidentDate, logoSrc, borderColor, content.content);
        } else if (content.type === 'headerContinued') {
          pageContent += renderContinuedHeader(data, logoSrc, borderColor);
        } else if (content.type === 'explanation') {
          pageContent += renderExplanation(content.content);
        } else if (content.type === 'hearing') {
          pageContent += renderHearing(content.content);
        } else if (content.type === 'decision') {
          pageContent += renderDecision(content.content);
        } else if (content.type === 'signatures') {
          pageContent += renderSignatures(data, signatureSrc);
        }
      });
      
      // Only create page if it has content
      if (pageContent.trim() === '') {
        return '';
      }
      
      return `
        <div class="page" id="page-${index + 1}">
          ${pageContent}
        </div>
      `;
    }).filter(html => html !== '').join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notice to Explain</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        
        body {
          font-family: 'Roboto', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: white;
        }
        
        @page {
          size: A4;
          margin: 1cm;
        }
        
        .page {
          box-sizing: border-box;
          width: 100%;
          padding: 0;
          position: relative;
          page-break-after: always;
        }
        
        .page:last-child {
          page-break-after: avoid;
        }
        
        .logo-container {
          text-align: center;
          margin-bottom: 1rem;
          min-height: 4rem;
        }
        
        .logo-container img {
          max-width: 150px;
          max-height: 4rem;
          object-fit: contain;
        }
        
        .document-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin: 4px 0 2px;
          text-transform: uppercase;
          color: #000;
        }
        
        .document-subtitle {
          text-align: center;
          font-size: 12px;
          margin-bottom: 10px;
          color: #666;
        }
        
        .decorative-line {
          border-bottom: 1px solid;
          margin-bottom: 12px;
          width: 100%;
        }
        
        .certificate-border {
          border-width: 1px;
          border-style: solid;
        }
        
        .agreement-glow {
          background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,193,7,0.1) 100%);
          opacity: 0.5;
        }
        
        .employee-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 10px;
          color: #000;
          font-size: 12px;
        }
        
        .detail-group {
          margin-bottom: 8px;
          color: #000;
        }
        
        .detail-label {
          font-weight: bold;
          color: #000;
        }
        
        .main-text {
          margin: 10px 0;
          text-align: justify;
          color: #000;
          font-size: 12px;
        }
        
        .incident-details {
          margin: 10px 0 0 0;
          color: #000;
          font-size: 12px;
        }
        
        .background-section {
          margin: 10px 0;
          color: #000;
          font-size: 12px;
        }
        
        .signatures-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 25px;
          margin-bottom: 20px;
          color: #000;
          font-size: 12px;
        }
        
        .signatures-footer {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-top: 30px;
          color: #000;
          font-size: 12px;
        }
        
        .signature-block {
          text-align: center;
          color: #000;
        }
        
        .signature-line {
          border-top: 1px solid #000;
          margin-bottom: 5px;
        }
        
        .signature-image-container {
          height: 50px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin-bottom: 10px;
        }
        
        .signature-image {
          max-width: 150px;
          max-height: 48px;
          object-fit: contain;
        }
        
        .section-title {
          font-weight: bold;
          margin-top: 15px;
          margin-bottom: 5px;
          font-size: 12px;
          color: #000;
        }
        
        .content-box {
          border: 1px solid #ccc;
          min-height: 80px;
          padding: 8px;
          margin-bottom: 25px;
          color: #000;
          font-size: 12px;
          white-space: normal;
          word-wrap: break-word;
        }
        
        .tagalog-translation {
          font-style: italic;
          margin: 10px 0;
          font-size: 12px;
          color: #666;
        }
        
        .text-center {
          text-align: center;
        }
        
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          
          .page {
            margin: 0;
            border: none;
          }
        }
      </style>
    </head>
    <body>
      ${pagesHTML}
      <script>
        // Force print after content is fully loaded
        window.onload = function() {
          // Small delay to ensure all resources are loaded
          setTimeout(function() {
            // Make sure all images are loaded before printing
            const images = document.querySelectorAll('img');
            let loadedImages = 0;
            
            if (images.length === 0) {
              // No images to load, proceed with print
              console.log('No images to load, ready to print');
            } else {
              // Wait for all images to load
              images.forEach(img => {
                if (img.complete) {
                  loadedImages++;
                  if (loadedImages === images.length) {
                    console.log('All images loaded, ready to print');
                  }
                } else {
                  img.onload = function() {
                    loadedImages++;
                    if (loadedImages === images.length) {
                      console.log('All images loaded, ready to print');
                    }
                  };
                  
                  // Handle image load errors
                  img.onerror = function() {
                    console.error('Error loading image:', img.src);
                    loadedImages++;
                    if (loadedImages === images.length) {
                      console.log('All images attempted to load, ready to print');
                    }
                  };
                }
              });
            }
          }, 300);
        };
      </script>
    </body>
    </html>
  `;
};

// Helper functions to render different sections
const renderHeaderWithContent = (
  data: NoticeToExplainFormData, 
  formattedDate: string, 
  formattedIncidentDate: string,
  logoSrc: string,
  borderColor: string,
  content: string
) => {
  return `
    <div class="logo-container">
      ${logoSrc ? `
        <img src="${logoSrc}" alt="Company Logo">
      ` : `<div style="height: 4rem;"></div>`}
    </div>
    
    <div class="document-title">NOTICE TO EXPLAIN</div>
    <div class="document-subtitle">${data.place || '[Place]'}</div>
    
    <div class="decorative-line" style="border-color: ${borderColor}"></div>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #000; margin-bottom: 10px;">
      <tr>
        <td style="width: 50%; padding: 0;">
          <span class="detail-label">Name of Employee :</span> ${data.employeeName || '[Employee Name]'}
        </td>
        <td style="width: 50%; padding: 0;">
          <span class="detail-label">Date:</span> ${formattedDate || '[Date]'}
        </td>
      </tr>
      <tr>
        <td style="width: 50%; padding: 0;">
          <span class="detail-label">Position :</span> ${data.position || '[Position]'}
        </td>
        <td style="width: 50%; padding: 0;">
          <span class="detail-label">Place:</span> ${data.place || '[Place]'}
        </td>
      </tr>
    </table>
    
    <div class="main-text">
      You are instructed to explain in writing within 5 days upon receipt of this memo why no disciplinary action
      should be taken against you for allegedly violating the company rule(s) described below:
    </div>
    
    <div class="tagalog-translation">
      (Gitahasan ka nga magsulat sa imong eksplenasyon sulod sa 5 ka adlaw pagkadawat nimo niini nga memo
      kung ngano nga dili ka angay nga patawan ug disciplinary action alang sa imong kuno nga paglapas sa
      mga lagda sa kompanya nga gipahayag sa ubos:)
    </div>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #000; margin-bottom: 10px;">
      <tr>
        <td style="padding: 0;">
          <span class="detail-label">Date of Incident :</span> ${formattedIncidentDate || '[Date of Incident]'}
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <span class="detail-label">Place of Incident :</span> ${data.incidentPlace || '[Place of Incident]'}
        </td>
      </tr>
    </table>
    
    <div class="background-section">
      <div class="detail-label">Brief background :</div>
      <div>${content || '[Brief description of the incident...]'}</div>
    </div>
    
    <div class="signatures-grid">
      <div class="signature-block">
        <div class="detail-label">Prepared by:</div>
        <div>${data.preparedBy || '[Name]'}</div>
        <div class="signature-line"></div>
        <div style="font-weight: bold;">HR Representative</div>
      </div>
      
      <div class="signature-block">
        <div class="detail-label">Reviewed by:</div>
        <div>${data.reviewedBy || '[Name]'}</div>
        <div class="signature-line"></div>
        <div style="font-weight: bold;">Immediate Supervisor/Manager</div>
      </div>
      
      <div class="signature-block">
        <div class="detail-label">Received by:</div>
        <div>${data.receivedBy || data.employeeName || '[Name]'}</div>
        <div class="signature-line"></div>
        <div style="font-weight: bold;">Employee Name</div>
      </div>
    </div>
    
    <div class="decorative-line" style="border-color: ${borderColor}; margin-top: 16px;"></div>
  `;
};

const renderContinuedHeader = (data: NoticeToExplainFormData, logoSrc: string, borderColor: string) => {
  return `
    <div class="logo-container">
      ${logoSrc ? `
        <img src="${logoSrc}" alt="Company Logo">
      ` : `<div style="height: 4rem;"></div>`}
    </div>
    
    <div class="document-title">NOTICE TO EXPLAIN</div>
    <div class="document-subtitle">${data.place || '[Place]'}</div>
  `;
};

const renderExplanation = (content: string) => {
  return `
    <div style="margin-top: 25px; margin-bottom: 15px;">
      <div style="font-weight: bold; margin-bottom: 5px; font-size: 12px; color: #000;">I. Employee Explanation</div>
      <div style="border: 1px solid #ccc; min-height: 80px; padding: 8px; color: #000; font-size: 12px; white-space: normal; word-wrap: break-word;">
        ${content}
      </div>
    </div>
  `;
};

const renderHearing = (content: string) => {
  return `
    <div style="margin-top: 15px; margin-bottom: 15px;">
      <div style="font-weight: bold; margin-bottom: 5px; font-size: 12px; color: #000;">II. Hearing</div>
      <div style="border: 1px solid #ccc; min-height: 80px; padding: 8px; color: #000; font-size: 12px; white-space: normal; word-wrap: break-word;">
        ${content}
      </div>
    </div>
  `;
};

const renderDecision = (content: string) => {
  return `
    <div style="margin-top: 15px;">
      <div style="font-weight: bold; margin-bottom: 5px; font-size: 12px; color: #000;">III. Management Decision</div>
      <div style="border: 1px solid #ccc; min-height: 80px; padding: 8px; margin-bottom: 30px; color: #000; font-size: 12px; white-space: normal; word-wrap: break-word;">
        ${content}
      </div>
    </div>
  `;
};

const renderSignatures = (data: NoticeToExplainFormData, signatureSrc: string) => {
  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #000;">
      <tr>
        <td style="width: 50%; padding: 0 12px 0 0; text-align: center; vertical-align: bottom;">
          ${signatureSrc ? `
            <div style="height: 30px; display: flex; align-items: flex-end; justify-content: center;">
              <img src="${signatureSrc}" style="max-width: 150px; max-height: 50px; object-fit: contain;" alt="Signature">
            </div>
          ` : '<div style="height: 30px;"></div>'}
          <div>${data.reviewedBy || '[Name]'}</div>
          <div style="border-top: 1px solid #000; margin-top: 5px;"></div>
          <div style="font-weight: bold; text-align: center; margin-top: 5px;">Immediate Supervisor/Manager Signature</div>
        </td>
        
        <td style="width: 50%; padding: 0 0 0 12px; text-align: center; vertical-align: bottom;">
          <div style="height: 30px;"></div>
          <div>${data.employeeName || '[Employee Name]'}</div>
          <div style="border-top: 1px solid #000; margin-top: 5px;"></div>
          <div style="font-weight: bold; text-align: center; margin-top: 5px;">Employee Signature</div>
        </td>
      </tr>
    </table>
  `;
}; 