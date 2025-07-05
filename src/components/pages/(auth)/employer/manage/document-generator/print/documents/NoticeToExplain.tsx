import { toast } from 'react-hot-toast';

import { saveAs } from 'file-saver';

import CustomToast from '@/components/CustomToast';

import { formatDate } from '@/helpers/date';

import { NoticeToExplainFormData, PrintOptions } from '@/types/document-generator/documents';

/**
 * Print the Notice to Explain document
 */
export const printNoticeToExplain = (data: NoticeToExplainFormData, options: PrintOptions, saveOnly: boolean = false): Promise<Blob | null> => {
  const { title, fileName = 'notice-to-explain' } = options;
  
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
      
      // Generate HTML content
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

export const generateNoticeToExplainHTML = (data: NoticeToExplainFormData): string => {
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

  // Get signature image
  let signatureSrc = '';
  if (typeof data.signature === 'string') {
    signatureSrc = data.signature;
  } else if (data.signature instanceof File) {
    signatureSrc = URL.createObjectURL(data.signature);
  }

  // Border color with fallback to default amber
  const borderColor = data.borderColor || '#FFC107';

  // Generate HTML for the document
  const documentHTML = `
    <div class="document-container">
      <!-- Header Section -->
      <div class="section">
        <div class="logo-container">
          ${logoSrc ? `<img src="${logoSrc}" alt="Company Logo">` : `<div class="space"></div>`}
        </div>
        
        <div class="document-title">NOTICE TO EXPLAIN</div>
        <div class="document-subtitle">${data.incidentPlace || '[Place of Incident]'}</div>
        
        <div class="decorative-line" style="border-color: ${borderColor}"></div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #000; margin-bottom: 10px;">
          <tr>
            <td style="width: 50%; padding: 0;">
              <span class="detail-label">Name of Employee :</span> ${data.employeeName || '[Employee Name]'}
            </td>
            <td style="width: 50%; padding: 0;">
              <span class="detail-label">Date Issued:</span> ${formattedDate || '[Date Issued]'}
            </td>
          </tr>
          <tr>
            <td style="width: 50%; padding: 0;">
              <span class="detail-label">Position :</span> ${data.position || '[Position]'}
            </td>
            <td style="width: 50%; padding: 0;">
              <span class="detail-label">Company Name:</span> ${data.companyName || '[Company Name]'}
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
      </div>

      <!-- Brief Background Section -->
      <div class="section">
        <div class="background-section">
          <div class="detail-label">Brief background :</div>
          <div style="white-space: normal; word-wrap: break-word;">${data.briefBackground || '[Brief description of the incident...]'}</div>
        </div>
        
        <div class="signatures-grid">
          <div class="signature-block">
            <div class="detail-label">Prepared by:</div>
            <div class="signature-container">
              ${signatureSrc ? `
                <div class="signature-image-container">
                  <img src="${signatureSrc}" class="signature-image" alt="Signature">
                </div>
              ` : ''}
              <div>${data.preparedBy || '\u00A0'}</div>
            </div>
            <div class="signature-line"></div>
            <div style="font-weight: bold;">HR Representative</div>
          </div>
          
          <div class="signature-block">
            <div class="detail-label">Reviewed by:</div>
            <div>${data.reviewedBy || '\u00A0'}</div>
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
      </div>

      <!-- Employee Explanation Section -->
      <div class="section">
        <div style="margin-top: 25px; margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px; font-size: 12px; color: #000;">I. Employee Explanation</div>
          <div style="border: 1px solid #ccc; min-height: 80px; padding: 8px; color: #000; font-size: 12px; white-space: normal; word-wrap: break-word;">
            ${data.employeeExplanation || ''}
          </div>
        </div>
      </div>

      <!-- Hearing Section -->
      <div class="section">
        <div style="margin-top: 15px; margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px; font-size: 12px; color: #000;">II. Hearing</div>
          <div style="border: 1px solid #ccc; min-height: 80px; padding: 8px; color: #000; font-size: 12px; white-space: normal; word-wrap: break-word;">
            ${data.hearingNotes || ''}
          </div>
        </div>
      </div>

      <!-- Management Decision Section -->
      <div class="section">
        <div style="margin-top: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px; font-size: 12px; color: #000;">III. Management Decision</div>
          <div style="border: 1px solid #ccc; min-height: 80px; padding: 8px; margin-bottom: 30px; color: #000; font-size: 12px; white-space: normal; word-wrap: break-word;">
            ${data.managementDecision || ''}
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div class="section">
        <table class="footer-table">
          <tr>
            <td class="footer-cell footer-cell-left">
              <div>${data.reviewedBy || '\u00A0'}</div>
              <div class="footer-line"></div>
              <div class="footer-title">Immediate Supervisor/Manager Signature</div>
            </td>
            
            <td class="footer-cell footer-cell-right">
              <div>${data.employeeName || '[Employee Name]'}</div>
              <div class="footer-line"></div>
              <div class="footer-title">Employee Signature</div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `;

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
          margin: 0.3cm 1cm 0cm 1cm; /* top right bottom left */
        }
        
        .document-container {
          box-sizing: border-box;
          width: 100%;
          padding: 0;
          position: relative;
        }
        
        .section {
          margin-bottom: 1rem;
        }
        
        .logo-container {
          position: relative;
          width: 100%;
          height: 7rem;
          margin-bottom: 0.5rem;
        }
        
        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .space {
          height: 100%;
        }
        
        .document-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 2px;
          text-transform: uppercase;
          color: #000;
        }
        
        .document-subtitle {
          text-align: center;
          font-size: 12px;
          margin-bottom: 8px;
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

        /* Signature line styles */
        .signature-line {
          border-top: 1px solid #000;
          margin-bottom: 5px;
        }

        .signature-image-container {
          position: absolute;
          width: 100%;
          right: 10px;
          top: -36px;
          z-index: 100;
          text-align: center;
        }

        .signature-image {
          max-width: 150px;
          height: 100px;
          object-fit: contain;
          margin: 0 auto;
        }

        /* Footer table styles */
        .footer-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          color: #000;
        }
        
        .footer-cell {
          width: 50%;
          padding: 0 12px;
          text-align: center;
          vertical-align: bottom;
        }
        
        .footer-cell-left {
          padding-right: 12px;
          padding-left: 0;
        }

        .footer-line {
          border-bottom: 1px solid #000;
        }

        .footer-cell-right {
          padding-left: 12px;
          padding-right: 0;
        }
        
        .footer-title {
          font-weight: bold;
          text-align: center;
          margin-top: 5px;
        }
        
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
        }

        .signature-container {
          position: relative;
          min-height: 20px;
        }
      </style>
    </head>
    <body>
      ${documentHTML}
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