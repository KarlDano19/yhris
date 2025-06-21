import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import { validateRequiredFields, prepareDocumentFrame } from '../../helper/documents';

import { EmployeeCertificateFormData, PrintOptions } from '@/types/document-generator/documents';

/**
 * Prints an employee certificate using a hidden iframe approach
 */
export const printEmployeeCertificate = (formData: EmployeeCertificateFormData, options: PrintOptions): void => {
  // Validate required fields first
  if (!validateRequiredFields(formData)) return;
  
  const printToastId = toast.custom(() => <CustomToast message="Preparing certificate for printing..." type="info" />);
  
  // Prepare the document frame
  const documentFrame = prepareDocumentFrame(options.elementId, options.title, formData, printToastId);
  if (!documentFrame) {
    toast.custom(() => <CustomToast message="Failed to prepare certificate for printing" type="error" />);
    return;
  }
  
  const { frame } = documentFrame;
  
  // Wait for content to load before printing
  frame.onload = () => {
    try {
      // Wait a moment for any images to load fully
      setTimeout(() => {
        toast.custom(() => <CustomToast message="Print dialog opening..." type="info" />);
        
        // Get the border color or use default
        const borderColor = formData.borderColor || '#FFC107';
        
        // Add extra styling for print
        const style = frame.contentDocument?.createElement('style');
        if (style) {
          style.textContent = `
            @page {
              size: A4;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: white !important;
            }
            .print-container {
              width: 100% !important;
              height: 100% !important;
              max-width: none !important;
              padding: 0 !important;
              margin: 0 !important;
              overflow: visible !important;
            }
            .certificate-content {
              width: 100% !important;
              height: 100% !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            .letterhead-background {
              width: 100% !important;
              height: 100% !important;
              min-height: 100vh !important;
            }
            .letterhead-image-container {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
              z-index: 0 !important;
            }
            .letterhead-image-container img {
              width: 100% !important;
              height: 100% !important;
              object-fit: contain !important;
            }
            /* Critical: Preserve the top spacing for letterhead */
            .mb-44, .mb-32, .mb-24 {
              display: block !important;
              margin-bottom: 3rem !important;
              height: 11rem !important;
            }
            /* Ensure the border styling matches the preview exactly */
            .certificate-border {
              width: 100% !important;
              border-bottom: 1px solid ${borderColor} !important;
              margin: 2.5rem 0 !important;
              display: block !important;
              height: 1px !important;
              background-color: ${borderColor} !important;
              border-width: 1px !important;
            }
            /* Make sure the top border has proper spacing */
            .mb-10 {
              margin-bottom: 2.5rem !important;
            }
            /* Fix spacing for bottom border */
            .mt-10 {  
              margin-top: 2.5rem !important;
            }
            /* Fix content padding to match preview */
            .certificate-inner-content {
              padding: 2rem !important;
              position: relative !important;
              z-index: 10 !important;
            }
            /* Fix the signature spacing to match preview exactly */
            .certificate-signature {
              margin-top: 3.5rem !important;
              padding-top: 1.5rem !important;
              position: relative !important;      
            }
            /* Adjust signature image positioning */
            .certificate-signature div {
              margin-bottom: -2rem !important;
            }
            .certificate-signature img {
              height: 48px !important;
              display: block !important;
              margin-bottom: 1rem !important;
            }
            .certificate-signature-name {
              margin-top: 0.75rem !important;
              font-weight: 600 !important;
              margin-bottom: 0.25rem !important;
            }
            .certificate-signature-position,
            .certificate-signature-company {
              margin: 0.125rem 0 !important;
            }
            /* Fix title spacing */
            .certificate-title {
              margin-bottom: 2rem !important;
              font-size: 1.5rem !important;
              font-weight: bold !important;
              letter-spacing: 0.05rem !important;
              color: #000 !important;
              text-align: center !important;
            }
            /* Fix document body spacing */
            .certificate-body {
              margin-bottom: 3.5rem !important;
            }
            /* Ensure paragraph spacing in the document body */
            .space-y-6 > * + * {
              margin-top: 1.5rem !important;
            }
            /* Special fix for -mb-3 class */
            .-mb-3 {
              margin-bottom: -0.75rem !important;
              display: block !important;
            }
            /* Hide pagination controls */
            .print-hide {
              display: none !important;
            }
            /* Fix for bold text not showing correctly in print */
            .font-semibold, .font-bold {
              font-weight: 600 !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
            /* Ensure strong elements are bold */
            strong, b {
              font-weight: 700 !important;
            }
            /* Ensure all text is properly rendered */
            * {
              text-rendering: optimizeLegibility !important;
              -webkit-font-feature-settings: "kern" !important;
              font-feature-settings: "kern" !important;
              font-kerning: normal !important;
            }
            /* Specifically target the employee name and other bold text in the certificate */
            .certificate-body span.font-semibold {
              font-weight: 700 !important;
              color: #000 !important;
            }
            /* Handle letterhead images */
            ${formData.letterheadImage ? `
              .letterhead-image-container img {
                content: url(${URL.createObjectURL(formData.letterheadImage)});
              }
            ` : ''}
            /* Handle signature images */
            ${formData.signature ? `
              .certificate-signature img {
                content: url(${typeof formData.signature === 'string' 
                  ? formData.signature 
                  : URL.createObjectURL(formData.signature as File)});
              }
            ` : ''}
          `;
          frame.contentDocument?.head.appendChild(style);
        }
        
        // Give a bit more time for styles to apply
        setTimeout(() => {
          // Focus the frame and print
          frame.contentWindow?.focus();
          frame.contentWindow?.print();
          
          // Remove the iframe after printing completes or is cancelled
          setTimeout(() => {
            document.body.removeChild(frame);
            toast.custom(() => <CustomToast message="Your document was saved successfully and is ready for use" type="success" />);
          }, 1000);
        }, 200);
      }, 800); // Longer delay to ensure images load properly
    } catch (error) {
      console.error('Print error:', error);
      document.body.removeChild(frame);
      toast.custom(() => <CustomToast message="There was an error printing. Please try again" type="error" />);
    }
  };
}; 