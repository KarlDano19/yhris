import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import { EmployeeCertificateFormData } from '@/types/document-generator/documents';
import { EmploymentAgreementFormData } from '@/types/document-generator/documents';

type FormDataType = EmployeeCertificateFormData | EmploymentAgreementFormData;

/**
 * Validates that all required fields in the form data are filled in
 */
export const validateRequiredFields = (formData: FormDataType): boolean => {
  const requiredFields = [
    { name: 'employeeName', label: 'Employee Name', value: formData.employeeName },
    { name: 'companyName', label: 'Company Name', value: formData.companyName },
    { name: 'position', label: 'Position', value: formData.position },
    { name: 'startDate', label: 'Start Date', value: formData.startDate },
    { name: 'dateOfIssuance', label: 'Date of Issuance', value: formData.dateOfIssuance },
    { name: 'signatoryName', label: 'Signatory Name', value: formData.signatoryName },
    { name: 'signatoryPosition', label: 'Signatory Position', value: formData.signatoryPosition }
  ];
  
  // Add documentTitle check only if it exists in the form data
  if ('documentTitle' in formData) {
    requiredFields.push({ name: 'documentTitle', label: 'Document Title', value: formData.documentTitle });
  }
  
  const missingFields = requiredFields.filter(field => !field.value || !field.value.trim());
  
  if (missingFields.length > 0) {
    // Highlight the missing fields by adding a red border
    missingFields.forEach(field => {
      const inputEl = document.querySelector(`input[name="${field.name}"]`) as HTMLInputElement;
      if (inputEl) {
        inputEl.classList.add('border-red-500');
        
        // Add event listener to remove the red border once the field is filled
        inputEl.addEventListener('input', function(this: HTMLInputElement) {
          if (this.value.trim()) {
            this.classList.remove('border-red-500');
          }
        });
      }
    });
    
    // Show a generic toast message
    toast.custom(() => <CustomToast message="Please fill in all required fields" type="error" />);
    return false;
  }

  if (!formData.signature) {
    // Find the signature container and add a red border
    const signatureContainer = document.querySelector('.border-dashed') as HTMLElement;
    if (signatureContainer) {
      signatureContainer.classList.add('border-red-500');
      
      // Remove the red border when the modal is opened
      const signatureButton = document.querySelector('[data-signature-button]');
      if (signatureButton) {
        signatureButton.addEventListener('click', function() {
          if (signatureContainer) {
            signatureContainer.classList.remove('border-red-500');
          }
        });
      }
    }
    
    toast.custom(() => <CustomToast message="Please add a signature to the document" type="error" />);
    return false;
  }
  
  return true;
};

/**
 * Prepares a hidden iframe for document operations (printing or PDF generation)
 */
export const prepareDocumentFrame = (
  elementId: string, 
  title: string, 
  formData: FormDataType, 
  toastId?: string
): { frame: HTMLIFrameElement } | null => {
  // Get the document preview content
  const documentElement = document.getElementById(elementId);
  if (!documentElement) {
    toast.custom(() => <CustomToast message="Document preview not found" type="error" />);
    return null;
  }
  
  // Create a hidden iframe for document operations
  const frame = document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '210mm'; // Set to A4 width
  frame.style.height = '297mm'; // Set to A4 height
  frame.style.border = '0';
  frame.style.opacity = '0';
  frame.style.pointerEvents = 'none';
  
  document.body.appendChild(frame);
  
  // Get the document for the iframe
  const frameDoc = frame.contentWindow?.document;
  if (!frameDoc) {
    document.body.removeChild(frame);
    if (toastId) {
      toast.custom(() => <CustomToast message="Could not create document frame" type="error" />);
    } else {
      toast.custom(() => <CustomToast message="Could not create document frame" type="error" />);
    }
    return null;
  }
  
  // Clone the document element to modify it without affecting the original
  const clone = documentElement.cloneNode(true) as HTMLElement;
  
  // Remove the preview header if it exists
  const previewHeader = clone.querySelector('.preview-header');
  if (previewHeader) {
    previewHeader.remove();
  }
  
  // Remove visual effects that shouldn't appear in document but keep structure
  const effectElements = clone.querySelectorAll('.print-hide');
  effectElements.forEach(el => el.remove());
  
  // Create a minimal HTML structure - styling will be added by the specific print functions
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - ${formData.employeeName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          .print-container {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${clone.innerHTML}
        </div>
      </body>
    </html>
  `);
  
  frameDoc.close();
  
  return { frame };
}; 