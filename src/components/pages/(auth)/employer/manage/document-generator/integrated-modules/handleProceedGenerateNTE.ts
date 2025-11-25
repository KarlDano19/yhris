import React from 'react';

import type { NoticeToExplainFormData } from '@/types/document-generator/documents';

// Helper function to convert base64 data URL to File
async function convertDataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: 'image/png' });
}

export async function handleProceedUtil({
  documentType,
  employeeId,
  currentData,
  uploadAttachment,
  router,
  toast,
  CustomToast,
  updateEmployeeIssue
}: {
  documentType: string;
  employeeId: string;
  currentData: NoticeToExplainFormData;
  uploadAttachment: (data: any, callbacks: any) => void;
  router: any;
  toast: any;
  CustomToast: any;
  updateEmployeeIssue?: boolean;
}) {
  if (documentType === 'notice-to-explain' && employeeId) {
    try {
      // Prepare upload data with form fields
      const uploadData: any = {
        employee_issue_id: parseInt(employeeId),
        // Don't include nte_attachment - let backend generate it
      };
      
      
      if (updateEmployeeIssue) {
        // Add form fields
        uploadData.border_color = currentData.borderColor;
        uploadData.company_name = currentData.companyName;
        uploadData.date_issued = currentData.dateOfIssuance;
        uploadData.brief_background = currentData.briefBackground;
        uploadData.prepared_by = currentData.preparedBy;
        uploadData.reviewed_by = currentData.reviewedBy;
        
        // Handle logo file conversion
        if (currentData.logoImage) {
          // Custom uploaded logo (File object)
          if (currentData.logoImage instanceof File) {
            uploadData.nte_logo = currentData.logoImage;
          } else if (typeof currentData.logoImage === 'string' && (currentData.logoImage as string).startsWith('data:')) {
            // Drawn logo (base64 data URL)
            try {
              const logoFile = await convertDataUrlToFile(currentData.logoImage as string, 'logo.png');
              uploadData.nte_logo = logoFile;
            } catch (error) {
              console.error('Error converting logo base64 to File:', error);
            }
          }
        } else if (currentData.sampleLogoPath) {
          // Sample logo selected - convert sample logo path to File
          try {
            const response = await fetch(currentData.sampleLogoPath);
            const blob = await response.blob();
            const logoFile = new File([blob], 'sample-logo.png', { type: 'image/png' });
            uploadData.nte_logo = logoFile;
          } catch (error) {
            console.error('Error converting sample logo to File:', error);
          }
        }
        
        // Handle signature file conversion
        if (currentData.signature) {
          if (currentData.signature instanceof File) {
            uploadData.hr_signature = currentData.signature;
          } else if (typeof currentData.signature === 'string' && (currentData.signature as string).startsWith('data:')) {
            try {
              const signatureFile = await convertDataUrlToFile(currentData.signature as string, 'signature.png');
              uploadData.hr_signature = signatureFile;
            } catch (error) {
              console.error('Error converting signature base64 to File:', error);
            }
          }
        }
      }

      // Call backend to generate PDF and update employee issue
      uploadAttachment(uploadData, {
                  onSuccess: (): void => {
          const message = updateEmployeeIssue 
            ? "PDF document created and employee issue updated. Ready to send."
            : "PDF document created and uploaded. Ready to send.";
          toast.custom(() => React.createElement(CustomToast, { message, type: "success" }), { duration: 3000 });
                    router.push(`/manage/address-employee-issue?openNteModal=true&employeeId=${employeeId}`);
                  },
                  onError: (error: any): void => {
                    console.error('Upload error:', error);
                    toast.custom(() => React.createElement(CustomToast, { message: "Error uploading document. Please try again.", type: "error" }), { duration: 3000 });
                  }
      });
    } catch (error) {
      console.error('Error setting up PDF generation:', error);
      toast.custom(() => React.createElement(CustomToast, { message: "Error generating PDF. Please try again.", type: "error" }), { duration: 3000 });
    }
  }
}